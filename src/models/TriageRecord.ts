import mongoose, { Schema, Document, Model } from "mongoose";

export type TriageStatus = "NEW" | "ACKNOWLEDGED" | "IN_PROGRESS" | "RESOLVED";
export type TriageSeverity = "NORMAL" | "WARNING" | "URGENT";

export interface ITriageRecord extends Document {
  sessionId?: string;
  caseId?: string;
  patientId?: mongoose.Types.ObjectId;
  patientAgeGender?: string; // Minimal necessary information e.g. "48 yrs / Male"
  severity: TriageSeverity;
  status: TriageStatus;
  alertReason: string;
  triggeredRules: Array<{
    ruleId: string;
    name: string;
    severity: string;
    reasonText: string;
  }>;
  vitalsSummary?: string;
  acknowledgedBy?: mongoose.Types.ObjectId;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  staffNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TriageRecordSchema = new Schema<ITriageRecord>(
  {
    sessionId: { type: String, index: true },
    caseId: { type: String, index: true },
    patientId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    patientAgeGender: { type: String, default: "Age/Gender Unspecified" },
    severity: {
      type: String,
      enum: ["NORMAL", "WARNING", "URGENT"],
      default: "NORMAL",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["NEW", "ACKNOWLEDGED", "IN_PROGRESS", "RESOLVED"],
      default: "NEW",
      required: true,
      index: true,
    },
    alertReason: { type: String, required: true },
    triggeredRules: [
      {
        ruleId: { type: String },
        name: { type: String },
        severity: { type: String },
        reasonText: { type: String },
      },
    ],
    vitalsSummary: { type: String },
    acknowledgedBy: { type: Schema.Types.ObjectId, ref: "User" },
    acknowledgedAt: { type: Date },
    resolvedAt: { type: Date },
    staffNotes: { type: String },
  },
  {
    timestamps: true,
  }
);

export const TriageRecord: Model<ITriageRecord> =
  mongoose.models.TriageRecord || mongoose.model<ITriageRecord>("TriageRecord", TriageRecordSchema);
