# Weitermachen — JGC Lumen Website

## Stand (26.08.2026 — Texte v2, Formulare in der Reise, V54–V58, live)
Gabriels Änderungsrunde vom 26.08. ist komplett umgesetzt, gemessen und deployt (Lauf auf
`5e513fc` grün, Live-Bytes gegengeprüft, Hauptseite V18 byteidentisch unberührt).
- **V54 — Texte v2 wortgetreu** an allen drei Orten je Station plus FAQ 01/02/05; Chips
  („innerhalb 48 h", ohne „15 im Monat", „TÜV-zertifiziert"), Label „Über mich", überall
  „Klientinnen und Klienten". Neun Grammatik-/Typografie-Fixes und zwei Konsistenz-Chips
  („ab 1.000 €", „Social Media") an Gabriel gemeldet.
- **V54-Messung — Hochkant-Zonen angehoben** auf 365/350/345/325 (vorher 355/320/325/300):
  höchste Station ist jetzt „Über mich" (313 px) bzw. bei 320 px Breite „Der Weg" (297 px),
  nicht mehr die Schluss-Station. Kostet 20–30 px Bildhöhe auf breiten Telefonen.
- **V55 — „Mehr dazu" am PC größer** (ab 900 px: 52rem breit, min(88dvh,62rem), Lesebreite
  38rem im Feld). Hero passt bei 1920×1080 ohne Scrollen, bei 1366×768 bleiben 65 px Rest.
- **V56/V57 — zwei Formular-Overlays in der Reise** (`der-weg/formulare.js`, neu): Stilprobe
  einreichen und Erstgespräch anfragen. Artikel ohne `data-station` in `#vertiefungen`, per JS
  ins Overlay **verschoben statt geklont** (Eingaben überleben das Schließen), Reise hält an,
  aber Weiterscrollen schließt NICHT. `mountVertiefung` gibt dafür neu ein Handle zurück.
- **V58 — Gendern raus**, auch auf `stilprobe/index.html`. V18 bewusst unangetastet.
- Neu im Repo: `docs/erstgespraech/` (Konzept + Vertrag), Gates erweitert (Deploy-Verify prüft
  `formulare.js`, `pruefen.txt` prüft jetzt auch die drei Reise-Skripte).

## Offen (unfertig / wartet auf Zulieferung)
- **Impressum ist weiter leer (V3)** — braucht Gabriels Daten, liegt im Hub. Größter Blocker.
  Daran hängt auch der **Datenschutz-Absatz zu den zwei neuen Formularen**.
- **Gabriels Gerätetest steht aus** — inzwischen für drei Runden: V48–V50, der Scrub-Umbau
  V51–V53 und jetzt V54–V58 (neue Texte, Formulare, höherer Textstreifen). Drei Punkte im Hub,
  in einem Durchgang erledigbar.
