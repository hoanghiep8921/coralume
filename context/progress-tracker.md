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

- Phase 2: Development — Complete ✅ (all 11 tasks done!)

## Current Goal

- Production readiness: real images, video, credentials, deploy

## Completed

- ✅ Six-File Context System hoàn chỉnh (project-overview, architecture, ui-context, code-standards, ai-workflow-rules, progress-tracker)
- ✅ CLAUDE.md entry point
- ✅ 7 custom skills cho Claude
- ✅ `context/specs/SRS.md` — SRS chuẩn hóa với FR/ NFR numbering + acceptance criteria
- ✅ **Unit 01:** Project setup + database models (Next.js 16, Prisma 6, Tailwind, Zod v4, fonts, design tokens, metadata, directory structure) — **Đã sync Stitch tokens**
- ✅ **Unit 02:** Auth infrastructure (JWT httpOnly cookie, bcrypt 12 rounds, middleware route protection, 8 API endpoints, 4 UI pages — đăng nhập/đăng ký/quên mật khẩu/verify email, password strength meter, confirm password, Google OAuth, email enumeration protection) — **Đã sync Stitch tokens**
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
  - 🔄 SRS sync 2026-06-05: Hero sub text, badge positions, card names, CTA labels, FAQ answers, comparison table
  - 🔄 CDN/Storage 2026-06-05: Next.js public/ + next/image (free, auto-CDN on Vercel) + SVG ocean placeholders + ProductImage component
  - ProductsHeroSection: badge chip + H1 "Nuôi 1 bé san hô ngay tại đây!" + SRS 1.2 sub text, stagger fade-in
  - ProductDetailCardsSection: "Phổ biến nhất" → Seed Coral (top-center), "Trải nghiệm thật" → Diving (top-left), Reef Guardian featured (scale 1.05 + border-primary), Diving CTA "Đặt lịch ngay"
  - Mỗi card: "SEED CORAL · Standard" / "REEF GUARDIAN · Premium" / "DIVING EXPERIENCE · Premium+", SVG ocean placeholder → CDN ảnh thật khi có, specs bento grid, benefits list, pricing
  - ComparisonTableSection: sticky header + sticky feature column, zebra striping, mobile scroll ngang, checkmark icons, feature names synced to SRS 3.1
  - AmbassadorSection: bg-primary container, 4 rewards grid, progress bar 0/5, CTA chia sẻ link
  - FAQSection: 5 câu hỏi accordion, grid-template-rows animation 0.3s ease-out-expo, WCAG AA, answers synced to SRS 5.1-5.5
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
- ✅ **Unit 08:** Leaderboard page + Design Spec sync
  - Leaderboard: Hero gradient, Top 10 monthly + Top 20 all-time tabs
  - My Ranking: personalized banner + progress bar + "Cần thêm X san hô để lên hạng #Y"
  - Avatar with initials fallback, Top 3 gold/silver/bronze highlighting
  - Anonymous mode support (isPublic=false hides avatar + shows "Người ẩn danh")
  - CountUp animation for numbers (Design Spec §4.5 compliance)
  - Material Symbols icons replacing emoji (Design Spec §5 compliance)
  - 27 test cases (13 API + 14 component)
- ✅ **Unit 09:** Role-based feature audit + gap fixes (SRS §5)
  - Referral tracking: wired up real DB count (was hardcoded 0)
  - Ambassador auto-upgrade: trigger at ≥5 completed referrals + congratulations email
  - Newsletter signup: form in Footer + POST /api/v1/newsletter/subscribe
  - Contact page: /lien-he with form, email/location/hours cards
  - Impact totals: live aggregate metrics on Home page (fetch from /api/v1/impact/totals)
  - Footer: updated "Liên hệ" link from mailto: → /lien-he

## In Progress

- None yet.

## Next Up

