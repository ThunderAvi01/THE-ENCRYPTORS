import React from "react";
import { FileScan, Check, Sparkles, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function OCRPreview() {
  const extractedMedications = [
    { name: "Tab. Pantoprazole", dosage: "40 mg", freq: "1-0-0 (Before Meals)", duration: "14 Days" },
    { name: "Syp. Mucaine Gel", dosage: "10 ml", freq: "1-1-1 (After Meals)", duration: "7 Days" },
    { name: "Tab. Domperidone", dosage: "10 mg", freq: "1-0-1 (SOS)", duration: "5 Days" },
  ];

  return (
    <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileScan className="h-4 w-4 text-teal-600" />
          <h4 className="text-sm font-semibold text-foreground">
            Prescription OCR & Medical Extraction Engine
          </h4>
        </div>
        <Badge variant="clinical" className="gap-1">
          <Sparkles className="h-3 w-3" />
          OCR Engine 98.4% Accuracy
        </Badge>
      </div>

      <p className="text-xs text-muted-foreground">
        Handwritten prescription digitized into structured medication data ready for doctor verification.
      </p>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/50 text-muted-foreground border-b border-border">
            <tr>
              <th className="p-2.5 font-semibold">Extracted Medication</th>
              <th className="p-2.5 font-semibold">Dosage</th>
              <th className="p-2.5 font-semibold">Frequency</th>
              <th className="p-2.5 font-semibold">Duration</th>
              <th className="p-2.5 font-semibold text-right">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {extractedMedications.map((med, idx) => (
              <tr key={idx} className="hover:bg-muted/30">
                <td className="p-2.5 font-medium text-foreground">{med.name}</td>
                <td className="p-2.5 text-muted-foreground">{med.dosage}</td>
                <td className="p-2.5 text-muted-foreground">{med.freq}</td>
                <td className="p-2.5 text-muted-foreground">{med.duration}</td>
                <td className="p-2.5 text-right">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">High</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
