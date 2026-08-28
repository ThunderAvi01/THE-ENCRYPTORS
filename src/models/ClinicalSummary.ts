import mongoose, { Schema, Document, Model } from "mongoose";
import { VerificationStatus, SummaryContent, SummaryAuditRecord } from "@/types/summary";

export interface IClinicalSummary extends Document {
  caseId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  sessionId?: mongoose.Types.ObjectId;
  status: VerificationStatus;
  originalAiDraft: SummaryContent;
  doctorEditedSummary?: SummaryContent;
  verificationNotes?: string;
  provisionalDiagnosis?: string;
  recommendedPlan?: string;
  verifiedByDoctorId?: mongoose.Types.ObjectId;
  doctorName?: string;
  doctorRegistrationNumber?: string;
  verifiedAt?: Date;
  auditTrail: SummaryAuditRecord[];
  createdAt: Date;
  updatedAt: Date;
}

const ClinicalSummarySchema = new Schema<IClinicalSummary>(
  {
    caseId: {
      type: Schema.Types.ObjectId,
      ref: "CaseRecord",
      required: true,
      index: true,
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "ClinicalSession",
    },
    status: {
      type: String,
      enum: ["DRAFT", "UNDER_REVIEW", "EDITED", "VERIFIED", "REJECTED"],
      default: "DRAFT",
      index: true,
    },
    originalAiDraft: {
      type: Schema.Types.Mixed,
      required: true,
    },
    doctorEditedSummary: {
      type: Schema.Types.Mixed,
    },
    verificationNotes: {
      type: String,
      default: "",
    },
    provisionalDiagnosis: {
      type: String,
      default: "",
    },
    recommendedPlan: {
      type: String,
      default: "",
    },
    verifiedByDoctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    doctorName: {
      type: String,
    },
    doctorRegistrationNumber: {
      type: String,
    },
    verifiedAt: {
      type: Date,
    },
    auditTrail: [
      {
        action: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        modifiedByDoctorId: { type: String },
        modifiedByName: { type: String },
        notes: { type: String },
        changesSummary: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const ClinicalSummary: Model<IClinicalSummary> =
  mongoose.models.ClinicalSummary ||
  mongoose.model<IClinicalSummary>("ClinicalSummary", ClinicalSummarySchema);
