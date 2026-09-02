# Weitermachen — JGC Lumen Website

## Stand (02.09.2026 — die Seite ist live unter https://jgc-lumen.de)
Die Scroll-Reise ist die einzige öffentliche Fassung und liegt an der Wurzel der eigenen Domain.
Gabriels Entscheidungen dieser Session: Lesefassung V18 nur noch Archiv im Repo, Rechtsseiten neu
im Design der Reise, Galerie und Varianten raus aus dem Deploy, `www` ja, Titel „JGC Lumen – KI für
Coaches, Trainer und Mentoren", Zielort GitHub Pages mit eigener Domain (Formulare vorerst über den
Mail-Ausweichweg).
- **Live:** Reise an der Wurzel (`index, follow`, `canonical` https://jgc-lumen.de/, JSON-LD),
  `/stilprobe/`, `/impressum/` und `/datenschutz/` (eigene HTML-Seiten, `der-weg/assets/rechtliches.css`),
  Favicon aus dem Sigel, `robots.txt`, `sitemap.xml`, Weiterleitung `/der-weg/` → `/`. Die alte
  GitHub-Adresse leitet per 301 um. Impressum mit Gabriels Daten (c/o-Anschrift), Datenschutz in neun
  Abschnitten inklusive Erstgespräch-Formular.
- **Deploy neu:** `scripts/deploy/baue-site.mjs` + `scripts/pruefe-seiten.mjs _site`; kein npm, kein
  Astro, keine Varianten. Lokal identisch nachbaubar (`_site`, launch.json `site-vorschau`).
- **Aus einem Parallel-Branch gemergt:** Profilbild fürs Google-Unternehmensprofil, vier Fassungen in
  `Bildmaterial/Google-Unternehmensprofil/` plus `scripts/google-profil/baue-profilbild.mjs`.
- Der AVV mit All-Inkl existiert seit 05.02.2024 (PDF in der MembersArea) — der Satz im Datenschutz
  trägt. Zwei Aussagen dort beschreiben weiter den Sollzustand: Anthropic-Bedingungen ohne Training
  und die kurzzeitige IP-Speicherung des noch fehlenden Serverteils.

## Offen (unfertig / wartet auf Zulieferung)
- **Zertifikat für `www` läuft noch** (Stand: Abend des 02.09.). Das erste Zertifikat kannte nur die
  Hauptadresse; ein Aus-/Eintragen der Domain reichte nicht. Geholfen hat: kurz `www.jgc-lumen.de`
  als Custom Domain eintragen, sofort zurück auf `jgc-lumen.de` — seitdem steht ein Antrag über beide
  Namen (`https_certificate.domains`). **Dabei fiel `https_enforced` auf false.** Sobald der Zustand
  `approved` ist: wieder einschalten und prüfen (Schritt 1 unten). Bis dahin läuft https auf der
  Hauptadresse mit dem alten Zertifikat, http leitet nicht um, `https://www…` wirft einen Zertifikatsfehler.
- **Gabriel (Hub, Karte „Website"):** juristische Prüfung des Datenschutzes, Testmail an kontakt@,
  Postfach stilprobe@ klären, USt-IdNr., LinkedIn-URL, Profilbild ins Google-Profil hochladen
  (Titelbild 16:9 fehlt), Search Console anmelden, Domain bei GitHub verifizieren (optional).
- **Stilprobe bekommt eine eigene Session** (Gabriels Wunsch): PHP-Empfang (Repo `stilprobe-automatik`
  existiert noch nicht), `senden.php`, `kontingent.php`, `/erstgespraech/senden.php`, Postfach stilprobe@,
  Anthropic-Bedingungen belegen. Verträge: `docs/stilprobe/schnittstelle.md`, `docs/erstgespraech/schnittstelle.md`.
- Offene Befunde: **V47** (Knöpfe unter 362/380 px, Gabriels Entscheidung), **V14** (LinkedIn-URL).
  Ideen: **I3** (Kosten-FAQ, braucht Wortlaut-Freigabe), **I4** (Wortmarke aufs Vorschaubild).
- Nach dem Launch: Kundenstimmen erst mit echten Zitaten (Google-Profil als Quelle), Analytics ohne
  Cookies falls gewünscht, Videos neu komprimieren (14,6 MB Handy-Clips), SEO-Textarbeit.
- Aufräumen nur mit Gabriels Ok: die vier toten Skripte (`generate-gallery`, `copy-homepage`,
  `site-noindex`, `varianten-noindex`) und das Manifest-Feld `homepage`.

## Nächste Schritte (Claude)
1. **Zertifikat prüfen:** `gh api repos/jgc-coding/jgc-studio-website/pages`. Zustand `approved` →
   `gh api -X PUT repos/jgc-coding/jgc-studio-website/pages -F https_enforced=true`, dann
   `curl -sI http://jgc-lumen.de/` → 301 auf https und `curl -sI https://www.jgc-lumen.de/` → 301 auf
   die Hauptadresse ohne Zertifikatsfehler. Bleibt der Zustand tagelang `new`, in den Pages-Einstellungen
   im Browser nachsehen (die API zeigt keinen Fehlergrund).
2. Stilprobe-Session, sobald Gabriel sie aufruft.
3. V47 und V14 nur auf Zuruf; I3 als Wortlaut-Vorschlag vorlegen, nichts ohne Ok einsetzen.
4. **In den `scroll-world`-Skill zurückgeben** — Liste in `docs/der-weg.md`, Abschnitt „Offen"; neu
   dazugekommen: „Formular-Overlay: verschieben statt klonen", „`scroll` braucht die Bildanzahl bei
   ungleich langen Clips" und die Sprungmarken über die Engine-Reiter.

## Stolperfallen (sofort wichtig)
- **Die Domain hat eine Quelle:** der `canonical` der Reise. `baue-site.mjs` und `pruefe-seiten.mjs`
  lesen sie dort. Bei Änderung die Köpfe aller vier Seiten und das JSON-LD anfassen, sonst nichts.
- **Interne Links wurzel-relativ, Assets der Reise relativ.** `pruefe-seiten.mjs` verbietet den alten
  GitHub-Präfix und prüft jeden internen Link auf eine Ziel-Datei (Repo: erst Wurzel, dann `der-weg/`).
- **Stilprobe nur per Transform-Skript** (`scripts/stilprobe/`), minifiziert, mit Trefferzahlen.
- **DNS: der Wildcard-Eintrag `*` zeigt auf All-Inkl** — so bleibt `mail.` beim Postfach. Nie auf
  GitHub biegen, MX/SPF/DKIM/DMARC nie anfassen.
- **Etappe 3 und 4 stammen aus EINER Rohdatei** (`teile-verbunden.mjs`, Bild 121). `scroll` je Etappe:
  `Bilder × Bildbewegung / 1555,6`, Boden 0,85. Texte der Reise stehen an DREI Orten.
- **Formular-Overlays:** Original-Knoten verschieben, nicht klonen; kein Schließen durch Scrollen.
- **`--weg-textzone` 365/350/345/325** hängt an der Breite der zwei Schluss-Knöpfe.
- **Preview-Pane meldet sich versteckt:** erst Viewport setzen und `resize` auslösen (sonst misst man
  0×0 — die Sprungmarken lieferten so `scrollTo(0)` statt echter Werte), CSS-Übergänge vor jeder
  Messung abschalten, `requestAnimationFrame` läuft dort nicht. Screenshots gehen.
- **`pruefen.txt` hat CRLF** — wer die Zeilen in Bash abarbeitet, muss `\r` abschneiden, sonst
  scheitert jede Zeile mit „command not found".
- **Commit-Messages IMMER als Datei + `git commit -F`.** Deploy = Push auf `main`; `main` ist in
  keinem Worktree ausgecheckt, also `git branch -f main HEAD`.

## Aufräumen — Stand 02.09.2026
Erledigt in dieser Session: der Branch `claude/google-business-profile-image-3d856e` ist gemergt
(zwei rein additive Konflikte in CHANGELOG und weitermachen.md), drei gemergte `claude/*`-Branches
sind gelöscht, drei Worktrees aus dem Register entfernt. Auf `origin` liegt kein `claude/*`-Branch.

Die neun `variant/*`-Branches und `variants/standalone/` bleiben — Archiv auf Gabriels Wunsch, seit
dem Umbau baut der Deploy sie nicht mehr.

Nach dem Ende DIESER Sitzung noch offen (Worktree und Branch, in denen sie lief):
```
git worktree remove ".claude/worktrees/background-video-cut-revision-bec6e7"
git branch -d claude/jgc-lumen-launch-prep-252162
```

Zwei leere Ordner unter `.claude/worktrees/` (`google-business-profile-image-3d856e`,
`jgc-lumen-business-description-30f915`) ließen sich unter Windows nicht löschen („Device or resource
busy"). Das Git-Register ist trotzdem sauber; die Ordner verschwinden, sobald der haltende Prozess
endet. Bekanntes Muster, kein Fehler.
