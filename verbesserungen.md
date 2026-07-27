# Verbesserungen
Stand: 2026-07-27 (Runde 3, Fokus: Scroll-Reise `der-weg/` — Code + Design,
Haltung: Nur messbare Fehler, Lupe: emil-design-eng)

Runde 2 (Fokus: alles) ist live seit 2026-07-25, Commit `4f3cc16`. Rollback-Punkt davor: `8d33cd0`.
Runde 3 hat nur `der-weg/` und seine Werkzeuge angesehen; V18/Hauptseite, `site/`, `stilprobe/`
blieben unangetastet. Teil 3 (Ausbau-Ideen) lief in Runde 3 nicht — der Fokus war Code + Design.

## Vorgeschichte: drei Runden, dasselbe Ergebnis

Es gab vor dieser Runde bereits **zwei** Analysen, die beide nie im Hauptzweig landeten:

| Runde | Datum | Wo sie lag | Schicksal |
|---|---|---|---|
| 0 | 27.06.2026 | nur als Text bei Gabriel | am 25.07. wiedergefunden |
| 1 | 07.07.2026 | `WEBSITE-AENDERUNGEN.md` auf `claude/sharp-herschel-f7c5e1` | 18 Tage unbemerkt, nie gemergt |
| 2 | 25.07.2026 | **diese Datei auf `main`** | — |

Vier Punkte standen in **allen drei** Runden: toter Kontakt-CTA, fehlendes `noindex` der
Varianten, `canonical`/`og:url` auf `localhost`, fehlendes `og:image`. Sie wurden dreimal
gefunden und keinmal erledigt — nicht aus Nachlässigkeit, sondern weil es keinen Ort gab, an
dem ein Befund überlebt. Diese Datei ist dieser Ort; sie liegt auf `main` und wird committet.

### Abgleich mit dem Befund vom 27.06.2026

| Punkt von damals | Stand heute |
|---|---|
| CTA führt ins Leere, kein Kontaktweg | **erledigt** (V2) — mailto + sichtbare Adresse |
| Impressum/Datenschutz laufen ins 404 | **erledigt am 11.07.** — beide Seiten liefern 200; die *Inhalte* waren die eigentliche Lücke → V3/V4 |
| `noindex` für alle Preview-Varianten | **erledigt** (V9) — 14 Varianten umgestellt |
| `og:url` auf `http://localhost:4321/` | **erledigt** — in V18 schon früher, in den Alt-Varianten jetzt (V9) |
| `og:image` fehlt | **erledigt** (V12) — `assets/og-bild.jpg`, 1200×630 |
| Asset-Gewicht 1 MB beim All-Inkl-Launch | **offen** → V18, gebündelt mit I2 |
| Erfolgsmessung / cookiefreies Analytics | **Gabriels Entscheidung** — steht als „Cookie-Thema" auf seiner Hub-Liste |
| „Was bewusst gut bleibt" (Abschnitt C) | unverändert gültig, deckt sich mit Runde 1 |

Die Zahlenangaben von damals sind teils überholt: 390 KB Fonts → tatsächlich ~525 KB in
14 Subsets; „1 MB Single-File" → 1,20 MB.

## Kernfunktionen (Prüfliste — jede Runde erneut abfahren)

1. **Hauptseite erreichbar** — erwartet: V18 als Root-`index.html`, vollständig gerendert ·
   zuletzt: läuft (2026-07-25, HTTP 200, genau ein `h1`, kein Overflow bei 375 px)
2. **Navigation und Anker** — erwartet: Desktop- und Mobilmenü, jeder Anker hat ein Ziel ·
   zuletzt: läuft (2026-07-25, `aria-expanded` korrekt; seither maschinell in `pruefe-seiten.mjs`)
3. **Kontaktweg „Erstgespräch anfragen"** — erwartet: Besucher kann eine Anfrage auslösen ·
   zuletzt: läuft (2026-07-25, mailto + sichtbare Adresse; maschinell bewacht)
