"use client";

import Card from "../ui/Card";
import MetricCard from "../ui/MetricCard";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

function SectionTitle({ icon, title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ fontWeight: 600, fontSize: 15 }}>{title}</span>
    </div>
  );
}

function MacroBar({ label, grams, totalKcal, color, kcalPerG }) {
  const kcal = grams * kcalPerG;
  const pct = totalKcal > 0 ? Math.round((kcal / totalKcal) * 100) : 0;
  const colors = {
    blue:  { bar: "var(--color-blue)",  bg: "var(--color-blue-light)",  text: "var(--color-blue)" },
    amber: { bar: "var(--color-amber)", bg: "var(--color-amber-light)", text: "var(--color-amber)" },
    green: { bar: "var(--color-primary-dark)", bg: "var(--color-primary-light)", text: "var(--color-primary-dark)" },
  }[color];

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: colors.text }}>{label}</span>
        <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
          {Math.round(grams)}g · {Math.round(kcal)} kcal · {pct}%
        </span>
      </div>
      <div style={{ height: 8, borderRadius: 4, background: colors.bg, overflow: "hidden" }}>
        <div
          style={{
            height: "100%", width: `${pct}%`, borderRadius: 4,
            background: colors.bar,
            animation: "progressFill 0.9s ease both",
          }}
        />
      </div>
    </div>
  );
}

function alertColor(text) {
  const t = text.toLowerCase();
  if (t.includes("risco") || t.includes("contraindicado") || t.includes("evitar")) return "red";
  if (t.includes("atenção") || t.includes("cuidado") || t.includes("monitorar")) return "amber";
  return "blue";
}

function alertIcon(color) {
  if (color === "red") return "🔴";
  if (color === "amber") return "🟡";
  return "🔵";
}

export default function DiagnosisStep({ diagnosis, patient, onEdit, onReset }) {
  if (!diagnosis) return null;

  const totalKcal = diagnosis.get || 0;

  const imcColor = () => {
    const v = parseFloat(diagnosis.imc);
    if (v < 18.5) return "blue";
    if (v < 25)   return "green";
    if (v < 30)   return "amber";
    return "red";
  };

  const handlePrint = () => window.print();

  return (
    <div className="animate-fadeInUp stagger">

      {/* Patient header */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div>
            <p style={{ fontSize: 11, color: "var(--color-text-muted)", marginBottom: 2 }}>Avaliação de</p>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{patient.nome || "Paciente"}</h2>
            <p style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>
              {patient.sexo} · {patient.idade} anos · {patient.peso}kg · {patient.altura}cm
            </p>
          </div>
          {diagnosis.classificacaoImc && (
            <Badge color={imcColor()}>
              IMC {Number(diagnosis.imc).toFixed(1)} · {diagnosis.classificacaoImc}
            </Badge>
          )}
        </div>
      </Card>

      {/* Metrics */}
      <Card style={{ marginBottom: 16 }}>
        <SectionTitle icon="📊" title="Métricas calculadas" />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <MetricCard label="TMB" value={Math.round(diagnosis.tmb)} unit="kcal"
            color="blue" description="Taxa Metabólica Basal" />
          <MetricCard label="GET" value={Math.round(diagnosis.get)} unit="kcal"
            color="green" description="Gasto Energético Total" />
          <MetricCard label="IMC" value={Number(diagnosis.imc).toFixed(1)} unit="kg/m²"
            color={imcColor()} description={diagnosis.classificacaoImc} />
        </div>
      </Card>

      {/* Macros */}
      <Card style={{ marginBottom: 16 }}>
        <SectionTitle icon="🥗" title="Distribuição de macronutrientes" />
        <MacroBar label="Proteínas" grams={diagnosis.proteinas_g}
          totalKcal={totalKcal} color="blue" kcalPerG={4} />
        <MacroBar label="Carboidratos" grams={diagnosis.carboidratos_g}
          totalKcal={totalKcal} color="amber" kcalPerG={4} />
        <MacroBar label="Gorduras" grams={diagnosis.gorduras_g}
          totalKcal={totalKcal} color="green" kcalPerG={9} />
      </Card>

      {/* Clinical alerts */}
      {diagnosis.alertasClinicos?.length > 0 && (
        <Card style={{ marginBottom: 16 }}>
          <SectionTitle icon="⚠️" title="Alertas clínicos" />
          <div className="stagger" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {diagnosis.alertasClinicos.map((a, i) => {
              const color = alertColor(a);
              const bgMap = { red: "var(--color-red-light)", amber: "var(--color-amber-light)", blue: "var(--color-blue-light)" };
              return (
                <div key={i} className="animate-fadeInUp" style={{
                  display: "flex", gap: 10, alignItems: "flex-start",
                  padding: "10px 12px", borderRadius: "var(--radius-md)",
                  background: bgMap[color],
                }}>
                  <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{alertIcon(color)}</span>
                  <span style={{ fontSize: 13, color: "var(--color-text-primary)", lineHeight: 1.5 }}>{a}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Nutritional conduct */}
      <Card style={{ marginBottom: 16 }}>
        <SectionTitle icon="📋" title="Conduta nutricional sugerida" />
        <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--color-text-secondary)", margin: 0 }}>
          {diagnosis.condutaNutricional}
        </p>
      </Card>

      {/* Meal plan */}
      <Card style={{ marginBottom: 16 }}>
        <SectionTitle icon="🍽️" title="Plano alimentar inicial" />
        <p style={{
          fontSize: 14, lineHeight: 1.8,
          color: "var(--color-text-secondary)",
          margin: 0, whiteSpace: "pre-line",
        }}>
          {diagnosis.planoAlimentarInicial}
        </p>
      </Card>

      {/* General observations */}
      {diagnosis.observacoesGerais && (
        <Card style={{ marginBottom: 20 }}>
          <SectionTitle icon="📝" title="Observações gerais" />
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--color-text-secondary)", margin: 0 }}>
            {diagnosis.observacoesGerais}
          </p>
        </Card>
      )}

      {/* Actions */}
      <div className="no-print" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Button variant="ghost" onClick={onEdit} style={{ flex: 1 }}>
          ← Editar dados
        </Button>
        <Button variant="secondary" onClick={handlePrint} style={{ flex: 1 }}>
          🖨️ Exportar PDF
        </Button>
        <Button variant="primary" onClick={onReset} style={{ flex: 1 }}>
          + Novo paciente
        </Button>
      </div>

      {/* Disclaimer */}
      <p className="no-print" style={{
        fontSize: 11, color: "var(--color-text-muted)",
        textAlign: "center", marginTop: 16, lineHeight: 1.6,
      }}>
        ⚕️ Esta avaliação é um apoio clínico — não substitui o julgamento do nutricionista.
      </p>
    </div>
  );
}
