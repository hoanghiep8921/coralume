---
name: create-page
description: Tạo trang mới cho Coralume — BẮT BUỘC dùng Stitch MCP lấy Figma design trước, sau đó code theo design tokens
tools: Read, Write, Edit, Bash, Glob, Grep, mcp__stitch
---

## BẮT BUỘC: Dùng Stitch MCP trước khi code

**MỌI trang UI PHẢI được lấy từ Figma qua Stitch MCP trước khi code.**
Không được code trang từ spec text — luôn lấy design từ Stitch MCP trước.

### Workflow
1. Dùng Stitch MCP lấy page/screen từ Figma
2. Extract design tokens, layout structure
3. Cross-reference với `context/ui-context.md`
4. Scaffold page theo Stitch design
5. Verify với Stitch screenshot

---

## Create Page

### 1. Route Structure (Next.js App Router)

```
src/app/
├── (public)/
│   ├── page.tsx                    # Home
│   ├── ve-chung-toi/page.tsx       # About
│   ├── san-pham/page.tsx           # Products
│   ├── blog/page.tsx               # Blog listing
│   ├── blog/[slug]/page.tsx        # Blog detail
│   ├── bang-xep-hang/page.tsx      # Leaderboard
│   └── cong-dong/page.tsx          # Community
├── (auth)/
│   ├── dang-nhap/page.tsx          # Login
│   ├── dang-ky/page.tsx            # Register
│   ├── quen-mat-khau/page.tsx      # Forgot password
│   └── verify-email/page.tsx       # Email verification
├── (dashboard)/
│   ├── dashboard/page.tsx          # Adopter dashboard
│   └── profile/page.tsx            # Profile settings
├── (checkout)/
│   ├── thanh-toan/page.tsx         # Checkout
│   └── thanh-cong/page.tsx         # Success
├── admin/page.tsx                  # Admin panel
└── coral-portal/page.tsx           # Coral staff portal
```

### 2. SEO Metadata Pattern

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trang Chủ — Coralume',
  description: 'Nhận nuôi san hô — Gieo mầm cho đại dương. Theo dõi san hô của bạn qua dashboard.',
  openGraph: {
    title: '...',
    description: '...',
    url: 'https://coralume.vn/...',
    type: 'website',
  },
};
```

### 3. Page Layout Pattern

```tsx
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = { ... };

export default function PageName() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Sections go here */}
      </main>
      <Footer />
    </>
  );
}
```

### 4. Section Pattern

```tsx
// Each section is a separate component in src/components/sections/
export function SectionName() {
  return (
    <section className="section-padding bg-white">
      <div className="container">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-heading mb-6">
          Tiêu đề section
        </h2>
        <p className="text-text-secondary text-lg max-w-2xl">
          Mô tả section
        </p>
        {/* content */}
      </div>
    </section>
  );
}
```

### 5. Page Content Rules

**Home:** Hero (video/ảnh) → Stats count-up → How it works (3 steps) → Products preview → Partners → CTA banner → Footer

**About:** Hero (text reveal) → Mission → Founder story → Team grid → Process timeline → Commitment → CTA

**Products:** Hero → 3 gói chi tiết → Bảng so sánh → Referral/Ambassador → FAQ accordion → CTA

**Dashboard:** Welcome banner → Quick stats → Coral grid → Impact summary → Referral section

### 6. Responsive Checklist

- [ ] Container: fluid → 720px → 1200px
- [ ] Grid: 1 cột → 2 cột → 3-4 cột
- [ ] Font sizes: responsive type scale
- [ ] Touch targets ≥ 44px trên mobile
- [ ] Mobile navigation (hamburger menu)
- [ ] Form inputs: 16px trên mobile (tránh iOS auto-zoom)
- [ ] Video hero: fallback ảnh tĩnh trên mobile
- [ ] UI matches Stitch/Figma design

### 7. Protected Pages

- **Dashboard, Checkout:** Redirect to `/dang-nhap` nếu chưa authenticated
- **Admin:** Redirect nếu không phải role=admin
- **Coral Portal:** Redirect nếu không phải role=coral_staff
