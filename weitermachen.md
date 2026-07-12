# Weitermachen — JGC Lumen Website

## Stand (Session 2026-07-12 — LIVE)
- **Stilprobe-Website-Teil ist live auf `main`** (Konzept v1.1 §5), FF-Merge + Deploy grün, end-to-end
  auf der echten Seite verifiziert. Tag `stilprobe-live-2026-07-12`, Rollback-Punkt davor: `4dff254`.
  - Hauptseite (V18): Sektion `#stilprobe`, Nav ×2, Hero-/Final-CTA, FAQ 02, Footer-Link.
  - Unterseite `stilprobe/index.html` → `/stilprobe/` (Formular, Klartext, Mini-FAQ, Warteliste/Pause).
  - Datenschutz-Abschnitt (Entwurf), `docs/stilprobe/` (Konzept, Graph, Schnittstellen-Vertrag).
- Zusätzlich live: /improve-Fixes (Marke „JGC Lumen" in Astro, `kontakt@jgc-lumen.de`, `.gitattributes`,
  README neu, Deploy-Verify-Step) + V18-Logo-Link-Fix (`../..` → absolut).
- Feedback-Runde Unterseite umgesetzt (verschlankt, „So läuft es.", 15-Proben erklärt, Stil-Kohärenz-Hinweis).

## Offen (unfertig / bewusst zurückgestellt)
- **Formular/Badge laufen live nur auf Fallbacks** — `senden.php`/`kontingent.php` existieren noch NICHT.
  Absenden zeigt die ruhige Fehlermeldung mit Mail-Ausweichweg; Badge zeigt den statischen Satz. Kein Bug.
- **/improve-Backlog (im Claude-Memory gemerkt, nicht umgesetzt):** ① toter „Erstgespräch"-CTA
  (`#kontakt` → sich selbst, KEIN echter Kontaktweg = größter Blocker), ② Impressum/Datenschutz-
  Platzhalter füllen, ③ LinkedIn-Footer-Link zeigt auf `linkedin.com`, ④ og:image, ⑤ Seitengewicht.
- Beispieltexte Fassung A/B in `#stilprobe` = Platzhalter (Marker `PLATZHALTER Phase 6` im V18-HTML).
- Astro-`site/`-INHALTE weiter älter als V18 (nur Marke angeglichen). Node-20-Deprecation-Warnung im Deploy.

## Nächste Schritte
1. Repo `stilprobe-automatik` starten (Konzept Phase 0/1, Zulieferungen §15.1): `senden.php`/`kontingent.php`
   bauen + per FTP nach `…/stilprobe/` → macht Formular/Badge scharf. Vertrag: `docs/stilprobe/schnittstelle.md`.
2. Phase 6: echte Beispieltexte einsetzen; Domain `jgc-lumen.de` + Postfach `stilprobe@` bestätigen.
3. /improve-Backlog angehen — mit ① (Erstgespräch-CTA) beginnen, sobald Gabriel mailto vs. Formular entscheidet.

## Stolperfallen (sofort wichtig)
- V18 = minifiziertes Single-File-HTML: nie direkt editieren; assertion-guardetes Transform-Skript
  (Vorbilder in `scripts/stilprobe/`). Interne Links absolut (`/jgc-studio-website/…`), nie relativ.
- `.gitattributes`: Varianten-HTMLs stehen als `text eol=lf` — NICHT auf `-text`/`binary` (siehe CLAUDE.md).
- Deploy = Push auf `main` (triggert Action, ~1–2 min; `main` in keinem Worktree → `git branch -f main HEAD`).
- Preview headless: Sichtbarkeit über `is-visible`-Klassen prüfen, nicht computed opacity; keine Screenshots.
- Formular-/Badge-Wortlaute + Feldnamen = Vertrag: `docs/stilprobe/schnittstelle.md`.
