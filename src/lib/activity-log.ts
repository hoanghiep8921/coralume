/**
 * Admin Activity Log — writes to AdminActivityLog table.
 * Fire-and-forget; failures are silently ignored.
 */
import { prisma } from '@/lib/db';
import type { InputJsonValue } from '@prisma/client/runtime/library';

interface LogActivityParams {
  adminId: string;
  action: string;
  targetType?: string;
  targetId?: string;
  details?: Record<string, unknown>;
}

export async function logActivity(params: LogActivityParams): Promise<void> {
  try {
    await prisma.adminActivityLog.create({
      data: {
        adminId: params.adminId,
        action: params.action,
        targetType: params.targetType || undefined,
        targetId: params.targetId || undefined,
        details: (params.details || undefined) as InputJsonValue,
      },
    });
  } catch {
    // Activity logging is non-critical — silently ignore failures
  }
}
