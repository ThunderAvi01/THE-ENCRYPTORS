export type VoiceProviderType = "browser" | "bhashini" | "openai" | "fallback";

export interface TranscribeOptions {
  language: string; // "en", "hi", "bn", etc.
  audioBlob?: Blob;
}

export interface SpeechToTextProvider {
  name: string;
  isAvailable(): boolean;
  startListening(
    language: string,
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): void;
  stopListening(): void;
  transcribeBlob?(blob: Blob, language: string): Promise<string>;
}

export interface TextToSpeechProvider {
  name: string;
  isAvailable(): boolean;
  speak(text: string, language: string, onEnd?: () => void, onError?: (err: string) => void): void | Promise<void>;
  stop(): void;
}

export interface VoiceServiceState {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  providerType: VoiceProviderType;
  isAvailable: boolean;
}
