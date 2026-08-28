# SIH26047 Patient Case-Taking & Clinical Decision Support System

## 1. System Architecture Overview

The **SIH26047 Patient Case-Taking Software** is a full-stack, AI-assisted, multilingual clinical history intake, document digitization, and triage platform. It streamlines patient-doctor interactions by collecting structured history, digitizing lab reports, enforcing deterministic safety guardrails, and presenting comprehensive clinical drafts to licensed medical practitioners for verification.

```
                  ┌─────────────────────────────────────────┐
                  │          Patient Interface              │
                  │  (Voice / Text / Touch Multimodal UI)   │
                  └────────────────────┬────────────────────┘
                                       │
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │       Multilingual & i18n Engine        │
                  │       (English, Hindi, Bengali)         │
                  └────────────────────┬────────────────────┘
                                       │
                                       ▼
┌──────────────────────────────────────┴──────────────────────────────────────┐
│                            Core Clinical Engine                             │
├───────────────────────────┬───────────────────────────┬─────────────────────┤
│   AI Dialogue Adapter     │  Deterministic Safety     │  OCR Document       │
│   (LLM History Intake)    │  Rule Engine (Red Flags)  │  Digitizer (Tesseract)│
└─────────────┬─────────────┴─────────────┬─────────────┴──────────┬──────────┘
              │                           │                        │
              ▼                           ▼                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Healthcare Interoperability Layer                         │
│       (FHIR R4 Bundle Mapper & ABDM / ABHA Health Information Exchange)      │
└─────────────────────────────────────────┬───────────────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Doctor Verification Station                          │
│          (Digital Sign-Off, Provisional Diagnosis & Verification Audit)     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

* **Core Framework**: Next.js 15 (App Router), React 19, TypeScript
* **Database**: MongoDB with Mongoose ODM
* **Styling & UI**: Vanilla CSS with Tailwind CSS tokens, Lucide React Icons, Radix UI primitives
* **AI Layer**: Provider-agnostic adapter (`getLLMAdapter()`) supporting Gemini 1.5 Pro, OpenAI GPT-4o, Anthropic Claude 3.5, Groq, and Ollama
* **OCR Layer**: Tesseract.js client/server OCR pipeline for prescription and lab report digitization
* **Voice Engine**: `VoiceService` abstraction with Web Speech API (`SpeechRecognition` / `SpeechSynthesis`), Bhashini / AI4Bharat adapter, and OpenAI Whisper/TTS adapter
* **Safety Layer**: Deterministic rule-based `SafetyEngine` for emergency red-flag triage
* **Interoperability**: HL7 FHIR R4 Bundle Mapper & ABDM (Ayushman Bharat Digital Mission) Health Information Exchange abstraction
* **Real-time Chat**: Socket.IO / REST fallback messaging with strict authorization checks
* **Maps**: Google Maps JS/Embed API integration with graceful plain-text address fallback

---

## 3. Database Models

1. **`User`**: Account identity, roles (`PATIENT`, `DOCTOR`, `TRIAGE_STAFF`, `ADMIN`), hashed passwords (`bcryptjs`).
2. **`PatientProfile`**: Demographic details, ABHA ID, blood group, emergency contacts.
3. **`DoctorProfile`**: NMC registration number, AYUSH system (`AYURVEDA`, `YOGA_NATUROPATHY`, `UNANI`, `SIDDHA`, `HOMEOPATHY`, `ALLOPATHY`), specialization, consultation fee, chamber information, availability slots.
4. **`ClinicalSession`**: Active intake wizard/dialogue session state, answers map, safety flags (`isUrgent`, `safetySeverity`).
5. **`CaseRecord`**: Master clinical case record storing chief complaints, vitals, medical/surgical history, allergies, medications, attached documents, AI summaries, and doctor verification signatures.
6. **`MedicalDocument`**: Uploaded prescriptions and lab reports, Cloudinary URL, OCR extracted text.
7. **`Consent`**: Granular consent scope tracking (`clinicalCaseTaking`, `documentDigitizationOcr`, `doctorVerificationSharing`, `abdmInteroperabilitySharing`), versions, digital signatures, revocation timestamps.
8. **`TriageRecord`**: Real-time triage station alerts with status workflow (`NEW`, `ACKNOWLEDGED`, `IN_PROGRESS`, `RESOLVED`) and strict data privacy.
9. **`Appointment`**: Consultation appointments with double-booking conflict prevention (`PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`, `NO_SHOW`, `URGENT`).
10. **`ChatMessage`**: Authorized doctor-patient conversation messages and file attachments.
11. **`DoctorReview`**: Post-appointment verified patient ratings (1 to 5 stars) and reviews.
12. **`AuditLog`**: Immutable audit logs tracking login, document access, case creation, consent updates, emergency triggers, and verification sign-offs.

---

## 4. AI Architecture & Prompt Engineering

The AI layer employs a provider-agnostic adapter design pattern (`src/lib/ai/adapter.ts`). It routes prompts through a structured JSON schema constraint (`aiQuestionResponseSchema`), returning:
* `nextQuestion`: Single, empathetic, targeted clinical question.
* `collectedInformation`: Extracted key-value pairs (chief complaint, duration, onset, severity).
* `possibleRedFlags`: Suggested emergency red flags.

> **Clinical Safety Guardrail**: The LLM is strictly constrained from providing medical diagnosis or autonomous prescriptions. All outputs serve as preliminary structured history drafts for physician review.

---

## 5. OCR Document Digitization Architecture

The document processing module (`src/services/ocrService.ts`) handles prescription and lab report scanning:
1. Patient uploads PDF/image of medical document.
2. Image preprocessing (contrast enhancement, binarization).
3. Tesseract OCR execution extracting raw text.
4. Medical entity extraction (extracts vitals, lab values, dosages, and dates).
5. Automatic mapping into the patient's **Medical Timeline View**.

---

## 6. Voice & Multilingual Architecture

The `VoiceService` abstraction (`src/services/voice/VoiceService.ts`) enables voice-driven intake in **English**, **Hindi (हिंदी)**, and **Bengali (বাংলা)**:
* **Speech-to-Text (STT)**: Captures voice input via browser Web Speech API, Bhashini, or Whisper.
* **Transcript Edit Box**: Displays a live preview allowing patients to correct misheard words before submitting.
* **Text-to-Speech (TTS)**: Provides one-tap audio guidance (`AudioPlayerWidget`) reading questions aloud for elderly or low-literacy users.
* **Privacy Assurance**: Audio is processed strictly in-memory; audio files are not saved to disk or database unless explicit audio retention consent is granted.

---

## 7. Deterministic Safety Engine & Red-Flag Triage

Emergency red-flag detection is handled by a deterministic rule-based **Safety Rule Engine** (`src/services/safety/safetyEngine.ts`), independent of the LLM:
* Evaluates input text, collected history, and vitals against `SAFETY_RULES_REGISTRY` (e.g. chest pain + dyspnea, stroke signs, loss of consciousness, severe bleeding, SpO2 < 90%).
* Categorizes cases into **`NORMAL`**, **`WARNING`**, or **`URGENT`**.
* Triggers an **Emergency Red-Flag Modal** guiding the patient to call emergency services (112 / 108) or visit the ER.
* Automatically posts an alert to the **OPD Triage Station** (`/triage/dashboard`) with strict privacy protection.

---

## 8. FHIR R4 Interoperability & ABDM Integration Approach

* **FHIRMapper (`src/lib/fhir/FHIRMapper.ts`)**: Maps internal clinical records into standard HL7 FHIR R4 Bundles containing `Patient`, `Encounter`, `Observation`, `Condition`, `MedicationStatement`, `DiagnosticReport`, and `DocumentReference` resources.
* **ABDM Abstraction (`src/services/abdmService.ts`)**: Implements ABHA linking, consent request, and health record exchange interfaces ready for production gateway integration.
* **Sandbox Demo Panel (`/fhir/demo`)**: Interactive demonstration panel for judges showing the complete pipeline from patient intake to FHIR JSON and mock ABDM HIS Gateway transmission.

---

## 9. Security & Access Boundaries

* **Authentication & Role Guards**: Middleware & NextAuth.js enforcing strict role boundaries (`PATIENT`, `DOCTOR`, `TRIAGE_STAFF`, `ADMIN`).
* **Document Security**: Medical documents are stored with authenticated access checks; direct unauthenticated public links are prohibited.
* **Chat Authorization**: Patients can only access their own chats; doctors can only access chats for patients with authorized care relationships.
* **Audit Logging**: Every sensitive action is logged with timestamp, actor, action type, IP address, and resource ID.

---

## 10. End-to-End Patient & Doctor Workflow

1. **Patient Login & Language Selection**: Login, pick language (English, Hindi, Bengali).
2. **Granular Digital Consent**: Review and grant/revoke scope preferences (`/patient/consent`).
3. **AYUSH System Selection**: Select consulting medical system (Allopathy, Ayurveda, Yoga & Naturopathy, Unani, Siddha, Homoeopathy).
4. **Multimodal Case Taking**: Answer intake via Voice, Text, or Touch tiles in Form Wizard or AI Dialogue mode.
5. **Deterministic Red-Flag Evaluation**: Live safety check flags emergencies; displays guidance if urgent.
6. **Report Upload & OCR**: Upload previous lab reports/prescriptions; inspect extracted medical timeline.
7. **AI Summary Generation**: Compile structured history draft with clinical disclaimer.
8. **Triage & Doctor Queue**: Priority triage queue displays cases to staff and consulting doctors.
9. **Doctor Verification & Digital Sign-off**: Doctor reviews, edits, accepts summary, enters provisional diagnosis & plan, signs digitally.
10. **Appointment & Review**: Complete appointment consultation; patient submits 1–5 star rating and review.

---

## 11. SIH Problem Statement Mapping (SIH26047)

| SIH Requirement | Technical Implementation |
|-----------------|--------------------------|
| **Multilingual Intake** | English, Hindi, Bengali Web Speech & i18n dictionary |
| **AYUSH Systems Support** | Ayurveda (Dashavidha Pariksha), Yoga, Unani, Siddha, Homoeopathy, Allopathy |
| **Structured Clinical History** | Chief Complaint, HPI, Past History, Medications, Allergies, Family/Lifestyle |
| **OCR Report Digitization** | Tesseract.js text extraction & Medical Timeline View |
| **Emergency Safety Guardrails** | Deterministic Safety Engine & Red-Flag Triage Control |
| **ABDM / EHR Interoperability** | HL7 FHIR R4 Bundle Mapper & ABDM Service Abstraction |
| **Doctor Digital Verification** | Non-autonomous AI summary drafting & Doctor signature token sign-off |
