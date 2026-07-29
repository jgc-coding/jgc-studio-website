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
--weg-textzone: max(36svh, 380px);   /* niedrige Schirme (unter 780 px Hoehe): 350px */
```

**Seit 29.07.2026 in `svh` statt `%`, und das ist keine Kosmetik.** Chrome auf Android misst feste
Elemente am *großen* Fenster — dem ohne Adressleiste. Steht die Leiste, ragt die Unterkante eines
`position: fixed; inset: 0` rund 110 px unter den sichtbaren Rand, und genau dort hing die
Unterkante des Textstreifens: Was nicht mehr in den Rest passte, stand unter dem Bildschirmrand
(Gabriels Screenshots vom 29.07.: derselbe Auftakt dreimal, einmal mit abgeschnittenem letzten
Schlagwort). Weil die Leiste beim Scrollen ein- und ausfährt, wanderte die Aufteilung außerdem
während der Fahrt mit. `100svh` ist die *kleinste* mögliche Fensterhöhe und ändert sich nie — die
Aufteilung steht damit fest, und fährt die Leiste aus, kommt unten nur Pergament dazu.
`dvh` wäre falsch: es ist die jeweils aktuelle Höhe, das Bildband würde bei jedem Ein- und
Ausfahren neu skaliert. Browser ohne `svh` behalten die alten Prozentregeln (`@supports`).

**Anteil oder Mindesthöhe, je nachdem was größer ist** — und das ist der ganze Trick. Die
Textmenge einer Station ist fest, ihre Höhe hängt an der Schriftgröße, nicht an der Schirmhöhe.
Ein Telefon mit hoher Pixeldichte meldet nur rund 700 CSS-Pixel Höhe; derselbe Text frisst dort
einen viel größeren Anteil als auf 850. Ein fester Prozentwert müsste sich am schlechtesten Fall
orientieren und hielte das Bild überall sonst unnötig klein. Eine Staffelung in Stufen hatte
denselben Fehler in klein: Gabriels Gerät fiel in die unterste Stufe und sah keine Änderung.

Gemessen am 29.07.2026, nachdem der „Mehr"-Knopf unter den Text gezogen ist (eine Zeile mehr,
darum 380 statt 320 px). Die Schirmhöhe ist hier die **sichtbare** Höhe (`svh`), also die mit
ausgefahrener Adressleiste — das ist der Fall, den man auf dem Telefon zuerst sieht:

| Schirm (sichtbar) | Streifen | Band | Szene sichtbar |
|---|---|---|---|
| 393 × 852 | 380 px | 55 % | 62 % |
| 360 × 640 | 350 px (niedrige Stufe) | 45 % | 93 % |
| 320 × 568 | 350 px (niedrige Stufe) | 38 % | 100 % (dafür oben/unten beschnitten) |

Merkwürdig, aber richtig: **mehr Textanteil heißt mehr sichtbares Bild** — ein flacheres Band
liegt näher am 4:3 der Quelle, es wird also weniger abgeschnitten. Die Szene wird dabei nur
kleiner dargestellt, nicht knapper.

Maßgeblich für die Mindesthöhe ist die **Schluss-Station** mit ihren zwei gestapelten Knöpfen
(rund 314 px Inhalt, gemessen bei 375 × 812 — Runde 3 fand sie auf 375er- und 390er-iPhones
14 px oben ins Bild ragend). Seit dem 29.07. ist es die Station „Auf Augenhöhe" mit 299 px
(393 × 852) bzw. 307 px (360 × 640) — der „Mehr"-Knopf steht jetzt unter dem Text und braucht
seine eigene Zeile. Passt eine Station nicht in den Streifen, ragt sie oben und unten je zur
Hälfte heraus; bis ~3 px verschwindet das im deckenden Teil des Verlaufs. Nach jeder Änderung an
Zahl, Schriftgröße oder Stationstext also die längste Station nachmessen — Stand 29.07. bleiben
überall mindestens 14 px Luft. Ein weiterer Hebel steht daneben: unter `max-height: 780px` ist
die Schrift eine Stufe kleiner (dort reichen 350 px), unter 393 px Breite zusätzlich der
Stations-Kleintext.

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

**Seit 29.07.2026 verschwindet das Video ausschließlich dadurch, dass die Fragen darüber
hochwandern.** Vorher blendete die Engine die letzte Szene nach ihrem Ende zusätzlich selbst aus
(rund 80 px Scrollweg bei `crossfade: 0.1`), der Leseteil kommt aber erst einen ganzen Bildschirm
später — dazwischen stand eine leere Pergamentfläche, die Reise endete im Nichts. Die Engine hält
die letzte Szene jetzt stehen (`i < NSEG - 1` in der Deckkraft-Schleife), und der Ausklang-Streifen
ist von 22vh auf 34vh gewachsen, weil er die ganze Überblendung allein trägt. Nachgemessen: die
letzte Szene steht bei jedem Messpunkt von 900 px vor dem Bahnende bis 700 px danach auf
Deckkraft 1,000 (vorher wäre sie 400 px vor dem Bahnende bereits bei 0 gewesen).

Alles davon steht in `der-weg/index.html`, nicht in der Engine — siehe nächster Abschnitt.
Nachmessen im Browser statt nach Augenmaß: die Fallen dabei stehen in der Projekt-CLAUDE.md
unter „Preview-Messungen".

## „Mehr dazu": die Langfassung einer Station

Am Ende jeder Station steht ein Knopf „Mehr dazu +", der die vollständigen Inhalte des
zugehörigen Abschnitts der Hauptseite als Feld in der Bildschirmmitte öffnet. Auf der
Schluss-Station steht er **vor** den Handlungsknöpfen: was jemand als Letztes liest, soll
„Erstgespräch anfragen" sein und nicht das Angebot, noch mehr zu lesen.

**Warum unten und warum ein Plus.** Bis zum 29.07.2026 saß er in einer Kopfzeile rechts neben dem
Stations-Kleintext. Das kostete rund 10 px statt einer ganzen Zeile, und weil die längste Station
die Mindesthöhe des Textstreifens bestimmt, ging der gesparte Platz direkt ans Bild. Am Gerät hat
sich das nicht bewährt: rechts außen läuft die Wegpunkt-Leiste, und der Knopf lag genau darauf —
zwei Bedienelemente an derselben Stelle, eines davon halb verdeckt. Unten steht er frei, in
Leserichtung nach dem Text, den er vertieft. **Der Preis dafür steht in der Tabelle oben: eine
Knopfzeile, also 380 statt 320 px Streifen und rund 60 px weniger Bild.** Ein Pfeil nach unten
wäre außerdem gelogen: der Inhalt klappt nicht an Ort und Stelle auf, sondern öffnet ein Feld in
der Mitte. Das Plus ist dasselbe Zeichen, das die häufigen Fragen weiter unten benutzen.

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

## Datenmodus: erst leicht, dann aufrüsten

Die Reise kostet auf einem Telefon rund 17 MB, wenn man sie ganz durchscrollt. Auf 4G ist
das unauffällig, auf schwachem 3G sind es Minuten. Deshalb entscheidet die Seite selbst,
ob sie Video lädt — **und lädt bis zu dieser Entscheidung keines.**

| Zustand | Datenmenge (Handy) | auf schwachem 3G |
|---|---|---|
| Standbilder, ganze Reise | 0,37 MB | 3,7 s |
| Einstieg mit Video (eine Etappe) | 3,2 MB | 32 s |
| ganze Reise mit Video | 17 MB | 170 s |

**Wie entschieden wird: durch Messen, nicht durch Fragen.** Der übliche Weg wäre, den
Browser zu befragen (`saveData`, `effectiveType`) — das tut die Engine auch, nur verrät das
außer Chrome auf Android niemand. Ein iPhone im schlechten Netz bekäme also die volle
Fassung, und genau dort tut sie am meisten weh.

Die Seite lädt ohnehin rund 340 KB, bevor das erste Video überhaupt dran wäre (Programm,
Schriften, erstes Standbild). Wie lange das gedauert hat, steht im Browser (Resource
Timing); daraus fällt die tatsächliche Geschwindigkeit ab, ohne ein einziges zusätzliches
Byte. Gemessen wird zweimal — nach 1,8 s und noch einmal nach 6 s, weil der erste Wert
Namensauflösung und Verbindungsaufbau enthält und eine schnelle Leitung unterschätzen kann.
Schwelle: **375 KB/s (rund 3 Mbit/s)**.

Kam wenig bis nichts über die Leitung, liegt alles im Zwischenspeicher des Browsers — dann
kostet das Video nichts mehr und wird freigegeben.

**Der Schalter im Abspann** überschreibt die Messung und merkt sich die Wahl im Browser
(`localStorage`, Schlüssel `weg-datenmodus`: `sparsam` oder `voll`). Er lädt die Seite neu,
statt mitten im Flug umzuschalten. Es wird nie jemand gefragt — wer nichts tut, bekommt die
Messung.

Stellschrauben in `der-weg/index.html`, Block „Datenmodus": `SCHWELLE`, die beiden Zeitpunkte,
und in der Konfiguration `prefetch: 0.8` (wie viele Bildschirmhöhen im Voraus geladen wird —
0.8 lädt beim Öffnen eine Etappe, der Standard 1.6 lädt zwei).

## Engine: Zusätze gegenüber dem Skill

`der-weg/scrub-engine.js` war bis zum 27.07.2026 eine unveränderte Kopie aus dem Skill
(`~/.claude/skills/scroll-world/references/scrub-engine.js`). Seitdem trägt sie diese
Zusätze, alle rückwärtskompatibel — eine Konfiguration ohne sie verhält sich wie vorher:

| Zusatz | Wirkung |
|---|---|
| `clipStart: 'gated'` | mountet im Standbild-Modus und lädt **kein** Video, bis die Seite `allowClips()` ruft |
| `prefetch: 0.8` | Vorausladen in Bildschirmhöhen (Standard 1.6) |
| Rückgabewert | `{ allowClips(), enterStillsMode(), mode() }` — vorher gab die Funktion nichts zurück |
| `visibility` an Stationen | ausgeblendete Stationstexte waren nur durchsichtig, aber weiter klickbar (die CTA-Knöpfe der Schluss-Station fingen auf Schirm 1 unsichtbar Klicks — mailto!) und tastatur-fokussierbar; jetzt schaltet `read()` zusätzlich `visibility` (V21, Runde 3) |
| Nachlade-Deckel | ein dauerhaft fehlender Clip (404) löste bei jedem Scroll-Bild einen neuen Abruf aus; jetzt höchstens drei Versuche je Etappe (V28, Runde 3) |
| Letzte Szene bleibt stehen | jede Szene blendete nach ihrem Ende aus — auch die letzte, obwohl danach nichts mehr kommt außer dem Leseteil. Die Reise endete darum in einer leeren Fläche. Jetzt gilt die Ausblendung nur für `i < NSEG - 1` (V37, 29.07.) |

Die Trennung ist Absicht: die **Engine** bringt die Mechanik, die **Seite** die Politik
(Schwelle, Messzeitpunkte, gemerkte Wahl, Schalter). Damit ist der Zusatz für jedes
Scroll-Welt-Projekt brauchbar, ohne dass eine Datenschutz- oder Netzannahme mit in den
Skill wandert.

Beim Bau dieser Seite entstanden davor bereits vier Änderungen an der Engine; sie sind am
26.07.2026 alle in den Skill zurückgeflossen. Diese beiden hier stehen noch aus (siehe
„Offen").

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
- **In den Skill zurückgeben**, sobald sie sich bewährt haben:
  1. `clipStart: 'gated'` + `prefetch` + Rückgabewert, die `visibility`-Kopplung der
     Stationstexte (V21) und der Nachlade-Deckel (V28) — stehen bereits **in** der Engine,
     müssen also nur noch in die Skill-Fassung übernommen werden. Bis dahin ist
     `der-weg/scrub-engine.js` eine Sonderfassung, und ein Update aus dem Skill würde sie
     überschreiben.
  2. Die verlorene Zentrierung der breiten Fassung — ein echter Fehler der Engine, kein
     Geschmack, und er trifft jedes Projekt, das den Skill benutzt (`top: 50%` plus
     `transform: translateY(-50%)`, während die Engine `transform` beim Scrollen überschreibt;
     Abhilfe ist die eigenständige Eigenschaft `translate`).
  3. Die Hochkant-Fassung — das 4:3-auf-9:19,5-Problem trifft jede Scroll-Welt.
  4. Das „Mehr"-Feld.
  5. Der Kontrast des aktiven Nav-Reiters: Weiß auf Szenenakzent misst 2,6–3,3:1 —
     diese Seite überschreibt ihn auf Tinte (V24); im Skill sollte der Default selbst
     dunkel genug sein. **Nachtrag 29.07.:** Diese Seite hat die Aktiv-Markierung des
     Reiters ganz entfernt (V29), weil die Punktleiste dasselbe schon sagt. Für den Skill
     ist das eine Geschmacksfrage, der Kontrast-Default bleibt trotzdem zu korrigieren.
  6. **Die letzte Szene stehen lassen** (V37) — der Fehler trifft jede Scroll-Welt, die unter
     der Reise noch etwas anderes hat: die Schluss-Szene blendet aus, bevor der nachfolgende
     Inhalt da ist, und dazwischen steht eine leere Seite. Einzeiler in der Deckkraft-Schleife.
  7. **Die Aufteilung hochkant an `svh` binden** (V35) — feste Elemente rechnen in Chrome auf
     Android am grossen Fenster; alles, was unten am Rand haengt, steht mit ausgefahrener
     Adressleiste unter dem sichtbaren Bereich. Betrifft jede Scroll-Welt mit einem
     Textstreifen am unteren Rand.
  8. **Ein echter Engine-Fehler bei jedem nicht-quadratischen Logo** (gefunden über V30):
     `.sw-brand__logo` bekommt `width:100%; height:100%` in einem Kasten, der ein Raster mit
     automatisch hoher Zeile ist. Gegen eine solche Zeile kann der Browser keine Prozenthöhe
     auflösen — er nimmt die natürliche Form des Bildes. Ein hochkantes Sigel (hier 504×747)
     wird damit anderthalbmal so hoch wie sein Kasten und läuft unten heraus; `object-fit`
     greift nie, weil der Kasten selbst mitwächst. Trifft jedes Projekt mit einem Logo, das
     nicht quadratisch ist. Abhilfe im Skill: die Kastenhöhe fest setzen und die Breite aus
     dem Bildverhältnis ableiten, statt beides über Prozent zu führen.
- Die Seite ist noch nicht auf einem echten Telefon geprüft.
