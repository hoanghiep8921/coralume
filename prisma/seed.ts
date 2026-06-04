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

  console.log('✅ Seed complete — 3 products created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
