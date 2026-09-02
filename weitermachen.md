# Weitermachen — JGC Lumen Website

## Stand (02.09.2026 — die Reise ist live unter https://jgc-lumen.de)
Gabriel hat die Impressumsdaten geliefert und entschieden: die Scroll-Reise ist die einzige
öffentliche Fassung, V18 bleibt nur als Archiv im Repo, Zielort ist GitHub Pages mit der
eigenen Domain (Option A: DNS auf GitHub Pages, Formulare vorerst über den Mail-Ausweichweg).
Rechtsseiten neu im Design der Reise, Galerie raus, `www` ja, Titel „JGC Lumen – KI für Coaches,
Trainer und Mentoren". Am selben Tag umgeschaltet: DNS im KAS gesetzt, Domain in den
Pages-Einstellungen eingetragen, `main` auf `9ca03be`, Deploy grün, Zertifikat da, HTTPS erzwungen.
- **Live:** Reise an der Wurzel (`index, follow`, `canonical` https://jgc-lumen.de/, JSON-LD),
  `/stilprobe/`, `/impressum/`, `/datenschutz/` (eigene HTML-Seiten, `der-weg/assets/rechtliches.css`),
  Favicon aus dem Sigel, `robots.txt` und `sitemap.xml`, Weiterleitung `/der-weg/` → `/`. Die alte
  GitHub-Adresse leitet per 301 um.
- **Deploy neu:** `scripts/deploy/baue-site.mjs` + `scripts/pruefe-seiten.mjs _site`; kein npm, kein
  Astro, keine Varianten. Lokal identisch nachbaubar (`_site`, launch.json `site-vorschau`).
- **Sprungmarken auf Stationen** (`/#lichtung`) laufen über einen Klick auf den Engine-Reiter
  (`springeZurStation` in `der-weg/index.html`); das Stilprobe-Menü nutzt sie.
- Die Datenschutzerklärung ist ein sorgfältiger Entwurf; drei Aussagen beschreiben den Sollzustand
  (AVV mit All-Inkl, Anthropic-Bedingungen ohne Training, kurzzeitige IP-Speicherung des Serverteils).

## Offen (unfertig / wartet auf Zulieferung)
- **Gabriel (Hub, Karte „Website"):** `www`-CNAME im KAS nachtragen, AVV mit All-Inkl im
  Members-Bereich (Stammdaten → Auftragsverarbeitung), USt-IdNr. ja/nein, optional Domain bei
  GitHub verifizieren, juristische Prüfung des Datenschutzes, Testmail an kontakt@, Postfach stilprobe@.
- **Nachprüfen:** der Zwang von http auf https war unmittelbar nach dem Einschalten noch nicht
  wirksam (`curl http://jgc-lumen.de/` gab 200 statt 301) — in der nächsten Sitzung erneut prüfen.
  Search Console anmelden (Gabriels Google-Konto), Formular-Ausweichweg am Gerät testen.
- **Stilprobe bekommt eine eigene Session** (Gabriels Wunsch): PHP-Empfang (Option B, Repo
  `stilprobe-automatik` existiert noch nicht), stilprobe@-Postfach, Anthropic-Bedingungen belegen.
- Offene Befunde: **V47** (Knöpfe unter 362/380 px), **V14** (LinkedIn-URL). Ideen: **I3**
  (Kosten-FAQ), **I4** (Wortmarke aufs Vorschaubild). V13/V20/V34/V10/V18/I2 sind gegenstandslos.
- Nach dem Launch: Kundenstimmen erst mit echten Zitaten (Google-Profil als Quelle), Analytics
  ohne Cookies falls gewünscht, Videos neu komprimieren (14,6 MB Handy-Clips), SEO-Textarbeit.
- Aufräumen nur mit Gabriels Ok: die vier toten Skripte (`generate-gallery`, `copy-homepage`,
  `site-noindex`, `varianten-noindex`) und das Manifest-Feld `homepage`.

## Nächste Schritte (Claude)
1. `curl -sI http://jgc-lumen.de/` muss 301 auf https liefern; sonst `gh api repos/jgc-coding/jgc-studio-website/pages`
   ansehen (`https_enforced`, `https_certificate.state`).
2. Sobald `www` gesetzt ist: `nslookup www.jgc-lumen.de` → CNAME auf jgc-coding.github.io, dann
   `curl -sI http://www.jgc-lumen.de/` → 301 auf https://jgc-lumen.de/ (macht GitHub selbst).
3. Hub-Punkte abhaken, dann `/save-state clean` (Worktree und Branch weg) — jetzt wieder erlaubt.
4. Danach die Stilprobe-Session, V47/V14 nur auf Zuruf, I3 als Wortlaut-Vorschlag.

## Stolperfallen (sofort wichtig)
- **Die Domain hat eine Quelle:** der `canonical` der Reise. `baue-site.mjs` und
  `pruefe-seiten.mjs` lesen sie dort. Bei Änderung die Köpfe aller vier Seiten und das JSON-LD.
- **Interne Links wurzel-relativ, Assets der Reise relativ.** `pruefe-seiten.mjs` verbietet den
  alten Präfix und prüft jeden internen Link auf eine Ziel-Datei (Repo: erst Wurzel, dann `der-weg/`).
- **Stilprobe nur per Transform-Skript** (`scripts/stilprobe/`), minifiziert, Trefferzahlen.
- **DNS-Wildcard `*` im KAS zeigt auf All-Inkl** — so bleibt `mail.` beim Postfach; nie auf GitHub biegen.
- **Etappe 3 und 4 stammen aus EINER Rohdatei** (`teile-verbunden.mjs`, Bild 121). `scroll` je
  Etappe: `Bilder × Bildbewegung / 1555,6`, Boden 0,85. Texte der Reise an DREI Orten.
- **Formular-Overlays:** Original-Knoten verschieben, nicht klonen; kein Schließen durch Scrollen.
- **`--weg-textzone` 365/350/345/325** hängt an der Breite der zwei Schluss-Knöpfe.
- **Preview-Pane meldet sich versteckt:** erst Viewport setzen und `resize` auslösen (sonst
  misst man 0×0 — die Sprungmarken lieferten so `scrollTo(0)`), Übergänge abschalten, rAF
  läuft nicht. Screenshots gehen.
- **Commit-Messages IMMER als Datei + `git commit -F`.** Deploy = Push auf `main`
  (`git branch -f main HEAD`). Vor jedem Zugende `node scripts/pruefe-seiten.mjs`.
- **`pruefen.txt` hat CRLF** — wer die Zeilen in Bash abarbeitet, muss `\r` abschneiden.

## Aufräumen — Stand 02.09.2026
Worktree `.claude/worktrees/background-video-cut-revision-bec6e7` auf Branch
`claude/jgc-lumen-launch-prep-252162`, `main` steht auf demselben Commit. Lokal existiert noch
der gemergte Altbranch `claude/profile-image-about-section-be7bee` — kann weg. Beides per
`/save-state clean`.
