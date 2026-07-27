#!/usr/bin/env node
/**
 * kodiere.mjs — Rohmaterial der Scroll-Welt in auslieferbare Assets verwandeln.
 *
 * Erzeugt je Etappe vier Dateien:
 *   <name>.mp4          Desktop-Fassung, native Aufloesung, kleine Bildgruppen (fluessiges Scrubben)
 *   <name>-m.mp4        Handy-Fassung, kleiner und mit doppelt so vielen Ankerbildern
 *   <name>-poster.jpg   erstes Bild der KODIERTEN Datei — nicht des Rohvideos und nicht
 *                       des Stills, sonst springt das Bild im Moment, wo das Video uebernimmt
 *   <name>-still.jpg    Standbild fuer Besucher, die Bewegung abgeschaltet haben
 *
 * Idempotent: was schon da ist, wird uebersprungen. Damit kostet ein Abbruch nichts,
 * und eine einzelne nachgereichte Etappe laeuft in Sekunden durch:
 *
 *   node scripts/der-weg/kodiere.mjs 6        nur Etappe 6 (ueberschreibt sie)
 *   node scripts/der-weg/kodiere.mjs          alles Fehlende
 *   node scripts/der-weg/kodiere.mjs --alles  alles neu
 *
 * Danach immer `node scripts/der-weg/pruefe-naehte.mjs` laufen lassen: eine
 * ausgetauschte Etappe beruehrt IMMER zwei Uebergaenge, den davor und den danach.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

/* Rohmaterial liegt bewusst ausserhalb des Repos — 100 MB Quelldateien gehoeren
 * nicht in die Versionsverwaltung. Nur die kodierten Assets werden eingecheckt. */
const ROH = process.env.DERWEG_ROH || 'C:/Projekte/JGC Studio/Scroll World/legs';
const ZIEL = resolve(process.argv[2]?.startsWith('--') ? 'der-weg/assets' : 'der-weg/assets');

/* Reihenfolge und Namen der Etappen. Der Name ist die Szene, in der die Etappe
 * ANKOMMT — die Kamera faehrt waehrend der Etappe dorthin. */
/* `vorlauf` schneidet Bilder am ANFANG einer Etappe weg. Manche Etappen haben
 * einen kurzen Anlauf, in dem die Kamera erst von der Anschlussstelle wegdriftet
 * und dann zurueckkommt — genau das erzeugt den sichtbaren Ruck an der Naht
 * davor. Gemessen am Rohmaterial (SSIM gegen das letzte Bild der Vor-Etappe):
 *
 *   Etappe 3, Bild 0: 0.38  Bild 1: 0.39  Bild 2: 0.59  Bild 3: 0.60  Bild 4: 0.45
 *
 * Ab Bild 4 faellt es wieder — Bild 3 ist also der beste Anschluss, nicht Bild 0.
 * Drei Bilder von 193 sind 1,6 % der Etappe, inhaltlich also nichts.
 * Zum Nachmessen: scripts/der-weg/pruefe-naehte.mjs
 */
const ETAPPEN = [
  { nr: 1, name: 'anflug' },
  { nr: 2, name: 'werkzeug' },
  { nr: 3, name: 'schreibtisch', vorlauf: 3 },
  { nr: 4, name: 'stilprobe' },
  { nr: 5, name: 'weg' },
  { nr: 6, name: 'lichtung' },
  { nr: 7, name: 'aussicht' },
];

const args = process.argv.slice(2);
const alles = args.includes('--alles');
const nurNr = args.find((a) => /^\d+$/.test(a));

