# FIA CMS Upgrade — Keep Your Existing Netlify Design

## What this download contains

It supplies an editor configuration (`.pages.yml`), public catalogue data (`data/`), a build script (`scripts/`), and `products.js` in **the exact format used by the index.html you shared**.

**It does NOT contain your `index.html` or your actual product images. Do NOT deploy this ZIP by itself.** Merge it into a complete backup of your existing website folder before deploying.

## What's fixed

- Your current `products.js` contains four unrelated SAMPLE items (kurti, maxi dress, earrings and tote bag). These are not FIA stock and were deliberately not copied into the new catalogue.
- Outdated sales were replaced with your three FIA offers/assurances.
- `messengerPage` is currently `fiawomensfashion` because that is in the uploaded file. This username is NOT independently verified. Open https://m.me/fiawomensfashion and confirm it reaches YOUR Page before launching.
- Product catalogue starts empty, so no imaginary prices, measurements, photos or inventory are published.
- Your existing `index.html` and its look are retained. No CSS/HTML overhaul is necessary.

## BEFORE YOU BEGIN: Backup!

1. In Netlify, open your existing FIA project's latest successful deploy and download its files (or use your original ZIP).
2. Extract the existing site into a working folder. It should contain `index.html`, `products.js`, and `images/` (if you had images).
3. Make a second backup folder that will remain untouched.

## Step 1: Merge this upgrade

1. Extract this ZIP somewhere else.
2. Copy the following into your existing site's working folder: `.pages.yml`, `data/`, `scripts/`, `netlify.toml`, and `products.js`. Replace the old `products.js` after backing it up.
3. Leave your **existing `index.html` unchanged**.
4. Keep any preexisting `images/` folder and its files. Merge folders; don't delete real images.
5. The `data/products.json` file is intentionally `[]`. Adding a real product through Pages CMS is next.

## Step 2: Put complete website in GitHub

Option A: In your EXISTING Netlify project, Project configuration → Developer settings → Continuous deployment → Repository → Push to new repository (if offered). This creates a GitHub repository from current deployed files. **Then upload/merge the upgrade files into that repository**.

Option B: Create a new private GitHub repository, upload your **complete merged website folder** (index.html, products.js, images, data, scripts, .pages.yml, netlify.toml), then link it to your EXISTING Netlify site via Project configuration → Developer settings → Continuous deployment → Repository → Link repository.

NOTE: Upload a folder's extracted contents. Uploading just this ZIP as one GitHub file will NOT unzip/install it.

## Step 3: Check Netlify's build settings

For a simple static HTML site, in Netlify verify:

- Build command: `node scripts/build-catalogue.mjs`
- Publish directory: `.` (project root)
- Base directory: blank (root)

`netlify.toml` sets the first two automatically if this is the site structure. You should see in your deploy log: `Generated products.js with 0 product(s), 3 offer(s).`

Your existing Netlify site URL should remain the same if you linked this repository to the existing project. Don't create another Netlify site unless you intend to.

## Step 4: Open the actual free admin dashboard

1. Visit https://app.pagescms.org/
2. Sign in with GitHub.
3. Install/authorize the Pages CMS GitHub App for ONLY your FIA repository if offered.
4. Open the FIA repository. It should find `.pages.yml` at its root.
5. You should now see `FIA Products`, `FIA Offers & Guarantees`, and `FIA Shop Settings`.

## Step 5: Add real products

1. Open `FIA Products` and choose to add a new item.
2. Set a unique code, name, collection, real price, real photos, material, verified size, colours and design details.
3. Toggle `In Stock` ON **only when you are accepting orders**.
4. Save/commit.
5. Pages CMS writes to `data/products.json` and `images/` in GitHub. Netlify then builds a new `products.js` and publishes automatically.
6. Refresh your existing FIA website and test the category, photo gallery and Messenger button.

## Step 6: Messenger button

Go to `FIA Shop Settings` and set `messengerPage` to ONLY the Page username, e.g. `fiawomensfashion`, NOT the full `https://m.me/` URL. The index.html automatically adds `https://m.me/`. Test the live URL on your phone before promoting.

When a customer clicks Order, the existing code tries to copy the item's name, code and price and opens Messenger. They must paste and send the copied message themselves.

## Step 7: Edit offers / policies

Open `FIA Offers & Guarantees` to edit:
- Buy any 3 Swiss Cotton Palazzos → 1 Normal Palazzo free
- Buy 3 Normal Palazzos → free delivery
- Quality guarantee + free replacement for wrong/defective products, subject to published policy

Be clear about whether the normal palazzo is the linen model, which colours are included, shipping coverage and any offer exclusions. Do not make claims you cannot fulfil.

## Troubleshooting

**The website shows the OLD products:** Make sure you linked the correct GitHub repo to the existing Netlify project, deploy succeeded, and Netlify built the latest commit. Inspect the Netlify deploy log for the build command.

**Pages CMS doesn't see the config:** `.pages.yml` must be at the root of the selected branch. The GitHub App must have repo access.

**Images missing:** Images selected in Pages CMS should be saved under `images/`. Build script removes `/images/` from image values because the original site adds the folder itself. Check names and letter case.

**No products appear:** `data/products.json` starts empty; add a real item with a valid price greater than zero. The builder skips incomplete entries.

**Order opens the wrong Page:** Verify `messengerPage` at https://m.me/YOURUSERNAME.

**Site breaks after linking Git:** Check that `index.html` is at repository root, not inside the upgrade ZIP or a nested folder. Root publish folder `.` assumes this.

**Netlify credit limits:** Free hosting and Pages CMS are subject to their respective plan usage limits. You do NOT need WooCommerce, paid WordPress hosting, or an online payment gateway for this setup.

## Security

Store ONLY public catalogue content in this repository. Do not put customer phone numbers, addresses, orders, supplier costs, passwords, or private data into website files. Protect your GitHub and Netlify accounts using strong authentication.
