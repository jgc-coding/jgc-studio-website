# Weitermachen — JGC Lumen Website

## Stand (Session 2026-07-25 — /improve-Runde 2 erhoben UND umgesetzt)
- **13 Befunde behoben**, Commit `f3a7d94`, alle Details in `verbesserungen.md` (Abschnitt Erledigt).
  Kurz: Kontaktweg gebaut (mailto statt Anker auf sich selbst), Entwurfsspeicher fürs
  Stilprobe-Formular, Fehlermeldung sichtbar gemacht, Sichtbarkeit ohne JavaScript repariert,
  14 Alt-Varianten auf `noindex`, Kontrast auf WCAG AA, `og:image` gebaut, Galerie entgooglet.
- **Neu: `scripts/pruefe-seiten.mjs`** — prüft in ~3 s zehn Regeln, je eine pro Fehlerklasse
  dieser Runde. Läuft im Deploy-Workflow und in `.claude/pruefen.txt`. Hat beim ersten Lauf
  selbst einen Fehler gefunden (Stilprobe-Seite erbte den `.js`-Fehler aus V18).
- **Prozess-Stufe steht jetzt in `CLAUDE.md`: Produkt.** `.claude/pruefen.txt` existiert,
  das Done-Gate greift damit wieder.
- **Register-Lücke geschlossen:** Es gab schon zwei frühere Analysen (27.06. nur als Text,
  07.07. auf einem nie gemergten Branch). Vier Punkte standen in allen drei Runden.
  `verbesserungen.md` liegt jetzt auf `main` und wird committet.
- **NOCH NICHT DEPLOYT** — alles liegt auf `claude/website-improvements-review-e4c50f`.
  Live geht es erst mit dem FF-Merge nach `main` (siehe Nächste Schritte).

## Offen (unfertig / wartet auf Zulieferung)
- **Impressum ist weiter leer** (V3) — braucht Gabriels Daten, steht in `meine-todos.md`.
  Größter verbliebener Blocker.
- **Formular/Badge der Stilprobe laufen weiter auf Fallbacks** — `senden.php`/`kontingent.php`
  existieren noch nicht. Kein Bug, aber der Fehlerpfad ist jetzt wenigstens sichtbar.
- Offene V-Nummern: **V3** (Impressum), **V10** (4 Rest-Schwachstellen, brauchen Astro 7),
  **V13** (Platzhalter-Zitate, Gabriels Entscheidung), **V14** (LinkedIn-URL fehlt),
  **V18** (Seitengewicht 1,2 MB), **V19** (Alt-Branch aufräumen).
- Ideen: **I2** (V18 → Astro zurückführen, löst V10 und V18 mit), **I3** (Kosten-FAQ),
  **I4** (Wortmarke aufs Vorschaubild).
- Beispieltexte Fassung A/B in `#stilprobe` = weiter Platzhalter (`PLATZHALTER Phase 6`).

## Nächste Schritte
1. **Deployen:** `git branch -f main HEAD` + Push → Action läuft ~1–2 min. Danach live prüfen:
   mailto-Knopf, `/og-bild.jpg` erreichbar, Alt-Varianten auf `noindex`.
   Der neue Workflow-Schritt „Qualitaetspruefung" bricht laut ab, wenn etwas fehlt.
2. Impressum-Daten von Gabriel einsetzen (V3).
3. Repo `stilprobe-automatik`: `senden.php`/`kontingent.php` bauen → macht Formular und Badge
   scharf. Vertrag: `docs/stilprobe/schnittstelle.md`.
4. I2 einplanen (V18 → Astro), am besten zusammen mit dem All-Inkl-Umzug.

## Stolperfallen (sofort wichtig)
- V18 = minifiziertes Single-File-HTML: nie direkt editieren; assertion-guardetes Transform-Skript
  (Vorbilder in `scripts/v18/`). Interne Links absolut (`/jgc-studio-website/…`), nie relativ.
- **Vor jedem Zugende `node scripts/pruefe-seiten.mjs` laufen lassen** (steckt in `pruefen.txt`).
- **Sektions-Selektoren nie über die Position** (`nth-child(N of …)`) — eine eingeschobene
  Sektion verschiebt sonst still alle Farbflächen. Immer IDs. Der Prüfer bewacht das jetzt.
- **Regeln, die Inhalt verstecken, brauchen den `.js`-Vorsatz** — sonst ist die Seite ohne
  JavaScript leer. Gilt für V18 UND die Stilprobe-Seite (sie erbt das CSS).
- `.gitattributes`: Varianten-HTMLs stehen als `text eol=lf` — NICHT auf `-text`/`binary`.
- Deploy = Push auf `main` (`main` in keinem Worktree → `git branch -f main HEAD`).
- **Browser-Preview: Viewport prüfen, bevor du misst.** Ein frisch geöffneter Tab meldet
  0×0 — alle Geometriewerte sind dann Müll. `resize_window` mit expliziter Breite/Höhe.
  `requestAnimationFrame` und IntersectionObserver laufen im versteckten Pane gar nicht;
  Reveal-Zustände sind dort nicht prüfbar (`is-visible` bleibt aus).
- Formular-/Badge-Wortlaute + Feldnamen = Vertrag: `docs/stilprobe/schnittstelle.md`.
