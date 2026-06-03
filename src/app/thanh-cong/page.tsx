import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { SuccessContent as SuccessContentClient } from './SuccessContent';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Thanh Toán Thành Công — Coralume',
  description:
    'Cảm ơn bạn đã nhận nuôi san hô! Xem chứng nhận và vào dashboard theo dõi san hô của bạn.',
  openGraph: {
    title: 'Coralume — Cảm ơn bạn đã nhận nuôi san hô!',
    description:
      'Chứng nhận nhận nuôi san hô của bạn tại Coralume. Theo dõi san hô qua dashboard.',
    url: `${siteConfig.url}/thanh-cong`,
    type: 'website',
  },
};

// Inline SuccessContent for server import compatibility
async function fetchPaymentData(orderId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    // Note: we can't call our own API easily from server component without auth cookie.
    // The success page relies on client-side polling or the data embedded in URL.
    // For now, return null — the client component will show the success state.
    return null;
  } catch {
    return null;
  }
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  if (!orderId) {
    redirect('/san-pham');
  }

  // Try to fetch payment data; fall back to null (client shows generic success)
  const payment = await fetchPaymentData(orderId);

  return (
    <main className="flex-1 bg-surface py-16 px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
      <div className="max-w-[var(--spacing-container-max)] mx-auto">
        <SuccessContentClient payment={payment} />
      </div>
    </main>
  );
}
