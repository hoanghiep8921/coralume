# Progress Tracker — Coralume

> **Cập nhật sau mỗi thay đổi quan trọng.**
> Task registry merge từ `templates/tasks.md` pattern + progress tracker hiện tại.

## Status Legend

| Status | Ý nghĩa |
|--------|---------|
| `planned` | Chưa bắt đầu |
| `in-progress` | Đang làm |
| `review` | Đang review code |
| `testing` | Đang test |
| `done` | Hoàn thành |

---

## Current Phase

- Phase 2: Development — Unit 08 Complete

## Current Goal

- Unit 09: Coral Portal + Blog + Leaderboard + Community

## Completed

- ✅ Six-File Context System hoàn chỉnh (project-overview, architecture, ui-context, code-standards, ai-workflow-rules, progress-tracker)
- ✅ CLAUDE.md entry point
- ✅ 7 custom skills cho Claude
- ✅ `context/specs/SRS.md` — SRS chuẩn hóa với FR/ NFR numbering + acceptance criteria
- ✅ **Unit 01:** Project setup + database models (Next.js 16, Prisma 6, Tailwind, Zod v4, fonts, design tokens, metadata, directory structure) — **Đã sync Stitch tokens**
- ✅ **Unit 02:** Auth infrastructure (JWT httpOnly cookie, bcrypt 12 rounds, middleware route protection, 7 API endpoints, 4 UI pages — đăng nhập/đăng ký/quên mật khẩu/verify email, password strength meter, email enumeration protection) — **Đã sync Stitch tokens**
- ✅ **Unit 03:** Home page (Hero, Stats, How it works, Products preview, Partner, CTA, Footer) — **Đã sync Stitch tokens**
  - Header: Sticky nav, mobile hamburger menu, transparent→Navy on scroll — glassmorphism
  - Hero: WebGL shader ocean background, overlay gradient, headline Lexend Bold, CTA Coral Orange + ghost button
  - Stats: 3 số liệu count-up với Material Symbols icons, premium shadow cards
  - How it works: "Your Stewardship Journey" — 3 steps 2-column
  - Products preview: 3 tier cards (Seed Coral, Reef Guardian, Diving Experience)
  - Partner: "From Nha Trang with Love" — masonry grid, placeholder ảnh
  - CTA Banner: Gradient Navy → Teal, parallax, CTA pulse 2s
  - Footer: 3 cột, Navy background, mobile stack
  - ✅ **Unit 04:** Products page (5 sections: Hero, 3 detail cards, comparison table, Ambassador, FAQ accordion) — **Stitch tokens**
  - ProductsHeroSection: badge chip + H1 "Nuôi 1 bé san hô ngay tại đây!" + sub, stagger fade-in
  - ProductDetailCardsSection: 3 cards desktop / 1 mobile, Reef Guardian featured (scale 1.05 + border-primary)
  - Mỗi card: image placeholder, specs bento grid, benefits list, pricing, CTA → /thanh-toan?goi={slug}
  - ComparisonTableSection: sticky header + sticky feature column, zebra striping, mobile scroll ngang, checkmark icons
  - AmbassadorSection: bg-primary container, 4 rewards grid, progress bar 0/5, CTA chia sẻ link
  - FAQSection: 5 câu hỏi accordion, grid-template-rows animation 0.3s ease-out-expo, WCAG AA
  - Shared hooks: useInView + useCountUp extracted
- ✅ **Unit 05:** Payment flow → PayOS (checkout form, PayOS unified gateway, success page + certificate preview)
- ✅ **Unit 06:** Dashboard (welcome banner, quick stats, coral grid, modal, impact, referral, profile)
- ✅ **Unit 07:** About page (Hero, Story, Partners 3 cards, Team 4-col, CTA dark teal banner)
  - PaymentMethodSelector: 3 radio cards (VNPay, MoMo, Bank Transfer)
  - CheckoutForm: react-hook-form + createOrderSchema, order summary, pre-filled user info, coral name
  - /thanh-cong: certificate HTML preview, bank transfer pending state with bank info + reference code
  - 5 API routes: orders, payment status, product lookup, VNPay/MoMo callback handlers
  - Payment lib: vnpay.ts, momo.ts, bank-transfer.ts, certificate.ts (stub)
  - Auth: middleware + API guard (login + email verified required)

## In Progress

