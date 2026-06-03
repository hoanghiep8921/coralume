---
name: create-ui-component
description: Tạo UI component cho Coralume — BẮT BUỘC dùng Stitch MCP lấy Figma design trước, sau đó code theo design tokens từ ui-context.md
tools: Read, Write, Edit, Bash, Glob, Grep, mcp__stitch
---

## BẮT BUỘC: Dùng Stitch MCP trước khi code

**MỌI UI component PHẢI được lấy từ Figma qua Stitch MCP trước khi code.**
Không được code UI từ spec text — luôn lấy design từ Stitch MCP trước.

### Workflow
1. Dùng Stitch MCP lấy screen/component từ Figma
2. Extract design tokens (colors, typography, spacing)
3. Cross-reference với `context/ui-context.md`
4. Code component theo Stitch design
5. Verify với Stitch screenshot

---

## Create UI Component

### 1. Design Tokens — KHÔNG hardcode values

- **Colors:** Dùng Tailwind tokens từ `globals.css` — `bg-navy`, `text-coral`, `border-sand-dark` — KHÔNG dùng `bg-[#0F4C5C]` hay `style={{ color: '#E87750' }}`
- **Coral Orange rule:** `#E87750` CHỈ dùng cho điểm nhấn (CTA, badge, giá). Không làm background section lớn, không làm text body.
- **Spacing:** Dùng Tailwind spacing + CSS custom properties (`--section-padding-y`, `--content-max-width`)
- **Border radius:** `--radius-sm` (6px), `--radius-md` (8px), `--radius-lg` (16px), `--radius-xl` (24px)
- **Shadows:** `--shadow-card`, `--shadow-card-hover`, `--shadow-button`, `--shadow-modal`

### 2. Typography

- **Headings (h1-h3):** `font-display` (Lora), bold 700
- **Sub-headings (h4-h6):** `font-display` (Lora) hoặc `font-sans` (Be Vietnam Pro), semibold 600
- **Body:** `font-sans` (Be Vietnam Pro), regular 400
- **Quotes:** `font-display` (Lora Italic), italic 400
- **Stats/Numbers:** `font-mono` (JetBrains Mono), medium 500

### 3. Responsive — Mobile First

- Base styles = mobile (320px+)
- Tablet overrides: `md:` (768px+)
- Desktop overrides: `lg:` (1024px+)
- Container: fluid mobile → 720px tablet → 1200px desktop
- Padding: 16px mobile → 24px tablet → 32px desktop
- Grid: 1 cột → 2 cột → 3-4 cột

### 4. Animation

- **Allowed:** fade-in, slide-up, scale nhẹ (1.02-1.05), parallax dịu, transition mượt
- **Forbidden:** bounce, flash, rotate, flip, shake, animation < 200ms
- **Easing:** `--ease-out-expo` (default), `--ease-out-quint` (card hover), `--ease-spring` (scale on hover)
- **Duration:** `--duration-fast` (200ms), `--duration-normal` (300ms), `--duration-slow` (500ms), `--duration-glacial` (800ms)
- Admin Portal & Coral Portal: KHÔNG animation

### 5. Accessibility (WCAG 2.1 AA)

- Tất cả images có `alt` text
- Form inputs có `<label>` liên kết
- Keyboard navigation (Tab, Enter, Escape)
- Focus visible: `outline: 2px solid coral + outline-offset: 2px`
- Contrast ratios: Text Dark #2C3E50 trên White = 12.6:1 ✅ | Text Gray #8A9BA8 chỉ dùng cho caption/label (2.8:1)
- `prefers-reduced-motion: reduce` support

### 6. Component Pattern

```tsx
'use client'; // chỉ khi cần state/event handlers

import type { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLElement> {
  // define props
}

export function ComponentName({ className, ...props }: Props) {
  return (
    <section className={`section-padding ${className ?? ''}`}>
      <div className="container">
        {/* content */}
      </div>
    </section>
  );
}
```

### 7. File Location

- **Primitive components** (Button, Input, Modal, Card): `src/components/ui/`
- **Layout components** (Header, Footer, Container): `src/components/layout/`
- **Page sections** (HeroSection, StatsSection): `src/components/sections/`
- **Form components**: `src/components/forms/`

### 8. Loading & Empty States

- Page load: Skeleton loader (Beige Sand, pulse nhẹ)
- Image load: Blur-up placeholder (Ocean Blue blur)
- Empty state: Illustration + CTA (tiếng Việt)
