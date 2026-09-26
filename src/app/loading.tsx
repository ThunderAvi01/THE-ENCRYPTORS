import React from "react";
import { Stethoscope } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 space-y-6">
      {/* Top progress line (like YouTube) */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted/20 overflow-hidden z-50">
        <div className="h-full w-full bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-500 animate-yt-progress shadow-[0_0_8px_rgba(20,184,166,0.6)]" />
      </div>

      {/* Pulsing Brand Logo */}
      <div className="relative flex items-center justify-center">
        <div className="absolute h-20 w-20 rounded-3xl bg-teal-500/20 animate-ping" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-xl shadow-teal-500/20 animate-pulse">
          <Stethoscope className="h-8 w-8" />
        </div>
      </div>

      <div className="text-center space-y-2 max-w-sm">
        <h3 className="text-base font-bold tracking-tight text-foreground">
          Arogya<span className="text-teal-600 dark:text-teal-400">Intake</span>
        </h3>
        <p className="text-xs text-muted-foreground animate-pulse">
          Loading clinical dashboard & syncing health records...
        </p>
      </div>

      {/* Shimmer placeholders like YouTube / modern apps */}
      <div className="w-full max-w-md space-y-3 pt-4">
        <div className="h-4 w-3/4 mx-auto rounded-full bg-muted/60 animate-pulse" />
        <div className="h-3 w-1/2 mx-auto rounded-full bg-muted/40 animate-pulse" />
      </div>
    </div>
  );
}
