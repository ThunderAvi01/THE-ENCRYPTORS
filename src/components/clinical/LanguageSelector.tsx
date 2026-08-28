"use client";

import React from "react";
import { Globe, Check } from "lucide-react";
import { SUPPORTED_LANGUAGES, getLanguageByCode } from "@/lib/i18n/languages";

interface LanguageSelectorProps {
  selectedLanguage: string;
  onSelectLanguage: (code: string) => void;
  compact?: boolean;
}

export function LanguageSelector({
  selectedLanguage,
  onSelectLanguage,
  compact = false,
}: LanguageSelectorProps) {
  const currentLang = getLanguageByCode(selectedLanguage);

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 bg-card border border-border rounded-xl px-2.5 py-1 text-xs">
        <Globe className="h-3.5 w-3.5 text-teal-600 shrink-0" />
        <select
          value={selectedLanguage}
          onChange={(e) => onSelectLanguage(e.target.value)}
          className="bg-transparent font-semibold text-foreground focus:outline-none cursor-pointer text-xs"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code} className="bg-card text-foreground">
              {lang.nativeName} ({lang.name})
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
        <Globe className="h-3.5 w-3.5 text-teal-600" />
        <span>Select Intake Language / भाषा का चयन करें</span>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {SUPPORTED_LANGUAGES.slice(0, 3).map((lang) => {
          const isSelected = selectedLanguage === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => onSelectLanguage(lang.code)}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                isSelected
                  ? "bg-teal-600 text-white border-teal-600 shadow-md ring-2 ring-teal-500/30"
                  : "bg-card text-foreground border-border hover:border-teal-500/50"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold">{lang.name}</span>
                {isSelected && <Check className="h-4 w-4" />}
              </div>
              <span className={`text-sm font-black mt-1 ${isSelected ? "text-white" : "text-teal-600"}`}>
                {lang.nativeName}
              </span>
            </button>
          );
        })}
      </div>

      {/* Additional language dropdown for future expansion */}
      <div className="pt-1 flex items-center justify-end">
        <select
          value={selectedLanguage}
          onChange={(e) => onSelectLanguage(e.target.value)}
          className="text-[11px] bg-muted/40 border border-border rounded-lg px-2 py-1 text-muted-foreground focus:outline-none"
        >
          <option value="" disabled>More Indian Languages...</option>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.nativeName} - {lang.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
