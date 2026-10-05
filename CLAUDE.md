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
  ~46 MB). Wird im Deploy komplett an die Wurzel kopiert (`/`, `/assets/`, vier Skripte). Nimmt
  Stilprobe- und Erstgespräch-Anfragen selbst entgegen (`formulare.js`). Werkzeuge in
  `scripts/der-weg/`, Rohvideos unter `Scroll World/legs/` im Hauptordner (`kodiere.mjs` liest diesen
  absoluten Pfad auch aus einem Worktree — ein Rohdatei-Tausch ändert also immer den Hauptordner).
  `Scroll World/` ist **nicht versioniert** (`.gitignore`, V79): nie wieder ins Repo nehmen, auch
  nicht per `git add -A` beim Mergen. **Details und Austauschweg: `docs/der-weg.md`.**
- `stilprobe/index.html`, `impressum/`, `datenschutz/` — die drei Unterseiten im Design der Reise.
  Die Stilprobe ist eine gewöhnliche, direkt editierbare HTML-Datei.
- **Gemeinsame Bausteine** (in `der-weg/`, weil der Ordner an die Wurzel zieht): `assets/seiten.css`
  (Grundgerüst der Unterseiten), `assets/formular.css`
  (Feld-Optik) und `formular-kern.js` (Formular-Logik). Reise und Stilprobe benutzen sie gemeinsam.
- `deploy/der-weg-weiterleitung.html` — landet als `/der-weg/index.html` und leitet auf `/` um; der
  alte Link der Reise wurde verschickt. `deploy/404.html` landet als `/404.html` und ist die
  Fehlerseite für unbekannte Pfade (GitHub Pages liefert sie automatisch aus).
- `scripts/deploy/baue-site.mjs` — setzt `_site/` zusammen (siehe Build / Deploy); `_site/` ist ignoriert.
- `docs/stilprobe/`, `docs/erstgespraech/` — Konzepte und `schnittstelle.md` (Formular-/Badge-Verträge
  für die PHP-Empfangsschicht im separaten Repo `stilprobe-automatik`).
- **Archiv — wird nicht mehr ausgeliefert, bleibt aber im Repo (Gabriels Wunsch: Vergleich und Fundus):**
  `variants/standalone/<slug>/` (eingefrorene Single-File-Varianten; V18 war bis 02.09.2026 die
  Lesefassung; Register `manifest.json` + `VARIANTS.md`), `site/` (alte Astro-Quelle), `inhalt/lumen-inhalt.md`
  (Text von V18, erzeugt von `scripts/v18/extrahiere-inhalt.mjs`), die neun `variant/*`-Branches und die
  Skripte `generate-gallery`, `copy-homepage`, `site-noindex`, `varianten-noindex` — sie laufen nirgends
  mehr. Nichts davon löschen ohne Gabriels Ok.

## Formulare (Besonderheiten)
- **Die Empfangsschicht liegt in einem anderen Repo und auf einem anderen Rechner.** GitHub Pages
  führt kein PHP aus; die drei Endpunkte laufen deshalb unter `https://formular.jgc-lumen.de`
  auf dem All-Inkl-Webspace. Code, Runbook und Upload-Werkzeug: privates Repo `stilprobe-automatik`
  (`C:\Projekte\Stilprobe-Automatik`). Die Website bleibt bewusst bei GitHub Pages — dort werden
  ihre sieben Videoetappen (46 MB) schneller ausgeliefert. Feldnamen und Antwortformat sind
  Vertrag: `docs/stilprobe/schnittstelle.md` und `docs/erstgespraech/schnittstelle.md`, Änderungen
  immer in beiden Repos zusammen.
- **Die Adresse des Empfängers steht in jedem `action`- und `data-kontingent`-Attribut** von Reise
  und Stilprobe (Stilprobe-, Wartelisten- und Erstgespräch-Formular, dazu die Kontingent-Badges) —
  ein Formular ohne JavaScript braucht sein Ziel im Attribut, also lässt sie sich nicht
  zusammenführen. `pruefe-seiten.mjs` (Regel 13) bewacht, dass alle denselben Rechnernamen tragen
  und keine relativ zurückbleibt.
