export default function Card({ children, style, className = "", elevated = false }) {
  return (
    <div
      className={`print-card ${className}`}
      style={{
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "1.25rem 1.5rem",
        boxShadow: elevated ? "var(--shadow-md)" : "var(--shadow-sm)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
