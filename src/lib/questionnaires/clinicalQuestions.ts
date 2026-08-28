import { QuestionSchema } from "@/types/questionnaire";

export const CLINICAL_QUESTION_REGISTRY: QuestionSchema[] = [
  // 1. LANGUAGE SELECTION
  {
    id: "selected_language",
    category: "language_consent",
    question: "Select Preferred Language for Clinical Intake",
    description: "Choose the language in which you wish to answer history questions.",
    answerType: "single_choice",
    options: [
      { label: "English", value: "en" },
      { label: "Hindi (हिंदी)", value: "hi" },
      { label: "Bengali (বাংলা)", value: "bn" },
      { label: "Telugu (తెలుగు)", value: "te" },
      { label: "Marathi (मराठी)", value: "mr" },
      { label: "Tamil (தமிழ்)", value: "ta" },
    ],
  },

  // 2. DIGITAL CONSENT
  {
    id: "digital_consent_agreement",
    category: "language_consent",
    question: "Informed Digital Consent Authorization",
    description: "Authorize structured clinical history collection and physician sharing under DPDP Act & ABDM guidelines.",
    answerType: "yes_no",
  },

  // 3. AYUSH SYSTEM SELECTION
  {
    id: "ayush_system_selection",
    category: "ayush_selection",
    question: "Select Medical / AYUSH System for Consultation",
    description: "Choose the healthcare system of your consulting physician.",
    answerType: "single_choice",
    options: [
      { label: "Allopathy (Modern Clinical Medicine)", value: "ALLOPATHY" },
      { label: "Ayurveda (BAMS / MD Ayur)", value: "AYURVEDA" },
      { label: "Homeopathy (BHMS / MD Hom)", value: "HOMEOPATHY" },
      { label: "Unani Medicine (BUMS)", value: "UNANI" },
      { label: "Siddha Medicine (BSMS)", value: "SIDDHA" },
      { label: "Yoga & Naturopathy (BNYS)", value: "YOGA_NATUROPATHY" },
    ],
  },

  // 4. CHIEF COMPLAINT
  {
    id: "chief_complaint_symptom",
    category: "chief_complaint",
    question: "What is your primary medical discomfort or symptom today?",
    description: "Describe the primary symptom that brought you to the clinic.",
    answerType: "text",
    placeholder: "e.g. Upper abdominal pain, persistent dry cough, fever...",
  },
  {
    id: "symptom_onset",
    category: "chief_complaint",
    question: "When did this symptom first begin (Onset)?",
    description: "Specify if the onset was sudden or gradual.",
    answerType: "single_choice",
    options: [
      { label: "Sudden (Acute - hours to 1 day ago)", value: "SUDDEN" },
      { label: "Gradual (Recent - 2 to 7 days ago)", value: "GRADUAL_RECENT" },
      { label: "Insidious / Chronic (Weeks to months ago)", value: "CHRONIC" },
    ],
  },
  {
    id: "symptom_duration",
    category: "chief_complaint",
    question: "How long have you had this problem (Duration)?",
    answerType: "text",
    placeholder: "e.g. 3 days, 2 weeks, 1 month",
  },
  {
    id: "symptom_severity",
    category: "chief_complaint",
    question: "Rate the severity of your pain / discomfort (1 to 10 scale)",
    description: "1 = Very Mild, 5 = Moderate, 10 = Unbearable Severe Pain.",
    answerType: "severity_scale",
  },

  // 5. HISTORY OF PRESENT ILLNESS (HPI)
  {
    id: "symptom_location",
    category: "hpi",
    question: "Where is the discomfort located on your body?",
    answerType: "body_location",
  },
  {
    id: "pain_character",
    category: "hpi",
    question: "How would you describe the character of the pain / discomfort?",
    answerType: "single_choice",
    options: [
      { label: "Throbbing / Pulsating", value: "THROBBING" },
      { label: "Sharp / Stabbing", value: "SHARP" },
      { label: "Dull Ache / Heavy Pressure", value: "DULL_ACHE" },
      { label: "Burning / Acidity sensation", value: "BURNING" },
      { label: "Cramping / Colicky pain", value: "CRAMPING" },
      { label: "Numbness / Tingling", value: "NUMBNESS" },
    ],
  },
  {
    id: "pain_radiation",
    category: "hpi",
    question: "Does the pain radiate or travel to another part of your body?",
    answerType: "single_choice",
    options: [
      { label: "No radiation (Stays in one spot)", value: "NONE" },
      { label: "Radiates to Back", value: "BACK" },
      { label: "Radiates to Shoulder / Neck", value: "SHOULDER" },
      { label: "Radiates to Arm / Chest", value: "ARM" },
      { label: "Radiates to Lower Abdomen / Groin", value: "GROIN" },
    ],
  },
  {
    id: "aggravating_factors",
    category: "hpi",
    question: "What activities or factors make the symptom worse (Aggravating)?",
    answerType: "multiple_choice",
    options: [
      { label: "Eating meals / Food intake", value: "MEALS" },
      { label: "Empty stomach / Fasting", value: "FASTING" },
      { label: "Physical exertion / Movement", value: "MOVEMENT" },
      { label: "Lying down / Sleeping", value: "LYING_DOWN" },
      { label: "Stress / Anxiety", value: "STRESS" },
    ],
  },
  {
    id: "relieving_factors",
    category: "hpi",
    question: "What helps relieve or ease the symptom (Relieving)?",
    answerType: "multiple_choice",
    options: [
      { label: "Resting / Sleep", value: "REST" },
      { label: "Drinking warm water / Milk", value: "WARM_FLUIDS" },
      { label: "Antacids / Previous medicines", value: "MEDICINES" },
      { label: "Passing gas / Bowel movement", value: "BOWEL" },
      { label: "Applying heat / Ice pack", value: "HEAT_ICE" },
    ],
  },
  {
    id: "associated_symptoms",
    category: "hpi",
    question: "Select any associated symptoms you are also experiencing:",
    answerType: "multiple_choice",
    options: [
      { label: "Fever / Chills", value: "FEVER" },
      { label: "Nausea / Vomiting", value: "NAUSEA" },
      { label: "Loss of appetite", value: "APPETITE_LOSS" },
      { label: "Dizziness / Fatigue", value: "FATIGUE" },
      { label: "Shortness of breath", value: "BREATHLESSNESS" },
      { label: "Skin rash / Itching", value: "RASH" },
    ],
  },

  // 6. PAST MEDICAL & SURGICAL HISTORY
  {
    id: "past_medical_conditions",
    category: "past_history",
    question: "Do you have any diagnosed pre-existing medical conditions?",
    answerType: "multiple_choice",
    options: [
      { label: "Diabetes Mellitus", value: "DIABETES" },
      { label: "Hypertension (High BP)", value: "HYPERTENSION" },
      { label: "Asthma / COPD", value: "ASTHMA" },
      { label: "Thyroid Disorder", value: "THYROID" },
      { label: "Heart Disease", value: "HEART_DISEASE" },
      { label: "None of the above", value: "NONE" },
    ],
  },
  {
    id: "past_surgeries",
    category: "past_history",
    question: "Have you undergone any major surgeries in the past?",
    answerType: "text",
    placeholder: "e.g. Appendectomy in 2018, Gallbladder removal in 2021 (or 'None')",
    isOptional: true,
  },

  // 7. MEDICATIONS & ALLERGIES
  {
    id: "current_medications_list",
    category: "medications_allergies",
    question: "List any regular medications you are currently taking:",
    answerType: "text",
    placeholder: "e.g. Metformin 500mg daily, Amlodipine 5mg...",
    isOptional: true,
  },
  {
    id: "known_allergies",
    category: "medications_allergies",
    question: "Do you have any known drug or food allergies?",
    answerType: "text",
    placeholder: "e.g. Penicillin allergy, Sulfa drugs, Peanut allergy (or 'None')",
    isOptional: true,
  },

  // 8. FAMILY & LIFESTYLE
  {
    id: "family_medical_history",
    category: "lifestyle_ros",
    question: "Family Medical History (parents / siblings conditions):",
    answerType: "multiple_choice",
    options: [
      { label: "Family history of Diabetes", value: "FAMILY_DIABETES" },
      { label: "Family history of Hypertension / Heart Disease", value: "FAMILY_CARDIAC" },
      { label: "Family history of Cancer", value: "FAMILY_CANCER" },
      { label: "No significant family history", value: "NONE" },
    ],
  },
  {
    id: "dietary_preference",
    category: "lifestyle_ros",
    question: "Dietary Preference:",
    answerType: "single_choice",
    options: [
      { label: "Vegetarian", value: "VEGETARIAN" },
      { label: "Non-Vegetarian", value: "NON_VEGETARIAN" },
      { label: "Eggetarian", value: "EGGETARIAN" },
      { label: "Vegan", value: "VEGAN" },
    ],
  },

  // 9. AYURVEDA SPECIFIC SECTION (Dashavidha Pariksha - Filtered strictly for AYURVEDA)
  {
    id: "ayurveda_prakriti",
    category: "ayurveda_dashavidha",
    question: "Ayurveda Prakriti (Constitutional Psychosomatic Assessment)",
    description: "Dominant Prakriti constitution.",
    answerType: "single_choice",
    ayushSystemFilter: ["AYURVEDA"],
    options: [
      { label: "Vata Pradhana (Vata Dominant)", value: "VATA" },
      { label: "Pitta Pradhana (Pitta Dominant)", value: "PITTA" },
      { label: "Kapha Pradhana (Kapha Dominant)", value: "KAPHA" },
      { label: "Vata-Pitta Dvandvaja", value: "VATA_PITTA" },
      { label: "Pitta-Kapha Dvandvaja", value: "PITTA_KAPHA" },
      { label: "Vata-Kapha Dvandvaja", value: "VATA_KAPHA" },
      { label: "Sama Dhatu / Tridoshaja", value: "TRIDOSHAJA" },
    ],
  },
  {
    id: "ayurveda_vikriti",
    category: "ayurveda_dashavidha",
    question: "Ayurveda Vikriti (Current Dosha Imbalance)",
    description: "Current pathological aggravation.",
    answerType: "single_choice",
    ayushSystemFilter: ["AYURVEDA"],
    options: [
      { label: "Vata Vriddhi (Vata Aggravation)", value: "VATA_VRIDDHI" },
      { label: "Pitta Vriddhi (Pitta Aggravation / Agni Dusthi)", value: "PITTA_VRIDDHI" },
      { label: "Kapha Vriddhi (Kapha Aggravation / Mandagni)", value: "KAPHA_VRIDDHI" },
      { label: "Samsarga / Sannipataja", value: "SANNIPATA" },
    ],
  },
  {
    id: "ayurveda_tissue_sara",
    category: "ayurveda_dashavidha",
    question: "Ayurveda Dhatu Sara (Tissue Quality Assessment)",
    answerType: "single_choice",
    ayushSystemFilter: ["AYURVEDA"],
    options: [
      { label: "Tvak Sara (Skin excellence)", value: "TVAK" },
      { label: "Rakta Sara (Blood excellence)", value: "RAKTA" },
      { label: "Mamsa Sara (Muscle compactness)", value: "MAMSA" },
      { label: "Meda / Asthi / Majja Sara", value: "MEDA_ASTHI" },
      { label: "Madhyama Sara (Average tissue quality)", value: "MADHYAMA" },
    ],
  },
  {
    id: "ayurveda_samhanana",
    category: "ayurveda_dashavidha",
    question: "Ayurveda Samhanana (Body Compactness)",
    answerType: "single_choice",
    ayushSystemFilter: ["AYURVEDA"],
    options: [
      { label: "Su-samhata (Well compact / Strong)", value: "COMPACT" },
      { label: "Madhyama (Moderate compactness)", value: "MODERATE" },
      { label: "Apara / Shithila (Loose / Poor compactness)", value: "LOOSE" },
    ],
  },
  {
    id: "ayurveda_sattva",
    category: "ayurveda_dashavidha",
    question: "Ayurveda Sattva (Mental Tolerance & Resilience)",
    answerType: "single_choice",
    ayushSystemFilter: ["AYURVEDA"],
    options: [
      { label: "Pravara Sattva (High mental endurance)", value: "PRAVARA" },
      { label: "Madhyama Sattva (Moderate endurance)", value: "MADHYAMA" },
      { label: "Avara Sattva (Low tolerance to pain/stress)", value: "AVARA" },
    ],
  },
  {
    id: "ayurveda_agni_ahara",
    category: "ayurveda_dashavidha",
    question: "Ayurveda Ahara Shakti & Agni (Digestive & Assimilative Capacity)",
    answerType: "single_choice",
    ayushSystemFilter: ["AYURVEDA"],
    options: [
      { label: "Sama Agni (Balanced Agni)", value: "SAMA" },
      { label: "Vishama Agni (Irregular Vata Agni)", value: "VISHAMA" },
      { label: "Tikshna Agni (Intense Pitta Agni)", value: "TIKSHNA" },
      { label: "Manda Agni (Sluggish Kapha Agni)", value: "MANDA" },
    ],
  },
  {
    id: "ayurveda_vyayama",
    category: "ayurveda_dashavidha",
    question: "Ayurveda Vyayama Shakti & Vaya (Physical Capacity & Stage of Life)",
    answerType: "single_choice",
    ayushSystemFilter: ["AYURVEDA"],
    options: [
      { label: "Pravara (High physical capacity)", value: "PRAVARA" },
      { label: "Madhyama (Moderate physical capacity)", value: "MADHYAMA" },
      { label: "Avara (Low physical capacity)", value: "AVARA" },
    ],
  },
];
