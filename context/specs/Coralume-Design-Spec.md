# CORALUME — DESIGN SPECIFICATION

## Bảng màu · Typography · Responsive · Animation · Icon · Hình ảnh

**Version:** 1.0 | **Date:** 03/06/2026

---

## PHẦN 1: HỆ THỐNG MÀU SẮC (COLOR SYSTEM)

### 1.1 Bảng màu chính — 10 màu

| # | Tên màu | Vai trò | Mã HEX | Mã HSL | Mã RGB |
|---|---------|--------|--------|--------|--------|
| 1 | **Ocean Blue** | Chủ đạo — BG, hero overlay, section mềm | `#B5D8E8` | `hsl(199, 53%, 81%)` | `rgb(181, 216, 232)` |
| 2 | **Navy Deep** | Headers, footer, text nhấn mạnh | `#0F4C5C` | `hsl(193, 72%, 21%)` | `rgb(15, 76, 92)` |
| 3 | **Teal Mid** | Sub-headers, hover states, accent phụ | `#5BA8B5` | `hsl(189, 38%, 53%)` | `rgb(91, 168, 181)` |
| 4 | **Coral Orange** | CTA buttons, highlights, badge, giá — **CHỈ dùng làm điểm nhấn** | `#E87750` | `hsl(15, 77%, 61%)` | `rgb(232, 119, 80)` |
| 5 | **Coral Light** | Hover CTA, soft highlights | `#F4B89A` | `hsl(20, 80%, 78%)` | `rgb(244, 184, 154)` |
| 6 | **Beige Sand** | Background phụ, card backgrounds | `#F5EFE0` | `hsl(43, 51%, 92%)` | `rgb(245, 239, 224)` |
| 7 | **Sand Dark** | Border, dividers, secondary BG | `#E8DFC8` | `hsl(43, 41%, 85%)` | `rgb(232, 223, 200)` |
| 8 | **White** | Background chính, breathing room | `#FFFFFF` | `hsl(0, 0%, 100%)` | `rgb(255, 255, 255)` |
| 9 | **Text Dark** | Body text, headings | `#2C3E50` | `hsl(210, 29%, 24%)` | `rgb(44, 62, 80)` |
| 10 | **Text Gray** | Secondary text, labels, metadata | `#8A9BA8` | `hsl(206, 15%, 60%)` | `rgb(138, 155, 168)` |

### 1.2 Quy tắc sử dụng màu (Color Usage Rules)

#### 1.2.1 Màu CHỦ ĐẠO (Primary)

| Màu | Vai trò cụ thể | Ví trí sử dụng |
|------|---------------|----------------|
| Ocean Blue `#B5D8E8` | Màu nền chính cho các section mềm | Hero overlay (20% opacity), section backgrounds, card backgrounds |
| Navy Deep `#0F4C5C` | Màu đậm cho văn bản quan trọng | Header text, footer background, section tiêu đề lớn, navigation active state |

**Lưu ý:** Ocean Blue cần được "tươi lên" theo ghi chú từ CLB — cân nhắc dùng dạng gradient hoặc kết hợp với texture để tránh cảm giác phẳng/xỉn.

#### 1.2.2 Màu NHẤN (Accent) — CỰC KỲ QUAN TRỌNG

| Màu | Nguyên tắc |
|------|-----------|
| Coral Orange `#E87750` | **CHỈ dùng cho điểm nhấn.** Không bao giờ dùng làm background lớn. Mỗi page tối đa 1-2 vị trí dùng màu này. |
| Coral Light `#F4B89A` | Dùng cho hover state của Coral Orange, hoặc soft highlight (badge background, tag) |

**Các vị trí được dùng Coral Orange:**
- ✅ CTA buttons chính (button solid)
- ✅ Price text
- ✅ Badge / tag nhỏ (vd: "Phổ biến nhất", "Trải nghiệm thật")
- ✅ Icon quan trọng cần nổi bật
- ✅ Progress bar
- ✅ Active state trong navigation
- ❌ KHÔNG làm background section lớn
- ❌ KHÔNG làm màu chữ body
- ❌ KHÔNG làm border các card thông thường

#### 1.2.3 Màu NỀN PHỤ (Secondary Backgrounds)

| Màu | Vai trò |
|------|--------|
| Beige Sand `#F5EFE0` | Card backgrounds, section nền phụ (tạo cảm giác bãi biển) |
| Sand Dark `#E8DFC8` | Border nhẹ giữa các section, divider, card border |
| White `#FFFFFF` | Background chính, khoảng trắng (breathing room) giữa các section |

#### 1.2.4 Màu VĂN BẢN (Text Colors)

| Màu | Vai trò |
|------|--------|
| Text Dark `#2C3E50` | Toàn bộ heading (h1-h6), body text chính |
| Text Gray `#8A9BA8` | Secondary text, metadata, labels, dates, captions |
| Navy Deep `#0F4C5C` | Text đặc biệt cần nhấn mạnh, số liệu lớn (stats), quote |

#### 1.2.5 Màu TRẠNG THÁI (State Colors)

Ngoài 10 màu chính, bổ sung các màu trạng thái cho UI components:

| Trạng thái | Màu | HEX |
|-----------|------|-----|
| Success / Good | Xanh rêu biển | `#4CAF50` |
| Warning / Average | Vàng cát | `#FFC107` |
| Danger / Needs Attention | Đỏ san hô đậm | `#E05540` |
| Info | Teal Mid (có sẵn) | `#5BA8B5` |

