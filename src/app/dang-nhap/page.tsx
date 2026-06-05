'use client';

import { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/lib/validation';
import { PasswordInput } from '@/components/ui/PasswordInput';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

const OAUTH_ERRORS: Record<string, string> = {
  google_oauth_not_configured: 'Đăng nhập Google chưa được cấu hình.',
  google_auth_failed: 'Đăng nhập Google thất bại. Vui lòng thử lại.',
  google_token_exchange_failed: 'Xác thực Google không thành công.',
  google_id_token_invalid: 'Token Google không hợp lệ.',
  google_id_token_issuer: 'Token Google không đúng issuer.',
  google_id_token_audience: 'Token Google không đúng audience.',
  google_csrf_mismatch: 'Phiên đăng nhập không hợp lệ. Vui lòng thử lại.',
  google_userinfo_failed: 'Không thể lấy thông tin từ Google.',
  google_email_missing: 'Tài khoản Google không có email.',
  google_server_error: 'Lỗi server khi đăng nhập Google.',
  account_blocked: 'Tài khoản đã bị khóa.',
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Handle OAuth errors from URL
  useEffect(() => {
    const oauthError = searchParams.get('error');
    if (oauthError) {
      setError(OAUTH_ERRORS[oauthError] || 'Có lỗi xảy ra khi đăng nhập.');
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    mode: 'onChange', // ← Real-time validation
  });

  const onSubmit = async (data: LoginInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || 'Có lỗi xảy ra');
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError('Không thể kết nối đến server');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl text-on-primary">water_drop</span>
          </div>
          <Link href="/" className="font-display text-3xl font-bold text-primary">
            Coralume
          </Link>
          <p className="text-on-surface-variant mt-2">Đăng nhập vào tài khoản của bạn</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-surface-container-low rounded-2xl shadow-[0px_10px_40px_rgba(15,76,92,0.08)] p-8 space-y-5"
          noValidate
        >
          {error && (
            <div className="bg-error-container border border-error/20 text-error text-sm rounded-lg px-4 py-3" role="alert">
              {error}
            </div>
          )}

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

          {/* Password with visibility toggle */}
          <PasswordInput
            id="password"
            label="Mật khẩu"
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          {/* Row: Remember me + Forgot password */}
          <div className="flex items-center justify-between">
            <label htmlFor="rememberMe" className="flex items-center gap-2 text-sm text-on-surface-variant cursor-pointer">
              <input
                id="rememberMe"
                type="checkbox"
                {...register('rememberMe')}
                className="h-4 w-4 rounded border-outline-variant text-secondary focus:ring-secondary/20 cursor-pointer"
              />
              Ghi nhớ đăng nhập
            </label>
            <Link
              href="/quen-mat-khau"
              className="text-sm text-on-tertiary-container hover:text-primary transition-colors duration-fast"
            >
              Quên mật khẩu?
            </Link>
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
                Đang đăng nhập...
              </span>
            ) : (
              'Đăng nhập'
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-outline-variant" />
            <span className="text-xs text-on-surface-variant font-medium">hoặc</span>
            <div className="flex-1 h-px bg-outline-variant" />
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={() => {
              setIsGoogleLoading(true);
              const redirectTo = `/api/v1/auth/google?callbackUrl=${encodeURIComponent(callbackUrl)}`;
              window.location.href = redirectTo;
            }}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-2.5 bg-surface-container-low hover:bg-surface-container border border-outline-variant text-on-surface font-medium py-2.5 px-4 rounded-lg transition-all duration-fast hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isGoogleLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Đang chuyển hướng...
              </span>
            ) : (
              <>
                {/* Google "G" icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Đăng nhập bằng Google
              </>
            )}
          </button>
        </form>

        {/* Register link */}
        <p className="text-center text-sm text-on-surface-variant mt-6">
          Chưa có tài khoản?{' '}
          <Link href="/dang-ky" className="text-secondary hover:text-on-secondary-container font-medium transition-colors duration-fast">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-surface">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
