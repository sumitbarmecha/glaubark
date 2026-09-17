# Glaubark Design Tokens

Technical reference extracted from the implemented website. Pair this file with `css/custom.css` `:root` and the Tailwind colour map on each HTML page.

**Classification**

| Tag | Meaning |
|---|---|
| Observed | Directly present in the live implementation |
| Brand Rule | Formalised from that implementation; use going forward |
| Strategic Recommendation | Not yet consistent in code; proposed as the system |
| Client Confirmation Required | Needs Glaubark approval or factual verification |

Source of truth for colours: `css/custom.css` lines 13–37. Hex and `-rgb` triplets must stay in sync. They currently do not, for `--accent` and `--lime-soft`.

---

## 1. Colour tokens

### 1.1 Canonical palette (Observed)

Use **hex** for fills, borders, and text. Use the **RGB triplet** only with slash-alpha syntax: `rgb(var(--leaf-rgb) / 0.14)`.

| Token | Name | HEX | RGB | HSL (approx.) | Role | Typical use |
|---|---|---|---|---|---|---|
| `--ink` | Ink | `#1c1c1c` | `28 28 28` | `0 0% 11%` | Neutral / text | Body, headings on light |
| `--sub` | Sub | `#6b6b6b` | `107 107 107` | `0 0% 42%` | Neutral / muted text | Captions, eyebrows on cream |
| `--cream` | Cream | `#f7f5f0` | `247 245 240` | `43 30% 95%` | Neutral / background | Page wash, light sections |
| `--line` | Line | `#e8e4db` | `232 228 219` | `42 24% 90%` | Neutral / border | Dividers, card edges on light |
| `--forest-deep` | Forest Deep | `#082410` | `8 36 16` | `137 64% 9%` | Primary dark | Deepest panels, services hero |
| `--forest` | Forest | `#0d1a10` | `13 26 16` | `134 33% 8%` | Primary dark | Loader, footer, dark band |
| `--forest-mid` | Forest Mid | `#1a3d2a` | `26 61 42` | `147 40% 17%` | Secondary dark | Mid-tone surfaces, shadows |
| `--leaf` | Leaf | `#22804a` | `34 128 74` | `146 58% 32%` | Primary on light | Links, icons, green on cream |
| `--sage` | Sage | `#9fd7a4` | `159 215 164` | `125 41% 73%` | Secondary accent | Soft green, footer mark |
| `--accent` | Accent (hex) | `#61af1e` | *see mismatch* | `94 71% 40%` | Accent | Intended mid-lime |
| `--lime` | Lime | `#a3e635` | `163 230 53` | `84 78% 55%` | Accent on dark | Hero accent, CTAs on forest |
| `--lime-soft` | Lime Soft (hex) | `#61af1e` | *see mismatch* | `94 71% 40%` | Accent | Same hex as `--accent` |

White `#ffffff` is used throughout for light cards, inverse text, and glass overlays. It is not declared as a CSS variable.

### 1.2 Token mismatches (Observed — fix before treating as law)

These `-rgb` triplets do **not** match their hex:

| Token | Hex implies RGB | Declared `-rgb` | Declared RGB as hex |
|---|---|---|---|
| `--accent` | `97 175 30` | `126 229 161` | `#7ee5a1` |
| `--lime-soft` | `97 175 30` | `175 228 78` | `#afe44e` |

**Brand Rule:** Until the tokens are corrected, opacity utilities such as `bg-accent/40` and `rgb(var(--accent-rgb) / …)` render a paler mint (`#7ee5a1`), not `#61af1e`. Solid `var(--accent)` renders `#61af1e`. Do not mix them expecting the same colour.

**Strategic Recommendation:** Align both tokens to a single Accent: hex `#61af1e` / rgb `97 175 30`. Keep `--lime` `#a3e635` as the bright-on-dark signal. Retire `--lime-soft` or map it to `#afe44e` if that paler lime is intentional.

### 1.3 Hardcoded colours outside `:root` (Observed)

These appear often enough to treat as part of the visual system, but they are **not** tokens.

