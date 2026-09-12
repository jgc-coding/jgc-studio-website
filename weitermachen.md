# Weitermachen — JGC Lumen Website

## Stand (12.09.2026 — Einreichen funktioniert, V67/V69/V70 sind LIVE)
Die Stilprobe lässt sich jetzt einreichen. Der Hauptweg läuft über die neue Empfangsschicht,
der Notfallweg über ein Postfach, das es vorher nicht gab — beide waren bis heute tot.

- **V67 erledigt.** Die PHP-Empfangsschicht liegt auf `https://formular.jgc-lumen.de`
  (privates Repo `stilprobe-automatik`, `C:\Projekte\Stilprobe-Automatik`, Stufe Produkt).
  Gabriel hat Postfach, Unteradresse und FTP-Zugang angelegt; Upload, Deploy und Live-Prüfung
  sind durch. Belege: 43 örtliche Fälle grün, Zähler und Warteliste live, vertrauliche Dateien
  403, eine echte Einreichung **aus dem Browser auf der Live-Seite** zeigt die Erfolgsmeldung.
  Telegram-Ping eingeschaltet und belegt (Konfiguration trägt die Werte, keine Warnung im
  Serverprotokoll).
- **V60: Ursache gefunden, behoben, wartet auf GitHub.** Im Ergebnis fehlte die `CNAME`-Datei —
  bei einem Deploy per Action legt GitHub sie nicht selbst an, ohne sie hängt die Domainprüfung
  („DNS Check in Progress"). `baue-site.mjs` schreibt sie jetzt, `pruefe-seiten.mjs` bewacht sie.
- **V69/V70 live** (Auftakt-Titel als `h1`, Erstgespräch-Knopf in der Kopfzeile) — der Branch der
  Feedback-Sitzung ist in `main` gemergt; einziger Konflikt war die CHANGELOG (beide Abschnitte
  behalten). Nachgeprüft: `H1, H2 × 8`, Knopf sichtbar.
- Deploys: `ceb742b` und `53c9b71`, beide Actions grün. Tag **`live-2026-09-12`**.

## Offen (unfertig / wartet auf Zulieferung)
- **V60** — Zertifikat für `www` und https-Zwang. Der Fix ist live, GitHub stand unmittelbar
  danach weiter auf `new`. **Nicht erneut anstoßen.** Nebenbefund: der Wildcard-Eintrag `*` fängt
  auch `_github-pages-challenge-…` ab und bricht damit die optionale Domain-Verifizierung.
- **Mails sind nur zugesagt, nicht belegt.** `mail()` meldet die Annahme, nicht die Zustellung.
  Gabriel prüft `stilprobe@` (drei Einreichungen der Prüfläufe) und `kontakt@` (Bestätigungen).
  Kommt nichts an, liegt es an der Zustellung, nicht am Formular.
- **V68** (Anthropic-Vertrag) muss stehen, bevor der erste fremde Text durch Claude läuft.
- Offene Befunde: **V59** (Googles Wissensbasis, wichtig), **V60**, **V66** (acht tote Skripte,
  braucht Freigabe), **V47** (Knöpfe unter 362/380 px), **V14** (LinkedIn-URL), **V71–V75** aus
  dem Feedback (Wörter bzw. Fakten von Gabriel). Ideen: **I3**, **I4**, **I9–I14**.
- **Gabriel (Hub, Karte „Website"):** juristische Prüfung des Datenschutzes, Testmail an
  kontakt@, Anthropic-Bedingungen, USt-IdNr., LinkedIn-URL, Profilbild ins Google-Profil,
  Search Console, „fremde Skills versionieren?".
- Projekt-CLAUDE.md liegt über dem Richtwert — Straffung nur als Vorschlag, nie eigenmächtig.
- Nach dem Launch: Kundenstimmen mit echten Zitaten, Analytics ohne Cookies falls gewünscht,
  Videos neu komprimieren (14,6 MB Handy-Clips), SEO-Textarbeit.
- **Ordnerhülle** `.claude/worktrees/jgc-lumen-feedback-review-557f36` — Git kennt sie nicht mehr
  (Branch gemergt und gelöscht, `prune` gelaufen), ein Prozess hält aber die Dateien. Nach einem
  Neustart löschen; der Inhalt ist vollständig in `main`.

## Nächste Schritte (Claude)
1. **V60 zu Ende bringen:** `gh api repos/jgc-coding/jgc-studio-website/pages`. Bei `approved` →
   `gh api -X PUT repos/jgc-coding/jgc-studio-website/pages -F https_enforced=true`, dann
   `curl -sI http://jgc-lumen.de/` → 301 auf https und `curl -sI https://www.jgc-lumen.de/` ohne
   Zertifikatsfehler. Bleibt es tagelang `new`, ist der Wildcard-Eintrag die nächste Spur
   (ausdrücklichen TXT-Eintrag setzen), danach GitHub-Support.
2. Auf Gabriels Mailbefund reagieren: kommt nichts an, Zustellweg prüfen (SPF/DKIM stehen,
   Absender ist die eigene Domain) — Protokoll liegt auf dem Webspace unter `daten/protokoll.log`.
3. V59 auf Zuruf (braucht LinkedIn-URL und Google-Profil-Link); V47, V14, V66 nur auf Zuruf;
   I3 als Wortlaut-Vorschlag vorlegen, nichts ohne Ok einsetzen.
4. **Feedback-Paket ohne Wortlaut-Entscheidung**, sobald Gabriel freigibt: I10, I11 (beide Repos),
   I9 (danach Textzone hochkant nachmessen). V71–V75 erst mit Gabriels Wörtern.
5. **Zweite Ausbaustufe der Stilprobe** (Textwerk, Freigabe, Versand) — Konzept liegt in
   `docs/stilprobe/stilprobe-automatisierung-konzept_v1.md`, Phasen 2 bis 6. Braucht n8n und V68.
6. **In den `scroll-world`-Skill zurückgeben** — Liste in `docs/der-weg.md`, Abschnitt „Offen".

## Stolperfallen (sofort wichtig)
- **Formulare zeigen auf einen anderen Rechner.** Sieben Adressen im HTML, alle auf
  `formular.jgc-lumen.de`; `pruefe-seiten.mjs` (Regel 13) bewacht, dass keine zurückbleibt.
  Der Code dahinter liegt in `C:\Projekte\Stilprobe-Automatik` — Feldnamen sind Vertrag,
  Änderungen immer in beiden Repos zusammen.
- **`CNAME` muss im Deploy-Ergebnis liegen.** Sie entsteht in `baue-site.mjs` aus dem `canonical`;
  fehlt sie, hängt die Domainprüfung und damit das Zertifikat (Regel im Prüfskript).
- **Die Domain hat eine Quelle:** der `canonical` der Reise. `baue-site.mjs` und
  `pruefe-seiten.mjs` lesen sie dort.
- **Formular-Logik und Feld-Optik NICHT in `formulare.js` ändern** — beides liegt in
  `formular-kern.js` und `assets/formular.css` und wirkt auf beiden Seiten gleichzeitig.
- **DNS: der Wildcard-Eintrag `*` zeigt auf All-Inkl** — so bleibt `mail.` beim Postfach. Nie
  auf GitHub biegen, MX/SPF/DKIM/DMARC nie anfassen.
- **Etappe 3 und 4 stammen aus EINER Rohdatei** (`teile-verbunden.mjs`, Bild 121). `scroll` je
  Etappe: `Bilder × Bildbewegung / 1555,6`, Boden 0,85.
- **`--weg-textzone` 365/350/345/325** hängt an der Breite der zwei Schluss-Knöpfe.
- **Preview-Pane:** meldet sich versteckt, malt gescrollte Bereiche nicht neu und verweigert
  die Zwischenablage ohne echte Mausgeste. Details in der CLAUDE.md.
- **`pruefen.txt` hat CRLF** — wer die Zeilen in Bash abarbeitet, muss `\r` abschneiden.
- **Commit-Messages IMMER als Datei + `git commit -F`.**
