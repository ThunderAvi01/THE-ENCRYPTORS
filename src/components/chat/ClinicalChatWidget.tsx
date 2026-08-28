import React from "react";
import { MessageSquare, PhoneCall, ShieldCheck, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ClinicalChatWidget() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-teal-600" />
          <h4 className="text-sm font-semibold text-foreground">Secure Doctor-Patient Channel</h4>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
          <Lock className="h-3 w-3" />
          <span>E2E Encrypted</span>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-muted/20 p-3 text-xs space-y-2">
        <div className="bg-card border border-border p-2 rounded-lg max-w-[85%]">
          <p className="text-foreground">
            Dr. Sharma: “I have reviewed your synthesized intake. Please ensure you take the antacid on an empty stomach.”
          </p>
          <span className="text-[10px] text-muted-foreground mt-0.5 block">11:15 AM</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
        <span>Realtime updates powered by Socket.IO architecture</span>
        <Badge variant="outline" className="text-[10px]">Ready</Badge>
      </div>
    </div>
  );
}
