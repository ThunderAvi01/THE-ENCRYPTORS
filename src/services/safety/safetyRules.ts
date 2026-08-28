export type SafetySeverity = "NORMAL" | "WARNING" | "URGENT";

export interface SafetyRuleMatchInput {
  patientInput?: string;
  answers?: Record<string, unknown>;
  vitals?: {
    systolicBp?: number;
    diastolicBp?: number;
    heartRate?: number;
    respiratoryRate?: number;
    spo2?: number;
    temperature?: number;
  };
}

export interface SafetyRule {
  id: string;
  name: string;
  severity: "WARNING" | "URGENT";
  description: string;
  match: (input: SafetyRuleMatchInput) => boolean;
  reasonText: string;
  recommendedAction: string;
}

/**
 * Modular, Configurable Registry of Clinical Safety & Red-Flag Rules.
 * Developers and clinical leads can easily add or modify rules below.
 */
export const SAFETY_RULES_REGISTRY: SafetyRule[] = [
  // 1. Severe Chest Pain + Breathing Difficulty (Combination)
  {
    id: "RULE_CHEST_PAIN_DYSPNEA",
    name: "Chest Pain with Breathing Difficulty",
    severity: "URGENT",
    description: "Combined presence of severe chest pain and breathlessness or dyspnea.",
    match: (input) => {
      const text = (input.patientInput || "").toLowerCase();
      const answersStr = JSON.stringify(input.answers || {}).toLowerCase();
      const combined = `${text} ${answersStr}`;

      const hasChestPain =
        combined.includes("chest pain") ||
        combined.includes("chest pressure") ||
        combined.includes("chest tightness") ||
        combined.includes("सीने में दर्द") ||
        combined.includes("বুকে ব্যথা");

      const hasBreathingDiff =
        combined.includes("breath") ||
        combined.includes("shortness of breath") ||
        combined.includes("difficulty breathing") ||
        combined.includes("सांस") ||
        combined.includes("শ্বাস");

      return hasChestPain && hasBreathingDiff;
    },
    reasonText: "Potential urgent situation: Combination of chest pain and breathing difficulty reported.",
    recommendedAction: "Seek immediate emergency medical assistance. Call 112 / 108 or proceed to nearest Emergency Department.",
  },

  // 2. Sudden Stroke-Like Symptoms (FAST)
  {
    id: "RULE_STROKE_SYMPTOMS",
    name: "Sudden Stroke-Like Symptoms",
    severity: "URGENT",
    description: "Sudden facial drooping, arm/leg weakness or numbness, slurred speech.",
    match: (input) => {
      const text = (input.patientInput || "").toLowerCase();
      const answersStr = JSON.stringify(input.answers || {}).toLowerCase();
      const combined = `${text} ${answersStr}`;

      const strokeKeywords = [
        "facial droop",
        "face drooping",
        "arm weakness",
        "leg weakness",
        "slurred speech",
        "speech difficulty",
        "sudden paralysis",
        "one side numb",
        "लकवा",
        "पैरालिसिस",
        "মুখ বেঁকে যাওয়া",
      ];

      return strokeKeywords.some((kw) => combined.includes(kw));
    },
    reasonText: "Potential urgent situation: Sudden neurological or stroke-like symptoms reported.",
    recommendedAction: "Immediate emergency evaluation required (Stroke Protocol). Seek emergency care immediately.",
  },

  // 3. Loss of Consciousness / Fainting
  {
    id: "RULE_LOSS_OF_CONSCIOUSNESS",
    name: "Loss of Consciousness / Syncope",
    severity: "URGENT",
    description: "Fainting, collapse, or loss of responsiveness.",
    match: (input) => {
      const text = (input.patientInput || "").toLowerCase();
      const answersStr = JSON.stringify(input.answers || {}).toLowerCase();
      const combined = `${text} ${answersStr}`;

      const locKeywords = [
        "loss of consciousness",
        "passed out",
        "fainted",
        "unconscious",
        "collapsed",
        "बेहोश",
        "अचेत",
        "অজ্ঞান",
      ];

      return locKeywords.some((kw) => combined.includes(kw));
    },
    reasonText: "Potential urgent situation: Episode of loss of consciousness or collapse.",
    recommendedAction: "Urgent clinical stabilization required. Contact emergency services immediately.",
  },

  // 4. Severe Uncontrolled Bleeding
  {
    id: "RULE_SEVERE_BLEEDING",
    name: "Severe Uncontrolled Bleeding",
    severity: "URGENT",
    description: "Heavy external bleeding or vomiting/coughing blood.",
    match: (input) => {
      const text = (input.patientInput || "").toLowerCase();
      const answersStr = JSON.stringify(input.answers || {}).toLowerCase();
      const combined = `${text} ${answersStr}`;

      const bleedingKeywords = [
        "uncontrolled bleeding",
        "heavy bleeding",
        "coughing blood",
        "vomiting blood",
        "hemorrhage",
        "खून बह रहा",
        "रक्तस्राव",
        "অতিরিক্ত রক্তপাত",
      ];

      return bleedingKeywords.some((kw) => combined.includes(kw));
    },
    reasonText: "Potential urgent situation: Active severe or gastrointestinal/respiratory bleeding reported.",
    recommendedAction: "Apply direct pressure if external and proceed immediately to Emergency Room.",
  },

  // 5. Severe Difficulty Breathing / Acute Dyspnea
  {
    id: "RULE_SEVERE_DYSPNEA",
    name: "Severe Difficulty Breathing",
    severity: "URGENT",
    description: "Severe shortness of breath, gasping, or inability to speak full sentences.",
    match: (input) => {
      const text = (input.patientInput || "").toLowerCase();
      const answersStr = JSON.stringify(input.answers || {}).toLowerCase();
      const combined = `${text} ${answersStr}`;

      const dyspneaKeywords = [
        "cannot breathe",
        "gasping for air",
        "severe shortness of breath",
        "unable to speak",
        "stridor",
        "wheezing severely",
        "सांस फूल रही",
        "শ্বাস নিতে খুব কষ্ট",
      ];

      return dyspneaKeywords.some((kw) => combined.includes(kw));
    },
    reasonText: "Potential urgent situation: Acute respiratory distress detected.",
    recommendedAction: "Urgent respiratory evaluation required. Seek emergency medical attention.",
  },

  // 6. Critical Vitals Anomaly Rule
  {
    id: "RULE_CRITICAL_VITALS",
    name: "Critical Vitals Anomaly",
    severity: "URGENT",
    description: "SpO2 < 90%, Systolic BP > 180 or < 80 mmHg, Heart Rate > 140 or < 40 bpm.",
    match: (input) => {
      if (!input.vitals) return false;
      const { spo2, systolicBp, heartRate } = input.vitals;

      if (spo2 !== undefined && spo2 > 0 && spo2 < 90) return true;
      if (systolicBp !== undefined && (systolicBp >= 180 || systolicBp <= 80)) return true;
      if (heartRate !== undefined && (heartRate >= 140 || heartRate <= 40)) return true;

      return false;
    },
    reasonText: "Potential urgent situation: Abnormally critical vitals measurements detected.",
    recommendedAction: "Immediate vital signs recheck and emergency physician triage required.",
  },

  // 7. Warning Level Rule: High Fever / Moderate Pain
  {
    id: "RULE_WARNING_FEVER_OR_PAIN",
    name: "High Fever or Severe Pain Scale",
    severity: "WARNING",
    description: "High temperature (> 102°F) or self-rated pain 8-10 without acute collapse.",
    match: (input) => {
      const text = (input.patientInput || "").toLowerCase();
      const answersStr = JSON.stringify(input.answers || {}).toLowerCase();
      const combined = `${text} ${answersStr}`;

      const highFever = combined.includes("high fever") || combined.includes("103") || combined.includes("104");
      const severityVal = Number(input.answers?.["symptom_severity"]);
      const highPain = severityVal >= 8;

      const vitalsTemp = input.vitals?.temperature;
      const vitalsFever = vitalsTemp !== undefined && vitalsTemp >= 38.9; // ~102°F

      return highFever || highPain || vitalsFever;
    },
    reasonText: "Clinical Warning: Elevated pain rating or high fever reported.",
    recommendedAction: "Priority OPD consultation recommended.",
  },
];
