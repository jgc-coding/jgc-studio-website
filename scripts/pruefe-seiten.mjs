#!/usr/bin/env node
/**
 * Qualitaetspruefung der Seiten — schnell, ohne Netz, ohne Build.
 *
 * Jede Regel hier entspricht einem Fehler, der in der /improve-Runde vom
 * 2026-07-25 LIVE gefunden wurde. Der Zweck ist nicht Vollstaendigkeit,
 * sondern dass genau diese Klassen nicht wiederkommen.
 *
 * Zwei Betriebsarten:
 *   node scripts/pruefe-seiten.mjs            → prueft die Quellen im Repo
 *   node scripts/pruefe-seiten.mjs _site      → prueft das Deploy-Ergebnis
 *
 * Exit-Code 1 bei mindestens einem Fehler (rot), 0 sonst. Warnungen (gelb)
 * beenden den Lauf nicht.
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const WURZEL = fileURLToPath(new URL('../', import.meta.url));
const SITE = process.argv[2] ? process.argv[2].replace(/[\\/]+$/, '') + '/' : null;

const fehler = [];
const warnungen = [];
const geprueft = [];
const meldeFehler = (regel, text) => fehler.push(`${regel}: ${text}`);
const meldeWarnung = (regel, text) => warnungen.push(`${regel}: ${text}`);

/** Liest eine Datei, gibt null zurueck wenn sie fehlt. */
function lies(pfad) {
  return existsSync(pfad) ? readFileSync(pfad, 'utf8') : null;
}

/** Sammelt die zu pruefenden HTML-Dateien je nach Betriebsart. */
function sammleSeiten() {
  const seiten = [];
  if (SITE) {
    const kandidaten = [
      ['Startseite', SITE + 'index.html'],
      ['Stilprobe', SITE + 'stilprobe/index.html'],
      ['Galerie', SITE + 'galerie/index.html'],
      ['Astro-Seite', SITE + 'main/index.html'],
    ];
    for (const [name, pfad] of kandidaten) {
      const inhalt = lies(pfad);
      if (inhalt) seiten.push({ name, pfad, inhalt });
    }
    const variantenDir = SITE + 'variants/';
    if (existsSync(variantenDir)) {
      for (const slug of readdirSync(variantenDir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name)) {
        if (slug === 'screenshots') continue;
        const inhalt = lies(`${variantenDir}${slug}/index.html`);
        if (inhalt) seiten.push({ name: `Variante ${slug}`, pfad: `${variantenDir}${slug}/index.html`, inhalt, variante: slug });
      }
    }
  } else {
    const stil = lies(WURZEL + 'stilprobe/index.html');
    if (stil) seiten.push({ name: 'Stilprobe', pfad: 'stilprobe/index.html', inhalt: stil });
    const standalone = WURZEL + 'variants/standalone/';
    for (const slug of readdirSync(standalone, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name)) {
      const inhalt = lies(`${standalone}${slug}/index.html`);
      if (inhalt) seiten.push({ name: `Variante ${slug}`, pfad: `variants/standalone/${slug}/index.html`, inhalt, variante: slug });
    }
  }
  return seiten;
}

const seiten = sammleSeiten();
if (seiten.length === 0) {
  console.error('Keine Seiten gefunden — Pfad falsch?');
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(WURZEL + 'variants/standalone/manifest.json', 'utf8'));
const hauptseite = Object.entries(manifest).find(([, v]) => v.homepage === true)?.[0];
if (!hauptseite) meldeFehler('Manifest', 'keine Variante als "homepage": true markiert.');

/**
 * Lebende Seiten vs. eingefrorene Entwuerfe.
 *
 * Die alten Varianten sind bewusst eingefroren und stehen auf noindex; sie
 * tragen dieselben Altlasten wie V18 vor dieser Runde. Sie nachtraeglich
 * umzubauen waere Arbeit ohne Nutzen — und wuerde jeden Deploy blockieren.
 * Fuer sie gelten deshalb nur die Regeln, die nach aussen wirken (robots,
 * localhost); alles andere ist dort eine Warnung.
 */
const istLebend = (s) => s.variante ? s.variante === hauptseite
  : ['Startseite', 'Stilprobe', 'Galerie', 'Astro-Seite'].includes(s.name);
const lebendeSeiten = seiten.filter(istLebend);
/** Meldet Fehler nur fuer lebende Seiten, sonst eine Warnung. */
const meldeJeNachSeite = (s, regel, text) =>
  istLebend(s) ? meldeFehler(regel, text) : meldeWarnung(regel + ' (eingefrorener Entwurf)', text);

