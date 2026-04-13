import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 space-y-10">
      <div className="space-y-4 max-w-2xl">
        <p className="text-sm uppercase tracking-widest text-primary">ALGOCRACY · Phase 1</p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Transparent, AI-assisted access to Indian law and government knowledge.
        </h1>
        <p className="text-muted-foreground text-lg">
          This stack wires Next.js to a FastAPI orchestrator with Qdrant, Neo4j, and LangGraph.
          Configure API keys to enable full LLM responses; otherwise the API returns a clear demo
          message.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button asChild>
            <Link href="/chat">Open governance chat</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/transparency">View transparency scaffold</Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Legal RAG",
            body: "Qdrant-backed retrieval with OpenAI embeddings when keys are present.",
          },
          {
            title: "Knowledge graph",
            body: "Neo4j repository for Acts and cross-references — seeded with a demo node.",
          },
          {
            title: "Mock Aadhaar auth",
            body: "NextAuth credentials provider exchanging PIN 1234 for backend JWT tokens.",
          },
        ].map((c) => (
          <Card key={c.title}>
            <CardHeader>
              <CardTitle className="text-base">{c.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{c.body}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
