// FIA production build for Cloudflare Pages and Netlify.
// Uses already-compressed originals as full-resolution images, and makes only
// two smaller variants for display. Only catalogue-referenced photos are built.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const sharp = require('sharp');
const base = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(base, 'dist');
const images = path.join(base, 'images');
const products = JSON.parse(await fs.readFile(path.join(base,'.fia-generated-products.json'),'utf8'));
const settings = JSON.parse(await fs.readFile(path.join(base,'data/settings.json'),'utf8'));
const shopInfo = JSON.parse(await fs.readFile(path.join(base,'data/site-info.json'),'utf8'));
const sizes = JSON.parse(await fs.readFile(path.join(base,'data/sizes.json'),'utf8'));
const origin = String(process.env.PUBLIC_SITE_URL || process.env.CF_PAGES_URL || process.env.URL || '').replace(/\/+$/,'');
const safeOrigin = /^https:\/\/[^/\s]+$/i.test(origin) ? origin : '';
const imageExtensions = /\.(?:webp|png|jpe?g|avif)$/i;
const contentHash = bytes => crypto.createHash('sha256').update(bytes).digest('hex').slice(0,12);
const escapeHtml = value => String(value??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const encodeSegments = pathName => pathName.split('/').map(encodeURIComponent).join('/');
const normaliseImage = img => {
  if (typeof img !== 'string') return null;
  const s=img.trim().replace(/^\/?images\//,'').replace(/^\/+/, '');
  if (!s || s.includes('\\') || s.split('/').some(p=>p==='..'||p==='.'||!p)) return null;
  return s;
};
const selected = new Set();
for (const p of products) for (const img of (p.images || [])) {
  const file=normaliseImage(img);
  if (file) selected.add(file);
}
const logo=normaliseImage(settings.logo);
if (logo) selected.add(logo);
await fs.rm(dist,{recursive:true,force:true});
await fs.mkdir(path.join(dist,'assets'),{recursive:true});
await fs.mkdir(path.join(dist,'images','optimized'),{recursive:true});
await fs.copyFile(path.join(base,'products.js'),path.join(dist,'products.js'));
await fs.copyFile(path.join(base,'_headers'),path.join(dist,'_headers'));
const template = await fs.readFile(path.join(base,'index.html'),'utf8');
let homepage = template;
for (const ext of ['css','js']) {
  const bytes=await fs.readFile(path.join(base,'assets',`site.${ext}`));
  const hashed=`site.${contentHash(bytes)}.${ext}`;
  await fs.writeFile(path.join(dist,'assets',hashed),bytes);
  homepage=homepage.replace(`/assets/site.${ext}`,`/assets/${hashed}`);
}
const makeSrc = rel => '/images/'+encodeSegments(rel);
const manifest=Object.create(null);
let originalsBytes=0, generatedBytes=0, converted=0, missing=0;
const paths=[...selected].sort();
// Bounded concurrency speeds up Cloudflare builds without excessive memory.
const workers=4;
let next=0;
async function processPhoto(rel) {
  const source=path.join(images,...rel.split('/'));
  if (!path.resolve(source).startsWith(path.resolve(images)+path.sep)) throw new Error('Unsafe image path');
  let raw;
  try { raw=await fs.readFile(source); } catch(e) { console.warn('MISSING PHOTO:',rel); missing++; return; }
  const dest=path.join(dist,'images',...rel.split('/'));
  await fs.mkdir(path.dirname(dest),{recursive:true});
  await fs.copyFile(source,dest);
  originalsBytes+=raw.length;
  if (!imageExtensions.test(rel)) return;
  try {
    const meta=await sharp(raw).metadata();
    const uprightWidth=meta.orientation>=5&&meta.orientation<=8?meta.height:meta.width;
    if (!uprightWidth) throw Error('Missing image dimensions');
    const list=[];
    // Keep original WebP unchanged (already ~100 KB). Produce small card sizes.
    for (const size of [240,480]) {
      if (size>=uprightWidth) continue;
      const outputRel=`images/optimized/${rel.replace(/\.[^.]+$/, '')}.${contentHash(raw)}.w${size}.webp`;
      const outputFile=path.join(dist,...outputRel.split('/'));
      await fs.mkdir(path.dirname(outputFile),{recursive:true});
      const result=await sharp(raw).rotate().resize({width:size,withoutEnlargement:true})
        .toColourspace('srgb').webp({quality:size===240?72:80,effort:1}).toFile(outputFile);
      generatedBytes+=result.size;
      list.push({w:result.width,src:outputRel});
    }
    // Use an immutable, content-hashed COPY of the original image as the
    // largest srcset candidate; do not recompress the already-optimised file.
    const originalRel=`images/optimized/${rel.replace(/\.[^.]+$/, '')}.${contentHash(raw)}.original${path.extname(rel)}`;
    const originalCopy=path.join(dist,...originalRel.split('/'));
    await fs.mkdir(path.dirname(originalCopy),{recursive:true});
    await fs.copyFile(source,originalCopy);
    list.push({w:uprightWidth,src:originalRel});
    list.sort((a,b)=>a.w-b.w);
    manifest[rel]=list;
    converted++;
  } catch(e) { console.warn('Image optimization skipped:',rel,e.message); }
}
await Promise.all(Array.from({length:workers},async()=>{
  while(next<paths.length) { const i=next++; await processPhoto(paths[i]); }
}));
await fs.writeFile(path.join(dist,'image-manifest.js'),
  '/* Generated FIA responsive images. No visitor tracking. */\nwindow.FIA_IMAGE_MANIFEST = '+JSON.stringify(manifest)+';\n');

const absolute=(suffix)=>safeOrigin+suffix;
const mainDescription="FIA Women's Fashion linen palazzos, Swiss cotton palazzos and skirts. Browse individual colours and order through Messenger.";
const replaceMeta=(html,title,description,imageUrl,url,type='website')=>{
  let out=html;
  out=out.replace(/<title>[\s\S]*?<\/title>/,`<title>${escapeHtml(title)}</title>`);
  out=out.replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${escapeHtml(description)}">`);
  out=out.replace(/<meta property="og:title" content="[^"]*">/,`<meta property="og:title" content="${escapeHtml(title)}">`);
  out=out.replace(/<meta property="og:description" content="[^"]*">/,`<meta property="og:description" content="${escapeHtml(description)}">`);
  out=out.replace(/<meta property="og:type" content="[^"]*">/,`<meta property="og:type" content="${escapeHtml(type)}">`);
  const tags=[];
  if (imageUrl) tags.push(`<meta property="og:image" content="${escapeHtml(imageUrl)}">`);
  if (url) { tags.push(`<meta property="og:url" content="${escapeHtml(url)}">`); tags.push(`<link rel="canonical" href="${escapeHtml(url)}">`); }
  out=out.replace('</head>',tags.join('\n  ')+'\n</head>');
  return out;
};
const homepageHtml=replaceMeta(homepage, "FIA Women's Fashion — Palazzos & Skirts",mainDescription, '',safeOrigin?safeOrigin+'/':'');
await fs.writeFile(path.join(dist,'index.html'),homepageHtml);
const infoPages={
  about:['About FIA',shopInfo.about], delivery:['Delivery & Cash on Delivery',shopInfo.delivery],
  returns:['Returns & Replacements',shopInfo.returns], privacy:['Privacy',shopInfo.privacy],
  'size-guide':['Size Guide',shopInfo.sizeIntro]
};
for (const [route,[title,text]] of Object.entries(infoPages)) {
  const url=safeOrigin?absolute(`/${route}/`):'';
  const page=replaceMeta(homepage,title+" — FIA Women's Fashion",String(text||'').slice(0,210),'',url);
  const built=page.replace('<main id="app" tabindex="-1"></main>',
    `<main id="app" tabindex="-1"><article class="wrap"><h1>${escapeHtml(title)}</h1><p>${escapeHtml(text)}</p></article></main>`);
  const file=path.join(dist,route,'index.html');await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,built);
}
for (const product of products) {
  const id=String(product.id);
  // Product ids are public URL segments and local directories: validate strictly.
  if (!/^[a-zA-Z0-9_-]{1,80}$/.test(id)) throw new Error('Unsafe product ID: '+id);
  const route=`/p/${encodeURIComponent(id)}/`;
  const url=safeOrigin?absolute(route):'';
  const first=(product.images||[]).map(normaliseImage).filter(Boolean)[0];
  const firstPath=first?makeSrc(first):'';
  const firstAbs=first && safeOrigin?absolute(firstPath):'';
  const description=String(product.description||`Explore ${product.name} at FIA Women's Fashion.`).replace(/\s+/g,' ').slice(0,260);
  const title=String(product.name)+" — FIA Women's Fashion";
  const productPage=replaceMeta(homepage,title,description,firstAbs,url,'product');
  const stock=product.inStock === true ? 'InStock' : product.inStock===false ? 'OutOfStock' : '';
  const offer={ '@type':'Offer', priceCurrency:'BDT', price:product.price, url:url || undefined, availability:stock?'https://schema.org/'+stock:undefined };
  const jsonLd={ '@context':'https://schema.org', '@type':'Product', name:product.name, sku:id, description, image:firstAbs || undefined, offers:product.price==null?undefined:offer };
  const ld=JSON.stringify(jsonLd).replace(/</g,'\\u003c');
  const fallback=`<main id="app" tabindex="-1"><article class="wrap"><h1>${escapeHtml(product.name)}</h1><p>${escapeHtml(description)}</p>${firstPath?`<img width="500" loading="lazy" src="${escapeHtml(firstPath)}" alt="${escapeHtml(product.name)}">`:''}<p><a href="/#/">Browse all FIA colours</a></p></article></main>`;
  const html=productPage.replace('</head>',`<script type="application/ld+json">${ld}</script>\n</head>`)
    .replace('<main id="app" tabindex="-1"></main>', fallback);
  const file=path.join(dist,'p',id,'index.html');
  await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,html);
}
const sitemapLinks=['/',...Object.keys(infoPages).map(p=>'/'+p+'/'),...products.map(p=>`/p/${encodeURIComponent(p.id)}/`)];
if (safeOrigin) await fs.writeFile(path.join(dist,'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+
  sitemapLinks.map(p=>'<url><loc>'+escapeHtml(absolute(p))+'</loc></url>').join('')+'</urlset>');
await fs.writeFile(path.join(dist,'robots.txt'),`User-agent: *\nAllow: /\n${safeOrigin?'Sitemap: '+absolute('/sitemap.xml')+'\n':''}`);
console.log(`FIA generated: ${products.length} linked product pages, ${Object.keys(infoPages).length} store pages, ${converted} optimized image sets, ${missing} missing image(s).`);
console.log(`Originals: ${(originalsBytes/1024/1024).toFixed(2)} MiB; new small image variants: ${(generatedBytes/1024/1024).toFixed(2)} MiB.`);
if (!safeOrigin) console.warn('For full Facebook previews and sitemap: set PUBLIC_SITE_URL to your final public https:// domain.');
