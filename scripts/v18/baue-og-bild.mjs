#!/usr/bin/env node
/**
 * Baut das Vorschaubild fuer geteilte Links (og:image, 1200x630) aus den
 * echten Seiten-Assets: Hero-Foto + Marken-Verlauf (Tinte) + Sigel.
 *
 * Befund V12: og:image fehlte, waehrend twitter:card ein grosses Vorschaubild
 * versprach ("summary_large_image") — beim Teilen auf LinkedIn erschien eine
 * leere Karte. Ein data:-URI hilft nicht: LinkedIn, X und WhatsApp holen das
 * Bild als eigene HTTP-Anfrage, es muss also als Datei ausgeliefert werden.
 *
 * Quelle sind die in Variante 18 eingebetteten base64-Bilder — so kann das
 * Vorschaubild nicht von der Seite abweichen.
 *
 * Aufruf:  node scripts/v18/baue-og-bild.mjs
 * Ergebnis: assets/og-bild.jpg  (wird vom Deploy nach /og-bild.jpg kopiert)
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

// sharp kommt aus scripts/node_modules (scripts/package.json, `cd scripts && npm install`).
const require = createRequire(fileURLToPath(new URL('../package.json', import.meta.url)));
const sharp = require('sharp');

const V18 = fileURLToPath(new URL('../../variants/standalone/18-lumen/index.html', import.meta.url));
const ZIEL_ORDNER = fileURLToPath(new URL('../../assets/', import.meta.url));
const ZIEL = ZIEL_ORDNER + 'og-bild.jpg';

const BREITE = 1200;
const HOEHE = 630;

const html = readFileSync(V18, 'utf8');

/** Holt ein eingebettetes Bild anhand seines alt-Textes aus dem HTML. */
function bildAusHtml(altTeil, beschreibung) {
  const re = /<img[^>]*>/g;
  let m;
  while ((m = re.exec(html))) {
    const tag = m[0];
    const alt = (tag.match(/alt="([^"]*)"/) || [, ''])[1];
    if (!alt.includes(altTeil)) continue;
    const src = (tag.match(/src="data:image\/(?:png|jpeg|webp);base64,([A-Za-z0-9+/=]+)"/) || [])[1];
    if (!src) throw new Error(`[${beschreibung}] Bild gefunden, aber kein base64-src.`);
    return Buffer.from(src, 'base64');
  }
  throw new Error(`[${beschreibung}] kein <img> mit alt-Teil "${altTeil}" gefunden.`);
}

/** Holt das erste eingebettete Bild ohne alt-Text (= das Sigel in der Navigation). */
function sigelAusHtml() {
  const re = /<img[^>]*>/g;
  let m;
  while ((m = re.exec(html))) {
    const tag = m[0];
    const alt = (tag.match(/alt="([^"]*)"/) || [, null])[1];
    if (alt !== '') continue;
    const src = (tag.match(/src="data:image\/png;base64,([A-Za-z0-9+/=]+)"/) || [])[1];
    if (src) return Buffer.from(src, 'base64');
  }
  throw new Error('[Sigel] kein dekoratives PNG (alt="") gefunden.');
}

const hero = bildAusHtml('Ruhiger Arbeitsplatz', 'Hero-Foto');
const sigel = sigelAusHtml();

const heroMeta = await sharp(hero).metadata();
const sigelMeta = await sharp(sigel).metadata();
if (heroMeta.width < BREITE) throw new Error(`[Hero] zu klein: ${heroMeta.width}px, mindestens ${BREITE}px noetig.`);
console.log(`  Hero  ${heroMeta.width}x${heroMeta.height}`);
console.log(`  Sigel ${sigelMeta.width}x${sigelMeta.height}`);

// Hintergrund: Hero formatfuellend auf 1200x630.
const hintergrund = await sharp(hero)
  .resize(BREITE, HOEHE, { fit: 'cover', position: 'attention' })
  .toBuffer();

// Marken-Verlauf wie im Hero der Seite: Tinte von links, nach rechts auslaufend,
// plus eine Abdunklung von unten, damit das Sigel sicher steht.
const verlauf = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${BREITE}" height="${HOEHE}">
     <defs>
       <linearGradient id="quer" x1="0" y1="0" x2="1" y2="0">
         <stop offset="0%"   stop-color="#1F2A44" stop-opacity="0.93"/>
         <stop offset="55%"  stop-color="#1F2A44" stop-opacity="0.60"/>
         <stop offset="100%" stop-color="#1F2A44" stop-opacity="0.30"/>
       </linearGradient>
       <linearGradient id="hoch" x1="0" y1="1" x2="0" y2="0">
         <stop offset="0%"   stop-color="#1F2A44" stop-opacity="0.55"/>
         <stop offset="45%"  stop-color="#1F2A44" stop-opacity="0.00"/>
       </linearGradient>
     </defs>
     <rect width="${BREITE}" height="${HOEHE}" fill="url(#quer)"/>
     <rect width="${BREITE}" height="${HOEHE}" fill="url(#hoch)"/>
     <rect x="0" y="${HOEHE - 6}" width="${BREITE}" height="6" fill="#C97B3F"/>
   </svg>`
);

// Sigel links oben, auf Hoehe der Navigation der echten Seite.
const sigelHoehe = 190;
const sigelBreite = Math.round(sigelMeta.width * (sigelHoehe / sigelMeta.height));
const sigelSkaliert = await sharp(sigel).resize(sigelBreite, sigelHoehe, { fit: 'contain' }).toBuffer();

mkdirSync(ZIEL_ORDNER, { recursive: true });

await sharp(hintergrund)
  .composite([
    { input: verlauf, top: 0, left: 0 },
    { input: sigelSkaliert, top: 72, left: 80 },
  ])
  .jpeg({ quality: 84, progressive: true, mozjpeg: true })
  .toFile(ZIEL);

const ergebnis = await sharp(ZIEL).metadata();
if (ergebnis.width !== BREITE || ergebnis.height !== HOEHE) {
  throw new Error(`Falsche Ausgabemasse: ${ergebnis.width}x${ergebnis.height}`);
}
const kb = Math.round(readFileSync(ZIEL).length / 1024);
if (kb > 300) throw new Error(`Vorschaubild zu schwer: ${kb} KB (LinkedIn-Grenze liegt bei 5 MB, Richtwert < 300 KB).`);

console.log(`\n  geschrieben: assets/og-bild.jpg — ${BREITE}x${HOEHE}, ${kb} KB`);
