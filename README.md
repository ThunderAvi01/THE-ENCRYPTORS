# ArogyaIntake — Patient Case-Taking & Clinical Decision Support System
## Smart India Hackathon 2026 — Problem Statement SIH26047

**ArogyaIntake** is an enterprise-grade, AI-assisted, multilingual clinical history intake, emergency safety triage, doctor verification, and healthcare interoperability platform built for **Smart India Hackathon 2026 (SIH26047)**.

The software streamlines the patient intake lifecycle into an intelligent, audited clinical pipeline designed to reduce physician administrative burden, eliminate redundant manual history taking, accelerate OPD throughput, and uphold strict medical safety guardrails.

---

## ⚠️ Mandatory Clinical Safety Guardrail
> **IMPORTANT CLINICAL DISCLAIMER:** 
> This software is a clinical decision support system. **It does NOT perform autonomous diagnosis or autonomous prescription.**
> 
> All AI-generated history analyses and synthesized summaries represent clinical history drafts that must be independently verified, accepted, or edited by a licensed medical practitioner (NMC / AYUSH registered).

---

## 🏥 Core End-to-End Clinical Pipeline

$$\text{Patient Login} \longrightarrow \text{Language \& Granular Consent} \longrightarrow \text{AYUSH / Allopathy System Select} \longrightarrow \text{Multimodal Intake (Voice/Text/Touch)}$$
$$\downarrow$$
$$\text{Deterministic Safety Triage} \longrightarrow \text{AI Clinical History Synthesizer} \longrightarrow \text{Doctor Verification \& Digital Sign-off}$$
$$\downarrow$$
$$\text{Doctor Discovery / Appointment} \longrightarrow \text{Consultation \& Authorized Chat} \longrightarrow \text{HL7 FHIR R4 / ABDM Interoperability}$$

---

## 🌟 Key Platform Features

### 1. Multimodal & Full Multilingual Architecture
- **Complete Native Multilingual Coverage**: Complete end-to-end interface translation for **English**, **Hindi (हिंदी)**, and **Bengali (বাংলা)** across all patient-facing surfaces (Navigation, Auth, Dashboard, Multimodal Case Taking, Emergency Safety Modals, Doctor Discovery, Appointments, Chat, Consent, and Documentation).
- **First-Visit Language Selection Modal**: Clean, accessible onboarding modal that prompts first-time visitors in native scripts (`Choose Your Language / अपनी भाषा चुनें / আপনার ভাষা নির্বাচন করুন`) and remembers choices via `localStorage`.
- **Global Instant Language Switcher**: Persistent language dropdown (`GlobalLanguageDropdown`) in both Desktop Navbar and Mobile Drawer for seamless real-time switching without session loss or form resets.
- **Multimodal Inputs**: Voice recording with native Web Speech API recognition per language locale (`en-IN`, `hi-IN`, `bn-IN`), Touch tile quick-answers, and direct text input.
- **Accessibility**: Integrated Text-to-Speech (`AudioPlayerWidget`) reading questions and consent aloud in the patient's chosen language for elderly or low-literacy users.

### 2. AYUSH & Allopathy Clinical Integration
- Native intake support for **Ayurveda** (Dashavidha Pariksha, Prakriti, Agni), **Yoga & Naturopathy**, **Unani**, **Siddha**, **Homoeopathy**, and **Allopathy**.
- Doctor discovery filtering by AYUSH system, specialization, location, consultation fee, and chamber availability.

### 3. Deterministic Safety Engine & Emergency Triage
- Rule-based safety engine (`SafetyEngine`) operating completely independently of the LLM.
- Scans for critical combinations such as severe chest pain + dyspnea, stroke signs, loss of consciousness, severe bleeding, and critical vitals (SpO2 < 90%).
- Automatically triggers high-visibility **Emergency Red-Flag Patient Modals** and routes alerts to the live **OPD Triage Station** (`/triage/dashboard`) with strict patient data privacy protection.

### 4. AI Clinical History Synthesizer
- Agnostic LLM adapter layer supporting Gemini 1.5 Pro, OpenAI GPT-4o, and an offline deterministic fallback engine.
- Formats unstructured patient responses into structured HPI, Review of Systems, Past History, Medications, and Allergies.
- Strictly programmed with zero autonomous diagnostic or prescriptive capabilities.

