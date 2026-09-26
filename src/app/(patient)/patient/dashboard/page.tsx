"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  HeartPulse,
  FileText,
  Clock,
  ArrowUpRight,
  Sparkles,
  FileCheck2,
  Calendar,
  Layers,
  RefreshCw,
  Eye,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ClinicalSafetyBanner } from "@/components/safety/ClinicalSafetyBanner";
import { MOCK_PATIENT_DATA } from "@/lib/mockData";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface LiveCaseItem {
  _id: string;
  caseNumber: string;
  chiefComplaint: string;
  ayushSystem: string;
  severity: string;
  status: string;
  createdAt: string;
  verifiedAt?: string;
  doctorName?: string;
  provisionalDiagnosis?: string;
}

interface LiveActiveSession {
  id: string;
  currentStepIndex: number;
  chiefComplaint: string;
  selectedAyushSystem: string;
  updatedAt: string;
}

// Consistent date formatting across SSR and client to prevent hydration mismatches
function formatDate(dateInput?: string | Date | null): string {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function PatientDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const { dict } = useLanguage();
  const { data: session } = useSession();

  const [liveCases, setLiveCases] = useState<LiveCaseItem[]>([]);
  const [activeDraft, setActiveDraft] = useState<LiveActiveSession | null>(null);
  const [patientProfile, setPatientProfile] = useState<{ name: string; email: string; abhaId: string }>({
    name: session?.user?.name || "Patient",
    email: session?.user?.email || "patient@example.com",
    abhaId: "91-8821-4920-11",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = useCallback(async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const res = await fetch("/api/patient/dashboard");
      if (res.ok) {
        const data = await res.json();
        if (data.cases) setLiveCases(data.cases);
        if (data.activeSession !== undefined) setActiveDraft(data.activeSession);
        if (data.user) {
          setPatientProfile({
            name: data.user.name || session?.user?.name || "Patient",
            email: data.user.email || session?.user?.email || "patient@example.com",
            abhaId: data.user.abhaId || "91-8821-4920-11",
          });
        }
      }
    } catch (err) {
      console.error("Failed to load patient dashboard live data:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [session]);

  useEffect(() => {
    fetchDashboardData();

    // Live polling every 5 seconds so any completed case intake reflects in real-time
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Merge live cases with mock cases for demonstration if database has 0 cases yet
  const displayCases = liveCases.length > 0
    ? liveCases
    : MOCK_PATIENT_DATA.previousCases.map((c) => ({
        _id: c.id,
        caseNumber: c.caseNumber,
        chiefComplaint: c.chiefComplaint,
        ayushSystem: "ALLOPATHY",
        severity: c.severity,
        status: c.status === "VERIFIED_BY_DOCTOR" ? "VERIFIED" : c.status,
        createdAt: c.date,
        doctorName: c.doctorName,
      }));

  const verifiedCount = displayCases.filter(
    (c) => c.status === "VERIFIED" || c.status === "VERIFIED_BY_DOCTOR"
  ).length;

  return (
    <DashboardLayout
      role="PATIENT"
      userName={patientProfile.name}
      userEmail={patientProfile.email}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      title={dict.patientDashboard.portalTitle}
      subtitle={dict.patientDashboard.portalSubtitle}
    >
      {/* 1. MANDATORY SAFETY GUARDRAIL BANNER */}
      <ClinicalSafetyBanner compact />

      {/* YOUTUBE-LIKE SHIMMER SKELETON LOADING STATE */}
      {isLoading ? (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          {/* Top Progress Line Shimmer (Like YouTube) */}
          <div className="fixed top-0 left-0 right-0 h-1 bg-muted/20 overflow-hidden z-50">
            <div className="h-full w-full bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-500 animate-yt-progress shadow-[0_0_8px_rgba(20,184,166,0.6)]" />
          </div>

          {/* Welcome Banner Skeleton */}
          <div className="p-6 rounded-2xl border border-border bg-card/60 space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-4 w-36 rounded-md" />
            </div>
            <Skeleton className="h-8 w-64 rounded-lg" />
            <Skeleton className="h-4 w-full max-w-xl rounded-md" />
          </div>

          {/* Stat Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl border border-border bg-card space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
            <div className="p-5 rounded-xl border border-border bg-card space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
            <div className="p-5 rounded-xl border border-border bg-card space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>

          {/* Intake Draft Widget Skeleton */}
          <div className="p-6 rounded-xl border border-border bg-card space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-2 w-full rounded-full" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-8 w-32 rounded-lg" />
            </div>
          </div>

          {/* Case List Skeleton */}
          <div className="p-6 rounded-xl border border-border bg-card space-y-4">
            <div className="flex justify-between items-center border-b border-border/50 pb-3">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-xl border border-border/80 flex justify-between items-center">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                  <Skeleton className="h-8 w-28 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Welcome Card */}
              <div className="p-6 rounded-2xl border border-teal-500/30 bg-gradient-to-br from-teal-500/10 via-card to-cyan-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <Badge variant="clinical" className="gap-1">
                      <Sparkles className="h-3 w-3" />
                      {dict.patientDashboard.abhaLinked}
                    </Badge>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {dict.patientDashboard.abhaId}: {patientProfile.abhaId}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live MongoDB Sync
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    {dict.patientDashboard.welcomeBack}, {patientProfile.name}
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {dict.safety.compactDisclaimer}
                  </p>
                </div>

            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchDashboardData(false)}
                disabled={isRefreshing}
                className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-teal-600" : ""}`} />
                <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
              </Button>
              <Link href="/case-taking">
                <Button variant="clinical" className="w-full sm:w-auto gap-2 shadow-md">
                  <HeartPulse className="h-4 w-4" />
                  <span>{dict.patientDashboard.startIntakeBtn}</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              title={dict.patientDashboard.activeDraft}
              value={activeDraft ? `Step ${(activeDraft.currentStepIndex || 0) + 1}/6` : "None"}
              subtext={activeDraft ? activeDraft.chiefComplaint : "No active drafts in progress"}
              icon={<HeartPulse className="h-5 w-5 text-teal-600" />}
              accentColor="teal"
            />
            <StatCard
              title={dict.patientDashboard.verifiedCases}
              value={displayCases.length}
              subtext={`${verifiedCount} Verified by Doctor`}
              icon={<FileCheck2 className="h-5 w-5 text-emerald-600" />}
              accentColor="emerald"
            />
            <StatCard
              title={dict.patientDashboard.pipelineStages}
              value="6 Stages"
              subtext="End-to-End AI & Safety Pipeline"
              icon={<Layers className="h-5 w-5 text-cyan-600" />}
              accentColor="cyan"
            />
          </div>

          {/* Active / In-Progress Intake Draft Card */}
          {activeDraft && (
            <Card className="border-teal-500/40 bg-teal-500/5">
              <CardHeader className="pb-3 border-b border-teal-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-teal-600" />
                    <CardTitle className="text-sm font-bold text-foreground">
                      {dict.patientDashboard.continueIntake}
                    </CardTitle>
                  </div>
                  <Badge variant="clinical">In-Progress Intake</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3.5">
                <div>
                  <h4 className="text-sm font-bold text-foreground">
                    {activeDraft.chiefComplaint || "Unspecified Complaint"}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    AYUSH / Allopathy System: <span className="font-semibold text-teal-600 uppercase">{activeDraft.selectedAyushSystem}</span> • Stage: Step {(activeDraft.currentStepIndex || 0) + 1} of 6
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">{dict.patientDashboard.stepProgress}</span>
                    <span className="text-teal-600">
                      {Math.min(100, Math.round((((activeDraft.currentStepIndex || 0) + 1) / 6) * 100))}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-teal-600 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, Math.round((((activeDraft.currentStepIndex || 0) + 1) / 6) * 100))}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">
                    {dict.caseTaking.aiDisclaimer}
                  </span>
                  <Link href="/case-taking">
                    <Button variant="clinical" size="sm" className="gap-1.5 text-xs font-bold shadow-md">
                      <span>{dict.patientDashboard.continueIntake}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Registered Case Intakes & Doctor Verified Cases */}
          <Card className="border-border">
            <CardHeader className="pb-3 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-teal-600" />
                  <CardTitle className="text-sm font-bold">{dict.patientDashboard.verifiedHistoryTitle}</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab("previous-cases")}
                  className="text-xs text-teal-600 font-semibold"
                >
                  {dict.common.viewAll} ({displayCases.length})
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-2.5">
              {displayCases.map((c) => (
                <div
                  key={c._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-border bg-card hover:border-teal-500/50 transition gap-2 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{c.chiefComplaint}</span>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="text-muted-foreground text-[11px]">
                      Case #{c.caseNumber} • {c.doctorName ? `Verified by ${c.doctorName}` : "Awaiting Doctor Verification"}
                      {c.createdAt && ` • ${formatDate(c.createdAt)}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Link href={`/patient/case/${c._id}`}>
                      <Button variant="outline" size="sm" className="h-7 text-xs gap-1 border-teal-500/30 hover:bg-teal-500/10">
                        <Eye className="h-3 w-3 text-teal-600" />
                        <span>View Case Details</span>
                      </Button>
                    </Link>
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
          {activeDraft ? (
            <Card className="border-teal-500/30 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-foreground block">{activeDraft.chiefComplaint}</span>
                  <p className="text-muted-foreground">
                    System: {activeDraft.selectedAyushSystem} • Step {(activeDraft.currentStepIndex || 0) + 1} of 6
                  </p>
                </div>
                <Link href="/case-taking">
                  <Button variant="clinical" size="sm">Resume Draft Intake</Button>
                </Link>
              </div>
            </Card>
          ) : (
            <p className="text-xs text-muted-foreground italic">No draft case currently in progress.</p>
          )}
        </div>
      )}

      {/* PREVIOUS CASES TAB */}
      {activeTab === "previous-cases" && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-foreground">Complete Case History</h3>
          <div className="space-y-3">
            {displayCases.map((c) => (
              <Card key={c._id} className="p-4 text-xs space-y-2 hover:border-teal-500/40 transition">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground text-sm">{c.chiefComplaint}</span>
                  <StatusBadge status={c.status} />
                </div>
                <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                  <span>
                    Case #{c.caseNumber} • {c.doctorName ? `Verified by ${c.doctorName}` : "Pending Verification"}
                  </span>
                  <Link href={`/patient/case/${c._id}`}>
                    <Button variant="outline" size="sm" className="h-6 text-[11px] gap-1">
                      <Eye className="h-3 w-3" />
                      <span>View Summary</span>
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
        </>
      )}
    </DashboardLayout>
  );
}
