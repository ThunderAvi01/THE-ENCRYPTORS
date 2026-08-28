import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = !!token;
  const userRole = token?.role as string | undefined;

  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isPatientRoute = pathname.startsWith("/patient");
  const isDoctorRoute = pathname.startsWith("/doctor");
  const isAdminRoute = pathname.startsWith("/admin");
  const isTriageRoute = pathname.startsWith("/triage");

  // 1. If user is authenticated and trying to access /login or /register, redirect to their role dashboard
  if (isAuthenticated && isAuthRoute) {
    let target = "/patient/dashboard";
    if (userRole === "DOCTOR") target = "/doctor/dashboard";
    else if (userRole === "ADMIN") target = "/admin/dashboard";
    else if (userRole === "TRIAGE_STAFF") target = "/triage/dashboard";

    return NextResponse.redirect(new URL(target, req.url));
  }

  // 2. If unauthenticated user tries to access protected role routes, redirect to login
  if (!isAuthenticated && (isPatientRoute || isDoctorRoute || isAdminRoute || isTriageRoute)) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Role-Based Access Control (RBAC) authorization checks
  if (isAuthenticated) {
    if (isPatientRoute && userRole !== "PATIENT" && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (isDoctorRoute && userRole !== "DOCTOR" && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (isAdminRoute && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (isTriageRoute && userRole !== "TRIAGE_STAFF" && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/patient/:path*",
    "/doctor/:path*",
    "/admin/:path*",
    "/triage/:path*",
  ],
};
