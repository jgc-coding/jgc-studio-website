# Weitermachen — JGC Lumen Website

## Stand (13.09.2026 — „zeitnah" live, Werkstatt gebaut und wartet auf Zugangsdaten)
Gabriels Auftrag: keine 48 Stunden und keine 15 pro Monat mehr auf der Seite, dazu die
automatische Erzeugung von Fassung A und B, die er nur noch gegenliest und selbst abschickt.

- **Website live** (`54e2a13`, Tag `live-2026-09-13`, Action grün): 13 Textstellen „zeitnah",
  Zählerzeile samt CSS weg, Wartelisten-Satz und Kosten-FAQ ohne Zahl. Live nachgeprüft: kein
  „48 Stunden" und kein „15 Proben" auf `/` und `/stilprobe/`. Hochkant auf neun Schirmen
  nachgemessen: Station unverändert hoch, `--weg-textzone` bleibt.
- **Empfangsschicht 0.2.0 live** (Repo `stilprobe-automatik`): Mails ohne Frist und Zahl,
  Ping mit falscher Uhrzeit behoben, jede Einreichung trägt eine HMAC-Unterschrift. 46
  örtliche Fälle grün, Live-Version per Kopfzeile belegt.
- **Werkstatt gebaut** (`C:\Projekte\Stilprobe-Automatik\werkstatt`, Container
  `stilprobe-werkstatt`, Runbook `docs/werkstatt.md`): holt unterschriebene Einreichungen per
  IMAP, Claude prüft und schreibt, der Entwurf landet in „Entwürfe", die Prüfnotiz im
  Posteingang, sie versendet nie. Belegt: Unit-Tests, IMAP-Strecke gegen GreenMail,
  Vertragsprobe aus echtem PHP, goldener Probelauf mit Gabriels Website-Texten im Abo-Betrieb.
  Der Container läuft und wartet auf `POSTFACH_PASSWORT` und `ANTHROPIC_SCHLUESSEL`; das hat
  er per Telegram gemeldet.

## Offen (wartet auf Gabriel)
- **Zugangsdaten in `werkstatt\.env`:** Postfach-Passwort, Entscheidung api oder abo, bei api
  der Schlüssel aus der Anthropic-Konsole; danach `docker compose up -d`. Vorher läuft nichts
  durch Claude.
- **Der erste echte Durchlauf** gegen das All-Inkl-Postfach ist nicht belegt. Nach dem Eintragen
  eine eigene Test-Einreichung auf der Live-Seite machen und Entwurf und Prüfnotiz ansehen.
- **V77** (Deckel wirkt unsichtbar weiter) und **V76** (Postfach-Kopien werden nicht nach 30
  Tagen gelöscht) — beides Gabriels Entscheidung.
