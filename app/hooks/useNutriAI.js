"use client";

import { useState, useRef, useCallback } from "react";

const EMPTY_PATIENT = {
  nome: "", idade: "", sexo: "", peso: "", altura: "",
  diagnostico: "", medicamentos: "", encaminhamento: "", observacoes: "",
  atividadeFisica: "sedentario",
};

const REQUIRED_FIELDS = ["nome", "idade", "sexo", "peso", "altura"];

function validate(patient) {
  const errors = {};
  if (!patient.nome.trim()) errors.nome = "Nome é obrigatório";
  if (!patient.idade || isNaN(Number(patient.idade)) || Number(patient.idade) <= 0)
    errors.idade = "Informe a idade";
  if (!patient.sexo) errors.sexo = "Selecione o sexo";
  if (!patient.peso || isNaN(Number(patient.peso)) || Number(patient.peso) <= 0)
    errors.peso = "Informe o peso";
  if (!patient.altura || isNaN(Number(patient.altura)) || Number(patient.altura) <= 0)
    errors.altura = "Informe a altura";
  return { valid: Object.keys(errors).length === 0, errors };
}

export function useNutriAI() {
  const [step, setStep] = useState("upload");
  const [patient, setPatient] = useState(EMPTY_PATIENT);
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [imgPreview, setImgPreview] = useState(null);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const fileRef = useRef();

  // IMC calculado em tempo real
  const imc = (() => {
    const p = Number(patient.peso);
    const h = Number(patient.altura) / 100;
    if (p > 0 && h > 0) return (p / (h * h)).toFixed(1);
    return null;
  })();

  const setField = useCallback((k) => (v) => {
    setPatient((prev) => ({ ...prev, [k]: v }));
    if (REQUIRED_FIELDS.includes(k)) {
      setFormErrors((prev) => ({ ...prev, [k]: undefined }));
    }
  }, []);

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    setError(null);

    if (file.type === "application/pdf") {
      setError("PDFs não são suportados. Envie uma foto (JPG ou PNG) do encaminhamento.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Arquivo muito grande. O tamanho máximo é 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const b64 = e.target.result.split(",")[1];
      setImgPreview(e.target.result);
      setLoading(true);
      setLoadingMsg("Lendo encaminhamento com IA...");

      try {
        const res = await fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64: b64, mimeType: file.type }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Falha na extração");

        const ex = data.extracted || {};
        setPatient((prev) => ({
          ...prev,
          nome: ex.nome || prev.nome,
          idade: ex.idade ? String(ex.idade) : prev.idade,
          sexo: ex.sexo || prev.sexo,
          peso: ex.peso ? String(ex.peso) : prev.peso,
          altura: ex.altura ? String(ex.altura) : prev.altura,
          diagnostico: ex.diagnostico || prev.diagnostico,
          medicamentos: ex.medicamentos || prev.medicamentos,
          encaminhamento: ex.encaminhamento || prev.encaminhamento,
          observacoes: ex.observacoes || prev.observacoes,
        }));
        setStep("form");
      } catch (err) {
        setError("Não foi possível extrair os dados. Confira e preencha manualmente.");
        setStep("form");
      } finally {
        setLoading(false);
        setLoadingMsg("");
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleAnalyze = useCallback(async () => {
    const { valid, errors } = validate(patient);
    if (!valid) {
      setFormErrors(errors);
      return;
    }
    setError(null);
    setLoading(true);
    setLoadingMsg("Gerando avaliação nutricional...");

    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha ao gerar diagnóstico");
      setDiagnosis(data.diagnosis);
      setStep("diagnosis");
    } catch (err) {
      setError(err.message || "Erro ao gerar avaliação. Tente novamente.");
    } finally {
      setLoading(false);
      setLoadingMsg("");
    }
  }, [patient]);

  const resetAll = useCallback(() => {
    setStep("upload");
    setPatient(EMPTY_PATIENT);
    setDiagnosis(null);
    setImgPreview(null);
    setError(null);
    setFormErrors({});
  }, []);

  const goBack = useCallback(() => {
    setError(null);
    if (step === "diagnosis") setStep("form");
    else if (step === "form") { setStep("upload"); setImgPreview(null); }
  }, [step]);

  return {
    step, patient, diagnosis, loading, loadingMsg,
    imgPreview, error, formErrors, imc, fileRef,
    setField, handleFile, handleAnalyze, resetAll, goBack,
    setError, setStep,
  };
}
