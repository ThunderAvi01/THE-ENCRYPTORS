"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  HeartPulse,
  FileText,
  Clock,
  ShieldCheck,
  Plus,
  Phone,
  Droplet,
  Calendar,
  ChevronRight,
  Activity,
  ArrowUpRight,
  FileScan,
  Layers,
  Search,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  FileCheck2,
  AlertCircle,
  MapPin,
  UploadCloud,
  FileCode2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { ClinicalSafetyBanner } from "@/components/safety/ClinicalSafetyBanner";
import { MOCK_PATIENT_DATA } from "@/lib/mockData";

export default function PatientDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <DashboardLayout
      role="PATIENT"
      userName="Avishek Modak"
      userEmail="patient@example.com"
      activeTab={activeTab}
      onTabChange={setActiveTab}
      title="Patient Health Portal"
      subtitle="SIH26047 • Structured Case-Taking & Medical Records"
    >
      {/* 1. MANDATORY SAFETY GUARDRAIL BANNER */}
      <ClinicalSafetyBanner compact />

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Welcome Card */}
          <div className="p-6 rounded-2xl border border-teal-500/30 bg-gradient-to-br from-teal-500/10 via-card to-cyan-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <Badge variant="clinical" className="gap-1">
                  <Sparkles className="h-3 w-3" />
                  ABHA Linked
                </Badge>
                <span className="text-xs font-semibold text-muted-foreground">
                  ID: {MOCK_PATIENT_DATA.abhaStatus.id}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {MOCK_PATIENT_DATA.welcomeMessage}
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your medical timeline, prescription uploads, and clinical case intakes are secured with zero autonomous diagnosis rules.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <Link href="/case-taking">
                <Button variant="clinical" className="w-full sm:w-auto gap-2 shadow-md">
                  <HeartPulse className="h-4 w-4" />
                  <span>Start New Case Intake</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Active Case Draft"
              value="Step 3/6"
              subtext="AI History Intake"
              icon={<HeartPulse className="h-5 w-5 text-teal-600" />}
              accentColor="teal"
            />
            <StatCard
              title="Verified Cases"
              value={MOCK_PATIENT_DATA.previousCases.length}
              subtext="Doctor Verified"
              icon={<FileCheck2 className="h-5 w-5 text-emerald-600" />}
              accentColor="emerald"
            />
            <StatCard
              title="Digitized Records"
              value={MOCK_PATIENT_DATA.medicalDocuments.length}
              subtext="OCR Parsed"
              icon={<FileScan className="h-5 w-5 text-cyan-600" />}
              accentColor="cyan"
            />
            <StatCard
              title="Upcoming Appointments"
              value={MOCK_PATIENT_DATA.upcomingAppointments.length}
              subtext="Confirmed"
              icon={<Calendar className="h-5 w-5 text-indigo-600" />}
              accentColor="indigo"
            />
          </div>

          {/* Grid: Continue Draft Case & Upcoming Consultation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Continue Draft Case Widget */}
            <Card className="border-teal-500/30 lg:col-span-2">
              <CardHeader className="pb-3 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-teal-600" />
                    <CardTitle className="text-sm font-bold">Continue In-Progress Case</CardTitle>
                  </div>
                  <Badge variant="clinical">{MOCK_PATIENT_DATA.continueCase.caseNumber}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3.5">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {MOCK_PATIENT_DATA.continueCase.chiefComplaint}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Saved: {MOCK_PATIENT_DATA.continueCase.lastSaved} • Current Stage: {MOCK_PATIENT_DATA.continueCase.stepCompleted}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">Intake Completion</span>
                    <span className="text-teal-600">50%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-teal-600 rounded-full w-1/2" />
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Next step: Confirm symptoms with clinical assistant.
                  </span>
                  <Link href="/case-taking">
                    <Button variant="clinical" size="sm" className="gap-1.5 text-xs">
                      <span>Resume Intake</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Doctor Consult Chat Preview */}
            <Card className="border-border lg:col-span-1">
              <CardHeader className="pb-3 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-teal-600" />
                    Doctor Consult Chat
                  </CardTitle>
                  <Badge variant="verified">1 Unread</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {MOCK_PATIENT_DATA.doctorChatPreviews.map((chat) => (
                  <div key={chat.id} className="p-3 rounded-lg border border-border bg-muted/20 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{chat.doctorName}</span>
                      <span className="text-[10px] text-muted-foreground">{chat.timestamp}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed italic">
                      &ldquo;{chat.lastMessage}&rdquo;
                    </p>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("doctor-chat")}
                  className="w-full text-xs"
                >
                  Open Consultation Messenger
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Previous Verified Cases */}
          <Card className="border-border">
            <CardHeader className="pb-3 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-teal-600" />
                  <CardTitle className="text-sm font-bold">Previous Verified Case History</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab("previous-cases")}
                  className="text-xs text-teal-600"
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-2.5">
              {MOCK_PATIENT_DATA.previousCases.map((c) => (
                <div
                  key={c.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-border bg-card hover:border-teal-500/50 transition gap-2 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{c.chiefComplaint}</span>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="text-muted-foreground text-[11px]">
                      Case #{c.caseNumber} • Verified by {c.doctorName} on {c.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      View Verified Summary
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* START NEW CASE TAB */}
      {activeTab === "start-case" && (
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Launch Guided Patient Case Intake</h2>
            <p className="text-xs text-muted-foreground">
              Categorize chief complaints, log vitals, and converse with the intake assistant.
            </p>
          </div>
          <Link href="/case-taking" className="block text-center pt-2">
            <Button variant="clinical" size="lg" className="gap-2">
              <HeartPulse className="h-5 w-5" />
              <span>Open Interactive Case Intake Wizard</span>
            </Button>
          </Link>
        </div>
      )}

      {/* CONTINUE CASE TAB */}
      {activeTab === "continue-case" && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-foreground">In-Progress Case Intakes</h3>
          <Card className="border-teal-500/30 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-foreground block">{MOCK_PATIENT_DATA.continueCase.chiefComplaint}</span>
                <p className="text-muted-foreground">
                  Case #{MOCK_PATIENT_DATA.continueCase.caseNumber} • Saved {MOCK_PATIENT_DATA.continueCase.lastSaved}
                </p>
              </div>
              <Link href="/case-taking">
                <Button variant="clinical" size="sm">Resume Draft Intake</Button>
              </Link>
            </div>
          </Card>
        </div>
      )}

      {/* PREVIOUS CASES TAB */}
      {activeTab === "previous-cases" && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-foreground">Complete Case History</h3>
          <div className="space-y-3">
            {MOCK_PATIENT_DATA.previousCases.map((c) => (
              <Card key={c.id} className="p-4 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground text-sm">{c.chiefComplaint}</span>
                  <StatusBadge status={c.status} />
                </div>
                <p className="text-muted-foreground">
                  Case #{c.caseNumber} • Verified by {c.doctorName} • {c.documentsCount} documents attached
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* MEDICAL DOCUMENTS TAB */}
      {activeTab === "documents" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground">Digitized Medical Documents & OCR Reports</h3>
            <Badge variant="clinical">[DEMO DATA]</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {MOCK_PATIENT_DATA.medicalDocuments.map((doc) => (
              <Card key={doc.id} className="p-4 text-xs space-y-2">
                <FileScan className="h-6 w-6 text-teal-600" />
                <p className="font-bold text-foreground truncate">{doc.fileName}</p>
                <p className="text-muted-foreground">{doc.fileSize} • {doc.documentType}</p>
                <Badge variant="verified" className="text-[10px]">{doc.status} ({doc.extractedCount} values)</Badge>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* MEDICAL TIMELINE TAB */}
      {activeTab === "timeline" && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-foreground">Chronological Medical Timeline</h3>
          <div className="space-y-3 border-l-2 border-teal-500/40 pl-4 ml-2">
            {MOCK_PATIENT_DATA.timelineEvents.map((ev) => (
              <div key={ev.id} className="relative space-y-1 text-xs">
                <div className="absolute -left-[23px] top-1 h-3 w-3 rounded-full bg-teal-600 ring-4 ring-background" />
                <span className="text-muted-foreground font-semibold text-[11px]">{ev.date}</span>
                <p className="font-bold text-foreground">{ev.title}</p>
                <p className="text-muted-foreground">{ev.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* UPCOMING APPOINTMENTS TAB */}
      {activeTab === "appointments" && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-foreground">Upcoming Consultations Schedule</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_PATIENT_DATA.upcomingAppointments.map((apt) => (
              <Card key={apt.id} className="p-4 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">{apt.doctorName}</span>
                  <Badge variant="clinical">{apt.type}</Badge>
                </div>
                <p className="text-muted-foreground">{apt.specialization} ({apt.ayushSystem})</p>
                <p className="font-semibold text-teal-600">{apt.scheduledAt}</p>
                <p className="text-muted-foreground">{apt.clinicLocation}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* FIND DOCTORS TAB */}
      {activeTab === "find-doctors" && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-foreground">Find Verified Doctors & AYUSH Practitioners</h3>
          <div className="p-4 rounded-xl border border-border bg-card text-xs space-y-2">
            <p className="font-semibold text-foreground">Search by Specialization or Medical System:</p>
            <div className="flex gap-2">
              <input
                placeholder="Search Ayurveda, Allopathy, General Medicine, Cardiology..."
                className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-xs"
              />
              <Button variant="clinical" size="sm">Search Doctors</Button>
            </div>
          </div>
        </div>
      )}

      {/* DOCTOR CHAT TAB */}
      {activeTab === "doctor-chat" && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-foreground">Secure Doctor Tele-Consult Messenger</h3>
          <Card className="p-4 text-xs space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-teal-600" />
              <span className="font-bold text-foreground">Dr. Priya Sharma, MD</span>
            </div>
            <div className="p-3 rounded-lg bg-muted/40 text-muted-foreground italic">
              &ldquo;Please take Pantoprazole 40mg 30 minutes before breakfast.&rdquo;
            </div>
            <div className="flex gap-2">
              <input placeholder="Type your message..." className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-xs" />
              <Button variant="clinical" size="sm">Send</Button>
            </div>
          </Card>
        </div>
      )}

      {/* CONSENT TAB */}
      {activeTab === "consent" && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-foreground">Digital Informed Consent & DPDP Compliance</h3>
          <Card className="p-4 text-xs space-y-2">
            <Badge variant="verified">Consent Active ({MOCK_PATIENT_DATA.consentStatus.version})</Badge>
            <p className="text-muted-foreground">
              Granted on {MOCK_PATIENT_DATA.consentStatus.grantedAt}. Authorizes clinical case taking, OCR digitization, and doctor verification sharing.
            </p>
          </Card>
        </div>
      )}

      {/* PROFILE TAB */}
      {activeTab === "profile" && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-foreground">Patient Profile & ABHA Identity</h3>
          <Card className="p-4 text-xs space-y-2">
            <p className="font-bold text-foreground">Name: Avishek Modak</p>
            <p className="text-muted-foreground">Email: patient@example.com</p>
            <p className="text-muted-foreground">ABHA ID: 91-8821-4920-11</p>
            <p className="text-muted-foreground">Blood Group: O+</p>
            <p className="text-muted-foreground">Emergency Contact: Rajesh Modak (9876500000)</p>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
