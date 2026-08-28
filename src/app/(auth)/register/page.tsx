import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RegisterCard } from "@/components/auth/RegisterCard";

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] px-4 py-12">
      <div className="w-full max-w-xl mb-4 flex justify-start">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
      <RegisterCard />
    </div>
  );
}
