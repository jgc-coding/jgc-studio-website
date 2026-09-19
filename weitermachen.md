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
- **Stilprobe am Abend:** Gabriels Entscheidungen umgesetzt — kein Monatsdeckel mehr
  (Empfangsschicht 0.3.0 live), Werkstatt 0.3.0 im Abo-Betrieb. Sie wartet auf das
  Postfach-Passwort und das Abo-Token.

## Offen (wartet auf Gabriel)
- **Werkstatt scharf schalten** (sechs Schritte unten unter „Was Gabriel selbst tun muss"): Training im Claude-Konto
  ausschalten, Datenschutz-Sätze freigeben (Vorschlag liegt vor, V68), `claude setup-token`,
  Postfach-Passwort und Token in `werkstatt\.env`, dann `docker compose up -d`. Betriebsart ist
  `abo` — Gabriels Entscheidung: nur Monatskontingent, keine API.
- **Der erste echte Durchlauf** gegen das All-Inkl-Postfach ist nicht belegt. Nach dem Eintragen
  eine eigene Test-Einreichung auf der Live-Seite machen und Entwurf und Prüfnotiz ansehen.
- **V77 erledigt:** kein Monatsdeckel mehr (Empfangsschicht 0.3.0). **V76:** vorerst Handarbeit —
  einmal im Monat alte Stilprobe-Mails im Postfach löschen (steht unten).
- **V79** (Rohvideos im Repo lassen oder herausnehmen) — Gabriels Entscheidung, Frage steht
  unten im Sammelpunkt „Claude Rueckmeldung geben".
- **V60** — Zertifikat weiter `new`, Stand vom 13.09. im Befund. Nicht erneut anstoßen.
- **Mails zugestellt?** Offen seit dem 12.09.: `stilprobe@` und `kontakt@` ansehen.
- **V68** — der Abo-Betrieb deckt die Zusage nicht: Datenschutz-Sätze anpassen (Vorschlag liegt
  Gabriel vor), Training im Claude-Konto ausschalten; die juristische Prüfung bleibt.
- Offene Befunde: **V59** (wichtig), **V66**, **V47**, **V14**, **V71–V75**. Ideen: **I3**, **I4**, **I9–I14**.
- **Gabriel (ausformuliert unten unter „Was Gabriel selbst tun muss"):** juristische Prüfung des Datenschutzes, Testmail an
  kontakt@, Anthropic-Bedingungen, USt-IdNr., LinkedIn-URL, Profilbild ins Google-Profil,
  Search Console, „fremde Skills versionieren?". Neu: Werkstatt scharf schalten (sechs Schritte) und monatliches Löschen (V76); seit
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

## Was Gabriel selbst tun muss

Am 19.09.2026 von der Hub-Tafel hierher gezogen. Die Tafel nimmt seither nur
noch, was Gabriel selbst eintraegt oder ausdruecklich beauftragt. Wo oben im
Text von der Hub-Karte oder einem Hub-Sammelpunkt die Rede ist, sind diese
Punkte gemeint.

- [ ] SEO-Ueberarbeitung der Website
- [ ] Cookie-Thema angehen (Plan liegt schon im Projektwissen)
- [ ] Datenschutzerklaerung juristisch pruefen lassen (Stilprobe- und GitHub-Pages-Passus sind Entwurf) (seit 2026-07-25)
- [ ] Testmail an kontakt@jgc-lumen.de von einer fremden Adresse schicken (CTA zeigt jetzt dorthin) (seit 2026-07-25)
- [ ] LinkedIn-Profil-URL liefern (toter Link wurde entfernt, kommt danach zurueck) (seit 2026-07-25)
- [ ] Echte Beispieltexte fuer die Stilprobe liefern (Phase 6, ersetzen die Platzhalter A/B) (seit 2026-07-25)
- [ ] USt-IdNr. klaeren: gibt es eine? Dann ins Impressum (impressum/index.html) (seit 2026-09-02)
- [ ] Optional: Domain jgc-lumen.de bei GitHub verifizieren (Settings > Pages > Verified domains, TXT-Eintrag bei All-Inkl) - schuetzt vor Uebernahme (seit 2026-09-02)
- [ ] Profilbild ins Google-Unternehmensprofil hochladen - vier fertige Fassungen liegen im Repo (seit 2026-09-02)
  - Empfehlung fuers runde Logo-Feld: Bildmaterial/Google-Unternehmensprofil/profilbild-tinte-ohne-claim.png
- [ ] Website in der Google Search Console anmelden (jgc-lumen.de) und die Sitemap einreichen (seit 2026-09-02)
  - Sitemap-Adresse: https://jgc-lumen.de/sitemap.xml
- [ ] www.jgc-lumen.de laeuft in eine Sicherheitswarnung - Zertifikat gilt nur fuer jgc-lumen.de ohne www (seit 2026-09-10)
- [ ] Verwaltungsschluessel der Stilprobe in den Passwortmanager (seit 2026-09-12)
  - Steht in C:\Projekte\Stilprobe-Automatik\konfig.live.php unter admin_schluessel
  - Damit schaltest du Pause und gibst Plaetze zurueck - Links in docs/betrieb.md
- [ ] Postfaecher pruefen: kommen die Mails der Stilprobe wirklich an? (seit 2026-09-12)
  - stilprobe@ - drei Einreichungen der Prueflaeufe, je mit drei Texten
  - kontakt@ - die Eingangsbestaetigungen dazu
  - Wenn nichts da ist: auch im Spam-Ordner nachsehen und Claude Bescheid geben
- [ ] Stilprobe-Werkstatt scharf schalten: Zugangsdaten in werkstatt\.env eintragen (seit 2026-09-13)
  - Claude-Konto: in den Datenschutz-Einstellungen die Nutzung fuer das Modelltraining ausschalten
  - Datenschutz-Texte fuer den Abo-Betrieb: Claudes Vorschlag freigeben (V68)
  - Token erzeugen: in PowerShell claude setup-token ausfuehren und das Token kopieren
  - In werkstatt\.env eintragen: POSTFACH_PASSWORT und CLAUDE_CODE_OAUTH_TOKEN
  - Werkstatt neu starten: cd C:\Projekte\Stilprobe-Automatik\werkstatt; docker compose up -d
  - Echte Test-Einreichung mit eigener Adresse auf jgc-lumen.de/stilprobe/ machen und Ergebnis im Postfach pruefen
- [ ] Claude Rueckmeldung geben (3 Punkte) (seit 2026-09-13)
  - Fremde Skills versionieren? (nur 6 von 27 im Git-Ordner)
  - Acht tote Skripte und das Manifest-Feld homepage loeschen? (Liste in weitermachen.md)
  - Rohvideos der Scroll-Reise im Repo lassen oder herausnehmen? (V79)
- [ ] Ueber mich mit deinem Portrait am Handy durchscrollen (Gesicht gut erkennbar, kein Ruckeln?) (seit 2026-09-13)
- [ ] Monatlich: Stilprobe-Mails im Postfach stilprobe@ loeschen, die aelter als 30 Tage sind (V76) (seit 2026-09-13)

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
