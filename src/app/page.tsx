"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Sparkles,
  ShieldCheck,
  Share2,
  ArrowRight,
  UserCheck,
  Lock,
  HeartPulse,
  BrainCircuit,
  LogIn,
  UserPlus,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClinicalSafetyBanner } from "@/components/safety/ClinicalSafetyBanner";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function LandingPage() {
  const router = useRouter();
  const { dict, language } = useLanguage();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.user;
  const role = session?.user?.role;

  const getDashboardLink = () => {
    if (role === "DOCTOR") return "/doctor/dashboard";
    if (role === "ADMIN") return "/admin/dashboard";
    if (role === "TRIAGE_STAFF") return "/triage/dashboard";
    return "/patient/dashboard";
  };

  // If already logged in, immediately redirect to their dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.replace(getDashboardLink());
    }
  }, [isAuthenticated, role, router]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-teal-500/10 via-background to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-400/15 via-transparent to-transparent pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-xs font-semibold text-teal-800 dark:text-teal-300">
              <Sparkles className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              <span>SIH 2026 Problem Statement SIH26047</span>
              <span className="text-teal-400">•</span>
              <span>Healthcare Innovation</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              {language === "hi" ? (
                <>
                  संरचित बहुभाषी क्लिनिकल इनटेक एवं{" "}
                  <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    स्वास्थ्य इंटरऑपरेबिलिटी
                  </span>
                </>
              ) : language === "bn" ? (
                <>
                  কাঠামোগত ক্লিনিকাল কেস-টেকিং ও{" "}
                  <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    স্বাস্থ্য ইন্টারঅপারেবিলিটি
                  </span>
                </>
              ) : (
                <>
                  Intelligent Clinical Case-Taking &{" "}
                  <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    Healthcare Interoperability
                  </span>
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {dict.documentation.heroDesc}
            </p>

            {/* CTA Group: Two options for unauthenticated visitors: Log In or Sign Up */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              {isAuthenticated ? (
                <>
                  <Link href={getDashboardLink()} className="w-full sm:w-auto">
                    <Button variant="clinical" size="lg" className="w-full sm:w-auto gap-2 shadow-lg font-bold">
                      <LayoutDashboard className="h-5 w-5" />
                      <span>{dict.navigation.dashboard}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/case-taking" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
                      <HeartPulse className="h-5 w-5 text-teal-600" />
                      <span>{dict.patientDashboard.startIntakeBtn}</span>
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="w-full sm:w-auto">
                    <Button variant="clinical" size="lg" className="w-full sm:w-auto gap-2.5 shadow-lg font-bold text-base px-8 py-6">
                      <LogIn className="h-5 w-5" />
                      <span>{dict.navigation.login}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/register" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2.5 text-base px-8 py-6 border-teal-500/50 hover:bg-teal-500/10 hover:border-teal-500">
                      <UserPlus className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                      <span>{dict.navigation.register}</span>
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Clinical Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-medium text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Doctor Verification Enforced</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Share2 className="h-4 w-4 text-teal-600" />
                <span>HL7 FHIR R4 Standard</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BrainCircuit className="h-4 w-4 text-cyan-600" />
                <span>Agnostic LLM Architecture</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-amber-500" />
                <span>DPDP & ABDM Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MANDATORY SAFETY GUARDRAIL BANNER */}
      <section id="safety" className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <ClinicalSafetyBanner />
      </section>
    </div>
  );
}
