# Der Weg — die Scroll-Reise als zweite Fassung

Die Seite unter `/der-weg/` zeigt dieselbe Substanz wie die Hauptseite, aber als
Kamerafahrt durch eine Papierwelt: Scrollen bewegt nicht die Seite, sondern die Kamera.
Sieben vorgerenderte Etappen werden nach Scrollposition durchgespult.

Gebaut nach dem Skill `scroll-world`, Kamera-Architektur A (durchgehender Vorwärtsflug,
keine Verbindungsclips). Grundlage: `scroll-world-briefing.md` von Gabriel, 2026-07-23.

## Was wo liegt

| Ort | Inhalt |
|---|---|
| `der-weg/index.html` | Seite, Stationstexte, Langfassungen, Engine-Konfiguration |
| `der-weg/scrub-engine.js` | Scroll-Engine aus dem Skill, **unverändert** (siehe unten) |
| `der-weg/vertiefung.js` | „Mehr dazu": öffnet die Langfassung einer Station (siehe unten) |
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

## Stand der Übergänge (Messung 27.07.2026)

Vier von sechs Übergängen tragen, zwei springen sichtbar — beide um Etappe 3 herum:

```
anflug -> werkzeug          0.742   trägt
werkzeug -> schreibtisch    0.423   SPRUNG   (war 0.304, per Vorlauf-Schnitt verbessert)
schreibtisch -> stilprobe   0.281   SPRUNG   (durch Schneiden NICHT zu retten)
stilprobe -> weg            0.620   trägt
weg -> lichtung             0.855   trägt
lichtung -> aussicht        0.833   trägt
```

Abgefangen wird das in der Seite durch eine breitere Überblendung (`crossfade: 0.38` auf
den beiden Etappen an der Naht).

**Naht 2 → 3: gebessert.** Etappe 3 hatte einen Anlauf — die Kamera driftet in den ersten
drei Bildern von der Anschlussstelle weg und kommt dann zurück. `kodiere.mjs` schneidet
diese drei Bilder jetzt weg (Feld `vorlauf`, 1,6 % der Etappe).

**Naht 3 → 4: nur durch Neuerzeugung.** Ein 12 × 12-Vergleich aller Bildpaare rund um die
Naht liegt flach bei 0,10 bis 0,12 — es gibt kein besseres Schnittbild. Im Standbildvergleich
sieht man warum: derselbe Schreibtisch, aber die Kamera springt **rückwärts und nach oben**.
Eine Richtungsumkehr lässt sich nicht wegschneiden.

**Für die Neuerzeugung** liegen die exakten Anschlussbilder bereit (aus dem Rohmaterial, volle
Auflösung, außerhalb des Repos):

```
C:\Projekte\JGC Studio\Scroll World\legs\anschlussbilder\
  startbild-fuer-leg-3.png    letztes Bild von leg 2
  startbild-fuer-leg-4.png    letztes Bild von leg 3
```

Neu erzeugen mit dem passenden Startbild, Rohdatei ersetzen, dann
`node scripts/der-weg/kodiere.mjs 4` und `node scripts/der-weg/pruefe-naehte.mjs`.
Bei einer neuen Etappe 3 zusätzlich das Feld `vorlauf` in `kodiere.mjs` auf 0 zurücksetzen —
es korrigiert einen Fehler, den genau diese Rohdatei hat.

**Zum Messverfahren:** Der Skill verlangt einen festen Ähnlichkeitswert von 0,90 je Naht.
Dieses Maß ist bei fein strukturiertem Papier zu streng — schon zwei benachbarte Bilder
DESSELBEN Videos fallen bei zügiger Kamerafahrt auf 0,61. `pruefe-naehte.mjs` misst
deshalb zusätzlich einen Eigenwert je Etappe (gleicher Abstand, aber innerhalb einer
Datei) und bewertet das Verhältnis. Erst das trennt „Kamera bewegt sich schnell" von
„Kamera springt".

## Zwei Fassungen der Seite: breit und hochkant

Ab 27.07.2026 sieht die Reise hochkant anders aus als auf einem breiten Schirm — nicht aus
Geschmack, sondern weil das Material 4:3 ist (1112 × 834). Auf einem 393 × 852 großen Telefon
bleiben formatfüllend nur **35 % der Bildbreite** übrig.

| | breit (PC, Tablet quer) | hochkant (Telefon, Tablet hochkant) |
|---|---|---|
| Bild | ganzer Schirm | oberes Band, Rest ist Textstreifen |
| Text | linke Spalte, Verlauf nach rechts | im Streifen zentriert, Pergament-Verlauf nach oben |
| sichtbar von der Szene | 100 % | 54 % (393 × 852) bis 96 % (360 × 640) |
| Zähler „01 / 07" | sichtbar | ausgeblendet (die Punkte rechts zeigen dasselbe) |
| Scroll-Hinweis | unten mittig | auf dem unteren Bildrand, einzeilig |
| greift bei | alles andere | `orientation: portrait` **und** ≤ 1200 px |

