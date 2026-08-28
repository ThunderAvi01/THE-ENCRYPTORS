import { SpeechToTextProvider, TextToSpeechProvider } from "./types";

/**
 * Bhashini / AI4Bharat Voice Service Provider
 * Uses India National Language Translation Mission (NLTM) Bhashini pipeline endpoints
 * for Indian languages (Hindi, Bengali, Marathi, Tamil, Telugu, etc.)
 */
export class BhashiniSpeechToTextProvider implements SpeechToTextProvider {
  public name = "Bhashini / AI4Bharat STT";

  public isAvailable(): boolean {
    return !!(
      process.env.BHASHINI_API_KEY ||
      process.env.NEXT_PUBLIC_BHASHINI_API_KEY
    );
  }

  public startListening(
    language: string,
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): void {
    // For live web stream recording, Bhashini uses WebSocket or REST chunk transcription.
    // If not actively connected to Bhashini endpoint, return clear error for fallback.
    if (!this.isAvailable()) {
      onError("Bhashini API credentials not configured. Falling back to browser speech API.");
      onEnd();
      return;
    }
  }

  public stopListening(): void {
    // Stop recording stream
  }

  public async transcribeBlob(blob: Blob, language: string): Promise<string> {
    const apiKey = process.env.BHASHINI_API_KEY || process.env.NEXT_PUBLIC_BHASHINI_API_KEY;
    const userId = process.env.BHASHINI_USER_ID || process.env.NEXT_PUBLIC_BHASHINI_USER_ID;

    if (!apiKey || !userId) {
      throw new Error("Bhashini API credentials missing");
    }

    const formData = new FormData();
    formData.append("file", blob, "recording.wav");
    formData.append("language", language);

    const res = await fetch("/api/clinical/voice/transcribe", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Bhashini transcription API call failed");
    }

    const data = await res.json();
    return data.transcript || "";
  }
}

export class BhashiniTextToSpeechProvider implements TextToSpeechProvider {
  public name = "Bhashini / AI4Bharat TTS";

  public isAvailable(): boolean {
    return !!(
      process.env.BHASHINI_API_KEY ||
      process.env.NEXT_PUBLIC_BHASHINI_API_KEY
    );
  }

  public speak(
    text: string,
    language: string,
    onEnd?: () => void,
    onError?: (err: string) => void
  ): void {
    if (!this.isAvailable()) {
      onError?.("Bhashini TTS credentials missing.");
      return;
    }
  }

  public stop(): void {}
}
