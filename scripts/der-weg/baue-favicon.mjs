#!/usr/bin/env node
/**
 * baue-favicon.mjs — Tab-Symbol aus dem Sigel.
 *
 * Quelle ist die Vektorzeichnung Logo/JGC Studio Logo final.svg (Inkscape, zwei
 * Pfade: Kupfer #b47d44 und Tinte #232a43 auf einer A4-Seite). Das Skript
 *   1. rendert das Original und beschneidet es, um den Begrenzungsrahmen des
 *      Sigels in SVG-Einheiten zu messen (Inkscape schreibt keinen brauchbaren),
 *   2. schreibt ein bereinigtes, quadratisches SVG mit 6 % Rand je Seite —
 *      nur die zwei Pfade, ohne Inkscape-Attribute,
 *   3. rendert daraus PNGs: 48 und 192 px (Google-Trefferliste, Safari,
 *      Android) sowie ein Apple-Touch-Icon mit 180 px auf Pergament-Grund,
 *      weil iOS transparente Icons schwarz hinterlegt.
 *
 * Ergebnis liegt in der-weg/assets/. Die Reise verlinkt die Dateien relativ,
 * die Stilprobe-Unterseite bekommt das SVG als data-URI
 * (scripts/stilprobe/setze-favicon.mjs).
 *
 * Aufruf:  node scripts/der-weg/baue-favicon.mjs
 * Braucht sharp aus scripts/node_modules (`cd scripts && npm install`).
 */

import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(fileURLToPath(new URL('../package.json', import.meta.url)));
const sharp = require('sharp');

const QUELLE = fileURLToPath(new URL('../../Logo/JGC Studio Logo final.svg', import.meta.url));
const ZIEL = fileURLToPath(new URL('../../der-weg/assets/', import.meta.url));
const PERGAMENT = '#FEFCF7';

const quelle = readFileSync(QUELLE, 'utf8');

// --- 1) Begrenzungsrahmen messen. Wie viele Pixel eine SVG-Einheit bei einer
//        gegebenen Dichte ergibt, haengt von der sharp-/librsvg-Version ab (das
//        Original ist in mm angegeben) — deshalb wird der Massstab aus dem
//        ungeschnittenen Render und der viewBox abgeleitet, nicht angenommen.
const viewBox = (quelle.match(/viewBox="([^"]+)"/) || [])[1];
if (!viewBox) throw new Error('viewBox im Original nicht gefunden.');
const [, , vbBreite] = viewBox.trim().split(/\s+/).map(Number);
const gerendert = await sharp(Buffer.from(quelle), { density: 254 }).toBuffer({ resolveWithObject: true });
const PX_JE_EINHEIT = gerendert.info.width / vbBreite;
const { info } = await sharp(gerendert.data)
  .trim({ threshold: 1 })
  .toBuffer({ resolveWithObject: true });
const bx = -info.trimOffsetLeft / PX_JE_EINHEIT;   // trimOffset ist negativ
const by = -info.trimOffsetTop / PX_JE_EINHEIT;
const bw = info.width / PX_JE_EINHEIT;
const bh = info.height / PX_JE_EINHEIT;
console.log(`Massstab: ${PX_JE_EINHEIT.toFixed(2)} px je Einheit (Render ${gerendert.info.width} px breit, viewBox ${vbBreite})`);
if (!(bw > 50 && bh > 50 && bh > bw)) {
  throw new Error(`Sigel-Rahmen unplausibel: ${bw} x ${bh} Einheiten (erwartet hochkant, > 50).`);
}
console.log(`Sigel-Rahmen: x ${bx.toFixed(1)}  y ${by.toFixed(1)}  ${bw.toFixed(1)} x ${bh.toFixed(1)} Einheiten`);

// --- 2) Quadratischer Ausschnitt, zentriert, 6 % Rand je Seite.
const seite = Math.max(bw, bh) * 1.12;
const vx = bx + bw / 2 - seite / 2;
const vy = by + bh / 2 - seite / 2;

const ebene = quelle.match(/<g\s+inkscape:groupmode="layer"[\s\S]*?<\/g>\s*<\/g>/);
if (!ebene) throw new Error('Zeichnungsebene (<g inkscape:groupmode="layer">) nicht gefunden.');
const inhalt = ebene[0]
  .replace(/\s+(inkscape|sodipodi):[\w-]+="[^"]*"/g, '')
  .replace(/\s+id="[^"]*"/g, '')
  .replace(/\s+style="display:inline"/g, '')
  .replace(/\sstyle="([^"]*)"/g, (m, st) => {
    const fill = (st.match(/fill:(#[0-9a-f]{6})/i) || [])[1];
    return fill ? ` fill="${fill}"` : '';
  });
const anzahlPfade = (inhalt.match(/<path\b/g) || []).length;
if (anzahlPfade !== 2) throw new Error(`Erwartet 2 Pfade im Sigel, gefunden ${anzahlPfade}.`);
if (!/fill="#b47d44"/.test(inhalt) || !/fill="#232a43"/.test(inhalt)) {
  throw new Error('Die zwei Sigel-Farben (#b47d44, #232a43) fehlen nach der Bereinigung.');
}
if (/inkscape:|sodipodi:/.test(inhalt)) throw new Error('Inkscape-Reste im bereinigten SVG.');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vx.toFixed(3)} ${vy.toFixed(3)} ${seite.toFixed(3)} ${seite.toFixed(3)}">\n${inhalt}\n</svg>\n`;
writeFileSync(ZIEL + 'favicon.svg', svg, 'utf8');

// Gegenprobe: das neue SVG beschnitten muss oben/unten den Rand von ~6 % zeigen.
const probe = await sharp(Buffer.from(svg), { density: 600 }).trim({ threshold: 1 }).toBuffer({ resolveWithObject: true });
const gesamt = probe.info.height - 2 * probe.info.trimOffsetTop;   // Kantenlaenge des Quadrats
const randOben = -probe.info.trimOffsetTop / gesamt;
if (Math.abs(randOben - 0.06) > 0.01) throw new Error(`Rand oben ${(randOben * 100).toFixed(1)} % statt ~6 % — Ausschnitt stimmt nicht.`);

// --- 3) PNGs.
for (const px of [48, 192]) {
  await sharp(Buffer.from(svg), { density: 1200 }).resize(px, px).png({ compressionLevel: 9 }).toFile(ZIEL + `favicon-${px}.png`);
}
const kern = await sharp(Buffer.from(svg), { density: 1200 }).resize(140, 140).png().toBuffer();
await sharp({ create: { width: 180, height: 180, channels: 4, background: PERGAMENT } })
  .composite([{ input: kern, left: 20, top: 20 }])
  .png({ compressionLevel: 9 }).toFile(ZIEL + 'apple-touch-icon.png');

for (const name of ['favicon.svg', 'favicon-48.png', 'favicon-192.png', 'apple-touch-icon.png']) {
  console.log(`  ${name}: ${statSync(ZIEL + name).size} Bytes`);
}
console.log('fertig.');
