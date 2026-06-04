import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed product tiers
  const products = [
    {
      slug: 'seed-coral',
      name: 'Seed Coral',
      tier: 'standard' as const,
      priceMin: 200000,
      priceMax: 300000,
      description: 'Bắt đầu hành trình bảo tồn san hô với một bé san hô có tên riêng.',
      benefits: [
        'Certificate kỹ thuật số (tên san hô, vị trí, ID)',
        'Cập nhật ảnh/video hàng tháng',
        'Dashboard cá nhân theo dõi growth',
        'Impact dashboard cá nhân',
        'Tham gia cộng đồng adopter',
      ],
      isActive: true,
    },
    {
      slug: 'reef-guardian',
      name: 'Reef Guardian',
      tier: 'premium' as const,
      priceMin: 500000,
      priceMax: 700000,
      description: 'Gói cao cấp với tracking chi tiết, premium video, GPS và báo cáo hàng quý.',
      benefits: [
        'Toàn bộ quyền lợi Seed Coral',
        'Tracking growth chi tiết hơn',
        'Premium video updates',
        'GPS reef location',
        'Báo cáo hàng quý chi tiết',
        'Ưu tiên hỗ trợ',
      ],
      isActive: true,
    },
    {
      slug: 'diving-experience',
      name: 'Diving Experience',
      tier: 'premium_plus' as const,
      priceMin: 1000000,
      priceMax: 2000000,
      description: 'Trải nghiệm lặn thực tế tại Nha Trang, tự tay trồng san hô của mình.',
      benefits: [
        'Toàn bộ quyền lợi Reef Guardian',
        '01 trải nghiệm lặn thực tế tại Nha Trang',
        'Tự tay trồng san hô của mình',
        'Video kỷ niệm chuyến lặn',
        'Ăn trưa cùng team',
      ],
      isActive: true,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
    console.log(`✓ ${product.name}`);
  }

  // Seed default site settings
  const siteSettings = {
    site_name: 'Coralume',
    site_description: 'Nhận nuôi san hô — Gieo mầm cho đại dương',
    hero_headline: 'Nhận nuôi san hô — Gieo mầm cho đại dương',
    hero_subheadline: 'Mỗi san hô bạn nhận nuôi là một hành động thiết thực bảo vệ đại dương',
    hero_cta: 'Nhận nuôi ngay',
    hero_cta_secondary: 'Tìm hiểu thêm',
    stat_1_label: 'Diện tích đáy biển san hô chiếm',
    stat_1_value: '< 1%',
    stat_2_label: 'Sinh vật biển phụ thuộc vào san hô',
    stat_2_value: '25%',
    stat_3_label: 'Diện tích rạn san hô đã mất từ 1950',
    stat_3_value: '50%',
    contact_email: 'hello@coralume.vn',
    contact_facebook: 'https://facebook.com/coralume_official',
    contact_instagram: 'https://instagram.com/coralume_official',
    partner_name: 'Trung tâm san hô Nha Trang',
    partner_link: '#',
    cta_bottom_headline: 'Sẵn sàng nhận nuôi san hô đầu tiên của bạn?',
    about_mission: 'Khuyến khích người trẻ có trách nhiệm với môi trường, kết nối họ trực tiếp với đại dương qua hành động nhận nuôi san hô.',
    about_vision: 'Phục hồi 10ha rạn san hô tại Việt Nam vào năm 2030 thông qua mô hình kinh tế bền vững.',
    transparency_text: '100% doanh thu sau chi phí vận hành được đầu tư trực tiếp vào hoạt động trồng và chăm sóc san hô.',
  };

  for (const [key, value] of Object.entries(siteSettings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    console.log(`  ⚙ ${key}`);
  }

  console.log('✅ Seed complete — 3 products + 21 site settings');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
