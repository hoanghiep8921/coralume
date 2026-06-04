'use client';

import { useState, useEffect, useCallback } from 'react';

interface SettingsForm {
  site_name: string;
  site_description: string;
  hero_headline: string;
  hero_subheadline: string;
  hero_cta: string;
  hero_cta_secondary: string;
  stat_1_label: string;
  stat_1_value: string;
  stat_2_label: string;
  stat_2_value: string;
  stat_3_label: string;
  stat_3_value: string;
  contact_email: string;
  contact_facebook: string;
  contact_instagram: string;
  partner_name: string;
  partner_link: string;
  cta_bottom_headline: string;
  about_mission: string;
  about_vision: string;
  transparency_text: string;
}

const EMPTY_FORM: SettingsForm = {
  site_name: '',
  site_description: '',
  hero_headline: '',
  hero_subheadline: '',
  hero_cta: '',
  hero_cta_secondary: '',
  stat_1_label: '',
  stat_1_value: '',
  stat_2_label: '',
  stat_2_value: '',
  stat_3_label: '',
  stat_3_value: '',
  contact_email: '',
  contact_facebook: '',
  contact_instagram: '',
  partner_name: '',
  partner_link: '',
  cta_bottom_headline: '',
  about_mission: '',
  about_vision: '',
  transparency_text: '',
};

const SECTIONS: { key: string; label: string; fields: (keyof SettingsForm)[] }[] = [
  {
    key: 'site',
    label: 'Thông tin site',
    fields: ['site_name', 'site_description'],
  },
  {
    key: 'hero',
    label: 'Hero Section',
    fields: ['hero_headline', 'hero_subheadline', 'hero_cta', 'hero_cta_secondary'],
  },
  {
    key: 'stats',
    label: 'Stats Section',
    fields: ['stat_1_label', 'stat_1_value', 'stat_2_label', 'stat_2_value', 'stat_3_label', 'stat_3_value'],
  },
  {
    key: 'contact',
    label: 'Liên hệ & Mạng xã hội',
    fields: ['contact_email', 'contact_facebook', 'contact_instagram'],
  },
  {
    key: 'partner',
    label: 'Đối tác',
    fields: ['partner_name', 'partner_link'],
  },
  {
    key: 'cta',
    label: 'CTA & Nội dung',
    fields: ['cta_bottom_headline', 'about_mission', 'about_vision', 'transparency_text'],
  },
];

const LABELS: Partial<Record<keyof SettingsForm, string>> = {
  site_name: 'Tên site',
  site_description: 'Mô tả site (SEO)',
  hero_headline: 'Hero Headline',
  hero_subheadline: 'Hero Sub-headline',
  hero_cta: 'Hero CTA chính',
  hero_cta_secondary: 'Hero CTA phụ',
  stat_1_label: 'Stat 1 — Label',
  stat_1_value: 'Stat 1 — Giá trị',
  stat_2_label: 'Stat 2 — Label',
  stat_2_value: 'Stat 2 — Giá trị',
  stat_3_label: 'Stat 3 — Label',
  stat_3_value: 'Stat 3 — Giá trị',
  contact_email: 'Email liên hệ',
  contact_facebook: 'Facebook URL',
  contact_instagram: 'Instagram URL',
  partner_name: 'Tên đối tác',
  partner_link: 'Link đối tác',
  cta_bottom_headline: 'CTA Bottom Headline',
  about_mission: 'About — Sứ mệnh',
  about_vision: 'About — Tầm nhìn',
  transparency_text: 'Cam kết minh bạch',
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SettingsForm>({ ...EMPTY_FORM });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeSection, setActiveSection] = useState('site');

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/settings');
      const json = await res.json();
      if (json.data) {
        setForm({ ...EMPTY_FORM, ...json.data });
      }
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const handleChange = (key: keyof SettingsForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/v1/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const json = await res.json();
        setMessage({ type: 'error', text: json.error || 'Lỗi khi lưu' });
        return;
      }
      setMessage({ type: 'success', text: 'Đã lưu cài đặt!' });
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({ type: 'error', text: 'Không thể kết nối' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-display font-bold text-primary mb-2">Cài đặt hệ thống</h1>
        <p className="text-on-surface-variant">Đang tải...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary">Cài đặt hệ thống</h1>
          <p className="text-sm text-on-surface-variant mt-1">Cấu hình text, hero, liên hệ và nội dung site</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-secondary text-on-secondary px-6 py-2.5 rounded-lg font-semibold text-sm disabled:opacity-50 hover:bg-secondary-container transition-colors"
        >
          {saving ? 'Đang lưu...' : 'Lưu tất cả'}
        </button>
      </div>

      {message && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-error-container text-error'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Section tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {SECTIONS.map((section) => (
          <button
            key={section.key}
            onClick={() => setActiveSection(section.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap border transition-colors ${
              activeSection === section.key
                ? 'bg-primary-container text-on-primary-container border-primary'
                : 'border-outline-variant text-on-surface-variant hover:border-primary'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Active section form */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6">
        {SECTIONS.filter((s) => s.key === activeSection).map((section) => (
          <div key={section.key} className="space-y-4">
            <h2 className="font-headline-md text-primary mb-4">{section.label}</h2>
            {section.fields.map((field) => (
              <div key={field}>
                <label
                  htmlFor={`setting-${field}`}
                  className="block text-sm font-medium text-on-surface mb-1"
                >
                  {LABELS[field] || field}
                </label>
                {field.includes('description') || field.includes('mission') || field.includes('vision') || field.includes('transparency') || field.includes('headline') && field.includes('bottom') || field.includes('subheadline') ? (
                  <textarea
                    id={`setting-${field}`}
                    value={form[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    rows={3}
                    className="block w-full rounded-lg border border-outline-variant px-3 py-2.5 text-sm outline-none focus:border-primary resize-vertical"
                  />
                ) : (
                  <input
                    id={`setting-${field}`}
                    type="text"
                    value={form[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="block w-full rounded-lg border border-outline-variant px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
