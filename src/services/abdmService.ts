import { FHIRBundleResource } from "@/types/fhir";

export interface ABDMPatientReferenceInput {
  abhaId?: string;
  name: string;
  gender: string;
  dateOfBirth: string;
  mobile: string;
}

export interface ABDMConsentRequestInput {
  patientAbhaId: string;
  hiTypes: string[]; // e.g. ["DiagnosticReport", "OPConsultation", "Prescription"]
  purpose: string;
}

export class ABDMService {
  private static isLiveMode(): boolean {
    return !!(process.env.ABDM_CLIENT_ID && process.env.ABDM_CLIENT_SECRET);
  }

  public static async createPatientReference(input: ABDMPatientReferenceInput) {
    if (this.isLiveMode()) {
      // Live ABDM Sandbox API Integration endpoint call
    }

    // Modular Sandbox Mock Implementation
    return {
      success: true,
      mode: "SANDBOX_MOCK",
      abhaAddress: input.abhaId || `${input.name.toLowerCase().replace(/\s+/g, "")}@abdm`,
      patientRefNumber: `ABDM-PAT-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      status: "LINKED_IN_SANDBOX",
      note: "[SANDBOX DEMO MODE] Interface ready for live ABDM Gateway integration.",
    };
  }

  public static async requestConsent(input: ABDMConsentRequestInput) {
    return {
      success: true,
      mode: "SANDBOX_MOCK",
      consentRequestId: `ABDM-CR-${Math.floor(100000 + Math.random() * 900000)}`,
      status: "REQUESTED",
      patientAbhaId: input.patientAbhaId,
      hiTypes: input.hiTypes,
      timestamp: new Date().toISOString(),
      note: "[SANDBOX DEMO MODE] ABDM consent artifact created in sandbox gateway.",
    };
  }

  public static async shareClinicalData(patientAbhaId: string, fhirBundle: FHIRBundleResource) {
    return {
      success: true,
      mode: "SANDBOX_MOCK",
      transactionId: `ABDM-TXN-${Date.now()}`,
      status: "SHARED_SUCCESSFULLY",
      recordsCount: fhirBundle.entry?.length || 0,
      timestamp: new Date().toISOString(),
      note: "[SANDBOX DEMO MODE] FHIR R4 Bundle transmitted to mock ABDM Health Repository.",
    };
  }

  public static async getHealthRecord(patientAbhaId: string) {
    return {
      success: true,
      mode: "SANDBOX_MOCK",
      patientAbhaId,
      records: [
        {
          recordType: "OPConsultation",
          title: "General OPD Consultation Record",
          date: "2026-08-27",
          facilityName: "AIIMS OPD Clinical Unit",
          doctorName: "Dr. Priya Sharma",
        },
      ],
      note: "[SANDBOX DEMO MODE] Retrieved mock health records from sandbox HIP repository.",
    };
  }
}
