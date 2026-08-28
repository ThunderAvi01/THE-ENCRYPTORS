import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind classes with clsx and twMerge for shadcn/ui components.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a Date to Indian Standard Time (IST) clinical format
 */
export function formatClinicalDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/**
 * Formats vitals with units and normal range indicators
 */
export function formatVitalsSummary(vitals: {
  systolicBp?: number;
  diastolicBp?: number;
  heartRate?: number;
  spo2?: number;
  temperature?: number;
}): string {
  const parts: string[] = [];
  if (vitals.systolicBp && vitals.diastolicBp) {
    parts.push(`BP: ${vitals.systolicBp}/${vitals.diastolicBp} mmHg`);
  }
  if (vitals.heartRate) {
    parts.push(`HR: ${vitals.heartRate} bpm`);
  }
  if (vitals.spo2) {
    parts.push(`SpO2: ${vitals.spo2}%`);
  }
  if (vitals.temperature) {
    parts.push(`Temp: ${vitals.temperature}°F`);
  }
  return parts.length > 0 ? parts.join(" | ") : "Vitals not recorded";
}
