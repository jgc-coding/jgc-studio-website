# Projekt: JGC Lumen Website (jgc-studio-website)

**Prozess-Stufe: Produkt.** Die Seite ist öffentlich erreichbar, bewirbt kostenpflichtige Leistungen
und nimmt personenbezogene Daten entgegen — also volles Programm: CHANGELOG, Regressionscheck vor
größeren Sprüngen, `.claude/pruefen.txt` als Done-Gate.

Sales-Page für **JGC Lumen** (KI-Implementierung für Coaches/Trainer/Mentoren, Freiburg/DACH).
Marke seit Variante 13 **JGC Lumen** (vorher „JGC Studio"); Repo heißt weiter `jgc-studio-website`.
Seit 02.09.2026 ist die Scroll-Reise die einzige öffentliche Fassung, Adresse `https://jgc-lumen.de/`
(GitHub Pages mit eigener Domain).

## Aufbau
- `der-weg/` — **die Seite**: Scroll-Reise (Kamerafahrt durch eine Papierwelt, 7 Videoetappen,
  ~46 MB). Wird im Deploy komplett an die Wurzel kopiert (`/`, `/assets/`, drei Skripte). Nimmt
  Stilprobe- und Erstgespräch-Anfragen selbst entgegen (`formulare.js`). Werkzeuge in
  `scripts/der-weg/`, Rohvideos außerhalb des Repos. **Details und Austauschweg: `docs/der-weg.md`.**
- `stilprobe/index.html` — Unterseite „Die Stilprobe" (Single-File-HTML im V18-Design, Fonts/Logos
  inline), deployt nach `/stilprobe/`. Änderungen nur per Transform-Skript in `scripts/stilprobe/`.
- `impressum/`, `datenschutz/` — Rechtsseiten als schlichte HTML-Seiten im Design der Reise, gemeinsames
  Stylesheet `der-weg/assets/rechtliches.css`, deployt nach `/impressum/` und `/datenschutz/`.
- `deploy/der-weg-weiterleitung.html` — landet als `/der-weg/index.html` und leitet auf `/` um; der
  alte Link der Reise wurde verschickt.
- `scripts/deploy/baue-site.mjs` — setzt `_site/` zusammen (siehe Build / Deploy); `_site/` ist ignoriert.
- `docs/stilprobe/`, `docs/erstgespraech/` — Konzepte und `schnittstelle.md` (Formular-/Badge-Verträge
  für die spätere PHP-Empfangsschicht aus dem separaten Repo `stilprobe-automatik`).
- **Archiv — wird nicht mehr ausgeliefert, bleibt aber im Repo (Gabriels Wunsch: Vergleich und Fundus):**
  `variants/standalone/<slug>/` (eingefrorene Single-File-Varianten; V18 war bis 02.09.2026 die
  Lesefassung; Register `manifest.json` + `VARIANTS.md`), `site/` (alte Astro-Quelle), `inhalt/lumen-inhalt.md`
  (Text von V18, erzeugt von `scripts/v18/extrahiere-inhalt.mjs`), die neun `variant/*`-Branches und die
  Skripte `generate-gallery`, `copy-homepage`, `site-noindex`, `varianten-noindex` — sie laufen nirgends
  mehr. Nichts davon löschen ohne Gabriels Ok.

## Formulare (Besonderheiten)
- Drei Strecken zeigen auf Endpoints, die GitHub Pages nicht ausführen kann (kein PHP): Stilprobe-Formular
  (`/stilprobe/senden.php`), Kontingent-Badge (`/stilprobe/kontingent.php`), Erstgespräch
  (`/erstgespraech/senden.php`). Bis zum Umzug auf einen PHP-Host (All-Inkl) greifen by design die
  Fallbacks (statischer Kontingent-Satz, Fehlermeldung mit Mail-Ausweichweg). Feldnamen/JSON-Verträge
  nicht ändern ohne die `schnittstelle.md`-Dateien.
- Mailadressen: `kontakt@jgc-lumen.de` empfängt bestätigt. Ob das Postfach `stilprobe@jgc-lumen.de`
  existiert, ist ungeprüft — es steht als const in `der-weg/formulare.js` und im Inline-Script der Stilprobe.
