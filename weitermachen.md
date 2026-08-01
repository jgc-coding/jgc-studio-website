# Weitermachen — JGC Lumen Website

## Stand (01.08.2026 — Scrollgefühl der Kamerafahrt, V51–V53, live)
Gabriels Rückmeldung „das Hintergrundvideo fühlt sich mal zäh, mal fast sprunghaft an" ist
analysiert und behoben. Das Material war unschuldig (ffprobe: alle 14 Clips 24 fps, Anker
alle 8/4 Bilder); drei Ursachen saßen in der raf-Schleife der Engine:
- **V51 — Glättung zeitbasiert** (`1 − exp(−dt/85 ms)` statt fest 0,18 je Frame): Reaktion
  konstant ~180 ms auf jeder Bildrate statt 92–367 ms je nach Gerät und Last.
- **V52 — kein Einfrieren während eines Seeks:** nur das Schreiben von `currentTime`
  pausiert noch; Rückstand am trägen Decoder halbiert (simuliert 7,6 → 3,6 Bilder).
- **V53 — Seeks nur bei echtem Bildwechsel** (`clipFps: 24`, Ziel Bildmitte; langsames
  Scrollen 955 → 192 Seeks je Etappe), unsichtbare Szenen hart gesetzt statt nachgezogen,
  Erst-Seek eines frisch geladenen Clips an der Scrollposition statt Hochspulen von 0.
- Absicherung für den Clip-Tausch: `kodiere.mjs` warnt, wenn eine Etappe nicht 24 fps liefert.
- Beweise: Node-Simulation Alt/Neu (Zahlen im CHANGELOG) + Testmount im Browser (Seek exakt
  aufs 19,5/24-Raster, Seek-Koaleszenz greift, keine Exception). Live: Deploy `2a045e6` grün,
  Live-Bytes gegengeprüft, Hauptseite V18 unberührt (1.225.044 Zeichen).
- **Das Gefühl selbst kann nur Gabriels Telefon beurteilen** — liegt als neuer Punkt im Hub.

## Offen (unfertig / wartet auf Zulieferung)
- **Impressum ist weiter leer (V3)** — braucht Gabriels Daten, liegt im Hub. Größter Blocker.
- **Gabriels Gerätetest steht aus** für Runde 3 (V48–V50) UND den Scrub-Umbau (V51–V53) —
  seine „zäh/sprunghaft"-Meldung bezog sich auf den Stand davor.