- Mailadressen: `kontakt@jgc-lumen.de` empfängt bestätigt (Erstgespräch, Ausweichweg der Reise).
  `stilprobe@jgc-lumen.de` ist der Empfänger der Einreichungen und zugleich Absender aller Mails
  der Empfangsschicht — All-Inkl verwirft Mails mit fremder Absenderadresse. Beide stehen als
  `data-mail`-Attribut am jeweiligen Formular-Artikel. **Ob ein Postfach existiert, lässt sich
  nachprüfen**, statt es anzunehmen: ein SMTP-Dialog gegen den MX (`w01ec3ef.kasserver.com`)
  antwortet auf eine unbekannte Adresse mit `550 … User unknown in virtual alias table`.
- **Die Formular-Logik steht einmal**, in `der-weg/formular-kern.js`; beide Seiten liefern nur Markup
  (Rollen `data-rolle="fehler|normal|warteliste|pause|kontingent|…"`) und Wortlaute. Beim Fehlschlag:
  menschlicher Satz, Knopf „Angaben kopieren", Diagnosezeile mit Fehler-ID (auch im Browser-Log).
- **Interne Links sind wurzel-relativ** (`/stilprobe/`, `/impressum/`), die Assets der Reise relativ
  (`assets/…`), weil ihr Ordner mit an die Wurzel zieht. Der alte GitHub-Präfix `/jgc-studio-website/`
  darf nirgends mehr stehen — `pruefe-seiten.mjs` bricht sonst ab und prüft jeden internen Link auf
  eine Ziel-Datei.
- **Die Domain hat eine Quelle:** den `canonical` der Reise. `baue-site.mjs` (robots.txt, Sitemap) und
  `pruefe-seiten.mjs` (Soll-canonicals) leiten sie daraus ab. Bei einem Domainwechsel die Köpfe der vier
  Seiten und das JSON-LD der Reise ändern, sonst nichts.

## Build / Deploy
- Push auf `main` → GitHub Action (`.github/workflows/deploy.yml`): `node scripts/deploy/baue-site.mjs _site`
  (Reise an die Wurzel, Stilprobe, Rechtsseiten, Vorschaubild, Weiterleitung, 404-Seite, `robots.txt` +
  `sitemap.xml` + `CNAME` aus den indexierbaren Seiten), dann `node scripts/pruefe-seiten.mjs _site` → GitHub Pages. Kein npm,
  kein Astro. Lauf ~1 min, Check: `gh run list --workflow=deploy.yml --limit 1`.
  **Deployt wird nur aus dem Hauptbaum** (`C:\Projekte\JGC Studio` auf `main`, globale Regel: der
  Default-Branch ist der Stand). Arbeit aus einem Worktree kommt dort erst per
  `git merge --ff-only <branch>` an, dann `git push origin main`. Kein `git push origin HEAD:main`
  aus einem Worktree — das lokale `main` bliebe sonst hinter `origin/main` zurück.
- **Domain:** `jgc-lumen.de` steht in den Pages-Einstellungen des Repos (`gh api repos/jgc-coding/jgc-studio-website/pages`),
  DNS liegt bei All-Inkl (A/AAAA auf GitHub Pages, `www` als CNAME auf `jgc-coding.github.io`). GitHub
  leitet `www` und die alte Adresse `jgc-coding.github.io/jgc-studio-website/` auf die Domain um.
  Die Mail-Einträge der Domain (MX, SPF, DKIM, DMARC) und der Wildcard-Eintrag `*` bleiben bei
  All-Inkl — nie anfassen, sonst bricht das Postfach.
- **`baue-site.mjs` legt die `CNAME`-Datei ins Ergebnis** (aus dem `canonical`), `pruefe-seiten.mjs`
  prüft sie im `_site`. Nach GitHubs Doku ignoriert ein Deploy per Action die Datei; sie schadet nicht
  und bleibt drin.
- **Zertifikat deckt nur ab, was beim Ausstellen im DNS stand.** Kommt `www` später dazu, stellt GitHub
  von sich aus KEIN neues aus. Einen neuen Antrag über beide Namen stoßen zwei Wege an: kurz
  `www.<domain>` als Custom Domain setzen und sofort zurück auf die Hauptadresse, oder die Domain aus-
  und wieder eintragen. **Dabei fällt `https_enforced` auf false**; nach `state: approved` wieder mit
  `gh api -X PUT …/pages -F https_enforced=true` setzen.
