import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  accentColor?: "teal" | "emerald" | "amber" | "rose" | "cyan" | "indigo";
  className?: string;
}

export function StatCard({
  title,
  value,
  subtext,
  icon,
  trend,
  accentColor = "teal",
  className = "",
}: StatCardProps) {
  const iconColorMap = {
    teal: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    cyan: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    indigo: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  };

  return (
    <Card className={cn("p-4 border-border/80 transition hover:border-teal-500/40 shadow-sm", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-foreground tracking-tight">{value}</span>
            {trend && (
              <span
                className={cn(
                  "text-[11px] font-semibold px-1.5 py-0.5 rounded-md",
                  trend.isPositive
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                )}
              >
                {trend.value}
              </span>
            )}
          </div>
          {subtext && <p className="text-[11px] text-muted-foreground">{subtext}</p>}
        </div>

        <div className={cn("p-2.5 rounded-xl border shrink-0", iconColorMap[accentColor])}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
