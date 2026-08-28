export type UserRole = "PATIENT" | "DOCTOR" | "ADMIN" | "TRIAGE_STAFF";

export type AyushSystem =
  | "ALLOPATHY"
  | "AYURVEDA"
  | "YOGA_NATUROPATHY"
  | "UNANI"
  | "SIDDHA"
  | "HOMEOPATHY";

export type DoctorProfileStatus =
  | "PENDING_VERIFICATION"
  | "VERIFIED"
  | "REJECTED"
  | "SUSPENDED";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  isActive: boolean;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChamberInformation {
  clinicName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  contactNumber?: string;
}

export interface DayAvailability {
  day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
  isAvailable: boolean;
  timeSlots: Array<{
    start: string; // e.g. "09:00"
    end: string;   // e.g. "13:00"
  }>;
}

export interface DoctorProfileData {
  id?: string;
  userId: string;
  registrationNumber: string; // NMC or State AYUSH Council registration
  ayushSystem: AyushSystem;
  specialization: string;
  qualifications: string[];
  consultationFee: number;
  chamberInformation: ChamberInformation;
  availability: DayAvailability[];
  profileStatus: DoctorProfileStatus;
  verificationNotes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface PatientLocation {
  address?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface PatientProfileData {
  id?: string;
  userId: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
  preferredLanguage: string;
  location?: PatientLocation;
  emergencyContact?: EmergencyContact;
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  abhaId?: string; // Ayushman Bharat Health Account ID (ABDM)
  createdAt?: Date;
  updatedAt?: Date;
}

export type PatientProfile = UserProfile & PatientProfileData;
export type DoctorProfile = UserProfile & DoctorProfileData;

export interface SafeUserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  doctorProfile?: DoctorProfileData | null;
  patientProfile?: PatientProfileData | null;
}