- `pruefe-seiten.mjs` bricht ab bei: Sprungmarke ohne Ziel, fehlendem Kontaktweg, `canonical` auf localhost
  oder abweichend von der Soll-Adresse, `noindex` auf einer echten Seite (nur Weiterleitung und 404-Seite
  tragen es), `canonical` auf der 404-Seite, fehlender Pflicht-Meta, Reveal-Regel ohne `.js`-Schutz,
  Positions-Selektor, altem GitHub-Präfix, internem Link ohne Ziel-Datei, hartkodiertem Pfad,
  **Stationstext, der zwischen Engine-Konfiguration und SEO-Spiegel abweicht**; im `_site` zusätzlich
  Sitemap und robots.txt. Ohne Argument prüft es die Repo-Quellen (so hängt es in `.claude/pruefen.txt`).
- Das Vorschaubild (`og:image`) ist eine echte Datei: `assets/og-bild.jpg` → `/og-bild.jpg`. Neu bauen mit
  `node scripts/der-weg/baue-og-bild.mjs`: der erste Bildschirm der Reise (Eröffnungsszene, Texte der
  Station `anflug` aus der Konfiguration, Sigel), gesetzt per Chrome headless wie das Google-Profilbild.
  **Nach jeder Textänderung an der Station `anflug` neu bauen**, sonst zeigt das Bild den alten Wortlaut.
  Das alte V18-Skript verweigert den Lauf. Ein `data:`-URI funktioniert hier NICHT — LinkedIn und Co.
  holen das Bild per HTTP, und sie halten es tagelang im Zwischenspeicher.
- Favicon aus dem Sigel: `node scripts/der-weg/baue-favicon.mjs` (aus `Logo/JGC Studio Logo final.svg`);
  die Stilprobe verlinkt es wie die Rechtsseiten unter `/assets/`.
- **`sharp` liegt in `scripts/package.json`** (`cd scripts && npm install`). Die ausgelieferte Seite
  braucht kein npm.
- Profilbild fürs Google-Unternehmensprofil (Logo-Feld, 1080 × 1080, vier Fassungen):
  `node scripts/google-profil/baue-profilbild.mjs` → `Bildmaterial/Google-Unternehmensprofil/`. Setzt Sigel,
  Fraunces und Farb-Tokens aus dem Repo per Chrome headless und prüft per Pixel, dass der Inhalt im runden
  Google-Beschnitt bleibt. Braucht `sharp` und Chrome unter dem Standardpfad (sonst Umgebungsvariable `CHROME`).

## Stolperfallen
- **Minifizierte Single-File-HTML nicht direkt editieren/lesen** — das betrifft die Archiv-Varianten
  unter `variants/standalone/` und die acht `JGC-Studio-Variante-*.html` im Hauptordner (je ~1 MB). Die
  Inline-base64-Blobs sprengen Read/Edit. Vorgehen: base64 per Regex (`data:[…];base64,[A-Za-z0-9+/=]+`)
  zu Platzhaltern strippen → Lesekopie; Änderungen über ein **assertion-guardetes Node-Transform-Skript**
  (jede Ersetzung mit erwarteter Trefferzahl prüfen, sonst werfen). Datei-I/O explizit UTF-8.
  Bis auf `extract-v18-assets.mjs` erwarten die Skripte in `scripts/stilprobe/` den Stand vor dem
  Stilprobe-Neubau und laufen ins Leere (V66).
- **Preview:** `node scripts/der-weg/server.mjs` (launch.json `der-weg`, Port 4330) liefert die
  Projektwurzel und löst Anfragen erst dort, dann in `der-weg/` auf — die Reise liegt damit wie live unter
  `/`, ihre Assets unter `/assets/`, die Rechtsseiten unter `/impressum/`, die Archiv-Varianten unter
  `/variants/standalone/<slug>/`. Das echte Deploy-Ergebnis: `node scripts/deploy/baue-site.mjs _site`,
  dann `node scripts/der-weg/server.mjs 4331 _site` (launch.json `site-vorschau`). Die Reise braucht
  zwingend einen Server: unter `file://` verbietet der Browser das Laden der Clips, die Seite bleibt leer.
  `npm run dev` (`jgc-site`) startet nur die archivierte Astro-Quelle.
