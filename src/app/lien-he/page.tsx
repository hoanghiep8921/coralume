import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = {
  title: 'Liên Hệ — Coralume',
  description:
    'Liên hệ với Coralume để được tư vấn về nhận nuôi san hô, hợp tác, hoặc bất kỳ câu hỏi nào.',
  openGraph: {
    title: 'Coralume — Liên Hệ',
    description: 'Liên hệ với Coralume — Chúng tôi luôn sẵn sàng lắng nghe.',
    url: `${siteConfig.url}/lien-he`,
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <main className="flex-1 bg-surface pt-24 pb-16 px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
      <div className="max-w-2xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <span className="text-secondary font-label-sm uppercase tracking-widest mb-3 block">
            Liên hệ
          </span>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-primary mb-4">
            Liên hệ với chúng tôi
          </h1>
          <p className="font-body-lg text-on-surface-variant">
            Bạn có câu hỏi về nhận nuôi san hô, hợp tác, hoặc muốn chia sẻ ý
            tưởng? Hãy gửi tin nhắn cho chúng tôi.
          </p>
        </div>

        {/* Form */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 md:p-8">
          <ContactForm />
        </div>

        {/* Alternative contact methods */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-surface-container-lowest rounded-xl border border-outline-variant">
            <span
              className="material-symbols-outlined text-3xl text-secondary mb-3"
              aria-hidden="true"
            >
              mail
            </span>
            <h3 className="font-headline-md text-primary mb-1">Email</h3>
            <a
              href="mailto:hello@coralume.vn"
              className="text-on-surface-variant hover:text-secondary transition-colors font-body-md"
            >
              hello@coralume.vn
            </a>
          </div>
          <div className="text-center p-6 bg-surface-container-lowest rounded-xl border border-outline-variant">
            <span
              className="material-symbols-outlined text-3xl text-secondary mb-3"
              aria-hidden="true"
            >
              location_on
            </span>
            <h3 className="font-headline-md text-primary mb-1">Địa chỉ</h3>
            <p className="text-on-surface-variant font-body-md">
              Nha Trang, Khánh Hòa, Việt Nam
            </p>
          </div>
          <div className="text-center p-6 bg-surface-container-lowest rounded-xl border border-outline-variant">
            <span
              className="material-symbols-outlined text-3xl text-secondary mb-3"
              aria-hidden="true"
            >
              schedule
            </span>
            <h3 className="font-headline-md text-primary mb-1">Giờ làm việc</h3>
            <p className="text-on-surface-variant font-body-md">
              Thứ 2 — Thứ 6: 8:00 — 17:00
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
