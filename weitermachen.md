# Weitermachen — JGC Lumen Website

## Stand (05.09.2026 — Runde 4 ist umgesetzt, aber noch NICHT live)
Die Seite läuft seit dem 02.09. unter https://jgc-lumen.de (Scroll-Reise an der Wurzel, dazu
`/stilprobe/`, `/impressum/`, `/datenschutz/`, Weiterleitung `/der-weg/` → `/`, robots.txt, Sitemap).
Am 05.09. hat Gabriel das komplette Paket der `/improve`-Runde 4 freigegeben; es ist committet und
geprüft, **aber nicht gepusht** — live steht weiterhin der Stand vom 02.09.
- **Die Stilprobe-Unterseite ist neu gebaut** (I8): 20 KB gewöhnliches HTML im Design der Reise
  statt 724 KB Einzeldatei, alle Wortlaute unverändert. Sie ist damit wieder direkt editierbar.
- **Die Formular-Logik steht nur noch einmal:** neu `der-weg/formular-kern.js`, Feld-Optik in
  `der-weg/assets/formular.css`, Grundgerüst der Unterseiten in `assets/seiten.css` (hieß
  `rechtliches.css`). Reise und Stilprobe teilen sich beides.
- Dazu: zweistufige Fehlermeldung mit Fehler-ID (V62), Knopf „Angaben kopieren" plus vorbefüllte
  Mail (I6), eigene 404-Seite (I5), Drei-Orte-Prüfung in `pruefe-seiten.mjs` (I7), `sharp` in
  `scripts/package.json` statt im Astro-Archiv (V61), Vorschau-Server stürzt nicht mehr ab (V65).
- **Tag gesetzt:** `live-2026-09-02` auf `17c85e4`, gepusht (V63).
- Der AVV mit All-Inkl existiert seit 05.02.2024 (PDF in der MembersArea) — der Satz im Datenschutz
  trägt. Zwei Aussagen dort beschreiben weiter den Sollzustand: Anthropic-Bedingungen ohne Training
  und die kurzzeitige IP-Speicherung des noch fehlenden Serverteils.

## Offen (unfertig / wartet auf Zulieferung)
- **Runde 4 ist nicht deployt.** Ein Push schaltet sie live — Gabriels Entscheidung, steht im Hub.
- **V60** (Zertifikat für `www`, https-Zwang aus): Antrag am 05.09. neu angestoßen, stand abends
  weiter auf `new`. Beschreibung und Vorgehen: `verbesserungen.md`.
- **V64 ist nur halb erledigt:** der Hauptbaum steht weiter auf `variant/09`, weil dort eine
  ungesicherte `.gitignore`-Änderung von Gabriel liegt (Zeile `.claude/skills/`). Details in
  `verbesserungen.md`, Entscheidung im Hub.
- **Stilprobe bekommt eine eigene Session** (Gabriels Wunsch): PHP-Empfang (Repo `stilprobe-automatik`
  existiert noch nicht), `senden.php`, `kontingent.php`, `/erstgespraech/senden.php`, Postfach
  stilprobe@, Anthropic-Bedingungen belegen. Verträge: `docs/stilprobe/schnittstelle.md`,
  `docs/erstgespraech/schnittstelle.md`.
- Offene Befunde: **V59** (Googles Wissensbasis, wichtig), **V60**, **V66** (acht tote Skripte,
  braucht Freigabe), **V47** (Knöpfe unter 362/380 px), **V14** (LinkedIn-URL).
  Ideen: **I3** (Kosten-FAQ, braucht Wortlaut-Freigabe), **I4** (Wortmarke aufs Vorschaubild).
