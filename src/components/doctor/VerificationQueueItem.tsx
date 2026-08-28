import React from "react";
import Link from "next/link";
import { User, Clock, ArrowRight, ShieldCheck, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface QueueItemProps {
  caseId?: string;
  patientName: string;
  ageGender: string;
  complaint: string;
  duration: string;
  status: "PENDING_REVIEW" | "VERIFIED";
  timeAgo: string;
}

export function VerificationQueueItem({
  caseId = "case-881",
  patientName,
  ageGender,
  complaint,
  duration,
  status,
  timeAgo,
}: QueueItemProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-teal-500/50 transition gap-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-teal-600 font-bold">
          <User className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-foreground text-sm">{patientName}</h4>
            <span className="text-xs text-muted-foreground">({ageGender})</span>
            <Badge variant={status === "VERIFIED" ? "verified" : "warning"} className="text-[10px]">
              {status === "VERIFIED" ? "Doctor Verified" : "Pending Doctor Review"}
            </Badge>
          </div>
          <p className="text-xs text-foreground/80">
            <span className="font-medium">Chief Complaint:</span> {complaint} ({duration})
          </p>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Intake Completed {timeAgo}</span>
            <span>•</span>
            <span className="text-teal-600 dark:text-teal-400 font-medium">AI Summary Attached</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center">
        <Link href={`/doctor/cases/${caseId}`}>
          <Button variant={status === "VERIFIED" ? "outline" : "doctor"} size="sm" className="gap-1 text-xs">
            <FileCheck className="h-3.5 w-3.5" />
            {status === "VERIFIED" ? "View Clinical Notes" : "Review & Verify"}
          </Button>
        </Link>
      </div>
    </div>
  );
}
