"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Stethoscope,
  FileText,
  FileCheck2,
  Share2,
  ShieldCheck,
  Menu,
  X,
  UserCheck,
  Sparkles,
  LogOut,
  User,
  LayoutDashboard,
  LogIn,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.user;
  const role = session?.user?.role;

  const getDashboardLink = () => {
    if (role === "DOCTOR") return "/doctor/dashboard";
    if (role === "ADMIN") return "/admin/dashboard";
    if (role === "TRIAGE_STAFF") return "/triage/dashboard";
    return "/patient/dashboard";
  };

  const getRoleBadgeVariant = () => {
    if (role === "DOCTOR") return "verified";
    if (role === "ADMIN") return "destructive";
    if (role === "TRIAGE_STAFF") return "warning";
    return "clinical";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition hover:opacity-90">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-md shadow-teal-500/20">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-foreground text-lg">
                Arogya<span className="text-teal-600 dark:text-teal-400">Intake</span>
              </span>
              <Badge variant="clinical" className="px-1.5 py-0 text-[10px]">
                SIH26047
              </Badge>
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">
              Structured Case-Taking & Digitization
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link
            href="/#pipeline"
            className="transition hover:text-foreground flex items-center gap-1.5"
          >
            <Sparkles className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            Clinical Pipeline
          </Link>
          <Link
            href="/case-taking"
            className="transition hover:text-foreground flex items-center gap-1.5"
          >
            <FileText className="h-4 w-4" />
            Case Intake
          </Link>
          <Link
            href="/#doctor-verification"
            className="transition hover:text-foreground flex items-center gap-1.5"
          >
            <FileCheck2 className="h-4 w-4 text-emerald-600" />
            Doctor Review
          </Link>
          <Link
            href="/#safety"
            className="transition hover:text-foreground flex items-center gap-1.5"
          >
            <ShieldCheck className="h-4 w-4 text-amber-500" />
            Safety Guardrails
          </Link>
        </nav>

        {/* Auth / Profile Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600/10 text-teal-600 font-bold text-xs">
                  <User className="h-3.5 w-3.5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-foreground leading-none">
                    {session.user.name || "User"}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Badge variant={getRoleBadgeVariant()} className="px-1 py-0 text-[9px]">
                      {role}
                    </Badge>
                  </div>
                </div>
              </div>

              <Link href={getDashboardLink()}>
                <Button variant="clinical" size="sm" className="gap-1.5 text-xs">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Dashboard
                </Button>
              </Link>

              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="gap-1 text-xs text-muted-foreground hover:text-rose-600"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                  <LogIn className="h-3.5 w-3.5" />
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="clinical" size="sm" className="gap-1.5 text-xs">
                  <UserPlus className="h-3.5 w-3.5" />
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="border-b border-border bg-background px-4 pb-6 pt-2 md:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-3">
            {isAuthenticated && (
              <div className="p-3 rounded-lg bg-muted/40 border border-border mb-2">
                <p className="text-xs font-semibold text-foreground">{session.user.name}</p>
                <p className="text-[11px] text-muted-foreground">{session.user.email}</p>
                <Badge variant={getRoleBadgeVariant()} className="mt-1 text-[10px]">
                  {role}
                </Badge>
              </div>
            )}

            <Link
              href="/#pipeline"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-2 py-1.5 text-sm font-medium hover:text-teal-600"
            >
              Clinical Pipeline
            </Link>
            <Link
              href="/case-taking"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-2 py-1.5 text-sm font-medium hover:text-teal-600"
            >
              Patient Case Intake
            </Link>
            <Link
              href="/#doctor-verification"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-2 py-1.5 text-sm font-medium hover:text-teal-600"
            >
              Doctor Verification
            </Link>
            <Link
              href="/#safety"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-2 py-1.5 text-sm font-medium hover:text-teal-600"
            >
              Safety Guardrails
            </Link>

            <div className="pt-2 flex flex-col gap-2 border-t border-border">
              {isAuthenticated ? (
                <>
                  <Link href={getDashboardLink()} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="clinical" className="w-full justify-center gap-1.5">
                      <LayoutDashboard className="h-4 w-4" />
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      signOut({ callbackUrl: "/login" });
                    }}
                    className="w-full justify-center gap-1.5 text-rose-600 hover:text-rose-700"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center gap-1.5">
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="clinical" className="w-full justify-center gap-1.5">
                      <UserPlus className="h-4 w-4" />
                      Create Account
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
