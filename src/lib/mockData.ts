/**
 * Structured Mock & Demo Data Layer for Phase 2 Dashboards
 * All mock data is clearly labelled with [DEMO DATA] badges in the UI
 * to distinguish it from live MongoDB persistence.
 */

export interface DemoPatientCase {
  id: string;
  caseNumber: string;
  date: string;
  chiefComplaint: string;
  severity: "MILD" | "MODERATE" | "SEVERE" | "CRITICAL_EMERGENCY";
  status: "DRAFT" | "AI_INTAKE_COMPLETED" | "PENDING_DOCTOR_REVIEW" | "VERIFIED_BY_DOCTOR";
  doctorName?: string;
  documentsCount: number;
  lastUpdated: string;
  stepCompleted?: string;
  lastSaved?: string;
  progressPercent?: number;
}

export interface DemoMedicalDocument {
  id: string;
  fileName: string;
  documentType: "PRESCRIPTION" | "LAB_REPORT" | "DISCHARGE_SUMMARY" | "IMAGING";
  uploadedDate: string;
  fileSize: string;
  status: "DIGITIZED" | "PROCESSING" | "PENDING";
  extractedCount?: number;
}

export interface DemoTimelineEvent {
  id: string;
  date: string;
  type: "CONSULTATION" | "VITAL_CHECK" | "DOCUMENT_UPLOAD" | "CASE_INTAKE";
  title: string;
  description: string;
  doctorOrFacility?: string;
}

export interface DemoAppointment {
  id: string;
  doctorName: string;
  specialization: string;
  ayushSystem: string;
  scheduledAt: string;
  type: "TELEHEALTH" | "IN_PERSON";
  clinicLocation: string;
  status: "CONFIRMED" | "PENDING" | "COMPLETED";
}

