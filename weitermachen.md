# Weitermachen — JGC Lumen Website

## Stand (30.07.2026 — zwei Rückmeldungsrunden zur Scroll-Reise, V38–V46, alles live)
- **Runde 1 (V38–V41)**, Gabriels Telefon-Durchgang: `linger` überall entfernt (die Bremse saß in
  der Etappenmitte, der Text kommt hier aber erst am Ende — die Fahrt wirkte deshalb zäh) · der
  Ausklang-Streifen entfällt hochkant, weil er das Video wieder freigab statt es zuzudecken ·
  „Mehr dazu" von seiner eigenen Zeile geholt · die Fortschrittsleiste oben entfernt, sie las
  sich als hängender Ladebalken. Deploy `23e2e4c`.
- **Runde 2 (V42–V46)**, seine Rückmeldung direkt danach: **V43/V44 zeigten auf denselben Bau** —
  der Abgang der Reise wird von ZWEI Verläufen getragen, die verschiedenen Elementen gehören und
  aneinanderstießen statt sich zu überlappen. Am PC gab das eine harte Kante quer über den Schirm,
  am Telefon ein Aufblitzen des Videos beim schnellen Wischen. Beides heilt die **Schürze** (der
  Verlauf reicht unter die Textebene hinaus, geprüft bis 260 px Verzug) plus eine Nachführung
  direkt im Scroll-Lauscher. Dazu: „Mehr dazu" überall hinten am letzten Satz (V42) ·
  Wegmarkierung im Reitermenü am PC zurück, ab 861 px (V45) · Textstreifen auf 355 px, niedrige
  Schirme 325 (V46). Deploy `5b613e6`.
- **Beide Runden live und an der ausgelieferten Seite bitgenau gegengeprüft.** Hauptseite V18
  unberührt (1.225.044 Zeichen), Reise weiter auf `noindex`.
- Nachgemessen auf 320×568, 360×640, 360×800, 375×812, 393×852, 412×915, 820×700 und 1280×720/800.
- **Nicht prüfbar im versteckten Pane bleibt das Gefühl der Kamerafahrt** — ob V38 sitzt und ob
  das Flackern wirklich weg ist, sieht nur Gabriel am Gerät.
- Messwerte: zwei CHANGELOG-Einträge vom 30.07., `docs/der-weg.md` (neue Abschnitte „Das Tempo der
  Fahrt" und „Die Schürze", Streifen-Tabellen, „Mehr dazu"), Register: `verbesserungen.md`.

## Offen (unfertig / wartet auf Zulieferung)
- **ZUERST UND UNGEFRAGT ANSPRECHEN: V48 — die Sprungmarken landen ohne Text.** Gabriel hat das
  am 30.07. abends gemeldet, kurz vor Sessionende, und ausdrücklich um eine Erinnerung gebeten.
  Reiter am PC und Punktleiste rechts springen in die **Mitte** einer Etappe, der Text kommt hier
  aber erst am **Ende** — Deckkraft dort gemessen 0,024. Ursache, Beleg und Lösungsvorschlag
  stehen in `verbesserungen.md` unter V48. **Nicht warten, bis er danach fragt.**
- **Impressum ist weiter leer (V3)** — braucht Gabriels Daten, liegt im Hub. Größter Blocker.
- **V47 wartet auf Gabriels Entscheidung:** die zwei Handlungsknöpfe der Schluss-Station passen
  auf keinem Telefon nebeneinander und legen damit die Höhe des Textstreifens für **alle** sieben
  Stationen fest (rund 25 px Bild). Drei Wege stehen in `verbesserungen.md`.
- **Eine Geschmacksentscheidung ist weiter unbestätigt:** der Chip auf der ersten Szene heißt
  „Deine Daten DSGVO-konform". Liegt als Frage im Hub. (Die zweite — Punktleiste statt Reiter —
  ist mit V45 entschieden: am PC markieren beide, am Telefon nur die Punktleiste.)
- **Runde 2 hat Gabriel noch nicht am Gerät gesehen** — seine letzten Screenshots zeigen den Stand
  nach V38–V41, nicht nach V42–V46.
- **V34 offen:** die neue DSGVO-Sprachregelung fehlt in der Lesefassung V18, auf `stilprobe/`
  und der Datenschutzseite. Hängt an der Hub-Frage, ob die Lesefassung überhaupt bleibt.
- **Formular und Badge der Stilprobe laufen weiter auf Fallbacks** — `senden.php` und
  `kontingent.php` existieren noch nicht. Kein Bug; der Fehlerpfad ist sichtbar.
- **Etappe 6 zeigt ein generiertes Gesicht**, nicht Gabriel — seit dem TÜV-Siegel im „Mehr"-Feld
  noch schärfer: Prüfzeichen, Name und Werdegang stehen jetzt neben dem erfundenen Gesicht.
