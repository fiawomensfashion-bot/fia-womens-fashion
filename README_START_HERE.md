# FIA Women's Fashion — Complete Catalogue & Store Pages Upgrade

**This upgrade was created from the repository ZIP provided on 12 November 2026.**

## What's in it

- **97 photographs**, automatically assigned to galleries for **27 linked colour listings** under 3 product designs:
  - Linen Palazzo: **20 colours / 49 photographs**
  - Swiss Cotton Palazzo: **4 colours / 28 photographs**
  - Swiss Cotton Skirt: **3 colours / 20 photographs**
- Every main colour and each additional colour appears on the product feed and is connected to the others.
- Product-specific sharable links such as `/p/FIA-SP-01/`, separate HTML social previews and basic structured data.
- Pages for About FIA, Delivery/COD, Returns/Replacement, Size Guide and Privacy, all editable via Pages CMS.
- Product image zoom, copy-product-link, smoother Load More and debounced search.
- Image build only processes images referenced in the product data. Creates 240px and 480px WebP files; the high-resolution original is copied **without recompression** to a versioned URL. Browser caches versioned files for 1 year.
- Both Cloudflare Pages and Netlify use the same `npm run build` / `dist` configuration.

## IMPORTANT: user facts and unfinished business details

- **Swiss Cotton Palazzo** has a `400` BDT price and a `500` BDT comparison price from the uploaded product data. **Check that the comparison price was actually a real previous selling price** before advertising a discount; if not, remove it in Pages CMS.
- **Linen Palazzo** and **Swiss Cotton Skirt** have **no verified price in the source**. They appear as **Ask for price** rather than invented values. Set them in Pages CMS before launch if available.
- Exact measurements, delivery fees, refund/return deadlines, availability for new colours and other binding policy terms were NOT provided. They remain unknown and should be confirmed before a public launch.
- The **official FIA logo image was not in the uploaded ZIP**. The site shows the existing text mark until you upload your actual logo through Pages CMS > FIA Shop Settings > Official FIA Logo Image. It will then be used as the site logo and favicon.
- Some filenames are generic generated-image names. Colour assignments were made from visible images and are **proposed**, not proof of actual item colour/stock. Review `docs/REVIEW_COLOUR_MATCHES.csv` against your real products before publishing.
- **This ZIP's image inventory is a snapshot.** Images added to GitHub after that ZIP was downloaded are NOT in this catalogue automatically. New colours or images need naming / grouping information, or Pages CMS updates.

## EASIEST WAY — update the existing GitHub repository WITHOUT reuploading images

1. Download the **FIA_Upgrade_Patch_No_Images.zip** file and extract it. Do NOT upload the ZIP directly to GitHub; GitHub does not automatically unpack archives.
2. Back up your repository / download ZIP before replacing files.
3. Use **GitHub Desktop** (simplest for many files) to clone your existing FIA repository. Copy the extracted PATCH CONTENTS into the repository's top-level folder, preserving the nested paths. Commit and push. Alternatively use GitHub Add file > Upload files or edit text files one by one, preserving the folder structure.
4. Replace/add these exact paths:
   - `index.html`
   - `assets/site.css` and `assets/site.js` (old root `site.css` and `site.js` can remain unused)
   - `scripts/build-catalogue.mjs` and `scripts/build-site.mjs`
   - `data/products.json`, `data/site-info.json`, `data/sizes.json`
   - `.pages.yml`, `_headers`, `package.json`, `netlify.toml`, `README_START_HERE.md`
   - `docs/REVIEW_COLOUR_MATCHES.csv`
   - `products.js` is a convenience generated file; the build will regenerate it
5. **Do not delete or change your existing `images/` folder**, `data/offers.json`, `data/settings.json` or your other CMS-generated images.
6. The patch ZIP includes `data/products.json`, **which is a complete replacement** for the two unfinished records in the supplied ZIP. If you've edited any products AFTER downloading the ZIP, back them up or merge the changes first; do not overwrite newer content blindly.

## Cloudflare Pages PREVIEW settings

- Framework: None
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: blank (Git repo root)
- Node.js: version 20 or higher

Optional environment variable `PUBLIC_SITE_URL` = your Cloudflare preview domain (e.g. `https://YOUR-PROJECT.pages.dev`) for canonical tags, social previews and sitemap. If omitted, the build tries `CF_PAGES_URL` automatically.

## Netlify settings if you choose FINAL hosting there

- The included `netlify.toml` defines `npm run build` and publishes `dist`.
- If your Netlify free account is running low on credits, **stop Netlify production builds while testing**. Deploying the final site and later catalog updates may still consume credits.
- When final Netlify URL is confirmed, configure environment variable `PUBLIC_SITE_URL` to your exact final public domain, including `https://`, with no trailing slash. In Netlify the build also tries `URL` automatically.

**Recommended:** You can keep Cloudflare Pages for production too. Your Pages CMS → GitHub → Cloudflare automatic update flow works without consuming Netlify production-deployment credits.

## How to check after deployment

1. The feed should have **27 listings**: 20 linen, 4 Swiss cotton palazzo and 3 Swiss cotton skirt. 12 shown first on small phones, 20 on desktop.
2. Click any listing: all colours for that main design should appear linked. Each colour has its own photo gallery.
3. Click **Zoom**, then Close. Click **Copy link to this colour**; the URL will be `/p/PRODUCT-CODE/`.
4. Visit `/about/`, `/delivery/`, `/returns/`, `/size-guide/`, and `/privacy/`.
5. Verify a shared individual product URL shows title + thumbnail in Facebook link preview (requires PUBLIC_SITE_URL and a live public website).
6. Confirm Messenger orders reach the correct FIA Facebook account and verify wording before telling customers the order is complete.
7. Open Chrome Developer Tools → Network, tick Disable cache, reload on mobile viewport and check transferred bytes. Check subsequent load with cache enabled. No live traffic benchmark was performed in this local build.

## Cache / security / customer data

- `_headers` adds CSP, frame restrictions, content type protections and browser caching for `/assets/*` and `/images/optimized/*`.
- `products.js`, `image-manifest.js`, and HTML pages are configured to revalidate so price updates are not locked for a year.
- The website is a static catalogue. It does **not** create visitor accounts, store customer orders, or secretly collect customer phone numbers. Browser image caching is not the same as tracking people.
- Keep credentials, customer addresses/orders, personal phone numbers and supplier financial records out of the public repository. Enable 2FA on GitHub/hosting.

## Build on your computer

Requires Node 20+: run `npm install` then `npm run build`. Open the published output from `dist/` via a local HTTP server, not by double-clicking an HTML file. Sharp is the only third-party build dependency.

## What remains to finish

Fill real prices for linen/skirt, actual garment measurements, definitive stock status, actual delivery charges, verified offer/return terms, and the official FIA logo image. Don't use an imaginary logo or invented prices in a customer-facing catalogue.
