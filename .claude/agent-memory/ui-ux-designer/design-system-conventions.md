---
name: design-system-conventions
description: Djalico brand UI conventions — color token usage, spacing scale, radii, button/card patterns established on the login screen
metadata:
  type: project
---

Design language conventions for Djalico user-facing screens (source: `config/color.tsx`, established on `app/login.tsx` redesign).

**Why:** Keep visual rhythm and brand identity consistent across student screens so each new screen feels part of one product.

**How to apply:** Reuse these tokens/patterns when designing any `(tabs)/` user screen. Admin screens use their own inline `COLORS` — do not apply these there.

- **Spacing scale:** multiples of 4 / 8 (gaps: 6, 8, 14, 18, 32).
- **Radii:** inputs 14, cards 28, pills 999, logo wrap 22, glow ring 32, buttons 16.
- **Page background:** `LinearGradient` top `bgGradientTop` → bottom `bgGradientBottom`.
- **Yellow accent usage:** yellow is a decorative/accent color only — used as a card top accent bar (`color.yellow`, ~5px), a low-opacity glow ring behind logos (`rgba(255,214,107,0.22)`), and pill backgrounds. Never the primary CTA fill.
- **Primary CTA:** navy→deepBlue `LinearGradient` (start top-left, end bottom-right), height 56, with a `btnShadow` wrapper (deepBlue shadow) and press feedback = `opacity 0.92` + `scale 0.985`.
- **Cards:** white, hairline border `rgba(16,49,73,0.06)`, soft navy shadow, `overflow: hidden` so the top accent bar clips to rounded corners.
- **Inputs:** paleBlue fill, transparent border by default; focused = navy border + white fill + soft shadow; error = `#EF4444` border + `#FFF5F5` fill. Leading Ionicon outline icon that switches to navy on focus.
- **Typography:** app name 34/800, card title 24/800, label 13/700, body/subtitle 14/500 softGray, error 12/600.
- **Decorative music notes** (`♪ ♫ ♩ ♬`) at low opacity (~0.28) in `yellowDark` reinforce the music-education identity without extra assets; wrap them in `pointerEvents="none"` and give them no a11y role.
- **Error / a11y red:** `#B91C1C` text on `#FEF2F2` bg with `#FECACA` border for server-error banners.
