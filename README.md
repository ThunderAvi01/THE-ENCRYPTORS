# ArogyaIntake — Patient Case-Taking & Clinical Decision Support System
## Smart India Hackathon 2026 — Problem Statement SIH26047

**ArogyaIntake** is an enterprise-grade, AI-assisted, multilingual clinical history intake, medical document digitization, emergency safety triage, and healthcare interoperability platform built for **Smart India Hackathon 2026 (SIH26047)**.

The software streamlines the patient intake lifecycle into an intelligent 10-phase clinical pipeline designed to reduce physician administrative burden, eliminate redundant manual documentation, accelerate OPD throughput, and uphold strict clinical guardrails.

---

## ⚠️ Mandatory Clinical Safety Guardrail
> **IMPORTANT CLINICAL DISCLAIMER:** 
> This software is a clinical decision support system. **It does NOT perform autonomous diagnosis or autonomous prescription.**
> 
> All AI-generated history analyses and synthesized summaries represent clinical history drafts that must be independently verified, accepted, or edited by a licensed medical practitioner (NMC / AYUSH registered).

---

## 🏥 Core End-to-End Clinical Pipeline

$$\text{Patient Login} \longrightarrow \text{Language \& Granular Consent} \longrightarrow \text{AYUSH System Select} \longrightarrow \text{Multimodal Intake (Voice/Text/Touch)}$$
$$\downarrow$$
$$\text{Deterministic Safety Triage} \longrightarrow \text{Report OCR Digitization} \longrightarrow \text{Medical Timeline} \longrightarrow \text{AI Summary Synthesizer}$$
$$\downarrow$$
$$\text{Physician Sign-Off Queue} \longrightarrow \text{Doctor Verification \& Sign-off} \longrightarrow \text{Appointment Consultation} \longrightarrow \text{FHIR R4 / ABDM Interoperability}$$

---

## 🌟 Key Platform Features (Phases 1 – 10 Implemented)

### 1. Multimodal & Multilingual Intake (Phase 7)
- **Languages Supported**: English, Hindi (हिंदी), Bengali (বাংলা) with extensible Indian language registry.
- **Multimodal Inputs**: Voice recording with live transcript preview and direct edit box, Touch tile quick-answers, and Text input fallback.
- **Accessibility**: Integrated Text-to-Speech (`AudioPlayerWidget`) reading questions aloud for elderly or low-literacy users.

### 2. AYUSH & Allopathy Integration (Phase 2 & Phase 9)
- Native intake support for **Ayurveda** (Dashavidha Pariksha, Prakriti, Agni), **Yoga & Naturopathy**, **Unani**, **Siddha**, **Homoeopathy**, and **Allopathy**.
- Doctor discovery filtering by AYUSH system, specialization, location, consultation fee, and chamber availability.

### 3. Deterministic Safety Engine & Emergency Triage (Phase 8)
- Rule-based safety engine (`SafetyEngine`) operating independently of the LLM.
- Scans for combinations such as severe chest pain + dyspnea, stroke signs, loss of consciousness, severe bleeding, and critical vitals (SpO2 < 90%).
- Automatically triggers high-visibility **Emergency Red-Flag Patient Modals** and routes alerts to the live **OPD Triage Station** (`/triage/dashboard`) with strict patient data privacy protection.

### 4. OCR Medical Document Digitization (Phase 5 & 6)
- Client/server Tesseract OCR pipeline processing uploaded lab reports and handwritten prescriptions.
- Automatically extracts medical entities (vitals, glucose, HbA1c, lab parameters, dosages, dates) and constructs an interactive **Medical Timeline View**.

### 5. AI Clinical History Synthesizer (Phase 4)
- Agnostic LLM adapter layer supporting Gemini 1.5 Pro, OpenAI GPT-4o, Anthropic Claude 3.5, Groq, and Ollama.
- Formats unstructured patient responses into structured HPI, Review of Systems, Past History, Medications, and Allergies.

