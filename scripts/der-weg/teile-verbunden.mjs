#!/usr/bin/env node
/**
 * teile-verbunden.mjs — Gabriels nachgereichten Durchgangsclip in die Etappen 3 und 4 teilen.
 *
 * VORGESCHICHTE. Die Naht zwischen Etappe 3 ("Was sich wirklich aendert") und Etappe 4
 * ("Lies dich selbst") war die einzige der Reise, die sich nicht wegschneiden liess: die
 * Kamera sprang dort rueckwaerts und nach oben (docs/der-weg.md, Messung 27.07.2026).
 * Gabriel hat den ganzen Bogen am 26.08.2026 neu gerendert, als EIN durchgehendes Video:
 *
 *   Scroll World/legs/ueberarbeitet/Segmente-verbunden.mp4
 *
 * WAS DARIN STECKT (Bildvergleich SSIM gegen das alte Rohmaterial, 28.08.2026):
 *
 *   neu 0 .. 122     altes leg 3, dessen Bild 0 .. 98   (Aehnlichkeit 0.995 - 0.997)
 *   neu 123 .. 142   NEU gerendert — die Bruecke, die den Sprung ersetzt
 *   neu 143 .. 364   altes leg 4, dessen Bild 16 .. 192 (Aehnlichkeit 0.990 - 0.997)
 *
 * Anfang und Ende sind also byte-nah identisch mit dem alten Material. Die Naehte zu
 * Etappe 2 davor und Etappe 5 danach bleiben damit unveraendert; nur die kaputte Stelle
 * in der Mitte ist ersetzt. Herausgeschnitten sind rund 3,9 s.
 *
 * WARUM UMRECHNEN. Das neue Video ist 1440x1080 bei 30 Bildern/s, alle sieben Etappen der
 * Reise sind 1112x834 bei 24. Beides wird angeglichen:
 *   - 24 Bilder/s, weil `clipFps` in der-weg/index.html EINE Zahl fuer alle Clips ist und
 *     die Scroll-Engine unveraendert aus dem Skill stammt. Das Material enthaelt ohnehin
 *     Wiederholbilder aus einer 24->30-Wandlung, es geht also kaum etwas verloren.
 *   - 1112x834, damit die zwei mittleren Etappen nicht schaerfer sind als ihre Nachbarn.
 *     Ein Schaerfesprung faellt genau an den Naehten auf.
 *
 * WO GETEILT WIRD. Bei Bild 121 der 24er-Fassung. Gemessen ueber die mittlere
 * Helligkeitsaenderung von Bild zu Bild (Stellvertreter fuer Kamerabewegung, siehe
 * docs/der-weg.md): die Kamera kommt ab Bild 85 zur Ruhe, ist zwischen 117 und 125 am
 * ruhigsten und beschleunigt ab 170 wieder in den Tauchgang zur Feder. Bild 121 ist damit
 * der Ankunftsmoment fuer "Was sich wirklich aendert" — und ab Bild 134 beginnt der Stift
 * zu schreiben, also der Bildinhalt von "Lies dich selbst". Die Station wechselt dort, wo
 * auch das Bild die Geschichte wechselt.
 *
 * Weil beide Haelften aus EINEM Rendering stammen, sind die zwei Bilder an der Naht
 * aufeinanderfolgende Bilder derselben Fahrt: die Naht 3->4 ist danach perfekt.
 *
 * Aufruf:
 *   node scripts/der-weg/teile-verbunden.mjs           schreibt leg 3.mp4 und leg 4.mp4
 *   node scripts/der-weg/teile-verbunden.mjs --pruefen  rechnet nur nach, schreibt nichts
 *
 * Die alten Rohdateien werden NICHT geloescht, sondern nach `vor-schnitt-2026-08-28/`
 * verschoben. Liegen sie dort schon, bricht das Skript ab statt zu ueberschreiben.
 *
 * Danach zwingend:
 *   node scripts/der-weg/kodiere.mjs 3
 *   node scripts/der-weg/kodiere.mjs 4
 *   node scripts/der-weg/pruefe-naehte.mjs
 * und die `scroll`-Werte der zwei Stationen neu rechnen (docs/der-weg.md, Abschnitt V49).
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, renameSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROH = process.env.DERWEG_ROH || 'C:/Projekte/JGC Studio/Scroll World/legs';
const QUELLE = join(ROH, 'ueberarbeitet', 'Segmente-verbunden.mp4');
const ARCHIV = join(ROH, 'vor-schnitt-2026-08-28');

/* Sollwerte des gelieferten Videos. Weicht etwas davon ab, ist es nicht die Datei,
 * gegen die hier gemessen wurde — dann lieber abbrechen als still etwas anderes
 * schneiden. */
