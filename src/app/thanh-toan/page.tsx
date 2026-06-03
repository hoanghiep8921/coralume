import type { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { CheckoutForm } from './CheckoutForm';
import { siteConfig } from '@/config/site';
import { verifyToken, type TokenPayload } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Thanh Toán — Coralume',
  description:
    'Hoàn tất thanh toán cho san hô của bạn. Thanh toán an toàn qua VNPay, MoMo hoặc chuyển khoản ngân hàng.',
  openGraph: {
    title: 'Coralume — Thanh toán',
    description:
      'Hoàn tất thanh toán cho san hô của bạn tại Coralume. Thanh toán an toàn qua VNPay, MoMo hoặc chuyển khoản.',
    url: `${siteConfig.url}/thanh-toan`,
    type: 'website',
  },
};

interface ProductData {
  id: string;
  slug: string;
  name: string;
  tier: string;
  priceMin: number;
  priceMax: number;
  benefits: string[];
  description?: string;
}

interface UserData {
  fullName: string;
  email: string;
  phone?: string | null;
}

async function fetchProduct(slug: string): Promise<ProductData | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/v1/products/lookup?slug=${encodeURIComponent(slug)}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

async function getCurrentUserServer(): Promise<{ user: TokenPayload; dbUser: UserData } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;

    const payload = await verifyToken(token);
    if (!payload) return null;

    // Fetch full user data from API
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/v1/me`, {
      headers: { Cookie: `token=${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return { user: payload, dbUser: json.data };
  } catch {
    return null;
  }
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ goi?: string }>;
}) {
  const { goi: slug } = await searchParams;

  // If no product selected, redirect to products page
  if (!slug) {
    redirect('/san-pham');
  }

  // Fetch product
  const product = await fetchProduct(slug);
  if (!product) {
    notFound();
  }

  // Get current user (middleware guarantees auth, but re-verify)
  const auth = await getCurrentUserServer();
  if (!auth) {
    redirect(`/dang-nhap?callbackUrl=/thanh-toan?goi=${slug}`);
  }

  return (
    <main className="flex-1 bg-surface py-12 px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
      <div className="max-w-[var(--spacing-container-max)] mx-auto">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-primary mb-4">
            Hoàn tất thanh toán
          </h1>
          <p className="font-body-lg text-on-surface-variant max-w-xl mx-auto">
            Bạn đang nhận nuôi <strong className="text-primary">{product.name}</strong>.
            Điền thông tin bên dưới để hoàn tất.
          </p>
        </div>

        <CheckoutForm
          product={product}
          user={{
            fullName: auth.dbUser.fullName || '',
            email: auth.dbUser.email || '',
            phone: auth.dbUser.phone || null,
          }}
        />
      </div>
    </main>
  );
}
