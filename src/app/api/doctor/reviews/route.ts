import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-guards";
import { connectToDatabase } from "@/lib/mongodb";
import { DoctorReview } from "@/models/DoctorReview";
import { Appointment } from "@/models/Appointment";

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId");

    if (!doctorId) {
      return NextResponse.json({ error: "Missing doctorId parameter" }, { status: 400 });
    }

    const reviews = await DoctorReview.find({ doctorId })
      .populate("patientId", "fullName profileImage")
      .sort({ createdAt: -1 })
      .lean();

    const total = reviews.length;
    const avgRating = total > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / total : 5.0;

    return NextResponse.json({
      success: true,
      count: total,
      averageRating: Math.round(avgRating * 10) / 10,
      reviews: JSON.parse(JSON.stringify(reviews)),
    });
  } catch (err: any) {
    console.error("GET /api/doctor/reviews error:", err);
    return NextResponse.json({ error: "Failed to fetch reviews." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { appointmentId, rating, reviewText } = await req.json();

    if (!appointmentId || !rating || !reviewText) {
      return NextResponse.json(
        { error: "Missing required fields: appointmentId, rating, reviewText" },
        { status: 400 }
      );
    }

    // 1. Verify appointment exists & belongs to this patient
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return NextResponse.json({ error: "Appointment record not found" }, { status: 404 });
    }

    if (String(appointment.patientId) !== String(user.id)) {
      return NextResponse.json({ error: "You can only review your own appointments" }, { status: 403 });
    }

    // 2. PREVENT REVIEWS BEFORE APPOINTMENT COMPLETION
    if (appointment.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Reviews are only permitted after appointment completion." },
        { status: 400 }
      );
    }

    // 3. PREVENT DUPLICATE REVIEWS FOR SAME APPOINTMENT
    const existingReview = await DoctorReview.findOne({ appointmentId });
    if (existingReview) {
      return NextResponse.json(
        { error: "You have already submitted a review for this completed appointment." },
        { status: 409 }
      );
    }

    const review = await DoctorReview.create({
      appointmentId,
      patientId: user.id,
      doctorId: appointment.doctorId,
      rating: Number(rating),
      reviewText: reviewText.trim(),
    });

    return NextResponse.json({
      success: true,
      review: JSON.parse(JSON.stringify(review)),
    });
  } catch (err: any) {
    console.error("POST /api/doctor/reviews error:", err);
    return NextResponse.json({ error: "Failed to submit review." }, { status: 500 });
  }
}
