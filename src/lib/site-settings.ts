/**
 * Site settings — reads from DB with fallback to static defaults.
 * Use `getSiteSetting(key)` to read a single value.
 */
import { prisma } from '@/lib/db';
import { siteConfig } from '@/config/site';

// Default values mirroring src/config/site.ts
const DEFAULTS: Record<string, string> = {
  site_name: siteConfig.name,
  site_description: siteConfig.description,
  site_url: siteConfig.url,
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
  contact_email: siteConfig.links.email,
  contact_facebook: siteConfig.links.facebook,
  contact_instagram: siteConfig.links.instagram,
  partner_name: 'Trung tâm san hô Nha Trang',
  partner_link: '#',
  cta_bottom_headline: 'Sẵn sàng nhận nuôi san hô đầu tiên của bạn?',
  about_mission: 'Khuyến khích người trẻ có trách nhiệm với môi trường, kết nối họ trực tiếp với đại dương qua hành động nhận nuôi san hô.',
  about_vision: 'Phục hồi 10ha rạn san hô tại Việt Nam vào năm 2030 thông qua mô hình kinh tế bền vững.',
  transparency_text: '100% doanh thu sau chi phí vận hành được đầu tư trực tiếp vào hoạt động trồng và chăm sóc san hô.',
};

// Cache settings for 5 minutes to avoid DB hits on every request
let cache: { data: Record<string, string>; ts: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchAllSettings(): Promise<Record<string, string>> {
  if (cache && Date.now() - cache.ts < CACHE_TTL) return cache.data;

  try {
    const rows = await prisma.siteSetting.findMany();
    const data: Record<string, string> = { ...DEFAULTS };
    for (const row of rows) {
      data[row.key] = row.value;
    }
    cache = { data, ts: Date.now() };
    return data;
  } catch {
    return { ...DEFAULTS };
  }
}

export async function getSiteSetting(key: string): Promise<string> {
  const settings = await fetchAllSettings();
  return settings[key] || DEFAULTS[key] || '';
}

export async function getAllSiteSettings(): Promise<Record<string, string>> {
  return fetchAllSettings();
}

export function clearSettingsCache(): void {
  cache = null;
}