- **Interne Links sind wurzel-relativ** (`/stilprobe/`, `/impressum/`), die Assets der Reise relativ
  (`assets/…`), weil ihr Ordner mit an die Wurzel zieht. Der alte GitHub-Präfix `/jgc-studio-website/`
  darf nirgends mehr stehen — `pruefe-seiten.mjs` bricht sonst ab und prüft jeden internen Link auf
  eine Ziel-Datei.
- **Die Domain hat eine Quelle:** den `canonical` der Reise. `baue-site.mjs` (robots.txt, Sitemap) und
  `pruefe-seiten.mjs` (Soll-canonicals) leiten sie daraus ab. Bei einem Domainwechsel die Köpfe der vier
  Seiten und das JSON-LD der Reise ändern, sonst nichts.

## Build / Deploy
- Push auf `main` → GitHub Action (`.github/workflows/deploy.yml`): `node scripts/deploy/baue-site.mjs _site`
  (Reise an die Wurzel, Stilprobe, Rechtsseiten, Vorschaubild, Weiterleitung, `robots.txt` + `sitemap.xml`
  aus den indexierbaren Seiten), dann `node scripts/pruefe-seiten.mjs _site` → GitHub Pages. Kein npm,
  kein Astro. Lauf ~1 min, Check: `gh run list --workflow=deploy.yml --limit 1`. `main` ist in keinem
  Worktree ausgecheckt → `git branch -f main HEAD`.
- **Domain:** `jgc-lumen.de` steht in den Pages-Einstellungen des Repos (`gh api repos/jgc-coding/jgc-studio-website/pages`),
  DNS liegt bei All-Inkl (A/AAAA auf GitHub Pages, `www` als CNAME auf `jgc-coding.github.io`). GitHub
  leitet `www` und die alte Adresse `jgc-coding.github.io/jgc-studio-website/` auf die Domain um.
  Die Mail-Einträge der Domain (MX, SPF, DKIM, DMARC) und der Wildcard-Eintrag `*` bleiben bei
  All-Inkl — nie anfassen, sonst bricht das Postfach.
- **Zertifikat deckt nur ab, was beim Ausstellen im DNS stand.** Kommt `www` später dazu, stellt GitHub
  von sich aus KEIN neues aus, und die Domain aus- und wieder einzutragen genügt nicht. Was wirkt: kurz
  `www.<domain>` als Custom Domain setzen, sofort zurück auf die Hauptadresse — der Antrag über beide
  Namen bleibt bestehen. **Dabei fällt `https_enforced` auf false**; nach `state: approved` wieder mit
  `gh api -X PUT …/pages -F https_enforced=true` setzen.
- `pruefe-seiten.mjs` bricht ab bei: Sprungmarke ohne Ziel, fehlendem Kontaktweg, `canonical` auf localhost
  oder abweichend von der Soll-Adresse, `noindex` auf einer echten Seite (nur die Weiterleitung trägt es),
  fehlender Pflicht-Meta, Reveal-Regel ohne `.js`-Schutz, Positions-Selektor, altem GitHub-Präfix, internem
  Link ohne Ziel-Datei, hartkodiertem Pfad; im `_site` zusätzlich Sitemap und robots.txt. Ohne Argument
  prüft es die Repo-Quellen (so hängt es in `.claude/pruefen.txt`).
- Das Vorschaubild (`og:image`) ist eine echte Datei: `assets/og-bild.jpg` → `/og-bild.jpg`. Neu bauen mit
  `node scripts/v18/baue-og-bild.mjs` (nimmt Hero und Sigel aus V18). Ein `data:`-URI funktioniert hier
  NICHT — LinkedIn und Co. holen das Bild per HTTP.
- Favicon aus dem Sigel: `node scripts/der-weg/baue-favicon.mjs` (aus `Logo/JGC Studio Logo final.svg`),
  die Stilprobe bekommt es per `scripts/stilprobe/setze-favicon.mjs`. Beide Bild-Skripte brauchen `sharp`
  aus `site/node_modules` (`cd site && npm ci`).
