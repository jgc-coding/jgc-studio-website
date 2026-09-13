# Weitermachen — JGC Lumen Website

## Stand (13.09.2026 abends — Portrait in „Über mich" live, aufgeräumt)
Gabriels Auftrag: sein Video mit dem eigenen Portrait auf der Staffelei als Hintergrund der
Station „Über mich" einbauen, sodass es dauerhaft drin bleibt.

- **Live** (`46ad4be`, Tag `live-2026-09-13-2`, Action grün): Etappe `lichtung` neu kodiert aus
  `leg 6 - Gabriel Portrait v2.mp4`. Beide Nähte tragen (1,22 / 0,99), `scroll` bleibt 0,85.
  Live-Videos per SHA-256 identisch mit dem Repo; Bildschirmfotos PC und Handy aus Chrome
  headless (Methode in der CLAUDE.md, Abschnitt Headless Chrome).
- **V78** (Portrait und Stationstext nie gleichzeitig im Bild): Gabriel findet es in Ordnung,
  steht unter „Abgelehnt".
- **Rohmaterial:** `Scroll World/legs/leg 6.mp4` ist die Portrait-Fassung, das Original liegt in
  `vor-portrait-2026-09-13/`. Beides committet (`0aef595`), weil `Scroll World/` seit dem 12.09.
  versehentlich versioniert ist — neuer Befund **V79**.
- **Clean:** `main` per Fast-Forward auf `0aef595` und gepusht; Worktrees `cert-v60-cleanup` und
  `stilprobe-setup` samt Branches entfernt. Deren leere Ordner hält Windows noch fest (Offen).
- Vorher am selben Tag: „zeitnah" live (`54e2a13`) und die Werkstatt gebaut
  (`C:\Projekte\Stilprobe-Automatik\werkstatt`, Runbook `docs/werkstatt.md`); sie wartet auf
  Zugangsdaten.

## Offen (wartet auf Gabriel)
- **Zugangsdaten in `werkstatt\.env`:** Postfach-Passwort, Entscheidung api oder abo, bei api
  der Schlüssel aus der Anthropic-Konsole; danach `docker compose up -d`. Vorher läuft nichts
  durch Claude.
- **Der erste echte Durchlauf** gegen das All-Inkl-Postfach ist nicht belegt. Nach dem Eintragen
  eine eigene Test-Einreichung auf der Live-Seite machen und Entwurf und Prüfnotiz ansehen.
- **V77** (Deckel wirkt unsichtbar weiter) und **V76** (Postfach-Kopien werden nicht nach 30
  Tagen gelöscht) — beides Gabriels Entscheidung.
- **V79** (Rohvideos im Repo lassen oder herausnehmen) — Gabriels Entscheidung, Frage steht im
  Hub-Sammelpunkt.
- **V60** — Zertifikat weiter `new`, Stand vom 13.09. im Befund. Nicht erneut anstoßen.
- **Mails zugestellt?** Offen seit dem 12.09.: `stilprobe@` und `kontakt@` ansehen.
- **V68** — mit API-Schlüssel technisch gedeckt, die juristische Prüfung der Formulierung bleibt.
- Offene Befunde: **V59** (wichtig), **V66**, **V47**, **V14**, **V71–V75**. Ideen: **I3**, **I4**, **I9–I14**.
- **Gabriel (Hub, Karte „Website"):** juristische Prüfung des Datenschutzes, Testmail an
  kontakt@, Anthropic-Bedingungen, USt-IdNr., LinkedIn-URL, Profilbild ins Google-Profil,
  Search Console, „fremde Skills versionieren?". Neu: Werkstatt-Zugangsdaten, V76, V77; seit
  dem 13.09. abends außerdem die Portrait-Etappe am Handy durchscrollen und V79 im Sammelpunkt.
- Projekt-CLAUDE.md liegt über dem Richtwert — Straffung nur als Vorschlag, nie eigenmächtig.
- Nach dem Launch: Kundenstimmen mit echten Zitaten, Analytics ohne Cookies falls gewünscht,
  Videos neu komprimieren (14,6 MB Handy-Clips), SEO-Textarbeit.
- **Leere Ordnerhüllen** unter `.claude/worktrees/`: `jgc-lumen-feedback-review-557f36`,
  `cert-v60-cleanup-v64-c87b0f` und `stilprobe-setup-375520` nach einem Neustart löschen. Alle
  drei sind leer und bei Git abgemeldet; Windows hält sie fest, solange die alten Sitzungen offen
  sind.

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
8. **Nächster clean-Lauf:** Worktree `portrait-video-about-section-7c1719` und seinen Branch
   entfernen. Diese Sitzung lief darin; ihr Stand ist vollständig in `main`.
9. **V79 nach Gabriels Entscheidung:** beim Herausnehmen nur im Hauptordner auf `main` austragen,
   nie über einen Worktree-Zweig (Falle und Befehle im Befund).

## Stolperfallen (sofort wichtig)
- **Die Stilprobe hat drei Teile in zwei Repos:** Website (hier), Empfangsschicht und Werkstatt
  (`C:\Projekte\Stilprobe-Automatik`). Feldnamen sind Vertrag mit der Website; der Block der
  Einreichungs-Mail samt Unterschrift ist Vertrag mit der Werkstatt.
- **Der Werkstatt-Schlüssel steht an zwei Stellen** (`konfig.live.php`, `werkstatt\.env`), der
  Telegram-Token an drei. Absicht, keine Drift — beim Ändern alle nachziehen.
- **Der Abo-Betrieb deckt die Datenschutzerklärung nicht** — fremde Texte nur mit `TEXTWERK=api`.
- **`Scroll World/` ist versioniert, solange V79 offen ist:** ein Rohdatei-Tausch erscheint als
  Änderung im Hauptordner. Sofort über den Session-Branch committen und im Hauptordner die
  identischen Dateien stagen, sonst blockiert er das Nachziehen von `main`.
- **`--weg-textzone` 365/350/345/325** hängt an den höchsten Stationen („Über mich", „Der Weg",
  Schluss-Station); Messverfahren und Werte im CSS-Kommentar, am 13.09. bestätigt.
- **`pruefen.txt` hat CRLF** — wer die Zeilen in Bash abarbeitet, muss `\r` abschneiden.
