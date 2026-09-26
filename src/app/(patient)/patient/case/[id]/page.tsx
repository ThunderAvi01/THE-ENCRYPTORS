import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-guards";
import { connectToDatabase } from "@/lib/mongodb";
import { CaseRecord } from "@/models/CaseRecord";
import { ClinicalSession } from "@/models/ClinicalSession";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ClinicalSafetyBanner } from "@/components/safety/ClinicalSafetyBanner";
import {
  ChevronLeft,
  FileCheck2,
  Stethoscope,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FileScan,
  HeartPulse,
} from "lucide-react";

import mongoose from "mongoose";
import { MOCK_PATIENT_DATA } from "@/lib/mockData";

interface PatientCaseViewPageProps {
  params: Promise<{ id: string }>;
}

export default async function PatientCaseViewPage({ params }: PatientCaseViewPageProps) {
  const user = await getCurrentUser();
  if (!user || user.role !== "PATIENT") {
    redirect("/login");
  }

  const { id } = await params;
  await connectToDatabase();

  const isValidObjectId = mongoose.Types.ObjectId.isValid(id);

  let rawCase = isValidObjectId
    ? await CaseRecord.findOne({ _id: id, patientId: user.id })
    : null;

  // Graceful fallback for mock/demo cases (e.g., "case-881")
  if (!rawCase) {
    const demoCase = MOCK_PATIENT_DATA.previousCases.find((c) => c.id === id);
    if (demoCase || id.startsWith("case-")) {
      rawCase = {
        _id: id,
        caseNumber: demoCase?.caseNumber || "CASE-2026-081",
        chiefComplaint: demoCase?.chiefComplaint || "Upper abdominal burning discomfort & postprandial acidity",
        ayushSystem: "ALLOPATHY / AYURVEDA",
        severity: demoCase?.severity || "MODERATE",
        status: (demoCase?.status === "VERIFIED_BY_DOCTOR" ? "VERIFIED" : demoCase?.status) || "VERIFIED",
        createdAt: new Date(),
        updatedAt: new Date(),
        intakeSummary: { duration: "3 Days", onset: "Gradual" },
      } as any;
    } else {
      notFound();
    }
  }

  if (!rawCase) {
    notFound();
  }
  const caseRecord = rawCase;

  // Find linked clinical session
  const session = isValidObjectId
    ? await ClinicalSession.findOne({
        patientId: user.id,
        status: "COMPLETED",
      }).sort({ completedAt: -1 })
    : null;

  const history = session?.clinicalHistory;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header Navigation */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/patient/dashboard">
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Portal</span>
            </Button>
          </Link>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <span className="font-bold text-sm text-foreground hidden sm:inline">
            Arogya<span className="text-teal-600">Intake</span> • Case #{caseRecord.caseNumber}
          </span>
        </div>

        <Badge variant="clinical">{caseRecord.ayushSystem}</Badge>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto space-y-6">
        <ClinicalSafetyBanner compact />

        {/* Case Banner */}
        <div className="p-6 rounded-2xl border border-teal-500/30 bg-gradient-to-br from-teal-500/10 via-card to-cyan-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <StatusBadge status={caseRecord.status} />
              <span className="text-xs font-semibold text-muted-foreground">
                Submitted on {new Date(caseRecord.createdAt).toISOString().split("T")[0]}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {caseRecord.chiefComplaint}
            </h2>
            <p className="text-xs text-muted-foreground">
              Structured clinical history object compiled and registered in MongoDB.
            </p>
          </div>
        </div>

        {/* Structured History Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 border-border space-y-2 text-xs">
            <span className="text-muted-foreground font-semibold uppercase tracking-wider block text-[10px]">
              Symptom Details
            </span>
            <p className="font-bold text-foreground">Duration: {history?.duration || String(caseRecord.intakeSummary?.duration || "Not specified")}</p>
            <p className="text-muted-foreground">Severity: {history?.severity || "MODERATE"}</p>
            <p className="text-muted-foreground">Onset: {history?.onset || "Gradual"}</p>
            <p className="text-muted-foreground">Pain Character: {history?.character || "Not specified"}</p>
          </Card>

          <Card className="p-4 border-border space-y-2 text-xs">
            <span className="text-muted-foreground font-semibold uppercase tracking-wider block text-[10px]">
              Aggravating & Relieving Factors
            </span>
            <p className="font-bold text-foreground">Aggravating: {history?.aggravatingFactors?.join(", ") || "None specified"}</p>
            <p className="text-muted-foreground">Relieving: {history?.relievingFactors?.join(", ") || "None specified"}</p>
            <p className="text-muted-foreground">Associated Symptoms: {history?.associatedSymptoms?.join(", ") || "None"}</p>
          </Card>
        </div>

        {/* Medical History & Allergies */}
        <Card className="p-4 border-border text-xs space-y-3">
          <h3 className="font-bold text-foreground text-sm border-b border-border/50 pb-2">
            Medical History, Medications & Allergies
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="font-bold text-foreground block">Past Conditions:</span>
              <p className="text-muted-foreground">{history?.pastMedicalHistory?.join(", ") || "None recorded"}</p>
            </div>
            <div>
              <span className="font-bold text-foreground block">Current Medications:</span>
              <p className="text-muted-foreground">
                {history?.currentMedications?.map((m) => m.name).join(", ") || "None recorded"}
              </p>
            </div>
            <div>
              <span className="font-bold text-foreground block">Known Allergies:</span>
              <p className="text-muted-foreground">
                {history?.allergies?.map((a) => a.substance).join(", ") || "No known allergies"}
              </p>
            </div>
          </div>
        </Card>

        {/* Ayurveda Dashavidha Section if applicable */}
        {history?.ayurvedaSpecifics && (
          <Card className="p-4 border-emerald-500/30 bg-emerald-500/5 text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
              <h3 className="font-bold text-emerald-950 dark:text-emerald-200 text-sm">
                Ayurveda Dashavidha Pariksha Details
              </h3>
              <Badge variant="verified">AYUSH Ayurveda</Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-muted-foreground block text-[10px]">Prakriti:</span>
                <span className="font-bold text-foreground">{history.ayurvedaSpecifics.prakriti || "VATA_PITTA"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Vikriti:</span>
                <span className="font-bold text-foreground">{history.ayurvedaSpecifics.vikriti || "PITTA_VRIDDHI"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Sattva:</span>
                <span className="font-bold text-foreground">{history.ayurvedaSpecifics.sattva || "MADHYAMA"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Agni / Ahara Shakti:</span>
                <span className="font-bold text-foreground">{history.ayurvedaSpecifics.aharaShakti || "VISHAMA"}</span>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
