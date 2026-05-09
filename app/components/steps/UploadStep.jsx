"use client";

import { useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";

export default function UploadStep({ onFile, onManual, fileRef }) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  };

  return (
    <Card className="animate-scaleIn" elevated>
      {/* Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onClick={() => fileRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? "var(--color-primary)" : "var(--color-border)"}`,
          borderRadius: "var(--radius-md)",
          padding: "3rem 1.5rem",
          textAlign: "center",
          cursor: "pointer",
          background: dragging ? "var(--color-primary-light)" : "var(--color-bg)",
          transition: "all var(--transition-base)",
          transform: dragging ? "scale(1.01)" : "scale(1)",
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 12, lineHeight: 1 }}>
          {dragging ? "📬" : "📄"}
        </div>
        <p style={{ fontWeight: 600, fontSize: 15, color: "var(--color-text-primary)", marginBottom: 6 }}>
          {dragging ? "Solte para enviar" : "Arraste ou clique para enviar"}
        </p>
        <p style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
          JPG, PNG ou WEBP do encaminhamento médico · Máx. 10MB
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          style={{ display: "none" }}
          onChange={(e) => { if (e.target.files[0]) onFile(e.target.files[0]); }}
        />
      </div>

      {/* Divider */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        margin: "20px 0",
      }}>
        <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
        <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>ou</span>
        <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
      </div>

      <Button variant="ghost" fullWidth onClick={onManual}>
        Preencher dados manualmente
      </Button>

      {/* Disclaimer */}
      <p style={{
        fontSize: 11, color: "var(--color-text-muted)",
        textAlign: "center", marginTop: 16, lineHeight: 1.6,
      }}>
        🔒 Dados enviados apenas ao provedor de IA configurado. Nunca armazenados.
      </p>
    </Card>
  );
}
