#!/usr/bin/env node
/**
 * transform-domain.mjs — Stilprobe-Unterseite auf die eigene Domain umstellen (02.09.2026).
 *
 * Bis dahin trug die Unterseite den GitHub-Pages-Praefix /jgc-studio-website/ und
 * verlinkte in die Sektionen der Lesefassung V18 (#angebote, #grundwerte, #wer,
 * #kontakt). Seit die Scroll-Reise die einzige Fassung ist, zeigen diese Links auf
 * die passenden Stationen der Reise: /#weg (Angebot und Ablauf), /#werkzeug
 * (Haltung), /#lichtung (Ueber mich), /#aussicht (Erstgespraech). Die Reise
 * springt bei solchen Hash-Zielen an die Station (siehe der-weg/index.html,
 * springeZurStation). Rechtsseiten liegen unter /impressum/ und /datenschutz/.
 *
 * Assertion-guarded: jede Ersetzung mit erwarteter Trefferzahl, sonst Abbruch ohne
 * Schreiben. Mehrfach ausfuehrbar (erkennt den fertigen Stand).
 *
 * Aufruf:  node scripts/stilprobe/transform-domain.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const DATEI = fileURLToPath(new URL('../../stilprobe/index.html', import.meta.url));
let html = readFileSync(DATEI, 'utf8');

if (!html.includes('jgc-studio-website') && !html.includes('jgc-coding.github.io')) {
  console.log('Stilprobe: steht schon auf der eigenen Domain, nichts zu tun.');
  process.exit(0);
}

// Reihenfolge: laengste Muster zuerst, damit der nackte Praefix nichts vorwegnimmt.
const ERSETZUNGEN = [
  ['https://jgc-coding.github.io/jgc-studio-website/stilprobe/', 'https://jgc-lumen.de/stilprobe/', 2],
  ['/jgc-studio-website/main/datenschutz/', '/datenschutz/', 4],
  ['/jgc-studio-website/main/impressum/', '/impressum/', 1],
  ['/jgc-studio-website/#angebote', '/#weg', 3],
  ['/jgc-studio-website/#grundwerte', '/#werkzeug', 4],
  ['/jgc-studio-website/#wer', '/#lichtung', 3],
  ['/jgc-studio-website/#kontakt', '/#aussicht', 4],
  ['/jgc-studio-website/stilprobe/', '/stilprobe/', 3],
  ['/jgc-studio-website/', '/', 1],
];

for (const [von, nach, erwartet] of ERSETZUNGEN) {
  const treffer = html.split(von).length - 1;
  if (treffer !== erwartet) {
    console.error(`Abbruch: "${von}" ${treffer}x gefunden, erwartet ${erwartet}. Datei nicht geschrieben.`);
    process.exit(1);
  }
  html = html.split(von).join(nach);
  console.log(`  ${treffer}x ${von} -> ${nach}`);
}

if (html.includes('jgc-studio-website') || html.includes('jgc-coding.github.io')) {
  console.error('Abbruch: alter Praefix oder alte Adresse steht noch irgendwo. Datei nicht geschrieben.');
  process.exit(1);
}

writeFileSync(DATEI, html, 'utf8');
console.log('Stilprobe: auf die eigene Domain umgestellt.');
