import { QuestionCategory } from "./questionnaire";

export type LLMProvider = "gemini" | "openai" | "mock";
export type SupportedAIProvider = LLMProvider;

export interface AIQuestionResponse {
  nextQuestion: string;
  category: QuestionCategory;
  reason: string;
  collectedInformation: Record<string, unknown>;
  missingFields: string[];
  possibleRedFlags: string[];
}

export interface ExtractedClinicalInfo {
  extractedFields: Record<string, unknown>;
  confidenceScore: number;
  detectedRedFlags: string[];
}

export interface CaseSummaryRequest {
  chiefComplaints: Array<{ symptom: string; durationNumber?: number; durationUnit?: string }>;
  vitals?: Record<string, unknown>;
  pastMedicalHistory?: string[];
  currentMedications?: string[];
  allergies?: string[];
  ayushSystem?: string;
  language?: string;
}

export interface AIClinicalSummaryResponse {
  aiModelUsed: string;
  chiefComplaintsSummary: string;
  chronologicalHpi: string;
  relevantMedicalHistory: string;
  systemReviewFindings: string[];
  suggestedClinicalQuestionsForDoctor: string[];
  redFlagAlerts: string[];
  safetyDisclaimer: string;
}
