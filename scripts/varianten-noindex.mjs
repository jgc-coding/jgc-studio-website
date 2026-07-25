#!/usr/bin/env node
/**
 * Befund V9: Alte Design-Varianten waren fuer Suchmaschinen freigegeben.
 *
 * Sieben Varianten (09a-09f, 13-lumen) trugen `robots: index, follow` UND
 * `canonical: http://localhost:4321/` — ein canonical auf localhost ist fuer
 * Suchmaschinen wertlos, die Entwuerfe konnten also mit der echten Seite
 * konkurrieren. Vier weitere (14-17) hatten gar kein robots-Meta und waren
 * damit ebenfalls indexierbar.
 *
 * Dieses Skript setzt fuer JEDE Variante ausser der im Manifest als
 * "homepage" markierten:
 *   - <meta name="robots" content="noindex, nofollow">  (setzen oder ersetzen)
 *   - canonical/og:url auf localhost entfernen
 *
 * Idempotent: bereits umgestellte Dateien bleiben unberuehrt.
 *
 * Aufruf:  node scripts/varianten-noindex.mjs
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const WURZEL = fileURLToPath(new URL('../', import.meta.url));
const STANDALONE = WURZEL + 'variants/standalone/';
const MANIFEST = JSON.parse(readFileSync(STANDALONE + 'manifest.json', 'utf8'));

const hauptseite = Object.entries(MANIFEST).find(([, v]) => v.homepage === true)?.[0];
if (!hauptseite) throw new Error('Keine Variante im Manifest als "homepage": true markiert.');
console.log(`Hauptseite laut Manifest: ${hauptseite} (bleibt indexierbar)\n`);

const NOINDEX = '<meta name="robots" content="noindex, nofollow">';
let geaendert = 0;
let unveraendert = 0;

for (const slug of readdirSync(STANDALONE, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name)) {
  const datei = STANDALONE + slug + '/index.html';
  if (!existsSync(datei)) continue;
  if (slug === hauptseite) {
    const kopf = readFileSync(datei, 'utf8').slice(0, 8000);
    if (!/content="index, follow"/.test(kopf)) {
      throw new Error(`[${slug}] Hauptseite ist NICHT auf "index, follow" — bitte pruefen, bevor etwas geaendert wird.`);
    }
    console.log(`  --  ${slug}: Hauptseite, bleibt "index, follow"`);
    continue;
  }

  let html = readFileSync(datei, 'utf8');
  const vorher = html;
  const notizen = [];

  // 1. robots setzen oder ersetzen. Achtung: die Varianten stammen aus
  // verschiedenen Generatoren, manche schreiben selbstschliessend (`... />`).
  // Ein zu enges Muster haengt sonst ein ZWEITES robots-Meta daneben.
  const robotsRe = /<meta\s+name=["']robots["'][^>]*>/i;
  if (robotsRe.test(html)) {
    const alt = html.match(robotsRe)[0];
    if (alt !== NOINDEX) {
      html = html.replace(robotsRe, NOINDEX);
      notizen.push('robots ersetzt');
    }
  } else {
    // Hinter das charset-Meta haengen — das steht in jeder Variante ganz vorn.
    const charsetRe = /<meta\s+charset="[^"]*"\s*\/?>/i;
    if (!charsetRe.test(html)) throw new Error(`[${slug}] kein charset-Meta gefunden, Einfuegepunkt unklar.`);
    html = html.replace(charsetRe, (m) => m + NOINDEX);
    notizen.push('robots ergaenzt');
  }

  // 2. canonical/og:url auf localhost entfernen (irrefuehrend statt hilfreich)
  const canonicalRe = /<link\s+rel="canonical"\s+href="http:\/\/localhost:\d+\/?"\s*\/?>/g;
  const ogUrlRe = /<meta\s+property="og:url"\s+content="http:\/\/localhost:\d+\/?"\s*\/?>/g;
  const nCanonical = (html.match(canonicalRe) || []).length;
  const nOgUrl = (html.match(ogUrlRe) || []).length;
  if (nCanonical) { html = html.replace(canonicalRe, ''); notizen.push(`canonical entfernt (${nCanonical}x)`); }
  if (nOgUrl) { html = html.replace(ogUrlRe, ''); notizen.push(`og:url entfernt (${nOgUrl}x)`); }

  if (html === vorher) { unveraendert++; console.log(`  ok  ${slug}: schon korrekt`); continue; }

  if (html.includes('\r\n')) throw new Error(`[${slug}] CRLF im Ergebnis — muss reines LF bleiben.`);
  if (!html.includes(NOINDEX)) throw new Error(`[${slug}] noindex nach der Aenderung nicht vorhanden.`);
  if (/localhost:\d+/.test(html.slice(0, 8000))) throw new Error(`[${slug}] localhost steht noch im Kopfbereich.`);

  writeFileSync(datei, html, 'utf8');
  geaendert++;
  console.log(`  ->  ${slug}: ${notizen.join(', ')}`);
}

console.log(`\n${geaendert} Variante(n) umgestellt, ${unveraendert} schon korrekt.`);