| HEX | RGB | Where | Recommendation |
|---|---|---|---|
| `#132517` | `19 37 23` | Scrolled header, About foundation card, several dark panels | **Brand Rule candidate:** Header / panel forest. Near `--forest-mid` (`#1a3d2a`) but cooler and darker. Formalise as `--header` or replace with `--forest`. |
| `#84cc16` | `132 204 22` | About eyebrows, vision/mission icons on `#132517` | Tailwind Lime 400. Close to `--lime`. **Strategic Recommendation:** use `--lime` instead. |
| `#2fce65` | `47 206 101` | Desktop nav hover | One-off. **Strategic Recommendation:** hover to `--lime` or `--sage`. |
| `#baf048` | `186 240 72` | `.h2-btn-primary:hover` | Lime hover. May formalise as `--lime-hover`. |
| `#e2e8e3` | `226 232 227` | Home service-card border | Cooler than `--line`. Prefer `--line`. |
| `#b42318` | `180 35 24` | Form toast error | Functional error. Formalise as `--error`. |

### 1.4 Hierarchy (Brand Rule)

| Role | Colour | Usage share (guidance) |
|---|---|---|
| **Primary dark** | Forest `#0d1a10` / Forest Deep `#082410` | ~25–35% of a dark page; heroes, footer, loader |
| **Primary on light** | Leaf `#22804a` | ~8–12% — the only green that reads as green on cream |
| **Accent** | Lime `#a3e635` | ~3–5% — headlines on dark, pills, key signals |
| **Secondary** | Sage `#9fd7a4`, Forest Mid `#1a3d2a` | Supporting greens, never large text on cream |
| **Neutrals** | Cream, White, Ink, Sub, Line | Majority of light pages |
| **Functional** | Leaf (success), `#b42318` (error) | Toasts, validation |

Lime and Sage **fail WCAG** as body text on cream. Leaf on cream and Lime on Forest pass for large/bold UI; always check contrast for small type.

### 1.5 Combinations

**Use**

| Foreground | Background |
|---|---|
| White / Lime | Forest, Forest Deep, `#132517` |
| Ink | Cream, White |
| Leaf | Cream, White |
| Sub | Cream, White (captions only) |
| Forest | Lime (buttons) |

**Do not use**

| Combination | Why |
|---|---|
| Sage or Lime as body text on Cream | Contrast failure; looks “generic green web” |
| Leaf on Forest | Disappears |
| Ink on Forest | Harsh, off-brand |
| Accent hex `#61af1e` next to Lime `#a3e635` in the same cluster | Two competing mid-greens |
| Pure CSS `green`, Tailwind `emerald-*`, or `#22c55e` | Outside the system |

### 1.6 Gradients (Observed)

Used sparingly. Do not invent decorative green washes.

| Gradient | Use |
|---|---|
| `linear-gradient(to right, var(--accent) 0 4rem, rgba(255,255,255,0.16) 4rem)` | Home hero bottom rule |
| `linear-gradient(158deg, rgb(var(--accent-rgb) / 0.3), rgba(34,124,72,0.44))` | Hero glass stat card |
| Hero veil: `rgb(0 0 0 / var(--hero-overlay-opacity))` default `0.3` | Video readability |
| Footer mark: Sage at ~36% on Forest | Giant “glaubark” wordmark band |

**Brand Rule:** Photography and video carry atmosphere. Gradients are structural (rules, veils), not backgrounds.

### 1.7 Hero overlay tokens (Observed)

```
--hero-overlay-rgb: 0 0 0;
--hero-overlay-opacity: 0.3;
```

Raise opacity if white type fails on bright footage. Do not tint the veil green.

---

## 2. Typography tokens

### 2.1 Families (Observed)

| Role | Family | Source | Weights in use |
|---|---|---|---|
| Body, UI, nav | **Inter** | Google Fonts | 400, 500, 600, 700 |
| Headings h1–h6, loader word, footer mark | **DM Sans** | Google Fonts (variable opsz/wght) | 500 (loader), 600 (headings, footer mark) |
| Occasional quote | Georgia, Times New Roman, serif | System | Regular italic-adjacent quotes |

**Implementation note (Observed):** `h1–h6 { font-family: "DM Sans", sans-serif !important; }` in `custom.css`. **Only `index.html` currently loads the DM Sans stylesheet.** Other pages request Inter only, so headings silently fall back to Inter. **Brand Rule:** load both families on every page.

```
https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap
https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap
```

Do not substitute Space Grotesk, Manrope, or system-ui as the brand pair.

