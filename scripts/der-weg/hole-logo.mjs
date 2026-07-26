#!/usr/bin/env node
/**
 * hole-logo.mjs — das Sigel aus V18 als eigene Datei.
 *
 * Die Scroll-Reise soll dieselbe Marke tragen wie die Lesefassung. Das Sigel steckt
 * in V18 als eingebettetes Bild im Kopfbereich; hier wird es als eigene Datei
 * herausgeloest, damit die Reise es benutzen kann, ohne die 1,2-MB-Datei zu kennen.
 *
 * Aufruf:  node scripts/der-weg/hole-logo.mjs
 * Schreibt: der-weg/assets/sigel.png
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const QUELLE = process.argv[2] || 'variants/standalone/18-lumen/index.html';
const ZIEL = process.argv[3] || 'der-weg/assets';

function main() {
  const html = readFileSync(QUELLE, 'utf8');
  const kopf = /<header[\s\S]*?<\/header>/i.exec(html);
  if (!kopf) {
    console.error(`Kein <header> in ${QUELLE} gefunden.`);
    process.exit(1);
  }

  const bilder = [...kopf[0].matchAll(/<img[^>]*src="data:image\/([a-z+]+);base64,([A-Za-z0-9+/=]+)"[^>]*>/gi)];
  if (bilder.length !== 1) {
    console.error(`${bilder.length} eingebettete Bilder im Kopfbereich statt genau 1 — Vorlage geaendert.`);
    process.exit(1);
  }

  const [, typ, daten] = bilder[0];
  const endung = typ === 'svg+xml' ? 'svg' : typ;
  const puffer = Buffer.from(daten, 'base64');
  if (puffer.length < 500) {
    console.error(`Sigel nur ${puffer.length} Bytes gross — das kann nicht stimmen.`);
    process.exit(1);
  }

  mkdirSync(ZIEL, { recursive: true });
  const datei = join(ZIEL, `sigel.${endung}`);
  writeFileSync(datei, puffer);
  console.log(`Sigel geschrieben: ${datei} (${(puffer.length / 1024).toFixed(0)} KB)`);
}

main();
