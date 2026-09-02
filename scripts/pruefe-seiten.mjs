#!/usr/bin/env node
/**
 * Qualitaetspruefung der Seiten — schnell, ohne Netz, ohne Build.
 *
 * Jede Regel hier entspricht einem Fehler, der LIVE gefunden wurde (Runde vom
 * 2026-07-25) oder beim Umzug der Reise an die Wurzel (02.09.2026) haette
 * passieren koennen. Der Zweck ist nicht Vollstaendigkeit, sondern dass genau
 * diese Klassen nicht wiederkommen.
 *
 * Zwei Betriebsarten:
 *   node scripts/pruefe-seiten.mjs            → prueft die Quellen im Repo
 *   node scripts/pruefe-seiten.mjs _site      → prueft das Deploy-Ergebnis von
 *                                               scripts/deploy/baue-site.mjs
 *
 * Geprueft werden die fuenf ausgelieferten Seiten: die Reise (Startseite),
 * Stilprobe, Impressum, Datenschutz und die Weiterleitung unter /der-weg/.
 * Die Varianten unter variants/ sind Archiv, werden nicht ausgeliefert und
 * deshalb nicht geprueft.
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

function lies(pfad) {
  return existsSync(pfad) ? readFileSync(pfad, 'utf8') : null;
}

/**
 * Die fuenf Seiten. `rolle`: reise (Startseite mit Pflicht-Metas und Kontaktweg),
 * seite (indexierbare Unterseite), weiterleitung (noindex + Meta-Refresh).
 * `url` ist der Pfad unter der Domain — daraus folgt der Soll-canonical.
 */
const PLAN = [
  { name: 'Startseite (Reise)', repo: 'der-weg/index.html', site: 'index.html', rolle: 'reise', url: '/' },
  { name: 'Stilprobe', repo: 'stilprobe/index.html', site: 'stilprobe/index.html', rolle: 'seite', url: '/stilprobe/' },
  { name: 'Impressum', repo: 'impressum/index.html', site: 'impressum/index.html', rolle: 'seite', url: '/impressum/' },
  { name: 'Datenschutz', repo: 'datenschutz/index.html', site: 'datenschutz/index.html', rolle: 'seite', url: '/datenschutz/' },
  { name: 'Weiterleitung /der-weg/', repo: 'deploy/der-weg-weiterleitung.html', site: 'der-weg/index.html', rolle: 'weiterleitung', url: '/der-weg/' },
];

const seiten = [];
for (const p of PLAN) {
  const pfad = SITE ? SITE + p.site : WURZEL + p.repo;
  const inhalt = lies(pfad);
  if (inhalt === null) {
    meldeFehler('Seite fehlt', `${p.name}: ${SITE ? p.site : p.repo} nicht gefunden.`);
    continue;
  }
  seiten.push({ ...p, pfad, inhalt, kopf: inhalt.slice(0, 12000) });
}
const reise = seiten.find((s) => s.rolle === 'reise');
const indexierbare = seiten.filter((s) => s.rolle !== 'weiterleitung');

// Die Domain hat genau eine Quelle: den canonical der Reise. Soll-canonicals,
// Sitemap und robots.txt werden daraus abgeleitet (auch in baue-site.mjs).
const ADRESSE = reise ? (reise.kopf.match(/<link rel="canonical" href="(https:\/\/[^"/]+)\/">/) || [])[1] : null;
if (reise && !ADRESSE) meldeFehler('Adresse', 'Die Reise hat keinen canonical der Form https://domain/ — daraus wird die Domain abgeleitet.');

const robotsVon = (s) => (s.kopf.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/i) || [])[1];