- **Preview-Messungen im Pane:** was allgemein gilt (versteckter Pane, Screenshots, belastbare
  Messwege), steht global unter „UI-Verifikation". Dazu vier Fallen dieser Seite, jede hat schon
  einen Fehlbefund erzeugt:
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
  (3) **Gescrollte Bereiche malt der Pane nicht neu** — ein Screenshot nach `scrollTo` zeigt leere
  Fläche, obwohl `elementFromPoint` dort Inhalt findet. Für ein Bild weiter unten das Fenster hoch
  setzen (`resize_window` 1100×2600) oder `documentElement.style.transform='translateY(-Npx)'`;
  Beweise laufen ohnehin über DOM-Messung. Ebenso braucht `navigator.clipboard` eine echte
  Mausgeste — ein `element.click()` aus JavaScript scheitert dort mit `NotAllowedError`.
  (4) **CSS-Übergänge frieren am STARTWERT ein** — eine Fläche mit `transition` misst sich als
  ihr Ausgangswert (`rgba(0,0,0,0)` statt Zielfarbe), und selbst inline gesetzte Werte scheinen
  ignoriert. Vor jeder Farb-/Zustandsmessung `element.style.transition='none'` setzen, danach
  zurücksetzen — ohne Ausnahme: dieselbe Falle hat an derselben Fläche zweimal zugeschlagen.
- **Headless Chrome misst falsch, wenn man nicht nachrechnet.** `--window-size` ist nicht der
  CSS-Viewport (26 px Breite und 156 px Höhe gehen fürs Fensterwerk ab), und unter **526 CSS-px
  Breite klemmt Chrome auf ein Minimum** — ein angefordertes 393er Handyfenster rendert als 526 px
  und schneidet Text ab, der real passt. Für echte Handybreiten taugt der Weg nicht. **Was geht:
  Chrome headless über das DevTools-Protokoll steuern** (`--remote-debugging-port`,
  `Emulation.setDeviceMetricsOverride`) — dann stimmen auch 393 × 852, und die Reise läuft
  wirklich: Video-Scrubbing, Textdeckkraft, Screenshot je Scrollposition (erprobt 13.09.2026).
  `--user-data-dir` absolut angeben, mit relativem Pfad antwortet der Debug-Port nie. Die Engine
  lädt Clips als `blob:`-Adresse, am Dateinamen ist das Video also nicht zu erkennen.
- **Hochkant-Layouts in `svh` rechnen, nicht in `vh` oder `%`.** Chrome auf Android misst
  `position: fixed` am GROSSEN Fenster (ohne Adressleiste); steht die Leiste, liegen rund 110 px
  davon unter dem sichtbaren Rand, und alles, was dort unten verankert ist, wird abgeschnitten.
  `dvh` ist die falsche Abhilfe — es skaliert bei jedem Ein-/Ausfahren neu und lässt Bildbänder
  zucken. Fallback für alte Browser über `@supports (height: 100svh)`.
- **Regeln, die Inhalt verstecken, brauchen den `.js`-Vorsatz** (`.js .reveal:not(.is-visible)`).
  Ohne ihn ist die Seite ohne JavaScript leer. Gilt für die Reise und jede Unterseite.
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
- **`.gitattributes` / EOL:** Der Git-Index der minifizierten Varianten-HTMLs ist LF;
  `.gitattributes` hält die Varianten als `text eol=lf`. NICHT auf `-text`/`binary` stellen — das würde
  CRLF-Arbeitskopien wörtlich einchecken und die Live-Bytes ändern. Vor EOL-/Attribut-Änderungen immer erst
  `git ls-files --eol` lesen; `git add --renormalize` nur mit Staging-Probelauf + Review, nie blind committen.
  Für echte Binärdateien gilt das Gegenteil: `*.mp4 binary` steht drin, weil `text=auto` sonst je Datei
  rät und ein falsch eingestuftes Video beim Auschecken zeilenweise umgeschrieben und damit zerstört wird.

## Konventionen
- Markenfarben: Tinte #1F2A44, Kupfer #C97B3F, Salbei #8FA98A, Holzsand #D9C7A8, Quellwasser #6FA3B5,
  Pergament #FEFCF7. Reise und Unterseiten führen sie als CSS-Variablen `--sw-bg` (Pergament),
  `--sw-ink` (Tinte), `--sw-ink-soft` (#4A5568) und `--sw-accent` (Kupfer), definiert im Kopf von
  `der-weg/index.html` und in `der-weg/assets/seiten.css`. `--color-tinte` usw. gibt es nur im Archiv.
- Archiv-Variante 13 (`13-lumen`) trägt eine `#skin-impeccable`-Override-Schicht (Impeccable-Skill).