function ff(bin, argv) {
  return execFileSync(bin, argv, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function mass(datei) {
  const out = ff('ffprobe', [
    '-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height',
    '-of', 'csv=p=0:s=x', datei,
  ]).trim();
  return out;
}

function mb(datei) {
  return (statSync(datei).size / 1048576).toFixed(1);
}

/* Schneidet die ersten `vorlauf` Bilder weg. `setpts` setzt die Zeitachse danach
 * wieder auf null — ohne das begaenne die Datei mit einer Luecke. */
function vorlaufSchnitt(vorlauf) {
  return vorlauf > 0 ? `select=gte(n\\,${vorlauf}),setpts=PTS-STARTPTS,` : '';
}

/* Desktop: native Aufloesung behalten. Hochskalieren wuerde nur Bytes kosten und
 * keine Bildinformation hinzufuegen — das Rohmaterial ist, was es ist. */
function kodiereDesktop(quelle, ziel, vorlauf = 0) {
  ff('ffmpeg', [
    '-v', 'error', '-y', '-i', quelle,
    '-an', '-vf', vorlaufSchnitt(vorlauf) + 'unsharp=5:5:0.8:5:5:0.0',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '20',
    '-pix_fmt', 'yuv420p',
    '-g', '8', '-keyint_min', '8', '-sc_threshold', '0',
    '-movflags', '+faststart', ziel,
  ]);
}

/* Handy: kleineres Bild UND doppelt so viele Ankerbilder. Der zweite Punkt ist der
 * wichtigere — beim Scrubben muss der Decoder ab dem naechsten Ankerbild neu
 * aufbauen, und genau das ist auf Telefonen teuer. */
function kodiereMobil(quelle, ziel, vorlauf = 0) {
  ff('ffmpeg', [
    '-v', 'error', '-y', '-i', quelle,
    '-an', '-vf', vorlaufSchnitt(vorlauf) + 'scale=-2:600,unsharp=5:5:0.6:5:5:0.0',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '23',
    '-pix_fmt', 'yuv420p',
    '-g', '4', '-keyint_min', '4', '-sc_threshold', '0',
    '-movflags', '+faststart', ziel,
  ]);
}

function ersteBild(quelle, ziel, breite) {
  ff('ffmpeg', [
    '-v', 'error', '-y', '-ss', '0', '-i', quelle,
    '-frames:v', '1', '-vf', `scale=${breite}:-2`, '-q:v', '4', ziel,
  ]);
}

function main() {
  if (!existsSync(ROH)) {
    console.error(`Rohmaterial nicht gefunden: ${ROH}`);
    console.error('Anderen Ort per Umgebungsvariable DERWEG_ROH setzen.');
    process.exit(1);
  }
  mkdirSync(ZIEL, { recursive: true });

  const zuTun = nurNr ? ETAPPEN.filter((e) => String(e.nr) === nurNr) : ETAPPEN;
  if (!zuTun.length) {
    console.error(`Keine Etappe mit Nummer ${nurNr}. Bekannt: 1-7.`);
    process.exit(1);
  }

  let getan = 0;
  let uebersprungen = 0;

  for (const { nr, name, vorlauf = 0 } of zuTun) {
    const quelle = join(ROH, `leg ${nr}.mp4`);
    if (!existsSync(quelle)) {
      console.error(`::warnung:: Etappe ${nr} (${name}): Quelldatei fehlt: ${quelle}`);
      continue;
    }

    const desk = join(ZIEL, `${name}.mp4`);
    const mobil = join(ZIEL, `${name}-m.mp4`);
    const poster = join(ZIEL, `${name}-poster.jpg`);
    const posterM = join(ZIEL, `${name}-poster-m.jpg`);
    const still = join(ZIEL, `${name}-still.jpg`);

    /* Eine ausdruecklich genannte Nummer wird immer neu gemacht — das ist der
     * Nachreich-Fall. Ohne Nummer zaehlt nur, was fehlt. */
    const neu = alles || Boolean(nurNr);
    if (!neu && existsSync(desk) && existsSync(mobil) && existsSync(poster) && existsSync(still)) {
      console.log(`  --  ${name}: liegt schon vor`);
      uebersprungen++;
      continue;
    }

    process.stdout.write(`  ->  ${name} (Etappe ${nr}, ${mass(quelle)}`
      + (vorlauf ? `, ${vorlauf} Bilder Vorlauf ab` : '') + ') ');
    kodiereDesktop(quelle, desk, vorlauf);
    process.stdout.write('Desktop ');
    kodiereMobil(quelle, mobil, vorlauf);
    process.stdout.write('Handy ');

    // Poster kommen aus den KODIERTEN Dateien, damit das erste gezeigte Bild
    // exakt das ist, was das Video danach zeigt.
    ersteBild(desk, poster, 1112);
    ersteBild(mobil, posterM, 800);
    // Das Standbild darf aus der Desktop-Fassung kommen, es ersetzt das Video ganz.
    ersteBild(desk, still, 1112);
    process.stdout.write('Bilder ');

    console.log(`fertig (${mb(desk)} MB / ${mb(mobil)} MB)`);
    getan++;
  }

  const dateien = readdirSync(ZIEL);
  const summe = dateien
    .map((d) => statSync(join(ZIEL, d)).size)
    .reduce((a, b) => a + b, 0);

  console.log('');
  console.log(`${getan} Etappe(n) kodiert, ${uebersprungen} uebersprungen.`);
  console.log(`Auslieferbare Assets gesamt: ${(summe / 1048576).toFixed(1)} MB in ${dateien.length} Dateien.`);
  if (getan) {
    console.log('');
    console.log('WICHTIG: jetzt `node scripts/der-weg/pruefe-naehte.mjs` laufen lassen —');
    console.log('eine ausgetauschte Etappe beruehrt immer den Uebergang davor UND danach.');
  }
}

main();