- Profilbild fürs Google-Unternehmensprofil (Logo-Feld, 1080 × 1080, vier Fassungen):
  `node scripts/google-profil/baue-profilbild.mjs` → `Bildmaterial/Google-Unternehmensprofil/`. Setzt Sigel,
  Fraunces und Farb-Tokens aus dem Repo per Chrome headless und prüft per Pixel, dass der Inhalt im runden
  Google-Beschnitt bleibt. Braucht `sharp` und Chrome unter dem Standardpfad (sonst Umgebungsvariable `CHROME`).

## Stolperfallen (wichtig!)
- **Minifizierte Single-File-HTML nicht direkt editieren/lesen** (Stilprobe, Archiv-Varianten). Die
  Inline-base64-Blobs sprengen Read/Edit. Vorgehen: base64 per Regex (`data:[…];base64,[A-Za-z0-9+/=]+`)
  zu Platzhaltern strippen → Lesekopie; Änderungen über ein **assertion-guardetes Node-Transform-Skript**
  (jede Ersetzung mit erwarteter Trefferzahl prüfen, sonst werfen). Datei-I/O explizit UTF-8.
- **Preview:** `node scripts/der-weg/server.mjs` (launch.json `der-weg`, Port 4330) liefert die
  Projektwurzel und löst Anfragen erst dort, dann in `der-weg/` auf — die Reise liegt damit wie live unter
  `/`, ihre Assets unter `/assets/`, die Rechtsseiten unter `/impressum/`, die Archiv-Varianten unter
  `/variants/standalone/<slug>/`. Das echte Deploy-Ergebnis: `node scripts/deploy/baue-site.mjs _site`,
  dann `node scripts/der-weg/server.mjs 4331 _site` (launch.json `site-vorschau`). Die Reise braucht
  zwingend einen Server: unter `file://` verbietet der Browser das Laden der Clips, die Seite bleibt leer.
  `npm run dev` (`jgc-site`) startet nur die archivierte Astro-Quelle.
- **Preview-Messungen: der Pane meldet sich als versteckt** (`visibilityState === 'hidden'`).
  Screenshots gelingen trotzdem (nachgeprüft 29.08.2026), taugen aber nur für Standbilder; jeder
  Beweis über Maße und Zustände läuft über JavaScript (DOM-Geometrie, `getComputedStyle`).
  Drei Fallen, jede hat schon einen Fehlbefund erzeugt:
  (1) **Erst Viewport setzen, dann messen** — ein frischer Tab meldet `0×0`, jede Geometrie ist
  dann Müll. `resize_window` mit expliziter Breite/Höhe, `innerWidth` gegenprüfen. **Danach
  `resize` selbst auslösen:** die Engine rechnet ihre Bahnhöhe nur in `layout()` und schreibt sie
  als festen Pixelwert — sonst misst man die Bahn des ALTEN Fensters.
  (2) Bei `visibilityState === 'hidden'` laufen `requestAnimationFrame`, IntersectionObserver und
  Animationen **gar nicht**, und Scroll-Ereignisse werden nicht zugestellt: Reveal-Zustände sind
  dort grundsätzlich nicht prüfbar (statisch belegen), ein `await` auf rAF hängt bis zum Timeout,
  Position setzen und `scroll`/`resize` selbst dispatchen. Der übliche rAF-Riegel
  (`if (!ticking) { ticking = true; … }`) verklemmt sich beim ERSTEN Ereignis dauerhaft — zum
  Testen `requestAnimationFrame` auf synchron umbiegen, damit der echte Code-Pfad läuft. Der
  Ersatz muss **Wiedereintritt verweigern**, sonst reißt die selbst-nachbestellende rAF-Schleife
  der Engine sofort den Aufrufstapel ein.
  (3) **CSS-Übergänge frieren am STARTWERT ein** — eine Fläche mit `transition` misst sich als
  ihr Ausgangswert (`rgba(0,0,0,0)` statt Zielfarbe), und selbst inline gesetzte Werte scheinen
  ignoriert. Vor jeder Farb-/Zustandsmessung `element.style.transition='none'` setzen, danach
  zurücksetzen — ohne Ausnahme: dieselbe Falle hat an derselben Fläche zweimal zugeschlagen.
