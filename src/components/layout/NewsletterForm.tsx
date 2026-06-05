'use client';

import { useState, useCallback } from 'react';

/**
 * Newsletter signup form — embedded in Footer.
 * SRS 1.2: "Newsletter signup (footer)"
 */
export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus('loading');
      try {
        const res = await fetch('/api/v1/newsletter/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (res.ok) {
          setStatus('success');
          setMessage(data.data?.message || 'Đăng ký thành công!');
          setEmail('');
        } else {
          setStatus('error');
          setMessage(data.error || 'Có lỗi xảy ra');
        }
      } catch {
        setStatus('error');
        setMessage('Không thể kết nối. Vui lòng thử lại.');
      }
    },
    [email]
  );

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-headline-md text-headline-md text-on-primary">
        Nhận tin từ Coralume
      </h3>
      <p className="text-on-primary/70 font-body-md text-sm">
        Đăng ký để nhận cập nhật về san hô, sự kiện và câu chuyện từ cộng đồng.
      </p>
      {status === 'success' ? (
        <p className="text-secondary-fixed font-body-md text-sm animate-fade-in">
          {message}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm">
          <label htmlFor="newsletter-email" className="sr-only">
            Địa chỉ email
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            required
            className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-on-primary placeholder:text-on-primary/40 font-body-md text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-4 py-2 rounded-lg bg-secondary text-on-secondary font-label-sm hover:bg-secondary-container hover:text-on-secondary-container transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? '...' : 'Đăng ký'}
          </button>
        </form>
      )}
      {status === 'error' && (
        <p className="text-error text-sm">{message}</p>
      )}
    </div>
  );
}
