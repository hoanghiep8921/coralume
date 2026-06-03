'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validation';
import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || 'Có lỗi xảy ra');
        return;
      }

      setSuccess(true);
    } catch {
      setError('Không thể kết nối đến server');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <main className="flex min-h-screen flex-1 items-center justify-center bg-surface px-4 py-12">
        <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-card p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-on-tertiary-container/10 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-on-tertiary-container" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="font-display text-2xl font-bold text-primary mb-2">
            Kiểm tra email của bạn
          </h2>
          <p className="text-on-surface-variant mb-6">
            Nếu email tồn tại trong hệ thống, bạn sẽ nhận được link đặt lại mật khẩu.
            Link có hiệu lực trong 15 phút.
          </p>
          <Link
            href="/dang-nhap"
            className="inline-block bg-secondary hover:bg-secondary-container text-on-secondary font-semibold py-3 px-6 rounded-lg transition-all duration-normal hover:-translate-y-0.5 shadow-button"
          >
            Quay lại đăng nhập
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-3xl font-bold text-primary">
            Coralume
          </Link>
          <p className="text-on-surface-variant mt-2">Đặt lại mật khẩu</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-surface-container-lowest rounded-xl shadow-card p-8 space-y-5"
          noValidate
        >
          {error && (
            <div className="bg-error-container border border-error/20 text-error text-sm rounded-lg px-4 py-3" role="alert">
              {error}
            </div>
          )}

          <p className="text-sm text-on-surface-variant">
            Nhập email đã đăng ký. Chúng tôi sẽ gửi link đặt lại mật khẩu.
          </p>

          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-on-surface">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              className={`block w-full rounded-lg border px-3 py-2.5 text-base font-body transition-colors duration-fast
                ${errors.email
                  ? 'border-error focus:border-error'
                  : 'border-outline-variant focus:border-primary'
                }
                outline-none focus:ring-2 focus:ring-secondary/20`}
              placeholder="email@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-error" role="alert">
                {errors.email.message}
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
                Đang gửi...
              </span>
            ) : (
              'Gửi link đặt lại mật khẩu'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-on-surface-variant mt-6">
          Quay lại{' '}
          <Link href="/dang-nhap" className="text-secondary hover:text-on-secondary-container font-medium transition-colors duration-fast">
            đăng nhập
          </Link>
        </p>
      </div>
    </main>
  );
}