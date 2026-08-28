import { z } from "zod";

export const ayushSystems = [
  "ALLOPATHY",
  "AYURVEDA",
  "YOGA_NATUROPATHY",
  "UNANI",
  "SIDDHA",
  "HOMEOPATHY",
] as const;

export const publicRegistrationRoles = ["PATIENT", "DOCTOR"] as const;

export const allUserRoles = [
  "PATIENT",
  "DOCTOR",
  "ADMIN",
  "TRIAGE_STAFF",
] as const;

/**
 * Login Validation Schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .transform((val) => val.trim().toLowerCase()),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Registration Validation Schema
 * Only PATIENT and DOCTOR can register publicly.
 */
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must not exceed 100 characters")
      .transform((val) => val.trim()),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
      .transform((val) => val.trim().toLowerCase()),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian phone number")
      .optional()
      .or(z.literal("")),
    role: z.enum(publicRegistrationRoles, {
      errorMap: () => ({
        message: "Public registration is only permitted for Patients and Doctors",
      }),
    }),

    // Patient-specific fields (Optional during registration, can be filled in dashboard)
    dateOfBirth: z.string().optional(),
    gender: z
      .enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"])
      .optional(),
    preferredLanguage: z.string().default("en"),
    bloodGroup: z
      .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
      .optional()
      .or(z.literal("")),
    abhaId: z.string().optional().or(z.literal("")),

    // Doctor-specific fields (Required if role === "DOCTOR")
    registrationNumber: z.string().optional(),
    ayushSystem: z.enum(ayushSystems).optional(),
    specialization: z.string().optional(),
    qualifications: z.array(z.string()).optional(),
    consultationFee: z.number().min(0).optional(),
    chamberClinicName: z.string().optional(),
    chamberCity: z.string().optional(),
    chamberState: z.string().optional(),
    chamberPincode: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "DOCTOR") {
      if (!data.registrationNumber || data.registrationNumber.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Medical / AYUSH registration number is required for doctors",
          path: ["registrationNumber"],
        });
      }
      if (!data.ayushSystem) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select your medical system (Allopathy or AYUSH)",
          path: ["ayushSystem"],
        });
      }
      if (!data.specialization || data.specialization.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Medical specialization is required for doctors",
          path: ["specialization"],
        });
      }
    }
  });

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Profile Update Schema
 */
export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().regex(/^[6-9]\d{9}$/).optional(),
  // Patient fields
  dateOfBirth: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]).optional(),
  preferredLanguage: z.string().optional(),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),
  location: z
    .object({
      address: z.string().optional(),
      city: z.string(),
      state: z.string(),
      pincode: z.string(),
    })
    .optional(),
  emergencyContact: z
    .object({
      name: z.string(),
      relationship: z.string(),
      phone: z.string(),
    })
    .optional(),

  // Doctor fields
  specialization: z.string().optional(),
  consultationFee: z.number().min(0).optional(),
  chamberInformation: z
    .object({
      clinicName: z.string(),
      addressLine1: z.string(),
      addressLine2: z.string().optional(),
      city: z.string(),
      state: z.string(),
      pincode: z.string(),
      contactNumber: z.string().optional(),
    })
    .optional(),
});
