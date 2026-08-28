import { AyushSystem } from "./user";

export type AnswerType =
  | "text"
  | "single_choice"
  | "multiple_choice"
  | "number"
  | "date"
  | "yes_no"
  | "body_location"
  | "severity_scale";

export type QuestionCategory =
  | "language_consent"
  | "ayush_selection"
  | "chief_complaint"
  | "hpi"
  | "past_history"
  | "medications_allergies"
  | "lifestyle_ros"
  | "ayurveda_dashavidha"
  | "review";

export interface QuestionOption {
  label: string;
  value: string;
  description?: string;
}

export interface QuestionDependency {
  questionId: string;
  equalsValue?: string | boolean | string[];
}

export interface QuestionSchema {
  id: string;
  category: QuestionCategory;
  question: string;
  description?: string;
  answerType: AnswerType;
  options?: QuestionOption[];
  placeholder?: string;
  isOptional?: boolean;
  ayushSystemFilter?: AyushSystem[]; // Question shown only if system matches
  dependsOn?: QuestionDependency;
}

export interface AyurvedaDashavidhaData {
  prakriti?: "VATA" | "PITTA" | "KAPHA" | "VATA_PITTA" | "PITTA_KAPHA" | "VATA_KAPHA" | "TRIDOSHAJA";
  vikriti?: string;
  sara?: string; // Tissue excellence
  samhanana?: "COMPACT" | "MODERATE" | "LOOSE";
  pramana?: "PROPORTIONAL" | "DISPROPORTIONAL";
  satmya?: string; // Adaptability
  sattva?: "PRAVARA" | "MADHYAMA" | "AVARA"; // Mental strength
  aharaShakti?: "PRAVARA" | "MADHYAMA" | "AVARA"; // Digestive & Agni power
  vyayamaShakti?: "PRAVARA" | "MADHYAMA" | "AVARA"; // Physical endurance
  vaya?: "BALYA" | "MADHYAMA" | "VRIDDHA"; // Age stage
  aharaViharaHabits?: string[];
}

export interface StructuredClinicalHistory {
  chiefComplaint: string;
  duration: string;
  severity: string;
  onset?: string;
  location?: string;
  character?: string;
  radiation?: string;
  aggravatingFactors: string[];
  relievingFactors: string[];
  associatedSymptoms: string[];
  pastMedicalHistory: string[];
  pastSurgicalHistory: string[];
  currentMedications: Array<{ name: string; dosage?: string; frequency?: string }>;
  allergies: Array<{ substance: string; reaction?: string }>;
  familyHistory: string[];
  lifestyle: {
    dietaryPattern?: string;
    tobaccoUse?: boolean;
    alcoholUse?: boolean;
    sleepPattern?: string;
  };
  ayushSystemUsed: AyushSystem;
  ayurvedaSpecifics?: AyurvedaDashavidhaData;
  generatedAt: Date;
}
