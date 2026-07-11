# Projekt: JGC Lumen Website (jgc-studio-website)

Sales-Page für **JGC Lumen** (KI-Implementierung für Coaches/Trainer/Mentoren, Freiburg/DACH).
Marke seit Variante 13 **JGC Lumen** (vorher „JGC Studio"); Repo heißt weiter `jgc-studio-website`.

## Aufbau
- `site/` — Astro-Hauptseite (die „aktuell beschlossene" Version), Quelle in `site/src/`.
- `variants/standalone/<slug>/index.html` — eingefrorene Design-Varianten als **self-contained Single-File-HTML**
  (minifiziert, alle Assets als Inline-base64: Fraunces-Font ~566 KB, Hero-Bild ~322 KB).
- `variants/standalone/manifest.json` + `VARIANTS.md` — Register aller Standalone-Varianten.
- `scripts/generate-gallery.mjs` — baut die Galerie-Startseite.
- `stilprobe/index.html` — eigenständige Unterseite „Die Stilprobe" (lesbares Single-File-HTML im V18-Design,
  Fonts/Logos inline aus V18 extrahiert), wird vom Deploy nach `/stilprobe/` kopiert.
- `scripts/stilprobe/` — `transform-v18-stilprobe.mjs` (assertion-guardeter V18-Umbau, ausführbare Änderungsdoku)
  und `extract-v18-assets.mjs` (zieht CSS/Fonts/Logos aus V18 für die Unterseite).
- `docs/stilprobe/` — Stilprobe-Konzept v1.1, Knoten-Graph, `schnittstelle.md` (Formular-/Badge-Vertrag für die
  spätere PHP-Empfangsschicht aus dem separaten Repo `stilprobe-automatik`).

## Stilprobe (Besonderheiten)
- Formular (`senden.php`) und Kontingent-Badge (`kontingent.php`) zeigen auf Endpoints, die erst mit dem
  All-Inkl-Umzug existieren — bis dahin greifen by design die Fallbacks (statischer Kontingent-Satz,
  Fehlermeldung mit Mail-Ausweichweg). Feldnamen/JSON-Vertrag nicht ändern ohne `docs/stilprobe/schnittstelle.md`.
- `stilprobe@jgc-lumen.de` ist Platzhalter (Domain unbestätigt), definiert als const in den Inline-Scripts.
- Interne Links tragen den GitHub-Pages-Präfix `/jgc-studio-website/…`; beim All-Inkl-Umzug per Suchen-Ersetzen
  auf `/` umstellen (Checkliste in `docs/stilprobe/schnittstelle.md`).
- Beispiel-Ausschnitte in der `#stilprobe`-Sektion der Hauptseite sind Platzhalter (Kommentar `PLATZHALTER
  Phase 6`) — vor Scharfschaltung durch Ausschnitte aus Gabriels eigener Probe ersetzen.

## Build / Deploy
- Push auf `main` → GitHub Action (`.github/workflows/deploy.yml`) baut `site/`, kopiert alle
  `variants/standalone/*/index.html` nach `/variants/<slug>/`, generiert die Galerie nach `/galerie/`
  (`scripts/generate-gallery.mjs`) und kopiert die als Hauptseite markierte Variante als Root-`index.html`
  (`scripts/copy-homepage.mjs`) → GitHub Pages.
- Welche Variante die **Hauptseite** ist, steht als Single Source of Truth im Manifest
  (`variants/standalone/manifest.json`, Feld `"homepage": true`) — aktuell `18-lumen`.
- Live: `https://jgc-coding.github.io/jgc-studio-website/` (**Hauptseiten-Variante**),
  Galerie unter `…/galerie/`, einzelne Varianten unter `…/variants/<slug>/`.
- JGC reviewt Design-Optionen auf der **Live-Galerie** (`…/galerie/`) → fertige Standalone-Varianten direkt nach `main` pushen.
- Deploy-Check: `gh run list --workflow=deploy.yml --limit 1` (Lauf dauert ~1,5–2 min).

## Neue Standalone-Variante anlegen
1. `variants/standalone/<NN-slug>/index.html` anlegen (meist Kopie einer bestehenden Variante).
2. Eintrag in `variants/standalone/manifest.json` (num, label, ggf. skill, source).
3. Zeile in `VARIANTS.md` ergänzen.

## Stolperfallen (wichtig!)
- **Minifizierte Single-File-HTML nicht direkt editieren/lesen.** Die Inline-base64-Blobs sprengen
  Read/Edit. Vorgehen: base64 per Regex (`data:[…];base64,[A-Za-z0-9+/=]+`) zu Platzhaltern strippen →
  Lesekopie; Änderungen über ein **assertion-guardetes Node-Transform-Skript** (jede Ersetzung mit
  erwarteter Trefferzahl prüfen, sonst werfen). Datei-I/O explizit UTF-8.
- **Preview:** `npm run dev` (launch.json `jgc-site`) serviert die Astro-`site/`, NICHT die Standalone-
  Variante. Für eine Variante: kleiner Node-Static-Server (kein `serve`/Python im Sandbox vorhanden)
  auf eigenem Port, in `.claude/launch.json` als zweite Config; danach wieder entfernen.
- **Preview-Screenshot** hängt/timeoutet auf den schweren 1-MB-Variantenseiten; CSS-/SMIL-Animationen
  pausieren zudem bei `document.visibilityState === 'hidden'`. → Verifikation über `preview_eval`
  (DOM-Geometrie, `getComputedStyle`, `getAnimations().finish()`) statt Screenshot.
- Windows: keine PS-Bulk-Replaces auf den HTML-Dateien (verstümmelt UTF-8). Edits via Tool oder Node.

## Konventionen
- Marken-/Palette-Tokens: `--color-tinte` #1F2A44, `--color-kupfer` #C97B3F, `--color-salbei` #8FA98A,
  `--color-holzsand` #D9C7A8, `--color-quellwasser` #6FA3B5, Pergament #FEFCF7.
- Standalone-Variante 13 (`13-lumen`) trägt eine `#skin-impeccable`-Override-Schicht (Impeccable-Skill).
- Commit-Messages für Varianten: `Variante NN: <was>` bzw. `Registry: Variante NN (…) auf GitHub Pages`.
