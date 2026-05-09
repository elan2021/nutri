"use client";

import { useEffect } from "react";

export default function ErrorBanner({ message, onDismiss }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDismiss, 8000);
    return () => clearTimeout(t);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div
      className="animate-slideDown no-print"
      style={{
        display: "flex", alignItems: "flex-start", gap: 12,
        background: "var(--color-red-light)",
        border: "1px solid var(--color-red)",
        borderRadius: "var(--radius-md)",
        padding: "12px 16px",
        marginBottom: 20,
      }}
    >
      <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>⚠️</span>
      <span style={{ fontSize: 13, color: "var(--color-red)", flex: 1, lineHeight: 1.5 }}>
        {message}
      </span>
      <button
        onClick={onDismiss}
        style={{
          background: "none", border: "none",
          color: "var(--color-red)", cursor: "pointer",
          fontSize: 18, lineHeight: 1, padding: 0, flexShrink: 0,
        }}
        aria-label="Fechar"
      >
        ×
      </button>
    </div>
  );
}
