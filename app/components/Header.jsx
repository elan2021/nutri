"use client";

import { useEffect, useState } from "react";
import Badge from "./ui/Badge";

export default function Header() {
  const [providerInfo, setProviderInfo] = useState(null);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then(setProviderInfo)
      .catch(() => setProviderInfo({ ok: false }));
  }, []);

  const providerLabel = providerInfo?.provider === "gemini"
    ? "Gemini 2.5 Flash"
    : providerInfo?.provider === "anthropic"
    ? "Claude Sonnet"
    : null;

  return (
    <header
      className="no-print"
      style={{
        borderBottom: "1px solid var(--color-border)",
        background: "var(--color-card)",
        boxShadow: "var(--shadow-sm)",
        position: "sticky", top: 0, zIndex: 10,
      }}
    >
      <div
        style={{
          maxWidth: 760, margin: "0 auto",
          padding: "0 1.5rem",
          height: 60,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "var(--color-primary)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(13,143,107,0.3)",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.5 2 6 5 6 8c0 4 3 6 6 10 3-4 6-6 6-10 0-3-2.5-6-6-6z"
                fill="white" opacity="0.9"/>
              <path d="M12 6v10M9 9l3-3 3 3" stroke="white" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.02em" }}>
              NutriAI
            </div>
            <div style={{ fontSize: 10, color: "var(--color-text-muted)", marginTop: -2 }}>
              Avaliação Nutricional com IA
            </div>
          </div>
        </div>

        {/* Provider badge */}
        {providerInfo && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {providerInfo.ok && providerLabel ? (
              <Badge color="green" pulse>
                {providerLabel}
              </Badge>
            ) : (
              <Badge color="red">
                API não configurada
              </Badge>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
