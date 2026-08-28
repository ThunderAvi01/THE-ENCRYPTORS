import React from "react";
import { Badge } from "@/components/ui/badge";

export type ClinicalStatusType =
  | "VERIFIED"
  | "PENDING_REVIEW"
  | "DRAFT"
  | "URGENT_EMERGENCY"
  | "ACTIVE"
  | "RESOLVED"
  | "COMPLETED"
  | "PENDING_VERIFICATION"
  | "CRITICAL_EMERGENCY";

interface StatusBadgeProps {
  status: ClinicalStatusType | string;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  switch (status) {
    case "VERIFIED":
    case "VERIFIED_BY_DOCTOR":
    case "COMPLETED":
    case "RESOLVED":
      return (
        <Badge variant="verified" className={className}>
          Verified
        </Badge>
      );
    case "PENDING_REVIEW":
    case "PENDING_DOCTOR_REVIEW":
    case "PENDING_VERIFICATION":
    case "AI_INTAKE_COMPLETED":
      return (
        <Badge variant="warning" className={className}>
          Pending Doctor Review
        </Badge>
      );
    case "CRITICAL_EMERGENCY":
    case "URGENT_EMERGENCY":
      return (
        <Badge variant="emergency" className={className}>
          🚨 Urgent Emergency
        </Badge>
      );
    case "ACTIVE":
      return (
        <Badge variant="clinical" className={className}>
          Active Case
        </Badge>
      );
    case "DRAFT":
    default:
      return (
        <Badge variant="outline" className={className}>
          Draft Intake
        </Badge>
      );
  }
}
