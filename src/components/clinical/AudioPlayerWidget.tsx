"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VoiceService } from "@/services/voice/VoiceService";
import { getTranslations } from "@/lib/i18n/translations";

interface AudioPlayerWidgetProps {
  textToSpeak: string;
  language: string;
  autoPlay?: boolean;
  size?: "sm" | "default" | "lg";
}

export function AudioPlayerWidget({
  textToSpeak,
  language,
  autoPlay = false,
  size = "sm",
}: AudioPlayerWidgetProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceService] = useState(() => new VoiceService());
  const t = getTranslations(language);

  useEffect(() => {
    if (autoPlay && textToSpeak) {
      handlePlay();
    }
    return () => {
      voiceService.stopSpeaking();
    };
  }, [textToSpeak, language]);

  const handlePlay = () => {
    if (isPlaying) {
      voiceService.stopSpeaking();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    voiceService.speak(
      textToSpeak,
      language,
      () => setIsPlaying(false),
      (err) => {
        console.warn("TTS Error:", err);
        setIsPlaying(false);
      }
    );
  };

  return (
    <Button
      type="button"
      variant={isPlaying ? "destructive" : "outline"}
      size={size}
      onClick={handlePlay}
      className={`gap-1.5 border-teal-500/30 text-teal-700 dark:text-teal-300 font-bold transition-all ${
        isPlaying ? "animate-pulse bg-rose-500/10 text-rose-600 border-rose-500/40" : ""
      }`}
      title={isPlaying ? t.stopAudio : t.listenQuestion}
    >
      {isPlaying ? (
        <>
          <VolumeX className="h-4 w-4 shrink-0" />
          <span className="text-xs">{t.stopAudio}</span>
        </>
      ) : (
        <>
          <Volume2 className="h-4 w-4 shrink-0 text-teal-600" />
          <span className="text-xs">{t.listenQuestion}</span>
        </>
      )}
    </Button>
  );
}