- **Zwei Clips kommen von Gabriel** (am 01.08. angekündigt): neue Etappe 4 gegen den
  Rückwärts-Sprung der Naht 3→4 (Startbild liegt in `Scroll World\legs\anschlussbilder\`)
  und leg 6 mit seinem eigenen Porträt statt des generierten Gesichts.
- **V47 ist stark geschrumpft, nicht erledigt.** Auf Schirmen unter 362/380 px stapeln die
  Knöpfe weiter; Gewinn dort rund 5 px. Korrigierte Fassung in `verbesserungen.md`.
- **Eine Geschmacksentscheidung ist weiter unbestätigt:** der Chip auf der ersten Szene heißt
  „Deine Daten DSGVO-konform". Liegt als Frage im Hub.
- **Im Hub: soll die weiche Ausblendung des Videos ins Pergament kürzer werden?** 14svh
  (~98 px am Telefon); kürzer = ~28 px mehr klares Bild, ändert die Naht. Bewusst unangetastet.
- **V34 offen:** die DSGVO-Sprachregelung fehlt in Lesefassung V18, `stilprobe/` und
  Datenschutzseite. Hängt an der Hub-Frage, ob die Lesefassung bleibt.
- **Formular und Badge der Stilprobe laufen weiter auf Fallbacks** — `senden.php` und
  `kontingent.php` existieren noch nicht. Kein Bug; der Fehlerpfad ist sichtbar.
- **`der-weg/scrub-engine.js` ist eine Sonderfassung** — seit 01.08. auch mit V51–V53.
  Zusatzliste in `docs/der-weg.md`; ein Update aus dem Skill würde sie überschreiben.
- Offene Befunde: **V3** · **V10** · **V13** · **V14** · **V18** · **V19** · **V20** ·
  **V34** · **V47**.
- Offene Ideen: **I2** (V18 → Astro, löst V10 und V18 mit) · **I3** (Kosten-FAQ) ·
  **I4** (Wortmarke aufs Vorschaubild).

## Nächste Schritte (Claude)
1. **Gabriels Urteil einarbeiten** — zu Runde 3 UND zum Scrollgefühl nach V51–V53. Erst
   messen, dann Plan zeigen (hat viermal getragen). Stellschrauben: Boden 0,85 (Schluss-
   szenen), Stilprobe-`scroll`, Ausblendung kürzen; beim Scrubbing die Zeitkonstante 85 ms.
2. **Nachgelieferte Clips einarbeiten** (Etappe 4 und 6): `node scripts/der-weg/kodiere.mjs <N>`
   → zwingend `pruefe-naehte.mjs` → Bildbewegung messen und `scroll` nachrechnen (V49-Regel,
   Kommando in `docs/der-weg.md`); `kodiere.mjs` warnt selbst bei fps ≠ 24 (`clipFps`). Bei
   neuem leg 3 zusätzlich `vorlauf` auf 0. Trägt die Naht 3→4 danach: `crossfade: 0.38` auf
   den Etappen 3/4 zurücknehmen (global gilt 0.1) und Nähte neu messen.
3. **Die Reise zur Hauptseite machen**, sobald Gabriel Texte und Umfang freigibt: `robots`
   auf `index, follow`, `scripts/copy-homepage.mjs` bzw. Manifest, `canonical`, und
   entscheiden, was mit `/main/` und der Lesefassung passiert.
4. **V34 umsetzen**, sobald über die Lesefassung entschieden ist — Wortlaut steht (V32),
   V18 braucht ein Transform-Skript, danach `inhalt/lumen-inhalt.md` neu erzeugen.
5. **In den `scroll-world`-Skill zurückgeben** — Liste in `docs/der-weg.md`, Abschnitt
   „Offen"; seit dieser Session gehören auch V51–V53 dazu (stehen fertig in der Engine).
   In einem Rutsch, wenn die Seite steht.
6. Impressum-Daten einsetzen, sobald Gabriel sie liefert (V3) — letzter Launch-Blocker.
7. Repo `stilprobe-automatik`: `senden.php` und `kontingent.php` bauen → macht Formular und
   Badge scharf. Vertrag: `docs/stilprobe/schnittstelle.md`.
8. I3 (Kosten-FAQ): Wortlaut-Vorschlag schreiben und vorlegen — nicht ohne Ok einsetzen.
9. V20 auflösen, sobald Gabriel entscheidet: echte Ausschnitte oder Satz umformulieren.
10. V47 nur anfassen, wenn Gabriel es ausdrücklich will — 5 px auf schmalen Telefonen.
11. I2 einplanen (V18 → Astro), am besten zusammen mit dem All-Inkl-Umzug.
12. V19 und die Branch-/Worktree-Bereinigung ausführen, sobald Gabriel freigibt (unten).
13. **Videos neu komprimieren** — 16,4 MB für sieben Handy-Clips sind mit modernerer
    Kompression plausibel halbierbar. Bisher bewusst ausgeklammert.

## Stolperfallen (sofort wichtig)
- **`clipFps: 24` ist an die Kodierung gekoppelt** — die Engine seekt aufs 24er-Bildraster.
  `kodiere.mjs` warnt bei Abweichung; wer an Rasterung oder Glättung dreht: `docs/der-weg.md`.
- **Der Bildanteil hängt an `--weg-textzone`** in `der-weg/index.html` — vier Stellen (Breite
  × Höhe). Die Grenzen 365/385 px hängen an der Breite der zwei Schluss-Knöpfe — **wer deren
  Beschriftung ändert, misst neu.** Tabellen in `docs/der-weg.md`.
- **`scroll` je Etappe ist keine Geschmacksfrage**: `Bildbewegung / 8,06`, Boden 0,85 (V49).
  Wer einen Clip austauscht, misst neu — sonst wandert der Zäh-Fehler wieder ein.
- **`linger` und Sprungziel nur mit `copyTiming` zusammen denken** — die Verwechslung
  ('middle' angenommen, 'arrival' gelaufen) hat zweimal zugeschlagen (V38, V48).
- **Nicht jeder Leerraum unter dem Text ist ein Fehler** — ~60 px sind die `svh`-Reserve für
  die einfahrende Adressleiste. Bewusste Wahl, keine Schlamperei.
- **Zwei Verläufe an einer Naht müssen sich überlappen** — an der Abgangs-Naht ist dreimal
  etwas gerissen (V37, V39, V43/V44). Siehe „Die Schürze" in `docs/der-weg.md`.
- **Behauptete Zahlen vor dem Dokumentieren messen** — V47 hielt vier Wochen den Streifen
  hoch; diese Session war „bis zu 9 Seeks" geschätzt, simuliert waren es 7.
- **Preview-Pane: Screenshots gehen gar nicht**, Beweise über DOM-Geometrie; erst Viewport
  setzen, dann `resize` selbst auslösen. rAF/Scroll laufen nicht von allein — der Testmount-
  Trick (rAF-Callbacks sammeln, je Charge EINMAL per `splice` feuern, nie bis zur Leere —
  die Engine bestellt sich endlos nach) hat sich am 01.08. bewährt. Details in CLAUDE.md.
- **Der Arbeitsordner einer Sitzung kann zwischen zwei Zügen ausgetauscht werden** (29.07.).
  Bei „No such file or directory" auf einen eben benutzten Pfad: `git worktree list`.
- V18 = minifiziertes Single-File-HTML: nie direkt editieren; Transform-Skript mit Assertions
  (Vorbilder in `scripts/v18/`). Interne Links absolut (`/jgc-studio-website/…`).
- **Vor jedem Zugende `node scripts/pruefe-seiten.mjs`** (steckt in `pruefen.txt`).
- **Scroll-Reise lokal ansehen:** `node scripts/der-weg/server.mjs` aus dem Arbeits-Worktree
  (der Hauptordner steht auf `variant/09` und hat kein `der-weg/`), Port 4330.
- Deploy = Push auf `main` (`main` in keinem Worktree → `git branch -f main HEAD`).
- **Commit-Messages IMMER als Datei + `git commit -F`** — am 01.08. zerbrach sogar eine reine
  ASCII-Message: ein Here-String nach `;` in einer Befehlskette wurde nicht als Here-String
  geparst, git bekam Wortsalat als Pathspecs.
- Gabriels eigene Aufgaben liegen im **Hub, Karte „Website"** — nicht in einer Datei im Repo.

## Aufräumen — wartet auf Gabriels Freigabe
Kassensturz 01.08.: 6 Worktrees (Hauptbaum + 4 unter „JGC Studio" + 1 unter „Scroll World").
Ungemergt gegen `main`: die neun `variant/*`-Branches (**müssen bleiben** — der Deploy baut
sie) und dieselben drei `claude/*` wie am 31.07. (damals geprüft: keine verlorene Arbeit,
seither unverändert). Die Arbeit dieser Session liegt vollständig in `main`; ihr Branch
`claude/background-video-scroll-behavior-6e6a61` (lokal + origin) ist gemergt und kann weg.
Entbehrliche Worktrees (alle auf gemergten Ständen): `bold-hopper-71b067`, `variante-18`,
`website-improvements-review-e4c50f`, `Scroll World/…/extract-video-last-frame-ac0958`.
**`leg6-staffelei-bild-1ac3ec` ist der aktive Ordner dieser Session** — erst nach deren
Ende entfernen.

```
git worktree remove ".claude/worktrees/bold-hopper-71b067"
git worktree remove ".claude/worktrees/variante-18"
git worktree remove ".claude/worktrees/website-improvements-review-e4c50f"
git worktree remove "C:/Projekte/JGC Studio/Scroll World/.claude/worktrees/extract-video-last-frame-ac0958"
git branch -d claude/bold-hopper-71b067 claude/variante-18 claude/telegram-last-message-screenshot-8178b6
git branch -d claude/sharp-herschel-f7c5e1 claude/website-variant-18-homepage-c16a97
git branch -D claude/world-scroll-mobile-expand-9b5250
git branch -d claude/background-video-scroll-behavior-6e6a61
git push origin --delete claude/background-video-scroll-behavior-6e6a61
```
