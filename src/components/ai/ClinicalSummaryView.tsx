import React from "react";
import { Sparkles, AlertTriangle, HelpCircle, FileText, CheckCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClinicalSafetyBanner } from "@/components/safety/ClinicalSafetyBanner";

export function ClinicalSummaryView() {
  return (
    <Card className="border-border/80">
      <CardHeader className="pb-3 border-b border-border/50">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-teal-600" />
            <div>
              <CardTitle className="text-base font-bold">
                Synthesized Clinical Intake Summary
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Draft generated for licensed practitioner verification
              </p>
            </div>
          </div>
          <Badge variant="clinical">Confidence: 96%</Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Section 1: HPI */}
        <div className="space-y-1.5">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-teal-600" />
            History of Present Illness (HPI)
          </h5>
          <p className="text-xs sm:text-sm text-foreground leading-relaxed bg-muted/40 p-3 rounded-lg border border-border/50">
            A 34-year-old patient presents with a 3-day history of postprandial epigastric pain radiating towards the mid-back. Symptoms worsen approximately 45 minutes after meals, with mild intermittent acidity and nausea. No reported hematemesis, melena, or high-grade fever.
          </p>
        </div>

        {/* Section 2: Red Flag Scan */}
        <div className="space-y-1.5">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            Red Flag Safety Assessment
          </h5>
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300">
            <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>Zero critical emergency triggers detected. Safe for standard clinical consultation.</span>
          </div>
        </div>

        {/* Section 3: Suggested Clinical Clarifications */}
        <div className="space-y-1.5">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5 text-cyan-600" />
            Suggested Clarifications for Physician
          </h5>
          <ul className="text-xs space-y-1 text-muted-foreground list-disc pl-4">
            <li>Verify history of NSAID usage or heavy caffeine intake.</li>
            <li>Perform Murphy sign check if pain shifts to right upper quadrant.</li>
            <li>Evaluate past H. pylori eradication therapy.</li>
          </ul>
        </div>

        {/* Safety Disclaimer */}
        <ClinicalSafetyBanner compact />
      </CardContent>
    </Card>
  );
}
