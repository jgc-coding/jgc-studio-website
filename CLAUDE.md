# Projekt: JGC Lumen Website (jgc-studio-website)

**Prozess-Stufe: Produkt.** Die Seite ist öffentlich erreichbar, bewirbt kostenpflichtige Leistungen
und nimmt personenbezogene Daten entgegen — also volles Programm: CHANGELOG, Regressionscheck vor
größeren Sprüngen, `.claude/pruefen.txt` als Done-Gate.

Sales-Page für **JGC Lumen** (KI-Implementierung für Coaches/Trainer/Mentoren, Freiburg/DACH).
Marke seit Variante 13 **JGC Lumen** (vorher „JGC Studio"); Repo heißt weiter `jgc-studio-website`.

## Aufbau
- `site/` — Astro-Quelle, deployt nach `/main/`. **Nicht der beschlossene Stand:** inhaltlich zwei
  Generationen hinter Variante 18 und deshalb im Deploy auf `noindex`. Die Live-Seite ist V18.
- `variants/standalone/<slug>/index.html` — eingefrorene Design-Varianten als **self-contained Single-File-HTML**
  (minifiziert, alle Assets als Inline-base64: Fraunces-Font ~566 KB, Hero-Bild ~322 KB).
- `variants/standalone/manifest.json` + `VARIANTS.md` — Register aller Standalone-Varianten.
- `inhalt/lumen-inhalt.md` — **der Text der Live-Seite in lesbarer Form**, erzeugt aus V18 von
  `scripts/v18/extrahiere-inhalt.mjs`. Nie von Hand pflegen, sondern nach jeder V18-Textänderung neu
  erzeugen. Existiert, weil der Inhalt sonst nur im 1,2-MB-Minifikat steht und für neue Varianten,
  Korrekturlesen oder Textarbeit nicht zugänglich ist.
- `der-weg/` — **zweite Fassung der Seite als Scroll-Reise** (Kamerafahrt durch eine
  Papierwelt, 7 Videoetappen, ~52 MB). Eigenständige Unterseite wie `stilprobe/`, keine
  Standalone-Variante — steht deshalb nicht im Manifest. Werkzeuge in `scripts/der-weg/`,
  Rohvideos außerhalb des Repos. **Details und Austauschweg: `docs/der-weg.md`.**
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
- Mailadressen: `kontakt@jgc-lumen.de` (Impressum, Erstgespräch-CTA) empfängt bestätigt. Ob das Postfach
  `stilprobe@jgc-lumen.de` existiert, ist ungeprüft — es steht als const in den Inline-Scripts. Die Domain
  selbst ist registriert und zeigt auf All-Inkl, liefert über HTTP aber nur eine Parkseite ohne HTTPS.
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
  Variante. Für eine Variante oder die Scroll-Reise: `node scripts/der-weg/server.mjs` (launch.json
  `der-weg`, Port 4330, liefert die ganze Projektwurzel und schneidet das `/jgc-studio-website`-Präfix
  weg). Die Scroll-Reise braucht ihn zwingend: unter `file://` verbietet der Browser das Laden der
  Clips, die Seite bleibt leer.
- **Preview-Messungen: der Pane gilt als versteckt.** Screenshots hängen auf den 1-MB-Seiten; prüfe
  stattdessen per JavaScript (DOM-Geometrie, `getComputedStyle`). Drei Fallen, die alle schon
  Fehlbefunde erzeugt haben:
  (1) **Erst Viewport setzen, dann messen** — ein frisch geöffneter Tab meldet `0×0`, jede Geometrie
  ist dann Müll (eine Fehlerbox wirkte so 2 px breit und 900 px hoch). `resize_window` mit expliziter
  Breite/Höhe, danach `innerWidth` gegenprüfen.
  (2) Bei `document.visibilityState === 'hidden'` laufen `requestAnimationFrame`, IntersectionObserver
  und Animationen **gar nicht** → `is-visible` wird nie gesetzt, Reveal-Zustände sind dort grundsätzlich
  nicht prüfbar, und ein `await` auf rAF hängt bis zum Timeout. Solche Aussagen dann statisch belegen.
  Auch **Scroll-Ereignisse werden nicht zugestellt** (gemessen: null bei `window.scrollTo`) — Position
  setzen und `dispatchEvent(new Event('scroll'))` bzw. `resize` selbst auslösen. Und: Code mit dem
  üblichen rAF-Riegel (`if (!ticking) { ticking = true; requestAnimationFrame(…) }`) verklemmt sich
  dort beim ERSTEN Ereignis dauerhaft. Zum Testen `window.requestAnimationFrame` vorher auf synchron
  umbiegen, dann läuft der echte Code-Pfad statt einer Nachbildung.
  (3) **CSS-Übergänge frieren im versteckten Pane am STARTWERT ein.** Eine Eigenschaft mit
  `transition` misst sich als ihr Ausgangswert — eine Knopffläche als `rgba(0,0,0,0)` statt der
  Zielfarbe — und selbst inline gesetzte Werte scheinen ignoriert (die eingefrorene Transition
  überdeckt sie). Vor Farb-/Zustandsmessungen `element.style.transition='none'` setzen, danach
  zurücksetzen. So entstand am 27.07. der Schein-Befund „Nav-Reiter transparent".
- **Headless Chrome misst hier falsch, wenn man nicht nachrechnet.** `--window-size` ist nicht der
  CSS-Viewport: es gehen 26 px Breite und 156 px Höhe für das Fensterwerk ab, und unter **526 CSS-px
  Breite klemmt Chrome auf ein Minimum** — ein angefordertes 393er Handyfenster rendert als 526 px
  und schneidet Text ab, der real passt. Vor jedem Beweisbild einmal mit einer Mess-Seite
  (`innerWidth` ins DOM schreiben, `--dump-dom`) gegenprüfen. Für echte Handybreiten taugt der Weg
  nicht — dort nur DOM-Geometrie messen.
- **Hochkant-Layouts in `svh` rechnen, nicht in `vh` oder `%`.** Chrome auf Android misst
  `position: fixed` am GROSSEN Fenster (ohne Adressleiste); steht die Leiste, liegen rund 110 px
  davon unter dem sichtbaren Rand, und alles, was dort unten verankert ist, wird abgeschnitten.
  `dvh` ist die falsche Abhilfe — es skaliert bei jedem Ein-/Ausfahren neu und lässt Bildbänder
  zucken. Fallback für alte Browser über `@supports (height: 100svh)`.
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
  Für echte Binärdateien gilt das Gegenteil: `*.mp4 binary` steht drin, weil `text=auto` sonst je Datei
  rät und ein falsch eingestuftes Video beim Auschecken zeilenweise umgeschrieben und damit zerstört wird.
- **Interne Links absolut halten:** V18 wird an zwei Orten ausgeliefert (Root-Hauptseite UND
  `/variants/18-lumen/`). Ortsabhängige relative Links (`../…`) brechen an einem der beiden Orte →
  immer absolute `/jgc-studio-website/…`-Pfade verwenden.

## Konventionen
- Marken-/Palette-Tokens: `--color-tinte` #1F2A44, `--color-kupfer` #C97B3F, `--color-salbei` #8FA98A,
  `--color-holzsand` #D9C7A8, `--color-quellwasser` #6FA3B5, Pergament #FEFCF7.
- Standalone-Variante 13 (`13-lumen`) trägt eine `#skin-impeccable`-Override-Schicht (Impeccable-Skill).
- Commit-Messages für Varianten: `Variante NN: <was>` bzw. `Registry: Variante NN (…) auf GitHub Pages`.
