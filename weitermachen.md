# Weitermachen — JGC Lumen Website

## Stand (05.10.2026 — KI-Kennzeichnung, neues Vorschaubild, live)
Gabriels Fragen: Muss die Seite KI-Bilder kennzeichnen? Und das Vorschaubild soll die aktuelle
Seite zeigen. Rückkehrpunkt vor dem Merge: `147a523` (lag nur lokal, ging mit diesem Lauf raus).

- **Recherche Art. 50 KI-VO** (gilt seit 02.08.2026): Pflicht ist ein sichtbarer Hinweis nur bei
  täuschend echten Inhalten. Die Papierwelt ist erkennbar gestaltet, also freiwillig. Ergebnis
  und Quellen stehen im CHANGELOG vom 05.10.
- **KI-Hinweis:** Abspann der Reise als eigener, lesbarer Absatz („Die Papierwelt dieser Reise
  habe ich mit KI erzeugt."), Impressum mit neuem Abschnitt. Bewusst nicht behauptet, dass Texte
  oder Portrait ohne KI entstanden sind.
- **V80 erledigt:** neues Vorschaubild aus dem ersten Bildschirm der Reise,
  `scripts/der-weg/baue-og-bild.mjs`. Das alte V18-Skript verweigert den Lauf.
- **Live geprüft:** Deploy grün, `og-bild.jpg` live byte-gleich mit dem Repo, beide Sätze
  ausgeliefert. `www.jgc-lumen.de` leitet mit gültigem Zertifikat auf die Hauptadresse um.
- Nebenbefund: Die Rohvideos tragen einen Herkunftsnachweis des KI-Herstellers (C2PA, Seedance);
  `kodiere.mjs` entfernt ihn beim Kodieren. Keine Pflicht für Gabriel, nur zur Kenntnis.

## Stolperfallen (sofort wichtig)
- **V60-Doku vom 26./27.09. liegt NICHT in `main`**, nur auf `claude/zertifikat-sicherheit-c4def1`
  (enthält auch `claude/jgc-lumen-website-f451c1`). Nur Doku: CLAUDE.md, verbesserungen.md,
  weitermachen.md — beim Mergen sind Konflikte in diesen Dateien zu erwarten. Nur auf Gabriels Wort.
- **Die Stilprobe hat drei Teile in zwei Repos:** Website (hier), Empfangsschicht und Werkstatt
  (`C:\Projekte\Stilprobe-Automatik`). Feldnamen sind Vertrag mit der Website; der Block der
  Einreichungs-Mail samt Unterschrift ist Vertrag mit der Werkstatt.
- **Der Werkstatt-Schlüssel steht an zwei Stellen** (`konfig.live.php`, `werkstatt\.env`), der
  Telegram-Token an drei. Absicht, keine Drift — beim Ändern alle nachziehen.
- **Die Datenschutzerklärung beschreibt seit dem 23.09. den Abo-Betrieb** und behauptet den
  ausgeschalteten Trainings-Schalter. Fremde Texte erst durch Claude, wenn der Schalter aus ist.
- **`Scroll World/` ist nicht versioniert** (`.gitignore`, V79): Ein Rohdatei-Tausch ändert nur
  den Hauptordner, Git merkt davon nichts — die Sicherung ist Handarbeit. Beim Mergen im
  Hauptordner nie `git add -A`, genau so war der Ordner am 12.09. hineingeraten.
- **Commit-Nummern ab dem 12.09. haben sich am 23.09. geändert.** Alte Nummern in Doku oder
  Chat verweisen ins Leere; die Zuordnung steht im CHANGELOG vom 23.09.
- **`--weg-textzone` 365/350/345/325** hängt an den höchsten Stationen („Über mich", „Der Weg",
  Schluss-Station); Messverfahren und Werte im CSS-Kommentar, am 13.09. bestätigt.

## Nächste Schritte (Claude)
1. **Sobald die Zugangsdaten stehen:** im Werkstatt-Ordner `docker compose logs --tail 50`
   lesen, eine eigene Test-Einreichung (nur Gabriels Adresse) durchlaufen lassen, Entwurf und
   Prüfnotiz im Postfach prüfen, Ergebnis in beide CHANGELOGs.
2. **V60:** wie im Befund beschrieben (`gh api …/pages`, bei `approved` https erzwingen). Der
   neuere Stand der Messungen liegt auf `claude/zertifikat-sicherheit-c4def1` (siehe Stolperfallen).
3. Bestätigungsmail der Stilprobe an die neuen Datenschutz-Texte angleichen („Keine Weitergabe",
   Repo `stilprobe-automatik`) — zusammen mit Gabriels Textüberarbeitung.
4. V59 auf Zuruf; V47, V14, V66 nur auf Zuruf; I3 als Wortlaut-Vorschlag vorlegen.
5. Feedback-Paket ohne Wortlaut-Entscheidung, sobald freigegeben: I10, I11 (beide Repos), I9.
6. Nach den ersten echten Proben die Aufträge in `werkstatt\vorlagen\` am Probelauf nachschärfen.
7. In den `scroll-world`-Skill zurückgeben — Liste in `docs/der-weg.md`, Abschnitt „Offen".
8. **Worktree `portrait-video-about-section-7c1719`** gehört der Sitzung „JGC Lumen Website".
   Erst entfernen, wenn diese Sitzung abgeschlossen ist und ihr Stand in `main` liegt — vorher
   nur melden.
9. Bestätigt Gabriel, dass sein Portrait-Foto unbearbeitet ist: im Abspann ergänzen „Das
   Portrait ist ein echtes Foto." (und im Impressum).

## Offen (wartet auf Gabriel)
- **Werkstatt scharf schalten** (Schritte unten unter „Was Gabriel selbst tun muss"): Training im Claude-Konto
  ausschalten, `claude setup-token`,
  Postfach-Passwort und Token in `werkstatt\.env`, dann `docker compose up -d`. Betriebsart ist
  `abo` — Gabriels Entscheidung: nur Monatskontingent, keine API.
- **Der erste echte Durchlauf** gegen das All-Inkl-Postfach ist nicht belegt. Nach dem Eintragen
  eine eigene Test-Einreichung auf der Live-Seite machen und Entwurf und Prüfnotiz ansehen.
- **V77 erledigt:** kein Monatsdeckel mehr (Empfangsschicht 0.3.0). **V76:** vorerst Handarbeit —
  einmal im Monat alte Stilprobe-Mails im Postfach löschen (steht unten).
- **V60** — am 23.09. neu beantragt; Messungen danach auf dem Branch oben. Nicht öfter als einmal
  täglich anstoßen.
- **V68** — Texte am 23.09. angepasst. Offen: Training im Claude-Konto ausschalten (die Seite
  behauptet es jetzt), juristische Prüfung.
- Offene Befunde: **V59** (wichtig), **V66**, **V47**, **V14**, **V71–V75**. Ideen: **I3**, **I4**, **I9–I14**.
- **Gabriel (ausformuliert unten unter „Was Gabriel selbst tun muss"):** juristische Prüfung des Datenschutzes, Testmail an
  kontakt@, Anthropic-Bedingungen, USt-IdNr., LinkedIn-URL, Profilbild ins Google-Profil,
  Search Console, „fremde Skills versionieren?". Neu: Werkstatt scharf schalten (sechs Schritte) und monatliches Löschen (V76); seit
  dem 13.09. abends außerdem die Portrait-Etappe am Handy durchscrollen; seit dem 23.09. den
  Rohordner aufs Backup-Laufwerk kopieren.
- Projekt-CLAUDE.md liegt über dem Richtwert — Straffung nur als Vorschlag, nie eigenmächtig.
- Nach dem Launch: Kundenstimmen mit echten Zitaten, Analytics ohne Cookies falls gewünscht,
  Videos neu komprimieren (14,6 MB Handy-Clips), SEO-Textarbeit.

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
- [ ] Verwaltungsschluessel der Stilprobe in den Passwortmanager (seit 2026-09-12)
  - Steht in C:\Projekte\Stilprobe-Automatik\konfig.live.php unter admin_schluessel
  - Damit schaltest du Pause und gibst Plaetze zurueck - Links in docs/betrieb.md
- [ ] Claude-Konto: in den Datenschutz-Einstellungen die Nutzung fuer das Modelltraining ausschalten - die Datenschutzerklaerung sagt seit dem 23.09., dass es aus ist (V68)
- [ ] Stilprobe-Werkstatt scharf schalten: Zugangsdaten in werkstatt\.env eintragen (seit 2026-09-13)
  - Token erzeugen: in PowerShell claude setup-token ausfuehren und das Token kopieren
  - In werkstatt\.env eintragen: POSTFACH_PASSWORT und CLAUDE_CODE_OAUTH_TOKEN
  - Werkstatt neu starten: cd C:\Projekte\Stilprobe-Automatik\werkstatt; docker compose up -d
  - Echte Test-Einreichung mit eigener Adresse auf jgc-lumen.de/stilprobe/ machen und Ergebnis im Postfach pruefen
- [ ] Claude Rueckmeldung geben (2 Punkte) (seit 2026-09-13)
  - Fremde Skills versionieren? (nur 6 von 27 im Git-Ordner)
  - Acht tote Skripte und das Manifest-Feld homepage loeschen? (Liste in weitermachen.md)
- [ ] Rohordner `Scroll World` auf dein Backup-Laufwerk kopieren — Git sichert ihn seit V79 nicht mehr; er liegt nur noch im Hauptordner und in `C:\Users\chime\Sicherungen\JGC Studio\` (seit 2026-09-23)
- [ ] Ueber mich mit deinem Portrait am Handy durchscrollen (Gesicht gut erkennbar, kein Ruckeln?) (seit 2026-09-13)
- [ ] Monatlich: Stilprobe-Mails im Postfach stilprobe@ loeschen, die aelter als 30 Tage sind (V76) (seit 2026-09-13)
- [ ] Neues Vorschaubild bei LinkedIn auffrischen: jgc-lumen.de einmal im LinkedIn Post Inspector pruefen lassen, sonst zeigt LinkedIn tagelang das alte Bild (seit 2026-10-05)
- [ ] Sagen, ob dein Portrait-Foto unbearbeitet ist - dann schreibe ich "Das Portrait ist ein echtes Foto" neben den KI-Hinweis (seit 2026-10-05)
- [ ] Entscheiden, ob die V60-Notizen vom 26./27.09. (Branch claude/zertifikat-sicherheit-c4def1, nur Doku) nach main sollen (seit 2026-10-05)
