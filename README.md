# Fia — Fashion & Accessories Catalogue

A browse-only catalogue website for **Fia**, a women's fashion and accessories shop. Visitors browse products and prices, then order by tapping **Order on Messenger**. This opens your Facebook Page in Messenger and copies a ready-made order message, for example:

> Hi Fia, I would like to order: Rose Blush Embroidered Kurti (Code FIA-101, ৳2,450)

It uses plain HTML, CSS and JavaScript. There is no framework, no build step, no database and no login.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The whole website: design, pages and logic. You normally don't need to edit it. |
| `products.js` | **Your shop content**: settings, offers and products. Edit this file. |
| `images/` | Product photos. See `images/README.txt` for photo sizes. |
| `netlify.toml` | Netlify hosting settings. |

## First-time setup

1. Open `products.js`.
2. In `SETTINGS`, change `messengerPage` to your Facebook Page username (the part after `facebook.com/`).
3. Optional: change `tagline` and `footerNote`, and set `theme` to `"rose"`, `"peach"` or `"mauve"`.
4. Save and redeploy.

## How to add a product

1. **Copy a product block.** In `products.js`, copy one whole product from `{` to `},` and paste it below the last product. Give it a new, unique `id` (for example `"FIA-105"`), then change the name, category, price, description and details.
2. **Put the photos in `/images`.** Resize them to about 1000 px wide and under 300 KB. List the file names in `images: [...]`, typed exactly as they are written in the folder.
3. **Save** the file.
4. **Redeploy.** Upload the folder to Netlify again (drag and drop it on the Deploys page), or push your change if the site is connected to Git.

Tips:
- Set `oldPrice` to show a crossed-out price and a "% off" badge. Use `null` when there's no discount.
- Set `inStock: false` to show "Sold out" and disable the order button.
- Set `featured: true` to show a product first.
- A new `category` name creates a new tab automatically.
- Offers with an `ends` date (`"YYYY-MM-DD"`) hide by themselves after that day.

## Run it locally

Open `index.html` in a browser, or serve the folder with any static server, for example `npx serve .`. When the site is on Netlify, photos are resized automatically by Netlify Image CDN. Locally, the original photo files are used.
