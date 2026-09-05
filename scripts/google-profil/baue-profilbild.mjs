#!/usr/bin/env node
/**
 * baue-profilbild.mjs - Profilbild (Logo-Feld) fuer das Google-Unternehmensprofil.
 *
 * Google zeigt das Logo in Maps und in der Suche meist RUND beschnitten und oft
 * sehr klein (40-80 px). Darum: quadratisch 1080 x 1080, alles Wichtige innerhalb
 * eines Sicherheitskreises (SICHER x Radius des einbeschriebenen Kreises), und je
 * Grund eine Fassung ohne Claim fuer die kleinen Ansichten.
 *
 * Bausteine kommen aus dem Repo, damit nichts von der Seite abweicht:
 *   - Sigel:   der-weg/assets/favicon.svg (bereinigte Vektorzeichnung, zwei Pfade)
 *   - Schrift: der-weg/assets/schriften/fraunces-*.woff2 (Fraunces Variable)
 *   - Farben:  die Marken-Tokens aus CLAUDE.md
 *
 * Weg: HTML/CSS -> Chrome headless (Screenshot bei 2x) -> sharp (Beschnitt,
 * Verkleinerung, Pruefung). Chrome, weil librsvg/sharp keine eingebetteten
 * Webfonts setzt; sharp, weil es die Pixel pruefen und sauber verkleinern kann.
 *
 * Pruefungen (werfen bei Verstoss):
 *   - jede Ersetzung im SVG/CSS mit erwarteter Trefferzahl
 *   - Ausgabe exakt 1080 x 1080
 *   - kein Inhaltspixel ausserhalb des Sicherheitskreises (Render ohne Grund)
 *   - Dateigroesse unter 5 MB (Google-Grenze)
 *
 * Aufruf:   node scripts/google-profil/baue-profilbild.mjs
 * Ergebnis: Bildmaterial/Google-Unternehmensprofil/profilbild-<grund>-<claim>.png
 *           + vorschau.jpg (quadratisch, rund, klein - so wie Google es zeigt)
 * Braucht sharp aus scripts/node_modules (`cd scripts && npm install`) und Chrome unter dem
 * Standardpfad (oder Umgebungsvariable CHROME).
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const require = createRequire(fileURLToPath(new URL('../package.json', import.meta.url)));
const sharp = require('sharp');

const WURZEL = fileURLToPath(new URL('../../', import.meta.url));
const SIGEL_SVG = join(WURZEL, 'der-weg', 'assets', 'favicon.svg');
const SCHRIFTEN_CSS = join(WURZEL, 'der-weg', 'assets', 'schriften.css');
const SCHRIFTEN_ORDNER = join(WURZEL, 'der-weg', 'assets', 'schriften');
const ZIEL = join(WURZEL, 'Bildmaterial', 'Google-Unternehmensprofil');
const CHROME = process.env.CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARBEIT = process.env.ARBEIT || join(tmpdir(), 'jgc-profilbild');

const SEITE = 1080;      // CSS-Pixel, Google empfiehlt mindestens 720 x 720
const DSF = 2;           // Chrome rendert doppelt, sharp verkleinert - glattere Kanten
const SICHER = 0.88;     // Anteil des Kreisradius, den Inhalt hoechstens belegen darf
const MAX_KB = 5 * 1024; // Google-Grenze fuer Fotos

const WORTMARKE = 'JGC Lumen';
const CLAIM = 'Mehr Raum f\u00FCr das Wesentliche';

const VARIANTEN = [
  { grund: 'hell',  claim: true,  titel: 'Pergament, mit Claim' },
  { grund: 'hell',  claim: false, titel: 'Pergament, ohne Claim' },
  { grund: 'tinte', claim: true,  titel: 'Tinte, mit Claim' },
  { grund: 'tinte', claim: false, titel: 'Tinte, ohne Claim' },
];

// ---------------------------------------------------------------- Helfer

function ersetze(text, von, nach, erwartet, was) {
  const teile = text.split(von);
  const n = teile.length - 1;
  if (n !== erwartet) throw new Error(`[${was}] "${von}" ${n}x gefunden, erwartet ${erwartet}.`);
  return teile.join(nach);
}

function dateiUrl(pfad) {
  return 'file:///' + pfad.replace(/\\/g, '/');
}

/** Chrome headless: Seite laden, Fenster in CSS-Pixeln, Screenshot bei DSF. */
function schiesse(htmlPfad, pngPfad, breite, hoehe) {
  if (!existsSync(CHROME)) throw new Error(`Chrome nicht gefunden: ${CHROME} (Umgebungsvariable CHROME setzen).`);
  const args = [
    '--headless=new', '--disable-gpu', '--hide-scrollbars',
    '--no-first-run', '--no-default-browser-check',
    `--user-data-dir=${join(ARBEIT, 'chrome')}`,
    '--force-color-profile=srgb',
    `--force-device-scale-factor=${DSF}`,
    '--default-background-color=00000000',
    '--virtual-time-budget=4000',
    '--run-all-compositor-stages-before-draw',
    `--window-size=${breite},${hoehe}`,
    `--screenshot=${pngPfad}`,
    dateiUrl(htmlPfad),
  ];
  execFileSync(CHROME, args, { stdio: ['ignore', 'pipe', 'pipe'], timeout: 120000 });
  if (!existsSync(pngPfad)) throw new Error(`Chrome hat keinen Screenshot geschrieben: ${pngPfad}`);
}

