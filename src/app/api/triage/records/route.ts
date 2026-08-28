import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-guards";
import { connectToDatabase } from "@/lib/mongodb";
import { TriageRecord } from "@/models/TriageRecord";
import { AuditService } from "@/services/auditService";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");

    const query: Record<string, unknown> = {};
    if (statusFilter && statusFilter !== "ALL") {
      query.status = statusFilter;
    }

    const records = await TriageRecord.find(query)
      .sort({ severity: -1, createdAt: -1 }) // URGENT first
      .limit(100);

    return NextResponse.json({
      success: true,
      records: JSON.parse(JSON.stringify(records)),
    });
  } catch (err: any) {
    console.error("GET /api/triage/records error:", err);
    return NextResponse.json({ error: "Failed to fetch triage records." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { triageRecordId, status, staffNotes } = await req.json();

    if (!triageRecordId || !status) {
      return NextResponse.json({ error: "Missing required triageRecordId or status" }, { status: 400 });
    }

    const record = await TriageRecord.findById(triageRecordId);
    if (!record) {
      return NextResponse.json({ error: "Triage record not found" }, { status: 404 });
    }

    const oldStatus = record.status;
    record.status = status;
    if (staffNotes !== undefined) {
      record.staffNotes = staffNotes;
    }

    if (status === "ACKNOWLEDGED" && !record.acknowledgedAt) {
      record.acknowledgedAt = new Date();
      record.acknowledgedBy = user.id as any;
    } else if (status === "RESOLVED") {
      record.resolvedAt = new Date();
    }

    await record.save();

    // Log Audit Event
    await AuditService.log({
      actorUserId: user.id,
      actorRole: user.role || "TRIAGE_STAFF",
      action: `TRIAGE_STATUS_CHANGED_${oldStatus}_TO_${status}`,
      resourceType: "TRIAGE",
      resourceId: triageRecordId,
      details: {
        oldStatus,
        newStatus: status,
        alertReason: record.alertReason,
        severity: record.severity,
        staffNotes,
      },
    });

    return NextResponse.json({
      success: true,
      record: JSON.parse(JSON.stringify(record)),
    });
  } catch (err: any) {
    console.error("PATCH /api/triage/records error:", err);
    return NextResponse.json({ error: "Failed to update triage record." }, { status: 500 });
  }
}
