#!/usr/bin/env node
/**
 * setze-favicon.mjs — Tab-Symbol der Stilprobe-Unterseite auf das Sigel stellen.
 *
 * stilprobe/index.html ist eine Single-File-HTML und traegt ihr Icon als
 * data-URI (geerbt aus V18: eine erfundene Spirale). Dieses Skript ersetzt den
 * einen <link rel="icon">-Eintrag durch der-weg/assets/favicon.svg, ebenfalls
 * als data-URI — die Unterseite wechselt beim Domain-Umzug ihren Ort, ein
 * eingebettetes Icon bleibt davon unberuehrt.
 *
 * Assertion-guarded: genau ein Treffer vor und nach der Ersetzung, sonst
 * Abbruch ohne Schreiben. Mehrfach ausfuehrbar (erkennt den fertigen Stand).
 *
 * Aufruf:  node scripts/stilprobe/setze-favicon.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const DATEI = fileURLToPath(new URL('../../stilprobe/index.html', import.meta.url));
const SVG = fileURLToPath(new URL('../../der-weg/assets/favicon.svg', import.meta.url));

const html = readFileSync(DATEI, 'utf8');
const svg = readFileSync(SVG, 'utf8');
if (!/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="/.test(svg)) {
  console.error('der-weg/assets/favicon.svg sieht nicht wie das gebaute Sigel-SVG aus.');
  process.exit(1);
}

const neu = `<link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,${Buffer.from(svg, 'utf8').toString('base64')}">`;
const muster = /<link rel="icon" type="image\/svg\+xml" href="data:image\/svg\+xml;base64,[A-Za-z0-9+/=]+">/g;

const treffer = html.match(muster) || [];
if (treffer.length !== 1) {
  console.error(`Erwartet genau einen Icon-Link in stilprobe/index.html, gefunden: ${treffer.length}.`);
  process.exit(1);
}
if (treffer[0] === neu) {
  console.log('Stilprobe: Favicon steht schon auf dem Sigel, nichts zu tun.');
  process.exit(0);
}

const ergebnis = html.replace(muster, neu);
if ((ergebnis.match(muster) || []).length !== 1 || !ergebnis.includes(neu)) {
  console.error('Ersetzung fehlgeschlagen — Datei nicht geschrieben.');
  process.exit(1);
}
if (ergebnis.length - html.length !== neu.length - treffer[0].length) {
  console.error('Laengenbilanz stimmt nicht — Datei nicht geschrieben.');
  process.exit(1);
}
writeFileSync(DATEI, ergebnis, 'utf8');
console.log(`Stilprobe: Favicon ersetzt (${treffer[0].length} -> ${neu.length} Zeichen).`);
