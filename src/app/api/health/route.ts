import { NextResponse } from "next/server";
import { APP_CONFIG } from "@/utils/constants";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    system: APP_CONFIG.name,
    title: APP_CONFIG.title,
    problemStatement: APP_CONFIG.problemStatement,
    version: APP_CONFIG.version,
    timestamp: new Date().toISOString(),
    clinicalSafety: {
      strictNonAutonomousMode: true,
      autonomousDiagnosisProhibited: true,
      autonomousPrescriptionProhibited: true,
      doctorVerificationRequired: true,
    },
  });
}