### 1.3 Bảng phối màu theo từng Section

#### Hero Section
```
Background: Video/ảnh underwater (1920×1080)
Overlay:     Navy Deep #0F4C5C @ 20% opacity → gradient lên trên
Headline:    White #FFFFFF (trên overlay)
Sub:         Beige Sand #F5EFE0 @ 90% opacity
CTA chính:   Coral Orange #E87750 (solid) + White text
CTA phụ:     Ghost button — viền Navy #0F4C5C + text Navy
```

#### Section "Tại sao san hô quan trọng" / "Coralume làm gì"
```
Background:  White #FFFFFF hoặc Beige Sand #F5EFE0 xen kẽ
Headline:    Navy Deep #0F4C5C
Body text:   Text Dark #2C3E50
Stats số:    Coral Orange #E87750 (số to) + Text Dark (label)
Icon:        Teal Mid #5BA8B5
```

#### Card sản phẩm
```
Background:  White #FFFFFF
Border:      Sand Dark #E8DFC8
Hover border: Teal Mid #5BA8B5
Price:       Coral Orange #E87750
CTA button:  Coral Orange #E87750 (solid)
Badge:       Coral Orange #E87750 background + White text
Shadow:      rgba(15, 76, 92, 0.08) → rgba(15, 76, 92, 0.15) on hover
```

#### Dashboard
```
Background:  Beige Sand #F5EFE0
Cards:       White #FFFFFF
Stats số:    Navy Deep #0F4C5C (số to) mono font
Status icon: Success/Warning/Danger colors
Headers:     Navy Deep #0F4C5C
```

#### Footer
```
Background:  Navy Deep #0F4C5C
Text:        Beige Sand #F5EFE0
Links:       Ocean Blue #B5D8E8
Icon hover:  Coral Orange #E87750
Copyright:   Text Gray #8A9BA8
```

#### CTA Banner cuối trang
```
Background:  Gradient Navy Deep #0F4C5C → Teal Mid #5BA8B5
Headline:    White #FFFFFF
CTA:         Coral Orange #E87750 (pulse animation)
```

### 1.4 CSS Variables (Copy-ready)

```css
:root {
  /* === PRIMARY === */
  --color-ocean-blue:    #B5D8E8;
  --color-navy-deep:     #0F4C5C;
  --color-teal-mid:      #5BA8B5;
  --color-coral-orange:  #E87750;
  --color-coral-light:   #F4B89A;

  /* === NEUTRAL === */
  --color-beige-sand:    #F5EFE0;
  --color-sand-dark:     #E8DFC8;
  --color-white:         #FFFFFF;

  /* === TEXT === */
  --color-text-dark:     #2C3E50;
  --color-text-gray:     #8A9BA8;

  /* === STATE === */
  --color-success:       #4CAF50;
  --color-warning:       #FFC107;
  --color-danger:        #E05540;
  --color-info:          #5BA8B5;

  /* === SEMANTIC === */
  --color-primary:       var(--color-ocean-blue);
  --color-primary-dark:  var(--color-navy-deep);
  --color-accent:        var(--color-coral-orange);
  --color-accent-light:  var(--color-coral-light);
  --color-bg:            var(--color-white);
  --color-bg-alt:        var(--color-beige-sand);
  --color-border:        var(--color-sand-dark);
  --color-text:          var(--color-text-dark);
  --color-text-muted:    var(--color-text-gray);
  --color-heading:       var(--color-navy-deep);

  /* === SHADOWS === */
  --shadow-card:         0 2px 12px rgba(15, 76, 92, 0.08);
  --shadow-card-hover:   0 8px 30px rgba(15, 76, 92, 0.15);
  --shadow-button:       0 4px 14px rgba(232, 119, 80, 0.3);
  --shadow-modal:        0 20px 60px rgba(15, 76, 92, 0.2);

  /* === BORDER RADIUS === */
  --radius-sm:           6px;
  --radius-md:           8px;
  --radius-lg:           16px;
  --radius-xl:           24px;
  --radius-full:         9999px;

  /* === SPACING === */
  --section-padding-y:   80px;
  --section-padding-y-mobile: 48px;
  --content-max-width:   1200px;
  --text-max-width:      720px;
}
```

### 1.5 Tailwind Config (Copy-ready)

```js
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        ocean:    { DEFAULT: '#B5D8E8', light: '#D4EAF3', dark: '#8FC4D8' },
        navy:     { DEFAULT: '#0F4C5C', light: '#1A6B7F', dark: '#0A323D' },
        teal:     { DEFAULT: '#5BA8B5', light: '#7DBFC9', dark: '#428B97' },
        coral:    { DEFAULT: '#E87750', light: '#F4B89A', dark: '#D15D35' },
        sand:     { DEFAULT: '#F5EFE0', light: '#FBF8F0', dark: '#E8DFC8' },
        'text-primary':   '#2C3E50',
        'text-secondary': '#8A9BA8',
      },
      fontFamily: {
        display:  ['Lora', 'Lexend', 'serif'],
        body:     ['Inter', 'Be Vietnam Pro', 'sans-serif'],
        accent:   ['Lora', 'serif'],     // italic variant
        mono:     ['JetBrains Mono', 'DM Mono', 'monospace'],
      },
      boxShadow: {
        'card':       '0 2px 12px rgba(15, 76, 92, 0.08)',
        'card-hover': '0 8px 30px rgba(15, 76, 92, 0.15)',
        'button':     '0 4px 14px rgba(232, 119, 80, 0.3)',
        'modal':      '0 20px 60px rgba(15, 76, 92, 0.2)',
      },
    },
  },
}
```