const QUELLE_SOLL = { breite: 1440, hoehe: 1080, fps: 30, bilder: 365 };

/* Zielformat, identisch mit den anderen fuenf Etappen. */
const ZIEL_BREITE = 1112;
const ZIEL_HOEHE = 834;
const ZIEL_FPS = 24;
const ZIEL_BILDER = 292;          // 365 / (30/24)

/* Teilungsbild in der 24er-Fassung: Etappe 3 bekommt 0 .. TEILUNG-1, Etappe 4 den Rest. */
const TEILUNG = 121;

/* Bilder, die am ENDE von Etappe 4 wegfallen. Das Video faehrt zwei Bilder ueber den
 * Punkt hinaus, an dem Etappe 5 ansetzt: gegen deren erstes Bild misst sich Bild 289 mit
 * 0.891, die Bilder 290 und 291 nur noch mit 0.626. Das alte leg 4 endete genau auf diesem
 * Ueberschuss — die Naht 4->5 lag deshalb bei 0.620 (docs/der-weg.md). Zwei Bilder weniger
 * kosten 0,08 s und machen die Naht messbar besser.
 * Auf 0 setzen, wenn die Naht dadurch wider Erwarten schlechter wird. */
const NACHLAUF = 2;

const nurPruefen = process.argv.includes('--pruefen');

