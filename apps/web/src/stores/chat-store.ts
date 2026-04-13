import { create } from "zustand";

import type { ChatMessageDto } from "@abstract-party/shared-types";

type ChatState = {
  messages: ChatMessageDto[];
  conversationId: string | null;
  pending: boolean;
  error: string | null;
  setConversationId: (id: string | null) => void;
  setPending: (v: boolean) => void;
  setError: (e: string | null) => void;
  pushMessage: (m: ChatMessageDto) => void;
  replaceMessages: (m: ChatMessageDto[]) => void;
  reset: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  conversationId: null,
  pending: false,
  error: null,
  setConversationId: (id) => set({ conversationId: id }),
  setPending: (v) => set({ pending: v }),
  setError: (e) => set({ error: e }),
  pushMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),
  replaceMessages: (m) => set({ messages: m }),
  reset: () => set({ messages: [], conversationId: null, pending: false, error: null }),
}));
