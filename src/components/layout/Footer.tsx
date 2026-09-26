"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Stethoscope, ShieldCheck, Heart, FileCode2, PhoneCall } from "lucide-react";
import { APP_CONFIG } from "@/utils/constants";

export function Footer({ forceShow = false }: { forceShow?: boolean }) {
  const pathname = usePathname();

  // Hide global Footer on dashboard and application routes unless explicitly forced
  if (
    !forceShow &&
    (pathname.startsWith("/doctor") ||
    pathname.startsWith("/patient") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/triage") ||
    pathname.startsWith("/case-taking"))
  ) {
    return null;
  }

  return (
    <footer className="border-t border-border/80 bg-card text-card-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white">
                <Stethoscope className="h-4 w-4" />
              </div>
              <span className="font-bold text-foreground">ArogyaIntake</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              SIH 2026 Problem Statement SIH26047. Structured Multilingual Clinical Case-Taking & Verified Healthcare Interoperability.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="h-4 w-4" />
              <span>Doctor Verification Enforced</span>
            </div>
          </div>

          {/* Col 2: Clinical Workflow */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Clinical Pipeline
            </h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>1. Digital Informed Consent</li>
              <li>2. Multilingual & Multimodal Intake</li>
              <li>3. Deterministic Safety Triage</li>
              <li>4. AI Clinical History Synthesis</li>
              <li>5. Doctor Verification & Sign-off</li>
              <li>6. Appointments & FHIR R4 Interoperability</li>
              <li className="pt-1.5 border-t border-border/50">
                <Link href="/documentation" className="text-teal-600 hover:text-teal-500 font-semibold flex items-center gap-1">
                  View Full Documentation &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Standards & Architecture */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Standards & Compliance
            </h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li className="flex items-center gap-1.5">
                <FileCode2 className="h-3.5 w-3.5 text-teal-600" />
                HL7 FHIR R4 Compliant
              </li>
              <li>ABDM (Ayushman Bharat) Ready</li>
              <li>Agnostic LLM Adapter Layer</li>
              <li>Zero Autonomous Diagnosis</li>
              <li>Role-Based Access Control (RBAC)</li>
            </ul>
          </div>

          {/* Col 4: Helplines */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Emergency Contact
            </h4>
            <div className="rounded-lg border border-border bg-background p-3 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">National Emergency:</span>
                <span className="font-bold text-rose-600">{APP_CONFIG.emergencyHelplines.nationalEmergency}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Ambulance (India):</span>
                <span className="font-bold text-rose-600">{APP_CONFIG.emergencyHelplines.ambulanceIndia}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground pt-1 border-t border-border">
                <PhoneCall className="h-3 w-3" />
                <span>Health Helpline: {APP_CONFIG.emergencyHelplines.nationalHealthHelpline}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground">
          <p>© 2026 ArogyaIntake (SIH26047). Built for Smart India Hackathon 2026.</p>
          <div className="flex items-center gap-1 mt-2 sm:mt-0">
            <span>Built with care for clinicians and patients</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
}
