import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthSessionProvider } from "@/components/providers/SessionProvider";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { FirstVisitLanguageModal } from "@/components/i18n/FirstVisitLanguageModal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ArogyaIntake | SIH 2026 Structured Clinical Case-Taking & Healthcare Interoperability",
  description:
    "Intelligent, structured multilingual clinical case-taking and verified decision support platform for Indian healthcare (SIH26047). Featuring digital consent, AI-assisted history collection, deterministic emergency triage, FHIR R4 export, and verified physician approval.",
  keywords: [
    "SIH 2026",
    "SIH26047",
    "Clinical Case-Taking",
    "AI Medical History",
    "Safety Triage",
    "FHIR R4",
    "ABDM",
    "Doctor Verification",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-background text-foreground selection:bg-teal-500/20 selection:text-teal-900 dark:selection:text-teal-200">
        <AuthSessionProvider>
          <LanguageProvider>
            <FirstVisitLanguageModal />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </LanguageProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
