# Performance & SEO Audit — 2026-06-05

**Đối chiếu:** Coralume-SRS.md §6.1 Performance & SEO
**Auditor:** Claude (automated codebase scan)
**Trạng thái:** 27 gaps found — 4 partially met, 0 fully met

---

## TỔNG QUAN KẾT QUẢ

| STT | Hạng mục SRS | Trạng thái | Gaps |
|-----|-------------|-----------|------|
| 1 | Lighthouse score > 85 | ⚠️ Partial | 9 gaps |
| 2 | Image optimization | ⚠️ Partial | 6 gaps |
| 3 | SEO (meta, OG, sitemap, robots, Schema.org) | ⚠️ Partial | 9 gaps |
| 4 | Analytics (GA4 + Meta Pixel) | ❌ Missing | 3 gaps |
| **Tổng** | | | **27 gaps** |

---

## 1. PAGE LOAD — Lighthouse Score > 85 (Performance, Accessibility, SEO)

### Điểm mạnh (đã có)
- ✅ Tailwind CSS v4 với `@import "tailwindcss"` — JIT compilation, bundle tối ưu
- ✅ next/font với `display: "swap"` cho 4 fonts (Lexend, Lora, Be Vietnam Pro, JetBrains Mono) — tốt cho CLS
- ✅ `<Image>` từ next/image trong ProductDetailCardsSection (fill + sizes + priority)
- ✅ SVG placeholders nhỏ (< 5 KB mỗi file)
- ✅ `antialiased` class trên body
- ✅ Sử dụng server components mặc định (Next.js App Router)

### Gaps

| # | Gap | Mức độ | Mô tả |
|---|-----|--------|-------|
| GC-01 | Thiếu `sharp` package | P0 | Không có `sharp` trong dependencies → Next.js fallback về Squoosh cho image optimization (chậm hơn trong production). Cần: `npm install sharp` |
| GC-02 | `next.config.ts` trống | P0 | Không cấu hình `imageSizes`, `deviceSizes`, `formats`, `minimumCacheTTL`, `remotePatterns`. Mất tối ưu image serving. |
| GC-03 | Chỉ 2 nơi dùng `next/image` | P1 | Toàn bộ codebase chỉ có ProductDetailCardsSection dùng `next/image`. Các ảnh khác (blog, community, dashboard, avatar, about) cần kiểm tra và migrate sang next/image. |
| GC-04 | Thiếu ISR/SSG cho static pages | P1 | Các trang như Home, About, Products, Blog listing không có `generateStaticParams` hoặc `revalidate` — mọi request đều render động. |
| GC-05 | Thiếu preconnect/preload | P2 | Không có `preconnect` cho external domains (CDN, fonts, API) — chậm kết nối ban đầu. |
| GC-06 | Thiếu font preloading | P2 | 4 fonts next/font với `display: swap` gây FOUT trên slow connections. Nên thêm `preload: true` cho fonts chính. |
| GC-07 | Thiếu Vercel Speed Insights | P2 | Không có `@vercel/speed-insights` để monitor Core Web Vitals trong production. |
| GC-08 | Không có `<link rel="preload">` cho hero image | P2 | Hero section (ảnh/video underwater) không được preload — ảnh hưởng LCP. |
| GC-09 | Thiếu lazy loading mặc định | P2 | Ngoài next/image (tự động lazy), các component khác có thể dùng `<img loading="lazy">` — chưa được audit toàn bộ. |

---

## 2. IMAGE OPTIMIZATION — Lazy Loading, WebP, Responsive srcset

### Điểm mạnh (đã có)
- ✅ `next/image` tự động WebP/AVIF conversion + responsive srcset
- ✅ SVG placeholders cho 3 sản phẩm (seed-coral, reef-guardian, diving-experience)
- ✅ `sizes` attribute trong ProductDetailCardsSection
- ✅ `priority` flag cho featured card
- ✅ `media.ts` helper với `resolveMediaUrl()` và `getProductPlaceholder()`

