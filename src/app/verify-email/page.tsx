'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Thiếu token xác thực. Vui lòng kiểm tra lại email.');
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch('/api/v1/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const json = await res.json();

        if (!res.ok) {
          setStatus('error');
          setMessage(json.error || 'Không thể xác thực email');
          return;
        }

        setStatus('success');
        setMessage(json.data.message || 'Email đã được xác thực thành công!');
      } catch {
        setStatus('error');
        setMessage('Không thể kết nối đến server');
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-card p-8 text-center">
      {/* Icon based on status */}
      <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
        status === 'success' ? 'bg-green-500/10' :
        status === 'error' ? 'bg-error-container' :
        'bg-on-tertiary-container/10'
      }`}>
        {status === 'checking' && (
          <svg className="animate-spin w-8 h-8 text-on-tertiary-container" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {status === 'success' && (
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
        {status === 'error' && (
          <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </div>

      <h2 className="font-display text-2xl font-bold text-primary mb-2">
        {status === 'checking' && 'Đang xác thực...'}
        {status === 'success' && 'Xác thực thành công!'}
        {status === 'error' && 'Xác thực không thành công'}
      </h2>

      {status !== 'success' && (
        <p className="text-on-surface-variant mb-6">{message}</p>
      )}

      {status === 'success' && (
        <>
          <p className="text-on-surface-variant mb-6">
            Tài khoản của bạn đã được kích hoạt.
          </p>
          <Link
            href="/dang-nhap"
            className="inline-block bg-secondary hover:bg-secondary-container text-on-secondary font-semibold py-3 px-6 rounded-lg transition-all duration-normal hover:-translate-y-0.5 shadow-button"
          >
            Đăng nhập
          </Link>
        </>
      )}

      {status === 'error' && (
        <div className="space-y-3">
          <p className="text-sm text-on-surface-variant">
            Token có thể đã hết hạn hoặc không hợp lệ.
          </p>
          <Link
            href="/dang-ky"
            className="inline-block bg-secondary hover:bg-secondary-container text-on-secondary font-semibold py-3 px-6 rounded-lg transition-all duration-normal hover:-translate-y-0.5 shadow-button"
          >
            Đăng ký lại
          </Link>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-surface px-4 py-12">
      <Suspense fallback={
        <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-card p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-on-tertiary-container/10 rounded-full flex items-center justify-center mb-4">
            <svg className="animate-spin w-8 h-8 text-on-tertiary-container" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <h2 className="font-display text-2xl font-bold text-primary mb-2">Đang tải...</h2>
        </div>
      }>
        <VerifyEmailContent />
      </Suspense>
    </main>
  );
}