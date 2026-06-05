'use client';

import { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/validation';
import { PasswordInput } from '@/components/ui/PasswordInput';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const password = watch('password', '');

  // Password strength meter (same logic as register page)
  const getPasswordStrength = (pw: string): { level: number; label: string; color: string } => {
    if (!pw) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { level: 1, label: 'Yếu', color: 'bg-error' };
    if (score <= 2) return { level: 2, label: 'Trung bình', color: 'bg-amber-500' };
    if (score <= 3) return { level: 3, label: 'Khá', color: 'bg-on-tertiary-container' };
    return { level: 4, label: 'Mạnh', color: 'bg-green-500' };
  };

  const strength = getPasswordStrength(password);

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!token) {
      setError('Thiếu token đặt lại mật khẩu. Vui lòng yêu cầu lại từ email.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || 'Không thể đặt lại mật khẩu');
        return;
      }

      setIsSuccess(true);
    } catch {
      setError('Không thể kết nối đến server');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Missing token state
  if (!token && !isSuccess) {
    return (
      <main className="flex min-h-screen flex-1 items-center justify-center bg-surface px-4 py-12">
        <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-card p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-error-container rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="font-display text-2xl font-bold text-primary mb-2">
            Link không hợp lệ
          </h2>
          <p className="text-on-surface-variant mb-6">
            Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
            Vui lòng yêu cầu link mới.
          </p>
          <Link
            href="/quen-mat-khau"
            className="inline-block bg-secondary hover:bg-secondary-container text-on-secondary font-semibold py-3 px-6 rounded-lg transition-all duration-normal hover:-translate-y-0.5 shadow-button"
          >
            Yêu cầu link mới
          </Link>
        </div>
      </main>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <main className="flex min-h-screen flex-1 items-center justify-center bg-surface px-4 py-12">
        <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-card p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-display text-2xl font-bold text-primary mb-2">
            Đặt lại mật khẩu thành công!
          </h2>
          <p className="text-on-surface-variant mb-6">
            Mật khẩu của bạn đã được cập nhật. Hãy đăng nhập bằng mật khẩu mới.
          </p>
          <Link
            href="/dang-nhap"
            className="inline-block bg-secondary hover:bg-secondary-container text-on-secondary font-semibold py-3 px-6 rounded-lg transition-all duration-normal hover:-translate-y-0.5 shadow-button"
          >
            Đăng nhập
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl text-on-primary">lock_reset</span>
          </div>
          <Link href="/" className="font-display text-3xl font-bold text-primary">
            Coralume
          </Link>
          <p className="text-on-surface-variant mt-2">Đặt lại mật khẩu mới</p>
        </div>

        {/* Form */}
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
            Nhập mật khẩu mới cho tài khoản của bạn.
          </p>

          {/* New Password */}
          <div className="space-y-1">
            <PasswordInput
              id="password"
              label="Mật khẩu mới"
              autoComplete="new-password"
              placeholder="Tối thiểu 8 ký tự"
              error={errors.password?.message}
              {...register('password')}
            />
            {/* Password strength meter */}
            {password && (
              <div className="space-y-1 pt-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors duration-fast ${
                        i <= strength.level ? strength.color : 'bg-outline-variant'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-on-surface-variant">Độ mạnh: {strength.label}</p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <PasswordInput
            id="confirmPassword"
            label="Xác nhận mật khẩu mới"
            autoComplete="new-password"
            placeholder="Nhập lại mật khẩu mới"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

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
                Đang cập nhật...
              </span>
            ) : (
              'Đặt lại mật khẩu'
            )}
          </button>
        </form>

        {/* Back to login */}
        <p className="text-center text-sm text-on-surface-variant mt-6">
          <Link href="/dang-nhap" className="text-secondary hover:text-on-secondary-container font-medium transition-colors duration-fast">
            ← Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center bg-surface">
        <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-card p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-on-tertiary-container/10 rounded-full flex items-center justify-center mb-4">
            <svg className="animate-spin w-8 h-8 text-on-tertiary-container" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <h2 className="font-display text-2xl font-bold text-primary mb-2">Đang tải...</h2>
        </div>
      </main>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
