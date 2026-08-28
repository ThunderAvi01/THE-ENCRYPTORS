import { connectToDatabase } from "@/lib/mongodb";
import { ClinicalSummary, IClinicalSummary } from "@/models/ClinicalSummary";
import { CaseRecord } from "@/models/CaseRecord";
import { ClinicalSession } from "@/models/ClinicalSession";
import { SummaryContent } from "@/types/summary";

export async function getOrCreateClinicalSummary(
  caseId: string,
  patientId: string
): Promise<IClinicalSummary> {
  await connectToDatabase();

  let summary = await ClinicalSummary.findOne({ caseId });
  if (summary) {
    return summary;
  }

  // Find corresponding CaseRecord and ClinicalSession
  const caseRecord = await CaseRecord.findById(caseId);
  const session = await ClinicalSession.findOne({ patientId, status: "COMPLETED" }).sort({ completedAt: -1 });

  const history = session?.clinicalHistory;

  const draftContent: SummaryContent = {
    chiefComplaint: caseRecord?.chiefComplaint || history?.chiefComplaint || "General discomfort",
    historyOfPresentIllness: `Patient reports ${caseRecord?.chiefComplaint || "discomfort"}. Duration: ${history?.duration || "Not specified"}. Onset: ${history?.onset || "Gradual"}. Location: ${history?.location || "Not specified"}. Character: ${history?.character || "Not specified"}. Aggravating: ${history?.aggravatingFactors?.join(", ") || "None"}. Relieving: ${history?.relievingFactors?.join(", ") || "None"}.`,
    pastMedicalHistory: history?.pastMedicalHistory || [],
    pastSurgicalHistory: history?.pastSurgicalHistory || [],
    drugHistory: history?.currentMedications?.map((m) => m.name) || [],
    allergyHistory: history?.allergies?.map((a) => a.substance) || [],
    familyHistory: history?.familyHistory || [],
    personalHistory: history?.lifestyle || {},
    reviewOfSystems: history?.associatedSymptoms || [],
    previousInvestigations: [],
    currentMedications: history?.currentMedications?.map((m) => m.name) || [],
    ayushSpecificHistory: history?.ayurvedaSpecifics ? { ...history.ayurvedaSpecifics } : undefined,
    importantPatientNotes: "Collected via guided patient intake. Verification by attending physician required.",
    redFlags: caseRecord?.severity === "CRITICAL_EMERGENCY" ? ["High severity score reported (9-10/10)"] : [],
  };

  summary = await ClinicalSummary.create({
    caseId,
    patientId,
    sessionId: session?._id,
    status: "DRAFT",
    originalAiDraft: draftContent,
    doctorEditedSummary: draftContent,
    auditTrail: [
      {
        action: "CREATED",
        timestamp: new Date(),
        notes: "AI-generated draft summary synthesized upon case intake completion.",
      },
    ],
  });

  return summary;
}

export async function verifyDoctorSummary(
  caseId: string,
  doctorId: string,
  doctorName: string,
  doctorRegistrationNumber: string,
  action: "ACCEPT" | "EDIT" | "REJECT",
  editedSummary?: SummaryContent,
  notes?: string,
  provisionalDiagnosis?: string,
  recommendedPlan?: string
): Promise<IClinicalSummary> {
  await connectToDatabase();

  const summary = await ClinicalSummary.findOne({ caseId });
  if (!summary) {
    throw new Error("Clinical summary not found for this case.");
  }

  const timestamp = new Date();
  let newStatus: IClinicalSummary["status"] = "UNDER_REVIEW";

  if (action === "ACCEPT") {
    newStatus = "VERIFIED";
  } else if (action === "EDIT") {
    newStatus = "EDITED";
  } else if (action === "REJECT") {
    newStatus = "REJECTED";
  }

  if (editedSummary) {
    summary.doctorEditedSummary = editedSummary;
  }
  if (notes) summary.verificationNotes = notes;
  if (provisionalDiagnosis) summary.provisionalDiagnosis = provisionalDiagnosis;
  if (recommendedPlan) summary.recommendedPlan = recommendedPlan;

  summary.status = newStatus;
  summary.verifiedByDoctorId = doctorId as any;
  summary.doctorName = doctorName;
  summary.doctorRegistrationNumber = doctorRegistrationNumber;
  summary.verifiedAt = timestamp;

  summary.auditTrail.push({
    action: action === "ACCEPT" ? "VERIFIED" : action === "EDIT" ? "EDITED" : "REJECTED",
    timestamp,
    modifiedByDoctorId: doctorId,
    modifiedByName: doctorName,
    notes: notes || `Doctor action: ${action}`,
    changesSummary: `Status updated to ${newStatus}`,
  });

  await summary.save();

  // Update corresponding CaseRecord in MongoDB
  const caseRecord = await CaseRecord.findById(caseId);
  if (caseRecord) {
    caseRecord.status = action === "ACCEPT" || action === "EDIT" ? "VERIFIED_BY_DOCTOR" : "REVISION_REQUESTED";
    caseRecord.doctorVerification = {
      verifiedByDoctorId: doctorId as any,
      doctorName,
      doctorRegistrationNumber,
      verifiedAt: timestamp,
      clinicalNotes: notes || "",
      provisionalDiagnosis: provisionalDiagnosis || "",
      recommendedPlan: recommendedPlan || "",
      verificationSignatureToken: `SIG-NMC-${Math.floor(100000 + Math.random() * 900000)}`,
    };
    await caseRecord.save();
  }

  return summary;
}
