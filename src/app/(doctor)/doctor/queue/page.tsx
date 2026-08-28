import React from "react";
import Link from "next/link";
import { ArrowLeft, Stethoscope, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VerificationQueueItem } from "@/components/doctor/VerificationQueueItem";
import { DoctorReviewPanel } from "@/components/doctor/DoctorReviewPanel";
import { ClinicalSummaryView } from "@/components/ai/ClinicalSummaryView";
import { ClinicalSafetyBanner } from "@/components/safety/ClinicalSafetyBanner";

export default function DoctorQueuePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="verified">Licensed Physician Portal</Badge>
          <Badge variant="outline">Case Verification</Badge>
        </div>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Stethoscope className="h-7 w-7 text-emerald-600" />
          Clinical Verification Queue
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Review structured history drafts, inspect digitized prescription OCR, and sign clinical approvals.
        </p>
      </div>

      <ClinicalSafetyBanner compact />

      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Pending Clinical Reviews (2 Cases Waiting)
        </h3>
        <div className="space-y-3">
          <VerificationQueueItem
            patientName="Avishek M."
            ageGender="34M"
            complaint="Epigastric Postprandial Pain"
            duration="3 Days"
            status="PENDING_REVIEW"
            timeAgo="12m ago"
          />
          <VerificationQueueItem
            patientName="Rajesh K."
            ageGender="48M"
            complaint="Persistent Dry Cough & Low Grade Pyrexia"
            duration="1 Week"
            status="PENDING_REVIEW"
            timeAgo="35m ago"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        <ClinicalSummaryView />
        <DoctorReviewPanel />
      </div>
    </div>
  );
}
