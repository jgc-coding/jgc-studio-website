#!/usr/bin/env node
/**
 * server.mjs — winziger Dateiserver zum Ansehen der Seite.
 *
 * Warum ueberhaupt einer: Die Scroll-Engine laedt jeden Clip als Blob per fetch.
 * Unter file:// verbietet der Browser das, die Seite bliebe leer. Ein `serve` oder
 * Python steht in dieser Umgebung nicht bereit, also diese knapp 60 Zeilen.
 *
 * Liefert Byte-Bereiche aus (Range-Requests). Fuer die Engine ist das nicht noetig,
 * weil sie ohnehin Blobs benutzt, aber ohne sie verhaelt sich das direkte Abspielen
 * eines Videos im Browser anders als spaeter auf dem echten Server.
 *
 * Aufruf:  node scripts/der-weg/server.mjs [PORT] [WURZEL]
 *
 * Ohne WURZEL liefert er die Projektwurzel und spiegelt dabei die Anordnung des
 * Deploys: eine Anfrage wird zuerst in der Projektwurzel gesucht, dann in der-weg/.
 * So liegt die Reise wie live unter /, ihre Assets unter /assets/, die Rechtsseiten
 * unter /impressum/ und /datenschutz/ — und die Archiv-Varianten bleiben unter
 * /variants/standalone/<slug>/ erreichbar.
 *
 * Mit WURZEL (zum Beispiel `_site` nach `node scripts/deploy/baue-site.mjs _site`)
 * liefert er genau diesen Ordner ohne Fallback — das ist das Deploy-Ergebnis.
 */

import { createServer } from 'node:http';
import { createReadStream, statSync, existsSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';

const PORT = Number(process.argv[2]) || 4330;
const WURZEL = process.argv[3] || process.cwd();
const FALLBACK = process.argv[3] ? null : join(process.cwd(), 'der-weg');

const TYPEN = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.mp4': 'video/mp4',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

/** Sucht die Datei zu einem Pfad: erst in der Wurzel, dann im Fallback-Ordner. */
function findeDatei(pfad) {
  for (const basis of [WURZEL, FALLBACK].filter(Boolean)) {
    const datei = normalize(join(basis, pfad));
    if (!datei.startsWith(normalize(basis))) continue;
    if (existsSync(datei) && !statSync(datei).isDirectory()) return datei;
  }
  return null;
}

createServer((anfrage, antwort) => {
  // Eine kaputt kodierte Adresse (etwa /% aus einem Tippfehler oder von einem Bot)
  // liess decodeURIComponent frueher werfen — der Server war damit weg und der
  // Vorschau-Pane meldete nur noch "Verbindung abgelehnt". Jetzt: 400 statt Absturz.
  let pfad;
  try {
    pfad = decodeURIComponent(new URL(anfrage.url, 'http://x').pathname);
  } catch (fehler) {
    antwort.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    antwort.end(`Ungueltige Adresse: ${anfrage.url}`);
    return;
  }
  if (pfad.endsWith('/')) pfad += 'index.html';

  const datei = findeDatei(pfad);
  if (!datei) {
    antwort.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    antwort.end(`Nicht gefunden: ${pfad}`);
    return;
  }

  const groesse = statSync(datei).size;
  const typ = TYPEN[extname(datei).toLowerCase()] || 'application/octet-stream';
  const bereich = anfrage.headers.range;

  if (bereich) {
    const treffer = /bytes=(\d*)-(\d*)/.exec(bereich);
    const von = treffer && treffer[1] ? Number(treffer[1]) : 0;
    const bis = treffer && treffer[2] ? Number(treffer[2]) : groesse - 1;
    antwort.writeHead(206, {
      'Content-Type': typ,
      'Content-Range': `bytes ${von}-${bis}/${groesse}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': bis - von + 1,
    });
    createReadStream(datei, { start: von, end: bis }).pipe(antwort);
    return;
  }

  antwort.writeHead(200, { 'Content-Type': typ, 'Content-Length': groesse, 'Accept-Ranges': 'bytes' });
  createReadStream(datei).pipe(antwort);
}).listen(PORT, () => {
  console.log(`Die Seite laeuft auf http://localhost:${PORT}/`);
  console.log(`Wurzel: ${WURZEL}${FALLBACK ? `  (Fallback: ${FALLBACK})` : ''}`);
});
