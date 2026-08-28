import React from "react";
import Link from "next/link";
import { FileQuestion, ArrowLeft, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-14rem)] px-4 py-16 text-center space-y-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-600/10 text-teal-600 border border-teal-500/20">
        <FileQuestion className="h-8 w-8" />
      </div>
      <div className="space-y-1 max-w-md">
        <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">404 Error</span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Clinical Resource Not Found
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          The case record, clinical route, or portal page you requested could not be located or may have been archived.
        </p>
      </div>

      <div className="pt-2">
        <Link href="/">
          <Button variant="clinical" size="sm" className="gap-2 text-xs">
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