---

## PHẦN 2: TYPOGRAPHY

### 2.1 Font Stack

| Vai trò | Font chính | Font dự phòng | Style |
|---------|-----------|---------------|-------|
| Display / Headings (h1-h3) | Lora | Lexend | Bold, 700 |
| Headings (h4-h6) | Lexend | Inter | Semibold, 600 |
| Body text | Inter | Be Vietnam Pro | Regular, 400 |
| Quote / Testimonial | Lora Italic | — | Italic, 400 |
| Số liệu / Stats | JetBrains Mono | DM Mono | Medium, 500 |

### 2.2 Font Loading Strategy

```css
/* Ưu tiên Be Vietnam Pro cho tiếng Việt */
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');
/* Lora cho headings (hỗ trợ Vietnamese) */
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400&display=swap');
/* JetBrains Mono cho số liệu */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');

/* Fallback: nếu Google Fonts không load, dùng system fonts */
body {
  font-family: 'Be Vietnam Pro', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}
h1, h2, h3 {
  font-family: 'Lora', 'Lexend', Georgia, serif;
}
```

**Lưu ý:** Be Vietnam Pro được khuyến nghị vì tối ưu cho tiếng Việt (hỗ trợ dấu đầy đủ). Nếu dùng Inter, cần kiểm tra kỹ render dấu tiếng Việt.

### 2.3 Type Scale

| Bậc | Kích thước | Line-height | Font | Dùng cho |
|-----|-----------|-------------|------|----------|
| Display XL | 56-72px | 1.1 | Lora Bold | Hero headline (desktop) |
| Display | 40-56px | 1.15 | Lora Bold | Hero headline (tablet) |
| H1 | 32-40px | 1.2 | Lora Bold | Section titles (desktop) |
| H2 | 28-32px | 1.25 | Lora Bold | Section titles (mobile), Card titles |
| H3 | 22-26px | 1.3 | Lexend Semibold | Sub-section titles |
| H4 | 18-22px | 1.35 | Lexend Semibold | Card headers |
| Body L | 18-20px | 1.6 | Inter Regular | Body text (large screens) |
| Body | 16px | 1.6 | Inter Regular | Body text chuẩn |
| Body S | 14px | 1.5 | Inter Regular | Secondary text, metadata |
| Caption | 12px | 1.4 | Inter Regular | Labels, badges |
| Stats | 40-56px | 1.1 | JetBrains Mono Medium | Số liệu impact, dashboard numbers |
| Quote | 20-24px | 1.5 | Lora Italic | Testimonial, quote |

### 2.4 Responsive Type Scale

```
                      Mobile     Tablet     Desktop
                      (<768px)   (768-1024) (>1024px)
─────────────────────────────────────────────────────
Hero Headline          32px       48px       64px
Hero Sub-headline      18px       20px       22px
Section Title          28px       36px       40px
Card Title             20px       22px       24px
Body Text              16px       16px       18px
Stats Number           36px       48px       56px
```

---

## PHẦN 3: RESPONSIVE DESIGN

### 3.1 Breakpoints

| Breakpoint | Min Width | Max Width | Target |
|-----------|-----------|-----------|--------|
| **Mobile** | 320px | 767px | 60%+ traffic dự kiến |
| **Tablet** | 768px | 1023px | ~20% traffic |
| **Desktop** | 1024px | 1440px | ~20% traffic |
| **Wide** | 1441px | — | Secondary |

```css
/* Mobile-first approach */
/* Base styles = mobile */
/* Tablet override */
@media (min-width: 768px) { ... }
/* Desktop override */
@media (min-width: 1024px) { ... }
/* Wide screen container max-width */
@media (min-width: 1441px) { ... }
```

### 3.2 Container & Grid System

| Property | Mobile | Tablet | Desktop |
|----------|--------|--------|---------|
| Container max-width | 100% (fluid) | 720px | 1200px |
| Padding horizontal | 16px | 24px | 32px |
| Section padding top/bottom | 48px | 64px | 80px |
| Grid columns | 1 cột | 2 cột | 3-4 cột |
| Card gap | 16px | 20px | 24px |

### 3.3 Responsive Layout theo từng Section

#### Hero Section
```
Mobile:           Tablet:             Desktop:
┌────────────┐    ┌──────────────┐    ┌────────────────────┐
│  Headline  │    │  Headline    │    │    Headline        │
│  (32px)    │    │  (48px)      │    │    (64px)          │
│  Sub       │    │  Sub (20px)  │    │    Sub (22px)      │
│  [CTA]     │    │  [CTA][Phụ]  │    │    [CTA] [Phụ]     │
│  [Phụ]     │    │              │    │                    │
└────────────┘    └──────────────┘    └────────────────────┘
Stack dọc          Stack dọc          Ngang (nếu đủ rộng)
Video fallback     Video autoplay     Video autoplay
= ảnh tĩnh         (nếu bandwidth OK) (full quality)
```

