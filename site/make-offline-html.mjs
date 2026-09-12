// Erzeugt aus dem Astro-Build (dist/index.html) eine einzige, in sich
// geschlossene HTML-Datei: CSS, Schriften (woff2), JS und Bilder werden
// als Data-URIs eingebettet. Das Hero-Foto wird per sharp zu JPEG verkleinert.
//
// Aufruf (im Ordner site/):  node make-offline-html.mjs
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const dist = 'dist';
const out = '../JGC-Studio-Variante-09.html';

let html = readFileSync(join(dist, 'index.html'), 'utf8');

const fontMime = (p) => (p.endsWith('.woff2') ? 'font/woff2' : 'font/woff');
const rel = (p) => join(dist, p.replace(/^\//, ''));

// 1) <link rel="stylesheet" href="/_astro/x.css"> -> <style>…</style>,
//    darin url(/_astro/*.woff2) als Data-URI einbetten.
html = html.replace(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g, (m, href) => {
  if (!/_astro\//.test(href)) return m;
  let css = readFileSync(rel(href), 'utf8');
  css = css.replace(/url\((['"]?)([^)'"]*_astro\/[^)'"]+\.woff2?)\1\)/g, (mm, q, p) => {
    const buf = readFileSync(rel(p));
    return `url("data:${fontMime(p)};base64,${buf.toString('base64')}")`;
  });
  return `<style>${css}</style>`;
});

// 2) Externe Modul-Skripte einbetten (falls vorhanden).
html = html.replace(/<script([^>]*)\ssrc="([^"]+)"([^>]*)><\/script>/g, (m, pre, src, post) => {
  if (!/_astro\//.test(src)) return m;
  const js = readFileSync(rel(src), 'utf8');
  return `<script${pre}${post}>${js}</script>`;
});

// 3) Favicon (SVG) inline.
html = html.replace(/href="(\/favicon\.svg)"/g, (m, p) => {
  const svg = readFileSync(rel(p));
  return `href="data:image/svg+xml;base64,${svg.toString('base64')}"`;
});

// 4) Logo (PNG, Transparenz nötig) inline – beide Vorkommen (Nav + Footer).
const logoBuf = readFileSync(rel('/images/logo-sigel.png'));
const logoUri = `data:image/png;base64,${logoBuf.toString('base64')}`;
html = html.replace(/src="\/images\/logo-sigel\.png"/g, `src="${logoUri}"`);

// 5) og:image / twitter:image entfernen (zeigen auf localhost, offline irrelevant).
html = html.replace(/\s*<meta property="og:image"[^>]*>/g, '');
html = html.replace(/\s*<meta name="twitter:image"[^>]*>/g, '');

// 6) Hero-Foto -> JPEG (max 1920px), inline.
const heroJpeg = await sharp(rel('/images/hero-placeholder.png'))
  .resize({ width: 1920, withoutEnlargement: true })
  .jpeg({ quality: 82, mozjpeg: true })
  .toBuffer();
const heroUri = `data:image/jpeg;base64,${heroJpeg.toString('base64')}`;
html = html.replace(/src="\/images\/hero-placeholder\.png"/g, `src="${heroUri}"`);

writeFileSync(out, html, 'utf8');

const kb = (n) => (n / 1024).toFixed(0) + ' KB';
console.log('geschrieben:', out);
console.log('Größe:', kb(statSync(out).size));
console.log('Hero JPEG:', kb(heroJpeg.length), '(vorher PNG', kb(statSync(rel('/images/hero-placeholder.png')).size) + ')');
// Sanity: keine verbleibenden lokalen Asset-Refs mehr?
const leftovers = (html.match(/(href|src)="\/(_astro|images|favicon)[^"]*"/g) || []);
console.log('verbleibende lokale Refs:', leftovers.length ? leftovers : 'keine');
