import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-guards";
import { generateNextClinicalQuestion } from "@/services/aiDialogueService";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { patientInput, answersMap, selectedAyushSystem, selectedLanguage } = body;

    const response = await generateNextClinicalQuestion(
      patientInput || "",
      answersMap || {},
      selectedAyushSystem || "ALLOPATHY",
      selectedLanguage || "en"
    );

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("AI Dialogue API error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI response. Falling back to deterministic wizard." },
      { status: 500 }
    );
  }
}
