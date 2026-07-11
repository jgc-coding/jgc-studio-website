# Die Stilprobe – Automatisierungs- und Umsetzungskonzept

**Version:** 1.1
**Stand:** 10.07.2026
**Status:** Entwurf zur Freigabe
**Herkunft:** Baut auf `stilprobekonzept_v1.md` (Kernidee, Konditionen, Leitplanken) auf und übersetzt es in eine automatisierte, von Claude Code baubare Lösung. Website-Bezug: Live-Variante 18 (JGC Lumen) und Design-Briefing v8. Infrastruktur seit v1.1: ohne Mietserver – All-Inkl-Webspace als Empfangsschicht plus Gabriels vorhandenes Laptop-n8n als Werkstatt.
**Zweck:** Übergabedokument an Claude Code. Dieses Dokument ist bewusst selbsttragend – alle Texte, Prompts, Datenmodelle und Abnahmekriterien stehen hier drin, damit die Umsetzung ohne Rückgriff auf andere Dokumente laufen kann.

---

## 0. An Claude Code: Wie du dieses Dokument benutzt

Du baust die **Stilprobe-Automatik**: Ein Coach reicht drei eigene Texte über die Website ein, eine Pipeline erzeugt automatisch zwei Fassungen eines neuen Entwurfs plus drei Beobachtungen plus die fertige Rückgabe-Mail. **Nichts davon geht an den Coach raus, bevor Gabriel es nicht ausdrücklich freigegeben hat.** Gabriel prüft und steuert per Telegram und E-Mail.

Feste Regeln für die gesamte Umsetzung:

1. **Human-in-the-loop ist hart, nicht dekorativ.** Jede inhaltliche Nachricht an einen Coach braucht eine explizite Freigabe je Nachricht. Einzige Ausnahmen: die Eingangsbestätigung und die Wartelisten-Bestätigung (fixe Templates ohne KI-generierten Inhalt, siehe Abschnitt 8).
2. **Bei Fehlern: anhalten, melden, nichts senden.** Jeder Pipeline-Fehler erzeugt einen Telegram-Alarm an Gabriel; die Probe bleibt in ihrem Status. Es gibt keinen Auto-Retry, der still Ergebnisse verändert.
3. **Alle Außentexte auf Deutsch, Du-Form, nach den Sprachregeln in Abschnitt 12.** Buttons ohne Ausrufezeichen. Kein „Klon", kein „skalieren", kein „Funnel".
4. **Kein Tracking.** Keine Öffnungs-Pixel in Mails, keine Analytics-Snippets von Drittanbietern auf der Unterseite. Kennzahlen entstehen ausschließlich aus eigenen Status-Events (Abschnitt 10).
5. **Arbeite in Phasen (Abschnitt 13) und hole dir nach jeder Phase Gabriels Abnahme.** Jede Phase hat Testkriterien; erst grün, dann weiter.
6. **Sandbox zuerst.** Bis zur Endabnahme steht `sandbox=true`: sämtliche ausgehenden Mails gehen an Gabriels Adresse statt an den Coach.
7. **Zeitzone Europe/Berlin** für alle Fristen, Zähler und Reports. Secrets nur in `.env`, nie im Repo.
8. **Platzhalter:** `jgc-lumen.de` ist als Domain angenommen, aber noch nicht bestätigt. Verwende überall die Variablen `DOMAIN` und `STILPROBE_MAIL` (z. B. `stilprobe@jgc-lumen.de`). Eine eigene Subdomain oder ein Mietserver ist **nicht** nötig: Die Empfangsschicht liegt als PHP-Skripte mit auf dem Webspace der Website (`DOMAIN/stilprobe/…`).
9. **Zwei Laufumgebungen, eine Verantwortung:** Die PHP-Empfangsschicht (All-Inkl) muss ohne das Laptop-n8n funktionieren – und das Laptop-n8n muss jeden Rückstand aufholen können, wenn es startet (Idempotenz, Zeitstempel-Logik statt „genau jetzt"-Annahmen).

---

## 1. Kernidee und Automatisierungs-Zielbild

### 1.1 Was unverändert aus dem Stilprobe-Konzept v1 gilt

- **Kernidee:** Drei eigene Texte rein, binnen 48 Stunden ein neuer Entwurf in zwei Fassungen zurück (A generisch, B in der Handschrift des Coaches, mit einem benannten Merkmal) plus drei Beobachtungen zur Sprache. Beweis statt Behauptung.
- **Konditionen:** Kostenlos, ohne Haken. Gedeckelt auf **15 Proben pro Monat** (Plan-Variante C; als Einstellung änderbar). 48-Stunden-Zusage als Qualitätssignal.
- **Einordnung:** Marketing, kein Produkt. Ersetzt weder Erstgespräch noch Praxis-Check. Weg: Stilprobe → Erstgespräch → Praxis-Check → Umsetzung.
- **Leitplanken:** Nur eigene Texte des Coaches, keine Sitzungsnotizen, nichts von oder über Klient:innen. Löschung nach 30 Tagen. Veröffentlichung von Ausschnitten nur anonymisiert und nach separater Freigabe.
- **Messung und Abbruchregeln** aus v1 §9 (Übergang Probe → Erstgespräch, Ziel 30–40 %).

### 1.2 Was sich durch die Automatisierung ändert

| Vorher (v1, Halbautomatik) | Jetzt (dieses Konzept) |
|---|---|
| Gabriel stößt jede Analyse und jeden Entwurf von Hand an | Formular-Eingang startet die Pipeline von selbst |
| Rückgabe-Mail wird von Hand geschrieben | Rückgabe-Mail kommt fertig zur Freigabe |
| Wiedervorlage nach 5 Tagen als Merkzettel | Nachfass-Entwurf entsteht automatisch, wartet auf Freigabe |
| Löschung nach 30 Tagen als Vorsatz | Löschjob läuft täglich, nachweisbar im Ereignis-Log |
| Deckel und Warteliste im Kopf | Zähler, Warteliste und Website-Anzeige laufen automatisch |
| Aufwand je Probe: 30–45 Minuten | **Ziel: unter 10 Minuten** – lesen, Feinschliff, freigeben |

Der Charakter bleibt: **Die Automatik schreibt vor, Gabriel entscheidet.** Das ist zugleich das Markenversprechen („Nichts geht raus, ohne dass du es gesehen hast") am eigenen Prozess vorgelebt – und genau so wird es dem Coach gegenüber auch benannt.

### 1.3 Grundsatzentscheidungen (am 09./10.07.2026 mit Gabriel geklärt)

1. **Infrastruktur: kein Mietserver.** Arbeitsteilung zwischen zwei vorhandenen Dingen: (a) Der **All-Inkl-Webspace** der Website übernimmt als PHP-Empfangsschicht alles, was rund um die Uhr laufen muss (Formular annehmen, Eingangsbestätigung, Kontingent-Zähler, Telegram-Ping an Gabriel). (b) **Gabriels vorhandenes n8n (Docker auf dem Laptop)** ist die Werkstatt: Es holt neue Einreichungen aus dem Postfach, sobald der Laptop läuft, und erledigt Wächter, Textwerk, Freigabe und Versand. Das Postfach `STILPROBE_MAIL` ist dabei die Warteschlange – nichts geht verloren, wenn der Laptop aus ist. Zusatzkosten: 0 €, alles deutsch gehostet. Die n8n-Instanz bleibt zugleich Übungsplatz und Referenz für Klienten-Umsetzungen.
2. **Text-Engine:** Claude (Anthropic). Zwei austauschbare Betriebsarten, per Einstellung umschaltbar (Abschnitt 6.2): über Gabriels Claude-Abo (Claude Code headless, keine Zusatzkosten) oder über die Anthropic-API (vertraglich sauberste Basis, grob unter 2 € je Probe). Transparenz-Hinweis an den Coach ist Pflicht (Abschnitt 9).
3. **Freigabe:** Telegram **und** Mail, beides parallel. Telegram als schneller Steuerkanal (Buttons, Anweisungen), Mail als Lesekanal mit Volltext und Freigabe-Links.
4. **Postfach:** Neue dedizierte Adresse `STILPROBE_MAIL` bei All-Inkl (SMTP für Versand, IMAP für Abholung und Antwort-Erkennung). Das Postfach ist zugleich der Übergabepuffer zwischen Webspace und Laptop.
5. **Startkopplung:** Die Stilprobe geht mit dem ohnehin geplanten Umzug der Website zu All-Inkl live (GitHub Pages kann kein PHP). Gebaut und getestet wird vorher – lokal und auf dem Webspace, sobald er da ist.

---

## 2. Ablauf aus Sicht des Coaches (automatisiert)

1. Coach findet die Stilprobe auf der Website (Sektion auf der Hauptseite → Unterseite `/stilprobe/`) oder über Direktnachricht, Video, Partner.
2. Er füllt das Formular aus: Name, E-Mail, drei eigene Texte, ein Wunschthema, zwei Bestätigungen (eigene Texte / Datenschutz). Dauer: unter fünf Minuten.
3. **Sofort:** Eingangsbestätigung per Mail – was jetzt passiert, 48-Stunden-Zusage, Löschzusage, Kontaktweg.
4. **Binnen 48 Stunden:** die Rückgabe-Mail mit Fassung A, Fassung B (mit benanntem Merkmal), drei Beobachtungen und der leisen Einladung zum Erstgespräch. Von Gabriel persönlich geprüft und freigegeben – dieser Satz steht auch in der Mail.
5. Antwortet der Coach, übernimmt Gabriel persönlich. Antwortet er nicht, kommt nach fünf Tagen genau ein leises Nachfassen. Danach Ruhe.
6. Nach 30 Tagen werden seine Texte und alle Zwischenergebnisse gelöscht; das wurde ihm in der Rückgabe-Mail angekündigt.

Ist der Monat voll, sieht der Coach das vor dem Ausfüllen: Das Formular wird zur Warteliste („Der Juli ist voll. Trag dich ein, und du bekommst den ersten freien Platz im August.").

---

## 3. Ablauf intern: die Zustandsmaschine

Jede Probe hat genau einen Status. Alle Übergänge werden als Ereignis protokolliert (Audit-Log, Abschnitt 7.2) – Audit-first gilt auch intern.

| Status | Bedeutung | Wie es weitergeht |
|---|---|---|
| `neu` | Von der PHP-Empfangsschicht angenommen (Basis-Checks bestanden, Slot gezählt, Bestätigung raus, als Mail im Postfach) | n8n holt die Einreichung beim nächsten Lauf und startet die Eingangsprüfung (P1) |
| `rueckfrage` | Wächter meldet Verdacht (Klienten-Inhalte, Spam, zu dünnes Material) | **Gabriel entscheidet** per Telegram: annehmen / freundlich ablehnen |
| `warteliste` | Deckel voll | Monatswechsel → Einladung (mit Freigabe) |
| `angenommen` | Slot reserviert, Eingangsbestätigung versendet | Pipeline startet (P2–P7) |
| `in_arbeit` | Text-Engine läuft | Ergebnis fertig → `zur_freigabe` |
| `zur_freigabe` | Entwurf liegt bei Gabriel (Telegram + Mail) | Freigeben / Überarbeiten (Schleife) / Ablehnen |
| `versendet` | Rückgabe-Mail ist beim Coach | T+5 Tage ohne Antwort → Nachfass-Entwurf |
| `nachfass_zur_freigabe` | Nachfass-Entwurf liegt bei Gabriel | Freigeben → `nachfass_versendet` |
| `nachfass_versendet` | Nachfassen ist raus | Antwort → `antwort_erhalten`, sonst T+30 → Löschung |
| `antwort_erhalten` | Coach hat geantwortet | Gabriel übernimmt persönlich; Automatik ist still |
| `abgelehnt` | Von Gabriel abgelehnt (mit oder ohne Absage-Mail) | T+30 → Löschung |
| `geloescht` | Inhalte entfernt, Metadaten für Kennzahlen bleiben | Endzustand |

**SLA-Wächter, zweistufig:** (1) Unabhängig vom Laptop schickt schon die PHP-Empfangsschicht bei jedem Eingang einen Telegram-Ping an Gabriel („Neue Probe von {{name}} – Frist bis {{frist}}"). Der 48-Stunden-Countdown ist damit nie unsichtbar, auch wenn n8n gerade nicht läuft. (2) Sobald n8n läuft: Erinnerung bei `zur_freigabe` älter als 36 Stunden, dringende Erinnerung ab 44 Stunden. Die Zusage reißt nie an der Technik, höchstens sichtbar an der Entscheidung.

**Deckel-Logik:** Der Zähler lebt als `zaehler.json` auf dem Webspace und wird von der PHP-Empfangsschicht geführt – Slot-Reservierung **bei Annahme durch PHP**, nicht erst bei Versand. `frei = deckel − angenommene(Monat)`. Bei 0 schaltet das Formular auf Warteliste; der Monatswechsel setzt automatisch zurück (Datumslogik in PHP, kein Laptop nötig). Lehnt Gabriel eine Probe später ab, gibt n8n den Slot über den Admin-Endpunkt wieder frei. Der Deckel (Start: 15) steht in der PHP-Konfiguration und gespiegelt in `einstellungen`.

---

## 4. Architektur

```
┌──────────────── All-Inkl (immer an, im Website-Tarif enthalten) ────────────────┐
│  Website (statisch)  ·  /stilprobe/ mit Formular                                 │
│  senden.php      ← POST vom Formular (same-origin, kein CORS)                    │
│    ├─ Basis-Checks (Pflichtfelder, Honeypot, Zeitcheck, Längen, Rate-Limit)      │
│    ├─ Kontingent zählen (zaehler.json) → annehmen oder Warteliste                │
│    ├─ Einreichung als strukturierte Mail → Postfach STILPROBE_MAIL (Warteschlange)│
│    ├─ Eingangs- bzw. Wartelisten-Bestätigung an den Coach (sofort)               │
│    └─ Telegram-Ping an Gabriel (Frist startet sichtbar)                          │
│  kontingent.php  ← GET Badge-JSON für die Website · Admin-Ops mit Geheimschlüssel │
└──────────────────────────────────────────────────────────────────────────────────┘
                                   │ Postfach = Puffer
┌──────────────── Gabriels Laptop (Werkstatt, läuft wenn er arbeitet) ─────────────┐
│  n8n (vorhandenes Docker-Setup, erweitert) + kleine Datenbank                    │
│    ├─ IMAP-Abholung neuer Einreichungen → Wächter (P1)                           │
│    ├─ Text-Engine Claude (Abo-Betrieb: CLI · API-Betrieb: Anthropic API)         │
│    ├─ Freigabe: Telegram-Bot + Freigabe-Mail an Gabriel                          │
│    ├─ Versand über All-Inkl-SMTP (stilprobe@) nach Freigabe                      │
│    └─ Timer-Jobs mit Aufhol-Logik (Nachfassen, Löschung, Report)                 │
└──────────────────────────────────────────────────────────────────────────────────┘
```

Komponenten und ihre Rollen:

- **PHP-Empfangsschicht (`/stilprobe/senden.php`, `kontingent.php`, `zaehler.json`):** liegt mit auf dem Webspace der Website – keine eigene Domain, keine Subdomain, kein Server. Sie erledigt alles Zeitkritische ohne KI: annehmen, bestätigen, zählen, pingen. PHP und cURL sind bei All-Inkl Standard.
- **Postfach `STILPROBE_MAIL` als Warteschlange:** Jede angenommene Einreichung liegt als strukturierte Mail (maschinenlesbarer Block) im Postfach, bis das Laptop-n8n sie abholt. Robust: Laptop aus = Mails warten; nichts geht verloren.
- **n8n (vorhandenes Docker-Setup auf dem Laptop, erweitert):** Wächter, Textwerk, Freigabe-Logik, Versand, Timer. Workflows liegen versioniert als JSON im Repo. Alle Jobs sind idempotent und holen Verpasstes beim Start nach.
- **Datenbank:** kleine DB neben n8n (Postgres im Compose oder SQLite-Volume – Claude Code entscheidet nach vorhandenem Setup; bei 15 Proben/Monat reicht beides), Schema in Abschnitt 7.
- **Text-Engine:** ein einziger, klar definierter Auftrag je Probe mit JSON-Ausgabe (Abschnitt 6), zwei Betriebsarten.
- **Telegram-Bot:** Steuerkanal für Gabriel (Whitelist auf seine Chat-ID). Der Eingangs-Ping kommt aus PHP, alles Weitere aus n8n – gleicher Bot.
- **Admin-Endpunkt (`kontingent.php` mit Geheimschlüssel):** n8n meldet Slot-Freigaben (bei Ablehnung) und den `/pause`-Zustand an den Webspace.

**Laufende Kosten:** 0 € zusätzlich – Webspace und Postfach stecken im All-Inkl-Tarif der Website, Telegram ist kostenlos, Claude läuft im Abo-Betrieb ohne Zusatzkosten (bzw. im API-Betrieb grob unter 2 € je Probe).

**Bewusst akzeptierte Grenze:** Die Verarbeitung wartet, bis der Laptop läuft. Bei täglicher Laptop-Nutzung und 48-Stunden-Frist ist das unkritisch; der PHP-Telegram-Ping macht jeden Eingang sofort sichtbar. Für längere Abwesenheit gibt es den `/pause`-Schalter (Formular zeigt dann einen ehrlichen Hinweis). Wächst das Volumen oder nervt die Kopplung an den Laptop, zieht das n8n unverändert auf einen kleinen Server um – die Architektur bleibt gleich, nur der Standort wechselt.

**Strategischer Doppelnutzen:** Dieselbe Pipeline (Stilanalyse → Entwurf in Handschrift → Freigabe → Versand) ist der technische Kern des Bausteins „Content-Stimme". Was hier für die eigene Akquise entsteht, ist zugleich Blaupause und Demo-Objekt für Klienten-Umsetzungen.

---

## 5. Website-Integration: wo und wie die Stilprobe angeboten wird

> Grundlage: Live-Variante 18 (`variants/18-lumen/`, Marke „JGC Lumen") und Design-Briefing v8. Der mitgegebene Screenshot kam technisch unlesbar an (durchgehend schwarz); sollte die Live-Fassung vom Screenshot abweichen, vor Umsetzung kurz gegenprüfen. Alle neuen Elemente nutzen die bestehenden Design-Tokens der Seite (Farben, Typo, Buttons, Karten – nichts Neues erfinden).

### 5.1 Überblick der Eingriffe

| Ort | Änderung | Rolle |
|---|---|---|
| Navigation | Neuer Anker „Stilprobe" (erster Eintrag, vor „Angebote") | Sichtbarkeit der weichsten Tür |
| Hero | Sekundär-CTA „Angebote ansehen" → **„Die Stilprobe ansehen"** (Anker `#stilprobe`) | Zweiter Handlungsaufruf neben dem Erstgespräch (v1 §7) |
| **Neue Sektion `#stilprobe`** | Zwischen „Deine Woche, zwei Versionen" und „So gehen wir gemeinsam vor" | Der Beweis direkt nach dem Versprechen, vor dem Weg |
| **Neue Unterseite `/stilprobe/`** | Erklärung + Formular + Datenschutz-Klartext + Mini-FAQ | Der eigentliche Einreichungsort |
| Final-CTA | Sekundär-Aktion → „oder starte mit der Stilprobe →" | Weiche Alternative zum Gespräch |
| FAQ | Neue Frage „Was ist die Stilprobe?" + ein Satz in FAQ 1 (Ablauf) | Einordnung in den Weg |
| Footer | Link „Stilprobe" in der Navigations-Spalte | Auffindbarkeit |
| Datenschutzseite | Neuer Abschnitt „Die Stilprobe" (Abschnitt 9.3) | Rechtliche Grundlage |

Der Haupt-CTA der Seite bleibt unangetastet das Erstgespräch – die Stilprobe ist die zweite, weichere Tür, kein Ersatz.

### 5.2 Neue Sektion auf der Hauptseite (`#stilprobe`)

Platzierung im Erzählbogen: „Deine Woche, zwei Versionen" zeigt das Versprechen – die Stilprobe-Sektion sagt unmittelbar danach „du musst mir das nicht glauben", **dann** kommt der Weg mit den Schritten. Gestaltung: Pergament-Hell, zweispaltiges Vergleichselement analog zum Vorher-Nachher-Block (links Holz-Sand-Akzent = generisch, rechts Salbei-Akzent = Handschrift) – eine bewusste visuelle Wiederholung des stärksten Musters der Seite.

Inhalt (Copy ist final, nur der Beispiel-Ausschnitt ist Platzhalter):

- **Eyebrow (Versalien, Kupfer-Ocker):** DIE STILPROBE
- **H2 (Fraunces):** Lies dich selbst.
- **Kicker (Inter, gedimmt):** Du musst mir nichts glauben. Schick mir drei deiner Texte, und du bekommst binnen 48 Stunden einen neuen Entwurf in zwei Fassungen zurück: einmal generisch, einmal in deiner Handschrift. Dazu drei Beobachtungen zu deiner Sprache. Kostenlos, ohne Haken.
- **Vergleichselement, zwei Spalten:**
  - Links, Überschrift *Fassung A – ohne Handschrift*: kurzer Beispiel-Ausschnitt (3–4 Zeilen, generisch). `[PLATZHALTER: Ausschnitt aus Gabriels eigener Probe, siehe Phase 6]`
  - Rechts, Überschrift *Fassung B – deine Handschrift*: derselbe Gedanke in markanter Handschrift, ein Merkmal unterstrichen dargestellt mit kleiner Anmerkung („die kurzen Schlusssätze"). `[PLATZHALTER: ebenfalls aus Gabriels Probe]`
  - Bildunterschrift (klein, gedimmt): Ausschnitt aus einer echten Stilprobe – an meinen eigenen Texten erprobt, bevor ich sie anbiete.
- **CTA (Kupfer-Ocker-Button):** Stilprobe anfordern → führt auf `/stilprobe/`
- **Kontingent-Zeile (Inter, klein, unter dem Button):** dynamisch, siehe 5.4. Statischer Fallback: „15 Proben im Monat – mehr gibt die Handarbeit nicht her."

### 5.3 Unterseite `/stilprobe/`

Ruhige, kurze Seite im Seitenraster (Nav und Footer wie Hauptseite). Aufbau:

1. **Kopf:** Eyebrow DIE STILPROBE · H1 „Lies dich selbst." · Ein Absatz: „Die Stilprobe macht an deinem eigenen Material erlebbar, was ‚KI, die deine Handschrift trägt' bedeutet. Du schickst mir drei Texte von dir. Ich schicke dir binnen 48 Stunden einen neuen Entwurf zurück – einmal so, wie ihn ein Standardwerkzeug schreiben würde, und einmal in deiner Handschrift, mit einem benannten Merkmal. Dazu drei Beobachtungen zu deiner Sprache. Du liest beide Fassungen und spürst den Unterschied. Mehr will die Probe nicht."
2. **So läuft es (drei ruhige Schritte):**
   - *Du schickst.* Drei eigene Texte – LinkedIn-Beiträge, Newsletter, Website-Texte – und ein Thema, zu dem der neue Entwurf entstehen soll.
   - *Ich arbeite.* Meine Werkzeuge erstellen die Analyse und die Entwürfe; ich prüfe, schärfe und gebe von Hand frei. Nichts verlässt meinen Tisch ungelesen.
   - *Du bekommst.* Binnen 48 Stunden: Fassung A, Fassung B mit benanntem Merkmal, drei Beobachtungen. Die Fassungen gehören dir – ganz gleich, ob wir je miteinander sprechen.
3. **Formular** (Abschnitt 5.5)
4. **Klartext zu deinen Texten** (Datenschutz-Absatz, Abschnitt 9.2 – steht sichtbar auf der Seite, nicht nur verlinkt)
5. **Mini-FAQ (4 Einträge, Akkordeon wie Hauptseite):**
   - *Was kostet die Stilprobe?* Nichts. Sie ist ein Geschenk ohne Haken – kein Mini-Auftrag, keine versteckte Rechnung. Ich mache 15 Proben im Monat, mehr gibt die Handarbeit nicht her. Der Deckel ist der Preis.
   - *Warum machst du das kostenlos?* Weil das Erlebnis mehr sagt als jede Angebotsseite. Wer danach sehen will, wie das im Praxisalltag läuft, meldet sich für ein Erstgespräch. Wer nicht, behält zwei brauchbare Fassungen. Beides ist für mich in Ordnung.
   - *Was passiert mit meinen Texten?* Sie dienen ausschließlich der Stilprobe. Keine Weitergabe, keine Nutzung für KI-Training, Löschung nach 30 Tagen. Details stehen im Klartext-Absatz direkt über dem Formular und in der Datenschutzerklärung.
   - *Welche Texte eignen sich?* Texte, die nach dir klingen: LinkedIn-Beiträge, Newsletter-Ausgaben, Seiten deiner Website. Wichtig: nur eigene Texte – keine Sitzungsnotizen, nichts von oder über die Menschen, die du begleitest.
6. **Leiser Abschluss-Satz:** Wenn du lieber direkt sprichst: Das Erstgespräch bleibt der kürzeste Weg. → Link auf Hauptseite `#kontakt`

### 5.4 Kontingent-Anzeige (dynamisch)

- `GET https://DOMAIN/stilprobe/kontingent.php` → `{"monat":"Juli","frei":9,"deckel":15,"status":"frei"}` (`status`: `frei` | `knapp` (≤3) | `voll` | `pause`; liest `zaehler.json`, Antwort cachebar, 10 Minuten). Same-origin zur Website – kein CORS, keine zweite Domain.
- Frontend: `fetch` mit 2-Sekunden-Timeout. Anzeige-Varianten:
  - `frei`: „Im Juli sind noch 9 von 15 Proben frei – mehr gibt die Handarbeit nicht her."
  - `knapp`: „Im Juli sind noch 2 Proben frei. Danach beginnt die Warteliste für den August."
  - `voll`: Formular-Überschrift wechselt auf Warteliste (5.6).
  - Endpoint nicht erreichbar: statischer Satz ohne Zahl („15 Proben im Monat – mehr gibt die Handarbeit nicht her."). Kein Fehler sichtbar, kein Spinner.
- Der Zähler ist ehrlich (echte Slot-Reservierungen), nie künstlich. Das ist Markenbedingung.

### 5.5 Das Formular

Felder (alle Labels wörtlich so):

| Feld | Typ | Pflicht | Hinweise |
|---|---|---|---|
| Wie heißt du? | Text | ja | |
| Deine E-Mail-Adresse | E-Mail | ja | „Dorthin schicke ich dir die Fassungen." |
| Dein Text 1 / 2 / 3 | Textarea ×3 | ja | je 200–6.000 Zeichen; Hilfetext: „Zum Beispiel ein LinkedIn-Beitrag, eine Newsletter-Ausgabe, ein Text deiner Website. Bitte einfügen statt verlinken." Zeichenzähler dezent. |
| Dein Wunschthema | Text (eine Zeile) | ja | „Wozu soll der neue Entwurf entstehen? Ein Satz reicht – z. B. ‚Warum Pausen kein Rückschritt sind'." |
| Wie bist du auf die Stilprobe gestoßen? | Auswahl | nein | LinkedIn · Empfehlung · Newsletter · Video · anders (für die interne Messung, v1 §9) |
| Bestätigung 1 | Checkbox | ja | „Das sind meine eigenen Texte. Keine Sitzungsnotizen, nichts von oder über Klient:innen." |
| Bestätigung 2 | Checkbox | ja | „Ich habe den Klartext zu meinen Texten gelesen und bin einverstanden, dass meine Angaben zur Erstellung der Stilprobe verarbeitet werden." (verlinkt auf 9.2/9.3) |

Technik und Schutz:

- POST an `https://DOMAIN/stilprobe/senden.php` – gleiche Domain wie die Website, kein CORS nötig. Funktioniert als normales Formular-POST auch ohne JavaScript (progressive enhancement: mit JS via `fetch` und Inline-Erfolgsmeldung, ohne JS als Seitenwechsel auf eine Danke-Ansicht).
- **Spam-Schutz ohne Captcha** (markenkonform): Honeypot-Feld (unsichtbar, muss leer sein) + Mindest-Ausfüllzeit 20 Sekunden (Zeitstempel beim Laden) + einfaches dateibasiertes Rate-Limit je IP in `senden.php`. Kein Google reCAPTCHA.
- Erfolgsmeldung (ersetzt Formular): „Danke. Deine Texte sind angekommen – du bekommst gleich eine Bestätigung per Mail und binnen 48 Stunden deine zwei Fassungen. Absender: STILPROBE_MAIL." 
- Fehlerfall (Endpoint down): „Das hat gerade nicht geklappt. Schick mir deine drei Texte einfach direkt an STILPROBE_MAIL – der Weg ist genauso gut."

### 5.6 Wartelisten-Zustand

Bei `status=voll` zeigt die Unterseite statt des vollen Formulars: Überschrift „Der Juli ist voll." + Satz „15 Proben sind vergeben – mehr gibt die Handarbeit nicht her. Trag dich ein, und du bekommst den ersten freien Platz im August, bevor er auf der Website erscheint." + Kurzformular (Name, E-Mail, Checkbox Datenschutz). Bestätigungs-Mail siehe 8.3.

### 5.7 FAQ- und Text-Anpassungen auf der Hauptseite

- **Neue FAQ (nach der Ablauf-Frage einsortieren):** „**Was ist die Stilprobe?** Der Schritt vor dem ersten Gespräch – für alle, die erst sehen wollen, ob das trägt. Du schickst mir drei eigene Texte und bekommst binnen 48 Stunden einen neuen Entwurf in zwei Fassungen zurück: einmal generisch, einmal in deiner Handschrift, dazu drei Beobachtungen zu deiner Sprache. Kostenlos, gedeckelt auf 15 Proben im Monat. Danach entscheidest du in Ruhe, ob ein Erstgespräch dran ist."
- **FAQ 1 (Ablauf), erster Absatz ergänzen um:** „Wenn du davor erst sehen willst, wie sich das anfühlt: Die Stilprobe ist der Schritt vor dem Gespräch – schriftlich, kostenlos, an deinem eigenen Material."

---

## 6. Die Text-Engine: Pipeline und Prompts

### 6.1 Ein Auftrag, ein JSON

Je Probe läuft **ein** klar definierter Auftrag mit strukturierter JSON-Ausgabe (statt vieler Einzel-Calls – einfacher zu prüfen, zu loggen und zwischen den Betriebsarten zu wechseln):

```json
{
  "stilanalyse": {
    "tonalitaet": "…", "anrede_perspektive": "…", "satzbau_rhythmus": "…",
    "vokabular_wendungen": ["…"], "no_gos": ["…"],
    "anker_snippets": ["Originalzitat 1", "Originalzitat 2"],
    "themen": ["…"]
  },
  "fassung_a": "…",
  "fassung_b": "…",
  "merkmal": { "name": "z. B. deine kurzen Schlusssätze", "beleg_zitat": "Originalstelle aus Text 1–3" },
  "beobachtungen": [
    { "text": "Beobachtung in 1–2 Sätzen", "beleg": "kurzes Originalzitat" },
    { "text": "…", "beleg": "…" },
    { "text": "…", "beleg": "…" }
  ],
  "rueckgabe_mail": { "betreff": "…", "body": "…" },
  "selbstcheck": {
    "merkmal_belegt": true, "fassungen_gleiches_thema": true, "fassung_a_fair": true,
    "laenge_passend": true, "blacklist_frei": true, "du_form": true,
    "ampel": "gruen", "hinweise": ["…"]
  }
}
```

Die Stilanalyse ist die **verdichtete Variante des Stilprofil-Bausteins** aus dem JGC-Prozessweg (`schritte/schritt-stilprofil.md`): gleiche Rubriken (Tonalität, Anrede, Satzbau/Rhythmus, Vokabular/Wendungen, No-Gos, Anker-Snippets), nur kompakter – sie muss eine Probe tragen, kein Produkt.

### 6.2 Zwei Betriebsarten, ein Schalter

Einstellung `textwerk = abo | api` (in `einstellungen`, ohne Code-Änderung umschaltbar):

| | **Abo-Betrieb** (Start) | **API-Betrieb** (empfohlener Regelbetrieb) |
|---|---|---|
| Technik | Claude Code CLI headless auf dem Laptop (`claude -p` mit JSON-Ausgabe, im erweiterten n8n-Container oder als Host-Aufruf), authentifiziert über Gabriels Claude-Abo (einmalig `claude setup-token`, Token in `.env`) | Anthropic Messages API mit API-Key (HTTP-Aufruf aus n8n) |
| Kosten | 0 € zusätzlich (läuft im Monats-Kontingent) | grob unter 2 € je Probe |
| Vertragsbasis | Consumer-Konto. **Pflicht-Check:** In den Claude-Konto-Einstellungen die Verwendung von Chats/Daten für Modelltraining deaktivieren, sonst ist die Zusage „keine Nutzung für Training" nicht haltbar | Kommerzielle Bedingungen mit Data Processing Addendum (AVV) und EU-Standardvertragsklauseln; API-Eingaben werden standardmäßig nicht für Training verwendet – die sauberste Grundlage für das Versprechen an den Coach |
| Risiken | Rate-Limits des Abos (bei 15 Proben/Monat unkritisch), Token läuft gelegentlich ab (Alarm + Neu-Login), Anthropic könnte Headless-Abo-Nutzung enger fassen | keine nennenswerten |

**Empfehlung an Gabriel:** Aufbau und Pilotphase im Abo-Betrieb (Wunsch: Kontingent nutzen), Umschalten auf API-Betrieb, sobald regelmäßig fremde Coach-Texte durchlaufen – wegen der belastbareren Vertragsbasis, nicht wegen der Qualität. Der Schalter macht das zu einer Ein-Minuten-Entscheidung. Beide Adapter werden in Phase 2 gebaut und getestet.

Modellwahl: das jeweils aktuelle starke Modell (Stand heute Opus-Klasse) für Stilanalyse und Fassung B; Fassung A darf bewusst auf einem mittleren Modell laufen – sie soll ja klingen wie der Standard.

### 6.3 Prompt P1 – Eingangs-Wächter (läuft vor der Annahme)

```
Du prüfst eine Einreichung zur „Stilprobe" (Coach reicht drei eigene Texte ein).
Antworte NUR mit JSON: {"spam": bool, "klienten_daten_verdacht": bool,
"material_zu_duenn": bool, "begruendung": "1–2 Sätze", "sprache": "de|andere"}

Prüfe:
1. SPAM: Werbung, Link-Müll, generierter Unsinn, kein erkennbarer Coach-Kontext.
2. KLIENTEN-DATEN: Wirkt ein Text wie Sitzungsnotizen, Fallbeschreibung, Nachricht
   von/über eine dritte Person (Namen, Diagnosen, Sitzungsdetails)? Im Zweifel: true.
3. MATERIAL: Sind die Texte zu kurz/inhaltsleer für eine ehrliche Stilanalyse?

Du entscheidest nichts. Du markierst nur. Die Entscheidung trifft ein Mensch.

EINREICHUNG:
Name: {{name}} | Wunschthema: {{wunschthema}}
TEXT 1: {{text_1}}  TEXT 2: {{text_2}}  TEXT 3: {{text_3}}
```

Ist alles unauffällig → automatische Annahme (Slot, Bestätigungsmail, Pipeline). Ist irgendetwas `true` → Status `rueckfrage`, Telegram an Gabriel mit Begründung und den Optionen **Trotzdem annehmen** / **Freundlich ablehnen**. Die Automatik lehnt nie selbst ab.

### 6.4 Prompt P2 – Hauptauftrag (Stilanalyse, Fassungen, Beobachtungen, Mail)

Liegt als `prompts/hauptauftrag.md` im Repo. Volltext:

```
Du arbeitest für JGC Lumen (KI-Implementierung für Coaches, Trainer und Mentoren,
DACH). Ein Coach hat drei eigene Texte und ein Wunschthema eingereicht. Du erstellst
die „Stilprobe": den Beweis, dass KI seine Handschrift tragen kann.

DEINE AUFGABEN, IN DIESER REIHENFOLGE:

1. STILANALYSE (verdichtetes Stilprofil, nur aus dem echten Material – erfinde
   keinen Stil dazu):
   - Tonalität & Haltung, Anrede & Perspektive, Satzbau & Rhythmus,
     Vokabular & typische Wendungen, No-Gos (was dieser Mensch nie schreiben würde),
     zwei wörtliche Anker-Snippets, erkennbare Themenfelder.

2. FASSUNG A – der Standard-Entwurf. Schreibe zum Wunschthema einen Text im
   Format der eingereichten Texte (Beitrag/Newsletter, ähnliche Länge wie deren
   Durchschnitt). Schreibe ihn so, wie ihn ein gutes Standardwerkzeug ohne
   Stilvorgaben schreiben würde: kompetent, korrekt, glatt, austauschbar.
   WICHTIG: keine Karikatur, kein absichtlich schlechter Text. Fassung A muss
   fair sein – solide Standardware. Der Unterschied entsteht durch Fassung B,
   nicht durch ein schwaches A.

3. FASSUNG B – derselbe Entwurf in seiner Handschrift. Gleiches Thema, gleiche
   Kernaussagen wie Fassung A, aber vollständig in seiner Stimme: sein Rhythmus,
   seine Wendungen, sein Einstieg, sein Schluss. Aufbau darf abweichen, wenn sein
   Stil es verlangt. Nichts überzeichnen: Fassung B muss klingen, als hätte er
   sie an einem guten Tag selbst geschrieben – nicht wie eine Parodie seiner
   Eigenheiten. Respektiere die No-Gos strikt.

4. MERKMAL: Benenne EIN konkretes Stilmerkmal, das Fassung B hörbar trägt
   (z. B. „deine kurzen Schlusssätze"). Bedingung: Es muss in den eingereichten
   Texten wörtlich belegbar sein. Gib die Belegstelle an.

5. DREI BEOBACHTUNGEN zu seiner Sprache: konkret, wertschätzend, auf Augenhöhe –
   Beobachtungen, keine Bewertungen, keine Verbesserungsvorschläge. Je 1–2 Sätze,
   je ein kurzer Beleg aus seinen Texten. Mindestens eine Beobachtung zu etwas,
   das ihm selbst vermutlich nicht auffällt.

6. RÜCKGABE-MAIL: Fülle exakt dieses Gerüst (Du-Form, warm, ohne Verkaufsdruck):
   Betreff: „Deine Stilprobe: zwei Fassungen zu ‚{{wunschthema_kurz}}'"
   ---
   Hallo {{name}},
   anbei dein Entwurf in zwei Fassungen. Fassung A ist das, was ein
   Standardwerkzeug liefert. Fassung B trägt deine Handschrift: [Merkmal].
   [Überleitung in einem Satz, individuell.]
   FASSUNG A [Text] / FASSUNG B [Text]
   Drei Beobachtungen aus deinen Texten: [1] [2] [3]
   Deine eingereichten Texte lösche ich in 30 Tagen – so, wie es auf der
   Website steht.
   Wenn du sehen willst, wie das in deinem Praxisalltag läuft, lass uns 30
   Minuten sprechen: [KALENDER_ODER_MAIL_HINWEIS]. Wenn nicht, behalte die
   Fassungen gern. Sie gehören dir.
   [GRUSSFORMEL_GABRIEL]
   ---

7. SELBSTCHECK (still, Ergebnis als JSON-Feld): Merkmal belegt? Beide Fassungen
   gleiches Thema/Kernaussagen? Fassung A fair? Länge passend zum eingereichten
   Material? Du-Form durchgehend? Kein Wort aus der Sperrliste: skalieren,
   automatisieren (unkontextualisiert), Funnel, Pipeline, Conversion, Hack,
   Game-Changer, Klon, disruptiv, 10x, Empire, Hustle, Hochpreis, Leads, Kunden
   (statt Klient:innen)? Ampel: gruen = versandfertig nach kurzem Blick,
   gelb = bitte Hinweise beachten. Nenne bei gelb die Stellen.

SPRACHREGELN für alles nach außen: Deutsch, Du-Form. Aktive Verben. Keine
Ausrufezeichen-Rhetorik, kein Marketing-Jubel. Warm, klar, geerdet. Der Coach
bleibt Autor seiner Stimme – du weist es nur nach.

AUSGABE: Nur das JSON-Objekt nach dem vereinbarten Schema. Kein Text davor/danach.

EINREICHUNG:
Name: {{name}} | Wunschthema: {{wunschthema}}
TEXT 1 ({{zeichen_1}} Zeichen): {{text_1}}
TEXT 2: {{text_2}}
TEXT 3: {{text_3}}
```

### 6.5 Prompt P3 – Überarbeitungsrunde

Wenn Gabriel „Überarbeiten" wählt und eine Anweisung schickt:

```
Hier ist der bisherige Stilprobe-Entwurf als JSON: {{bisheriges_json}}
Hier die eingereichten Originaltexte: {{texte}}
Anweisung des Prüfers (Gabriel): "{{anweisung}}"

Setze die Anweisung um. Ändere NUR, was die Anweisung betrifft; alles andere
bleibt wörtlich erhalten. Führe den Selbstcheck erneut aus.
Ausgabe: das vollständige, aktualisierte JSON.
```

Rundenzähler in der Datenbank (`runden`); jede Runde erzeugt eine neue Freigabe-Nachricht mit Kennzeichnung „Runde 2", „Runde 3" …

### 6.6 Prompt P4 – Nachfass-Entwurf (T+5)

```
Der Coach {{name}} hat vor 5 Tagen seine Stilprobe zu „{{wunschthema}}" bekommen
(Merkmal: {{merkmal}}) und nicht geantwortet. Schreibe EIN kurzes, leises
Nachfassen (max. 90 Wörter, Du-Form, kein Druck, keine Wiederholung des ganzen
Angebots): freundlich nachhören, ob das Lesen sich gelohnt hat; die 30 Minuten
einmal ruhig anbieten; ausdrücklich festhalten, dass auch ein Nein in Ordnung
ist und die Fassungen ihm gehören. Kein zweites Nachfassen ankündigen.
Betreff: kurz, ohne „Re:", ohne Dringlichkeit.
Ausgabe als JSON: {"betreff": "…", "body": "…"}
```

---

## 7. Datenmodell (Postgres)

### 7.1 Tabellen

```sql
stilproben (
  id            text PRIMARY KEY,        -- Format SP-JJMM-NN, z. B. SP-2607-04
  status        text NOT NULL,           -- Zustände aus Abschnitt 3
  name          text, email text, quelle text, partner_code text,
  wunschthema   text,
  text_1 text, text_2 text, text_3 text,
  einwilligung_ts timestamptz, eigene_texte_bestaetigt boolean,
  waechter_json jsonb,                   -- Ergebnis P1
  ergebnis_json jsonb,                   -- komplettes JSON aus P2/P3 (aktuelle Runde)
  runden        int DEFAULT 0,
  eingang_ts timestamptz, angenommen_ts timestamptz, versand_ts timestamptz,
  nachfass_ts timestamptz, antwort_ts timestamptz, geloescht_ts timestamptz,
  erstgespraech boolean DEFAULT false,   -- per Telegram-Kommando setzbar (KPI)
  notiz         text
)

stilproben_events ( id serial, probe_id text, ts timestamptz,
                    typ text, detail jsonb )        -- lückenloses Audit-Log

warteliste ( id serial, name text, email text,
             eingang_ts timestamptz, eingeladen_ts timestamptz, status text )

einstellungen ( schluessel text PRIMARY KEY, wert text )
-- Startwerte: deckel=15, sandbox=true, textwerk=abo, pause=false
```

Dazu kommt auf dem Webspace die kleine Zustandsdatei `zaehler.json` (`{"monat":"2026-07","angenommen":6,"deckel":15,"pause":false}`), geführt von `senden.php`, gelesen von `kontingent.php`, korrigiert von n8n über den Admin-Endpunkt. Die Datenbank auf dem Laptop bleibt die führende Quelle für alles Inhaltliche; `zaehler.json` ist nur der Always-on-Spiegel für Deckel und Pause.

### 7.2 Grundsätze

- **Audit-Log:** Jeder Statuswechsel, jede Freigabe (wer/wann/Kanal), jeder Versand, jede Löschung wird als Event geschrieben. Das ist die interne Entsprechung des Audit-first-Versprechens – und die Datenbasis aller Kennzahlen.
- **Löschung (T+30 nach Versand bzw. Ablehnung):** `text_1..3`, `wunschthema`, `waechter_json`, `ergebnis_json` und `notiz` werden genullt, `name` wird auf den Vornamen gekürzt, `email` gehasht (für Dubletten-Erkennung). Metadaten (Status, Zeitstempel, Quelle, `erstgespraech`) bleiben für die Messung. Das Lösch-Event dokumentiert den Vollzug.
- **Backup:** täglicher DB-Dump lokal auf dem Laptop (7 Tage Rotation), solange n8n läuft. Backups unterliegen derselben 30-Tage-Logik – deshalb keine Langzeit-Archivierung der Dumps und keine Ablage in Cloud-Speichern.

---

## 8. Mail- und Nachrichten-Templates (fix, ohne KI-Anteil)

### 8.1 Eingangsbestätigung (automatisch, sofort nach Annahme – versendet von `senden.php` über All-Inkl)

> **Betreff:** Deine Texte sind angekommen
>
> Hallo {{name}},
>
> deine drei Texte sind da – danke für das Vertrauen. So geht es jetzt weiter: Meine Werkzeuge erstellen Analyse und Entwürfe, ich prüfe und schärfe von Hand. Binnen 48 Stunden bekommst du deinen neuen Entwurf in zwei Fassungen – einmal generisch, einmal in deiner Handschrift – dazu drei Beobachtungen zu deiner Sprache.
>
> Zur Einordnung: Deine Texte dienen ausschließlich dieser Stilprobe. Keine Weitergabe, keine Nutzung für KI-Training, Löschung nach 30 Tagen.
>
> Bis gleich,
> Gabriel Chimento · JGC Lumen · Freiburg im Breisgau

### 8.2 Freundliche Ablehnung (Baustein, wird nur nach Gabriels Klick versendet)

> **Betreff:** Kurze Rückmeldung zu deiner Stilprobe
>
> Hallo {{name}},
>
> danke, dass du mir deine Texte geschickt hast. {{grund_baustein}} Deine Texte habe ich gelöscht.
>
> {{abschluss_baustein}}
>
> Herzlich, Gabriel

Grund-Bausteine (wählbar in Telegram): a) „In den Texten steckt Material aus deiner Arbeit mit Klient:innen – genau das nehme ich aus Prinzip nicht an. Die Stilprobe lebt von deinen eigenen, öffentlichen Texten. Magst du mir drei davon schicken?" b) „Für eine ehrliche Stilanalyse brauche ich etwas mehr Material – drei Texte mit je ein paar Absätzen. Magst du nachlegen?"

### 8.3 Wartelisten-Bestätigung (automatisch)

> **Betreff:** Du stehst auf der Liste
>
> Hallo {{name}}, der {{monat}} ist voll – 15 Proben, mehr gibt die Handarbeit nicht her. Du stehst jetzt vorn auf der Liste: Sobald der {{folgemonat}} beginnt, bekommst du deinen Platz angeboten, bevor er auf der Website erscheint. Herzlich, Gabriel

### 8.4 Telegram-Freigabenachricht (an Gabriel)

```
🖋 SP-2607-04 · {{name}} · „{{wunschthema}}"
Ampel: 🟢 | Runde 1 | Frist: noch 31 h
Merkmal: {{merkmal}} (Beleg ✓)
Beobachtungen: 1) … 2) … 3) …
— Fassung B, Anfang: „{{erste_120_zeichen}}…"
Volltext: kam parallel per Mail ✉️
[✅ Freigeben & senden] [✏️ Überarbeiten] [📄 Volltext hier] [⏸ Später] [✖️ Ablehnen]
```

### 8.5 Freigabe-Mail (an Gabriel, parallel zur Telegram-Nachricht)

Betreff `[SP-2607-04] Zur Freigabe: {{name}} – „{{wunschthema}}"`. Inhalt: Ampel + Hinweise, Merkmal mit Beleg, Fassung A, Fassung B, drei Beobachtungen, die komplette Rückgabe-Mail als Vorschau, darunter zwei Links (HMAC-signiert, 7 Tage gültig, Einmal-Wirkung): **Freigeben & senden** / **Ablehnen**. Die Links zeigen auf `DOMAIN/stilprobe/aktion.php`: PHP prüft die Signatur, legt die Aktion in die Warteschlange und zeigt eine ruhige Bestätigungsseite („Freigabe vermerkt – der Versand läuft, sobald deine Werkstatt das nächste Mal arbeitet."); n8n führt sie beim nächsten Lauf aus. Zwei Antwort-Wege ohne Klick: Antwort auf die Mail mit `FREIGABE` in der ersten Zeile = Freigeben; jeder andere Antworttext gilt als Überarbeitungs-Anweisung (Betreff-Tag `[SP-…]` ist der Schlüssel).

---

## 9. Datenschutz und Transparenz

### 9.1 Interne Einordnung (wichtig, bitte so umsetzen)

Auch wenn eingereichte Texte meist öffentliche Beiträge sind: **Die DSGVO gilt trotzdem** – Name, E-Mail-Adresse und die Texte selbst sind personenbezogene Daten des Coaches. Das ist kein Problem, sondern der Normalfall; es braucht nur die drei Dinge, die dieses Konzept ohnehin vorsieht: Einwilligung mit klarem Zweck (Formular-Checkbox), Transparenz über die Werkzeuge (9.2) und die eingehaltene Löschfrist (Löschjob). Gerade weil JGC Lumen Audit-first und DSGVO-Konformität verkauft, muss die Stilprobe hier vorbildlich sein – der Unterschied zwischen der leichten Werkzeugkette der Stilprobe (öffentliche Texte, Einwilligung) und der strengen EU-Kette für Klienten-Daten in Umsetzungen wird dabei zum Verkaufsargument, nicht zum Makel.

Gegenüber dem Stilprobe-Konzept v1 ändert sich §8 Punkt 2: Aus „Verarbeitung ausschließlich über deine EU-Werkzeugkette" wird die ehrliche Fassung unten. Alle übrigen Leitplanken aus v1 §8 gelten unverändert.

### 9.2 Klartext-Absatz auf der Unterseite (steht direkt über dem Formular)

> **Klartext zu deinen Texten.** Deine Texte dienen ausschließlich der Erstellung deiner Stilprobe. Für die Stilarbeit nutze ich Claude von Anthropic – nach meiner Einschätzung das beste Sprachwerkzeug, das es derzeit gibt. Anthropic ist ein US-Anbieter; die Verarbeitung ist vertraglich abgesichert (Auftragsverarbeitung mit EU-Standardvertragsklauseln), und deine Texte werden nicht für das Training von KI-Modellen verwendet. Nach 30 Tagen lösche ich deine Texte und alle Zwischenergebnisse – das bestätige ich dir in der Rückgabe-Mail noch einmal. Deshalb die klare Linie: Schick mir nur Texte von dir, die öffentlich sind oder es sein dürften – keine Sitzungsnotizen, nichts von oder über die Menschen, die du begleitest. Für Klienten-Daten gilt in meinen Umsetzungen eine strengere, EU-gebundene Werkzeugkette; die Stilprobe ist bewusst die leichte Stufe für deine eigenen Texte.

(Der Absatz erfüllt Gabriels Wunsch nach einem gut formulierten US-Hinweis: transparent, unaufgeregt, mit Begründung – und er verwandelt die Offenlegung in ein Haltungs-Signal.)

### 9.3 Datenschutzerklärung, neuer Abschnitt „Die Stilprobe"

Claude Code ergänzt die bestehende Datenschutzseite um: Zweck (Erstellung der Stilprobe, Kontaktaufnahme zur Rückgabe), Rechtsgrundlage (Einwilligung, Art. 6 Abs. 1 lit. a DSGVO; Widerruf jederzeit per Mail), Empfänger/Auftragsverarbeiter (All-Inkl – Webhosting und E-Mail, Deutschland; Anthropic – Textverarbeitung, USA, EU-Standardvertragsklauseln; Telegram – interne Freigabe-Benachrichtigungen mit Kurzauszügen; die inhaltliche Verarbeitung selbst läuft lokal auf eigenem Gerät in Deutschland), Speicherdauer (30 Tage nach Rückgabe, danach Löschung der Inhalte; Metadaten ohne Personenbezug für interne Statistik), Betroffenenrechte. **Juristische Endprüfung durch Gabriel bzw. Vorlage** – Claude Code liefert den Entwurf, kein Rechtsrat.

### 9.4 Datensparsamkeit im Betrieb

- Telegram erhält nur Meta-Angaben und Kurzauszüge (≤ 300 Zeichen); Volltexte laufen über Mail und Datenbank. Der Button „📄 Volltext hier" sendet auf ausdrücklichen Abruf.
- AV-Verträge einsammeln (Checkliste Phase 0/1): All-Inkl AVV (deckt Webspace und Postfach), Anthropic DPA (bei API-Betrieb automatisch Teil der kommerziellen Bedingungen). Im Abo-Betrieb zusätzlich: Modelltraining in den Konto-Einstellungen deaktiviert (Screenshot als Nachweis ablegen). Die inhaltliche Verarbeitung auf dem eigenen Laptop braucht keinen AVV – eigenes Gerät, eigene Verantwortung.
- Keine Öffnungs-/Klick-Tracker in Mails. Antwort-Erkennung ausschließlich über IMAP-Eingang.

---

## 10. Steuerung und zeitgesteuerte Jobs

### 10.1 Gabriels Steuerkanäle

**Telegram (primär, Chat-ID-Whitelist):**

- Inline-Buttons je Probe: ✅ Freigeben & senden · ✏️ Überarbeiten (Bot fragt: „Was soll anders werden?" → Antwort = Anweisung für P3) · 📄 Volltext hier · ⏸ Später · ✖️ Ablehnen (mit Baustein-Auswahl aus 8.2 oder „ohne Mail schließen").
- Direkte Ersetzung statt Regeneration: Antwort, die mit `ERSETZE FASSUNG B:` oder `ERSETZE MAIL:` beginnt, wird wörtlich übernommen (Feinschliff von Hand, ohne neue KI-Runde) und erzeugt eine frische Freigabenachricht.
- Kommandos: `/status` (offene Proben mit Fristen) · `/kontingent` · `/erstgespraech SP-…` (KPI-Marke: Probe führte zum Erstgespräch) · `/pause an|aus` (stille Tage: Formular zeigt Pausen-Hinweis, Annahmen stoppen) · `/report` (Monatsreport sofort).

**Mail (parallel, gleichwertig):** Freigabe-Mail nach 8.5 mit signierten Links; Antwort auf die Mail = Überarbeitungs-Anweisung. Damit funktioniert die Freigabe auch, wenn Telegram gerade nicht greifbar ist – und Volltexte lesen sich in Ruhe am Laptop.

Technik und Sicherheit: Der Telegram-Bot läuft im **Polling-Betrieb** (getUpdates) – das funktioniert hinter jedem Heimnetz, braucht keinen öffentlichen Webhook und keine offenen Ports. Das n8n bleibt damit komplett lokal und ist aus dem Internet unerreichbar – der größte Sicherheitsgewinn dieser Architektur. Dazu: Chat-ID-Whitelist (nur Gabriel), Aktions-Links HMAC-signiert mit Ablauf und Einmal-Wirkung (eingelöst über `aktion.php`), Geheimschlüssel für Admin-Ops nur in `konfig.php` bzw. `.env`.

### 10.2 Zeitgesteuerte Jobs (n8n auf dem Laptop, Europe/Berlin)

**Grundprinzip Aufhol-Logik:** Die Jobs laufen nur, wenn der Laptop läuft. Deshalb prüft jeder Job Zeitstempel-basiert, was seit dem letzten Lauf fällig geworden ist, statt einen exakten Ausführungszeitpunkt anzunehmen – ein n8n-Start um 14 Uhr holt den „08:00-Job" desselben Tages einfach nach. Jeder Job ist idempotent (doppelter Lauf = kein doppelter Effekt).

| Rhythmus (solange n8n läuft) | Job |
|---|---|
| alle 5–10 Min + bei n8n-Start | IMAP-Eingang `STILPROBE_MAIL`: neue Einreichungen von `senden.php` abholen → P1; Coach-Antworten → Status `antwort_erhalten` + Telegram-Info („{{name}} hat geantwortet – übernimmst du?"); Gabriels Mail-Antworten mit `[SP-…]`-Tag → Überarbeitungsrunde |
| stündlich + bei Start | SLA-Wächter: `zur_freigabe` älter 36 h → Erinnerung; älter 44 h → dringende Erinnerung |
| täglich + bei Start | Nachfass-Kandidaten (`versendet` + 5 Tage, keine Antwort) → P4 → `nachfass_zur_freigabe` |
| täglich + bei Start | Löschjob (Abschnitt 7.2) + Lösch-Events |
| täglich | DB-Backup (Dump) lokal, Rotation 7 Tage |
| am/nach Monatsersten | Wartelisten-Einladungen als Entwürfe (mit Freigabe!), Monatsreport an Mail + Telegram. Der Kontingent-Reset selbst passiert laptop-unabhängig in PHP (Datumslogik) |

---

## 11. Messung und Monatsreport

Automatisch aus den Events, ohne jedes Tracking beim Coach:

- **Trichter:** eingegangen → angenommen → versendet → Antwort → Erstgespräch (`/erstgespraech`-Marke). Übergangsquote Probe → Erstgespräch mit Ziel 30–40 % (v1 §9).
- **Betrieb:** Durchlaufzeit Eingang→Versand (Median; SLA-Treffer in %), Freigaberunden je Probe (Qualitäts-Frühindikator der Prompts), Wächter-Rückfragen, Wartelisten-Stand.
- **Quellen:** Verteilung des Formular-Felds „Wie bist du auf die Stilprobe gestoßen?" – beantwortet die Quellen-Frage aus v1 §9 datenbasiert.
- **Abbruch- und Kapazitätsregeln aus v1 §9 als Ampel im Report:** Übergang < 20 % zwei Monate in Folge → Hinweis „Zielliste/Zuschnitt prüfen"; Nachfrage > Deckel zwei Monate in Folge → Hinweis „Warteliste etabliert – Deckel nur bei sinkendem Aufwand erhöhen".

Der Monatsreport kommt als kompakte Mail (10–15 Zeilen) plus Telegram-Kurzfassung. Kein Dashboard in v1 – erst bauen, wenn die Zahlen es verlangen.

---

## 12. Sprachregeln für alle Außentexte (verbindlich)

Extrakt aus dem Skill „Coach-Sprache DACH" + Design-Briefing v8 §10 – gilt für jede Formulierung, die ein Coach zu sehen bekommt (Website, Formular, Mails, auch Fehlermeldungen):

- **Anrede:** durchgehend Du; Absender ist „ich" (Gabriel), nie „wir" als Firma. „Klient:innen" oder „die Menschen, die du begleitest" – nie „Kunden", nie „Leads".
- **Tragende Wörter:** Handschrift, Haltung, Augenhöhe, Raum, Begleitung, Substanz, Klarheit, Wirkung, Vertrauen, Handarbeit.
- **Sperrliste:** skalieren, automatisieren (als Verkaufswort), Funnel, Pipeline, Conversion, Hack, Game-Changer, Disruption, 10x/Prozent-Feuerwerk, Hustle, Empire, Hochpreis/Premium-Experte, „magnetisch anziehen", KI-Power, Klon (auch nicht verneint).
- **Stil:** aktive Verben, kurze Sätze erlaubt, keine Substantivketten, keine Ausrufezeichen in CTAs, Pathos geerdet (Bremswörter: klar, fundiert, verantwortungsvoll, ohne Druck). Ein Sachlichkeits-Anker (DSGVO, EU-Datenspeicherung, Löschfrist) in jedem längeren Außentext.
- **Ehrlichkeit als Mechanik:** Deckel und Fristen werden nur kommuniziert, wenn sie technisch echt sind. Keine künstliche Verknappung, kein Countdown.

---

## 13. Umsetzungsplan für Claude Code

### 13.0 Repo-Struktur

Neues Repo `stilprobe-automatik` (privat):

```
stilprobe-automatik/
├── webspace/                   # → per FTP auf DOMAIN/stilprobe/ (All-Inkl)
│   ├── senden.php              # Annahme: Checks, Zähler, Mail-Übergabe, Bestätigung, Telegram-Ping
│   ├── aktion.php              # löst signierte Freigabe-/Ablehnen-Links ein → Warteschlange + Bestätigungsseite
│   ├── kontingent.php          # Badge-JSON (GET) + Admin-Ops (Slot-Freigabe, Pause) mit Geheimschlüssel
│   ├── konfig.beispiel.php     # Deckel, Geheimschlüssel, Bot-Token, Adressen (echte konfig.php nie im Repo)
│   └── zaehler.json            # Zustandsdatei (wird zur Laufzeit geführt)
├── laptop/
│   ├── docker-compose.erweiterung.yml  # ergänzt Gabriels vorhandenes n8n-Setup (DB, ggf. CLI-Image)
│   ├── .env.example            # alle Secrets/Variablen dokumentiert
│   └── db/schema.sql           # Abschnitt 7
├── n8n/                        # exportierte Workflows (JSON, versioniert)
│   ├── 01-abholung.json        # IMAP-Abholung, Parser, Wächter (P1), Rückfrage-Weg
│   ├── 02-textwerk.json        # Text-Engine-Aufruf, Selbstcheck, Freigabe-Nachrichten
│   ├── 03-freigabe.json        # Telegram-Callbacks, Mail-Links, Überarbeitung, Versand, Slot-Freigabe
│   └── 04-fristen.json         # SLA, Nachfassen, Löschung, Monatslauf (mit Aufhol-Logik)
├── engine/
│   ├── prompts/                # p1-waechter.md, p2-hauptauftrag.md, p3-runde.md, p4-nachfass.md
│   ├── textwerk.sh             # Adapter: abo (claude -p) | api (curl) → validiertes JSON
│   └── schema/ergebnis.json    # JSON-Schema für Ausgabe-Validierung
├── mails/                      # Templates aus Abschnitt 8 (Text + minimal-HTML)
└── docs/betrieb.md             # Runbook: Autostart, Backup zurückspielen, Token erneuern, Schalter, Umzug auf Server
```

Website-Änderungen laufen im bestehenden Repo `jgc-studio-website` (Astro-Quellen unter `site/`; falls die Live-Auslieferung weiter über die Single-File-Variante 18 läuft, dort ebenfalls einpflegen – vor Phase 5 den tatsächlichen Build-Weg mit Gabriel klären).

### 13.1 Phasen mit Abnahmekriterien

**Phase 0 – Fundament auf dem Laptop** *(Zulieferungen Gabriel: siehe 15.1)*
Claude Code: Bestandsaufnahme des vorhandenen n8n-Docker-Setups (Version, Datenhaltung, belegte Ports), Erweiterung per Compose (DB, ggf. Image mit Claude CLI), Docker-Autostart beim Windows-Start einrichten und dokumentieren, Schema einspielen, Backup-Job, `.env` aus Vorlage. Kein Server, kein DNS – die PHP-Schicht kommt in Phase 1.
✔ Abnahme: n8n startet automatisch mit dem Rechner; Testdatensatz überlebt Container-Neustart; Backup-Datei entsteht; das andere Projekt auf derselben n8n-Instanz läuft unverändert weiter.

**Phase 1 – Empfangsschicht (PHP) und Abholung**
`senden.php` (Validierung, Honeypot/Zeit-Check, Rate-Limit, Kontingent/Warteliste via `zaehler.json`, strukturierte Übergabe-Mail, Eingangs-/Wartelisten-Bestätigung, Telegram-Ping), `kontingent.php` (Badge + Admin-Ops), n8n-Abholung (IMAP-Parser) plus Wächter P1 mit Rückfrage-Weg. Solange der All-Inkl-Webspace noch nicht bereitsteht, läuft die PHP-Schicht identisch in einem lokalen PHP-Container; das Deployment per FTP ist dann reine Kopierarbeit.
✔ Abnahme: Formular-POST durchläuft bis `angenommen` inkl. Bestätigungsmail und Telegram-Ping (Sandbox); 16. Einreichung im Monat landet auf `warteliste`; präparierte „Sitzungsnotiz"-Einreichung erzeugt `rueckfrage` + Telegram; Einreichung bei ausgeschaltetem n8n wartet im Postfach und wird beim n8n-Start sauber abgeholt.

**Phase 2 – Textwerk**
Beide Adapter (`abo` via Claude Code CLI headless, `api` via Anthropic API), Prompts, JSON-Schema-Validierung mit einer Wiederholung bei Schema-Bruch, Speicherung.
✔ Abnahme: **Golden-Test** – Gabriels eigene drei Texte ergeben in beiden Betriebsarten ein schema-gültiges Ergebnis; Merkmal-Beleg ist wörtlich in den Quelltexten auffindbar; Gabriel bewertet Fassung B als „könnte von mir sein".

**Phase 3 – Freigabe und Versand**
Telegram-Bot im Polling-Betrieb (Nachricht 8.4, Buttons, Anweisungs-Dialog, ERSETZE-Kommandos, Whitelist), Freigabe-Mail 8.5 mit signierten Aktions-Links über `aktion.php`, Mail-Antwort-Parser (`FREIGABE` / Anweisung), Überarbeitungsrunden, SMTP-Versand, Sandbox-Schalter.
✔ Abnahme: kompletter Zyklus Freigeben, Überarbeiten (2 Runden), Ersetzen, Ablehnen je einmal durchgespielt; abgelaufener/gefälschter Link wird abgewiesen; im Sandbox-Modus erreicht keine Mail eine fremde Adresse.

**Phase 4 – Fristen und Antworten**
Alle Cron-Jobs aus 10.2, IMAP-Anbindung, Nachfass-Strecke, Löschjob, Monatsreport.
✔ Abnahme: Zeitraffer-Test mit manipulierten Zeitstempeln – Nachfassen nach „5 Tagen", Löschung nach „30 Tagen" (Inhalte weg, Metadaten da, Event geschrieben), Report rechnet die Testdaten korrekt.

**Phase 5 – Website**
Alle Eingriffe aus Abschnitt 5 (Sektion, Unterseite mit Formular, Badge, Nav/Hero/Final-CTA/FAQ/Footer, Datenschutz-Abschnitt), responsive, `prefers-reduced-motion`-fest, im Stil der bestehenden Seite. **Abhängigkeit:** Formular und Badge brauchen die PHP-Schicht – live geht die Stilprobe deshalb erst mit dem All-Inkl-Umzug der Website; bis dahin bleibt die Sektion bau- und testbar (lokal gegen den PHP-Container).
✔ Abnahme: Formular sendet an die Sandbox (funktioniert mit und ohne JavaScript); Badge zeigt echten Zählerstand und fällt bei abgeschaltetem Endpoint sauber auf den statischen Satz zurück; Lighthouse ohne neue Fehler; Copy exakt wie in Abschnitt 5.

**Phase 6 – Probelauf und Scharfschaltung**
Ende-zu-Ende mit zwei echten Fällen: (1) Gabriels eigene Texte → daraus zugleich der Beispiel-Ausschnitt für die Website-Sektion (Platzhalter ersetzen), (2) eine wohlwollende Testperson aus dem Netzwerk. Danach: `sandbox=false`, Deckel scharf, Betriebs-Runbook übergeben.
✔ Abnahme-Checkliste (alle Punkte müssen stehen):
1. Einreichung → Rückgabe in unter 48 h; einziger nötiger „Eingriff" ist, dass der Laptop im Alltag läuft und Gabriel freigibt.
2. Keine Coach-Mail ohne dokumentiertes Freigabe-Event.
3. Wächter-, Wartelisten-, Pause- und Ablehnen-Pfade funktionieren.
4. Nachfassen stoppt bei Antwort; `antwort_erhalten` benachrichtigt Gabriel.
5. Löschung nachweisbar (Event + genullte Felder), Löschzusage steht in Bestätigungs- und Rückgabe-Mail.
6. Kontingent-Badge, Warteliste und Monatsreport zeigen konsistente Zahlen.
7. Beide Textwerk-Betriebsarten laufen; Umschalten braucht nur die Einstellung.
8. Alle Außentexte bestehen die Sperrlisten-Prüfung aus Abschnitt 12.
9. Backup + dokumentierter Wiederanlauf (Runbook) einmal real geprobt.
10. Gabriels Aufwand je Probe im Probelauf: unter 10 Minuten.

---

## 14. Ergänzende Ideen (Backlog, bewusst nicht in v1)

| Prio | Idee | Nutzen |
|---|---|---|
| hoch | **Erstgespräch-Formular über dieselbe Infrastruktur** (n8n-Webhook statt totem `#kontakt`-Anker) | behebt den größten Launch-Blocker der Website aus dem Review vom 27.06. mit einem Abend Aufwand |
| hoch | **Partner-Kontingente:** Feld `partner_code` ist im Datenmodell schon angelegt; eigener Link `/stilprobe/?p=CODE` mit reserviertem Kontingent je Institut | setzt v1 §7 („5 Proben für eure Alumni") technisch um |
| mittel | **Content-Doppelnutzen halbautomatisch:** Nach ausdrücklicher separater Freigabe des Coaches erzeugt die Pipeline einen anonymisierten Vorher-nachher-Entwurf für LinkedIn (wieder mit Gabriels Freigabe) | v1 §5.6, stärkstes Beitragsformat mit minimalem Zusatzaufwand |
| mittel | **Klienten-Fassung als Baustein-Ableger:** Pipeline generalisieren → wird Herzstück des Bausteins „Content-Stimme" in Klienten-Projekten | ein Bau, zwei Verwendungen |
| niedrig | Review-Web-App statt Telegram/Mail, wenn Volumen und Team wachsen | erst bei > 30 Proben/Monat sinnvoll |
| niedrig | Warteschlangen-Priorisierung nach Passung (Wächter bewertet Zielgruppen-Fit) | erst mit echter Warteliste relevant |

---

## 15. Offene Punkte

### 15.1 Zulieferungen von Gabriel (vor bzw. in Phase 0/1, je ~5–15 Minuten)

1. **Vorhandenes n8n zeigen:** Wo liegt das Docker-Setup auf dem Laptop (Compose-Datei/Ordner), welche n8n-Version, was läuft dort schon? Claude Code erweitert es, ohne das andere Projekt anzufassen.
2. **Domain bestätigen** (Annahme: `jgc-lumen.de`) und den Stand des All-Inkl-Umzugs der Website nennen (Tarif vorhanden? Zeitplan?). Keine Subdomain, kein Server nötig.
3. **All-Inkl:** Postfach `STILPROBE_MAIL` anlegen, SMTP/IMAP-Zugangsdaten bereitstellen, FTP-Zugang für das `/stilprobe/`-Verzeichnis; AVV mit All-Inkl abschließen (falls noch nicht geschehen).
4. **Telegram:** Bot über @BotFather anlegen (Name z. B. „JGC Lumen Werkbank"), Token übergeben, einmal `/start` an den Bot senden (liefert die Chat-ID für die Whitelist).
5. **Claude-Zugang:** für den Abo-Betrieb einmal `claude setup-token` ausführen (Anleitung liefert Claude Code) **und** im Claude-Konto die Trainings-Verwendung deaktivieren; für den API-Betrieb API-Key aus der Anthropic-Konsole.
6. **Laptop-Gewohnheit bestätigen:** Läuft der Rechner an Werktagen ohnehin? Docker-Autostart beim Windows-Start ist Teil von Phase 0; für Urlaub gibt es `/pause`.
7. **Kalender-Frage klären:** Steht schon ein Buchungslink (cal.com, EU-hostbar) für das Erstgespräch? Sonst enthält die Rückgabe-Mail den Satz „antworte einfach auf diese Mail" statt eines Links.
8. **Deckel bestätigen:** 15 (Variante C) oder 10 (falls Plan-Variante B mit Live-Demos aktiv wird).

### 15.2 Entscheidungen, die im Betrieb fallen

- Abo- oder API-Betrieb als Dauerzustand (Empfehlung in 6.2; Wechsel jederzeit).
- Zeitpunkt, ab dem der Beispiel-Ausschnitt in der Website-Sektion durch einen anonymisierten echten Coach-Ausschnitt ersetzt wird (nur mit separater schriftlicher Freigabe).
- Ob die Wartelisten-Einladung automatisch versandfertig sein darf (v1-Haltung: auch sie bleibt freigabepflichtig – so ist es oben spezifiziert).

---

## Changelog

- **1.1 (10.07.2026):** Infrastruktur umgestellt auf die 0-€-Variante nach Gabriels Entscheidung: kein Mietserver mehr. Neu: PHP-Empfangsschicht auf dem All-Inkl-Webspace (`senden.php`, `kontingent.php`, `zaehler.json` – Annahme, Bestätigung, Kontingent, Telegram-Ping laufen immer), Gabriels vorhandenes Laptop-n8n (Docker) als Werkstatt mit Postfach als Warteschlange und Aufhol-Logik für alle Timer-Jobs. Kein CORS mehr (same-origin), zweistufiger SLA-Wächter, Startkopplung an den All-Inkl-Umzug der Website, Phasen 0/1/5 und Zulieferungen entsprechend neu, Hetzner aus der Auftragsverarbeiter-Liste ersetzt. Dokumentierter Aufstiegspfad: n8n kann später unverändert auf einen kleinen Server umziehen.
- **1.0 (09.07.2026):** Erste Fassung. Automatisierung des Stilprobe-Konzepts v1 mit Vollpipeline (Eingang → Wächter → Textwerk → Freigabe → Versand → Nachfassen → Löschung), Freigabe über Telegram + Mail, Claude als Text-Engine mit Abo/API-Doppelbetrieb, Website-Integration auf Basis Live-Variante 18 (neue Sektion, Unterseite mit Formular, Kontingent-Anzeige), Datenmodell mit Audit-Log, ehrlicher US-Transparenz-Absatz, Phasenplan 0–6 mit Abnahmekriterien, Backlog. Entscheidungsgrundlagen: Gabriels Antworten vom 09.07.2026 (kein Bestand an Server/n8n; Freigabe via Telegram und Mail; Claude bevorzugt über Abo-Kontingent mit Nutzerhinweis; dediziertes Postfach).

*Sprachliche Grundlage der Außentexte: Regelwerk „Coach-Sprache DACH" (Extrakt in Abschnitt 12) und Design-Briefing v8 §10.*
