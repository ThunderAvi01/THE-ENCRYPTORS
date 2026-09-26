"use client";

import React from "react";
import { AlertTriangle, PhoneCall, Hospital, ShieldAlert, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface EmergencyRedFlagModalProps {
  isOpen: boolean;
  alertReason: string;
  recommendedAction?: string;
  onAcknowledgeEmergency?: () => void;
}

export function EmergencyRedFlagModal({
  isOpen,
  alertReason,
  recommendedAction,
  onAcknowledgeEmergency,
}: EmergencyRedFlagModalProps) {
  const { dict } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in-50">
      <div className="max-w-lg w-full rounded-2xl border-2 border-rose-500 bg-card p-6 shadow-2xl space-y-6 text-foreground">
        {/* Urgent Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-600 text-white shrink-0 shadow-lg animate-pulse">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="emergency" className="text-xs uppercase px-2 py-0.5 font-black tracking-wider">
                {dict.safety.emergencyDetected}
              </Badge>
            </div>
            <h3 className="text-lg font-black text-rose-600 dark:text-rose-400">
              {dict.safety.urgentSituation}
            </h3>
            <p className="text-xs text-muted-foreground font-semibold">
              SIH26047 {dict.safety.guardrailTitle}
            </p>
          </div>
        </div>

        {/* Warning Box */}
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 space-y-2 text-xs text-rose-950 dark:text-rose-200">
          <div className="flex items-center gap-2 font-bold text-rose-700 dark:text-rose-300">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{dict.safety.alertReason}</span>
          </div>
          <p className="font-bold text-sm leading-relaxed">{alertReason}</p>
          {recommendedAction && (
            <p className="text-xs text-rose-800 dark:text-rose-300 pt-1 leading-relaxed">
              {recommendedAction}
            </p>
          )}
        </div>

        {/* Action Steps for Emergency */}
        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="tel:108"
              className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
            >
              <PhoneCall className="h-4 w-4" />
              <span>{dict.safety.callAmbulance}</span>
            </a>

            <div className="p-3.5 rounded-xl border border-border bg-muted/40 font-bold text-xs flex items-center justify-center gap-2 text-foreground">
              <Hospital className="h-4 w-4 text-teal-600" />
              <span>{dict.safety.visitER}</span>
            </div>
          </div>
        </div>

        {/* Non-Hiding Disclaimer & Proceed Button */}
        <div className="pt-2 border-t border-border space-y-3">
          <p className="text-[11px] text-muted-foreground leading-relaxed italic">
            {dict.safety.triageEscalated}
          </p>

          {onAcknowledgeEmergency && (
            <Button
              variant="outline"
              size="sm"
              onClick={onAcknowledgeEmergency}
              className="w-full text-xs font-bold border-rose-500/40 text-rose-700 dark:text-rose-300 hover:bg-rose-500/10"
            >
              <span>{dict.safety.acknowledgeBtn}</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