### 6. Doctor Verification Station & Digital Sign-Off (Phase 3)
- Licensed practitioner review queue (`/doctor/queue` and `/doctor/dashboard`).
- Doctors can edit, accept, or reject AI-generated history drafts, enter provisional diagnoses, select AYUSH/Allopathy treatments, and apply digital sign-off tokens.

### 7. Appointments & Authorized Real-Time Chat (Phase 9)
- Appointment scheduling lifecycle (`PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`, `NO_SHOW`, `URGENT`) with automated **Double-Booking Conflict Prevention**.
- Authorized real-time doctor-patient messaging (`DoctorPatientChatWidget`) with text, timestamps, unread counts, read indicators, and document attachments.
- Verified post-appointment 1-to-5 star ratings and reviews system.

### 8. Granular Digital Consent & Privacy Manager (Phase 10)
- Granular consent scope management (`/patient/consent`) complying with DPDP Act & ABDM standards (`clinicalCaseTaking`, `documentDigitizationOcr`, `doctorVerificationSharing`, `abdmInteroperabilitySharing`, `anonymizedResearchTelemetry`).
- Low-literacy audio explanation support for each consent category.

### 9. HL7 FHIR R4 & ABDM Interoperability (Phase 10)
- `FHIRMapper` converts internal case data into standard FHIR R4 Bundles (`Patient`, `Encounter`, `Observation`, `Condition`, `MedicationStatement`, `DiagnosticReport`, `DocumentReference`).
- `ABDMService` abstraction providing ABHA linking and health record exchange interfaces.
- Interactive **SIH Judge Sandbox Demo Panel** (`/fhir/demo`) displaying the live data pipeline from intake to FHIR JSON and mock ABDM HIS Gateway transmission.

---

## 🛠️ Technology Stack

