## Goal

Build an interactive slide deck for **"The Vibe Stack"** by Dhruv Mishra — all 14 slides of content delivered as a polished, presenter-ready web app (not a downloadable file).

## Visual direction

Editorial / premium-creator aesthetic that matches the source post's energy:

- **Palette:** dark charcoal background (`#0E0E10`) with off-white text (`#F5F1EA`), bold neon-lime accent (`#D8FF3D`) for highlights and CTAs, soft warm gray for secondary text.
- **Typography:** display serif headlines (Instrument Serif) paired with a clean sans (Inter) for body and a mono accent (JetBrains Mono) for stats/tables.
- **Motif:** numbered slide indicator top-right ("03 / 14"), thin lime divider under kickers, soft grain texture on dark slides. Sandwich structure — dark hero/CTA slides, lighter cream content slides, dark closer.
- All slides render at fixed **1920×1080** and scale to fit viewport.

## Slides (1–14)

Each gets a dedicated component using the right layout type:

1. **Hero / Core idea** — big title "The Vibe Stack", the formula as 4 stacked tool chips with `+` between, Marcus story callout, $4,200 stat in lime
2. **What this is** — 4-step horizontal flow with arrows
3. **Why it works** — split: "Old way" vs "New way" comparison + advantage bullets
4. **The 4 tools** — 2×2 grid of tool cards (Google Maps, Claude, Lovable, Higgsfield)
5. **Step 1 — Find businesses** — left column target profile, right column "how to find" + action box
6. **Step 2 — Claude prompt** — full prompt in a styled code/quote block + outputs row
7. **Step 3 — Build sites** — Lovable prompt template + time callout
8. **Step 4 — 10-sec video** — 4 numbered steps + "why vertical" pull quote
9. **Step 5 — Send it** — message template + channel-by-business-type table + follow-up timeline
10. **Real weekend timeline** — full-bleed timeline table (Fri → Tue) with $4,200 close stat
11. **Step 6 — Close on Zoom** — 5-step checklist + 35–55% close-rate stat hero
12. **The numbers** — 4 large stat cards (replies, deals, per deal, monthly recurring)
13. **5 things that kill this** — numbered warning cards in red/lime accent
14. **CTA / Closer** — dark slide, "Comment SEND" CTA, author credit (Divyanshi Sharma, 88.9K followers)

## App features

- **ScaledSlide** wrapper: 1920×1080 absolutely positioned, scaled via `transform: scale()` with `ResizeObserver`
- **Semantic slide typography classes** (`.slide-title`, `.slide-body`, `.slide-kicker`, `.slide-chrome`) defined in `styles.css`
- **Keyboard navigation**: ←/→/Space to move, `G` toggles grid, `F` fullscreen, `Esc` exits fullscreen/grid
- **URL-driven**: `/slides/$index` route — refresh keeps slide, share lands on right one
- **Thumbnail sidebar** (collapsible): click to jump
- **Grid overview** mode: all 14 slides as scrollable thumbnails
- **Fullscreen presentation** mode using Fullscreen API
- **Progress bar** + slide counter ("3 / 14") top-right
- **Print mode** at `/slides/print` for `Cmd+P` → PDF export

## Technical structure

```text
src/
  routes/
    index.tsx                  → redirects to /slides/1
    slides.$index.tsx          → main editor/presenter
    slides.print.tsx           → print-all view
  components/
    slides/
      ScaledSlide.tsx          → 1920×1080 scaling wrapper
      SlideLayout.tsx          → shared chrome (number, footer)
      SlideShell.tsx           → toolbar + sidebar + canvas
      Thumbnail.tsx
      GridView.tsx
      slides/
        Slide01_Hero.tsx
        Slide02_WhatThisIs.tsx
        ... (one per slide, 14 total)
        index.ts               → SLIDES array
  hooks/
    useSlideNavigation.ts
    useFullscreen.ts
  styles.css                   → dark theme tokens + slide typography classes
```

## Out of scope

- No backend / auth / persistence (content is hardcoded in slide components)
- No slide editing UI (read-only deck)
- No notes panel or presenter view (can add later if wanted)

After approval I'll build all 14 slide components, the shell, navigation, grid, and fullscreen mode in one pass.

I want a whole full website in which we can provide the services. Don't mention. We want to make a wwb in wich we build the web app for customers so make that it is not a portfolio i can discribe my plane to you now you make a full stack web in which we provide the service on that we make webside apps and acording to there requriment so make apage were we sell web for user

&nbsp;