- Production readiness: real images from CLB, video, payment credentials
- Deploy: VPS/Vercel setup, database provisioning, SSL
- Future: CMS blog editor, analytics GA4, report PDF export

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
  - [x] 🔄 UI: /dang-nhap — Google OAuth button + divider (2026-06-05), ocean-themed background
  - [x] UI: /dang-ky — full form, password strength meter, terms checkbox, success state
  - [x] 🔄 UI: /dang-ky — xác nhận mật khẩu (confirmPassword) field + Zod refinement (2026-06-05)
  - [x] UI: /quen-mat-khau — email input, anti-enumeration success state
  - [x] UI: /verify-email — auto-verify with token, success/error states
  - [x] 🔄 UI: /verify-email — sync SRS 4.4 text "Tài khoản của bạn đã được kích hoạt. [Đăng nhập]" (2026-06-05)
  - [x] 🔄 API: Google OAuth flow — CSRF state + id_token verify + callbackUrl passthrough (2026-06-05)
  - [x] `npm run build` passes — 0 errors (pre-existing test/setup.ts vitest issue unrelated)

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
  - [x] Certificate PDF generation (jsPDF — resolved by TASK-015)
  - [x] Email confirmation (Resend — resolved by TASK-015)
  - [ ] TODO: PayOS real credentials (đang dùng sandbox placeholders — cần CLB cung cấp)

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
  - [ ] Deferred (gốc): CMS ✅ blog (TASK-012), analytics ✅ (TASK-015), CSV export ✅ (TASK-015), staff CRUD ✅ (TASK-014), bulk email ✅ (TASK-015), refund ❌, CMS page text/images ❌

### TASK-009: Coral Portal
- **Status**: done
- **SRS**: 3.11 Coral Portal
- **Branch**: main
- **Dependencies**: TASK-002
- **Priority**: P1
- **Description:** Xây dựng Coral Portal cho nhân viên trung tâm — dashboard (filter corals needing update >30 days), form update (size, health, notes, 1-5 images, video), save & sync adopter dashboard, view-only adopter list. Mobile-first BẮT BUỘC, KHÔNG animation.
- **Requirements**: FR-100, FR-101, FR-102, FR-103, FR-104
- **Acceptance Criteria**:
  - [x] Portal route protection (coral_staff/admin — API + page guard)
  - [x] Dashboard: stats (need update >30 days, total assigned), coral list
  - [x] Form: size, health (good/average/needs_attention), notes, 1-5 image URLs, video URL
  - [x] Save → create CoralUpdate + update coral status to growing
  - [x] View-only adopter dashboard (tab with adoption list)
  - [x] Mobile-first layout, NO animation
  - [x] `npm run build` passes — 0 TypeScript errors
  - [ ] TODO: Email notification (stub), bulk upload, image upload/drag-drop

### TASK-010: Blog
- **Status**: done
- **SRS**: 3.7 Blog
- **Branch**: main
- **Dependencies**: TASK-002
- **Priority**: P2
- **Description:** Xây dựng blog — listing (4 categories filter: bảo tồn, sinh thái, kinh tế xanh, câu chuyện), article grid 3 cols, pagination 12 bài/trang, detail page (TOC sticky, scroll progress bar), Schema.org Article.
- **Requirements**: FR-060, FR-061, FR-062
- **Acceptance Criteria**:
  - [x] Categories filter: 4 categories (ecology, conservation, green_economy, adopter_stories)
  - [x] Article grid: thumbnail, title, excerpt, date, category badge, reading time
  - [x] Pagination 12 bài/trang
  - [x] Detail: max-width 720px, TOC sticky sidebar (desktop), scroll progress bar
  - [x] SEO: meta + OG tags + Schema.org Article + dynamic generateMetadata
  - [x] `npm run build` passes — 0 TypeScript errors

