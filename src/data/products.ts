import { PRODUCT_TIERS, AMBASSADOR_THRESHOLD } from '@/config/site';

// === Product Tier Definitions (FR-021) ===

export interface ProductTierData {
  slug: string;
  name: string;
  badge?: string;
  badgePosition: 'top-center' | 'top-left';
  isFeatured: boolean;
  description: string;
  priceRange: string;
  priceUnit: string;
  benefits: string[];
  specs: Array<{ label: string; value: string; valueType: 'text' | 'icon' | 'progress' }>;
  ctaHref: string;
  ctaLabel: string;
  imageAlt: string;
}

export const productTiers: ProductTierData[] = [
  {
    slug: 'seed-coral',
    name: 'Seed Coral',
    badge: 'Khởi Đầu',
    badgePosition: 'top-left',
    isFeatured: false,
    description:
      'Bắt đầu hành trình bảo tồn san hô với một bé san hô có tên riêng, được theo dõi định kỳ.',
    priceRange: '200.000 – 300.000đ',
    priceUnit: '/ San hô',
    benefits: [
      'Certificate kỹ thuật số (tên san hô, vị trí, ID)',
      'Cập nhật ảnh/video hàng tháng',
      'Dashboard cá nhân theo dõi growth',
      'Impact dashboard cá nhân',
      'Tham gia cộng đồng adopter',
    ],
    specs: [
      { label: 'Tăng Trưởng', value: '1.2x / Năm', valueType: 'text' },
      { label: 'Giấy Chứng Nhận', value: 'verified', valueType: 'icon' },
    ],
    ctaHref: '/thanh-toan?goi=seed-coral',
    ctaLabel: 'Nhận nuôi ngay',
    imageAlt: 'Seed Coral — San hô khởi đầu tại Nha Trang',
  },
  {
    slug: 'reef-guardian',
    name: 'Reef Guardian',
    badge: 'PHỔ BIẾN NHẤT',
    badgePosition: 'top-center',
    isFeatured: true,
    description:
      'Gói cao cấp với tracking chi tiết, premium video, GPS và báo cáo hàng quý.',
    priceRange: '500.000 – 700.000đ',
    priceUnit: '/ Năm',
    benefits: [
      'Toàn bộ quyền lợi Seed Coral',
      'Tracking growth chi tiết hơn (kích thước, sức khoẻ, môi trường)',
      'Premium video updates (chất lượng cao)',
      'GPS reef location (vùng tương đối)',
      'Báo cáo hàng quý chi tiết',
      'Ưu tiên hỗ trợ',
    ],
    specs: [
      { label: 'Tầm Ảnh Hưởng', value: 'Bán Kính 15m', valueType: 'text' },
      { label: 'Giám Sát AI', value: 'biotech', valueType: 'icon' },
      { label: 'Tiến Độ Phục Hồi', value: '75%', valueType: 'progress' },
    ],
    ctaHref: '/thanh-toan?goi=reef-guardian',
    ctaLabel: 'Nhận nuôi ngay',
    imageAlt: 'Reef Guardian — San hô cao cấp với AI monitoring tại Nha Trang',
  },
  {
    slug: 'diving-experience',
    name: 'Diving Experience',
    badge: 'Đại Sứ',
    badgePosition: 'top-left',
    isFeatured: false,
    description:
      'Trải nghiệm lặn thực tế tại Nha Trang, tự tay trồng san hô của mình.',
    priceRange: '1.000.000 – 2.000.000đ',
    priceUnit: '/ Năm',
    benefits: [
      'Toàn bộ quyền lợi Reef Guardian',
      '01 trải nghiệm lặn thực tế tại Nha Trang',
      'Tự tay trồng san hô của mình (có hướng dẫn viên)',
      'Video kỷ niệm chuyến lặn',
      'Ăn trưa cùng team',
    ],
    specs: [
      { label: 'Tham Quan', value: 'Hàng Năm', valueType: 'text' },
      { label: 'Quyền Đại Sứ', value: 'stars', valueType: 'icon' },
    ],
    ctaHref: '/thanh-toan?goi=diving-experience',
    ctaLabel: 'Nhận nuôi ngay',
    imageAlt: 'Diving Experience — Trải nghiệm lặn và trồng san hô tại Nha Trang',
  },
];

// === FAQ Items (FR-024) ===

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const faqItems: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'San hô của tôi có thật không?',
    answer:
      'Có, hoàn toàn thật. Mỗi san hô có một ID riêng, được nuôi trồng tại trung tâm đối tác ở Nha Trang. Nhân viên trung tâm chụp ảnh và cập nhật trạng thái hàng tháng.',
  },
  {
    id: 'faq-2',
    question: 'Tôi có được đến thăm san hô không?',
    answer:
      'Với gói Diving Experience, bạn có thể lặn xuống khu vực san hô. Với các gói khác, bạn có thể đặt thêm chuyến lặn riêng với chi phí bổ sung.',
  },
  {
    id: 'faq-3',
    question: 'Nếu san hô của tôi chết thì sao?',
    answer:
      'Tỉ lệ sống sót tại trung tâm > 85%. Nếu san hô không sống sót, chúng tôi sẽ trồng lại san hô mới và thông báo cho bạn — đây là cam kết của Coralume.',
  },
  {
    id: 'faq-4',
    question: 'Tôi có thể nhận nuôi nhiều san hô không?',
    answer:
      'Có. Trong dashboard của bạn, bạn có thể xem danh sách tất cả san hô đã nhận nuôi, mỗi bé có một tên riêng.',
  },
  {
    id: 'faq-5',
    question: 'Coralume có phải tổ chức từ thiện không?',
    answer:
      'Không. Coralume là dự án social impact với mô hình tài chính tự cân đối. 100% doanh thu sau chi phí vận hành được dùng cho việc trồng và chăm sóc san hô.',
  },
];

// === Comparison Table Features (FR-022) ===

export interface ComparisonFeature {
  name: string;
  values: [string, string, string]; // Seed Coral, Reef Guardian, Diving Experience
}

export const comparisonFeatures: ComparisonFeature[] = [
  {
    name: 'Certificate kỹ thuật số',
    values: ['✓', '✓', '✓'],
  },
  {
    name: 'Cập nhật ảnh/video hàng tháng',
    values: ['✓', '✓', '✓'],
  },
  {
    name: 'Dashboard cá nhân',
    values: ['✓', '✓', '✓'],
  },
  {
    name: 'GPS reef location',
    values: ['—', '✓', '✓'],
  },
  {
    name: 'Premium video updates',
    values: ['—', '✓', '✓'],
  },
  {
    name: 'Báo cáo hàng quý chi tiết',
    values: ['—', '✓', '✓'],
  },
  {
    name: 'Trải nghiệm lặn thực tế tại Nha Trang',
    values: ['—', '—', '✓'],
  },
  {
    name: 'Tự tay trồng san hô',
    values: ['—', '—', '✓'],
  },
];

/** Helper: get tier name from slug */
export function getTierName(slug: string): string {
  const tier = productTiers.find((t) => t.slug === slug);
  return tier?.name ?? slug;
}
