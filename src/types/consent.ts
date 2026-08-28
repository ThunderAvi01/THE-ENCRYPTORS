export type ConsentStatus = "GRANTED" | "REVOKED" | "EXPIRED" | "PENDING";

export interface InformedConsentRecord {
  id: string;
  patientId: string;
  consentVersion: string; // e.g. "v1.2-sih2026"
  status: ConsentStatus;
  grantedAt: Date;
  expiresAt?: Date;
  revokedAt?: Date;
  ipAddress?: string;
  userAgent?: string;
  scope: {
    clinicalCaseTaking: boolean;
    aiAssistedHistoryCollection: boolean;
    documentDigitizationOcr: boolean;
    doctorVerificationSharing: boolean;
    anonymizedResearchTelemetry: boolean;
  };
  patientSignatureText: string;
  termsHash: string;
}
