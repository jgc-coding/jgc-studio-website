#!/usr/bin/env node
/**
 * Variante 18 — Umsetzung der /improve-Befunde aus Runde 2 (2026-07-25).
 *
 * Assertion-guardetes Transform nach dem Muster aus scripts/v18/: jede
 * Ersetzung nennt ihre erwartete Trefferzahl und wirft, wenn sie nicht
 * exakt stimmt. Das Skript ist idempotent — ein zweiter Lauf erkennt den
 * Zielzustand und bricht sauber ab, statt doppelt zu ersetzen.
 *
 * Umgesetzte Befunde (siehe verbesserungen.md):
 *   V2  Kontaktweg: Knopf in #kontakt zeigte auf sich selbst -> mailto
 *   V7  Skin-Ebene hebelte den .js-Schutz der Reveal-Regeln aus
 *   V8  Deko-Verlauf haengt an nth-child -> auf IDs umgestellt
 *   V11 Kontrast unter WCAG AA (Primaerknopf + Kleintexte)
 *   V12 og:image / twitter:image fehlten
 *   V14 LinkedIn-Fusszeilenlink zeigte auf die LinkedIn-Startseite
 *
 * Aufruf:  node scripts/v18/transform-improve-runde2.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Pfad relativ zum Skript, nie absolut hartkodiert (Lehre aus V16).
const TARGET = fileURLToPath(new URL('../../variants/standalone/18-lumen/index.html', import.meta.url));

const KONTAKT_MAIL = 'kontakt@jgc-lumen.de';
const OG_BILD = 'https://jgc-coding.github.io/jgc-studio-website/og-bild.jpg';

let html = readFileSync(TARGET, 'utf8');
const AUSGANG = html;
const protokoll = [];

/** Ersetzt und erzwingt die erwartete Trefferzahl. */
function ersetze(beschreibung, suchen, ersetzen, erwartet = 1) {
  const treffer = html.split(suchen).length - 1;
  if (treffer !== erwartet) {
    throw new Error(
      `[${beschreibung}] erwartet ${erwartet} Treffer, gefunden ${treffer}.\n` +
      `Gesucht: ${String(suchen).slice(0, 120)}`
    );
  }
  html = html.split(suchen).join(ersetzen);
  protokoll.push(`  ok  ${beschreibung} (${treffer}x)`);
}

/** Wirft, wenn das Muster nach allen Ersetzungen noch vorhanden ist. */
function darfNichtMehrVorkommen(beschreibung, muster) {
  const treffer = html.split(muster).length - 1;
  if (treffer !== 0) {
    throw new Error(`[${beschreibung}] kommt noch ${treffer}x vor: ${String(muster).slice(0, 100)}`);
  }
}

// Idempotenz: ist die Datei bereits umgebaut, nichts tun.
if (html.includes(`mailto:${KONTAKT_MAIL}`)) {
  console.log('Variante 18 traegt die Runde-2-Aenderungen bereits — nichts zu tun.');
  process.exit(0);
}

