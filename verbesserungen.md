# Verbesserungen
Stand: 2026-07-27 (Runde 3, Fokus: Scroll-Reise `der-weg/` — Code + Design,
Haltung: Nur messbare Fehler, Lupe: emil-design-eng — **alle acht Befunde am selben Tag
umgesetzt und nachgemessen**, Details im CHANGELOG)

**Nachtrag 2026-07-29:** Gabriels PC-Durchgang durch die Reise hat fünf weitere Punkte ergeben
(**V29–V33**). Sie waren zunächst nur notiert und sind am 29.07. in der Scroll-Reise umgesetzt
und nachgemessen; aus V32 ist **V34** hervorgegangen — dieselbe Sprachregelung außerhalb von
`der-weg/` steht noch aus. Rollback-Punkt vor der Umsetzung: Commit `4734cde`.

Runde 2 (Fokus: alles) ist live seit 2026-07-25, Commit `4f3cc16`. Rollback-Punkt davor: `8d33cd0`.
Runde 3 hat nur `der-weg/` und seine Werkzeuge angesehen; V18/Hauptseite, `site/`, `stilprobe/`
blieben unangetastet. Teil 3 (Ausbau-Ideen) lief in Runde 3 nicht — der Fokus war Code + Design.
Rollback-Punkt vor der Runde-3-Umsetzung: Commit `50eabcc`.

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
    Lagezeile im Abspann stimmt · zuletzt: läuft (2026-07-27, alle drei Zustände geprüft;
    feste Wahl „sparsam" lädt null Videos — V22/V23 behoben)
11. **Video-Nachladen** — erwartet: Clip als Blob geholt, Poster bis zum ersten Frame ·
    zuletzt: läuft (anflug.mp4 geladen; `has-clip` braucht rAF → am Gerät prüfen)
12. **„Mehr dazu"-Feld** — erwartet: öffnet, Fokus wandert hinein, Escape schließt,
    Fokus kehrt zum Knopf zurück · zuletzt: läuft (2026-07-27, alles gemessen)
13. **Hochkant-Fassung** — erwartet: Bildband oben, Text unten, kein seitlicher Überlauf ·
    zuletzt: läuft (2026-07-27, gemessen bei 320/360/375/390/393/768 — V25 behoben;
    320 bricht die Kopfzeile bewusst um, dokumentierte Grenze)
14. **Ohne JavaScript** — erwartet: SEO-Block und Langfassungen als Lesetext ·
    zuletzt: läuft (`.js`-Klasse ab-/angeschaltet und gemessen)
15. **Kamerafahrt/Scrubbing** — nicht prüfbar im versteckten Pane (rAF läuft dort nicht);
    steht als Telefontest auf Gabriels Hub-Liste

## Offen

**V29–V33 kamen aus Gabriels PC-Durchgang am 27.07.2026 und sind am 29.07. umgesetzt** — sie
stehen unten unter „Erledigt", die Messwerte im CHANGELOG. Offen blieb daraus **V34**: dieselbe
DSGVO-Linie außerhalb der Reise.

- [ ] **V34** (A) Pauschales „DSGVO-konform" steht weiter auf der Lesefassung V18
      Beleg: `inhalt/lumen-inhalt.md` Zeilen 10, 34, 139, 197, 366, 383 — Kurzbeschreibung,
      Hero-Zeile, Bausteine, Fußzeile tragen dieselbe unbedingte Zusage, die in der Reise am
      29.07. durch die datenbezogene Fassung ersetzt wurde (V32). `stilprobe/index.html` und
      die Datenschutzseite sind ebenfalls nicht abgeglichen.
      Aufwand: M · Risiko: mittel
      Warum: Solange beide Fassungen live sind, sagt dieselbe Marke an zwei Orten zwei
      verschiedene Dinge — und die ältere sagt das, was nicht trägt. Der Wortlaut steht fest
      (V32, in der Reise gebaut), hier ist es Übertragungsarbeit. Klein ist sie trotzdem nicht:
      V18 ist minifiziert, braucht also ein assertion-guardetes Transform-Skript, und danach
      muss `inhalt/lumen-inhalt.md` neu erzeugt werden.
      → Sinnvoll gebündelt mit der Entscheidung, ob die Lesefassung überhaupt bestehen bleibt.

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

- [ ] **V19** (D) Alter Analyse-Branch `claude/sharp-herschel-f7c5e1` kann weg
      Beleg: `git log main..claude/sharp-herschel-f7c5e1` — 1 Commit vom 07.07., einziger
      Eigenwert war `WEBSITE-AENDERUNGEN.md`; dessen Inhalt steht jetzt hier · Aufwand: S
      Warum: Reines Aufräumen — aber erst löschen, wenn Gabriel bestätigt, dass die Übernahme
      vollständig ist. Branches werden nie ungefragt gelöscht.
      **Nicht anfassen:** die neun `variant/*`-Branches. Der Deploy-Workflow baut sie bei jedem
      Lauf; ein Löschen würde die Galerie beschädigen.

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

### Gabriels PC-Durchgang — umgesetzt am 2026-07-29 (nur `der-weg/`; Messwerte im CHANGELOG)

- **V29** (C) Am PC zeigten Reiter und Punktleiste dieselbe Station — die Punktleiste führt
  jetzt allein, die Reiter sind reines Sprungmenü. Nachgemessen: aktiver und passiver Reiter
  identisch, genau ein aktiver Punkt. **Erledigt damit auch V24** (die kontrastschwache
  Aktiv-Fläche gibt es nicht mehr).
- **V30** (C) Sigel zu groß und zu tief — und beides war ein Fehler: `height:100%` konnte der
  Browser gegen die automatisch hohe Rasterzeile nicht auflösen und fiel auf die natürliche
  Form zurück, das hochkante Sigel lief **16 px unten aus seinem Kasten**. Jetzt feste Maße im
  Bildverhältnis (18×26 px). Nachgemessen: kein Überstand, Bildmitte und Versalmitte auf
  derselben Linie (0,00 px), Zeichen genau doppelt so hoch wie die Großbuchstaben.
- **V31** (C) Der verdrehte Satz zur Schulungspflicht ist ersatzlos raus; FAQ 04 sagt dasselbe
  richtig.
- **V32** (A) „DSGVO-konform" ist kein pauschales Etikett mehr, sondern an die Daten geknüpft —
  neue Linie „was bei dir läuft, hält den Standard ein; womit ich baue, ist davon getrennt" in
  Chip, Vorspann, Hero-Langtext, Bausteinen, Fußzeile und FAQ 04. Der längere Chip kostet auf
  dem Telefon eine Zeile: nachgemessen auf 320/360/375, die engsten Stationen bleiben
  unberührt. **Rest außerhalb der Reise → V34.**
- **V33** (C) TÜV-Prüfzeichen mit Certipedia-Link im „Mehr"-Feld der Station „Wer mit dir
  arbeitet"; Bild von 73 auf 26 KB gebracht, lädt erst beim Öffnen des Felds. Nachgemessen:
  Bild 560×207 geladen, 297×110 dargestellt, Link mit `rel="noopener noreferrer"`.

### Runde 3 — umgesetzt am 2026-07-27 (Scroll-Reise; Messwerte und Details im CHANGELOG)

- **V21** (B) Unsichtbare Stationen waren klick- und tastatur-erreichbar (unsichtbare
  mailto-Falle auf Schirm 1) — Engine schaltet in `read()` jetzt `visibility` mit;
  Punktprobe und `focus()`-Test bestätigen. Steht auf der Skill-Rückgabe-Liste.
- **V22** (B) Datenspar-Schalter speicherte in der Prüfphase `voll` statt `sparsam` —
  „waiting" zählt jetzt zur Sparsam-Seite.
- **V23** (B) Tempo-Messung las „unter 40 KB übertragen" als Cache und gab langsamen
  Erstverbindungen das Video frei — Wiederbesuch wird an `transferSize === 0` erkannt,
  ohne belastbaren Wert entscheidet erst der 6-s-Lauf. Alle drei Zustände end-to-end geprüft.
- **V24** (B) Aktiver Nav-Reiter 2,6–3,3:1 — Fläche jetzt Tinte (nachgemessen 14,26:1),
  Chips eine Stufe dunkler (Salbei 4,34 → 5,8). Der Kupfer-Kleintext-Widerspruch zu V11
  bleibt benannt und unangetastet (Gabriels Marken-Entscheid).
- **V25** (C) 375er-/390er-iPhones: Kopfzeile der ersten Station brach um, Schluss-Station
  ragte 14 px ins Bild — Kleintext unter 393 px eine Stufe kleiner, Mindesthöhe des
  Textstreifens 320 px (niedrige Schirme 300). Gemessen auf 320/360/375/390/393/768;
  320 bleibt als dokumentierte Grenze zweizeilig.
- **V26** (C) Zeilenlängen 88 (FAQ) / 102 (No-JS) Zeichen — Textmaß 32rem, jetzt 61 / 59.
- **V27** (D) Reduce-Motion-Regel zielte auf `svg` statt `i`; FAQ-Plus ohne Fallback —
  beide Drehungen stehen jetzt still, Zustände bleiben ablesbar.
- **V28** (D) Doppelkommentare, toter Umschalter-Verweis, sinnloser Ternary und fehlender
  `posterM`-Check in `kodiere.mjs`, fehlende vh-Rückfalllinie am „Mehr"-Feld, Engine-Abrufe
  jetzt auf drei Fehlversuche gedeckelt.

### Runde 2 — alle folgenden Punkte wurden am **2026-07-25** in Commit `f3a7d94` umgesetzt und geprüft.

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
