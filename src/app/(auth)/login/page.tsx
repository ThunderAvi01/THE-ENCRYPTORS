import React, { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/auth/AuthCard";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] px-4 py-12">
      <div className="w-full max-w-md mb-4 flex justify-start">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
      <Suspense
        fallback={
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          </div>
        }
      >
        <AuthCard />
      </Suspense>
    </div>
  );
}
