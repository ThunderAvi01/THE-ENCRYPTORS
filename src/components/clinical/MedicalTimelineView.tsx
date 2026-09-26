"use client";

import React from "react";
import {
  Layers,
  Activity,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  Info,
  Droplet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export interface TimelineYearGroup {
  year: string;
  events: Array<{
    id: string;
    date: string;
    title: string;
    type: "DIAGNOSIS" | "LAB_TEST" | "PRESCRIPTION" | "CASE_INTAKE";
    facilityOrDoctor: string;
    details: string;
    labParameters?: Array<{ name: string; value: string; refRange: string; isAbnormal: boolean }>;
  }>;
}

const MOCK_TIMELINE_DATA: TimelineYearGroup[] = [
  {
    year: "2026",
    events: [
      {
        id: "evt-2026-1",
        date: "27 Aug 2026",
        title: "Doctor Case Verification & Prescription Sign-Off",
        type: "PRESCRIPTION",
        facilityOrDoctor: "Dr. Priya Sharma, MD (NMC-2024-99881)",
        details: "Confirmed Non-Ulcer Dyspepsia (K30). Prescribed Pantoprazole 40mg x 14 days.",
      },
      {
        id: "evt-2026-2",
        date: "20 Aug 2026",
        title: "Comprehensive Metabolic & Lipid Panel",
        type: "LAB_TEST",
        facilityOrDoctor: "Apollo Clinical Labs, New Delhi",
        details: "5 lab parameters recorded.",
        labParameters: [
          { name: "HbA1c Glycated Hemoglobin", value: "8.2 %", refRange: "< 5.7 %", isAbnormal: true },
          { name: "Fasting Blood Sugar", value: "142 mg/dL", refRange: "70 - 99 mg/dL", isAbnormal: true },
          { name: "Serum Triglycerides", value: "240 mg/dL", refRange: "< 150 mg/dL", isAbnormal: true },
          { name: "Hemoglobin", value: "14.5 g/dL", refRange: "13.0 - 17.0 g/dL", isAbnormal: false },
        ],
      },
    ],
  },
  {
    year: "2025",
    events: [
      {
        id: "evt-2025-1",
        date: "14 Nov 2025",
        title: "Annual Health Screening & Vitals Baseline",
        type: "DIAGNOSIS",
        facilityOrDoctor: "Arogya Wellness Clinic",
        details: "BP: 124/78 mmHg, HR: 72 bpm. Mild postprandial acidity noted.",
      },
    ],
  },
  {
    year: "2024",
    events: [
      {
        id: "evt-2024-1",
        date: "10 Mar 2024",
        title: "Appendectomy Post-Surgical Follow-up",
        type: "DIAGNOSIS",
        facilityOrDoctor: "Max Super Specialty Hospital",
        details: "Surgical recovery completed without complications.",
      },
    ],
  },
];

export function MedicalTimelineView() {
  return (
    <div className="space-y-6">
      {/* Disclaimer Banner */}
      <div className="p-3.5 rounded-xl border border-teal-500/30 bg-teal-500/10 flex items-center gap-2.5 text-xs text-foreground">
        <Info className="h-4 w-4 text-teal-600 shrink-0" />
        <span>
          Reference range flags are for informational review only. Abnormal values do not constitute an automated diagnosis.
        </span>
      </div>

      <div className="space-y-6">
        {MOCK_TIMELINE_DATA.map((group) => (
          <div key={group.year} className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="clinical" className="text-xs font-bold px-3 py-1">
                {group.year}
              </Badge>
              <div className="h-px bg-border flex-1" />
            </div>

            <div className="border-l-2 border-teal-500/40 pl-4 ml-3 space-y-4">
              {group.events.map((ev) => (
                <Card key={ev.id} className="relative border-border p-4 text-xs space-y-2">
                  <div className="absolute -left-[23px] top-4 h-3 w-3 rounded-full bg-teal-600 ring-4 ring-background" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-bold text-foreground text-sm">{ev.title}</span>
                    <span className="text-muted-foreground font-semibold text-[11px]">{ev.date}</span>
                  </div>

                  <p className="text-teal-700 dark:text-teal-300 font-medium text-[11px]">
                    {ev.facilityOrDoctor}
                  </p>

                  <p className="text-muted-foreground leading-relaxed">{ev.details}</p>

                  {/* Out of reference range lab parameters */}
                  {ev.labParameters && ev.labParameters.length > 0 && (
                    <div className="pt-2 space-y-1.5 border-t border-border/50">
                      <span className="font-bold text-foreground text-[11px] block">
                        Lab Parameters (Verified):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {ev.labParameters.map((param, idx) => (
                          <div
                            key={idx}
                            className={`p-2 rounded-lg border flex items-center justify-between text-[11px] ${
                              param.isAbnormal
                                ? "bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-200 font-semibold"
                                : "bg-muted/30 border-border text-foreground font-medium"
                            }`}
                          >
                            <span>{param.name}: <strong>{param.value}</strong></span>
                            {param.isAbnormal ? (
                              <Badge variant="emergency" className="text-[9px] gap-1 px-1.5">
                                <AlertTriangle className="h-2.5 w-2.5" />
                                <span>High (Ref: {param.refRange})</span>
                              </Badge>
                            ) : (
                              <span className="text-[10px] text-muted-foreground">Ref: {param.refRange}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
