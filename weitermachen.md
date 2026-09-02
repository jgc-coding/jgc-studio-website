# Weitermachen — JGC Lumen Website

## Stand (02.09.2026 — Umbau auf „die Reise als einzige Seite", wartet auf DNS)
Gabriel hat die Impressumsdaten geliefert und entschieden: die Scroll-Reise ist die einzige
öffentliche Fassung, V18 bleibt nur als Archiv im Repo, Zielort ist GitHub Pages mit der
Domain `jgc-lumen.de` (Option A: DNS auf GitHub Pages, Formulare vorerst über den
Mail-Ausweichweg). Rechtsseiten neu im Design der Reise, Galerie raus, `www` ja, Titel
„JGC Lumen – KI für Coaches, Trainer und Mentoren".
- **Live (Commit `64ff0dc`, Deploy grün):** Impressum und Datenschutz unter `/main/…` der alten
  Adresse gefüllt, Favicon aus dem Sigel in Reise und Stilprobe.
- **Vorbereitet, NICHT live (Commit `3603ea0`, nur auf dem Branch):** Reise an die Wurzel,
  Rechtsseiten `impressum/` + `datenschutz/`, Stilprobe umgestellt, Deploy und Prüfskript neu,
  Sprungmarken auf Stationen (`/#lichtung`), Doku nachgezogen. Lokal komplett verifiziert:
  Done-Gate, `pruefe-seiten` auf Quellen und `_site`, Browser-Prüfung des Deploy-Ergebnisses.
- **Warum der Branch noch nicht auf `main` darf:** die Links tragen jetzt das Präfix `/`. Unter
  `jgc-coding.github.io/jgc-studio-website/` wären sie kaputt. Erst wenn die Domain zieht, wird
  gepusht — Reihenfolge unten.
- **`/save-state` auf diesem Branch NICHT laufen lassen**, bevor umgeschaltet ist: Schritt 5b
  des Skills zieht `main` per Fast-Forward nach und würde damit deployen. Diese Datei ist
  deshalb von Hand geschrieben.

## Offen (unfertig / wartet auf Zulieferung)
- **Gabriel (Hub, Karte „Website"):** DNS bei All-Inkl (4 A, 4 AAAA, `www` CNAME, MX nicht
  anfassen), AVV mit All-Inkl im KAS, USt-IdNr. ja/nein, optional Domain bei GitHub
  verifizieren, juristische Prüfung des Datenschutzes, Testmail an kontakt@, Postfach stilprobe@.
- **Nach dem Umschalten:** HTTPS erzwingen, Live-Prüfung aller Pfade, Formular-Ausweichweg am
  Gerät, Vorschaubild-Abruf, Search Console (Gabriels Google-Konto), Hub-Punkt „Reise
  scharfschalten" abhaken, CHANGELOG-Nachtrag „live".
- **Stilprobe bekommt eine eigene Session** (Gabriels Wunsch): PHP-Empfang (Option B, Repo
  `stilprobe-automatik` existiert noch nicht), stilprobe@-Postfach, Anthropic-Bedingungen im
  Datenschutztext belegen (kommerzielle Bedingungen ohne Training — Sollzustand).
- Offene Befunde: **V47** (Knöpfe unter 362/380 px), **V14** (LinkedIn-URL). Ideen: **I3**
  (Kosten-FAQ), **I4** (Wortmarke aufs Vorschaubild). V13/V20/V34/V10/V18/I2 sind mit dem
  Umbau gegenstandslos.
- Nach dem Launch: Kundenstimmen erst mit echten Zitaten (Google-Profil als Quelle), Analytics
  ohne Cookies falls gewünscht, Videos neu komprimieren (14,6 MB Handy-Clips), SEO-Textarbeit.
- Aufräumen nur mit Gabriels Ok: die vier toten Skripte (`generate-gallery`, `copy-homepage`,
  `site-noindex`, `varianten-noindex`) und das Manifest-Feld `homepage`.

## Nächste Schritte (Claude)
1. **Sobald Gabriel DNS meldet:** `nslookup jgc-lumen.de` muss die vier GitHub-Adressen zeigen.
   Dann `gh api -X PUT repos/jgc-coding/jgc-studio-website/pages -f cname=jgc-lumen.de`,
   direkt danach `git branch -f main HEAD && git push origin main`, Lauf beobachten
   (`gh run watch`), Live-Prüfung per curl: `/`, `/stilprobe/`, `/impressum/`, `/datenschutz/`,
   `/der-weg/` (Refresh), `/sitemap.xml`, `/robots.txt`, `/assets/favicon.svg`, `/og-bild.jpg`.
2. Zertifikat abwarten (bis zu einem Tag), dann `gh api -X PUT … -F https_enforced=true`.
3. Hub-Punkte abhaken, CHANGELOG-Nachtrag, dann `/save-state clean` (Worktree und Branch weg).
4. Danach die Stilprobe-Session, V47/V14 nur auf Zuruf, I3 als Wortlaut-Vorschlag.

## Stolperfallen (sofort wichtig)
- **Die Domain hat eine Quelle:** der `canonical` der Reise. `baue-site.mjs` und
  `pruefe-seiten.mjs` lesen sie dort. Bei Änderung die Köpfe aller vier Seiten und das JSON-LD.
- **Interne Links wurzel-relativ, Assets der Reise relativ.** `pruefe-seiten.mjs` verbietet
  den alten Präfix und prüft jeden internen Link auf eine Ziel-Datei (Repo: erst Wurzel, dann
  `der-weg/` — wie der Vorschau-Server).
- **Stilprobe nur per Transform-Skript** (`scripts/stilprobe/`), minifiziert, Trefferzahlen.
- **Sprungmarken der Reise** (`/#weg` …) laufen über einen Klick auf den Engine-Reiter
  (`springeZurStation` in `der-weg/index.html`); die Engine selbst kennt keine Hash-Ziele.
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
`claude/jgc-lumen-launch-prep-252162` (ein Commit vor `main`). Lokal existiert noch der
gemergte Altbranch `claude/profile-image-about-section-be7bee` — kann weg. Beides nach dem
Umschalten per `/save-state clean`.
