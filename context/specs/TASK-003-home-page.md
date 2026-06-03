# Unit 03: Home Page — Stitch Spec

## Goal

Xây dựng trang Home hoàn chỉnh match với Stitch design (coralume_home_1/code.html).

## Design Source

- **Stitch Folder:** `stitch_coralume_coral_restoration_dashboard/coralume_home_1/`
- **Files:** `code.html`, `screen.png`
- **Design System:** `coralume_design_system/DESIGN.md`

## Sections (Stitch Order)

| # | Stitch Section | SRS FR | Description |
|---|---------------|--------|-------------|
| 1 | Hero (WebGL shader) | FR-001 | Full-screen hero with ocean shader animation, gradient overlay, headline, 2 CTAs |
| 2 | Real Impact, Real Data | FR-002 | 3 stat cards with icons, count-up numbers, progress bars |
| 3 | Your Stewardship Journey | FR-003 | 2-column layout: numbered steps + image with testimonial overlay |
| 4 | From Nha Trang with Love | FR-005 | Masonry grid: large image + small image + map card |
| 5 | CTA Button | FR-006 | "Become a Steward" button below masonry grid |
| 6 | Footer | FR-007 | Navy background, 3-column layout |

## Implemented Files

| File | Purpose | Matches Stitch? |
|------|---------|-----------------|
| `src/app/page.tsx` | Home page composition | ✅ |
| `src/app/layout.tsx` | Root layout (Header + Footer) | ✅ |
| `src/app/globals.css` | Design tokens (Material Design 3) | ✅ Updated |
| `src/components/layout/Header.tsx` | Sticky nav with glass effect | ✅ |
| `src/components/layout/Footer.tsx` | Footer with social icons | ✅ |
| `src/components/sections/HeroSection.tsx` | Hero with WebGL shader | ✅ |
| `src/components/sections/StatsSection.tsx` | 3 stat cards | ✅ |
| `src/components/sections/HowItWorksSection.tsx` | 3-step journey | ✅ |
| `src/components/sections/PartnerSection.tsx` | Masonry grid + CTA | ✅ |

## TODO (from Stitch but not yet implemented)

| Item | Priority | Reason |
|------|----------|--------|
| Hero video (replace shader) | P1 | Need CLB to provide video file |
| Material Symbols icons | P2 | Using SVG fallback instead |
| Actual images in masonry grid | P1 | Need CLB to provide images |
| ProductsPreviewSection (FR-004) | P1 | Will be in Unit 04 (Products page) |
| Mobile shader performance | P2 | May need simplified fallback |

## Verify

- [x] `npm run build` passes
- [x] TypeScript clean
- [x] Design tokens match Stitch DESIGN.md
- [x] Layout matches Stitch code.html structure
- [ ] Visual match confirmed (need dev server + browser)