- **Headless Chrome misst falsch, wenn man nicht nachrechnet.** `--window-size` ist nicht der
  CSS-Viewport (26 px Breite und 156 px Höhe gehen fürs Fensterwerk ab), und unter **526 CSS-px
  Breite klemmt Chrome auf ein Minimum** — ein angefordertes 393er Handyfenster rendert als 526 px
  und schneidet Text ab, der real passt. Für echte Handybreiten taugt der Weg nicht; dort nur
  DOM-Geometrie messen.
- **Hochkant-Layouts in `svh` rechnen, nicht in `vh` oder `%`.** Chrome auf Android misst
  `position: fixed` am GROSSEN Fenster (ohne Adressleiste); steht die Leiste, liegen rund 110 px
  davon unter dem sichtbaren Rand, und alles, was dort unten verankert ist, wird abgeschnitten.
  `dvh` ist die falsche Abhilfe — es skaliert bei jedem Ein-/Ausfahren neu und lässt Bildbänder
  zucken. Fallback für alte Browser über `@supports (height: 100svh)`.
- **Regeln, die Inhalt verstecken, brauchen den `.js`-Vorsatz** (`.js .reveal:not(.is-visible)`).
  Ohne ihn ist die Seite ohne JavaScript leer. Gilt für die Reise UND `stilprobe/index.html` — die
  Unterseite erbt ihr CSS aus V18.
- **Sektions-Aussehen nie über die Position steuern** (`:nth-child(N of .bg-pergament)`): eine
  eingeschobene Sektion verschiebt still alle Farbflächen. Immer IDs. `pruefe-seiten.mjs` bewacht das.
- **Texte der Scroll-Reise stehen an DREI Orten** in `der-weg/index.html` (Konfiguration `sections`,
  SEO-Spiegel `data-sw-seo`, Vertiefungs-Artikel) — immer alle drei zusammen ändern, sonst erzählen
  Browser und Suchmaschine Verschiedenes. Danach die Stationshöhen hochkant nachmessen: `--weg-textzone`
  hängt an der höchsten Station (`docs/der-weg.md`).
- **Etappe 3 und 4 der Reise stammen aus EINER Rohdatei**, die `scripts/der-weg/teile-verbunden.mjs`
  zerlegt — wer eine der beiden ersetzt, muss beide zusammen denken. Und `scroll` je Etappe ist eine
  Rechnung, keine Geschmacksfrage: `Bilder × Bildbewegung / 1555,6`, Boden 0,85. Seit die Clips
  unterschiedlich lang sind, gehört die Bildanzahl zwingend hinein (`docs/der-weg.md`).
- Windows: keine PS-Bulk-Replaces auf den HTML-Dateien (verstümmelt UTF-8). Edits via Tool oder Node.
- **`.gitattributes` / EOL:** Der Git-Index der minifizierten HTMLs (Stilprobe, Varianten) ist LF;
  `.gitattributes` hält die Varianten als `text eol=lf`. NICHT auf `-text`/`binary` stellen — das würde
  CRLF-Arbeitskopien wörtlich einchecken und die Live-Bytes ändern. Vor EOL-/Attribut-Änderungen immer erst
  `git ls-files --eol` lesen; `git add --renormalize` nur mit Staging-Probelauf + Review, nie blind committen.
  Für echte Binärdateien gilt das Gegenteil: `*.mp4 binary` steht drin, weil `text=auto` sonst je Datei
  rät und ein falsch eingestuftes Video beim Auschecken zeilenweise umgeschrieben und damit zerstört wird.

## Konventionen
- Marken-/Palette-Tokens: `--color-tinte` #1F2A44, `--color-kupfer` #C97B3F, `--color-salbei` #8FA98A,
  `--color-holzsand` #D9C7A8, `--color-quellwasser` #6FA3B5, Pergament #FEFCF7.
- Archiv-Variante 13 (`13-lumen`) trägt eine `#skin-impeccable`-Override-Schicht (Impeccable-Skill).
