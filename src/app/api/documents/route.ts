import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-guards";
import { connectToDatabase } from "@/lib/mongodb";
import { MedicalDocument } from "@/models/MedicalDocument";
import { DocumentStorageService } from "@/lib/storage/documentStorageService";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const targetPatientId = searchParams.get("patientId");
    const caseId = searchParams.get("caseId");

    await connectToDatabase();

    let query: Record<string, unknown> = {};

    if (user.role === "PATIENT") {
      // Patient ownership check: can only query own documents
      query.patientId = user.id;
    } else if (user.role === "DOCTOR" || user.role === "ADMIN" || user.role === "TRIAGE_STAFF") {
      // Doctor / Staff authorization
      if (targetPatientId) query.patientId = targetPatientId;
      if (caseId) query.caseId = caseId;
    }

    const documents = await MedicalDocument.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ documents });
  } catch (error) {
    console.error("Documents GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get("id");

    if (!documentId) {
      return NextResponse.json({ error: "Document id is required" }, { status: 400 });
    }

    await connectToDatabase();

    const doc = await MedicalDocument.findOne({ _id: documentId, patientId: user.id });
    if (!doc) {
      return NextResponse.json({ error: "Document not found or forbidden" }, { status: 404 });
    }

    await DocumentStorageService.deleteDocument(doc.fileUrl);
    await MedicalDocument.deleteOne({ _id: documentId });

    return NextResponse.json({ success: true, message: "Document deleted successfully" });
  } catch (error) {
    console.error("Document DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
  }
}
