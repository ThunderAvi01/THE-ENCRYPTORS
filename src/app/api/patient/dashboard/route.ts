import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-guards";
import { connectToDatabase } from "@/lib/mongodb";
import { CaseRecord } from "@/models/CaseRecord";
import { ClinicalSession } from "@/models/ClinicalSession";
import { PatientProfile } from "@/models/PatientProfile";
import { ClinicalSummary } from "@/models/ClinicalSummary";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // 1. Fetch user's profile
    const profile = await PatientProfile.findOne({ userId: user.id }).lean();

    // 2. Fetch latest active in-progress session (draft intake)
    const activeSession = await ClinicalSession.findOne({
      patientId: user.id,
      status: "IN_PROGRESS",
    })
      .sort({ updatedAt: -1 })
      .lean();

    // 3. Fetch all case records for this patient
    const cases = await CaseRecord.find({ patientId: user.id })
      .sort({ createdAt: -1 })
      .lean();

    // 4. Fetch clinical summaries for verified cases
    const caseIds = cases.map((c: any) => c._id);
    const summaries = await ClinicalSummary.find({ caseId: { $in: caseIds } }).lean();
    const summaryMap: Record<string, any> = {};
    summaries.forEach((s: any) => {
      summaryMap[s.caseId.toString()] = s;
    });

    const enrichedCases = cases.map((c: any) => {
      const summary = summaryMap[c._id.toString()];
      return {
        _id: c._id.toString(),
        caseNumber: c.caseNumber,
        chiefComplaint: c.chiefComplaint,
        ayushSystem: c.ayushSystem,
        severity: c.severity,
        status: c.status,
        createdAt: c.createdAt,
        verifiedAt: summary?.verifiedAt,
        doctorName: summary?.doctorName || (c.status === "VERIFIED" ? "Dr. Licensed Practitioner" : undefined),
        provisionalDiagnosis: summary?.provisionalDiagnosis,
      };
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        abhaId: profile?.abhaId || "91-8821-4920-11",
      },
      activeSession: activeSession
        ? {
            id: activeSession._id.toString(),
            currentStepIndex: activeSession.currentStepIndex || 0,
            answers: activeSession.answers || {},
            chiefComplaint:
              String(activeSession.answers?.["chief_complaint_symptom"] || "In-Progress Case Intake"),
            selectedAyushSystem: activeSession.selectedAyushSystem,
            updatedAt: activeSession.updatedAt,
          }
        : null,
      cases: enrichedCases,
    });
  } catch (error) {
    console.error("Patient dashboard GET error:", error);
    return NextResponse.json({ error: "Failed to fetch patient data" }, { status: 500 });
  }
}
