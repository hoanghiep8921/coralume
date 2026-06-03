# Code Standards — Coralume

## TypeScript

- **Strict mode** (`"strict": true` trong tsconfig.json). Không `any` — dùng `unknown` + type guard nếu cần.
- **Explicit return types** cho mọi function public. TypeScript có thể infer, nhưng viết explicit để dễ review.
- **Interfaces cho data shapes**, type cho union/intersection. Dùng `interface` cho object shapes có thể extend, `type` cho union/primitive aliases.
- **Zod cho runtime validation** — mọi input từ client, API request body, query params phải validate qua Zod schema ở `src/lib/validation.ts`.
- **Non-null assertions (`!`) bị cấm.** Dùng optional chaining hoặc type guard.

```ts
// ✅ Đúng
interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

// ❌ Sai — không dùng any
function getUser(id: any) { ... }

// ✅ Đúng — dùng Zod
const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự'),
});
```

---

## Naming Conventions

| Entity | Convention | Example |
|--------|-----------|---------|
| Files (components) | PascalCase | `HeroSection.tsx`, `CoralCard.tsx` |
| Files (utils, hooks, lib) | camelCase | `auth.ts`, `useIntersectionObserver.ts`, `certificate.ts` |
| Folders (route groups) | kebab-case trong `(parentheses)` | `(public)`, `(auth)`, `(dashboard)` |
| Folders (regular) | kebab-case | `coral-portal/`, `san-pham/` |
| Variables / functions | camelCase | `currentUser`, `handlePayment()` |
| Constants | UPPER_SNAKE_CASE | `MAX_UPLOAD_SIZE`, `AMBASSADOR_THRESHOLD` |
| Database tables | snake_case (Prisma convention) | `coral_updates`, `admin_activity_logs` |
| API routes | kebab-case | `/api/v1/products`, `/api/v1/me/adoptions` |
| CSS variables | kebab-case | `--color-coral-orange`, `--duration-glacial` |
| Env variables | UPPER_SNAKE_CASE with prefix | `NEXT_PUBLIC_APP_URL`, `JWT_SECRET` |

---

## File Organization

### Component File Structure

```tsx
// src/components/sections/HeroSection.tsx

import { Button } from '@/components/ui/Button';

// 1. Types (nếu component-specific)
interface HeroSectionProps {
  ctaHref: string;
}

// 2. Component
export function HeroSection({ ctaHref }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* ... */}
    </section>
  );
}

// 3. Export (nếu cần re-export từ index.ts)
```

- **Một component = một file.** Không gộp nhiều components vào 1 file trừ khi component con chỉ dùng cho component cha đó (khi đó đặt dưới dạng sub-component hoặc private helper).
- **Max 200 lines per file.** Nếu vượt quá, tách thành sub-components.
- **Co-locate** files liên quan: component nằm gần page dùng nó. Shared components đưa lên `src/components/ui/` hoặc `src/components/layout/`.

---

## React Patterns

### Server vs Client Components

- **Mặc định = Server Component.** Chỉ thêm `'use client'` khi cần:
  - `useState`, `useEffect`, `useContext`
  - Event handlers (`onClick`, `onSubmit`)
  - Browser APIs (`window`, `localStorage`)
  - Custom hooks dùng state/effects
- **Server Components KHÔNG dùng:**
  - `useState`, `useEffect`, `useRef`
  - Event handlers
  - Browser APIs

### Component Composition

```tsx
// ✅ Đúng — composition, nhận props
<Modal isOpen={isOpen} onClose={onClose}>
  <ModalHeader>Chi tiết san hô</ModalHeader>
  <ModalBody>{/* ... */}</ModalBody>
  <ModalFooter>
    <Button variant="ghost" onClick={onClose}>Đóng</Button>
    <Button variant="primary">Tải PDF</Button>
  </ModalFooter>
</Modal>

// ❌ Sai — hard-coded logic trong UI primitive
<Button onClick={() => { router.push('/dashboard'); setIsOpen(false); }}>
  Vào Dashboard
</Button>
```

### Forms

- Dùng **controlled components** với `useState` cho form có validation.
- **Uncontrolled** (`useRef`, `useForm`) cho form đơn giản (contact, newsletter).
- Validate với **Zod** ở cả client và server.
- **Auto-save** cho profile settings: `onBlur` trigger save, debounce 500ms.

### Data Fetching

- **Server Components:** Fetch data trực tiếp trong component (async component).
- **Client Components:** Dùng React Server Actions hoặc API calls qua `fetch` với error handling.
- **Không** fetch data trong `useEffect` — dùng Server Components hoặc Suspense.

---

## API Route Structure

### Pattern

```ts
// src/app/api/v1/products/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { tier: 'asc' },
    });
    return NextResponse.json({ data: products });
  } catch (error) {
    console.error('[GET /api/v1/products]', error);
    return NextResponse.json(
      { error: 'Không thể tải danh sách sản phẩm' },
      { status: 500 }
    );
  }
}
```

