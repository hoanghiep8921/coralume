---
name: create-form
description: Tạo form với Zod validation + react-hook-form cho Coralume — đúng validation schemas từ validation.ts
---

## Create Form

Khi được yêu cầu tạo form cho Coralume, tuân theo các quy tắc sau:

### 1. Pattern

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/lib/validation';

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    // handle response
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Fields */}
    </form>
  );
}
```

### 2. Input Pattern

```tsx
<div className="space-y-1">
  <label htmlFor="email" className="block text-sm font-medium text-text-primary">
    Email
  </label>
  <input
    id="email"
    type="email"
    {...register('email')}
    className={`block w-full rounded-md border px-3 py-2 font-sans text-base
      ${errors.email
        ? 'border-danger focus:border-danger'
        : 'border-sand-dark focus:border-navy'
      }
      transition-colors duration-fast`}
    placeholder="email@example.com"
    aria-invalid={!!errors.email}
    aria-describedby={errors.email ? 'email-error' : undefined}
  />
  {errors.email && (
    <p id="email-error" className="text-sm text-danger" role="alert">
      {errors.email.message}
    </p>
  )}
</div>
```

### 3. Validation Schema Mapping

| Form | Schema | File |
|------|--------|------|
| Đăng ký | `registerSchema` | src/lib/validation.ts |
| Đăng nhập | `loginSchema` | src/lib/validation.ts |
| Quên mật khẩu | `forgotPasswordSchema` | src/lib/validation.ts |
| Reset mật khẩu | `resetPasswordSchema` | src/lib/validation.ts |
| Cập nhật profile | `updateProfileSchema` | src/lib/validation.ts |
| Tạo đơn hàng | `createOrderSchema` | src/lib/validation.ts |
| Coral update | `coralUpdateSchema` | src/lib/validation.ts |
| Đăng blog | `blogPostSchema` | src/lib/validation.ts |
| Submit community | `communitySubmissionSchema` | src/lib/validation.ts |
| Liên hệ | `contactSchema` | src/lib/validation.ts |

### 4. Mobile Rules

- **Form inputs:** `text-base` (16px) trên mobile để tránh iOS auto-zoom
- **Touch targets:** ≥ 44px height cho buttons và inputs
- **Labels:** Luôn có `<label>` liên kết với input qua `htmlFor`/`id`
- **Error messages:** `role="alert"` cho screen readers

### 5. Submit Button Pattern

```tsx
<button
  type="submit"
  disabled={isSubmitting}
  className="btn-primary w-full md:w-auto"
>
  {isSubmitting ? (
    <span className="flex items-center justify-center gap-2">
      <svg className="animate-spin h-4 w-4" ... />
      Đang xử lý...
    </span>
  ) : (
    'Đăng nhập'
  )}
</button>
```

### 6. Auto-save Pattern (Profile Settings)

```tsx
// Debounced save on blur
const handleBlur = async (field: string, value: string) => {
  await new Promise(r => setTimeout(r, 500)); // debounce
  await fetch('/api/v1/me', {
    method: 'PUT',
    body: JSON.stringify({ [field]: value }),
  });
};
```