#### Card sản phẩm (3 gói)
```
Mobile:             Tablet:               Desktop:
┌──────────┐        ┌────────┬────────┐    ┌──────┬──────┬──────┐
│  Card 1  │        │ Card 1 │ Card 2 │    │Card 1│Card 2│Card 3│
├──────────┤        └────────┴────────┘    └──────┴──────┴──────┘
│  Card 2  │        ┌──────────────────┐    3 cột, mỗi card
├──────────┤        │     Card 3       │    width bằng nhau,
│  Card 3  │        │   (full-width)   │    card 2 (Reef Guardian)
└──────────┘        └──────────────────┘    có border Coral nổi bật
1 cột, stack dọc    2+1 layout
```

#### Section "Coralume làm gì" (3 steps)
```
Mobile:        Tablet/Desktop:
┌──────┐       ┌──────┬──────┬──────┐
│Step 1│       │Step 1│Step 2│Step 3│
├──────┤       └──────┴──────┴──────┘
│Step 2│       Layout ngang, hover:
├──────┤       scale 1.05 từng card
│Step 3│
└──────┘
1 cột, stack dọc
```

#### Stat cards (Tại sao san hô quan trọng)
```
Mobile:        Tablet/Desktop:
┌──────────┐   ┌──────┬──────┬──────┐
│  Stat 1  │   │Stat 1│Stat 2│Stat 3│
├──────────┤   └──────┴──────┴──────┘
│  Stat 2  │   3 cột, số đếm animate
├──────────┤   khi scroll tới
│  Stat 3  │
└──────────┘
1 cột, stack dọc
```

#### Dashboard — Danh sách san hô
```
Mobile:        Tablet:       Desktop:
┌──────────┐   ┌────┬────┐   ┌────┬────┬────┐
│  Coral   │   │ C1 │ C2 │   │ C1 │ C2 │ C3 │
├──────────┤   ├────┼────┤   ├────┼────┼────┤
│  Coral   │   │ C3 │ C4 │   │ C4 │ C5 │ C6 │
├──────────┤   └────┴────┘   └────┴────┴────┘
│  Coral   │
└──────────┘
1 cột          2 cột         3 cột
```

#### Footer
```
Mobile:          Tablet/Desktop:
┌──────────┐    ┌──────┬──────┬──────┐
│ Logo     │    │ Logo │ Nav  │ LH   │
│ Nav      │    │      │      │      │
│ Liên hệ  │    └──────┴──────┴──────┘
│ Copyright│    3 cột ngang
└──────────┘
Stack dọc
```

#### Team grid (About page)
```
Mobile:        Tablet:       Desktop:
┌──────┐       ┌────┬────┐   ┌────┬────┬────┐
│Member│       │ M1 │ M2 │   │ M1 │ M2 │ M3 │
└──────┘       ├────┼────┤   ├────┼────┼────┤
1 cột          │ M3 │ M4 │   │ M4 │ M5 │ M6 │
               └────┴────┘   └────┴────┴────┘
               2 cột         3-4 cột
```

#### Bảng so sánh sản phẩm
```
Mobile:
  Bảng scroll ngang (overflow-x: auto)
  Cột "Tính năng" sticky left
  min-width: 600px trên table

Desktop:
  Bảng full-width, sticky header
  Zebra striping xen kẽ
```

### 3.4 Mobile-First Rules

1. **Toàn bộ CSS base = mobile styles.** Tất cả override nằm trong `@media (min-width: ...)`
2. **Touch targets ≥ 44px** trên thiết bị touch (`@media (pointer: coarse)`)
3. **Form inputs:** `font-size: 16px` trên mobile (tránh iOS auto-zoom)
4. **Viewport:** `<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">`
5. **Modal:** Full-screen trên mobile (`max-sm:inset-0`), centered trên desktop (`sm:max-w-lg`)
6. **Hình ảnh:** Responsive `srcset` + WebP + lazy loading
7. **Video hero:** Fallback ảnh tĩnh trên mobile (tiết kiệm bandwidth), autoplay chỉ trên WiFi/desktop
8. **Navigation:** Hamburger menu trên mobile, horizontal nav trên desktop
9. **Font size inputs:** `text-base md:text-sm` (16px mobile, 14px desktop)
10. **Safe areas:** Áp dụng `safe-area-inset-*` cho thiết bị có notch

### 3.5 Coral Portal — Mobile-First ĐẶC BIỆT

Portal cho nhân viên trung tâm san hô cần **mobile-first bắt buộc** vì họ dùng điện thoại ngoài field:
- Form input đơn giản, to, dễ thao tác bằng 1 tay
- Upload ảnh từ camera/gallery trực tiếp
- Nút Save to, dễ bấm
- Offline support: lưu draft nếu mất kết nối
- Compress ảnh tự động trước khi upload

---

## PHẦN 4: ANIMATION & MOTION DESIGN

### 4.1 Nguyên tắc chung

> **"Animation nhẹ — fade, slide-up, parallax dịu. KHÔNG bounce, flash, hay animation gắt."**
> Tone of voice: dịu, chậm rãi, thiên nhiên.

