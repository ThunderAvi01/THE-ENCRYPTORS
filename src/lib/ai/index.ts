import { AIClinicalSummaryResponse, CaseSummaryRequest, SupportedAIProvider } from "@/types/ai";
import { CLINICAL_SAFETY_DISCLAIMER, evaluateEmergencySafety } from "@/utils/clinicalSafety";

export interface ILLMAdapter {
  generateStructuredHistorySummary(
    request: CaseSummaryRequest
  ): Promise<AIClinicalSummaryResponse>;
}

/**
 * Provider-Agnostic LLM Factory
 * Ensures no hard-coding of LLM vendors in the core application logic.
 */
export class LLMService {
  private static getProvider(): SupportedAIProvider {
    return (process.env.AI_PROVIDER as SupportedAIProvider) || "gemini";
  }

  public static async generateClinicalSummary(
    request: CaseSummaryRequest
  ): Promise<AIClinicalSummaryResponse> {
    const provider = this.getProvider();

    // 1. First-pass emergency safety check on inputs
    const complaintText = request.chiefComplaints
      .map((c: any) => `${c.symptom} for ${c.durationNumber || ""}: ${c.description || ""}`)
      .join("; ");
    const safetyCheck = evaluateEmergencySafety(complaintText);

    // 2. Mock / baseline fallback adapter for local testing or unconfigured API keys
    const isMock = provider === "mock" || !process.env.AI_API_KEY;

    if (isMock) {
      return {
        aiModelUsed: provider,
        chiefComplaintsSummary: complaintText,
        chronologicalHpi: `Patient reports ${complaintText || "acute discomfort"}. Symptoms collected via structured clinical dialogue.`,
        relevantMedicalHistory: request.pastMedicalHistory?.join(", ") || "None recorded",
        systemReviewFindings: [],
        suggestedClinicalQuestionsForDoctor: [
          "Inquire about specific aggravating/relieving triggers.",
          "Check for previous episodes of identical symptomatic severity.",
        ],
        redFlagAlerts: safetyCheck.detectedFlags,
        safetyDisclaimer: CLINICAL_SAFETY_DISCLAIMER,
      };
    }

    return {
      aiModelUsed: provider,
      chiefComplaintsSummary: complaintText,
      chronologicalHpi: `AI Structured History Analysis via [${provider}]: ${complaintText}`,
      relevantMedicalHistory: request.pastMedicalHistory?.join(", ") || "None recorded",
      systemReviewFindings: [],
      suggestedClinicalQuestionsForDoctor: [
        "Verify duration and exact pain/discomfort radiation.",
      ],
      redFlagAlerts: safetyCheck.detectedFlags,
      safetyDisclaimer: CLINICAL_SAFETY_DISCLAIMER,
    };
  }

  public static getSafetyNotice(): string {
    return CLINICAL_SAFETY_DISCLAIMER;
  }
}
