# Cosous — Website

The official marketing and support site for **Cosous**, the AI cooking companion.
Built with [Eleventy](https://www.11ty.dev/) (static-site generator) — source lives in
`src/`, the build outputs plain static files to `_site/`, which is what gets deployed.

## Build & local dev

```sh
npm install        # one-time: install Eleventy
npm start          # dev server with live reload (http://localhost:8080)
npm run build      # production build → _site/
```

`_site/` is generated (git-ignored). Deploy = build, then serve `_site/`.

## Structure

```
src/
├── index.html            # Landing page (inline critical CSS + inline i18n dictionary)
├── 404.html              # Branded not-found page
├── robots.txt  sitemap.xml
├── help.njk              # → generates help/<lang>/index.html for every language
├── privacy.njk           # → generates legal/<lang>/privacy.html
├── terms.njk             # → generates legal/<lang>/terms.html
├── _data/site.js         # { languages: [...] } — drives the pagination above
├── _includes/
│   ├── footer.njk        # THE shared footer (single source of truth)
│   ├── header.njk        # shared Help-page header
│   └── layouts/
│       ├── help.njk      # full Help page shell (head + header + sections + footer)
│       └── legal.njk     # full Legal page shell (head + sections + footer)
├── assets/
│   ├── base.css          # Shared design system: tokens, nav, footer, language picker
│   ├── favicon.svg       # Brand favicon (pot mark)
│   └── logos/            # Source-platform logos shown in the hero
├── images/               # App screenshots used on the landing page
├── help/                 # Help Center support files (copied as-is)
│   ├── help.css help.js
│   ├── faq.<lang>.json   # FAQ content per language (en, zh, es, ja)
│   └── index.html        # Redirects /help/ to the best language
├── legal/                # Privacy & Terms support files (copied as-is)
│   ├── legal.css legal.js
│   ├── legal.<lang>.json
│   └── privacy.html terms.html   # Language redirects
└── auth/                 # Deep-link landing pages for the iOS app
    └── verify-email/  reset-password/  link-email/   # self-contained (inline CSS/JS)
```

The Help and Legal pages were previously 12 hand-copied HTML shells. They are now
**generated** by Eleventy: each `*.njk` template paginates over `src/_data/site.js`
languages, and the shared chrome (`<head>`, header, footer) lives in `_includes/` — edit
it in **one** place. The page **content** (FAQ list, legal text) is still localized at
runtime by `help.js` / `legal.js`, which fetch the per-language JSON. `index.html` and the
`auth/` pages are copied through verbatim (not templated).

> **Auth pages are intentionally self-contained.** They inline their CSS and JS instead of
> linking shared files. These pages are opened from one-time email links and immediately
> try to open the app via a custom URL scheme, so they must render correctly on the very
> first paint — even if an external request fails, is cached stale, or is interrupted by
> the app handoff. Keep them dependency-free (the only external request is the optional web
> font, which degrades gracefully).

## Internationalization

Supported languages: **en, zh, es, ja** (English is the fallback).

- **Landing page** swaps text client-side from the `I18N` dictionary inside `index.html`.
- **Help / Legal** are generated once per language (same shell), then `help.js` / `legal.js`
  fetch `*.<lang>.json` at runtime and fill the page + footer text by element id.

### Adding a language

1. Add the code to `languages` in `src/_data/site.js` — this generates the new
   `help/<lang>/` and `legal/<lang>/` pages automatically (no copying shells).
2. Add `src/help/faq.<lang>.json` and `src/legal/legal.<lang>.json` with the translations,
   and add the code to the `LANGS` array in both `help.js` and `legal.js`.
3. Add the `<option>` to the language `<select>` in `src/_includes/footer.njk` (and the
   Help header / landing page if relevant).
4. Landing page: add a block to the `I18N` object in `index.html` and extend
   `normalizeLang()` / the `documentElement.lang` map.
5. Add the new URLs to `src/sitemap.xml`.

## Styling

`assets/base.css` holds the shared design tokens (colors, fonts, shadow) plus the nav,
footer, and language picker. `help.css` and `legal.css` contain only page-specific rules
and load **after** base.css so they can override it. Change brand colors in one place: the
`:root` block of `assets/base.css` (the landing page keeps its own copy inline for fast
first paint — keep the two in sync).

## Icons — no emoji

**Never use emoji anywhere in the app or site.** Always use inline SVG instead.
Emoji render inconsistently across platforms and don't respect the brand palette.

- The landing page keeps its icons in the SVG sprite at the top of `index.html`
  (`<symbol id="ic-…">`), referenced with `<use href="#ic-…">`.
- The Help / Legal pages use inline SVGs in the shared includes/layouts.
- The auth pages carry their own inline icon set (`spinner`, `check`, `alert`, `key`,
  `mail`), swapped via `setAuthIcon(name, tone)` where `tone` is `info` | `success`
  | `error`. Add new status icons there, not as emoji.

SVG icons should use `fill:none; stroke:currentColor` so they inherit color, and a
`stroke-width` around `1.8`–`2.2` to match the existing line-icon style.

## Deployment (Vercel)

`vercel.json` sets the build command (`npx @11ty/eleventy`) and output directory
(`_site`). On push, Vercel runs `npm install` → build → serves `_site/`.
