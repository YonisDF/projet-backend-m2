import React, { useState } from "react";

interface Props {
  disabled?: boolean;
  onSend: (content: string) => void;
}

export const MessageInput: React.FC<Props> = ({ disabled, onSend }) => {
  const [value, setValue] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const canSend = !disabled && value.trim().length > 0;

  return (
    <form
      onSubmit={submit}
      style={{
        display: "flex",
        padding: "10px 16px",
        borderTop: "1px solid #1f2933",
        backgroundColor: "#020617",
        gap: "8px",
      }}
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Écrire un message…"
        style={{
          flex: 1,
          padding: "9px 10px",
          borderRadius: "9999px",
          border: "1px solid #1f2937",
          backgroundColor: "#020617",
          color: "#e5e7eb",
          fontSize: "14px",
          outline: "none",
        }}
      />
      <button
        type="submit"
        disabled={!canSend}
        style={{
          padding: "8px 16px",
          borderRadius: "9999px",
          border: "none",
          backgroundColor: canSend ? "#2563eb" : "#1f2937",
          color: canSend ? "#f9fafb" : "#6b7280",
          fontSize: "14px",
          cursor: canSend ? "pointer" : "default",
          transition: "background-color 0.15s ease, color 0.15s ease",
        }}
      >
        Envoyer
      </button>
    </form>
  );
};
