"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  BookOpen,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { GlobalLanguageDropdown } from "@/components/i18n/GlobalLanguageDropdown";

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hide global Navbar on dashboard and application routes
  if (
    pathname.startsWith("/doctor") ||
    pathname.startsWith("/patient") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/triage") ||
    pathname.startsWith("/case-taking")
  ) {
    return null;
  }
  const { data: session, status } = useSession();
  const { t, dict } = useLanguage();
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
        {/* Brand / Logo: redirects to role dashboard when logged in, or / when logged out */}
        <Link
          href={isAuthenticated ? getDashboardLink() : "/"}
          className="flex items-center gap-2.5 transition hover:opacity-90"
        >
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
              Structured Case-Taking & Clinical Decision Support
            </span>
          </div>
        </Link>

        {/* Desktop Segmented Pill Switch Navigation: Custom per role */}
        <nav className="hidden md:flex items-center p-1 rounded-full border border-border/80 bg-muted/40 backdrop-blur-md shadow-inner">
          {(isAuthenticated
            ? role === "DOCTOR"
              ? [
                  {
                    href: "/doctor/dashboard",
                    label: dict.navigation.dashboard,
                    icon: <LayoutDashboard className="h-4 w-4" />,
                    activeColor: "text-emerald-600 dark:text-emerald-400",
                  },
                  {
                    href: "/doctor/queue",
                    label: dict.navigation.doctorReview,
                    icon: <FileCheck2 className="h-4 w-4" />,
                    activeColor: "text-emerald-600 dark:text-emerald-400",
                  },
                  {
                    href: "/documentation",
                    label: dict.navigation.documentation,
                    icon: <BookOpen className="h-4 w-4" />,
                    activeColor: "text-teal-600 dark:text-teal-400",
                  },
                ]
              : [
                  // For Patients (and other non-doctor authenticated users): No separate case taking / doctor review nav
                  {
                    href: getDashboardLink(),
                    label: dict.navigation.dashboard,
                    icon: <LayoutDashboard className="h-4 w-4" />,
                    activeColor: "text-teal-600 dark:text-teal-400",
                  },
                  {
                    href: "/documentation",
                    label: dict.navigation.documentation,
                    icon: <BookOpen className="h-4 w-4" />,
                    activeColor: "text-teal-600 dark:text-teal-400",
                  },
                ]
            : [
                {
                  href: "/",
                  label: dict.navigation.home,
                  icon: <Home className="h-4 w-4" />,
                  activeColor: "text-teal-600 dark:text-teal-400",
                },
                {
                  href: "/documentation",
                  label: dict.navigation.documentation,
                  icon: <BookOpen className="h-4 w-4" />,
                  activeColor: "text-teal-600 dark:text-teal-400",
                },
              ]
          ).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 select-none ${
                  isActive
                    ? "bg-card text-foreground shadow-sm shadow-teal-500/10 border border-border scale-[1.02]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <span
                  className={`transition-transform duration-300 ${
                    isActive ? `${item.activeColor} scale-110` : "opacity-70"
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse ml-0.5" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Auth / Profile & Language Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <GlobalLanguageDropdown />

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

              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="gap-1 text-xs text-muted-foreground hover:text-rose-600"
              >
                <LogOut className="h-3.5 w-3.5" />
                {dict.navigation.logout}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                  <LogIn className="h-3.5 w-3.5" />
                  {dict.navigation.login}
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="clinical" size="sm" className="gap-1.5 text-xs font-semibold">
                  <UserPlus className="h-3.5 w-3.5" />
                  {dict.navigation.register}
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Language & Menu Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <GlobalLanguageDropdown />
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

            {/* Mobile Segmented Switch Toggle */}
            <div className="flex flex-col p-1 rounded-2xl border border-border bg-muted/30 space-y-1">
              {(isAuthenticated
                ? role === "DOCTOR"
                  ? [
                      {
                        href: "/doctor/dashboard",
                        label: dict.navigation.dashboard,
                        icon: <LayoutDashboard className="h-4 w-4" />,
                        activeColor: "text-emerald-600 dark:text-emerald-400",
                      },
                      {
                        href: "/doctor/queue",
                        label: dict.navigation.doctorReview,
                        icon: <FileCheck2 className="h-4 w-4" />,
                        activeColor: "text-emerald-600 dark:text-emerald-400",
                      },
                      {
                        href: "/documentation",
                        label: dict.navigation.documentation,
                        icon: <BookOpen className="h-4 w-4" />,
                        activeColor: "text-teal-600 dark:text-teal-400",
                      },
                    ]
                  : [
                      // Patients (and non-doctor roles): only Dashboard and Documentation
                      {
                        href: getDashboardLink(),
                        label: dict.navigation.dashboard,
                        icon: <LayoutDashboard className="h-4 w-4" />,
                        activeColor: "text-teal-600 dark:text-teal-400",
                      },
                      {
                        href: "/documentation",
                        label: dict.navigation.documentation,
                        icon: <BookOpen className="h-4 w-4" />,
                        activeColor: "text-teal-600 dark:text-teal-400",
                      },
                    ]
                : [
                    {
                      href: "/",
                      label: dict.navigation.home,
                      icon: <Home className="h-4 w-4" />,
                      activeColor: "text-teal-600 dark:text-teal-400",
                    },
                    {
                      href: "/documentation",
                      label: dict.navigation.documentation,
                      icon: <BookOpen className="h-4 w-4" />,
                      activeColor: "text-teal-600 dark:text-teal-400",
                    },
                  ]
              ).map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "bg-card text-foreground shadow-sm border border-border"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? item.activeColor : "opacity-70"}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {isActive && (
                      <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 flex flex-col gap-2 border-t border-border">
              {isAuthenticated ? (
                <>
                  <Link href={getDashboardLink()} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="clinical" className="w-full justify-center gap-1.5">
                      <LayoutDashboard className="h-4 w-4" />
                      {dict.navigation.dashboard}
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      signOut({ callbackUrl: "/login" });
                    }}
                    className="w-full justify-center gap-1.5 text-muted-foreground hover:text-rose-600"
                  >
                    <LogOut className="h-4 w-4" />
                    {dict.navigation.logout}
                  </Button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center gap-1">
                      <LogIn className="h-4 w-4" />
                      {dict.navigation.login}
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="clinical" className="w-full justify-center gap-1">
                      <UserPlus className="h-4 w-4" />
                      {dict.navigation.register}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
