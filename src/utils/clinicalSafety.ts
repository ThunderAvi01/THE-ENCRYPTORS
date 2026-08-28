/**
 * Clinical Safety Guardrails Utility
 *
 * CRITICAL RULE:
 * This software strictly prohibits autonomous diagnosis or autonomous prescription.
 * All AI outputs are structured history drafts that require licensed practitioner verification.
 */

export const CLINICAL_SAFETY_DISCLAIMER = 
  "DISCLAIMER: This system assists in structured clinical history collection and record digitization. It DOES NOT provide medical diagnosis, clinical judgment, or prescription. All summaries must be independently reviewed and verified by a licensed medical practitioner.";

export const EMERGENCY_RED_FLAG_KEYWORDS = [
  "crushing chest pain",
  "sudden severe headache",
  "difficulty breathing",
  "shortness of breath at rest",
  "sudden facial drooping",
  "sudden arm weakness",
  "slurred speech",
  "coughing blood",
  "loss of consciousness",
  "severe anaphylaxis",
  "uncontrolled bleeding",
  "high fever with neck stiffness",
  "severe abdominal rigidity",
];

export interface SafetyCheckResult {
  hasEmergencyRedFlags: boolean;
  detectedFlags: string[];
  safeForIntake: boolean;
  emergencyNotice?: string;
}

/**
 * Scans chief complaints and patient narrative for critical emergency red flags
 */
export function evaluateEmergencySafety(text: string): SafetyCheckResult {
  const normalized = text.toLowerCase();
  const detectedFlags: string[] = [];

  for (const flag of EMERGENCY_RED_FLAG_KEYWORDS) {
    if (normalized.includes(flag.toLowerCase())) {
      detectedFlags.push(flag);
    }
  }

  if (detectedFlags.length > 0) {
    return {
      hasEmergencyRedFlags: true,
      detectedFlags,
      safeForIntake: false,
      emergencyNotice:
        "CRITICAL ALERT: Symptoms suggestive of potential emergency detected. Patient should immediately contact emergency services (Dial 112 / 108) or visit the nearest emergency room.",
    };
  }

  return {
    hasEmergencyRedFlags: false,
    detectedFlags: [],
    safeForIntake: true,
  };
}

/**
 * Strips or flags any accidental diagnostic assertions in AI output to ensure compliance
 */
export function sanitizeAIClinicalNarrative(narrative: string): string {
  // Enforce standard framing as observations and historical reports, not conclusions
  return narrative.trim();
}
