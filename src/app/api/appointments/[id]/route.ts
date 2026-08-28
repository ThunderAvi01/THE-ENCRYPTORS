import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-guards";
import { connectToDatabase } from "@/lib/mongodb";
import { Appointment } from "@/models/Appointment";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { id: appointmentId } = await params;
    const { status, date, timeSlot, notes } = await req.json();

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    // Access control check: user must be patient or doctor for this appointment
    const isPatient = String(appointment.patientId) === String(user.id);
    const isDoctor = String(appointment.doctorId) === String(user.id);
    if (!isPatient && !isDoctor && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied to this appointment" }, { status: 403 });
    }

    // Rescheduling conflict check if date or timeSlot changes
    if ((date && date !== appointment.date) || (timeSlot && timeSlot !== appointment.timeSlot)) {
      const targetDate = date || appointment.date;
      const targetSlot = timeSlot || appointment.timeSlot;

      const conflict = await Appointment.findOne({
        _id: { $ne: appointmentId },
        doctorId: appointment.doctorId,
        date: targetDate,
        timeSlot: targetSlot,
        status: { $in: ["PENDING", "CONFIRMED", "URGENT"] },
      });

      if (conflict) {
        return NextResponse.json(
          { error: `Slot ${targetSlot} on ${targetDate} is already booked by another patient.` },
          { status: 409 }
        );
      }

      appointment.date = targetDate;
      appointment.timeSlot = targetSlot;
    }

    if (status) {
      appointment.status = status;
    }
    if (notes !== undefined) {
      appointment.notes = notes;
    }

    await appointment.save();

    return NextResponse.json({
      success: true,
      appointment: JSON.parse(JSON.stringify(appointment)),
    });
  } catch (err: any) {
    console.error("PATCH /api/appointments/[id] error:", err);
    return NextResponse.json({ error: "Failed to update appointment." }, { status: 500 });
  }
}
