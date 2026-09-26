export type CaseStatus =
  | "DRAFT"
  | "AI_INTAKE_COMPLETED"
  | "PENDING_DOCTOR_REVIEW"
  | "VERIFIED_BY_DOCTOR"
  | "REVISION_REQUESTED";

export type SeverityLevel = "MILD" | "MODERATE" | "SEVERE" | "CRITICAL_EMERGENCY";

export interface ChiefComplaint {
  symptom: string;
  durationNumber: number;
  durationUnit: "HOURS" | "DAYS" | "WEEKS" | "MONTHS" | "YEARS";
  severity: SeverityLevel;
  description: string;
  bodySite?: string;
}

export interface VitalsData {
  recordedAt: Date;
  systolicBp?: number;
  diastolicBp?: number;
  heartRate?: number;
  respiratoryRate?: number;
  spo2?: number;
  temperature?: number;
  heightCm?: number;
  weightKg?: number;
  bmi?: number;
}

export interface AllergyItem {
  substance: string;
  reaction: string;
  severity: "MILD" | "MODERATE" | "SEVERE" | "LIFE_THREATENING";
}

export interface CurrentMedication {
  medicineName: string;
  dosage: string;
  frequency: string;
  prescribedFor?: string;
}

export interface MedicalDocumentReference {
  id: string;
  fileName: string;
  fileUrl: string;
  documentType: "PRESCRIPTION" | "LAB_REPORT" | "DISCHARGE_SUMMARY" | "IMAGING" | "OTHER";
  uploadedAt: Date;
  isProcessed: boolean;
}

export interface StructuredClinicalSummary {
  generatedAt: Date;
  aiModelUsed: string;
  chiefComplaintsSummary: string;
  chronologicalHpi: string;
  relevantMedicalHistory: string;
  systemReviewFindings: string[];
  suggestedClinicalQuestionsForDoctor: string[];
  redFlagAlerts: string[];
  // Clinical Safety Enforcer: Never contain autonomous prescription or final diagnosis
  safetyDisclaimer: string;
}

export interface DoctorVerification {
  verifiedByDoctorId: string;
  doctorName: string;
  doctorRegistrationNumber: string;
  verifiedAt: Date;
  clinicalNotes: string;
  provisionalDiagnosis?: string;
  recommendedPlan?: string;
  verificationSignatureToken: string;
}

export interface CaseRecordData {
  id: string;
  patientId: string;
  consentId: string;
  status: CaseStatus;
  createdAt: Date;
  updatedAt: Date;
  chiefComplaints: ChiefComplaint[];
  vitals?: VitalsData;
  pastMedicalHistory: string[];
  pastSurgicalHistory: string[];
  allergies: AllergyItem[];
  currentMedications: CurrentMedication[];
  familyHistory: string[];
  socialHabits: {
    tobaccoUse: boolean;
    alcoholUse: boolean;
    dietaryPattern: "VEGETARIAN" | "NON_VEGETARIAN" | "VEGAN" | "OTHER";
  };
  attachedDocuments: MedicalDocumentReference[];
  aiClinicalSummary?: StructuredClinicalSummary;
  doctorVerification?: DoctorVerification;
}
