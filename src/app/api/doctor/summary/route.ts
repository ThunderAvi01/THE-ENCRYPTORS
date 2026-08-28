import { NextResponse } from "next/server";
import { requireDoctor } from "@/lib/auth-guards";
import { getOrCreateClinicalSummary, verifyDoctorSummary } from "@/services/doctorVerificationService";
import { ClinicalSession } from "@/models/ClinicalSession";
import { CaseRecord } from "@/models/CaseRecord";

export async function GET(req: Request) {
  try {
    const user = await requireDoctor();
    const { searchParams } = new URL(req.url);
    const caseId = searchParams.get("caseId");

    if (!caseId) {
      return NextResponse.json({ error: "caseId parameter is required" }, { status: 400 });
    }

    const caseRecord = await CaseRecord.findById(caseId);
    if (!caseRecord) {
      return NextResponse.json({ error: "Case record not found" }, { status: 404 });
    }

    const summary = await getOrCreateClinicalSummary(caseId, caseRecord.patientId.toString());

    // Fetch original raw patient session answers
    const rawSession = await ClinicalSession.findOne({
      patientId: caseRecord.patientId,
      status: "COMPLETED",
    }).sort({ completedAt: -1 });

    return NextResponse.json({
      summary,
      caseRecord,
      rawAnswers: rawSession?.answers || {},
    });
  } catch (error) {
    console.error("Doctor summary GET error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unauthorized or server error" },
      { status: 401 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireDoctor();
    const body = await req.json();
    const {
      caseId,
      action,
      editedSummary,
      notes,
      provisionalDiagnosis,
      recommendedPlan,
      doctorRegistrationNumber,
    } = body;

    if (!caseId || !action) {
      return NextResponse.json({ error: "caseId and action are required" }, { status: 400 });
    }

    const updatedSummary = await verifyDoctorSummary(
      caseId,
      user.id,
      user.name,
      doctorRegistrationNumber || "NMC-2024-99881",
      action,
      editedSummary,
      notes,
      provisionalDiagnosis,
      recommendedPlan
    );

    return NextResponse.json({
      success: true,
      message: `Case verified successfully with action: ${action}`,
      summary: updatedSummary,
    });
  } catch (error) {
    console.error("Doctor verification POST error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Verification failed" },
      { status: 500 }
    );
  }
}
