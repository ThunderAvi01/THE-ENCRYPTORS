import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, LogIn, Stethoscope, User, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] px-4 py-12">
      <Card className="max-w-md w-full border-border shadow-xl text-center">
        <CardHeader className="space-y-2 pb-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 mb-1 border border-rose-500/20">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight text-foreground">
            Access Restricted
          </CardTitle>
          <CardDescription className="text-xs leading-relaxed">
            You do not possess the required clinical authorization or role permissions to access this resource.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 text-xs text-muted-foreground">
          <div className="p-3 rounded-lg bg-muted/40 border border-border text-left space-y-1">
            <p className="font-semibold text-foreground">Role Separation Policy:</p>
            <p className="text-[11px] leading-relaxed">
              • <strong>Patients</strong> can only access patient dashboards and personal case intakes.
              <br />
              • <strong>Doctors</strong> can only access verification queues and doctor dashboards.
              <br />
              • <strong>Admins</strong> manage platform verifications and system logs.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-2 pt-2">
          <Link href="/" className="w-full">
            <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
              <ArrowLeft className="h-4 w-4" />
              Return Home
            </Button>
          </Link>
          <Link href="/login" className="w-full">
            <Button variant="clinical" size="sm" className="w-full gap-1.5 text-xs">
              <LogIn className="h-4 w-4" />
              Switch Account
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
