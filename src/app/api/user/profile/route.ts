import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { DoctorProfile } from "@/models/DoctorProfile";
import { PatientProfile } from "@/models/PatientProfile";
import { updateProfileSchema } from "@/lib/validations/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let profile = null;
    if (user.role === "DOCTOR") {
      profile = await DoctorProfile.findOne({ userId: user._id });
    } else if (user.role === "PATIENT") {
      profile = await PatientProfile.findOne({ userId: user._id });
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
      profile,
    });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const validation = updateProfileSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid profile data", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = validation.data;
    await connectToDatabase();

    // Update core User
    const userUpdate: Record<string, unknown> = {};
    if (data.name) userUpdate.name = data.name;
    if (data.phone) userUpdate.phone = data.phone;

    if (Object.keys(userUpdate).length > 0) {
      await User.findByIdAndUpdate(session.user.id, userUpdate);
    }

    // Update Role-Specific Profile
    if (session.user.role === "DOCTOR") {
      const docUpdate: Record<string, unknown> = {};
      if (data.specialization) docUpdate.specialization = data.specialization;
      if (data.consultationFee !== undefined) docUpdate.consultationFee = data.consultationFee;
      if (data.chamberInformation) docUpdate.chamberInformation = data.chamberInformation;

      if (Object.keys(docUpdate).length > 0) {
        await DoctorProfile.findOneAndUpdate({ userId: session.user.id }, docUpdate, {
          upsert: true,
          new: true,
        });
      }
    } else if (session.user.role === "PATIENT") {
      const patUpdate: Record<string, unknown> = {};
      if (data.dateOfBirth) patUpdate.dateOfBirth = data.dateOfBirth;
      if (data.gender) patUpdate.gender = data.gender;
      if (data.preferredLanguage) patUpdate.preferredLanguage = data.preferredLanguage;
      if (data.bloodGroup) patUpdate.bloodGroup = data.bloodGroup;
      if (data.location) patUpdate.location = data.location;
      if (data.emergencyContact) patUpdate.emergencyContact = data.emergencyContact;

      if (Object.keys(patUpdate).length > 0) {
        await PatientProfile.findOneAndUpdate({ userId: session.user.id }, patUpdate, {
          upsert: true,
          new: true,
        });
      }
    }

    return NextResponse.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
