"use client";

import React from "react";
import { CLINICAL_QUESTION_REGISTRY } from "@/lib/questionnaires/clinicalQuestions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Edit3, CheckCircle2, ShieldCheck, HeartPulse } from "lucide-react";
import { AyushSystem } from "@/types/user";

interface CaseReviewSummaryProps {
  answers: Record<string, unknown>;
  ayushSystem: AyushSystem;
  onEditStep: (questionId: string) => void;
  onSubmitFinal: () => void;
  isSubmitting?: boolean;
}

export function CaseReviewSummary({
  answers,
  ayushSystem,
  onEditStep,
  onSubmitFinal,
  isSubmitting = false,
}: CaseReviewSummaryProps) {
  // Filter questions that apply to this session
  const validQuestions = CLINICAL_QUESTION_REGISTRY.filter((q) => {
    if (q.ayushSystemFilter && !q.ayushSystemFilter.includes(ayushSystem)) {
      return false;
    }
    return true;
  });

  const formatAnswerValue = (val: unknown): string => {
    if (val === undefined || val === null || val === "") return "Not specified";
    if (typeof val === "boolean") return val ? "Yes" : "No";
    if (Array.isArray(val)) return val.join(", ");
    return String(val);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="text-center space-y-2">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Review & Confirm Your Case Intake Answers</h2>
        <p className="text-xs text-muted-foreground">
          Please review your recorded clinical history carefully before submitting it to your consulting doctor.
        </p>
      </div>

      <div className="space-y-4">
        {validQuestions.map((q) => {
          const val = answers[q.id];
          const hasAnswer = val !== undefined && val !== null && val !== "";
          return (
            <Card key={q.id} className="p-4 border-border text-xs space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider block">
                    {q.category.replace("_", " ")}
                  </span>
                  <h4 className="font-semibold text-foreground text-sm">{q.question}</h4>
                  <p className="text-muted-foreground font-medium bg-muted/30 p-2 rounded border border-border/50">
                    {formatAnswerValue(val)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditStep(q.id)}
                  className="h-8 text-xs text-teal-600 gap-1 shrink-0"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="p-4 rounded-xl border border-teal-500/30 bg-teal-500/10 text-xs space-y-3">
        <div className="flex items-center gap-2">
          <HeartPulse className="h-4 w-4 text-teal-600 shrink-0" />
          <span className="font-bold text-foreground">Final Clinical Intake Sign-Off</span>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          By submitting this intake, your structured clinical history object will be generated and made available to your licensed practitioner for medical verification.
        </p>
        <Button
          variant="clinical"
          size="lg"
          onClick={onSubmitFinal}
          disabled={isSubmitting}
          className="w-full gap-2 font-bold shadow-md"
        >
          <CheckCircle2 className="h-5 w-5" />
          <span>{isSubmitting ? "Generating Clinical History Object..." : "Submit Case Intake to Doctor"}</span>
        </Button>
      </div>
    </div>
  );
}
