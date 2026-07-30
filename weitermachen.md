# Weitermachen — JGC Lumen Website

## Stand (30.07.2026 — zweiter Telefon-Durchgang, V38–V41, live)
- Vier Befunde von Gabriels Gerät, **zwei davon Folgeschäden des Vortags** — beide entstanden
  dadurch, dass eine Änderung eine Annahme aufhob, auf der eine ältere Regel stand:
  - **V38** Die Fahrt wirkte zäh. `linger` bremst die Kamera in der *Etappenmitte*, der Text
    kommt hier aber erst am *Ende* (`copyTiming: 'arrival'`). Bremse im leeren Teil, Rasen an
    der Naht. `linger` überall raus.
  - **V39** Vor den Fragen tauchte das Video noch einmal als Band auf: der Ausklang-Streifen aus
    V37 *gab* das Bildband frei, seit die Textebene mit den Fragen hochfährt. Hochkant entfällt
    er; Leerlauf 1142 → 852 px.
  - **V40** „Mehr dazu" sitzt auf der letzten Textzeile statt auf einer eigenen. Zahlt V36
    zurück: Streifen 380 → 360 px, Band 55 → 59 % des Schirms.
  - **V41** Die Fortschrittsleiste oben ist weg — sie las sich als hängender Ladebalken.
- **Live**, Deploy grün (`23e2e4c`). Hauptseite V18 unberührt, Reise weiter auf `noindex`.
- Nachgemessen auf sechs Hochkant-Maßen (320–412 px) und 1280×720/800. **Nicht prüfbar im
  versteckten Pane bleibt die Kamerafahrt selbst** — ob sich V38 richtig anfühlt, sieht nur
  Gabriel am Gerät.
