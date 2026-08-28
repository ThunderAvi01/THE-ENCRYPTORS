import React from "react";
import { ShieldAlert, Info } from "lucide-react";
import { CLINICAL_SAFETY_DISCLAIMER } from "@/utils/clinicalSafety";

interface SafetyBannerProps {
  compact?: boolean;
  className?: string;
}

export function ClinicalSafetyBanner({ compact = false, className = "" }: SafetyBannerProps) {
  if (compact) {
    return (
      <div
        className={`flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-300 ${className}`}
      >
        <Info className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <span>Non-autonomous clinical decision support. All outputs require doctor verification.</span>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 text-sm text-amber-900 dark:text-amber-200 ${className}`}
    >
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <div className="space-y-1">
          <h4 className="font-semibold text-amber-950 dark:text-amber-100">
            Mandatory Clinical Safety Notice
          </h4>
          <p className="text-xs leading-relaxed text-amber-800/90 dark:text-amber-300/90">
            {CLINICAL_SAFETY_DISCLAIMER}
          </p>
        </div>
      </div>
    </div>
  );
}
