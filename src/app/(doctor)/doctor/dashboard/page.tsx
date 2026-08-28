"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Stethoscope,
  ShieldCheck,
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Users,
  MessageSquare,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ClinicalSafetyBanner } from "@/components/safety/ClinicalSafetyBanner";
import { DoctorAnalyticsWidget } from "@/components/doctor/DoctorAnalyticsWidget";
import { DoctorPatientChatWidget } from "@/components/chat/DoctorPatientChatWidget";
import { MOCK_DOCTOR_DATA } from "@/lib/mockData";

export default function DoctorDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <DashboardLayout
      role="DOCTOR"
      userName="Dr. Priya Sharma"
      userEmail="doctor@example.com"
      activeTab={activeTab}
      onTabChange={setActiveTab}
      title="Doctor Clinical Station"
      subtitle="SIH26047 • Licensed Practitioner Verification & OPD Queue"
    >
      {/* MANDATORY SAFETY GUARDRAIL BANNER */}
      <ClinicalSafetyBanner compact />

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Clinician Profile Banner */}
          <div className="p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-card to-teal-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <Badge variant="verified">Verified Clinician</Badge>
                <span className="text-xs font-semibold text-muted-foreground">
                  NMC Reg: NMC-2024-99881 • AYUSH System: ALLOPATHY / AYURVEDA
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Good day, Dr. Priya Sharma
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                You have {MOCK_DOCTOR_DATA.todaysPatients.length} patients waiting in today&apos;s OPD verification queue.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <Link href="/doctor/queue">
                <Button variant="doctor" className="w-full sm:w-auto gap-2 shadow-md">
                  <FileCheck2 className="h-4 w-4" />
                  <span>Open Verification Queue</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Analytics Widget */}
          <DoctorAnalyticsWidget />

          {/* Today's Patients & Verification Queue */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-border lg:col-span-2">
              <CardHeader className="pb-3 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-emerald-600" />
                    <CardTitle className="text-sm font-bold">Today&apos;s OPD Patient Consultations</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-[10px]">3 Scheduled</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {MOCK_DOCTOR_DATA.todaysPatients.map((pat) => (
                  <div
                    key={pat.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-border bg-card hover:border-emerald-500/50 transition gap-2 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{pat.name} ({pat.ageGender})</span>
                        <StatusBadge status={pat.status} />
                      </div>
                      <p className="text-muted-foreground text-[11px]">
                        Chief Complaint: {pat.complaint} ({pat.duration})
                      </p>
                      <p className="text-emerald-700 dark:text-emerald-300 font-medium text-[11px]">
                        Vitals: {pat.vitalsSummary}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Link href="/doctor/queue">
                        <Button variant={pat.status === "VERIFIED" ? "outline" : "doctor"} size="sm" className="h-8 text-xs">
                          {pat.status === "VERIFIED" ? "View Notes" : "Verify & Sign"}
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Doctor-Patient Chat Widget */}
            <div className="lg:col-span-1">
              <DoctorPatientChatWidget
                targetUserId="patient_demo_1"
                targetUserName="Rajesh Kumar (Patient)"
                targetRole="PATIENT"
                currentUserId="doctor_demo_1"
              />
            </div>
          </div>
        </div>
      )}

      {/* APPOINTMENTS TAB */}
      {activeTab === "appointments" && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-foreground">Consultation Schedule & Appointments</h3>
          <Card className="p-4 text-xs space-y-2">
            <p className="font-bold text-foreground">Rajesh Kumar - 10:00 AM (In-Person OPD)</p>
            <p className="text-muted-foreground">Fee: ₹500 • Status: CONFIRMED</p>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
