import mongoose, { Schema, Document, Model } from "mongoose";
import { CaseStatus } from "@/types/clinical";

export interface ICaseRecord extends Document {
  patientId: mongoose.Types.ObjectId;
  consentId?: mongoose.Types.ObjectId;
  caseNumber: string;
  chiefComplaint: string;
  ayushSystem: string;
  severity: string;
  status: CaseStatus;
  intakeSummary?: Record<string, unknown>;
  chiefComplaints: Array<{
    symptom: string;
    durationNumber: number;
    durationUnit: "HOURS" | "DAYS" | "WEEKS" | "MONTHS" | "YEARS";
    severity: string;
    description: string;
    bodySite?: string;
  }>;
  vitals?: {
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
  };
  pastMedicalHistory: string[];
  pastSurgicalHistory: string[];
  allergies: Array<{
    substance: string;
    reaction: string;
    severity: string;
  }>;
  currentMedications: Array<{
    medicineName: string;
    dosage: string;
    frequency: string;
    prescribedFor?: string;
  }>;
  familyHistory: string[];
  socialHabits: {
    tobaccoUse: boolean;
    alcoholUse: boolean;
    dietaryPattern: string;
  };
  attachedDocuments: mongoose.Types.ObjectId[];
  aiClinicalSummary?: {
    generatedAt: Date;
    aiModelUsed: string;
    chiefComplaintsSummary: string;
    chronologicalHpi: string;
    relevantMedicalHistory: string;
    systemReviewFindings: string[];
    suggestedClinicalQuestionsForDoctor: string[];
    redFlagAlerts: string[];
    safetyDisclaimer: string;
  };
  doctorVerification?: {
    verifiedByDoctorId: mongoose.Types.ObjectId;
    doctorName: string;
    doctorRegistrationNumber: string;
    verifiedAt: Date;
    clinicalNotes: string;
    provisionalDiagnosis?: string;
    recommendedPlan?: string;
    verificationSignatureToken: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CaseRecordSchema = new Schema<ICaseRecord>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    consentId: { type: Schema.Types.ObjectId, ref: "Consent" },
    caseNumber: { type: String, default: () => `CASE-2026-${Math.floor(1000 + Math.random() * 9000)}` },
    chiefComplaint: { type: String, default: "General discomfort" },
    ayushSystem: { type: String, default: "ALLOPATHY" },
    severity: { type: String, default: "MODERATE" },
    intakeSummary: { type: Schema.Types.Mixed },
    status: {
      type: String,
      enum: ["DRAFT", "AI_INTAKE_COMPLETED", "PENDING_DOCTOR_REVIEW", "VERIFIED_BY_DOCTOR", "REVISION_REQUESTED"],
      default: "DRAFT",
      required: true,
      index: true,
    },
    chiefComplaints: [
      {
        symptom: { type: String, required: true },
        durationNumber: { type: Number, required: true },
        durationUnit: { type: String, enum: ["HOURS", "DAYS", "WEEKS", "MONTHS", "YEARS"], default: "DAYS" },
        severity: { type: String, default: "MODERATE" },
        description: { type: String, default: "" },
        bodySite: { type: String },
      },
    ],
    vitals: {
      recordedAt: { type: Date, default: Date.now },
      systolicBp: { type: Number },
      diastolicBp: { type: Number },
      heartRate: { type: Number },
      respiratoryRate: { type: Number },
      spo2: { type: Number },
      temperature: { type: Number },
      heightCm: { type: Number },
      weightKg: { type: Number },
      bmi: { type: Number },
    },
    pastMedicalHistory: [{ type: String }],
    pastSurgicalHistory: [{ type: String }],
    allergies: [
      {
        substance: { type: String, required: true },
        reaction: { type: String },
        severity: { type: String, default: "MILD" },
      },
    ],
    currentMedications: [
      {
        medicineName: { type: String, required: true },
        dosage: { type: String },
        frequency: { type: String },
        prescribedFor: { type: String },
      },
    ],
    familyHistory: [{ type: String }],
    socialHabits: {
      tobaccoUse: { type: Boolean, default: false },
      alcoholUse: { type: Boolean, default: false },
      dietaryPattern: { type: String, default: "VEGETARIAN" },
    },
    attachedDocuments: [{ type: Schema.Types.ObjectId, ref: "MedicalDocument" }],
    aiClinicalSummary: {
      generatedAt: { type: Date },
      aiModelUsed: { type: String },
      chiefComplaintsSummary: { type: String },
      chronologicalHpi: { type: String },
      relevantMedicalHistory: { type: String },
      systemReviewFindings: [{ type: String }],
      suggestedClinicalQuestionsForDoctor: [{ type: String }],
      redFlagAlerts: [{ type: String }],
      safetyDisclaimer: { type: String },
    },
    doctorVerification: {
      verifiedByDoctorId: { type: Schema.Types.ObjectId, ref: "User" },
      doctorName: { type: String },
      doctorRegistrationNumber: { type: String },
      verifiedAt: { type: Date },
      clinicalNotes: { type: String },
      provisionalDiagnosis: { type: String },
      recommendedPlan: { type: String },
      verificationSignatureToken: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

export const CaseRecord: Model<ICaseRecord> =
  mongoose.models.CaseRecord || mongoose.model<ICaseRecord>("CaseRecord", CaseRecordSchema);