- None yet.

## Next Up

- ✅ **Unit 07:** About page (Hero, Story, Partners, Team, CTA)
- ✅ **Unit 08:** Admin panel core (layout, dashboard, users, corals, products)
  - 5 sections: AboutHeroSection, StorySection, PartnersSection, TeamSection, AboutCTASection
  - Stitch ref: coralume_our_story (light theme, Vietnamese)
  - Build: 0 errors
- Unit 09: Coral portal
- Unit 10 & 11: Blog, Leaderboard, Community

## Open Questions

- Chọn S3 hay Cloudflare R2 cho file storage? (CLB cần confirm)
- Chọn Resend hay AWS SEhãyS cho email? (CLB cần confirm)
- Chọn Google Maps hay Mapbox cho GPS embed?
- VNPay/MoMo credentials từ CLB — cần cung cấp trước khi tích hợp
- Hosting: VPS DigitalOcean hay platform khác (Vercel, Railway)?

## Architecture Decisions

- Monorepo: Frontend (Next.js) + Backend (API Routes) cùng repo
- Prisma 6 ORM cho PostgreSQL (v7 incompatible without adapter)
- JWT httpOnly cookie cho auth (không localStorage)
- Tailwind CSS + CSS Variables cho styling
- Mobile-first responsive design
- Route groups trong Next.js App Router cho auth/dashboard separation
- bcryptjs 12 salt rounds cho password hashing
- Zod v4 cho runtime validation
- Fonts: next/font (Lora, Be Vietnam Pro, JetBrains Mono)

---

## Task Registry

### TASK-001: Project Setup + Database Models
- **Status**: done
- **SRS**: Section 5 (Database), Section 3 (Kiến trúc)
- **Branch**: main
- **Dependencies**: none
- **Priority**: P0
- **Description**: Scaffold Next.js 16 project với TypeScript, Tailwind CSS, Prisma ORM. Tạo database schema 12 entities với 25 enums. Cài đặt Zod validation schemas (10 schemas). Setup fonts (Lora, Be Vietnam Pro, JetBrains Mono). Tạo design tokens trong globals.css. Tạo root layout với SEO metadata, Open Graph.
- **Requirements**: FR-110 (Auth API pattern), NFR-010 (Responsive), NFR-020 (HTTPS)
- **Acceptance Criteria**:
  - [x] Next.js 16.2.7 + TypeScript strict + Tailwind CSS scaffold
  - [x] Prisma schema: 12 entities, 25 enums, tất cả relations đúng
  - [x] Zod v4 validation schemas: auth, orders, coral updates, blog, community, contact, pagination
  - [x] Fonts loaded: Lexend (display), Lora (heading-serif), Be Vietnam Pro (body), JetBrains Mono (mono)
  - [x] Design tokens trong globals.css (MD3 colors, shadows, easing, durations, spacing) — sync từ Stitch
  - [x] Root layout với metadata, Open Graph, Twitter Card
  - [x] Project directory structure đúng architecture.md
  - [x] Prisma client singleton (src/lib/db.ts)
  - [x] Site config constants (site.ts)
  - [x] `npm run build` passes — 0 TypeScript errors

### TASK-002: Auth Infrastructure (JWT, Middleware, Auth Pages)
- **Status**: done
- **SRS**: 3.4 Auth, 3.12 Auth API Endpoints
- **Branch**: main
- **Dependencies**: TASK-001
- **Priority**: P0
- **Description**: Xây dựng hệ thống xác thực — JWT utilities, route middleware, 7 API endpoints (register, login, logout, verify-email, forgot-password, reset-password, me), 4 UI pages (đăng nhập, đăng ký, quên mật khẩu, verify email). Password hashing bcryptjs 12 rounds. Email verification token (24h). Password reset token (15m). Role-based access control (6 roles).
- **Requirements**: FR-030, FR-031, FR-032, FR-033, FR-034, FR-110, FR-111, FR-112, FR-113, FR-114, FR-115, FR-116, NFR-020, NFR-021
- **Acceptance Criteria**:
  - [x] JWT createToken/verifyToken với jose library
  - [x] Password hashPassword/verifyPassword với bcryptjs 12 rounds
  - [x] Email verification token (24h expiry)
  - [x] Password reset token (15m expiry)
  - [x] Cookie helpers: getTokenFromCookie, getCurrentUser, setTokenCookie, removeTokenCookie
  - [x] Role hierarchy + canAccess function
  - [x] Middleware route protection: public, protected, admin, coral portal, auth-only redirects
  - [x] API: POST /api/v1/auth/register — validate, hash, create user, verify token, JWT cookie
  - [x] API: POST /api/v1/auth/login — validate, verify password, JWT cookie
  - [x] API: POST /api/v1/auth/logout — clear cookie
  - [x] API: POST /api/v1/auth/verify-email — validate token, set isVerified=true, new JWT
  - [x] API: POST /api/v1/auth/forgot-password — anti-enumeration, reset token
  - [x] API: POST /api/v1/auth/reset-password — validate token, hash password
  - [x] API: GET/PUT /api/v1/me — get/update profile, auth guard
  - [x] UI: /dang-nhap — email + password, forgot link, redirect callbackUrl
  - [x] UI: /dang-ky — full form, password strength meter, terms checkbox, success state
  - [x] UI: /quen-mat-khau — email input, anti-enumeration success state
  - [x] UI: /verify-email — auto-verify with token, success/error states
  - [x] `npm run build` passes — 0 errors