4. **Stilprobe-Formular** — erwartet: Validierung greift, Rückmeldung ist sichtbar, Eingaben
   überleben einen Reload · zuletzt: läuft (2026-07-25, lokal end-to-end getestet)
5. **Kontingent-Badge** — erwartet: statischer Satz, solange `kontingent.php` fehlt ·
   zuletzt: läuft (2026-07-25, 404 wird still abgefangen — so gewollt)
6. **Galerie und Einzelvarianten** — erwartet: `/galerie/` und `/variants/<slug>/` erreichbar ·
   zuletzt: läuft (2026-07-25, alle geprüften Routen HTTP 200)
7. **Rechtsseiten** — erwartet: Impressum und Datenschutz mit gültigem Inhalt ·
   zuletzt: Datenschutz sachlich richtig, **Impressum weiter leer** (V3, braucht Gabriels Daten)
8. **Deploy-Kette** — erwartet: Push auf `main` → Action grün, alle Kernartefakte vorhanden ·
   zuletzt: läuft (letzte 5 Läufe grün, ~1 min 45 s)

### Scroll-Reise `der-weg/` (seit Runde 3; im versteckten Preview-Pane sind nur
### Aufbau, Zustände und Geometrie prüfbar — die Kamerafahrt selbst nicht)

9. **Reise mountet** — erwartet: 7 Szenen, 7 Stationen, kein Konsolenfehler ·
   zuletzt: läuft (2026-07-27, alle Requests 200)
