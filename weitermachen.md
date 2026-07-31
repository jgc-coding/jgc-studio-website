# Weitermachen — JGC Lumen Website

## Stand (31.07.2026 — dritte Rückmeldungsrunde zur Scroll-Reise, V48–V50, live)
Gabriels Rückmeldung kam als Telegram-Nachricht mit drei Screenshots. Alle drei Punkte waren
**messbar** — und zwei davon standen vorher als Vermutung oder als falsche Zahl in der eigenen Doku.
- **V48 — die Sprungmarken landeten ohne Text.** `jumpTo()` sprang fest in die Etappenmitte, der
  Stationstext blüht hier aber erst am Ende auf (`'arrival'`). Gemessen: Stationen 2–6 landeten bei
  Textdeckkraft **0,023**, also auf leerem Schirm. Das Ziel leitet sich jetzt aus der Textführung
  ab (`copyPeak()` spiegelt die Formeln in `read()`). Nachher 0,996–1,000 auf allen sieben.
- **V49 — Teil 2 war zäher als Teil 1, um 57 %.** Alle Clips sind gleich lang (8,04 s), bewegen
  sich aber unterschiedlich stark; die ruhigsten Etappen hatten den längsten Scrollweg bekommen.
  `scroll` leitet sich jetzt aus der gemessenen Bildbewegung ab (Regel + Messkommando in
  `docs/der-weg.md`), Boden 0,85. Nachher: Etappen 1–5 auf 1–3 % gleich, Teil 2 noch 18 % darüber.
  Summe 8,45 → 7,20 Bildschirmhöhen.
- **V50 — der Textstreifen hing nur an der Schirmhöhe.** Maßgeblich ist aber, ob die zwei Knöpfe
  der Schluss-Station stapeln, und das hängt an der **Breite** (Umbruch bei 362 bzw. 380 px).
  Wo sie nebeneinander passen, lagen 30–39 px je Seite brach. Zone jetzt breitenabhängig:
  325/355 wo gestapelt wird, 300/320 wo nicht. Bildband auf Gabriels Gerät 377 → 402 px (54 → 57 %).
- **Live, Deploy `3245c1c` grün, an der ausgelieferten Seite gegengeprüft.** Hauptseite V18
  unberührt (1.225.044 Zeichen), Reise weiter auf `noindex`. Nachgemessen auf 320×568, 360×645,
  360×800, 375×667, 375×812, 393×702, 393×852, 412×760, 412×915, 520×760, 768×1024, 1280×800.
- **Nicht prüfbar bleibt das Gefühl der Fahrt** — ob die Stilprobe jetzt zu schnell vorbeizieht,
  sieht nur Gabriel am Gerät. Liegt im Hub.

## Offen (unfertig / wartet auf Zulieferung)
- **Impressum ist weiter leer (V3)** — braucht Gabriels Daten, liegt im Hub. Größter Blocker.
- **Runde 3 hat Gabriel noch nicht am Gerät gesehen** — seine Screenshots zeigen den Stand vor
  V48–V50.
- **V47 ist stark geschrumpft, nicht erledigt.** Auf Schirmen unter 362/380 px stapeln die Knöpfe
  weiter; der Gewinn dort ist aber rund 5 px, nicht die früher behaupteten 25. Der Hub-Eintrag dazu
  ist abgehakt, die korrigierte Fassung steht in `verbesserungen.md`.
- **Eine Geschmacksentscheidung ist weiter unbestätigt:** der Chip auf der ersten Szene heißt
  „Deine Daten DSGVO-konform". Liegt als Frage im Hub.
- **Neu im Hub: soll die weiche Ausblendung des Videos ins Pergament kürzer werden?** Sie ist
  14svh lang (rund 98 px auf einem Telefon) — kürzer heißt rund 28 px mehr *klares* Bild, ändert
  aber das Aussehen der Naht. Bewusst nicht angefasst.
- **V34 offen:** die neue DSGVO-Sprachregelung fehlt in der Lesefassung V18, auf `stilprobe/`
  und der Datenschutzseite. Hängt an der Hub-Frage, ob die Lesefassung überhaupt bleibt.
- **Formular und Badge der Stilprobe laufen weiter auf Fallbacks** — `senden.php` und
  `kontingent.php` existieren noch nicht. Kein Bug; der Fehlerpfad ist sichtbar.
- **Etappe 6 zeigt ein generiertes Gesicht**, nicht Gabriel — seit dem TÜV-Siegel im „Mehr"-Feld
  noch schärfer: Prüfzeichen, Name und Werdegang stehen jetzt neben dem erfundenen Gesicht.
