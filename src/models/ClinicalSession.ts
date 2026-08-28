import mongoose, { Schema, Document, Model } from "mongoose";
import { AyushSystem } from "@/types/user";
import { StructuredClinicalHistory } from "@/types/questionnaire";

export interface IClinicalSession extends Document {
  patientId: mongoose.Types.ObjectId;
  status: "IN_PROGRESS" | "COMPLETED" | "ABANDONED";
  selectedLanguage: string;
  selectedAyushSystem: AyushSystem;
  currentStepIndex: number;
  answers: Record<string, unknown>;
  clinicalHistory?: StructuredClinicalHistory;
  consentSigned: boolean;
  consentSignedAt?: Date;
  completedAt?: Date;
  isUrgent?: boolean;
  safetySeverity?: "NORMAL" | "WARNING" | "URGENT";
  urgentAlertReason?: string;
  urgentTriggeredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ClinicalSessionSchema = new Schema<IClinicalSession>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["IN_PROGRESS", "COMPLETED", "ABANDONED"],
      default: "IN_PROGRESS",
      index: true,
    },
    selectedLanguage: {
      type: String,
      default: "en",
    },
    selectedAyushSystem: {
      type: String,
      enum: ["ALLOPATHY", "AYURVEDA", "YOGA_NATUROPATHY", "UNANI", "SIDDHA", "HOMEOPATHY"],
      default: "ALLOPATHY",
    },
    currentStepIndex: {
      type: Number,
      default: 0,
    },
    answers: {
      type: Schema.Types.Mixed,
      default: {},
    },
    clinicalHistory: {
      type: Schema.Types.Mixed,
    },
    consentSigned: {
      type: Boolean,
      default: false,
    },
    consentSignedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    isUrgent: {
      type: Boolean,
      default: false,
      index: true,
    },
    safetySeverity: {
      type: String,
      enum: ["NORMAL", "WARNING", "URGENT"],
      default: "NORMAL",
      index: true,
    },
    urgentAlertReason: {
      type: String,
    },
    urgentTriggeredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const ClinicalSession: Model<IClinicalSession> =
  mongoose.models.ClinicalSession ||
  mongoose.model<IClinicalSession>("ClinicalSession", ClinicalSessionSchema);
