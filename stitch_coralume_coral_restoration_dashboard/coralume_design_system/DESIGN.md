---
name: Coralume Design System
colors:
  surface: '#fff9ea'
  surface-dim: '#dfdacb'
  surface-bright: '#fff9ea'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f9f3e4'
  surface-container: '#f3edde'
  surface-container-high: '#eee8d9'
  surface-container-highest: '#e8e2d3'
  on-surface: '#1d1c13'
  on-surface-variant: '#40484b'
  inverse-surface: '#333027'
  inverse-on-surface: '#f6f0e1'
  outline: '#70787c'
  outline-variant: '#c0c8cb'
  surface-tint: '#306576'
  primary: '#003441'
  on-primary: '#ffffff'
  primary-container: '#0f4c5c'
  on-primary-container: '#87bbce'
  inverse-primary: '#9acee1'
  secondary: '#9f411e'
  on-secondary: '#ffffff'
  secondary-container: '#fe885f'
  on-secondary-container: '#732100'
  tertiary: '#0e3340'
  on-tertiary: '#ffffff'
  tertiary-container: '#284a57'
  on-tertiary-container: '#96b9c8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b6ebfe'
  primary-fixed-dim: '#9acee1'
  on-primary-fixed: '#001f28'
  on-primary-fixed-variant: '#114d5d'
  secondary-fixed: '#ffdbd0'
  secondary-fixed-dim: '#ffb59d'
  on-secondary-fixed: '#390c00'
  on-secondary-fixed-variant: '#802a08'
  tertiary-fixed: '#c5e8f8'
  tertiary-fixed-dim: '#a9ccdc'
  on-tertiary-fixed: '#001f29'
  on-tertiary-fixed-variant: '#294b58'
  background: '#fff9ea'
  on-background: '#1d1c13'
  surface-variant: '#e8e2d3'
typography:
  display-lg:
    fontFamily: Lexend
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Lexend
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Lexend
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  stack-sm: 8px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style
The design system for this platform centers on a "Premium Stewardship" narrative. It moves away from traditional non-profit aesthetics toward a high-end, personal investment experience. The brand personality is warm and data-driven, fostering a deep sense of ownership through personal pronouns ("Your Coral") rather than transactional charity language.

The visual style is **Modern Organic**. It blends the precision of data visualization with the fluid, soft-edged nature of marine life. We utilize generous whitespace to evoke the vastness of the ocean, paired with sophisticated typography that balances high-end editorial flair with technical transparency.

## Colors
This palette is inspired by the transition from the sun-bleached shoreline to the deep reef. 
- **Navy Deep & Teal Mid:** Used for structural hierarchy and establishing a professional, trustworthy foundation.
- **Coral Orange:** Reserved strictly for high-value interactions and "Adoption" paths. It is a high-contrast beacon against the cooler ocean tones.
- **Beige Sand:** Replaces pure white as the primary background color to create a softer, more organic, and premium feel.
- **Ocean Blue:** Used for expansive overlays and soft UI containers to maintain a light, airy atmosphere.

## Typography
The typography strategy employs a three-tier system to balance emotion and evidence:
- **Headlines (Lexend):** Chosen for its soft, rounded terminals that mimic organic coral structures while remaining modern and readable.
- **Body (Be Vietnam Pro):** Provides a contemporary, warm, and highly legible experience for long-form storytelling about coral health.
- **Data (JetBrains Mono):** Used for coordinates, growth metrics, and technical specifications. This font communicates transparency and scientific rigor, reinforcing that the user's impact is being precisely measured.

## Layout & Spacing
The layout follows a **Fluid Grid** model with generous margins to evoke the "breathing room" of an open ocean. 

- **Desktop:** 12-column grid with 64px outer margins to keep content centered and premium.
- **Mobile:** 4-column grid with 20px margins. 
- **Rhythm:** Use an 8px base unit. Section spacing should be aggressive (96px+) to emphasize "high-end" editorial design and avoid visual clutter.
- **Wave Patterns:** Vertical transitions between major sections should occasionally use subtle, large-scale SVG wave paths instead of flat horizontal lines.

## Elevation & Depth
Depth is achieved through **Tonal Layering** and **Ambient Shadows** rather than harsh borders.

1.  **Base Layer:** Beige Sand (#F5EFE0) for the main canvas.
2.  **Card Layer:** White (#FFFFFF) with a very soft, diffused Navy-tinted shadow (0px 10px 30px rgba(15, 76, 92, 0.05)).
3.  **Interactive Layer:** Elements like "Adopt" buttons should feel slightly "buoyant," using a more pronounced shadow on hover to simulate lifting toward the surface.
4.  **Glassmorphism:** Use Backdrop Blur (20px) on navigation bars and image overlays to maintain a sense of water-like transparency.

## Shapes
The shape language is primarily **Rounded**, avoiding sharp corners to reflect the biological nature of coral. 

- **Standard Elements:** 0.5rem (8px) radius for input fields and small cards.
- **Large Containers:** 1.5rem (24px) radius for hero sections and main adoption cards.
- **Interactive Elements:** Buttons and tags use a "Pill" shape (fully rounded) to feel friendly and tactile.
- **Organic Masks:** Photography should occasionally use non-uniform "blob" or "wave" masks to break the rigidity of the grid.

## Components
- **Primary Buttons:** Use Coral Orange (#E87750) with White text. Labels must be action-oriented: "Adopt Your Coral" or "View Growth Report."
- **Impact Chips:** Small, pill-shaped tags using Navy Deep with 10% opacity backgrounds to highlight specific metrics (e.g., "Growth: +12%").
- **Metric Cards:** Use JetBrains Mono for the primary figure. Include a small sparkline in Teal Mid to show historical data.
- **Input Fields:** Soft Beige background with a Sand Dark border. On focus, the border transitions to Teal Mid with a soft glow.
- **Progress Trackers:** Custom "Coral Growth" bars that use an organic, non-linear fill texture rather than a flat color bar.
- **Image Treatment:** All underwater photography should have a slight blue-green color grading to ensure harmony with the UI palette. Use soft-focus backgrounds to keep the focus on the coral specimen.