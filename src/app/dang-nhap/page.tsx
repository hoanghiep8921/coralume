'use client';

import { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/lib/validation';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
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
          <Link href="/" className="font-display text-3xl font-bold text-primary">
            Coralume
          </Link>
          <p className="text-on-surface-variant mt-2">Đăng nhập vào tài khoản của bạn</p>
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

          {/* Password */}
          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-on-surface">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password')}
              className={`block w-full rounded-lg border px-3 py-2.5 text-base font-body transition-colors duration-fast
                ${errors.password
                  ? 'border-error focus:border-error'
                  : 'border-outline-variant focus:border-primary'
                }
                outline-none focus:ring-2 focus:ring-secondary/20`}
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            {errors.password && (
              <p id="password-error" className="text-sm text-error" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Forgot password link */}
          <div className="flex justify-end">
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
