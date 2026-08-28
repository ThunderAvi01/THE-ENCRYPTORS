import React from "react";
import { Share2, FileCode, CheckCircle, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function FHIRViewer() {
  const fhirSample = {
    resourceType: "Bundle",
    id: "bundle-case-sih26047-demo",
    type: "document",
    timestamp: new Date().toISOString(),
    entry: [
      {
        resourceType: "Patient",
        id: "pat-99128",
        identifier: [{ system: "https://healthid.abdm.gov.in", value: "91-8821-4920-11" }],
        gender: "male",
      },
      {
        resourceType: "Observation",
        id: "obs-vitals-bp",
        code: { coding: [{ system: "http://loinc.org", code: "85354-9", display: "Blood pressure" }] },
      },
    ],
  };

  return (
    <div className="rounded-xl border border-border/80 bg-slate-950 text-slate-100 p-4 font-mono text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <FileCode className="h-4 w-4 text-cyan-400" />
          <span className="font-sans font-semibold text-white">HL7 FHIR R4 Bundle Payload</span>
        </div>
        <Badge variant="clinical" className="font-sans text-[10px]">ABDM Compliant</Badge>
      </div>

      <pre className="overflow-x-auto text-[11px] text-teal-300/90 leading-relaxed max-h-44 p-2 bg-slate-900 rounded-lg">
        {JSON.stringify(fhirSample, null, 2)}
      </pre>

      <div className="flex items-center justify-between font-sans pt-1">
        <span className="text-[11px] text-slate-400">Exportable to Ayushman Bharat Digital Health Lockers.</span>
        <Button variant="outline" size="sm" className="h-7 text-xs border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800">
          <Copy className="h-3 w-3 mr-1" />
          Copy JSON
        </Button>
      </div>
    </div>
  );
}