10. **Datenmodus entscheidet selbst** — erwartet: erst Standbilder, Freigabe nach Messung,
    Lagezeile im Abspann stimmt · zuletzt: läuft (lokal: „mit Video — die Verbindung trägt es"),
    aber zwei Logik-Befunde V22/V23
11. **Video-Nachladen** — erwartet: Clip als Blob geholt, Poster bis zum ersten Frame ·
    zuletzt: läuft (anflug.mp4 geladen; `has-clip` braucht rAF → am Gerät prüfen)
12. **„Mehr dazu"-Feld** — erwartet: öffnet, Fokus wandert hinein, Escape schließt,
    Fokus kehrt zum Knopf zurück · zuletzt: läuft (2026-07-27, alles gemessen)
13. **Hochkant-Fassung** — erwartet: Bildband oben, Text unten, kein seitlicher Überlauf ·
    zuletzt: läuft bei 320/393/768; bei 375×812 zwei Kalibrier-Befunde (V25)
14. **Ohne JavaScript** — erwartet: SEO-Block und Langfassungen als Lesetext ·
    zuletzt: läuft (`.js`-Klasse ab-/angeschaltet und gemessen)
15. **Kamerafahrt/Scrubbing** — nicht prüfbar im versteckten Pane (rAF läuft dort nicht);
    steht als Telefontest auf Gabriels Hub-Liste

## Offen

- [ ] **V20** (A) Stilprobe-Beispiel nennt sich „echt", ist im Quelltext aber als Platzhalter markiert
      Beleg: `variants/standalone/18-lumen/index.html`, Sektion `#stilprobe` — zwei Kommentare
      `PLATZHALTER Phase 6: durch Ausschnitt aus Gabriels eigener Stilprobe ersetzen` stehen über
      Fassung A und B; unmittelbar darunter liest die Besucherin „Ausschnitt aus einer echten
      Stilprobe – an meinen eigenen Texten erprobt, bevor ich sie anbiete."
      Aufwand: S · Risiko: mittel
      Warum: Die Aussage ist eine Werbeaussage über Echtheit, und nach der eigenen Projekt-Doku
      trifft sie nicht zu. Entweder die beiden Texte durch echte Ausschnitte aus Gabriels Probe
      ersetzen (dann stimmt der Satz) oder den Satz umformulieren („So kann das aussehen").
      Beides ist klein — nur beides zusammen stehen zu lassen geht nicht.
      → braucht Gabriels Entscheidung bzw. seine eigene Stilprobe.

- [ ] **V3** (A) Impressum ohne Inhalt — **braucht Gabriels Daten**
      Beleg: `site/src/pages/impressum.astro:18`, live unter `/main/impressum/`
      Aufwand: S · Risiko: mittel
      Warum: Eine gewerbliche Seite mit Preisangaben braucht in Deutschland ein vollständiges
      Impressum nach § 5 DDG. Der veraltete Gesetzesverweis ist korrigiert, der Inhalt fehlt.
      Benötigt: vollständiger Name, ladungsfähige Anschrift, E-Mail, ggf. USt-IdNr. und
      Berufsangaben. → steht in `meine-todos.md`.

- [ ] **V10** (A) Vier verbleibende Schwachstellen in den Build-Abhängigkeiten
      Beleg: `npm audit` in `site/` — nach `npm audit fix` von 8 auf 4 (von 6 auf 2 hoch);
      betroffen bleiben astro, sharp, esbuild, @astrojs/tailwind · Aufwand: M · **Risiko: gering**
      Warum: Keines dieser Pakete läuft im Browser der Besucherin — die Seite ist statisches
      HTML. Die Behebung verlangt Astro 7 (Breaking Change) und gehört zu I2.

- [ ] **V21** (B) Reise: unsichtbare Stationen bleiben klick- und tastatur-erreichbar
      Beleg: `scrub-engine.js:432-433` setzt beim Ausblenden nur `opacity` und `pointer-events`
      auf die Station; das Engine-CSS `.sw-copy__cta{pointer-events:auto}` (`scrub-engine.js:601`)
      schaltet die CTA-Kinder wieder scharf. Gemessen am 27.07. (Desktop 1280×720, Scroll ganz
      oben): `elementFromPoint` auf x64–437/y485–532 trifft die zwei unsichtbaren Knöpfe
      „Erstgespräch anfragen" (mailto) und „Zur Stilprobe" der Station 7 — Parent-Opacity 0.
      `focus()` auf beide und auf die „Mehr"-Knöpfe aller inaktiven Stationen gelingt ebenfalls.
      Aufwand: S · betrifft die Engine → gehört mit in die ohnehin offene Skill-Rückgabe.
      Fix-Idee: in `read()` zusätzlich `visibility` schalten (`cop > 0.01 ? '' : 'hidden'`) —
      nimmt Klick UND Fokus, rückwärtskompatibel.

- [ ] **V22** (B) Datenmodus: Schalter speichert in der Prüfphase das Gegenteil seiner Beschriftung
      Beleg: `der-weg/index.html:1225-1226` — im Zustand „waiting" zeigt der Schalter
      „Auf datensparsam umstellen"; der Klick-Handler `index.html:1261` speichert aber
      `(mode() === 'video') ? 'sparsam' : 'voll'`, und „waiting" fällt in den 'voll'-Zweig.
      Fenster: bis zur Entscheidung (max. 6 s), erreichbar z. B. über die Sprungmarke direkt
      zum Abspann. Aufwand: S — „waiting" explizit behandeln oder Schalter bis zur
      Entscheidung deaktivieren.

- [ ] **V23** (B) Datenmodus: Cache-Vermutung gibt gerade den langsamsten Leitungen das Video frei
      Beleg: `der-weg/index.html:1206` — unter 40 KB übertragener Daten gilt „alles aus dem
      Zwischenspeicher" → `allowClips()` + `endgueltig = true` (Z. 1233-1234); der 6-s-Kontrolllauf
      findet nie statt. Die drei Ressourcen, die vor dem Skript sicher fertig sind, wiegen live
      aber nur 19.066 Bytes gzip (scrub-engine 14.535 + vertiefung 4.051 + schriften.css 480,
      Live-Abruf 27.07.). Auf einer Leitung unter ~25 KB/s ist nach 1,8 s sonst nichts fertig
      (Fonts ~50–100 KB je Datei, Poster lazy) → Messung „null" → volle Fassung genau dort, wo
      sie laut eigenem Kommentar „am meisten weh tut" (iPhone ohne Netz-Signale). Aufwand: S —
      „null" beim ersten Lauf nicht endgültig werten, Cache stattdessen an
      `transferSize === 0`-Einträgen erkennen.

- [ ] **V24** (B) Engine-Nav: aktiver Reiter unter WCAG AA, Chips auf Salbei knapp darunter
      Beleg: `.sw-nav__item.is-active{color:#fff;background:var(--sw-accent)}`
      (`scrub-engine.js:586`) — gemessen bei 13,1 px: Weiß auf Kupfer #C97B3F = 3,29:1,
      auf Salbei #8FA98A = 2,56:1, auf Quellwasser #6FA3B5 = 2,77:1 (Soll: 4,5:1).
      Nebenbefund: Schlagwort-Chips der Salbei-Station 4,34:1 (`scrub-engine.js:600`), Kupfer
      5,19 und Quellwasser 4,60 bestehen. Aufwand: S — Pill-Fläche auf Tinte #1F2A44 statt
      Szenenakzent (13,9:1), eine Override-Zeile in der Seite + Skill-Rückgabe.
      **Benannter Widerspruch, nicht neu bewertet:** die Kupfer-Kleintexte (Eyebrows, 3,21:1
      bei 12,8 px fett) stehen seit Runde 2 als bewusste Marken-Entscheidung („Eyebrows bleiben
      Kupfer", V11) — auf der Reise gilt dieselbe Lage; auflösen kann das nur Gabriel.

- [ ] **V13** (C) Drei erfundene Kundenstimmen mit Platzhalter-Label — **Gabriels Entscheidung**
      Beleg: Sektion „Was Kunden über die Arbeit sagen." in V18 · Aufwand: S · Risiko: gering
      Warum: Die Kennzeichnung ist ehrlich, sagt der Zielgruppe aber dreimal hintereinander
      „ich habe noch keine Kunden". Der ehrliche Einleitungssatz allein trägt vermutlich mehr
      Vertrauen als drei gelabelte Attrappen. Ob die Karten bleiben, ist eine Marketing-
      Entscheidung, keine technische. → steht in `meine-todos.md`.

- [ ] **V14** (C) LinkedIn-Fußzeilenlink — **braucht Gabriels Profil-URL**
      Beleg: entfernt in `site/src/components/Footer.astro`, V18 und `stilprobe/index.html`
      Aufwand: S · Risiko: gering
      Warum: Der Link zeigte auf die LinkedIn-Startseite. Bis die echte Profiladresse vorliegt,
      ist kein Link besser als ein toter. → steht in `meine-todos.md`.

- [ ] **V18** (C) Seitengewicht 1,20 MB als Single-File
      Beleg: Live-Abruf der Startseite, 1.196 KB; Fonts ~525 KB in 14 Subsets (inkl. Kyrillisch,
      Griechisch, Vietnamesisch), Bilder dekodiert ~384 KB · Aufwand: M · Risiko: gering
      Warum: Alles ist inline, nichts wird zwischengespeichert — jeder Aufruf lädt erneut das
      volle Megabyte. Sinnvoll erst beim All-Inkl-Umzug und gebündelt mit I2 (externe Dateien
      mit Caching, Font-Subsets auf latin/latin-ext ≈ 60–80 KB). Stand seit 27.06. offen.

- [ ] **V25** (C) Reise hochkant: die 375er-Gerätebreite fällt zwischen die Messpunkte 360 und 393
      Beleg: gemessen am 27.07. bei 375×812 (iPhone-X/12-mini-Klasse): (a) Kopfzeile der
      ERSTEN Station bricht zweizeilig um (43 px statt 25 px — der längste Kleintext plus
      „Mehr +" braucht ~353 px, verfügbar sind 337; die Messung in `index.html:265-267` galt
      393 px); ebenso bei 320. (b) Die LETZTE Station überläuft ihren Textstreifen um 12 px
      (Inhalt 298 px, Platz 286 px) und ragt oben ins Bildband. Gegenprobe 393×852: alles
      einzeilig, nichts läuft über. Aufwand: M — Kalibrierung der `max-width: 379px`-Stufe
      (`index.html:310-312`) und der Schriftstufen auf 375–392 nachziehen und nachmessen.

- [ ] **V26** (C) Zeilenlängen im Leseteil über dem Richtwert von 75 Zeichen
      Beleg: gemessen am 27.07. (Desktop 1280): FAQ-Antworten 88 Zeichen in der ersten Zeile
      (`.frage p`, max-width 38rem, `index.html:577-580`); Langfassungen ohne JavaScript
      102 Zeichen (`.vertiefungen`-Fluss, 736 px, `index.html:484-485`). Das „Mehr dazu"-Feld
      selbst liegt mit 66 Zeichen im grünen Bereich. Aufwand: S — Textmaß der FAQ auf ~34rem,
      No-JS-Fluss auf ~40rem begrenzen.

- [ ] **V19** (D) Alter Analyse-Branch `claude/sharp-herschel-f7c5e1` kann weg
      Beleg: `git log main..claude/sharp-herschel-f7c5e1` — 1 Commit vom 07.07., einziger
      Eigenwert war `WEBSITE-AENDERUNGEN.md`; dessen Inhalt steht jetzt hier · Aufwand: S
      Warum: Reines Aufräumen — aber erst löschen, wenn Gabriel bestätigt, dass die Übernahme
      vollständig ist. Branches werden nie ungefragt gelöscht.
      **Nicht anfassen:** die neun `variant/*`-Branches. Der Deploy-Workflow baut sie bei jedem
      Lauf; ein Löschen würde die Galerie beschädigen.

- [ ] **V27** (D) Reduced-Motion-Regel zielt auf ein Element, das es nicht gibt
      Beleg: `der-weg/index.html:472` neutralisiert `.weg-mehr:hover svg` — der Knopf enthält
      aber ein `<i>` (Z. 389-392, Rotation in Z. 397). Wer Bewegung abgeschaltet hat, sieht das
      Plus trotzdem drehen. Gleiche Familie: das FAQ-Plus (`.frage summary::after`, Z. 566-571)
      hat gar keinen Reduce-Fallback. Aufwand: S. Mikrobewegungen — aber die Regel existiert ja
      und verfehlt nur ihr Ziel.

- [ ] **V28** (D) Redaktionsreste und kleine Werkzeug-Lücken
      Beleg: doppelte, einander widersprechende Kommentarblöcke `der-weg/index.html:204-232`
      und `258-263`; Kommentar „unter dem Umschalter (90)" (Z. 531) verweist auf den längst
      entfernten Umschalter; `scripts/der-weg/kodiere.mjs:30` enthält einen Ternary mit zwei
      identischen Zweigen; im Idempotenz-Check `kodiere.mjs:149` fehlt `posterM` — fehlt nur
      das Handy-Poster, meldet das Skript „liegt schon vor". Dazu zwei Engine-Notizen für die
      Skill-Rückgabe: `loadClip` versucht es nach einem Fehlschlag bei jedem Scroll-Frame
      erneut (`scrub-engine.js:373`, Request-Flut bei dauerhaftem 404), und
      `max-height: min(82dvh, 44rem)` (`index.html:422`) hat keine vh-Rückfalllinie für
      Browser ohne `dvh`. Aufwand: S.

## Ideen

- **I1** (Abrundung) Link- und Meta-Prüfung im Deploy — **umgesetzt am 2026-07-25**
      Als `scripts/pruefe-seiten.mjs` gebaut und im Workflow verankert; Details unter Erledigt.

- **I2** (Erweiterung) Variante 18 in die Astro-Quelle zurückführen — Aufwand: L
      Bedarf: `site/src/` ist zwei Generationen hinter der Live-Seite (`/main/` zeigt noch
      „Audit anfragen" und den alten Aufbau). Jede Änderung an V18 verlangt ein eigenes
      assertion-guardetes Node-Skript auf einer 1,2-MB-Zeile — inzwischen sind es fünf.
      V10 (Astro 7) und V18 (Seitengewicht) lösen sich dabei mit auf.
      Abgrenzung: reine Überführung des beschlossenen Standes, kein Redesign, keine neuen
      Sektionen. Entspricht N1 aus Runde 1.

- **I3** (Abrundung) FAQ „Was kostet das insgesamt?" — Aufwand: S
      Bedarf: Die Preise stehen verstreut (Praxis-Check 600 €, Bausteine ab 2.500 / 3.000 /
      4.000 €, Resonanzraum ab 300 €/Monat, Anrechnungs-Hinweis an zwei Stellen). Die
      häufigste stille Frage — was kostet mich das am Ende — beantwortet keine Stelle im
      Zusammenhang. Der FAQ-Block existiert bereits und hat elf Einträge.
      Abgrenzung: eine zusammenfassende Antwort mit Rechenbeispiel, keine neue Preisseite,
      keine Preisänderung. Entspricht N11 aus Runde 1. Braucht Gabriels Freigabe des Wortlauts.

- **I4** (Später) Vorschaubild mit Wortmarke statt nur Sigel — Aufwand: S
      Bedarf: `assets/og-bild.jpg` trägt Foto, Markenverlauf und Sigel, aber keinen Schriftzug —
      die Schrift Fraunces liegt nur als woff2 in der Seite und lässt sich mit `sharp` nicht
      ohne Weiteres setzen. Reicht so, wirkt aber ruhiger als nötig.
      Abgrenzung: nur das Teilen-Bild, keine Änderung an der Seite selbst.

## Abgelehnt

*(noch keine Einträge — Gabriel hat bisher keinen Punkt ausdrücklich abgelehnt)*

## Erledigt

Alle folgenden Punkte wurden am **2026-07-25** in Commit `f3a7d94` umgesetzt und geprüft.

- **V1** (A) Ergebnisse der Runde vom 07.07. lagen unveröffentlicht auf einem Branch —
  Inhalt vollständig in diese Datei übernommen, offene Punkte als V-Nummern fortgeschrieben.
- **V2** (A) Kein Kontaktweg auf der Seite — der Knopf in `#kontakt` zeigte auf sich selbst.
  Jetzt `mailto:kontakt@jgc-lumen.de` mit vorbelegtem Betreff, darunter die sichtbare Adresse
  (greift auch ohne eingerichtetes Mailprogramm). Die übrigen `#kontakt`-Verweise bleiben
  Sprungmarken auf die Sektion. Maschinell bewacht durch `pruefe-seiten.mjs`.
- **V4** (A) Datenschutz behauptete „wird derzeit nur lokal getestet" — ersetzt durch den
  tatsächlichen Stand samt GitHub-Pages-Auslieferung (USA, Art. 6 Abs. 1 lit. f) und dem
  neuen Entwurfsspeicher. Der Gesetzesverweis im Impressum: § 5 TMG → § 5 DDG.
- **V5** (A) Stilprobe-Formular ohne Autosave — Entwurf wird laufend im Browser der Besucherin
  gesichert (localStorage, 400 ms Debounce), nach einem Reload mit Zeitstempel-Hinweis
  wiederhergestellt, per Knopf verwerfbar und nach erfolgreichem Absenden gelöscht.
- **V6** (B) Fehlermeldung stand 2.140 px über dem Absendeknopf und war beim Klick unsichtbar —
  jetzt direkt über dem Knopf, mit `scrollIntoView` und Fokus. Gemessen: 118 px Abstand, im Bild.
- **V7** (B) Ohne JavaScript blieben 68 % des Seitentexts unsichtbar — die Skin-Ebene setzte
  `.reveal:not(.is-visible){opacity:0}` ohne den `.js`-Vorsatz der Basis-Ebene. Betraf V18 **und**
  die Stilprobe-Seite (erbt das CSS aus V18) — letzteres fand `pruefe-seiten.mjs` bei seinem
  ersten Lauf selbst.
- **V8** (B) Deko-Verlauf war beim Einbau der Stilprobe still eine Sektion nach oben gerutscht —
  Selektoren von `:nth-child(N of .bg-pergament)` auf IDs umgestellt (`#vorher-nachher`,
  `#passt`; auf der Stilprobe-Seite `#einleitung`, `#abschluss`).
- **V9** (B) Sieben Alt-Varianten auf `index, follow` mit `canonical` auf `localhost`, vier
  weitere ohne Robots-Meta — 14 Varianten auf `noindex, nofollow` gesetzt, localhost-Adressen
  entfernt.
  **Nachtrag am selben Tag:** Der neue Prüfschritt hat den ersten Deploy gestoppt und dabei
  gefunden, was diese Analyse übersehen hatte — **neun weitere Varianten (01–09)** werden vom
  Workflow aus den `variant/*`-Branches gebaut und liegen als Datei nirgends im Repo, ein
  Quellen-Skript konnte sie also gar nicht erwischen. Sie standen unverändert auf
  `index, follow`. Behoben mit `scripts/site-noindex.mjs`, das nach dem Build direkt auf `_site`
  stempelt: alle Varianten (auch künftige) plus `/main/`, dessen Astro-Stand zwei Generationen
  älter ist, aber denselben Titel trägt und damit eine zweite konkurrierende Startseite wäre.
  Auch die Kopie der Hauptseite unter `/variants/18-lumen/` geht bewusst mit auf `noindex` —
  dieselbe Seite soll nicht zweimal im Index stehen. **Live indexierbar sind jetzt genau zwei
  Seiten: die Startseite und `/stilprobe/`.**
  *Lehre: Bei diesem Repo reicht es nicht, die Quellen zu prüfen — ein Teil der ausgelieferten
  Seiten entsteht erst im Build.*
- **V11** (C) Primärknopf bei 3,21 : 1 unter WCAG AA — Knopffläche auf `#A55F2B` (4,79 : 1),
  Kleintexte mit Deckkraft 0,55/0,6 auf 0,70. Die Markenfarbe Kupfer bleibt für Ränder,
  Eyebrows und Akzente unverändert.
- **V12** (C) `og:image` fehlte, `twitter:card` versprach ein großes Bild — `assets/og-bild.jpg`
  (1200×630, 78 KB) aus den Assets von V18 gebaut, Deploy kopiert es nach `/og-bild.jpg`.
- **V15** (D) Galerie trug „JGC Studio" und lud Google Fonts von außen — Marke korrigiert,
  Schriften auf Systemstack, kein externer Abruf mehr.
- **V16** (D) Zwei Transform-Skripte hatten einen absoluten Pfad in einen anderen Worktree
  hartkodiert — jetzt relativ zum Skript, wie `scripts/v18/` es schon machte.
- **V17** (D) Prozess-Stufe **Produkt** in `CLAUDE.md`, `.claude/pruefen.txt` als Done-Gate.
- **I1** Link- und Meta-Prüfung — `scripts/pruefe-seiten.mjs` prüft in ~3 s zehn Regeln, je eine
  pro Fehlerklasse dieser Runde. Hängt im Deploy-Workflow und in `pruefen.txt`. Harte Fehler
  gelten für die lebenden Seiten; eingefrorene Alt-Entwürfe geben nur Warnungen.
