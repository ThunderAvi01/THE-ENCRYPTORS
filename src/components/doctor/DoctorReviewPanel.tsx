"use client";

import React, { useState } from "react";
import {
  FileCheck2,
  CheckCircle2,
  Edit3,
  XCircle,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Stethoscope,
  Info,
  ChevronDown,
  ChevronUp,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SummaryContent, VerificationStatus } from "@/types/summary";

const MOCK_DEFAULT_SUMMARY: SummaryContent = {
  chiefComplaint: "Upper abdominal burning discomfort & postprandial acidity",
  historyOfPresentIllness: "Patient reports epigastric burning pain worsening 30 mins after dinner. Duration: 3 days. Onset: Sudden.",
  pastMedicalHistory: ["Hypertension"],
  pastSurgicalHistory: ["Appendectomy (2018)"],
  drugHistory: ["Amlodipine 5mg"],
  allergyHistory: ["Penicillin"],
  familyHistory: ["Diabetes"],
  personalHistory: { dietaryPattern: "VEGETARIAN" },
  reviewOfSystems: ["NAUSEA"],
  previousInvestigations: [],
  currentMedications: ["Amlodipine 5mg"],
  redFlags: [],
};

interface DoctorReviewPanelProps {
  caseId?: string;
  initialSummary?: {
    status: VerificationStatus;
    originalAiDraft: SummaryContent;
    doctorEditedSummary?: SummaryContent;
    verificationNotes?: string;
    provisionalDiagnosis?: string;
    recommendedPlan?: string;
    verifiedAt?: string;
    auditTrail?: Array<{ action: string; timestamp: string; modifiedByName?: string; notes?: string }>;
  };
  rawAnswers?: Record<string, unknown>;
  onVerificationComplete?: () => void;
}

