"use client";

import React from "react";
import { QuestionSchema } from "@/types/questionnaire";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Mic } from "lucide-react";
import { VoiceInputController } from "./VoiceInputController";
import { AudioPlayerWidget } from "./AudioPlayerWidget";
import { getTranslations } from "@/lib/i18n/translations";

interface QuestionInputsProps {
  question: QuestionSchema;
  value: unknown;
  onChange: (newValue: unknown) => void;
  language?: string;
}

export function QuestionInputs({ question, value, onChange, language = "en" }: QuestionInputsProps) {
  const t = getTranslations(language);

  switch (question.answerType) {
    case "text":
      return (
        <div className="space-y-4">
          {/* Text Area */}
          <textarea
            rows={3}
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder || t.orTypeText}
            className="w-full rounded-xl border border-input bg-card p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-500/50 shadow-sm"
          />

          {/* Integrated Voice Controller for text fields */}
          <div className="pt-1">
            <VoiceInputController
              language={language}
              onSendTranscript={(transcript) => {
                const existing = (value as string) || "";
                onChange(existing ? `${existing} ${transcript}` : transcript);
              }}
            />
          </div>
        </div>
      );

    case "yes_no":
      const boolVal = value === true || value === "true";
      return (
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => onChange(true)}
            className={`p-5 rounded-2xl border text-sm sm:text-base font-bold transition flex flex-col sm:flex-row items-center justify-center gap-2 shadow-sm ${
              boolVal
                ? "bg-teal-600 text-white border-teal-600 shadow-md ring-4 ring-teal-500/20"
                : "bg-card text-foreground border-border hover:border-teal-500/50"
            }`}
          >
            <Check className={`h-6 w-6 ${boolVal ? "opacity-100" : "opacity-70"}`} />
            <span>Yes (हाँ / হ্যাঁ)</span>
          </button>

          <button
            type="button"
            onClick={() => onChange(false)}
            className={`p-5 rounded-2xl border text-sm sm:text-base font-bold transition flex flex-col sm:flex-row items-center justify-center gap-2 shadow-sm ${
              value === false || value === "false"
                ? "bg-rose-600 text-white border-rose-600 shadow-md ring-4 ring-rose-500/20"
                : "bg-card text-foreground border-border hover:border-rose-500/50"
            }`}
          >
            <span>No (नहीं / না)</span>
          </button>
        </div>
      );

    case "single_choice":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.options?.map((opt) => {
            const isSelected = value === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange(opt.value)}
                className={`p-4 sm:p-5 rounded-2xl border text-xs sm:text-sm font-bold text-left transition flex items-center justify-between ${
                  isSelected
                    ? "bg-teal-600 text-white border-teal-600 shadow-md ring-2 ring-teal-500/30"
                    : "bg-card text-foreground border-border hover:border-teal-500/50"
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="h-5 w-5 shrink-0" />}
              </button>
            );
          })}
        </div>
      );

    case "multiple_choice":
      const currentList = Array.isArray(value) ? (value as string[]) : [];
      const toggleOption = (optVal: string) => {
        if (currentList.includes(optVal)) {
          onChange(currentList.filter((v) => v !== optVal));
        } else {
          onChange([...currentList, optVal]);
        }
      };

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.options?.map((opt) => {
            const isChecked = currentList.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleOption(opt.value)}
                className={`p-4 rounded-2xl border text-xs sm:text-sm font-bold text-left transition flex items-center justify-between ${
                  isChecked
                    ? "bg-teal-600 text-white border-teal-600 shadow-md ring-2 ring-teal-500/30"
                    : "bg-card text-foreground border-border hover:border-teal-500/50"
                }`}
              >
                <span>{opt.label}</span>
                <div
                  className={`h-5 w-5 rounded-lg border flex items-center justify-center ${
                    isChecked ? "bg-white text-teal-600 border-white" : "border-muted-foreground"
                  }`}
                >
                  {isChecked && <Check className="h-3.5 w-3.5" />}
                </div>
              </button>
            );
          })}
        </div>
      );

    case "severity_scale":
      const severityNum = typeof value === "number" ? value : Number(value) || 5;
      return (
        <div className="space-y-4 p-5 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-bold">1 = Mild Discomfort</span>
            <span className="text-xl font-black text-teal-600 dark:text-teal-400">
              Severity: {severityNum} / 10
            </span>
            <span className="text-xs text-rose-600 font-bold">10 = Extreme Emergency Pain</span>
          </div>

          <input
            type="range"
            min={1}
            max={10}
            value={severityNum}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-3 bg-muted rounded-lg appearance-none cursor-pointer accent-teal-600"
          />

          <div className="grid grid-cols-5 gap-2 text-center">
            {[1, 3, 5, 7, 10].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => onChange(num)}
                className={`py-2 rounded-xl text-xs font-bold border transition ${
                  severityNum === num
                    ? "bg-teal-600 text-white border-teal-600 shadow-md"
                    : "bg-muted/40 text-muted-foreground border-border"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      );

    case "body_location":
      const locations = [
        "Head & Face",
        "Neck & Throat",
        "Chest & Upper Back",
        "Epigastrium / Upper Abdomen",
        "Lower Abdomen",
        "Lower Back / Lumbar",
        "Upper Extremities (Arms/Shoulders)",
        "Lower Extremities (Legs/Knees/Feet)",
        "Generalized Whole Body",
      ];

      return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {locations.map((loc) => {
            const isSel = value === loc;
            return (
              <button
                key={loc}
                type="button"
                onClick={() => onChange(loc)}
                className={`p-4 rounded-2xl border text-xs font-bold text-center transition ${
                  isSel
                    ? "bg-teal-600 text-white border-teal-600 shadow-md ring-2 ring-teal-500/30"
                    : "bg-card text-foreground border-border hover:border-teal-500/50"
                }`}
              >
                {loc}
              </button>
            );
          })}
        </div>
      );

    case "number":
      return (
        <Input
          type="number"
          value={(value as number) || ""}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder={question.placeholder || "Enter number..."}
          className="text-xs p-3 h-11"
        />
      );

    case "date":
      return (
        <Input
          type="date"
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          className="text-xs p-3 h-11"
        />
      );

    default:
      return null;
  }
}
