#!/usr/bin/env node
/**
 * extrahiere-inhalt.mjs
 *
 * Zieht den redaktionellen Inhalt einer minifizierten Single-File-Variante in
 * ein lesbares Markdown-Dokument.
 *
 * Warum es das gibt: Der Text der Live-Seite existiert nur EINMAL — eingebacken
 * in variants/standalone/18-lumen/index.html, 1,2 MB minifiziert, mit Schriften
 * und Bildern als base64. Wer eine neue Variante schreibt, braucht die Texte,
 * kann die Datei aber weder lesen noch durchsuchen. Dieses Skript macht daraus
 * eine Quelle, mit der man arbeiten kann.
 *
 * Es liest nur — die Variante wird nie veraendert.
 *
 * Aufruf:
 *   node scripts/v18/extrahiere-inhalt.mjs [QUELLE] [ZIEL]
 *
 * Defaults: QUELLE = variants/standalone/18-lumen/index.html
 *           ZIEL   = inhalt/lumen-inhalt.md
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';

const QUELLE = process.argv[2] || 'variants/standalone/18-lumen/index.html';
const ZIEL = process.argv[3] || 'inhalt/lumen-inhalt.md';

/* Erwartete Marker — schlaegt einer fehl, hat sich die Quelle so veraendert,
 * dass das Ergebnis nicht mehr blind uebernommen werden darf. */
const PFLICHT_SEKTIONEN = [
  'vorher-nachher', 'stilprobe', 'angebote', 'wer',
  'stimmen', 'passt', 'grundwerte', 'kontakt',
];
const MINDEST_ZEICHEN = 8000;

const BLOCK = new Set([
  'address', 'article', 'aside', 'blockquote', 'br', 'dd', 'div', 'dl', 'dt',
  'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4',
  'h5', 'h6', 'header', 'hr', 'label', 'legend', 'li', 'main', 'nav', 'ol', 'p',
  'section', 'summary', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul',
]);

const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', shy: '',
  ndash: '–', mdash: '—', hellip: '…', laquo: '«',
  raquo: '»', bdquo: '„', ldquo: '“', rdquo: '”',
  lsquo: '‚', rsquo: '’', szlig: 'ß', euro: '€',
  auml: 'ä', ouml: 'ö', uuml: 'ü',
  Auml: 'Ä', Ouml: 'Ö', Uuml: 'Ü',
  times: '×', middot: '·', bull: '•', deg: '°',
};

function entschluessle(text) {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#[xX]([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&([a-zA-Z]+);/g, (m, name) => (name in ENTITIES ? ENTITIES[name] : m))
    .replace(/­/g, '')   // weiches Trennzeichen zerhackt sonst Woerter
    .replace(/​/g, '');  // Nullbreiten-Leerzeichen
}

function main() {
  if (!existsSync(QUELLE)) {
    console.error(`Quelldatei nicht gefunden: ${QUELLE}`);
    process.exit(1);
  }

  const roh = readFileSync(QUELLE, 'utf8');

  // Alles wegwerfen, was kein redaktioneller Text ist. Reihenfolge zaehlt:
  // erst die base64-Bloecke, sonst arbeiten die spaeteren Regexe auf 1,2 MB.
  let html = roh
    .replace(/data:[^;,]*;base64,[A-Za-z0-9+/=]+/g, 'BASE64')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '');

  const kopf = html.match(/<head[\s\S]*?<\/head>/i)?.[0] ?? '';
  const titel = entschluessle(kopf.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '').trim();
  const beschreibung = entschluessle(
    kopf.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i)?.[1] ?? ''
  ).trim();

  const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? html;

  const zeilen = [];
  let puffer = [];
  let ueberschrift = 0;   // 1-6, wenn der Puffer in einem h-Tag steckt
  let listenpunkt = false;
  let istSummary = false;

  const flush = () => {
    const text = entschluessle(puffer.join('')).replace(/\s+/g, ' ').trim();
    puffer = [];
    if (!text) { ueberschrift = 0; listenpunkt = false; istSummary = false; return; }

    if (ueberschrift) zeilen.push('', '#'.repeat(Math.min(ueberschrift + 1, 6)) + ' ' + text, '');
    else if (istSummary) zeilen.push('', `**${text}**`, '');
    else if (listenpunkt) zeilen.push(`- ${text}`);
    else zeilen.push('', text);

    ueberschrift = 0;
    listenpunkt = false;
    istSummary = false;
  };

  for (const [token] of body.matchAll(/<[^>]+>|[^<]+/g)) {
    if (token[0] !== '<') { puffer.push(token); continue; }

    const schliessend = token[1] === '/';
    const name = token.slice(schliessend ? 2 : 1).match(/^[a-zA-Z][a-zA-Z0-9]*/)?.[0]?.toLowerCase();
    if (!name) continue;

    // Bilder mit Alternativtext festhalten — er ist redaktioneller Inhalt.
    if (name === 'img' && !schliessend) {
      const alt = entschluessle(token.match(/\salt=["']([^"']*)["']/i)?.[1] ?? '').trim();
      if (alt) { flush(); zeilen.push('', `> Bild: ${alt}`); }
      continue;
    }

    if (!BLOCK.has(name)) continue;

    if (!schliessend) {
      flush();
      const id = token.match(/\sid=["']([^"']+)["']/i)?.[1];
      if (name === 'section' && id) zeilen.push('', '---', '', `## Sektion \`#${id}\``);
      if (/^h[1-6]$/.test(name)) ueberschrift = Number(name[1]);
      if (name === 'li') listenpunkt = true;
      if (name === 'summary') istSummary = true;
    } else {
      flush();
    }
  }
  flush();

  const inhalt = zeilen
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\s+/, '')
    .trimEnd();

  // --- Plausibilitaet: lieber laut scheitern als eine halbe Quelle anlegen ---
  const fehlend = PFLICHT_SEKTIONEN.filter((id) => !inhalt.includes(`#${id}\``));
  if (fehlend.length) {
    console.error(`Fehlende Sektionen im Ergebnis: ${fehlend.join(', ')}`);
    console.error('Die Quelle hat sich strukturell geaendert — Skript pruefen, nichts geschrieben.');
    process.exit(1);
  }
  if (inhalt.length < MINDEST_ZEICHEN) {
    console.error(`Ergebnis nur ${inhalt.length} Zeichen (erwartet > ${MINDEST_ZEICHEN}). Nichts geschrieben.`);
    process.exit(1);
  }

  const kopfzeilen = [
    '<!-- Erzeugt von scripts/v18/extrahiere-inhalt.mjs — nicht von Hand pflegen,',
    `     sondern neu erzeugen, wenn sich ${QUELLE} aendert. -->`,
    '',
    '# Inhalt der Live-Seite (Variante 18 — JGC Lumen)',
    '',
    `Quelle: \`${QUELLE}\``,
    '',
    `**Seitentitel:** ${titel || '(keiner)'}`,
    '',
    `**Kurzbeschreibung:** ${beschreibung || '(keine)'}`,
    '',
    '---',
    '',
    '## Kopfbereich (Navigation und Hero)',
    '',
  ].join('\n') + '\n';

  mkdirSync(dirname(ZIEL), { recursive: true });
  writeFileSync(ZIEL, kopfzeilen + inhalt + '\n', 'utf8');

  console.log(`OK  ${QUELLE} (${roh.length} Zeichen) -> ${ZIEL} (${inhalt.length} Zeichen)`);
  console.log(`    ${PFLICHT_SEKTIONEN.length} Sektionen gefunden, Titel: "${titel}"`);
}

main();