### 5. Doctor Verification Station & Digital Sign-Off
- Licensed practitioner review queue (`/doctor/queue` and `/doctor/dashboard`).
- Doctors can edit, accept, or reject AI-generated history drafts, enter provisional diagnoses, select AYUSH/Allopathy treatments, and apply digital sign-off tokens.

### 6. Appointments & Authorized Real-Time Chat
- Appointment scheduling lifecycle (`PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`, `NO_SHOW`, `URGENT`) with automated **Double-Booking Conflict Prevention**.
- Authorized doctor-patient messaging (`DoctorPatientChatWidget`) with text, timestamps, unread counts, and read indicators.
- Verified post-appointment 1-to-5 star ratings and reviews system.

### 7. Granular Digital Consent & Privacy Manager
- Granular consent scope management (`/patient/consent`) complying with DPDP Act & ABDM standards (`clinicalCaseTaking`, `doctorVerificationSharing`, `abdmInteroperabilitySharing`, `anonymizedResearchTelemetry`).
- Low-literacy audio explanation support for each consent category.

### 8. HL7 FHIR R4 & ABDM Interoperability
- `FHIRMapper` converts internal case data into standard FHIR R4 Bundles (`Patient`, `Encounter`, `Observation`, `Condition`, `MedicationStatement`, `DocumentReference`).
- `ABDMService` abstraction providing ABHA linking and health record exchange interfaces.
- Interactive **SIH Judge Sandbox Demo Panel** (`/fhir/demo`) displaying the live data pipeline from intake to FHIR JSON and mock ABDM HIS Gateway transmission.

### 9. Interactive Product & Architecture Documentation
- Dedicated comprehensive documentation portal at `/documentation` detailing the end-to-end 10-step patient journey, clinical safety guardrails, tech stack, and role-based workflows for evaluators and SIH judges.

---

## 🛠️ Technology Stack

