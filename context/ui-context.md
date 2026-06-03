# UI Context — Coralume Design System

> Nguồn: Coralume-Design-Spec.md + Stitch export (stitch_coralume_coral_restoration_dashboard)
> Updated: 2026-06-03 — Cross-referenced with Stitch design tokens

---

## PHẦN 1: HỆ THỐNG MÀU SẮC (COLOR SYSTEM)

### 1.1 Material Design 3 Tokens (từ Stitch)

Stitch export sử dụng Material Design 3 naming. Đây là source of truth cho colors.

| Token | HEX | Vai trò |
|-------|-----|---------|
| `primary` | `#003441` | Headlines, important text, primary actions |
| `on-primary` | `#ffffff` | Text on primary |
| `primary-container` | `#0f4c5c` | **Navy Deep** — headers, footer, text nhấn mạnh |
| `on-primary-container` | `#87bbce` | Light accent text on primary container |
| `primary-fixed` | `#b6ebfe` | Light primary variant |
| `primary-fixed-dim` | `#9acee1` | **Ocean Blue** — hero overlay, soft backgrounds |
| `secondary` | `#9f411e` | **Coral Orange** — CTA buttons, highlights |
| `on-secondary` | `#ffffff` | Text on secondary |
| `secondary-container` | `#fe885f` | **Coral Light** — hover states, soft highlights |
| `on-secondary-container` | `#732100` | Dark text on secondary container |
| `tertiary` | `#0e3340` | Sub-headers, dark accent |
| `tertiary-container` | `#284a57` | Teal dark — sub-sections |
| `on-tertiary-container` | `#96b9c8` | **Teal Mid** — hover states, accent phụ |
| `surface` / `surface-bright` / `background` | `#fff9ea` | **Beige Sand** — page background |
| `on-surface` | `#1d1c13` | **Text Dark** — body text, headings |
| `on-surface-variant` | `#40484b` | Secondary text |
| `surface-container-lowest` | `#ffffff` | **White** — card backgrounds |
| `surface-container` | `#f3edde` | Card bg variant |
| `outline` | `#70787c` | Borders |
| `outline-variant` | `#c0c8cb` | Light borders |
| `error` | `#ba1a1a` | Error states |
| `error-container` | `#ffdad6` | Error container |

### 1.2 Semantic Mapping (Stitch → Tailwind)

| Semantic | Stitch Token | HEX | Tailwind Class |
|----------|-------------|-----|----------------|
| `--color-primary` | `primary` | `#003441` | `text-primary` |
| `--color-primary-container` | `primary-container` | `#0f4c5c` | `bg-primary-container` |
| `--color-accent` | `secondary` | `#9f411e` | `bg-secondary` |
| `--color-accent-light` | `secondary-container` | `#fe885f` | `bg-secondary-container` |
| `--color-bg` | `surface` / `background` | `#fff9ea` | `bg-surface` |
| `--color-bg-card` | `surface-container-lowest` | `#ffffff` | `bg-surface-container-lowest` |
| `--color-text` | `on-surface` | `#1d1c13` | `text-on-surface` |
| `--color-text-muted` | `on-surface-variant` | `#40484b` | `text-on-surface-variant` |
| `--color-border` | `outline-variant` | `#c0c8cb` | `border-outline-variant` |
| `--color-teal` | `on-tertiary-container` | `#96b9c8` | `text-on-tertiary-container` |
| `--color-ocean` | `primary-fixed-dim` | `#9acee1` | `bg-primary-fixed-dim` |

### 1.3 Color Usage Rules (từ Stitch design)

- **Primary (`#003441`)**: Headlines, nav text, important CTAs
- **Secondary (`#9f411e`)**: Primary CTA buttons, accents — CHỈ điểm nhấn, mỗi page tối đa 1-2 vị trí
- **Secondary Container (`#fe885f`)**: Hover states, badges, soft highlights
- **Surface (`#fff9ea`)**: Page background — warm beige/sand feel
- **Surface Lowest (`#ffffff`)**: Card backgrounds, breathing room

---

## PHẦN 2: TYPOGRAPHY

### 2.1 Font Stack (từ Stitch DESIGN.md)

| Role | Font | Size | Weight | Line-height | Letter-spacing |
|------|------|------|--------|-------------|----------------|
| `display-lg` | Lexend | 48px | 600 | 1.1 | -0.02em |
| `display-lg-mobile` | Lexend | 32px | 600 | 1.2 | — |
| `headline-md` | Lexend | 24px | 500 | 1.3 | — |
| `body-lg` | Be Vietnam Pro | 18px | 400 | 1.6 | — |
| `body-md` | Be Vietnam Pro | 16px | 400 | 1.5 | — |
| `data-mono` | JetBrains Mono | 14px | 500 | 1.4 | 0.05em |
| `label-sm` | Be Vietnam Pro | 12px | 600 | 1 | 0.08em |
| `heading-serif` | Lora | — | 400/600 | — | — |

### 2.2 Font Families

```
display-lg → Lexend (headlines, hero)
heading-serif → Lora (subtle headings, quotes)
body-lg / body-md / label-sm → Be Vietnam Pro (Vietnamese optimized)
data-mono → JetBrains Mono (numbers, stats, IDs)
```

---

## PHẦN 3: SPACING & LAYOUT

### 3.1 Spacing System (từ Stitch)

