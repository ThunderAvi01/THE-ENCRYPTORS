import { Consent, IConsentScope } from "@/models/Consent";
import { connectToDatabase } from "@/lib/mongodb";
import { APP_CONFIG } from "@/utils/constants";
import { AuditService } from "./auditService";

export class ConsentService {
  public static async recordConsent(
    patientId: string,
    signatureText: string,
    customScope?: Partial<IConsentScope>,
    ipAddress?: string,
    userAgent?: string
  ) {
    await connectToDatabase();

    const scope: IConsentScope = {
      clinicalCaseTaking: customScope?.clinicalCaseTaking ?? true,
      documentDigitizationOcr: customScope?.documentDigitizationOcr ?? true,
      doctorVerificationSharing: customScope?.doctorVerificationSharing ?? true,
      abdmInteroperabilitySharing: customScope?.abdmInteroperabilitySharing ?? true,
      anonymizedResearchTelemetry: customScope?.anonymizedResearchTelemetry ?? false,
    };

    const consent = await Consent.create({
      patientId,
      consentVersion: APP_CONFIG.consentVersion || "2026.1",
      status: "GRANTED",
      grantedAt: new Date(),
      ipAddress,
      userAgent,
      patientSignatureText: signatureText || "Digital Signature",
      termsHash: `sha256_${Date.now()}`,
      scope,
    });

    await AuditService.log({
      actorUserId: patientId,
      actorRole: "PATIENT",
      action: "CONSENT_GRANTED",
      resourceType: "CONSENT",
      resourceId: String(consent._id),
      details: { scope, consentVersion: consent.consentVersion },
    });

    return JSON.parse(JSON.stringify(consent));
  }

  public static async updateConsentScope(
    patientId: string,
    customScope: IConsentScope
  ) {
    await connectToDatabase();

    const activeConsent = await Consent.findOne({ patientId, status: "GRANTED" }).sort({ grantedAt: -1 });

    if (activeConsent) {
      activeConsent.scope = customScope;
      await activeConsent.save();

      await AuditService.log({
        actorUserId: patientId,
        actorRole: "PATIENT",
        action: "CONSENT_SCOPE_UPDATED",
        resourceType: "CONSENT",
        resourceId: String(activeConsent._id),
        details: { scope: customScope },
      });

      return JSON.parse(JSON.stringify(activeConsent));
    }

    return this.recordConsent(patientId, "Digital Update", customScope);
  }

  public static async revokeConsent(patientId: string) {
    await connectToDatabase();
    const consent = await Consent.findOneAndUpdate(
      { patientId, status: "GRANTED" },
      { $set: { status: "REVOKED", revokedAt: new Date() } },
      { new: true }
    );

    if (consent) {
      await AuditService.log({
        actorUserId: patientId,
        actorRole: "PATIENT",
        action: "CONSENT_REVOKED",
        resourceType: "CONSENT",
        resourceId: String(consent._id),
      });
    }

    return consent ? JSON.parse(JSON.stringify(consent)) : null;
  }

  public static async getActiveConsent(patientId: string) {
    await connectToDatabase();
    const consent = await Consent.findOne({
      patientId,
      status: "GRANTED",
    }).sort({ grantedAt: -1 });

    return consent ? JSON.parse(JSON.stringify(consent)) : null;
  }
}
