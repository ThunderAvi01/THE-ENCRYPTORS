import { SpeechToTextProvider, TextToSpeechProvider } from "./types";
import { getLanguageByCode } from "@/lib/i18n/languages";

// Declare global Web Speech API types for TypeScript safety
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export class BrowserSpeechToTextProvider implements SpeechToTextProvider {
  public name = "Browser Web Speech API (STT)";
  private recognition: any = null;

  public isAvailable(): boolean {
    if (typeof window === "undefined") return false;
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  public startListening(
    language: string,
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): void {
    if (!this.isAvailable()) {
      onError("Speech recognition is not supported in this browser.");
      onEnd();
      return;
    }

    try {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionClass();

      const langObj = getLanguageByCode(language);
      this.recognition.lang = langObj.speechLocale || "en-IN";
      this.recognition.continuous = true;
      this.recognition.interimResults = true;

      this.recognition.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            finalTranscript += res[0].transcript;
          } else {
            interimTranscript += res[0].transcript;
          }
        }

        const combined = (finalTranscript + " " + interimTranscript).trim();
        const isFinal = event.results[event.results.length - 1].isFinal;
        onResult(combined, isFinal);
      };

      this.recognition.onerror = (event: any) => {
        console.warn("Browser SpeechRecognition error:", event.error);
        if (event.error !== "no-speech") {
          onError(`Speech recognition error: ${event.error}`);
        }
      };

      this.recognition.onend = () => {
        onEnd();
      };

      this.recognition.start();
    } catch (err: any) {
      console.error("Failed to start speech recognition:", err);
      onError(err?.message || "Failed to initialize microphone.");
      onEnd();
    }
  }

  public stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore if already stopped
      }
      this.recognition = null;
    }
  }
}

export class BrowserTextToSpeechProvider implements TextToSpeechProvider {
  public name = "Browser SpeechSynthesis (TTS)";

  public isAvailable(): boolean {
    if (typeof window === "undefined") return false;
    return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  }

  public speak(
    text: string,
    language: string,
    onEnd?: () => void,
    onError?: (err: string) => void
  ): void {
    if (!this.isAvailable()) {
      onError?.("Text-to-speech is not supported in this browser.");
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any existing speech

      const utterance = new SpeechSynthesisUtterance(text);
      const langObj = getLanguageByCode(language);
      utterance.lang = langObj.speechLocale || "en-IN";
      utterance.rate = 0.95; // Slightly slower for clear clinical dialogue
      utterance.pitch = 1.0;

      // Try finding a matching voice for Indian languages if available
      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find(
        (v) => v.lang.startsWith(langObj.code) || v.lang.includes(langObj.speechLocale)
      );
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.onend = () => {
        onEnd?.();
      };

      utterance.onerror = (e) => {
        console.warn("SpeechSynthesis error:", e);
        onError?.("Failed to play audio guidance.");
      };

      window.speechSynthesis.speak(utterance);
    } catch (err: any) {
      console.error("Speech synthesis failed:", err);
      onError?.(err?.message || "TTS failure.");
    }
  }

  public stop(): void {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }
}
