import React from "react";
import Link from "next/link";
import {
  Stethoscope,
  Sparkles,
  ShieldCheck,
  FileText,
  FileScan,
  Share2,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  Lock,
  Layers,
  Activity,
  HeartPulse,
  BrainCircuit,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CaseTimelineStepper, StepItem } from "@/components/clinical/CaseTimelineStepper";
import { ClinicalSafetyBanner } from "@/components/safety/ClinicalSafetyBanner";
import { AIAssistantChatWidget } from "@/components/ai/AIAssistantChatWidget";
import { ClinicalSummaryView } from "@/components/ai/ClinicalSummaryView";
import { DocumentUploader } from "@/components/documents/DocumentUploader";
import { OCRPreview } from "@/components/documents/OCRPreview";
import { DoctorReviewPanel } from "@/components/doctor/DoctorReviewPanel";
import { VerificationQueueItem } from "@/components/doctor/VerificationQueueItem";
import { ConsentAgreementModal } from "@/components/consent/ConsentAgreementModal";
import { FHIRViewer } from "@/components/fhir/FHIRViewer";
import { VitalsTracker } from "@/components/clinical/VitalsTracker";
import { SymptomPicker } from "@/components/patient/SymptomPicker";
import { AppointmentBookingWidget } from "@/components/appointments/AppointmentBookingWidget";
import { FacilityMapLocator } from "@/components/maps/FacilityMapLocator";
import { ClinicalChatWidget } from "@/components/chat/ClinicalChatWidget";

