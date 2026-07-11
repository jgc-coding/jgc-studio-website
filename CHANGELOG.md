# Changelog

Wird ab 2026-07-11 geführt (Repo bestand vorher ohne Changelog; Historie siehe Git-Log).

## 2026-07-11 — Quick-Wins aus der /improve-Analyse (Punkte 5–9)

- Astro-Unterseiten (`/main/`): Marke „JGC Studio" → „JGC Lumen" (Nav-Wortmarke, Footer, Titel/Descriptions von Impressum und Datenschutz) — behebt den Markenbruch beim Klick von der Lumen-Hauptseite auf die Rechtsseiten.
- Kontaktadresse überall `kontakt@jgc-lumen.de` statt `kontakt@jgc-handwerk.de` (Impressum, Datenschutz). Achtung: Postfach existiert erst mit der jgc-lumen.de-Domain — bewusste Vorab-Umstellung auf Gabriels Anweisung.
- `.gitattributes` neu (`* text=auto eol=lf`; Varianten-HTMLs explizit `text eol=lf`). Befund: Der Index war historisch bereits vollständig LF — keine Renormalisierung nötig, kein Byte der Live-Varianten geändert.
- README.md neu geschrieben: reale GitHub-Pages-Deploy-Struktur (`/main/`, `/variants/`, `/galerie/`, Root-Hauptseite, `/stilprobe/`) statt des veralteten Vercel-Hinweises.
- Deploy-Workflow: neuer Step „Verify build artefacts" — fehlt eines der Kernartefakte (Root-Index, Galerie, `/main/`, `/stilprobe/`), bricht der Deploy laut ab.
- Zurückgestellt auf Gabriels Wunsch (Backlog): toter Erstgespräch-CTA, Impressum-/Datenschutz-Platzhalter füllen, LinkedIn-Profil-Link, og:image, Seitengewicht-Optimierung.

## 2026-07-11 — Stilprobe-Integration, Website-Teil (Konzept v1.1, Abschnitt 5)

- Hauptseite (Live-Variante 18): neue Sektion `#stilprobe` (Vergleich Fassung A/B mit Phase-6-Platzhaltertexten, CTA, dynamische Kontingent-Zeile mit statischem Fallback) zwischen „Deine Woche, zwei Versionen" und „So gehen wir gemeinsam vor"; Nav-Eintrag „Stilprobe" (Desktop + mobil, erster Eintrag); Hero-Sekundär-CTA jetzt „Die Stilprobe ansehen"; neue FAQ 02 „Was ist die Stilprobe?" (Nummern 02–10 → 03–11 verschoben); Brückensatz in FAQ 01; Sekundärzeile „oder starte mit der Stilprobe →" im Final-CTA; Footer-Link. Umgesetzt über `scripts/stilprobe/transform-v18-stilprobe.mjs` (assertion-guarded).
- Neue Unterseite `stilprobe/index.html` → deployt nach `/stilprobe/`: Erklärung, drei Schritte, Klartext-Absatz (US-Transparenz), Formular (Name, E-Mail, 3 Texte à 200–6.000 Zeichen mit Zeichenzähler, Wunschthema, Quelle, 2 Bestätigungen, Honeypot, Zeitstempel), Wartelisten- und Pause-Zustand über `kontingent.php`, Mini-FAQ, leiser Abschluss. Design 1:1 aus V18 extrahiert (`scripts/stilprobe/extract-v18-assets.mjs`).
- Deploy-Workflow: neuer Step kopiert `stilprobe/index.html` nach `_site/stilprobe/`.
- Datenschutzseite (Astro, `/main/datenschutz/`): neuer Abschnitt „Die Stilprobe" (Zweck, Einwilligung Art. 6 Abs. 1 lit. a DSGVO, Auftragsverarbeiter All-Inkl/Anthropic/Telegram, 30-Tage-Löschung, Betroffenenrechte, kein Tracking) — Entwurf, juristische Prüfung offen.
- Bugfix: Footer-Links Impressum/Datenschutz der Hauptseite zeigten von der Root-Kopie aus ins Leere (`../../main/…`); jetzt absolute Pfade `/jgc-studio-website/main/…`.
- Doku: `docs/stilprobe/` (Konzept v1.1, Knoten-Graph, Schnittstellen-Vertrag Website ↔ PHP-Empfangsschicht).
- Hinweis: Formular und Kontingent-Badge laufen bewusst gegen noch nicht existierende Endpoints (Fallbacks greifen); scharf wird beides erst mit dem All-Inkl-Umzug (`senden.php`/`kontingent.php` aus dem separaten Repo `stilprobe-automatik`).