// ---------------------------------------------------------------------------
// Regel 1 — Jeder Sprungmarken-Link braucht ein Ziel. (Fehlerklasse V2)
// ---------------------------------------------------------------------------
geprueft.push('Sprungmarken haben ein Ziel');
for (const s of seiten) {
  const ids = new Set([...s.inhalt.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const anker = new Set([...s.inhalt.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]));
  for (const a of anker) {
    if (a === 'top' || a === '') continue;
    if (!ids.has(a)) meldeJeNachSeite(s, 'Sprungmarke', `${s.name}: href="#${a}" hat kein Element mit dieser id.`);
  }
}

// ---------------------------------------------------------------------------
// Regel 2 — Die Hauptseite braucht einen echten Kontaktweg. (Fehlerklasse V2)
// Ein Knopf, der auf die Sektion zeigt, in der er selbst steht, ist keiner.
// ---------------------------------------------------------------------------
geprueft.push('Hauptseite hat einen echten Kontaktweg');
{
  const start = seiten.find((s) => s.variante === hauptseite || s.name === 'Startseite');
  if (start) {
    const wege = (start.inhalt.match(/href="mailto:/g) || []).length
      + (start.inhalt.match(/href="tel:/g) || []).length
      + (start.inhalt.match(/<form[\s>]/g) || []).length;
    if (wege === 0) {
      meldeFehler('Kontaktweg', `${start.name}: kein mailto:, kein tel:, kein Formular — die Seite kann keine Anfrage erzeugen.`);
    }
  }
}

// ---------------------------------------------------------------------------
// Regel 3 — Kein canonical/og:url auf localhost. (Fehlerklasse V9)
// ---------------------------------------------------------------------------
geprueft.push('kein canonical/og:url auf localhost');
for (const s of seiten) {
  const kopf = s.inhalt.slice(0, 12000);
  if (/(?:rel="canonical"[^>]*|og:url"[^>]*content=")[^"]*localhost/.test(kopf)) {
    meldeFehler('localhost-Adresse', `${s.name}: canonical oder og:url zeigt auf localhost.`);
  }
}

// ---------------------------------------------------------------------------
// Regel 4 — Genau eine Variante ist indexierbar. (Fehlerklasse V9)
// ---------------------------------------------------------------------------
geprueft.push('nur die Hauptseite ist indexierbar');
for (const s of seiten.filter((x) => x.variante)) {
  const robots = (s.inhalt.slice(0, 12000).match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/i) || [])[1];
  const istHauptseite = s.variante === hauptseite;
  if (istHauptseite) {
    if (robots && /noindex/.test(robots)) meldeFehler('robots', `${s.name} ist die Hauptseite, steht aber auf noindex.`);
  } else if (!robots || !/noindex/.test(robots)) {
    meldeFehler('robots', `${s.name}: alte Variante ohne noindex (steht auf "${robots || 'kein robots-Meta'}").`);
  }
}

// ---------------------------------------------------------------------------
// Regel 5 — Pflicht-Metas der Hauptseite, og:image-Datei muss existieren.
// (Fehlerklasse V12)
// ---------------------------------------------------------------------------
geprueft.push('Pflicht-Metas und Vorschaubild der Hauptseite');
{
  const start = seiten.find((s) => s.variante === hauptseite || s.name === 'Startseite');
  if (start) {
    const kopf = start.inhalt.slice(0, 12000);
    for (const [name, re] of [
      ['og:title', /property="og:title"/],
      ['og:description', /property="og:description"/],
      ['og:image', /property="og:image"/],
      ['canonical', /rel="canonical"/],
    ]) {
      if (!re.test(kopf)) meldeFehler('Meta', `${start.name}: ${name} fehlt.`);
    }
    if (/twitter:card"[^>]*summary_large_image/.test(kopf) && !/property="og:image"/.test(kopf)) {
      meldeFehler('Meta', `${start.name}: twitter:card verspricht ein grosses Bild, og:image fehlt aber.`);
    }
    const bildDatei = SITE ? SITE + 'og-bild.jpg' : WURZEL + 'assets/og-bild.jpg';
    if (/property="og:image"/.test(kopf) && !existsSync(bildDatei)) {
      meldeFehler('Vorschaubild', `og:image ist gesetzt, aber ${bildDatei} existiert nicht.`);
    }
  }
}

// ---------------------------------------------------------------------------
// Regel 6 — Ohne JavaScript darf die Seite nicht leer sein. (Fehlerklasse V7)
// Jede Regel, die Reveal-Bloecke auf opacity:0 setzt, braucht den .js-Vorsatz.
// ---------------------------------------------------------------------------
geprueft.push('Reveal-Regeln sind .js-geschuetzt');
for (const s of lebendeSeiten) {
  // Selektor-Anfang bis zur oeffnenden Klammer, begrenzt gesucht (die Dateien
  // sind bis zu 1,2 MB gross, ein gieriges Muster laeuft sich dort fest).
  for (const m of s.inhalt.matchAll(/([^{};]{0,90}\.reveal[^{};]{0,60})\{([^}]{0,200})\}/g)) {
    if (!/opacity\s*:\s*0\b/.test(m[2])) continue;
    if (/\.js\s/.test(m[1])) continue;
    meldeFehler('Reveal ohne .js-Schutz', `${s.name}: "${m[1].trim().slice(-60)}" versteckt Inhalt auch ohne JavaScript.`);
  }
}

// ---------------------------------------------------------------------------
// Regel 7 — Keine positionsabhaengigen Sektions-Selektoren. (Fehlerklasse V8)
// ---------------------------------------------------------------------------
geprueft.push('keine positionsabhaengigen Sektions-Selektoren');
for (const s of lebendeSeiten) {
  for (const m of s.inhalt.matchAll(/nth-child\(\s*\d+\s+of\s+\.bg-pergament\s*\)/g)) {
    meldeFehler('Positions-Selektor', `${s.name}: "${m[0]}" — eine eingeschobene Sektion verschiebt die Farbflaeche still. Auf eine ID umstellen.`);
  }
}

// ---------------------------------------------------------------------------
// Regel 8 — Keine ortsabhaengigen relativen Links in Variante 18.
// V18 wird an zwei Stellen ausgeliefert (Root und /variants/18-lumen/), ein
// "../"-Link stimmt daher immer nur an einer davon. (Stolperfalle CLAUDE.md)
// ---------------------------------------------------------------------------
geprueft.push('keine ortsabhaengigen relativen Links');
for (const s of seiten.filter((x) => x.variante === hauptseite || x.name === 'Startseite')) {
  for (const m of s.inhalt.matchAll(/(?:href|src)="(\.\.\/[^"]*)"/g)) {
    meldeFehler('Relativer Link', `${s.name}: "${m[1]}" ist ortsabhaengig — absolut schreiben.`);
  }
}

// ---------------------------------------------------------------------------
// Regel 9 — Keine hartkodierten Worktree-Pfade in den Skripten. (V16)
// ---------------------------------------------------------------------------
geprueft.push('keine hartkodierten Pfade in den Skripten');
{
  const skriptOrdner = [WURZEL + 'scripts/', WURZEL + 'scripts/stilprobe/', WURZEL + 'scripts/v18/'];
  for (const ordner of skriptOrdner) {
    if (!existsSync(ordner)) continue;
    for (const datei of readdirSync(ordner).filter((f) => f.endsWith('.mjs'))) {
      const inhalt = readFileSync(ordner + datei, 'utf8');
      if (/[A-Z]:\\\\?Projekte/.test(inhalt) || /worktrees[\\/]/.test(inhalt)) {
        meldeFehler('Hartkodierter Pfad', `scripts/.../${datei}: absoluter Pfad oder Worktree-Verweis im Code.`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Regel 10 — Keine externen Ressourcen auf den ausgelieferten Seiten. (V15)
// Warnung, kein Fehler: der Screenshot-Ordner und GitHub-Links sind in Ordnung.
// ---------------------------------------------------------------------------
geprueft.push('keine externen Schriften/Skripte auf den lebenden Seiten');
for (const s of seiten) {
  for (const m of s.inhalt.matchAll(/<(?:link|script)[^>]*(?:href|src)="(https?:\/\/[^"]+)"/g)) {
    // Eigene Adresse (canonical/og:url als <link>) und bewusst gesetzte
    // Aussenverweise sind in Ordnung.
    if (/^https:\/\/(github\.com|www\.certipedia\.com|jgc-coding\.github\.io)/.test(m[1])) continue;
    meldeJeNachSeite(s, 'Externe Ressource', `${s.name}: laedt ${m[1].slice(0, 70)}`);
  }
}

// ---------------------------------------------------------------------------
// Ausgabe
// ---------------------------------------------------------------------------
console.log(`Geprueft: ${seiten.length} Seite(n)${SITE ? ` unter ${SITE}` : ' (Repo-Quellen)'}`);
for (const g of geprueft) console.log(`  · ${g}`);
console.log('');

if (warnungen.length) {
  console.log(`${warnungen.length} Warnung(en):`);
  for (const w of warnungen) console.log(`  ! ${w}`);
  console.log('');
}

if (fehler.length) {
  console.log(`${fehler.length} Fehler:`);
  for (const f of fehler) console.log(`  X ${f}`);
  process.exit(1);
}

console.log('Alles gruen.');