### Gaps

| # | Gap | Mức độ | Mô tả |
|---|-----|--------|-------|
| GC-10 | Thiếu `formats: ['image/avif', 'image/webp']` | P0 | next.config.ts không cấu hình formats → không generate AVIF (chỉ WebP mặc định). AVIF nhỏ hơn 20-30% so với WebP. |
| GC-11 | Thiếu `remotePatterns` cho CDN ảnh | P0 | Khi CLB cung cấp ảnh thật từ S3/CDN, next/image sẽ từ chối optimize vì không có remotePatterns. |
| GC-12 | Thiếu `blurDataURL` / blur placeholder | P1 | next/image có thể dùng `placeholder="blur"` + `blurDataURL` để hiển thị blur-up thay vì blank space khi load ảnh. |
| GC-13 | ProductImage component chỉ dùng trong Products page | P2 | Nên extract thành shared `<OptimizedImage>` component dùng toàn app (blog, dashboard, community). |
| GC-14 | Thiếu WebP/AVIF fallback strategy | P2 | Với ảnh từ CDN bên ngoài, không có fallback nếu browser không hỗ trợ format mới. |
| GC-15 | `next/image` fill không có `quality` config | P2 | Các ảnh fill không set `quality` — default 75. Có thể optimize thêm cho ảnh nhỏ. |

---

## 3. SEO — Meta tags, Open Graph, Sitemap, Robots.txt, Structured Data

### Điểm mạnh (đã có)
- ✅ Root layout: title template, description, keywords, authors, creator, Open Graph, Twitter Card, robots meta
- ✅ 15 pages có `generateMetadata` hoặc `metadata` export
- ✅ Blog detail: dynamic `generateMetadata` với Article OG type
- ✅ Schema.org Article (JSON-LD) trong BlogDetailClient
- ✅ `lang="vi"` trên `<html>`
- ✅ Products page: OG tags với URL, description
- ✅ siteConfig với centralized metadata

### Gaps

| # | Gap | Mức độ | P0 | Mô tả |
|---|-----|--------|-----|------|
| GC-16 | **KHÔNG có sitemap.xml** | P0 | Không có file `public/sitemap.xml`, không có `app/sitemap.ts`, không có `next-sitemap`. Bắt buộc cho SEO. |
| GC-17 | **KHÔNG có robots.txt** | P0 | Không có file `public/robots.txt`, không có `app/robots.ts`. Bắt buộc cho SEO. |
| GC-18 | Thiếu Schema.org Organization | P0 | Không có JSON-LD Organization (tên, url, logo, sameAs social links). Quan trọng cho brand recognition. |
| GC-19 | Thiếu Schema.org WebSite + SearchAction | P0 | Không có WebSite schema với SearchAction — mất Sitelinks Search Box trên Google. |
| GC-20 | Thiếu Schema.org BreadcrumbList | P1 | Các trang như Blog, Products không có breadcrumb structured data. |
| GC-21 | Thiếu Schema.org FAQPage | P1 | Products page có FAQ accordion nhưng không có FAQPage structured data. Google hiển thị FAQ rich results. |
| GC-22 | Thiếu Schema.org Product | P1 | Products page có 3 sản phẩm với giá nhưng không có Product schema với Offer. |
| GC-23 | Missing `og-image.jpg` | P0 | Root layout reference `/og-image.jpg` nhưng file không tồn tại trong `public/`. Tất cả social share sẽ hiển thị thiếu ảnh. |
| GC-24 | Thiếu canonical URLs | P1 | Không set `alternates.canonical` trong metadata — rủi ro duplicate content. |

---

## 4. ANALYTICS — Google Analytics 4 + Meta Pixel

