# Changelog

Wird ab 2026-07-11 geführt (Repo bestand vorher ohne Changelog; Historie siehe Git-Log).

## 2026-07-14 — Über-mich-Foto: echtes Halbfigur-Portrait

- Sektion „Wer mit dir arbeitet" (Live-Variante 18): Platzhalter-Portrait durch das echte Halbfigur-Foto (3:4) ersetzt. Slot von 208 px auf 270 px vergrößert, `border-radius` 6→8 px; zentriertes Layout unverändert. Auswahl von Gabriel nach Mockup-Vergleich mehrerer Zuschnitte, Formate und Größen (Achsen Größe/Platzierung und Zuschnitt/Form).
- Bild mit `sharp` optimiert: 720×960 webp, 40,5 KB (data-URI 54 KB) — rund 8,5 KB leichter als das alte eingebettete Foto, die Seite wird also minimal leichter statt schwerer.
- Quelldateien versioniert unter `Bildmaterial/Profilbild/`: `profil-halbfigur.webp` (Original-Upload 1086×1448) und `profil-halbfigur-web.webp` (eingebettete Web-Fassung).
- Umgesetzt über ein assertion-guardetes Node-Transform (genau 1 Treffer erzwungen, alte Foto-URI/Maße nachweislich entfernt); Datei bleibt reines LF, Diff auf die eine minifizierte Zeile beschränkt.

## 2026-07-12 — TÜV-Siegel verlinkt + Express-Passus in die Schritt-2-Spalte

- Das TÜV-Prüfsiegel (Sektion „Wer mit dir arbeitet") ist jetzt klickbar und öffnet die offizielle Certipedia-Prüfseite des TÜV Rheinland (Prüfzeichen-ID 0217466495) in einem neuen Tab (`target="_blank"`, `rel="noopener noreferrer"`).
- Angebotsstruktur: Der separate Nachtrag „Du weißt schon genau, was du willst?" unter dem Spalten-Grid ist in die Schritt-2-Spalte (KI-Praxis-Check) integriert — als kompakter Express-Passus mit feiner Trennlinie am Spaltenende, Text aufs Spaltenmaß gekürzt. Der Anrechnungs-Hinweis wandert aus dem „Was du bekommst"-Aufklapper ans Spaltenende und steht nur noch einmal in der Spalte, ergänzt um „— der Check kostet dich dann nichts extra". Spaltenhöhen Schritt 2/Schritt 3 im Desktop-Layout jetzt praktisch gleich (1126 px vs. 1125 px, im Browser gemessen).
- Umgesetzt über `scripts/v18/transform-tuvlink-schritt2.mjs` (assertion-guarded, idempotent; neuer Ordner `scripts/v18/`, Zieldatei-Pfad relativ zum Skript statt absolut hardcodet).

## 2026-07-12 — Homepage-Navigation-Fix vor dem Live-Gang

- V18-Logo-Link (Marke/„zurück zum Anfang") von relativ `../../` auf absolut `/jgc-studio-website/` umgestellt. Der relative Pfad war korrekt am Galerie-Standort `/variants/18-lumen/`, zeigte aber von der Root-Hauptseite aus auf das GitHub-Konto-Wurzelverzeichnis (weg von der Seite). Der absolute Pfad stimmt an beiden Standorten. Damit enthält V18 keinen einzigen ortsabhängigen relativen Link mehr (gleiche Fix-Klasse wie zuvor die Footer-Rechtslinks). Umgesetzt über `scripts/stilprobe/fix-v18-logo-link.mjs` (assertion-guarded).

## 2026-07-12 — Stilprobe-Unterseite: Feedback-Runde Gabriel

- Vor-Formular-Strecke verschlankt: Kopf-Absatz gekürzt, die drei Ablauf-Karten durch eine kompakte nummerierte Liste ersetzt, Klartext-Kasten gestrafft (alle Rechts-Anker — US-Hinweis, Standardvertragsklauseln, 30-Tage-Löschung, Klienten-Leitplanke — unverändert enthalten), Abstände reduziert.
- Überschrift „Drei ruhige Schritte." → „So läuft es." (Eyebrow „Der Ablauf").
- Neue Einordnungszeile unter dem Ablauf: Die Probe arbeitet mit drei Texten; in der richtigen Zusammenarbeit fließt deutlich mehr Material ein und die Handschrift wird feiner getroffen.
- Kontingent präzisiert (FAQ 01): 15 Proben im Monat gelten insgesamt über alle Anfragen, nicht je Person; je Coach eine Probe.
- Stil-Kohärenz-Hinweis: sichtbarer Absatz über den drei Textfeldern + FAQ 04 („drei Texte aus derselben Tonlage, sonst Mischstimme"); die drei wiederholten Feld-Hilfetexte entsprechend auf „Bitte einfügen statt verlinken." gekürzt.

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
