const STEPS = [
  { id: "upload",    label: "Upload",      number: 1 },
  { id: "form",      label: "Dados",       number: 2 },
  { id: "diagnosis", label: "Diagnóstico", number: 3 },
];

const ORDER = ["upload", "form", "diagnosis"];

export default function StepIndicator({ step, onStepClick }) {
  const currentIdx = ORDER.indexOf(step);

  return (
    <div
      className="no-print"
      style={{
        display: "flex", alignItems: "center",
        marginBottom: 28,
        userSelect: "none",
      }}
    >
      {STEPS.map((s, i) => {
        const isActive = step === s.id;
        const isDone = i < currentIdx;
        const isClickable = isDone && onStepClick;

        return (
          <div
            key={s.id}
            style={{ display: "flex", alignItems: "center", flex: 1 }}
          >
            {/* Step item */}
            <div
              onClick={() => isClickable && onStepClick(s.id)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: 6, flex: 1,
                cursor: isClickable ? "pointer" : "default",
              }}
            >
              {/* Circle */}
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 600,
                transition: "all var(--transition-base)",
                background: isActive
                  ? "var(--color-primary)"
                  : isDone
                  ? "var(--color-primary)"
                  : "var(--color-card)",
                color: isActive || isDone ? "#fff" : "var(--color-text-muted)",
                border: `2px solid ${isActive || isDone ? "var(--color-primary)" : "var(--color-border)"}`,
                boxShadow: isActive ? "0 0 0 4px rgba(13,143,107,0.15)" : "none",
              }}>
                {isDone ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : s.number}
              </div>

              {/* Label */}
              <span style={{
                fontSize: 11, fontWeight: isActive ? 600 : 400,
                color: isActive
                  ? "var(--color-primary)"
                  : isDone
                  ? "var(--color-text-secondary)"
                  : "var(--color-text-muted)",
                transition: "color var(--transition-base)",
              }}>
                {s.label}
              </span>
            </div>

            {/* Connector line (not after last) */}
            {i < STEPS.length - 1 && (
              <div style={{
                height: 2, flex: 1, marginTop: -16,
                background: i < currentIdx
                  ? "var(--color-primary)"
                  : "var(--color-border)",
                transition: "background var(--transition-slow)",
                borderRadius: 1,
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
