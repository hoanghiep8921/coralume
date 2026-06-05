'use client';

import { useState } from 'react';
import { WelcomeBanner } from '@/components/dashboard/WelcomeBanner';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { CoralGrid } from '@/components/dashboard/CoralGrid';
import { CoralDetailModal } from '@/components/dashboard/CoralDetailModal';
import { ImpactDashboard } from '@/components/dashboard/ImpactDashboard';
import { ReferralCode } from '@/components/dashboard/ReferralCode';
import { ProfileSettings } from '@/components/dashboard/ProfileSettings';
import { TwoFactorSection } from '@/components/dashboard/TwoFactorSection';
import Link from 'next/link';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface DashboardClientProps {
  data: any;
}

export function DashboardClient({ data }: DashboardClientProps) {
  const [selectedCoral, setSelectedCoral] = useState<any>(null);

  return (
    <>
      <WelcomeBanner
        fullName={data.user.fullName || 'Bạn'}
        coralCount={data.stats.totalCorals}
        role={data.user.role}
      />

      <QuickStats
        totalCorals={data.stats.totalCorals}
        reefArea={data.stats.reefArea}
        monthsActive={data.stats.monthsActive}
      />

      <CoralGrid
        corals={data.adoptions}
        onSelectCoral={setSelectedCoral}
      />

      <ImpactDashboard
        totalCorals={data.stats.totalCorals}
        reefArea={data.stats.reefArea}
        co2Absorbed={data.stats.co2Absorbed}
        marineLife={data.stats.marineLife}
      />

      {/* SRS 7.1: Adopt More CTA */}
      <section className="mb-12 bg-gradient-to-r from-primary to-tertiary rounded-2xl p-8 text-center">
        <h2 className="font-display text-2xl md:text-3xl text-on-primary mb-4">
          Muốn nhận nuôi thêm?
        </h2>
        <p className="text-on-primary/80 mb-6 max-w-md mx-auto">
          Mỗi san hô mới là một câu chuyện mới. Khám phá các gói nhận nuôi phù hợp với bạn.
        </p>
        <Link
          href="/san-pham"
          className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-container text-on-secondary font-semibold py-3 px-8 rounded-lg transition-all duration-normal hover:-translate-y-0.5 shadow-button"
        >
          <span className="material-symbols-outlined text-xl" aria-hidden="true">explore</span>
          Khám phá các gói →
        </Link>
      </section>

      <ReferralCode
        code={data.referrals.code}
        count={data.referrals.count}
        threshold={data.referrals.threshold}
      />

      {/* SRS §5: 2FA section — bảo vệ tài khoản admin/staff */}
      <section className="mb-12">
        <TwoFactorSection />
      </section>

      <ProfileSettings
        profile={{
          fullName: data.user.fullName || '',
          email: data.user.email || '',
          phone: data.user.phone || null,
          avatarUrl: data.user.avatarUrl || null,
          isPublic: data.user.isPublic,
          emailNotify: data.user.emailNotify,
        }}
      />

      {/* Coral Detail Modal */}
      {selectedCoral && (
        <CoralDetailModal
          coral={selectedCoral}
          onClose={() => setSelectedCoral(null)}
        />
      )}
    </>
  );
}
