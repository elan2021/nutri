export default function Button({
  children, onClick, variant = "primary", size = "md",
  disabled = false, loading = false, fullWidth = false, type = "button", className = "",
}) {
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: 8, fontWeight: 500, borderRadius: "var(--radius-md)", border: "none",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    opacity: disabled || loading ? 0.6 : 1,
    transition: "all var(--transition-fast)",
    width: fullWidth ? "100%" : "auto",
    whiteSpace: "nowrap",
    fontSize: size === "sm" ? 13 : size === "lg" ? 15 : 14,
    padding: size === "sm" ? "6px 14px" : size === "lg" ? "13px 24px" : "10px 18px",
  };

  const variants = {
    primary: {
      background: "var(--color-primary)",
      color: "#fff",
      boxShadow: "0 1px 3px rgba(13,143,107,0.3)",
    },
    secondary: {
      background: "transparent",
      color: "var(--color-primary)",
      border: "1.5px solid var(--color-primary)",
    },
    ghost: {
      background: "transparent",
      color: "var(--color-text-secondary)",
      border: "1px solid var(--color-border)",
    },
    danger: {
      background: "var(--color-red-light)",
      color: "var(--color-red)",
      border: "1px solid var(--color-red)",
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{ ...base, ...variants[variant] }}
      className={className}
      onMouseEnter={(e) => {
        if (disabled || loading) return;
        if (variant === "primary") e.currentTarget.style.background = "var(--color-primary-hover)";
        if (variant === "ghost") e.currentTarget.style.background = "var(--color-primary-light)";
      }}
      onMouseLeave={(e) => {
        if (variant === "primary") e.currentTarget.style.background = "var(--color-primary)";
        if (variant === "ghost") e.currentTarget.style.background = "transparent";
      }}
    >
      {loading && (
        <span
          style={{
            width: 14, height: 14,
            border: "2px solid currentColor",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </button>
  );
}
