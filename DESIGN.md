# Design Brief — GUCCORA

**Purpose:** Premium product-based ecommerce MLM platform. High-trust financial dashboard for product purchases, wallet management, commission tracking, genealogy visualization, and admin oversight.

## Palette

| Role | OKLCH (Light) | OKLCH (Dark) | Purpose |
|------|---|---|---|
| Background | `0.99 0 0` | `0.145 0 0` | Deep black, high contrast |
| Foreground | `0.15 0 0` | `0.95 0 0` | Text on backgrounds |
| Card | `1.0 0 0` | `0.18 0 0` | Elevated data sections |
| Primary (Gold) | `0.78 0.21 66` | `0.8 0.18 55` | CTAs, active states, income highlights |
| Secondary | `0.95 0 0` / `0.22 0 0` | Light/dark toggle backgrounds |
| Destructive | `0.55 0.22 25` / `0.65 0.19 22` | Withdrawal warnings, refunds |
| Border | `0.9 0 0` | `0.28 0 0` | Subtle dividers on cards |
| Success | Chart-1 `0.65 0.22 40` | Pair income, positive balance |

## Typography

| Level | Font | Usage | Scale |
|-------|------|-------|-------|
| Display | General Sans (600–700) | Page titles, card headers, GUCCORA branding | 32–40px |
| Body | General Sans (400–500) | Content, labels, wallet amounts | 14–16px |
| Mono | Geist Mono (400) | Order IDs, wallet addresses, transaction hashes | 12–14px |

## Structural Zones

| Zone | Treatment | Elevation |
|------|-----------|-----------|
| Header/Nav | Card dark + gold accent border-bottom | Base |
| Content grid | Card (`bg-card`, `border-border`) with `shadow-subtle` | +1 |
| Data sections | Muted background (`bg-muted/10`) with borders | Flat |
| CTAs | Gold primary button (`bg-primary text-primary-foreground`) | Interactive |
| Footer/Admin | Sidebar dark, minimal borders | Base |

## Component Patterns

- **Plan cards:** Gold accent top border, price in display font, ₹120 max payout callout
- **Wallet widget:** Large gold balance number, transaction breakdown in subtle cards
- **Commission tiles:** Three-column (Direct/Level/Pair) with icons, dark backgrounds, gold amounts
- **Genealogy tree:** Minimal lines, dark nodes, gold highlights on active/self node
- **Data tables:** Stripped rows, muted alternating backgrounds, gold sort indicators
- **Buttons:** Solid gold primary, outlined secondary (border only), disabled state (muted)

## Motion & Interaction

- Default transition: `transition-smooth` (0.3s cubic-bezier)
- Hover states: Gold buttons lighten slightly, cards lift with `shadow-elevated`
- Mobile: No parallax, smooth scroll only, touch-friendly hit targets (44px min)

## Constraints & Rules

- No gradients on backgrounds — solid colors only
- Gold used sparingly: CTAs, highlights, active states — never dominant
- Dark card elevation via `shadow-subtle`, never gloss/glow
- All text AA+ contrast in both light and dark modes
- Mobile-first: `sm:` layouts defined, `lg:` desktop refinements
- No animations beyond transitions — no floating, pulsing, or decorative motion

## Differentiation

Premium fintech aesthetic with warm gold accents. Refined geometry, card-based composition, clear hierarchy through shadows and typography, not color. High trust through clarity: structured data, visible boundaries, intentional whitespace. Dark mode always-on for the luxe, reduced-eye-strain financial dashboard experience.

## Signature Detail

When hovering over a gold CTA or commission amount, the element gains `shadow-elevated` and the gold slightly brightens — a tactile, premium feel that signals interactivity without animation overhead.
