/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { type ConversationListItem, type MessageListItem, createCheckoutSession, fetchConversations, fetchMessages, createConversation } from "./api";
import { getSocket } from "./sockets";
import { ConversationList } from "./components/ConversationList";
import { MessageList } from "./components/MessageList";
import { MessageInput } from "./components/MessageInput";

interface TokenPayload {
  sub: string;
  email?: string;
}

function getCurrentUserIdFromToken(): string | undefined {
  const token = localStorage.getItem("access_token");
  if (!token) return undefined;

  if (token === "dev-token" || token === "Bearer dev-token") {
    return "dev-user-id";
  }

  try {
    const raw = token.startsWith("Bearer ") ? token.slice(7) : token;
    const decoded = jwtDecode<TokenPayload>(raw);
    return decoded.sub || undefined;
  } catch (e) {
    console.error("Invalid token", e);
    return undefined;
  }
}

function App() {
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [activeId, setActiveId] = useState<string | undefined>();
  const [messages, setMessages] = useState<MessageListItem[]>([]);
  const [currentUserId] = useState<string | undefined>(() => getCurrentUserIdFromToken());

  useEffect(() => {
    fetchConversations().then(setConversations).catch(console.error);
  }, []);

  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }

    fetchMessages(activeId).then(setMessages).catch(console.error);

    const socket = getSocket();
    socket.emit("conversation:join", { conversationId: activeId });

    const handler = (msg: any) => {
      if (msg.conversationId !== activeId) return;

      setMessages((prev) => [
        ...prev,
        {
          id: msg.id,
          conversationId: msg.conversationId,
          senderId: msg.senderId,
          content: msg.content,
          createdAt: msg.createdAt,
        },
      ]);
    };

    socket.on("message:new", handler);

    return () => {
      socket.off("message:new", handler);
    };
  }, [activeId]);

  const handleSend = async (content: string) => {
    if (!activeId || !currentUserId) return;

    const tempMessage: MessageListItem = {
      id: `temp-${Date.now()}`,
      conversationId: activeId,
      senderId: currentUserId,
      content,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);

    const socket = getSocket();
    socket.emit("message:send", { conversationId: activeId, content });
  };

  const handlePay = async () => {
    try {
      const session = await createCheckoutSession("Abonnement Premium", 990);
      window.location.href = session.url;
    } catch (e: any) {
      console.error("Erreur paiement", e?.response?.data || e);
    }
  };

  const handleCreateConversation = async () => {
    try {
      const conv = await createConversation("Nouvelle conversation");
      setConversations((prev) => [...prev, conv]);
      setActiveId(conv.id);
    } catch (e: any) {
      console.error("Erreur création conversation", e?.response?.data || e);
    }
  };

  const activeConversationTitle = activeId && conversations.find((c) => c.id === activeId)?.title;

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        backgroundColor: "#020617",
        color: "#e5e7eb",
      }}
    >
      {/* Colonne de gauche */}
      <div
        style={{
          width: "280px",
          borderRight: "1px solid #1f2933",
          backgroundColor: "#020617",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid #1f2933",
            fontWeight: 600,
            fontSize: "14px",
            color: "#e5e7eb",
          }}
        >
          Conversations
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
          }}
        >
          <ConversationList conversations={conversations} activeId={activeId} onSelect={setActiveId} />
        </div>

        <div
          style={{
            padding: "8px 12px",
            borderTop: "1px solid #1f2933",
          }}
        >
          <button
            onClick={handleCreateConversation}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #334155",
              backgroundColor: "#020617",
              color: "#e5e7eb",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            + Nouvelle conversation
          </button>
        </div>
      </div>

      {/* Colonne droite : chat */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#020617",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "8px 16px",
            borderBottom: "1px solid #1f2933",
            minHeight: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#020617",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontWeight: 600,
                fontSize: "14px",
                color: "#f9fafb",
              }}
            >
              {activeConversationTitle || "Aucune conversation sélectionnée"}
            </span>
            <span
              style={{
                fontSize: "12px",
                color: "#6b7280",
              }}
            >
              {activeId ? "Vous pouvez envoyer des messages." : "Sélectionnez ou créez une conversation pour commencer."}
            </span>
          </div>
          <button
            onClick={handlePay}
            style={{
              padding: "6px 12px",
              borderRadius: "9999px",
              border: "none",
              backgroundColor: "#2563eb",
              color: "#f9fafb",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Payer 9,90 €
          </button>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "12px 16px",
            backgroundColor: "#020617",
          }}
        >
          <MessageList messages={messages} currentUserId={currentUserId} />
        </div>

        {/* Input */}
        <div
          style={{
            borderTop: "1px solid #1f2933",
            backgroundColor: "#020617",
          }}
        >
          <MessageInput disabled={!activeId} onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}

export default App;
