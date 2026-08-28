import {
  SAFETY_RULES_REGISTRY,
  SafetyRule,
  SafetySeverity,
  SafetyRuleMatchInput,
} from "./safetyRules";

export interface TriggeredRuleResult {
  ruleId: string;
  name: string;
  severity: "WARNING" | "URGENT";
  reasonText: string;
  recommendedAction: string;
}

export interface SafetyEvaluationResult {
  overallSeverity: SafetySeverity;
  isUrgent: boolean;
  isWarning: boolean;
  triggeredRules: TriggeredRuleResult[];
  patientWarningMessage: string | null;
  triageAlertReason: string;
  evaluatedAt: Date;
}

/**
 * Deterministic Clinical Safety Engine Evaluator.
 * This rule-based evaluator acts as the final application-level safety layer,
 * independent of LLM outputs.
 */
export function evaluateSafetyStatus(
  input: SafetyRuleMatchInput,
  aiSuggestedRedFlags: string[] = []
): SafetyEvaluationResult {
  const triggered: TriggeredRuleResult[] = [];

  for (const rule of SAFETY_RULES_REGISTRY) {
    try {
      if (rule.match(input)) {
        triggered.push({
          ruleId: rule.id,
          name: rule.name,
          severity: rule.severity,
          reasonText: rule.reasonText,
          recommendedAction: rule.recommendedAction,
        });
      }
    } catch (err) {
      console.error(`[Safety Engine] Error evaluating rule ${rule.id}:`, err);
    }
  }

  const hasUrgent = triggered.some((r) => r.severity === "URGENT");
  const hasWarning = triggered.some((r) => r.severity === "WARNING") || aiSuggestedRedFlags.length > 0;

  let overallSeverity: SafetySeverity = "NORMAL";
  if (hasUrgent) {
    overallSeverity = "URGENT";
  } else if (hasWarning) {
    overallSeverity = "WARNING";
  }

  const urgentRules = triggered.filter((r) => r.severity === "URGENT");
  const warningRules = triggered.filter((r) => r.severity === "WARNING");

  let patientWarningMessage: string | null = null;
  let triageAlertReason = "Routine clinical intake";

  if (overallSeverity === "URGENT") {
    const reasons = urgentRules.map((r) => r.reasonText).join(" ");
    const actions = urgentRules.map((r) => r.recommendedAction).join(" ");
    patientWarningMessage = `CRITICAL ALERT — Potential Urgent Situation Detected! ${reasons} ${actions}`;
    triageAlertReason = urgentRules.map((r) => r.name).join(", ");
  } else if (overallSeverity === "WARNING") {
    const reasons = warningRules.map((r) => r.reasonText).join(" ");
    patientWarningMessage = `Clinical Notice: ${reasons || "Elevated clinical indicators detected."}`;
    triageAlertReason = warningRules.map((r) => r.name).join(", ") || "AI Red Flag Cue";
  }

  return {
    overallSeverity,
    isUrgent: overallSeverity === "URGENT",
    isWarning: overallSeverity === "WARNING",
    triggeredRules: triggered,
    patientWarningMessage,
    triageAlertReason,
    evaluatedAt: new Date(),
  };
}