- Messwerte: CHANGELOG-Eintrag vom 30.07., `docs/der-weg.md` (neuer Abschnitt „Das Tempo der
  Fahrt", Ausklang, Knopf, Streifen-Tabellen), Register: `verbesserungen.md`.

## Vorheriger Stand (29.07.2026 — Gabriels PC- und Telefon-Durchgang, acht Befunde, alles live)
- **Vormittag, PC-Durchgang (V29–V33):** doppelte Weganzeige aufgelöst (die Punktleiste führt,
  die Reiter sind reines Sprungmenü — erledigt V24 mit), Sigel 18×26 statt 34×34, verdrehter
  Schulungs-Satz raus, TÜV-Prüfzeichen mit Certipedia-Link im „Mehr"-Feld.
- **V32 war der größte Eingriff:** „DSGVO-konform" ist kein pauschales Etikett mehr, sondern an
  die Daten geknüpft — Linie: *was bei dir läuft, hält den Standard ein; womit ich baue, ist
  davon getrennt.* Sechs Stellen in der Reise plus ein neuer FAQ-Absatz.
- **Nachmittag, Telefon-Durchgang (V35–V37)** nach Gabriels Screenshots: der Textstreifen stand
  teilweise unter dem Bildschirmrand (Chrome/Android misst feste Elemente am großen Fenster) —
  die Hochkant-Aufteilung rechnet jetzt in `100svh`. „Mehr dazu" lag auf der Wegpunkt-Leiste
  und steht jetzt unter dem Text. Das Ende wird nicht mehr weiß: die letzte Szene bleibt stehen,
  die Fragen wandern darüber.
- **Beides live**, zwei Deploys grün (`a277780`, `03c1185`), an der ausgelieferten Seite
  nachgeprüft. Hauptseite bitgenau unverändert (1.225.044 Zeichen), Reise weiter auf `noindex`.
- Messwerte und Begründungen: CHANGELOG (zwei Einträge vom 29.07.), `docs/der-weg.md`
  (Tabelle, Knopf, Ausklang, Engine-Liste), Register: `verbesserungen.md`.

## Offen (unfertig / wartet auf Zulieferung)
- **Impressum ist weiter leer (V3)** — braucht Gabriels Daten, liegt im Hub. Größter Blocker.
- **Zwei Geschmacksentscheidungen dieser Session sind ungeprüft**, beide je eine Zeile zu
  drehen: die Punktleiste führt (statt der Reiter), und der Chip heißt „Deine Daten
  DSGVO-konform". Liegt als Frage im Hub.
- ~~Offene Abwägung aus V36 (Knopf kostet eine Zeile Bildhöhe)~~ — **erledigt am 30.07. mit
  V40:** der Knopf sitzt auf der letzten Textzeile, der Streifen ist von 380 auf 360 px zurück,
  das Band von 55 auf 59 % gewachsen. Neue kleine Abwägung an derselben Stelle: das höhere Band
  beschneidet die 4:3-Quelle seitlich stärker (60 statt 62 % sichtbare Breite) — eine Zahl in
  `der-weg/index.html`, falls Gabriel es umgekehrt will.
- **V34 offen:** die neue DSGVO-Sprachregelung fehlt in der Lesefassung V18, auf `stilprobe/`
  und der Datenschutzseite. Hängt an der Hub-Frage, ob die Lesefassung überhaupt bleibt.
- **Formular und Badge der Stilprobe laufen weiter auf Fallbacks** — `senden.php` und
  `kontingent.php` existieren noch nicht. Kein Bug; der Fehlerpfad ist sichtbar.
- **Etappe 6 zeigt ein generiertes Gesicht**, nicht Gabriel — seit dem TÜV-Siegel im „Mehr"-Feld
  noch schärfer: Prüfzeichen, Name und Werdegang stehen jetzt neben dem erfundenen Gesicht.
- **Naht 3→4 springt weiter** — nur durch eine neue Etappe 4 zu heilen, Startbild liegt bereit
  (`Scroll World\legs\anschlussbilder\`). Naht 2→3 gebessert, aber unter der Schwelle.
- **`der-weg/scrub-engine.js` ist eine Sonderfassung** — inzwischen sechs Zusätze (Liste in
  `docs/der-weg.md`). Ein Update aus dem Skill würde sie überschreiben.
- **Die korrigierte Fassung hat Gabriel noch nicht gesehen** — seine Screenshots zeigen den
  Stand *vor* V35–V37.
- Offene Befunde: **V3** · **V10** · **V13** · **V14** · **V18** · **V19** · **V20** · **V34**.
- Offene Ideen: **I2** (V18 → Astro, löst V10 und V18 mit) · **I3** (Kosten-FAQ) ·
  **I4** (Wortmarke aufs Vorschaubild).

## Nächste Schritte (Claude)
1. **Gabriels Urteil zur korrigierten Reise einarbeiten.** Wenn ihm das Bildband zu klein ist:
   Knopf zurück in die Kopfzeile und stattdessen die Punktleiste versetzen (V36-Alternative,
   gibt rund 60 px Bild zurück).
2. **Die Reise zur Hauptseite machen**, sobald Gabriel Texte und Umfang freigibt: `robots` auf
   `index, follow`, `scripts/copy-homepage.mjs` bzw. Manifest umstellen, `canonical` prüfen, und
   entscheiden, was mit `/main/` und der Lesefassung passiert.
3. **V34 umsetzen**, sobald über die Lesefassung entschieden ist — Wortlaut steht (V32), V18
   braucht ein assertion-guardetes Transform-Skript, danach `inhalt/lumen-inhalt.md` neu erzeugen.
4. **Nachgeliefertes leg 4 (und ggf. 6) einarbeiten:** `node scripts/der-weg/kodiere.mjs 4`,
   danach zwingend `node scripts/der-weg/pruefe-naehte.mjs`. Bei einer neuen Etappe 3 zusätzlich
   das Feld `vorlauf` in `kodiere.mjs` auf 0 zurücksetzen.
5. **In den `scroll-world`-Skill zurückgeben** — die Liste in `docs/der-weg.md`, Abschnitt
   „Offen", ist auf **acht** Punkte gewachsen (neu: letzte Szene stehen lassen, `svh`-Aufteilung,
   Prozenthöhe beim Logo). In einem Rutsch, wenn die Seite steht.
6. Impressum-Daten einsetzen, sobald Gabriel sie liefert (V3) — letzter Launch-Blocker.
7. Repo `stilprobe-automatik`: `senden.php` und `kontingent.php` bauen → macht Formular und
   Badge scharf. Vertrag: `docs/stilprobe/schnittstelle.md`.
8. I3 (Kosten-FAQ): Wortlaut-Vorschlag schreiben und Gabriel vorlegen — Verkaufstext, nicht
   ohne sein Ok einsetzen.
9. V20 auflösen, sobald Gabriel entscheidet: echte Ausschnitte einsetzen oder den
   Echtheits-Satz umformulieren. (Im „Mehr"-Feld steht die Echtheitsbehauptung bewusst nicht.)
10. I2 einplanen (V18 → Astro), am besten zusammen mit dem All-Inkl-Umzug.
11. V19 und die Branch-/Worktree-Bereinigung ausführen, sobald Gabriel freigibt (unten).
12. **Videos neu komprimieren** — 16,4 MB für sieben Handy-Clips sind mit modernerer
    Kompression plausibel halbierbar. Bisher bewusst ausgeklammert.

## Stolperfallen (sofort wichtig)
- **Der Bildanteil hängt an genau einer Zahl:** `--weg-textzone` in `der-weg/index.html`, seit
  30.07. `max(36svh, 360px)` (Schirme unter 780 px Höhe: 335 px). Nach jeder Änderung an Schrift
  oder Stationstext die längste Station nachmessen — das ist jetzt die Schluss-Station „Lass uns
  30 Minuten reden" (306 px bei 360×800 und 375×812, 277 px auf der niedrigen Stufe), weil ihre
  Höhe an den zwei gestapelten Handlungsknöpfen hängt. Tabellen in `docs/der-weg.md`.
- **`linger` nur mit `copyTiming: 'middle'`.** Die Bremse in der Etappenmitte war für die
  Textführung 'middle' gebaut; diese Seite läuft auf 'arrival' (Text kommt am Etappenende), dort
  bremst sie im leeren Teil und lässt die Naht rasen. Deshalb steht nirgends mehr ein `linger`
  (V38). Wer eine Szene betonen will, verlängert `scroll` — nicht `linger`.
- **Der Arbeitsordner einer Sitzung kann zwischen zwei Zügen ausgetauscht werden.** Am 29.07.
  verschwand `.claude/worktrees/website-about-me-image-30c238` mitten in der Sitzung; der Commit
  überlebte auf seinem Branch, aber der Pfad war weg. Bei „No such file or directory" auf einen
  eben noch benutzten Pfad: `git worktree list` — nicht annehmen, dass Arbeit verloren ist.
- V18 = minifiziertes Single-File-HTML: nie direkt editieren; assertion-guardetes Transform-Skript
  (Vorbilder in `scripts/v18/`). Interne Links absolut (`/jgc-studio-website/…`), nie relativ.
- **Vor jedem Zugende `node scripts/pruefe-seiten.mjs`** (steckt in `pruefen.txt`). Ohne Argument
  prüft er die Repo-Quellen, mit `_site` das Deploy-Ergebnis — die Sollwerte unterscheiden sich.
- **Browser-Preview:** erst Viewport setzen, dann messen. Scroll-Ereignisse, rAF, Animationen UND
  Transitions laufen im versteckten Pane nicht bzw. frieren am Startwert ein; Screenshots laufen
  dort in einen Timeout. Details in der CLAUDE.md unter „Preview-Messungen".
- **Scroll-Reise lokal ansehen:** `node scripts/der-weg/server.mjs`, dann
  `http://localhost:4330/der-weg/`. Der Server muss aus dem Worktree laufen, in dem gearbeitet
  wird — der Hauptordner steht auf `variant/09-cinematic-bausteine` und hat kein `der-weg/`.
  Port belegt: als Argument mitgeben (`… server.mjs 4331`).
- Deploy = Push auf `main` (`main` in keinem Worktree → `git branch -f main HEAD`).
- Gabriels eigene Aufgaben liegen im **Hub, Karte „Website"** — nicht in einer Datei im Repo.

## Aufräumen — wartet auf Gabriels Freigabe
6 Worktrees (5 unter „JGC Studio", 1 unter „Scroll World"). Ungemergt gegen `main` sind die
neun `variant/*`-Branches (**müssen bleiben** — der Deploy baut sie, Löschen beschädigt die
Galerie) und dieselben drei `claude/*`-Branches wie am 27.07., alle geprüft, keine verlorene
Arbeit: `sharp-herschel-f7c5e1` (V19, Inhalt übernommen) · `website-variant-18-homepage-c16a97`
(nur Altstand) · `world-scroll-mobile-expand-9b5250` (save-state-Doku, übernommen — braucht
`-D`, weil nie gemergt). Die Arbeit dieser Session liegt vollständig in `main`.

```
git worktree remove ".claude/worktrees/<name>"
git branch -d claude/sharp-herschel-f7c5e1
git branch -d claude/website-variant-18-homepage-c16a97
git branch -D claude/world-scroll-mobile-expand-9b5250
```
