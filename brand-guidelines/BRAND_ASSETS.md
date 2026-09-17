# Glaubark Brand Assets

Inventory of logos, type, icons, images, video, and supporting files in this repository. Paths are relative to the site root.

**Do not treat draft pages or unused files as approved brand assets.**

Classification: **Observed** unless marked otherwise.

---

## 1. Logo files

| File | Role | Notes |
|---|---|---|
| `assets/images/glaubark_logo.png` | **Primary wordmark** | White lockup on transparent. Used in header, mobile drawer, footer. CSS applies `mix-blend-mode: screen` on dark; `multiply` + `invert(1)` on `body.light-hero` before scroll. |
| `assets/images/logo_icon.png` | **Mark / loader** | Circular icon used in the site loader with the lowercase “glaubark” word. Same screen blend. |
| `assets/images/logo.svg` | **Unused mark** | 40×40 concentric-arc / furrow drawing, white stroke. **Not referenced on live pages.** Do not ship as the official mark until Glaubark confirms. |

**Not found**

- Separate stacked wordmark
- Dedicated dark-ink PNG for light backgrounds (light use is a CSS invert of the white PNG)
- Favicon / `apple-touch-icon` (no `<link rel="icon">` on pages) — **Strategic Recommendation:** export `logo_icon.png` (or a simplified mark) to `favicon.ico` + 180px apple touch icon after client approval
- Vector master of the live PNG wordmark

**Brand Rule:** Do not redraw or recolour the PNG lockup. Do not replace it with `logo.svg` on a whim.

Clear space and minimum size are **not reliably specified in files**. See `BRAND_GUIDELINES.md` § Logo — treat measurements there as **Strategic Recommendation**, not existing production rules.

Current rendered heights (Observed):

| Placement | Height |
|---|---|
| Header mobile | 28px |
| Header `md+` | 60px |
| Drawer | 26px |
| Footer | 30px |
| Loader mark | 68px / 80px (`md`) |

---

## 2. Fonts

Loaded from Google Fonts. No self-hosted `woff`/`woff2` in the repo.

| Family | Files in repo | Live loading |
|---|---|---|
| Inter | None (remote) | All live HTML pages |
| DM Sans | None (remote) | **`index.html` only** at time of audit |
| Georgia | System | Founder/quote treatments in CSS |

**Brand Rule:** New pages must load Inter + DM Sans. See `DESIGN_TOKENS.md` § Typography.

---

## 3. Iconography

No icon font. No SVG sprite sheet.

| Source | Style | Where |
|---|---|---|
| Inline Heroicons-style SVG | 24×24 viewBox, `fill="none"`, `stroke="currentColor"`, round caps/joins, stroke ~1.5–2 | Nav hamburger, footer socials, vision/mission, forms, service UI |
| Decorative leaf in home hero eyebrow | Stroke, Accent colour | Home hero |

**Brand Rule:** Stroke icons, not filled pictograms. Colour inherits (`currentColor`) — Leaf on light, Lime/`#84cc16` on dark, white in chrome. Do not introduce 3D, duotone, or coloured “eco” icon packs.

---

## 4. Photography — field shoot (preferred)

Folder: `assets/images/shoot/`

These are the closest the repo has to a Glaubark-owned documentary library: Indian agricultural contexts, field presence, natural light, working bodies, soil and crop.

| File | Notes |
|---|---|
| `shoot/farmer_walking.jpg` | Named export; walking figure in field |
| `shoot/DSC00904.JPG` … `DSC01040.JPG` | Camera roll (Sony-style DSC numbering) |

Use these ahead of Unsplash and ahead of the generic named JPGs below.

**Client Confirmation Required:** model releases, location, and whether every frame is approved for public marketing.

---

## 5. Photography — named marketing stills

Root of `assets/images/`. Mix of purpose-shot and stock-like editorial images used as service/practice illustrations.

