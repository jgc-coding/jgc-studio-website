#!/usr/bin/env node
/**
 * server.mjs — winziger Dateiserver zum Ansehen der Scroll-Welt.
 *
 * Warum ueberhaupt einer: Die Scroll-Engine laedt jeden Clip als Blob per fetch.
 * Unter file:// verbietet der Browser das, die Seite bliebe leer. Ein `serve` oder
 * Python steht in dieser Umgebung nicht bereit, also diese knapp 40 Zeilen.
 *
 * Liefert Byte-Bereiche aus (Range-Requests). Fuer die Engine ist das nicht noetig,
 * weil sie ohnehin Blobs benutzt, aber ohne sie verhaelt sich das direkte Abspielen
 * eines Videos im Browser anders als spaeter auf dem echten Server.
 *
 * Aufruf:  node scripts/der-weg/server.mjs [PORT] [WURZEL]
 * Default: Port 4330, Wurzel = Projektwurzel (damit /jgc-studio-website/... passt)
 */

import { createServer } from 'node:http';
import { createReadStream, statSync, existsSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';

const PORT = Number(process.argv[2]) || 4330;
const WURZEL = process.argv[3] || process.cwd();

const TYPEN = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp4': 'video/mp4',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

createServer((anfrage, antwort) => {
  let pfad = decodeURIComponent(new URL(anfrage.url, 'http://x').pathname);

  // Die Seite benutzt absolute Pfade mit dem GitHub-Pages-Praefix. Lokal liegt die
  // Projektwurzel direkt unter /, also wird das Praefix hier weggeschnitten.
  pfad = pfad.replace(/^\/jgc-studio-website/, '') || '/';
  if (pfad.endsWith('/')) pfad += 'index.html';

  const datei = normalize(join(WURZEL, pfad));
  if (!datei.startsWith(normalize(WURZEL)) || !existsSync(datei) || statSync(datei).isDirectory()) {
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
  console.log(`Der Weg laeuft auf http://localhost:${PORT}/der-weg/`);
  console.log(`Wurzel: ${WURZEL}`);
});