- **Gabriel (Hub, Karte „Website"):** Deploy freigeben, juristische Prüfung des Datenschutzes,
  Testmail an kontakt@, Postfach stilprobe@ klären, USt-IdNr., LinkedIn-URL, Profilbild ins
  Google-Profil, Search Console, Aufräumen freigeben, `.gitignore`-Zeile entscheiden.
- Nach dem Launch: Kundenstimmen erst mit echten Zitaten (Google-Profil als Quelle), Analytics ohne
  Cookies falls gewünscht, Videos neu komprimieren (14,6 MB Handy-Clips), SEO-Textarbeit.

## Nächste Schritte (Claude)
1. **Deployen, sobald Gabriel ja sagt:** `git push origin HEAD:main` aus diesem Worktree. Danach
   live nachprüfen: `/stilprobe/` im neuen Design, `/404.html` bei einem unbekannten Pfad
   (Kernfunktion 20 in `verbesserungen.md`), beide Formulare, Sitemap unverändert vier Adressen.
2. **V60 weiterverfolgen:** `gh api repos/jgc-coding/jgc-studio-website/pages`. Zustand `approved` →
   `gh api -X PUT repos/jgc-coding/jgc-studio-website/pages -F https_enforced=true`, dann
   `curl -sI http://jgc-lumen.de/` → 301 auf https und `curl -sI https://www.jgc-lumen.de/` → 301
   ohne Zertifikatsfehler. Bleibt es tagelang `new`, ist der Blick in die Pages-Einstellungen dran
   (Hub-Punkt, nur Gabriel kann das sehen).
3. V59 auf Zuruf umsetzen (braucht LinkedIn-URL und Google-Profil-Link); V47, V14, V66 nur auf
   Zuruf; I3 als Wortlaut-Vorschlag vorlegen, nichts ohne Ok einsetzen.
4. **In den `scroll-world`-Skill zurückgeben** — Liste in `docs/der-weg.md`, Abschnitt „Offen"; neu
   dazugekommen: „Formular-Overlay: verschieben statt klonen", „`scroll` braucht die Bildanzahl bei
   ungleich langen Clips" und die Sprungmarken über die Engine-Reiter.

## Stolperfallen (sofort wichtig)
- **Die Domain hat eine Quelle:** der `canonical` der Reise. `baue-site.mjs` und `pruefe-seiten.mjs`
  lesen sie dort. Bei Änderung die Köpfe aller vier Seiten und das JSON-LD anfassen, sonst nichts.
- **Formular-Logik und Feld-Optik NICHT mehr in `formulare.js` ändern** — beides liegt seit dem
  05.09. in `formular-kern.js` und `assets/formular.css` und wirkt auf beiden Seiten gleichzeitig.
  Die Stilprobe ist kein Transform-Fall mehr; die Skripte in `scripts/stilprobe/` laufen ins Leere.
- **Interne Links wurzel-relativ, Assets der Reise relativ.** `pruefe-seiten.mjs` verbietet den alten
  GitHub-Präfix und prüft jeden internen Link auf eine Ziel-Datei (Repo: erst Wurzel, dann `der-weg/`).
- **DNS: der Wildcard-Eintrag `*` zeigt auf All-Inkl** — so bleibt `mail.` beim Postfach. Nie auf
  GitHub biegen, MX/SPF/DKIM/DMARC nie anfassen.
- **Etappe 3 und 4 stammen aus EINER Rohdatei** (`teile-verbunden.mjs`, Bild 121). `scroll` je Etappe:
  `Bilder × Bildbewegung / 1555,6`, Boden 0,85. Texte der Reise stehen an DREI Orten — das prüft
  `pruefe-seiten.mjs` jetzt selbst.
- **`--weg-textzone` 365/350/345/325** hängt an der Breite der zwei Schluss-Knöpfe.
- **Preview-Pane:** meldet sich versteckt, malt gescrollte Bereiche nicht neu und verweigert die
  Zwischenablage ohne echte Mausgeste. Details in der CLAUDE.md.
- **`pruefen.txt` hat CRLF** — wer die Zeilen in Bash abarbeitet, muss `\r` abschneiden, sonst
  scheitert jede Zeile mit „command not found".
- **Commit-Messages IMMER als Datei + `git commit -F`.**

## Aufräumen — Stand 05.09.2026
Erledigt: die zwei gemergten Branches `claude/stilprobe-mail-setup-c938ed` und
`claude/jgc-lumen-launch-prep-252162` gelöscht, der Worktree `background-video-cut-revision-bec6e7`
entfernt. Übrig sind der Hauptbaum, der Worktree dieser Sitzung und die neun `variant/*`-Branches
(Archiv auf Gabriels Wunsch, seit dem Umbau baut der Deploy sie nicht mehr).

Offen bleibt der Wechsel des Hauptbaums auf `main` — siehe „Offen" oben.