### TASK-003: Home Page (Hero, Stats, How It Works, Products Preview, CTA, Footer)
- **Status**: done
- **SRS**: 3.1 Trang chủ (Home)
- **Branch**: main
- **Dependencies**: TASK-002
- **Priority**: P0
- **Description:** Xây dựng trang Home hoàn chỉnh với 7 sections: Hero (video/ảnh + overlay + CTA), Stats (3 số liệu count-up), How It Works (3 steps), Products Preview (3 cards), Partner section, CTA banner (gradient + pulse), Footer (3 cột). Áp dụng design tokens từ ui-context.md cho colors, typography, animation.
- **Requirements**: FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007
- **Acceptance Criteria**:
  - [x] Hero: Gradient background (video TODO), overlay Navy gradient, headline 64px Lora Bold, CTA Coral Orange
  - [x] Hero animation: stagger fade-in — headline 0.2s delay → sub 0.5s → CTA 0.8s
  - [ ] ⚠️ Hero video: Chưa có file video → dùng gradient fallback. Cần CLB cung cấp video 1920×1080
  - [ ] ⚠️ Mobile WiFi detection cho video: Chưa implement (cần video trước)
  - [x] Stats: 3 số liệu ("< 1%", "25%", "50%") với Intersection Observer count-up 2s ease-out
  - [x] How it works: 3 steps (3 cột desktop, 1 cột mobile), hover scale 1.05
  - [x] Products preview: 3 cards với hover translateY(-8px) + shadow-card-hover, badge "Phổ biến nhất"
  - [x] Partner section: placeholder "Đang chờ ảnh từ CLB"
  - [x] CTA banner: gradient Navy → Teal, parallax nhẹ (scroll * 0.02), CTA pulse 2s
  - [x] Footer: 3 cột (Logo, Nav, Contact), Navy background, mobile stack
  - [x] Header: Sticky nav, transparent→Navy on scroll > 100px, mobile hamburger menu
  - [x] SEO metadata: title, description, Open Graph, Twitter Card cho Home page
  - [x] Responsive: mobile (320px+) → tablet (768px) → desktop (1024px+)
  - [x] Accessibility: aria-labels, heading hierarchy, focus states, keyboard nav, reduced-motion
  - [x] `npm run build` passes — 0 TypeScript errors

