import { SpeechToTextProvider, TextToSpeechProvider } from "./types";

export class OpenAISpeechToTextProvider implements SpeechToTextProvider {
  public name = "OpenAI Whisper STT";

  public isAvailable(): boolean {
    return !!(process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY);
  }

  public startListening(
    language: string,
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): void {
    onError("Whisper requires audio file blob input. Fallback to browser for streaming mic.");
    onEnd();
  }

  public stopListening(): void {}

  public async transcribeBlob(blob: Blob, language: string): Promise<string> {
    const formData = new FormData();
    formData.append("file", blob, "audio.webm");
    formData.append("language", language);
    formData.append("provider", "openai");

    const res = await fetch("/api/clinical/voice/transcribe", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Whisper transcription failed");
    }

    const data = await res.json();
    return data.transcript;
  }
}

export class OpenAITextToSpeechProvider implements TextToSpeechProvider {
  public name = "OpenAI TTS";

  public isAvailable(): boolean {
    return !!(process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY);
  }

  public async speak(
    text: string,
    language: string,
    onEnd?: () => void,
    onError?: (err: string) => void
  ): Promise<void> {
    try {
      const res = await fetch("/api/clinical/voice/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language, provider: "openai" }),
      });

      if (!res.ok) throw new Error("OpenAI TTS failed");

      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.onended = () => onEnd?.();
      audio.onerror = () => onError?.("Audio playback failed");
      await audio.play();
    } catch (err: any) {
      onError?.(err?.message || "TTS failed");
    }
  }

  public stop(): void {}
}
