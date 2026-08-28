"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  RefreshCw,
  Send,
  Edit3,
  Check,
  AlertCircle,
  Shield,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { VoiceService } from "@/services/voice/VoiceService";
import { getTranslations } from "@/lib/i18n/translations";

interface VoiceInputControllerProps {
  language: string; // "en", "hi", "bn"
  onSendTranscript: (transcript: string) => void;
  disabled?: boolean;
  placeholder?: string;
  autoSendOnFinal?: boolean;
}

export function VoiceInputController({
  language,
  onSendTranscript,
  disabled = false,
  placeholder,
  autoSendOnFinal = false,
}: VoiceInputControllerProps) {
  const t = getTranslations(language);
  const [voiceService] = useState(() => new VoiceService());
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVoiceSupported, setIsVoiceSupported] = useState(true);

  useEffect(() => {
    setIsVoiceSupported(voiceService.isVoiceAvailable());
  }, [voiceService]);

  const handleStartListening = () => {
    setErrorMessage(null);
    setTranscript("");
    setIsListening(true);

    voiceService.startListening(
      language,
      (text, isFinal) => {
        setTranscript(text);
        if (isFinal && autoSendOnFinal) {
          // If autoSendOnFinal is enabled
        }
      },
      (err) => {
        setErrorMessage(err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  const handleStopListening = () => {
    voiceService.stopListening();
    setIsListening(false);
  };

  const handleRetry = () => {
    voiceService.stopListening();
    setTranscript("");
    setErrorMessage(null);
    setIsEditing(false);
    handleStartListening();
  };

  const handleSend = () => {
    if (!transcript.trim()) return;
    onSendTranscript(transcript.trim());
    setTranscript("");
    setIsEditing(false);
  };

  return (
    <div className="space-y-3 p-4 rounded-2xl border border-teal-500/30 bg-teal-500/5 shadow-sm">
      {/* Privacy Notice Header */}
      <div className="flex items-center justify-between text-[11px] text-muted-foreground border-b border-border/40 pb-2">
        <div className="flex items-center gap-1.5 font-semibold text-teal-700 dark:text-teal-300">
          <Shield className="h-3.5 w-3.5" />
          <span>{t.voicePrivacyNotice}</span>
        </div>
        <span className="text-[10px] uppercase tracking-wider font-bold bg-teal-500/10 px-2 py-0.5 rounded-full text-teal-600">
          {voiceService.getActiveProviderName()}
        </span>
      </div>

      {/* Speech Recognition Error / Fallback Banner */}
      {(!isVoiceSupported || errorMessage) && (
        <div className="p-3 rounded-xl border border-amber-500/40 bg-amber-500/10 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 animate-bounce" />
          <span>{t.micFallbackTextMode} {errorMessage ? `(${errorMessage})` : ""}</span>
        </div>
      )}

      {/* Main Mic Button & Status Visualizer */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Large Accessible Microphone Button */}
        <button
          type="button"
          onClick={isListening ? handleStopListening : handleStartListening}
          disabled={disabled || !isVoiceSupported}
          className={`h-16 w-16 sm:h-20 sm:w-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
            isListening
              ? "bg-rose-600 text-white animate-pulse ring-8 ring-rose-500/30 scale-105"
              : "bg-teal-600 hover:bg-teal-700 text-white hover:scale-105 ring-4 ring-teal-500/20"
          } ${disabled || !isVoiceSupported ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          title={isListening ? "Tap to stop recording" : t.micTapToSpeak}
        >
          {isListening ? (
            <MicOff className="h-8 w-8 animate-bounce" />
          ) : (
            <Mic className="h-8 w-8" />
          )}
        </button>

        {/* Live Audio / Status Cues */}
        <div className="flex-1 space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="font-bold text-sm text-foreground">
              {isListening ? t.micListening : t.speakYourResponse}
            </span>
            {isListening && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {t.needVoiceHelp} • {t.touchSelectAnswer}
          </p>
        </div>
      </div>

      {/* Transcript Preview & Patient Editing Box */}
      {(transcript || isListening) && (
        <div className="mt-3 space-y-2 animate-in fade-in-50">
          <div className="flex items-center justify-between text-xs font-bold text-teal-700 dark:text-teal-300">
            <span>{t.micEditTranscript}</span>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1 text-[11px] hover:underline"
            >
              <Edit3 className="h-3 w-3" />
              <span>{isEditing ? "Done Editing" : "Edit Speech Result"}</span>
            </button>
          </div>

          {isEditing ? (
            <textarea
              rows={3}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="w-full rounded-xl border border-teal-500/40 bg-card p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500/50 shadow-inner"
              placeholder={t.micTranscriptPlaceholder}
            />
          ) : (
            <div className="p-3 rounded-xl border border-border bg-card/90 text-xs font-medium text-foreground leading-relaxed shadow-sm min-h-[50px]">
              {transcript || <span className="italic text-muted-foreground">{t.micListening}</span>}
            </div>
          )}

          {/* Action Control Buttons: Retry Recording or Confirm & Send */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="text-xs gap-1.5 border-rose-500/30 text-rose-600 hover:bg-rose-500/10"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>{t.micRetry}</span>
            </Button>

            <Button
              type="button"
              variant="clinical"
              size="sm"
              onClick={handleSend}
              disabled={!transcript.trim()}
              className="text-xs gap-1.5 font-bold shadow-md"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{t.micConfirmSend}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