- **Zwei Clips kommen von Gabriel:** neue Etappe 4 gegen den Rückwärts-Sprung der Naht 3→4
  (Startbild in `Scroll World\legs\anschlussbilder\`) und leg 6 mit seinem eigenen Porträt.
- **V47 ist stark geschrumpft, nicht erledigt.** Unter 362/380 px stapeln die Knöpfe weiter;
  Gewinn dort rund 5 px. Korrigierte Fassung in `verbesserungen.md`.
- **Zwei Wortlaut-Fragen im Hub:** der Chip „Deine Daten DSGVO-konform" auf der ersten Szene —
  und neu, ob der v2-Auftaktsatz wieder pauschal „DSGVO-konform" sagen soll.
- **Im Hub: soll die weiche Ausblendung des Videos ins Pergament kürzer werden?** 14svh
  (~98 px am Telefon); kürzer = ~28 px mehr klares Bild, ändert die Naht. Bewusst unangetastet.
- **V34 offen:** die DSGVO-Sprachregelung fehlt in Lesefassung V18 und auf der Datenschutzseite.
  Hängt an der Hub-Frage, ob die Lesefassung bleibt.
- **Alle drei Formularstrecken laufen auf Fallbacks** — `stilprobe/senden.php`,
  `kontingent.php` und neu `erstgespraech/senden.php` existieren noch nicht. Kein Bug, der
  Fehlerpfad mit Mailweg ist der gebaute Normalfall. Ob `stilprobe@jgc-lumen.de` überhaupt
  empfängt, ist ungeprüft (jetzt im Hub).
- **`der-weg/scrub-engine.js` ist eine Sonderfassung** (V51–V53 inklusive). Zusatzliste in
  `docs/der-weg.md`; ein Update aus dem Skill würde sie überschreiben.
- Offene Befunde: **V3** · **V10** · **V13** · **V14** · **V18** · **V19** · **V20** ·
  **V34** · **V47**.
- Offene Ideen: **I2** (V18 → Astro, löst V10 und V18 mit) · **I3** (Kosten-FAQ) ·
  **I4** (Wortmarke aufs Vorschaubild).

## Nächste Schritte (Claude)
1. **Gabriels Urteil einarbeiten** — jetzt zu drei Runden gleichzeitig (V48–V50, V51–V53,
   V54–V58). Erst messen, dann Plan zeigen (hat fünfmal getragen). Stellschrauben: Boden 0,85
   (Schlussszenen), Stilprobe-`scroll`, Ausblendung kürzen, Zeitkonstante 85 ms beim Scrubbing,
   und falls der Textstreifen zu hoch wirkt: die Texte von „Über mich"/„Der Weg" kürzen, nicht
   die Zonen-Zahlen.
2. **Nachgelieferte Clips einarbeiten** (Etappe 4 und 6): `node scripts/der-weg/kodiere.mjs <N>`
   → zwingend `pruefe-naehte.mjs` → Bildbewegung messen und `scroll` nachrechnen (V49-Regel,
   Kommando in `docs/der-weg.md`); `kodiere.mjs` warnt selbst bei fps ≠ 24. Bei neuem leg 3
   zusätzlich `vorlauf` auf 0. Trägt die Naht 3→4 danach: `crossfade: 0.38` auf den Etappen 3/4
   zurücknehmen (global gilt 0.1) und Nähte neu messen.
3. **Die Reise zur Hauptseite machen**, sobald Gabriel freigibt: `robots` auf `index, follow`,
   `scripts/copy-homepage.mjs` bzw. Manifest, `canonical`, und entscheiden, was mit `/main/`
   und der Lesefassung passiert. Seit dieser Session ist die Reise dafür bereit — sie kann
   Stilprobe und Erstgespräch selbst entgegennehmen.
4. **V34 umsetzen**, sobald über die Lesefassung entschieden ist — Wortlaut steht (V32),
   V18 braucht ein Transform-Skript, danach `inhalt/lumen-inhalt.md` neu erzeugen.
5. **In den `scroll-world`-Skill zurückgeben** — Liste in `docs/der-weg.md`, Abschnitt „Offen";
   dazugekommen ist das Muster „Formular-Overlay: verschieben statt klonen, kein
   Scroll-Schließen". In einem Rutsch, wenn die Seite steht.
6. Impressum-Daten einsetzen, sobald Gabriel sie liefert (V3) — letzter Launch-Blocker; im
   selben Zug den Datenschutz-Absatz zu den zwei Formularen schreiben.
7. Repo `stilprobe-automatik`: `senden.php` und `kontingent.php` bauen, **plus neu ein zweites
   `senden.php` für `/erstgespraech/`** — macht alle drei Strecken scharf. Verträge:
   `docs/stilprobe/schnittstelle.md` und `docs/erstgespraech/schnittstelle.md`.
8. I3 (Kosten-FAQ): Wortlaut-Vorschlag schreiben und vorlegen — nicht ohne Ok einsetzen.
9. V20 auflösen, sobald Gabriel entscheidet: echte Ausschnitte oder Satz umformulieren.
10. V47 nur anfassen, wenn Gabriel es ausdrücklich will — 5 px auf schmalen Telefonen.
11. I2 einplanen (V18 → Astro), am besten zusammen mit dem All-Inkl-Umzug.
12. V19 und die Branch-/Worktree-Bereinigung ausführen, sobald Gabriel freigibt (unten).
13. **Videos neu komprimieren** — 16,4 MB für sieben Handy-Clips sind mit modernerer
    Kompression plausibel halbierbar. Bisher bewusst ausgeklammert.

## Stolperfallen (sofort wichtig)
- **Texte der Reise stehen an DREI Orten** in `der-weg/index.html` (Konfiguration `sections`,
  SEO-Spiegel `data-sw-seo`, Vertiefungs-Artikel) — alle drei zusammen ändern, sonst erzählen
  Browser und Suchmaschine Verschiedenes. Danach die Stationshöhen hochkant nachmessen.
- **Die zwei Formular-Overlays folgen anderen Regeln als die Lesefelder:** Original-Knoten
  verschieben (nicht klonen), kein Schließen durch Scrollen. Wer `vertiefung.js` anfasst, darf
  das nicht „vereinheitlichen" — Begründung in `der-weg/formulare.js`, Kopfkommentar.
- **`--weg-textzone` steht jetzt auf 365/350/345/325** (vier Stellen, Breite × Höhe). Die
  Grenzen 365/385 px hängen an der Breite der zwei Schluss-Knöpfe — **wer deren Beschriftung
  ändert, misst neu.** Messwerte in `docs/der-weg.md` und im CSS-Kommentar.
- **`clipFps: 24` ist an die Kodierung gekoppelt** — die Engine seekt aufs 24er-Bildraster.
  `kodiere.mjs` warnt bei Abweichung.
- **`scroll` je Etappe ist keine Geschmacksfrage**: `Bildbewegung / 8,06`, Boden 0,85 (V49).
- **`linger` und Sprungziel nur mit `copyTiming` zusammen denken** — die Verwechslung hat
  zweimal zugeschlagen (V38, V48).
- **Nicht jeder Leerraum unter dem Text ist ein Fehler** — ~60 px sind die `svh`-Reserve für
  die einfahrende Adressleiste. Bewusste Wahl.
- **Zwei Verläufe an einer Naht müssen sich überlappen** (V37, V39, V43/V44) — „Die Schürze".
- **Behauptete Zahlen vor dem Dokumentieren messen.** Diese Session gut gelaufen: die alten
  Zonen-Werte wurden erst reproduziert (Schluss-Station 306/277 px wie dokumentiert), bevor die
  neuen galten — das trennt „Text ist gewachsen" von „Messaufbau ist kaputt".
- **Preview-Pane: Screenshots gehen gar nicht**, Beweise über DOM-Geometrie; erst Viewport
  setzen, dann `resize` selbst auslösen. Formular-Flüsse mit ersetztem `window.fetch` prüfen
  (Erfolg/Fehler/Timeout/Warteliste) — hat diese Session sauber getragen.
- **Commit-Messages IMMER als Datei + `git commit -F`** — heute wieder zugeschlagen: ein
  Here-String nach `;` in einer Befehlskette wird nicht als Here-String geparst, git bekam
  Wortsalat als Pathspecs und staged gar nichts.
- **Der Arbeitsordner einer Sitzung kann zwischen zwei Zügen ausgetauscht werden.**
  Bei „No such file or directory" auf einen eben benutzten Pfad: `git worktree list`.
- V18 = minifiziertes Single-File-HTML: nie direkt editieren; Transform-Skript mit Assertions.
  Interne Links absolut (`/jgc-studio-website/…`).
- **Vor jedem Zugende `node scripts/pruefe-seiten.mjs`** (steckt in `pruefen.txt`).
- **Scroll-Reise lokal ansehen:** `node scripts/der-weg/server.mjs` aus einem Arbeits-Worktree
  (der Hauptordner steht auf `variant/09` und hat kein `der-weg/`), Port 4330.
- Deploy = Push auf `main` (`main` in keinem Worktree → `git branch -f main HEAD`).
- Gabriels eigene Aufgaben liegen im **Hub, Karte „Website"** — nicht in einer Datei im Repo.

## Aufräumen — am 26.08.2026 erledigt (Gabriels Freigabe)
Der Branch-Zoo ist weg: **4 Worktrees entfernt** (`bold-hopper-71b067`, `variante-18`,
`leg6-staffelei-bild-1ac3ec`, `Scroll World/…/extract-video-last-frame-ac0958` — alle vorher
auf sauberem Stand geprüft) und **24 `claude/*`-Branches gelöscht**, davon 21 gemergte über
`git branch -d` (die Schutzschiene hat die anderen korrekt verweigert). Auf `origin` sind die
zwei gemergten Reste ebenfalls weg.

Drei Branches waren ungemergt: `website-variant-18-homepage-c16a97` und
`world-scroll-mobile-expand-9b5250` trugen nur ältere Fassungen von `CLAUDE.md` und
`weitermachen.md` (dritte Prüfung, wieder ohne Fund) → gelöscht. `sharp-herschel-f7c5e1`
enthielt als Einziges echten einmaligen Inhalt, die 116-zeilige Runde-1-Analyse vom 07.07.;
sie ist **vor dem Löschen als Tag gesichert** und liegt auch auf `origin`:

```
git show archiv/runde1-analyse-2026-07-07:WEBSITE-AENDERUNGEN.md
```

Es bleiben: der Hauptbaum (steht auf `variant/09`), der Worktree dieser Sitzung und die neun
`variant/*`-Branches — **die müssen bleiben, der Deploy baut aus ihnen die Galerie-Varianten.**

Nach dem Ende DIESER Sitzung noch offen (Worktree + Branch lokal und auf origin):
```
git worktree remove ".claude/worktrees/website-improvements-review-e4c50f"
git branch -d claude/jgc-lumen-website-updates-0552a3
git push origin --delete claude/jgc-lumen-website-updates-0552a3
```

**Lehre für den nächsten Kassensturz:** `git branch --no-merged` zeigt nur die ungemergten —
die 21 gemergten Altbranches standen dort nie und sind vier Wochen lang unbemerkt liegen
geblieben. Einmal `git branch --list "claude/*"` zählen, nicht nur die Ungemergten.
