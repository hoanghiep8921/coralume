'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CoralUpdateFormProps {
  coral: {
    id: string;
    code: string;
    species?: string;
    adoptions?: Array<{ user?: { fullName?: string } }>;
  };
}

export function UpdateForm({ coral }: CoralUpdateFormProps) {
  const router = useRouter();
  const [sizeCm, setSizeCm] = useState('');
  const [health, setHealth] = useState('good');
  const [notes, setNotes] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const adopter = coral.adoptions?.[0]?.user?.fullName || 'Chưa có';

  const addImageField = () => {
    if (imageUrls.length < 5) setImageUrls([...imageUrls, '']);
  };
  const updateImage = (i: number, val: string) => {
    const updated = [...imageUrls];
    updated[i] = val;
    setImageUrls(updated);
  };
  const removeImage = (i: number) => {
    if (imageUrls.length > 1) setImageUrls(imageUrls.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const images = imageUrls.filter((u) => u.trim());

    try {
      const res = await fetch('/api/v1/portal/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coralId: coral.id,
          sizeCm: sizeCm ? parseFloat(sizeCm) : undefined,
          health,
          notes: notes || undefined,
          images,
          videoUrl: videoUrl || undefined,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        setError(json.error || 'Có lỗi xảy ra');
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/coral-portal');
      }, 1500);
    } catch {
      setError('Không thể kết nối');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-surface-container-lowest rounded-xl p-8 text-center border border-outline-variant">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-headline-md text-primary mb-2">Đã cập nhật!</h2>
        <p className="text-on-surface-variant text-sm">Đang chuyển về trang chính...</p>
      </div>
    );
  }

  return (
    <div>
      <Link href="/coral-portal" className="text-sm text-on-tertiary-container mb-4 inline-block">
        ← Quay lại
      </Link>

      <h1 className="text-xl font-display font-bold text-primary mb-6">Cập nhật san hô</h1>

      {/* Coral info */}
      <div className="bg-surface-container-lowest rounded-lg p-4 border border-outline-variant mb-6">
        <div className="font-mono text-sm text-primary font-bold">{coral.code}</div>
        <div className="text-sm text-on-surface-variant">Loài: {coral.species || '—'}</div>
        <div className="text-sm text-on-surface-variant">Người nuôi: {adopter}</div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-error-container text-error text-sm px-4 py-3 rounded-lg" role="alert">{error}</div>
        )}

        {/* Size */}
        <div>
          <label htmlFor="size" className="block text-sm font-medium text-on-surface mb-1">
            Kích thước (cm)
          </label>
          <input
            id="size"
            type="number"
            step="0.1"
            value={sizeCm}
            onChange={(e) => setSizeCm(e.target.value)}
            className="block w-full rounded-lg border border-outline-variant px-3 py-2.5 text-base outline-none focus:border-primary"
            placeholder="VD: 12.5"
          />
        </div>

        {/* Health */}
        <div>
          <label className="block text-sm font-medium text-on-surface mb-1">Sức khoẻ</label>
          <div className="flex gap-2">
            {[
              { value: 'good', label: 'Tốt', color: 'bg-green-100 text-green-700 border-green-300' },
              { value: 'average', label: 'Trung bình', color: 'bg-amber-100 text-amber-700 border-amber-300' },
              { value: 'needs_attention', label: 'Cần chú ý', color: 'bg-red-100 text-red-700 border-red-300' },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setHealth(opt.value)}
                className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                  health === opt.value ? opt.color + ' border-2' : 'border-outline-variant bg-surface-container-lowest'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-on-surface mb-1">
            Ghi chú
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="block w-full rounded-lg border border-outline-variant px-3 py-2.5 text-base outline-none focus:border-primary resize-vertical"
            placeholder="Ghi chú về tình trạng san hô..."
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-on-surface mb-1">
            Ảnh ({imageUrls.length}/5)
          </label>
          <div className="space-y-2">
            {imageUrls.map((url, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => updateImage(i, e.target.value)}
                  className="flex-1 rounded-lg border border-outline-variant px-3 py-2.5 text-sm outline-none focus:border-primary"
                  placeholder={`URL ảnh ${i + 1} (S3 hoặc CDN)`}
                />
                {imageUrls.length > 1 && (
                  <button type="button" onClick={() => removeImage(i)} className="text-error px-2 text-sm">Xoá</button>
                )}
              </div>
            ))}
          </div>
          {imageUrls.length < 5 && (
            <button type="button" onClick={addImageField} className="text-secondary text-sm mt-2 font-medium">
              + Thêm ảnh
            </button>
          )}
        </div>

        {/* Video */}
        <div>
          <label htmlFor="video" className="block text-sm font-medium text-on-surface mb-1">
            Video URL (tuỳ chọn)
          </label>
          <input
            id="video"
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="block w-full rounded-lg border border-outline-variant px-3 py-2.5 text-sm outline-none focus:border-primary"
            placeholder="URL video (S3 hoặc CDN)"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-secondary text-on-secondary font-semibold py-3 px-4 rounded-lg disabled:opacity-50"
        >
          {submitting ? 'Đang lưu...' : 'Lưu cập nhật'}
        </button>

        <p className="text-xs text-on-surface-variant text-center">
          Lưu sẽ đồng bộ với dashboard người nhận nuôi
        </p>
      </form>
    </div>
  );
}
