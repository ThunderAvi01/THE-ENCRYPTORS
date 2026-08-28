import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAuditLog extends Document {
  actorUserId?: mongoose.Types.ObjectId;
  actorRole?: string;
  action: string;
  resourceType: "CASE_RECORD" | "CONSENT" | "DOCUMENT" | "USER" | "VERIFICATION" | "TRIAGE" | "SAFETY_ALERT";
  resourceId: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    actorUserId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    actorRole: { type: String },
    action: { type: String, required: true },
    resourceType: {
      type: String,
      enum: ["CASE_RECORD", "CONSENT", "DOCUMENT", "USER", "VERIFICATION", "TRIAGE", "SAFETY_ALERT"],
      required: true,
      index: true,
    },
    resourceId: { type: String, required: true, index: true },
    ipAddress: { type: String },
    userAgent: { type: String },
    details: { type: Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  {
    timestamps: false,
  }
);

export const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog || mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
