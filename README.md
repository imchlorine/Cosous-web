# Cosous — Website

The official marketing and support site for **Cosous**, the AI cooking companion.
Zero-dependency static site (plain HTML / CSS / JS) — deploy by serving the folder.

## Structure

```
.
├── index.html            # Landing page (inline critical CSS + inline i18n dictionary)
├── 404.html              # Branded not-found page
├── robots.txt
├── sitemap.xml
├── assets/
│   ├── base.css          # Shared design system: tokens, nav, footer, language picker
│   ├── favicon.svg       # Brand favicon (pot mark)
│   └── logos/            # Source-platform logos shown in the hero
├── images/               # App screenshots used on the landing page
├── help/                 # Help Center (JSON-driven FAQ)
│   ├── help.css          # Page-specific styles (loads after assets/base.css)
│   ├── help.js           # Loads faq.<lang>.json, builds the accordion + search
│   ├── faq.<lang>.json   # FAQ content per language (en, zh, es, ja)
│   ├── index.html        # Redirects /help/ to the best language
│   └── <lang>/index.html # Localized shell (same markup, content injected by JS)
├── legal/                # Privacy & Terms (JSON-driven, same pattern as help/)
│   ├── legal.css legal.js
│   ├── legal.<lang>.json
│   ├── privacy.html terms.html      # Language redirects
│   └── <lang>/privacy.html terms.html
└── auth/                 # Deep-link landing pages for the iOS app
    ├── verify-email/  reset-password/  link-email/   # self-contained (inline CSS/JS)
```

> **Auth pages are intentionally self-contained.** They inline their CSS and JS
> instead of linking shared files. These pages are opened from one-time email links
> and immediately try to open the app via a custom URL scheme, so they must render
> correctly on the very first paint — even if an external stylesheet request fails,
> is cached stale, or is interrupted by the app handoff. Keep them dependency-free
> (the only external request is the optional web font, which degrades gracefully).

## Internationalization

Supported languages: **en, zh, es, ja** (English is the fallback).
Language is resolved as: `?lang=` URL param → saved choice (`localStorage`) → browser
language → English. The choice is persisted under the `cosous-lang` key.

- **Landing page** swaps text client-side from the `I18N` dictionary inside `index.html`.
- **Help / Legal** fetch `*.<lang>.json` and render into a shared per-language HTML shell.

### Adding a language

1. Add the language to the `<select id="langSelect">` options (landing, help, legal shells).
2. Landing page: add a block to the `I18N` object in `index.html` and extend
   `normalizeLang()` / the `documentElement.lang` map.
3. Help: add `help/faq.<lang>.json` and a `help/<lang>/index.html` (copy an existing one),
   then add the code to the `LANGS` array in `help/help.js`.
4. Legal: add `legal/legal.<lang>.json` and `legal/<lang>/{privacy,terms}.html`,
   then add the code to `LANGS` in `legal/legal.js`.
5. Add the new URLs to `sitemap.xml`.

## Styling

`assets/base.css` holds the shared design tokens (colors, fonts, shadow) plus the nav,
footer, and language picker. `help.css` and `legal.css` contain only page-specific rules
and load **after** base.css so they can override it. Change brand colors in one place:
the `:root` block of `assets/base.css` (the landing page keeps its own copy inline for
fast first paint — keep the two in sync).

## Icons — no emoji

**Never use emoji anywhere in the app or site.** Always use inline SVG instead.
Emoji render inconsistently across platforms and don't respect the brand palette.

- The landing page keeps its icons in the SVG sprite at the top of `index.html`
  (`<symbol id="ic-…">`), referenced with `<use href="#ic-…">`.
- The Help / Legal pages use inline SVGs in their shared markup.
- The auth pages carry their own inline icon set (`spinner`, `check`, `alert`,
  `key`, `mail`), swapped via `setAuthIcon(name, tone)` where `tone` is
  `info` | `success` | `error`. Add new status icons there, not as emoji.

SVG icons should use `fill:none; stroke:currentColor` so they inherit color, and a
`stroke-width` around `1.8`–`2.2` to match the existing line-icon style.

## Local preview

Any static server works, e.g.:

```sh
python3 -m http.server 8000
# then open http://localhost:8000/
```

A plain `file://` open also works for the landing page, but the Help/Legal pages use
`fetch()` for their JSON and therefore need to be served over HTTP.
