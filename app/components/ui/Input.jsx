export default function Input({
  value, onChange, placeholder, type = "text",
  error, required = false, disabled = false,
}) {
  return (
    <div style={{ position: "relative" }}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        style={{
          width: "100%",
          padding: "9px 12px",
          fontSize: 14,
          border: `1.5px solid ${error ? "var(--color-red)" : "var(--color-border)"}`,
          borderRadius: "var(--radius-md)",
          background: disabled ? "var(--color-bg)" : "var(--color-card)",
          color: "var(--color-text-primary)",
          outline: "none",
          transition: "border-color var(--transition-fast), box-shadow var(--transition-fast)",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = error ? "var(--color-red)" : "var(--color-border-focus)";
          e.target.style.boxShadow = error
            ? "0 0 0 3px rgba(153,27,27,0.1)"
            : "0 0 0 3px rgba(13,143,107,0.12)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? "var(--color-red)" : "var(--color-border)";
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