| Domain | Architecture & Libraries |
| :--- | :--- |
| **Framework** | [Next.js 15.5](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling & UI** | Vanilla CSS + Tailwind CSS tokens, Radix UI primitives, [Lucide React](https://lucide.dev/) |
| **Database** | [MongoDB](https://www.mongodb.com/) with [Mongoose 8](https://mongoosejs.com/) ODM |
| **Authentication** | [NextAuth.js](https://next-auth.js.org/) (JWT & SessionCallbacks), `bcryptjs` password hashing |
| **Validation** | [Zod](https://zod.dev/) schema validation for API inputs |
| **AI Adapter** | Provider-agnostic LLM Factory (`src/lib/ai/adapter.ts`) supporting Gemini, OpenAI, Claude, Groq, Ollama |
| **OCR Pipeline** | Tesseract.js client/server OCR engine for document entity extraction |
| **Voice Engine** | Web Speech API (`SpeechRecognition` / `SpeechSynthesis`), Bhashini / AI4Bharat REST adapter, OpenAI Whisper/TTS |
| **Interoperability**| HL7 FHIR R4 standard schemas & ABDM Health Information Exchange abstractions |
| **Storage** | Cloudinary / Modular Object Storage for medical document uploads |
| **Realtime Chat** | Socket.IO / REST fallback real-time messaging with strict authorization checks |
| **Maps** | Google Maps JS/Embed API with graceful plain-text address fallback |

---

## 📁 Directory Architecture Breakdown

```
src/
├── app/                        # Next.js App Router root
│   ├── (auth)/                 # Authentication routes (login, register)
│   ├── (patient)/              # Patient portal, history, documents, consent & doctor discovery
│   ├── (doctor)/               # Doctor clinical dashboard, verification queue & case sign-off
│   ├── (triage)/               # Real-time Red-Flag Triage Control Dashboard (/triage/dashboard)
│   ├── (case-taking)/          # Interactive Form Wizard & AI Dialogue case-taking (/case-taking)
│   ├── fhir/demo/              # Official SIH Judge FHIR R4 & ABDM Interoperability Sandbox (/fhir/demo)
│   ├── api/                    # Server endpoints (auth, clinical, voice, triage, appointments, chat, reviews, fhir)
│   ├── globals.css             # Design system tokens & clinical glassmorphism
│   └── page.tsx                # Public landing page with live interactive modules
│
├── components/                 # UI Component Library
│   ├── ui/                     # Reusable primitives (Button, Card, Badge, Input, Stepper)
│   ├── layout/                 # Navbar, Footer, MobileNav drawers
│   ├── patient/                # Patient case history cards, symptom pickers
│   ├── doctor/                 # Verification queue, digital sign-off panel, DoctorAnalyticsWidget
│   ├── clinical/               # AIDialogueWidget, VoiceInputController, AudioPlayerWidget, QuestionInputs
│   ├── safety/                 # EmergencyRedFlagModal, SafetyRulesBanner, ClinicalSafetyBanner
│   ├── appointments/           # Appointment booking modal & slot selection
│   ├── chat/                   # DoctorPatientChatWidget (real-time messaging)
│   ├── maps/                   # DoctorChamberMap (Google Maps embed & address fallback)
│   ├── fhir/                   # FHIRViewer JSON bundle renderer
│   └── consent/                # Digital consent toggles & audio explanation widgets
│
├── lib/                        # Infrastructure Singletons & Adapters
│   ├── mongodb.ts              # Cached Mongoose connection singleton
│   ├── auth-guards.ts          # Authentication session & role-based access guards
│   ├── i18n/                   # Multilingual dictionaries (en, hi, bn) & language registry
│   ├── ai/                     # Agnostic LLM adapter factory (Gemini, OpenAI, Claude, Groq, Ollama)
│   ├── fhir/                   # FHIRMapper (converts internal clinical data to FHIR R4 Bundles)
│   └── storage/                # Cloudinary medical document upload service
│
├── models/                     # Mongoose Schemas & Domain Models
│   ├── User.ts                 # Accounts & Roles (PATIENT, DOCTOR, TRIAGE_STAFF, ADMIN)
│   ├── PatientProfile.ts       # Patient demographics & ABHA ID
│   ├── DoctorProfile.ts        # NMC Reg, AYUSH system, specialization, fees, chamber info
│   ├── ClinicalSession.ts      # Active intake wizard state & safety severity
│   ├── CaseRecord.ts           # Master clinical case record, AI summary, & doctor signature
│   ├── MedicalDocument.ts      # Uploaded lab reports, prescriptions, & OCR text
│   ├── Consent.ts              # Granular consent scope tracking & versioning
│   ├── TriageRecord.ts         # Real-time triage station queue records & status workflow
│   ├── Appointment.ts          # Appointments & double-booking prevention index
│   ├── ChatMessage.ts          # Doctor-patient authorized messages & attachments
│   ├── DoctorReview.ts         # Post-appointment verified patient reviews (1-5 stars)
│   └── AuditLog.ts             # Security & access audit trail
│
├── services/                   # Business Logic Services
│   ├── caseTakingService.ts    # Case drafting, intake retrieval, & status workflow
│   ├── aiService.ts            # Agnostic history collection & summary synthesis
│   ├── documentService.ts      # Report upload & OCR entity extraction
│   ├── ocrService.ts           # Tesseract OCR engine processing
│   ├── consentService.ts       # Granular consent logging & revocation
│   ├── fhirService.ts          # Generating FHIR R4 Bundles & mock ABDM push
│   ├── abdmService.ts          # ABDM / ABHA linking & health record exchange abstraction
│   ├── voice/                  # VoiceService facade (Web Speech, Bhashini, OpenAI Whisper)
│   ├── safety/                 # SafetyEngine & SAFETY_RULES_REGISTRY evaluator
│   └── auditService.ts         # Centralized security audit logging
│
└── scripts/                    # Automated Verification & Test Scripts
    ├── testSafetyEngine.ts     # Automated unit tests for red-flag safety rules (13 passed)
    └── testPhase9Features.ts   # Automated tests for double-booking, chat auth, & reviews (9 passed)
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` or `.env.local` and configure your environment:

```bash
cp .env.example .env
```

### Key Environment Variables:

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Web server port | `3000` |
| `NEXT_PUBLIC_APP_URL` | Public base URL | `http://localhost:3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/sih_patient_case_taking` |
| `NEXTAUTH_SECRET` | Secret key for JWT encryption | `super-secret-key-change-in-production` |
| `NEXTAUTH_URL` | Base URL for NextAuth callbacks | `http://localhost:3000` |
| `AI_PROVIDER` | Selected LLM backend | `gemini` (`gemini`, `openai`, `anthropic`, `groq`, `ollama`, `mock`) |
| `AI_API_KEY` | API Key for chosen AI provider | `your-ai-api-key` |
| `AI_MODEL_NAME` | Model identifier | `gemini-1.5-pro` |
| `VOICE_PROVIDER_STT` | Speech-to-Text provider | `browser` (`browser`, `bhashini`, `openai`) |
| `VOICE_PROVIDER_TTS` | Text-to-Speech provider | `browser` (`browser`, `bhashini`, `openai`) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps JS/Embed Key | `your-google-maps-key` (Optional; address fallback built-in) |

---

## 🚀 How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Automated Verification Tests
```bash
npx tsx src/scripts/testSafetyEngine.ts
npx tsx src/scripts/testPhase9Features.ts
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Linter & Production Build
```bash
npm run lint
npm run build
```

---

## 📋 Comprehensive Phase Milestones (All Completed ✅)

* [x] **Phase 0**: Project Setup & Architecture — Next.js 15, TypeScript, Mongoose, AI & FHIR schemas.
* [x] **Phase 1**: Core Clinical Case-Taking — Interactive intake wizard, vitals tracker, & MongoDB persistence.
* [x] **Phase 2**: AYUSH-Specific Clinical Case-Taking — Ayurveda (Dashavidha Pariksha, Prakriti), Siddha, Unani, Naturopathy, & Homoeopathy intake schemas.
* [x] **Phase 3**: Doctor Verification & Digital Sign-off — Verification queue, provisional diagnosis, treatment plan, & digital signature sign-off.
* [x] **Phase 4**: AI Clinical History Synthesizer — Agnostic LLM adapter formatting HPI, ROS, past history, & medication summaries.
* [x] **Phase 5**: Document Digitization & OCR — Prescriptions and lab report scanning with Tesseract OCR entity extraction.
* [x] **Phase 6**: Timeline Visualization & Doctor Summary Review — Interactive Medical Timeline View & structured clinical summary review cards.
* [x] **Phase 7**: Voice and Multilingual Clinical Case Taking — Voice input controller, live transcript preview, English/Hindi/Bengali support, & TTS audio guidance.
* [x] **Phase 8**: Safety and Red-Flag Triage Engine — Rule-based `SafetyEngine`, high-visibility patient emergency modal, & live OPD Triage Dashboard (`/triage/dashboard`).
* [x] **Phase 9**: Doctor Discovery, Appointments, Maps, Chat & Reviews — AYUSH doctor search filters, Google Maps embed + address fallback, double-booking prevention, authorized chat, & post-appointment reviews.
* [x] **Phase 10**: Healthcare Interoperability, Consent, Security & Final SIH Preparation — Granular consent manager (`/patient/consent`), FHIR R4 `FHIRMapper`, ABDM service abstraction, official SIH Judge Demo Panel (`/fhir/demo`), security audit, master documentation (`PROJECT_DOCUMENTATION.md`), & zero-error `npm run build`.

---

## 📄 License & Attribution

Architected for **Smart India Hackathon 2026 (SIH26047)**. Designed for clinical decision support and healthcare interoperability across India.