### 2.2 Heading rule (Observed → Brand Rule)

```
h1–h6:
  font-family: DM Sans
  font-weight: 600
  letter-spacing: -0.01em
  line-height: 1.2
```

Home hero title overrides tracking to `-0.03em` and line-height to `1.08`.

### 2.3 Scale (Observed, synthesised)

Fluid type uses `clamp()`. These are the working sizes, not a rigid type ramp invented for this document.

| Style | Size | Weight | Tracking | Line-height | Family | Notes |
|---|---|---|---|---|---|---|
| Display / H1 hero | `clamp(2.25rem, 6vw, 4.5rem)` | 600 | -0.03em | 1.08 | DM Sans | White or Lime on dark video |
| H2 section | `text-2xl` → `lg:text-4xl` (~1.5–2.25rem) | 600 | -0.01em | 1.2 | DM Sans | |
| H3 card / story | `text-xl` → `lg:text-3xl` | 600 | -0.01em | 1.2 | DM Sans | |
| H4 | ~1.125–1.25rem | 600 | -0.01em | 1.2 | DM Sans | |
| Body large | 1.125–1.5rem | 300–400 | 0 | ~1.6–1.7 | Inter or DM Sans light | Vision/mission quotes |
| Body | 15–16px (`text-sm` / `text-base`) | 400 | 0 | 1.6–1.75 | Inter | Default |
| Small | 13–14px | 400–500 | 0 | 1.45–1.55 | Inter | Footer, forms |
| Eyebrow / label | 11px | 600 | 0.15–0.16em | 1 | Inter | Uppercase |
| Button | 14px | 500–600 | 0 | 1 | Inter | Pill CTAs |
| Nav | 15px | 400 | 0 | 1 | Inter | White on header |
| Loader word | `clamp(1.85rem, 5.4vw, 3.15rem)` | 500 | -0.045em | 1 | DM Sans | **lowercase** “glaubark” |
| Footer mark | `clamp(4.5rem, 20vw, 250px)` | 600 | -0.04em | 0.78 | DM Sans | Sage / 36% |

### 2.4 Capitalisation (Brand Rule)

| Element | Case |
|---|---|
| Eyebrows | Uppercase, tracked |
| Headlines | Sentence case. Not Title Case. Not ALL CAPS. |
| Buttons / CTAs | Sentence case (“Get in touch”, “Subscribe”) |
| Loader / footer giant mark | lowercase **glaubark** |
| Logo alt text | “Glaubark” |

---

## 3. Spacing

### 3.1 Container (Observed → Brand Rule)

| Token | Value |
|---|---|
| Max content width | **1400px** |
| Inline padding mobile | **20px** (`px-5` / `1.25rem`) |
| Inline padding tablet | **32px** (`md:px-8` / `2rem`) |
| Inline padding desktop | **48px** (`lg:px-12` / `3rem`) |

Header inner and footer inner use the same 1400px + padding rhythm.

### 3.2 Vertical rhythm (Observed)

Common section paddings:

| Class / value | px | Use |
|---|---|---|
| `py-16` | 64 | Compact sections, mobile |
| `md:py-20` | 80 | About foundation |
| `md:py-24` | 96 | Standard section |
| `py-20 md:py-28 lg:py-32` | 80 / 112 / 128 | Editorial brand-statement |

**Formal scale (Brand Rule, because the site already sits on 4px):**

`4 / 8 / 12 / 16 / 20 / 24 / 32 / 48 / 64 / 80 / 96 / 128`

Prefer this scale for new pages. Do not introduce 40px or 72px as new defaults.

### 3.3 Header / logo (Observed)

| Item | Mobile | Desktop |
|---|---|---|
| Header bar height | 65px | 70px |
| Wordmark height | 28px | 60px |
| Drawer wordmark | 26px | — |
| Footer wordmark | 30px | 30px |
| Loader mark | 68px | 80px |

Header is `position: fixed`. Pages must offset content for the 65/70px bar (heroes are typically full-viewport and sit under the transparent header).

---

## 4. Radius

