# Stilprobe — Schnittstelle Website ↔ PHP-Empfangsschicht

Stand: 2026-09-13. Die Website-Seite (`stilprobe/index.html`, deployt nach `/stilprobe/`) ist gebaut; die PHP-Empfangsschicht (`senden.php`, `kontingent.php`) liegt im **privaten Repo `stilprobe-automatik`** (`C:\Projekte\Stilprobe-Automatik`) und wird per FTP auf den All-Inkl-Webspace gelegt. Konzept: siehe `stilprobe-automatisierung-konzept_v1.md` in diesem Ordner.

**Der Empfänger hat eine eigene Adresse:** `https://formular.jgc-lumen.de`. GitHub Pages führt kein PHP aus, und die Website soll wegen ihrer sieben Videoetappen (46 MB) auf GitHubs Netz bleiben — deshalb nur die Endpunkte bei All-Inkl, nicht die ganze Seite. Folgen für diesen Vertrag:

- Alle `action`- und Badge-Adressen stehen **vollständig** im HTML (nicht mehr relativ, nicht mehr wurzel-relativ). Ein Formular ohne JavaScript braucht sein Ziel im `action`-Attribut, also lässt sich das nicht in eine Variable ziehen. `scripts/pruefe-seiten.mjs` (Regel 13) prüft, dass alle sieben Stellen denselben Rechnernamen tragen.
- Die Antwort muss den Kopf `Access-Control-Allow-Origin` tragen, sonst gibt der Browser sie nicht an die Seite weiter. Die erlaubten Adressen stehen in `konfig.php` der Empfangsschicht.
- Ohne JavaScript landet der Absender auf einer Bestätigungsseite **unter `formular.jgc-lumen.de`** — eine andere Adresse als die Website. Das ist der bewusst in Kauf genommene Preis dafür, dass die Reise schnell bleibt.

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

## GET kontingent.php (Monatszustand, gerufen von der Unterseite UND der Scroll-Reise)

Seit 26.08.2026 ruft auch die Scroll-Reise (`der-weg/index.html` + `der-weg/formulare.js`)
den Monatszustand und `senden.php` — absolut, mit demselben Feld- und Antwort-Vertrag, inklusive
Warteliste- und Pause-Zweig. Der Zustand wird dort erst beim ersten Öffnen des
Formular-Overlays abgerufen. Der Entwurfsspeicher teilt den localStorage-Schlüssel
`stilprobe-entwurf-v1` mit der Unterseite (gleiche Feldnamen, gleiche Origin).

Antwort: `{"monat":"Juli","frei":9,"deckel":15,"status":"frei"}` mit `status` ∈ `frei` | `knapp` (≤3) | `voll` | `pause`. Cachebar bis 10 Minuten. Timeout clientseitig 2 s; jeder Fehler lässt das normale Formular stehen.

**Seit dem 13.09.2026 abends gibt es keinen Monatsdeckel mehr** (Gabriels Entscheidung, Empfangsschicht 0.3.0). Die Antwort lautet dann `{"monat":"September","frei":null,"deckel":null,"status":"frei"}`: `frei` und `deckel` sind null, `voll` und `knapp` kommen nicht mehr vor, `pause` weiterhin. Setzt Gabriel in der Konfiguration wieder eine Zahl, gilt die Form darüber. Die Seiten brauchen dafür keine Änderung, weil sie nur `status` auswerten.
**Seit dem 13.09.2026 zeigt keine Seite mehr eine Zahl** (Gabriels Entscheidung: kein sichtbarer Monatsdeckel, und statt „binnen 48 Stunden" nur noch „zeitnah"). Die Antwort bleibt unverändert, damit der Vertrag mit der Empfangsschicht stabil bleibt; die Seiten werten nur noch `status` aus:
- `frei` und `knapp`: Nichts ändert sich, das Formular steht.
- `voll`: Umschalten auf das Wartelisten-Formular mit der Überschrift „Der {monat} ist voll." und dem Satz „Für diesen Monat sind alle Plätze vergeben. Trag dich ein, und du bekommst den ersten freien Platz im {folgemonat}."
- `pause`: Der Pause-Hinweis erscheint statt des Formulars.
- {folgemonat} wird clientseitig berechnet (deutscher Monatsname nach {monat}).

Bis zum 12.09.2026 stand auf beiden Seiten zusätzlich eine Zählerzeile („Im {monat} sind noch {frei} von {deckel} Proben frei – mehr gibt die Handarbeit nicht her.", statischer Ersatz „15 Proben im Monat – …"). Sie ist samt ihren Stylesheet-Regeln entfernt.

## Adressen

- `STILPROBE_MAIL` = `stilprobe@jgc-lumen.de` — steht seit dem 05.09.2026 auf beiden Seiten als `data-mail`-Attribut am Formular-Artikel, nicht mehr als Konstante im Skript; Suchbegriff: `stilprobe@`. Das Postfach war bis zum 12.09.2026 **nicht angelegt** (per SMTP nachgewiesen: `550 User unknown`), womit auch der Ausweichweg ins Leere lief.
- Interne Links sind seit 02.09.2026 wurzel-relativ (`/stilprobe/`, `/impressum/`, `/datenschutz/`); der frühere GitHub-Pages-Präfix ist weg, `scripts/pruefe-seiten.mjs` verbietet ihn. Impressum und Datenschutz sind eigene HTML-Seiten unter `/impressum/` und `/datenschutz/`, nicht mehr der Astro-Build.
- Die sieben Formular-Adressen (drei `action`, zwei `data-kontingent` auf zwei Seiten) zeigen seit 12.09.2026 vollständig auf `https://formular.jgc-lumen.de/…`. Der Pfad **hinter** dem Rechnernamen bleibt derselbe wie zuvor (`/stilprobe/senden.php`, `/stilprobe/kontingent.php`, `/erstgespraech/senden.php`) — zöge die Website später doch nach All-Inkl, genügt das Streichen des Rechnernamens.

## Spam-Schutz (serverseitig zu prüfen)

Honeypot `firma` leer + Mindest-Ausfüllzeit 20 s ab `geladen_ts` + dateibasiertes Rate-Limit je IP. Kein Captcha (Markenentscheidung).
