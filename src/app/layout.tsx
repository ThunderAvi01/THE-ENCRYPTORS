import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthSessionProvider } from "@/components/providers/SessionProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ArogyaIntake | SIH 2026 Structured Clinical Case-Taking & Digitization",
  description:
    "Intelligent, structured clinical case-taking and medical document digitization platform for Indian healthcare (SIH26047). Featuring digital consent, AI-assisted history collection, OCR prescription extraction, FHIR R4 export, and verified physician approval.",
  keywords: [
    "SIH 2026",
    "SIH26047",
    "Clinical Case-Taking",
    "Medical Document Digitization",
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
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
