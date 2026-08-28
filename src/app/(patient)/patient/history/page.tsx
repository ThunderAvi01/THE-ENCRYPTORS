import React from "react";
import Link from "next/link";
import { ArrowLeft, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PatientCaseCard } from "@/components/patient/PatientCaseCard";

export default function PatientHistoryPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <Link href="/case-taking">
          <Button variant="clinical" size="sm" className="gap-1 text-xs">
            <Plus className="h-4 w-4" />
            New Case Intake
          </Button>
        </Link>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <User className="h-7 w-7 text-teal-600" />
          My Clinical Case History
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          View all your previous case intakes, attached digitized records, and verified doctor notes.
        </p>
      </div>

      <div className="space-y-3">
        <PatientCaseCard
          caseId="CASE-2026-081"
          date="27 Aug 2026"
          chiefComplaint="Epigastric Pain & Acidity after meals"
          status="AI_INTAKE_COMPLETED"
          documentsCount={2}
        />
        <PatientCaseCard
          caseId="CASE-2026-042"
          date="14 May 2026"
          chiefComplaint="Seasonal Allergic Rhinitis & Mild Sneezing"
          status="VERIFIED_BY_DOCTOR"
          documentsCount={1}
        />
      </div>
    </div>
  );
}
