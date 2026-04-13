from uuid import UUID

from fastapi import APIRouter, Request
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from sqlalchemy import select

from abstract_party.api.deps import CurrentUserOptional, DbSession
from abstract_party.api.schemas import ChatRequest, ChatResponse
from abstract_party.core.limiter import limiter
from abstract_party.db.models import Conversation, Message
from abstract_party.services.graph.legal_graph import build_legal_graph

router = APIRouter(prefix="/v1", tags=["chat"])


def _to_lc_messages(messages: list) -> list:
    out = []
    for m in messages:
        if m.role == "user":
            out.append(HumanMessage(content=m.content))
        elif m.role == "assistant":
            out.append(AIMessage(content=m.content))
        else:
            out.append(SystemMessage(content=m.content))
    return out


def _last_user_message(request: ChatRequest):
    for m in reversed(request.messages):
        if m.role == "user":
            return m
    return None


@router.post("/chat", response_model=ChatResponse)
@limiter.limit("60/minute")
async def chat(
    request: Request,
    body: ChatRequest,
    db: DbSession,
    user: CurrentUserOptional,
) -> ChatResponse:
    _ = request
    graph = build_legal_graph()
    lc_messages = _to_lc_messages(body.messages)
    state = await graph.ainvoke(
        {
            "messages": lc_messages,
            "retrieved": [],
            "kg_context": "",
            "citations": [],
        }
    )
    last = state["messages"][-1]
    reply_text = last.content if hasattr(last, "content") else str(last)
    citations = list(state.get("citations") or [])

    conv_id: UUID | None = body.conversation_id
    last_user = _last_user_message(body)

    if user is not None and last_user is not None:
        if conv_id is None:
            conv = Conversation(user_id=user.id, title=None)
            db.add(conv)
            await db.flush()
            conv_id = conv.id
        else:
            res = await db.execute(
                select(Conversation).where(
                    Conversation.id == conv_id,
                    Conversation.user_id == user.id,
                )
            )
            if res.scalar_one_or_none() is None:
                conv_id = None
        if conv_id is not None:
            db.add(
                Message(
                    conversation_id=conv_id,
                    role=last_user.role,
                    content=last_user.content,
                )
            )
            db.add(
                Message(
                    conversation_id=conv_id,
                    role="assistant",
                    content=str(reply_text),
                )
            )
            await db.commit()

    return ChatResponse(
        reply=str(reply_text),
        conversation_id=conv_id if user else None,
        citations=citations,
    )
