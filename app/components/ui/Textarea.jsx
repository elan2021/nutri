export default function Textarea({
  value, onChange, placeholder, rows = 3, error,
}) {
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          width: "100%",
          padding: "9px 12px",
          fontSize: 14,
          border: `1.5px solid ${error ? "var(--color-red)" : "var(--color-border)"}`,
          borderRadius: "var(--radius-md)",
          background: "var(--color-card)",
          color: "var(--color-text-primary)",
          outline: "none",
          resize: "vertical",
          transition: "border-color var(--transition-fast), box-shadow var(--transition-fast)",
          lineHeight: 1.6,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "var(--color-border-focus)";
          e.target.style.boxShadow = "0 0 0 3px rgba(13,143,107,0.12)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "var(--color-border)";
          e.target.style.boxShadow = "none";
        }}
      />
      {error && (
        <span style={{ display: "block", marginTop: 4, fontSize: 11, color: "var(--color-red)" }}>
          {error}
        </span>
      )}
    </div>
  );
}