| ✅ ĐƯỢC DÙNG | ❌ KHÔNG ĐƯỢC DÙNG |
|-------------|-------------------|
| fade-in, fade-out | bounce |
| slide-up, slide-down (dịu) | flash, blink |
| scale nhẹ (1.02 - 1.05) | rotate, flip |
| parallax dịu (translateY theo scroll) | shake, swing |
| transition màu mượt | animation quá nhanh (< 200ms) |
| count-up numbers | typewriter effect |
| pulse nhẹ (CTA) | pulse nhanh/liên tục |
| reveal text-by-text | stagger quá dài |

### 4.2 Easing Curves (CSS)

```css
:root {
  /* Easing chuẩn cho Coralume */
  --ease-out-expo:   cubic-bezier(0.16, 1, 0.3, 1);     /* Chậm dần đẹp - dùng cho fade-in, slide-up */
  --ease-out-quint:  cubic-bezier(0.22, 1, 0.36, 1);     /* Mượt - dùng cho card hover */
  --ease-in-out:     cubic-bezier(0.65, 0, 0.35, 1);     /* Mượt 2 chiều - dùng cho hover transition */
  --ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1);  /* Spring nhẹ - dùng cho scale on hover */
}
```

### 4.3 Animation Detail theo từng Component

#### 4.3.1 HERO SECTION

| Element | Animation | Duration | Delay | Easing |
|---------|-----------|----------|-------|--------|
| Background video | Fade-in từ đen | 1.5s | 0s | ease-out |
| Headline | Fade-in + slide-up 30px | 0.8s | 0.2s | ease-out-expo |
| Sub-headline | Fade-in + slide-up 20px | 0.6s | 0.5s (sau headline 0.3s) | ease-out-expo |
| CTA chính | Fade-in + scale 0.95→1 | 0.5s | 0.8s | ease-spring |
| CTA phụ | Fade-in | 0.5s | 1.0s | ease-out |

**Video Background Behavior:**
- Autoplay, loop, mute
- Fallback ảnh tĩnh ngay lập tức nếu video không load được
- Trên mobile (< 768px): ưu tiên ảnh tĩnh, chỉ play video nếu WiFi + data-saver off
- Overlay: gradient tối 20% (Navy `rgba(15, 76, 92, 0.2)`) để text readable

```css
.hero-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: heroFadeIn 1.5s ease-out;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(15, 76, 92, 0.3) 0%,
    rgba(15, 76, 92, 0.15) 50%,
    rgba(15, 76, 92, 0.05) 100%
  );
}

@keyframes heroFadeIn {
  from { opacity: 0; transform: scale(1.05); }
  to   { opacity: 1; transform: scale(1); }
}
```

#### 4.3.2 SECTION TITLE (khi scroll tới)

Tất cả section title sử dụng chung cơ chế: **reveal on scroll**.

```css
.section-title {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.7s var(--ease-out-expo),
              transform 0.7s var(--ease-out-expo);
}

.section-title.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

| Điều kiện trigger | Giá trị |
|-------------------|--------|
| Intersection Observer threshold | 0.15 (15% element hiện trong viewport) |
| Root margin | -50px (trigger sớm hơn 50px) |
| Play once | true (chỉ animate 1 lần, không lặp lại khi scroll lên xuống) |

#### 4.3.3 STAT NUMBERS (Số liệu impact)

**Count-up animation** — số đếm từ 0 đến giá trị cuối khi scroll tới.

```js
// Behavior:
// - Bắt đầu khi element vào viewport (Intersection Observer)
// - Duration: 2s
// - Easing: ease-out (chạy nhanh lúc đầu, chậm dần về cuối)
// - Format: có dấu phẩy ngăn cách (1,234)
// - Số có ký hiệu: < 1%, 25%, 50% — hiển thị ký hiệu sau khi đếm xong
// - Play once
```

| Stat | Giá trị cuối | Format |
|------|-------------|--------|
| Tỉ lệ diện tích đáy biển | 1 | "< 1%" |
| Sinh vật biển phụ thuộc | 25 | "25%" |
| Diện tích san hô đã mất | 50 | "50%" |

#### 4.3.4 CARD HOVER (Sản phẩm, San hô, Team)

```css
.card {
  transition: transform 0.35s var(--ease-out-quint),
              box-shadow 0.35s var(--ease-out-quint),
              border-color 0.3s var(--ease-in-out);

  transform: translateY(0);
  box-shadow: var(--shadow-card);
  border: 1px solid var(--color-sand-dark);
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-card-hover);
  border-color: var(--color-teal-mid);
}
```

| Card loại | Hover translateY | Hover scale | Hover shadow |
|-----------|-----------------|-------------|--------------|
| Sản phẩm (3 gói) | -8px | — | shadow-card-hover |
| San hô (dashboard) | -6px | — | shadow-card-hover |
| Team member | — | 1.03 | shadow-card-hover |
| How-it-works step | — | 1.05 | — |

#### 4.3.5 CTA BUTTONS

**CTA Chính (Coral Orange solid):**
```css
.btn-primary {
  background: var(--color-coral-orange);
  color: white;
  border-radius: var(--radius-md);  /* 8px */
  padding: 14px 32px;
  font-weight: 600;
  transition: background 0.25s var(--ease-in-out),
              transform 0.25s var(--ease-out-quint),
              box-shadow 0.25s var(--ease-in-out);
}

.btn-primary:hover {
  background: var(--color-coral-light);
  transform: translateY(-2px);
  box-shadow: var(--shadow-button);
}

