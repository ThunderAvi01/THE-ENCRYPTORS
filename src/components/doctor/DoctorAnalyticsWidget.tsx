"use client";

import React from "react";
import { Users, Calendar, CheckCircle2, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";

interface DoctorAnalyticsProps {
  stats?: {
    patientsToday: number;
    patientsThisWeek: number;
    patientsThisMonth: number;
    completedConsultations: number;
    pendingAppointments: number;
    urgentCases: number;
  };
}

export function DoctorAnalyticsWidget({ stats }: DoctorAnalyticsProps) {
  const defaultStats = {
    patientsToday: stats?.patientsToday ?? 8,
    patientsThisWeek: stats?.patientsThisWeek ?? 34,
    patientsThisMonth: stats?.patientsThisMonth ?? 128,
    completedConsultations: stats?.completedConsultations ?? 112,
    pendingAppointments: stats?.pendingAppointments ?? 6,
    urgentCases: stats?.urgentCases ?? 2,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-teal-600" />
          Clinical Practice Analytics
        </h3>
        <span className="text-[11px] text-muted-foreground font-semibold">Real-time OPD Insights</span>
      </div>

      {/* Analytics Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Patients Today"
          value={defaultStats.patientsToday}
          subtext="OPD Consultations Today"
          icon={<Users className="h-5 w-5 text-teal-600" />}
          accentColor="teal"
        />
        <StatCard
          title="Patients This Week"
          value={defaultStats.patientsThisWeek}
          subtext="Weekly Check-in Volume"
          icon={<Calendar className="h-5 w-5 text-cyan-600" />}
          accentColor="cyan"
        />
        <StatCard
          title="Patients This Month"
          value={defaultStats.patientsThisMonth}
          subtext="Monthly Total Cases"
          icon={<TrendingUp className="h-5 w-5 text-teal-700" />}
          accentColor="teal"
        />
        <StatCard
          title="Completed Consultations"
          value={defaultStats.completedConsultations}
          subtext="Doctor Verified Cases"
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
          accentColor="emerald"
        />
        <StatCard
          title="Pending Appointments"
          value={defaultStats.pendingAppointments}
          subtext="Awaiting OPD Consultation"
          icon={<Clock className="h-5 w-5 text-amber-600" />}
          accentColor="amber"
        />
        <StatCard
          title="Urgent Red-Flag Cases"
          value={defaultStats.urgentCases}
          subtext="Priority Red-Flag Triage"
          icon={<AlertTriangle className="h-5 w-5 text-rose-600 animate-pulse" />}
          accentColor="rose"
        />
      </div>
    </div>
  );
}
