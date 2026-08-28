import React from "react";
import { cn } from "@/lib/utils";

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 space-y-3 animate-pulse",
        className
      )}
    >
      <div className="h-4 bg-muted rounded w-1/3" />
      <div className="h-8 bg-muted rounded w-1/2" />
      <div className="h-3 bg-muted rounded w-2/3" />
    </div>
  );
}

export function SkeletonTableRows({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card animate-pulse">
          <div className="space-y-1 flex-1">
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
          <div className="h-6 w-16 bg-muted rounded-full" />
        </div>
      ))}
    </div>
  );
}
