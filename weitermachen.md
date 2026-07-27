# Weitermachen — JGC Lumen Website

## Stand (27.07.2026 — zwei Sessions: Geräte-Feinschliff + /improve-Runde 3, beides live)
- **Die Reise wird die Hauptseite.** Gabriels Entscheidung (Geräte-Session, sechs Deploys mit
  seinen Screenshots). Ob die Lesefassung daneben bestehen bleibt, ist offen (Hub-Punkt).
- **Geräte-Session gebaut:** Hochkant-Fassung (Bildband oben, Text unten), „Mehr"-Feld je
  Station, Datenmodus (erst Standbilder, Video nach Tempo-Messung), Naht 2→3 gebessert.
  Details: `docs/der-weg.md` und CHANGELOG.
- **/improve Runde 3 danach:** acht Befunde V21–V28 gefunden, umgesetzt, nachgemessen und
  deployt (Commits `50eabcc` + `b236e78`). Darunter: unsichtbare Stationen waren klickbar
  (mailto-Falle), Datenmodus gab langsamsten Leitungen das Video frei, Nav-Reiter 2,6:1,
  375er/390er-iPhones-Kalibrierung. Register: `verbesserungen.md`, Messwerte: CHANGELOG.
- **Live nachgemessen:** Reise-Fixes ausgeliefert, Hauptseite bitgenau unverändert
  (1.225.044 Zeichen). Deploy-Lauf 30297829030 grün.
- **Doku-Rettung:** Der save-state der Geräte-Session lag ungemergt auf
  `claude/world-scroll-mobile-expand-9b5250` (Entscheidung + zwei CLAUDE.md-Messfallen) —
  Inhalte sind jetzt hier und in der CLAUDE.md eingearbeitet; der Branch ist damit obsolet.

## Offen (unfertig / wartet auf Zulieferung)
- **Impressum ist weiter leer (V3)** — braucht Gabriels Daten, liegt im Hub. Größter Blocker.
- **Formular und Badge der Stilprobe laufen weiter auf Fallbacks** — `senden.php` und
  `kontingent.php` existieren noch nicht. Kein Bug; der Fehlerpfad ist sichtbar.
- **Etappe 6 zeigt ein generiertes Gesicht**, nicht Gabriel. Seit dem „Mehr"-Feld schärfer:
  dort steht sein Name, Werdegang und TÜV-Prüfzeichen-ID neben dem erfundenen Gesicht.