- **Naht 3→4 springt weiter** — nur durch eine neue Etappe 4 zu heilen, Startbild liegt bereit
  (`Scroll World\legs\anschlussbilder\`). Naht 2→3 gebessert, aber unter der Schwelle.
- **`der-weg/scrub-engine.js` ist eine Sonderfassung** — sechs Zusätze (Liste in
  `docs/der-weg.md`). Ein Update aus dem Skill würde sie überschreiben.
- Offene Befunde: **V3** · **V10** · **V13** · **V14** · **V18** · **V19** · **V20** · **V34** ·
  **V47** · **V48**.
- Offene Ideen: **I2** (V18 → Astro, löst V10 und V18 mit) · **I3** (Kosten-FAQ) ·
  **I4** (Wortmarke aufs Vorschaubild).

## Nächste Schritte (Claude)
1. **V48 zuerst — Sprungmarken landen ohne Text.** Das ist der einzige Punkt, den Gabriel als
   offenen Fehler hinterlassen hat. Sprungziel in `jumpTo()` (`der-weg/scrub-engine.js`) ans
   Etappenende statt in die Mitte legen und aus `COPY_TIMING` ableiten; danach an mehreren
   Stationen die Textdeckkraft am Sprungziel messen (Soll: 1,000). Details in
   `verbesserungen.md`. Bei der Gelegenheit die Engine nach weiteren `0.5`-Annahmen absuchen —
   es ist derselbe Denkfehler wie bei V38.
2. **Gabriels Urteil zu Runde 2 einarbeiten** und **V47 umsetzen**, sobald er einen der drei Wege
   wählt. Sein Feedback kommt erfahrungsgemäß als Screenshot plus Fließtext — erst messen, dann
   Plan zeigen, das hat zweimal getragen.
3. **Die Reise zur Hauptseite machen**, sobald Gabriel Texte und Umfang freigibt: `robots` auf
   `index, follow`, `scripts/copy-homepage.mjs` bzw. Manifest umstellen, `canonical` prüfen, und
   entscheiden, was mit `/main/` und der Lesefassung passiert.
4. **V34 umsetzen**, sobald über die Lesefassung entschieden ist — Wortlaut steht (V32), V18
   braucht ein assertion-guardetes Transform-Skript, danach `inhalt/lumen-inhalt.md` neu erzeugen.
5. **Nachgeliefertes leg 4 (und ggf. 6) einarbeiten:** `node scripts/der-weg/kodiere.mjs 4`,
   danach zwingend `node scripts/der-weg/pruefe-naehte.mjs`. Bei einer neuen Etappe 3 zusätzlich
   das Feld `vorlauf` in `kodiere.mjs` auf 0 zurücksetzen.
6. **In den `scroll-world`-Skill zurückgeben** — die Liste in `docs/der-weg.md`, Abschnitt
   „Offen", ist auf **elf** Punkte gewachsen (neu aus dieser Session: `linger` gegen `copyTiming`
   absichern, die Fortschrittsleiste am oberen Rand, zwei Verläufe an einer Naht müssen sich
   überlappen). Nach V48 kommt vermutlich ein zwölfter dazu (Sprungziel aus `copyTiming`
   ableiten). In einem Rutsch, wenn die Seite steht.
7. Impressum-Daten einsetzen, sobald Gabriel sie liefert (V3) — letzter Launch-Blocker.
8. Repo `stilprobe-automatik`: `senden.php` und `kontingent.php` bauen → macht Formular und
   Badge scharf. Vertrag: `docs/stilprobe/schnittstelle.md`.
9. I3 (Kosten-FAQ): Wortlaut-Vorschlag schreiben und Gabriel vorlegen — Verkaufstext, nicht
   ohne sein Ok einsetzen.
10. V20 auflösen, sobald Gabriel entscheidet: echte Ausschnitte einsetzen oder den
    Echtheits-Satz umformulieren. (Im „Mehr"-Feld steht die Echtheitsbehauptung bewusst nicht.)
11. I2 einplanen (V18 → Astro), am besten zusammen mit dem All-Inkl-Umzug.
12. V19 und die Branch-/Worktree-Bereinigung ausführen, sobald Gabriel freigibt (unten).
13. **Videos neu komprimieren** — 16,4 MB für sieben Handy-Clips sind mit modernerer
    Kompression plausibel halbierbar. Bisher bewusst ausgeklammert.

## Stolperfallen (sofort wichtig)
- **Der Bildanteil hängt an genau einer Zahl:** `--weg-textzone` in `der-weg/index.html`, seit
  30.07. `max(36svh, 355px)` (Schirme unter 780 px Höhe: 325 px) — **ausgereizt**, es bleiben
  19 px Luft. Nach jeder Änderung an Schrift oder Stationstext die längste Station nachmessen:
  die Schluss-Station „Lass uns 30 Minuten reden" (304 px bei 360×800 und 375×812, 274 px auf der
  niedrigen Stufe). Tabellen in `docs/der-weg.md`.
- **Nicht jeder Leerraum unter dem Text ist ein Fehler.** Rund 60 px davon sind die Reserve, die
  `100svh` frei lässt, sobald Chrome die Adressleiste einfährt — der Preis dafür, dass die
  Aufteilung während der Fahrt nicht wandert. Mit `dvh` wäre der Leerraum weg und der Text würde
  bei jedem Ein- und Ausfahren um rund 30 px wandern. Bewusste Wahl, keine Schlamperei.
- **Zwei Verläufe an einer Naht müssen sich überlappen, nicht aneinanderstoßen** — sie gehören
  verschiedenen Elementen, die sich unabhängig bewegen. Siehe „Die Schürze" in `docs/der-weg.md`.
  An dieser einen Naht ist inzwischen dreimal etwas gerissen (V37, V39, V43/V44).
- **`linger` nur mit `copyTiming: 'middle'`.** Diese Seite läuft auf `'arrival'`; dort bremst
  `linger` im leeren Teil und lässt die Naht rasen (V38). Wer eine Szene betonen will, verlängert
  `scroll` — nicht `linger`.
- **Der Arbeitsordner einer Sitzung kann zwischen zwei Zügen ausgetauscht werden.** Am 29.07.
  verschwand `.claude/worktrees/website-about-me-image-30c238` mitten in der Sitzung; der Commit
  überlebte auf seinem Branch, aber der Pfad war weg. Bei „No such file or directory" auf einen
  eben noch benutzten Pfad: `git worktree list` — nicht annehmen, dass Arbeit verloren ist.
- V18 = minifiziertes Single-File-HTML: nie direkt editieren; assertion-guardetes Transform-Skript
  (Vorbilder in `scripts/v18/`). Interne Links absolut (`/jgc-studio-website/…`), nie relativ.
- **Vor jedem Zugende `node scripts/pruefe-seiten.mjs`** (steckt in `pruefen.txt`). Ohne Argument
  prüft er die Repo-Quellen, mit `_site` das Deploy-Ergebnis — die Sollwerte unterscheiden sich.
- **Browser-Preview:** erst Viewport setzen, **dann `resize` selbst auslösen** (sonst misst man die
  Bahn des alten Fensters), dann messen. Scroll-Ereignisse, rAF, Animationen und Transitions laufen
  im versteckten Pane nicht bzw. frieren am Startwert ein. Details in der CLAUDE.md unter
  „Preview-Messungen" — die Transition-Falle hat am 30.07. zum zweiten Mal zugeschlagen.
- **Scroll-Reise lokal ansehen:** `node scripts/der-weg/server.mjs`, dann
  `http://localhost:4330/der-weg/`. Der Server muss aus dem Worktree laufen, in dem gearbeitet
  wird — der Hauptordner steht auf `variant/09-cinematic-bausteine` und hat kein `der-weg/`.
  Port belegt: als Argument mitgeben (`… server.mjs 4331`).
- Deploy = Push auf `main` (`main` in keinem Worktree → `git branch -f main HEAD`).
- **Commit-Messages mit Sonderzeichen in eine Datei schreiben und `git commit -F` nutzen** —
  ein PowerShell-Here-String mit Anführungszeichen darin ist am 30.07. auseinandergefallen.
- Gabriels eigene Aufgaben liegen im **Hub, Karte „Website"** — nicht in einer Datei im Repo.

## Aufräumen — wartet auf Gabriels Freigabe
Unverändert gegenüber dem 29.07.: 6 Worktrees (5 unter „JGC Studio", 1 unter „Scroll World").
Ungemergt gegen `main` sind die neun `variant/*`-Branches (**müssen bleiben** — der Deploy baut
sie, Löschen beschädigt die Galerie) und dieselben drei `claude/*`-Branches, alle geprüft, keine
verlorene Arbeit: `sharp-herschel-f7c5e1` (V19, Inhalt übernommen) ·
`website-variant-18-homepage-c16a97` (nur Altstand) · `world-scroll-mobile-expand-9b5250`
(save-state-Doku, übernommen — braucht `-D`, weil nie gemergt). Die Arbeit dieser Session liegt
vollständig in `main`.

```
git worktree remove ".claude/worktrees/<name>"
git branch -d claude/sharp-herschel-f7c5e1
git branch -d claude/website-variant-18-homepage-c16a97
git branch -D claude/world-scroll-mobile-expand-9b5250
```
