#!/usr/bin/env node
/**
 * pruefe-naehte.mjs — sind die Uebergaenge zwischen den Etappen sprungfrei?
 *
 * Die Scroll-Welt ist eine einzige Kamerafahrt, zerlegt in sieben Dateien. Am
 * Uebergang muss das letzte Bild der einen Etappe fast dem ersten Bild der naechsten
 * entsprechen, sonst ruckt es beim Scrollen sichtbar.
 *
 * WARUM NICHT DER FESTE SCHWELLWERT AUS DEM SKILL:
 * Der Skill verlangt einen Aehnlichkeitswert (SSIM) von mindestens 0,90 an jeder Naht.
 * Dieses Mass ist bei fein strukturiertem Papier extrem streng: schon eine langsame
 * Kamerafahrt drueckt zwei benachbarte Bilder DESSELBEN Videos auf 0,61 herunter. Ein
 * fester Schwellwert meldet hier also lauter Fehlalarme.
 *
 * Deshalb misst dieses Skript zusaetzlich einen EIGENWERT je Etappe: dieselbe Distanz
 * (zwei Bilder), aber innerhalb einer Datei, wo per Definition kein Schnitt sein kann.
 * Bewertet wird das Verhaeltnis Naht zu Eigenwert. Erst das trennt "Kamera bewegt sich
 * schnell" von "Kamera springt".
 *
 * Aufruf:  node scripts/der-weg/pruefe-naehte.mjs [ORDNER]
 * Default: der-weg/assets
 *
 * Rueckgabe 0 wenn alle Naehte tragen, 1 wenn mindestens eine bricht.
 */

import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const ZIEL = process.argv[2] || 'der-weg/assets';

/* Reihenfolge der Kamerafahrt — muss zu kodiere.mjs passen. */
const KETTE = ['anflug', 'werkzeug', 'schreibtisch', 'stilprobe', 'weg', 'lichtung', 'aussicht'];

/* Verhaeltnis Naht zu Eigenwert. Die Grenzen stammen aus der Messung am echten
 * Material: saubere Naehte lagen bei 1,01 bis 1,24, gebrochene bei 0,33 und 0,47. */
const TRAEGT = 0.85;
const VERDAECHTIG = 0.6;

const tmp = mkdtempSync(join(tmpdir(), 'naht-'));

function ff(argv) {
  return execFileSync('ffmpeg', argv, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function anzahlBilder(datei) {
  const out = execFileSync('ffprobe', [
    '-v', 'error', '-select_streams', 'v:0',
    '-count_frames', '-show_entries', 'stream=nb_read_frames',
    '-of', 'default=nw=1:nk=1', datei,
  ], { encoding: 'utf8' }).trim();
  const n = Number(out);
  if (!Number.isFinite(n) || n < 3) throw new Error(`Bildanzahl unbrauchbar (${out}) in ${datei}`);
  return n;
}

function bild(datei, index, ziel) {
  ff(['-v', 'error', '-y', '-i', datei, '-vf', `select=eq(n\\,${index})`,
      '-vsync', '0', '-frames:v', '1', ziel]);
}

function ssim(a, b) {
  // ffmpeg schreibt die SSIM-Statistik auf den Fehlerkanal, nicht auf die
  // Standardausgabe — execFileSync liefert nur letztere und gaebe hier leer zurueck.
  const lauf = spawnSync('ffmpeg', ['-hide_banner', '-i', a, '-i', b, '-lavfi', 'ssim', '-f', 'null', '-'],
    { encoding: 'utf8' });
  const ausgabe = (lauf.stdout || '') + (lauf.stderr || '');
  const treffer = /All:([0-9.]+)/.exec(ausgabe);
  if (!treffer) throw new Error('SSIM lieferte kein Ergebnis — ffmpeg ohne ssim-Filter gebaut?');
  return Number(treffer[1]);
}

function main() {
  const fehlend = KETTE.filter((n) => !existsSync(join(ZIEL, `${n}.mp4`)));
  if (fehlend.length) {
    console.error(`Fehlende Etappen in ${ZIEL}: ${fehlend.join(', ')}`);
    console.error('Erst `node scripts/der-weg/kodiere.mjs` laufen lassen.');
    process.exit(1);
  }

  console.log(`Uebergaenge in ${ZIEL}\n`);
  console.log('  Uebergang                        Naht   Eigenwert  Verhaeltnis  Urteil');
  console.log('  ' + '-'.repeat(74));

  let gebrochen = 0;
  let auffaellig = 0;

  for (let i = 0; i < KETTE.length - 1; i++) {
    const vorher = join(ZIEL, `${KETTE[i]}.mp4`);
    const nachher = join(ZIEL, `${KETTE[i + 1]}.mp4`);

    const n = anzahlBilder(vorher);
    const letzte = n - 1;

    const aLetzt = join(tmp, 'a-letzt.png');
    const aVorletzt = join(tmp, 'a-vorletzt.png');
    const bErst = join(tmp, 'b-erst.png');

    bild(vorher, letzte, aLetzt);
    bild(vorher, letzte - 2, aVorletzt);   // gleicher Abstand wie die Naht
    bild(nachher, 0, bErst);

    const naht = ssim(aLetzt, bErst);
    const eigen = ssim(aVorletzt, aLetzt);
    const verhaeltnis = eigen > 0 ? naht / eigen : 0;

    let urteil;
    if (verhaeltnis >= TRAEGT) urteil = 'traegt';
    else if (verhaeltnis >= VERDAECHTIG) { urteil = 'ansehen'; auffaellig++; }
    else { urteil = 'SPRUNG'; gebrochen++; }

    const name = `${KETTE[i]} -> ${KETTE[i + 1]}`;
    console.log(
      `  ${name.padEnd(30)} ${naht.toFixed(3)}     ${eigen.toFixed(3)}       ` +
      `${verhaeltnis.toFixed(2).padStart(5)}      ${urteil}`
    );
  }

  console.log('');
  if (gebrochen) {
    console.log(`${gebrochen} Uebergang/Uebergaenge springen sichtbar.`);
    console.log('Moeglichkeiten: die betroffene Etappe neu erzeugen (Startbild = letztes Bild');
    console.log('der vorherigen Etappe), oder in der Seite die Ueberblendung verbreitern.');
  } else {
    console.log('Alle Uebergaenge tragen.');
  }
  if (auffaellig) console.log(`${auffaellig} Uebergang/Uebergaenge sind grenzwertig — im Browser ansehen.`);

  rmSync(tmp, { recursive: true, force: true });
  process.exit(gebrochen ? 1 : 0);
}

try {
  main();
} catch (err) {
  rmSync(tmp, { recursive: true, force: true });
  console.error(`Nahtpruefung fehlgeschlagen: ${err.message}`);
  process.exit(1);
}
