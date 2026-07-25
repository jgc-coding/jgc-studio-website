# Weitermachen — JGC Lumen Website

## Stand (Session 2026-07-25 — /improve-Runde 2, live auf `main`)
- **13 Befunde behoben und deployt**, Endstand `f7672cf`. Details ausschließlich in
  `verbesserungen.md` (Abschnitt Erledigt) — hier bewusst keine zweite Beschreibung.
  Kurz: Kontaktweg gebaut, Entwurfsspeicher fürs Stilprobe-Formular, Fehlermeldung sichtbar,
  Sichtbarkeit ohne JavaScript repariert, Kontrast auf WCAG AA, `og:image`, Galerie entgooglet.
- **Live nachgemessen** auf der echten Seite: mailto-Knopf + sichtbare Adresse, Verlauf auf
  `#passt` (nicht mehr auf den Platzhalter-Stimmen), Knopfkontrast 4,79 : 1, `/og-bild.jpg`
  erreichbar, 0 ungeschützte Versteck-Regeln, Entwurf übersteht den Reload, Fehlermeldung
  172 px über dem Knopf im Blickfeld, keine Konsolenfehler. Rollback-Punkt: `8d33cd0`.
- **Nur noch zwei Seiten sind indexierbar:** Startseite und `/stilprobe/`. Alles andere
  (14 Standalone-Varianten, 9 Branch-Varianten, `/main/`, Galerie) steht auf `noindex`.
- **Neu als Absicherung:** `scripts/pruefe-seiten.mjs` (10 Regeln, ~3 s, im Deploy und in
  `.claude/pruefen.txt`) und `scripts/site-noindex.mjs` (stempelt nach dem Build auf `_site`).
  Der Prüfer hat sich zweimal selbst bezahlt gemacht — er fand den `.js`-Fehler auf der
  Stilprobe-Seite und stoppte den ersten Deploy wegen der neun Branch-Varianten.
- **Prozess-Stufe steht in `CLAUDE.md`: Produkt.** Done-Gate greift wieder.
- **Register-Lücke geschlossen:** Es gab drei Analysen (27.06., 07.07., 25.07.), von denen keine
  im Hauptzweig lag. `verbesserungen.md` liegt jetzt auf `main` und wird committet.

## Offen (unfertig / wartet auf Zulieferung)
- **Impressum ist weiter leer (V3)** — braucht Gabriels Daten, liegt als Aufgabe im Hub
  (Karte „Website"). Größter verbliebener Blocker.
- **Formular und Badge der Stilprobe laufen weiter auf Fallbacks** — `senden.php` und
  `kontingent.php` existieren noch nicht. Kein Bug; der Fehlerpfad ist jetzt sichtbar.
- Offene Befunde: **V3** · **V10** (4 Rest-Schwachstellen, brauchen Astro 7) · **V13**
  (Gabriels Entscheidung) · **V14** (LinkedIn-URL fehlt) · **V18** (Seitengewicht) ·
  **V19** (Alt-Branch, wartet auf Freigabe).
- Offene Ideen: **I2** (V18 → Astro, löst V10 und V18 mit) · **I3** (Kosten-FAQ) ·
  **I4** (Wortmarke aufs Vorschaubild).
- Beispieltexte Fassung A/B in `#stilprobe` = weiter Platzhalter (`PLATZHALTER Phase 6`).

## Nächste Schritte (Claude)
1. Impressum-Daten einsetzen, sobald Gabriel sie liefert (V3) — letzter Launch-Blocker.
2. Repo `stilprobe-automatik`: `senden.php` und `kontingent.php` bauen → macht Formular und
   Badge scharf. Vertrag: `docs/stilprobe/schnittstelle.md`.
3. I3 (Kosten-FAQ): Wortlaut-Vorschlag schreiben und Gabriel zur Freigabe vorlegen — den Text
   nicht ohne sein Ok einsetzen, es ist Verkaufstext.
4. I2 einplanen (V18 → Astro), am besten zusammen mit dem All-Inkl-Umzug.
5. V19 und die Worktree-Bereinigung ausführen, sobald Gabriel freigibt (Kommandos siehe unten).

## Stolperfallen (sofort wichtig)
- V18 = minifiziertes Single-File-HTML: nie direkt editieren; assertion-guardetes Transform-Skript
  (Vorbilder in `scripts/v18/`). Interne Links absolut (`/jgc-studio-website/…`), nie relativ.
- **Vor jedem Zugende `node scripts/pruefe-seiten.mjs`** (steckt in `pruefen.txt`). Ohne Argument
  prüft er die Repo-Quellen, mit `_site` das Deploy-Ergebnis — die Sollwerte unterscheiden sich.
  **Nur die Quellen zu prüfen reicht nicht:** die Varianten 01–09 entstehen erst im Build.
- **Browser-Preview: erst Viewport setzen, dann messen.** Ein frisch geöffneter Tab meldet 0×0,
  alle Geometriewerte sind dann Müll. `resize_window` mit expliziter Breite/Höhe, danach
  `innerWidth` gegenprüfen. `requestAnimationFrame` und IntersectionObserver laufen im
  versteckten Pane gar nicht — Reveal-Zustände sind dort grundsätzlich nicht prüfbar.
- Deploy = Push auf `main` (`main` in keinem Worktree → `git branch -f main HEAD`).
- Gabriels eigene Aufgaben liegen im **Hub, Karte „Website"** — nicht in einer Datei im Repo.

## Aufräumen — wartet auf Gabriels Freigabe
11 Worktrees hängen an Branches, die vollständig in `main` sind; zwei weitere an Branches mit je
einem alten Commit (beide geprüft, keine verlorene Arbeit — der Bericht aus `sharp-herschel`
steckt in `verbesserungen.md`). **Die neun `variant/*`-Branches müssen bleiben:** der Deploy baut
sie bei jedem Lauf, ein Löschen würde die Galerie beschädigen.

```
git worktree remove ".claude/worktrees/<name>"
git branch -d claude/<name>
```
