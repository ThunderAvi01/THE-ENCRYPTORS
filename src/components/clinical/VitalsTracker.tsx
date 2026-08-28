import React from "react";
import { Activity, Heart, Thermometer, Wind, Weight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { VitalsData } from "@/types/clinical";

interface VitalsTrackerProps {
  vitals?: Partial<VitalsData>;
  editable?: boolean;
}

export function VitalsTracker({ vitals }: VitalsTrackerProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-4 w-4 text-teal-600" />
            Patient Clinical Vitals
          </CardTitle>
          <span className="text-xs text-muted-foreground">Standard Triage Metrics</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* BP */}
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-border/50">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <Activity className="h-3.5 w-3.5 text-rose-500" />
              <span>Blood Pressure</span>
            </div>
            <div className="text-lg font-bold text-foreground">
              {vitals?.systolicBp && vitals?.diastolicBp
                ? `${vitals.systolicBp}/${vitals.diastolicBp}`
                : "120/80"}
              <span className="text-xs font-normal text-muted-foreground ml-1">mmHg</span>
            </div>
          </div>

          {/* HR */}
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-border/50">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <Heart className="h-3.5 w-3.5 text-rose-600" />
              <span>Heart Rate</span>
            </div>
            <div className="text-lg font-bold text-foreground">
              {vitals?.heartRate || "74"}
              <span className="text-xs font-normal text-muted-foreground ml-1">bpm</span>
            </div>
          </div>

          {/* SpO2 */}
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-border/50">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <Wind className="h-3.5 w-3.5 text-cyan-600" />
              <span>SpO2</span>
            </div>
            <div className="text-lg font-bold text-foreground">
              {vitals?.spo2 || "98"}
              <span className="text-xs font-normal text-muted-foreground ml-1">%</span>
            </div>
          </div>

          {/* Temperature */}
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-border/50">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <Thermometer className="h-3.5 w-3.5 text-amber-500" />
              <span>Body Temp</span>
            </div>
            <div className="text-lg font-bold text-foreground">
              {vitals?.temperature || "98.6"}
              <span className="text-xs font-normal text-muted-foreground ml-1">°F</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