### TASK-004: Products Page (3 Gói, Comparison Table, FAQ)
- **Status**: done
- **SRS**: 3.3 Trang Sản Phẩm
- **Branch**: main
- **Dependencies**: TASK-002
- **Priority**: P0
- **Description:** Xây dựng trang Products với 5 sections: Hero, 3 gói chi tiết, bảng so sánh, Ambassador, FAQ accordion. Mỗi gói: tên, giá, quyền lợi, CTA "Nhận nuôi ngay". Reef Guardian card có border Coral nổi bật + scale 1.05. Bảng so sánh sticky header + sticky feature column + zebra striping. FAQ 5 câu hỏi với grid-template-rows animation.
- **Requirements**: FR-020, FR-021, FR-022, FR-023, FR-024
- **Acceptance Criteria**:
  - [x] Hero: "Nuôi 1 bé san hô ngay tại đây!" — badge chip + headline + sub
  - [x] 3 gói cards chi tiết: Seed Coral, Reef Guardian, Diving Experience — specs bento grid, benefits list, pricing, footer specs
  - [x] Reef Guardian: border-primary + scale 1.05 + badge "PHỔ BIẾN NHẤT" centered
  - [x] Mỗi gói: CTA "Nhận nuôi ngay" → /thanh-toan?goi={slug}
  - [x] Bảng so sánh: sticky header + sticky feature column, zebra striping, mobile scroll ngang, checkmark icons
  - [x] FAQ accordion: 5 câu hỏi, expand/collapse grid-template-rows 0.3s ease-out-expo, aria-expanded/aria-controls
  - [x] Ambassador section: 4 rewards grid, progress bar 0/5, CTA chia sẻ link
  - [x] Responsive: mobile 1 cột → desktop 3 cột
  - [x] SEO metadata cho Products page
  - [x] Shared hooks extracted: useInView + useCountUp
  - [x] `npm run build` passes — 0 TypeScript errors

### TASK-005: Payment Flow (Checkout, Payment Gateway, Success Page)
- **Status**: done
- **SRS**: 3.5 Thanh Toán
- **Branch**: main
- **Dependencies**: TASK-002, TASK-004
- **Priority**: P0
- **Description:** Xây dựng checkout flow — API orders (tạo Adoption + Payment), VNPay/MoMo redirect với HMAC signing, bank transfer flow, trang thanh toán (form + payment method selector), trang thành công (certificate preview + bank transfer pending state).
- **Requirements**: FR-050, FR-051, FR-052, NFR-021
- **Acceptance Criteria**:
  - [x] BẮT BUỘC đăng nhập + email verified mới truy cập checkout (middleware + API guard)
  - [x] Form: pre-fill adopter info (read-only), tên san hô (tuỳ chọn), PaymentMethodSelector component
  - [x] VNPay redirect integration — buildPaymentUrl() với HMAC-SHA512 signing
  - [x] MoMo redirect/QR integration — createPaymentRequest() với HMAC-SHA256 signing
  - [x] Chuyển khoản: bank info từ env vars, reference code CRL-ADOPT-XXXX, admin verify (deferred to TASK-008)
  - [x] Success page: certificate HTML preview, bank transfer pending state, CTA dashboard
  - [x] Backend: POST /api/v1/orders tạo Adoption + Payment trong transaction
  - [x] Callback handlers: VNPay IPN + MoMo IPN với signature verification
  - [x] SSL enforced (Next.js production)
  - [x] KHÔNG lưu thông tin thẻ (PCI compliance)
  - [x] `npm run build` passes — 0 TypeScript errors
  - [ ] TODO: Certificate PDF generation (stub, chờ chọn PDF library)
  - [ ] TODO: Email confirmation (stub, chờ email infra — Resend/SES)
  - [ ] TODO: VNPay/MoMo real credentials (đang dùng sandbox placeholders)

### TASK-006: Dashboard (Coral Grid, Modal Detail, Impact)
- **Status**: done
- **SRS**: 3.4 Dashboard Cá Nhân
- **Branch**: main
- **Dependencies**: TASK-002, TASK-005
- **Priority**: P0
- **Description:** Xây dựng adopter dashboard — welcome banner, quick stats (3 chỉ số), coral grid (responsive), modal chi tiết san hô (growth timeline, GPS map, stats, certificate), impact dashboard, referral code (AFF), profile settings (auto-save). Stitch ref: coralume_your_impact_dashboard_1/2.
- **Requirements**: FR-040, FR-041, FR-042, FR-043, FR-044, FR-045, FR-046, FR-047
- **Acceptance Criteria**:
  - [x] Redirect /dang-nhap nếu chưa login (middleware)
  - [x] Empty state nếu chưa có san hô — icon + message + CTA
  - [x] Welcome banner: tên + số san hô + avatar initials + badge role
  - [x] Quick stats: 3 chỉ số count-up (san hô, diện tích, tháng)
  - [x] Coral grid: responsive 3→2→1 cột, stagger fade-in, hover card, health status dot
  - [x] Modal chi tiết: growth timeline, stats grid, certificate section, Escape key
  - [x] Impact dashboard: 4 chỉ số (san hô, rạn, CO2, sinh vật biển)
  - [x] Referral code: CRL-[USERNAME], copy với checkmark feedback, progress bar 0/5
  - [x] Profile settings: auto-save on blur (500ms debounce), toggles
  - [x] API routes: GET /api/v1/dashboard + GET /api/v1/adoptions
  - [x] `npm run build` passes — 0 TypeScript errors

