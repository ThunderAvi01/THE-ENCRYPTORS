"use client";

import React from "react";
import { Globe, Check, Sparkles, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Button } from "@/components/ui/button";

export function FirstVisitLanguageModal() {
  const { isFirstVisit, completeFirstVisit, language, setLanguage } = useLanguage();

  if (!isFirstVisit) return null;

  const languages = [
    {
      code: "en",
      name: "English",
      nativeName: "English",
      flag: "🇬🇧",
      subtext: "International & Indian Standard",
    },
    {
      code: "hi",
      name: "Hindi",
      nativeName: "हिंदी",
      flag: "🇮🇳",
      subtext: "राष्ट्रीय भाषा • स्वास्थ्य इनटेक",
    },
    {
      code: "bn",
      name: "Bengali",
      nativeName: "বাংলা",
      flag: "🇮🇳",
      subtext: "স্থানীয় ভাষা • সহজ স্বাস্থ্যসেবা",
    },
  ];

  const handleSelectLanguage = (code: string) => {
    setLanguage(code);
  };

  const handleConfirm = () => {
    completeFirstVisit();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/85 backdrop-blur-md animate-in fade-in-50 duration-200">
      <div className="max-w-md w-full rounded-3xl border border-teal-500/40 bg-card p-6 sm:p-8 shadow-2xl text-foreground space-y-6">
        {/* Header with Triple Greeting */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-lg shadow-teal-500/20">
            <Globe className="h-6 w-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
            Arogya<span className="text-teal-600 dark:text-teal-400">Intake</span>
          </h2>
          <div className="space-y-0.5">
            <p className="text-sm font-bold text-teal-700 dark:text-teal-300">
              Welcome / स्वागत / স্বাগতম
            </p>
            <p className="text-xs text-muted-foreground">
              Choose Your Language • अपनी भाषा चुनें • আপনার ভাষা নির্বাচন করুন
            </p>
          </div>
        </div>

        {/* Language Options Grid */}
        <div className="space-y-3">
          {languages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelectLanguage(lang.code)}
                className={`w-full p-4 rounded-2xl border text-left transition flex items-center justify-between ${
                  isSelected
                    ? "bg-teal-600 text-white border-teal-600 shadow-md ring-4 ring-teal-500/20 scale-[1.01]"
                    : "bg-background text-foreground border-border hover:border-teal-500/50 hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-2xl">{lang.flag}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold tracking-tight">
                        {lang.nativeName}
                      </span>
                      <span
                        className={`text-xs font-semibold ${
                          isSelected ? "text-teal-100" : "text-muted-foreground"
                        }`}
                      >
                        ({lang.name})
                      </span>
                    </div>
                    <span
                      className={`text-[11px] block mt-0.5 ${
                        isSelected ? "text-teal-100/90" : "text-muted-foreground"
                      }`}
                    >
                      {lang.subtext}
                    </span>
                  </div>
                </div>

                <div
                  className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${
                    isSelected
                      ? "bg-white text-teal-600"
                      : "border border-border text-transparent"
                  }`}
                >
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Confirmation Button */}
        <div className="pt-2">
          <Button
            variant="clinical"
            size="lg"
            onClick={handleConfirm}
            className="w-full justify-center gap-2 font-bold text-sm shadow-md"
          >
            <span>
              {language === "hi"
                ? "हिंदी में जारी रखें"
                : language === "bn"
                ? "বাংলায় এগিয়ে যান"
                : "Continue in English"}
            </span>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <p className="text-[11px] text-center text-muted-foreground mt-2">
            You can change your language anytime from the navigation bar.
          </p>
        </div>
      </div>
    </div>
  );
}
