import mongoose, { Schema, Document, Model } from "mongoose";

export type DocumentType =
  | "PRESCRIPTION"
  | "LAB_REPORT"
  | "DISCHARGE_SUMMARY"
  | "DIAGNOSTIC_REPORT"
  | "IMAGING"
  | "SCANNED_DOC";

export type ProcessingStatus =
  | "UPLOADED"
  | "PROCESSING"
  | "PROCESSED"
  | "FAILED"
  | "REVIEW_REQUIRED";

export interface LabTestParameter {
  testName: string;
  value: string;
  unit?: string;
  referenceRange?: string;
  isAbnormal: boolean;
}

export interface StructuredOCRData {
  diagnosis?: string[];
  medications?: Array<{ name: string; dosage?: string; frequency?: string }>;
  labTests?: LabTestParameter[];
  procedures?: string[];
  reportDate?: string;
  doctorOrHospital?: string;
  importantFindings?: string[];
}

export interface IMedicalDocument extends Document {
  patientId: mongoose.Types.ObjectId;
  caseId?: mongoose.Types.ObjectId;
  fileName: string;
  fileUrl: string;
  storageProvider: "cloudinary" | "mock";
  documentType: DocumentType;
  fileFormat: "PDF" | "JPG" | "JPEG" | "PNG";
  fileSizeBytes: number;
  status: ProcessingStatus;
  rawExtractedText?: string;
  structuredExtractedData?: StructuredOCRData;
  verificationStatus: "UNVERIFIED" | "VERIFIED";
  createdAt: Date;
  updatedAt: Date;
}

const MedicalDocumentSchema = new Schema<IMedicalDocument>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    caseId: {
      type: Schema.Types.ObjectId,
      ref: "CaseRecord",
    },
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    storageProvider: {
      type: String,
      enum: ["cloudinary", "mock"],
      default: "mock",
    },
    documentType: {
      type: String,
      enum: [
        "PRESCRIPTION",
        "LAB_REPORT",
        "DISCHARGE_SUMMARY",
        "DIAGNOSTIC_REPORT",
        "IMAGING",
        "SCANNED_DOC",
      ],
      default: "PRESCRIPTION",
    },
    fileFormat: {
      type: String,
      enum: ["PDF", "JPG", "JPEG", "PNG"],
      default: "PDF",
    },
    fileSizeBytes: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["UPLOADED", "PROCESSING", "PROCESSED", "FAILED", "REVIEW_REQUIRED"],
      default: "UPLOADED",
      index: true,
    },
    rawExtractedText: {
      type: String,
      default: "",
    },
    structuredExtractedData: {
      type: Schema.Types.Mixed,
    },
    verificationStatus: {
      type: String,
      enum: ["UNVERIFIED", "VERIFIED"],
      default: "UNVERIFIED",
    },
  },
  {
    timestamps: true,
  }
);

export const MedicalDocument: Model<IMedicalDocument> =
  mongoose.models.MedicalDocument ||
  mongoose.model<IMedicalDocument>("MedicalDocument", MedicalDocumentSchema);
