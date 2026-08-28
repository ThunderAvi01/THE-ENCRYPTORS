import { LLMService } from "@/lib/ai";
import { CaseSummaryRequest, AIClinicalSummaryResponse } from "@/types/ai";

export class AIService {
  public static async processHistoryCollection(
    request: CaseSummaryRequest
  ): Promise<AIClinicalSummaryResponse> {
    return await LLMService.generateClinicalSummary(request);
  }
}
