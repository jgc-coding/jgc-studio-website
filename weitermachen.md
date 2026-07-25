# Weitermachen — JGC Lumen Website

## Stand (Session 2026-07-25 — /improve-Runde 2 erhoben, umgesetzt und LIVE)
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
- **Live seit 2026-07-25**, Commit `4f3cc16` auf `main`, Deploy grün, end-to-end auf der echten
  Seite nachgeprüft: mailto-Knopf + sichtbare Adresse, Verlauf auf `#passt` (nicht mehr auf den
  Stimmen), Knopfkontrast 4,79 : 1, `/og-bild.jpg` erreichbar (78 KB), 0 ungeschützte
  Versteck-Regeln, Stilprobe-Entwurf übersteht den Reload, Fehlermeldung 172 px über dem Knopf
  im Blickfeld, keine Konsolenfehler. Rollback-Punkt davor: `8d33cd0`.
- **Der erste Deploy-Versuch wurde vom neuen Prüfschritt gestoppt** — er fand neun weitere
  indexierbare Varianten (01–09), die aus den `variant/*`-Branches gebaut werden und als Datei
  nirgends im Repo liegen. Behoben mit `scripts/site-noindex.mjs`, das nach dem Build direkt auf
  `_site` stempelt. Indexierbar sind live jetzt nur noch die Startseite und `/stilprobe/`.

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
1. Impressum-Daten von Gabriel einsetzen (V3) — letzter Launch-Blocker.
2. Repo `stilprobe-automatik`: `senden.php`/`kontingent.php` bauen → macht Formular und Badge
   scharf. Vertrag: `docs/stilprobe/schnittstelle.md`.
3. I2 einplanen (V18 → Astro), am besten zusammen mit dem All-Inkl-Umzug.

## Stolperfallen (sofort wichtig)
- V18 = minifiziertes Single-File-HTML: nie direkt editieren; assertion-guardetes Transform-Skript
  (Vorbilder in `scripts/v18/`). Interne Links absolut (`/jgc-studio-website/…`), nie relativ.
- **Vor jedem Zugende `node scripts/pruefe-seiten.mjs` laufen lassen** (steckt in `pruefen.txt`).
  Ohne Argument prüft er die Repo-Quellen, mit `_site` das Deploy-Ergebnis — die Sollwerte
  unterscheiden sich (im Repo muss die Manifest-Hauptseite indexierbar sein, im `_site` nur die
  Root). **Nur die Quellen zu prüfen reicht nicht:** die Varianten 01–09 entstehen erst im Build.
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
