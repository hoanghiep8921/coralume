/**
 * GET /api/v1/dashboard
 *
 * Aggregated dashboard data for the current user.
 * Auth required (JWT cookie).
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { getReferralCount, maybeUpgradeToAmbassador } from '@/lib/ambassador';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Vui lòng đăng nhập', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: currentUser.userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        avatarUrl: true,
        role: true,
        isVerified: true,
        isPublic: true,
        emailNotify: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Không tìm thấy người dùng', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Get adoptions with related data
    const adoptions = await prisma.adoption.findMany({
      where: { userId: user.id },
      include: {
        product: { select: { name: true, tier: true } },
        coral: {
          select: {
            id: true,
            code: true,
            species: true,
            status: true,
            locationZone: true,
            updates: {
              orderBy: { createdAt: 'desc' },
              take: 5,
              select: {
                id: true,
                sizeCm: true,
                health: true,
                notes: true,
                images: true,
                videoUrl: true,
                createdAt: true,
              },
            },
          },
        },
        certificate: { select: { id: true, pdfUrl: true } },
      },
      orderBy: { adoptedAt: 'desc' },
    });

    // Calculate stats
    const totalCorals = adoptions.filter((a) => a.status === 'active').length;
    const reefArea = totalCorals * 2.5; // ~2.5m² per coral
    const firstAdoption = adoptions[adoptions.length - 1];
    const monthsActive = firstAdoption?.adoptedAt
      ? Math.max(
          1,
          Math.floor(
            (Date.now() - new Date(firstAdoption.adoptedAt).getTime()) /
              (1000 * 60 * 60 * 24 * 30)
          )
        )
      : 0;

    // Get real referral count from DB
    const referralCount = await getReferralCount(user.id);
    // Check ambassador upgrade eligibility
    await maybeUpgradeToAmbassador(user.id);

    return NextResponse.json({
      data: {
        user,
        adoptions,
        stats: {
          totalCorals,
          reefArea,
          monthsActive,
          co2Absorbed: totalCorals * 1.5, // kg estimate
          marineLife: totalCorals * 15, // estimated marine species supported
        },
        referrals: {
          count: referralCount,
          code: `CRL-${user.fullName?.toUpperCase().replace(/\s+/g, '') || user.id.substring(0, 6)}`,
          threshold: 5,
        },
      },
    });
  } catch (error) {
    console.error('[GET /api/v1/dashboard]', error);
    return NextResponse.json(
      { error: 'Lỗi server', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
