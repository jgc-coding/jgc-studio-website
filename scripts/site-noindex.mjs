#!/usr/bin/env node
/**
 * Setzt `noindex, nofollow` auf alle ausgelieferten Seiten, die NICHT die
 * Startseite sind — direkt im fertigen `_site`, nach dem Build.
 *
 * Warum hier und nicht in den Quellen (Befund V9, Nachtrag):
 * Neun Varianten (01-09) werden vom Workflow aus den `variant/*`-Branches
 * gebaut. Sie existieren als Datei nirgends im Repo, also greift
 * `scripts/varianten-noindex.mjs` bei ihnen nicht. Die Branches einzeln
 * anzufassen waere Chirurgie an eingefrorenem Stand; ein Stempel auf das
 * Deploy-Ergebnis erledigt es an einer Stelle und gilt automatisch auch fuer
 * jede kuenftige Variante.
 *
 * Behandelt werden:
 *   _site/variants/<slug>/index.html   alle, auch die Kopie der Hauptseite
 *                                      (die indexierbare Fassung ist die Root)
 *   _site/main/index.html              der Astro-Stand, inhaltlich zwei
 *                                      Generationen hinter der Startseite und
 *                                      mit identischem Titel -> waere sonst
 *                                      eine zweite, konkurrierende Startseite
 *
 * Unangetastet bleiben: _site/index.html (die Startseite) und
 * _site/stilprobe/index.html (eigenstaendige Unterseite, soll gefunden werden).
 *
 * Aufruf:  node scripts/site-noindex.mjs _site
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';

const SITE = (process.argv[2] || '_site').replace(/[\\/]+$/, '') + '/';
const NOINDEX = '<meta name="robots" content="noindex, nofollow">';

if (!existsSync(SITE + 'index.html')) {
  console.error(`Keine Startseite unter ${SITE} — Pfad falsch?`);
  process.exit(1);
}

/** Sammelt alle Seiten, die auf noindex sollen. */
const ziele = [];
const variantenOrdner = SITE + 'variants/';
if (existsSync(variantenOrdner)) {
  for (const slug of readdirSync(variantenOrdner, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name)) {
    if (slug === 'screenshots') continue;
    const pfad = `${variantenOrdner}${slug}/index.html`;
    if (existsSync(pfad)) ziele.push([`variants/${slug}`, pfad]);
  }
}
if (existsSync(SITE + 'main/index.html')) ziele.push(['main', SITE + 'main/index.html']);

let gesetzt = 0;
let schonGut = 0;

for (const [name, pfad] of ziele) {
  let html = readFileSync(pfad, 'utf8');
  const vorher = html;

  // Vorhandenes robots-Meta ersetzen (Schreibweisen unterscheiden sich je
  // nach Generator, deshalb bewusst tolerant gesucht), sonst hinter charset
  // einfuegen.
  const robotsRe = /<meta\s+name=["']robots["'][^>]*>/i;
  if (robotsRe.test(html)) {
    html = html.replace(robotsRe, NOINDEX);
  } else {
    const charsetRe = /<meta\s+charset=["'][^"']*["']\s*\/?>/i;
    if (!charsetRe.test(html)) {
      console.error(`::error::${name}: weder robots- noch charset-Meta gefunden, Einfuegepunkt unklar.`);
      process.exit(1);
    }
    html = html.replace(charsetRe, (m) => m + NOINDEX);
  }

  // Gleiche Stelle, gleiche Fehlerklasse: ein canonical auf localhost ist ein
  // Build-Artefakt (lokaler Build ohne SITE_URL) und fuer Suchmaschinen
  // wertlos. Wird hier mit entfernt, damit es nicht ausgeliefert wird.
  const canonicalRe = /<link\s+rel=["']canonical["']\s+href=["']http:\/\/localhost:\d+\/?["']\s*\/?>/gi;
  const ogUrlRe = /<meta\s+property=["']og:url["']\s+content=["']http:\/\/localhost:\d+\/?["']\s*\/?>/gi;
  const nLokal = (html.match(canonicalRe) || []).length + (html.match(ogUrlRe) || []).length;
  if (nLokal) {
    html = html.replace(canonicalRe, '').replace(ogUrlRe, '');
    console.log(`  ->  ${name}: ${nLokal} localhost-Adresse(n) entfernt`);
  }

  if (html === vorher) { schonGut++; console.log(`  ok  ${name}: stand schon auf noindex`); continue; }

  if (!html.includes(NOINDEX)) {
    console.error(`::error::${name}: noindex nach der Aenderung nicht vorhanden.`);
    process.exit(1);
  }
  if ((html.match(/<meta\s+name=["']robots["']/gi) || []).length !== 1) {
    console.error(`::error::${name}: mehr als ein robots-Meta nach der Aenderung.`);
    process.exit(1);
  }

  writeFileSync(pfad, html, 'utf8');
  gesetzt++;
  console.log(`  ->  ${name}: noindex gesetzt`);
}

// Gegenprobe: die Startseite muss indexierbar geblieben sein.
const start = readFileSync(SITE + 'index.html', 'utf8').slice(0, 12000);
if (/<meta\s+name=["']robots["'][^>]*noindex/i.test(start)) {
  console.error('::error::Die Startseite steht auf noindex — das darf nicht passieren.');
  process.exit(1);
}

console.log(`\n${gesetzt} Seite(n) auf noindex gesetzt, ${schonGut} standen schon richtig. Startseite bleibt indexierbar.`);