.btn-primary:active {
  transform: translateY(0);
}
```

**Pulse Animation (trên CTA cuối trang):**
```css
/* Pulse 2s/lần, nhẹ nhàng */
.cta-pulse {
  animation: ctaPulse 2s ease-in-out infinite;
}

@keyframes ctaPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(232, 119, 80, 0.4); }
  50%      { box-shadow: 0 0 0 12px rgba(232, 119, 80, 0); }
}
```

**CTA Phụ (Ghost button):**
```css
.btn-ghost {
  background: transparent;
  color: var(--color-navy-deep);
  border: 2px solid var(--color-navy-deep);
  border-radius: var(--radius-md);
  padding: 14px 32px;
  transition: background 0.25s var(--ease-in-out),
              color 0.25s var(--ease-in-out);
}

.btn-ghost:hover {
  background: var(--color-navy-deep);
  color: white;
}
```

#### 4.3.6 SCROLL BEHAVIOR

| Hành vi | Mô tả |
|---------|-------|
| Smooth scroll | `scroll-behavior: smooth` toàn trang |
| Hero "Tìm hiểu thêm ↓" | Scroll mượt xuống section 2, duration ~800ms |
| Parallax CTA banner | TranslateY nhẹ theo scroll (0.15x scroll speed) |
| Sticky header | Header sticky khi scroll xuống > 100px (navy background) |

```css
html {
  scroll-behavior: smooth;
}

.parallax-cta {
  /* Banner CTA cuối trang — parallax dịu */
  transform: translateY(calc(var(--scroll-offset, 0) * 0.15));
}
```

#### 4.3.7 MODAL (Chi tiết san hô)

| Phase | Animation | Duration | Easing |
|-------|-----------|----------|--------|
| Open — overlay | Fade-in | 0.2s | ease-out |
| Open — modal | Slide-up 60px + fade-in | 0.35s | ease-out-expo |
| Close — modal | Slide-down 20px + fade-out | 0.2s | ease-in |
| Close — overlay | Fade-out | 0.15s | ease-in |

```css
.modal-overlay {
  animation: overlayIn 0.2s ease-out;
}

.modal-content {
  animation: modalIn 0.35s var(--ease-out-expo);
}

.modal-overlay.is-closing {
  animation: overlayOut 0.15s ease-in forwards;
}

.modal-content.is-closing {
  animation: modalOut 0.2s ease-in forwards;
}

