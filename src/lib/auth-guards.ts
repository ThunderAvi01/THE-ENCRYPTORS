import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { UserRole, SafeUserSession } from "@/types/user";

/**
 * Returns the current active session user or null
 */
export async function getCurrentUser(): Promise<SafeUserSession | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return null;
  }
  return session.user as SafeUserSession;
}

/**
 * Enforces that a user must be authenticated.
 * If unauthenticated, redirects to login with callback URL.
 */
export async function requireAuth(callbackUrl = "/"): Promise<SafeUserSession> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }
  if (!user.isActive) {
    redirect("/login?error=AccountSuspended");
  }
  return user;
}

/**
 * Enforces that the authenticated user must possess one of the allowed roles.
 * If role check fails, redirects to /unauthorized.
 */
export async function requireRole(
  allowedRoles: UserRole[],
  callbackUrl = "/"
): Promise<SafeUserSession> {
  const user = await requireAuth(callbackUrl);
  if (!allowedRoles.includes(user.role)) {
    redirect("/unauthorized");
  }
  return user;
}

/**
 * Guard specifically for patient routes and data access
 */
export async function requirePatient(callbackUrl = "/patient/dashboard"): Promise<SafeUserSession> {
  return requireRole(["PATIENT", "ADMIN"], callbackUrl);
}

/**
 * Guard specifically for doctor routes and verification queues
 */
export async function requireDoctor(callbackUrl = "/doctor/dashboard"): Promise<SafeUserSession> {
  return requireRole(["DOCTOR", "ADMIN"], callbackUrl);
}

/**
 * Guard strictly for admin management routes
 */
export async function requireAdmin(callbackUrl = "/admin/dashboard"): Promise<SafeUserSession> {
  return requireRole(["ADMIN"], callbackUrl);
}

/**
 * Guard specifically for triage staff
 */
export async function requireTriage(callbackUrl = "/triage/dashboard"): Promise<SafeUserSession> {
  return requireRole(["TRIAGE_STAFF", "ADMIN"], callbackUrl);
}
