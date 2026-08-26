> **Hinweis zur Einordnung (26.08.2026):** Dieses Konzept stammt wortgleich von Gabriel
> (Datei `erstgespraech-buchung.md`). Es wurde am 26.08.2026 in der Scroll-Variante
> `/der-weg/` umgesetzt (Formular-Overlay). Für die Technik maßgeblich ist
> `schnittstelle.md` in diesem Ordner; die offenen Punkte am Ende sind dort entschieden.

# Erstgespräch buchen — beschlossener Weg

Stand: 2026-08-26. **Entschieden, noch nicht gebaut.** Diese Datei ist der Auftrag für die
Session, die es umsetzt.

## In einem Satz

Die Seite bekommt ein Anfrageformular, in dem der Besucher **seine eigenen Zeitfenster** nennt;
Gabriel gleicht sie mit seiner echten Woche ab und antwortet mit zwei konkreten Terminvorschlägen.
Wer lieber telefoniert, setzt im selben Formular ein Häkchen für einen Rückruf.

## Warum genau so, und nicht mit einem Buchungswerkzeug

Gabriel führt keinen zuverlässig gepflegten Online-Kalender. Er hat zwar einen groben
Wochenrhythmus, ist aber so verschieden gefordert, dass er nicht sagen kann „immer montags
16 Uhr habe ich Zeit". Fest vereinbarte Termine nimmt er zuverlässig wahr — er darf sich nur
erst festlegen, wenn er die Woche kennt.

Ein Buchungswerkzeug mit angebundenem Kalender würde deshalb Termine anbieten, die es in
Wahrheit nicht gibt. Die umgedrehte Terminfrage dreht das um: **die Seite verspricht nie einen
Slot.** Sie sammelt nur, wann der Besucher kann, und die Zusage kommt von Gabriel.

## Ausgangslage

Der Erstgespräch-Knopf in V18 ist heute ein `mailto:kontakt@jgc-lumen.de` mit vorbelegtem
Betreff (V2, erledigt), darunter steht die Adresse sichtbar. **Dieser Mailweg bleibt** — er ist
der Ausweichweg, wenn das Formular scheitert oder JavaScript fehlt. Das Formular tritt daneben,
es ersetzt ihn nicht.

## Weg 3 — das Formular

Felder, bewusst kurz gehalten:

| Feld | Art | Pflicht |
| --- | --- | --- |
| `name` | Text | ja |
| `email` | E-Mail | ja |
| `telefon` | Text | nur wenn Rückruf gewählt |
| `anliegen` | mehrzeilig, ~100–2.000 Zeichen | ja |
| `zeitfenster` | mehrzeilig, kurz | ja |
| `rueckruf` | Checkbox, Wert `ja` | nein |
| `einwilligung` | Checkbox, Wert `ja` | ja |
| `firma` | Honeypot, muss leer bleiben | — |
| `geladen_ts` | Zeitstempel des Seitenladens, von JS gesetzt | — |

Die tragende Frage ist `zeitfenster`. Wortlaut-Vorschlag für das Label:

> **Wann bist du in den nächsten zwei Wochen gut erreichbar?**
> Nenn mir zwei oder drei Fenster, dann schlage ich dir passende Termine vor.
> *(z.B. „Di und Do vormittags, Mi ab 17 Uhr")*

Darunter das Antwortversprechen, sichtbar und knapp: „Du bekommst in der Regel innerhalb eines
Werktags eine Antwort mit zwei Terminvorschlägen."

## Weg 5 — der Rückruf als Häkchen

Ein einzelnes Kästchen im selben Formular, kein zweites Formular:

> ☐ **Lieber ein kurzer Rückruf?** Dann melde ich mich telefonisch statt per Mail.

Verhalten beim Setzen des Häkchens: das Telefonfeld wird eingeblendet und zur Pflicht, und die
Beschriftung von `zeitfenster` wechselt auf „Wann erreiche ich dich am besten?". Ohne
JavaScript bleibt das Telefonfeld sichtbar und optional — dann prüft der Server die Kombination.

Das kostet nichts und holt die Leute ab, die lieber sprechen als schreiben.

## Technischer Anschluss

Das Formular folgt demselben Vertrag wie das Stilprobe-Formular, damit die PHP-Empfangsschicht
nichts Neues lernen muss. Maßgeblich ist `docs/stilprobe/schnittstelle.md`:

- Erfolg: HTTP 2xx + JSON `{"status":"ok"}`
- Alles andere, auch Zeitüberschreitung nach 10 s → Fehlermeldung mit Mail-Ausweichweg
- Ohne JavaScript: normales POST, der Server liefert eine HTML-Dankeseite
- Spam-Schutz wie dort: Honeypot `firma` leer, Mindest-Ausfüllzeit ab `geladen_ts`,
  dateibasiertes Rate-Limit je IP. **Kein Captcha** (Markenentscheidung).
- Empfänger: `kontakt@jgc-lumen.de` (bestätigt empfangsfähig)

Wie bei der Stilprobe existiert der Endpoint erst nach dem All-Inkl-Umzug. Bis dahin greift by
design der Fallback, also die Fehlermeldung mit dem Mailweg.

## Nicht enthalten

- Kein Buchungswerkzeug (Calendly, cal.com und Verwandte), keine Kalenderanbindung
- Keine automatische Terminbestätigung, keine Erinnerungsmails, kein Videokonferenz-Link
- Keine Änderung an der Stilprobe-Strecke
- Kein Umbau oder Entfernen des bestehenden Mail-CTA

## Später möglich, wenn das Hin-und-Her nervt

Ein Buchungswerkzeug **ohne Kalenderanbindung** obendrauf: Gabriel gibt einmal die Woche von
Hand die Termine frei, die er wirklich hat (in cal.com heißen solche punktuellen Freigaben
„Datums-Ausnahmen"). Der Besucher bucht dann selbst und bekommt automatisch eine Erinnerung.
Das Formular bleibt in dem Fall als Auffangnetz stehen, damit niemand vor einer leeren
Buchungsseite steht, wenn das Freigeben mal ausfällt. Erst dann wird auch ein Vertrag über
Auftragsverarbeitung mit dem Anbieter fällig — beim eigenen Formular auf All-Inkl nicht, weil
die Daten den eigenen Server nie verlassen.

## Offene Punkte für die Umsetzungs-Session

1. **Wohin postet das Formular?** Die Stilprobe nutzt ein relatives `senden.php` in ihrem
   eigenen Ordner. Für die Hauptseite braucht es entweder einen eigenen Endpoint an der Wurzel
   oder einen absoluten Pfad. Vorschlag: eigener Endpoint, weil das die Stilprobe-Strecke
   unangetastet lässt. Vor dem Bau mit Gabriel klären.
2. **Wortlaut des Antwortversprechens.** „Innerhalb eines Werktags" nur auf die Seite schreiben,
   wenn Gabriel es hält — ein gebrochenes Versprechen kostet mehr als gar keines.
3. **Platzierung.** Ersetzt das Formular den Knopf im `#kontakt`-Abschnitt, oder klappt es unter
   ihm auf? Der Mailweg muss in jedem Fall sichtbar bleiben.
4. **Datenschutzerklärung** braucht einen Absatz zum Formular. Sie liegt in `site/` und ist
   ohnehin noch nicht gefüllt (siehe V3, Impressum).
