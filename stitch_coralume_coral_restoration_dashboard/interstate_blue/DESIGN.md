---
name: Interstate Blue
colors:
  surface: '#f9f9ff'
  surface-dim: '#d7dae3'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3fc'
  surface-container: '#ebedf7'
  surface-container-high: '#e6e8f1'
  surface-container-highest: '#e0e2eb'
  on-surface: '#181c22'
  on-surface-variant: '#414753'
  inverse-surface: '#2d3037'
  inverse-on-surface: '#eef0fa'
  outline: '#717785'
  outline-variant: '#c1c6d5'
  surface-tint: '#005db8'
  primary: '#005ab4'
  on-primary: '#ffffff'
  primary-container: '#0a73e0'
  on-primary-container: '#fefcff'
  inverse-primary: '#aac7ff'
  secondary: '#465f88'
  on-secondary: '#ffffff'
  secondary-container: '#b6d0ff'
  on-secondary-container: '#3f5881'
  tertiary: '#964400'
  on-tertiary: '#ffffff'
  tertiary-container: '#bd5700'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#aac7ff'
  on-primary-fixed: '#001b3e'
  on-primary-fixed-variant: '#00458d'
  secondary-fixed: '#d6e3ff'
  secondary-fixed-dim: '#aec7f7'
  on-secondary-fixed: '#001b3d'
  on-secondary-fixed-variant: '#2d476f'
  tertiary-fixed: '#ffdbc9'
  tertiary-fixed-dim: '#ffb68c'
  on-tertiary-fixed: '#321200'
  on-tertiary-fixed-variant: '#763400'
  background: '#f9f9ff'
  on-background: '#181c22'
  surface-variant: '#e0e2eb'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
---

# Interstate Blue Design System

## Brand & Style
Interstate Blue is a modern, professional design system built on the principles of reliability, clarity, and precision. It moves away from high-energy warm tones toward a trust-focused, corporate aesthetic. The brand personality is balanced and efficient, utilizing a "Corporate / Modern" style inspired by high-quality interface guidelines. It evokes a sense of stability and technological sophistication through a cool color palette and highly legible typography.

## Colors
The color palette is anchored by a deep, professional blue (#1275e2) which serves as the primary brand color, conveying confidence and utility. The secondary palette uses a muted, desaturated blue-grey (#5f78a3) for supporting elements and background variations. A warm, burnt orange tertiary color (#c55b00) provides a strategic accent for notifications or call-to-action elements, offering contrast without breaking the professional tone. Neutral tones are grounded in a balanced grey (#74777f), ensuring accessible contrast ratios and a clean surface architecture.

## Typography
The system utilizes **Inter** across all levels to achieve a neutral, highly readable, and contemporary feel. This replaces the previous brand font with a more functional, screen-optimized alternative.

- **Headlines:** Set in Inter (Bold/Semi-bold). Large headlines use 32px size with 40px line-height.
- **Body:** Set in Inter (Regular). Standard body text is 16px.
- **Labels:** Set in Inter (Medium) at 12px for utility and UI metadata.

The choice of a variable neo-grotesque typeface ensures the UI remains functional and accessible across all screen densities.

## Layout & Spacing
The layout follows a 2px base grid, promoting a tight and organized information density. We utilize a fluid grid system for mobile devices and a responsive fixed grid for desktop environments. 

- **Gutters:** 16px.
- **Margins:** 16px (Mobile) / 24px (Desktop).
- **Rhythm:** All spacing increments are multiples of 2px to maintain strict alignment.

## Elevation & Depth
Depth is communicated through tonal layers and soft, ambient shadows. Surfaces use subtle shifts in the neutral and secondary palette to indicate hierarchy. Primary actions may use low-opacity shadows to appear slightly lifted, while secondary containers rely on thin, low-contrast outlines to define boundaries without adding visual clutter.

## Shapes
The system has moved to a more approachable shape language with a **Rounded (Level 2)** setting.
- **Standard Radius:** 0.5rem (8px) for buttons and inputs.
- **Large Radius:** 1rem (16px) for cards and containers.
- **Extra Large Radius:** 1.5rem (24px) for prominent modals.

## Components
- **Buttons:** Feature 8px rounded corners and use the primary blue for high-emphasis actions.
- **Inputs:** Utilize the neutral border colors with a subtle 8px radius; focus states shift to the primary blue.
- **Cards:** Use 16px (rounded-lg) corners with a very light neutral background or a subtle tonal shadow.
- **Chips:** Highly rounded (pill-shaped) using the secondary palette for categorization.
- **Lists:** Clean, border-separated rows with Inter body-md typography for maximum data density.