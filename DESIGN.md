# SEE:SUN Design System

## 1. Atmosphere & Identity

SEE:SUN feels bright, physical, and exact: a voice-conditioning studio where singing starts from the body before it becomes performance. The signature is the sunrise breath line from the logo, used as a warm orange signal over calm studio surfaces.

## 2. Color

### Palette

| Role | Token | Light | Dark | Usage |
|------|-------|-------|------|-------|
| Surface/primary | --surface-primary | #fffaf4 | #050507 | Main backgrounds |
| Surface/secondary | --surface-secondary | #f5f5f7 | #111114 | Alternating bands |
| Surface/elevated | --surface-elevated | #ffffff | #1d1d1f | Cards and overlays |
| Text/primary | --text-primary | #111111 | #ffffff | Headlines and primary body |
| Text/secondary | --text-secondary | #6e6e73 | #a1a1a6 | Supporting copy |
| Text/tertiary | --text-tertiary | #86868b | #6e6e73 | Fine print |
| Border/default | --border-default | rgba(17,17,17,0.10) | rgba(255,255,255,0.12) | Structural borders |
| Border/subtle | --border-subtle | rgba(17,17,17,0.06) | rgba(255,255,255,0.08) | Soft dividers |
| Accent/primary | --accent-primary | #ff6b00 | #ff7a00 | Logo orange, primary actions |
| Accent/hover | --accent-hover | #e85f00 | #ff8f1f | Hover actions |
| Accent/soft | --accent-soft | #fff0e3 | rgba(255,107,0,0.14) | Soft highlights |
| Status/success | --status-success | #34c759 | #34c759 | Success |
| Status/warning | --status-warning | #ff9f0a | #ff9f0a | Warning |
| Status/error | --status-error | #ff3b30 | #ff453a | Errors |
| Status/info | --status-info | #007aff | #0a84ff | Informational states |

### Rules

- The logo orange is the only dominant accent on public marketing pages.
- Light public pages use warm off-white, not cold pure gray, when the logo is visible.
- Dark sections use orange as a signal, not as a full background flood.

## 3. Typography

### Scale

| Level | Size | Weight | Line Height | Tracking | Usage |
|-------|------|--------|-------------|----------|-------|
| Display | clamp(3.2rem, 9vw, 6rem) | 900 | 1.06 | -0.05em | Home hero |
| H1 | clamp(2.6rem, 6vw, 5rem) | 900 | 1.08 | -0.045em | Page heroes |
| H2 | clamp(2.2rem, 5vw, 3.5rem) | 850 | 1.12 | -0.04em | Section titles |
| H3 | 1.5rem | 800 | 1.25 | -0.02em | Card titles |
| Body/lg | 1.2rem | 600 | 1.65 | -0.01em | Hero supporting copy |
| Body | 1rem | 500 | 1.65 | 0 | Main body |
| Body/sm | 0.88rem | 500 | 1.55 | 0 | Secondary UI copy |
| Caption | 0.76rem | 800 | 1.35 | 0.08em | Labels and chips |
| Overline | 0.72rem | 900 | 1.35 | 0.12em | Section identifiers |

### Font Stack

- Primary: "Pretendard Variable", pretendard, system-ui, -apple-system, "Noto Sans KR", sans-serif

### Rules

- Korean headings use `word-break: keep-all`.
- Hero copy avoids four-line broken phrases on mobile.
- Logo text uses image assets or uppercase letter spacing, not a mismatched decorative font.

## 4. Spacing & Layout

### Base Unit

All spacing derives from 4px.

| Token | Value | Usage |
|-------|-------|-------|
| --space-1 | 4px | Optical nudges |
| --space-2 | 8px | Compact gaps |
| --space-3 | 12px | Inline control gaps |
| --space-4 | 16px | Default component padding |
| --space-5 | 20px | Comfortable controls |
| --space-6 | 24px | Card padding |
| --space-8 | 32px | Grid gaps |
| --space-10 | 40px | Section internals |
| --space-12 | 48px | Major rhythm |
| --space-16 | 64px | Public section spacing |
| --space-20 | 80px | Hero spacing |
| --space-24 | 96px | Maximum section spacing |

### Grid

- Max public width: 1200px.
- Mobile margin: 20px.
- Public marketing grids collapse to one column below 900px.

### Rules

- Public pages show a hint of the next section in the first viewport where possible.
- Cards are individual content surfaces only; no card-in-card layouts.

## 5. Components

### BrandLogo

- **Structure**: transparent logo mark image plus optional SEE:SUN word text.
- **Variants**: compact, default, dark/light surface.
- **Spacing**: `--space-2` to `--space-3`.
- **States**: link hover lifts via transform only.
- **Accessibility**: image is decorative when adjacent text exists; link has a Korean aria-label.
- **Motion**: 200ms transform/opacity.

### Marketing CTA

- **Structure**: link or button with rounded pill shape.
- **Variants**: dark, orange, ghost.
- **Spacing**: `--space-4`/`--space-5`.
- **States**: hover, active, focus-visible.
- **Accessibility**: visible focus ring and descriptive text.
- **Motion**: transform and color only.

### Bento Box

- **Structure**: content article with optional label, icon, and supporting body.
- **Variants**: white, orange, dark, feature-wide.
- **Spacing**: `--space-8` to `--space-10`.
- **States**: hover scale and shadow only.
- **Accessibility**: semantic text, no emoji as functional icon.
- **Motion**: transform and shadow.

## 6. Motion & Interaction

### Timing

| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| Micro | 120ms | ease-out | Press feedback |
| Standard | 220ms | ease-in-out | Hover and focus |
| Emphasis | 600ms | cubic-bezier(0.16, 1, 0.3, 1) | Hero and reveal motion |
| Scroll-driven | GSAP ScrollTrigger | linear scrub | Journey sections |

### Rules

- Animate `transform`, `opacity`, and filter effects only.
- Respect `prefers-reduced-motion`.
- Do not remove existing motion to chase performance points.

## 7. Depth & Surface

### Strategy

Depth strategy: tonal-shift plus soft shadows.

| Level | Value | Usage |
|-------|-------|-------|
| Hairline | 1px solid var(--border-subtle) | Header and separators |
| Card shadow | 0 10px 40px rgba(0,0,0,0.04) | Light cards |
| Elevated shadow | 0 25px 60px rgba(0,0,0,0.15) | Video and hero media |
| Orange glow | 0 18px 44px rgba(255,107,0,0.22) | Primary CTA hover |

### Rules

- Public pages should feel warm and studio-like, not generic Apple gray.
- Orange shadows are only for primary actions and logo moments.
