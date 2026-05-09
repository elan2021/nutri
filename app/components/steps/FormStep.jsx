"use client";

import Card from "../ui/Card";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Select from "../ui/Select";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

const ATIVIDADE_OPTS = [
  { value: "sedentario",   label: "Sedentário (×1.2)" },
  { value: "leve",         label: "Leve (×1.375)" },
  { value: "moderado",     label: "Moderado (×1.55)" },
  { value: "intenso",      label: "Intenso (×1.725)" },
  { value: "muito_intenso",label: "Muito intenso (×1.9)" },
];

function imcClassification(imc) {
  const v = parseFloat(imc);
  if (v < 18.5) return { label: "Abaixo do peso", color: "blue" };
  if (v < 25)   return { label: "Peso normal", color: "green" };
  if (v < 30)   return { label: "Sobrepeso", color: "amber" };
  if (v < 35)   return { label: "Obesidade Grau I", color: "red" };
  if (v < 40)   return { label: "Obesidade Grau II", color: "red" };
  return          { label: "Obesidade Grau III", color: "red" };
}

function SectionTitle({ icon, title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ fontWeight: 600, fontSize: 15 }}>{title}</span>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: "block", marginBottom: 5,
        fontSize: 12, fontWeight: 500,
        color: "var(--color-text-secondary)",
      }}>
        {label}{required && <span style={{ color: "var(--color-red)", marginLeft: 2 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

export default function FormStep({
  patient, setField, formErrors, imc,
  imgPreview, onAnalyze, onBack, loading,
}) {
  const imcInfo = imc ? imcClassification(imc) : null;
  const hasErrors = Object.keys(formErrors).some(k => formErrors[k]);

  return (
    <div className="animate-fadeInUp stagger">

      {/* Image preview */}
      {imgPreview && (
        <Card style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 12, color: "var(--color-text-muted)", marginBottom: 8 }}>
            📎 Encaminhamento enviado — dados extraídos automaticamente
          </p>
          <img
            src={imgPreview}
            alt="Encaminhamento"
            style={{ width: "100%", borderRadius: "var(--radius-md)", maxHeight: 200, objectFit: "cover" }}
          />
        </Card>
      )}

      {/* Patient data */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <SectionTitle icon="👤" title="Dados do paciente" />
          {imc && imcInfo && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>IMC {imc}</span>
              <Badge color={imcInfo.color}>{imcInfo.label}</Badge>
            </div>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Nome completo" required>
            <Input value={patient.nome} onChange={setField("nome")}
              placeholder="Ex: Maria Oliveira" error={formErrors.nome} required />
          </Field>
          <Field label="Idade (anos)" required>
            <Input value={patient.idade} onChange={setField("idade")}
              placeholder="Ex: 49" type="number" error={formErrors.idade} required />
          </Field>
          <Field label="Sexo" required>
            <Select value={patient.sexo} onChange={setField("sexo")}
              options={[
                { value: "", label: "Selecione" },
                { value: "Feminino", label: "Feminino" },
                { value: "Masculino", label: "Masculino" },
              ]}
              error={formErrors.sexo}
            />
          </Field>
          <Field label="Peso (kg)" required>
            <Input value={patient.peso} onChange={setField("peso")}
              placeholder="Ex: 85" type="number" error={formErrors.peso} required />
          </Field>
          <Field label="Altura (cm)" required>
            <Input value={patient.altura} onChange={setField("altura")}
              placeholder="Ex: 162" type="number" error={formErrors.altura} required />
          </Field>
          <Field label="Nível de atividade física">
            <Select value={patient.atividadeFisica} onChange={setField("atividadeFisica")}
              options={ATIVIDADE_OPTS} />
          </Field>
        </div>
      </Card>

      {/* Anthropometric data */}
      <Card style={{ marginBottom: 16 }}>
        <SectionTitle icon="📏" title="Avaliação Antropométrica (Opcional)" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Cintura (cm)">
            <Input value={patient.cintura} onChange={setField("cintura")}
              placeholder="Ex: 85" type="number" />
          </Field>
          <Field label="Quadril (cm)">
            <Input value={patient.quadril} onChange={setField("quadril")}
              placeholder="Ex: 105" type="number" />
          </Field>
          <Field label="Pescoço (cm)">
            <Input value={patient.pescoco} onChange={setField("pescoco")}
              placeholder="Ex: 38" type="number" />
          </Field>
          <Field label="% Gordura Corporal">
            <Input value={patient.percentualGordura} onChange={setField("percentualGordura")}
              placeholder="Ex: 25" type="number" />
          </Field>
        </div>
      </Card>

      {/* Clinical data */}
      <Card style={{ marginBottom: 20 }}>
        <SectionTitle icon="🩺" title="Dados clínicos" />
        <Field label="Diagnóstico(s)">
          <Textarea value={patient.diagnostico} onChange={setField("diagnostico")}
            placeholder="Ex: Diabetes mellitus tipo 2, obesidade grau II..." rows={3} />
        </Field>
        <Field label="Medicamentos em uso">
          <Textarea value={patient.medicamentos} onChange={setField("medicamentos")}
            placeholder="Ex: Metformina 850mg, Losartana 50mg..." rows={2} />
        </Field>
        <Field label="Objetivo do encaminhamento">
          <Textarea value={patient.encaminhamento} onChange={setField("encaminhamento")}
            placeholder="Ex: Controle glicêmico, redução de peso..." rows={2} />
        </Field>
        <Field label="Observações / Restrições">
          <Textarea value={patient.observacoes} onChange={setField("observacoes")}
            placeholder="Alergias, preferências alimentares, restrições..." rows={2} />
        </Field>
      </Card>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10 }}>
        <Button variant="ghost" onClick={onBack} style={{ flex: 1 }}>
          ← Voltar
        </Button>
        <Button
          variant="primary" onClick={onAnalyze}
          loading={loading} disabled={hasErrors}
          style={{ flex: 2, minWidth: 0 }}
        >
          Gerar avaliação nutricional →
        </Button>
      </div>

      {hasErrors && (
        <p style={{
          textAlign: "center", fontSize: 12,
          color: "var(--color-red)", marginTop: 10,
        }}>
          Preencha os campos obrigatórios marcados com *
        </p>
      )}
    </div>
  );
}