### TASK-007: About Page
- **Status**: done
- **SRS**: 3.2 Trang Về Chúng Tôi
- **Branch**: main
- **Dependencies**: TASK-002
- **Priority**: P1
- **Description:** Xây dựng About page — Hero (badge + headline + sub), Story (2 cột + stat card + quote), Partners (3 cards), Team (4-col grid), CTA banner (dark teal container). Stitch ref: coralume_our_story.
- **Requirements**: FR-010, FR-011, FR-012, FR-013, FR-014, FR-015
- **Acceptance Criteria**:
  - [x] Hero: badge chip + headline "Khi Khoa học gặp gỡ Sự tận tâm" + paragraph, stagger fade-in
  - [x] Story: 2 cột (text + accent line + stat card | image placeholder + floating quote)
  - [x] Partners: 3 strategic partner cards trên bg-surface-container-low
  - [x] Team grid: 4 cột desktop, image aspect-[3/4], hover scale-110
  - [x] CTA banner: bg-primary rounded-[48px] + decorative blur blobs + 2 buttons
  - [x] SEO metadata + Open Graph
  - [x] `npm run build` passes — 0 TypeScript errors

### TASK-008: Admin Panel (Core)
- **Status**: done
- **SRS**: 3.10 Admin Panel
- **Branch**: main
- **Dependencies**: TASK-002
- **Priority**: P1
- **Description:** Xây dựng admin panel core — layout + sidebar, dashboard stats, user management (search, block/unblock), coral management (pool, status update), product management (list, toggle active). Deferred: CMS, analytics, reports, refund, bulk ops.
- **Requirements**: FR-090, FR-091, FR-092, FR-093, FR-094, FR-095
- **Acceptance Criteria**:
  - [x] Admin route protection (middleware + API guard)
  - [x] Admin layout: sidebar nav + header + content area
  - [x] Dashboard: user count, coral count, adoption count, revenue
  - [x] User management: list, search, block/unblock
  - [x] Coral management: pool list, filter by status, status update
  - [x] Product management: list, toggle active/inactive
  - [x] 7 API routes with requireAdmin() guard
  - [x] `npm run build` passes — 0 TypeScript errors
  - [ ] Deferred: CMS, analytics, reports CSV/PDF, refund, bulk ops, staff CRUD

### TASK-009: Coral Portal
- **Status**: planned
- **SRS**: 3.11 Coral Portal
- **Branch**: feature/TASK-009-coral-portal
- **Dependencies**: TASK-002
- **Priority**: P1
- **Description:** Xây dựng Coral Portal cho nhân viên trung tâm — dashboard (filter cần update), form upload ảnh/video + nhập chỉ số, save & sync (email notification), bulk upload, view-only adopter dashboard. Mobile-first BẮT BUỘC, KHÔNG animation.
- **Requirements**: FR-100, FR-101, FR-102, FR-103, FR-104
- **Acceptance Criteria**:
  - [ ] Portal route protection (role=coral_staff/admin)
  - [ ] Dashboard: filter chưa update / quá hạn
  - [ ] Form: upload 1-5 ảnh + video, drag & drop, compress
  - [ ] Nhập chỉ số: kích thước, sức khỏe, ghi chú
  - [ ] Save → đồng bộ dashboard adopter + email notification
  - [ ] Bulk upload: multi-select
  - [ ] View-only adopter dashboard
  - [ ] Mobile-first BẮT BUỘC, KHÔNG animation

### TASK-010: Blog
- **Status**: planned
- **SRS**: 3.7 Blog
- **Branch**: feature/TASK-010-blog
- **Dependencies**: TASK-002
- **Priority**: P2
- **Description:** Xây dựng blog — listing (categories filter, article grid, pagination), detail page (TOC sticky, scroll progress), CMS qua admin panel.
- **Requirements**: FR-060, FR-061, FR-062
- **Acceptance Criteria**:
  - [ ] Categories filter: 4 categories
  - [ ] Article grid: thumbnail, title, excerpt, date, tag, reading time
  - [ ] Pagination 12 bài/trang
  - [ ] Detail: max-width 720px, TOC sticky, scroll progress
  - [ ] SEO: meta, OG tags, Schema.org Article

