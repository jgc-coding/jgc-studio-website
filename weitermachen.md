# Weitermachen — JGC Lumen Website

## Stand (05.09.2026 — Runde 4 ist LIVE, Aufräumen abgeschlossen)
Gabriels Freigabe („mach das, was am besten ist"): Runde 4 ist deployt — Push `042122a`,
Action grün, live nachgeprüft. Reise (120.748 Bytes) und Stilprobe (20.351 Bytes) sind
byte-gleich mit dem Repo, die eigene 404-Seite greift (Kernfunktion 20 jetzt auch live),
Sitemap unverändert vier Adressen, `formular-kern.js` und beide CSS-Bausteine liefern 200.
Tag `live-2026-09-05`, gepusht.
- **V64 ist abgeschlossen:** Gabriels `.gitignore`-Zeile (`.claude/skills/`) ist auf `main`
  committet, der Hauptbaum steht auf `main`, der übersehene dritte Worktree samt Branch
  `claude/improve-760bc8` ist weg. Details und Verlustfreiheits-Beleg: `verbesserungen.md`.
- Rest davon: die **leere, gesperrte Ordnerhülle** `.claude/worktrees/stilprobe-mail-setup-c938ed`
  — ein anderer Prozess hält sie; nach einem Neustart löschen (Inhalt ist längst in `main`).
- Im Hub abgehakt: „Runde 4 live schalten freigeben" und „.gitignore-Zeile entscheiden".
  Bewusst NICHT abgehakt: „Aufräumen freigeben" (acht tote Skripte, V66) — Löschen braucht
  Gabriels ausdrückliches Ok je Datei, eine Pauschal-Freigabe reicht dafür nicht.
- Gabriels Arbeitsdateien im Hauptbaum (`Scroll World/`, Varianten-Exporte, `Website Texte
  01.docx`, …) liegen unangetastet.

## Offen (unfertig / wartet auf Zulieferung)
- **V60** (Zertifikat für `www`, https-Zwang aus): Antrag steht nach dem Neuanstoß vom 05.09.
  weiter auf `new`. **Nicht erneut anstoßen** — das setzt die Warteschlange zurück. Chrome war
  auf GitHub nicht angemeldet, darum bleibt der Blick in Settings→Pages Gabriels Schritt (Hub).
- **Stilprobe bekommt eine eigene Session** (Gabriels Wunsch): PHP-Empfang (Repo
  `stilprobe-automatik` existiert noch nicht), `senden.php`, `kontingent.php`,
  `/erstgespraech/senden.php`, Postfach stilprobe@, Anthropic-Bedingungen belegen.
  Verträge: `docs/stilprobe/schnittstelle.md`, `docs/erstgespraech/schnittstelle.md`.
- Offene Befunde: **V59** (Googles Wissensbasis, wichtig), **V60**, **V66** (acht tote
  Skripte, braucht Freigabe), **V47** (Knöpfe unter 362/380 px), **V14** (LinkedIn-URL).
  Ideen: **I3** (Kosten-FAQ, braucht Wortlaut-Freigabe), **I4** (Wortmarke aufs Vorschaubild).
- **Gabriel (Hub, Karte „Website"):** juristische Prüfung des Datenschutzes, Testmail an
  kontakt@, Postfach stilprobe@ klären, USt-IdNr., LinkedIn-URL, Profilbild ins Google-Profil,
  Search Console, „fremde Skills versionieren?", Blick in Settings→Pages falls V60 hängt.
- Projekt-CLAUDE.md liegt bei ~13.800 Zeichen (Richtwert 13.000) — Straffung des Altbestands
  nur als Vorschlag an Gabriel, nie eigenmächtig kürzen.
- Nach dem Launch: Kundenstimmen erst mit echten Zitaten (Google-Profil als Quelle), Analytics
  ohne Cookies falls gewünscht, Videos neu komprimieren (14,6 MB Handy-Clips), SEO-Textarbeit.

## Nächste Schritte (Claude)
1. **V60 weiterverfolgen:** `gh api repos/jgc-coding/jgc-studio-website/pages`. Zustand
   `approved` → `gh api -X PUT repos/jgc-coding/jgc-studio-website/pages -F https_enforced=true`,
   dann `curl -sI http://jgc-lumen.de/` → 301 auf https und `curl -sI https://www.jgc-lumen.de/`
   → gültiges Zertifikat ohne Warnung. Bleibt es tagelang `new`: Gabriels Browser-Blick
   (Hub-Punkt) oder GitHub-Support.
2. V59 auf Zuruf umsetzen (braucht LinkedIn-URL und Google-Profil-Link); V47, V14, V66 nur auf
   Zuruf; I3 als Wortlaut-Vorschlag vorlegen, nichts ohne Ok einsetzen.
3. **In den `scroll-world`-Skill zurückgeben** — Liste in `docs/der-weg.md`, Abschnitt „Offen";
   neu dazugekommen: „Formular-Overlay: verschieben statt klonen", „`scroll` braucht die
   Bildanzahl bei ungleich langen Clips" und die Sprungmarken über die Engine-Reiter.

## Stolperfallen (sofort wichtig)
- **Die Domain hat eine Quelle:** der `canonical` der Reise. `baue-site.mjs` und
  `pruefe-seiten.mjs` lesen sie dort. Bei Änderung die Köpfe aller vier Seiten und das JSON-LD
  anfassen, sonst nichts.
- **Formular-Logik und Feld-Optik NICHT mehr in `formulare.js` ändern** — beides liegt seit dem
  05.09. in `formular-kern.js` und `assets/formular.css` und wirkt auf beiden Seiten
  gleichzeitig. Die Skripte in `scripts/stilprobe/` laufen ins Leere (V66).
- **Interne Links wurzel-relativ, Assets der Reise relativ.** `pruefe-seiten.mjs` verbietet den
  alten GitHub-Präfix und prüft jeden internen Link auf eine Ziel-Datei.
- **DNS: der Wildcard-Eintrag `*` zeigt auf All-Inkl** — so bleibt `mail.` beim Postfach. Nie
  auf GitHub biegen, MX/SPF/DKIM/DMARC nie anfassen.
- **Etappe 3 und 4 stammen aus EINER Rohdatei** (`teile-verbunden.mjs`, Bild 121). `scroll` je
  Etappe: `Bilder × Bildbewegung / 1555,6`, Boden 0,85. Texte der Reise stehen an DREI Orten —
  das prüft `pruefe-seiten.mjs` jetzt selbst.
- **`--weg-textzone` 365/350/345/325** hängt an der Breite der zwei Schluss-Knöpfe.
- **Preview-Pane:** meldet sich versteckt, malt gescrollte Bereiche nicht neu und verweigert
  die Zwischenablage ohne echte Mausgeste. Details in der CLAUDE.md.
- **`pruefen.txt` hat CRLF** — wer die Zeilen in Bash abarbeitet, muss `\r` abschneiden.
- **Commit-Messages IMMER als Datei + `git commit -F`.**
