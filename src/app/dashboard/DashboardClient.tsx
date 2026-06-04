'use client';

import { useState } from 'react';
import { WelcomeBanner } from '@/components/dashboard/WelcomeBanner';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { CoralGrid } from '@/components/dashboard/CoralGrid';
import { CoralDetailModal } from '@/components/dashboard/CoralDetailModal';
import { ImpactDashboard } from '@/components/dashboard/ImpactDashboard';
import { ReferralCode } from '@/components/dashboard/ReferralCode';
import { ProfileSettings } from '@/components/dashboard/ProfileSettings';

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

      <ReferralCode
        code={data.referrals.code}
        count={data.referrals.count}
        threshold={data.referrals.threshold}
      />

      <ProfileSettings
        profile={{
          fullName: data.user.fullName || '',
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
