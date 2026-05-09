const COLOR_MAP = {
  green:  { bg: "var(--color-primary-light)", fg: "var(--color-primary-dark)", dot: "var(--color-primary)" },
  amber:  { bg: "var(--color-amber-light)",   fg: "var(--color-amber)",        dot: "var(--color-amber)" },
  red:    { bg: "var(--color-red-light)",     fg: "var(--color-red)",          dot: "var(--color-red)" },
  blue:   { bg: "var(--color-blue-light)",    fg: "var(--color-blue)",         dot: "var(--color-blue)" },
  gray:   { bg: "#f3f4f6",                    fg: "#374151",                   dot: "#9ca3af" },
};

export default function Badge({ color = "green", children, pulse = false }) {
  const { bg, fg, dot } = COLOR_MAP[color] || COLOR_MAP.gray;
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        background: bg, color: fg,
        fontSize: 11, fontWeight: 500,
        padding: "3px 9px", borderRadius: 20,
      }}
    >
      {pulse && (
        <span
          style={{
            width: 6, height: 6, borderRadius: "50%",
            background: dot,
            animation: "pulse 1.5s ease-in-out infinite",
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  );
}
