'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { communitySubmissionSchema, type CommunitySubmissionInput } from '@/lib/validation';

interface Submission {
  id: string;
  content: string;
  images: string[];
  createdAt: string;
  user: { fullName: string; isPublic: boolean };
}

export function CommunityClient({ submissions }: { submissions: Submission[] }) {
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState(submissions);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommunitySubmissionInput>({
    resolver: zodResolver(communitySubmissionSchema),
    defaultValues: { content: '', images: [] },
  });

  const onSubmit = async (data: CommunitySubmissionInput) => {
    setError(null);
    try {
      const res = await fetch('/api/v1/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json();
        setError(json.error || 'Có lỗi xảy ra');
        return;
      }
      setSubmitted(true);
      setShowForm(false);
      reset();
      setTimeout(() => setSubmitted(false), 3000);
    } catch {
      setError('Không thể kết nối');
    }
  };

  return (
    <div>
      {/* Submit CTA */}
      <div className="text-center mb-10">
        {submitted ? (
          <div className="bg-green-100 text-green-700 px-6 py-4 rounded-xl inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Đã gửi! Bài viết của bạn đang chờ admin duyệt.
          </div>
        ) : (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-secondary hover:bg-secondary-container text-on-secondary font-semibold px-6 py-3 rounded-lg transition-all shadow-button"
          >
            {showForm ? 'Huỷ' : 'Chia sẻ câu chuyện của bạn'}
          </button>
        )}
      </div>

      {/* Submit Form */}
      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-surface-container-lowest rounded-xl p-6 shadow-card border border-outline-variant mb-10 max-w-lg mx-auto space-y-4">
          {error && <div className="bg-error-container text-error text-sm px-4 py-3 rounded-lg" role="alert">{error}</div>}

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-on-surface mb-1">Câu chuyện của bạn</label>
            <textarea
              id="content"
              {...register('content')}
              rows={4}
              className="block w-full rounded-lg border border-outline-variant px-3 py-2.5 text-base outline-none focus:border-primary"
              placeholder="Chia sẻ hành trình nhận nuôi san hô của bạn..."
            />
            {errors.content && <p className="text-sm text-error mt-1">{errors.content.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">URL ảnh</label>
            <input
              type="url"
              placeholder="https://example.com/anh.jpg"
              onChange={(e) => {
                const val = e.target.value;
                register('images').onChange({ target: { value: val ? [val] : [] } });
              }}
              className="block w-full rounded-lg border border-outline-variant px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
            <p className="text-xs text-on-surface-variant mt-1">Dán URL ảnh của bạn (từ S3, CDN...)</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-on-primary font-semibold py-3 rounded-lg disabled:opacity-50"
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi bài viết'}
          </button>
          <p className="text-xs text-on-surface-variant text-center">Bài viết sẽ được admin duyệt trước khi hiển thị</p>
        </form>
      )}

      {/* Masonry Grid */}
      {items.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl text-on-surface-variant/40" aria-hidden="true">forum</span>
          </div>
          <p className="text-on-surface-variant text-lg">Chưa có câu chuyện nào. Hãy là người đầu tiên chia sẻ!</p>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden break-inside-avoid">
              {item.images[0] && (
                <button
                  type="button"
                  onClick={() => setPreviewImage(item.images[0])}
                  className="w-full"
                >
                  <img src={item.images[0]} alt="" className="w-full object-cover hover:scale-105 transition-transform duration-500" />
                </button>
              )}
              <div className="p-5">
                <p className="text-on-surface text-sm mb-3 leading-relaxed">{item.content}</p>
                <div className="flex items-center justify-between text-xs text-on-surface-variant">
                  <span>{item.user.isPublic ? item.user.fullName : 'Người ẩn danh'}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Lightbox */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <button
            type="button"
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 text-white text-2xl"
            aria-label="Đóng"
          >
            ✕
          </button>
          <img src={previewImage} alt="" className="max-w-full max-h-[90vh] rounded-lg object-contain" />
        </div>
      )}
    </div>
  );
}
