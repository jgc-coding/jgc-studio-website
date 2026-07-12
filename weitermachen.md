# Weitermachen — JGC Lumen Website

## Stand (Session 2026-07-11, Branch claude/stilprobe-automation-website-af3a9a)
- **Stilprobe-Website-Teil komplett umgesetzt** (Konzept v1.1 §5, via /delegate smart):
  V18-Hauptseite (Sektion `#stilprobe`, Nav ×2, Hero-CTA, FAQ 02 + Renummerierung bis 11,
  Final-CTA-Zeile, Footer-Link, Rechtslink-Bugfix), Unterseite `stilprobe/index.html`,
  Deploy-Step, Datenschutz-Abschnitt (Entwurf), `docs/stilprobe/` inkl. Schnittstellen-Vertrag.
- Alles verifiziert: Zähl-Assertions, Live-DOM-Tests (auch Mock-`kontingent.php`: knapp/voll/
  Warteliste-Umschaltung, Formular-Fehlerpfad), Astro-Build grün, 0 Konsolen-Fehler.
- Details: CHANGELOG.md (2026-07-11) + delegation-log.md.

## Auch erledigt (gleiche Session, /improve-Punkte 5–9)
- Astro-`/main/`-Seiten auf Marke „JGC Lumen"; Kontaktmail überall `kontakt@jgc-lumen.de`
  (ACHTUNG: Postfach existiert erst mit der Domain); `.gitattributes` (Index war schon LF,
  Varianten byte-unangetastet); README neu (GitHub Pages statt Vercel); Deploy-Verify-Step.

## LIVE seit 2026-07-12
- **Alles auf `main` gemergt und deployed** (FF-Merge, Deploy-Run grün inkl. Verify-Step).
  Live verifiziert: Hauptseite → „Stilprobe anfordern" → `…/stilprobe/` lädt; Logo, Nav,
  Footer, Rückweg korrekt. Tag `stilprobe-live-2026-07-12`. Rollback-Punkt davor: `4dff254`.
- Zusatz-Fix vor Go-live: V18-Logo-Link `../../` → absolut `/jgc-studio-website/` (zeigte von
  der Root sonst aufs GitHub-Konto-Wurzelverzeichnis). Skript `scripts/stilprobe/fix-v18-logo-link.mjs`.
- WICHTIG: Formular/Badge sind live sichtbar, aber die Endpoints `senden.php`/`kontingent.php`
  existieren noch NICHT → Fallbacks greifen (statischer Kontingent-Satz; Formular-Absenden
  zeigt die ruhige Fehlermeldung mit Mail-Ausweichweg). Scharf erst mit dem All-Inkl-Umzug.

## Offen
- **Backlog aus /improve (auf Gabriels Wunsch gemerkt, auch im Claude-Memory):**
  1) toter Erstgespräch-CTA (braucht Entscheidung mailto vs. Formular), 2) Impressum/
  Datenschutz-Platzhalter füllen (braucht Gabriels Angaben), 3) LinkedIn-Profil-URL,
  4) og:image, 5) Seitengewicht (nach Umzug).
- Beispieltexte Fassung A/B in der Hauptseiten-Sektion = Platzhalter (Phase 6: durch
  Gabriels echte Probe ersetzen; Marker `PLATZHALTER Phase 6` im HTML).
- Datenschutz: Stilprobe-Abschnitt ist Entwurf (juristische Prüfung); Rest weiter Platzhalter.
- Astro-`site/`-INHALTE weiter älterer Stand als V18 (Marke ist seit heute angeglichen).
- PHP-Empfangsschicht + n8n-Werkstatt = separates Repo `stilprobe-automatik` (Konzept
  Phasen 0–4/6), noch nicht begonnen.

## Nächste Schritte
1. Repo `stilprobe-automatik` starten (Phase 0/1) — Zulieferungen aus Konzept §15.1;
   dann `senden.php`/`kontingent.php` bauen und per FTP in `…/stilprobe/` ablegen (macht das
   Live-Formular scharf). Vertrag: `docs/stilprobe/schnittstelle.md`.
2. Phase 6: echte Beispiel-Ausschnitte einsetzen, STILPROBE_MAIL/Domain (`jgc-lumen.de`) bestätigen.
3. Backlog-Punkte aus /improve angehen (siehe oben), sobald Gabriel die Zulieferungen gibt.

## Stolperfallen (unverändert wichtig)
- V18 = minifiziertes Single-File-HTML: nie direkt editieren/lesen; Transform-Skript
  mit Assertions (`scripts/stilprobe/transform-v18-stilprobe.mjs` als Vorbild).
- Browser-Pane rendert headless (visibilityState hidden, Viewport 0): Sichtbarkeit über
  is-visible-Klassen/CSS-Regeln prüfen, nicht über computed opacity; keine Screenshots.
- Badge-/Formular-Wortlaute und Feldnamen sind Vertrag: `docs/stilprobe/schnittstelle.md`.
