#!/usr/bin/env node
/**
 * transform-v18-stilprobe.mjs
 * ---------------------------------------------------------------------------
 * Erweitert die minifizierte Live-Hauptseite (Variante 18, "18-lumen/index.html")
 * um die "Stilprobe"-Integration. Ausfuehrbare, lesbare Aenderungsdokumentation.
 *
 * SICHERHEIT / VORGEHEN
 * - Alle Aenderungen laufen ausschliesslich ueber dieses Skript (die Zieldatei wird
 *   nie mit einem Editor angefasst; die Inline-base64-Blobs bleiben unberuehrt).
 * - Jede Ersetzung/Einfuegung geht durch einen Assertion-Helfer, der die erwartete
 *   Trefferzahl prueft und bei Abweichung sofort abbricht (process.exit(1))
 *   -> kein stilles Weitermachen.
 * - Anker sind whitespace-generalisiert: jede \s-Folge im Literal wird zu \s+,
 *   alle uebrigen Zeichen regex-escaped. Grund: die Datei mischt minifizierte
 *   Passagen (Einzel-Leerzeichen zwischen Tags) mit echten Zeilenumbruechen.
 * - Reihenfolge: Original lesen -> Idempotenz-Guard -> 9 Transformationen im
 *   Speicher -> DoD-Selbstcheck -> Backup schreiben -> EIN writeFile der Zieldatei.
 * - Datei-I/O explizit UTF-8, ohne BOM.
 *
 * AUFRUF
 *   node transform-v18-stilprobe.mjs --dry   -> nur pruefen, NICHTS schreiben
 *   node transform-v18-stilprobe.mjs         -> Backup + Zieldatei schreiben
 * ---------------------------------------------------------------------------
 */
import { readFile, writeFile } from 'node:fs/promises';

const TARGET = String.raw`C:\Projekte\JGC Studio\.claude\worktrees\stilprobe-automation-website-af3a9a\variants\standalone\18-lumen\index.html`;
const BACKUP = String.raw`C:\Users\chime\AppData\Local\Temp\claude\C--Projekte-JGC-Studio--claude-worktrees-stilprobe-automation-website-af3a9a\0303bfe3-a1b1-40c7-9bc4-c45e29cd21cb\scratchpad\v18-backup-vor-stilprobe.html`;

const DRY = process.argv.includes('--dry');

// ---------------------------------------------------------------- Helpers ----
function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function ws(lit) { return esc(lit).replace(/\s+/g, '\\s+'); }
function fail(msg) {
  console.error('\n=== ABBRUCH ===\n' + msg + '\nZieldatei NICHT veraendert.\n');
  process.exit(1);
}
function countRe(str, src) { const m = str.match(new RegExp(src, 'g')); return m ? m.length : 0; }
function cntWs(str, lit) { return countRe(str, ws(lit)); }          // whitespace-generalisiert
// Exakte, literale Zaehlung ueber indexOf (kein Regex, keine Escaping-Kante):
function cntLit(str, lit) {
  let n = 0, i = 0;
  while ((i = str.indexOf(lit, i)) !== -1) { n++; i += lit.length; }
  return n;
}

let html = await readFile(TARGET, 'utf8');
const original = html;                 // Strings sind immutable -> bleibt der Urzustand
const origLen = html.length;
const origBase64 = cntLit(html, ';base64,');
console.log(`Original gelesen: ${origLen} Zeichen, ;base64,-Bloecke: ${origBase64}${DRY ? '  [DRY-RUN]' : ''}`);

// -------------------------------------------------------- Idempotenz-Guard ---
if (cntLit(html, 'id="stilprobe"') > 0) fail('id="stilprobe" ist bereits vorhanden -> Stilprobe schon eingebaut.');