Die Grenze hängt bewusst an der Ausrichtung, nicht allein an der Breite: ein iPad Pro 12.9"
hochkant ist 1024 px breit und fiel vorher auf die breite Fassung, obwohl der Schirm hochkant
ist. Umgekehrt braucht kein Tablet quer die Hochkant-Fassung — dort ist der Schirm breiter als
4:3, es wird also gar nichts abgeschnitten.

**Nachjustieren:** eine Zahl, `--weg-textzone` in `der-weg/index.html` — die Höhe des
Textstreifens, von unten gemessen. Bild, Verlauf, Naht und die Lage des Scroll-Hinweises leiten
sich daraus ab.

```
--weg-textzone: max(36%, 270px);     /* schmaler als 380 px: 300px statt 270px */
```

**Anteil oder Mindesthöhe, je nachdem was größer ist** — und das ist der ganze Trick. Die
Textmenge einer Station ist fest, ihre Höhe hängt an der Schriftgröße, nicht an der Schirmhöhe.
Ein Telefon mit hoher Pixeldichte meldet nur rund 700 CSS-Pixel Höhe; derselbe Text frisst dort
einen viel größeren Anteil als auf 850. Ein fester Prozentwert müsste sich am schlechtesten Fall
orientieren und hielte das Bild überall sonst unnötig klein. Eine Staffelung in Stufen hatte
denselben Fehler in klein: Gabriels Gerät fiel in die unterste Stufe und sah keine Änderung.

| Schirm | Streifen | Band | Szene sichtbar |
|---|---|---|---|
| 393 × 852 | 307 px (36 %) | 64 % | 54 % |
| 393 × 706 | 270 px (38 %) | 62 % | 68 % |
| 360 × 640 | 300 px (47 %) | 53 % | 79 % |
| 430 × 932 | 336 px (36 %) | 64 % | 54 % |
| 820 × 1180 | 425 px (36 %) | 64 % | 80 % |

Merkwürdig, aber richtig: **mehr Textanteil heißt mehr sichtbares Bild** — ein flacheres Band
liegt näher am 4:3 der Quelle, es wird also weniger abgeschnitten. Die Szene wird dabei nur
kleiner dargestellt, nicht knapper.

Maßgeblich für die Mindesthöhe ist die **längste Station** (6 oder 7, je nach Breite): passt sie
nicht in den Streifen, wird unten etwas abgeschnitten. Nach jeder Änderung an Zahl, Schriftgröße
oder Stationstext also die längste Station nachmessen. Zwei weitere Hebel stehen daneben — unter
`max-height: 780px` ist die Schrift eine Stufe kleiner, und der „Mehr"-Knopf sitzt in der
Kopfzeile statt in einer eigenen Zeile. Beides senkt die längste Station und heißt damit
unmittelbar mehr Bild.

## Der Ausklang

Bühne und Textebene liegen fest im Fenster, der Leseteil (Fragen, Abspann) schiebt sich darüber.
Ohne Zutun bliebe der letzte Stationstext dabei stehen und würde einfach zugedeckt — das liest
sich wie ein Abbruch. Ein kleiner Block am Ende von `der-weg/index.html` verschiebt deshalb die
ganze Textebene (Pergament-Verlauf **und** Schrift) genau so weit nach oben, wie der Leseteil
schon ins Bild gekommen ist. Beide bewegen sich im Gleichschritt, die Unterkante des Verlaufs
liegt immer bündig auf der Oberkante des Leseteils.

Das Video bleibt bewusst stehen: es ist der Hintergrund, vor dem der Text abzieht, und wird vom
deckenden Leseteil ohnehin verdeckt. Kopfleiste und Wegpunkte brauchen nichts — sie liegen unter
dem Leseteil (Stapelhöhe 50 und 40 gegen 70).

Alles davon steht in `der-weg/index.html`, nicht in der Engine — siehe nächster Abschnitt.
Nachmessen im Browser statt nach Augenmaß: die Fallen dabei stehen in der Projekt-CLAUDE.md
unter „Preview-Messungen".

## „Mehr dazu": die Langfassung einer Station

In der Kopfzeile jeder Station — rechts neben dem Kleintext — steht ein Knopf „Mehr +", der die
vollständigen Inhalte des zugehörigen Abschnitts der Hauptseite als Feld in der Bildschirmmitte
öffnet.

