"use client";

import React, { useState } from "react";
import { ShieldCheck, CheckSquare, Square, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "@/utils/constants";

export function ConsentAgreementModal() {
  const [agreed, setAgreed] = useState(true);
  const [signature, setSignature] = useState("Avishek Modak");

  return (
    <div className="rounded-xl border border-teal-500/30 bg-gradient-to-b from-teal-500/5 to-card p-5 space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 text-white">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-foreground">
            Digital Clinical Informed Consent Form ({APP_CONFIG.consentVersion})
          </h4>
          <p className="text-xs text-muted-foreground">
            In compliance with Digital Personal Data Protection (DPDP) Act & ABDM Guidelines
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground space-y-2 max-h-36 overflow-y-auto">
        <p>
          1. <strong>Purpose:</strong> I hereby give informed consent for structured clinical case taking and AI-assisted history collection to assist my consulting physician.
        </p>
        <p>
          2. <strong>Non-Autonomous Diagnosis:</strong> I understand that this software does not provide medical diagnosis or self-prescription. All summaries are strictly verified by a licensed doctor.
        </p>
        <p>
          3. <strong>Revocation:</strong> I retain the right to revoke access to my clinical intake records at any time.
        </p>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setAgreed(!agreed)}
          className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer"
        >
          {agreed ? (
            <CheckSquare className="h-4 w-4 text-teal-600" />
          ) : (
            <Square className="h-4 w-4 text-muted-foreground" />
          )}
          <span>I have read and voluntarily agree to the clinical consent terms.</span>
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <input
            type="text"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            placeholder="Type full legal name as digital signature"
            className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground font-serif italic"
          />
          <Button variant="clinical" size="sm" disabled={!agreed || !signature.trim()}>
            Submit Digital Consent
          </Button>
        </div>
      </div>
    </div>
  );
}
