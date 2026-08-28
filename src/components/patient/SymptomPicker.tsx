"use client";

import React, { useState } from "react";
import { Plus, Check, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const COMMON_SYMPTOMS = [
  "Fever",
  "Cough",
  "Chest Discomfort",
  "Headache",
  "Abdominal Pain",
  "Acidity / Heartburn",
  "Joint Stiffness",
  "Fatigue",
  "Sore Throat",
  "Nausea / Vomiting",
  "Skin Rash",
  "Back Pain",
];

export function SymptomPicker() {
  const [selected, setSelected] = useState<string[]>(["Abdominal Pain", "Acidity / Heartburn"]);
  const [search, setSearch] = useState("");

  const toggleSymptom = (sym: string) => {
    if (selected.includes(sym)) {
      setSelected(selected.filter((s) => s !== sym));
    } else {
      setSelected([...selected, sym]);
    }
  };

  const filtered = COMMON_SYMPTOMS.filter((s) =>
    s.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3 p-4 rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Quick Symptom Selector
        </label>
        <span className="text-xs text-teal-600 font-medium">{selected.length} Selected</span>
      </div>

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search symptoms (e.g. fever, headache)..."
        className="h-8 text-xs"
      />

      <div className="flex flex-wrap gap-1.5 pt-1">
        {filtered.map((symptom) => {
          const isSel = selected.includes(symptom);
          return (
            <button
              key={symptom}
              type="button"
              onClick={() => toggleSymptom(symptom)}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                isSel
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-muted/70 hover:bg-muted text-foreground border border-border/60"
              }`}
            >
              {isSel ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3 text-muted-foreground" />}
              <span>{symptom}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
