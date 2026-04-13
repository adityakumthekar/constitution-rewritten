"use client";

import { useSession } from "next-auth/react";
import { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { chatRequest } from "@/lib/api";
import { useChatStore } from "@/stores/chat-store";

export default function ChatPage() {
  const { data: session, status } = useSession();
  const {
    messages,
    conversationId,
    pending,
    error,
    setPending,
    setError,
    pushMessage,
    setConversationId,
    replaceMessages,
  } = useChatStore();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const text = String(data.get("message") ?? "").trim();
    if (!text) return;
    form.reset();
    const nextMessages = [...messages, { role: "user" as const, content: text }];
    replaceMessages(nextMessages);
    setPending(true);
    setError(null);
    try {
      const res = await chatRequest(
        {
          messages: nextMessages,
          conversation_id: conversationId,
        },
        session?.accessToken
      );
      pushMessage({ role: "assistant", content: res.reply });
      if (res.conversation_id) {
        setConversationId(res.conversation_id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Governance chat</h1>
        <p className="text-sm text-muted-foreground">
          {status === "authenticated"
            ? "Signed in — conversations persist to Postgres via the API."
            : "Anonymous mode — sign in to persist history."}
        </p>
      </div>
      <Card className="min-h-[420px] flex flex-col">
        <CardHeader>
          <CardTitle className="text-base">Session</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4">
          <ScrollArea className="h-72 rounded-md border border-border p-3">
            <div className="space-y-3 pr-3">
              {messages.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Ask about Indian law, RTI, or the Constitution. Without API keys, you will see a
                  demo response from the backend.
                </p>
              ) : null}
              {messages.map((m, i) => (
                <div
                  key={`${i}-${m.role}`}
                  className={
                    m.role === "user"
                      ? "ml-auto max-w-[85%] rounded-lg bg-primary/15 px-3 py-2 text-sm"
                      : "mr-auto max-w-[85%] rounded-lg bg-muted px-3 py-2 text-sm"
                  }
                >
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    {m.role}
                  </p>
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <form onSubmit={onSubmit} className="flex gap-2">
            <Input name="message" placeholder="Ask a question…" disabled={pending} />
            <Button type="submit" disabled={pending}>
              {pending ? "Sending…" : "Send"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
