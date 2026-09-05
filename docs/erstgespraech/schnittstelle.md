# Erstgespräch — Schnittstelle Website ↔ PHP-Empfangsschicht

Stand: 2026-08-26. Das Formular lebt in der Scroll-Reise (`der-weg/index.html`, deployt an die Wurzel `/`) als Overlay hinter dem Knopf „Erstgespräch anfragen" und dem Button in der
Vertiefung „Wie geht es weiter?"; ohne JavaScript steht es als Lesetext mit nativem POST.
Die PHP-Empfangsschicht (`senden.php`) entsteht später (gleicher Baukasten wie die Stilprobe,
Repo `stilprobe-automatik`) und wird per FTP in einen eigenen Ordner `/erstgespraech/` auf
All-Inkl gelegt. Bis dahin läuft der Endpoint auf 404 — die Seite fängt das ab (Fehlermeldung
mit Mail-Ausweichweg `kontakt@jgc-lumen.de`). Konzept und Begründung („umgedrehte Terminfrage",
bewusst kein Buchungswerkzeug): `buchung-konzept.md` in diesem Ordner.

Der Endpoint ist mit Absicht ein EIGENER Ordner an der Wurzel und nicht `/stilprobe/`:
so bleibt die Stilprobe-Strecke unangetastet (deren Vertrag: `docs/stilprobe/schnittstelle.md`).

## POST /erstgespraech/senden.php (application/x-www-form-urlencoded bzw. multipart via FormData)

Felder:
- `name` (Text, Pflicht)
- `email` (E-Mail, Pflicht)
- `telefon` (Text; Pflicht NUR wenn `rueckruf` = `ja` — mit JavaScript erzwingt das die Seite,
  ohne JavaScript ist das Feld sichtbar und optional, dann prüft der Server die Kombination:
  `rueckruf` = `ja` ohne Telefonnummer → wie Fehler behandeln, Antwort mit Mail-Ausweichweg)
- `anliegen` (mehrzeilig, 100–2.000 Zeichen, Pflicht)
- `zeitfenster` (mehrzeilig kurz, max. 500 Zeichen, Pflicht)
- `rueckruf` (optional, Wert `ja`)
- `einwilligung` = `ja` (Pflicht-Checkbox)
- `firma` (Honeypot — MUSS leer sein, sonst Spam)
- `geladen_ts` (Millisekunden-Zeitstempel des Seitenladens, von JS gesetzt; leer bei
  No-JS-Clients — Zeitcheck dann serverseitig nicht möglich, mild behandeln)

Antwort-Vertrag (für den fetch-Pfad der Seite):
- Erfolg: HTTP 2xx + JSON `{"status":"ok"}`
- Alles andere (kein 2xx, kein JSON, Timeout 10 s) → Seite zeigt Fehlermeldung mit
  Mail-Ausweichweg `kontakt@jgc-lumen.de`
- No-JS-Fallback: normales POST; senden.php muss dann eine HTML-Dankeseite liefern
- Kein Kontingent, keine Warteliste — anders als bei der Stilprobe gibt es hier keinen Deckel.

Empfänger der Anfrage-Mail: `kontakt@jgc-lumen.de` (bestätigt empfangsfähig).

## Festgelegte Wortlaute (Entscheidungen Gabriels, 26.08.2026)

- Label `zeitfenster` normal: „Wann bist du in den nächsten zwei Wochen gut erreichbar?"
  mit Hilfetext „Nenn mir zwei oder drei Fenster, dann schlage ich dir passende Termine vor.
  (z. B. „Di und Do vormittags, Mi ab 17 Uhr")"
- Label `zeitfenster` bei gesetztem Rückruf-Häkchen: „Wann erreiche ich dich am besten?"
- Rückruf-Häkchen: „Lieber ein kurzer Rückruf? Dann melde ich mich telefonisch statt per Mail."
- Antwortversprechen OHNE Frist (bewusst, Punkt 2 des Konzepts): „Du bekommst eine Antwort
  mit zwei Terminvorschlägen."

## Platzhalter (beim Umzug auf den PHP-Host scharf schalten)

- Formular-`action` steht ABSOLUT und wurzel-relativ im HTML: `/erstgespraech/senden.php`
  (`der-weg/index.html`; `der-weg/formulare.js` ist pfadfrei). Der frühere GitHub-Präfix ist
  seit 02.09.2026 weg.
- Die Mail-Ausweichadresse steht als `data-mail`-Attribut am Formular-Artikel in
  `der-weg/index.html`.
- `/erstgespraech/`-Ordner auf dem PHP-Host anlegen und `senden.php` dorthin legen (FTP-Schritt,
  zusätzlich zur Stilprobe). GitHub Pages selbst führt kein PHP aus.

## Spam-Schutz (serverseitig zu prüfen)

Wie bei der Stilprobe: Honeypot `firma` leer + Mindest-Ausfüllzeit 20 s ab `geladen_ts` +
dateibasiertes Rate-Limit je IP. Kein Captcha (Markenentscheidung).