- **V60** — Zertifikat weiter `new`, Stand vom 13.09. im Befund. Nicht erneut anstoßen.
- **Mails zugestellt?** Offen seit dem 12.09.: `stilprobe@` und `kontakt@` ansehen.
- **V68** — mit API-Schlüssel technisch gedeckt, die juristische Prüfung der Formulierung bleibt.
- Offene Befunde: **V59** (wichtig), **V66**, **V47**, **V14**, **V71–V75**. Ideen: **I3**, **I4**, **I9–I14**.
- **Gabriel (Hub, Karte „Website"):** juristische Prüfung des Datenschutzes, Testmail an
  kontakt@, Anthropic-Bedingungen, USt-IdNr., LinkedIn-URL, Profilbild ins Google-Profil,
  Search Console, „fremde Skills versionieren?". Neu: Werkstatt-Zugangsdaten, V76, V77.
- Projekt-CLAUDE.md liegt über dem Richtwert — Straffung nur als Vorschlag, nie eigenmächtig.
- Nach dem Launch: Kundenstimmen mit echten Zitaten, Analytics ohne Cookies falls gewünscht,
  Videos neu komprimieren (14,6 MB Handy-Clips), SEO-Textarbeit.
- **Ordnerhülle** `.claude/worktrees/jgc-lumen-feedback-review-557f36` nach einem Neustart
  löschen; der Inhalt ist vollständig in `main`.

## Nächste Schritte (Claude)
1. **Sobald die Zugangsdaten stehen:** im Werkstatt-Ordner `docker compose logs --tail 50`
   lesen, eine eigene Test-Einreichung (nur Gabriels Adresse) durchlaufen lassen, Entwurf und
   Prüfnotiz im Postfach prüfen, Ergebnis in beide CHANGELOGs.
2. **V60:** wie im Befund beschrieben (`gh api …/pages`, bei `approved` https erzwingen).
3. Auf Gabriels Mailbefund reagieren (Protokoll `daten/protokoll.log` auf dem Webspace).
4. V59 auf Zuruf; V47, V14, V66 nur auf Zuruf; I3 als Wortlaut-Vorschlag vorlegen.
5. Feedback-Paket ohne Wortlaut-Entscheidung, sobald freigegeben: I10, I11 (beide Repos), I9.
6. Nach den ersten echten Proben die Aufträge in `werkstatt\vorlagen\` am Probelauf nachschärfen.
7. In den `scroll-world`-Skill zurückgeben — Liste in `docs/der-weg.md`, Abschnitt „Offen".

## Stolperfallen (sofort wichtig)
- **Die Stilprobe hat drei Teile in zwei Repos:** Website (hier), Empfangsschicht und Werkstatt
  (`C:\Projekte\Stilprobe-Automatik`). Feldnamen sind Vertrag mit der Website; der Block der
  Einreichungs-Mail samt Unterschrift ist Vertrag mit der Werkstatt.
- **Der Werkstatt-Schlüssel steht an zwei Stellen** (`konfig.live.php`, `werkstatt\.env`), der
  Telegram-Token an drei. Absicht, keine Drift — beim Ändern alle nachziehen.
- **Der Abo-Betrieb deckt die Datenschutzerklärung nicht** — fremde Texte nur mit `TEXTWERK=api`.
- **Formulare zeigen auf einen anderen Rechner.** Sieben Adressen im HTML, alle auf
  `formular.jgc-lumen.de`; `pruefe-seiten.mjs` (Regel 13) bewacht, dass keine zurückbleibt.
- **`CNAME` muss im Deploy-Ergebnis liegen.** Sie entsteht in `baue-site.mjs` aus dem `canonical`.
- **Die Domain hat eine Quelle:** der `canonical` der Reise.
- **Formular-Logik und Feld-Optik NICHT in `formulare.js` ändern** — beides liegt in
  `formular-kern.js` und `assets/formular.css` und wirkt auf beiden Seiten gleichzeitig.
- **DNS: der Wildcard-Eintrag `*` zeigt auf All-Inkl** — so bleibt `mail.` beim Postfach. Nie
  auf GitHub biegen, MX/SPF/DKIM/DMARC nie anfassen.
- **Etappe 3 und 4 stammen aus EINER Rohdatei** (`teile-verbunden.mjs`, Bild 121). `scroll` je
  Etappe: `Bilder × Bildbewegung / 1555,6`, Boden 0,85.
- **`--weg-textzone` 365/350/345/325** hängt an den höchsten Stationen („Über mich", „Der Weg",
  Schluss-Station); Messverfahren und Werte im CSS-Kommentar, am 13.09. bestätigt.
- **Preview-Pane:** meldet sich versteckt, malt gescrollte Bereiche nicht neu und verweigert
  die Zwischenablage ohne echte Mausgeste. Details in der CLAUDE.md.
- **`pruefen.txt` hat CRLF** — wer die Zeilen in Bash abarbeitet, muss `\r` abschneiden.
- **Commit-Messages IMMER als Datei + `git commit -F`.**
