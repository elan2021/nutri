export default function Spinner({ message = "Processando com IA..." }) {
  return (
    <div
      className="animate-fadeIn"
      style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", gap: 16, padding: "3rem 1rem",
      }}
    >
      {/* Ring */}
      <div style={{ position: "relative", width: 48, height: 48 }}>
        <div style={{
          position: "absolute", inset: 0,
          border: "3px solid var(--color-primary-light)",
          borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          border: "3px solid transparent",
          borderTopColor: "var(--color-primary)",
          borderRadius: "50%",
          animation: "spin 0.75s linear infinite",
        }} />
      </div>

      <div style={{ textAlign: "center" }}>
        <p style={{
          fontSize: 14, fontWeight: 500,
          color: "var(--color-text-primary)", marginBottom: 4,
        }}>
          {message}
        </p>
        <p style={{
          fontSize: 12, color: "var(--color-text-muted)",
          animation: "pulse 2s ease-in-out infinite",
        }}>
          Isso pode levar alguns segundos
        </p>
      </div>
    </div>
  );
}
