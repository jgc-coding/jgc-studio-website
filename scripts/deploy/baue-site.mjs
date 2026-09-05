#!/usr/bin/env node
/**
 * baue-site.mjs — setzt das Deploy-Ergebnis zusammen: die Anordnung, die unter
 * jgc-lumen.de liegt. Laeuft im GitHub-Workflow UND lokal, damit sich genau das
 * Ergebnis vor dem Push ansehen laesst:
 *
 *   node scripts/deploy/baue-site.mjs _site
 *   node scripts/der-weg/server.mjs 4331 _site      (launch.json "site-vorschau")
 *   node scripts/pruefe-seiten.mjs _site
 *
 * Anordnung (seit 02.09.2026 — die Scroll-Reise ist die einzige Fassung):
 *   /                 der-weg/ komplett: index.html, drei Skripte, assets/
 *   /stilprobe/       stilprobe/index.html
 *   /impressum/       impressum/index.html
 *   /datenschutz/     datenschutz/index.html
 *   /og-bild.jpg      assets/og-bild.jpg — das Vorschaubild muss per HTTP erreichbar sein
 *   /der-weg/         Weiterleitung auf /, weil der alte Link der Reise verschickt wurde
 *   /404.html         eigene Fehlerseite (GitHub Pages liefert sie bei unbekannten Pfaden)
 *   /robots.txt       erzeugt
 *   /sitemap.xml      erzeugt aus den indexierbaren Seiten im Ergebnis
 *
 * Die Domain steht nirgends hier im Skript: sie wird aus dem canonical der Reise
 * gelesen, damit sie im Repo nur in den Seiten selbst steht.
 *
 * Nicht mehr dabei: Astro-Build, Galerie, Varianten — die bleiben im Repo als Archiv.
 * Scheitert laut (Exit 1), wenn eine Quelle oder ein Kernartefakt fehlt.
 */

