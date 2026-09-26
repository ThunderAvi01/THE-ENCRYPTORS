"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Stethoscope,
  LayoutDashboard,
  HeartPulse,
  FileText,
  Clock,
  FileCheck2,
  Calendar,
  Search,
  MessageSquare,
  ShieldCheck,
  User,
  Users,
  AlertTriangle,
  Activity,
  LogOut,
  ChevronRight,
  Sparkles,
  Layers,
  Settings,
  HelpCircle,
  FileScan,
  UserCheck,
  CheckCircle2,
} from "lucide-react";
import { UserRole } from "@/types/user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface SidebarProps {
  role: UserRole;
  userName?: string;
  userEmail?: string;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export interface NavGroupItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  href?: string;
}

export function Sidebar({
  role,
  userName = "User",
  userEmail = "user@domain.com",
  activeTab,
  onTabChange,
  isOpenMobile = false,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();
  const { dict } = useLanguage();

  // Navigation Items per Role
  const getNavItems = (): NavGroupItem[] => {
    switch (role) {
      case "PATIENT":
        return [
          { id: "overview", label: dict.navigation.dashboard, icon: <LayoutDashboard className="h-4 w-4" /> },
          { id: "start-case", label: dict.patientDashboard.startIntakeBtn, icon: <HeartPulse className="h-4 w-4 text-teal-600" />, badge: "AI Intake" },
          { id: "continue-case", label: dict.patientDashboard.continueIntake, icon: <Clock className="h-4 w-4" /> },
          { id: "previous-cases", label: dict.patientDashboard.verifiedHistoryTitle, icon: <FileText className="h-4 w-4" /> },
        ];

      case "DOCTOR":
        return [
          { id: "overview", label: "Clinical Station Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
          { id: "todays-patients", label: "Today's Patient Queue", icon: <Users className="h-4 w-4 text-emerald-600" />, badge: "OPD Queue" },
          { id: "pending-cases", label: "Pending Intake Verification", icon: <FileCheck2 className="h-4 w-4 text-amber-500" />, badge: "Verification" },
          { id: "urgent-cases", label: "Urgent Triage Red Flags", icon: <AlertTriangle className="h-4 w-4 text-rose-600" />, badge: "Critical" },
          { id: "completed-cases", label: "Completed Case Records", icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" /> },
          { id: "appointments", label: "Consultation Schedule", icon: <Calendar className="h-4 w-4" /> },
          { id: "recent-patients", label: "Recent Patient History", icon: <Clock className="h-4 w-4" /> },
          { id: "patient-stats", label: "Patient Analytics & AYUSH", icon: <Activity className="h-4 w-4" /> },
          { id: "chamber-settings", label: "Chamber & Fee Settings", icon: <Settings className="h-4 w-4" /> },
        ];

      case "ADMIN":
        return [
          { id: "overview", label: "Control Center Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
          { id: "patients-list", label: "Total Patients Registry", icon: <Users className="h-4 w-4" /> },
          { id: "doctors-list", label: "Total Doctors & AYUSH", icon: <Stethoscope className="h-4 w-4" /> },
          { id: "appointments-admin", label: "Appointments Overseer", icon: <Calendar className="h-4 w-4" /> },
          { id: "active-users", label: "Active Users Telemetry", icon: <Activity className="h-4 w-4" /> },
          { id: "doctor-verifications", label: "Practitioner Approvals", icon: <UserCheck className="h-4 w-4 text-amber-500" />, badge: "Requires Action" },
          { id: "audit-logs", label: "Clinical Audit Logs", icon: <ShieldCheck className="h-4 w-4" /> },
        ];

      case "TRIAGE_STAFF":
        return [
          { id: "overview", label: "Triage Station Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
          { id: "urgent-patients", label: "Urgent Red-Flag Patients", icon: <AlertTriangle className="h-4 w-4 text-rose-600" />, badge: "Emergency" },
          { id: "new-alerts", label: "New Alerts & Vitals Anomalies", icon: <Activity className="h-4 w-4 text-amber-500" /> },
          { id: "active-cases", label: "Active OPD Queue", icon: <Users className="h-4 w-4" /> },
          { id: "resolved-cases", label: "Resolved / Dispatched", icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" /> },
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const getRoleBadge = () => {
    switch (role) {
      case "DOCTOR":
        return <Badge variant="verified">Doctor / AYUSH</Badge>;
      case "ADMIN":
        return <Badge variant="destructive">Admin Portal</Badge>;
      case "TRIAGE_STAFF":
        return <Badge variant="warning">Triage Station</Badge>;
      default:
        return <Badge variant="clinical">Patient Portal</Badge>;
    }
  };

  const content = (
    <div className="flex flex-col h-full bg-card text-card-foreground border-r border-border w-64 shrink-0">
      {/* Brand Header */}
      <div className="p-4 border-b border-border flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-md">
          <Stethoscope className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-foreground text-sm tracking-tight">
            Arogya<span className="text-teal-600 dark:text-teal-400">Intake</span>
          </span>
          <span className="text-[10px] text-muted-foreground font-medium">
            Clinical Health Hub
          </span>
        </div>
      </div>

      {/* Role Badge Header */}
      <div className="px-4 py-2.5 bg-muted/30 border-b border-border flex items-center justify-between">
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          Portal View
        </span>
        {getRoleBadge()}
      </div>

      {/* Navigation Group */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const isSelected = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (onTabChange) onTabChange(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                isSelected
                  ? "bg-teal-600 text-white shadow-sm font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isSelected ? "text-white" : ""}>{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-teal-500/10 text-teal-600 dark:text-teal-400"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-border bg-muted/20 space-y-2">
        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-card border border-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-white font-bold text-xs shrink-0">
            {userName[0]}
          </div>
          <div className="flex flex-col truncate">
            <span className="text-xs font-bold text-foreground truncate">{userName}</span>
            <span className="text-[10px] text-muted-foreground truncate">{userEmail}</span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full justify-start text-xs text-muted-foreground hover:text-rose-600 gap-2 h-8"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-screen fixed top-0 left-0 z-40">{content}</div>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onCloseMobile} />
          <div className="relative z-10 w-64 max-w-full h-full animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
