"use client";

import React from "react";
import Link from "next/link";
import {
  Stethoscope,
  ShieldCheck,
  ShieldAlert,
  HeartPulse,
  Sparkles,
  ArrowRight,
  UserCheck,
  Lock,
  Activity,
  Calendar,
  MessageSquare,
  FileText,
  CheckCircle2,
  FileCode2,
  Mic,
  Type,
  Hand,
  Volume2,
  Server,
  Users,
  Globe,
  Share2,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ClinicalSafetyBanner } from "@/components/safety/ClinicalSafetyBanner";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function DocumentationPage() {
  const { dict, language } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-teal-500/20 selection:text-teal-900 dark:selection:text-teal-200">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-teal-500/10 via-background to-background border-b border-border/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-400/15 via-transparent to-transparent pointer-events-none" />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-xs font-semibold text-teal-800 dark:text-teal-300">
            <BookOpen className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
            <span>{dict.documentation.heroTag}</span>
            <span className="text-teal-400">•</span>
            <span>
              {language === "hi"
                ? "व्यापक सिस्टम वर्कफ़्लो"
                : language === "bn"
                ? "সম্পূর্ণ সিস্টেম ওয়ার্কফ্লো"
                : "Comprehensive System Workflow"}
            </span>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              {language === "hi" ? (
                <>
                  <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    ArogyaIntake
                  </span>{" "}
                  कैसे काम करता है
                </>
              ) : language === "bn" ? (
                <>
                  <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    ArogyaIntake
                  </span>{" "}
                  কীভাবে কাজ করে
                </>
              ) : (
                <>
                  How{" "}
                  <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    ArogyaIntake
                  </span>{" "}
                  Works
                </>
              )}
            </h1>
            <p className="text-base sm:text-xl font-medium text-teal-700 dark:text-teal-300">
              {dict.documentation.heroSubtitle}
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {dict.documentation.heroDesc}
            </p>
          </div>

          {/* Workflow Sequence Strip */}
          <div className="pt-6">
            <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-md p-4 sm:p-6 shadow-sm overflow-x-auto">
              <div className="flex items-center justify-between min-w-[700px] text-xs font-semibold text-muted-foreground">
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600/10 text-teal-600 font-bold">
                    <Users className="h-5 w-5" />
                  </div>
                  <span>{dict.documentation.patient}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0" />

                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600/10 text-teal-600 font-bold">
                    <Mic className="h-5 w-5" />
                  </div>
                  <span>{dict.documentation.aiIntake}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0" />

                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 font-bold">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <span>{dict.documentation.safetyTriage}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0" />

                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600/10 text-cyan-600 font-bold">
                    <FileText className="h-5 w-5" />
                  </div>
                  <span>{dict.documentation.clinicalHistory}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0" />

                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600 font-bold">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <span>{dict.documentation.doctorVerification}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0" />

                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-600 font-bold">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <span>{dict.documentation.consultation}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0" />

                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600/10 text-teal-600 font-bold">
                    <Share2 className="h-5 w-5" />
                  </div>
                  <span>{dict.documentation.fhirAbdm}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/case-taking">
              <Button variant="clinical" size="lg" className="gap-2 shadow-md">
                <HeartPulse className="h-4 w-4" />
                <span>Try Patient Case Intake</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/doctor/queue">
              <Button variant="outline" size="lg" className="gap-2">
                <UserCheck className="h-4 w-4 text-emerald-600" />
                <span>Doctor Verification Station</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 9 / SAFETY BANNER AT TOP OF DOCUMENTATION */}
      <section className="mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 pt-8">
        <ClinicalSafetyBanner />
      </section>

      {/* SECTION 1 — WHAT IS AROGYAINTAKE? */}
      <section className="mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="clinical">Overview</Badge>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Core Platform Purpose
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {dict.documentation.whatIsHeading}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {dict.documentation.whatIsParagraph1}
          </p>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {dict.documentation.whatIsParagraph2}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {[
            {
              title: "Multilingual Patient Intake",
              desc: "Native support for English, Hindi, and Bengali with voice and text capabilities.",
              icon: <Globe className="h-5 w-5 text-teal-600" />,
            },
            {
              title: "Multimodal Accessibility",
              desc: "Voice recording with transcript preview, direct typing, and touch-based tile controls.",
              icon: <Mic className="h-5 w-5 text-cyan-600" />,
            },
            {
              title: "AYUSH & Allopathy Workflows",
              desc: "Deep integration for Ayurveda (Dashavidha Pariksha, Prakriti), Siddha, Unani, Naturopathy, and Allopathy.",
              icon: <Activity className="h-5 w-5 text-emerald-600" />,
            },
            {
              title: "Emergency Safety Triage",
              desc: "Deterministic rule-based safety engine detecting critical indicators independently of LLM outputs.",
              icon: <ShieldAlert className="h-5 w-5 text-amber-500" />,
            },
            {
              title: "AI Clinical History Synthesis",
              desc: "Structures unstructured patient answers into standardized HPI, Review of Systems, and Past History drafts.",
              icon: <Sparkles className="h-5 w-5 text-indigo-600" />,
            },
            {
              title: "Doctor Verification Queue",
              desc: "Physicians edit, accept, or reject AI history drafts, assign provisional diagnoses, and provide digital sign-off.",
              icon: <Stethoscope className="h-5 w-5 text-emerald-600" />,
            },
            {
              title: "Appointment Management",
              desc: "Direct scheduling with conflict prevention to eliminate doctor double-booking.",
              icon: <Calendar className="h-5 w-5 text-teal-600" />,
            },
            {
              title: "Authorized Tele-Consult Chat",
              desc: "Secure, role-based doctor-patient messaging with timestamps and read indicators.",
              icon: <MessageSquare className="h-5 w-5 text-cyan-600" />,
            },
            {
              title: "Granular Consent & DPDP",
              desc: "Patient-controlled data access compliant with India's DPDP Act & ABDM guidelines.",
              icon: <Lock className="h-5 w-5 text-amber-500" />,
            },
            {
              title: "HL7 FHIR R4 & ABDM Ready",
              desc: "Converts clinical intakes into interoperable FHIR R4 Bundles for national health exchange.",
              icon: <FileCode2 className="h-5 w-5 text-teal-600" />,
            },
          ].map((item, idx) => (
            <Card key={idx} className="border-border hover:border-teal-500/40 transition-colors p-4 space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-muted/60">{item.icon}</div>
                <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* SECTION 2 — HOW THE PATIENT JOURNEY WORKS (10 STEPS) */}
      <section className="bg-slate-50/60 dark:bg-slate-900/30 border-y border-border py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-2 text-center max-w-2xl mx-auto">
            <Badge variant="clinical">Step-by-Step Workflow</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              How the Patient Journey Works
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              A structured, verified ten-step progression from initial registration to national healthcare interoperability.
            </p>
          </div>

          <div className="space-y-6">
            {/* STEP 1 */}
            <Card className="border-border">
              <CardHeader className="pb-3 border-b border-border/50 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-white font-bold text-xs">
                    01
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">Step 1 — Patient Registration & ABHA Linkage</CardTitle>
                    <CardDescription className="text-xs">Account creation and demographic profile onboarding</CardDescription>
                  </div>
                </div>
                <Users className="h-5 w-5 text-teal-600" />
              </CardHeader>
              <CardContent className="pt-4 text-xs sm:text-sm text-muted-foreground leading-relaxed space-y-2">
                <p>
                  The patient registers securely on the platform using email or phone credentials. Demographics including date of birth, blood group, emergency contacts, and their 14-digit Ayushman Bharat Health Account (ABHA ID) are linked to establish an audited longitudinal health record.
                </p>
              </CardContent>
            </Card>

            {/* STEP 2 */}
            <Card className="border-border">
              <CardHeader className="pb-3 border-b border-border/50 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-white font-bold text-xs">
                    02
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">Step 2 — Language & Granular Informed Consent</CardTitle>
                    <CardDescription className="text-xs">Multilingual options and DPDP Act compliance</CardDescription>
                  </div>
                </div>
                <Globe className="h-5 w-5 text-teal-600" />
              </CardHeader>
              <CardContent className="pt-4 text-xs sm:text-sm text-muted-foreground leading-relaxed space-y-2">
                <p>
                  The patient selects their preferred language (English, Hindi, or Bengali). The platform presents a granular digital consent authorization conforming to the Digital Personal Data Protection (DPDP) Act.
                </p>
                <p className="text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-lg">
                  💡 <strong>Accessibility Feature:</strong> Integrated audio explainers allow patients with low literacy to listen to the consent terms aloud in their native dialect before granting digital authorization.
                </p>
              </CardContent>
            </Card>

            {/* STEP 3 */}
            <Card className="border-border">
              <CardHeader className="pb-3 border-b border-border/50 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-white font-bold text-xs">
                    03
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">Step 3 — Healthcare System Selection (AYUSH & Allopathy)</CardTitle>
                    <CardDescription className="text-xs">Traditional Indian Medicine and modern Allopathy adaptation</CardDescription>
                  </div>
                </div>
                <Activity className="h-5 w-5 text-emerald-600" />
              </CardHeader>
              <CardContent className="pt-4 text-xs sm:text-sm text-muted-foreground leading-relaxed space-y-2">
                <p>
                  Patients choose their consultation stream across <strong>Ayurveda</strong>, <strong>Yoga & Naturopathy</strong>, <strong>Unani</strong>, <strong>Siddha</strong>, <strong>Homoeopathy</strong>, or <strong>Allopathy</strong>. The intake questionnaire dynamically adapts its clinical questioning matrix according to the chosen discipline (e.g., Dashavidha Pariksha, Prakriti, and Agni questions for Ayurveda).
                </p>
              </CardContent>
            </Card>

            {/* STEP 4 */}
            <Card className="border-teal-500/40 shadow-sm">
              <CardHeader className="pb-3 border-b border-border/50 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-white font-bold text-xs">
                    04
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">Step 4 — Multimodal Clinical Case Taking</CardTitle>
                    <CardDescription className="text-xs">Voice, Text, Touch, and Text-to-Speech interactions</CardDescription>
                  </div>
                </div>
                <Mic className="h-5 w-5 text-teal-600" />
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Patients describe their symptoms using their preferred modality. This flexibility removes barriers for diverse Indian demographics:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl border border-border bg-card space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                      <Mic className="h-4 w-4 text-teal-600" />
                      <span>Voice Recording</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Speak freely in Hindi, Bengali, or English. Receives live speech-to-text transcript previews with an editable verification box.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-border bg-card space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                      <Type className="h-4 w-4 text-cyan-600" />
                      <span>Text Input</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Type detailed chief complaints, durations, and past medications directly via structured responsive input forms.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-border bg-card space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                      <Hand className="h-4 w-4 text-indigo-600" />
                      <span>Touch Tiles</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Tap-friendly symptom selection chips, severity sliders, and anatomical body-site selectors simplify rapid mobile intake.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-border bg-card space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                      <Volume2 className="h-4 w-4 text-amber-500" />
                      <span>Text-to-Speech</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Questions are read aloud through the Web Speech audio player widget, assisting elderly or visually impaired patients.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* STEP 5 */}
            <Card className="border-amber-500/40 shadow-sm">
              <CardHeader className="pb-3 border-b border-border/50 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-600 text-white font-bold text-xs">
                    05
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">Step 5 — Emergency Safety Triage (Deterministic Engine)</CardTitle>
                    <CardDescription className="text-xs">Rule-based emergency identification independent of LLM</CardDescription>
                  </div>
                </div>
                <ShieldAlert className="h-5 w-5 text-amber-600" />
              </CardHeader>
              <CardContent className="pt-4 text-xs sm:text-sm text-muted-foreground leading-relaxed space-y-3">
                <p>
                  ArogyaIntake embeds a strict, deterministic rule-based safety engine that runs completely independent of the AI model. As the patient inputs information, the safety engine scans for life-threatening emergency indicators:
                </p>
                <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2 text-xs text-amber-950 dark:text-amber-200">
                  <span className="font-bold block">Scanned Emergency Indicators:</span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 list-disc list-inside">
                    <li>Severe chest pain + shortness of breath</li>
                    <li>Sudden facial drooping / arm weakness / stroke signs</li>
                    <li>Uncontrolled severe bleeding or coughing blood</li>
                    <li>Loss of consciousness / acute disorientation</li>
                    <li>Critical vitals (SpO2 &lt; 90% or systolic BP &gt; 180 mmHg)</li>
                  </ul>
                </div>
                <p>
                  <strong>Escalation Mechanism:</strong> If a red flag is detected, the patient receives a high-visibility modal instructing them to contact emergency services immediately (112 / 108), and an urgent alert is logged to the OPD Triage Dashboard (<code className="text-[11px] bg-muted px-1.5 py-0.5 rounded">/triage/dashboard</code>).
                </p>
              </CardContent>
            </Card>

            {/* STEP 6 */}
            <Card className="border-border">
              <CardHeader className="pb-3 border-b border-border/50 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-white font-bold text-xs">
                    06
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">Step 6 — AI Clinical History Synthesis</CardTitle>
                    <CardDescription className="text-xs">Transforming unstructured patient answers into clinical drafts</CardDescription>
                  </div>
                </div>
                <Sparkles className="h-5 w-5 text-indigo-600" />
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                <p>
                  Once the patient completes the multimodal questionnaire, the agnostic LLM service synthesizes unstructured patient reports into a structured clinical draft for the doctor:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-center font-semibold pt-1">
                  <div className="p-3 rounded-xl border border-border bg-card">
                    <span className="text-muted-foreground text-[10px] uppercase block">Input</span>
                    <span className="text-foreground">Unstructured Responses</span>
                  </div>
                  <div className="p-3 rounded-xl border border-teal-500/30 bg-teal-500/10 flex items-center justify-center">
                    <span className="text-teal-700 dark:text-teal-300">Agnostic AI Adapter</span>
                  </div>
                  <div className="p-3 rounded-xl border border-border bg-card">
                    <span className="text-muted-foreground text-[10px] uppercase block">Output</span>
                    <span className="text-foreground">Structured HPI Narrative</span>
                  </div>
                </div>
                <p className="text-xs">
                  The synthesis organizes History of Present Illness (HPI), Review of Systems, Past Medical/Surgical History, and current medications into standard medical nomenclature. <strong>Zero autonomous diagnosis or prescription is permitted.</strong>
                </p>
              </CardContent>
            </Card>

            {/* STEP 7 */}
            <Card className="border-emerald-500/40 shadow-sm">
              <CardHeader className="pb-3 border-b border-border/50 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-xs">
                    07
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">Step 7 — Doctor Verification & Digital Sign-Off</CardTitle>
                    <CardDescription className="text-xs">Licensed practitioner review and clinical authorization</CardDescription>
                  </div>
                </div>
                <Stethoscope className="h-5 w-5 text-emerald-600" />
              </CardHeader>
              <CardContent className="pt-4 text-xs sm:text-sm text-muted-foreground leading-relaxed space-y-3">
                <p>
                  The AI-generated history draft enters the licensed physician&apos;s queue (<code className="text-[11px] bg-muted px-1.5 py-0.5 rounded">/doctor/queue</code>). The doctor reviews the patient&apos;s responses, examines vitals, edits any clinical wording, enters their provisional diagnosis, assigns the management plan, and applies their digital sign-off token.
                </p>
                <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>The licensed medical practitioner remains the sole clinical decision-maker.</span>
                </div>
              </CardContent>
            </Card>

            {/* STEP 8 */}
            <Card className="border-border">
              <CardHeader className="pb-3 border-b border-border/50 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-white font-bold text-xs">
                    08
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">Step 8 — Doctor Discovery & Conflict-Free Appointments</CardTitle>
                    <CardDescription className="text-xs">Smart directory filtering and double-booking prevention</CardDescription>
                  </div>
                </div>
                <Calendar className="h-5 w-5 text-teal-600" />
              </CardHeader>
              <CardContent className="pt-4 text-xs sm:text-sm text-muted-foreground leading-relaxed space-y-2">
                <p>
                  Patients can search and discover verified practitioners by medical system (AYUSH or Allopathy), specialization, clinic location, and fee structure. When booking a slot, the system enforces automated double-booking validation, preventing scheduling conflicts.
                </p>
              </CardContent>
            </Card>

            {/* STEP 9 */}
            <Card className="border-border">
              <CardHeader className="pb-3 border-b border-border/50 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-white font-bold text-xs">
                    09
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">Step 9 — Tele-Consultation & Authorized Chat</CardTitle>
                    <CardDescription className="text-xs">Secure communication between patient and assigned physician</CardDescription>
                  </div>
                </div>
                <MessageSquare className="h-5 w-5 text-cyan-600" />
              </CardHeader>
              <CardContent className="pt-4 text-xs sm:text-sm text-muted-foreground leading-relaxed space-y-2">
                <p>
                  The platform provides an authorized doctor-patient messaging messenger (<code className="text-[11px] bg-muted px-1.5 py-0.5 rounded">DoctorPatientChatWidget</code>). Conversations include delivery timestamps, unread counts, and read status indicators. Access is strictly scoped to authorized appointments.
                </p>
              </CardContent>
            </Card>

            {/* STEP 10 */}
            <Card className="border-teal-500/40 shadow-sm">
              <CardHeader className="pb-3 border-b border-border/50 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-white font-bold text-xs">
                    10
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">Step 10 — HL7 FHIR R4 & ABDM Interoperability</CardTitle>
                    <CardDescription className="text-xs">Open standard data exchange for Indian digital health</CardDescription>
                  </div>
                </div>
                <Share2 className="h-5 w-5 text-teal-600" />
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                <p>
                  The final layer converts the verified case record into an internationally standard HL7 FHIR R4 Document Bundle:
                </p>
                <div className="p-3.5 rounded-xl border border-border bg-card/60 text-xs space-y-1 font-mono">
                  <p className="text-teal-600 font-bold">Internal Case Record ➔ FHIRMapper ➔ Standardized FHIR R4 Bundle</p>
                  <p className="text-muted-foreground">Resources: Patient, Encounter, Observation, Condition, MedicationStatement, DocumentReference</p>
                </div>
                <p>
                  This bundle can be shared across ABHA-linked health facilities, government hospitals, and private clinics through the Ayushman Bharat Digital Mission (ABDM) Health Information Exchange. An interactive sandbox is available at <Link href="/fhir/demo" className="text-teal-600 hover:underline font-semibold">/fhir/demo</Link>.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 3 — SAFETY FIRST */}
      <section className="mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <Badge variant="warning">Safety Architecture</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Clinical Safety Comes First
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            ArogyaIntake is engineered from the ground up with defensive healthcare guardrails.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-amber-500/30 p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-sm">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <span>Zero Autonomous Medical Diagnosis</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The AI model is programmatically constrained as a conversational intake assistant and history synthesizer. It is forbidden from prescribing medications or issuing diagnostic conclusions.
            </p>
          </Card>

          <Card className="border-amber-500/30 p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-sm">
              <Activity className="h-5 w-5 shrink-0" />
              <span>Deterministic Rule-Based Triage</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The safety engine uses deterministic keyword heuristics and vital threshold scans (e.g., SpO2 &lt; 90%) that fire immediately on input change, completely bypassing LLM inference latency.
            </p>
          </Card>

          <Card className="border-emerald-500/30 p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>Mandatory Doctor Review & Editability</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every synthesized summary is treated as an unverified draft. Licensed medical doctors retain 100% editing authority to modify findings, write diagnoses, and digitally sign off.
            </p>
          </Card>

          <Card className="border-teal-500/30 p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300 font-bold text-sm">
              <Lock className="h-5 w-5 shrink-0" />
              <span>Audited Privacy & Granular Revocation</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All consent actions, doctor reviews, and intake submissions log structured audit records (<code className="text-[11px] bg-muted px-1 py-0.5 rounded">AuditService</code>) complying with DPDP Act data rights.
            </p>
          </Card>
        </div>
      </section>

      {/* SECTION 4 — ROLE-BASED WORKFLOW */}
      <section className="bg-slate-50/60 dark:bg-slate-900/30 border-y border-border py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-2 text-center max-w-2xl mx-auto">
            <Badge variant="clinical">Access Control</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Role-Based Workflow Architecture
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Four distinct user roles with strict Next.js middleware and API authorization guards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Patient Card */}
            <Card className="border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="clinical">Patient</Badge>
                <Users className="h-4 w-4 text-teal-600" />
              </div>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-1.5">✓ Register & ABHA Link</li>
                <li className="flex items-center gap-1.5">✓ Grant Granular Consent</li>
                <li className="flex items-center gap-1.5">✓ Multimodal Intake</li>
                <li className="flex items-center gap-1.5">✓ Track Case Status</li>
                <li className="flex items-center gap-1.5">✓ Discover Doctors</li>
                <li className="flex items-center gap-1.5">✓ Book Appointments</li>
                <li className="flex items-center gap-1.5">✓ Tele-Consult Chat</li>
              </ul>
            </Card>

            {/* Doctor Card */}
            <Card className="border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="verified">Doctor</Badge>
                <Stethoscope className="h-4 w-4 text-emerald-600" />
              </div>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-1.5">✓ Clinical Workstation</li>
                <li className="flex items-center gap-1.5">✓ Intake Verification Queue</li>
                <li className="flex items-center gap-1.5">✓ Edit AI-Generated Draft</li>
                <li className="flex items-center gap-1.5">✓ Provisional Diagnosis</li>
                <li className="flex items-center gap-1.5">✓ Digital Sign-Off</li>
                <li className="flex items-center gap-1.5">✓ Manage Schedule</li>
                <li className="flex items-center gap-1.5">✓ Secure Consultation</li>
              </ul>
            </Card>

            {/* Triage Staff Card */}
            <Card className="border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="warning">Triage Staff</Badge>
                <ShieldAlert className="h-4 w-4 text-amber-500" />
              </div>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-1.5">✓ OPD Emergency Monitoring</li>
                <li className="flex items-center gap-1.5">✓ Real-time Red-Flag Alerts</li>
                <li className="flex items-center gap-1.5">✓ Vital Threshold Triage</li>
                <li className="flex items-center gap-1.5">✓ Emergency Escalation</li>
                <li className="flex items-center gap-1.5">✓ Fast-Track Routing</li>
              </ul>
            </Card>

            {/* Admin Card */}
            <Card className="border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="destructive">Administrator</Badge>
                <Server className="h-4 w-4 text-rose-600" />
              </div>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-1.5">✓ Platform Registry</li>
                <li className="flex items-center gap-1.5">✓ Doctor Credentialing</li>
                <li className="flex items-center gap-1.5">✓ User Account Controls</li>
                <li className="flex items-center gap-1.5">✓ System Audit Trails</li>
                <li className="flex items-center gap-1.5">✓ Health Telemetry</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 5 — AI ARCHITECTURE */}
      <section className="mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <Badge variant="clinical">LLM Integration</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Provider-Agnostic AI Adapter Architecture
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            The platform is decoupled from any single LLM vendor via a flexible factory pattern.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold">
            <div className="p-3 rounded-xl border border-border bg-muted/30 text-center w-full md:w-auto flex-1">
              <span className="text-muted-foreground text-[10px] uppercase block">Step 1</span>
              <span>Patient Multimodal Input</span>
            </div>
            <ArrowRight className="h-4 w-4 text-teal-600 hidden md:block" />

            <div className="p-3 rounded-xl border border-border bg-muted/30 text-center w-full md:w-auto flex-1">
              <span className="text-muted-foreground text-[10px] uppercase block">Step 2</span>
              <span>Case Taking Service Layer</span>
            </div>
            <ArrowRight className="h-4 w-4 text-teal-600 hidden md:block" />

            <div className="p-3 rounded-xl border border-teal-500/30 bg-teal-500/10 text-center w-full md:w-auto flex-1 text-teal-800 dark:text-teal-300">
              <span className="text-[10px] uppercase block font-bold">Step 3</span>
              <span>AI Adapter Factory</span>
            </div>
            <ArrowRight className="h-4 w-4 text-teal-600 hidden md:block" />

            <div className="p-3 rounded-xl border border-border bg-muted/30 text-center w-full md:w-auto flex-1">
              <span className="text-muted-foreground text-[10px] uppercase block">Step 4</span>
              <span>Doctor Verification Station</span>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Supported & Configured AI Providers:
            </h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="clinical" className="px-3 py-1 text-xs">
                Google Gemini (gemini-1.5-pro)
              </Badge>
              <Badge variant="outline" className="px-3 py-1 text-xs">
                OpenAI (gpt-4o)
              </Badge>
              <Badge variant="outline" className="px-3 py-1 text-xs">
                Deterministic Offline Fallback Engine
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
              If an API key is absent or in offline scenarios, the system automatically falls back to the deterministic question engine (<code className="text-[11px] bg-muted px-1 py-0.5 rounded">MockDeterministicFallbackAdapter</code>), ensuring the clinical application never crashes or halts during patient interviews.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6 — TECHNOLOGY STACK */}
      <section className="bg-slate-50/60 dark:bg-slate-900/30 border-y border-border py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-2 text-center max-w-2xl mx-auto">
            <Badge variant="clinical">Engineering</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Production Technology Stack
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Modern full-stack technologies selected for performance, type safety, and clinical durability.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: "Next.js 15.5", role: "App Router & Server Components" },
              { name: "React 19", role: "Declarative Component Hierarchy" },
              { name: "TypeScript 5", role: "End-to-End Strict Typing" },
              { name: "MongoDB & Mongoose 8", role: "Domain Schema Modeling" },
              { name: "NextAuth.js", role: "JWT RBAC Authentication" },
              { name: "Zod", role: "API Request Schema Validation" },
              { name: "Agnostic AI Adapter", role: "Multi-Provider LLM Integration" },
              { name: "Web Speech API", role: "STT Recording & TTS Playback" },
              { name: "HL7 FHIR R4", role: "Standard Healthcare Interoperability" },
              { name: "ABDM Abstractions", role: "Ayushman Bharat National Linkage" },
              { name: "REST & Realtime Chat", role: "Authorized Doctor-Patient Messaging" },
              { name: "Tailwind CSS", role: "Curated Clinical Design System" },
            ].map((tech, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                <span className="font-bold text-xs text-foreground block">{tech.name}</span>
                <span className="text-[11px] text-muted-foreground">{tech.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — SYSTEM ARCHITECTURE */}
      <section className="mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <Badge variant="clinical">Architecture</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            End-to-End System Architecture
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            How requests and clinical records flow across frontend, services, persistence, and external health networks.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-6 text-xs font-mono">
          <div className="space-y-3">
            <div className="p-3 rounded-xl border border-teal-500/30 bg-teal-500/5">
              <span className="font-bold text-teal-700 dark:text-teal-300 block mb-1">1. Presentation Layer (Next.js 15 App Router)</span>
              <span className="text-muted-foreground">Landing Page (/) • Case Intake Wizard (/case-taking) • Role Dashboards (/patient, /doctor, /triage, /admin) • Documentation (/documentation) • FHIR Sandbox (/fhir/demo)</span>
            </div>

            <div className="flex justify-center"><ArrowRight className="h-4 w-4 text-teal-600 rotate-90" /></div>

            <div className="p-3 rounded-xl border border-border bg-muted/40">
              <span className="font-bold text-foreground block mb-1">2. Auth & RBAC Guard Layer</span>
              <span className="text-muted-foreground">Next.js Middleware (JWT Role Verification) • requireDoctor() / requirePatient() Server Guards</span>
            </div>

            <div className="flex justify-center"><ArrowRight className="h-4 w-4 text-teal-600 rotate-90" /></div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl border border-border bg-card">
                <span className="font-bold text-foreground block mb-1">AI History Engine</span>
                <span className="text-muted-foreground">Agnostic LLM Adapter (Gemini / OpenAI / Fallback)</span>
              </div>
              <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/5">
                <span className="font-bold text-amber-800 dark:text-amber-200 block mb-1">Safety Triage Engine</span>
                <span className="text-muted-foreground">Deterministic Heuristic Rules Registry</span>
              </div>
              <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                <span className="font-bold text-emerald-800 dark:text-emerald-200 block mb-1">Doctor Verification</span>
                <span className="text-muted-foreground">Provisional Diagnosis & Digital Signature</span>
              </div>
            </div>

            <div className="flex justify-center"><ArrowRight className="h-4 w-4 text-teal-600 rotate-90" /></div>

            <div className="p-3 rounded-xl border border-border bg-muted/40">
              <span className="font-bold text-foreground block mb-1">3. Persistence & Interoperability Layer</span>
              <span className="text-muted-foreground">MongoDB Database (Mongoose 8 Schemas: User, ClinicalSession, CaseRecord, Consent, Appointment, ChatMessage) • FHIRMapper ➔ HL7 FHIR R4 ➔ ABDM Gateway</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 — DATA & PRIVACY */}
      <section className="bg-slate-50/60 dark:bg-slate-900/30 border-y border-border py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-2 text-center max-w-2xl mx-auto">
            <Badge variant="clinical">Compliance</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Data Governance & Patient Privacy
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Built on verified, implemented privacy mechanisms without exaggerated security claims.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border p-5 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                <Lock className="h-4 w-4 text-teal-600" />
                <span>DPDP Act Granular Consent</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Patients toggle individual consent scopes: clinical case taking, doctor review sharing, ABDM interoperability, and optional research telemetry. Consent can be revoked at any time.
              </p>
            </Card>

            <Card className="border-border p-5 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Server-Side RBAC Isolation</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Patients cannot view other patients&apos; records. Doctors can only review cases routed to their queue or booked consultations. Chat endpoints verify sender and recipient identity.
              </p>
            </Card>

            <Card className="border-border p-5 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                <FileText className="h-4 w-4 text-indigo-600" />
                <span>Audited Transaction Logging</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Critical lifecycle events — consent grants, intake submissions, doctor sign-offs, and appointment creations — append non-repudiable audit logs (<code className="text-[11px] bg-muted px-1 py-0.5 rounded">AuditLog</code>).
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 10 — QUICK SYSTEM FLOW SUMMARY */}
      <section className="mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 py-16 text-center space-y-8">
        <div className="space-y-2">
          <Badge variant="clinical">30-Second Summary</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            The ArogyaIntake Story at a Glance
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Collect → Understand → Protect → Verify → Consult → Interoperate
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-teal-500/30 bg-gradient-to-br from-teal-500/10 via-card to-cyan-500/10 shadow-sm max-w-xl mx-auto text-xs font-mono space-y-2 text-foreground">
          <div className="py-1.5 px-3 rounded-lg bg-card/80 border border-border">Patient Registration & ABHA ID Linkage</div>
          <div className="text-teal-600 font-bold">↓</div>
          <div className="py-1.5 px-3 rounded-lg bg-card/80 border border-border">Language Selection + Granular Consent</div>
          <div className="text-teal-600 font-bold">↓</div>
          <div className="py-1.5 px-3 rounded-lg bg-card/80 border border-border">AYUSH or Allopathy System Selection</div>
          <div className="text-teal-600 font-bold">↓</div>
          <div className="py-1.5 px-3 rounded-lg bg-card/80 border border-border font-bold text-teal-600">Multimodal Intake (Voice + Text + Touch + Audio)</div>
          <div className="text-teal-600 font-bold">↓</div>
          <div className="py-1.5 px-3 rounded-lg bg-amber-500/15 border border-amber-500/30 font-bold text-amber-800 dark:text-amber-200">Deterministic Safety Triage & Red-Flag Screening</div>
          <div className="text-teal-600 font-bold">↓</div>
          <div className="py-1.5 px-3 rounded-lg bg-card/80 border border-border">Agnostic AI Clinical History Synthesis</div>
          <div className="text-teal-600 font-bold">↓</div>
          <div className="py-1.5 px-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 font-bold text-emerald-800 dark:text-emerald-200">Licensed Physician Verification & Digital Sign-off</div>
          <div className="text-teal-600 font-bold">↓</div>
          <div className="py-1.5 px-3 rounded-lg bg-card/80 border border-border">Doctor Discovery & Conflict-Free Appointments</div>
          <div className="text-teal-600 font-bold">↓</div>
          <div className="py-1.5 px-3 rounded-lg bg-card/80 border border-border">Tele-Consultation & Authorized Messaging</div>
          <div className="text-teal-600 font-bold">↓</div>
          <div className="py-1.5 px-3 rounded-lg bg-teal-600 text-white font-bold">HL7 FHIR R4 Standard Export & ABDM Interoperability</div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link href="/case-taking">
            <Button variant="clinical" size="lg" className="gap-2">
              <HeartPulse className="h-4 w-4" />
              <span>Launch Case Intake</span>
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="lg">
              <span>Return to Home</span>
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