| Token | Value | Usage |
|-------|-------|-------|
| `unit` | 8px | Base spacing unit |
| `stack-sm` | 8px | Tight spacing |
| `stack-md` | 24px | Section gap |
| `stack-lg` | 48px | Large section gap |
| `gutter` | 24px | Horizontal padding |
| `margin-mobile` | 20px | Mobile margin |
| `margin-desktop` | 64px | Desktop margin |
| `container-max` | 1280px | Max container width |

### 3.2 Border Radius (từ Stitch)

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 0.25rem (4px) | Badges, small elements |
| `DEFAULT` | 0.5rem (8px) | Buttons, inputs |
| `lg` | 0.5rem (8px) | Cards |
| `xl` | 0.75rem (12px) | Large containers |
| `full` | 9999px | Pills, avatars |

---

## PHẦN 4: RESPONSIVE BREAKPOINTS

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | < 768px | 1 cột, padding 20px, display-lg-mobile 32px |
| Tablet | 768–1023px | 2 cột, padding 24px |
| Desktop | > 1024px | 3-4 cột, padding 64px, display-lg 48px |

---

## PHẦN 5: ANIMATION RULES

- **Allowed:** fade-in, slide-up, scale nhẹ (1.02-1.05), parallax dịu, transition mượt
- **Forbidden:** bounce, flash, rotate, flip, shake, animation < 200ms
- **Admin Portal / Coral Portal:** KHÔNG animation

---

## PHẦN 6: ACCESSIBILITY (WCAG 2.1 AA)

- Tất cả images có `alt` text
- Form inputs có `<label>` liên kết
- Keyboard navigation (Tab, Enter, Escape)
- Focus visible: `outline: 2px solid secondary + outline-offset: 2px`
- `prefers-reduced-motion: reduce` support

---

## PHẦN 7: TAILWIND CONFIG (from Stitch)

```js
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: '#003441',
        'primary-container': '#0f4c5c',
        'primary-fixed': '#b6ebfe',
        'primary-fixed-dim': '#9acee1',
        secondary: '#9f411e',
        'secondary-container': '#fe885f',
        tertiary: '#0e3340',
        'tertiary-container': '#284a57',
        'on-tertiary-container': '#96b9c8',
        surface: '#fff9ea',
        'surface-container-lowest': '#ffffff',
        'surface-container': '#f3edde',
        'on-surface': '#1d1c13',
        'on-surface-variant': '#40484b',
        outline: '#70787c',
        'outline-variant': '#c0c8cb',
        error: '#ba1a1a',
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
      fontFamily: {
        'display-lg': ['Lexend'],
        'display-lg-mobile': ['Lexend'],
        'headline-md': ['Lexend'],
        'body-lg': ['Be Vietnam Pro'],
        'body-md': ['Be Vietnam Pro'],
        'label-sm': ['Be Vietnam Pro'],
        'data-mono': ['JetBrains Mono'],
        'heading-serif': ['Lora'],
      },
      fontSize: {
        'display-lg': ['48px', { lineHeight: '1.1', fontWeight: '600', letterSpacing: '-0.02em' }],
        'display-lg-mobile': ['32px', { lineHeight: '1.2', fontWeight: '600' }],
        'headline-md': ['24px', { lineHeight: '1.3', fontWeight: '500' }],
        'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'data-mono': ['14px', { lineHeight: '1.4', letterSpacing: '0.05em', fontWeight: '500' }],
        'label-sm': ['12px', { lineHeight: '1', letterSpacing: '0.08em', fontWeight: '600' }],
      },
      spacing: {
        'stack-sm': '8px',
        'stack-md': '24px',
        'stack-lg': '48px',
        'gutter': '24px',
        'margin-mobile': '20px',
        'margin-desktop': '64px',
        'container-max': '1280px',
      },
    },
  },
}
```

---

## PHẦN 8: STITCH SCREENS → SRS PAGES MAP

| Stitch Screen | SRS Pages | FR Requirements |
|--------------|-----------|-----------------|
| `coralume_home_1/2/3` | Trang chủ | FR-001→FR-007 |
| `coralume_home_mobile` | Home mobile | FR-001→FR-007 |
| `coralume_our_story` | Về chúng tôi | FR-010→FR-015 |
| `coralume_the_future_of_conservation` | About variant | FR-010→FR-015 |
| `coralume_abyssal_marketplace` | Sản phẩm | FR-020→FR-024 |
| `coralume_choose_your_impact` | Products detail | FR-020→FR-024 |
| `coralume_adopt_a_coral` | Checkout/Adopt | FR-050→FR-052 |
| `coralume_adopt_a_coral_mobile` | Adopt mobile | FR-050→FR-052 |
| `coralume_my_impact_nexus` | Dashboard | FR-040→FR-047 |
| `coralume_your_impact_dashboard_1/2/3` | Dashboard variants | FR-040→FR-047 |
| `coralume_global_guardian_network_1/2/3` | Leaderboard | FR-070→FR-071 |
| `coralume_our_community` | Community | FR-080→FR-082 |
| `coralume_our_community_mobile` | Community mobile | FR-080→FR-082 |

---

## PHẦN 9: DESIGN RULES (BẮT BUỘC)

1. **LUÔN dùng Stitch design tokens** — không hardcode colors
2. **LUÔN cross-reference với Stitch HTML** trước khi code UI mới
3. **Stitch là source of truth** cho layout, spacing, colors, typography
4. **Nếu Stitch unavailable** → báo user, KHÔNG đoán UI
5. **Admin Portal / Coral Portal** → KHÔNG animation