// -------------------------------------------------- Transform-Helfer (guard) --
// Ersetzt den ganzen (whitespace-generalisierten) Anker durch replacement.
function replaceExpect(label, anchorLit, replacement, expected = 1) {
  const src = ws(anchorLit);
  const c = countRe(html, src);
  if (c !== expected) fail(`${label}: Anker ${c}x gefunden, erwartet ${expected}.\nAnker="${anchorLit}"`);
  html = html.replace(new RegExp(src, 'g'), () => replacement);
  console.log(`OK  ${label}  (${expected}x ersetzt)`);
}
// Haengt addition direkt HINTER den Anker (Anker bleibt unveraendert erhalten).
function insertAfter(label, anchorLit, addition, expected = 1) {
  const src = ws(anchorLit);
  const c = countRe(html, src);
  if (c !== expected) fail(`${label}: Anker ${c}x gefunden, erwartet ${expected}.\nAnker="${anchorLit}"`);
  html = html.replace(new RegExp(src, 'g'), (m) => m + addition);
  console.log(`OK  ${label}  (${expected}x nach Anker eingefuegt)`);
}
// Fuegt addition INNERHALB des Aussen-Ankers direkt VOR den (ersten) Sub-Anker ein.
// Bewahrt die Original-Whitespaces des Treffers exakt (reiner Splice, kein Neuaufbau).
function insertBeforeSub(label, outerLit, subLit, addition, expected = 1) {
  const outerSrc = ws(outerLit);
  const c = countRe(html, outerSrc);
  if (c !== expected) fail(`${label}: Aussen-Anker ${c}x gefunden, erwartet ${expected}.\nAnker="${outerLit}"`);
  const subRe = new RegExp(ws(subLit));
  html = html.replace(new RegExp(outerSrc, 'g'), (m) => {
    const idx = m.search(subRe);
    if (idx < 0) fail(`${label}: Sub-Anker "${subLit}" nicht im Treffer gefunden.`);
    return m.slice(0, idx) + addition + m.slice(idx);
  });
  console.log(`OK  ${label}  (${expected}x vor Sub-Anker "${subLit}" eingefuegt)`);
}

// =========================================================================== //
//  1. NAV Desktop: neuer erster Eintrag "Stilprobe" (Muster des Angebote-Links) //
// =========================================================================== //
insertAfter(
  '1. Nav-Desktop "Stilprobe"',
  'aria-label="Hauptnavigation" data-astro-cid-dmqpwcec>',
  ' <a href="#stilprobe" class="link-underline font-sans text-[0.95rem] text-tinte/85 hover:text-kupfer transition-colors duration-200" data-astro-cid-dmqpwcec> Stilprobe </a>'
);

// =========================================================================== //
//  2. NAV Mobil: gleicher Eintrag als erster Mobil-Link                        //
// =========================================================================== //
insertAfter(
  '2. Nav-Mobil "Stilprobe"',
  'aria-label="Mobilnavigation" data-astro-cid-dmqpwcec>',
  ' <a href="#stilprobe" class="font-sans text-tinte text-[1.05rem] py-3 border-b border-holzsand/30 last:border-b-0" data-mobile-link data-astro-cid-dmqpwcec> Stilprobe </a>'
);

// =========================================================================== //
//  3. HERO: Sekundaer-CTA umlenken (a) + umbenennen (b)                        //
// =========================================================================== //
replaceExpect(
  '3a. Hero-CTA href -> #stilprobe',
  '<a href="#angebote" class="btn-secondary-on-dark"',
  '<a href="#stilprobe" class="btn-secondary-on-dark"'
);
replaceExpect(
  '3b. Hero-CTA Label',
  'Angebote ansehen',
  'Die Stilprobe ansehen'
);