// ---------------------------------------------------------------- Bausteine

/** Das Sigel als Inline-SVG mit engem Rahmen und Farben als CSS-Variablen. */
async function sigelInline() {
  const svg = readFileSync(SIGEL_SVG, 'utf8');
  const vb = (svg.match(/viewBox="([^"]+)"/) || [])[1];
  if (!vb) throw new Error('favicon.svg hat keine viewBox.');
  const [vx, vy, vw] = vb.trim().split(/\s+/).map(Number);

  // Rahmen des Sigels messen (rendern, beschneiden, zurueckrechnen) - wie in
  // baue-favicon.mjs, denn die viewBox des Favicons traegt 6 % Rand je Seite.
  const roh = await sharp(Buffer.from(svg), { density: 600 }).toBuffer({ resolveWithObject: true });
  const pxJeEinheit = roh.info.width / vw;
  const { info } = await sharp(roh.data).trim({ threshold: 1 }).toBuffer({ resolveWithObject: true });
  const bx = vx - info.trimOffsetLeft / pxJeEinheit;   // trimOffset ist negativ
  const by = vy - info.trimOffsetTop / pxJeEinheit;
  const bw = info.width / pxJeEinheit;
  const bh = info.height / pxJeEinheit;
  const verhaeltnis = bh / bw;
  if (!(verhaeltnis > 1.3 && verhaeltnis < 1.7)) {
    throw new Error(`Sigel-Rahmen unplausibel: ${bw.toFixed(1)} x ${bh.toFixed(1)} (erwartet hochkant ~1.48).`);
  }

  let inhalt = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  inhalt = ersetze(inhalt, 'fill="#b47d44"', 'fill="var(--sigel-kupfer)"', 1, 'Sigel Kupfer');
  inhalt = ersetze(inhalt, 'fill="#232a43"', 'fill="var(--sigel-tinte)"', 1, 'Sigel Tinte');
  if ((inhalt.match(/<path\b/g) || []).length !== 2) throw new Error('Sigel: erwartet genau 2 Pfade.');

  return {
    svg: `<svg class="sigel" xmlns="http://www.w3.org/2000/svg" viewBox="${bx.toFixed(3)} ${by.toFixed(3)} ${bw.toFixed(3)} ${bh.toFixed(3)}" aria-hidden="true">${inhalt}</svg>`,
    verhaeltnis,
  };
}

