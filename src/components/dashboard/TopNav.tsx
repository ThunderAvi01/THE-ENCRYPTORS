"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  Bell,
  Search,
  ShieldAlert,
  Activity,
  CheckCircle2,
  Lock,
  User,
  Sparkles,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TopNavProps {
  title: string;
  subtitle?: string;
  onOpenMobileSidebar?: () => void;
  roleBadge?: React.ReactNode;
}

export function TopNav({
  title,
  subtitle = "SIH26047 Patient Case-Taking Platform",
  onOpenMobileSidebar,
  roleBadge,
}: TopNavProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4 sm:px-6">
      {/* Left: Mobile Toggle & Title */}
      <div className="flex items-center gap-3">
        {onOpenMobileSidebar && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenMobileSidebar}
            className="lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-foreground tracking-tight">{title}</h1>
            {roleBadge}
          </div>
          <span className="text-[11px] text-muted-foreground hidden sm:inline">{subtitle}</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5">
        {/* DEMO DATA indicator */}
        <Badge variant="outline" className="hidden md:flex items-center gap-1 text-[10px] text-teal-600 border-teal-500/30">
          <Sparkles className="h-3 w-3" />
          <span>Interactive Clinical Dashboard</span>
        </Badge>

        {/* Database Status */}
        <div className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium px-2 py-1 rounded bg-emerald-500/10">
          <Database className="h-3 w-3" />
          <span>MongoDB Atlas Connected</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative h-9 w-9"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-teal-600 animate-ping" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-teal-600" />
          </Button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl border border-border bg-card p-3 shadow-xl z-50 text-xs space-y-2 animate-in fade-in-50 duration-150">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="font-bold text-foreground">Clinical Notifications</span>
                <Badge variant="clinical" className="text-[10px]">2 New</Badge>
              </div>
              <div className="space-y-2 pt-1">
                <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20">
                  <p className="font-semibold text-foreground">Doctor Verification Completed</p>
                  <p className="text-[11px] text-muted-foreground">Dr. Priya Sharma signed Case #CASE-2026-081.</p>
                </div>
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="font-semibold text-foreground">Draft Intake In-Progress</p>
                  <p className="text-[11px] text-muted-foreground">Continue Step 3 of 6 in your active intake.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