// =========================================================================== //
//  4. NEUE SEKTION #stilprobe (vor dem Kommentar "5. Drei Angebote")           //
// =========================================================================== //
// Markup aus den Bausteinen der Seite; Einzelstrings -> eine Zeile im Output.
const STILPROBE_SECTION =
  '<section id="stilprobe" class="section bg-pergament">' +
    ' <div class="container-wide">' +
      // Sektionskopf
      ' <div class="text-center max-w-2xl mx-auto mb-14 md:mb-20 reveal">' +
        ' <p class="eyebrow eyebrow-kupfer mb-5">Die Stilprobe</p>' +
        ' <h2 class="font-serif text-section text-tinte text-balance">Lies dich selbst.</h2>' +
        ' <p class="mt-5 font-sans text-[1.05rem] text-anthrazit/70 leading-relaxed">Du musst mir nichts glauben. Schick mir drei deiner Texte, und du bekommst binnen 48 Stunden einen neuen Entwurf in zwei Fassungen zurück: einmal generisch, einmal in deiner Handschrift. Dazu drei Beobachtungen zu deiner Sprache. Kostenlos, ohne Haken.</p>' +
      ' </div>' +
      // Vergleichs-Grid (Muster: Vorher-Nachher-Block der Seite)
      ' <div class="grid grid-cols-1 md:grid-cols-2 gap-7 lg:gap-12 max-w-5xl mx-auto reveal">' +
        // Linke Karte: Fassung A
        ' <div class="card p-7 md:p-10 lg:p-12 bg-pergament" style="border-color: var(--color-holzsand);">' +
          ' <p class="font-serif italic text-[1.4rem] md:text-[1.55rem] text-tinte/85 mb-7 md:mb-9">Fassung A – ohne Handschrift</p>' +
          ' <!-- PLATZHALTER Phase 6: durch Ausschnitt aus Gabriels eigener Stilprobe ersetzen -->' +
          ' <p class="font-sans text-[1rem] text-anthrazit/80 leading-relaxed">Pausen werden oft unterschätzt. Dabei zeigen Studien, dass regelmäßige Auszeiten die Leistungsfähigkeit steigern. Wer bewusst innehält, arbeitet danach fokussierter und trifft bessere Entscheidungen. Deshalb gilt: Plane deine Pausen genauso sorgfältig wie deine Termine.</p>' +
        ' </div>' +
        // Rechte Karte: Fassung B
        ' <div class="card p-7 md:p-10 lg:p-12" style="border-color: rgba(143,169,138,0.4); background: linear-gradient(180deg, var(--color-pergament) 0%, rgba(143,169,138,0.06) 100%);">' +
          ' <p class="font-serif italic text-[1.4rem] md:text-[1.55rem] text-tinte mb-7 md:mb-9">Fassung B – deine Handschrift</p>' +
          ' <!-- PLATZHALTER Phase 6: durch Ausschnitt aus Gabriels eigener Stilprobe ersetzen -->' +
          ' <p class="font-sans text-[1rem] text-anthrazit/80 leading-relaxed">Vielleicht kennst du das: Der Kalender ist voll, und ausgerechnet die Pause fühlt sich an wie Drückebergerei. Ist sie nicht. Eine Pause ist kein Stillstand, sondern der Moment, in dem deine Arbeit sich setzt. <u style="text-decoration-color: var(--color-kupfer); text-decoration-thickness: 2px; text-underline-offset: 3px;">Du darfst anhalten.</u></p>' +
          ' <p class="mt-4 font-sans text-[0.85rem] text-anthrazit/60">↑ dein Merkmal hier: die kurzen Schlusssätze</p>' +
        ' </div>' +
      ' </div>' +
      // Bildunterschrift unter dem Grid
      ' <p class="mt-6 text-center font-sans text-[0.85rem] text-anthrazit/55 reveal">Ausschnitt aus einer echten Stilprobe – an meinen eigenen Texten erprobt, bevor ich sie anbiete.</p>' +
      // CTA-Block
      ' <div class="mt-12 md:mt-14 text-center reveal">' +
        ' <a href="/jgc-studio-website/stilprobe/" class="btn-primary">Stilprobe anfordern<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"> <path d="M3 8 L13 8"></path> <path d="M8.5 3.5 L13 8 L8.5 12.5"></path> </svg></a>' +
        ' <p id="stilprobe-kontingent" class="mt-5 font-sans text-[0.9rem] text-anthrazit/60">15 Proben im Monat – mehr gibt die Handarbeit nicht her.</p>' +
      ' </div>' +
    ' </div>' +
  ' </section>';

// Inline-Script direkt nach der Sektion. Wortlaute exakt (abgestimmt).
// Fetch schlaegt heute mit 404 fehl -> statischer Satz bleibt stehen (gewollt).
const KONTINGENT_SCRIPT =
  `<script>(function(){var el=document.getElementById("stilprobe-kontingent");if(!el||!window.fetch)return;var M=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];var c=new AbortController();var t=setTimeout(function(){c.abort();},2000);fetch("/jgc-studio-website/stilprobe/kontingent.php",{signal:c.signal}).then(function(r){return r.ok?r.json():null;}).then(function(d){clearTimeout(t);if(!d||!d.status||!d.monat)return;var i=M.indexOf(d.monat);var f=i>=0?M[(i+1)%12]:"nächsten Monat";var txt=null;if(d.status==="frei"){txt="Im "+d.monat+" sind noch "+d.frei+" von "+d.deckel+" Proben frei – mehr gibt die Handarbeit nicht her.";}else if(d.status==="knapp"){txt=d.frei===1?"Im "+d.monat+" ist noch 1 Probe frei. Danach beginnt die Warteliste für den "+f+".":"Im "+d.monat+" sind noch "+d.frei+" Proben frei. Danach beginnt die Warteliste für den "+f+".";}else if(d.status==="voll"){txt="Der "+d.monat+" ist voll – "+d.deckel+" Proben, mehr gibt die Handarbeit nicht her. Auf der Stilprobe-Seite kannst du dich für den "+f+" eintragen.";}else if(d.status==="pause"){txt="Die Stilprobe macht gerade eine kurze Pause – schau bald wieder vorbei.";}if(txt)el.textContent=txt;}).catch(function(){});})();</script>`;

