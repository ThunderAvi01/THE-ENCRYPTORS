import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-guards";
import { startOrGetActiveSession, saveSessionProgress } from "@/services/clinicalSessionService";
import { ClinicalSession } from "@/models/ClinicalSession";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (sessionId) {
      const session = await ClinicalSession.findOne({ _id: sessionId, patientId: user.id });
      if (!session) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 });
      }
      return NextResponse.json({ session });
    }

    const activeSession = await startOrGetActiveSession(user.id);
    return NextResponse.json({ session: activeSession });
  } catch (error) {
    console.error("Clinical session GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { sessionId, stepIndex, answers, selectedLanguage, selectedAyushSystem } = body;

    if (!sessionId) {
      const newSession = await startOrGetActiveSession(user.id);
      return NextResponse.json({ session: newSession });
    }

    const updatedSession = await saveSessionProgress(
      sessionId,
      user.id,
      stepIndex ?? 0,
      answers || {},
      selectedLanguage,
      selectedAyushSystem
    );

    if (!updatedSession) {
      return NextResponse.json({ error: "Failed to save session progress" }, { status: 400 });
    }

    return NextResponse.json({ session: updatedSession, message: "Progress saved successfully" });
  } catch (error) {
    console.error("Clinical session POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
