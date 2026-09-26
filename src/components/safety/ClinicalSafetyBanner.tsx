"use client";

import React from "react";
import { ShieldAlert, Info, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface SafetyBannerProps {
  compact?: boolean;
  className?: string;
}

export function ClinicalSafetyBanner({ compact = false, className = "" }: SafetyBannerProps) {
  const { dict } = useLanguage();

  if (compact) {
    return (
      <div
        className={`flex items-center gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2.5 text-xs text-amber-900 dark:text-amber-200 shadow-sm ${className}`}
      >
        <Info className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <span className="font-medium leading-relaxed">
          {dict.safety.compactDisclaimer}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-amber-500/30 bg-card/80 backdrop-blur-md p-5 sm:p-6 shadow-md ${className}`}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-teal-500" />
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm sm:text-base font-bold text-amber-950 dark:text-amber-100">
              {dict.safety.bannerNotice}
            </h4>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:text-amber-300">
              <AlertTriangle className="h-3 w-3" />
              {dict.safety.nonAutonomousBadge}
            </span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
            {dict.safety.disclaimerText}
          </p>
        </div>
      </div>
    </div>
  );
}
