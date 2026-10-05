#!/usr/bin/env node
/**
 * baue-og-bild.mjs - Vorschaubild fuer geteilte Links (og:image, 1200 x 630).
 *
 * Zeigt den ersten Bildschirm der Reise, so wie ein Besucher ihn am Desktop sieht:
 * die Eroeffnungsszene der Papierwelt, links der Pergament-Schleier der Engine,
 * darauf Marke, Augenzeile, Titel, Satz und Chips der ersten Station.
 *
 * Abgeloest hat es am 05.10.2026 scripts/v18/baue-og-bild.mjs: das alte Bild
 * stammte aus der Lesefassung V18 (fotoechter Schreibtisch) und zeigte eine
 * Seite, die es nicht mehr gibt (V80).
 *
 * Bausteine kommen aus dem Repo, damit nichts von der Seite abweicht:
 *   - Szene:   der-weg/assets/anflug-poster.jpg (erstes Bild der ausgelieferten Etappe)
 *   - Sigel:   der-weg/assets/sigel.png (dasselbe Bild wie in der Kopfzeile)
 *   - Texte:   die Station "anflug" in der Konfiguration von der-weg/index.html
 *   - Schrift: der-weg/assets/schriften (Fraunces und Inter, als data-URIs)
 *   - Schleier, Groessen und Farben: nachgebaut nach scrub-engine.js (.sw-copylayer,
 *     .sw-copy__*) und den Tokens im Kopf von der-weg/index.html
 *
 * Weg wie bei baue-profilbild.mjs: HTML/CSS -> Chrome headless (Screenshot bei 2x)
 * -> sharp (Beschnitt, Verkleinerung, Pruefung). Chrome, weil sharp keine
 * eingebetteten Webfonts setzt.
 *
 * Aufruf:   node scripts/der-weg/baue-og-bild.mjs
 * Ergebnis: assets/og-bild.jpg (der Deploy kopiert es nach /og-bild.jpg)
 * Braucht sharp aus scripts/node_modules (`cd scripts && npm install`) und Chrome unter dem
 * Standardpfad (oder Umgebungsvariable CHROME).
 */