/** Die vier Fraunces-Schnitte aus der Reise als data-URIs (unicode-range bleibt). */
function schriftenCss() {
  const css = readFileSync(SCHRIFTEN_CSS, 'utf8');
  const bloecke = (css.match(/@font-face\{[^}]*\}/g) || []).filter((b) => b.includes('Fraunces'));
  if (bloecke.length !== 4) throw new Error(`Erwartet 4 Fraunces-Bloecke in schriften.css, gefunden ${bloecke.length}.`);
  return bloecke.map((block) => {
    const m = block.match(/url\("schriften\/([^"]+\.woff2)"\)/);
    if (!m) throw new Error('Fraunces-Block ohne woff2-URL: ' + block.slice(0, 80));
    const b64 = readFileSync(join(SCHRIFTEN_ORDNER, m[1])).toString('base64');
    return block.replace(m[0], `url("data:font/woff2;base64,${b64}")`);
  }).join('\n');
}

/** Feines Papierkorn als SVG-Rauschen (data-URI). */
function kornUri() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320"><filter id="k"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#k)"/></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// ---------------------------------------------------------------- Seite

function bildHtml({ grund, claim, nurInhalt }, sigel, fonts) {
  const klassen = [grund, claim ? 'mit-claim' : 'ohne-claim', nurInhalt ? 'nur-inhalt' : ''].join(' ');
  return `<!doctype html>
<html lang="de"><head><meta charset="utf-8">
<title>Profilbild ${grund} ${claim ? 'mit' : 'ohne'} Claim</title>
<style>
${fonts}
html, body { margin: 0; background: transparent; }
.bild {
  position: absolute; left: 0; top: 0; width: ${SEITE}px; height: ${SEITE}px; overflow: hidden;
  font-family: "Fraunces Variable", Georgia, serif;
  -webkit-font-smoothing: antialiased; text-rendering: geometricPrecision;
}
/* Marken-Tokens (CLAUDE.md) und die zwei Sigel-Farben der Vektorzeichnung. */
.hell {
  --grund-a: #FFFEFB; --grund-b: #FCF8EF; --grund-c: #EFE4CF;
  --sigel-kupfer: #B47D44; --sigel-tinte: #232A43;
  --wort: #1F2A44; --claim: #9C6339; --zier: #C97B3F;
  --schein: rgba(201, 123, 63, 0.13);
}
.tinte {
  --grund-a: #2F3E62; --grund-b: #1F2A44; --grund-c: #111928;
  --sigel-kupfer: #C9915A; --sigel-tinte: #EDE3CF;
  --wort: #FEFCF7; --claim: #D9C7A8; --zier: #C97B3F;
  --schein: rgba(201, 123, 63, 0.28);
}
.grund {
  position: absolute; inset: 0;
  background:
    radial-gradient(circle at 50% 37%, var(--schein) 0%, rgba(201, 123, 63, 0) 44%),
    radial-gradient(128% 128% at 50% 42%, var(--grund-a) 0%, var(--grund-b) 50%, var(--grund-c) 100%);
}
.korn {
  position: absolute; inset: 0; background-image: url("${kornUri()}");
  background-size: 320px 320px; opacity: 0.07; mix-blend-mode: multiply;
}
.tinte .korn { mix-blend-mode: soft-light; opacity: 0.16; }
.nur-inhalt .grund, .nur-inhalt .korn { display: none; }

.lockup {
  position: absolute; inset: 0; display: flex; flex-direction: column;
  align-items: center; justify-content: center; padding-bottom: 20px;
}
.ohne-claim .lockup { padding-bottom: 40px; }
.sigel { display: block; width: auto; height: 330px; }
.ohne-claim .sigel { height: 360px; }
.wortmarke {
  margin-top: 44px; font-weight: 540; font-size: 138px; line-height: 1;
  letter-spacing: -0.005em; color: var(--wort); white-space: nowrap;
  font-variation-settings: "SOFT" 40;
}
.ohne-claim .wortmarke { margin-top: 50px; }
.zier { margin-top: 34px; width: 72px; height: 2px; border-radius: 1px; background: var(--zier); }
.claim {
  margin-top: 24px; font-style: italic; font-weight: 400; font-size: 44px; line-height: 1.2;
  letter-spacing: 0.012em; color: var(--claim); white-space: nowrap;
  font-variation-settings: "SOFT" 40;
}
.ohne-claim .zier, .ohne-claim .claim { display: none; }
</style></head>
<body>
<div class="bild ${klassen}">
  <div class="grund"></div>
  <div class="korn"></div>
  <div class="lockup">
    ${sigel}
    <div class="wortmarke">${WORTMARKE}</div>
    <div class="zier"></div>
    <div class="claim">${CLAIM}</div>
  </div>
</div>
</body></html>`;
}