export function DoctorReviewPanel({
  caseId = "case-881",
  initialSummary = {
    status: "UNDER_REVIEW",
    originalAiDraft: MOCK_DEFAULT_SUMMARY,
    doctorEditedSummary: MOCK_DEFAULT_SUMMARY,
  },
  rawAnswers = {},
  onVerificationComplete,
}: DoctorReviewPanelProps) {
  const [summary, setSummary] = useState<SummaryContent>(
    initialSummary.doctorEditedSummary || initialSummary.originalAiDraft
  );

  const [status, setStatus] = useState<VerificationStatus>(initialSummary.status);
  const [provisionalDiagnosis, setProvisionalDiagnosis] = useState(initialSummary.provisionalDiagnosis || "");
  const [recommendedPlan, setRecommendedPlan] = useState(initialSummary.recommendedPlan || "");
  const [notes, setNotes] = useState(initialSummary.verificationNotes || "");

  const [showRawAnswers, setShowRawAnswers] = useState(false);
  const [showAuditTrail, setShowAuditTrail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFieldChange = (field: keyof SummaryContent, value: unknown) => {
    setSummary((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const executeDoctorAction = async (action: "ACCEPT" | "EDIT" | "REJECT") => {
    setIsSubmitting(true);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/doctor/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId,
          action,
          editedSummary: summary,
          notes,
          provisionalDiagnosis,
          recommendedPlan,
          doctorRegistrationNumber: "NMC-2024-99881",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus(action === "ACCEPT" ? "VERIFIED" : action === "EDIT" ? "EDITED" : "REJECTED");
        setSuccessMessage(`Doctor action executed: ${action}. Case status updated.`);
        if (onVerificationComplete) onVerificationComplete();
      } else {
        alert(data.error || "Action failed.");
      }
    } catch (err) {
      console.error("Verification submit error:", err);
      alert("An unexpected error occurred during verification.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* MANDATORY AI DRAFT WARNING BANNER */}
      <div className="p-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
          <div>
            <h4 className="font-bold text-amber-950 dark:text-amber-100 uppercase tracking-wider text-xs">
              AI-GENERATED DRAFT — PHYSICIAN VERIFICATION REQUIRED
            </h4>
            <p className="text-amber-800/90 dark:text-amber-200/90 text-[11px]">
              Review the synthesized draft summary below against original patient intake answers before signing off.
            </p>
          </div>
        </div>

        <Badge variant={status === "VERIFIED" ? "verified" : "warning"}>
          Status: {status}
        </Badge>
      </div>

      {successMessage && (
        <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-700 dark:text-emerald-300 text-center">
          {successMessage}
        </div>
      )}

      {/* Red Flags Alert Box */}
      {summary.redFlags && summary.redFlags.length > 0 && (
        <Card className="border-rose-500/40 bg-rose-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-rose-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 animate-pulse" />
              Patient-Reported Red Flag Alerts ({summary.redFlags.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-1 text-rose-950 dark:text-rose-200">
            {summary.redFlags.map((rf, idx) => (
              <p key={idx} className="font-medium">• {rf}</p>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Section-by-Section Editable Clinical Summary */}
      <Card className="border-border">
        <CardHeader className="pb-3 border-b border-border/50">
          <CardTitle className="text-sm font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-emerald-600" />
              <span>Structured Clinical Summary (Editable by Physician)</span>
            </div>
            <Badge variant="outline" className="text-[10px]">
              Physician Override Enabled
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-4 text-xs">
          {/* Chief Complaint */}
          <div className="space-y-1">
            <label className="font-bold text-foreground block">Chief Complaint:</label>
            <input
              value={summary.chiefComplaint}
              onChange={(e) => handleFieldChange("chiefComplaint", e.target.value)}
              className="w-full rounded-lg border border-input bg-background p-2 text-xs font-medium"
            />
          </div>

          {/* History of Present Illness */}
          <div className="space-y-1">
            <label className="font-bold text-foreground block">History of Present Illness (HPI Narrative):</label>
            <textarea
              rows={3}
              value={summary.historyOfPresentIllness}
              onChange={(e) => handleFieldChange("historyOfPresentIllness", e.target.value)}
              className="w-full rounded-lg border border-input bg-background p-2 text-xs leading-relaxed"
            />
          </div>

          {/* Medical & Surgical History */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-foreground block">Past Medical History (comma-separated):</label>
              <input
                value={summary.pastMedicalHistory?.join(", ") || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "pastMedicalHistory",
                    e.target.value.split(",").map((s) => s.trim())
                  )
                }
                className="w-full rounded-lg border border-input bg-background p-2 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground block">Past Surgical History (comma-separated):</label>
              <input
                value={summary.pastSurgicalHistory?.join(", ") || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "pastSurgicalHistory",
                    e.target.value.split(",").map((s) => s.trim())
                  )
                }
                className="w-full rounded-lg border border-input bg-background p-2 text-xs"
              />
            </div>
          </div>

          {/* Current Medications & Allergies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-foreground block">Current Medications:</label>
              <input
                value={summary.currentMedications?.join(", ") || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "currentMedications",
                    e.target.value.split(",").map((s) => s.trim())
                  )
                }
                className="w-full rounded-lg border border-input bg-background p-2 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground block">Known Allergies:</label>
              <input
                value={summary.allergyHistory?.join(", ") || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "allergyHistory",
                    e.target.value.split(",").map((s) => s.trim())
                  )
                }
                className="w-full rounded-lg border border-input bg-background p-2 text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ORIGINAL PATIENT RAW RESPONSES VIEWER */}
      <Card className="border-border">
        <CardHeader className="pb-3 border-b border-border/50">
          <button
            type="button"
            onClick={() => setShowRawAnswers(!showRawAnswers)}
            className="w-full flex items-center justify-between text-xs font-bold text-foreground"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-teal-600" />
              <span>Original Patient Intake Transcript & Unedited Responses</span>
            </div>
            {showRawAnswers ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </CardHeader>

        {showRawAnswers && (
          <CardContent className="pt-4 space-y-2 text-xs max-h-72 overflow-y-auto">
            {Object.keys(rawAnswers).length === 0 ? (
              <p className="text-muted-foreground italic">No raw responses available.</p>
            ) : (
              Object.entries(rawAnswers).map(([k, v]) => (
                <div key={k} className="p-2 rounded bg-muted/30 border border-border flex justify-between gap-2">
                  <span className="font-bold text-teal-600 uppercase text-[10px]">{k}:</span>
                  <span className="text-foreground text-[11px] truncate">{Array.isArray(v) ? v.join(", ") : String(v)}</span>
                </div>
              ))
            )}
          </CardContent>
        )}
      </Card>

      {/* DOCTOR CLINICAL DECISION & VERIFICATION PANEL */}
      <Card className="border-emerald-500/30 bg-emerald-500/5">
        <CardHeader className="pb-3 border-b border-emerald-500/20">
          <CardTitle className="text-sm font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Physician Diagnosis, Clinical Notes & Sign-Off
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-foreground block">Provisional Clinical Impression / Diagnosis:</label>
            <input
              value={provisionalDiagnosis}
              onChange={(e) => setProvisionalDiagnosis(e.target.value)}
              placeholder="e.g. Non-Ulcer Dyspepsia (K30), Gastritis"
              className="w-full rounded-lg border border-input bg-card p-2 text-xs font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-foreground block">Recommended Treatment & Clinical Management Plan:</label>
            <textarea
              rows={2}
              value={recommendedPlan}
              onChange={(e) => setRecommendedPlan(e.target.value)}
              placeholder="e.g. Tab Pantoprazole 40mg 1-0-0 before meals x 14 days, bland diet advice..."
              className="w-full rounded-lg border border-input bg-card p-2 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-foreground block">Physician Verification Notes:</label>
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Internal clinical sign-off notes..."
              className="w-full rounded-lg border border-input bg-card p-2 text-xs"
            />
          </div>

          {/* Action Buttons: [Accept], [Edit], [Reject] */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <Button
                variant="doctor"
                size="sm"
                onClick={() => executeDoctorAction("ACCEPT")}
                disabled={isSubmitting}
                className="gap-1.5 font-bold shadow-md"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>[Accept & Sign-Off]</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => executeDoctorAction("EDIT")}
                disabled={isSubmitting}
                className="gap-1.5 border-teal-500/40 text-teal-600"
              >
                <Edit3 className="h-4 w-4" />
                <span>[Save Edits]</span>
              </Button>
            </div>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => executeDoctorAction("REJECT")}
              disabled={isSubmitting}
              className="gap-1.5"
            >
              <XCircle className="h-4 w-4" />
              <span>[Reject Case]</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