### Điểm mạnh (đã có)
- ✅ Admin panel có Analytics page riêng (internal analytics)
- ✅ Admin API: `/api/v1/admin/analytics` với overview, userGrowth, revenueByTier, adoptionStatus, monthlyTrend

### Gaps

| # | Gap | Mức độ | P0 | Mô tả |
|---|-----|--------|-----|------|
| GC-25 | **KHÔNG có Google Analytics 4** | P0 | Không có GA4 script (gtag.js), không có `GA_MEASUREMENT_ID` env var, không có analytics component. SRS yêu cầu bắt buộc. |
| GC-26 | **KHÔNG có Meta Pixel** | P0 | Không có Facebook Pixel (fbq), không có `META_PIXEL_ID` env var. SRS yêu cầu cho remarketing FB ads. |
| GC-27 | Thiếu analytics wrapper | P2 | Nên có shared component `<Analytics />` dùng next/script với `strategy="afterInteractive"` cho cả GA4 và Meta Pixel. |

---

## PHÂN LOẠI THEO ĐỘ ƯU TIÊN

### P0 — Chặn go-live (8 gaps)
1. GC-01: Cài `sharp` package
2. GC-02: Cấu hình `next.config.ts` (formats, remotePatterns)
3. GC-10: Thêm `formats: ['image/avif', 'image/webp']`
4. GC-11: Thêm `remotePatterns` cho CDN ảnh
5. GC-16: Tạo `sitemap.xml` hoặc `app/sitemap.ts`
6. GC-17: Tạo `robots.txt` hoặc `app/robots.ts`
7. GC-23: Tạo file `public/og-image.jpg`
8. GC-25: Tích hợp Google Analytics 4
9. GC-26: Tích hợp Meta Pixel
10. GC-18: Schema.org Organization
11. GC-19: Schema.org WebSite + SearchAction

### P1 — Nên có trước go-live (6 gaps)
12. GC-03: Migrate toàn bộ `<img>` sang `next/image`
13. GC-04: ISR/SSG cho static pages
14. GC-12: Blur placeholder cho ảnh
15. GC-20: Schema.org BreadcrumbList
16. GC-21: Schema.org FAQPage
17. GC-22: Schema.org Product
18. GC-24: Canonical URLs

### P2 — Có thể defer sau go-live (9 gaps)
19. GC-05: Preconnect/preload optimization
20. GC-06: Font preloading
21. GC-07: Vercel Speed Insights
22. GC-08: Hero image preload
23. GC-09: Audit lazy loading toàn bộ
24. GC-13: Extract shared OptimizedImage component
25. GC-14: WebP/AVIF fallback strategy
26. GC-15: Quality config cho next/image
27. GC-27: Shared analytics wrapper component

---

## KẾ HOẠCH TRIỂN KHAI (Đề xuất)

### Phase 1: Critical Fixes (P0) — 4-6 giờ
1. Cài `sharp` + cấu hình `next.config.ts` (formats, remotePatterns, imageSizes)
2. Tạo `app/sitemap.ts` + `app/robots.ts` (Next.js built-in)
3. Tạo `public/og-image.jpg` (static image 1200×630)
4. Tạo `<Analytics />` component với GA4 + Meta Pixel
5. Thêm JSON-LD Organization + WebSite trong root layout

### Phase 2: Schema.org & Image (P1) — 3-4 giờ
6. Thêm Schema.org FAQPage cho Products page
7. Thêm Schema.org Product cho 3 gói
8. Thêm Schema.org BreadcrumbList
9. Thêm canonical URLs cho tất cả trang
10. Migrate `<img>` → `<Image>` ở các component còn lại

### Phase 3: Performance Polish (P2) — 2-3 giờ
11. ISR/SSG cho Home, About, Blog listing
12. Blur placeholder + preload cho hero image
13. Preconnect cho external domains
14. Shared OptimizedImage component

---

*Audit hoàn thành 2026-06-05. 27 gaps identified — 0 hạng mục fully met.*