import { FHIRBundleResource, FHIRPatientResource, FHIRObservationResource } from "@/types/fhir";
import { CaseRecordData } from "@/types/clinical";
import { PatientProfile } from "@/types/user";

/**
 * Converts internal clinical case records to standard FHIR R4 Bundles
 * for interoperability with ABDM / EHR systems.
 */
export function convertCaseRecordToFHIR(
  patient: PatientProfile,
  caseRecord: CaseRecordData
): FHIRBundleResource {
  const patientResource: FHIRPatientResource = {
    resourceType: "Patient",
    id: patient.id,
    identifier: patient.abhaId
      ? [
          {
            system: "https://healthid.abdm.gov.in",
            value: patient.abhaId,
          },
        ]
      : undefined,
    active: true,
    name: [
      {
        text: patient.name,
      },
    ],
    gender: patient.gender === "MALE" ? "male" : patient.gender === "FEMALE" ? "female" : "other",
    birthDate: patient.dateOfBirth,
  };

  const observations: FHIRObservationResource[] = [];

  if (caseRecord.vitals?.heartRate) {
    observations.push({
      resourceType: "Observation",
      id: `obs-hr-${caseRecord.id}`,
      status: "final",
      code: {
        coding: [
          {
            system: "http://loinc.org",
            code: "8867-4",
            display: "Heart rate",
          },
        ],
        text: "Heart rate",
      },
      subject: {
        reference: `Patient/${patient.id}`,
      },
      effectiveDateTime: new Date().toISOString(),
      valueQuantity: {
        value: caseRecord.vitals.heartRate,
        unit: "beats/minute",
        system: "http://unitsofmeasure.org",
        code: "/min",
      },
    });
  }

  return {
    resourceType: "Bundle",
    id: `bundle-case-${caseRecord.id}`,
    type: "document",
    timestamp: new Date().toISOString(),
    entry: [
      {
        fullUrl: `urn:uuid:${patient.id}`,
        resource: patientResource as unknown as Record<string, unknown>,
      },
      ...observations.map((obs) => ({
        fullUrl: `urn:uuid:${obs.id}`,
        resource: obs as unknown as Record<string, unknown>,
      })),
    ],
  };
}
