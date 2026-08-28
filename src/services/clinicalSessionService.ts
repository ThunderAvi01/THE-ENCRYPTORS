import { connectToDatabase } from "@/lib/mongodb";
import { ClinicalSession, IClinicalSession } from "@/models/ClinicalSession";
import { CaseRecord } from "@/models/CaseRecord";
import { TriageRecord } from "@/models/TriageRecord";
import { evaluateSafetyStatus } from "@/services/safety/safetyEngine";
import { AuditService } from "@/services/auditService";
import { StructuredClinicalHistory, AyurvedaDashavidhaData } from "@/types/questionnaire";
import { AyushSystem } from "@/types/user";

export async function startOrGetActiveSession(patientId: string): Promise<IClinicalSession> {
  await connectToDatabase();

  let activeSession = await ClinicalSession.findOne({
    patientId,
    status: "IN_PROGRESS",
  }).sort({ updatedAt: -1 });

  if (!activeSession) {
    activeSession = await ClinicalSession.create({
      patientId,
      status: "IN_PROGRESS",
      selectedLanguage: "en",
      selectedAyushSystem: "ALLOPATHY",
      currentStepIndex: 0,
      answers: {},
      consentSigned: false,
    });
  }

  return activeSession;
}

export async function saveSessionProgress(
  sessionId: string,
  patientId: string,
  stepIndex: number,
  answers: Record<string, unknown>,
  selectedLanguage?: string,
  selectedAyushSystem?: AyushSystem
): Promise<IClinicalSession | null> {
  await connectToDatabase();

  const updateData: Record<string, unknown> = {
    currentStepIndex: stepIndex,
    answers,
  };

  if (selectedLanguage) updateData.selectedLanguage = selectedLanguage;
  if (selectedAyushSystem) updateData.selectedAyushSystem = selectedAyushSystem;
  if (answers["digital_consent_agreement"] === true || answers["digital_consent_agreement"] === "true") {
    updateData.consentSigned = true;
    updateData.consentSignedAt = new Date();
  }

  // PHASE 8: Deterministic Safety Engine Evaluation
  const patientInputText = String(answers["chief_complaint_symptom"] || "");
  const safetyEval = evaluateSafetyStatus({
    patientInput: patientInputText,
    answers,
  });

  updateData.isUrgent = safetyEval.isUrgent;
  updateData.safetySeverity = safetyEval.overallSeverity;
  if (safetyEval.triageAlertReason) {
    updateData.urgentAlertReason = safetyEval.triageAlertReason;
  }
  if (safetyEval.isUrgent) {
    updateData.urgentTriggeredAt = new Date();
  }

  const updatedSession = await ClinicalSession.findOneAndUpdate(
    { _id: sessionId, patientId, status: "IN_PROGRESS" },
    { $set: updateData },
    { new: true }
  );

  // If URGENT or WARNING, create or update a TriageRecord for Triage Staff queue
  if (safetyEval.isUrgent || safetyEval.isWarning) {
    try {
      const existingTriage = await TriageRecord.findOne({ sessionId });
      if (!existingTriage) {
        await TriageRecord.create({
          sessionId,
          patientId,
          patientAgeGender: "Checked-in Patient",
          severity: safetyEval.overallSeverity,
          status: "NEW",
          alertReason: safetyEval.triageAlertReason,
          triggeredRules: safetyEval.triggeredRules,
        });

        // Audit Log Emergency Trigger
        if (safetyEval.isUrgent) {
          await AuditService.log({
            actorUserId: patientId,
            actorRole: "PATIENT",
            action: "EMERGENCY_RED_FLAG_TRIGGERED",
            resourceType: "SAFETY_ALERT",
            resourceId: sessionId,
            details: {
              severity: safetyEval.overallSeverity,
              alertReason: safetyEval.triageAlertReason,
              triggeredRules: safetyEval.triggeredRules,
            },
          });
        }
      } else {
        existingTriage.severity = safetyEval.overallSeverity;
        existingTriage.alertReason = safetyEval.triageAlertReason;
        existingTriage.triggeredRules = safetyEval.triggeredRules;
        await existingTriage.save();
      }
    } catch (triageErr) {
      console.error("[ClinicalSessionService] Failed to sync TriageRecord:", triageErr);
    }
  }

  return updatedSession;
}

