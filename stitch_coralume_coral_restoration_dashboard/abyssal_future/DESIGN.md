---
name: Abyssal Future
colors:
  surface: '#0d141d'
  surface-dim: '#0d141d'
  surface-bright: '#333a44'
  surface-container-lowest: '#080f18'
  surface-container-low: '#151c26'
  surface-container: '#19202a'
  surface-container-high: '#242a34'
  surface-container-highest: '#2e353f'
  on-surface: '#dce3f0'
  on-surface-variant: '#b9caca'
  inverse-surface: '#dce3f0'
  inverse-on-surface: '#2a313b'
  outline: '#849495'
  outline-variant: '#3a494a'
  surface-tint: '#00dce5'
  primary: '#e9feff'
  on-primary: '#003739'
  primary-container: '#00f5ff'
  on-primary-container: '#006c71'
  inverse-primary: '#00696e'
  secondary: '#ffb3b0'
  on-secondary: '#68000f'
  secondary-container: '#901822'
  on-secondary-container: '#ff9e9b'
  tertiary: '#fcf9ff'
  on-tertiary: '#112976'
  tertiary-container: '#d6dcff'
  on-tertiary-container: '#495caa'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#63f7ff'
  primary-fixed-dim: '#00dce5'
  on-primary-fixed: '#002021'
  on-primary-fixed-variant: '#004f53'
  secondary-fixed: '#ffdad8'
  secondary-fixed-dim: '#ffb3b0'
  on-secondary-fixed: '#410006'
  on-secondary-fixed-variant: '#8c1520'
  tertiary-fixed: '#dde1ff'
  tertiary-fixed-dim: '#b8c4ff'
  on-tertiary-fixed: '#001453'
  on-tertiary-fixed-variant: '#2c418e'
  background: '#0d141d'
  on-background: '#dce3f0'
  surface-variant: '#2e353f'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 80px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-mono:
    fontFamily: Space Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  metric-xl:
    fontFamily: Space Mono
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 32px
  margin-desktop: 80px
  margin-mobile: 24px
  section-gap: 160px
---

## Brand & Style

The design system is anchored in a "Future-Modern" aesthetic, merging high-tech precision with the organic fluidity of marine ecosystems. It evokes a sense of "Deep Oceanic Depth"—mysterious, vast, and technically advanced. 

The visual narrative centers on **bioluminescence**—the idea that light originates from within the data and the environment itself. This is achieved through a combination of **Glassmorphism** and high-contrast neon accents. The UI should feel like a high-end research interface submerged in the deep sea: sophisticated, immersive, and urgently focused on ESG and conservation efforts.

## Colors

The palette is dominated by the **Deep Abyss (#050B14)**, serving as the canvas for all interactions. This is not a flat black, but a rich, near-black navy that provides the necessary depth for light-based effects.

- **Biolume Teal (#00F5FF):** The primary kinetic energy of the system. Used for interactive elements, data visualizations, and "active" states. It should appear to glow against the dark backgrounds.
- **Deep Abyss (#050B14):** The foundation. Used for base layers and deep background fills.
- **Coral Glow (#FF6B6B):** A high-impact secondary color reserved for critical calls to action and conservation alerts. It represents the living pulse of the reef.
- **Abyssal Blue (#0A2472):** Used for mid-layer surfaces and gradient stops to create a sense of volumetric water.

**Gradients:** Use radial gradients transitioning from `#0A2472` to `#050B14` to simulate the falloff of light in deep water.

## Typography

This design system utilizes a tiered typographic approach to balance technical precision with editorial impact.

- **Space Grotesk** is used for all primary headlines. Its geometric construction and wide apertures lend a futuristic, satellite-feed quality to the platform.
- **Plus Jakarta Sans** provides a soft, approachable contrast for body copy, ensuring high readability for complex ESG reports and conservation narratives.
- **Space Mono** is the "data layer" font. It is used exclusively for metrics, technical labels, and coordinates, reinforcing the scientific nature of the platform.

All headlines should favor lowercase or tight tracking to maintain a modern, "scanned" appearance.

## Layout & Spacing

The layout philosophy is **unconventional and immersive**. Rather than a standard vertical scroll, the design system encourages horizontal flow and large-scale, full-bleed imagery that breaks the grid.

- **Fluid Grid:** Use a 12-column grid for desktop with wide 32px gutters to allow the UI to "breathe" like the ocean.
- **Horizontal Drifts:** Key data modules and image galleries should utilize horizontal scrolling (overflow-x) with custom stylized scrollbars.
- **Section Gaps:** Use aggressive vertical spacing (160px+) between major thematic shifts to give the user a sense of traveling through different depths.
- **Breakpoints:** 
  - Desktop: 1440px+
  - Tablet: 768px - 1439px (Reflow to vertical stacked grid)
  - Mobile: <767px (Full verticality, reduced margins)

## Elevation & Depth

Depth is conveyed through **volumetric layering** and **light emission** rather than traditional shadows.

- **Glassmorphism:** All container elements use a backdrop blur (minimum 20px) and a semi-transparent fill (`rgba(255, 255, 255, 0.03)`). 
- **Glowing Borders:** Instead of shadows, use 1px solid borders with a 0.5 opacity of Biolume Teal. Apply a subtle outer glow (box-shadow) with a large spread and low opacity to simulate light dispersion in water.
- **Z-Axis Hierarchy:**
  - Base: Deep Abyss background.
  - Level 1: Glass containers with subtle blurs.
  - Level 2: Floating interactive elements with active neon glows.
  - Level 3: Overlays and modals with heavy backdrop saturation and blur.

## Shapes

The shape language balances the rigidness of technology with the softness of aquatic life. 

- **Primary Corners:** Use a 0.5rem (8px) radius for most UI containers and input fields.
- **Interactive Elements:** Buttons and tags use a higher `rounded-xl` (24px) or full pill-shape to feel more organic and touch-friendly.
- **Masking:** Use organic, fluid SVG masks for full-bleed imagery to avoid harsh rectangular edges, simulating the view through a submersible's porthole or the irregular edges of a coral reef.

## Components

### Buttons
- **Primary:** Solid Biolume Teal with black text. On hover, add a high-intensity outer glow.
- **Secondary (Ghost):** 1px Biolume Teal border, transparent background. On hover, fill with 10% opacity Teal.
- **Impact (Coral):** Reserved for "Donate" or "Emergency Action." Solid Coral Glow with white text.

### Glass Cards
- Use for all content modules. Must feature a `backdrop-filter: blur(24px)` and a top-to-bottom subtle gradient border to simulate light hitting the top edge of an object underwater.

### Input Fields
- Transparent backgrounds with a bottom-only border of 1px (Abyssal Blue). When focused, the border transitions to Biolume Teal and a subtle neon pulse effect is activated.

### Data Visualizations
- Use monospaced fonts (Space Mono) for all axis labels and values. 
- Lines and bars should use the Primary Teal color with a 2px "glow" shadow to appear as if they are projected in 3D space.

### Chips & Tags
- Pill-shaped with a dark fill and Teal borders. These should look like small HUD (Heads-Up Display) elements.