@keyframes modalIn {
  from { opacity: 0; transform: translateY(60px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes modalOut {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to   { opacity: 0; transform: translateY(20px) scale(0.98); }
}
```

#### 4.3.8 ACCORDION (FAQ)

| Phase | Animation | Duration |
|-------|-----------|----------|
| Expand | `grid-template-rows: 0fr → 1fr` + content fade-in | 0.3s |
| Collapse | `grid-template-rows: 1fr → 0fr` | 0.25s |

```css
.faq-answer {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s var(--ease-out-expo);
}

.faq-answer.is-open {
  grid-template-rows: 1fr;
}

.faq-answer-inner {
  overflow: hidden;
}
```

Icon xoay 180° khi expand: `transition: transform 0.3s var(--ease-out-expo)`

#### 4.3.9 NAVIGATION

| Hành vi | Animation |
|---------|-----------|
| Header scroll | Background: transparent → Navy + blur (sau 100px scroll). Transition 0.3s |
| Mobile menu open | Slide-down + fade-in, 0.3s ease-out-expo |
| Mobile menu close | Slide-up + fade-out, 0.2s ease-in |
| Nav link hover | Underline grow từ giữa ra (scaleX 0→1), 0.25s |

```css
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  width: 100%;
  height: 2px;
  background: var(--color-coral-orange);
  transform: translateX(-50%) scaleX(0);
  transition: transform 0.25s var(--ease-out-expo);
}

.nav-link:hover::after {
  transform: translateX(-50%) scaleX(1);
}
```

#### 4.3.10 PROGRESS BAR (Ambassador)

```css
.progress-bar-fill {
  transition: width 1.5s var(--ease-out-expo);
  /* Chỉ animate khi vào viewport */
}
```

Khi đạt 100% → confetti animation + popup chúc mừng.

#### 4.3.11 CONFETTI (Ambassador milestone)

```
Trigger: khi user đạt Ambassador (5 referrals)
Loại: confetti nhẹ, màu Coral + Teal + Navy
Duration: 2s
Thư viện gợi ý: canvas-confetti (npm)
```

#### 4.3.12 SỐ LIỆU DASHBOARD

| Component | Animation |
|-----------|-----------|
| Dashboard stats | Số đếm tăng khi load (count-up, duration 1.5s) |
| Coral card | Fade-in stagger (mỗi card cách 100ms) |
| Growth timeline | Lazy load khi scroll, fade-in từng entry |
| GPS map pin | Pulse animation liên tục (nhẹ) |
| Health status | Fade-in màu khi modal mở |

#### 4.3.13 TIMELINE (Growth history)

```css
.timeline-entry {
  opacity: 0;
  transform: translateX(-20px);
  transition: opacity 0.5s var(--ease-out-expo),
              transform 0.5s var(--ease-out-expo);
}

.timeline-entry.is-visible {
  opacity: 1;
  transform: translateX(0);
}
```

#### 4.3.14 BADGE "NEW UPDATE"

```css
.new-update-badge {
  animation: badgePulse 2s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.08); }
}
```

#### 4.3.15 ABOUT PAGE — HERO TEXT REVEAL

```
Headline "Chúng tôi không phải tổ chức từ thiện."
→ Dòng 1 xuất hiện
→ 0.4s delay
→ Dòng 2 "Chúng tôi là một cách khác để bảo vệ đại dương." xuất hiện
Mỗi dòng: fade-in + slide-up
```

#### 4.3.16 ABOUT PAGE — PROCESS TIMELINE

```
Timeline horizontal (desktop) / vertical (mobile)
Animation: line vẽ kết nối các bước (SVG stroke-dasharray)
Duration: 1.5s khi scroll tới
```

#### 4.3.17 LOADING STATES

| Loại | Xử lý |
|------|-------|
| Page load | Skeleton loader (màu Beige Sand, pulse nhẹ) |
| Image load | Blur-up placeholder (màu Ocean Blue blur) |
| Data fetch (dashboard) | Skeleton cards (3 cột shimmer) |
| Payment processing | Spinner + text "Đang xử lý thanh toán..." |
| File upload (portal) | Progress bar + preview thumbnail |

#### 4.3.18 PAGE TRANSITIONS

```
Giữa các trang: fade-out 0.15s → fade-in 0.2s
Giữa các tab trong dashboard: cross-fade 0.2s
Không dùng page transition phức tạp (tránh layout shift)
```

### 4.4 Motion Tokens (Design System)

```css
:root {
  /* === DURATIONS === */
  --duration-instant:   100ms;   /* Hover color change */
  --duration-fast:      200ms;   /* Simple fade, icon rotate */
  --duration-normal:    300ms;   /* Card hover, modal close */
  --duration-slow:      500ms;   /* Slide-up, section reveal */
  --duration-glacial:   800ms;   /* Hero headline reveal */
  --duration-count-up:  2000ms;  /* Stat number count-up */

  /* === EASING === */
  --ease-out-expo:   cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quint:  cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out:     cubic-bezier(0.65, 0, 0.35, 1);
  --ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1);

  /* === STAGGER DELAYS (cho list items) === */
  --stagger-card:     80ms;   /* Card grid items */
  --stagger-list:     50ms;   /* List items */
  --stagger-timeline: 150ms;  /* Timeline entries */
}
```

### 4.5 Animation Checklist — Mỗi Page

| Page | Animation bắt buộc |
|------|--------------------|
| **Home** | Hero fade-in + slide-up, Stat count-up, Card hover (3 gói), Parallax CTA cuối, Pulse CTA |
| **About** | Hero text reveal (line-by-line, 0.4s gap), Team card zoom hover, Timeline vẽ line |
| **Sản phẩm** | Card hover (3 gói), Accordion FAQ, Bảng so sánh sticky header |
| **Dashboard** | Count-up stats, Coral card stagger fade-in, Badge pulse, Growth timeline fade-in, Confetti Ambassador |
| **Blog** | Card hover, Scroll progress bar, Image lazy load |
| **Leaderboard** | Top 3 highlight, Số xếp hạng count-up |
| **Cộng đồng** | Masonry layout fade-in stagger, Video lightbox |
| **Thanh toán** | Loading spinner, Success animation (checkmark draw) |
| **Admin Portal** | Không animation (ưu tiên performance) |
| **Coral Portal** | Không animation (mobile-first, data-entry focus) |

---

## PHẦN 5: ICON SYSTEM

| Thuộc tính | Giá trị |
|-----------|--------|
| Style | Line icon |
| Stroke width | 1.5–2px |
| Màu mặc định | Navy Deep `#0F4C5C` |
| Màu accent (icon quan trọng) | Coral Orange `#E87750` |
| Màu secondary | Teal Mid `#5BA8B5` |
| Thư viện | Phosphor Icons hoặc Lucide |
| Size chuẩn | 24px (mobile), 28px (desktop) |
| Cấm | Không dùng emoji thay icon |

---

## PHẦN 6: HÌNH ẢNH & MEDIA

### 6.1 Phong cách ảnh theo loại

| Loại | Phong cách | Nguồn | Keywords |
|------|-----------|-------|----------|
| Hero — đại dương | Video/ảnh underwater, ánh sáng xuyên mặt nước, rạn san hô màu | Unsplash, Pexels (miễn phí). Ưu tiên ánh sáng dịu, không gắt. CLB cũng có thể tự chụp. | `underwater coral reef`, `sunlight through water`, `healthy coral`, `blue ocean` |
| San hô close-up | Chi tiết san hô đa dạng, màu tự nhiên | Hỏi trung tâm san hô | `coral close up`, `coral polyps`, `branching coral`, `coral macro` |
| Người + thiên nhiên | Người trẻ trồng san hô, lặn biển | Stock photos | `coral restoration`, `coral planting`, `marine biologist`, `ocean conservation` |
| Lifestyle adopter | Người trẻ Á Đông, xem laptop/phone dashboard | Stock photos | `young asian person laptop`, `sustainable lifestyle`, `eco conscious` |
| Trung tâm san hô | Ảnh thật từ Nha Trang | **CLB cung cấp sau** | Placeholder: ghi chú "Đang chờ ảnh từ CLB" |

### 6.2 Technical Requirements cho Ảnh