/** Vorschaubogen: jede Fassung quadratisch, rund, und klein wie bei Google. */
function vorschauHtml(bilder) {
  const spalten = bilder.map((b) => {
    const src = `data:image/png;base64,${readFileSync(b.pfad).toString('base64')}`;
    return `<section>
      <h2>${b.titel}</h2>
      <img class="quadrat" src="${src}" alt="">
      <img class="rund" src="${src}" alt="">
      <div class="google">
        <img class="rund klein" src="${src}" alt=""><span class="name">JGC Lumen</span>
        <img class="rund winzig" src="${src}" alt="">
      </div>
      <p>${b.name}.png &middot; ${b.kb} KB &middot; Inhalt bis ${b.prozent} % des Kreises</p>
    </section>`;
  }).join('\n');
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Vorschau</title><style>
html, body { margin: 0; background: #ffffff; font-family: "Segoe UI", system-ui, sans-serif; color: #1F2A44; }
.bogen { position: absolute; left: 0; top: 0; width: 1440px; padding: 36px 40px 30px; box-sizing: border-box; }
h1 { margin: 0 0 22px; font-size: 22px; font-weight: 600; }
h1 small { font-weight: 400; color: #5f6368; margin-left: 12px; font-size: 14px; }
.reihe { display: flex; gap: 32px; }
section { flex: 1; min-width: 0; }
h2 { font-size: 15px; font-weight: 600; margin: 0 0 12px; }
.quadrat { display: block; width: 100%; aspect-ratio: 1; border: 1px solid #e3e3e3; box-sizing: border-box; }
.rund { display: block; width: 100%; aspect-ratio: 1; border-radius: 50%; margin-top: 18px; object-fit: cover; }
.google { margin-top: 18px; padding: 12px 14px; background: #f1f3f4; border-radius: 10px; display: flex; align-items: center; gap: 12px; }
.google .rund { margin: 0; }
.klein { width: 64px; height: 64px; } .winzig { width: 36px; height: 36px; margin-left: auto; }
.name { font-size: 16px; font-weight: 500; }
p { margin: 12px 0 0; font-size: 12px; color: #5f6368; }
</style></head><body><div class="bogen">
<h1>Google-Unternehmensprofil &middot; Profilbild (Logo)<small>oben quadratisch (Datei), Mitte rund (Maps, Suche), unten so klein wie in Listen</small></h1>
<div class="reihe">${spalten}</div>
</div></body></html>`;
}

// ---------------------------------------------------------------- Pruefung

/** Render ohne Grund: jedes sichtbare Pixel muss im Sicherheitskreis liegen. */
async function pruefeKreis(rohPng) {
  const n = SEITE * DSF;
  const { data } = await sharp(rohPng)
    .extract({ left: 0, top: 0, width: n, height: n })
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const mitte = (n - 1) / 2, radius = n / 2;
  let maxAbstand = 0, anzahl = 0, minX = n, maxX = -1, minY = n, maxY = -1;
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (data[(y * n + x) * 4 + 3] < 12) continue;
      anzahl++;
      const d = Math.hypot(x - mitte, y - mitte) / radius;
      if (d > maxAbstand) maxAbstand = d;
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
  }
  if (anzahl === 0) throw new Error('Kreispruefung: kein Inhalt gefunden - Schrift oder Sigel nicht gerendert?');
  if (maxAbstand > SICHER) {
    throw new Error(`Inhalt ragt bis ${(maxAbstand * 100).toFixed(1)} % des Kreisradius, erlaubt sind ${SICHER * 100} %.`);
  }
  return {
    prozent: (maxAbstand * 100).toFixed(1),
    rahmen: [minX, minY, maxX - minX + 1, maxY - minY + 1].map((v) => Math.round(v / DSF)),
  };
}

// ---------------------------------------------------------------- Ablauf

mkdirSync(ARBEIT, { recursive: true });
mkdirSync(ZIEL, { recursive: true });

const { svg: sigel, verhaeltnis } = await sigelInline();
console.log(`Sigel: Seitenverhaeltnis ${verhaeltnis.toFixed(3)} (hoch zu breit)`);
const fonts = schriftenCss();
const fertig = [];

for (const v of VARIANTEN) {
  const name = `profilbild-${v.grund}-${v.claim ? 'mit' : 'ohne'}-claim`;
  const html = join(ARBEIT, `${name}.html`);
  const htmlPruef = join(ARBEIT, `${name}-nur-inhalt.html`);
  const roh = join(ARBEIT, `${name}-roh.png`);
  const rohPruef = join(ARBEIT, `${name}-nur-inhalt.png`);
  writeFileSync(html, bildHtml({ ...v, nurInhalt: false }, sigel, fonts), 'utf8');
  writeFileSync(htmlPruef, bildHtml({ ...v, nurInhalt: true }, sigel, fonts), 'utf8');

  // Fenster groesser als das Bild, Beschnitt ab (0,0): so ist es egal, ob Chrome
  // vom Fenstermass noch etwas fuer Rahmen abzieht.
  schiesse(html, roh, SEITE + 200, SEITE + 200);
  schiesse(htmlPruef, rohPruef, SEITE + 200, SEITE + 200);

  const kreis = await pruefeKreis(rohPruef);

  const ziel = join(ZIEL, `${name}.png`);
  await sharp(roh)
    .extract({ left: 0, top: 0, width: SEITE * DSF, height: SEITE * DSF })
    .resize(SEITE, SEITE, { kernel: 'lanczos3' })
    .removeAlpha()
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(ziel);

  const meta = await sharp(ziel).metadata();
  if (meta.width !== SEITE || meta.height !== SEITE) throw new Error(`${name}: Ausgabe ${meta.width}x${meta.height} statt ${SEITE}x${SEITE}.`);
  const kb = Math.round(statSync(ziel).size / 1024);
  if (kb > MAX_KB) throw new Error(`${name}: ${kb} KB, Google erlaubt hoechstens ${MAX_KB} KB.`);

  console.log(`  ${name}.png  ${meta.width}x${meta.height}  ${kb} KB  Inhalt ${kreis.rahmen.join('/')} (x/y/b/h)  bis ${kreis.prozent} % des Kreisradius`);
  fertig.push({ name, pfad: ziel, titel: v.titel, kb, prozent: kreis.prozent });
}

// Vorschaubogen
const vorschauHtmlPfad = join(ARBEIT, 'vorschau.html');
const vorschauRoh = join(ARBEIT, 'vorschau-roh.png');
writeFileSync(vorschauHtmlPfad, vorschauHtml(fertig), 'utf8');
const VORSCHAU_B = 1440, VORSCHAU_H = 1000;
schiesse(vorschauHtmlPfad, vorschauRoh, VORSCHAU_B, VORSCHAU_H);
const vorschauZiel = join(ZIEL, 'vorschau.jpg');
await sharp(vorschauRoh)
  .extract({ left: 0, top: 0, width: VORSCHAU_B * DSF, height: VORSCHAU_H * DSF })
  .flatten({ background: '#ffffff' })
  .jpeg({ quality: 88, progressive: true, mozjpeg: true })
  .toFile(vorschauZiel);
console.log(`  vorschau.jpg  ${VORSCHAU_B * DSF}x${VORSCHAU_H * DSF}  ${Math.round(statSync(vorschauZiel).size / 1024)} KB`);
console.log(`\nfertig: ${ZIEL}`);