| File | Apparent subject | Caution |
|---|---|---|
| `women_farming.jpg` | Women in field | Prefer if documentary; confirm origin |
| `indian_farmer.jpg` | Farmer portrait/context | Name is generic; confirm not stock cliché |
| `regenerative_farming.jpg` | Practice illustration | |
| `carbon_project_development.jpg` | Project development | |
| `carbon_sequestration.jpg` | Sequestration visual | |
| `MRV_Tech.jpg` | Tech / MRV in field | Good direction if it shows tools on the ground |
| `project_life_cycle.jpg` | Lifecycle visual | |
| `Low_Costs.jpg` | Cost/practice | |
| `Reduces_greenhouse.jpg` | Climate/practice | |
| `water_Efficiency.jpg` | Water | |
| `windturbinesinsnow.jpg` | Wind turbines in snow | **Do not use for Glaubark.** Off-category (energy hardware, non-Indian, non-ag). Anti-pattern. |
| `dhruv.jpeg` | Founder portrait | Used on About. **Client Confirmation Required** that this is the approved photograph (proofing doc originally flagged Unsplash placeholders). |

**Not an asset to promote:** random Unsplash URLs still embedded in some pages (About difference cards, drafts, older articles). Replace with `shoot/` or approved portraits.

---

## 6. Graphics / SVG

| File | Use |
|---|---|
| `assets/images/india-map-outline.svg` | India outline for geographic storytelling |
| `assets/images/logo.svg` | Unused mark (see §1) |

---

## 7. Video

| File | Use (Observed) |
|---|---|
| `assets/videos/Herobanner.mp4` | Home hero (preloaded on `index.html`) |
| `assets/videos/aboutHero.mp4` | About hero |
| `assets/videos/blogHeroBanner.mp4` | Blog/case-study heroes |

Treatment: full-bleed, `object-fit: cover`, black veil at 30% opacity (`--hero-overlay-opacity`). White/Lime type on top.

**Brand Rule:** Hero video should be field footage (farms, people, practices), not stock city/tech reels. Confirm rights for paid media if reused off-site.

---

## 8. Pages and which are live

### Live / in primary navigation

| File | Nav label |
|---|---|
| `index.html` | Home |
| `about.html` | About |
| `services.html` | Services |
| `blog.html` | Case Studies |
| `contact.html` | Contact Us |
| `privacy.html` | Footer legal |
| `terms.html` | Footer legal |

Article templates: `blog-carbon-credits-india.html`, `blog-regenerative-farming.html`, `blog-field-story.html`.

### In repo but not primary brand surfaces

| File | Status |
|---|---|
| `founders.html` | Profiles moved to About; do not treat as the founder URL |
| `process.html` | Draft / unlinked in nav |
| `technology.html` | Placeholder |
| `index2.html`, `index3.html` | Homepage drafts; **contain fictional testimonials** |
| `photography-guidelines.html` | Internal photo brief (some facts outdated, e.g. Karnataka) |
| `CLIENT-REVIEW-ASSUMED-CONTENT.md` | Proofing log — **source of truth for unverified claims** |
| `GOOGLE-SHEETS-FORMS.md` | Form backend setup, not brand |

---

## 9. Code that carries the brand

| File | What it owns |
|---|---|
| `css/custom.css` | Tokens, type, header/footer, components |
| `js/components.js` | Header, footer, newsletter markup |
| `js/loader.js` | Loader behaviour |
| `js/forms.js`, `js/contact.js` | Forms, spinner, toast |
| `js/animations.js`, `js/home.js`, `js/services.js` | Motion and page UI |
| `apps-script/Code.gs` | Form → Sheets (not visual brand) |

---

## 10. Colour as an asset

The implemented palette lives in `css/custom.css` `:root`. Do not introduce new brand greens. Full values: `DESIGN_TOKENS.md`.

---

## 11. Missing assets to request from the client

**Client Confirmation Required / still to supply**

- Vector (SVG/PDF) master of the live wordmark and mark
- Dark (ink) and light (white) versions as separate files, not CSS hacks
- Favicon set
- Approved founder photographs (Vatsal still may be placeholder — verify)
- Named partner / mill / FPO logos (none in repo)
- Dashboard / GIS / MRV product screenshots (brief asked; none supplied)
- Real case-study photography with permissions
- Official social URLs (footer icons currently `href="#"`)
- Office address, confirmed emails

Until those exist, do not invent marks, partner walls, or UI mockups that look like a SaaS product Glaubark does not show.
