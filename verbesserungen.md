# Verbesserungen
Stand: 2026-07-25 (Runde 2, Fokus: alles)

Runde 1 lief am 07.07.2026, ihr Bericht wurde aber nie nach `main` gemergt — er liegt als
`WEBSITE-AENDERUNGEN.md` auf dem Branch `claude/sharp-herschel-f7c5e1` (siehe **V1**).
Die Punkte N1–N11 von damals sind unten eingearbeitet und gegen den heutigen Code nachgeprüft.

## Kernfunktionen (Prüfliste — jede Runde erneut abfahren)

1. **Hauptseite erreichbar** — erwartet: V18 als Root-`index.html`, vollständig gerendert ·
   zuletzt: läuft (2026-07-25, HTTP 200, 1.196 KB, genau ein `h1`, kein horizontaler Overflow bei 375 px)
2. **Navigation und Anker** — erwartet: Desktop- und Mobilmenü, jeder Anker hat ein Ziel ·
   zuletzt: läuft (2026-07-25, Mobilmenü inkl. `aria-expanded` true/false korrekt)
3. **Kontaktweg „Erstgespräch anfragen"** — erwartet: Besucher kann eine Anfrage auslösen ·
   zuletzt: **kaputt** (2026-07-25 → V2)
4. **Stilprobe-Formular** — erwartet: Validierung greift, Absenden erzeugt sichtbare Rückmeldung ·
   zuletzt: Validierung läuft, Rückmeldung **kaputt** (2026-07-25 → V6)
