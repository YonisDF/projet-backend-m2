import React from "react";
import type { ConversationListItem } from "../api.js";

interface Props {
  conversations: ConversationListItem[];
  activeId?: string;
  onSelect: (id: string) => void;
}

export const ConversationList: React.FC<Props> = ({ conversations, activeId, onSelect }) => {
  return (
    <div
      style={{
        width: "280px",
        padding: "8px",
        overflowY: "auto",
        backgroundColor: "#020617",
        color: "#e5e7eb",
      }}
    >
      <h3
        style={{
          marginBottom: "12px",
          fontSize: "14px",
          fontWeight: 700,
          color: "#f8fafc",
        }}
      >
        Conversations
      </h3>

      {conversations.length === 0 ? (
        <div
          style={{
            fontSize: "13px",
            color: "#94a3b8",
            padding: "8px 4px",
          }}
        >
          Aucune conversation pour le moment.
        </div>
      ) : (
        conversations.map((c) => {
          const active = c.id === activeId;

          return (
            <div
              key={c.id}
              onClick={() => onSelect(c.id)}
              style={{
                padding: "10px 12px",
                marginBottom: "6px",
                cursor: "pointer",
                backgroundColor: active ? "#1e293b" : "transparent",
                border: active ? "1px solid #334155" : "1px solid transparent",
                borderRadius: "10px",
                transition: "background-color 0.15s ease, border-color 0.15s ease",
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  color: active ? "#f8fafc" : "#e2e8f0",
                  marginBottom: c.lastMessage ? "4px" : 0,
                }}
              >
                {c.title || "(sans titre)"}
              </div>

              {c.lastMessage && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "#94a3b8",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {c.lastMessage.content}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};
