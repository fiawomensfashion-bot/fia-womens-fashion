// FIA static build: responsive WebP image sizes, hashed assets and security headers.
// Run AFTER scripts/build-catalogue.mjs (which preserves main/colour listings).
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  throw new Error('Missing Sharp image optimiser. Cloudflare should run npm install automatically because package.json is included. Original error: ' + e.message);
}
const base = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(base, 'dist');
const sourceImages = path.join(base, 'images');
const targets = [
  { width: 160, quality: 73 },  // gallery thumbnails
  { width: 400, quality: 79 },  // phone feed cards
  { width: 800, quality: 83 },  // desktop feed cards / retina phones
  { width: 1200, quality: 88 }  // full details & fabric close-ups
];

function contentHash(bytes) { return crypto.createHash('sha256').update(bytes).digest('hex').slice(0, 12); }
async function fileExists(name) {
  try { await fs.access(name); return true; } catch (_) { return false; }
}
async function * walk(dir, relative = '') {
  if (!(await fileExists(dir))) return;
  const entries = await fs.readdir(dir, { withFileTypes: true });
  entries.sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const rel = path.join(relative, entry.name);
    if (entry.isDirectory()) yield* walk(path.join(dir, entry.name), rel);
    else if (entry.isFile()) yield rel;
    // Deliberately skip symlinks; never allow arbitrary links to be published.
  }
}

// Only the public outputs are deployed: no data/ source files, config, passwords, or source maps.
await fs.rm(dist, { recursive: true, force: true });
await fs.mkdir(path.join(dist, 'assets'), { recursive: true });
await fs.mkdir(path.join(dist, 'images', 'optimized'), { recursive: true });
await fs.copyFile(path.join(base, 'products.js'), path.join(dist, 'products.js'));
await fs.copyFile(path.join(base, '_headers'), path.join(dist, '_headers'));
const indexSource = await fs.readFile(path.join(base, 'index.html'), 'utf8');
let index = indexSource;
for (const [name, ext] of [['site','css'], ['site','js']]) {
  const input = path.join(base, 'assets', `${name}.${ext}`);
  const bytes = await fs.readFile(input);
  const hash = contentHash(bytes);
  const destName = `${name}.${hash}.${ext}`;
  await fs.writeFile(path.join(dist, 'assets', destName), bytes);
  const from = `${name}.${ext}`;
  index = index.replace(`assets/${from}`, `assets/${destName}`);
}
if (!index.includes('image-manifest.js') || index.includes('src="assets/site.js"') || index.includes('href="assets/site.css"')) {
  throw new Error('index.html is missing expected FIA script/style references.');
}
await fs.writeFile(path.join(dist, 'index.html'), index);

let originalsBytes = 0;
let optimizedBytes = 0;
let imagesConverted = 0;
let imagesFallback = 0;
const manifest = Object.create(null);
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tif', '.tiff']);
const copyOriginal = async (rel) => {
  const target = path.join(dist, 'images', rel);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.copyFile(path.join(sourceImages, rel), target);
  imagesFallback++;
};

for await (const rel of walk(sourceImages)) {
  // Prevent copying an old generated image folder from the Git repo.
  if (rel.split(path.sep)[0] === 'optimized') continue;
  const input = path.join(sourceImages, rel);
  const key = rel.split(path.sep).join('/');
  const ext = path.extname(rel).toLowerCase();
  if (!imageExtensions.has(ext)) {
    await copyOriginal(rel); // Keep SVG/GIF/favicon or other assets unchanged.
    continue;
  }
  try {
    const raw = await fs.readFile(input);
    const hash = contentHash(raw);
    const meta = await sharp(raw, { limitInputPixels: 150e6 }).metadata();
    if (!meta.width || !meta.height) throw new Error('Missing image dimensions');
    const uprightWidth = meta.orientation >= 5 && meta.orientation <= 8 ? meta.height : meta.width;
    originalsBytes += raw.length;
    const seen = new Set();
    const versions = [];
    for (const target of targets) {
      const actualWidth = Math.min(target.width, uprightWidth);
      if (seen.has(actualWidth)) continue;
      seen.add(actualWidth);
      const filename = `${path.parse(rel).name}.${hash}.w${actualWidth}.webp`;
      const relativeOutput = path.posix.join('images', 'optimized', path.dirname(rel).split(path.sep).join('/'), filename);
      const outputFile = path.join(dist, ...relativeOutput.split('/'));
      await fs.mkdir(path.dirname(outputFile), { recursive: true });
      const info = await sharp(raw, { limitInputPixels: 150e6 })
        .rotate()
        .resize({ width: actualWidth, withoutEnlargement: true })
        .toColourspace('srgb')
        .webp({ quality: target.quality, effort: 4 })
        .toFile(outputFile);
      optimizedBytes += info.size;
      versions.push({ w: info.width, src: relativeOutput });
    }
    versions.sort((a, b) => a.w - b.w);
    manifest[key] = versions;
    imagesConverted++;
  } catch (error) {
    console.warn('Could not optimise image; original retained:', key, error.message);
    await copyOriginal(rel);
  }
}
const payload = '/* GENERATED by FIA build; no customer tracking. */\nwindow.FIA_IMAGE_MANIFEST = ' + JSON.stringify(manifest) + ';\n';
await fs.writeFile(path.join(dist, 'image-manifest.js'), payload);
console.log(`FIA site built: ${imagesConverted} photos converted to responsive WebP; ${imagesFallback} other/failed assets retained.`);
console.log(`Source photo bytes: ${(originalsBytes/1024/1024).toFixed(1)} MiB. Optimised WebP variants (all sizes together): ${(optimizedBytes/1024/1024).toFixed(1)} MiB.`);
console.log('Published only dist/: index.html, products.js, image-manifest.js, assets/, images/, and _headers.');
