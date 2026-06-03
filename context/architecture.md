# Architecture — Coralume

## Stack Table

| Layer | Technology | Role |
|-------|-----------|------|
| **Frontend** | Next.js 14+ (App Router, React) | SSR/SSG cho SEO, React Server Components, API routes |
| **Language** | TypeScript (strict mode) | Type-safe toàn bộ codebase |
| **Styling** | Tailwind CSS + CSS Variables | Utility-first + design tokens từ Design Spec |
| **Backend API** | Next.js Route Handlers (API Routes) | REST API, cùng repo với frontend (monorepo) |
| **Database** | PostgreSQL 15+ | Primary data store, quan hệ cho user-coral mapping |
| **ORM** | Prisma | Type-safe database access, migrations |
| **Auth** | JWT (httpOnly cookie) + email verification | Session management, role-based access |
| **Storage** | AWS S3 hoặc Cloudflare R2 | Lưu ảnh/video san hô, certificate PDF, avatars |
| **CDN** | Cloudflare | Tăng tốc tải ảnh, cache static assets |
| **Payment** | VNPay API + MoMo API | Payment gateway redirect |
| **Email** | Resend hoặc AWS SES | Transactional emails (8 templates) |
| **Maps** | Google Maps hoặc Mapbox embed | GPS reef location (vùng tương đối) |
| **Hosting** | VPS (DigitalOcean) hoặc Cloud Provider | Deploy production |
| **Analytics** | Google Analytics 4 + Meta Pixel | Tracking + remarketing |

---

## System Boundaries

### Folder Structure

```
coralume/
├── context/                          # Six-File Context System
├── public/                           # Static assets (favicon, og images)
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (public)/                 # Public pages (route group)
│   │   │   ├── page.tsx              # Home
│   │   │   ├── ve-chung-toi/         # About
│   │   │   ├── san-pham/             # Products
│   │   │   ├── blog/                 # Blog listing + detail
│   │   │   ├── bang-xep-hang/        # Leaderboard
│   │   │   └── cong-dong/            # Community
│   │   ├── (auth)/                   # Auth pages (route group)
│   │   │   ├── dang-nhap/            # Login
│   │   │   ├── dang-ky/              # Register
│   │   │   ├── quen-mat-khau/        # Forgot password
│   │   │   └── verify-email/         # Email verification
│   │   ├── (dashboard)/              # Adopter dashboard (protected)
│   │   │   ├── dashboard/            # Main dashboard
│   │   │   └── profile/              # Profile settings
│   │   ├── (checkout)/               # Payment flow (protected)
│   │   │   ├── thanh-toan/           # Checkout page
│   │   │   └── thanh-cong/           # Success page
│   │   ├── admin/                    # Admin panel (protected, role=admin)
│   │   ├── coral-portal/             # Coral staff portal (protected, role=coral_staff)
│   │   └── api/                      # Route handlers (API endpoints)
│   │       ├── v1/                   # API versioning
│   │       │   ├── auth/             # Auth endpoints
│   │       │   ├── products/         # Public product endpoints
│   │       │   ├── blog/             # Blog endpoints
│   │       │   ├── leaderboard/      # Leaderboard endpoints
│   │       │   ├── community/        # Community endpoints
│   │       │   ├── me/               # Adopter endpoints
│   │       │   ├── orders/           # Order/payment endpoints
│   │       │   ├── payments/         # Payment callback endpoints
│   │       │   ├── admin/            # Admin endpoints
│   │       │   └── portal/           # Coral portal endpoints
│   │       └── webhooks/             # Payment webhooks
│   ├── components/                   # Reusable UI components
│   │   ├── ui/                       # Primitive components (Button, Input, Modal, Card)
│   │   ├── layout/                   # Layout components (Header, Footer, Container)
│   │   ├── sections/                 # Page sections (HeroSection, StatsSection, etc.)
│   │   └── forms/                    # Form components
│   ├── lib/                          # Shared utilities
│   │   ├── db.ts                     # Prisma client singleton
│   │   ├── auth.ts                   # JWT utilities
│   │   ├── email.ts                  # Email service (Resend/AWS SES)
│   │   ├── storage.ts                # S3/Cloudflare R2 client
│   │   ├── payment/                  # Payment integrations
│   │   │   ├── vnpay.ts
│   │   │   └── momo.ts
│   │   ├── certificate.ts            # PDF certificate generation
│   │   └── validation.ts             # Zod schemas
│   ├── hooks/                        # React custom hooks
│   ├── config/                       # App configuration
│   │   ├── site.ts                   # Site metadata
│   │   └── constants.ts              # Business constants
│   └── types/                        # TypeScript type definitions
├── prisma/
│   └── schema.prisma                 # Database schema
├── context/                          # Six-File Context System (this folder)
├── CLAUDE.md                         # Entry point for AI agent
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

### Responsibility Map

| Boundary | Owns | Must NOT |
|----------|------|----------|
| `src/app/(public)/` | Public page UI, SEO, OG tags | Chứa business logic — delegate to lib/ |
| `src/app/api/` | Request validation, auth guard, orchestration | Chứa UI rendering logic |
| `src/components/` | UI rendering, styling, accessibility | Gọi trực tiếp database — phải qua lib/ |
| `src/lib/` | Business logic, external service calls, DB queries | Chứa JSX/React code |
| `prisma/` | Database schema, migrations | Chứa API logic |
| `admin/` | Admin CRUD, reporting, analytics | Expose public routes |
| `coral-portal/` | Coral update forms, upload | Chứa logic adopter dashboard |

---

## Storage Model

| Storage | What lives here | Examples |
|---------|----------------|----------|
| **PostgreSQL** | Users, products, corals, adoptions, payments, referrals, blog posts, community submissions, certificates metadata, activity logs, email logs | Tất cả relational data |
| **S3 / Cloudflare R2** | Coral photos (1-5 per update), coral videos, user avatars, certificate PDFs, blog featured images, community submission images, product images | File storage, KHÔNG lưu trên server |
| **Cloudflare CDN** | Cache static assets (JS bundles, CSS, images from origin) | Performance |
| **JWT Cookie (httpOnly)** | Session token (user id, role, expiry) | Authentication — KHÔNG lưu session state trên server |
| **Browser localStorage/sessionStorage** | KHÔNG dùng cho dữ liệu quan trọng — chỉ dùng cho UI state tạm (form draft, filter state) | Client-side only |

### Database Key Relationships

```
users (1) ──────── (N) adoptions ──────── (1) corals
  │                       │
  │                       │
  │                       │
  │              (1) products
  │
  ├── (N) coral_updates (via staff_id)
  ├── (N) payments
  ├── (N) referrals (referrer_id, referred_id)
  ├── (N) blog_posts (author_id)
  └── (N) admin_activity_logs (admin_id)
