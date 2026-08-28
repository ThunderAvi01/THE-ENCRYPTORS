import { CaseRecord } from "@/models/CaseRecord";
import { connectToDatabase } from "@/lib/mongodb";
import { CaseRecordData } from "@/types/clinical";

export class CaseTakingService {
  public static async createDraftCase(patientId: string, consentId: string): Promise<CaseRecordData> {
    await connectToDatabase();
    const newCase = await CaseRecord.create({
      patientId,
      consentId,
      status: "DRAFT",
      chiefComplaints: [],
      pastMedicalHistory: [],
      pastSurgicalHistory: [],
      allergies: [],
      currentMedications: [],
      familyHistory: [],
      socialHabits: {
        tobaccoUse: false,
        alcoholUse: false,
        dietaryPattern: "VEGETARIAN",
      },
    });

    return JSON.parse(JSON.stringify(newCase));
  }

  public static async getCaseById(caseId: string): Promise<CaseRecordData | null> {
    await connectToDatabase();
    const record = await CaseRecord.findById(caseId).populate("attachedDocuments");
    if (!record) return null;
    return JSON.parse(JSON.stringify(record));
  }

  public static async getCasesByPatient(patientId: string): Promise<CaseRecordData[]> {
    await connectToDatabase();
    const records = await CaseRecord.find({ patientId }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(records));
  }
}
