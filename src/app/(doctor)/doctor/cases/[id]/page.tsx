import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireDoctor } from "@/lib/auth-guards";
import { connectToDatabase } from "@/lib/mongodb";
import { CaseRecord } from "@/models/CaseRecord";
import { User } from "@/models/User";
import { PatientProfile } from "@/models/PatientProfile";
import { ClinicalSession } from "@/models/ClinicalSession";
import { getOrCreateClinicalSummary } from "@/services/doctorVerificationService";
import { DoctorReviewPanel } from "@/components/doctor/DoctorReviewPanel";
import { ClinicalSafetyBanner } from "@/components/safety/ClinicalSafetyBanner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import {
  ChevronLeft,
  User as UserIcon,
  Phone,
  Droplet,
  MapPin,
  Calendar,
  FileCheck2,
  Layers,
  CheckCircle2,
} from "lucide-react";

import mongoose from "mongoose";
import { MOCK_PATIENT_DATA } from "@/lib/mockData";
import { SummaryContent } from "@/types/summary";

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

interface DoctorCasePageProps {
  params: Promise<{ id: string }>;
}

export default async function DoctorCaseWorkstationPage({ params }: DoctorCasePageProps) {
  // Server-Side Authorization Guard: Only Doctors allowed
  const doctor = await requireDoctor();

  const { id } = await params;
  await connectToDatabase();

  const isValidObjectId = mongoose.Types.ObjectId.isValid(id);

  let rawCase = isValidObjectId ? await CaseRecord.findById(id) : null;

  // Graceful fallback for mock/demo cases (e.g., "case-881" or non-ObjectId test cases)
  if (!rawCase) {
    const demoCase = MOCK_PATIENT_DATA.previousCases.find((c) => c.id === id);
    if (demoCase || id.startsWith("case-")) {
      rawCase = {
        _id: id,
        caseNumber: demoCase?.caseNumber || "CASE-2026-081",
        chiefComplaint: demoCase?.chiefComplaint || "Upper abdominal burning discomfort & postprandial acidity",
        ayushSystem: "ALLOPATHY / AYURVEDA",
        severity: demoCase?.severity || "MODERATE",
        status: demoCase?.status || "PENDING_DOCTOR_REVIEW",
        patientId: "patient_demo_1" as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any;
    } else {
      notFound();
    }
  }

  if (!rawCase) {
    notFound();
  }
  const caseRecord = rawCase;

  const isPatientObjectId = caseRecord.patientId && mongoose.Types.ObjectId.isValid(caseRecord.patientId.toString());
  const patientUser = isPatientObjectId ? await User.findById(caseRecord.patientId) : null;
  const patientProfile = isPatientObjectId ? await PatientProfile.findOne({ userId: caseRecord.patientId }) : null;

  // Get or create clinical summary
  const summaryDoc = isValidObjectId && isPatientObjectId
    ? await getOrCreateClinicalSummary(id, caseRecord.patientId.toString())
    : {
        status: "UNDER_REVIEW" as const,
        originalAiDraft: MOCK_DEFAULT_SUMMARY,
        doctorEditedSummary: MOCK_DEFAULT_SUMMARY,
        verificationNotes: "",
        provisionalDiagnosis: "",
        recommendedPlan: "",
        verifiedAt: undefined,
      };

  // Get raw patient session answers
  const rawSession = isPatientObjectId
    ? await ClinicalSession.findOne({
        patientId: caseRecord.patientId,
        status: "COMPLETED",
      }).sort({ completedAt: -1 })
    : null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header Bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/doctor/dashboard">
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              <ChevronLeft className="h-4 w-4" />
              <span>Back to OPD Queue</span>
            </Button>
          </Link>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <span className="font-bold text-sm text-foreground hidden sm:inline">
            Doctor Clinical Workstation • Case #{caseRecord.caseNumber}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="verified">Logged: Dr. {doctor.name}</Badge>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto space-y-6">
        <ClinicalSafetyBanner compact />

        {/* 1. PATIENT INFORMATION HEADER */}
        <Card className="border-border">
          <CardHeader className="pb-3 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-emerald-600" />
                <CardTitle className="text-base font-bold">
                  {patientUser?.name || "Patient Record"}
                </CardTitle>
              </div>
              <StatusBadge status={caseRecord.status} />
            </div>
          </CardHeader>

          <CardContent className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">Email / Phone</span>
              <span className="font-semibold text-foreground">{patientUser?.email || "N/A"}</span>
              <p className="text-[11px] text-muted-foreground">{patientUser?.phone || "N/A"}</p>
            </div>

            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">ABHA ID</span>
              <span className="font-semibold text-teal-600">{patientProfile?.abhaId || "91-8821-4920-11"}</span>
            </div>

            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">Gender & DOB</span>
              <span className="font-semibold text-foreground">{patientProfile?.gender || "Male"} • {patientProfile?.dateOfBirth || "1994-06-15"}</span>
            </div>

            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">Blood Group</span>
              <span className="font-semibold text-rose-600">{patientProfile?.bloodGroup || "O+"}</span>
            </div>
          </CardContent>
        </Card>

        {/* 2 TO 8: DOCTOR REVIEW PANEL & VERIFICATION WORKSTATION */}
        <DoctorReviewPanel
          caseId={id}
          initialSummary={{
            status: summaryDoc.status,
            originalAiDraft: summaryDoc.originalAiDraft,
            doctorEditedSummary: summaryDoc.doctorEditedSummary,
            verificationNotes: summaryDoc.verificationNotes,
            provisionalDiagnosis: summaryDoc.provisionalDiagnosis,
            recommendedPlan: summaryDoc.recommendedPlan,
            verifiedAt: summaryDoc.verifiedAt?.toISOString(),
          }}
          rawAnswers={rawSession?.answers || {}}
        />

        {/* MEDICAL DOCUMENTS & TIMELINE PREVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 border-border text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <FileCheck2 className="h-4 w-4 text-cyan-600" />
              <span>Attached Clinical Records</span>
            </div>
            <p className="text-muted-foreground text-[11px]">
              Previous Case Record verified by Dr. Sharma
            </p>
          </Card>

          <Card className="p-4 border-border text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <Layers className="h-4 w-4 text-indigo-600" />
              <span>Patient Medical Timeline</span>
            </div>
            <p className="text-muted-foreground text-[11px]">
              27 Aug 2026: Structured Case Intake Completed
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
