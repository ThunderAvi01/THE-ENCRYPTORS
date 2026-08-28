import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-guards";
import { submitFinalCaseSession } from "@/services/clinicalSessionService";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    const { session, caseRecord } = await submitFinalCaseSession(sessionId, user.id);

    return NextResponse.json({
      success: true,
      message: "Case intake submitted successfully for doctor review.",
      sessionId: session._id,
      caseId: caseRecord._id,
      caseNumber: caseRecord.caseNumber,
      clinicalHistory: session.clinicalHistory,
    });
  } catch (error) {
    console.error("Clinical submission error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to submit case" },
      { status: 500 }
    );
  }
}
