# Weitermachen — JGC Lumen Website

## Stand (Session 2026-07-11, Branch claude/stilprobe-automation-website-af3a9a)
- **Stilprobe-Website-Teil komplett umgesetzt** (Konzept v1.1 §5, via /delegate smart):
  V18-Hauptseite (Sektion `#stilprobe`, Nav ×2, Hero-CTA, FAQ 02 + Renummerierung bis 11,
  Final-CTA-Zeile, Footer-Link, Rechtslink-Bugfix), Unterseite `stilprobe/index.html`,
  Deploy-Step, Datenschutz-Abschnitt (Entwurf), `docs/stilprobe/` inkl. Schnittstellen-Vertrag.
- Alles verifiziert: Zähl-Assertions, Live-DOM-Tests (auch Mock-`kontingent.php`: knapp/voll/
  Warteliste-Umschaltung, Formular-Fehlerpfad), Astro-Build grün, 0 Konsolen-Fehler.
- Details: CHANGELOG.md (2026-07-11) + delegation-log.md.

## Offen
- **Nicht auf `main` gepusht** — bewusst: Push würde sofort live deployen, Formular/Badge
  laufen aber erst mit dem All-Inkl-Umzug (PHP). Gabriel entscheidet den Zeitpunkt.
- Beispieltexte Fassung A/B in der Hauptseiten-Sektion = Platzhalter (Phase 6: durch
  Gabriels echte Probe ersetzen; Marker `PLATZHALTER Phase 6` im HTML).
- Datenschutz: neuer Stilprobe-Abschnitt ist Entwurf (juristische Prüfung); die restliche
  Datenschutzerklärung ist weiter der alte Platzhalter („in Vorbereitung").
- Astro-`site/` hinkt der Live-V18 weiter hinterher (Marke „JGC Studio", alte Inhalte) —
  bekanntes Alt-Thema, heute unangetastet.
- PHP-Empfangsschicht + n8n-Werkstatt = separates Repo `stilprobe-automatik` (Konzept
  Phasen 0–4/6), noch nicht begonnen.

## Nächste Schritte
1. Gabriel: Branch reviewen (lokal bauen oder Push auf main erst zum All-Inkl-Umzug).
2. Repo `stilprobe-automatik` starten (Phase 0/1) — Zulieferungen aus Konzept §15.1.
3. Phase 6: echte Beispiel-Ausschnitte einsetzen, STILPROBE_MAIL/Domain bestätigen.

## Stolperfallen (unverändert wichtig)
- V18 = minifiziertes Single-File-HTML: nie direkt editieren/lesen; Transform-Skript
  mit Assertions (`scripts/stilprobe/transform-v18-stilprobe.mjs` als Vorbild).
- Browser-Pane rendert headless (visibilityState hidden, Viewport 0): Sichtbarkeit über
  is-visible-Klassen/CSS-Regeln prüfen, nicht über computed opacity; keine Screenshots.
- Badge-/Formular-Wortlaute und Feldnamen sind Vertrag: `docs/stilprobe/schnittstelle.md`.
