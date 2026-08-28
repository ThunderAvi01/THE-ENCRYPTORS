import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-guards";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text, language, provider } = await req.json();
    const openAiApiKey = process.env.OPENAI_API_KEY;

    if (provider === "openai" && openAiApiKey && text) {
      const openAiRes = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openAiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "tts-1",
          input: text,
          voice: "alloy",
        }),
      });

      if (openAiRes.ok) {
        const audioBuffer = await openAiRes.arrayBuffer();
        return new NextResponse(audioBuffer, {
          headers: {
            "Content-Type": "audio/mpeg",
          },
        });
      }
    }

    return NextResponse.json({
      error: "Cloud TTS credentials not configured. Please use browser audio synthesis.",
    }, { status: 501 });
  } catch (err: any) {
    console.error("Voice TTS API Error:", err);
    return NextResponse.json({ error: "Failed to generate speech audio." }, { status: 500 });
  }
}
