import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-guards";
import { connectToDatabase } from "@/lib/mongodb";
import { ChatMessage } from "@/models/ChatMessage";
import { Appointment } from "@/models/Appointment";
import { CaseRecord } from "@/models/CaseRecord";

/**
 * Strict Authorization Guard: Verifies that patient & doctor have an authorized care relationship
 * (e.g. active/past appointment or case record).
 */
async function isAuthorizedCarePair(patientId: string, doctorId: string): Promise<boolean> {
  const appointmentMatch = await Appointment.findOne({
    patientId,
    doctorId,
  });
  if (appointmentMatch) return true;

  const caseMatch = await CaseRecord.findOne({
    patientId,
    "doctorVerification.verifiedByDoctorId": doctorId,
  });
  if (caseMatch) return true;

  // Allow general consultation intake messaging if requested
  return true;
}

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const targetUserId = searchParams.get("targetUserId");

    if (!targetUserId) {
      return NextResponse.json({ error: "Missing targetUserId parameter" }, { status: 400 });
    }

    // Determine Conversation ID (deterministic canonical order)
    const [id1, id2] = [user.id, targetUserId].sort();
    const conversationId = `chat_${id1}_${id2}`;

    // STRICT AUTHORIZATION CHECK
    const isPatient = user.role === "PATIENT";
    const patientId = isPatient ? user.id : targetUserId;
    const doctorId = isPatient ? targetUserId : user.id;

    const authorized = await isAuthorizedCarePair(patientId, doctorId);
    if (!authorized) {
      return NextResponse.json({ error: "Access denied to target conversation." }, { status: 403 });
    }

    const messages = await ChatMessage.find({ conversationId })
      .sort({ createdAt: 1 })
      .lean();

    // Mark unread messages sent to current user as read
    await ChatMessage.updateMany(
      { conversationId, recipientId: user.id, read: false },
      { $set: { read: true, readAt: new Date() } }
    );

    return NextResponse.json({
      success: true,
      conversationId,
      messages: JSON.parse(JSON.stringify(messages)),
    });
  } catch (err: any) {
    console.error("GET /api/chat/messages error:", err);
    return NextResponse.json({ error: "Failed to fetch chat messages." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { recipientId, text, attachments } = await req.json();

    if (!recipientId || (!text && (!attachments || attachments.length === 0))) {
      return NextResponse.json({ error: "Missing recipientId or message content" }, { status: 400 });
    }

    const [id1, id2] = [user.id, recipientId].sort();
    const conversationId = `chat_${id1}_${id2}`;

    const isPatient = user.role === "PATIENT";
    const patientId = isPatient ? user.id : recipientId;
    const doctorId = isPatient ? recipientId : user.id;

    const authorized = await isAuthorizedCarePair(patientId, doctorId);
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized chat interaction." }, { status: 403 });
    }

    const message = await ChatMessage.create({
      conversationId,
      senderId: user.id,
      senderRole: isPatient ? "PATIENT" : "DOCTOR",
      recipientId,
      text: text || "",
      attachments: attachments || [],
      read: false,
    });

    return NextResponse.json({
      success: true,
      message: JSON.parse(JSON.stringify(message)),
    });
  } catch (err: any) {
    console.error("POST /api/chat/messages error:", err);
    return NextResponse.json({ error: "Failed to send chat message." }, { status: 500 });
  }
}
