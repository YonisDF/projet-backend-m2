import React, { useEffect, useRef } from "react";
import type { MessageListItem } from "../api";

interface Props {
  messages: MessageListItem[];
  currentUserId?: string;
}

export const MessageList: React.FC<Props> = ({ messages, currentUserId }) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      style={{
        flex: 1,
        padding: "16px",
        overflowY: "auto",
        backgroundColor: "#020617",
      }}
    >
      {messages.length === 0 ? (
        <div
          style={{
            color: "#94a3b8",
            fontSize: "14px",
            textAlign: "center",
            marginTop: "24px",
          }}
        >
          Aucun message pour l’instant.
        </div>
      ) : (
        messages.map((m) => {
          const mine = m.senderId === currentUserId;

          return (
            <div
              key={m.id}
              style={{
                display: "flex",
                justifyContent: mine ? "flex-end" : "flex-start",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  maxWidth: "68%",
                  padding: "10px 12px",
                  borderRadius: "14px",
                  backgroundColor: mine ? "#2563eb" : "#111827",
                  color: "#f8fafc",
                  fontSize: "14px",
                  lineHeight: 1.45,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
                  border: mine ? "1px solid #3b82f6" : "1px solid #1f2937",
                  wordBreak: "break-word",
                }}
              >
                <div>{m.content}</div>
                <div
                  style={{
                    marginTop: "6px",
                    fontSize: "11px",
                    color: mine ? "#dbeafe" : "#94a3b8",
                    textAlign: "right",
                  }}
                >
                  {new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })
      )}

      <div ref={bottomRef} />
    </div>
  );
};
