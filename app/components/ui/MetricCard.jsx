"use client";

import { useEffect, useRef, useState } from "react";

const COLOR_MAP = {
  green:  { bg: "var(--color-primary-light)", fg: "var(--color-primary-dark)" },
  amber:  { bg: "var(--color-amber-light)",   fg: "var(--color-amber)" },
  red:    { bg: "var(--color-red-light)",     fg: "var(--color-red)" },
  blue:   { bg: "var(--color-blue-light)",    fg: "var(--color-blue)" },
};

function useCountUp(target, duration = 900) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const n = parseFloat(target);
    if (isNaN(n)) { setCount(target); return; }
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - prog, 3);
      setCount((eased * n).toFixed(target.toString().includes(".") ? 1 : 0));
      if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return count;
}

export default function MetricCard({ label, value, unit, color = "green", description }) {
  const { bg, fg } = COLOR_MAP[color] || COLOR_MAP.green;
  const animated = useCountUp(value);

  return (
    <div
      className="animate-fadeInUp"
      style={{
        background: bg, borderRadius: "var(--radius-md)",
        padding: "14px 16px", flex: 1, minWidth: 100,
      }}
    >
      <div style={{ fontSize: 11, color: fg, fontWeight: 500, marginBottom: 6, opacity: 0.8 }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: fg, lineHeight: 1 }}>
        {animated}
        <span style={{ fontSize: 12, fontWeight: 400, marginLeft: 4, opacity: 0.75 }}>{unit}</span>
      </div>
      {description && (
        <div style={{ fontSize: 11, color: fg, marginTop: 6, opacity: 0.65 }}>{description}</div>
      )}
    </div>
  );
}
