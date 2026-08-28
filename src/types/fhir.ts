/**
 * Fast Healthcare Interoperability Resources (FHIR R4) Type Definitions
 * Designed for standard compliance with ABDM (Ayushman Bharat Digital Mission)
 */

export interface FHIRIdentifier {
  system: string;
  value: string;
}

export interface FHIRCoding {
  system: string;
  code: string;
  display: string;
}

export interface FHIRCodeableConcept {
  coding: FHIRCoding[];
  text: string;
}

export interface FHIRPatientResource {
  resourceType: "Patient";
  id: string;
  identifier?: FHIRIdentifier[];
  active: boolean;
  name: Array<{
    use?: string;
    text: string;
    family?: string;
    given?: string[];
  }>;
  gender?: "male" | "female" | "other" | "unknown";
  birthDate?: string;
}

export interface FHIRObservationResource {
  resourceType: "Observation";
  id: string;
  status: "preliminary" | "final" | "amended";
  code: FHIRCodeableConcept;
  subject: {
    reference: string;
  };
  effectiveDateTime: string;
  valueQuantity?: {
    value: number;
    unit: string;
    system: string;
    code: string;
  };
}

export interface FHIRBundleResource {
  resourceType: "Bundle";
  id: string;
  type: "document" | "collection" | "transaction";
  timestamp: string;
  entry: Array<{
    fullUrl: string;
    resource: Record<string, unknown>;
  }>;
}