function ffprobe(argv) {
  return execFileSync('ffprobe', argv, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function fordere(bedingung, text) {
  if (!bedingung) {
    console.error(`ABBRUCH: ${text}`);
    process.exit(1);
  }
}

function eigenschaften(datei) {
  const roh = ffprobe([
    '-v', 'error', '-select_streams', 'v:0', '-count_frames',
    '-show_entries', 'stream=width,height,r_frame_rate,nb_read_frames',
    '-of', 'default=nw=1', datei,
  ]);
  const feld = {};
  for (const zeile of roh.split(/\r?\n/)) {
    const [k, v] = zeile.split('=');
    if (k) feld[k] = v;
  }
  const [z, n] = String(feld.r_frame_rate).split('/').map(Number);
  return {
    breite: Number(feld.width),
    hoehe: Number(feld.height),
    fps: n ? z / n : z,
    bilder: Number(feld.nb_read_frames),
  };
}

function mb(datei) {
  return (statSync(datei).size / 1048576).toFixed(1);
}

/* Eine Haelfte herausschneiden. Reihenfolge im Filter ist wichtig: erst auf 24 Bilder/s
 * und die Zielgroesse bringen, DANN zaehlen — `n` in `select` ist der Bildindex an genau
 * dieser Stelle der Kette, also schon in der 24er-Zaehlung. `setpts=PTS-STARTPTS` setzt
 * die Zeitachse auf null zurueck, sonst begaenne Etappe 4 mit fuenf Sekunden Luecke.
 * CRF 12 ist bewusst hoeher aufgeloest als das, was kodiere.mjs spaeter daraus macht
 * (CRF 20/23) — dieses Zwischenergebnis ist Rohmaterial, keine Auslieferung. */
function schneide(von, bis, ziel) {
  const filter = [
    `fps=${ZIEL_FPS}`,
    `scale=${ZIEL_BREITE}:${ZIEL_HOEHE}:flags=lanczos`,
    `select='between(n\\,${von}\\,${bis})'`,
    'setpts=PTS-STARTPTS',
  ].join(',');
  execFileSync('ffmpeg', [
    '-v', 'error', '-y', '-i', QUELLE,
    '-an', '-vf', filter, '-vsync', '0',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '12',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', ziel,
  ], { stdio: ['ignore', 'pipe', 'pipe'] });
}

function main() {
  fordere(existsSync(QUELLE), `Quelldatei fehlt: ${QUELLE}`);

  const q = eigenschaften(QUELLE);
  console.log(`Quelle: ${QUELLE}`);
  console.log(`  ${q.breite}x${q.hoehe}, ${q.fps} Bilder/s, ${q.bilder} Bilder, `
    + `${(q.bilder / q.fps).toFixed(2)} s, ${mb(QUELLE)} MB`);
  for (const [feld, soll] of Object.entries(QUELLE_SOLL)) {
    fordere(Math.abs(q[feld] - soll) < 0.01,
      `Quelle hat ${feld}=${q[feld]}, erwartet ${soll}. `
      + 'Ist das eine andere Fassung? Dann Sollwerte und Teilungsbild hier neu messen.');
  }

  const bilder3 = TEILUNG;
  const bilder4 = ZIEL_BILDER - TEILUNG - NACHLAUF;
  fordere(bilder3 > 60 && bilder4 > 60,
    `Teilung ${TEILUNG} ergibt ${bilder3} / ${bilder4} Bilder — eine Haelfte waere zu kurz.`);

  console.log('');
  console.log(`Teilung bei Bild ${TEILUNG} der ${ZIEL_FPS}er-Fassung `
    + `(${ZIEL_BILDER} Bilder, ${(ZIEL_BILDER / ZIEL_FPS).toFixed(2)} s):`);
  console.log(`  Etappe 3 "schreibtisch": Bild 0 .. ${TEILUNG - 1}  = ${bilder3} Bilder `
    + `(${(bilder3 / ZIEL_FPS).toFixed(2)} s)`);
  console.log(`  Etappe 4 "stilprobe"   : Bild ${TEILUNG} .. ${ZIEL_BILDER - 1 - NACHLAUF} `
    + `= ${bilder4} Bilder (${(bilder4 / ZIEL_FPS).toFixed(2)} s)`
    + (NACHLAUF ? `, ${NACHLAUF} Bilder Nachlauf abgeschnitten` : ''));

  if (nurPruefen) {
    console.log('\n--pruefen: nichts geschrieben.');
    return;
  }

  /* Die alten Rohdateien beiseitelegen, nicht ueberschreiben. Liegt das Archiv schon
   * voll, ist das Skript bereits gelaufen — dann nicht ein zweites Mal verschieben,
   * sonst waere die echte Sicherung weg. */
  mkdirSync(ARCHIV, { recursive: true });
  for (const nr of [3, 4]) {
    const alt = join(ROH, `leg ${nr}.mp4`);
    const sicher = join(ARCHIV, `leg ${nr}.mp4`);
    if (existsSync(sicher)) {
      console.log(`\nHinweis: ${sicher} liegt schon vor — Sicherung bleibt unangetastet.`);
      continue;
    }
    fordere(existsSync(alt), `Alte Rohdatei fehlt und ist nicht gesichert: ${alt}`);
    renameSync(alt, sicher);
    console.log(`\nGesichert: leg ${nr}.mp4 -> vor-schnitt-2026-08-28/`);
  }

  console.log('');
  const ziel3 = join(ROH, 'leg 3.mp4');
  const ziel4 = join(ROH, 'leg 4.mp4');

  process.stdout.write('  ->  leg 3.mp4 ');
  schneide(0, TEILUNG - 1, ziel3);
  const e3 = eigenschaften(ziel3);
  fordere(e3.bilder === bilder3, `leg 3.mp4 hat ${e3.bilder} Bilder, erwartet ${bilder3}.`);
  fordere(e3.breite === ZIEL_BREITE && e3.hoehe === ZIEL_HOEHE && Math.abs(e3.fps - ZIEL_FPS) < 0.01,
    `leg 3.mp4 ist ${e3.breite}x${e3.hoehe} @ ${e3.fps} — erwartet ${ZIEL_BREITE}x${ZIEL_HOEHE} @ ${ZIEL_FPS}.`);
  console.log(`fertig (${e3.bilder} Bilder, ${mb(ziel3)} MB)`);

  process.stdout.write('  ->  leg 4.mp4 ');
  schneide(TEILUNG, ZIEL_BILDER - 1 - NACHLAUF, ziel4);
  const e4 = eigenschaften(ziel4);
  fordere(e4.bilder === bilder4, `leg 4.mp4 hat ${e4.bilder} Bilder, erwartet ${bilder4}.`);
  fordere(e4.breite === ZIEL_BREITE && e4.hoehe === ZIEL_HOEHE && Math.abs(e4.fps - ZIEL_FPS) < 0.01,
    `leg 4.mp4 ist ${e4.breite}x${e4.hoehe} @ ${e4.fps} — erwartet ${ZIEL_BREITE}x${ZIEL_HOEHE} @ ${ZIEL_FPS}.`);
  console.log(`fertig (${e4.bilder} Bilder, ${mb(ziel4)} MB)`);

  console.log('');
  console.log('WEITER:');
  console.log('  node scripts/der-weg/kodiere.mjs 3');
  console.log('  node scripts/der-weg/kodiere.mjs 4');
  console.log('  node scripts/der-weg/pruefe-naehte.mjs');
  console.log('Danach die `scroll`-Werte beider Stationen neu rechnen — die Etappen sind');
  console.log('jetzt unterschiedlich lang, die Formel dafuer steht in docs/der-weg.md.');
}

main();
