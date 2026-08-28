export type VerificationStatus =
  | "DRAFT"
  | "UNDER_REVIEW"
  | "EDITED"
  | "VERIFIED"
  | "REJECTED";

export interface SummaryContent {
  chiefComplaint: string;
  historyOfPresentIllness: string;
  pastMedicalHistory: string[];
  pastSurgicalHistory: string[];
  drugHistory: string[];
  allergyHistory: string[];
  familyHistory: string[];
  personalHistory: {
    dietaryPattern?: string;
    tobaccoUse?: boolean;
    alcoholUse?: boolean;
    sleepPattern?: string;
  };
  reviewOfSystems: string[];
  previousInvestigations: string[];
  currentMedications: string[];
  ayushSpecificHistory?: Record<string, unknown>;
  importantPatientNotes?: string;
  redFlags: string[];
}

export interface SummaryAuditRecord {
  action: "CREATED" | "EDITED" | "VERIFIED" | "REJECTED";
  timestamp: Date;
  modifiedByDoctorId?: string;
  modifiedByName?: string;
  notes?: string;
  changesSummary?: string;
}
