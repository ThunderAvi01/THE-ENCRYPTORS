import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-guards";
import { ConsentService } from "@/services/consentService";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const consent = await ConsentService.getActiveConsent(user.id);
    return NextResponse.json({
      success: true,
      consent: consent || null,
    });
  } catch (err: any) {
    console.error("GET /api/user/consent error:", err);
    return NextResponse.json({ error: "Failed to fetch consent status." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, scope, signatureText } = body;

    if (action === "REVOKE") {
      const revoked = await ConsentService.revokeConsent(user.id);
      return NextResponse.json({ success: true, message: "Consent revoked.", consent: revoked });
    }

    if (scope) {
      const updated = await ConsentService.updateConsentScope(user.id, scope);
      return NextResponse.json({ success: true, message: "Consent preferences updated.", consent: updated });
    }

    const newConsent = await ConsentService.recordConsent(user.id, signatureText || "Digital Signature");
    return NextResponse.json({ success: true, consent: newConsent });
  } catch (err: any) {
    console.error("POST /api/user/consent error:", err);
    return NextResponse.json({ error: "Failed to process consent request." }, { status: 500 });
  }
}
