'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createOrderSchema, type CreateOrderInput } from '@/lib/validation';
import { PaymentMethodSelector } from '@/components/ui/PaymentMethodSelector';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

interface CheckoutFormProps {
  product: ProductData;
  user: UserData;
}

function formatVND(amount: number): string {
  return amount.toLocaleString('vi-VN') + 'đ';
}

export function CheckoutForm({ product, user }: CheckoutFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      productId: product.id,
      customName: '',
      paymentMethod: undefined,
      agreeTerms: false,
    },
  });

  const onSubmit = async (data: CreateOrderInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || 'Có lỗi xảy ra khi tạo đơn hàng');
        return;
      }

      const orderData = json.data;

      // Redirect based on payment method
      if (orderData.redirectUrl) {
        if (data.paymentMethod === 'bank_transfer') {
          // Navigate internally for bank transfer
          router.push(orderData.redirectUrl);
        } else {
          // External redirect for VNPay/MoMo
          window.location.href = orderData.redirectUrl;
        }
      }
    } catch {
      setError('Không thể kết nối đến server');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Order Summary */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="font-headline-md text-headline-md text-primary mb-1">
              {product.name}
            </h2>
            <p className="text-on-surface-variant font-body-md">
              {product.tier === 'standard'
                ? 'Gói Tiêu Chuẩn'
                : product.tier === 'premium'
                  ? 'Gói Cao Cấp'
                  : 'Gói Trải Nghiệm'}
            </p>
          </div>
          <div className="text-right">
            <span className="font-mono text-xl text-primary font-bold">
              {formatVND(product.priceMin)}
            </span>
            <span className="text-on-surface-variant text-sm ml-1">
              – {formatVND(product.priceMax)}
            </span>
          </div>
        </div>
        {/* Benefits */}
        <ul className="space-y-1 border-t border-outline-variant/50 pt-4">
          {product.benefits.slice(0, 4).map((b, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-on-surface-variant">
              <svg className="w-4 h-4 text-secondary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              {b}
            </li>
          ))}
          {product.benefits.length > 4 && (
            <li className="text-xs text-on-surface-variant/60 pl-6">
              + {product.benefits.length - 4} quyền lợi khác
            </li>
          )}
        </ul>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-surface-container-lowest rounded-xl shadow-card p-8 space-y-6" noValidate>
        {error && (
          <div className="bg-error-container border border-error/20 text-error text-sm rounded-lg px-4 py-3" role="alert">
            {error}
          </div>
        )}

        {/* Hidden product ID */}
        <input type="hidden" {...register('productId')} />

        {/* Adopter Info (pre-filled, read-only) */}
        <div>
          <h3 className="font-headline-md text-headline-md text-primary mb-4">
            Thông tin người nhận nuôi
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-on-surface">Họ và tên</label>
              <div className="block w-full rounded-lg border border-outline-variant bg-surface-container px-3 py-2.5 text-base font-body text-on-surface">
                {user.fullName}
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-on-surface">Email</label>
              <div className="block w-full rounded-lg border border-outline-variant bg-surface-container px-3 py-2.5 text-base font-body text-on-surface">
                {user.email}
              </div>
            </div>
          </div>
        </div>

        {/* Coral Name */}
        <div className="space-y-1">
          <label htmlFor="customName" className="block text-sm font-medium text-on-surface">
            Tên san hô của bạn <span className="text-on-surface-variant font-normal">(tuỳ chọn)</span>
          </label>
          <input
            id="customName"
            type="text"
            {...register('customName')}
            className={`block w-full rounded-lg border px-3 py-2.5 text-base font-body transition-colors duration-fast
              ${errors.customName
                ? 'border-error focus:border-error'
                : 'border-outline-variant focus:border-primary'
              }
              outline-none focus:ring-2 focus:ring-secondary/20`}
            placeholder="Đặt tên cho san hô của bạn (VD: Bé San Hô Xinh)"
            aria-invalid={!!errors.customName}
            aria-describedby={errors.customName ? 'customName-error' : undefined}
          />
          {errors.customName && (
            <p id="customName-error" className="text-sm text-error" role="alert">
              {errors.customName.message}
            </p>
          )}
        </div>

        {/* Payment Method */}
        <Controller
          name="paymentMethod"
          control={control}
          render={({ field }) => (
            <PaymentMethodSelector
              value={field.value}
              onChange={field.onChange}
              error={errors.paymentMethod?.message}
            />
          )}
        />

        {/* Terms */}
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <input
              id="agreeTerms"
              type="checkbox"
              {...register('agreeTerms')}
              className="mt-1 h-4 w-4 rounded border-outline-variant text-secondary focus:ring-secondary/20 cursor-pointer"
              aria-invalid={!!errors.agreeTerms}
              aria-describedby={errors.agreeTerms ? 'terms-error' : undefined}
            />
            <label htmlFor="agreeTerms" className="text-sm text-on-surface cursor-pointer">
              Tôi đồng ý với{' '}
              <Link href="/dieu-khoan" className="text-secondary hover:underline">
                điều khoản thanh toán
              </Link>{' '}
              của Coralume
            </label>
          </div>
          {errors.agreeTerms && (
            <p id="terms-error" className="text-sm text-error" role="alert">
              {errors.agreeTerms.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-secondary hover:bg-secondary-container text-on-secondary font-semibold py-3 px-4 rounded-lg transition-all duration-normal hover:-translate-y-0.5 shadow-button disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Đang xử lý...
            </span>
          ) : (
            <span>
              Tiến hành thanh toán ·{' '}
              <span className="font-mono">{formatVND(product.priceMin)}</span>
            </span>
          )}
        </button>

        <p className="text-xs text-on-surface-variant text-center mt-2">
          Thanh toán được bảo mật qua SSL. Coralume không lưu thông tin thẻ của bạn.
        </p>
      </form>
    </div>
  );
}
