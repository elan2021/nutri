"use client";

import { useNutriAI } from "../hooks/useNutriAI";
import Header from "./Header";
import StepIndicator from "./StepIndicator";
import ErrorBanner from "./ErrorBanner";
import Spinner from "./ui/Spinner";
import Card from "./ui/Card";
import UploadStep from "./steps/UploadStep";
import FormStep from "./steps/FormStep";
import DiagnosisStep from "./steps/DiagnosisStep";

export default function NutriAI() {
  const {
    step, patient, diagnosis, loading, loadingMsg,
    imgPreview, error, formErrors, imc, fileRef,
    setField, handleFile, handleAnalyze, resetAll, goBack,
    setError, setStep,
  } = useNutriAI();

  return (
    <>
      <Header />

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
        <StepIndicator step={step} onStepClick={goBack} />

        <ErrorBanner message={error} onDismiss={() => setError(null)} />

        {/* Loading overlay */}
        {loading && (
          <Card elevated>
            <Spinner message={loadingMsg} />
          </Card>
        )}

        {/* Step 1 — Upload */}
        {!loading && step === "upload" && (
          <UploadStep
            onFile={handleFile}
            onManual={() => setStep("form")}
            fileRef={fileRef}
          />
        )}

        {/* Step 2 — Form */}
        {!loading && step === "form" && (
          <FormStep
            patient={patient}
            setField={setField}
            formErrors={formErrors}
            imc={imc}
            imgPreview={imgPreview}
            onAnalyze={handleAnalyze}
            onBack={goBack}
            loading={loading}
          />
        )}

        {/* Step 3 — Diagnosis */}
        {!loading && step === "diagnosis" && diagnosis && (
          <DiagnosisStep
            diagnosis={diagnosis}
            patient={patient}
            onEdit={goBack}
            onReset={resetAll}
          />
        )}
      </main>
    </>
  );
}