const PIPELINE_STEPS: StepItem[] = [
  {
    id: "step-1",
    title: "1. Digital Consent",
    description: "Informed digital authorization complying with DPDP & ABDM norms.",
    status: "completed",
  },
  {
    id: "step-2",
    title: "2. Structured Intake",
    description: "Guided symptom selection, vitals logging, and chronological complaint capture.",
    status: "completed",
  },
  {
    id: "step-3",
    title: "3. AI History Dialogue",
    description: "Agnostic conversational assistant gathering thorough clinical context.",
    status: "current",
  },
  {
    id: "step-4",
    title: "4. Document Digitization",
    description: "OCR extraction of handwritten prescriptions and lab reports.",
    status: "upcoming",
  },
  {
    id: "step-5",
    title: "5. Clinical Summary",
    description: "Synthesized HPI narrative draft with red flag emergency screening.",
    status: "upcoming",
  },
  {
    id: "step-6",
    title: "6. Doctor Verification",
    description: "Licensed practitioner review, provisional diagnosis, and clinical sign-off.",
    status: "upcoming",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-teal-500/10 via-background to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-400/15 via-transparent to-transparent pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-xs font-semibold text-teal-800 dark:text-teal-300">
              <Sparkles className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              <span>SIH 2026 Problem Statement SIH26047</span>
              <span className="text-teal-400">•</span>
              <span>Healthcare Innovation</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Intelligent Clinical Case-Taking &{" "}
              <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Medical Record Digitization
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Empowering clinicians and patients with structured history taking, OCR document parsing, and FHIR interoperability — upholding strict medical safety with zero autonomous prescriptions.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Link href="/case-taking" className="w-full sm:w-auto">
                <Button variant="clinical" size="lg" className="w-full sm:w-auto gap-2 shadow-lg">
                  <HeartPulse className="h-5 w-5" />
                  <span>Start Patient Case Intake</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/doctor/queue" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
                  <UserCheck className="h-5 w-5 text-emerald-600" />
                  <span>Doctor Verification Queue</span>
                </Button>
              </Link>
            </div>

            {/* Clinical Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-medium text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Doctor Verification Enforced</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Share2 className="h-4 w-4 text-teal-600" />
                <span>HL7 FHIR R4 Standard</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BrainCircuit className="h-4 w-4 text-cyan-600" />
                <span>Agnostic LLM Architecture</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-amber-500" />
                <span>DPDP & ABDM Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MANDATORY SAFETY GUARDRAIL BANNER */}
      <section id="safety" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-6 mb-12">
        <ClinicalSafetyBanner />
      </section>

      {/* 3. CLINICAL PIPELINE WORKFLOW */}
      <section id="pipeline" className="py-12 bg-slate-50/60 dark:bg-slate-900/30 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Layers className="h-4 w-4 text-teal-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
                  Standardized Clinical Flow
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                The 6-Stage Case-Taking Pipeline
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
              From informed consent to physician sign-off, every stage is audited, structured, and clinician-reviewed.
            </p>
          </div>

          <CaseTimelineStepper steps={PIPELINE_STEPS} />
        </div>
      </section>

      {/* 4. LIVE INTERACTIVE DEMONSTRATION SECTION */}
      <section className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Interactive Clinical Modules Preview
          </h2>
          <p className="text-sm text-muted-foreground">
            Experience the cohesive modules engineered for the SIH26047 Patient Case-Taking platform.
          </p>
        </div>

        {/* Grid of Interactive Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Patient Intake & AI History Collection */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="clinical">Module 01</Badge>
                <h3 className="text-lg font-bold text-foreground">
                  Informed Consent & Patient Case Intake
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Captures digital signature authorization and fast structured symptom tagging.
              </p>
            </div>

            <ConsentAgreementModal />
            <SymptomPicker />
            <VitalsTracker />
            <AIAssistantChatWidget />
          </div>

          {/* Right Column: OCR Digitization, Summary & Doctor Verification */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="verified">Module 02</Badge>
                <h3 className="text-lg font-bold text-foreground">
                  Digitization, Synthesis & Doctor Sign-Off
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Digitizes handwritten documents into structured records and enforces licensed verification.
              </p>
            </div>

            <div id="digitization">
              <DocumentUploader />
            </div>
            <OCRPreview />
            <ClinicalSummaryView />
            <div id="doctor-verification">
              <DoctorReviewPanel />
            </div>
          </div>
        </div>
      </section>

      {/* 5. SUPPORTING MODULES & FHIR INTEROPERABILITY */}
      <section id="fhir" className="py-16 bg-slate-50/60 dark:bg-slate-900/30 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Share2 className="h-4 w-4 text-teal-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
                Ecosystem & Interoperability
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Supporting Healthcare Modules & ABDM Integration
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Integrated doctor discovery, telemedicine, clinic locator, and HL7 FHIR R4 exporting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AppointmentBookingWidget />
            <FacilityMapLocator />
            <ClinicalChatWidget />
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-teal-600" />
                  <h4 className="text-sm font-semibold text-foreground">Doctor Queue</h4>
                </div>
                <Badge variant="verified">Live</Badge>
              </div>
              <div className="space-y-2">
                <VerificationQueueItem
                  patientName="Avishek M."
                  ageGender="34M"
                  complaint="Epigastric Pain"
                  duration="3 Days"
                  status="PENDING_REVIEW"
                  timeAgo="10m ago"
                />
              </div>
            </div>
          </div>

          {/* FHIR Export Preview */}
          <div className="mt-8">
            <FHIRViewer />
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION & ARCHITECTURE SUMMARY */}
      <section className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="p-8 rounded-2xl border border-teal-500/30 bg-gradient-to-br from-teal-500/10 via-background to-cyan-500/10 space-y-4 max-w-4xl mx-auto shadow-sm">
          <div className="inline-flex items-center justify-center p-3 rounded-xl bg-teal-600 text-white shadow-md">
            <Stethoscope className="h-6 w-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Ready for Phase 1 Implementation
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            The foundation, TypeScript schema models, Mongoose architecture, Tailwind design tokens, agnostic AI abstractions, and clinical safety guardrails are configured and ready.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/case-taking">
              <Button variant="clinical" size="lg" className="gap-2">
                <HeartPulse className="h-4 w-4" />
                Launch Case Taking Portal
              </Button>
            </Link>
            <Link href="/doctor/queue">
              <Button variant="outline" size="lg" className="gap-2">
                <UserCheck className="h-4 w-4 text-emerald-600" />
                Launch Doctor Queue
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
