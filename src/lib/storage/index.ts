/**
 * Storage provider abstraction layer
 * Designed to interface with Cloudinary or lightweight object storage
 * Note: S3 is deliberately omitted for this initial phase as per guidelines.
 */

export interface StorageUploadResult {
  fileUrl: string;
  publicId: string;
  bytes: number;
  format: string;
}

export class MedicalStorageService {
  public static async uploadMedicalDocument(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<StorageUploadResult> {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

    if (!cloudName) {
      // Local development mock mode
      return {
        fileUrl: `/uploads/mock_${Date.now()}_${fileName}`,
        publicId: `mock_${Date.now()}`,
        bytes: fileBuffer.length,
        format: mimeType.split("/")[1] || "pdf",
      };
    }

    // In phase 2, this calls Cloudinary API uploader
    return {
      fileUrl: `https://res.cloudinary.com/${cloudName}/image/upload/v1/${fileName}`,
      publicId: `doc_${Date.now()}`,
      bytes: fileBuffer.length,
      format: mimeType.split("/")[1] || "pdf",
    };
  }
}
