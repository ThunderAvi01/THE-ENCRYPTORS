"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Users,
  Stethoscope,
  UserCheck,
  Activity,
  FileCheck2,
  Lock,
  Database,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  BarChart,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { MOCK_ADMIN_DATA } from "@/lib/mockData";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <DashboardLayout
      role="ADMIN"
      userName="Chief Administrator"
      userEmail="admin@example.com"
      activeTab={activeTab}
      onTabChange={setActiveTab}
      title="Admin Control Center"
      subtitle="SIH26047 • System Telemetry, Doctor Verification & Audit Logs"
    >
      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="p-6 rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-500/10 via-card to-amber-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <Badge variant="destructive">Superuser Admin</Badge>
                <Badge variant="outline" className="text-[10px]">
                  System Uptime: {MOCK_ADMIN_DATA.stats.systemUptime}
                </Badge>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Platform Telemetry & Governance
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Oversee total patient accounts, clinician registration approvals, appointment throughput, and security audit trails.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh Metrics
              </Button>
            </div>
          </div>

          {/* 4 Core Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Patients"
              value={MOCK_ADMIN_DATA.stats.totalPatients}
              subtext="Registered Patients"
              icon={<Users className="h-5 w-5 text-teal-600" />}
              trend={{ value: "+12% this week", isPositive: true }}
              accentColor="teal"
            />
            <StatCard
              title="Total Doctors"
              value={MOCK_ADMIN_DATA.stats.totalDoctors}
              subtext="Allopathy & AYUSH"
              icon={<Stethoscope className="h-5 w-5 text-emerald-600" />}
              accentColor="emerald"
            />
            <StatCard
              title="Total Appointments"
              value={MOCK_ADMIN_DATA.stats.totalAppointments}
              subtext="Consultations Logged"
              icon={<Calendar className="h-5 w-5 text-cyan-600" />}
              trend={{ value: "+8% growth", isPositive: true }}
              accentColor="cyan"
            />
            <StatCard
              title="Active Users Today"
              value={MOCK_ADMIN_DATA.stats.activeUsersToday}
              subtext="Realtime Telemetry"
              icon={<Activity className="h-5 w-5 text-indigo-600" />}
              accentColor="indigo"
            />
          </div>

          {/* Additional Platform Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 border-border space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Cases Intake
              </span>
              <p className="text-2xl font-bold text-foreground">{MOCK_ADMIN_DATA.stats.totalCasesIntake}</p>
              <p className="text-[11px] text-muted-foreground">Structured Intakes Synthesized</p>
            </Card>

            <Card className="p-4 border-border space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Audit Logs Logged
              </span>
              <p className="text-2xl font-bold text-teal-600">{MOCK_ADMIN_DATA.stats.auditLogsRecorded}</p>
              <p className="text-[11px] text-muted-foreground">DPDP Compliance Events</p>
            </Card>

            <Card className="p-4 border-border space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Pending Verification
              </span>
              <p className="text-2xl font-bold text-amber-600">
                {MOCK_ADMIN_DATA.stats.pendingDoctorVerifications} Doctors
              </p>
              <p className="text-[11px] text-muted-foreground">Awaiting NMC Review</p>
            </Card>
          </div>

          {/* Pending Doctor Approvals */}
          <Card className="border-border">
            <CardHeader className="pb-3 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-teal-600" />
                    Doctor & AYUSH Practitioner Verification Approvals
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Review state council credentials before granting clinician access
                  </CardDescription>
                </div>
                <Badge variant="warning">{MOCK_ADMIN_DATA.pendingDoctorVerifications.length} Pending</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {MOCK_ADMIN_DATA.pendingDoctorVerifications.map((doc) => (
                <div
                  key={doc.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-lg border border-border bg-card gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{doc.name}</span>
                      <Badge variant="outline">{doc.ayushSystem}</Badge>
                      <Badge variant="warning">Reg: {doc.registrationNumber}</Badge>
                    </div>
                    <p className="text-muted-foreground text-[11px]">
                      {doc.email} • {doc.specialization} • Fee: ₹{doc.consultationFee}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Button variant="doctor" size="sm" className="h-8 text-xs">
                      Approve Doctor
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs text-rose-600">
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* PATIENTS LIST TAB */}
      {activeTab === "patients-list" && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-foreground">Total Registered Patients Registry</h3>
          <Card className="p-4 text-xs">
            <p className="font-bold text-foreground">1,482 Active Patient Profiles Logged</p>
          </Card>
        </div>
      )}

      {/* DOCTORS LIST TAB */}
      {activeTab === "doctors-list" && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-foreground">Total Clinicians & AYUSH Practitioners</h3>
          <Card className="p-4 text-xs">
            <p className="font-bold text-foreground">124 Verified Doctors (Allopathy, Ayurveda, Homeopathy)</p>
          </Card>
        </div>
      )}

      {/* APPOINTMENTS ADMIN TAB */}
      {activeTab === "appointments-admin" && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-foreground">Appointments Overseer</h3>
          <Card className="p-4 text-xs">
            <p className="font-bold text-foreground">3,890 Consultation Appointments Scheduled</p>
          </Card>
        </div>
      )}

      {/* ACTIVE USERS TAB */}
      {activeTab === "active-users" && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-foreground">Active Users Telemetry</h3>
          <Card className="p-4 text-xs">
            <p className="font-bold text-foreground">312 Active Concurrent Connections</p>
          </Card>
        </div>
      )}

      {/* DOCTOR VERIFICATIONS TAB */}
      {activeTab === "doctor-verifications" && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-foreground">Practitioner Approvals</h3>
          <Card className="p-4 text-xs">
            <p className="font-bold text-foreground">Review 5 pending medical council verifications</p>
          </Card>
        </div>
      )}

      {/* AUDIT LOGS TAB */}
      {activeTab === "audit-logs" && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-foreground">Clinical Audit Logs</h3>
          <Card className="p-4 text-xs">
            <p className="font-bold text-foreground">18,450 Security Audit Records Logged</p>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