### TASK-011: Leaderboard & Community
- **Status**: planned
- **SRS**: 3.8 Leaderboard, 3.9 Community
- **Branch**: feature/TASK-011-leaderboard-community
- **Dependencies**: TASK-002
- **Priority**: P2
- **Description:** Xây dựng Leaderboard (top 10 tháng, top 20 all-time, my ranking, ẩn danh) và Community (adopter stories masonry, video gallery, submit form với moderation).
- **Requirements**: FR-070, FR-071, FR-080, FR-081, FR-082
- **Acceptance Criteria**:
  - [ ] Leaderboard: top rankings, my ranking (nếu login), ẩn danh option
  - [ ] Community: masonry layout, video lightbox
  - [ ] Submit form: ảnh + text, admin duyệt
  - [ ] Moderation workflow

---

## Session Notes

- 2026-06-03:
  - Phase 1: Six-File Context System hoàn chỉnh
  - Phase 2 / Unit 01: Project scaffold hoàn chỉnh, build passes
  - Phase 2 / Unit 02: Auth infrastructure hoàn chỉnh (7 API routes, 4 UI pages, middleware, JWT, bcrypt)
  - Phase 2 / Unit 03: Home page recoded theo Stitch design (WebGL shader, Material Design 3 tokens, 6 sections)
  - Stitch MCP setup (Google API key, `stitch_coralume_coral_restoration_dashboard` folder với 18 screens)
  - ui-context.md cập nhật với Stitch design tokens (Material Design 3 naming)
  - Prisma v7 yêu cầu adapter → downgrade về v6.19.3
  - **Stitch sync pass:** Toàn bộ 3 task done đã được sync với Stitch MD3 tokens:
    - TASK-001: Font Lexend load qua next/font, Lora → heading-serif
    - TASK-002: 4 auth pages chuyển từ legacy class names → Stitch tokens (bg-sand→bg-surface, text-navy→text-primary, bg-coral→bg-secondary,...)
    - TASK-003: ProductsPreviewSection + CTABannerSection sửa legacy tokens + import vào page.tsx (6 sections)
  - **TASK-004 (Unit 04): Trang Sản Phẩm hoàn chỉnh — 5 sections, Stitch tokens, shared hooks**
    - 9 files mới: useInView, useCountUp, products.ts data, 5 section components
    - 4 files updated: page.tsx, ProductsPreviewSection, StatsSection, CTABannerSection
    - Stitch ref: coralume_choose_your_impact (light warm theme, Vietnamese)
    - Build: 0 TypeScript errors
  - **TASK-005 (Unit 05): Payment Flow hoàn chỉnh — 16 files mới, 0 npm deps**
    - Payment lib: vnpay.ts (HMAC-SHA512), momo.ts (HMAC-SHA256), bank-transfer.ts, certificate.ts stub
    - 5 API routes: product lookup, orders, payment status, VNPay callback, MoMo callback
    - Frontend: /thanh-toan (CheckoutForm + PaymentMethodSelector), /thanh-cong (certificate preview + bank transfer pending)
    - Auth: middleware + API guard (login + email verified)
    - Build: 0 TypeScript errors
  - **PayOS Migration:** Thay VNPay/MoMo/bank-transfer riêng lẻ → PayOS unified gateway
    - PayOS hỗ trợ VNPay + MoMo + VietQR qua 1 API duy nhất
    - Người dùng chọn phương thức trên trang thanh toán của PayOS
    - Xoá 5 files cũ (vnpay.ts, momo.ts, bank-transfer.ts, 2 callback routes)
    - Tạo payos.ts + callback/payos/route.ts
    - Prisma: PaymentMethod enum còn `payos`
    - validation.ts: createOrderSchema chỉ còn `payos`
  - TODO: Certificate PDF (chờ PDF lib), email confirmation (chờ email infra), PayOS real creds (CLB)
  - TODO Unit 03: Hero video (cần CLB cung cấp), Material Icons, actual images

*Tổng: 11 tasks | 8 done, 0 in-progress, 3 planned*
*Được bóc tách từ context/specs/SRS.md và Stitch design export*
