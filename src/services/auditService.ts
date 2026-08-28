import { AuditLog } from "@/models/AuditLog";
import { connectToDatabase } from "@/lib/mongodb";

export interface LogAuditInput {
  actorUserId?: string;
  actorRole?: string;
  action: string;
  resourceType: "CASE_RECORD" | "CONSENT" | "DOCUMENT" | "USER" | "VERIFICATION" | "TRIAGE" | "SAFETY_ALERT";
  resourceId: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
}

export class AuditService {
  public static async log(input: LogAuditInput) {
    try {
      await connectToDatabase();
      await AuditLog.create({
        actorUserId: input.actorUserId || undefined,
        actorRole: input.actorRole || "SYSTEM",
        action: input.action,
        resourceType: input.resourceType,
        resourceId: input.resourceId,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
        details: input.details || {},
        timestamp: new Date(),
      });
    } catch (err) {
      console.error("[AuditService] Failed to record audit log:", err);
    }
  }
}
