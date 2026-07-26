#!/usr/bin/env node
/**
 * transform-weg-umschalter.mjs — V18 bekommt den Weg zur zweiten Fassung.
 *
 * Ab jetzt gibt es die Seite zweimal: als Lesefassung (V18, die Hauptseite) und als
 * Scroll-Reise (/der-weg/). Wer auf der einen steht, muss die andere finden koennen,
 * sonst existiert sie praktisch nicht.
 *
 * Eingefuegt werden drei Verweise:
 *   1. Navigation am Desktop, nach "Wer mit dir arbeitet"
 *   2. Navigation auf dem Handy, an derselben Stelle
 *   3. Fusszeile, nach der Stilprobe, mit erklaerendem Zusatz
 *
 * Die Gegenrichtung (von der Reise zur Lesefassung) steckt fest in
 * der-weg/index.html und braucht kein Skript.
 *
 * WARUM EIN SKRIPT UND KEIN EDITOR: V18 ist eine minifizierte Einzeldatei von 1,2 MB
 * mit eingebackenen Schriften und Bildern. Sie laesst sich nicht sinnvoll oeffnen. Jede
 * Ersetzung hier prueft deshalb ihre erwartete Trefferzahl und bricht sonst ab, statt
 * die Datei halb umzubauen. Das Skript ist zugleich die Doku der Aenderung.
 *
 * Mehrfach ausfuehrbar: ist der Umschalter schon drin, passiert nichts.
 *
 * Aufruf:  node scripts/v18/transform-weg-umschalter.mjs [DATEI]
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const DATEI = process.argv[2] || 'variants/standalone/18-lumen/index.html';
const ZIEL = '/jgc-studio-website/der-weg/';
const MARKE = 'data-weg-umschalter';

/* Genau ein Treffer je Muster — alles andere heisst, die Datei sieht anders aus als
 * erwartet, und dann wird nicht geraten. */
const EINFUEGUNGEN = [
  {
    was: 'Navigation Desktop',
    suche: /<a href="#wer" class="link-underline font-sans text-\[0\.95rem\] text-tinte\/85[^"]*"[^>]*>\s*Wer mit dir arbeitet\s*<\/a>/,
    baue: (treffer) => treffer +
      `<a href="${ZIEL}" ${MARKE} class="link-underline font-sans text-[0.95rem] text-tinte/85 hover:text-kupfer transition-colors duration-200" data-astro-cid-dmqpwcec> Der Weg </a>`,
  },
  {
    was: 'Navigation Handy',
    suche: /<a href="#wer" class="font-sans text-tinte text-\[1\.05rem\] py-3 border-b border-holzsand\/30[^"]*"[^>]*>\s*Wer mit dir arbeitet\s*<\/a>/,
    baue: (treffer) => treffer +
      `<a href="${ZIEL}" ${MARKE} class="font-sans text-tinte text-[1.05rem] py-3 border-b border-holzsand/30 last:border-b-0" data-mobile-link data-astro-cid-dmqpwcec> Der Weg </a>`,
  },
  {
    was: 'Fusszeile',
    suche: /<a href="\/jgc-studio-website\/stilprobe\/" class="link-underline inline-block font-sans text-\[0\.95rem\] text-pergament\/85[^"]*">\s*Stilprobe\s*<\/a>/,
    baue: (treffer) => treffer +
      `<a href="${ZIEL}" ${MARKE} class="link-underline inline-block font-sans text-[0.95rem] text-pergament/85 hover:text-kupfer transition-colors duration-200"> Der Weg: die Seite als Reise </a>`,
  },
];

function main() {
  if (!existsSync(DATEI)) {
    console.error(`Datei nicht gefunden: ${DATEI}`);
    process.exit(1);
  }

  let html = readFileSync(DATEI, 'utf8');
  const vorher = html.length;

  const schonDa = (html.match(new RegExp(MARKE, 'g')) || []).length;
  if (schonDa >= EINFUEGUNGEN.length) {
    console.log(`Umschalter steckt bereits ${schonDa}x in ${DATEI} — nichts zu tun.`);
    return;
  }
  if (schonDa > 0) {
    console.error(`Nur ${schonDa} von ${EINFUEGUNGEN.length} Verweisen vorhanden — die Datei ist halb`);
    console.error('umgebaut. Erst per git zuruecksetzen, dann neu ausfuehren.');
    process.exit(1);
  }

  for (const { was, suche, baue } of EINFUEGUNGEN) {
    const alle = html.match(new RegExp(suche.source, 'g')) || [];
    if (alle.length !== 1) {
      console.error(`ABBRUCH bei "${was}": ${alle.length} Treffer statt genau 1.`);
      console.error('Die Vorlage hat sich geaendert. Nichts geschrieben.');
      process.exit(1);
    }
    html = html.replace(suche, (m) => baue(m));
    console.log(`  ->  ${was}: Verweis eingefuegt`);
  }

  const gesetzt = (html.match(new RegExp(MARKE, 'g')) || []).length;
  if (gesetzt !== EINFUEGUNGEN.length) {
    console.error(`Nach dem Umbau ${gesetzt} Verweise statt ${EINFUEGUNGEN.length}. Nichts geschrieben.`);
    process.exit(1);
  }

  writeFileSync(DATEI, html, 'utf8');
  console.log('');
  console.log(`${gesetzt} Verweise gesetzt. Datei: ${vorher} -> ${html.length} Zeichen.`);
}

main();