| Domain | Architecture & Libraries |
| :--- | :--- |
| **Framework** | [Next.js 15.5](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling & UI** | Vanilla CSS + Tailwind CSS tokens, Radix UI primitives, [Lucide React](https://lucide.dev/) |
| **Database** | [MongoDB](https://www.mongodb.com/) with [Mongoose 8](https://mongoosejs.com/) ODM |
| **Authentication** | [NextAuth.js](https://next-auth.js.org/) (JWT & SessionCallbacks), `bcryptjs` password hashing |
| **Validation** | [Zod](https://zod.dev/) schema validation for API inputs |
| **AI Adapter** | Provider-agnostic LLM Factory (`src/lib/ai/adapter.ts`) supporting Gemini, OpenAI, and deterministic offline fallback |
| **Voice Engine** | Web Speech API (`SpeechRecognition` / `SpeechSynthesis`), Bhashini / AI4Bharat REST adapter |
| **Interoperability**| HL7 FHIR R4 standard schemas & ABDM Health Information Exchange abstractions |
| **Realtime Chat** | Authorized messaging with timestamps, unread counts, and read status indicators |
| **Maps** | Google Maps JS/Embed API with graceful plain-text address fallback |

---

## 📁 Directory Architecture Breakdown

```
src/
├── app/                        # Next.js App Router root
│   ├── (auth)/                 # Authentication routes (login, register)
│   ├── (patient)/              # Patient portal, history, consent & doctor discovery
│   ├── (doctor)/               # Doctor clinical dashboard, verification queue & case sign-off
│   ├── (triage)/               # Real-time Red-Flag Triage Control Dashboard (/triage/dashboard)
│   ├── (case-taking)/          # Interactive Form Wizard & AI Dialogue case-taking (/case-taking)
│   ├── documentation/          # Interactive System & Workflow Documentation (/documentation)
│   ├── fhir/demo/              # Official SIH Judge FHIR R4 & ABDM Interoperability Sandbox (/fhir/demo)
│   ├── api/                    # Server endpoints (auth, clinical, voice, triage, appointments, chat, reviews, fhir)
│   ├── globals.css             # Design system tokens & clinical glassmorphism
│   └── page.tsx                # Clean, focused public landing page & clinical safety banner
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
│   ├── ai/                     # Agnostic LLM adapter factory (Gemini, OpenAI, Fallback)
│   └── fhir/                   # FHIRMapper (converts internal clinical data to FHIR R4 Bundles)
│
├── models/                     # Mongoose Schemas & Domain Models
│   ├── User.ts                 # Accounts & Roles (PATIENT, DOCTOR, TRIAGE_STAFF, ADMIN)
│   ├── PatientProfile.ts       # Patient demographics & ABHA ID
│   ├── DoctorProfile.ts        # NMC Reg, AYUSH system, specialization, fees, chamber info
│   ├── ClinicalSession.ts      # Active intake wizard state & safety severity
│   ├── CaseRecord.ts           # Master clinical case record, AI summary, & doctor signature
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
| `AI_PROVIDER` | Selected LLM backend | `gemini` (`gemini`, `openai`, `mock`) |
| `AI_API_KEY` | API Key for chosen AI provider | `your-ai-api-key` |
| `AI_MODEL_NAME` | Model identifier | `gemini-1.5-pro` |
| `VOICE_PROVIDER_STT` | Speech-to-Text provider | `browser` (`browser`, `bhashini`, `openai`) |
| `VOICE_PROVIDER_TTS` | Text-to-Speech provider | `browser` (`browser`, `bhashini`, `openai`) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps JS/Embed Key | `your-google-maps-key` (Optional; address fallback built-in) |

---

## 👥 Demo User Credentials (Pre-Seeded)

The system comes pre-configured with demo accounts across all supported RBAC roles. You can test each persona immediately:

| Persona / Role | Email Address | Password | Landing Dashboard | Key Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **👤 Patient** | `patient@example.com` | `Password123` | `/patient/dashboard` | Case-taking, AI symptom intake, consent manager, appointments |
| **🩺 Licensed Doctor** | `doctor@example.com` | `Password123` | `/doctor/dashboard` | Clinical verification queue, sign-off with digital token, patient chat |
| **⚡ OPD Triage Staff** | `triage@example.com` | `Password123` | `/triage/dashboard` | Red flag alerts monitor, emergency room routing, vitals review |
| **🛡️ System Administrator** | `admin@example.com` | `Password123` | `/admin/dashboard` | System audit logs, clinical guardrails review, user management |

> **Tip:** On the **Sign In** screen (`/login`), click any of the 1-click **Quick Demo Login** buttons at the bottom of the card to instantly autofill credentials for that role.

---

## 🚀 How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed Demo Accounts (Optional if DB empty)
```bash
node src/scripts/seed.js
```

### 3. Run Automated Verification Tests
```bash
npx tsx src/scripts/testSafetyEngine.ts
npx tsx src/scripts/testPhase9Features.ts
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run Linter & Production Build
```bash
npm run lint
npm run build
```

---

## 📋 Comprehensive Milestones (All Completed ✅)

* [x] **Core Architecture**: Next.js 15, TypeScript, Mongoose, AI & FHIR schemas.
* [x] **Clinical Case-Taking**: Interactive intake wizard, vitals tracker, & MongoDB persistence.
* [x] **AYUSH & Allopathy**: Ayurveda (Dashavidha Pariksha, Prakriti), Siddha, Unani, Naturopathy, & Homoeopathy intake schemas.
* [x] **Doctor Verification Station**: Verification queue, provisional diagnosis, treatment plan, & digital signature sign-off.
* [x] **AI Clinical History Synthesizer**: Agnostic LLM adapter formatting HPI, ROS, past history, & medication summaries.
* [x] **Multilingual & Multimodal Intake**: Voice input controller, live transcript preview, English/Hindi/Bengali support, & TTS audio guidance.
* [x] **Safety & Emergency Triage Engine**: Rule-based `SafetyEngine`, high-visibility patient emergency modal, & live OPD Triage Dashboard (`/triage/dashboard`).
* [x] **Doctor Discovery & Appointments**: AYUSH doctor search filters, Google Maps embed + address fallback, double-booking prevention, authorized chat, & post-appointment reviews.
* [x] **Healthcare Interoperability & Consent**: Granular consent manager (`/patient/consent`), FHIR R4 `FHIRMapper`, ABDM service abstraction, official SIH Judge Demo Panel (`/fhir/demo`), security audit, & zero-error build.
* [x] **Product & Workflow Documentation**: Dedicated SIH demonstration page (`/documentation`) explaining the complete patient journey and technical architecture.

---

## 📄 License & Attribution

Architected for **Smart India Hackathon 2026 (SIH26047)**. Designed for clinical decision support and healthcare interoperability across India.
