"use client";

import React, { useState } from "react";
import {
  UploadCloud,
  FileScan,
  CheckCircle2,
  AlertCircle,
  FileText,
  Trash2,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DocumentType } from "@/models/MedicalDocument";

interface DocumentUploaderProps {
  onUploadSuccess?: () => void;
}

export function DocumentUploader({ onUploadSuccess }: DocumentUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType>("PRESCRIPTION");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMsg("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);
    setErrorMsg(null);
    setSuccessMsg(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", documentType);

    try {
      setUploadProgress(60);
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setUploadProgress(100);

      if (res.ok) {
        setSuccessMsg("Document uploaded and queued for OCR digitization!");
        setFile(null);
        if (onUploadSuccess) onUploadSuccess();
      } else {
        setErrorMsg(data.error || "Upload failed.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMsg("An unexpected error occurred during upload.");
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  return (
    <Card className="border-teal-500/30">
      <CardHeader className="pb-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <UploadCloud className="h-4 w-4 text-teal-600" />
            Upload Medical Document or Report
          </CardTitle>
          <Badge variant="clinical">PDF, JPG, PNG (Max 10MB)</Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4 text-xs">
        {/* Document Type Selector */}
        <div className="space-y-1.5">
          <label className="font-bold text-foreground block">Select Document Type:</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { type: "PRESCRIPTION", label: "Prescription" },
              { type: "LAB_REPORT", label: "Laboratory Report" },
              { type: "DISCHARGE_SUMMARY", label: "Discharge Summary" },
              { type: "DIAGNOSTIC_REPORT", label: "Diagnostic Report" },
              { type: "IMAGING", label: "Medical Imaging" },
              { type: "SCANNED_DOC", label: "Scanned Document" },
            ].map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => setDocumentType(item.type as DocumentType)}
                className={`p-2 rounded-lg border text-[11px] font-semibold text-center transition ${
                  documentType === item.type
                    ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                    : "bg-card text-foreground border-border hover:border-teal-500/50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* File Drag Drop Zone */}
        <div className="p-6 rounded-xl border border-dashed border-border bg-muted/20 text-center space-y-2 relative">
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600">
            <FileScan className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-foreground">
              {file ? file.name : "Click or drag medical document to upload"}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : "Supports PDF, JPG, JPEG, PNG"}
            </p>
          </div>
        </div>

        {/* Upload Progress Bar */}
        {uploadProgress > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-semibold">
              <span className="text-muted-foreground">Uploading Document...</span>
              <span className="text-teal-600">{uploadProgress}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-teal-600 rounded-full transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {errorMsg && (
          <p className="text-rose-600 font-semibold text-[11px]">{errorMsg}</p>
        )}

        {successMsg && (
          <p className="text-emerald-600 font-semibold text-[11px]">{successMsg}</p>
        )}

        <Button
          variant="clinical"
          size="sm"
          onClick={handleUpload}
          disabled={isUploading || !file}
          className="w-full gap-2 font-bold shadow-sm"
        >
          <UploadCloud className="h-4 w-4" />
          <span>{isUploading ? "Uploading & Processing OCR..." : "Start Document Upload & Digitization"}</span>
        </Button>
      </CardContent>
    </Card>
  );
}