// ---------------------------------------------------------------------------
// V2 — Kontaktweg. Der Knopf in der Final-CTA-Sektion zeigte auf "#kontakt",
// also auf die Sektion, in der er selbst steht. Damit endete der einzige
// Konversionsweg der Seite im Nichts. Nur DIESER Knopf wird umgehaengt; die
// uebrigen "#kontakt"-Verweise (Navigation, Angebote) sind korrekte Sprung-
// marken auf die Sektion und bleiben.
// ---------------------------------------------------------------------------
{
  const start = html.indexOf('id="kontakt"');
  if (start === -1) throw new Error('[V2] Sektion id="kontakt" nicht gefunden.');
  const knopf = '<a href="#kontakt" class="btn-primary !px-7 !py-3.5 !text-[1rem]">';
  const pos = html.indexOf(knopf, start);
  if (pos === -1) throw new Error('[V2] Primaerknopf in #kontakt nicht gefunden.');
  if (html.indexOf(knopf, pos + 1) !== -1) throw new Error('[V2] Knopf-Markup ist nicht eindeutig.');

  const betreff = encodeURIComponent('Erstgespräch — Anfrage über die Website');
  const rumpf = encodeURIComponent(
    'Hallo Gabriel,\n\n' +
    'ich würde gern ein Erstgespräch führen.\n\n' +
    'Wo ich gerade Zeit verliere:\n\n\n' +
    'So erreichst du mich am besten:\n\n'
  );
  const neuerKnopf =
    `<a href="mailto:${KONTAKT_MAIL}?subject=${betreff}&body=${rumpf}" ` +
    'class="btn-primary !px-7 !py-3.5 !text-[1rem]">';

  html = html.slice(0, pos) + neuerKnopf + html.slice(pos + knopf.length);
  protokoll.push('  ok  V2 Primaerknopf in #kontakt -> mailto (1x)');

  // Sichtbare Adresse darunter: greift auch dann, wenn kein Mailprogramm
  // eingerichtet ist (dann passiert beim mailto-Klick nichts sichtbares).
  const stilprobeZeile =
    '<a href="#stilprobe" class="link-underline font-sans text-[0.95rem] text-anthrazit/70 hover:text-kupfer transition-colors duration-200">oder starte mit der Stilprobe →</a>';
  ersetze(
    'V2 sichtbare Kontaktadresse unter dem Knopf',
    stilprobeZeile,
    '<p class="font-sans text-[0.95rem] text-anthrazit/70">Oder schreib mir direkt: ' +
    `<a href="mailto:${KONTAKT_MAIL}" class="link-underline text-kupfer hover:text-tinte transition-colors duration-200">${KONTAKT_MAIL}</a>` +
    '</p> ' + stilprobeZeile,
    1
  );
}

// ---------------------------------------------------------------------------
// V7 — Ohne JavaScript blieben 68 % des Seiteninhalts unsichtbar. Die
// Basis-Ebene versteckt Reveal-Bloecke korrekt nur bei aktivem JS
// (".js .reveal:not(.is-visible)"), die Skin-Ebene setzte dieselbe Regel
// ohne diesen Vorsatz und hat den Schutz damit aufgehoben.
// ---------------------------------------------------------------------------
ersetze(
  'V7 .js-Schutz fuer .reveal (Skin-Ebene)',
  '.reveal:not(.is-visible){\n  opacity:0;\n  transform:translateY(22px);\n  filter:blur(4px);\n}',
  '.js .reveal:not(.is-visible){\n  opacity:0;\n  transform:translateY(22px);\n  filter:blur(4px);\n}',
  1
);
ersetze(
  'V7 .js-Schutz fuer .reveal-stagger (Skin-Ebene)',
  '.reveal-stagger:not(.is-visible) > *{ opacity:0; transform:translateY(18px); }',
  '.js .reveal-stagger:not(.is-visible) > *{ opacity:0; transform:translateY(18px); }',
  1
);

