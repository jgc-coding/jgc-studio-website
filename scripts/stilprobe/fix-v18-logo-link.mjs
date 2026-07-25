#!/usr/bin/env node
/**
 * fix-v18-logo-link.mjs
 * ---------------------------------------------------------------------------
 * Korrigiert den EINZIGEN verbliebenen relativen Link der Variante 18
 * (Logo/"zurueck zum Anfang"): href="../../".
 *
 * Problem: V18 wird an ZWEI Orten ausgeliefert — als Galerie-Variante unter
 * /variants/18-lumen/ UND als Root-Hauptseite unter /jgc-studio-website/.
 * Von /variants/18-lumen/ zeigt "../../" korrekt auf /jgc-studio-website/,
 * von der Root aber auf das GitHub-Konto-Wurzelverzeichnis (github.io/) —
 * also WEG von der Seite. Der absolute Pfad /jgc-studio-website/ ist an
 * beiden Orten korrekt (dieselbe Klasse Fix wie zuvor bei den Footer-
 * Rechtslinks ../../main/... -> /jgc-studio-website/main/...).
 *
 * Assertion-guarded, UTF-8 ohne BOM, ein einziger writeFile nach Pruefung.
 *   node fix-v18-logo-link.mjs --dry   -> nur pruefen
 *   node fix-v18-logo-link.mjs         -> Backup + schreiben
 * ---------------------------------------------------------------------------
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// Pfad relativ zum Skript (Befund V16): hier stand ein absoluter Pfad in einen
// ANDEREN Worktree — ein erneuter Lauf haette dort die falsche Datei geaendert.
const TARGET = fileURLToPath(new URL('../../variants/standalone/18-lumen/index.html', import.meta.url));
const BACKUP = String.raw`C:\Users\chime\AppData\Local\Temp\claude\C--Projekte-JGC-Studio--claude-worktrees-stilprobe-automation-website-af3a9a\0303bfe3-a1b1-40c7-9bc4-c45e29cd21cb\scratchpad\v18-backup-vor-logo-fix.html`;

const DRY = process.argv.includes('--dry');
const OLD = 'href="../../"';
const NEW = 'href="/jgc-studio-website/"';

function cnt(s, lit) { let n = 0, i = 0; while ((i = s.indexOf(lit, i)) !== -1) { n++; i += lit.length; } return n; }
function fail(m) { console.error('\n=== ABBRUCH ===\n' + m + '\nZieldatei NICHT veraendert.\n'); process.exit(1); }

const html = await readFile(TARGET, 'utf8');
const origLen = html.length;
const origBase64 = cnt(html, ';base64,');
const origNew = cnt(html, NEW);

// Guards
if (cnt(html, 'id="stilprobe"') !== 1) fail('Erwarte die bereits Stilprobe-transformierte V18 (id="stilprobe" genau 1x).');
const nOld = cnt(html, OLD);
if (nOld === 0) fail('Kein href="../../" gefunden — evtl. schon gefixt (idempotent: nichts zu tun).');
if (nOld !== 1) fail(`Erwarte genau 1x ${OLD}, gefunden ${nOld}. Abbruch, um nichts Falsches zu treffen.`);

const out = html.split(OLD).join(NEW);

// Nachpruefung
if (cnt(out, OLD) !== 0) fail('Nach Ersetzung ist href="../../" noch vorhanden.');
if (cnt(out, NEW) !== origNew + 1) fail('Ziel-Link-Zahl stimmt nicht (erwartet +1).');
if (cnt(out, ';base64,') !== origBase64) fail('base64-Bloecke veraendert — darf nicht sein.');
const delta = out.length - origLen;
if (delta !== (NEW.length - OLD.length)) fail(`Unerwartetes Laengen-Delta ${delta}.`);

console.log(`OK: 1x "${OLD}" -> "${NEW}"; Laengen-Delta ${delta}; base64 unveraendert (${origBase64}).${DRY ? '  [DRY]' : ''}`);
if (DRY) process.exit(0);

await writeFile(BACKUP, html, 'utf8');
await writeFile(TARGET, out, 'utf8');
console.log('Geschrieben. Backup:', BACKUP);
