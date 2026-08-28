"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileScan,
  ChevronLeft,
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DocumentUploader } from "@/components/documents/DocumentUploader";
import { MedicalTimelineView } from "@/components/clinical/MedicalTimelineView";
import { ClinicalSafetyBanner } from "@/components/safety/ClinicalSafetyBanner";

export default function PatientDocumentsPage() {
  const [activeTab, setActiveTab] = useState<"DOCUMENTS" | "TIMELINE">("DOCUMENTS");
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      const res = await fetch("/api/documents");
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents || []);
      }
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (docId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      const res = await fetch(`/api/documents?id=${docId}`, { method: "DELETE" });
      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d._id !== docId));
      }
    } catch (err) {
      console.error("Delete document error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/patient/dashboard">
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Portal</span>
            </Button>
          </Link>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <span className="font-bold text-sm text-foreground hidden sm:inline">
            Arogya<span className="text-teal-600">Intake</span> • Medical Documents & OCR
          </span>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-0.5">
          <button
            type="button"
            onClick={() => setActiveTab("DOCUMENTS")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition flex items-center gap-1 ${
              activeTab === "DOCUMENTS"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileScan className="h-3 w-3" />
            <span>Documents & OCR</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("TIMELINE")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition flex items-center gap-1 ${
              activeTab === "TIMELINE"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="h-3 w-3" />
            <span>Medical Timeline</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto space-y-6">
        <ClinicalSafetyBanner compact />

        {activeTab === "TIMELINE" ? (
          <MedicalTimelineView />
        ) : (
          <div className="space-y-6">
            {/* Upload Widget */}
            <DocumentUploader onUploadSuccess={fetchDocuments} />

            {/* Uploaded Documents List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                  Digitized Medical Documents ({documents.length})
                </h3>
                <Badge variant="outline" className="text-[10px]">Patient Private Vault</Badge>
              </div>

              {isLoading ? (
                <div className="p-8 text-center text-xs text-muted-foreground animate-pulse">
                  Loading digitized documents...
                </div>
              ) : documents.length === 0 ? (
                <Card className="p-8 text-center text-xs text-muted-foreground space-y-2">
                  <FileText className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="font-bold text-foreground">No medical documents uploaded yet.</p>
                  <p>Upload prescriptions or lab reports above to extract structured OCR records.</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documents.map((doc) => (
                    <Card key={doc._id} className="p-4 border-border text-xs space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 flex-1 truncate">
                          <Badge variant="clinical" className="text-[9px] mb-1">
                            {doc.documentType}
                          </Badge>
                          <h4 className="font-bold text-foreground text-sm truncate">{doc.fileName}</h4>
                          <p className="text-muted-foreground text-[11px]">
                            Format: {doc.fileFormat} • {(doc.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(doc._id)}
                          className="h-7 w-7 text-muted-foreground hover:text-rose-600 shrink-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between border-t border-border/50 pt-2 text-[11px]">
                        <span className="text-muted-foreground">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </span>
                        <Badge variant={doc.status === "PROCESSED" ? "verified" : "warning"} className="text-[10px]">
                          {doc.status}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