// ---------------------------------------------------------------------------
// V8 — Die beiden Hervorhebungs-Verlaeufe hingen an der Geschwister-Position
// (":nth-child(N of .bg-pergament)"). Der Einbau der Stilprobe-Sektion am
// 2026-07-11 hat alles danach um eine Position verschoben: Der Verlauf, der
// laut Kommentar fuer "Passt fuer dich / nicht" gedacht war, lag seitdem auf
// den Platzhalter-Stimmen. Jetzt an stabile IDs gebunden.
// ---------------------------------------------------------------------------
{
  // IDs an die drei betroffenen Sektionen haengen (Reihenfolge im Dokument
  // beachten: erst die spaeteste ersetzen waere unnoetig, die Marker sind
  // ueber ihren Folgetext eindeutig).
  const sektion = '<section class="section bg-pergament">';
  const marker = [
    ['vorher-nachher', 'Was sich verändert, wenn KI deine Sprache spricht.'],
    ['stimmen', 'Was Kunden über die Arbeit sagen.'],
    ['passt', 'Lass uns schauen, ob das passt.'],
  ];
  for (const [id, ueberschrift] of marker) {
    const textPos = html.indexOf(ueberschrift);
    if (textPos === -1) throw new Error(`[V8] Ueberschrift nicht gefunden: ${ueberschrift}`);
    const secPos = html.lastIndexOf(sektion, textPos);
    if (secPos === -1) throw new Error(`[V8] Start-Tag vor "${ueberschrift}" nicht gefunden.`);
    html = html.slice(0, secPos) +
      `<section id="${id}" class="section bg-pergament">` +
      html.slice(secPos + sektion.length);
    protokoll.push(`  ok  V8 id="${id}" gesetzt (1x)`);
  }

  ersetze(
    'V8 Verlauf 1 auf ID umgestellt',
    'section.bg-pergament:nth-child(1 of .bg-pergament){',
    'section#vorher-nachher.bg-pergament{',
    1
  );
  ersetze(
    'V8 Verlauf 2 auf ID umgestellt',
    'section.bg-pergament:nth-child(5 of .bg-pergament){',
    'section#passt.bg-pergament{',
    1
  );
  ersetze(
    'V8 Kommentar Verlauf 1',
    '/* [pergament 1] Vorher-Nachher -- warm second surface (today vs tomorrow) */',
    '/* #vorher-nachher -- warm second surface (today vs tomorrow) */',
    1
  );
  ersetze(
    'V8 Kommentar Verlauf 2',
    '/* [pergament 5] "Passt fuer dich / nicht" -- warm second surface again */',
    '/* #passt -- warm second surface again */',
    1
  );
  // Die Positions-Landkarte im Kopfkommentar stimmte nach dem Stilprobe-Einbau
  // nicht mehr und beschreibt jetzt ohnehin nichts Tragendes mehr.
  ersetze(
    'V8 veraltete Positions-Landkarte ersetzt',
    `/* DOM section order (stable hooks):
   1 hero(bg-tinte) . 2 einordnung(salbei-soft) . 3 vorher-nachher(.bg-pergament)
   4 #angebote . 5 #wer . 6 stimmen(.bg-pergament) . 7 passt(.bg-pergament)
   8 #grundwerte(salbei-medium) . 9 FAQ(.bg-pergament) . 10 #kontakt(salbei-final)

   .bg-pergament siblings in order: [1]vorher-nachher [2]#angebote [3]#wer
   [4]stimmen [5]passt [6]FAQ. Re-tone all to layered paper, then assign an
   alternating warm/cool wash so the long scroll gets a beat. */`,
    `/* Alle Pergament-Sektionen auf denselben Papierton, danach zwei davon
   einen warmen Verlauf. Die Zuordnung laeuft ueber IDS, nicht ueber die
   Geschwister-Position: eine eingeschobene Sektion hat den Verlauf sonst
   still verschoben (passiert am 2026-07-11 mit der Stilprobe, siehe V8). */`,
    1
  );
}

// ---------------------------------------------------------------------------
// V11 — Kontrast. Der Primaerknopf lag mit 3,21:1 unter dem WCAG-AA-Wert von
// 4,5:1, ebenso 15 Kleintexte mit Deckkraft 0,55/0,6. Die Markenfarbe Kupfer
// bleibt fuer Raender, Eyebrows und Akzente unveraendert; nur die Knopf-
// flaeche wird eine Stufe tiefer gesetzt (#A55F2B = 4,79:1).
// ---------------------------------------------------------------------------
// Rechnerisch noetig sind mindestens 0,675 (anthrazit) bzw. 0,660 (tinte) auf
// dem dunkelsten Papierton; 0,70 (Hex b3) ist der naechste Wert der bestehenden
// Skala und damit die kleinste Aenderung, die sicher ueber 4,5:1 landet.
ersetze('V11 Kleintext anthrazit/55 -> Deckkraft 0,70', '.text-anthrazit\\/55{color:#2d2d2d8c}', '.text-anthrazit\\/55{color:#2d2d2db3}', 1);
ersetze('V11 Kleintext anthrazit/60 -> Deckkraft 0,70', '.text-anthrazit\\/60{color:#2d2d2d99}', '.text-anthrazit\\/60{color:#2d2d2db3}', 1);
ersetze('V11 Kleintext anthrazit/65 -> Deckkraft 0,70', '.text-anthrazit\\/65{color:#2d2d2da6}', '.text-anthrazit\\/65{color:#2d2d2db3}', 1);
ersetze('V11 Kleintext tinte/55 -> Deckkraft 0,70', '.text-tinte\\/55{color:#1f2a448c}', '.text-tinte\\/55{color:#1f2a44b3}', 1);
ersetze(
  'V11 Knopfflaeche auf AA-tauglichen Kupferton',
  '.btn-primary:hover{\n  transform:translateY(-2px);',
  '.btn-primary{ background-color:#A55F2B; }\n' +
  '.btn-primary:hover{ background-color:#8F4E22; }\n' +
  '.btn-primary:hover{\n  transform:translateY(-2px);',
  1
);

