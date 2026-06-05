/**
 * Ambassador upgrade logic.
 *
 * When an adopter reaches AMBASSADOR_THRESHOLD referrals,
 * they auto-upgrade to ambassador role and receive a congratulations email.
 */
import { prisma } from '@/lib/db';
import { AMBASSADOR_THRESHOLD } from '@/config/site';
import { sendAmbassadorWelcomeEmail } from '@/lib/email';

/**
 * Check if a user qualifies for ambassador upgrade and perform it.
 * Safe to call from any context — idempotent (won't re-upgrade).
 */
export async function maybeUpgradeToAmbassador(
  userId: string
): Promise<boolean> {
  try {
    // Only check adopters (not existing ambassadors or staff)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, fullName: true, email: true },
    });

    if (!user || user.role !== 'adopter') return false;

    // Count completed referrals
    const referralCount = await prisma.referral.count({
      where: { referrerId: userId, status: 'completed' },
    });

    if (referralCount >= AMBASSADOR_THRESHOLD) {
      // Upgrade to ambassador
      await prisma.user.update({
        where: { id: userId },
        data: { role: 'ambassador' },
      });

      // Send congratulations email (fire-and-forget)
      sendAmbassadorWelcomeEmail(user.email, {
        adopterName: user.fullName,
        referralCount,
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`,
      }).catch((err) =>
        console.error('[Ambassador] Failed to send welcome email:', err)
      );

      return true;
    }

    return false;
  } catch (error) {
    console.error('[Ambassador] Upgrade check failed:', error);
    return false;
  }
}

/**
 * Get the current referral count for a user.
 */
export async function getReferralCount(userId: string): Promise<number> {
  try {
    return await prisma.referral.count({
      where: { referrerId: userId, status: 'completed' },
    });
  } catch {
    return 0;
  }
}
