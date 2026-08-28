import { UserRole, DoctorProfileData, PatientProfileData } from "./user";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    role: UserRole;
    isActive: boolean;
    doctorProfile?: DoctorProfileData | null;
    patientProfile?: PatientProfileData | null;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: UserRole;
      isActive: boolean;
      doctorProfile?: DoctorProfileData | null;
      patientProfile?: PatientProfileData | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    isActive: boolean;
    doctorProfile?: DoctorProfileData | null;
    patientProfile?: PatientProfileData | null;
  }
}
