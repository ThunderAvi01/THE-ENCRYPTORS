import { LLMProvider } from "@/types/ai";

export interface ILLMAdapter {
  generateCompletion(systemPrompt: string, userPrompt: string): Promise<string>;
}

export class GeminiAdapter implements ILLMAdapter {
  private apiKey: string;
  private modelName: string;
  private baseUrl: string;

  constructor(apiKey: string, modelName = "gemini-1.5-pro", baseUrl = "https://generativelanguage.googleapis.com") {
    this.apiKey = apiKey;
    this.modelName = modelName;
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  async generateCompletion(systemPrompt: string, userPrompt: string): Promise<string> {
    const url = `${this.baseUrl}/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error("Empty candidate response from Gemini API");
    }

    return candidateText;
  }
}

export class OpenAIAdapter implements ILLMAdapter {
  private apiKey: string;
  private modelName: string;

  constructor(apiKey: string, modelName = "gpt-4o") {
    this.apiKey = apiKey;
    this.modelName = modelName;
  }

  async generateCompletion(systemPrompt: string, userPrompt: string): Promise<string> {
    const url = "https://api.openai.com/v1/chat/completions";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.modelName,
        response_format: { type: "json_object" },
        temperature: 0.2,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenAI API Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const messageContent = data?.choices?.[0]?.message?.content;
    if (!messageContent) {
      throw new Error("Empty message content from OpenAI API");
    }

    return messageContent;
  }
}

export class MockDeterministicFallbackAdapter implements ILLMAdapter {
  async generateCompletion(): Promise<string> {
    // Returns fallback JSON matching aiQuestionResponseSchema
    return JSON.stringify({
      nextQuestion: "Can you describe the location and duration of your discomfort?",
      category: "hpi",
      reason: "Deterministic fallback engine active",
      collectedInformation: {},
      missingFields: ["symptom_location", "symptom_duration"],
      possibleRedFlags: [],
    });
  }
}

export function getLLMAdapter(): ILLMAdapter {
  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase() as LLMProvider;
  const apiKey = process.env.AI_API_KEY || "";
  const modelName = process.env.AI_MODEL_NAME || "gemini-1.5-pro";
  const baseUrl = process.env.AI_BASE_URL || "https://generativelanguage.googleapis.com";

  if (!apiKey || apiKey.trim() === "" || provider === "mock") {
    console.log("[AI Adapter] No valid AI_API_KEY found or provider is mock. Using MockDeterministicFallbackAdapter.");
    return new MockDeterministicFallbackAdapter();
  }

  if (provider === "openai") {
    return new OpenAIAdapter(apiKey, modelName);
  }

  return new GeminiAdapter(apiKey, modelName, baseUrl);
}
