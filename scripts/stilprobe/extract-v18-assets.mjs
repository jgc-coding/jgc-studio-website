#!/usr/bin/env node
/**
 * extract-v18-assets.mjs
 *
 * Liest die Live-Hauptseiten-Variante (variants/standalone/18-lumen/index.html,
 * ein self-contained Single-File-HTML mit Inline-base64-Fonts/-Bildern) und
 * extrahiert die Design-Bausteine, die die Stilprobe-Unterseite braucht, um
 * optisch 1:1 zur Hauptseite zu passen:
 *
 *   a) das komplette CSS aller <style>-Blöcke (Basis-Tailwind-CSS inkl.
 *      @font-face-Deklarationen + Skin-CSS), 1:1 und in Original-Reihenfolge
 *      konkateniert
 *   b) die Favicon-data-URI aus <link rel="icon" ...>
 *   c) die Header-Logo-<img>-src-data-URI (das <img> im <header>)
 *   d) die Footer-Logo-<img>-src-data-URI (das <img> im <footer>)
 *
 * Schreibt das Ergebnis als JSON in den Scratchpad. Ein separater
 * Assemble-Schritt (nicht Teil dieses Skripts) liest dieses JSON, setzt die
 * Werte in ein HTML-Template ein und schreibt stilprobe/index.html.
 *
 * WICHTIG: Dieses Skript liest die V18-Datei nur als Text (nie mit dem
 * Read-Tool öffnen — die Inline-base64-Blobs sprengen jedes Editor-Fenster).
 *
 * Aufruf (vom Repo-Root):
 *   node scripts/stilprobe/extract-v18-assets.mjs [V18_PATH] [OUT_PATH]
 *
 * Defaults:
 *   V18_PATH = variants/standalone/18-lumen/index.html
 *   OUT_PATH = <Scratchpad>/v18-assets.json
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

const V18_PATH = process.argv[2] || join('variants', 'standalone', '18-lumen', 'index.html');

const SCRATCHPAD =
  'C:\\Users\\chime\\AppData\\Local\\Temp\\claude\\C--Projekte-JGC-Studio--claude-worktrees-stilprobe-automation-website-af3a9a\\0303bfe3-a1b1-40c7-9bc4-c45e29cd21cb\\scratchpad';

const OUT_PATH = process.argv[3] || join(SCRATCHPAD, 'v18-assets.json');

function fmt(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function fail(message) {
  console.error(`FEHLER: ${message}`);
  process.exit(1);
}

function extractFirstImgSrc(html, openTag, closeTag, label) {
  const start = html.indexOf(openTag);
  if (start === -1) fail(`Kein ${openTag}-Tag in der V18-Datei gefunden.`);
  const end = html.indexOf(closeTag, start);
  if (end === -1) fail(`Kein schließendes ${closeTag}-Tag in der V18-Datei gefunden.`);
  const slice = html.slice(start, end);
  const imgMatch = slice.match(/<img[^>]*\ssrc="(data:[^"]+)"/);
  if (!imgMatch) fail(`Kein <img src="data:..."> im ${label}-Bereich gefunden.`);
  return imgMatch[1];
}

async function main() {
  if (!existsSync(V18_PATH)) {
    fail(`V18-Quelldatei nicht gefunden: ${V18_PATH}`);
  }

  const html = await readFile(V18_PATH, 'utf8');
  console.log(`Gelesen: ${V18_PATH} (${fmt(html.length)} Zeichen)`);

  // a) Alle <style>...</style>-Blöcke 1:1 extrahieren, Reihenfolge erhalten,
  //    konkatenieren. Kein Risiko durch die base64-Blobs in @font-face-Regeln:
  //    base64 kennt kein "<", daher kann kein Blob ein vorzeitiges </style>
  //    vortäuschen.
  const styleBlocks = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]);
  if (styleBlocks.length === 0) {
    fail('Kein <style>-Block in der V18-Datei gefunden.');
  }
  const css = styleBlocks.join('\n');
  const fontFaceCount = (css.match(/@font-face/g) || []).length;
  console.log(
    `Style-Blöcke: ${styleBlocks.length}, CSS gesamt: ${fmt(css.length)} Zeichen, @font-face-Regeln: ${fontFaceCount}`
  );
  if (css.length <= 50000) {
    fail(`CSS zu kurz (${css.length} Zeichen, erwartet > 50.000). Extraktion vermutlich fehlgeschlagen.`);
  }
  if (fontFaceCount < 13) {
    fail(`Zu wenige @font-face-Regeln (${fontFaceCount}, erwartet >= 13). Extraktion vermutlich fehlgeschlagen.`);
  }

  // b) Favicon-href (data:-URI) aus <link rel="icon" ...>
  const faviconMatch = html.match(/<link\s+rel="icon"[^>]*href="(data:[^"]+)"/);
  if (!faviconMatch) {
    fail('Kein <link rel="icon" ... href="data:..."> gefunden.');
  }
  const favicon = faviconMatch[1];
  console.log(`Favicon-URI: ${fmt(favicon.length)} Zeichen`);

  // c) Header-Logo-<img>-src (das <img> im <header>)
  const headerLogo = extractFirstImgSrc(html, '<header', '</header>', 'Header');
  console.log(`Header-Logo-URI: ${fmt(headerLogo.length)} Zeichen`);

  // d) Footer-Logo-<img>-src (das <img> im <footer>)
  const footerLogo = extractFirstImgSrc(html, '<footer', '</footer>', 'Footer');
  console.log(`Footer-Logo-URI: ${fmt(footerLogo.length)} Zeichen`);

  const out = { css, favicon, headerLogo, footerLogo };

  await mkdir(dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, JSON.stringify(out), 'utf8');
  console.log(`✓ Geschrieben: ${OUT_PATH}`);
}

main().catch((err) => {
  console.error('Extraktion fehlgeschlagen:', err);
  process.exit(1);
});
