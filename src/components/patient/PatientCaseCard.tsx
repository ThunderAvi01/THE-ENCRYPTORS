import React from "react";
import { Clock, FileText, CheckCircle2, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PatientCaseCardProps {
  caseId: string;
  date: string;
  chiefComplaint: string;
  status: "DRAFT" | "AI_INTAKE_COMPLETED" | "VERIFIED_BY_DOCTOR";
  documentsCount: number;
}

export function PatientCaseCard({
  caseId,
  date,
  chiefComplaint,
  status,
  documentsCount,
}: PatientCaseCardProps) {
  return (
    <div className="p-4 rounded-xl border border-border bg-card hover:border-teal-500/50 transition space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase">Case #{caseId}</span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">{date}</span>
        </div>
        <Badge
          variant={
            status === "VERIFIED_BY_DOCTOR"
              ? "verified"
              : status === "AI_INTAKE_COMPLETED"
              ? "clinical"
              : "outline"
          }
          className="text-[10px]"
        >
          {status === "VERIFIED_BY_DOCTOR" ? "Doctor Verified" : status === "AI_INTAKE_COMPLETED" ? "Summary Ready" : "Draft"}
        </Badge>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-foreground">{chiefComplaint}</h4>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <FileText className="h-3.5 w-3.5 text-teal-600" />
          <span>{documentsCount} Medical Documents Attached</span>
        </div>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1 text-teal-600">
          <span>View Details</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
