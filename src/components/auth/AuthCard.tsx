"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Lock, Mail, ArrowRight, AlertCircle, Loader2, CheckCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { loginSchema } from "@/lib/validations/auth";

export function AuthCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    errorParam === "AccountSuspended"
      ? "Your account has been deactivated. Please contact an administrator."
      : null
  );
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setValidationErrors({});

    // Client-side Zod validation
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setValidationErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
      });

      if (result?.error) {
        setErrorMessage(result.error);
        setIsLoading(false);
        return;
      }

      // Successful login -> Redirect
      if (callbackUrl && callbackUrl.startsWith("/")) {
        router.push(callbackUrl);
      } else {
        // Fetch session to determine role dashboard
        router.refresh();
        router.push("/");
      }
    } catch (err) {
      console.error("Login exception:", err);
      setErrorMessage("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md w-full border-border shadow-xl">
      <CardHeader className="space-y-1.5 text-center pb-4">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600/10 text-teal-600 mb-1">
          <Lock className="h-6 w-6" />
        </div>
        <CardTitle className="text-xl font-bold tracking-tight">Sign In to ArogyaIntake</CardTitle>
        <CardDescription className="text-xs">
          Access your clinical case intakes, patient records, or doctor verification portal
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {errorMessage && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex justify-between">
              <span>Email Address</span>
              {validationErrors.email && (
                <span className="text-[11px] text-rose-500 font-normal">{validationErrors.email}</span>
              )}
            </label>
            <div className="relative">
              <Input
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className={`pl-9 text-xs sm:text-sm ${
                  validationErrors.email ? "border-rose-500 ring-1 ring-rose-500" : ""
                }`}
              />
              <Mail className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex justify-between">
              <span>Password</span>
              {validationErrors.password && (
                <span className="text-[11px] text-rose-500 font-normal">{validationErrors.password}</span>
              )}
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className={`pl-9 pr-9 text-xs sm:text-sm ${
                  validationErrors.password ? "border-rose-500 ring-1 ring-rose-500" : ""
                }`}
              />
              <Lock className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-2">
          <Button
            type="submit"
            variant="clinical"
            className="w-full gap-2 h-10"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Portal</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>

          <div className="text-center text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-teal-600 hover:underline">
              Create an account
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
