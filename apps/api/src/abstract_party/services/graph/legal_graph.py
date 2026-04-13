from typing import Annotated, TypedDict

from langchain_core.messages import AIMessage, BaseMessage, HumanMessage, SystemMessage
from langgraph.graph import END, START, StateGraph
from langgraph.graph.message import add_messages

from abstract_party.config import get_settings
from abstract_party.services.kg_service import KnowledgeGraphService
from abstract_party.services.llm_factory import get_chat_model
from abstract_party.services.rag_service import RagService


class GraphState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]
    retrieved: list[str]
    kg_context: str
    citations: list[str]


def _last_user_text(messages: list[BaseMessage]) -> str:
    for m in reversed(messages):
        if isinstance(m, HumanMessage):
            return str(m.content)
    return ""


async def node_retrieve(state: GraphState) -> dict:
    rag = RagService()
    query = _last_user_text(state["messages"])
    texts: list[str] = []
    if query:
        try:
            vec = await rag.embed_query(query)
            if vec:
                settings = get_settings()
                await rag.ensure_collection(settings.embedding_dimensions)
                hits = await rag.search(vec)
                texts = [h.text for h in hits if h.text]
        except Exception:
            texts = []
    return {"retrieved": texts}


async def node_kg(_state: GraphState) -> dict:
    kg = KnowledgeGraphService()
    ctx = ""
    try:
        await kg.ensure_seed_schema()
        acts = await kg.sample_acts(limit=3)
        lines = [f"- {a['title']} ({a['id']})" for a in acts if a.get("title")]
        ctx = "Related acts (Knowledge Graph):\n" + "\n".join(lines) if lines else ""
    except Exception:
        ctx = ""
    finally:
        try:
            await kg.close()
        except Exception:
            pass
    return {"kg_context": ctx}


async def node_generate(state: GraphState) -> dict:
    retrieved = state.get("retrieved") or []
    kg_context = state.get("kg_context") or ""
    citations: list[str] = []
    if retrieved:
        citations.extend(retrieved[:3])
    try:
        llm = get_chat_model()
    except RuntimeError:
        # Graceful degradation without API keys in local dev
        text = (
            "[Demo mode: configure OPENAI_API_KEY or GOOGLE_API_KEY] "
            + _last_user_text(state["messages"])
        )
        return {
            "messages": [AIMessage(content=text)],
            "citations": citations,
        }
    sys = SystemMessage(
        content=(
            "You are ALGOCRACY, an assistant for Indian law and governance. "
            "Use provided context and cite sources briefly when relevant. "
            "If context is empty, say you need corpus data (Phase 1 scaffold)."
        )
    )
    ctx_parts = []
    if retrieved:
        ctx_parts.append("Retrieved excerpts:\n" + "\n".join(retrieved[:5]))
    if kg_context:
        ctx_parts.append(kg_context)
    ctx_msg = "\n\n".join(ctx_parts) if ctx_parts else "No retrieval context."
    msgs: list[BaseMessage] = [sys, HumanMessage(content=ctx_msg)] + list(state["messages"])
    response = await llm.ainvoke(msgs)
    content = response.content if hasattr(response, "content") else str(response)
    return {"messages": [AIMessage(content=str(content))], "citations": citations}


def build_legal_graph():
    g = StateGraph(GraphState)
    g.add_node("retrieve", node_retrieve)
    g.add_node("kg", node_kg)
    g.add_node("generate", node_generate)
    g.add_edge(START, "retrieve")
    g.add_edge("retrieve", "kg")
    g.add_edge("kg", "generate")
    g.add_edge("generate", END)
    return g.compile()
