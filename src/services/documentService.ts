import { MedicalDocument } from "@/models/MedicalDocument";
import { connectToDatabase } from "@/lib/mongodb";
import { MedicalStorageService } from "@/lib/storage";

export class DocumentService {
  public static async uploadAndQueueOCR(
    patientId: string,
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    documentType: "PRESCRIPTION" | "LAB_REPORT" | "DISCHARGE_SUMMARY" | "IMAGING" | "OTHER"
  ) {
    await connectToDatabase();
    const uploaded = await MedicalStorageService.uploadMedicalDocument(fileBuffer, fileName, mimeType);

    const doc = await MedicalDocument.create({
      patientId,
      originalFileName: fileName,
      fileUrl: uploaded.fileUrl,
      storageProvider: "CLOUDINARY",
      documentType,
      fileSizeBytes: uploaded.bytes,
      mimeType,
      ocrProcessingStatus: "PENDING",
    });

    return JSON.parse(JSON.stringify(doc));
  }

  public static async getDocumentsByPatient(patientId: string) {
    await connectToDatabase();
    const docs = await MedicalDocument.find({ patientId }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(docs));
  }
}