- **Naht 3→4 springt weiter** — nur durch eine neue Etappe 4 zu heilen, Startbild liegt bereit
  (`Scroll World\legs\anschlussbilder\`). Naht 2→3 gebessert, aber unter der Schwelle.
- **`der-weg/scrub-engine.js` ist eine Sonderfassung** — inzwischen mehrere Zusätze
  (gated/prefetch/Rückgabewert + visibility-Kopplung + Nachlade-Deckel, Liste in
  `docs/der-weg.md`). Ein Update aus dem Skill würde sie überschreiben.
- **Die Reise ist in der jetzigen Fassung auf keinem echten Telefon geprüft** — Gabriel hat
  die letzten Deploys (inkl. Runde 3: minimal mehr Textzone auf hohen Telefonen) nicht gesehen.
- **Gabriels PC-Durchgang (27.07.) ist notiert, nicht gebaut:** **V29** doppelte Weganzeige am
  PC · **V30** Sigel zu groß und schief zum Schriftzug · **V31** verdrehter Schulungs-Satz raus ·
  **V32** „DSGVO-konform" als pauschales Etikett → bedingte Formulierung (Wortlaut-Vorschlag
  steht in `verbesserungen.md`, braucht sein Ok) · **V33** TÜV-Siegel mit Prüf-Link ins
  „Mehr"-Feld der Station „Wer mit dir arbeitet".
- Offene Befunde: **V3** · **V10** · **V13** · **V14** · **V18** · **V19** · **V20** ·
  **V29**–**V33**.
- Offene Ideen: **I2** (V18 → Astro, löst V10 und V18 mit) · **I3** (Kosten-FAQ) ·
  **I4** (Wortmarke aufs Vorschaubild).

## Nächste Schritte (Claude)
1. **Gabriels Rückmeldung zur überarbeiteten Reise einarbeiten** — jetzt konkret **V29–V33**
   (Zuruf vom 27.07., liegt notiert vor). V29 und V32 brauchen vorher seine Entscheidung:
   welche der zwei Weganzeigen führt, und der DSGVO-Wortlaut. V30/V31/V33 sind ohne Rückfrage
   baubar. Der Bildanteil hängt weiter an einer Zahl (`--weg-textzone`, `max(36%, 320px)`,
   niedrige Schirme 300 px).
2. **Die Reise zur Hauptseite machen**, sobald Gabriel Texte und Umfang freigibt: `robots` auf
   `index, follow`, `scripts/copy-homepage.mjs` bzw. Manifest umstellen, `canonical` prüfen, und
   entscheiden, was mit `/main/` und der Lesefassung passiert.
3. **Nachgeliefertes leg 4 (und ggf. 6) einarbeiten:** `node scripts/der-weg/kodiere.mjs 4`,
   danach zwingend `node scripts/der-weg/pruefe-naehte.mjs`. Bei einer neuen Etappe 3 zusätzlich
   das Feld `vorlauf` in `kodiere.mjs` auf 0 zurücksetzen.
4. **In den `scroll-world`-Skill zurückgeben** (Liste in `docs/der-weg.md`, Abschnitt „Offen" —
   jetzt fünf Punkte inkl. visibility-Fix, Nachlade-Deckel, Nav-Kontrast). In einem Rutsch,
   wenn die Seite steht.
5. Impressum-Daten einsetzen, sobald Gabriel sie liefert (V3) — letzter Launch-Blocker.
6. Repo `stilprobe-automatik`: `senden.php` und `kontingent.php` bauen → macht Formular und
   Badge scharf. Vertrag: `docs/stilprobe/schnittstelle.md`.
7. I3 (Kosten-FAQ): Wortlaut-Vorschlag schreiben und Gabriel vorlegen — Verkaufstext, nicht
   ohne sein Ok einsetzen.
8. V20 auflösen, sobald Gabriel entscheidet: echte Ausschnitte einsetzen oder den
   Echtheits-Satz umformulieren. (Im „Mehr"-Feld steht die Echtheitsbehauptung bewusst nicht.)
9. I2 einplanen (V18 → Astro), am besten zusammen mit dem All-Inkl-Umzug.
10. V19 und die Branch-/Worktree-Bereinigung ausführen, sobald Gabriel freigibt (unten).
11. **Videos neu komprimieren** — 16,4 MB für sieben Handy-Clips sind mit modernerer
    Kompression plausibel halbierbar. Bisher bewusst ausgeklammert.

## Stolperfallen (sofort wichtig)
- **Der Bildanteil hängt an genau einer Zahl:** `--weg-textzone` in `der-weg/index.html`,
  `max(36%, 320px)` (Schirme unter 780 px Höhe: 300 px). Nach jeder Änderung an Schrift oder
  Stationstext die Schluss-Station nachmessen (bestimmt die Mindesthöhe; ~314 px Inhalt).
  Tabelle und Begründung in `docs/der-weg.md`.
- V18 = minifiziertes Single-File-HTML: nie direkt editieren; assertion-guardetes Transform-Skript
  (Vorbilder in `scripts/v18/`). Interne Links absolut (`/jgc-studio-website/…`), nie relativ.
- **Vor jedem Zugende `node scripts/pruefe-seiten.mjs`** (steckt in `pruefen.txt`). Ohne Argument
  prüft er die Repo-Quellen, mit `_site` das Deploy-Ergebnis — die Sollwerte unterscheiden sich.
- **Browser-Preview:** erst Viewport setzen, dann messen. Scroll-Ereignisse, rAF, Animationen
  UND Transitions laufen im versteckten Pane nicht bzw. frieren am Startwert ein — Details und
  Testtricks in der CLAUDE.md (Preview-Messungen, jetzt drei Fallen + Headless-Hinweis).
- **Scroll-Reise lokal ansehen:** `node scripts/der-weg/server.mjs`, dann
  `http://localhost:4330/der-weg/`. Ist 4330 von einer anderen Session belegt, Port als
  Argument mitgeben (`… server.mjs 4331`) und den Browser per URL anhängen. Unter `file://`
  bleibt die Seite leer.
- Deploy = Push auf `main` (`main` in keinem Worktree → `git branch -f main HEAD`).
- Gabriels eigene Aufgaben liegen im **Hub, Karte „Website"** — nicht in einer Datei im Repo.

## Aufräumen — wartet auf Gabriels Freigabe
8 Worktrees (7 unter „JGC Studio", 1 unter „Scroll World"). Ungemergt gegen `main` sind die
neun `variant/*`-Branches (**müssen bleiben** — der Deploy baut sie, Löschen beschädigt die
Galerie) und drei `claude/*`-Branches, alle geprüft, keine verlorene Arbeit:
`sharp-herschel-f7c5e1` (V19, Inhalt übernommen) · `website-variant-18-homepage-c16a97`
(nur Altstand) · `world-scroll-mobile-expand-9b5250` (save-state-Doku, am 27.07. vollständig
in weitermachen.md/CLAUDE.md übernommen — dieser braucht `-D`, weil nie gemergt).

```
git worktree remove ".claude/worktrees/<name>"
git branch -d claude/sharp-herschel-f7c5e1
git branch -d claude/website-variant-18-homepage-c16a97
git branch -D claude/world-scroll-mobile-expand-9b5250
```