**Warum dort und warum ein Plus.** Unter dem Text kostete er eine ganze Zeile (rund 50 px), und
weil die längste Station die Mindesthöhe des Textstreifens bestimmt, ging dieser Platz direkt vom
Bild ab. Ein Pfeil nach unten wäre außerdem gelogen: der Inhalt klappt nicht an Ort und Stelle
auf, sondern öffnet ein Feld in der Mitte. Das Plus ist dasselbe Zeichen, das die häufigen Fragen
weiter unten für dieselbe Handlung benutzen. Hochkant fällt das Wort „dazu" weg, damit die
Kopfzeile auf allen sieben Stationen einzeilig bleibt — der längste Kleintext plus voller Knopf
braucht 385 px, verfügbar sind bei 393 px Schirmbreite nur 354.

**Texte ändern:** im Markup von `der-weg/index.html`, Block `<div id="vertiefungen">`, ein
`<article data-station="…">` je Station. Kein Skript nötig, kein Build. Erlaubte Bausteine:
`.vertiefung-auge` (Kleintext oben), `h2`, `h3`, `.vertiefung-preis`, `p`, `ul`/`li`, `strong`, `a`.
Interne Links absolut halten (`/jgc-studio-website/…`).

**Zuordnung:** über `data-station` auf den Wert von `id` in der Sektions-Konfiguration. Die
Reihenfolge leitet `mountVertiefung` aus `wegKonfig.sections` ab, damit keine zweite Liste
entsteht, die auseinanderlaufen kann. Fehlt zu einer Station ein Artikel, bekommt sie einfach
keinen Knopf — kein Fehler.

**Verhalten beim Scrollen** (der einzige Punkt, an dem man sich vertun kann): Solange das Feld
offen ist, hält die Reise an. Erst scrollt der Text im Feld; ist er zu Ende und man scrollt
weiter, geht es zu und die Reise läuft weiter. Dazu Schließknopf, Escape und Klick auf den
Hintergrund. Würde die Kamera weiterlaufen, wäre eine lange Station gar nicht lesbar.

**Ohne JavaScript** stehen die Langfassungen als gewöhnlicher Lesetext untereinander — die Regel
`.js .vertiefungen { display: none }` blendet sie nur aus, wenn sie per Knopf erreichbar sind.

## Engine: unveränderte Skill-Fassung

`der-weg/scrub-engine.js` ist eine **unveränderte Kopie** aus dem Skill
(`~/.claude/skills/scroll-world/references/scrub-engine.js`). Beim Bau dieser Seite
entstanden vier Änderungen an der Engine; sie sind am 26.07.2026 alle in den Skill selbst
zurückgeflossen, damit sie beim nächsten Projekt von allein zur Verfügung stehen. Diese
Seite hat deshalb **keine Sonderfassung** mehr zu pflegen.

Was dabei in den Skill wanderte, in Kurzform:

1. **Gerätetyp.** Ein noch nicht gemeldeter Bildschirm (0) galt als „Handy", weil
   `min(0,0) <= 600` wahr ist — ein Desktop bekam dauerhaft die kleine Fassung.
2. **Wann ein Text erscheint** (`copyTiming`). Bei Architektur A ist eine Etappe die
   **Fahrt zu** ihrer Szene; die Szene steht erst am Ende da. Der Text gipfelte aber in
   der Etappenmitte, also im Niemandsland. Die Engine erkennt die Architektur jetzt selbst
   am leeren `connectors`-Feld.
3. **Überblendung je Etappe** (`crossfade` pro Section). Vorher global, was bei einer
   einzigen schlechten Naht die ganze Reise weichgezeichnet hätte.
4. **Markenzeichen** (`brand.logo`). Statt eines Farbklecks das echte Sigel, mit dem
   Szenenakzent als weichem Schein dahinter.

Die ausführlichen Begründungen stehen in `docs/scroll-world-lessons.md`.

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
  **Seit dem „Mehr dazu"-Feld schärfer:** dort steht jetzt Gabriels Name, sein Werdegang und
  seine TÜV-Prüfzeichen-ID neben dem erfundenen Gesicht. Was vorher eine Andeutung war, ist damit
  eine ausdrückliche Zuschreibung.
  Eine Notiz vom 24.07. behauptete, das Portrait sei bereits einkomponiert; die dort
  genannten Dateien (`leg 6 original.mp4`, Werkzeugordner) existieren nicht mehr.
- Die zwei springenden Übergänge (siehe oben).
- **Drei Dinge in den Skill zurückgeben**, sobald sie sich bewährt haben: die Hochkant-Fassung
  (das 4:3-auf-9:19,5-Problem trifft jede Scroll-Welt), das „Mehr dazu"-Feld, und vor allem die
  verlorene Zentrierung der breiten Fassung — die ist ein echter Fehler der Engine, kein
  Geschmack, und trifft jedes Projekt, das den Skill benutzt (`top: 50%` plus
  `transform: translateY(-50%)`, während die Engine `transform` beim Scrollen überschreibt;
  Abhilfe ist die eigenständige Eigenschaft `translate`). Erst nach Gabriels Urteil am Gerät.
- Die Seite ist noch nicht auf einem echten Telefon geprüft.
