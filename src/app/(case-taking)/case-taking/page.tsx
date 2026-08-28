"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Save,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  HeartPulse,
  Sparkles,
  Bot,
  Layers,
  FileCheck2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { CLINICAL_QUESTION_REGISTRY } from "@/lib/questionnaires/clinicalQuestions";
import { QuestionInputs } from "@/components/clinical/QuestionInputs";
import { CaseReviewSummary } from "@/components/clinical/CaseReviewSummary";
import { AIDialogueWidget } from "@/components/clinical/AIDialogueWidget";
import { ClinicalSafetyBanner } from "@/components/safety/ClinicalSafetyBanner";
import { LanguageSelector } from "@/components/clinical/LanguageSelector";
import { AudioPlayerWidget } from "@/components/clinical/AudioPlayerWidget";
import { EmergencyRedFlagModal } from "@/components/safety/EmergencyRedFlagModal";
import { evaluateSafetyStatus } from "@/services/safety/safetyEngine";
import { getTranslations } from "@/lib/i18n/translations";
import { AyushSystem } from "@/types/user";

export default function ClinicalCaseTakingPage() {
  const router = useRouter();

  const [intakeMode, setIntakeMode] = useState<"WIZARD" | "AI_DIALOGUE">("WIZARD");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedAyushSystem, setSelectedAyushSystem] = useState<AyushSystem>("ALLOPATHY");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [urgentModalOpen, setUrgentModalOpen] = useState(false);
  const [urgentReason, setUrgentReason] = useState("");

  const t = getTranslations(selectedLanguage);

  // Load or restore active session on mount
  useEffect(() => {
    async function loadActiveSession() {
      try {
        const res = await fetch("/api/clinical/session");
        if (res.ok) {
          const data = await res.json();
          if (data.session) {
            setSessionId(data.session._id);
            setAnswers(data.session.answers || {});
            setCurrentStepIndex(data.session.currentStepIndex || 0);
            if (data.session.selectedLanguage) setSelectedLanguage(data.session.selectedLanguage);
            if (data.session.selectedAyushSystem) setSelectedAyushSystem(data.session.selectedAyushSystem);
          }
        }
      } catch (err) {
        console.error("Failed to load clinical session:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadActiveSession();
  }, []);

  // Filter questions based on current selected AYUSH system
  const activeQuestions = CLINICAL_QUESTION_REGISTRY.filter((q) => {
    if (q.ayushSystemFilter) {
      const currentAyush = (answers["ayush_system_selection"] as AyushSystem) || selectedAyushSystem;
      if (!q.ayushSystemFilter.includes(currentAyush)) {
        return false;
      }
    }
    return true;
  });

  const totalSteps = activeQuestions.length;
  const isReviewStep = currentStepIndex >= totalSteps;
  const currentQuestion = activeQuestions[currentStepIndex];

  const handleAnswerChange = (newValue: unknown) => {
    if (!currentQuestion) return;
    const newAnswers = { ...answers, [currentQuestion.id]: newValue };
    setAnswers(newAnswers);

    // PHASE 8: Deterministic Safety Engine Check
    const safetyEval = evaluateSafetyStatus({
      patientInput: String(newAnswers["chief_complaint_symptom"] || ""),
      answers: newAnswers,
    });

    if (safetyEval.isUrgent) {
      setUrgentReason(safetyEval.triageAlertReason);
      setUrgentModalOpen(true);
    }

    if (currentQuestion.id === "selected_language") {
      setSelectedLanguage(String(newValue));
    }
    if (currentQuestion.id === "ayush_system_selection") {
      setSelectedAyushSystem(newValue as AyushSystem);
    }
  };

  const handleNext = async () => {
    const nextIdx = currentStepIndex + 1;
    setCurrentStepIndex(nextIdx);

    // Auto-save progress
    if (sessionId) {
      setIsSaving(true);
      try {
        await fetch("/api/clinical/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            stepIndex: nextIdx,
            answers,
            selectedLanguage,
            selectedAyushSystem: (answers["ayush_system_selection"] as AyushSystem) || selectedAyushSystem,
          }),
        });
      } catch (err) {
        console.error("Auto-save error:", err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    setSaveSuccessMessage(null);
    try {
      const res = await fetch("/api/clinical/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          stepIndex: currentStepIndex,
          answers,
          selectedLanguage,
          selectedAyushSystem: (answers["ayush_system_selection"] as AyushSystem) || selectedAyushSystem,
        }),
      });

      if (res.ok) {
        setSaveSuccessMessage(t.savedSuccessfully);
        setTimeout(() => setSaveSuccessMessage(null), 4000);
      }
    } catch (err) {
      console.error("Save draft error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditQuestion = (questionId: string) => {
    const targetIdx = activeQuestions.findIndex((q) => q.id === questionId);
    if (targetIdx !== -1) {
      setCurrentStepIndex(targetIdx);
      setIntakeMode("WIZARD");
    }
  };

  const handleSubmitFinalCase = async () => {
    if (!sessionId) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/clinical/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      const data = await res.json();
      if (res.ok && data.caseId) {
        router.push(`/patient/case/${data.caseId}`);
      } else {
        alert(data.error || "Failed to submit case.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("An unexpected error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 animate-pulse">
            <Stethoscope className="h-6 w-6" />
          </div>
          <p className="text-xs font-semibold text-muted-foreground">Loading Clinical Intake Session...</p>
        </div>
      </div>
    );
  }

  const progressPercent = Math.min(100, Math.round(((currentStepIndex + 1) / (totalSteps + 1)) * 100));

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* PHASE 8: EMERGENCY RED FLAG MODAL */}
      <EmergencyRedFlagModal
        isOpen={urgentModalOpen}
        alertReason={urgentReason}
        onAcknowledgeEmergency={() => setUrgentModalOpen(false)}
      />

      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/patient/dashboard">
            <Button variant="ghost" size="sm" className="gap-1 text-xs font-bold">
              <ChevronLeft className="h-4 w-4" />
              <span>{t.backToPortal}</span>
            </Button>
          </Link>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <span className="font-bold text-sm text-foreground hidden sm:inline">
            Arogya<span className="text-teal-600">Intake</span> • Multilingual Patient Clinical Portal
          </span>
        </div>

        {/* Language Selector & Mode Switcher */}
        <div className="flex items-center gap-2">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onSelectLanguage={(lang) => {
              setSelectedLanguage(lang);
              setAnswers((prev) => ({ ...prev, selected_language: lang }));
            }}
            compact
          />

          <div className="flex items-center rounded-lg border border-border bg-muted/40 p-0.5">
            <button
              type="button"
              onClick={() => setIntakeMode("WIZARD")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition flex items-center gap-1 ${
                intakeMode === "WIZARD"
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Layers className="h-3 w-3" />
              <span>{t.formWizardMode}</span>
            </button>
            <button
              type="button"
              onClick={() => setIntakeMode("AI_DIALOGUE")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition flex items-center gap-1 ${
                intakeMode === "AI_DIALOGUE"
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Bot className="h-3 w-3" />
              <span>{t.aiDialogueMode}</span>
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="text-xs gap-1.5 border-teal-500/30 font-bold"
          >
            <Save className="h-3.5 w-3.5 text-teal-600" />
            <span>{isSaving ? t.saving : t.saveDraft}</span>
          </Button>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 p-4 sm:p-6 max-w-4xl w-full mx-auto space-y-6">
        {/* Safety Banner */}
        <ClinicalSafetyBanner compact />

        {saveSuccessMessage && (
          <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-300 text-center animate-in fade-in-50">
            {saveSuccessMessage}
          </div>
        )}

        {/* AI DIALOGUE MODE */}
        {intakeMode === "AI_DIALOGUE" ? (
          <AIDialogueWidget
            sessionId={sessionId || undefined}
            answers={answers}
            onUpdateAnswers={setAnswers}
            selectedAyushSystem={(answers["ayush_system_selection"] as AyushSystem) || selectedAyushSystem}
            selectedLanguage={selectedLanguage}
            onSelectLanguage={(lang) => {
              setSelectedLanguage(lang);
              setAnswers((prev) => ({ ...prev, selected_language: lang }));
            }}
            onSwitchToWizard={() => setIntakeMode("WIZARD")}
          />
        ) : (
          /* STANDARD FORM WIZARD MODE */
          <div className="space-y-6">
            {/* Progress Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-muted-foreground uppercase tracking-wider">
                  {isReviewStep
                    ? "Review & Submission"
                    : `Medical Intake — Step ${currentStepIndex + 1} of ${totalSteps}`}
                </span>
                <span className="text-teal-600">{progressPercent}% Progress</span>
              </div>

              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-teal-600 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* REVIEW STEP VIEW */}
            {isReviewStep ? (
              <CaseReviewSummary
                answers={answers}
                ayushSystem={(answers["ayush_system_selection"] as AyushSystem) || selectedAyushSystem}
                onEditStep={handleEditQuestion}
                onSubmitFinal={handleSubmitFinalCase}
                isSubmitting={isSubmitting}
              />
            ) : (
              /* QUESTION STEP CARD */
              <Card className="border-teal-500/30 shadow-sm">
                <CardHeader className="pb-3 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <Badge variant="clinical" className="uppercase tracking-wider text-[10px]">
                      {currentQuestion.category.replace("_", " ")}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <AudioPlayerWidget
                        textToSpeak={currentQuestion.question}
                        language={selectedLanguage}
                      />
                      {currentQuestion.isOptional && (
                        <Badge variant="outline" className="text-[10px]">Optional Step</Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-base sm:text-lg font-bold text-foreground mt-2">
                    {currentQuestion.question}
                  </CardTitle>
                  {currentQuestion.description && (
                    <CardDescription className="text-xs text-muted-foreground">
                      {currentQuestion.description}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent className="pt-6">
                  <QuestionInputs
                    question={currentQuestion}
                    value={answers[currentQuestion.id]}
                    onChange={handleAnswerChange}
                    language={selectedLanguage}
                  />
                </CardContent>

                <CardFooter className="pt-4 border-t border-border/50 flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBack}
                    disabled={currentStepIndex === 0}
                    className="text-xs gap-1 font-bold"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>{t.backStep}</span>
                  </Button>

                  <div className="flex items-center gap-2">
                    {currentQuestion.isOptional && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleNext}
                        className="text-xs text-muted-foreground"
                      >
                        {t.skipStep}
                      </Button>
                    )}

                    <Button
                      variant="clinical"
                      size="sm"
                      onClick={handleNext}
                      disabled={
                        !currentQuestion.isOptional &&
                        (answers[currentQuestion.id] === undefined ||
                          answers[currentQuestion.id] === null ||
                          answers[currentQuestion.id] === "")
                      }
                      className="text-xs gap-1 font-bold shadow-sm"
                    >
                      <span>{currentStepIndex === totalSteps - 1 ? t.reviewAnswers : t.nextStep}</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
