"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Button } from "@/components/ui/button";

export function GlobalLanguageDropdown() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
    { code: "hi", name: "Hindi", nativeName: "हिंदी", flag: "🇮🇳" },
    { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
  ];

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 gap-1.5 px-2.5 text-xs font-semibold rounded-lg border-border hover:border-teal-500/50 bg-card/70"
        aria-label="Change Language"
      >
        <span className="text-sm leading-none">{currentLang.flag}</span>
        <span className="font-bold">{currentLang.nativeName}</span>
        <ChevronDown className="h-3 w-3 opacity-60" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 rounded-xl border border-border bg-card p-1 shadow-xl z-50 animate-in fade-in-50 zoom-in-95 duration-100">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 mb-1">
            Select Language / भाषा
          </div>
          {languages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  isSelected
                    ? "bg-teal-600 text-white font-bold"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                  <span className={`text-[10px] ${isSelected ? "text-teal-100" : "text-muted-foreground"}`}>
                    ({lang.name})
                  </span>
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
