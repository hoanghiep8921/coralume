---
name: create-api-endpoint
description: Tạo API endpoint mới cho Coralume — với auth guard, Zod validation, error handling, rate limiting theo code-standards.md
---

## Create API Endpoint

Khi được yêu cầu tạo API endpoint cho Coralume, tuân theo các quy tắc sau:

### 1. File Structure

```
src/app/api/v1/{resource}/route.ts     # Collection endpoint
src/app/api/v1/{resource}/{id}/route.ts # Item endpoint
```

### 2. Response Format

```ts
// Success
return NextResponse.json({ data: result, meta: { page, total } });

// Error
return NextResponse.json({ error: 'Message', code: 'VALIDATION_ERROR' }, { status: 400 });
```

### 3. Mandatory Pattern

```ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { validationSchema } from '@/lib/validation';
import { verifyToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // 1. Auth check (nếu endpoint yêu cầu)
    const token = request.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    if (!token) {
      return NextResponse.json({ error: 'Chưa đăng nhập', code: 'UNAUTHORIZED' }, { status: 401 });
    }
    const payload = await verifyToken(token);

    // 2. Validate input
    const { searchParams } = new URL(request.url);
    const query = validationSchema.safeParse(Object.fromEntries(searchParams));
    if (!query.success) {
      return NextResponse.json({ error: query.error.issues[0]?.message }, { status: 400 });
    }

    // 3. Business logic
    const result = await prisma.model.findMany({ ... });
    return NextResponse.json({ data: result });

  } catch (error) {
    console.error('[GET /api/v1/resource]', error);
    return NextResponse.json({ error: 'Lỗi server', code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
```

### 4. Auth Guard by Role

- **Public endpoints** (`/products`, `/blog/posts`): Không cần auth
- **Adopter endpoints** (`/me/...`, `/orders`): Kiểm tra JWT, role = adopter/ambassador/admin
- **Admin endpoints** (`/admin/...`): Kiểm tra JWT, role = admin
- **Coral Portal endpoints** (`/portal/...`): Kiểm tra JWT, role = coral_staff/admin

### 5. Rate Limiting

Áp dụng cho các endpoint nhạy cảm:
- `/api/v1/auth/login` — 5 requests/minute
- `/api/v1/auth/register` — 3 requests/minute
- `/api/v1/orders` — 3 requests/minute

### 6. Error Codes

| Status | Code | Khi nào dùng |
|--------|------|-------------|
| 400 | VALIDATION_ERROR | Input không hợp lệ |
| 401 | UNAUTHORIZED | Không có token hoặc token hết hạn |
| 403 | FORBIDDEN | Không đủ quyền |
| 404 | NOT_FOUND | Resource không tồn tại |
| 409 | CONFLICT | Trùng lặp (email, slug) |
| 429 | RATE_LIMITED | Quá giới hạn request |
| 500 | INTERNAL_ERROR | Lỗi server |

### 7. Invariants

- **Mọi mutation endpoint** PHẢI kiểm tra auth + role trước khi xử lý
- **Email verified before payment** — Kiểm tra `isVerified` trước khi cho phép tạo order
- **Coral updates only by coral_staff/admin** — Kiểm tra role trước khi tạo coral update
- **GPS coordinates protected** — Chỉ trả về `location_zone` cho adopter, `location_gps` chỉ cho admin/staff
- **Không concat SQL** — Luôn dùng Prisma, KHÔNG viết raw query trừ khi cần thiết