export interface DemoDoctorChat {
  id: string;
  doctorName: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

export interface DemoPatientItem {
  id: string;
  name: string;
  ageGender: string;
  complaint: string;
  duration: string;
  triageSeverity: "MILD" | "MODERATE" | "SEVERE" | "CRITICAL_EMERGENCY";
  vitalsSummary: string;
  status: "PENDING_REVIEW" | "VERIFIED" | "IN_TRIAGE";
  timeAgo: string;
}

// 1. PATIENT DASHBOARD MOCK DATA
export const MOCK_PATIENT_DATA = {
  welcomeMessage: "Welcome back, Avishek! Manage your personal health history, case intakes, and medical records.",
  abhaStatus: {
    id: "91-8821-4920-11",
    linked: true,
    status: "Active & Verified",
  },
  continueCase: {
    id: "case-draft-901",
    caseNumber: "CASE-2026-089",
    date: "27 Aug 2026",
    chiefComplaint: "Epigastric pain & heartburn worsening post-dinner",
    severity: "MODERATE",
    status: "DRAFT",
    documentsCount: 1,
    lastUpdated: "Today at 10:15 AM",
    stepCompleted: "3 of 6 (AI History Dialogue)",
    lastSaved: "Today at 10:15 AM",
    progressPercent: 50,
  } as DemoPatientCase,
  previousCases: [
    {
      id: "case-881",
      caseNumber: "CASE-2026-081",
      date: "27 Aug 2026",
      chiefComplaint: "Upper abdominal burning discomfort & postprandial acidity",
      severity: "MODERATE",
      status: "VERIFIED_BY_DOCTOR",
      doctorName: "Dr. Priya Sharma, MD",
      documentsCount: 2,
      lastUpdated: "27 Aug 2026",
    },
    {
      id: "case-042",
      caseNumber: "CASE-2026-042",
      date: "14 May 2026",
      chiefComplaint: "Seasonal allergic rhinitis & persistent sneezing",
      severity: "MILD",
      status: "VERIFIED_BY_DOCTOR",
      doctorName: "Dr. Rajesh V. (BAMS)",
      documentsCount: 1,
      lastUpdated: "14 May 2026",
    },
  ] as DemoPatientCase[],
  medicalDocuments: [
    {
      id: "doc-101",
      fileName: "Past_Prescription_DrSharma.jpg",
      documentType: "PRESCRIPTION",
      uploadedDate: "27 Aug 2026",
      fileSize: "1.8 MB",
      status: "DIGITIZED",
      extractedCount: 3,
    },
    {
      id: "doc-102",
      fileName: "CBC_Lipid_Profile_Report.pdf",
      documentType: "LAB_REPORT",
      uploadedDate: "20 Aug 2026",
      fileSize: "3.2 MB",
      status: "DIGITIZED",
      extractedCount: 14,
    },
    {
      id: "doc-103",
      fileName: "Abdominal_Ultrasound_Summary.pdf",
      documentType: "IMAGING",
      uploadedDate: "10 Jan 2026",
      fileSize: "4.1 MB",
      status: "DIGITIZED",
      extractedCount: 5,
    },
  ] as DemoMedicalDocument[],
  timelineEvents: [
    {
      id: "tl-1",
      date: "27 Aug 2026",
      type: "CONSULTATION",
      title: "Doctor Verification & Prescription Sign-Off",
      description: "Dr. Priya Sharma confirmed provisional diagnosis of Non-Ulcer Dyspepsia.",
      doctorOrFacility: "Dr. Priya Sharma, MD",
    },
    {
      id: "tl-2",
      date: "27 Aug 2026",
      type: "CASE_INTAKE",
      title: "Structured Clinical Intake Completed",
      description: "Recorded vitals (BP: 120/80, HR: 74 bpm) and completed AI history intake.",
    },
    {
      id: "tl-3",
      date: "20 Aug 2026",
      type: "DOCUMENT_UPLOAD",
      title: "Lab Report Digitized",
      description: "Uploaded CBC & Lipid profile report. OCR parsed 14 blood parameters.",
    },
  ] as DemoTimelineEvent[],
  upcomingAppointments: [
    {
      id: "apt-1",
      doctorName: "Dr. Priya Sharma, MD",
      specialization: "General Medicine",
      ayushSystem: "ALLOPATHY",
      scheduledAt: "Tomorrow at 4:30 PM",
      type: "TELEHEALTH",
      clinicLocation: "Apollo Virtual OPD",
      status: "CONFIRMED",
    },
    {
      id: "apt-2",
      doctorName: "Dr. Ananya Roy, BAMS",
      specialization: "Kayachikitsa (Internal Medicine)",
      ayushSystem: "AYURVEDA",
      scheduledAt: "30 Aug 2026 at 11:00 AM",
      type: "IN_PERSON",
      clinicLocation: "Arogya Ayurvedic Chamber, New Delhi",
      status: "CONFIRMED",
    },
  ] as DemoAppointment[],
  doctorChatPreviews: [
    {
      id: "chat-1",
      doctorName: "Dr. Priya Sharma, MD",
      avatar: "PS",
      lastMessage: "Please take Pantoprazole 40mg 30 minutes before breakfast.",
      timestamp: "11:15 AM",
      unreadCount: 1,
    },
  ] as DemoDoctorChat[],
  consentStatus: {
    granted: true,
    version: "v1.0-SIH2026",
    grantedAt: "27 Aug 2026",
    scopeCount: 4,
  },
};

// 2. DOCTOR DASHBOARD MOCK DATA
export const MOCK_DOCTOR_DATA = {
  todaysPatients: [
    {
      id: "pat-1",
      name: "Avishek Modak",
      ageGender: "34M",
      complaint: "Epigastric burning pain post-meals",
      duration: "3 Days",
      triageSeverity: "MODERATE",
      vitalsSummary: "BP: 120/80 | HR: 74 bpm | SpO2: 98%",
      status: "PENDING_REVIEW",
      timeAgo: "12m ago",
    },
    {
      id: "pat-2",
      name: "Rajesh Kumar",
      ageGender: "48M",
      complaint: "Persistent dry cough & low-grade pyrexia",
      duration: "1 Week",
      triageSeverity: "MODERATE",
      vitalsSummary: "BP: 130/85 | HR: 82 bpm | Temp: 99.4°F",
      status: "PENDING_REVIEW",
      timeAgo: "35m ago",
    },
    {
      id: "pat-3",
      name: "Sunita Verma",
      ageGender: "52F",
      complaint: "Bilateral knee joint stiffness & swelling",
      duration: "2 Months",
      triageSeverity: "MILD",
      vitalsSummary: "BP: 124/78 | HR: 70 bpm",
      status: "VERIFIED",
      timeAgo: "2h ago",
    },
  ] as DemoPatientItem[],
  urgentCases: [
    {
      id: "pat-urgent-1",
      name: "Ramesh Sharma",
      ageGender: "61M",
      complaint: "Sudden onset substernal tightness with mild diaphoresis",
      duration: "45 mins",
      triageSeverity: "CRITICAL_EMERGENCY",
      vitalsSummary: "BP: 154/96 | HR: 104 bpm | SpO2: 94%",
      status: "IN_TRIAGE",
      timeAgo: "5m ago",
    },
  ] as DemoPatientItem[],
  patientStats: {
    totalConsultationsThisMonth: 142,
    verifiedRate: 98.2,
    avgReviewTimeMinutes: 4.5,
    ayushVsAllopathy: "AYURVEDA (60%) / ALLOPATHY (40%)",
  },
};

// 3. ADMIN DASHBOARD MOCK DATA
export const MOCK_ADMIN_DATA = {
  stats: {
    totalPatients: 1482,
    totalDoctors: 124,
    totalAppointments: 3890,
    activeUsersToday: 312,
    pendingDoctorVerifications: 5,
    systemUptime: "99.98%",
    totalCasesIntake: 4210,
    auditLogsRecorded: 18450,
  },
  pendingDoctorVerifications: [
    {
      id: "doc-v1",
      name: "Dr. Vikram Seth",
      email: "vikram.doc@example.com",
      registrationNumber: "NMC-2024-99120",
      ayushSystem: "AYURVEDA",
      specialization: "Panchakarma & General Medicine",
      consultationFee: 700,
      appliedAt: "Today at 9:00 AM",
    },
    {
      id: "doc-v2",
      name: "Dr. Meera Nair",
      email: "meera.doc@example.com",
      registrationNumber: "BHMS-2023-44102",
      ayushSystem: "HOMEOPATHY",
      specialization: "Pediatric Homeopathy",
      consultationFee: 500,
      appliedAt: "Yesterday",
    },
  ],
};

// 4. TRIAGE DASHBOARD MOCK DATA
export const MOCK_TRIAGE_DATA = {
  urgentPatients: [
    {
      id: "trg-1",
      name: "Ramesh Sharma",
      ageGender: "61M",
      complaint: "Sudden substernal chest tightness & breathlessness",
      vitalsSummary: "BP: 154/96 | HR: 104 bpm | SpO2: 94%",
      alertTrigger: "Substernal chest tightness keyword trigger",
      timeAgo: "5m ago",
    },
  ],
  newAlerts: [
    {
      id: "alt-1",
      type: "VITAL_ANOMALY",
      message: "Patient Ramesh S. recorded high blood pressure (154/96 mmHg).",
      timestamp: "10 mins ago",
    },
    {
      id: "alt-2",
      type: "NEW_CHECKIN",
      message: "Patient Sunita V. checked into OPD desk.",
      timestamp: "25 mins ago",
    },
  ],
  activeQueueCount: 8,
  resolvedTodayCount: 34,
};
