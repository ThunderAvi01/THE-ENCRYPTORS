import React from "react";
import { AlertCircle, RefreshCw, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "@/utils/constants";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Clinical Data Error",
  message = "An error occurred while communicating with the health server. Please retry.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="p-6 rounded-xl border border-rose-500/30 bg-rose-500/5 text-center space-y-3">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600">
        <AlertCircle className="h-5 w-5" />
      </div>
      <div className="space-y-1 max-w-md mx-auto">
        <h4 className="text-sm font-semibold text-rose-950 dark:text-rose-200">{title}</h4>
        <p className="text-xs text-rose-800/80 dark:text-rose-300/80 leading-relaxed">{message}</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="text-xs gap-1 border-rose-500/30">
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retry Connection</span>
          </Button>
        )}
        <div className="flex items-center gap-1 text-[11px] text-rose-700 dark:text-rose-300 font-medium px-2 py-1 rounded bg-rose-500/10">
          <PhoneCall className="h-3 w-3" />
          <span>Helpline: {APP_CONFIG.emergencyHelplines.nationalEmergency}</span>
        </div>
      </div>
    </div>
  );
}
