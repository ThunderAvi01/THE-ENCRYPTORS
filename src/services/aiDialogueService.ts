import { getLLMAdapter } from "@/lib/ai/adapter";
import { SYSTEM_CLINICAL_DIALOGUE_PROMPT, buildClinicalPrompt } from "@/lib/ai/prompts";
import { aiQuestionResponseSchema } from "@/lib/validations/ai";
import { AIQuestionResponse } from "@/types/ai";
import { QuestionCategory } from "@/types/questionnaire";
import { CLINICAL_QUESTION_REGISTRY } from "@/lib/questionnaires/clinicalQuestions";

function sanitizeJsonOutput(rawOutput: string): string {
  let cleaned = rawOutput.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "").trim();
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```/, "").replace(/```$/, "").trim();
  }
  return cleaned;
}

export async function generateNextClinicalQuestion(
  patientInput: string,
  answersMap: Record<string, unknown>,
  selectedAyushSystem = "ALLOPATHY",
  selectedLanguage = "en"
): Promise<AIQuestionResponse> {
  // Determine missing fields in registry
  const missingFields = CLINICAL_QUESTION_REGISTRY.filter((q) => {
    if (q.ayushSystemFilter && !q.ayushSystemFilter.includes(selectedAyushSystem as any)) {
      return false;
    }
    const val = answersMap[q.id];
    return val === undefined || val === null || val === "";
  }).map((q) => q.id);

  try {
    const adapter = getLLMAdapter();
    const prompt = buildClinicalPrompt(
      patientInput,
      answersMap,
      missingFields,
      selectedAyushSystem,
      selectedLanguage
    );

    const rawResponse = await adapter.generateCompletion(SYSTEM_CLINICAL_DIALOGUE_PROMPT, prompt);
    const sanitized = sanitizeJsonOutput(rawResponse);
    const jsonParsed = JSON.parse(sanitized);

    // Zod validation
    const validationResult = aiQuestionResponseSchema.safeParse(jsonParsed);

    if (!validationResult.success) {
      console.warn(
        "[AI Service] Zod validation failed for LLM output. Falling back to deterministic question.",
        validationResult.error.format()
      );
      return getDeterministicFallbackQuestion(answersMap, selectedAyushSystem, missingFields);
    }

    return validationResult.data as AIQuestionResponse;
  } catch (error) {
    console.error("[AI Service] LLM invocation failed, using safe fallback:", error);
    return getDeterministicFallbackQuestion(answersMap, selectedAyushSystem, missingFields);
  }
}

function getDeterministicFallbackQuestion(
  answersMap: Record<string, unknown>,
  selectedAyushSystem: string,
  missingFields: string[]
): AIQuestionResponse {
  // Pick first missing question from registry
  const firstMissingQuestion = CLINICAL_QUESTION_REGISTRY.find((q) => {
    if (q.ayushSystemFilter && !q.ayushSystemFilter.includes(selectedAyushSystem as any)) {
      return false;
    }
    return missingFields.includes(q.id);
  });

  const nextQ = firstMissingQuestion
    ? firstMissingQuestion.question
    : "Thank you. All clinical history fields have been collected. You can now review and submit your case.";

  const category: QuestionCategory = firstMissingQuestion ? firstMissingQuestion.category : "review";

  return {
    nextQuestion: nextQ,
    category,
    reason: "Deterministic clinical schema progression fallback",
    collectedInformation: {},
    missingFields,
    possibleRedFlags: [],
  };
}