| Yêu cầu | Chi tiết |
|----------|----------|
| Format chính | WebP (có fallback JPG/PNG) |
| Hero image | 1920×1080px, WebP quality 85% |
| Card thumbnail | 600×400px, WebP quality 80% |
| Avatar user | 200×200px, WebP |
| Team member | 600×600px, vuông |
| Lazy loading | `loading="lazy"` cho tất cả ảnh dưới fold |
| Responsive | `srcset` với các kích thước: 400w, 800w, 1200w, 1920w |
| Placeholder | Blur-up (base64 LQIP) hoặc màu Ocean Blue nhạt |
| Alt text | BẮT BUỘC cho mọi ảnh (WCAG 2.1 AA) |
| Coral update ảnh | Upload từ portal → compress tự động → lưu S3 |
| Video | MP4 + WebM, max 10MB. Có poster fallback |

### 6.3 Pattern / Texture

- **Họa tiết:** Sóng nước dịu, nét vẽ tay nhẹ (organic line)
- **KHÔNG:** Pattern hình học cứng, grid
- **Dùng cho:** Divider giữa section, background nhẹ của section
- **Keywords:** `wave pattern`, `hand drawn ocean`, `organic line`

---

## PHẦN 7: ACCESSIBILITY (WCAG 2.1 AA)

### 7.1 Contrast Ratios

| Element | Requirement | Kiểm tra |
|---------|------------|----------|
| Body text (Text Dark #2C3E50 trên White #FFF) | Tỉ lệ ≥ 4.5:1 | ✅ 12.6:1 |
| Body text (Text Dark #2C3E50 trên Beige Sand #F5EFE0) | Tỉ lệ ≥ 4.5:1 | ✅ 11.8:1 |
| White text trên Coral Orange #E87750 | Tỉ lệ ≥ 4.5:1 (text lớn ≥ 3:1) | ⚠️ Cần kiểm tra: ~3.5:1 — text CTA nên dùng size ≥ 18px bold |
| White text trên Navy Deep #0F4C5C | Tỉ lệ ≥ 4.5:1 | ✅ 10.5:1 |
| Text Gray #8A9BA8 trên White | Tỉ lệ ≥ 4.5:1 | ⚠️ ~2.8:1 — KHÔNG dùng cho body text, chỉ cho label/caption ≥ 14px |
| Coral Orange #E87750 trên White | Tỉ lệ ≥ 3:1 (non-text UI) | ✅ 3.4:1 — OK cho button, icon |

**Cảnh báo:**
- `#E87750` text trên nền trắng có thể không đủ contrast cho body text nhỏ → chỉ dùng cho CTA button
- `#8A9BA8` không đủ contrast cho body text → chỉ dùng cho caption/label/secondary

### 7.2 Focus States

```css
*:focus-visible {
  outline: 2px solid var(--color-coral-orange);
  outline-offset: 2px;
  border-radius: 2px;
}
```

### 7.3 Other Accessibility

- Tất cả hình ảnh có `alt` text mô tả
- Form inputs có `<label>` liên kết đúng
- Keyboard navigation hoạt động toàn trang (Tab, Enter, Escape)
- Skip-to-content link ở đầu trang
- ARIA labels cho icon buttons, modals, accordions
- `prefers-reduced-motion: reduce` — tắt animation

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## PHẦN 8: WEBSITE THAM KHẢO (Design Inspiration)

| # | Website | URL | Học hỏi gì |
|---|---------|-----|-----------|
| 1 | **Coral Gardeners** | https://coralgardeners.org/products/adopt-a-coral | E-commerce flow + Track My Coral. Hero cảm xúc mạnh. Branding chuyên nghiệp. |
| 2 | **Branch Coral Foundation** | https://branchcoralfoundation.com/adopt-a-coral/ | Flow: chọn gói → form → thanh toán → certificate. Layout sạch, giá rõ ràng. |
| 3 | **Patagonia** | https://www.patagonia.com | Tone of voice ấm, có chiều sâu. Không kêu gọi từ thiện kiểu cũ. |
| 4 | **Allbirds** | https://www.allbirds.com | Cách trình bày impact + cam kết minh bạch. Số liệu rõ ràng. |
| 5 | **Backmarket** | https://www.backmarket.com | Cách kể chuyện sản phẩm có data + impact. |

---

## PHẦN 9: DESIGN HANDOFF CHECKLIST

Trước khi bàn giao thiết kế cho dev, cần có:

- [ ] **Figma file** với tất cả pages (12 trang), cả mobile + desktop
- [ ] **Design tokens** export (colors, typography, spacing, shadows, radius)
- [ ] **Component variants** đầy đủ (buttons: default/hover/active/disabled; cards; inputs; modals)
- [ ] **Responsive mockups** cho từng page (mobile + tablet + desktop)
- [ ] **Animation specs** (duration, easing, trigger cho từng element)
- [ ] **Assets export** (SVG icons, WebP images, logo files, pattern SVGs)
- [ ] **Typography scale** document
- [ ] **Color contrast audit** (đảm bảo WCAG AA)
- [ ] **Empty/loading/error states** cho tất cả components
- [ ] **Email templates** design (8 templates — xem Phụ lục B trong SRS)

---

*Tài liệu tổng hợp từ sheet BRAND & DESIGN, MẪU WEB MONG MUỐN DES THEO, và toàn bộ yêu cầu animation/responsive trong các sheet còn lại.*
