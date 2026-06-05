'use client';

import Link from 'next/link';
import { useInView } from '@/hooks/useInView';

interface ProductCardProps {
  name: string;
  priceRange: string;
  benefits: string[];
  slug: string;
  badge?: string;
  isFeatured?: boolean;
  index: number;
  isInView: boolean;
}

function ProductCard({
  name,
  priceRange,
  benefits,
  slug,
  badge,
  isFeatured,
  index,
  isInView,
}: ProductCardProps) {
  return (
    <div
      className={`relative bg-surface-container-lowest rounded-xl border transition-all duration-normal hover:-translate-y-2 hover:shadow-card-hover ${
        isFeatured
          ? 'border-secondary shadow-card'
          : 'border-outline-variant shadow-card'
      } ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'}`}
      style={{ transitionDelay: isInView ? `${index * 100}ms` : '0ms' }}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute top-0 right-4 -translate-y-1/2">
          <span className="bg-secondary text-on-secondary text-xs font-semibold px-3 py-1 rounded-full shadow-button">
            {badge}
          </span>
        </div>
      )}

      <div className="p-6 md:p-8">
        {/* Name */}
        <h3 className="font-display text-xl font-bold text-primary mb-2">{name}</h3>

        {/* Price */}
        <p className="text-secondary text-2xl font-bold font-mono mb-6">{priceRange}</p>

        {/* Benefits */}
        <ul className="space-y-3 mb-8">
          {benefits.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-on-surface">
              <svg className="w-5 h-5 text-on-tertiary-container flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href={`/san-pham?goi=${slug}`}
          className={`block text-center font-semibold py-3 px-6 rounded-lg transition-all duration-normal hover:-translate-y-0.5 ${
            isFeatured
              ? 'bg-secondary hover:bg-secondary-container text-on-secondary shadow-button'
              : 'border-2 border-primary text-primary hover:bg-primary hover:text-on-primary'
          }`}
        >
          Nhận nuôi ngay →
        </Link>
      </div>
    </div>
  );
}

/**
 * FR-004: Products Preview Section
 * 3 gói cards preview với hover animation
 * Updated to Stitch Material Design 3 tokens
 */
export function ProductsPreviewSection() {
  const { ref, isInView } = useInView(0.15, '-50px');

  const products = [
    {
      name: 'Seed Coral',
      priceRange: '200.000 – 300.000đ',
      slug: 'seed-coral',
      benefits: [
        'Certificate kỹ thuật số',
        'Cập nhật ảnh/video hàng tháng',
        'Dashboard cá nhân theo dõi growth',
        'Impact dashboard cá nhân',
        'Tham gia cộng đồng adopter',
      ],
    },
    {
      name: 'Reef Guardian',
      priceRange: '500.000 – 700.000đ',
      slug: 'reef-guardian',
      badge: 'Phổ biến nhất',
      isFeatured: true,
      benefits: [
        'Toàn bộ Seed Coral +',
        'Tracking growth chi tiết hơn',
        'Premium video updates',
        'GPS reef location',
        'Báo cáo hàng quý chi tiết',
        'Ưu tiên hỗ trợ',
      ],
    },
    {
      name: 'Diving Experience',
      priceRange: '1.000.000 – 2.000.000đ',
      slug: 'diving-experience',
      badge: 'Trải nghiệm thật',
      benefits: [
        'Toàn bộ Reef Guardian +',
        '01 trải nghiệm lặn thực tế tại Nha Trang',
        'Tự tay trồng san hô của mình',
        'Video kỷ niệm chuyến lặn',
        'Ăn trưa cùng team',
      ],
    },
  ];

  return (
    <section className="py-24 bg-surface-container-lowest" ref={ref}>
      <div className="container">
        {/* Section Title */}
        <div
          className={`text-center max-w-2xl mx-auto mb-10 md:mb-14 transition-all duration-slow ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'
          }`}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-4">
            Chọn cách bạn đồng hành
          </h2>
          <p className="text-on-surface-variant text-lg">
            Mỗi gói là một mức cam kết và một mức trải nghiệm khác nhau. Tất cả đều bắt đầu bằng một san hô có tên — của riêng bạn.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {products.map((p, i) => (
            <ProductCard key={p.slug} {...p} index={i} isInView={isInView} />
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-10">
          <Link
            href="/san-pham"
            className="inline-block text-on-tertiary-container hover:text-primary font-medium transition-colors duration-fast underline underline-offset-4"
          >
            Xem chi tiết và so sánh các gói →
          </Link>
        </div>
      </div>
    </section>
  );
}