insertBeforeSub(
  '4. Sektion #stilprobe',
  '</section> <!-- 5. Drei Angebote -->',
  '<!-- 5. Drei Angebote -->',
  '<!-- 4b. Stilprobe --> ' + STILPROBE_SECTION + ' ' + KONTINGENT_SCRIPT + ' '
);

// =========================================================================== //
//  5. FAQ 01 ergaenzen (Brueckensatz zur Stilprobe)                            //
// =========================================================================== //
replaceExpect(
  '5. FAQ01 Text ergaenzen',
  'das legen wir gemeinsam fest.',
  'das legen wir gemeinsam fest. Wenn du davor erst sehen willst, wie sich das anfühlt: Die Stilprobe ist der Schritt vor dem Gespräch – schriftlich, kostenlos, an deinem eigenen Material.'
);

// =========================================================================== //
//  6. FAQ-Renummerierung + neue FAQ 02                                         //
// =========================================================================== //
// 6a) Vorbedingung pruefen: 01..10 je genau 1x, 11/12 gar nicht.
for (let i = 1; i <= 10; i++) {
  const nn = String(i).padStart(2, '0');
  const c = cntLit(html, `tabular-nums">${nn}</span>`);
  if (c !== 1) fail(`6a. FAQ-Precheck: tabular-nums">${nn}</span> ${c}x gefunden, erwartet 1.`);
}
for (const nn of ['11', '12']) {
  const c = cntLit(html, `${nn}</span>`);
  if (c !== 0) fail(`6a. FAQ-Precheck: ${nn}</span> ${c}x gefunden, erwartet 0.`);
}
console.log('OK  6a. FAQ-Precheck (01..10 je 1x, 11/12 = 0)');

// 6b) Rueckwaerts renummerieren (10->11, 09->10, ... 02->03), damit keine Kollision.
for (let i = 10; i >= 2; i--) {
  const from = String(i).padStart(2, '0');
  const to = String(i + 1).padStart(2, '0');
  replaceExpect(`6b. FAQ-Renum ${from}->${to}`, `tabular-nums">${from}</span>`, `tabular-nums">${to}</span>`);
}

// 6c) Neue FAQ als Nummer 02, direkt nach dem </details> der FAQ 01.
//     Der Anker existiert erst NACH Schritt 5 (Endtext von FAQ 01).
const NEW_FAQ =
  `<details class="faq-item"> <summary class="font-sans"> <span class="text-[1.05rem] md:text-[1.1rem]"> <span class="inline-block w-7 text-anthrazit/40 font-medium tabular-nums">02</span> Was ist die Stilprobe? </span> <svg class="chev" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"> <path d="M4 7 L9 12 L14 7"></path> </svg> </summary> <div class="faq-body font-sans text-[1rem] pl-7"> Der Schritt vor dem ersten Gespräch – für alle, die erst sehen wollen, ob das trägt. Du schickst mir drei eigene Texte und bekommst binnen 48 Stunden einen neuen Entwurf in zwei Fassungen zurück: einmal generisch, einmal in deiner Handschrift, dazu drei Beobachtungen zu deiner Sprache. Kostenlos, gedeckelt auf 15 Proben im Monat. Danach entscheidest du in Ruhe, ob ein Erstgespräch dran ist. </div> </details>`;

insertAfter(
  '6c. Neue FAQ 02',
  'an deinem eigenen Material. </div> </details>',
  NEW_FAQ
);

// =========================================================================== //
//  7. FINAL-CTA: Sekundaerzeile unter dem Primaer-Button                       //
// =========================================================================== //
insertBeforeSub(
  '7. Final-CTA Sekundaerlink',
  '</svg> </a> </div> </div> </div> </div> <!-- Atemraum-Pause vor dem Footer -->',
  '</div>',
  '<a href="#stilprobe" class="link-underline font-sans text-[0.95rem] text-anthrazit/70 hover:text-kupfer transition-colors duration-200">oder starte mit der Stilprobe →</a> '
);

// =========================================================================== //
//  8. FOOTER: Link "Stilprobe" in der "Seite"-Spalte (vor </ul>)               //
// =========================================================================== //
insertBeforeSub(
  '8. Footer-Link Stilprobe',
  'Erstgespräch anfragen </a> </li> </ul>',
  '</ul>',
  '<li> <a href="/jgc-studio-website/stilprobe/" class="link-underline inline-block font-sans text-[0.95rem] text-pergament/85 hover:text-kupfer transition-colors duration-200"> Stilprobe </a> </li> '
);

