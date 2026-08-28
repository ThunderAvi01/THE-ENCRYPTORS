import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { DoctorProfile } from "@/models/DoctorProfile";
import { PatientProfile } from "@/models/PatientProfile";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Validate incoming data with Zod
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // 2. Strict Security: Block public registration as ADMIN or TRIAGE_STAFF
    if (data.role !== "PATIENT" && data.role !== "DOCTOR") {
      return NextResponse.json(
        { error: "Unauthorized role assignment. Public registration only permitted for Patients and Doctors." },
        { status: 403 }
      );
    }

    await connectToDatabase();

    // 3. Check for existing user by email
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please sign in." },
        { status: 409 }
      );
    }

    // 4. Hash password securely (12 rounds)
    const passwordHash = await bcrypt.hash(data.password, 12);

    // 5. Create core User
    const newUser = await User.create({
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role,
      phone: data.phone || undefined,
      isActive: true,
    });

    // 6. Create corresponding Role Profile
    if (data.role === "DOCTOR") {
      await DoctorProfile.create({
        userId: newUser._id,
        registrationNumber: data.registrationNumber || "PENDING_REG",
        ayushSystem: data.ayushSystem || "ALLOPATHY",
        specialization: data.specialization || "General Medicine",
        qualifications: data.qualifications || [],
        consultationFee: data.consultationFee || 500,
        chamberInformation: {
          clinicName: data.chamberClinicName || "Clinical Chamber",
          addressLine1: "",
          city: data.chamberCity || "",
          state: data.chamberState || "",
          pincode: data.chamberPincode || "",
        },
        profileStatus: "PENDING_VERIFICATION",
      });
    } else if (data.role === "PATIENT") {
      await PatientProfile.create({
        userId: newUser._id,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        preferredLanguage: data.preferredLanguage || "en",
        bloodGroup: data.bloodGroup || undefined,
        abhaId: data.abhaId || undefined,
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Account registered successfully. You can now sign in.",
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during registration. Please try again later." },
      { status: 500 }
    );
  }
}
