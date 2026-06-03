'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@/lib/validation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerifyInfo, setShowVerifyInfo] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      phone: '',
      agreeTerms: false,
    },
  });

  const password = watch('password', '');

  // Password strength meter
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

  const onSubmit = async (data: RegisterInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || 'Có lỗi xảy ra');
        return;
      }

      setShowVerifyInfo(true);
    } catch {
      setError('Không thể kết nối đến server');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showVerifyInfo) {
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
            Chúng tôi đã gửi link xác thực đến email của bạn.
            Vui lòng click vào link đó để kích hoạt tài khoản.
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
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-3xl font-bold text-primary">
            Coralume
          </Link>
          <p className="text-on-surface-variant mt-2">Tạo tài khoản mới</p>
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

          {/* Full Name */}
          <div className="space-y-1">
            <label htmlFor="fullName" className="block text-sm font-medium text-on-surface">
              Họ và tên
            </label>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              {...register('fullName')}
              className={`block w-full rounded-lg border px-3 py-2.5 text-base font-body transition-colors duration-fast
                ${errors.fullName
                  ? 'border-error focus:border-error'
                  : 'border-outline-variant focus:border-primary'
                }
                outline-none focus:ring-2 focus:ring-secondary/20`}
              placeholder="Nguyễn Văn A"
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            />
            {errors.fullName && (
              <p id="fullName-error" className="text-sm text-error" role="alert">
                {errors.fullName.message}
              </p>
            )}
          </div>

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

          {/* Phone */}
          <div className="space-y-1">
            <label htmlFor="phone" className="block text-sm font-medium text-on-surface">
              Số điện thoại <span className="text-on-surface-variant">(tuỳ chọn)</span>
            </label>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              {...register('phone')}
              className={`block w-full rounded-lg border px-3 py-2.5 text-base font-body transition-colors duration-fast
                ${errors.phone
                  ? 'border-error focus:border-error'
                  : 'border-outline-variant focus:border-primary'
                }
                outline-none focus:ring-2 focus:ring-secondary/20`}
              placeholder="0901234567"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
            />
            {errors.phone && (
              <p id="phone-error" className="text-sm text-error" role="alert">
                {errors.phone.message}
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
              autoComplete="new-password"
              {...register('password')}
              className={`block w-full rounded-lg border px-3 py-2.5 text-base font-body transition-colors duration-fast
                ${errors.password
                  ? 'border-error focus:border-error'
                  : 'border-outline-variant focus:border-primary'
                }
                outline-none focus:ring-2 focus:ring-secondary/20`}
              placeholder="Tối thiểu 8 ký tự"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            {errors.password && (
              <p id="password-error" className="text-sm text-error" role="alert">
                {errors.password.message}
              </p>
            )}
            {/* Password strength meter */}
            {password && (
              <div className="space-y-1">
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

          {/* Terms */}
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
              <span className="text-on-tertiary-container hover:underline">điều khoản sử dụng</span>{' '}
              của Coralume
            </label>
          </div>
          {errors.agreeTerms && (
            <p id="terms-error" className="text-sm text-error" role="alert">
              {errors.agreeTerms.message}
            </p>
          )}

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
                Đang tạo tài khoản...
              </span>
            ) : (
              'Đăng ký'
            )}
          </button>
        </form>

        {/* Login link */}
        <p className="text-center text-sm text-on-surface-variant mt-6">
          Đã có tài khoản?{' '}
          <Link href="/dang-nhap" className="text-secondary hover:text-on-secondary-container font-medium transition-colors duration-fast">
            Đăng nhập
          </Link>
        </p>
      </div>
    </main>
  );
}