import { readFileSync, mkdirSync, existsSync, statSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const require = createRequire(fileURLToPath(new URL('../package.json', import.meta.url)));
const sharp = require('sharp');

const WURZEL = fileURLToPath(new URL('../../', import.meta.url));
const REISE = join(WURZEL, 'der-weg', 'index.html');
const ASSETS = join(WURZEL, 'der-weg', 'assets');
const ZIEL = join(WURZEL, 'assets', 'og-bild.jpg');
const CHROME = process.env.CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARBEIT = process.env.ARBEIT || join(tmpdir(), 'jgc-og-bild');

const BREITE = 1200;
const HOEHE = 630;
const DSF = 2;          // Chrome rendert doppelt, sharp verkleinert - glattere Kanten
const MAX_KB = 300;     // Richtwert; LinkedIn erlaubt bis 5 MB

// ---------------------------------------------------------------- Helfer

function dateiUrl(pfad) {
  return 'file:///' + pfad.replace(/\\/g, '/');
}

function dataUri(pfad, typ) {
  return `data:${typ};base64,${readFileSync(pfad).toString('base64')}`;
}

function esc(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Chrome headless: Seite laden, Fenster in CSS-Pixeln, Screenshot bei DSF. */
function schiesse(htmlPfad, pngPfad, breite, hoehe) {
  if (!existsSync(CHROME)) throw new Error(`Chrome nicht gefunden: ${CHROME} (Umgebungsvariable CHROME setzen).`);
  const args = [
    '--headless=new', '--disable-gpu', '--hide-scrollbars',
    '--no-first-run', '--no-default-browser-check',
    `--user-data-dir=${join(ARBEIT, 'chrome')}`,
    '--force-color-profile=srgb',
    `--force-device-scale-factor=${DSF}`,
    '--virtual-time-budget=4000',
    '--run-all-compositor-stages-before-draw',
    `--window-size=${breite},${hoehe}`,
    `--screenshot=${pngPfad}`,
    dateiUrl(htmlPfad),
  ];
  execFileSync(CHROME, args, { stdio: ['ignore', 'pipe', 'pipe'], timeout: 120000 });
  if (!existsSync(pngPfad)) throw new Error(`Chrome hat keinen Screenshot geschrieben: ${pngPfad}`);
}

// ---------------------------------------------------------------- Bausteine

/** Texte der ersten Station aus der Konfiguration der Reise (eine Quelle). */
function stationAnflug() {
  const html = readFileSync(REISE, 'utf8');
  const start = html.indexOf("id: 'anflug'");
  if (start < 0) throw new Error("Station 'anflug' in der-weg/index.html nicht gefunden.");
  const ende = html.indexOf('},', start);
  const block = html.slice(start, ende);
  const feld = (name) => {
    const m = block.match(new RegExp(`${name}: '([^']+)'`));
    if (!m) throw new Error(`Station 'anflug': Feld "${name}" nicht gefunden.`);
    return m[1];
  };
  const tags = (block.match(/tags: \[([^\]]+)\]/) || [])[1];
  if (!tags) throw new Error("Station 'anflug': Feld \"tags\" nicht gefunden.");
  return {
    eyebrow: feld('eyebrow'),
    title: feld('title'),
    // Nur der erste Satz: der zweite traegt im Vorschaubild zu viel Text.
    body: feld('body').split(/(?<=\.)\s/)[0],
    tags: [...tags.matchAll(/'([^']+)'/g)].map((m) => m[1]),
  };
}

/** Alle @font-face-Bloecke der Reise mit eingebetteten Schriftdateien. */
function schriftenCss() {
  const css = readFileSync(join(ASSETS, 'schriften.css'), 'utf8');
  const bloecke = css.match(/@font-face\{[^}]*\}/g) || [];
  const fraunces = bloecke.filter((b) => b.includes('Fraunces')).length;
  const inter = bloecke.filter((b) => b.includes('Inter')).length;
  if (fraunces < 1 || inter < 1) throw new Error(`schriften.css: Fraunces ${fraunces}x, Inter ${inter}x - erwartet je mindestens 1.`);
  return bloecke.map((block) => {
    const m = block.match(/url\("schriften\/([^"]+\.woff2)"\)/);
    if (!m) throw new Error('@font-face ohne woff2-URL: ' + block.slice(0, 80));
    return block.replace(m[0], `url("${dataUri(join(ASSETS, 'schriften', m[1]), 'font/woff2')}")`);
  }).join('\n');
}

// ---------------------------------------------------------------- Seite

