# Der Weg — die Scroll-Reise als zweite Fassung

Die Seite unter `/der-weg/` zeigt dieselbe Substanz wie die Hauptseite, aber als
Kamerafahrt durch eine Papierwelt: Scrollen bewegt nicht die Seite, sondern die Kamera.
Sieben vorgerenderte Etappen werden nach Scrollposition durchgespult.

Gebaut nach dem Skill `scroll-world`, Kamera-Architektur A (durchgehender Vorwärtsflug,
keine Verbindungsclips). Grundlage: `scroll-world-briefing.md` von Gabriel, 2026-07-23.

## Was wo liegt

| Ort | Inhalt |
|---|---|
| `der-weg/index.html` | Seite, Stationstexte, Engine-Konfiguration |
| `der-weg/scrub-engine.js` | Scroll-Engine aus dem Skill, **mit einer Abweichung** (siehe unten) |
| `der-weg/assets/` | 7 Etappen à 4 Dateien plus Schriften, zusammen rund 52 MB |
| `scripts/der-weg/kodiere.mjs` | Rohvideos → auslieferbare Dateien |
| `scripts/der-weg/pruefe-naehte.mjs` | prüft die Übergänge zwischen den Etappen |
| `scripts/der-weg/hole-schriften.mjs` | löst Fraunces und Inter aus V18 heraus |
| `scripts/der-weg/server.mjs` | lokaler Server zum Ansehen (Port 4330) |
| `scripts/v18/transform-weg-umschalter.mjs` | setzt die Verweise von V18 hierher |
| **Rohmaterial** | `C:\Projekte\JGC Studio\Scroll World\legs\` — **nicht im Repo** (100 MB) |

## Eine Etappe austauschen

Der häufigste Fall: Gabriel liefert ein neues Video für eine Szene nach, etwa Etappe 6
mit seinem eigenen Porträt auf der Staffelei.

```bash
node scripts/der-weg/kodiere.mjs 6
```

Das erzeugt alle vier Dateien der Etappe neu (Desktop, Handy, Poster, Standbild).
Eine ausdrücklich genannte Nummer wird immer überschrieben; ohne Nummer läuft nur, was
fehlt. Danach zwingend:

```bash
node scripts/der-weg/pruefe-naehte.mjs
```

**Warum zwingend:** Die sieben Dateien sind eine einzige Kamerafahrt. Eine ausgetauschte
Etappe berührt immer zwei Übergänge, den davor und den danach. Ein neues Video, das
woanders anfängt oder aufhört als das alte, zerreißt die Fahrt an dieser Stelle.

Die Nummern: 1 anflug · 2 werkzeug · 3 schreibtisch · 4 stilprobe · 5 weg · 6 lichtung ·
7 aussicht.

## Stand der Übergänge (Messung 26.07.2026)

Vier von sechs Übergängen tragen, zwei springen sichtbar:

```
anflug -> werkzeug          trägt
werkzeug -> schreibtisch    SPRUNG
schreibtisch -> stilprobe   SPRUNG
stilprobe -> weg            trägt
weg -> lichtung             trägt
lichtung -> aussicht        trägt
```

Abgefangen wird das derzeit durch eine breitere Überblendung (`crossfade: 0.2` statt
0.12). Sauber wäre, die Etappen 3 und 4 neu zu erzeugen, jeweils mit dem echten letzten
Bild der Vorgängeretappe als Startbild.

**Zum Messverfahren:** Der Skill verlangt einen festen Ähnlichkeitswert von 0,90 je Naht.
Dieses Maß ist bei fein strukturiertem Papier zu streng — schon zwei benachbarte Bilder
DESSELBEN Videos fallen bei zügiger Kamerafahrt auf 0,61. `pruefe-naehte.mjs` misst
deshalb zusätzlich einen Eigenwert je Etappe (gleicher Abstand, aber innerhalb einer
Datei) und bewertet das Verhältnis. Erst das trennt „Kamera bewegt sich schnell" von
„Kamera springt".

## Abweichungen in der Engine

`der-weg/scrub-engine.js` weicht an vier Stellen von der Skill-Vorlage ab, jede im
Quelltext als solche markiert.

**1. Gerätetyp.** Die Vorlage entscheidet mit `Math.min(screen.width, screen.height) <= 600`,
ob ein Gerät die kleine Fassung bekommt. Meldet der Browser die Bildschirmgröße beim Start
noch nicht, ergibt das `min(0,0) = 0` und damit „Handy" — ein Desktop bekäme dauerhaft die
600er-Fassung. Im Vorschaufenster nachgewiesen: Bildschirm 2560×1440, geladen wurden
trotzdem die `-m`-Dateien. Jetzt gilt ohne belastbare Angabe die volle Fassung.

**2. Wann ein Text erscheint.** Die Vorlage lässt den Text einer Station in der MITTE ihres
Segments gipfeln. Das passt zu Architektur B, wo ein Segment ein Hineintauchen in eine
fertig dastehende Szene ist. Hier gilt Architektur A: ein Segment ist die **Fahrt zu**
seiner Szene, und die Szene steht erst am **Ende** da. Mit der Vorlagen-Kurve erschien
jeder Text mitten im Übergang und war wieder weg, sobald das Ziel im Bild war. Konkret:
der Werkzeugwand-Text stand zwischen Schreibtisch und Wand, und der Schreibtisch selbst
blieb stumm. Jetzt läuft der Text zur Ankunft hin ein und hält in die nächste Etappe
hinein, solange dieselbe Szene noch zu sehen ist.

**3. Überblendung pro Etappe.** In der Vorlage ist die Breite global. Zwei der sechs Nähte
springen, vier sind sauber; eine global breite Überblendung würde alle weichzeichnen. Über
`crossfade` je Section bekommen nur die betroffenen Etappen mehr (0,38 statt 0,1).

**4. Markenzeichen.** Die Vorlage setzt einen farbigen Klecks, der die Akzentfarbe der Szene
trägt. Über `brand.logo` steht dort jetzt das Sigel aus V18, voll deckend; der Farbwechsel
wandert in einen weichen Schein dahinter.

## Bewusste Abweichungen vom Briefing

- **Umfang.** Das Briefing plant in §9 einen Lean-Test mit vier Szenen. Es lagen sieben
  fertige Etappen vor, also wurden alle sieben verbaut.
- **Format.** §12 geht von 1080p und 16:9 aus. Das Material ist 1112 × 834, also 4:3.
  Hochskalieren verbietet das Briefing selbst zu Recht; kodiert wird nativ.
- **Handy-Fassung.** §10 will 720p-Geschwister. Bei 834 Pixeln Quellhöhe bringt das wenig.
  Entscheidend ist nicht die Pixelzahl, sondern die Zahl der Ankerbilder: davon gibt es in
  der Handy-Fassung doppelt so viele, denn daran hängt, wie teuer ein Sprung im Video für
  ein Telefon ist.
- **Schriften.** §4 sagt „nur Google Fonts". Sie direkt von Google zu laden schickt die
  IP-Adresse jeder Besucherin dorthin und ist auf einer deutschen Gewerbeseite abmahnbar
  (LG München I, 20.01.2022, 3 O 17493/20); der Seitenprüfer des Projekts verbietet
  externe Schriften ohnehin. Sie kommen jetzt aus V18 und liegen lokal, ohne die sieben
  nicht-lateinischen Schnitte: 283 KB statt 525 KB.
- **Skill-Repo klonen** (§0) entfiel, die Referenzen liegen lokal.

## Offen

- **Porträt in Etappe 6.** Auf der Staffelei steht ein generiertes Papierschnitt-Gesicht.
  Gabriel will es durch sein eigenes ersetzen und liefert die Etappe nach. Solange das
  aussteht, zeigt eine Seite mit dem Titel „Wer mit dir arbeitet" ein Gesicht, das die
  Besucherin für den Gründer halten wird. Das ist die gleiche Ehrlichkeitsfrage wie bei
  den Platzhalter-Kundenstimmen (V13) und sollte vor dem Veröffentlichen geklärt sein.
  Eine Notiz vom 24.07. behauptete, das Portrait sei bereits einkomponiert; die dort
  genannten Dateien (`leg 6 original.mp4`, Werkzeugordner) existieren nicht mehr.
- Die zwei springenden Übergänge (siehe oben).
- Die Seite ist noch nicht auf einem echten Telefon geprüft.
