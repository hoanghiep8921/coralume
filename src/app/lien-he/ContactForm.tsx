'use client';

import { useState, useCallback } from 'react';

/**
 * Contact form — posts to /api/v1/contact.
 * SRS 1.2: "Liên hệ qua form contact"
 */
export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const updateField = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus('loading');
      try {
        const res = await fetch('/api/v1/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (res.ok) {
          setStatus('success');
          setFeedback(data.data?.message || 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong 1-2 ngày làm việc.');
          setForm({ name: '', email: '', message: '' });
        } else {
          setStatus('error');
          setFeedback(data.error || 'Có lỗi xảy ra, vui lòng thử lại.');
        }
      } catch {
        setStatus('error');
        setFeedback('Không thể kết nối. Vui lòng thử lại sau.');
      }
    },
    [form]
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {status === 'success' && (
        <div className="p-4 bg-primary-container/10 border border-secondary/30 rounded-lg">
          <p className="text-primary font-body-md">{feedback}</p>
        </div>
      )}
      {status === 'error' && (
        <div className="p-4 bg-error-container/20 border border-error/30 rounded-lg">
          <p className="text-error font-body-md">{feedback}</p>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-name" className="font-label-sm text-on-surface">
          Họ tên <span className="text-error">*</span>
        </label>
        <input
          id="contact-name"
          type="text"
          value={form.name}
          onChange={updateField('name')}
          required
          minLength={2}
          placeholder="Nguyễn Văn A"
          className="px-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-email" className="font-label-sm text-on-surface">
          Email <span className="text-error">*</span>
        </label>
        <input
          id="contact-email"
          type="email"
          value={form.email}
          onChange={updateField('email')}
          required
          placeholder="email@example.com"
          className="px-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-message" className="font-label-sm text-on-surface">
          Tin nhắn <span className="text-error">*</span>
        </label>
        <textarea
          id="contact-message"
          value={form.message}
          onChange={updateField('message')}
          required
          minLength={10}
          rows={5}
          placeholder="Nội dung tin nhắn của bạn..."
          className="px-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface font-body-md resize-y focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3 rounded-lg bg-secondary text-on-secondary font-label-sm hover:bg-secondary-container hover:text-on-secondary-container transition-colors disabled:opacity-50"
      >
        {status === 'loading' ? 'Đang gửi...' : 'Gửi tin nhắn'}
      </button>
    </form>
  );
}
