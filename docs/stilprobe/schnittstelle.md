# Stilprobe — Schnittstelle Website ↔ PHP-Empfangsschicht

Stand: 2026-07-11. Die Website-Seite (`stilprobe/index.html`, deployt nach `/stilprobe/`) ist gebaut; die PHP-Empfangsschicht (`senden.php`, `kontingent.php`) entsteht später im Repo `stilprobe-automatik` und wird per FTP in denselben `/stilprobe/`-Ordner auf All-Inkl gelegt. Bis dahin laufen beide Endpoints auf 404 — die Seite fängt das ab (statischer Kontingent-Satz, Fehlermeldung mit Mail-Ausweichweg beim Formular). Konzept: siehe `stilprobe-automatisierung-konzept_v1.md` in diesem Ordner.

## POST senden.php (Formular, application/x-www-form-urlencoded bzw. multipart via FormData)

Normales Formular — Felder:
- `name` (Text, Pflicht)
- `email` (E-Mail, Pflicht)
- `text_1`, `text_2`, `text_3` (je 200–6.000 Zeichen, Pflicht)
- `wunschthema` (Text, max. 160, Pflicht)
- `quelle` (optional: `linkedin` | `empfehlung` | `newsletter` | `video` | `anders` | leer)
- `eigene_texte` = `ja` (Pflicht-Checkbox)
- `einwilligung` = `ja` (Pflicht-Checkbox)
- `firma` (Honeypot — MUSS leer sein, sonst Spam)
- `geladen_ts` (Millisekunden-Zeitstempel des Seitenladens, von JS gesetzt; leer bei No-JS-Clients — Zeitcheck dann serverseitig nicht möglich, mild behandeln)

Wartelisten-Kurzformular — zusätzlich/abweichend:
- `warteliste` = `ja` (hidden), nur `name`, `email`, `einwilligung`, `firma`, `geladen_ts`

Antwort-Vertrag (für den fetch-Pfad der Seite):
- Erfolg Annahme: HTTP 2xx + JSON `{"status":"ok"}`
- Erfolg Warteliste: HTTP 2xx + JSON `{"status":"ok","zustand":"warteliste"}`
- Alles andere (kein 2xx, kein JSON, Timeout 10 s) → Seite zeigt Fehlermeldung mit Mail-Ausweichweg
- No-JS-Fallback: normales POST; senden.php muss dann eine HTML-Dankeseite liefern

## GET kontingent.php (Badge — gerufen von Hauptseite, Unterseite UND der Scroll-Reise)

Seit 26.08.2026 ruft auch die Scroll-Reise (`der-weg/index.html` + `der-weg/formulare.js`)
Badge und `senden.php` — absolut, mit demselben Feld- und Antwort-Vertrag, inklusive
Warteliste- und Pause-Zweig. Der Badge wird dort erst beim ersten Öffnen des
Formular-Overlays abgerufen. Der Entwurfsspeicher teilt den localStorage-Schlüssel
`stilprobe-entwurf-v1` mit der Unterseite (gleiche Feldnamen, gleiche Origin).

Antwort: `{"monat":"Juli","frei":9,"deckel":15,"status":"frei"}` mit `status` ∈ `frei` | `knapp` (≤3) | `voll` | `pause`. Cachebar bis 10 Minuten. Timeout clientseitig 2 s; jeder Fehler → statischer Satz bleibt stehen.

Anzeige-Wortlaute (in beiden Seiten identisch implementiert):
- statisch/Fallback: „15 Proben im Monat – mehr gibt die Handarbeit nicht her."
- frei: „Im {monat} sind noch {frei} von {deckel} Proben frei – mehr gibt die Handarbeit nicht her."
- knapp (frei=1 Singular): „Im {monat} ist noch 1 Probe frei. Danach beginnt die Warteliste für den {folgemonat}."
- knapp: „Im {monat} sind noch {frei} Proben frei. Danach beginnt die Warteliste für den {folgemonat}."
- voll (Unterseite): „Der {monat} ist voll – {deckel} Proben, mehr gibt die Handarbeit nicht her." + Umschalten auf Wartelisten-Formular
- voll (Hauptseite): „Der {monat} ist voll – {deckel} Proben, mehr gibt die Handarbeit nicht her. Auf der Stilprobe-Seite kannst du dich für den {folgemonat} eintragen."
- pause: „Die Stilprobe macht gerade eine kurze Pause – schau bald wieder vorbei." + Unterseite blendet Pause-Hinweis statt Formular ein
- {folgemonat} wird clientseitig berechnet (deutscher Monatsname nach {monat}).

## Platzhalter (beim All-Inkl-Umzug scharf schalten)

- `STILPROBE_MAIL` = aktuell `stilprobe@jgc-lumen.de` (Domain unbestätigt) — steht als const in den Inline-Scripts der Unterseite; Suchbegriff: `stilprobe@`.
- Interne Links nutzen den GitHub-Pages-Präfix `/jgc-studio-website/…` — beim Umzug per Suchen-Ersetzen auf `/` umstellen (betrifft `variants/standalone/18-lumen/index.html`, `stilprobe/index.html` und `der-weg/index.html` — dort auch die Formular-`action`s und der Badge-Pfad; zusätzlich `docs/erstgespraech/schnittstelle.md` beachten: eigener Ordner `/erstgespraech/` mit eigenem `senden.php`).
- Die Rechtslinks zeigen auf `/jgc-studio-website/main/impressum/` bzw. `…/main/datenschutz/` — beim Umzug prüfen, wohin Impressum/Datenschutz dann ausgeliefert werden (das `/main/`-Segment ist eine GitHub-Pages-Eigenheit des Astro-Builds).
- Formular-`action` und Badge-`fetch` der Unterseite sind RELATIV (`senden.php`, `kontingent.php`) und funktionieren nach dem Umzug unverändert; die Hauptseite UND die Scroll-Reise rufen absolut (`/jgc-studio-website/stilprobe/kontingent.php` bzw. `…/senden.php`) — diese Pfade wandern mit dem Präfix-Suchen-Ersetzen.

## Spam-Schutz (serverseitig zu prüfen)

Honeypot `firma` leer + Mindest-Ausfüllzeit 20 s ab `geladen_ts` + dateibasiertes Rate-Limit je IP. Kein Captcha (Markenentscheidung).