import { cpSync, mkdirSync, rmSync, existsSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const WURZEL = fileURLToPath(new URL('../../', import.meta.url));
const ZIEL = (process.argv[2] || '_site').replace(/[\\/]+$/, '') + '/';

function abbruch(text) {
  console.error(`::error::${text}`);
  process.exit(1);
}

// --- Quellen pruefen, bevor irgendetwas geschrieben wird.
const QUELLEN = [
  ['der-weg/', 'die Scroll-Reise'],
  ['der-weg/index.html', 'die Reise selbst'],
  ['der-weg/scrub-engine.js', 'die Engine'],
  ['der-weg/vertiefung.js', 'die Langfassungen'],
  ['der-weg/formulare.js', 'die Formulare'],
  ['der-weg/assets/anflug.mp4', 'der erste Clip'],
  ['stilprobe/index.html', 'die Stilprobe'],
  ['impressum/index.html', 'das Impressum'],
  ['datenschutz/index.html', 'die Datenschutzerklaerung'],
  ['assets/og-bild.jpg', 'das Vorschaubild'],
  ['deploy/der-weg-weiterleitung.html', 'die Weiterleitung'],
  ['deploy/404.html', 'die Fehlerseite'],
];
for (const [pfad, was] of QUELLEN) {
  if (!existsSync(WURZEL + pfad)) abbruch(`Quelle fehlt: ${pfad} (${was}).`);
}

// --- Zusammensetzen.
rmSync(ZIEL, { recursive: true, force: true });
mkdirSync(ZIEL, { recursive: true });

cpSync(WURZEL + 'der-weg/', ZIEL, { recursive: true });
for (const ordner of ['stilprobe', 'impressum', 'datenschutz', 'der-weg']) mkdirSync(ZIEL + ordner, { recursive: true });
cpSync(WURZEL + 'stilprobe/index.html', ZIEL + 'stilprobe/index.html');
cpSync(WURZEL + 'impressum/index.html', ZIEL + 'impressum/index.html');
cpSync(WURZEL + 'datenschutz/index.html', ZIEL + 'datenschutz/index.html');
cpSync(WURZEL + 'assets/og-bild.jpg', ZIEL + 'og-bild.jpg');
cpSync(WURZEL + 'deploy/der-weg-weiterleitung.html', ZIEL + 'der-weg/index.html');
cpSync(WURZEL + 'deploy/404.html', ZIEL + '404.html');

// --- Domain aus dem canonical der Reise.
const reise = readFileSync(ZIEL + 'index.html', 'utf8').slice(0, 12000);
const adresse = (reise.match(/<link rel="canonical" href="(https:\/\/[^"/]+)\/">/) || [])[1];
if (!adresse) abbruch('Die Reise hat keinen canonical der Form https://domain/ — daraus wird die Domain fuer robots.txt und Sitemap abgeleitet.');

// --- Sitemap: jede index.html im Ergebnis, die nicht auf noindex steht.
function sammleSeiten(ordner, urlPfad) {
  const treffer = [];
  const index = join(ordner, 'index.html');
  if (existsSync(index)) {
    const kopf = readFileSync(index, 'utf8').slice(0, 12000);
    const noindex = /<meta[^>]*name=["']robots["'][^>]*noindex/i.test(kopf);
    if (!noindex) treffer.push(urlPfad);
  }
  for (const eintrag of readdirSync(ordner, { withFileTypes: true })) {
    if (eintrag.isDirectory() && eintrag.name !== 'assets' && eintrag.name !== 'schriften') {
      treffer.push(...sammleSeiten(join(ordner, eintrag.name), `${urlPfad}${eintrag.name}/`));
    }
  }
  return treffer;
}
const seiten = sammleSeiten(ZIEL, '/');
if (seiten.length < 4) abbruch(`Nur ${seiten.length} indexierbare Seite(n) gefunden, erwartet mindestens 4: ${seiten.join(', ')}`);

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...seiten.map((p) => `  <url><loc>${adresse}${p}</loc></url>`),
  '</urlset>',
  '',
].join('\n');
writeFileSync(ZIEL + 'sitemap.xml', sitemap, 'utf8');
writeFileSync(ZIEL + 'robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${adresse}/sitemap.xml\n`, 'utf8');

// --- Kernartefakte muessen da sein, sonst laut scheitern (kein stiller Teil-Deploy).
const ARTEFAKTE = [
  'index.html', 'scrub-engine.js', 'vertiefung.js', 'formulare.js', 'formular-kern.js',
  'assets/anflug.mp4', 'assets/schriften.css', 'assets/seiten.css', 'assets/favicon.svg',
  'assets/formular.css', 'assets/stilprobe.css',
  'stilprobe/index.html', 'impressum/index.html', 'datenschutz/index.html',
  'der-weg/index.html', '404.html', 'og-bild.jpg', 'robots.txt', 'sitemap.xml',
];
const fehlend = ARTEFAKTE.filter((a) => !existsSync(ZIEL + a));
if (fehlend.length) abbruch(`Deploy-Artefakt(e) fehlen: ${fehlend.join(', ')}`);

// --- Bilanz.
function zaehle(ordner) {
  let dateien = 0, bytes = 0;
  for (const e of readdirSync(ordner, { withFileTypes: true })) {
    const p = join(ordner, e.name);
    if (e.isDirectory()) { const t = zaehle(p); dateien += t.dateien; bytes += t.bytes; }
    else { dateien++; bytes += statSync(p).size; }
  }
  return { dateien, bytes };
}
const bilanz = zaehle(ZIEL);
console.log(`Seite zusammengesetzt unter ${ZIEL}: ${bilanz.dateien} Dateien, ${(bilanz.bytes / 1024 / 1024).toFixed(1)} MB`);
console.log(`Domain (aus dem canonical der Reise): ${adresse}`);
console.log(`Sitemap: ${seiten.join(', ')}`);
