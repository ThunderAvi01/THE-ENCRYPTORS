"use client";

import React from "react";
import { User, Stethoscope, Shield } from "lucide-react";
import { UserRole } from "@/types/user";

interface RoleSelectorProps {
  selectedRole: UserRole;
  onChange: (role: UserRole) => void;
}

export function RoleSelector({ selectedRole, onChange }: RoleSelectorProps) {
  const roles: Array<{ role: UserRole; label: string; desc: string; icon: React.ReactNode }> = [
    {
      role: "PATIENT",
      label: "Patient",
      desc: "Case Intake & Records",
      icon: <User className="h-5 w-5" />,
    },
    {
      role: "DOCTOR",
      label: "Doctor / Clinician",
      desc: "Clinical Review & Verification",
      icon: <Stethoscope className="h-5 w-5" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {roles.map((r) => {
        const isSelected = selectedRole === r.role;
        return (
          <button
            key={r.role}
            type="button"
            onClick={() => onChange(r.role)}
            className={`flex flex-col items-center text-center p-3.5 rounded-xl border transition-all ${
              isSelected
                ? "border-teal-500 bg-teal-500/10 text-teal-900 dark:text-teal-100 ring-2 ring-teal-500 shadow-sm"
                : "border-border bg-card text-muted-foreground hover:border-border/80"
            }`}
          >
            <div className={`p-2 rounded-lg mb-1.5 ${isSelected ? "bg-teal-600 text-white" : "bg-muted text-foreground"}`}>
              {r.icon}
            </div>
            <span className="text-xs font-bold text-foreground">{r.label}</span>
            <span className="text-[10px] text-muted-foreground mt-0.5">{r.desc}</span>
          </button>
        );
      })}
    </div>
  );
}
