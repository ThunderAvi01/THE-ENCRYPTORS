"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileCode,
  ShieldCheck,
  ChevronLeft,
  ArrowRight,
  Database,
  Share2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Terminal,
  Activity,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { FHIRService } from "@/services/fhirService";
import { ABDMService } from "@/services/abdmService";

export default function FHIRJudgeDemoPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmissionResult, setTransmissionResult] = useState<any>(null);

  // Demo Clinical Case Data
  const demoCase = {
    id: "case-demo-2026-991",
    patientName: "Rajesh Kumar",
    patientAbhaId: "rajesh.kumar99@abdm",
    gender: "MALE",
    dateOfBirth: "1985-04-12",
    chiefComplaint: "Upper abdominal burning discomfort and dry cough",
    severity: "MODERATE",
    vitals: {
      systolicBp: 128,
      diastolicBp: 82,
      heartRate: 78,
      spo2: 98,
      temperature: 37.1,
    },
    pastMedicalHistory: ["Hypertension (High BP)"],
    medications: ["Metformin 500mg", "Amlodipine 5mg"],
    allergies: ["Penicillin allergy"],
    documents: [
      {
        id: "doc-ocr-101",
        fileName: "Blood_Report_Aug2026.pdf",
        ocrExtractedText: "Blood Glucose Fasting: 110 mg/dL. HbA1c: 6.4%. Normal renal function.",
      },
    ],
    createdAt: "2026-08-28T10:30:00.000Z",
  };

  // Generate FHIR R4 Bundle
  const fhirBundle = FHIRService.generateCaseBundle(demoCase);
  const fhirJsonString = JSON.stringify(fhirBundle, null, 2);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(fhirJsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTransmitToMockABDMEndpoint = async () => {
    setIsTransmitting(true);
    setTransmissionResult(null);

    try {
      const result = await FHIRService.pushToMockABDMEndpoint(fhirBundle);
      setTransmissionResult(result);
    } catch (err) {
      console.error("Mock transmission error:", err);
    } finally {
      setIsTransmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/patient/dashboard">
            <Button variant="ghost" size="sm" className="gap-1 text-xs font-bold">
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Portal</span>
            </Button>
          </Link>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <span className="font-bold text-sm text-foreground">
            SIH26047 • FHIR R4 & ABDM Interoperability Judge Sandbox Demo
          </span>
        </div>

        <Badge variant="warning" className="uppercase text-[10px] font-bold">
          SANDBOX DEMO MODE
        </Badge>
      </header>

      <main className="flex-1 p-4 sm:p-6 max-w-6xl w-full mx-auto space-y-6">
        {/* Sandbox Notice Banner */}
        <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold text-amber-900 dark:text-amber-100 block">
                Official SIH Judge Verification Panel — Healthcare Interoperability Sandbox
              </span>
              <span className="text-[11px] text-amber-800 dark:text-amber-300">
                This page demonstrates the end-to-end data pipeline from internal clinical history to HL7 FHIR R4 standard JSON and ABDM gateway exchange.
              </span>
            </div>
          </div>

          <Badge variant="outline" className="shrink-0 border-amber-500/40 text-amber-700 dark:text-amber-300 font-bold">
            FHIR R4 Compliant
          </Badge>
        </div>

        {/* Step Progression Stepper */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
          {[
            { step: 1, title: "1. Patient & Consent" },
            { step: 2, title: "2. Clinical History" },
            { step: 3, title: "3. FHIR R4 Mapper" },
            { step: 4, title: "4. ABDM Gateway" },
          ].map((s) => (
            <button
              key={s.step}
              type="button"
              onClick={() => setActiveStep(s.step)}
              className={`p-3 rounded-xl border transition ${
                activeStep === s.step
                  ? "bg-teal-600 text-white border-teal-600 shadow-md"
                  : "bg-card text-muted-foreground border-border hover:border-teal-500/50"
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>

        {/* STEP 1: PATIENT & CONSENT */}
        {activeStep === 1 && (
          <Card className="border-border">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-teal-600" />
                Step 1: Patient Identity & Digital Consent Authorization
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-1">
                  <span className="text-muted-foreground font-bold">Patient Name:</span>
                  <p className="text-sm font-black">{demoCase.patientName}</p>
                  <p className="text-[11px] text-teal-600 font-semibold">ABHA ID: {demoCase.patientAbhaId}</p>
                </div>

                <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-1">
                  <span className="text-emerald-700 dark:text-emerald-300 font-bold">Consent Status:</span>
                  <p className="text-sm font-black text-emerald-800 dark:text-emerald-200">GRANTED (Active)</p>
                  <p className="text-[11px] text-muted-foreground">
                    Scope: Clinical Intake, OCR Processing, Doctor Sharing, ABDM FHIR Sharing
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-3 border-t border-border/50 flex justify-end">
              <Button variant="clinical" size="sm" onClick={() => setActiveStep(2)} className="gap-1 font-bold text-xs">
                <span>Next: Clinical History</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* STEP 2: CLINICAL HISTORY */}
        {activeStep === 2 && (
          <Card className="border-border">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Activity className="h-4 w-4 text-teal-600" />
                Step 2: Internal Structured Clinical Data & Vitals
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs">
              <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-1">
                <span className="font-bold text-teal-600">Chief Complaint:</span>
                <p className="font-semibold text-foreground">{demoCase.chiefComplaint}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-2.5 rounded-lg border border-border text-center">
                  <span className="text-[10px] text-muted-foreground block">Heart Rate</span>
                  <span className="font-black text-sm text-teal-600">{demoCase.vitals.heartRate} bpm</span>
                </div>
                <div className="p-2.5 rounded-lg border border-border text-center">
                  <span className="text-[10px] text-muted-foreground block">Blood Pressure</span>
                  <span className="font-black text-sm text-teal-600">
                    {demoCase.vitals.systolicBp}/{demoCase.vitals.diastolicBp}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg border border-border text-center">
                  <span className="text-[10px] text-muted-foreground block">Oxygen (SpO2)</span>
                  <span className="font-black text-sm text-teal-600">{demoCase.vitals.spo2}%</span>
                </div>
                <div className="p-2.5 rounded-lg border border-border text-center">
                  <span className="text-[10px] text-muted-foreground block">Temperature</span>
                  <span className="font-black text-sm text-teal-600">{demoCase.vitals.temperature}°C</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-3 border-t border-border/50 flex justify-end">
              <Button variant="clinical" size="sm" onClick={() => setActiveStep(3)} className="gap-1 font-bold text-xs">
                <span>Next: Convert to FHIR R4</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* STEP 3: FHIR R4 MAPPER JSON */}
        {activeStep === 3 && (
          <Card className="border-border">
            <CardHeader className="pb-3 border-b border-border/50 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <FileCode className="h-4 w-4 text-teal-600" />
                Step 3: FHIR R4 Bundle JSON Output
              </CardTitle>
              <Button variant="outline" size="sm" onClick={handleCopyJson} className="h-7 text-[11px] gap-1 font-bold">
                <Copy className="h-3 w-3" />
                <span>{copied ? "Copied!" : "Copy FHIR JSON"}</span>
              </Button>
            </CardHeader>

            <CardContent className="pt-4">
              <div className="rounded-xl border border-border bg-slate-950 p-4 font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-[350px]">
                <pre>{fhirJsonString}</pre>
              </div>
            </CardContent>
            <CardFooter className="pt-3 border-t border-border/50 flex justify-end">
              <Button variant="clinical" size="sm" onClick={() => setActiveStep(4)} className="gap-1 font-bold text-xs">
                <span>Next: Test ABDM Endpoint</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* STEP 4: ABDM ENDPOINT TRANSMISSION */}
        {activeStep === 4 && (
          <Card className="border-border">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Share2 className="h-4 w-4 text-teal-600" />
                Step 4: Transmit FHIR Bundle to Mock ABDM / HIS Gateway
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-xs">
              <p className="text-muted-foreground leading-relaxed">
                Test transmitting the generated FHIR R4 Bundle to the mock ABDM Health Information Exchange Gateway.
              </p>

              <Button
                variant="clinical"
                onClick={handleTransmitToMockABDMEndpoint}
                disabled={isTransmitting}
                className="gap-2 font-bold text-xs"
              >
                <Share2 className="h-4 w-4" />
                <span>{isTransmitting ? "Transmitting..." : "Transmit to Mock ABDM Gateway"}</span>
              </Button>

              {transmissionResult && (
                <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 space-y-2 text-emerald-950 dark:text-emerald-200 animate-in fade-in-50">
                  <div className="flex items-center gap-2 font-bold text-emerald-600 text-sm">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>{transmissionResult.status}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold pt-1">
                    <p>Transaction ID: <strong className="text-foreground">{transmissionResult.abdmTransactionId}</strong></p>
                    <p>FHIR Resources Transmitted: <strong className="text-foreground">{transmissionResult.fhirResourceCount}</strong></p>
                  </div>

                  <p className="text-[11px] italic pt-1 border-t border-emerald-500/20 text-muted-foreground">
                    {transmissionResult.note}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