```

---

## Auth & Access Model

### Authentication
- **Primary:** Email + password (bcrypt/argon2 hash)
- **Optional:** Google OAuth
- **Email verification:** BẮT BUỘC trước khi cho phép thanh toán
- **Session:** JWT stored in httpOnly, secure cookie
- **Remember-me:** 30 ngày cookie expiry
- **Password reset:** Email link với expiry token (15 phút)
- **2FA:** Khuyến nghị bắt buộc cho admin

### Authorization (Role-Based)

| Role | Can Access |
|------|-----------|
| `visitor` | Public pages only: home, about, products, blog, leaderboard, community |
| `adopter` | Visitor + dashboard, checkout, profile, referral |
| `ambassador` | Adopter + ambassador perks (badge, exclusive page) |
| `admin` | All + /admin panel (Super Admin, Editor, Coral Center sub-roles) |
| `coral_staff` | /coral-portal only (limited to coral update operations) |

### Invariants (Rules Never Violate)

1. **Auth at every mutation boundary** — Mọi API endpoint thay đổi data PHẢI kiểm tra JWT và role trước khi xử lý. Không có ngoại lệ.
2. **Email verified before payment** — User chưa verify email KHÔNG thể tạo đơn hàng hoặc thanh toán. Kiểm tra ở cả client và server.
3. **Coral updates only by coral_staff or admin** — Chỉ role `coral_staff` hoặc `admin` được tạo `coral_updates`. Adopter chỉ read.
4. **Admin panel isolated** — `/admin` routes KHÔNG liên kết từ bất kỳ public page nào. Phân quyền riêng, activity log cho mọi hành động.
5. **Payment data never stored** — Không lưu thông tin thẻ, CVV, hay payment credentials. Luôn redirect qua cổng thanh toán.
6. **GPS coordinates protected** — Tọa độ GPS chính xác của san hô chỉ hiển thị cho admin/coral_staff. Adopter chỉ thấy vùng tương đối (location_zone).
7. **One request handler = one responsibility** — Route handlers không chạy long-lived tasks (generate certificate, send email batch). Delegate to background jobs or async processing.
8. **Validation on both sides** — Input validate ở client (UX) VÀ server (security). Server validation dùng Zod schemas từ `src/lib/validation.ts`.

---

## Third-Party Integrations

| Service | Purpose | Integration Method |
|---------|---------|-------------------|
| VNPay | Payment gateway | Redirect + callback webhook |
| MoMo | Payment gateway | Redirect/QR + callback webhook |
| Resend / AWS SES | Transactional emails | REST API |
| S3 / Cloudflare R2 | File storage | SDK (upload, presigned URL) |
| Google OAuth | Social login | OAuth 2.0 flow |
| Google Analytics 4 | Analytics | Script embed + Measurement Protocol |
| Meta Pixel | Remarketing | Script embed |
| Google Maps / Mapbox | GPS embed | JS SDK embed |

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Auth
JWT_SECRET=...
JWT_EXPIRY=30d

# Storage
S3_BUCKET=...
S3_REGION=...
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...

# Payment
VNPAY_TMN_CODE=...
VNPAY_HASH_SECRET=...
VNPAY_URL=...
MOMO_ACCESS_KEY=...
MOMO_SECRET_KEY=...

# Email
RESEND_API_KEY=...
# hoặc AWS SES credentials

# OAuth (optional)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Maps
GOOGLE_MAPS_API_KEY=...
# hoặc MAPBOX_ACCESS_TOKEN=...

# Analytics
GA4_MEASUREMENT_ID=...
META_PIXEL_ID=...

# App
NEXT_PUBLIC_APP_URL=https://coralume.vn
NODE_ENV=production
```