// =========================================================================== //
//  9. BUGFIX Footer-Rechtslinks (von der Root-Kopie kaputt)                    //
// =========================================================================== //
replaceExpect('9a. Footer Impressum-Link', 'href="../../main/impressum/"', 'href="/jgc-studio-website/main/impressum/"');
replaceExpect('9b. Footer Datenschutz-Link', 'href="../../main/datenschutz/"', 'href="/jgc-studio-website/main/datenschutz/"');

// =========================================================================== //
//  DEFINITION OF DONE — Selbstcheck (vor dem Schreiben)                        //
// =========================================================================== //
console.log('\n=== DoD-Selbstcheck ===');
function check(label, actual, wanted) {
  if (actual !== wanted) fail(`DoD "${label}": ${actual}, erwartet ${wanted}.`);
  console.log(`  ok  ${label} = ${actual}`);
}
function checkMin(label, actual, min) {
  if (actual < min) fail(`DoD "${label}": ${actual}, erwartet >= ${min}.`);
  console.log(`  ok  ${label} = ${actual} (>= ${min})`);
}

// 1.
check('id="stilprobe"', cntLit(html, 'id="stilprobe"'), 1);
checkMin('href="#stilprobe"', cntLit(html, 'href="#stilprobe"'), 4);
// 2.
check('Die Stilprobe ansehen', cntLit(html, 'Die Stilprobe ansehen'), 1);
check('Angebote ansehen', cntLit(html, 'Angebote ansehen'), 0);
// 3.
for (let i = 1; i <= 11; i++) {
  const nn = String(i).padStart(2, '0');
  check(`tabular-nums ${nn}`, cntLit(html, `tabular-nums">${nn}</span>`), 1);
}
check('12</span>', cntLit(html, '12</span>'), 0);
check('Was ist die Stilprobe?', cntLit(html, 'Was ist die Stilprobe?'), 1);
// 4.
check('../../main/', cntLit(html, '../../main/'), 0);
check('/jgc-studio-website/main/impressum/', cntLit(html, '/jgc-studio-website/main/impressum/'), 1);
check('/jgc-studio-website/main/datenschutz/', cntLit(html, '/jgc-studio-website/main/datenschutz/'), 1);
// 5.
check('/jgc-studio-website/stilprobe/', cntLit(html, '/jgc-studio-website/stilprobe/'), 3);
// 6.
check('stilprobe-kontingent', cntLit(html, 'stilprobe-kontingent'), 2);
// 9.
check('oder starte mit der Stilprobe', cntLit(html, 'oder starte mit der Stilprobe'), 1);
// 8.
check(';base64,', cntLit(html, ';base64,'), origBase64);
// 10. Umlaut-/Mojibake-Stichprobe im Speicher (zusaetzlich per Grep gegen die Datei)
check('Lies dich selbst.', cntLit(html, 'Lies dich selbst.'), 1);
check('mehr gibt die Handarbeit nicht her', cntLit(html, 'mehr gibt die Handarbeit nicht her'), 3);
check('Mojibake "Ã" (muss 0 sein)', cntLit(html, 'Ã'), 0);
check('Mojibake "â€“" (muss 0 sein)', cntLit(html, 'â€“'), 0);
// 7. Laengen-Delta (Sanity)
const delta = html.length - origLen;
if (delta < 4000 || delta > 12000) fail(`DoD Zeichen-Delta: ${delta}, erwartet 4000..12000.`);
const byteDelta = Buffer.byteLength(html, 'utf8') - Buffer.byteLength(original, 'utf8');
console.log(`  ok  Zeichen-Delta = ${delta} (neu ${html.length}) | Byte-Delta = ${byteDelta}`);

// =========================================================================== //
//  Schreiben: erst Backup (Urzustand), dann EIN writeFile der Zieldatei        //
// =========================================================================== //
if (DRY) {
  console.log('\n=== DRY-RUN: alle Assertions gruen, es wurde NICHTS geschrieben. ===');
} else {
  await writeFile(BACKUP, original, 'utf8');
  console.log(`\nBackup geschrieben: ${BACKUP}`);
  await writeFile(TARGET, html, 'utf8');
  console.log(`Zieldatei geschrieben: ${TARGET}`);
  console.log('\n=== FERTIG: Stilprobe-Integration erfolgreich eingebaut. ===');
}
