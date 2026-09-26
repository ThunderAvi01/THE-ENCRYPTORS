"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { Lock, Mail, ArrowRight, AlertCircle, Loader2, CheckCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { loginSchema } from "@/lib/validations/auth";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function AuthCard() {
  const router = useRouter();
  const { dict } = useLanguage();
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

      // Successful login -> Redirect to role-specific dashboard
      if (callbackUrl && callbackUrl.startsWith("/") && callbackUrl !== "/" && callbackUrl !== "/login") {
        router.push(callbackUrl);
      } else {
        const session = await getSession();
        const role = session?.user?.role;
        router.refresh();
        if (role === "DOCTOR") {
          router.push("/doctor/dashboard");
        } else if (role === "ADMIN") {
          router.push("/admin/dashboard");
        } else if (role === "TRIAGE_STAFF") {
          router.push("/triage/dashboard");
        } else {
          router.push("/patient/dashboard");
        }
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
        <CardTitle className="text-xl font-bold tracking-tight">{dict.auth.signInTitle}</CardTitle>
        <CardDescription className="text-xs">
          {dict.auth.signInSubtitle}
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
              <span>{dict.auth.emailLabel}</span>
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
              <span>{dict.auth.passwordLabel}</span>
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
                <span>{dict.common.loading}</span>
              </>
            ) : (
              <>
                <span>{dict.auth.signInBtn}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>

          <div className="text-center text-xs text-muted-foreground">
            {dict.auth.dontHaveAccount}
          </div>

          {/* Quick Demo Credentials Switcher */}
          <div className="mt-2 pt-3 border-t border-border/70 space-y-2 w-full">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block text-center">
              Quick Demo Login Credentials
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setEmail("patient@example.com");
                  setPassword("Password123");
                }}
                className="p-1.5 rounded-lg border border-border bg-muted/40 hover:bg-teal-500/10 hover:border-teal-500/40 text-left transition"
              >
                <span className="font-bold text-teal-600 block">👤 Patient</span>
                <span className="text-[10px] text-muted-foreground">patient@example.com</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail("doctor@example.com");
                  setPassword("Password123");
                }}
                className="p-1.5 rounded-lg border border-border bg-muted/40 hover:bg-emerald-500/10 hover:border-emerald-500/40 text-left transition"
              >
                <span className="font-bold text-emerald-600 block">🩺 Doctor</span>
                <span className="text-[10px] text-muted-foreground">doctor@example.com</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail("admin@example.com");
                  setPassword("Password123");
                }}
                className="p-1.5 rounded-lg border border-border bg-muted/40 hover:bg-purple-500/10 hover:border-purple-500/40 text-left transition"
              >
                <span className="font-bold text-purple-600 block">🛡️ Admin</span>
                <span className="text-[10px] text-muted-foreground">admin@example.com</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail("triage@example.com");
                  setPassword("Password123");
                }}
                className="p-1.5 rounded-lg border border-border bg-muted/40 hover:bg-amber-500/10 hover:border-amber-500/40 text-left transition"
              >
                <span className="font-bold text-amber-600 block">⚡ Triage Staff</span>
                <span className="text-[10px] text-muted-foreground">triage@example.com</span>
              </button>
            </div>
            <p className="text-[10px] text-center text-muted-foreground/80">
              Demo Password for all roles: <code className="font-mono font-bold text-foreground">Password123</code>
            </p>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
