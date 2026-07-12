#!/usr/bin/env node
/**
 * transform-tuvlink-schritt2.mjs
 * ---------------------------------------------------------------------------
 * Zwei unabhaengige Aenderungen an der Standalone-Variante V18
 * (variants/standalone/18-lumen/index.html):
 *
 * (a) TUEV-Zertifikatsbild verlinken (T1 + T2)
 *     Das Pruefsiegel-Bild (Figure kurz vor dem Standort-Absatz) bekommt
 *     einen Link zur oeffentlichen Certipedia-Pruefseite des TUEV Rheinland
 *     (Pruefzeichen-ID 0217466495), damit Besucher das Zertifikat unabhaengig
 *     verifizieren koennen. Das Bild wird in ein <a target="_blank"> gewrappt:
 *     T1 fuegt das oeffnende <a ...> direkt vor <img ein, T2 das schliessende
 *     </a> direkt nach dem </img> (vor <figcaption>).
 *
 * (b) Angebots-Spalte "Schritt 2" (Praxis-Check) umbauen (T3 + T4 + T5)
 *     Bisher hatte die Spalte einen kurzen Anrechnungs-Hinweis im
 *     "Was du bekommst"-Aufklapper (T3 schneidet ihn dort heraus) UND
 *     zusaetzlich weiter unten, UNTER dem gesamten Spalten-Grid, einen
 *     separaten "Wunsch-Klienten"-Nachtrag-Absatz mit einem zweiten
 *     Anrechnungssatz (T5 entfernt diesen Nachtrag komplett). Neu: ans Ende
 *     der Schritt-2-Spalte selbst (T4, MUSS NACH T3 laufen) kommen zwei
 *     Bloecke - ein neuer "Express"-Passus ("Du weisst schon genau, was du
 *     willst?", die inhaltliche Kernaussage des alten Nachtrags, jetzt
 *     direkt in der Spalte statt separat darunter) und ein einzelner,
 *     konsolidierter Anrechnungs-Block. Ergebnis: Die Anrechnung wird nur
 *     noch 1x in der Spalte erklaert statt doppelt an zwei Stellen der Seite.
 *
 * Reihenfolge im Skript: T1, T2, T3 (schneiden), T4 (einfuegen ans
 * Spaltenende), T5 (schneiden). T3 muss vor T4 laufen, weil T4 den alten
 * Anrechnungstext in neuer Form ans Spaltenende schreibt - so findet das
 * Skript nicht versehentlich seine eigene Einfuegung als "alten" Block.
 *
 * Assertion-guarded, UTF-8 ohne BOM, ein einziger writeFile nach Pruefung.
 * Jeder Such-Anker wird unmittelbar vor seiner Verwendung nochmal frisch
 * gegen den aktuellen Zwischenstand gezaehlt (nicht nur einmal zu Beginn) -
 * weicht die Trefferzahl ab, fail() und die Zieldatei bleibt unangetastet.
 * Idempotenz-Guard: Enthaelt die Datei bereits "certipedia", bricht das
 * Skript sofort sauber ab (kein doppeltes Einfuegen bei erneutem Lauf).
 *
 *   node scripts/v18/transform-tuvlink-schritt2.mjs --dry   -> nur pruefen
 *   node scripts/v18/transform-tuvlink-schritt2.mjs         -> Backup + schreiben
 * ---------------------------------------------------------------------------
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const TARGET = fileURLToPath(new URL('../../variants/standalone/18-lumen/index.html', import.meta.url));
const BACKUP = String.raw`C:\Users\chime\AppData\Local\Temp\claude\C--Projekte-JGC-Studio--claude-worktrees-tuv-cert-offer-structure-b965cd\510c48a5-f1bb-4cee-839b-beaa7f72cb26\scratchpad\v18-backup-vor-tuvlink-schritt2.html`;

const DRY = process.argv.includes('--dry');

function cnt(s, lit) { let n = 0, i = 0; while ((i = s.indexOf(lit, i)) !== -1) { n++; i += lit.length; } return n; }
function fail(m) { console.error('\n=== ABBRUCH ===\n' + m + '\nZieldatei NICHT veraendert.\n'); process.exit(1); }

// --- T1: TUEV-Bild verlinken, oeffnendes <a> ---
const T1_OLD = 'style="max-width:440px;"><img';
const T1_NEW = 'style="max-width:440px;"><a href="https://www.certipedia.com/quality_marks/0217466495?locale=de" target="_blank" rel="noopener noreferrer" title="Zertifikat bei Certipedia (TÜV Rheinland) prüfen" style="display:block;"><img';

// --- T2: TUEV-Bild verlinken, schliessendes </a> ---
const T2_OLD = 'decoding="async"><figcaption class="mt-3 font-sans';
const T2_NEW = 'decoding="async"></a><figcaption class="mt-3 font-sans';

// --- T3: alten Anrechnungs-Block aus dem Aufklapper schneiden ---
const T3_START = '<div class="mt-3.5 pl-3 border-l-2 border-kupfer/40"';
const T3_ENDMARK = '</p> </div>';

// --- T4: Express-Passus + neuer Anrechnungs-Block ans Spaltenende ---
const T4_OLD = '</details> </div> <!-- Spalte B';
const EXPRESS = '<div class="mt-5 pt-3.5" style="border-top:1px solid rgba(217,199,168,0.75);" data-astro-cid-wpyotivm> <h4 class="font-serif text-tinte font-medium" style="font-size:1.1rem;" data-astro-cid-wpyotivm>Du weißt schon genau, was du willst?</h4> <p class="mt-3 font-sans text-[0.92rem] text-anthrazit/85 leading-[1.55]" data-astro-cid-wpyotivm>Gut. Vielleicht hast du bei einer Kollegin gesehen, was möglich ist, und willst genau das. Dann wird der Check kein Suchen, sondern ein Prüfen: Trägt dein Wunsch? Passt das Werkzeug zu deiner Praxis, deiner Stimme, deinen Daten? Was bei ihr funktioniert, braucht bei dir einen eigenen Zuschnitt — genau den legen wir fest.</p> </div>';
const ANRECHNUNG = '<div class="mt-3.5 pl-3 border-l-2 border-kupfer/40" data-astro-cid-wpyotivm> <p class="font-sans text-[0.88rem] text-anthrazit/75 leading-[1.5]" data-astro-cid-wpyotivm> <span class="font-medium text-tinte" data-astro-cid-wpyotivm>Anrechnung: </span>Entscheidest du dich für eine Umsetzung, rechne ich die 600 € vollständig an — der Check kostet dich dann nichts extra.</p> </div>';
const T4_NEW = '</details> ' + EXPRESS + ' ' + ANRECHNUNG + ' </div> <!-- Spalte B';

// --- T5: separaten Nachtrag-Block unter dem Spalten-Grid entfernen ---
const T5_START = '<!-- Wunsch-Klienten-Passage';
const T5_ENDMARK = '<!-- Querzeile -->';

const html = await readFile(TARGET, 'utf8');
const origLen = html.length;
const origBase64 = cnt(html, ';base64,');

// --- Idempotenz-Guard ---
if (cnt(html, 'certipedia') >= 1) {
  fail('Datei enthaelt bereits "certipedia" - scheint schon transformiert zu sein. Abbruch (kein doppeltes Einfuegen).');
}

// --- Vorher-Guards ---
if (cnt(html, 'id="stilprobe"') !== 1) fail(`Erwarte 'id="stilprobe"' genau 1x (Identitaets-Check V18), gefunden ${cnt(html, 'id="stilprobe"')}.`);
if (cnt(html, T1_OLD) !== 1) fail(`Erwarte T1-Anker genau 1x, gefunden ${cnt(html, T1_OLD)}.`);
if (cnt(html, T2_OLD) !== 1) fail(`Erwarte T2-Anker genau 1x, gefunden ${cnt(html, T2_OLD)}.`);
if (cnt(html, T3_START) !== 1) fail(`Erwarte T3-Start-Anker genau 1x, gefunden ${cnt(html, T3_START)}.`);
if (cnt(html, T4_OLD) !== 1) fail(`Erwarte T4-Anker genau 1x, gefunden ${cnt(html, T4_OLD)}.`);
if (cnt(html, T5_START) !== 1) fail(`Erwarte T5-Start-Anker genau 1x, gefunden ${cnt(html, T5_START)}.`);
if (cnt(html, 'certipedia') !== 0) fail(`Erwarte 'certipedia' 0x vorher, gefunden ${cnt(html, 'certipedia')}.`);
if (cnt(html, 'target="_blank"') !== 1) fail(`Erwarte 'target="_blank"' genau 1x vorher, gefunden ${cnt(html, 'target="_blank"')}.`);
if (cnt(html, 'rechne ich die 600 € vollständig an') !== 3) fail(`Erwarte Anrechnungs-Satz 3x vorher, gefunden ${cnt(html, 'rechne ich die 600 € vollständig an')}.`);
if (cnt(html, 'Du weißt schon genau, was du willst?') !== 1) fail(`Erwarte Express-Frage 1x vorher, gefunden ${cnt(html, 'Du weißt schon genau, was du willst?')}.`);

console.log('Vorher-Guards OK:');
console.log(`  id="stilprobe" = 1, T1_OLD = 1, T2_OLD = 1, T3_START = 1, T4_OLD = 1, T5_START = 1`);
console.log(`  certipedia = 0, target="_blank" = 1, Anrechnungs-Satz = 3, Express-Frage = 1`);
console.log(`  Ausgangslaenge ${origLen} Zeichen, ;base64, = ${origBase64}x`);

let s = html;
let insertedTotal = 0;
let removedTotal = 0;

// --- T1 anwenden ---
{
  const n = cnt(s, T1_OLD);
  if (n !== 1) fail(`T1: erwarte 1x Anker unmittelbar vor Anwendung, gefunden ${n}.`);
  s = s.split(T1_OLD).join(T1_NEW);
  insertedTotal += T1_NEW.length;
  removedTotal += T1_OLD.length;
}

// --- T2 anwenden ---
{
  const n = cnt(s, T2_OLD);
  if (n !== 1) fail(`T2: erwarte 1x Anker unmittelbar vor Anwendung, gefunden ${n}.`);
  s = s.split(T2_OLD).join(T2_NEW);
  insertedTotal += T2_NEW.length;
  removedTotal += T2_OLD.length;
}

// --- T3 anwenden: alten Anrechnungs-Block schneiden ---
{
  const n = cnt(s, T3_START);
  if (n !== 1) fail(`T3: erwarte Start-Anker 1x unmittelbar vor Anwendung, gefunden ${n}.`);
  const start = s.indexOf(T3_START);
  const markPos = s.indexOf(T3_ENDMARK, start);
  if (markPos === -1) fail('T3: End-Marker "</p> </div>" ab Start-Anker nicht gefunden.');
  const end = markPos + T3_ENDMARK.length;
  const block = s.slice(start, end);
  if (!block.includes('Anrechnung: </span>')) fail('T3-Block enthaelt nicht "Anrechnung: </span>" - Abbruch, falscher Block getroffen.');
  if (!block.includes('rechne ich die 600 € vollständig an')) fail('T3-Block enthaelt nicht den Anrechnungssatz - Abbruch, falscher Block getroffen.');
  if (block.length >= 700) fail(`T3-Block zu lang (${block.length} Zeichen, erwartet < 700) - vermutlich falscher End-Marker getroffen.`);
  let cutStart = start;
  if (s[cutStart - 1] === ' ') cutStart -= 1; // fuehrendes Leerzeichen mitnehmen, sonst Doppel-Space
  removedTotal += (end - cutStart);
  s = s.slice(0, cutStart) + s.slice(end);
  console.log(`T3: Block geschnitten (${block.length} Zeichen Inhalt, ${end - cutStart} inkl. Leerzeichen-Trim).`);
}

// --- T4 anwenden: Express-Passus + neuer Anrechnungs-Block ans Spaltenende ---
{
  const n = cnt(s, T4_OLD);
  if (n !== 1) fail(`T4: erwarte 1x Anker unmittelbar vor Anwendung (nach T3), gefunden ${n}.`);
  s = s.split(T4_OLD).join(T4_NEW);
  insertedTotal += T4_NEW.length;
  removedTotal += T4_OLD.length;
}

// --- T5 anwenden: separaten Nachtrag-Block entfernen ---
{
  const n = cnt(s, T5_START);
  if (n !== 1) fail(`T5: erwarte Start-Anker 1x unmittelbar vor Anwendung, gefunden ${n}.`);
  const start = s.indexOf(T5_START);
  const end = s.indexOf(T5_ENDMARK, start);
  if (end === -1) fail('T5: End-Marker "<!-- Querzeile -->" ab Start-Anker nicht gefunden.');
  const block = s.slice(start, end);
  if (!block.includes('Du weißt schon genau, was du willst?')) fail('T5-Block enthaelt nicht die Express-Frage - Abbruch, falscher Block getroffen.');
  if (!block.includes('nichts extra.')) fail('T5-Block enthaelt nicht "nichts extra." - Abbruch, falscher Block getroffen.');
  if (block.length >= 1300) fail(`T5-Block zu lang (${block.length} Zeichen, erwartet < 1300) - vermutlich falscher End-Marker getroffen.`);
  removedTotal += (end - start);
  s = s.slice(0, start) + s.slice(end);
  console.log(`T5: Block geschnitten (${block.length} Zeichen), Querzeile-Kommentar bleibt stehen.`);
}

// --- Nachher-Guards ---
if (cnt(s, 'certipedia') !== 1) fail(`Nachher: 'certipedia' erwartet 1x, gefunden ${cnt(s, 'certipedia')}.`);
if (cnt(s, 'target="_blank"') !== 2) fail(`Nachher: 'target="_blank"' erwartet 2x, gefunden ${cnt(s, 'target="_blank"')}.`);
if (cnt(s, 'Du weißt schon genau, was du willst?') !== 1) fail(`Nachher: Express-Frage erwartet 1x, gefunden ${cnt(s, 'Du weißt schon genau, was du willst?')}.`);
if (cnt(s, 'Wunsch-Klienten-Passage') !== 0) fail(`Nachher: 'Wunsch-Klienten-Passage' erwartet 0x, gefunden ${cnt(s, 'Wunsch-Klienten-Passage')}.`);
if (cnt(s, 'rechne ich die 600 € vollständig an') !== 2) fail(`Nachher: Anrechnungssatz erwartet 2x, gefunden ${cnt(s, 'rechne ich die 600 € vollständig an')}.`);
if (cnt(s, 'Anrechnung: </span>') !== 1) fail(`Nachher: 'Anrechnung: </span>' erwartet 1x, gefunden ${cnt(s, 'Anrechnung: </span>')}.`);
if (cnt(s, 'Check kostet dich dann nichts extra') !== 1) fail(`Nachher: 'Check kostet dich dann nichts extra' erwartet 1x, gefunden ${cnt(s, 'Check kostet dich dann nichts extra')}.`);
if (cnt(s, 'max-width:440px') !== 1) fail(`Nachher: 'max-width:440px' erwartet 1x, gefunden ${cnt(s, 'max-width:440px')}.`);
if (cnt(s, ';base64,') !== origBase64) fail(`Nachher: base64-Bloecke veraendert (vorher ${origBase64}, nachher ${cnt(s, ';base64,')}).`);

const delta = s.length - origLen;
const expectedDelta = insertedTotal - removedTotal;
if (delta !== expectedDelta) fail(`Laengen-Delta stimmt nicht: Datei-Delta ${delta}, erwartet ${expectedDelta} (eingefuegt ${insertedTotal} - entfernt ${removedTotal}).`);

console.log('\nNachher-Guards OK:');
console.log(`  certipedia = 1, target="_blank" = 2, Express-Frage = 1, Wunsch-Klienten-Passage = 0`);
console.log(`  Anrechnungs-Satz = 2, Anrechnung: </span> = 1, "...nichts extra" = 1, max-width:440px = 1`);
console.log(`  ;base64, = ${origBase64} (unveraendert)`);
console.log(`  Laengen-Delta ${delta} Zeichen (eingefuegt ${insertedTotal}, entfernt ${removedTotal}) - stimmt exakt.${DRY ? '  [DRY]' : ''}`);

if (DRY) {
  console.log('\n--dry: nichts geschrieben.');
  process.exit(0);
}

await writeFile(BACKUP, html, 'utf8');
await writeFile(TARGET, s, 'utf8');
console.log('\nGeschrieben:', TARGET);
console.log('Backup:', BACKUP);
