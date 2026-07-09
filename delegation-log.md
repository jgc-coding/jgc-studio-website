# Delegation-Log

Session 2026-07-09: Wunsch-Klienten-Passage in V18 + V18 als Hauptseite (Orchestrator: fable, Worker: opus)

| Zeit | Paket | Worker-Modell | Verifikation (bestanden/Rework) | Rework-Anzahl |
|------|-------|---------------|--------------------------------|---------------|
| 2026-07-09 | Paket 1: V18-Inhalt (Wunsch-Klienten-Block, FAQ 02, URL-Fix) | opus | bestanden nach 1 Rework (Ursache: Orchestrator-Briefing nutzte `border-l-2`, das eine Skin-Regel `#angebote .border-l-2` überschreibt; Fix: Kupferlinie als Inline-Style). Verifiziert: Struktur-Checks + Browser-Render (Computed Styles, FAQ 01–10, Reveal, Regression Anrechnung-Callout). | 1 |
| 2026-07-09 | Paket 2: Deploy-Umbau (Root=Hauptseite, Galerie→/galerie/) | opus | bestanden ohne Rework. Verifiziert: Diff-Review aller 5 Dateien + eigener End-to-End-Fixture-Test (Galerie nach /galerie/ mit Badge, copy-homepage kopiert V18 an Root, Fehlerfall exit 1). | 0 |