export function compileClinicalHistoryFromAnswers(
  answers: Record<string, unknown>,
  ayushSystem: AyushSystem
): StructuredClinicalHistory {
  const chiefComplaint = String(answers["chief_complaint_symptom"] || "General discomfort");
  const duration = String(answers["symptom_duration"] || "Not specified");
  const severityValue = answers["symptom_severity"];
  const severity = typeof severityValue === "number" || typeof severityValue === "string"
    ? String(severityValue)
    : "MODERATE";

  const aggravatingFactors = Array.isArray(answers["aggravating_factors"])
    ? (answers["aggravating_factors"] as string[])
    : [];

  const relievingFactors = Array.isArray(answers["relieving_factors"])
    ? (answers["relieving_factors"] as string[])
    : [];

  const associatedSymptoms = Array.isArray(answers["associated_symptoms"])
    ? (answers["associated_symptoms"] as string[])
    : [];

  const pastMedicalHistory = Array.isArray(answers["past_medical_conditions"])
    ? (answers["past_medical_conditions"] as string[])
    : [];

  const pastSurgicalHistory = answers["past_surgeries"]
    ? [String(answers["past_surgeries"])]
    : [];

  const familyHistory = Array.isArray(answers["family_medical_history"])
    ? (answers["family_medical_history"] as string[])
    : [];

  const medicationsStr = String(answers["current_medications_list"] || "");
  const currentMedications = medicationsStr.trim()
    ? medicationsStr.split(",").map((m) => ({ name: m.trim() }))
    : [];

  const allergiesStr = String(answers["known_allergies"] || "");
  const allergies = allergiesStr.trim()
    ? allergiesStr.split(",").map((a) => ({ substance: a.trim() }))
    : [];

  // Ayurveda specifics
  let ayurvedaSpecifics: AyurvedaDashavidhaData | undefined;
  if (ayushSystem === "AYURVEDA") {
    ayurvedaSpecifics = {
      prakriti: answers["ayurveda_prakriti"] as AyurvedaDashavidhaData["prakriti"],
      vikriti: answers["ayurveda_vikriti"] ? String(answers["ayurveda_vikriti"]) : undefined,
      sara: answers["ayurveda_tissue_sara"] ? String(answers["ayurveda_tissue_sara"]) : undefined,
      samhanana: answers["ayurveda_samhanana"] as AyurvedaDashavidhaData["samhanana"],
      sattva: answers["ayurveda_sattva"] as AyurvedaDashavidhaData["sattva"],
      aharaShakti: answers["ayurveda_agni_ahara"] as AyurvedaDashavidhaData["aharaShakti"],
      vyayamaShakti: answers["ayurveda_vyayama"] as AyurvedaDashavidhaData["vyayamaShakti"],
    };
  }

  return {
    chiefComplaint,
    duration,
    severity,
    onset: answers["symptom_onset"] ? String(answers["symptom_onset"]) : undefined,
    location: answers["symptom_location"] ? String(answers["symptom_location"]) : undefined,
    character: answers["pain_character"] ? String(answers["pain_character"]) : undefined,
    radiation: answers["pain_radiation"] ? String(answers["pain_radiation"]) : undefined,
    aggravatingFactors,
    relievingFactors,
    associatedSymptoms,
    pastMedicalHistory,
    pastSurgicalHistory,
    currentMedications,
    allergies,
    familyHistory,
    lifestyle: {
      dietaryPattern: answers["dietary_preference"] ? String(answers["dietary_preference"]) : undefined,
    },
    ayushSystemUsed: ayushSystem,
    ayurvedaSpecifics,
    generatedAt: new Date(),
  };
}

export async function submitFinalCaseSession(
  sessionId: string,
  patientId: string
): Promise<{ session: IClinicalSession; caseRecord: InstanceType<typeof CaseRecord> }> {
  await connectToDatabase();

  const session = await ClinicalSession.findOne({ _id: sessionId, patientId });
  if (!session) {
    throw new Error("Clinical session not found.");
  }

  const clinicalHistory = compileClinicalHistoryFromAnswers(
    session.answers,
    session.selectedAyushSystem
  );

  session.status = "COMPLETED";
  session.clinicalHistory = clinicalHistory;
  session.completedAt = new Date();
  await session.save();

  // Create corresponding CaseRecord in MongoDB
  const caseNumber = `CASE-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const caseRecord = await CaseRecord.create({
    patientId,
    caseNumber,
    status: "PENDING_DOCTOR_REVIEW",
    chiefComplaint: clinicalHistory.chiefComplaint,
    ayushSystem: clinicalHistory.ayushSystemUsed,
    severity: clinicalHistory.severity === "10" || clinicalHistory.severity === "9" ? "CRITICAL_EMERGENCY" : "MODERATE",
    intakeSummary: {
      onset: clinicalHistory.onset,
      duration: clinicalHistory.duration,
      location: clinicalHistory.location,
      character: clinicalHistory.character,
      aggravatingFactors: clinicalHistory.aggravatingFactors,
      relievingFactors: clinicalHistory.relievingFactors,
      associatedSymptoms: clinicalHistory.associatedSymptoms,
      pastMedicalHistory: clinicalHistory.pastMedicalHistory,
      currentMedications: clinicalHistory.currentMedications.map((m) => m.name),
      allergies: clinicalHistory.allergies.map((a) => a.substance),
      ayurvedaDashavidha: clinicalHistory.ayurvedaSpecifics,
    },
    clinicalSafetyFlags: {
      hasRedFlags: clinicalHistory.severity === "10" || clinicalHistory.severity === "9",
      redFlagsDescription: clinicalHistory.severity === "10" ? "High severity score (10/10)" : undefined,
      requiresEmergencyEscalation: clinicalHistory.severity === "10",
    },
  });

  return { session, caseRecord };
}
