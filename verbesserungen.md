# Verbesserungen
Stand: 2026-07-27 (Runde 3, Fokus: Scroll-Reise `der-weg/` — Code + Design,
Haltung: Nur messbare Fehler, Lupe: emil-design-eng — **alle acht Befunde am selben Tag
umgesetzt und nachgemessen**, Details im CHANGELOG)

**Nachtrag 2026-07-29:** Gabriels PC-Durchgang durch die Reise hat fünf weitere Punkte ergeben
(**V29–V33**). Sie waren zunächst nur notiert und sind am 29.07. in der Scroll-Reise umgesetzt
und nachgemessen; aus V32 ist **V34** hervorgegangen — dieselbe Sprachregelung außerhalb von
`der-weg/` steht noch aus. Rollback-Punkt vor der Umsetzung: Commit `4734cde`.
Am Nachmittag desselben Tages kam sein **Telefon-Durchgang** dazu (**V35–V37**: Textstreifen
unter dem Bildschirmrand, „Mehr dazu" auf der Wegpunkt-Leiste, weißes Ende) — ebenfalls
umgesetzt, siehe Erledigt. Beide Durchgänge sind Zurufe am Gerät, keine Analyse-Runden.

**Nachtrag 2026-08-01:** Gabriels Rückmeldung „das Hintergrundvideo fühlt sich beim Scrollen
mal zäh, mal fast sprunghaft an" ist analysiert — Engine-Code gelesen, Kodierung der 14 Clips
per ffprobe gemessen, Latenzen gerechnet; eine Laufzeitmessung gibt der versteckte
Preview-Pane nicht her (Kernfunktion 15). Das Videomaterial ist unschuldig: alle Clips
24 fps, Ankerbilder exakt wie geplant alle 8 (PC) bzw. 4 Bilder (Telefon), und auch die
V49-Scrollwege stehen korrekt im Code. Die Ursachen liegen in der Nachführ-Schleife der
Engine → **V51–V53**, am selben Tag umgesetzt (siehe Erledigt; Rechenwerte im CHANGELOG).

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
13. **Hochkant-Fassung** — erwartet: Bildband oben, Text unten, kein seitlicher Überlauf,
    jede Station passt in den Textstreifen · zuletzt: läuft (2026-07-30, gemessen bei
    320×568/360×640/360×800/375×812/393×852/412×915 — 20 bis 42 px Luft je Seite;
    320 bricht die Kopfzeile bewusst um, dokumentierte Grenze)
16. **Abgang der Reise zu den Fragen** — erwartet: zwischen letztem Filmbild und den
    häufigen Fragen keine Lücke und kein zweites Auftauchen des Videos; Unterkante
    Textebene und Oberkante Leseteil auf 0 px · zuletzt: läuft (2026-07-30, neun
    Messpunkte). **Hier ist schon zweimal etwas gerissen** (V37, V39) — nach jeder
    Änderung an Ausklang, Textebene oder Leseteil erneut messen.
14. **Ohne JavaScript** — erwartet: SEO-Block und Langfassungen als Lesetext ·
    zuletzt: läuft (`.js`-Klasse ab-/angeschaltet und gemessen)
15. **Kamerafahrt/Scrubbing** — nicht prüfbar im versteckten Pane (rAF läuft dort nicht);
    steht als Telefontest auf Gabriels Hub-Liste

## Offen

**V29–V33 kamen aus Gabriels PC-Durchgang am 27.07.2026 und sind am 29.07. umgesetzt** — sie
stehen unten unter „Erledigt", die Messwerte im CHANGELOG. Offen blieb daraus **V34**: dieselbe
DSGVO-Linie außerhalb der Reise.

- [ ] **V47** (C) Auf **schmalen** Telefonen stapeln die zwei Handlungsknöpfe der
      Schluss-Station und heben damit den Textstreifen für jede Station an
      Beleg: „Erstgespräch anfragen" und „Zur Stilprobe" brauchen zusammen 325 px (kleiner
      Zweig) bzw. 342 px (großer Zweig). Der Textkasten bekommt ab 360 px Breite 0,9 × Breite,
      der Umbruch fällt also bei 362 bzw. 380 px. Darunter kosten die Knöpfe 87 statt 40 px.
      Aufwand: S · Risiko: mittel (Gestaltung, nicht Technik)
      **Korrektur vom 31.07.2026:** Dieser Punkt stand hier mit der Aussage, die Knöpfe passten
      auf *keinem* Telefon nebeneinander und die Zone könnte ohne sie von 355 auf 330. Beides
      war falsch. Am Messstand nachgeprüft: ab 393 px Breite stehen sie nebeneinander (so auch
      auf Gabriels Gerät), und der frei gewordene Platz ist mit V50 bereits geholt. Es geht
      hier also nur noch um Schirme **unter** 362/380 px — und dort ist der Gewinn klein: bei
      320 × 568 ist „In deinem Tempo" mit 270 px die zweithöchste Station, der Streifen käme
      also selbst ohne das Stapeln nur von 325 auf ~320 px.
      Warum trotzdem offen: 42 px sind die Untergrenze für eine Fingerfläche, und „Erstgespräch
      anfragen" ist der wichtigste Knopf der Seite — er soll nicht kleiner aussehen als der
      Nebenweg. **Gabriels Entscheidung.** Alternativen: (a) so lassen — bei 5 px Gewinn die
      naheliegende, (b) Polsterung schmaler und nebeneinander, (c) „Zur Stilprobe" auf der
      Schluss-Station als Textlink statt als Knopf.
      **Lehre für die Liste selbst:** ein Befund, der eine Zahl behauptet („passen auf keinem
      Telefon"), gehört gemessen, bevor er als Begründung für andere Entscheidungen dient.
      Diese eine hat vier Wochen lang den Textstreifen auf allen Geräten hochgehalten.

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

### Rückmeldung zur Runde davor — umgesetzt am 2026-07-30 (Messwerte im CHANGELOG)

- **V42** (C) „Mehr dazu" stand mal hinter dem Text, mal unter den Schlagworten — je nach
  Station. Hängt jetzt überall hinten am letzten Satz des Fließtextes. **Lehre:** „spart
  Platz" schlägt nicht „steht immer an derselben Stelle" — ein Bedienelement, dessen Ort von
  den Daten abhängt, wirkt beliebig, auch wenn jede Platzierung für sich begründet ist.
- **V43** (B) Am PC stand eine harte Kante quer über dem Übergang zu den Fragen: der Schleier
  der Textebene (von links) endete genau dort, wo der Ausklang (von unten) anfängt. Der
  Verlauf reicht jetzt um die Länge des Ausklangs unter die Textebene hinaus („Schürze").
- **V44** (B) Am Telefon blitzte bei schnellem Wischen der Videohintergrund auf — die per
  JavaScript nachgeführte Textebene hinkte ein Einzelbild hinter dem nativ gescrollten
  Leseteil her. Dieselbe Schürze deckt das ab (geprüft bis 260 px Verzug), zusätzlich läuft
  die Nachführung jetzt direkt im Scroll-Lauscher statt in `requestAnimationFrame`.
- **V45** (C) Wegmarkierung im Reitermenü am PC zurück (ab 861 px), am Telefon unverändert
  ohne. Weiß auf Tinte, 14,26:1 — nicht die alte Fläche in Szenenfarbe (V24).
- **V46** (C) Textstreifen auf das Minimum: 355 px, niedrige Schirme 325. Weiter geht es
  nicht, ohne unter 18 px Luft zu fallen — siehe V47 unter „Offen".
  **Nachtrag 31.07.:** „das Minimum" stimmte nur für schmale Telefone. Siehe V50.

### Gabriels dritte Rückmeldung — umgesetzt am 2026-07-31 (Messwerte im CHANGELOG)

- **V48** (B) **Sprungmarken landeten im Niemandsland.** `jumpTo()` sprang fest in die
  Etappenmitte (`0.5`), der Stationstext blüht auf dieser Seite aber erst zum Etappenende auf
  (`copyTiming: 'arrival'`). Gemessen an allen sieben Stationen: die Stationen 2–6 landeten bei
  Textdeckkraft **0,023** — auf einem komplett textlosen Schirm. Das Sprungziel leitet sich
  jetzt aus der Textführung ab (`copyPeak()` in `scrub-engine.js`), spiegelt also die Formeln
  in `read()`: `'arrival'` → 0,98 der Etappe · `'middle'` → 0,5 · `'middle'`-Auftakt → 0,08 ·
  Schluss-Station immer 0,55. Nachher: Deckkraft 0,996–1,000, genau ein Text lesbar, Punkt-
  und Reitermarkierung auf der richtigen Station. **Lehre:** dieselbe Wurzel wie V38 — eine
  Einstellung ging von `'middle'` aus, die Seite läuft auf `'arrival'`. Der Fix gehört zurück
  in den `scroll-world`-Skill.
- **V49** (B) **Der zweite Teil der Reise fühlte sich zäher an als der erste** — und das war
  messbar. Alle sieben Clips sind gleich lang (8,04 s), bewegen sich aber unterschiedlich
  stark; die Kamera kommt zum Ende zur Ruhe. Ausgerechnet dort hatten die Etappen den
  längsten Scrollweg. Teil 2 verlangte **57 %** mehr Scrollweg für dieselbe Bildbewegung als
  Teil 1, am Weitblick fast das Dreifache der Haltung. `scroll` leitet sich jetzt aus der
  gemessenen Bildbewegung ab (Regel und Messkommando in `docs/der-weg.md`), Boden 0,85 für die
  zwei ruhigen Schlussszenen. Nachher: Etappen 1–5 auf 1–3 % gleich, Teil 2 noch 18 % über
  Teil 1. Summe 8,45 → 7,20 Bildschirmhöhen. **Lehre:** eine kriechende Kamera liest sich
  nicht als „wichtig", sondern als „hängt" — die Stilprobe hatte den längsten Weg *weil* sie
  die stärkste Karte ist und war dadurch die zäheste Etappe der Seite.
- **V50** (B) **Der Textstreifen war für einen Fall reserviert, der auf breiteren Telefonen
  gar nicht eintritt.** Seine Höhe hing nur an der Schirm*höhe*; maßgeblich ist aber, ob die
  zwei Handlungsknöpfe der Schluss-Station stapeln — und das tun sie nur unter 362 px (kleiner
  Zweig) bzw. 380 px Breite. Darüber lagen 30–39 px je Seite brach. Die Zone hängt jetzt auch
  an der Breite: unverändert 325/355 wo gestapelt wird, 300/320 wo nicht. Auf Gabriels Gerät
  (393 × 702) wächst das Bildband von 377 auf 402 px (54 → 57 %), bei 393 × 852 von 497 auf
  532 (58 → 62 %). Über neun Schirmgrößen nachgemessen, nirgends ragt Text heraus.

### Scrollgefühl der Kamerafahrt — umgesetzt am 2026-08-01 (Rechenwerte im CHANGELOG)

- **V51** (B) **Die Glättung der Videozeit rechnete pro gezeichnetem Bild statt pro Zeit.**
  0,18 je rAF-Durchlauf hieß: ~100 ms Reaktion auf einem 120-Hz-Telefon, ~190 ms bei 60 Hz,
  ~390 ms, sobald Decoderlast die Bildrate auf 30 drückte — dasselbe Scrollen mal direkt,
  mal zäh, und die Scrub-Last drückte die Bildrate selbst. Die Schrittweite leitet sich
  jetzt aus der echten Bildzeit ab (`1 − exp(−dt/85 ms)`); 85 ms reproduziert das
  abgestimmte 60-Hz-Gefühl auf jeder Bildrate. **Lehre:** eine Konstante „pro Frame" ist
  auf dem Telefon keine Konstante.
- **V52** (B) **Während eines Video-Seeks fror die Nachführung ein** und holte danach in
  größeren, unregelmäßigen Sprüngen auf — das „fast sprunghaft", vor allem am Telefon, wo
  normales Scrollen (~1 Videobild je Bildschirm-Frame) den Decoder ohnehin an der Grenze
  fährt. Der Code widersprach seinem eigenen Kommentar („cur keeps lerping"). Jetzt rechnet
  die Glättung durch; nur das Schreiben von `currentTime` pausiert, solange der Decoder
  arbeitet.
- **V53** (B) **Sprungaufträge, die kein neues Bild zeigen konnten.** Die Seek-Schwelle
  (8/20 ms) lag unter der Bilddauer (41,7 ms bei 24 fps): beim Ausrollen nach dem Anhalten
  7 Seeks für 2 echte Bildwechsel (PC, simuliert). Seeks feuern jetzt nur bei Bildwechsel
  (`clipFps: 24`, Ziel Bildmitte). Dazu: unsichtbare Szenen werden hart auf ihr Ziel
  gesetzt statt weich nachgezogen (nach einem Wegmarken-Sprung spulten vorher bis zu
  7 Decoder parallel), und ein frisch geladener Clip startet an der aktuellen
  Scrollposition statt sichtbar hochzuspulen. `kodiere.mjs` warnt ab jetzt, wenn eine
  neue Etappe nicht 24 fps liefert — der anstehende Clip-Tausch (Etappe 6, Naht 3→4)
  bleibt damit gefahrlos.

### Gabriels zweiter Telefon-Durchgang — umgesetzt am 2026-07-30 (Messwerte im CHANGELOG)

- **V38** (B) Die Fahrt wirkte zäh rund um „Was sich wirklich ändert" — man musste mehr
  scrollen, um im Video voranzukommen. Drei Stationen trugen ein `linger`, das die Kamera in
  der **Etappenmitte** bremst; diese Seite blendet den Stationstext aber erst am **Ende** der
  Etappe ein (`copyTiming: 'arrival'`). Die Bremse saß also im leeren Teil (mittlere 40 % des
  Scrollwegs = 27 % des Films bei Textdeckkraft 0), an der Naht raste die Kamera. `linger`
  überall entfernt. **Merksatz für neue Stationen:** `linger` nur zusammen mit `'middle'`.
- **V39** (B) Zwischen „Erstgespräch anfragen" und den häufigen Fragen tauchte das Video noch
  einmal als Band auf, dazwischen viel Weiß. Der Ausklang-Streifen aus V37 gab das Bildband
  wieder frei, seit die Textebene mit den Fragen hochfährt. Hochkant entfällt er; Leerlauf von
  1142 auf 852 px gefallen. Breit bleibt er (dort füllt das Video den Schirm).
- **V40** (C) „Mehr dazu" stand auf einer eigenen Zeile statt in der letzten Textzeile. Sitzt
  jetzt in der Schlagwortzeile bzw. am Ende des letzten Satzes. Zahlt V36 zurück: Streifen
  360 statt 380 px, Band 59 statt 55 % des Schirms. **Gegenrechnung:** ein höheres Band
  beschneidet die 4:3-Quelle seitlich stärker (sichtbare Breite 60 statt 62 %) — wer das
  umgekehrt will, dreht `--weg-textzone` in `der-weg/index.html` zurück auf 380/350.
- **V41** (C) Die Fortschrittsleiste am oberen Rand sah aus wie ein Ladebalken, der nicht
  vorankommt („man hat anfangs das Gefühl, die Seite lädt nicht"). Ersatzlos entfernt, weil
  die Punktleiste den Stand schon zeigt (wie V29). **Falls sie doch fehlt:** eine Zeile in
  `der-weg/index.html` (`.sw-scrollbar { display: none }`) — sinnvoller wäre dann, nur die
  leere Rinne wegzulassen und die Füllung ab dem ersten Scrollen einzublenden.

### Gabriels Telefon-Durchgang — umgesetzt am 2026-07-29 (Messwerte im CHANGELOG)

- **V35** (B) Der Textstreifen stand teilweise unter dem Bildschirmrand, die Aufteilung
  wanderte beim Scrollen mit. Chrome auf Android misst feste Elemente am großen Fenster;
  mit ausgefahrener Adressleiste liegen rund 110 px davon außerhalb des Sichtbaren. Die
  Aufteilung rechnet jetzt in `100svh`. Ausgelöst hatte es der längere DSGVO-Chip aus V32 —
  eine Zeile mehr, die der Streifen nicht mehr hatte.
- **V36** (C) „Mehr dazu" lag auf der Wegpunkt-Leiste — Knopf steht jetzt unter dem Text
  (auf der Schluss-Station vor den Handlungsknöpfen). Kostet eine Knopfzeile: Streifen 380
  statt 320 px, rund 60 px weniger Bild. — *Überholt durch V40 (30.07.): der Knopf sitzt
  jetzt auf der letzten Textzeile, die Knopfzeile ist damit wieder frei.*
- **V37** (B) Das Ende wurde weiß, bevor die Fragen kamen — die Engine blendete auch die
  letzte Szene aus, obwohl der Leseteil erst einen Bildschirm später kommt. Sie bleibt jetzt
  stehen; die Fragen wandern darüber, der Ausklang-Verlauf trägt die Überblendung allein.

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
- **V24** (B) Aktiver Nav-Reiter 2,6–3,3:1 — Fläche zunächst auf Tinte (nachgemessen 14,26:1),
  Chips eine Stufe dunkler (Salbei 4,34 → 5,8). Der Kupfer-Kleintext-Widerspruch zu V11
  bleibt benannt und unangetastet (Gabriels Marken-Entscheid).
  **Überholt am 29.07. durch V29:** die Aktiv-Fläche gibt es gar nicht mehr, der aktive Reiter
  sieht aus wie jeder andere. Die Tinte-Zeile ist damit Geschichte — die Chips gelten weiter.
  Für den Skill-Rückfluss zählt der Befund trotzdem: der Engine-**Default** ist unverändert
  Weiß auf Szenenakzent (`scrub-engine.js:604`), nur diese Seite überschreibt ihn.
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
