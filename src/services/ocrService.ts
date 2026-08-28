import { connectToDatabase } from "@/lib/mongodb";
import { MedicalDocument, DocumentType, StructuredOCRData, LabTestParameter } from "@/models/MedicalDocument";

export async function processDocumentOCR(documentId: string): Promise<void> {
  await connectToDatabase();

  const doc = await MedicalDocument.findById(documentId);
  if (!doc) {
    throw new Error("Medical document not found.");
  }

  doc.status = "PROCESSING";
  await doc.save();

  try {
    const { rawText, structuredData } = generateMockOCRResults(doc.documentType, doc.fileName);

    doc.rawExtractedText = rawText;
    doc.structuredExtractedData = structuredData;
    doc.status = "PROCESSED";
    await doc.save();
  } catch (err) {
    console.error("OCR processing error:", err);
    doc.status = "FAILED";
    await doc.save();
  }
}

function generateMockOCRResults(
  documentType: DocumentType,
  fileName: string
): { rawText: string; structuredData: StructuredOCRData } {
  switch (documentType) {
    case "LAB_REPORT":
      return {
        rawText: `APOLLO CLINICAL LABS - COMPREHENSIVE METABOLIC & LIPID PANEL
Patient: Avishek Modak | Age: 34M | Date: 20 Aug 2026
TEST NAME              RESULT       UNIT       REFERENCE RANGE
HbA1c Glycated Hemoglobin 8.2         %          < 5.7 (Normal), 5.7-6.4 (Prediabetes)
Fasting Blood Sugar     142          mg/dL      70 - 99 (Normal)
Serum Triglycerides     240          mg/dL      < 150 (Normal)
Serum Cholesterol       210          mg/dL      < 200 (Normal)
HDL Cholesterol         38           mg/dL      > 40 (Normal)
Hemoglobin              14.5         g/dL       13.0 - 17.0`,
        structuredData: {
          doctorOrHospital: "Apollo Clinical Labs, New Delhi",
          reportDate: "20 Aug 2026",
          labTests: [
            {
              testName: "HbA1c Glycated Hemoglobin",
              value: "8.2",
              unit: "%",
              referenceRange: "< 5.7 %",
              isAbnormal: true,
            },
            {
              testName: "Fasting Blood Sugar",
              value: "142",
              unit: "mg/dL",
              referenceRange: "70 - 99 mg/dL",
              isAbnormal: true,
            },
            {
              testName: "Serum Triglycerides",
              value: "240",
              unit: "mg/dL",
              referenceRange: "< 150 mg/dL",
              isAbnormal: true,
            },
            {
              testName: "Serum Cholesterol",
              value: "210",
              unit: "mg/dL",
              referenceRange: "< 200 mg/dL",
              isAbnormal: true,
            },
            {
              testName: "Hemoglobin",
              value: "14.5",
              unit: "g/dL",
              referenceRange: "13.0 - 17.0 g/dL",
              isAbnormal: false,
            },
          ],
          importantFindings: [
            "Elevated HbA1c (8.2%) indicates poorly controlled glycemic index.",
            "Elevated Serum Triglycerides (240 mg/dL).",
          ],
        },
      };

    case "PRESCRIPTION":
      return {
        rawText: `DR. PRIYA SHARMA, MD (INTERNAL MEDICINE)
Reg No: NMC-2024-99881 | Apollo Multispecialty OPD
Rx for Avishek Modak (34M) | Date: 27 Aug 2026
1. Tab Pantoprazole 40mg - 1 tablet before breakfast x 14 days
2. Syrup Sucralfate 10ml - thrice daily post meals x 7 days
3. Cap B-Complex - 1 daily after lunch x 30 days`,
        structuredData: {
          doctorOrHospital: "Dr. Priya Sharma, MD (NMC-2024-99881)",
          reportDate: "27 Aug 2026",
          medications: [
            { name: "Pantoprazole 40mg", dosage: "40mg", frequency: "1-0-0 Before Breakfast x 14 days" },
            { name: "Syrup Sucralfate", dosage: "10ml", frequency: "1-1-1 After Meals x 7 days" },
            { name: "Cap B-Complex", dosage: "1 cap", frequency: "0-1-0 After Lunch x 30 days" },
          ],
          diagnosis: ["Non-Ulcer Dyspepsia (K30)", "Hyperacidity"],
        },
      };

    default:
      return {
        rawText: `MEDICAL DOCUMENT - ${fileName}
Digitized text extracted via ArogyaIntake OCR engine.
Date: ${new Date().toLocaleDateString()}`,
        structuredData: {
          reportDate: new Date().toLocaleDateString(),
          importantFindings: ["Document successfully digitized for clinical history timeline."],
        },
      };
  }
}
