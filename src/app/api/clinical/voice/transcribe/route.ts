import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-guards";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const language = (formData.get("language") as string) || "en";
    const provider = (formData.get("provider") as string) || "openai";

    if (!file) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    // Check if OpenAI API key is set
    const openAiApiKey = process.env.OPENAI_API_KEY;
    if (provider === "openai" && openAiApiKey) {
      const openAiFormData = new FormData();
      openAiFormData.append("file", file, "audio.webm");
      openAiFormData.append("model", "whisper-1");
      openAiFormData.append("language", language);

      const openAiRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openAiApiKey}`,
        },
        body: openAiFormData,
      });

      if (openAiRes.ok) {
        const data = await openAiRes.json();
        return NextResponse.json({ success: true, transcript: data.text });
      }
    }

    // Fallback response if cloud credentials are not active
    return NextResponse.json({
      success: false,
      error: "Cloud voice transcription credentials not configured. Please use browser speech mode.",
    }, { status: 501 });
  } catch (err: any) {
    console.error("Voice Transcribe API Error:", err);
    return NextResponse.json({ error: "Failed to transcribe audio." }, { status: 500 });
  }
}
