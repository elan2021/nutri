export default function Select({ value, onChange, options, error }) {
  return (
    <div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "9px 12px",
          fontSize: 14,
          border: `1.5px solid ${error ? "var(--color-red)" : "var(--color-border)"}`,
          borderRadius: "var(--radius-md)",
          background: "var(--color-card)",
          color: value ? "var(--color-text-primary)" : "var(--color-text-muted)",
          outline: "none",
          cursor: "pointer",
          transition: "border-color var(--transition-fast), box-shadow var(--transition-fast)",
          appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239ca3af' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
          paddingRight: 32,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "var(--color-border-focus)";
          e.target.style.boxShadow = "0 0 0 3px rgba(13,143,107,0.12)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "var(--color-border)";
          e.target.style.boxShadow = "none";
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && (
        <span style={{ display: "block", marginTop: 4, fontSize: 11, color: "var(--color-red)" }}>
          {error}
        </span>
      )}
    </div>
  );
}
