import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-guards";
import { connectToDatabase } from "@/lib/mongodb";
import { MedicalDocument, DocumentType } from "@/models/MedicalDocument";
import { DocumentStorageService } from "@/lib/storage/documentStorageService";
import { processDocumentOCR } from "@/services/ocrService";

const ALLOWED_MIME_TYPES: Record<string, "PDF" | "JPG" | "JPEG" | "PNG"> = {
  "application/pdf": "PDF",
  "image/jpeg": "JPEG",
  "image/jpg": "JPG",
  "image/png": "PNG",
};

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const documentType = (formData.get("documentType") as DocumentType) || "PRESCRIPTION";
    const caseId = formData.get("caseId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided for upload" }, { status: 400 });
    }

    // 1. File Type Validation
    const fileFormat = ALLOWED_MIME_TYPES[file.type.toLowerCase()];
    if (!fileFormat) {
      return NextResponse.json(
        { error: "Unsupported file format. Please upload PDF, JPG, JPEG, or PNG." },
        { status: 400 }
      );
    }

    // 2. File Size Validation
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File exceeds 10MB limit. Please upload a smaller file." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // 3. Upload to Storage Provider
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await DocumentStorageService.uploadDocument(
      buffer,
      file.name,
      file.type
    );

    // 4. Create Document Metadata in MongoDB
    const doc = await MedicalDocument.create({
      patientId: user.id,
      caseId: caseId || undefined,
      fileName: file.name,
      fileUrl: uploadResult.fileUrl,
      storageProvider: uploadResult.storageProvider,
      documentType,
      fileFormat,
      fileSizeBytes: uploadResult.fileSizeBytes,
      status: "UPLOADED",
      verificationStatus: "UNVERIFIED",
    });

    // 5. Trigger OCR Processing (Background Async)
    processDocumentOCR(doc._id.toString()).catch((err) =>
      console.error("Background OCR trigger failed:", err)
    );

    return NextResponse.json({
      success: true,
      message: "Document uploaded and queued for OCR digitization.",
      document: doc,
    });
  } catch (error) {
    console.error("Document upload route error:", error);
    return NextResponse.json(
      { error: "Failed to upload document. Please try again." },
      { status: 500 }
    );
  }
}