function bildHtml(s, fonts) {
  const szene = dataUri(join(ASSETS, 'anflug-poster.jpg'), 'image/jpeg');
  const sigel = dataUri(join(ASSETS, 'sigel.png'), 'image/png');
  return `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><title>Vorschaubild</title>
<style>
${fonts}
html, body { margin: 0; background: #FEFCF7; }
.bild {
  /* Tokens wie im Kopf von der-weg/index.html */
  --sw-bg: #FEFCF7; --sw-ink: #1F2A44; --sw-ink-soft: #4A5568; --sw-accent: #C97B3F;
  position: absolute; left: 0; top: 0; width: ${BREITE}px; height: ${HOEHE}px; overflow: hidden;
  background: var(--sw-bg); font-family: "Inter Variable", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
/* Szene: rechts verankert, damit das Haus neben dem Schleier steht. */
.szene {
  position: absolute; inset: 0;
  background: url("${szene}") no-repeat; background-size: cover; background-position: 100% 40%;
}
/* Schleier wie .sw-copylayer::before der Engine, etwas breiter, weil das
   Vorschaubild flacher ist als ein Bildschirm. */
.schleier {
  position: absolute; inset: 0; width: 62%;
  background: linear-gradient(90deg, var(--sw-bg) 0%,
    color-mix(in srgb, var(--sw-bg) 86%, transparent) 40%,
    color-mix(in srgb, var(--sw-bg) 45%, transparent) 70%, transparent 100%);
}
.marke {
  position: absolute; left: 64px; top: 44px; display: flex; align-items: center; gap: 12px;
  font-family: "Fraunces Variable", Georgia, serif; font-weight: 600; font-size: 24px;
  color: var(--sw-ink); letter-spacing: 0.01em;
}
.marke img { width: 27px; height: 40px; }
/* Titelgroesse so, dass der Punkt hinter "Wesentliche" nicht am Dach des Hauses klebt. */
.text { position: absolute; left: 64px; top: 146px; width: 540px; }
.augenzeile {
  display: block; font-family: "Fraunces Variable", Georgia, serif; font-weight: 700;
  font-size: 16px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--sw-accent);
}
h1 {
  font-family: "Fraunces Variable", Georgia, serif; font-weight: 700; color: var(--sw-ink);
  font-size: 60px; line-height: 1.03; letter-spacing: -0.01em; margin: 16px 0 0;
  text-shadow: 0 2px 20px color-mix(in srgb, var(--sw-bg) 70%, transparent);
}
p {
  margin: 22px 0 0; font-size: 23px; line-height: 1.45; max-width: 30ch;
  color: color-mix(in srgb, var(--sw-ink) 78%, var(--sw-ink-soft));
  text-shadow: 0 1px 12px color-mix(in srgb, var(--sw-bg) 90%, transparent);
}
/* Die drei Chips in einer Reihe, auch wenn sie etwas breiter als der Textblock sind. */
ul { list-style: none; display: flex; gap: 10px; width: max-content; margin: 28px 0 0; padding: 0; }
li {
  font-size: 16px; font-weight: 600; padding: 8px 16px; border-radius: 999px;
  color: color-mix(in srgb, var(--sw-accent) 58%, #000);
  background: color-mix(in srgb, var(--sw-accent) 14%, #fff);
  border: 1px solid color-mix(in srgb, var(--sw-accent) 30%, transparent);
}
</style></head>
<body>
<div class="bild">
  <div class="szene"></div>
  <div class="schleier"></div>
  <div class="marke"><img src="${sigel}" alt="">JGC Lumen</div>
  <div class="text">
    <span class="augenzeile">${esc(s.eyebrow)}</span>
    <h1>${esc(s.title)}</h1>
    <p>${esc(s.body)}</p>
    <ul>${s.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
  </div>
</div>
</body></html>`;
}

// ---------------------------------------------------------------- Ablauf

mkdirSync(ARBEIT, { recursive: true });

const station = stationAnflug();
console.log(`Station anflug: "${station.eyebrow}" / "${station.title}" / "${station.body}" / ${station.tags.join(', ')}`);

const htmlPfad = join(ARBEIT, 'og-bild.html');
const roh = join(ARBEIT, 'og-bild-roh.png');
writeFileSync(htmlPfad, bildHtml(station, schriftenCss()), 'utf8');

// Fenster groesser als das Bild, Beschnitt ab (0,0): so ist es egal, ob Chrome
// vom Fenstermass noch etwas fuer Rahmen abzieht.
schiesse(htmlPfad, roh, BREITE + 200, HOEHE + 200);

await sharp(roh)
  .extract({ left: 0, top: 0, width: BREITE * DSF, height: HOEHE * DSF })
  .resize(BREITE, HOEHE, { kernel: 'lanczos3' })
  .flatten({ background: '#FEFCF7' })
  .jpeg({ quality: 86, progressive: true, mozjpeg: true })
  .toFile(ZIEL);

const meta = await sharp(ZIEL).metadata();
if (meta.width !== BREITE || meta.height !== HOEHE) throw new Error(`Ausgabe ${meta.width}x${meta.height} statt ${BREITE}x${HOEHE}.`);
const kb = Math.round(statSync(ZIEL).size / 1024);
if (kb > MAX_KB) throw new Error(`Vorschaubild zu schwer: ${kb} KB (Richtwert < ${MAX_KB} KB).`);

console.log(`\n  geschrieben: assets/og-bild.jpg - ${BREITE}x${HOEHE}, ${kb} KB`);
