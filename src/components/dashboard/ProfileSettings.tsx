'use client';

import { useState, useCallback, useRef } from 'react';
import { useInView } from '@/hooks/useInView';

interface ProfileData {
  fullName: string;
  phone?: string | null;
  avatarUrl?: string | null;
  isPublic: boolean;
  emailNotify: boolean;
}

interface ProfileSettingsProps {
  profile: ProfileData;
}

/** FR-047: Profile Settings — auto-save on blur */
export function ProfileSettings({ profile }: ProfileSettingsProps) {
  const { ref, isInView } = useInView(0.1);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [form, setForm] = useState({
    fullName: profile.fullName || '',
    phone: profile.phone || '',
    avatarUrl: profile.avatarUrl || '',
    isPublic: profile.isPublic,
    emailNotify: profile.emailNotify,
  });

  const autoSave = useCallback(
    async (field: string, value: string | boolean) => {
      // Clear previous debounce
      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(async () => {
        setSaving(true);
        setSaved(false);

        try {
          await fetch('/api/v1/me', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ [field]: value }),
          });
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        } catch {
          // Silently fail
        } finally {
          setSaving(false);
        }
      }, 500);
    },
    []
  );

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    autoSave(field, value);
  };

  return (
    <section
      ref={ref}
      className={`mb-12 transition-all duration-slow ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[20px]'
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-headline-md text-headline-md text-primary">
          Cài đặt tài khoản
        </h2>
        {/* Save indicator */}
        <span className={`text-xs font-label-sm flex items-center gap-1 transition-opacity duration-fast ${saving || saved ? 'opacity-100' : 'opacity-0'}`}>
          {saving ? (
            <span className="text-on-surface-variant">Đang lưu...</span>
          ) : saved ? (
            <span className="text-green-600">Đã lưu</span>
          ) : null}
        </span>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-card p-6 space-y-5">
        {/* Full Name */}
        <div className="space-y-1">
          <label htmlFor="profile-name" className="block text-sm font-medium text-on-surface">
            Tên hiển thị
          </label>
          <input
            id="profile-name"
            type="text"
            value={form.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className="block w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-base font-body text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-secondary/20 transition-colors duration-fast"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label htmlFor="profile-phone" className="block text-sm font-medium text-on-surface">
            Số điện thoại
          </label>
          <input
            id="profile-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="block w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-base font-body text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-secondary/20 transition-colors duration-fast"
          />
        </div>

        {/* Avatar URL */}
        <div className="space-y-1">
          <label htmlFor="profile-avatar" className="block text-sm font-medium text-on-surface">
            URL ảnh đại diện
          </label>
          <input
            id="profile-avatar"
            type="url"
            value={form.avatarUrl}
            onChange={(e) => handleChange('avatarUrl', e.target.value)}
            placeholder="https://..."
            className="block w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-base font-body text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-secondary/20 transition-colors duration-fast"
          />
        </div>

        {/* Toggles */}
        <div className="space-y-3 pt-2 border-t border-outline-variant/50">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-on-surface">Nhận email thông báo</span>
            <div
              role="switch"
              aria-checked={form.emailNotify}
              tabIndex={0}
              onClick={() => handleChange('emailNotify', !form.emailNotify)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleChange('emailNotify', !form.emailNotify);
                }
              }}
              className={`relative w-11 h-6 rounded-full transition-colors duration-fast ${
                form.emailNotify ? 'bg-secondary' : 'bg-outline-variant'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-fast ${
                  form.emailNotify ? 'translate-x-5' : ''
                }`}
              />
            </div>
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-on-surface">Hồ sơ công khai</span>
            <div
              role="switch"
              aria-checked={form.isPublic}
              tabIndex={0}
              onClick={() => handleChange('isPublic', !form.isPublic)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleChange('isPublic', !form.isPublic);
                }
              }}
              className={`relative w-11 h-6 rounded-full transition-colors duration-fast ${
                form.isPublic ? 'bg-secondary' : 'bg-outline-variant'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-fast ${
                  form.isPublic ? 'translate-x-5' : ''
                }`}
              />
            </div>
          </label>
        </div>
      </div>
    </section>
  );
}
