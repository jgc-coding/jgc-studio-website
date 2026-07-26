#!/usr/bin/env node
/**
 * hole-schriften.mjs — Fraunces und Inter aus V18 herausloesen, lateinische Teile behalten.
 *
 * Zwei Gruende, warum die Schriften nicht von Google geladen werden:
 *
 * 1. Datenschutz. Eine Schrift direkt von fonts.gstatic.com zu holen, schickt die
 *    IP-Adresse jeder Besucherin an Google. Auf einer deutschen Gewerbeseite ist das
 *    abmahnfaehig (LG Muenchen I, 20.01.2022, 3 O 17493/20). Der Seitenpruefer des
 *    Projekts verbietet externe Schriften auf lebenden Seiten deshalb ohnehin.
 * 2. Gewicht. V18 traegt alle 13 Schnitte mit, auch Kyrillisch, Griechisch und
 *    Vietnamesisch. Diese Seite ist deutsch; die lateinischen Teile genuegen.
 *
 * Die Schriften stammen aus V18 und sind damit exakt dieselben wie auf der
 * Hauptseite — beide Fassungen sehen gleich aus, was beim Umschalten zaehlt.
 *
 * Aufruf:  node scripts/der-weg/hole-schriften.mjs
 * Schreibt: der-weg/assets/schriften/*.woff2 und der-weg/assets/schriften.css
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const QUELLE = process.argv[2] || 'variants/standalone/18-lumen/index.html';
const ZIEL = process.argv[3] || 'der-weg/assets';
const SCHRIFTEN = join(ZIEL, 'schriften');

/* Ein Schnitt wird behalten, wenn sein Zeichenbereich lateinisch ist. Die
 * Kennungen stammen aus den Subsets, die Google fuer diese Familien ausliefert. */
function istLateinisch(bereich) {
  const nichtLatein = [
    'U+0400', 'U+0460', 'U+2DE0',   // kyrillisch
    'U+0370', 'U+1F00',             // griechisch
    'U+1EA0', 'U+20AB',             // vietnamesisch
  ];
  if (nichtLatein.some((k) => bereich.includes(k))) return false;
  return bereich.includes('U+0000') || bereich.includes('U+0100');
}

function main() {
  const html = readFileSync(QUELLE, 'utf8');
  const regeln = [...html.matchAll(/@font-face\s*\{([^}]*)\}/g)].map((m) => m[1]);
  if (!regeln.length) {
    console.error(`Keine @font-face-Regeln in ${QUELLE} gefunden.`);
    process.exit(1);
  }

  mkdirSync(SCHRIFTEN, { recursive: true });

  const css = [];
  let behalten = 0;
  let verworfen = 0;
  let bytes = 0;

  regeln.forEach((regel, i) => {
    const familie = /font-family:\s*["']?([^;"']+)/.exec(regel)?.[1]?.trim();
    const gewicht = /font-weight:\s*([^;]+)/.exec(regel)?.[1]?.trim() || 'normal';
    const stil = /font-style:\s*([^;]+)/.exec(regel)?.[1]?.trim() || 'normal';
    const bereich = /unicode-range:\s*([^;}]+)/.exec(regel)?.[1]?.trim() || '';
    const daten = /url\(["']?data:font\/woff2;base64,([A-Za-z0-9+/=]+)["']?\)/.exec(regel)?.[1];

    if (!familie || !daten) {
      console.error(`::warnung:: Regel ${i} unvollstaendig (Familie oder Schriftdaten fehlen), uebersprungen.`);
      return;
    }
    if (bereich && !istLateinisch(bereich)) { verworfen++; return; }

    const kurz = familie.toLowerCase().replace(/\s+variable$/, '').replace(/[^a-z0-9]+/g, '-');
    const name = `${kurz}-${stil === 'italic' ? 'kursiv' : 'normal'}-${behalten}.woff2`;
    const puffer = Buffer.from(daten, 'base64');
    writeFileSync(join(SCHRIFTEN, name), puffer);
    bytes += puffer.length;

    css.push(
      '@font-face{' +
      `font-family:"${familie}";` +
      `font-style:${stil};` +
      `font-weight:${gewicht};` +
      'font-display:swap;' +
      `src:url("schriften/${name}") format("woff2-variations");` +
      (bereich ? `unicode-range:${bereich};` : '') +
      '}'
    );
    behalten++;
  });

  if (!behalten) {
    console.error('Kein einziger lateinischer Schnitt gefunden — Erkennung pruefen, nichts geschrieben.');
    process.exit(1);
  }

  const kopf = '/* Aus V18 geloest von scripts/der-weg/hole-schriften.mjs.\n' +
    '   Nicht von Hand pflegen. Bewusst ohne die nicht-lateinischen Schnitte. */\n';
  writeFileSync(join(ZIEL, 'schriften.css'), kopf + css.join('\n') + '\n', 'utf8');

  console.log(`${behalten} Schnitt(e) uebernommen, ${verworfen} nicht-lateinische verworfen.`);
  console.log(`Schriftgewicht gesamt: ${(bytes / 1024).toFixed(0)} KB (V18 traegt alle 13 mit).`);
}

main();
