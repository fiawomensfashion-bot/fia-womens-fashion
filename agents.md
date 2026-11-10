# AGENTS.md — Fia catalogue

## What this is
A static, browse-only catalogue for the Fia women's fashion shop. Hard constraints from the owner: plain HTML/CSS/JS only, no framework, no build step, no backend, no database, no login, and all content in `products.js`. Do not add tooling, a package.json or a bundler.

## Structure
- `index.html`: all CSS (in `<style>`) and all app JS (one IIFE in an inline `<script>`). It loads `products.js` first.
- `products.js`: the global consts `SETTINGS`, `OFFERS` and `PRODUCTS`. The non-technical owner edits this file, so keep its comments thorough and its shape stable. If you add a field, document it in the header comment and make the app tolerate it being missing.
- `images/`: product photos (about 1000 px wide, under 300 KB). `images/README.txt` is guidance for the owner.
- `netlify.toml`: publishes `.` with no build command, and turns off caching for `index.html` and `products.js`.

## Key behaviours and decisions
- Hash routing: `#/`, `#/offers` (home, scrolled to offers), `#/category/<slug>` and `#/product/<id>`. Category slugs come from the `category` field.
- Products are sorted with `featured` first; otherwise file order is kept.
- All data from `products.js` goes through `esc()` before it is inserted into the page as HTML. Keep it that way.
- Images: on http(s) hosts other than localhost, `<img>` uses Netlify Image CDN (`/.netlify/images?url=/images/...&fm=webp`). A capturing `error` listener first retries the original file, then swaps in a `.ph` placeholder showing the product's first letter.
- Order button: an `<a target="_blank">` to `https://m.me/<messengerPage>`. Its click handler copies the order message (it tries `execCommand` synchronously first, then the Clipboard API). If both fail, the toast shows the message so the customer can copy it by hand.
- Themes: `SETTINGS.theme` sets `data-theme` on `<html>`. Palettes are the CSS variables at the top of the `<style>` block. `--accent-ink` is a darker accent used for small text, for contrast.
- Offers hide after the end of their `ends` day, in the visitor's local time.
- Accessibility: visible `:focus-visible` outlines, a skip link, `prefers-reduced-motion` support and body text of 17px or larger.
