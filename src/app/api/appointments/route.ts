import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-guards";
import { connectToDatabase } from "@/lib/mongodb";
import { Appointment } from "@/models/Appointment";
import { DoctorProfile } from "@/models/DoctorProfile";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") || user.role;

    const query: Record<string, unknown> = {};
    if (role === "DOCTOR") {
      query.doctorId = user.id;
    } else {
      query.patientId = user.id;
    }

    const appointments = await Appointment.find(query)
      .populate("patientId", "fullName email phone")
      .populate("doctorId", "fullName email phone")
      .sort({ date: 1, timeSlot: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      appointments: JSON.parse(JSON.stringify(appointments)),
    });
  } catch (err: any) {
    console.error("GET /api/appointments error:", err);
    return NextResponse.json({ error: "Failed to fetch appointments." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { doctorId, date, timeSlot, consultationType, notes, caseRecordId } = await req.json();

    if (!doctorId || !date || !timeSlot) {
      return NextResponse.json(
        { error: "Missing required fields: doctorId, date, timeSlot" },
        { status: 400 }
      );
    }

    // DOUBLE BOOKING PREVENTION: Check if active booking exists for doctor at same date & timeSlot
    const existingConflict = await Appointment.findOne({
      doctorId,
      date,
      timeSlot,
      status: { $in: ["PENDING", "CONFIRMED", "URGENT"] },
    });

    if (existingConflict) {
      return NextResponse.json(
        {
          error: `Time slot ${timeSlot} on ${date} is already booked. Please select another available slot.`,
          conflict: true,
        },
        { status: 409 }
      );
    }

    // Fetch doctor profile consultation fee
    const doctorProfile = await DoctorProfile.findOne({ userId: doctorId });
    const fee = doctorProfile?.consultationFee || 500;

    const appointment = await Appointment.create({
      patientId: user.id,
      doctorId,
      caseRecordId: caseRecordId || undefined,
      date,
      timeSlot,
      consultationFee: fee,
      consultationType: consultationType || "IN_PERSON",
      status: "PENDING",
      notes: notes || "",
    });

    return NextResponse.json({
      success: true,
      appointment: JSON.parse(JSON.stringify(appointment)),
    });
  } catch (err: any) {
    console.error("POST /api/appointments error:", err);
    return NextResponse.json({ error: "Failed to book appointment." }, { status: 500 });
  }
}