| Token (informal) | Value | Use (Observed) |
|---|---|---|
| Pill | `9999px` | Buttons, tags, nav chips, social buttons |
| Circle | `50%` | Icon badges, loader, avatars |
| Card L | `1.25rem` (20px) | Service cards, many content cards |
| Card XL | `1.35–1.75rem` | Feature cards |
| Panel | `1.75rem` / `2.25rem` | About foundation dark panel |
| Image | `1.5rem` (`rounded-3xl`) common | Photography frames |
| Input | `9999px` or `0.9rem` | Newsletter pill vs toast `0.9rem` |
| Hairline accent | `2px` | Occasional ticks, not default |

**Brand Rule:** Corners are generously rounded, never squircles or sharp enterprise rectangles. Process/timeline rails may go square (`border-radius: 0`) as a deliberate exception.

---

## 5. Shadows (Observed)

Keep shadows cool-forest, not grey Material.

| Use | Value |
|---|---|
| Rest card | `0 1px 0 rgb(19 37 23 / 0.04)` |
| Lift sm | `0 8px 24px rgb(var(--forest-mid-rgb) / 0.35)` — primary button hover |
| Lift md | `0 16px 40px rgb(13 26 16 / 0.08–0.16)` |
| Lift lg | `0 20px 48px rgba(0,0,0,0.08)` |
| Lift xl | `0 22px 50px rgb(8 20 12 / 0.28)` dark cards |
| Hero / overlay | `0 24px 64px` / `0 32px 80px rgba(0,0,0,0.12–0.16)` |
| Focus ring (how-step) | `0 0 0 6px rgb(var(--forest-mid-rgb) / 0.15)` |

**Brand Rule:** No coloured glow around CTAs except the existing lime button shadow. No drop shadows on the logo.

---

## 6. Breakpoints (Observed)

The site uses Tailwind defaults plus a few custom queries.

| Name | Width | Behaviour |
|---|---|---|
| Base | < 768px | Single column, hamburger, accordion footer |
| `md` | 768px | Header logo 60px, increased padding, 2-col starts |
| `lg` | 1024px | Desktop nav appears; mobile drawer hidden |
| `xl` | 1280px | Nav gap `xl:gap-10`; wider type |

**Brand Rule:** Navigation is mobile until **1024px**, not 768px.

---

## 7. Motion (Observed)

| Token / behaviour | Value |
|---|---|
| Header bg | `0.35s ease` |
| Drawer | `0.35s cubic-bezier(0.4, 0, 0.2, 1)` |
| Card hover lift | `0.4s cubic-bezier(0.22, 1, 0.36, 1)` |
| Loader exit | clip-path `1.05s cubic-bezier(0.76, 0, 0.18, 1)` |
| Engine | GSAP + ScrollTrigger + Lenis |
| Reduced motion | Loader animations disabled via `prefers-reduced-motion` |

**Brand Rule:** Motion is editorial (reveal, clip, gentle lift), not bounce or confetti. Respect `prefers-reduced-motion` on every new animation.

Magnetic buttons (`data-magnetic`) and tilt (`data-tilt`) exist; do not add CSS `transform` hover on the same nodes.

---

## 8. Component tokens (quick)

| Component | Spec |
|---|---|
| Primary button (dark UI) | Pill, `padding: 0.8125rem 1.625rem`, bg Lime, text Forest Deep, 14px/600 |
| Primary hover | `#baf048`, shadow lime/0.3 |
| Ghost button | Pill, 1px white/20, text white/80 |
| Header | Transparent → `#132517` + blur(8px) when `.is-scrolled` |
| Logo on dark | `mix-blend-mode: screen` |
| Logo on light hero | `mix-blend-mode: multiply; filter: invert(1)` |
| Form success toast | Cream surface, Leaf icon chip |
| Form error toast | Cream surface, `#b42318` icon chip |
| Input (footer) | Pill, dark translucent, white text |

Full component behaviour: `BRAND_GUIDELINES.md` § UI Component System.

---

## 9. Z-index (Observed, informal)

| Layer | z-index |
|---|---|
| Loader | 99999 |
| Header | 50 |
| Drawer / overlay | below loader, above page |
| Content | auto |

---

## 10. File map for implementers

| Need | File |
|---|---|
| Colour / type / header / footer / forms | `css/custom.css` |
| Tailwind colour bridge | inline `tailwind.config` in each HTML file |
| Header / footer markup | `js/components.js` |
| Page motion | `js/animations.js`, `js/home.js`, page scripts |
| This token list vs narrative rules | `BRAND_GUIDELINES.md` |
