import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ConversationListItem {
  id: string;
  type: "direct" | "group";
  title: string | null;
  updatedAt: string;
  lastMessage?: {
    id: string;
    senderId: string;
    content: string;
    createdAt: string;
  };
}

export interface MessageListItem {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export async function fetchConversations() {
  const res = await api.get<ConversationListItem[]>("/conversations");
  return res.data;
}

export async function fetchMessages(conversationId: string) {
  const res = await api.get<MessageListItem[]>(`/conversations/${conversationId}/messages?limit=50`);
  return res.data;
}

export async function sendMessageHttp(conversationId: string, content: string) {
  const res = await api.post(`/messages/${conversationId}`, { content });
  return res.data;
}

export async function createCheckoutSession(productName: string, amount: number) {
  const res = await api.post("/payments/checkout-session", {
    productName,
    amount,
  });

  return res.data as {
    paymentId: string;
    sessionId: string;
    url: string;
  };
}

export async function createConversation(title: string): Promise<ConversationListItem> {
  const res = await api.post("/conversations", { title });
  return res.data as ConversationListItem;
}
