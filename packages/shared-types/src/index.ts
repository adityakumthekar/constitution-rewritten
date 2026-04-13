/** Shared DTOs between web and API — expand as OpenAPI stabilizes. */

export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessageDto {
  role: ChatRole;
  content: string;
}

export interface ChatRequestDto {
  messages: ChatMessageDto[];
  conversation_id?: string | null;
}

export interface ChatResponseDto {
  reply: string;
  conversation_id: string | null;
  citations: string[];
}
