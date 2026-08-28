"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Plus,
  CheckCircle2,
  Bell,
  RefreshCw,
  Eye,
  CheckSquare,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ClinicalSafetyBanner } from "@/components/safety/ClinicalSafetyBanner";

export interface TriageRecordItem {
  _id: string;
  patientAgeGender?: string;
  severity: "NORMAL" | "WARNING" | "URGENT";
  status: "NEW" | "ACKNOWLEDGED" | "IN_PROGRESS" | "RESOLVED";
  alertReason: string;
  triggeredRules?: Array<{
    ruleId: string;
    name: string;
    severity: string;
    reasonText: string;
  }>;
  vitalsSummary?: string;
  createdAt: string;
  staffNotes?: string;
}

export default function TriageDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [records, setRecords] = useState<TriageRecordItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const fetchTriageRecords = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/triage/records");
      if (res.ok) {
        const data = await res.json();
        setRecords(data.records || []);
      }
    } catch (err) {
      console.error("Failed to load triage records:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTriageRecords();
  }, []);

  const handleUpdateStatus = async (recordId: string, newStatus: string) => {
    setIsUpdating(recordId);
    try {
      const res = await fetch("/api/triage/records", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          triageRecordId: recordId,
          status: newStatus,
        }),
      });

      if (res.ok) {
        fetchTriageRecords();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setIsUpdating(null);
    }
  };

  const urgentRecords = records.filter((r) => r.severity === "URGENT" && r.status !== "RESOLVED");
  const warningRecords = records.filter((r) => r.severity === "WARNING" && r.status !== "RESOLVED");
  const resolvedRecords = records.filter((r) => r.status === "RESOLVED");

  return (
    <DashboardLayout
      role="TRIAGE_STAFF"
      userName="OPD Triage Station Staff"
      userEmail="triage@example.com"
      activeTab={activeTab}
      onTabChange={setActiveTab}
      title="OPD Clinical Triage Station"
      subtitle="SIH26047 • Red-Flag Priority Triage & Emergency Escalation"
    >
      {/* 1. MANDATORY SAFETY GUARDRAIL BANNER */}
      <ClinicalSafetyBanner compact />

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="p-6 rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-500/10 via-card to-amber-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <Badge variant="emergency">Triage Queue</Badge>
                <span className="text-xs font-semibold text-muted-foreground">
                  Live Queue: {records.length} Active Records
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                OPD Red-Flag Triage Control
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Deterministic rule engine monitors patient intake inputs for acute red flags (severe chest pain, dyspnea, stroke signs, severe bleeding). Priority dispatch to consulting doctors.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchTriageRecords}
                disabled={isLoading}
                className="gap-1.5 text-xs font-bold"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
                <span>Refresh Queue</span>
              </Button>
              <Link href="/case-taking">
                <Button variant="clinical" size="sm" className="gap-2 font-bold">
                  <Plus className="h-4 w-4" />
                  <span>Assisted Check-In</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Core Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Urgent Red Flags"
              value={urgentRecords.length}
              subtext="Requires Immediate ER/Doctor"
              icon={<AlertTriangle className="h-5 w-5 text-rose-600 animate-pulse" />}
              accentColor="rose"
            />
            <StatCard
              title="Warning Level Alerts"
              value={warningRecords.length}
              subtext="Priority OPD Attention"
              icon={<Bell className="h-5 w-5 text-amber-600" />}
              accentColor="amber"
            />
            <StatCard
              title="Active Queue Total"
              value={records.filter((r) => r.status !== "RESOLVED").length}
              subtext="Pending / In Progress"
              icon={<Activity className="h-5 w-5 text-teal-600" />}
              accentColor="teal"
            />
            <StatCard
              title="Resolved Today"
              value={resolvedRecords.length}
              subtext="Dispatched & Handled"
              icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
              accentColor="emerald"
            />
          </div>

          {/* URGENT RED FLAG PATIENTS QUEUE */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-rose-600 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-rose-600 animate-pulse" />
                Urgent Red-Flag Triage Queue ({urgentRecords.length})
              </h3>
              <span className="text-[11px] text-muted-foreground italic">
                Privacy Enforced: Unnecessary patient data masked
              </span>
            </div>

            {urgentRecords.length === 0 ? (
              <Card className="p-6 text-center text-xs text-muted-foreground border-dashed">
                No active URGENT emergency red-flag cases in the queue.
              </Card>
            ) : (
              <div className="space-y-3">
                {urgentRecords.map((r) => (
                  <Card key={r._id} className="p-4 border-2 border-rose-500/50 bg-rose-500/5 text-xs space-y-3 shadow-md">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="space-y-1 max-w-2xl">
                        <div className="flex items-center gap-2">
                          <Badge variant="emergency" className="font-bold text-[10px]">
                            URGENT RED-FLAG
                          </Badge>
                          <span className="font-bold text-foreground text-sm">
                            Patient Identifier: {r.patientAgeGender || "Checked-in Patient"}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            • Alert Time: {new Date(r.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>

                        <p className="font-bold text-rose-700 dark:text-rose-300 text-xs">
                          Alert Reason: {r.alertReason}
                        </p>

                        {r.triggeredRules && r.triggeredRules.length > 0 && (
                          <div className="text-[11px] text-muted-foreground space-y-0.5 pt-1">
                            <span className="font-semibold text-foreground">Triggered Safety Rules:</span>
                            {r.triggeredRules.map((tr) => (
                              <div key={tr.ruleId} className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-medium">
                                <span>• {tr.name}: {tr.reasonText}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Status Workflow Action Buttons */}
                      <div className="flex flex-wrap items-center gap-1.5 shrink-0 self-end md:self-auto">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground mr-1">
                          Status: <strong className="text-foreground">{r.status}</strong>
                        </span>

                        {r.status === "NEW" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(r._id, "ACKNOWLEDGED")}
                            className="h-8 text-[11px] font-bold border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10"
                          >
                            Acknowledge
                          </Button>
                        )}

                        {(r.status === "NEW" || r.status === "ACKNOWLEDGED") && (
                          <Button
                            variant="clinical"
                            size="sm"
                            onClick={() => handleUpdateStatus(r._id, "IN_PROGRESS")}
                            className="h-8 text-[11px] font-bold"
                          >
                            Mark In Progress
                          </Button>
                        )}

                        {r.status !== "RESOLVED" && (
                          <Button
                            variant="clinical"
                            size="sm"
                            onClick={() => handleUpdateStatus(r._id, "RESOLVED")}
                            className="h-8 text-[11px] font-bold gap-1 bg-emerald-600 hover:bg-emerald-700 text-white border-none"
                          >
                            <CheckSquare className="h-3.5 w-3.5" />
                            <span>Resolve / Dispatch</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* WARNING & ROUTINE ALERTS QUEUE */}
          <Card className="border-border">
            <CardHeader className="pb-3 border-b border-border/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Activity className="h-4 w-4 text-amber-500" />
                  Warning Level Alerts ({warningRecords.length})
                </CardTitle>
                <Badge variant="warning">{warningRecords.length} Active Warnings</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs">
              {warningRecords.length === 0 ? (
                <p className="text-muted-foreground italic text-[11px]">No active warning alerts.</p>
              ) : (
                warningRecords.map((r) => (
                  <div key={r._id} className="p-3 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Badge variant="warning" className="text-[9px]">WARNING</Badge>
                        <span className="font-bold text-foreground">{r.alertReason}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Time: {new Date(r.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • Status: {r.status}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {r.status !== "RESOLVED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(r._id, "RESOLVED")}
                          className="h-7 text-[11px] font-bold border-teal-500/30"
                        >
                          Resolve Alert
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* URGENT PATIENTS TAB */}
      {activeTab === "urgent-patients" && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-rose-600">Urgent Red-Flag Triage Patients</h3>
          {urgentRecords.map((r) => (
            <Card key={r._id} className="p-4 text-xs space-y-2 border-rose-500/30">
              <span className="font-bold text-foreground">{r.patientAgeGender}</span>
              <p className="text-rose-600 font-bold">{r.alertReason}</p>
              <p className="text-muted-foreground text-[11px]">Status: {r.status}</p>
            </Card>
          ))}
        </div>
      )}

      {/* NEW ALERTS TAB */}
      {activeTab === "new-alerts" && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-foreground">New Triage Alerts</h3>
          {records.filter((r) => r.status === "NEW").map((r) => (
            <Card key={r._id} className="p-4 text-xs space-y-2">
              <p className="font-bold text-foreground">{r.alertReason}</p>
              <p className="text-muted-foreground">{new Date(r.createdAt).toLocaleString()}</p>
            </Card>
          ))}
        </div>
      )}

      {/* RESOLVED CASES TAB */}
      {activeTab === "resolved-cases" && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-foreground">Resolved Triage Records Today</h3>
          {resolvedRecords.map((r) => (
            <Card key={r._id} className="p-4 text-xs space-y-1">
              <p className="font-bold text-emerald-600">{r.alertReason}</p>
              <p className="text-muted-foreground text-[11px]">Resolved at {new Date(r.createdAt).toLocaleString()}</p>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
