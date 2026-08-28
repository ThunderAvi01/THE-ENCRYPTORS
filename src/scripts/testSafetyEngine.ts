import { evaluateSafetyStatus } from "../services/safety/safetyEngine";
import { SAFETY_RULES_REGISTRY } from "../services/safety/safetyRules";

console.log("=================================================");
console.log("SIH26047 CLINICAL SAFETY ENGINE VERIFICATION TEST");
console.log("=================================================\n");

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passedCount++;
  } else {
    console.error(`[FAIL] ${testName}`);
    failedCount++;
  }
}

// 1. Test Red-Flag Combination: Chest Pain + Difficulty Breathing
const test1 = evaluateSafetyStatus({
  patientInput: "I have crushing chest pain and severe difficulty breathing since 1 hour ago",
});
assert(test1.isUrgent === true, "Scenario 1: Chest pain + dyspnea triggers URGENT severity");
assert(test1.overallSeverity === "URGENT", "Scenario 1: Overall severity is URGENT");
assert(
  test1.triggeredRules.some((r) => r.ruleId === "RULE_CHEST_PAIN_DYSPNEA"),
  "Scenario 1: Triggered RULE_CHEST_PAIN_DYSPNEA rule"
);

// 2. Test Stroke Symptoms: Facial drooping & slurred speech
const test2 = evaluateSafetyStatus({
  patientInput: "My father has sudden facial drooping and slurred speech",
});
assert(test2.isUrgent === true, "Scenario 2: Stroke-like symptoms trigger URGENT severity");
assert(
  test2.triggeredRules.some((r) => r.ruleId === "RULE_STROKE_SYMPTOMS"),
  "Scenario 2: Triggered RULE_STROKE_SYMPTOMS rule"
);

// 3. Test Loss of Consciousness
const test3 = evaluateSafetyStatus({
  patientInput: "Patient fainted and was unconscious for 2 minutes",
});
assert(test3.isUrgent === true, "Scenario 3: Loss of consciousness triggers URGENT severity");

// 4. Test Severe Uncontrolled Bleeding
const test4 = evaluateSafetyStatus({
  patientInput: "Severe uncontrolled bleeding from wound after accident",
});
assert(test4.isUrgent === true, "Scenario 4: Severe bleeding triggers URGENT severity");

// 5. Test Critical Vitals Anomaly (SpO2 < 90%)
const test5 = evaluateSafetyStatus({
  patientInput: "Feeling weak",
  vitals: { spo2: 86, systolicBp: 120, heartRate: 85 },
});
assert(test5.isUrgent === true, "Scenario 5: Critical SpO2 < 90% triggers URGENT severity");

// 6. Test Warning Scenario: High Fever
const test6 = evaluateSafetyStatus({
  patientInput: "Fever of 103F for 2 days",
  answers: { symptom_severity: 6 },
});
assert(test6.overallSeverity === "WARNING", "Scenario 6: High fever triggers WARNING severity");
assert(test6.isUrgent === false, "Scenario 6: High fever does not falsely trigger URGENT");

// 7. Test Normal Scenario: Mild headache
const test7 = evaluateSafetyStatus({
  patientInput: "Mild headache for 2 days after working on laptop",
  answers: { symptom_severity: 3 },
});
assert(test7.overallSeverity === "NORMAL", "Scenario 7: Mild headache is NORMAL severity");
assert(test7.isUrgent === false, "Scenario 7: Mild headache is not urgent");
assert(test7.triggeredRules.length === 0, "Scenario 7: No safety rules triggered");

console.log("\n-------------------------------------------------");
console.log(`TEST RESULTS: ${passedCount} PASSED, ${failedCount} FAILED.`);
console.log("-------------------------------------------------");

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log("SAFETY ENGINE VERIFICATION PASSED SUCCESSFULLY!\n");
}