### TASK-011: Leaderboard & Community
- **Status**: done
- **SRS**: 3.8 Leaderboard, 3.9 Community
- **Branch**: main
- **Dependencies**: TASK-002
- **Priority**: P2
- **Description:** Xây dựng Leaderboard (top 20 all-time, my ranking, ẩn danh) và Community (masonry stories grid, image lightbox, submit form với moderation — pending→approved).
- **Requirements**: FR-070, FR-071, FR-080, FR-081, FR-082
- **Acceptance Criteria**:
  - [x] Leaderboard: top 20 all-time với rank badges (#1 vàng, #2 bạc, #3 đồng), my ranking card (nếu login)
  - [x] Ẩn danh: user.isPublic=false → "Người ẩn danh" với italic text
  - [x] Community: masonry columns-3 layout, image lightbox click-to-view
  - [x] Submit form: react-hook-form + communitySubmissionSchema, content + images, auto status=pending
  - [x] Moderation: admin duyệt qua CommunitySubmission status (pending→approved/rejected)
  - [x] `npm run build` passes — 0 TypeScript errors

### TASK-012: Phân quyền & Quản lý Blog (Admin)
- **Status**: done
- **SRS**: 3.10 Admin Panel, AD-04 (CMS), Phân quyền (Super Admin / Editor / Coral Center)
- **Branch**: main
- **Dependencies**: TASK-008, TASK-010
- **Priority**: P1
- **Description:** Thêm tính năng phân quyền (editor role được vào admin quản lý blog) và trang quản lý bài viết (CRUD blog posts) trong admin panel. Cập nhật middleware, admin-guard, layout để hỗ trợ role editor. Thêm role change dropdown trong Users page.
- **Requirements**: FR-090, FR-091, FR-092
- **Acceptance Criteria**:
  - [x] `requireAdmin()` dùng `canAccess(user.role, 'editor')` — cho phép cả admin và editor
  - [x] `requireAdminOnly()` mới — chỉ cho phép admin cho route nhạy cảm (users, products, corals, dashboard)
  - [x] Middleware cho phép editor vào `/admin`
  - [x] Admin layout chấp nhận editor role, truyền role xuống sidebar
  - [x] AdminSidebar: hiển thị link theo role (admin: tất cả 5 links, editor: chỉ Dashboard + Bài viết)
  - [x] 7 API route nhạy cảm chuyển sang dùng `requireAdminOnly()`
  - [x] API CRUD blog: GET list (search, pagination), POST create (auto slug, auto readingTime), GET detail, PUT update, DELETE
  - [x] Trang `/admin/blog`: table posts, search, modal tạo/sửa (title, slug, category, tags, excerpt, content HTML, featuredImage, status), toggle status, xóa với confirm
  - [x] Users page: role change dropdown (select) thay thế static badge — 6 roles
  - [x] Tất cả label tiếng Việt
  - [x] `npm run build` passes — 0 TypeScript errors

### TASK-013: Gap Closure — Priority 1 API Endpoints & UI (SRS Compliance)
- **Status**: done
- **SRS**: Coralume-SRS.md §3.6/3.8/3.9/3.10, SRS.md FR-070/FR-081/FR-090/FR-094
- **Branch**: main
- **Dependencies**: TASK-008, TASK-012
- **Priority**: P0 (go-live blockers from gap analysis)
- **Description:** Đóng các gap ưu tiên cao từ SRS gap analysis: 4 API endpoints (coral creation, adoption assignment, impact totals, contact form) + 3 UI features (monthly leaderboard tabs, community video gallery, admin dashboard charts với recharts).
- **Requirements**: FR-070, FR-081, FR-090, FR-094, AD-01, AD-05
- **Acceptance Criteria**:
  - [x] `POST /api/v1/admin/corals` — Tạo coral mới, auto-generate code CRL-2026-XXXX
  - [x] `POST /api/v1/admin/adoptions/[id]/assign` — Gán san hô (validate pending + available, transaction)
  - [x] `GET /api/v1/impact/totals` — Public impact metrics (reefArea, co2Absorbed, marineLife)
  - [x] `POST /api/v1/contact` — Contact form API dùng contactSchema từ validation.ts
  - [x] Leaderboard: API `?type=monthly` filter adoptions theo tháng + UI tabs Tháng này/Tất cả
  - [x] Community: Video gallery section với YouTube embed + lightbox player
  - [x] Admin dashboard: recharts LineChart (adoptions) + BarChart (revenue) theo 6 tháng
  - [x] `npm run build` passes — 0 TypeScript errors

### TASK-014: Gap Closure — Priority 2 (User Detail, Product CRUD, Delete Endpoints)
- **Status**: done
- **SRS**: AD-02 (User Management), AD-03 (Product Management), AD-09 (Activity Log)
- **Branch**: main
- **Dependencies**: TASK-008, TASK-012
- **Priority**: P1
- **Description:** Đóng gap ưu tiên 2: user detail endpoint với payment history, product CRUD UI (create/edit/delete), delete endpoints cho users + products, activity logging cho product routes.
- **Acceptance Criteria**:
  - [x] `GET /api/v1/admin/users/[id]` — User detail với payments + adoptions
  - [x] `DELETE /api/v1/admin/users/[id]` — Soft delete user (isActive=false) + log
  - [x] `DELETE /api/v1/admin/products/[id]` — Delete product + log
  - [x] Products page: modal tạo/sửa (name, slug, tier, pricing, description, benefits) + nút xóa
  - [x] Users page: "Chi tiết" button → modal hiển thị user info + payment history + adoptions
  - [x] Activity logging cho product updates (activate/deactivate/update/delete)
  - [x] `npm run build` passes — 0 TypeScript errors

### TASK-015: Gap Closure — Priority 3 (Certificate PDF, Analytics, CSV Export, Bulk Email)
- **Status**: done
- **SRS**: AD-06 (Analytics), AD-07 (Reports), AD-10 (Bulk Ops), NFR-030 (Email)
- **Branch**: main
- **Dependencies**: TASK-008, TASK-014
- **Priority**: P2
- **Description:** Certificate PDF generation với jsPDF, Analytics endpoint + page, CSV export cho users table, bulk email admin + API.
- **Acceptance Criteria**:
  - [x] Certificate PDF: jsPDF A4 landscape với Coralume branding
  - [x] API: `GET /api/v1/me/certificate/[adoptionId]/pdf` — PDF download
  - [x] API: `GET /api/v1/admin/analytics` — overview, userGrowth, revenueByTier, adoptionStatus, monthlyTrend
  - [x] API: `POST /api/v1/admin/bulk-email` — Gửi email hàng loạt theo role
  - [x] UI: `/admin/analytics` — LineChart, BarChart, PieChart, overview cards
  - [x] UI: `/admin/email` — Compose form (role, subject, HTML content)
  - [x] UI: Users page — CSV export button (Blob download với BOM)
  - [x] Sidebar: Analytics + Email links
  - [x] lib/email.ts: `sendEmail()` generic function
  - [x] `npm run build` passes — 0 TypeScript errors

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

*Tổng: 15 tasks | 15 done ✅ — Phase 2 Complete!*
*Được bóc tách từ context/specs/SRS.md và Stitch design export*

## Session Notes (2026-06-04)

- **TASK-012 (Unit 12): Phân quyền & Quản lý Blog hoàn chỉnh — 11 files**
  - Role system: `admin-guard.ts` — `requireAdmin()` dùng `canAccess(user.role, 'editor')` + `requireAdminOnly()` mới
  - Middleware + layout: cho phép editor vào `/admin`, truyền role xuống sidebar
  - Sidebar: role-conditional links (5 cho admin, 2 cho editor — Dashboard + Bài viết), role badge
  - 7 API route nhạy cảm: chuyển sang `requireAdminOnly()`
  - Blog API: 2 routes mới — list+create (`/api/v1/admin/blog`) + detail+update+delete (`/api/v1/admin/blog/[id]`)
  - Auto slugify tiếng Việt + auto readingTime (content words / 200)
  - UI: `/admin/blog` — table, search, modal tạo/sửa (title, slug, category, tags, excerpt, content HTML, featuredImage, status), toggle status, delete confirm
  - Users page: role change select dropdown (6 roles) thay static badge
  - Build: 0 TypeScript errors
- **TASK-013 (Unit 13): Gap Closure Priority 1 hoàn chỉnh — 4 APIs + 3 UI features**
  - API: POST /api/v1/admin/corals (auto-generate code), POST /api/v1/admin/adoptions/[id]/assign (transaction)
  - API: GET /api/v1/impact/totals (public metrics), POST /api/v1/contact (contactSchema reuse)
  - UI: Leaderboard monthly tabs (API ?type=monthly filter), Community video gallery (YouTube lightbox)
  - UI: Admin dashboard charts (recharts — LineChart adoptions + BarChart revenue 6 tháng)
  - npm install recharts
  - Build: 0 TypeScript errors
- **TASK-014 (Unit 14): Gap Closure Priority 2 hoàn chỉnh — 6 files**
  - API: GET /api/v1/admin/users/[id] (detail + payments + adoptions), DELETE handlers (users + products)
  - Activity logging: logActivity thêm vào product PUT/DELETE routes
  - UI: Products page — create/edit modal (name, slug, tier, pricing, benefits) + delete button
  - UI: Users page — "Chi tiết" button → modal với user info + payment history table + adoption list
  - Build: 0 TypeScript errors

## Session Notes (2026-06-05)

- **Testing Framework ✅ — Vitest + Testing Library**
  - Cài đặt: vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, happy-dom, @vitejs/plugin-react
  - Configure: vitest.config.ts (jsdom environment, path aliases, coverage)
  - Test scripts: `npm test`, `npm run test:watch`, `npm run test:coverage`
  - 6 test files, **122 tests passing**
  - tests/validation.test.ts — 56 tests: registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, createOrderSchema, coralUpdateSchema, blogPostSchema, communitySubmissionSchema, contactSchema, paginationSchema
  - tests/password-strength.test.ts — 12 tests: empty, yếu, trung bình, khá, mạnh, edge cases
  - tests/auth-flow.test.ts — 18 tests: registration→login chain, forgot→reset chain, edge cases
  - tests/login-form.test.tsx — 6 tests: render fields, validation errors, submit, links
  - tsconfig.json: thêm vitest/globals types + exclude tests directory

- **Auth Pages Fixes ✅ — Checklist 4.1-4.4**
  - Component PasswordInput tái sử dụng (src/components/ui/PasswordInput.tsx): visibility toggle với eye/eye-off icons
  - Đăng nhập (/dang-nhap): realtime validation (mode: 'onChange'), PasswordInput, Remember me checkbox, Google OAuth button + divider
  - Đăng ký (/dang-ky): realtime validation, PasswordInput cho cả password + confirmPassword, giữ strength meter
  - dat-lai-mat-khau: TRANG MỚI — form nhập mật khẩu mới với PasswordInput + strength meter, 3 states (missing token, success, form), Suspense boundary
  - Fix forgot-password API: link email từ `/verify-email?resetToken=` → `/dat-lai-mat-khau?token=`
  - Google OAuth đã có sẵn từ TASK-002 (routes: /api/v1/auth/google + /api/v1/auth/google/callback)

- **Build**: ✅ 0 errors — Compiled successfully
- **Tests**: ✅ 122/122 passing (6 files)

- **SRS Sync Pass (2026-06-05) ✅ — 16 gaps fixed across P0, P1, and P2**
  - GC-01 ✅: ProductsPreviewSection + CTABannerSection added to home page.tsx (were created but not imported)
  - GC-02 ✅: Hero CTA text changed from English → Vietnamese: "Nhận nuôi ngay →" + "Tìm hiểu thêm ↓"
  - GC-03 ✅: Header navigation → Vietnamese: "Về chúng tôi", "Sản phẩm", "Blog", "Cộng đồng"
  - GC-04 ✅: StatsSection → SRS scientific metrics (<1%, 25%, 50%) with H-09 body paragraph
  - GC-05 ✅: Hero CTA rounded-full → rounded-lg per Design Spec 4.3.5
  - GC-06 ✅: ProductsHeroSection headline → "Nuôi 1 bé san hô ngay tại đây!" (SRS P-01)
  - GC-07 ✅: Footer → Vietnamese slogan, links, copyright 2026, partner credit (SRS H-20→H-23)
  - GC-08 ✅: HowItWorksSection → Vietnamese: "Cách Coralume hoạt động" with 3 SRS steps
  - GC-09 ✅: AboutHeroSection → SRS A-01 headline with line-by-line reveal animation
  - GC-14 ✅: Register form field order: password before confirmPassword (SRS AU-02)
  - GC-12 ✅: ProcessTimelineSection + TransparencyCommitmentSection added to About page (SRS FR-014/FR-015)
  - GC-27 ✅: coralUpdateSchema images min(0→1) per SRS CP-02
  - GC-28 ✅: AboutCTASection rounded-full → rounded-lg
  - GC-25 ✅: Hero sub-headline added (SRS H-02)
  - Home metadata → Vietnamese description
  - Smooth scroll from Hero CTA phụ to Stats section

- **Build**: ✅ 0 errors — Compiled successfully
- **Tests**: ✅ 123/123 passing (6 files)

*Tổng: 15 tasks | 15 done ✅ + SRS Sync Complete ✅*
