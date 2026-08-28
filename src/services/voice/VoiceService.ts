import {
  SpeechToTextProvider,
  TextToSpeechProvider,
  VoiceProviderType,
} from "./types";
import {
  BrowserSpeechToTextProvider,
  BrowserTextToSpeechProvider,
} from "./browserSpeechProvider";
import {
  BhashiniSpeechToTextProvider,
  BhashiniTextToSpeechProvider,
} from "./bhashiniProvider";
import {
  OpenAISpeechToTextProvider,
  OpenAITextToSpeechProvider,
} from "./openAIProvider";

export class VoiceService {
  private sttProvider: SpeechToTextProvider;
  private ttsProvider: TextToSpeechProvider;
  private activeProviderType: VoiceProviderType = "browser";

  constructor(preferredProvider?: VoiceProviderType) {
    const providerType =
      preferredProvider ||
      (process.env.NEXT_PUBLIC_VOICE_PROVIDER as VoiceProviderType) ||
      "browser";

    this.activeProviderType = providerType;

    if (providerType === "bhashini") {
      this.sttProvider = new BhashiniSpeechToTextProvider();
      this.ttsProvider = new BhashiniTextToSpeechProvider();
    } else if (providerType === "openai") {
      this.sttProvider = new OpenAISpeechToTextProvider();
      this.ttsProvider = new OpenAITextToSpeechProvider();
    } else {
      this.sttProvider = new BrowserSpeechToTextProvider();
      this.ttsProvider = new BrowserTextToSpeechProvider();
    }

    // Fallback to browser if configured provider is not available
    if (!this.sttProvider.isAvailable()) {
      this.sttProvider = new BrowserSpeechToTextProvider();
      this.activeProviderType = "browser";
    }
    if (!this.ttsProvider.isAvailable()) {
      this.ttsProvider = new BrowserTextToSpeechProvider();
    }
  }

  public isVoiceAvailable(): boolean {
    return this.sttProvider.isAvailable();
  }

  public getActiveProviderName(): string {
    return this.sttProvider.name;
  }

  public startListening(
    language: string,
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): void {
    if (!this.sttProvider.isAvailable()) {
      onError("Speech recognition API is unavailable in this environment.");
      onEnd();
      return;
    }

    this.sttProvider.startListening(language, onResult, onError, onEnd);
  }

  public stopListening(): void {
    this.sttProvider.stopListening();
  }

  public speak(
    text: string,
    language: string,
    onEnd?: () => void,
    onError?: (err: string) => void
  ): void {
    if (!text || !text.trim()) return;
    this.ttsProvider.speak(text, language, onEnd, onError);
  }

  public stopSpeaking(): void {
    this.ttsProvider.stop();
  }
}
