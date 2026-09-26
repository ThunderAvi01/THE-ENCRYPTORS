import { FHIRBundleResource, FHIRPatientResource, FHIRObservationResource } from "@/types/fhir";

export interface ClinicalCaseForFHIR {
  id: string;
  patientName: string;
  patientAbhaId?: string;
  gender?: string;
  dateOfBirth?: string;
  chiefComplaint: string;
  severity?: string;
  vitals?: {
    systolicBp?: number;
    diastolicBp?: number;
    heartRate?: number;
    spo2?: number;
    temperature?: number;
  };
  pastMedicalHistory?: string[];
  medications?: string[];
  allergies?: string[];
  documents?: Array<{
    id: string;
    fileName: string;
    extractedText?: string;
  }>;
  createdAt?: string;
}

export class FHIRMapper {
  public static mapCaseToFHIRBundle(caseData: ClinicalCaseForFHIR): FHIRBundleResource {
    const timestamp = caseData.createdAt || new Date().toISOString();

    // 1. Patient Resource
    const patientResource: FHIRPatientResource = {
      resourceType: "Patient",
      id: `pat-${caseData.id}`,
      identifier: caseData.patientAbhaId
        ? [
            {
              system: "https://healthid.abdm.gov.in",
              value: caseData.patientAbhaId,
            },
          ]
        : [
            {
              system: "https://sih2026.gov.in/patient-id",
              value: `PAT-${caseData.id.slice(-6)}`,
            },
          ],
      active: true,
      name: [
        {
          text: caseData.patientName || "Anonymous Patient",
        },
      ],
      gender: caseData.gender === "MALE" ? "male" : caseData.gender === "FEMALE" ? "female" : "other",
      birthDate: caseData.dateOfBirth || "1988-01-01",
    };

    // 2. Encounter Resource
    const encounterResource = {
      resourceType: "Encounter",
      id: `enc-${caseData.id}`,
      status: "finished",
      class: {
        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        code: "AMB",
        display: "ambulatory",
      },
      subject: {
        reference: `Patient/pat-${caseData.id}`,
      },
      period: {
        start: timestamp,
        end: timestamp,
      },
    };

    // 3. Condition Resource (Chief Complaint)
    const conditionResource = {
      resourceType: "Condition",
      id: `cond-${caseData.id}`,
      clinicalStatus: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
            code: "active",
          },
        ],
      },
      code: {
        text: caseData.chiefComplaint,
      },
      subject: {
        reference: `Patient/pat-${caseData.id}`,
      },
      onsetDateTime: timestamp,
    };

    // 4. Observation Resources (Vitals)
    const observations: any[] = [];
    if (caseData.vitals?.heartRate) {
      observations.push({
        resourceType: "Observation",
        id: `obs-hr-${caseData.id}`,
        status: "final",
        code: {
          coding: [{ system: "http://loinc.org", code: "8867-4", display: "Heart rate" }],
          text: "Heart rate",
        },
        subject: { reference: `Patient/pat-${caseData.id}` },
        effectiveDateTime: timestamp,
        valueQuantity: {
          value: caseData.vitals.heartRate,
          unit: "beats/min",
          system: "http://unitsofmeasure.org",
          code: "/min",
        },
      });
    }

    if (caseData.vitals?.spo2) {
      observations.push({
        resourceType: "Observation",
        id: `obs-spo2-${caseData.id}`,
        status: "final",
        code: {
          coding: [{ system: "http://loinc.org", code: "2708-6", display: "Oxygen saturation" }],
          text: "Oxygen saturation",
        },
        subject: { reference: `Patient/pat-${caseData.id}` },
        effectiveDateTime: timestamp,
        valueQuantity: {
          value: caseData.vitals.spo2,
          unit: "%",
          system: "http://unitsofmeasure.org",
          code: "%",
        },
      });
    }

    // 5. MedicationStatement Resources
    const medications = (caseData.medications || []).map((med, idx) => ({
      resourceType: "MedicationStatement",
      id: `med-${caseData.id}-${idx}`,
      status: "active",
      medicationCodeableConcept: {
        text: med,
      },
      subject: { reference: `Patient/pat-${caseData.id}` },
      dateAsserted: timestamp,
    }));

    // 6. DiagnosticReport / DocumentReference (Standard FHIR Clinical Document Reference)
    const documentReferences = (caseData.documents || []).map((doc) => ({
      resourceType: "DocumentReference",
      id: `doc-${doc.id}`,
      status: "current",
      type: {
        text: "Clinical Document Reference",
      },
      subject: { reference: `Patient/pat-${caseData.id}` },
      description: doc.fileName,
      content: [
        {
          attachment: {
            contentType: "text/plain",
            title: doc.fileName,
          },
        },
      ],
    }));

    const entries = [
      { fullUrl: `urn:uuid:Patient/pat-${caseData.id}`, resource: patientResource as any },
      { fullUrl: `urn:uuid:Encounter/enc-${caseData.id}`, resource: encounterResource as any },
      { fullUrl: `urn:uuid:Condition/cond-${caseData.id}`, resource: conditionResource as any },
      ...observations.map((obs) => ({ fullUrl: `urn:uuid:Observation/${obs.id}`, resource: obs })),
      ...medications.map((m) => ({ fullUrl: `urn:uuid:MedicationStatement/${m.id}`, resource: m })),
      ...documentReferences.map((d) => ({ fullUrl: `urn:uuid:DocumentReference/${d.id}`, resource: d })),
    ];

    return {
      resourceType: "Bundle",
      id: `bundle-case-${caseData.id}`,
      type: "document",
      timestamp,
      entry: entries,
    };
  }
}
