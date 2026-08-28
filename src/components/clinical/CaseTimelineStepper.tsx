import React from "react";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepItem {
  id: string;
  title: string;
  description: string;
  status: "completed" | "current" | "upcoming";
}

interface StepperProps {
  steps: StepItem[];
  className?: string;
}

export function CaseTimelineStepper({ steps, className = "" }: StepperProps) {
  return (
    <div className={cn("w-full py-4", className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {steps.map((step, idx) => {
          const isCompleted = step.status === "completed";
          const isCurrent = step.status === "current";

          return (
            <div
              key={step.id}
              className={cn(
                "relative flex flex-col p-3.5 rounded-xl border transition-all duration-200",
                isCurrent && "border-teal-500 bg-teal-500/5 shadow-sm shadow-teal-500/10 ring-1 ring-teal-500",
                isCompleted && "border-emerald-500/40 bg-emerald-500/5",
                step.status === "upcoming" && "border-border bg-card/50 opacity-70"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Step 0{idx + 1}
                </span>
                {isCompleted && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                {isCurrent && <Clock className="h-4 w-4 text-teal-600 animate-spin" style={{ animationDuration: "3s" }} />}
                {step.status === "upcoming" && <Circle className="h-4 w-4 text-muted-foreground/50" />}
              </div>
              <h4 className="text-sm font-semibold text-foreground mb-1 leading-snug">
                {step.title}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
