"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, ChevronLeft, Volume2, Save, AlertTriangle, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { AudioPlayerWidget } from "@/components/clinical/AudioPlayerWidget";
import { ClinicalSafetyBanner } from "@/components/safety/ClinicalSafetyBanner";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function PatientConsentPage() {
  const { dict, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [scope, setScope] = useState({
    clinicalCaseTaking: true,
    doctorVerificationSharing: true,
    abdmInteroperabilitySharing: true,
    anonymizedResearchTelemetry: false,
  });

  const [consentStatus, setConsentStatus] = useState("GRANTED");
  const [grantedAt, setGrantedAt] = useState<string | null>(null);

  useEffect(() => {
    async function loadConsent() {
      try {
        const res = await fetch("/api/user/consent");
        if (res.ok) {
          const data = await res.json();
          if (data.consent) {
            if (data.consent.scope) setScope(data.consent.scope);
            setConsentStatus(data.consent.status || "GRANTED");
            setGrantedAt(data.consent.grantedAt ? new Date(data.consent.grantedAt).toLocaleString() : null);
          }
        }
      } catch (err) {
        console.error("Failed to load consent:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadConsent();
  }, []);

  const handleToggle = (key: keyof typeof scope) => {
    setScope((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    setSuccessMsg(null);
    try {
      const res = await fetch("/api/user/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope }),
      });

      if (res.ok) {
        setSuccessMsg("Consent preferences updated successfully.");
        setConsentStatus("GRANTED");
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err) {
      console.error("Failed to save consent:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRevokeConsent = async () => {
    if (!confirm("Are you sure you wish to revoke clinical data processing consent?")) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/user/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "REVOKE" }),
      });

      if (res.ok) {
        setConsentStatus("REVOKED");
        setSuccessMsg("Consent has been revoked.");
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err) {
      console.error("Failed to revoke consent:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <RefreshCw className="h-8 w-8 animate-spin text-teal-600 mx-auto" />
          <p className="text-xs font-semibold text-muted-foreground">Loading Consent Authorization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/patient/dashboard">
            <Button variant="ghost" size="sm" className="gap-1 text-xs font-bold">
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Portal</span>
            </Button>
          </Link>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <span className="font-bold text-sm text-foreground">
            Arogya<span className="text-teal-600">Consent</span> • Digital Consent & Privacy Manager
          </span>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 max-w-3xl w-full mx-auto space-y-6">
        <ClinicalSafetyBanner compact />

        {successMsg && (
          <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs font-bold text-emerald-700 dark:text-emerald-300 text-center animate-in fade-in-50">
            {successMsg}
          </div>
        )}

        <Card className="border-teal-500/30 shadow-sm">
          <CardHeader className="pb-3 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-teal-600" />
                <CardTitle className="text-base font-bold">Granular Digital Consent Authorization</CardTitle>
              </div>
              <Badge variant={consentStatus === "GRANTED" ? "verified" : "destructive"}>
                {consentStatus}
              </Badge>
            </div>
            <CardDescription className="text-xs text-muted-foreground pt-1">
              Under DPDP Act & ABDM guidelines, you retain 100% control over how your clinical data is processed and shared.
              {grantedAt && ` Last authorized on ${grantedAt}.`}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-4">
            {/* Granular Scope Items */}
            {[
              {
                key: "clinicalCaseTaking",
                title: dict.consent.clinicalIntakeScope,
                description: dict.consent.clinicalIntakeDesc,
                audioText: dict.consent.clinicalIntakeDesc,
              },
              {
                key: "doctorVerificationSharing",
                title: dict.consent.doctorSharingScope,
                description: dict.consent.doctorSharingDesc,
                audioText: dict.consent.doctorSharingDesc,
              },
              {
                key: "abdmInteroperabilitySharing",
                title: dict.consent.abdmSharingScope,
                description: dict.consent.abdmSharingDesc,
                audioText: dict.consent.abdmSharingDesc,
              },
              {
                key: "anonymizedResearchTelemetry",
                title: dict.consent.researchTelemetryScope,
                description: dict.consent.researchTelemetryDesc,
                audioText: dict.consent.researchTelemetryDesc,
              },
            ].map((item) => {
              const scopeKey = item.key as keyof typeof scope;
              const isChecked = scope[scopeKey];
              return (
                <div
                  key={item.key}
                  className={`p-4 rounded-2xl border transition space-y-2 ${
                    isChecked
                      ? "border-teal-500/40 bg-teal-500/5"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs sm:text-sm text-foreground">{item.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggle(scopeKey)}
                      className={`h-6 w-11 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                        isChecked ? "bg-teal-600" : "bg-muted"
                      }`}
                    >
                      <div
                        className={`h-5 w-5 rounded-full bg-white transition-transform duration-200 shadow-sm ${
                          isChecked ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Audio Guidance button for low literacy users */}
                  <div className="pt-1">
                    <AudioPlayerWidget textToSpeak={item.audioText} language={language} size="sm" />
                  </div>
                </div>
              );
            })}
          </CardContent>

          <CardFooter className="pt-4 border-t border-border/50 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRevokeConsent}
              disabled={isSaving || consentStatus === "REVOKED"}
              className="text-xs font-bold border-rose-500/30 text-rose-600 hover:bg-rose-500/10"
            >
              <span>{dict.consent.revokeConsent}</span>
            </Button>

            <Button
              variant="clinical"
              size="sm"
              onClick={handleSavePreferences}
              disabled={isSaving}
              className="text-xs font-bold gap-1.5 shadow-md"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? dict.common.saving : dict.consent.savePreferences}</span>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
