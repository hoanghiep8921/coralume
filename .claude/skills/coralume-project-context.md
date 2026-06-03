---
name: coralume-project-context
description: Tổng quan dự án Coralume — product definition, 12 pages, 5 roles, tech stack, build units
---

## Coralume Project Context

### Product

**Coralume = Coral + Illuminate** — Nền tảng "nhận nuôi san hô" kết hợp behavioral economics + ESG.

**Slogan:** "Nhận nuôi san hô — Gieo mầm cho đại dương"

**Tone of voice:** Ấm, cá nhân, có dữ liệu — KHÔNG kêu gọi từ thiện.

### 3 Gói Sản Phẩm

| Gói | Giá | Mô tả |
|-----|-----|-------|
| Seed Coral | 200-300K | Certificate số, update hàng tháng, dashboard |
| Reef Guardian | 500-700K | + GPS, premium video, báo cáo chi tiết |
| Diving Experience | 1-2M | + Trải nghiệm lặn, tự tay trồng san hô |

### 12 Pages

Home, About, Products, Dashboard, Blog, Leaderboard, Community, Auth (login/register), Checkout, Success, Admin Panel, Coral Portal

### 5 Roles

Visitor, Adopter, Ambassador (≥5 referrals), Admin, Coral Staff

### Tech Stack

- **Frontend:** Next.js 16.2.7 + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes (monorepo)
- **Database:** PostgreSQL + Prisma 7.8.0
- **Auth:** JWT httpOnly cookie
- **Storage:** S3 / Cloudflare R2
- **Payment:** VNPay, MoMo
- **Email:** Resend / AWS SES
- **Validation:** Zod v4

### Project Structure

```
coralume/
├── context/                          # Six-File Context System
│   ├── project-overview.md          # Product definition, goals, flows
│   ├── architecture.md              # Stack, boundaries, invariants
│   ├── ui-context.md                # Design system (996 dòng)
│   ├── code-standards.md            # TS, React, API rules
│   ├── ai-workflow-rules.md         # Workflow, scoping, verification
│   └── progress-tracker.md          # Current status, next steps
├── src/
│   ├── app/                         # Next.js App Router
│   ├── components/{ui,layout,sections,forms}
│   ├── lib/{db,auth,email,storage,payment,validation}
│   ├── config/{site,constants}
│   └── types/
├── prisma/schema.prisma             # 12 entities, 25 enums
├── CLAUDE.md                        # Entry point
└── Coralume-SRS.md                  # Full spec (tham khảo)
```

### Reference Documents

- `context/project-overview.md` — Product definition, user flows, features
- `context/architecture.md` — Tech stack, folder structure, invariants
- `context/ui-context.md` — Full design system (colors, typography, animation, responsive)
- `context/code-standards.md` — TypeScript, React, API, styling rules
- `context/ai-workflow-rules.md` — How to work with AI on this project
- `Coralume-SRS.md` — Full requirements specification
- `Coralume-Design-Spec.md` — Full design specification

### Deadline

**Go-live: 15/06/2026**
