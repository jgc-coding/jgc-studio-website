# Projekt: JGC Lumen Website (jgc-studio-website)

**Prozess-Stufe: Produkt.** Die Seite ist öffentlich erreichbar, bewirbt kostenpflichtige Leistungen
und nimmt personenbezogene Daten entgegen — also volles Programm: CHANGELOG, Regressionscheck vor
größeren Sprüngen, `.claude/pruefen.txt` als Done-Gate.

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
- Deploy-Check: `gh run list --workflow=deploy.yml --limit 1` (Lauf dauert ~1,5–2 min). Der Step
  „Verify build artefacts" lässt den Deploy **laut scheitern**, wenn Root-/Galerie-/`main`-/`stilprobe`-/
  `og-bild`-Artefakt fehlt. `main` ist in keinem Worktree ausgecheckt → FF-Merge via `git branch -f main HEAD`.
- `scripts/site-noindex.mjs` stempelt danach `noindex, nofollow` auf alles unter `_site/variants/`
  und auf `_site/main/` — **indexierbar bleiben nur die Startseite und `/stilprobe/`.** Das muss im
  Deploy passieren: die Varianten 01–09 entstehen erst beim Build aus den `variant/*`-Branches und
  liegen als Datei nirgends im Repo; ein Skript auf den Quellen erreicht sie nicht.
- Danach läuft `scripts/pruefe-seiten.mjs` über `_site` und bricht den Deploy ab bei: Sprungmarke ohne
  Ziel, fehlendem Kontaktweg, `canonical` auf localhost, indexierbarer Seite, fehlender Pflicht-Meta,
  Reveal-Regel ohne `.js`-Schutz, Positions-Selektor, hartkodiertem Pfad. Ohne Argument prüft dasselbe
  Skript die Repo-Quellen (so hängt es in `.claude/pruefen.txt`) — die Sollwerte unterscheiden sich:
  im Repo muss die Manifest-Hauptseite indexierbar sein, im `_site` nur die Root.
- Das Vorschaubild (`og:image`) ist eine echte Datei: `assets/og-bild.jpg` → `/og-bild.jpg`. Neu bauen
  mit `node scripts/v18/baue-og-bild.mjs` (nimmt Hero und Sigel aus V18, braucht `site/node_modules`
  für `sharp`). Ein `data:`-URI funktioniert hier NICHT — LinkedIn und Co. holen das Bild per HTTP.

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
- **Viewport prüfen, BEVOR gemessen wird.** Ein neu geöffneter Preview-Tab meldet `0×0`; jede
  Breiten-/Höhen-/Abstandsmessung ist dann Müll (eine Fehlerbox wirkte so 2 px breit und 900 px hoch).
  Erst `resize_window` mit expliziter Breite/Höhe, dann `innerWidth` gegenprüfen. Im versteckten Pane
  laufen `requestAnimationFrame` und IntersectionObserver gar nicht → `is-visible` wird nie gesetzt,
  Reveal-Zustände sind dort grundsätzlich nicht prüfbar (`await` auf rAF hängt bis zum Timeout).
- **Regeln, die Inhalt verstecken, brauchen den `.js`-Vorsatz** (`.js .reveal:not(.is-visible)`).
  Ohne ihn ist die Seite ohne JavaScript leer. Gilt für V18 UND `stilprobe/index.html` — die
  Unterseite erbt das CSS aus V18, ein Fehler dort taucht also zweimal auf.
- **Sektions-Aussehen nie über die Position steuern** (`:nth-child(N of .bg-pergament)`): eine
  eingeschobene Sektion verschiebt still alle Farbflächen. Immer IDs. `pruefe-seiten.mjs` bewacht das.
- Windows: keine PS-Bulk-Replaces auf den HTML-Dateien (verstümmelt UTF-8). Edits via Tool oder Node.
- **`.gitattributes` / EOL:** Der Git-Index der minifizierten Varianten-HTMLs ist LF; `.gitattributes` hält
  sie als `text eol=lf`. NICHT auf `-text`/`binary` stellen — das würde die CRLF-Arbeitskopien wörtlich
  einchecken und die deployten Live-Bytes ändern. Vor EOL-/Attribut-Änderungen immer erst
  `git ls-files --eol` lesen; `git add --renormalize` nur mit Staging-Probelauf + Review, nie blind committen.
- **Interne Links absolut halten:** V18 wird an zwei Orten ausgeliefert (Root-Hauptseite UND
  `/variants/18-lumen/`). Ortsabhängige relative Links (`../…`) brechen an einem der beiden Orte →
  immer absolute `/jgc-studio-website/…`-Pfade verwenden.

## Konventionen
- Marken-/Palette-Tokens: `--color-tinte` #1F2A44, `--color-kupfer` #C97B3F, `--color-salbei` #8FA98A,
  `--color-holzsand` #D9C7A8, `--color-quellwasser` #6FA3B5, Pergament #FEFCF7.
- Standalone-Variante 13 (`13-lumen`) trägt eine `#skin-impeccable`-Override-Schicht (Impeccable-Skill).
- Commit-Messages für Varianten: `Variante NN: <was>` bzw. `Registry: Variante NN (…) auf GitHub Pages`.