- **Naht 3→4 springt weiter** — nur durch eine neue Etappe 4 zu heilen, Startbild liegt bereit
  (`Scroll World\legs\anschlussbilder\`). Naht 2→3 gebessert, aber unter der Schwelle.
- **`der-weg/scrub-engine.js` ist eine Sonderfassung** — die Zusätze stehen in `docs/der-weg.md`.
  Ein Update aus dem Skill würde sie überschreiben.
- Offene Befunde: **V3** · **V10** · **V13** · **V14** · **V18** · **V19** · **V20** · **V34** ·
  **V47**.
- Offene Ideen: **I2** (V18 → Astro, löst V10 und V18 mit) · **I3** (Kosten-FAQ) ·
  **I4** (Wortmarke aufs Vorschaubild).

## Nächste Schritte (Claude)
1. **Gabriels Urteil zu Runde 3 einarbeiten.** Sein Feedback kommt als Screenshot plus Fließtext —
   erst messen, dann Plan zeigen, das hat jetzt dreimal getragen. Drei Stellschrauben liegen
   bereit: Boden 0,85 senken (Schlussszenen noch zügiger), Stilprobe-`scroll` anheben (falls sie
   zu schnell vorbeizieht), Ausblendung kürzen (mehr klares Bild).
2. **Die Reise zur Hauptseite machen**, sobald Gabriel Texte und Umfang freigibt: `robots` auf
   `index, follow`, `scripts/copy-homepage.mjs` bzw. Manifest umstellen, `canonical` prüfen, und
   entscheiden, was mit `/main/` und der Lesefassung passiert.
3. **V34 umsetzen**, sobald über die Lesefassung entschieden ist — Wortlaut steht (V32), V18
   braucht ein assertion-guardetes Transform-Skript, danach `inhalt/lumen-inhalt.md` neu erzeugen.
4. **Nachgeliefertes leg 4 (und ggf. 6) einarbeiten:** `node scripts/der-weg/kodiere.mjs 4`,
   danach zwingend `node scripts/der-weg/pruefe-naehte.mjs`. Bei einer neuen Etappe 3 zusätzlich
   das Feld `vorlauf` in `kodiere.mjs` auf 0 zurücksetzen. **Und: Bildbewegung neu messen** — die
   `scroll`-Werte hängen jetzt daran (V49).
5. **In den `scroll-world`-Skill zurückgeben** — die Liste in `docs/der-weg.md`, Abschnitt „Offen",
   ist auf **vierzehn** Punkte gewachsen. Neu aus dieser Session: Sprungziel aus `copyTiming`
   ableiten statt fest 0,5 (V48, gehört klar in den Skill) · `scroll` aus gemessener Bildbewegung
   statt nach Gefühl (V49) · eine feste Textstreifenhöhe muss an Breite UND Höhe hängen, nicht nur
   an der Höhe (V50). In einem Rutsch, wenn die Seite steht.
6. Impressum-Daten einsetzen, sobald Gabriel sie liefert (V3) — letzter Launch-Blocker.
7. Repo `stilprobe-automatik`: `senden.php` und `kontingent.php` bauen → macht Formular und
   Badge scharf. Vertrag: `docs/stilprobe/schnittstelle.md`.
8. I3 (Kosten-FAQ): Wortlaut-Vorschlag schreiben und Gabriel vorlegen — Verkaufstext, nicht
   ohne sein Ok einsetzen.
9. V20 auflösen, sobald Gabriel entscheidet: echte Ausschnitte einsetzen oder den
   Echtheits-Satz umformulieren. (Im „Mehr"-Feld steht die Echtheitsbehauptung bewusst nicht.)
10. V47 nur anfassen, wenn Gabriel es ausdrücklich will — 5 px auf schmalen Telefonen.
11. I2 einplanen (V18 → Astro), am besten zusammen mit dem All-Inkl-Umzug.
12. V19 und die Branch-/Worktree-Bereinigung ausführen, sobald Gabriel freigibt (unten).
13. **Videos neu komprimieren** — 16,4 MB für sieben Handy-Clips sind mit modernerer
    Kompression plausibel halbierbar. Bisher bewusst ausgeklammert.

## Stolperfallen (sofort wichtig)
- **Der Bildanteil hängt an `--weg-textzone`** in `der-weg/index.html` — seit 31.07. an **vier**
  Stellen, weil die Zone jetzt auch an der Breite hängt: `max(36svh, 355px)` schmal+hoch ·
  `320px` breit+hoch · `325px` schmal+niedrig · `300px` breit+niedrig. Die Grenzen 365/385 px
  hängen unmittelbar an der Breite der zwei Knöpfe der Schluss-Station — **wer deren Beschriftung
  ändert, misst neu.** Tabellen und Messweg in `docs/der-weg.md`.
- **`scroll` je Etappe ist keine Geschmacksfrage mehr**, sondern `Bildbewegung / 8,06` mit Boden
  0,85 (V49). Wer einen Clip austauscht, misst neu — Messkommando in `docs/der-weg.md`. Eine
  kriechende Kamera liest sich nicht als „wichtig", sondern als „hängt".
- **`linger` und Sprungziel nur mit `copyTiming` zusammen denken.** Dieselbe Verwechslung
  ('middle' angenommen, 'arrival' gelaufen) hat inzwischen **zweimal** zugeschlagen: erst beim
  `linger` (V38), dann beim Sprungziel (V48). Bei jeder neuen Zahl, die eine Position in der
  Etappe meint, zuerst `COPY_TIMING` prüfen.
- **Nicht jeder Leerraum unter dem Text ist ein Fehler.** Rund 60 px davon sind die Reserve, die
  `100svh` frei lässt, sobald Chrome die Adressleiste einfährt — der Preis dafür, dass die
  Aufteilung während der Fahrt nicht wandert. Bewusste Wahl, keine Schlamperei.
- **Zwei Verläufe an einer Naht müssen sich überlappen, nicht aneinanderstoßen** — sie gehören
  verschiedenen Elementen, die sich unabhängig bewegen. Siehe „Die Schürze" in `docs/der-weg.md`.
  An dieser einen Naht ist inzwischen dreimal etwas gerissen (V37, V39, V43/V44).
- **Eine behauptete Zahl in `verbesserungen.md` kann zur Fessel werden.** V47 stand vier Wochen
  mit „die Knöpfe passen auf keinem Telefon nebeneinander" und hat den Textstreifen auf **allen**
  Geräten hochgehalten — die Aussage war falsch. Zahlen, die als Begründung für andere
  Entscheidungen dienen, vor der Verwendung nachmessen.
- **Screenshots im Preview-Pane gehen gar nicht** (nicht nur auf großen Seiten): eine nicht
  angezeigte Seite rendert keine Bilder. Jeder Beweis läuft über DOM-Geometrie. Dazu: erst
  Viewport setzen, **dann `resize` selbst auslösen**, dann messen; Scroll-Ereignisse und rAF
  laufen dort nicht (rAF synchron umbiegen — aber mit Wiedereintritts-Sperre, die Engine bestellt
  sich selbst endlos nach), Transitions frieren am Startwert ein. Details in der CLAUDE.md.
- **Der Arbeitsordner einer Sitzung kann zwischen zwei Zügen ausgetauscht werden.** Am 29.07.
  verschwand ein Worktree mitten in der Sitzung; der Commit überlebte auf seinem Branch. Bei
  „No such file or directory" auf einen eben noch benutzten Pfad: `git worktree list`.
- V18 = minifiziertes Single-File-HTML: nie direkt editieren; assertion-guardetes Transform-Skript
  (Vorbilder in `scripts/v18/`). Interne Links absolut (`/jgc-studio-website/…`), nie relativ.
- **Vor jedem Zugende `node scripts/pruefe-seiten.mjs`** (steckt in `pruefen.txt`). Ohne Argument
  prüft er die Repo-Quellen, mit `_site` das Deploy-Ergebnis — die Sollwerte unterscheiden sich.
- **Scroll-Reise lokal ansehen:** `node scripts/der-weg/server.mjs`, dann
  `http://localhost:4330/der-weg/`. Der Server muss aus dem Worktree laufen, in dem gearbeitet
  wird — der Hauptordner steht auf `variant/09-cinematic-bausteine` und hat kein `der-weg/`.
- Deploy = Push auf `main` (`main` in keinem Worktree → `git branch -f main HEAD`).
- **Commit-Messages mit Sonderzeichen in eine Datei schreiben und `git commit -F` nutzen** —
  ein PowerShell-Here-String mit Anführungszeichen darin ist am 30.07. auseinandergefallen.
- Gabriels eigene Aufgaben liegen im **Hub, Karte „Website"** — nicht in einer Datei im Repo.

## Aufräumen — wartet auf Gabriels Freigabe
6 Worktrees (Hauptbaum + 4 unter „JGC Studio" + 1 unter „Scroll World"). Ungemergt gegen `main`
sind die neun `variant/*`-Branches (**müssen bleiben** — der Deploy baut sie, Löschen beschädigt
die Galerie) und dieselben drei `claude/*`-Branches, erneut geprüft, keine verlorene Arbeit:
`sharp-herschel-f7c5e1` (V19, Inhalt übernommen) · `website-variant-18-homepage-c16a97` (nur
Altstand) · `world-scroll-mobile-expand-9b5250` (save-state-Doku, übernommen — braucht `-D`, weil
nie gemergt). Die Arbeit dieser Session liegt vollständig in `main`; der Worktree
`extract-video-last-frame-ac0958` und `leg6-staffelei-bild-1ac3ec` sind damit entbehrlich.

```
git worktree remove ".claude/worktrees/<name>"
git branch -d claude/sharp-herschel-f7c5e1
git branch -d claude/website-variant-18-homepage-c16a97
git branch -D claude/world-scroll-mobile-expand-9b5250
```
