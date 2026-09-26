import mongoose, { Schema, Document, Model } from "mongoose";

export type ConsentStatus = "GRANTED" | "REVOKED" | "EXPIRED" | "PENDING";

export interface IConsentScope {
  clinicalCaseTaking: boolean;
  doctorVerificationSharing: boolean;
  abdmInteroperabilitySharing: boolean;
  anonymizedResearchTelemetry: boolean;
}

export interface IConsent extends Document {
  patientId: mongoose.Types.ObjectId;
  consentVersion: string;
  status: ConsentStatus;
  grantedAt: Date;
  expiresAt?: Date;
  revokedAt?: Date;
  ipAddress?: string;
  userAgent?: string;
  scope: IConsentScope;
  patientSignatureText: string;
  termsHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConsentSchema = new Schema<IConsent>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    consentVersion: { type: String, required: true },
    status: {
      type: String,
      enum: ["GRANTED", "REVOKED", "EXPIRED", "PENDING"],
      default: "GRANTED",
      required: true,
    },
    grantedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    revokedAt: { type: Date },
    ipAddress: { type: String },
    userAgent: { type: String },
    scope: {
      clinicalCaseTaking: { type: Boolean, default: true },
      doctorVerificationSharing: { type: Boolean, default: true },
      abdmInteroperabilitySharing: { type: Boolean, default: true },
      anonymizedResearchTelemetry: { type: Boolean, default: false },
    },
    patientSignatureText: { type: String, required: true },
    termsHash: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Consent: Model<IConsent> =
  mongoose.models.Consent || mongoose.model<IConsent>("Consent", ConsentSchema);