5. **Kontingent-Badge** — erwartet: statischer Satz, solange `kontingent.php` fehlt ·
   zuletzt: läuft (2026-07-25, „15 Proben im Monat …", 404 wird still abgefangen — so gewollt)
6. **Galerie und Einzelvarianten** — erwartet: `/galerie/` und `/variants/<slug>/` erreichbar ·
   zuletzt: läuft (2026-07-25, alle geprüften Routen HTTP 200)
7. **Rechtsseiten** — erwartet: Impressum und Datenschutz mit gültigem Inhalt ·
   zuletzt: erreichbar, aber inhaltlich **kaputt** (2026-07-25 → V3, V4)
8. **Deploy-Kette** — erwartet: Push auf `main` → Action grün, alle Kernartefakte vorhanden ·
   zuletzt: läuft (letzte 5 Läufe grün, ~1 min 45 s)

## Offen

- [ ] **V1** (A) Ergebnisse der /improve-Runde vom 07.07.2026 liegen unveröffentlicht auf einem Branch
      Beleg: `git show claude/sharp-herschel-f7c5e1:WEBSITE-AENDERUNGEN.md` — 116 Zeilen, 1 Commit,
      seit 18 Tagen nicht gemergt; auf `main` existiert die Datei nicht · Aufwand: S · Risiko: gering
      Warum: Die Liste enthält elf durchnummerierte Punkte (N1–N11), von denen im Projektgedächtnis
      nur fünf ankamen. Was nirgends im Hauptzweig steht, wird beim nächsten Mal erneut gesucht.

- [ ] **V2** (A) Die Seite bietet keinen einzigen Kontaktweg
      Beleg: live gemessen auf `https://jgc-coding.github.io/jgc-studio-website/` — fünf Buttons
      „Erstgespräch anfragen" zeigen auf `#kontakt`, der Button *innerhalb* von `#kontakt` zeigt auf
      `#kontakt`, also auf sich selbst; `mailto:` = 0, `tel:` = 0, `<form>` = 0 · Aufwand: M · Risiko: hoch
      Warum: Der einzige Zweck der Seite ist, Erstgespräche auszulösen. Ein Besucher, der buchen will,
      klickt und bleibt auf derselben Stelle stehen. Es gibt keinen Weg, Gabriel zu erreichen.
      (Backlog-Punkt ① aus Runde 1, dort als „DER Blocker" geführt.)

- [ ] **V3** (A) Impressum ist leer und beruft sich auf ein außer Kraft gesetztes Gesetz
      Beleg: `site/src/pages/impressum.astro:18` — „Diese Seite ist in Vorbereitung. Die vollständigen
      Angaben nach § 5 TMG werden hier kurzfristig ergänzt."; live unter `/main/impressum/`
      Aufwand: S (Inhalt kommt von Gabriel) · Risiko: mittel
      Warum: Eine gewerbliche Seite mit Preisangaben braucht in Deutschland ein vollständiges
      Impressum. Das TMG heißt seit Mai 2024 DDG — der Verweis ist zusätzlich veraltet.
      (Backlog-Punkt ②.)

- [ ] **V4** (A) Datenschutzerklärung behauptet, die Seite werde „nur lokal getestet"
      Beleg: `site/src/pages/datenschutz.astro`, live unter `/main/datenschutz/`: „Diese Website wird
      derzeit nur lokal getestet und sammelt keine personenbezogenen Daten." — die Seite ist seit
      Wochen öffentlich erreichbar und nimmt über `/stilprobe/` personenbezogene Daten entgegen
      Aufwand: S · Risiko: mittel
      Warum: In einem Rechtsdokument steht eine Aussage, die nachweislich nicht stimmt. Der darunter
      stehende, sorgfältig gebaute Stilprobe-Abschnitt widerspricht ihr direkt.

- [ ] **V5** (A) Stilprobe-Formular sichert Eingaben nicht — Reload löscht alles
      Beleg: live getestet, drei Textfelder gefüllt, `location.reload()`, danach alle Felder leer;
      im Quelltext kein `localStorage`, `sessionStorage`, `beforeunload` oder IndexedDB
      Aufwand: S · Risiko: mittel
      Warum: Das Formular verlangt drei Texte von je 200–6.000 Zeichen. Ein versehentlicher Reload,
      ein Zurück-Klick oder ein Browserabsturz vernichtet die gesamte Arbeit — und die Anfrage
      kommt nie an, ohne dass Gabriel davon erfährt. Verstößt gegen die Autosave-Regel.

- [ ] **V6** (B) Fehlschlag beim Absenden bleibt unsichtbar — Meldung steht 2.140 px über dem Knopf
      Beleg: `stilprobe/index.html:665` — `#stilprobe-fehler` steht *vor* dem `<form>`; live gemessen:
      Meldung bei Dokument-Y 2.220, Absendeknopf bei 4.360; nach dem Klick liegt die Meldung
      1.762 px oberhalb des Bildschirmrands · Aufwand: S · Risiko: gering
      Warum: Solange `senden.php` fehlt, scheitert **jede** Absendung. Der Nutzer sieht keine
      Veränderung, das Knopf-Label springt auf den Ausgangstext zurück — die Anfrage ist weg,
      ohne dass es jemand merkt. Ein Screenreader hört die Meldung (`role="alert"`), das Auge nicht.

- [ ] **V7** (B) Ohne JavaScript bleiben rund 68 % des Seiteninhalts unsichtbar
      Beleg: `variants/standalone/18-lumen/index.html:304` und `:314` — die Skin-Schicht
      (`<style id="skin-impeccable">`, ab Zeile 7) setzt `.reveal:not(.is-visible){opacity:0}` **ohne**
      den `.js`-Vorsatz, den die Basis-Ebene korrekt verwendet (`.js .reveal:not(.is-visible)`).
      Live bewiesen: nach Entfernen der `js`-Klasse vom `<html>` bleiben alle 21 Reveal-Blöcke auf
      `opacity: 0`; sie enthalten 7.336 von 10.827 Zeichen Seitentext · Aufwand: S · Risiko: gering
      Warum: Der Schutz gegen „JavaScript lädt nicht" war da und wurde von der Design-Schicht
      unbemerkt ausgehebelt. Fällt das Skript aus, sieht der Besucher eine fast leere Seite.

- [ ] **V8** (B) Der Deko-Verlauf ist beim Einbau der Stilprobe still eine Sektion nach oben gerutscht
      Beleg: git-Vergleich der Sektionsreihenfolge — bei `4dff254` traf
      `section.bg-pergament:nth-child(5 of .bg-pergament)` auf „Lass uns schauen, ob das passt.";
      seit Einbau von `#stilprobe` (Commit `5fda405`) trifft dieselbe Regel auf
      „Was Kunden über die Arbeit sagen." Live bestätigt · Aufwand: S · Risiko: gering
      Warum: Der Hervorhebungs-Verlauf liegt jetzt auf den Platzhalter-Zitaten statt auf der
      Passt-das-Sektion. Genau davor warnte N8 aus Runde 1 — vier Tage später ist es passiert,
      und niemand hat es bemerkt. Position-basierte Selektoren durch ID-basierte ersetzen.

- [ ] **V9** (B) Sieben veraltete Design-Varianten sind für Suchmaschinen freigegeben
      Beleg: `variants/standalone/*/index.html` — 09a–09f und 13-lumen tragen
      `robots: index, follow` **und** `canonical: http://localhost:4321/`; 14–17 haben gar kein
      Robots-Meta; nur 10/11/12 stehen korrekt auf `noindex` · Aufwand: S · Risiko: gering
      Warum: Ein canonical auf `localhost` ist für Google wertlos. Damit können sieben alte Entwürfe
      der Verkaufsseite — teils mit alter Marke „JGC Studio" und alten Preisen — im Index landen und
      mit der echten Seite konkurrieren. Zusätzlich ist `/main/` (alter Inhaltsstand) ohne canonical
      auf `index, follow`. Überschneidet sich mit der Hub-Aufgabe „SEO-Überarbeitung".

- [ ] **V10** (A) Acht bekannte Schwachstellen in den Build-Abhängigkeiten
      Beleg: `npm audit` in `site/` — 6 hoch, 2 niedrig (astro, vite, esbuild, postcss, svgo, sharp,
      js-yaml); vollständige Behebung verlangt Astro 7 (Major) · Aufwand: M · **Risiko: gering**
      Warum: Keines dieser Pakete läuft im Browser der Besucherin — die Seite ist statisches HTML.
      Betroffen sind der GitHub-Runner und Gabriels lokaler `npm run dev`. Die zwei Windows-
      spezifischen Funde (esbuild, vite) treffen nur den lokalen Entwicklungsserver.
      Verdrängt bewusst keinen der Punkte oben.

- [ ] **V11** (C) Primärer CTA-Knopf erfüllt den Kontrast-Mindestwert nicht
      Beleg: live gemessen — Pergament `rgb(254,252,247)` auf Kupfer `rgb(201,123,63)` = **3,21 : 1**
      bei 17,1 px / Schriftstärke 500; WCAG AA verlangt 4,5 : 1. Der Knopf kommt 6× auf der Seite vor.
      Zusätzlich 15 Kleintexte mit Deckkraft 0,55–0,6 bei 3,32–3,81 : 1 · Aufwand: S · Risiko: gering
      Warum: Der wichtigste Knopf der Seite ist für Menschen mit schwacher Sehkraft am schlechtesten
      lesbar. Eine Stufe dunkleres Kupfer reicht. (N7 aus Runde 1, jetzt mit Messwerten.)

- [ ] **V12** (C) `og:image` fehlt, `twitter:card` verspricht aber ein großes Vorschaubild
      Beleg: live — `og:image` und `twitter:image` nicht vorhanden, `twitter:card` steht auf
      `summary_large_image` · Aufwand: S · Risiko: gering
      Warum: Beim Teilen auf LinkedIn — dem Hauptkanal — erscheint eine leere Karte. Das ist
      schlechter als eine kleine Karte ohne Bildversprechen. (Backlog-Punkt ④.)

- [ ] **V13** (C) Drei erfundene Kundenstimmen mit Platzhalter-Label
      Beleg: live in „Was Kunden über die Arbeit sagen." — Vorspann „Pilotkunden-Zitate folgen. Die
      hier gezeigten Karten sind klar als Platzhalter gekennzeichnet.", darunter drei Karten mit
      „Platzhalter — Pilotkundin/Pilotkunde" · Aufwand: S · Risiko: gering
      Warum: Die Kennzeichnung ist ehrlich und richtig — aber sie sagt der Zielgruppe dreimal
      hintereinander „ich habe noch keine Kunden". Der ehrliche Einleitungssatz allein trägt mehr
      Vertrauen als drei gelabelte Attrappen. (Deckt sich mit Runde 1, dort Punkt „Echten Beweis".)

- [ ] **V14** (C) LinkedIn-Fußzeilenlink zeigt auf die LinkedIn-Startseite
      Beleg: `site/src/components/Footer.astro:72` — `href="https://www.linkedin.com"`; identisch in
      V18 und auf der Stilprobe-Seite · Aufwand: S · Risiko: gering
      Warum: Ein Vertrauens-Link, der nirgendwohin führt, wirkt schlechter als gar keiner.
      (Backlog-Punkt ③.)

- [ ] **V15** (D) Galerie trägt noch die alte Marke und lädt Google Fonts von außen
      Beleg: `scripts/generate-gallery.mjs:285, 286, 296, 317` — „JGC Studio" 4× im erzeugten HTML;
      Zeile mit `fonts.googleapis.com`/`fonts.gstatic.com` im Kopf · Aufwand: S · Risiko: gering
      Warum: Runde 1 hat die Marke in den Astro-Seiten korrigiert, den Galerie-Generator aber
      übersehen. Die eingebundenen Google-Fonts widersprechen zudem der Zusage „Schriftarten werden
      lokal ausgeliefert" aus der eigenen Datenschutzerklärung — die Galerie steht auf `noindex`
      und ist nirgends verlinkt, aber öffentlich abrufbar.

- [ ] **V16** (D) Zwei Transform-Skripte schreiben in einen fremden Worktree
      Beleg: `scripts/stilprobe/transform-v18-stilprobe.mjs:28` und
      `scripts/stilprobe/fix-v18-logo-link.mjs:23` — beide mit hartkodiertem
      `C:\Projekte\JGC Studio\.claude\worktrees\stilprobe-automation-website-af3a9a\…`;
      dieser Worktree existiert noch und steht auf einem älteren Commit. Das neuere
      `scripts/v18/transform-tuvlink-schritt2.mjs:48` macht es bereits richtig (Pfad relativ zum
      Skript) · Aufwand: S · Risiko: gering
      Warum: Wer eines der beiden Skripte erneut ausführt, ändert unbemerkt die falsche Datei —
      die Assertions greifen, der Effekt landet nur nie dort, wo er hin soll.

- [ ] **V17** (D) Prozess-Stufe fehlt in der Projekt-CLAUDE.md, `.claude/pruefen.txt` fehlt
      Beleg: `CLAUDE.md` Zeilen 1–5 enthalten weder „Werkstatt" noch „Produkt";
      `ls .claude/pruefen.txt` → nicht vorhanden · Aufwand: S · Risiko: gering
      Warum: Ohne die Stufe ist nicht entscheidbar, ob eine fehlende Datei Absicht oder Versäumnis
      ist. Ohne `pruefen.txt` läuft das Done-Gate am Zugende ins Leere — „geprüft" bleibt eine
      Behauptung ohne maschinelle Absicherung. (Positiv geprüft: die CLAUDE.md enthält keine
      Status-Zeilen und liegt mit 5.842 Zeichen deutlich unter dem Richtwert.)

## Ideen

- **I1** (Abrundung) Link- und Meta-Prüfung im Deploy-Workflow — Aufwand: S–M
      Bedarf: V2 (Anker zeigt auf sich selbst), V9 (canonical auf `localhost`) und V12 (fehlendes
      `og:image`) sind alle drei Fehler, die eine automatische Prüfung über `_site` vor dem Deploy
      gefunden hätte. Der Workflow prüft heute nur, ob vier Dateien existieren.
      Abgrenzung: harte Fehler (tote Anker, tote interne Links, canonical auf localhost, fehlende
      Pflicht-Metas) — kein Lighthouse-Score-Gate, keine Design-Bewertung. Entspricht N9 aus Runde 1.

- **I2** (Erweiterung) Variante 18 in die Astro-Quelle zurückführen — Aufwand: L
      Bedarf: `site/src/` ist zwei Generationen hinter der Live-Seite (`/main/` zeigt noch „Audit
      anfragen" und den alten Aufbau). Jede Änderung an V18 verlangt heute ein eigenes
      assertion-guardetes Node-Skript auf einer 1,2-MB-Zeile — drei solcher Skripte existieren
      bereits. V7 (Skin hebt `.js`-Schutz auf), V9 (localhost-canonical) und das Seitengewicht
      lösen sich dabei mit auf.
      Abgrenzung: reine Überführung des beschlossenen Standes, kein Redesign, keine neuen Sektionen.
      Entspricht N1 aus Runde 1. Sinnvoll gebündelt mit dem Astro-7-Upgrade aus V10.

- **I3** (Abrundung) FAQ „Was kostet das insgesamt?" — Aufwand: S
      Bedarf: Die Preise stehen über die Seite verstreut (Praxis-Check 600 €, Bausteine ab 2.500 /
      3.000 / 4.000 €, Resonanzraum ab 300 €/Monat, Anrechnungs-Hinweis an zwei Stellen). Die
      häufigste stille Frage — was kostet mich das am Ende — beantwortet keine Stelle im
      Zusammenhang. Der FAQ-Block existiert bereits und hat elf Einträge.
      Abgrenzung: eine zusammenfassende Rechenbeispiel-Antwort, keine neue Preisseite, keine
      Preisänderung. Entspricht N11 aus Runde 1.

## Abgelehnt

*(noch keine Einträge — Gabriel hat bisher keinen Punkt ausdrücklich abgelehnt)*

## Erledigt

- **N2** (Runde 1) Zweiter, niederschwelliger Kontaktweg — erledigt am 2026-07-11 durch die Stilprobe
- **N3** (Runde 1) Nav-Logo-Link zeigte auf `../../` — erledigt am 2026-07-12 (absoluter Pfad)
- **N6** (Runde 1) TÜV-Siegel nachprüfbar machen — erledigt am 2026-07-12 (Certipedia-Link)
- **N-Punkt** (Runde 1) `og:url`/`canonical` auf `http://localhost:4321/` in V18 — erledigt,
  V18 trägt heute die korrekte Live-URL (die übrigen Varianten nicht, siehe V9)
- **Marke „JGC Studio" in den Astro-Seiten** — erledigt am 2026-07-11 (Galerie offen, siehe V15)