// ---------------------------------------------------------------------------
// V12 — og:image fehlte, waehrend twitter:card ein grosses Vorschaubild
// versprach ("summary_large_image"). Beim Teilen auf LinkedIn erschien
// dadurch eine leere Karte.
// ---------------------------------------------------------------------------
ersetze(
  'V12 og:image + twitter:image ergaenzt',
  '<meta property="og:url" content="https://jgc-coding.github.io/jgc-studio-website/">',
  '<meta property="og:url" content="https://jgc-coding.github.io/jgc-studio-website/">' +
  `<meta property="og:image" content="${OG_BILD}">` +
  '<meta property="og:image:width" content="1200">' +
  '<meta property="og:image:height" content="630">' +
  '<meta property="og:image:alt" content="JGC Lumen — Mehr Raum für das Wesentliche">' +
  `<meta name="twitter:image" content="${OG_BILD}">`,
  1
);

// ---------------------------------------------------------------------------
// V14 — Der LinkedIn-Eintrag in der Fusszeile zeigte auf die LinkedIn-
// Startseite statt auf ein Profil. Ein Vertrauens-Link, der nirgendwohin
// fuehrt, wirkt schlechter als gar keiner -> Eintrag entfernt, bis die echte
// Profil-URL vorliegt (steht in meine-todos.md).
// ---------------------------------------------------------------------------
{
  const start = html.indexOf('<li> <a href="https://www.linkedin.com"');
  if (start === -1) throw new Error('[V14] LinkedIn-Listeneintrag nicht gefunden.');
  const ende = html.indexOf('</li>', start);
  if (ende === -1) throw new Error('[V14] Ende des LinkedIn-Eintrags nicht gefunden.');
  const block = html.slice(start, ende + '</li>'.length);
  if (!block.includes('LinkedIn')) throw new Error('[V14] Gefundener Block enthaelt kein "LinkedIn".');
  if (block.length > 900) throw new Error(`[V14] Block unerwartet gross (${block.length} Zeichen).`);
  html = html.slice(0, start) + html.slice(ende + '</li>'.length);
  protokoll.push(`  ok  V14 LinkedIn-Eintrag entfernt (${block.length} Zeichen)`);
}

// ---------------------------------------------------------------------------
// Abschlusspruefungen
// ---------------------------------------------------------------------------
darfNichtMehrVorkommen('V8 Rest-nth-child', 'nth-child(1 of .bg-pergament)');
darfNichtMehrVorkommen('V8 Rest-nth-child', 'nth-child(5 of .bg-pergament)');
darfNichtMehrVorkommen('V14 Rest-LinkedIn', 'https://www.linkedin.com');
// Nur die Textfarb-Regeln pruefen: die blossen Hex-Werte kommen auch in
// Farbverlaeufen vor (z. B. hero-gradient-mobile) und sind dort korrekt.
darfNichtMehrVorkommen('V11 Rest-Kontrast', '.text-anthrazit\\/55{color:#2d2d2d8c}');
darfNichtMehrVorkommen('V11 Rest-Kontrast', '.text-anthrazit\\/60{color:#2d2d2d99}');
darfNichtMehrVorkommen('V11 Rest-Kontrast', '.text-anthrazit\\/65{color:#2d2d2da6}');
darfNichtMehrVorkommen('V11 Rest-Kontrast', '.text-tinte\\/55{color:#1f2a448c}');

if (html === AUSGANG) throw new Error('Nichts geaendert — das kann nicht stimmen.');
if (html.includes('\r\n')) throw new Error('CRLF im Ergebnis — die Datei muss reines LF bleiben.');

writeFileSync(TARGET, html, 'utf8');
console.log('Variante 18 umgebaut:');
protokoll.forEach((z) => console.log(z));
console.log(`\n  ${AUSGANG.length} -> ${html.length} Zeichen (${html.length - AUSGANG.length >= 0 ? '+' : ''}${html.length - AUSGANG.length})`);