### Rules

- **Mọi API route phải có try-catch.** Trả về JSON error với status code phù hợp.
- **Auth guard** cho mọi route yêu cầu xác thực. Check JWT + role trước khi xử lý.
- **Validate input** với Zod trước khi dùng.
- **Rate limiting** cho login, register, payment endpoints.
- **Consistent response format:**
  ```json
  // Success
  { "data": { ... }, "meta": { "page": 1, "total": 100 } }
  // Error
  { "error": "Error message", "code": "VALIDATION_ERROR" }
  ```

---

## Styling Rules

### Tailwind + CSS Variables

- **Dùng Tailwind cho layout** (flex, grid, padding, margin).
- **Dùng CSS Variables cho design tokens** (colors, spacing, shadows, radius) — đã định nghĩa trong `ui-context.md`.
- **Không hardcode color values** — luôn dùng token: `bg-navy` không phải `bg-[#0F4C5C]`.
- **Responsive prefixes:** `md:`, `lg:` cho tablet/desktop overrides (mobile-first).
- **Dark mode:** Chưa hỗ trợ — chỉ light mode.

```tsx
// ✅ Đúng
<div className="bg-sand-dark border border-sand-dark hover:border-teal
                transition-colors duration-normal ease-in-out">

// ❌ Sai — hardcode values
<div className="bg-[#E8DFC8] border border-[#E8DFC8]"
     style={{ transition: 'all 300ms' }}>
```

### Section Patterns

- Mỗi section có `padding-y` theo token: `py-[var(--section-padding-y)]`
- Container: `max-w-[var(--content-max-width)] mx-auto px-4 md:px-6 lg:px-8`
- Section xen kẽ background: trắng → beige-sand → trắng

---

## Error Handling

### Error Boundaries

- Dùng Next.js `error.tsx` và `not-found.tsx` cho mỗi route segment.
- **Global error boundary** cho unexpected errors.
- **User-friendly messages** bằng tiếng Việt.

```tsx
// src/app/(dashboard)/dashboard/error.tsx
'use client';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-display text-navy mb-4">
        Có lỗi xảy ra
      </h2>
      <p className="text-text-secondary mb-6">
        Không thể tải dashboard. Vui lòng thử lại.
      </p>
      <button onClick={reset} className="btn-primary">
        Thử lại
      </button>
    </div>
  );
}
```

### API Errors

```ts
// Standard error responses
400 — Bad Request (validation failed)
401 — Unauthorized (not authenticated)
403 — Forbidden (insufficient permissions)
404 — Not Found
429 — Too Many Requests (rate limit)
500 — Internal Server Error
```

---

## Database / Prisma

- **Prisma schema** ở `prisma/schema.prisma` — mirror từ SRS section 8.
- **Migrations:** `npx prisma migrate dev` cho development, `npx prisma deploy` cho production.
- **Type generation:** `npx prisma generate` — types auto-generated, KHÔNG sửa tay.
- **Seeding:** `prisma/seed.ts` cho demo data.
- **Singleton Prisma client** ở `src/lib/db.ts` để tránh multiple connections trong dev.

```ts
// src/lib/db.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

---

## Authentication

- **JWT trong httpOnly cookie** — KHÔNG dùng localStorage cho token.
- **Middleware bảo vệ routes:** Next.js middleware cho route groups `(dashboard)`, `/admin`, `/coral-portal`.
- **Role check** ở cả middleware (redirect sớm) VÀ API route (security defense-in-depth).

```ts
// src/lib/auth.ts
import { jwtVerify, SignJWT } from 'jose';

export async function createToken(payload: { userId: string; role: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(new TextEncoder().encode(process.env.JWT_SECRET!));
}

export async function verifyToken(token: string) {
  return jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
}
```

---

## Testing

- **Unit tests:** Vitest cho utility functions, Zod schemas, auth helpers.
- **Integration tests:** API route handlers (mock Prisma).
- **E2E tests:** Playwright cho critical flows: register → verify → pay → dashboard.
- **Test file naming:** `*.test.ts` / `*.spec.ts` cùng folder với source file.

---

## Git & Commit Conventions

- **Conventional Commits:**
  ```
  feat: thêm trang thanh toán
  fix: sửa lỗi redirect khi chưa verify email
  docs: cập nhật architecture.md
  style: chỉnh lại spacing hero section
  refactor: tách auth middleware thành lib riêng
  test: thêm test cho payment flow
  chore: cập nhật dependencies
  ```
- **Branch naming:** `feat/NN-feature-name`, `fix/NN-bug-name`
- **PR:** Mỗi unit = 1 PR. Squash merge.
- **Before push:** `npm run build` phải pass, không TypeScript errors, không console errors.