// ---------------------------------------------------------------------------
// Regel 1 — Jeder Sprungmarken-Link braucht ein Ziel. (Fehlerklasse V2)
// ---------------------------------------------------------------------------
geprueft.push('Sprungmarken haben ein Ziel');
for (const s of indexierbare) {
  const ids = new Set([...s.inhalt.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const anker = new Set([...s.inhalt.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]));
  for (const a of anker) {
    if (a === 'top' || a === '') continue;
    if (!ids.has(a)) meldeFehler('Sprungmarke', `${s.name}: href="#${a}" hat kein Element mit dieser id.`);
  }
}

// ---------------------------------------------------------------------------
// Regel 2 — Die Startseite braucht einen echten Kontaktweg. (Fehlerklasse V2)
// ---------------------------------------------------------------------------
geprueft.push('Startseite hat einen echten Kontaktweg');
if (reise) {
  const wege = (reise.inhalt.match(/href="mailto:/g) || []).length
    + (reise.inhalt.match(/href="tel:/g) || []).length
    + (reise.inhalt.match(/<form[\s>]/g) || []).length;
  if (wege === 0) meldeFehler('Kontaktweg', `${reise.name}: kein mailto:, kein tel:, kein Formular — die Seite kann keine Anfrage erzeugen.`);
}

// ---------------------------------------------------------------------------
// Regel 3 — Kein canonical/og:url auf localhost. (Fehlerklasse V9)
// ---------------------------------------------------------------------------
geprueft.push('kein canonical/og:url auf localhost');
for (const s of seiten) {
  if (/(?:rel="canonical"[^>]*|og:url"[^>]*content=")[^"]*localhost/.test(s.kopf)) {
    meldeFehler('localhost-Adresse', `${s.name}: canonical oder og:url zeigt auf localhost.`);
  }
}

// ---------------------------------------------------------------------------
// Regel 4 — Indexierbarkeit: die vier echten Seiten duerfen kein noindex tragen,
// die Weiterleitung MUSS es tragen (sonst fuehrt Google zwei Adressen). (V9)
// ---------------------------------------------------------------------------
geprueft.push('echte Seiten indexierbar, Weiterleitung auf noindex');
for (const s of indexierbare) {
  if (/noindex/.test(robotsVon(s) || '')) meldeFehler('robots', `${s.name} steht auf noindex — sie soll gefunden werden.`);
}
for (const s of seiten.filter((x) => x.rolle === 'weiterleitung')) {
  if (!/noindex/.test(robotsVon(s) || '')) meldeFehler('robots', `${s.name}: die Weiterleitung braucht noindex.`);
  if (!/http-equiv="refresh"[^>]*url=\//.test(s.kopf)) meldeFehler('Weiterleitung', `${s.name}: kein Meta-Refresh auf /.`);
}

// ---------------------------------------------------------------------------
// Regel 5 — Pflicht-Metas. Jede indexierbare Seite: <title>, description und ein
// canonical, der exakt auf ihre Soll-Adresse zeigt. Die Reise zusaetzlich die
// Teilen-Angaben und ein Vorschaubild, das als Datei existiert. (V12)
// ---------------------------------------------------------------------------
geprueft.push('Pflicht-Metas, Soll-canonical und Vorschaubild');
for (const s of indexierbare) {
  if (!/<title>[^<]+<\/title>/.test(s.kopf)) meldeFehler('Meta', `${s.name}: <title> fehlt.`);
  if (!/<meta name="description" content="[^"]+"/.test(s.kopf)) meldeFehler('Meta', `${s.name}: description fehlt.`);
  const canonical = (s.kopf.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  if (!canonical) meldeFehler('Meta', `${s.name}: canonical fehlt.`);
  else if (ADRESSE && canonical !== ADRESSE + s.url) meldeFehler('canonical', `${s.name}: canonical "${canonical}" statt "${ADRESSE + s.url}".`);
  const ogUrl = (s.kopf.match(/property="og:url" content="([^"]+)"/) || [])[1];
  if (ogUrl && canonical && ogUrl !== canonical) meldeFehler('Meta', `${s.name}: og:url "${ogUrl}" weicht vom canonical ab.`);
}
if (reise) {
  for (const [name, re] of [
    ['og:title', /property="og:title"/],
    ['og:description', /property="og:description"/],
    ['og:image', /property="og:image"/],
  ]) {
    if (!re.test(reise.kopf)) meldeFehler('Meta', `${reise.name}: ${name} fehlt.`);
  }
  if (/twitter:card"[^>]*summary_large_image/.test(reise.kopf) && !/property="og:image"/.test(reise.kopf)) {
    meldeFehler('Meta', `${reise.name}: twitter:card verspricht ein grosses Bild, og:image fehlt aber.`);
  }
  const bildDatei = SITE ? SITE + 'og-bild.jpg' : WURZEL + 'assets/og-bild.jpg';
  if (/property="og:image"/.test(reise.kopf) && !existsSync(bildDatei)) {
    meldeFehler('Vorschaubild', `og:image ist gesetzt, aber ${bildDatei} existiert nicht.`);
  }
  if (ADRESSE) {
    for (const m of reise.kopf.matchAll(/(?:og:image|twitter:image)" content="([^"]+)"/g)) {
      if (!m[1].startsWith(ADRESSE + '/')) meldeFehler('Vorschaubild', `${reise.name}: Bildadresse "${m[1]}" liegt nicht unter ${ADRESSE}.`);
    }
  }
}

// ---------------------------------------------------------------------------
// Regel 6 — Ohne JavaScript darf die Seite nicht leer sein. (Fehlerklasse V7)
// Jede Regel, die Reveal-Bloecke auf opacity:0 setzt, braucht den .js-Vorsatz.
// ---------------------------------------------------------------------------
geprueft.push('Reveal-Regeln sind .js-geschuetzt');
for (const s of indexierbare) {
  // Selektor-Anfang bis zur oeffnenden Klammer, begrenzt gesucht (die Stilprobe
  // ist gross, ein gieriges Muster laeuft sich dort fest).
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
for (const s of indexierbare) {
  for (const m of s.inhalt.matchAll(/nth-child\(\s*\d+\s+of\s+\.bg-pergament\s*\)/g)) {
    meldeFehler('Positions-Selektor', `${s.name}: "${m[0]}" — eine eingeschobene Sektion verschiebt die Farbflaeche still. Auf eine ID umstellen.`);
  }
}

// ---------------------------------------------------------------------------
// Regel 8 — Interne Links. Seit dem Umzug an die Wurzel (02.09.2026) gilt:
//   a) der alte GitHub-Praefix /jgc-studio-website/ und die alte Adresse
//      jgc-coding.github.io duerfen nirgends mehr stehen — auch nicht in den
//      Skripten der Reise;
//   b) jeder interne Link (href/src/action/poster, dazu die Pfade in der
//      Engine-Konfiguration) muss auf eine Datei zeigen, die es gibt. Im Repo
//      wird dafuer erst die Projektwurzel, dann der-weg/ durchsucht — genau wie
//      der Vorschau-Server; im _site nur das Ergebnis. PHP-Endpunkte sind
//      ausgenommen, die gibt es erst mit dem PHP-Host.
// ---------------------------------------------------------------------------
geprueft.push('kein alter GitHub-Praefix, interne Links haben eine Ziel-Datei');
{
  const skripte = SITE
    ? ['scrub-engine.js', 'vertiefung.js', 'formulare.js'].map((n) => [`Skript ${n}`, SITE + n])
    : ['scrub-engine.js', 'vertiefung.js', 'formulare.js'].map((n) => [`Skript ${n}`, WURZEL + 'der-weg/' + n]);
  const texte = [...seiten.map((s) => [s.name, s.inhalt]), ...skripte.map(([n, p]) => [n, lies(p) || ''])];
  for (const [name, text] of texte) {
    if (text.includes('/jgc-studio-website')) meldeFehler('Alter Praefix', `${name}: enthaelt noch /jgc-studio-website.`);
    if (text.includes('jgc-coding.github.io')) meldeFehler('Alte Adresse', `${name}: enthaelt noch jgc-coding.github.io.`);
  }

  /** Loest einen Link zu einem Dateipfad auf; null, wenn er nicht geprueft wird. */
  function zielPfad(link, seite) {
    let l = link.trim();
    if (l === '' || /^(#|mailto:|tel:|https?:|data:|javascript:|\/\/)/i.test(l)) return null;
    l = l.replace(/[#?].*$/, '');
    if (l === '' || /\.php$/i.test(l)) return null;
    const roh = l.startsWith('/') ? l : seite.url.replace(/[^/]*$/, '') + l;
    const teile = [];
    for (const t of roh.split('/')) {
      if (t === '..') { if (!teile.length) return { pfad: roh, grund: 'fuehrt ueber die Wurzel hinaus' }; teile.pop(); }
      else if (t !== '' && t !== '.') teile.push(t);
    }
    let pfad = teile.join('/');
    if (pfad === '' || l.endsWith('/')) pfad = (pfad ? pfad + '/' : '') + 'index.html';
    return { pfad };
  }
  const existiert = (pfad) => (SITE ? [SITE + pfad] : [WURZEL + pfad, WURZEL + 'der-weg/' + pfad]).some((k) => existsSync(k));

  for (const s of seiten) {
    const links = [...s.inhalt.matchAll(/\b(?:href|src|action|poster)="([^"]*)"/g)].map((m) => m[1]);
    if (s.rolle === 'reise') {
      for (const m of s.inhalt.matchAll(/\b(?:clip|clipMobile|poster|posterMobile|still|logo|href)\s*:\s*'([^']*)'/g)) links.push(m[1]);
    }
    const gemeldet = new Set();
    for (const link of links) {
      const ziel = zielPfad(link, s);
      if (!ziel || gemeldet.has(link)) continue;
      if (ziel.grund || !existiert(ziel.pfad)) {
        gemeldet.add(link);
        meldeFehler('Link ohne Ziel', `${s.name}: "${link}" → ${ziel.grund || `${ziel.pfad} existiert nicht`}.`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Regel 9 — Keine hartkodierten Worktree-Pfade in den Skripten. (V16)
// ---------------------------------------------------------------------------
geprueft.push('keine hartkodierten Pfade in den Skripten');
{
  const skriptOrdner = ['scripts/', 'scripts/stilprobe/', 'scripts/v18/', 'scripts/der-weg/', 'scripts/deploy/'].map((o) => WURZEL + o);
  for (const ordner of skriptOrdner) {
    if (!existsSync(ordner)) continue;
    for (const datei of readdirSync(ordner).filter((f) => f.endsWith('.mjs'))) {
      const inhalt = readFileSync(ordner + datei, 'utf8');
      if (/[A-Z]:\\\\?Projekte/.test(inhalt) || /worktrees[\\/]/.test(inhalt)) {
        meldeFehler('Hartkodierter Pfad', `${ordner.slice(WURZEL.length)}${datei}: absoluter Pfad oder Worktree-Verweis im Code.`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Regel 10 — Keine externen Schriften/Skripte auf den ausgelieferten Seiten. (V15)
// Die eigene Adresse (canonical als <link>) und bewusste Aussenverweise sind ok.
// ---------------------------------------------------------------------------
geprueft.push('keine externen Schriften/Skripte');
for (const s of seiten) {
  for (const m of s.inhalt.matchAll(/<(?:link|script)[^>]*(?:href|src)="(https?:\/\/[^"]+)"/g)) {
    if (ADRESSE && m[1].startsWith(ADRESSE + '/')) continue;
    if (/^https:\/\/(github\.com|www\.certipedia\.com)\//.test(m[1])) continue;
    meldeFehler('Externe Ressource', `${s.name}: laedt ${m[1].slice(0, 70)}`);
  }
}

// ---------------------------------------------------------------------------
// Regel 11 — Nur im Deploy-Ergebnis: Sitemap und robots.txt passen zu den Seiten.
// ---------------------------------------------------------------------------
if (SITE) {
  geprueft.push('Sitemap und robots.txt passen zu den indexierbaren Seiten');
  const sitemap = lies(SITE + 'sitemap.xml');
  if (!sitemap) meldeFehler('Sitemap', 'sitemap.xml fehlt.');
  else if (ADRESSE) {
    const ist = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
    const soll = new Set(indexierbare.map((s) => ADRESSE + s.url));
    for (const u of soll) if (!ist.has(u)) meldeFehler('Sitemap', `${u} fehlt in der Sitemap.`);
    for (const u of ist) if (!soll.has(u)) meldeFehler('Sitemap', `${u} steht in der Sitemap, ist aber keine der indexierbaren Seiten.`);
  }
  const robots = lies(SITE + 'robots.txt');
  if (!robots) meldeFehler('robots.txt', 'robots.txt fehlt.');
  else if (ADRESSE && !robots.includes(`Sitemap: ${ADRESSE}/sitemap.xml`)) meldeFehler('robots.txt', 'nennt die Sitemap nicht unter der Soll-Adresse.');
}

// ---------------------------------------------------------------------------
// Ausgabe
// ---------------------------------------------------------------------------
console.log(`Geprueft: ${seiten.length} Seite(n)${SITE ? ` unter ${SITE}` : ' (Repo-Quellen)'}${ADRESSE ? `, Adresse ${ADRESSE}` : ''}`);
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
