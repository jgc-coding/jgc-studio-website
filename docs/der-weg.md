# Der Weg — die Scroll-Reise als zweite Fassung

Die Seite unter `/der-weg/` zeigt dieselbe Substanz wie die Hauptseite, aber als
Kamerafahrt durch eine Papierwelt: Scrollen bewegt nicht die Seite, sondern die Kamera.
Sieben vorgerenderte Etappen werden nach Scrollposition durchgespult.

Gebaut nach dem Skill `scroll-world`, Kamera-Architektur A (durchgehender Vorwärtsflug,
keine Verbindungsclips). Grundlage: `scroll-world-briefing.md` von Gabriel, 2026-07-23.

## Was wo liegt

| Ort | Inhalt |
|---|---|
| `der-weg/index.html` | Seite, Stationstexte, Langfassungen, Formulare, Engine-Konfiguration |
| `der-weg/scrub-engine.js` | Scroll-Engine aus dem Skill, **unverändert** (siehe unten) |
| `der-weg/vertiefung.js` | „Mehr dazu": öffnet die Langfassung einer Station (siehe unten) |
| `der-weg/formulare.js` | die zwei Formular-Overlays: Stilprobe einreichen, Erstgespräch anfragen (siehe unten) |
| `der-weg/assets/` | 7 Etappen à 4 Dateien plus Schriften, Siegel und Portrait, zusammen rund 46 MB |
| `der-weg/assets/portrait-gabriel.webp` | Gabriels Portrait in der Langfassung „Über mich" (720 × 960, 41 KB) — Kopie von `Bildmaterial/Profilbild/profil-halbfigur-web.webp`, dieselbe Datei liegt eingebettet in V18 |
| `scripts/der-weg/kodiere.mjs` | Rohvideos → auslieferbare Dateien |
| `scripts/der-weg/teile-verbunden.mjs` | teilt Gabriels Durchgangsclip in die Etappen 3 und 4 |
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

Die Engine kennt außerdem die Bildrate der Clips (`clipFps: 24` in `der-weg/index.html`)
und springt nur bei echtem Bildwechsel. `kodiere.mjs` warnt, wenn eine neu kodierte
Etappe von 24 fps abweicht — dann die Zahl dort mitziehen. Und wer einen Clip tauscht,
misst seine Bildbewegung neu und rechnet den `scroll`-Wert nach (Regel unten, V49).

Die Nummern: 1 anflug · 2 werkzeug · 3 schreibtisch · 4 stilprobe · 5 weg · 6 lichtung ·
7 aussicht.

**Etappe 3 und 4 sind ein Sonderfall.** Sie stammen seit dem 28.08.2026 aus EINER Rohdatei,
die `teile-verbunden.mjs` in zwei zerlegt (Abschnitt unten). Wer eine der beiden ersetzt,
muss beide zusammen denken — und die alten Einzeldateien liegen unter
`Scroll World\legs\vor-schnitt-2026-08-28\`.

## Stand der Übergänge (Messung 28.08.2026)

Fünf von sechs Übergängen tragen, einer springt sichtbar:

```
anflug -> werkzeug          0.742 / Eigenwert 0.656 = 1.13   trägt
werkzeug -> schreibtisch    0.432 / 0.962 = 0.45             SPRUNG
schreibtisch -> stilprobe   0.905 / 0.810 = 1.12             trägt   (war 0.281 = SPRUNG)
stilprobe -> weg            0.821 / 0.638 = 1.29             trägt   (war 0.620)
weg -> lichtung             0.855 / 0.696 = 1.23             trägt
lichtung -> aussicht        0.833 / 0.837 = 1.00             trägt
```

Abgefangen wird der verbliebene Sprung durch eine breitere Überblendung (`crossfade: 0.38`
auf `werkzeug` und `schreibtisch`). Auf `stilprobe` stand bis zum 28.08.2026 dieselbe 0,38 —
sie hing an der Naht davor und ist mit ihr weggefallen.

**Naht 2 → 3: gebessert.** Etappe 3 hatte einen Anlauf — die Kamera driftet in den ersten
drei Bildern von der Anschlussstelle weg und kommt dann zurück. `kodiere.mjs` schneidet
diese drei Bilder jetzt weg (Feld `vorlauf`, 1,6 % der Etappe).

**Naht 3 → 4: erledigt am 28.08.2026, durch Neurendering.** Vorgeschichte: Ein 12 × 12-Vergleich
aller Bildpaare rund um die alte Naht lag flach bei 0,10 bis 0,12 — es gab kein besseres
Schnittbild. Im Standbildvergleich sah man warum: derselbe Schreibtisch, aber die Kamera sprang
**rückwärts und nach oben**. Eine Richtungsumkehr lässt sich nicht wegschneiden.

Gabriel hat den ganzen Bogen deshalb neu gerendert, und zwar als **ein durchgehendes Video**
(`Scroll World\legs\ueberarbeitet\Segmente-verbunden.mp4`). Was darin steckt, gemessen gegen das
alte Rohmaterial:

```
neu 0 .. 122     altes leg 3, dessen Bild 0 .. 98    (Ähnlichkeit 0,995–0,997)
neu 123 .. 142   NEU gerendert — die Brücke, die den Sprung ersetzt
neu 143 .. 364   altes leg 4, dessen Bild 16 .. 192  (Ähnlichkeit 0,990–0,997)
```

Anfang und Ende sind also praktisch identisch mit dem alten Material — **die Nähte 2 → 3 und
4 → 5 bleiben davon unberührt**, ersetzt ist nur die kaputte Stelle. Herausgeschnitten sind
rund 3,9 s.

### Der Durchgangsclip und seine Teilung

`scripts/der-weg/teile-verbunden.mjs` macht daraus wieder zwei Etappen. Es bringt das Video
auf 1112 × 834 und 24 Bilder/s (Gabriels Fassung ist 1440 × 1080 bei 30) und teilt bei **Bild 121**
der umgerechneten Fassung:

| | Bilder | Länge | Inhalt |
|---|---|---|---|
| Etappe 3 `schreibtisch` | 118 (nach 3 Bildern Vorlauf) | 4,92 s | Anflug an den Schreibtisch, Ankunft im Stillstand |
| Etappe 4 `stilprobe` | 169 (2 Bilder Nachlauf ab) | 7,04 s | der Stift schreibt, Tauchgang zur Feder |

**Warum bei 121.** Die Bild-zu-Bild-Bewegung fällt ab Bild 85 auf ein Zehntel des Anfangswerts,
ist zwischen 117 und 125 am kleinsten und steigt ab 170 wieder. Die Kamera steht dort also still —
der Ankunftsmoment für „Was sich wirklich ändert". Und ab Bild 134 beginnt der Stift zu schreiben,
also der Bildinhalt von „Lies dich selbst". Die Station wechselt damit dort, wo auch das Bild die
Geschichte wechselt.

**Warum die Auflösung nach unten geht.** Nur zwei von sieben Etappen wären sonst schärfer als
ihre Nachbarn, und das fällt an den Nähten auf. Die 24 Bilder/s sind zwingend: `clipFps` ist
**eine** Zahl für alle Clips, und die Scroll-Engine bleibt unverändert.

**Warum 2 Bilder am Ende wegfallen.** Das Video fährt zwei Bilder über den Punkt hinaus, an dem
Etappe 5 ansetzt. Gegen deren erstes Bild misst sich Bild 289 mit 0,891, die Bilder 290 und 291
nur noch mit 0,626 — das alte leg 4 endete genau auf diesem Überschuss, daher die alte Naht von
0,620. Zwei Bilder weniger kosten 0,08 s und heben die Naht auf 0,821.

Die alten Einzeldateien sind nicht gelöscht, sondern liegen unter
`Scroll World\legs\vor-schnitt-2026-08-28\`.

**Für eine spätere Neuerzeugung** liegen die exakten Anschlussbilder weiterhin bereit (aus dem
Rohmaterial, volle Auflösung, außerhalb des Repos):

```
C:\Projekte\JGC Studio\Scroll World\legs\anschlussbilder\
  startbild-fuer-leg-3.png    letztes Bild von leg 2
  startbild-fuer-leg-4.png    letztes Bild von leg 3
```

Neu erzeugen mit dem passenden Startbild, Rohdatei ersetzen, dann
`node scripts/der-weg/kodiere.mjs 4` und `node scripts/der-weg/pruefe-naehte.mjs`.
Das Feld `vorlauf: 3` in `kodiere.mjs` gilt weiterhin und weiterhin nur für Etappe 3: auch der
neue Clip beginnt mit demselben Anlauf (gemessen 28.08.2026 — Bild 2 und 3 sind die besten
Anschlüsse an Etappe 2, Bild 0 und 1 liegen deutlich darunter). Bei einer wirklich neuen
Etappe 3 auf 0 zurücksetzen.

**Zum Messverfahren:** Der Skill verlangt einen festen Ähnlichkeitswert von 0,90 je Naht.
Dieses Maß ist bei fein strukturiertem Papier zu streng — schon zwei benachbarte Bilder
DESSELBEN Videos fallen bei zügiger Kamerafahrt auf 0,61. `pruefe-naehte.mjs` misst
deshalb zusätzlich einen Eigenwert je Etappe (gleicher Abstand, aber innerhalb einer
Datei) und bewertet das Verhältnis. Erst das trennt „Kamera bewegt sich schnell" von
„Kamera springt".

## Das Tempo der Fahrt — warum hier kein `linger` steht

Die Engine kann die Kamera in der **Mitte** einer Etappe bremsen (`linger` je Sektion). Das ergibt
nur bei der Textführung `copyTiming: 'middle'` Sinn, wo der Stationstext ebendort aufblüht. Diese
Seite läuft aber auf `'arrival'` (Architektur A, leeres `connectors`-Feld): der Text blendet erst
zum **Ende** der Etappe ein.

Drei Stationen trugen trotzdem ein `linger` (0,3 bis 0,45) — die Bremse saß damit im leeren Teil
der Fahrt, und an der Naht, wo der Text ankommt und wo zwei der sechs Übergänge ohnehin springen,
raste die Kamera. Gemessen an „Was sich wirklich ändert" (Etappe 1329 px, `linger: 0.4`):

| Scrollanteil | Filmanteil | Textdeckkraft |
|---|---|---|
| 0,0 → 0,3 | 0,000 → 0,367 (Rate 1,22) | 0,000 |
| 0,3 → 0,7 | 0,367 → 0,633 (Rate **0,62**) | 0,000 → 0,431 |
| 0,7 → 1,0 | 0,633 → 1,000 (Rate 1,22) | 0,431 → 1,000 |

Die mittleren 40 % des Scrollwegs — 532 px — brachten also 27 % des Films, und der Text war dort
noch unlesbar. Genau das meldete Gabriel am 30.07. als „zäh, als müsste man mehr scrollen, um
beim Video voranzukommen" (V38). Seitdem steht nirgends mehr ein `linger`; jede Etappe läuft mit
Rate 1,0 durch.

Ein Verweilen bei der Ankunft braucht es nicht extra: `'arrival'` hält den Text ohnehin in die
nächste Etappe hinein (`rampOut`), deren erste Bilder dieselbe Szene zeigen. **Merksatz:** `linger`
und `copyTiming` gehören zusammen — wer das eine setzt, muss das andere prüfen.

### Woher die `scroll`-Werte kommen (V49, 31.07.2026)

Nach dem Ausbau von `linger` blieb ein zweiter Tempo-Fehler übrig, den Gabriel am 31.07. meldete:
„das Scrollgefühl im kompletten 2. Teil fühlt sich zäher an als im 1." — und das stimmte messbar.

Zäh wird eine Etappe nicht vom Scrollweg allein, sondern vom **Verhältnis aus Scrollweg und
Bildbewegung**. Alle sieben Clips sind gleich lang (8,04 s, 193 Bilder), sie bewegen sich aber
unterschiedlich stark: die Kamera kommt zum Ende der Reise zur Ruhe. Ausgerechnet dort hatten die
Etappen den **längsten** Scrollweg bekommen — beide Effekte multiplizierten sich.

```bash
cd der-weg/assets && for f in anflug werkzeug schreibtisch stilprobe weg lichtung aussicht; do v=$(ffmpeg -v error -i "$f-m.mp4" -vf "scale=160:90,tblend=all_mode=difference,signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-" -f null - 2>/dev/null | grep -o "YAVG=[0-9.]*" | cut -d= -f2 | awk '{s+=$1; n++} END {printf "%.3f", s/n}'); echo "$f $v"; done
```

Das misst die mittlere Helligkeitsänderung zwischen aufeinanderfolgenden Einzelbildern — ein
Stellvertreter für Kamerabewegung, kein Maß für sie. Ergebnis und die daraus abgeleiteten Werte:

| Station | Bildbewegung | `scroll` alt → neu | Scrollweg für gleiche Bewegung, alt → neu |
|---|---|---|---|
| Auftakt | 8,8 | 1,15 → 1,10 | 1,21× → 1,01× |
| Haltung | 9,3 | 1,00 → 1,15 | 1,00× → 1,01× |
| Deine Woche | 9,7 | 1,30 → 1,20 | 1,25× → 1,01× |
| Die Stilprobe | 7,5 | 1,45 → 0,95 | **1,80×** → 1,03× |
| Der Weg | 8,9 | 1,15 → 1,10 | 1,20× → 1,00× |
| Auf Augenhöhe | 5,1 | 1,10 → 0,85 | 2,00× → 1,35× |
| Weitblick | 4,1 | 1,30 → 0,85 | **2,94×** → 1,68× |

**Die Regel:** `scroll = Bildbewegung / 8,06`, Boden **0,85**. Die 8,06 ist die Rate von Teil 1,
die Gabriel als richtig bezeichnet hat. Den Boden brauchen die zwei ruhigen Schlussszenen —
rechnerisch kämen sie auf 0,64 und 0,51, dann fliegt man an ihnen vorbei und der Stationstext hat
zu wenig Weg zum Einblenden (`rampIn` ist 0,55 × Etappe). Sie bleiben damit bewusst etwas ruhiger
als der Rest; ein Ausklang darf das, ein Mittelteil nicht.

Teil 2 verlangte vorher **57 %** mehr Scrollweg für dieselbe Bildbewegung als Teil 1, jetzt 18 %.
Summe 8,45 → **7,20** Bildschirmhöhen, Seitenhöhe bei 393 × 702 damit 9549 → 8496 px.

### Nachtrag 28.08.2026: die Anzahl der Bilder gehört in die Formel

Solange alle sieben Clips 193 Bilder hatten, kürzte sich die Anzahl heraus. Seit Etappe 3 und 4
aus einem geteilten Clip stammen (118 und 169 Bilder), muss sie mitgerechnet werden:

```
scroll = Bilder × Bildbewegung / 1555,6        (1555,6 = 193 × 8,06)
```

Der Zähler ist damit die **gesamte** Bildbewegung einer Etappe statt ihres Tempos: Bildbewegung
ist ein Mittelwert je Bildpaar, mal der Anzahl Bilder ergibt das die Strecke, die das Bild
insgesamt zurücklegt. Ohne diesen Faktor bekäme die kürzere Etappe denselben Scrollweg wie eine
anderthalb Mal so lange — und würde kriechen.

Gegenprobe: die fünf unveränderten Etappen ergeben mit der erweiterten Formel exakt ihre
bisherigen Werte (1,094 / 1,154 / 1,110 / 0,635 → Boden / 0,510 → Boden).

| Station | Bilder | Bildbewegung | `scroll` alt → neu |
|---|---|---|---|
| Deine Woche | 190 → **118** | 9,7 → **12,6** | 1,20 → **0,96** |
| Die Stilprobe | 193 → **169** | 7,5 → **8,2** | 0,95 → **0,89** |

Summe 7,20 → **6,90** Bildschirmhöhen. Die Reise wird damit um 4 % kürzer — nicht durch
Umverteilung, sondern weil der Film kürzer ist (287 statt 383 Bilder in diesen zwei Etappen).
Weniger Film braucht weniger Scrollweg, sonst kriecht die Stelle. Hochkant zählt der
Mobilfaktor 1,2 mit: 0,30 × 1,2 × 702 = **253 px** weniger Scrollweg bei 393 × 702.

Gemessen am laufenden Server:

| | 1440 × 900 | 393 × 702 |
|---|---|---|
| Bahnhöhe (`.sw-track`) | 7110 px = 6,90 + 1,00 Bildschirmhöhen | 6514,6 px = 8,28 + 1,00 |
| Seitenhöhe gesamt | 8751 px | 8267 px |

Die eine zusätzliche Bildschirmhöhe hängt die Engine an, damit die letzte Etappe ausläuft.
Stationsgrenzen bei 1440 × 900: 0 / 990 / 2025 / 2889 / 3690 / 4680 / 5445 / 6210 px, im
Browser durch die Ebene mit `z-index: 120` bestätigt. Alle sieben Clips laden vollständig
(`readyState` 4) mit 193 / 193 / **118** / **169** / 193 / 193 / 193 Bildern.

Und die Engine spult die zwei ungleich langen Clips an den richtigen Stellen ab (gemessene
`currentTime`, in Bilder umgerechnet):

| Scrollposition | `schreibtisch` | `stilprobe` |
|---|---|---|
| 2887 px (Ende Etappe 3) | **117 / 118** | 0 / 169 |
| 4200 px (hinter Etappe 4) | 117 / 118 | **168 / 169** |

Die Naht liegt also exakt zwischen dem letzten Bild der einen und dem ersten der anderen Etappe —
genau die zwei Bilder, die `pruefe-naehte.mjs` mit 0,905 misst.

**Wie das im versteckten Preview-Pane messbar war** (die Falle steht in der Projekt-CLAUDE.md):
Ohne sichtbares Fenster läuft `requestAnimationFrame` gar nicht, und die Bild-Schleife der Engine
sitzt genau dort. `requestAnimationFrame` wurde deshalb durch einen synchronen Ersatz getauscht,
der den Rückruf **merkt** und Wiedereintritt verweigert; danach eine zweite Instanz der Engine in
einen Hilfsbehälter gehängt und deren Schleife von Hand getaktet. Zwischen den Takten muss man an
die Ereignisschleife abgeben (`await`), sonst bleibt `video.seeking` dauerhaft true und die Engine
überspringt jeden Sprung. Der Riegel `ticking` in der ersten Instanz klemmt außerdem schon beim
ersten Scroll-Ereignis auf true — er löst sich nur über `layout()`, also über ein
`orientationchange`-Ereignis.

Der oben genannte Altwert von 8496 px stammt vom 31.07.2026 und ist mit den 8267 px nicht direkt
vergleichbar: dazwischen liegen die längeren v2-Texte vom 26.08., die auch den Leseteil unter der
Reise verändert haben. Vergleichbar ist nur der Scrollweg der Reise selbst, und der ist um die
oben gerechneten 253 px kürzer.

**Wer einen Clip austauscht, misst neu und rechnet die Zahl nach** — sonst wandert genau dieser
Fehler wieder ein. Die zweite Lehre daraus steht bei der Stilprobe: sie hatte den längsten
Scrollweg, *weil* sie die stärkste Karte der Seite ist. Eine kriechende Kamera liest sich aber
nicht als „wichtig", sondern als „hängt". Gewicht trägt eine Station über ihren Text und ihren
Platz, nicht über die Bremse.

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
--weg-textzone: max(36svh, 365px);   /* hoch (>=780px) und schmal (<385px)   */
--weg-textzone: max(36svh, 350px);   /* hoch und breit (>=385px)             */
--weg-textzone: max(36svh, 345px);   /* niedrig (<780px) und schmal (<365px) */
--weg-textzone: max(36svh, 325px);   /* niedrig und breit (>=365px)          */
```

**Stand 26.08.2026 — die v2-Texte haben die Minima angehoben** (vorher 355/320/325/300):
höchste Station ist seitdem je nach Breite „Über mich" (längerer Kleintext, bis 313 px)
oder „Der Weg" (297 px bei 320 px Breite, weil Titel und Chips früher umbrechen), nicht
mehr allein die Schluss-Station mit ihren Knöpfen. Formel unverändert: höchste Station
+ 2 × 17 px Luft + 14 px Rand, aufgerundet. Das kostet auf den breiten Telefonen 20–30 px
Bildhöhe gegenüber dem 31.07. — der Preis der längeren Texte, nicht des CSS; wer das Band
zurück will, kürzt die Texte dieser zwei Stationen. Die Messtabellen unten in diesem
Abschnitt dokumentieren den Stand vom 31.07.; die aktuellen Messwerte stehen als Kommentar
im CSS von `der-weg/index.html` und im CHANGELOG (26.08.2026).

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

**Seit 31.07.2026 hängt die Zahl auch an der BREITE** (V50) — vorher nur an der Höhe, und das war
der Fehler. Maßgeblich ist die **Schluss-Station** („Lass uns 30 Minuten reden") wegen ihrer zwei
Handlungsknöpfe. Die stehen aber nicht überall übereinander: sie brauchen zusammen 325 px (kleiner
Zweig) bzw. 342 px (großer Zweig — größere Polsterung und Schrift), und der Textkasten bekommt
`100vw - 2 × clamp(18px, 5vw, 48px)`, ab 360 px Breite also 0,9 × Breite. Daraus fällt der Umbruch
bei **362** bzw. **380 px**; die Grenzen im CSS liegen mit 365 und 385 px knapp darüber.

Wo sie stapeln, ist die Zone ausgereizt (17–18 px Luft). Wo sie nebeneinander passen, lagen 30 bis
39 px je Seite brach — genau der Streifen, den Gabriel am 31.07. gemeldet hat („immer noch eine
dicke Zeile unten verschenkt, lieber etwas mehr Video zeigen"). Gemessen über alle sieben
Stationen, Zone und Band vorher → nachher:

| Schirm | Knöpfe | höchste Station | Zone | Luft je Seite | Band |
|---|---|---|---|---|---|
| 320 × 568 | gestapelt | 277 px | 325 (unverändert) | 17 px | 43 % |
| 360 × 645 | gestapelt | 277 px | 325 (unverändert) | 17 px | 50 % |
| 360 × 800 | gestapelt | 306 px | 355 (unverändert) | 18 px | 56 % |
| 375 × 812 | gestapelt | 306 px | 355 (unverändert) | 18 px | 56 % |
| 375 × 667 | nebeneinander | 240 px | 325 → **300** | 36 → 23 px | 51 → 55 % |
| 393 × 702 | nebeneinander | 245 px | 325 → **300** | 33 → 21 px | 54 → 57 % |
| 412 × 760 | nebeneinander | 251 px | 325 → **300** | 30 → 18 px | 57 → 61 % |
| 393 × 852 | nebeneinander | 264 px | 355 → **320** | 39 → 21 px | 58 → 62 % |
| 412 × 915 | nebeneinander | 271 px | 355 → **330** | 35 → 23 px | 61 → 64 % |

Der 393 × 702 große Schirm ist Gabriels Gerät (aus der Knopfbreite auf seinem Screenshot
zurückgerechnet und am Messstand reproduziert). Ein Hochkant-Fenster jenseits echter Telefone
(520 × 760, höchste Station 264 px) behält nur 11 px Luft je Seite — es schneidet nichts ab, sitzt
aber enger als auf jedem Gerät.

Merkwürdig, aber richtig: **mehr Textanteil heißt mehr sichtbares Bild** — ein flacheres Band
liegt näher am 4:3 der Quelle, es wird also weniger abgeschnitten. Die Szene wird dabei nur
kleiner dargestellt, nicht knapper. Jede Senkung der Zahl geht deshalb in beide Richtungen: das
Band wächst am Schirm, die sichtbare Breite der Szene sinkt (393 × 852: von 62 % bei 380 px auf
60 % bei 355 px, rund 23 der 1112 Quellpixel). Bewusst so entschieden.

**Wer den Streifen auf den SCHMALEN Telefonen kleiner haben will, muss an die zwei
Handlungsknöpfe.** Dort stapeln sie und kosten 87 statt 40 px. Nebeneinander passten sie erst mit
schmalerer Polsterung — 42 px sind aber schon die Untergrenze für eine Fingerfläche, und der
Hauptknopf würde optisch kleiner. Das ist eine Gestaltungsfrage und steht als offener Punkt in
`verbesserungen.md`, nicht hier. Zu holen ist dort allerdings weniger, als es aussieht: bei
320 × 568 steht direkt hinter der Schluss-Station (277 px) schon „In deinem Tempo" mit 270 px. Ohne
das Stapeln würde die Schluss-Station auf ~230 px fallen, die höchste wäre dann jene 270 — der
Streifen käme also nur von 325 auf rund 320 px herunter — rund 5 px statt der erhofften 40.

**Die zwei Knopfbeschriftungen verschieben die Umbruchgrenze.** Wer sie ändert, misst neu: die
Grenzen 365/385 px im CSS hängen unmittelbar an der Breite dieser beiden Knöpfe.

**Ein zweiter Teil des Leerraums steht überhaupt nicht in dieser Zahl.** Was am Gerät unter dem
Text frei bleibt, ist zum guten Teil die Reserve, die `100svh` unten stehen lässt, sobald Chrome
die Adressleiste einfährt (rund 60 px). Das ist der Preis für eine Aufteilung, die während der
Fahrt nicht wandert — siehe unten. Ohne diese Reserve müsste der Text an der jeweils aktuellen
Fensterhöhe hängen (`dvh`) und würde bei jedem Ein- und Ausfahren der Leiste um rund 30 px
wandern. Umgekehrt ist es also kein Fehler, sondern eine Wahl: **ruhige Aufteilung gegen
Leerraum.**

Passt eine Station nicht in den Streifen, ragt sie oben und unten je zur Hälfte heraus; bis
~3 px verschwindet das im deckenden Teil des Verlaufs. Nach jeder Änderung an Zahl, Schriftgröße
oder Stationstext also die längste Station nachmessen. Ein weiterer Hebel steht daneben: unter
`max-height: 780px` ist die Schrift eine Stufe kleiner (dort reichen 325 px), unter 393 px Breite
zusätzlich der Stations-Kleintext.

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

**Hochkant gibt es den Ausklang-Streifen seit 30.07.2026 nicht mehr (V39)** — er hatte sich mit
der Änderung von einen Tag vorher ins Gegenteil verkehrt. Der Streifen läuft von durchsichtig
nach Pergament und lag unter der Textebene. Das war richtig, solange die Textebene *stehenblieb*.
Seit sie im Gleichschritt mit dem Leseteil hochfährt, liegt sein durchsichtiger Teil aber genau
über dem Bildband, das noch auf Deckkraft 1 steht: statt zuzudecken, **gab er das Video wieder
frei**. Gemessen bei 393 × 852 ein Band der letzten Szene zwischen zwei weißen Flächen, sichtbar
über rund 290 px Scrollweg — genau das, was Gabriel auf dem Telefon als „Lücke, wo man nochmal
das Video sieht" gemeldet hat.

Hochkant braucht es ihn auch nicht: der Pergament-Verlauf der Textebene hat oben schon eine
weiche Kante und wischt das Bildband beim Hochfahren von allein weg. Nachgemessen an neun
Punkten zwischen letztem Filmbild und Fragen: Unterkante Textebene und Oberkante Leseteil liegen
durchgehend auf **0 px** Abstand, und der Leerlauf zwischen letztem Filmbild und den Fragen am
oberen Rand schrumpft von 1142 auf 852 px, also von 1,34 auf genau einen Bildschirm.

Breit bleibt der Streifen: dort füllt das Video den ganzen Schirm, der Verlauf der Textebene
deckt nur die linken 58 % ab, und der Streifen ist der einzige Abgang, den die Szene hat.

### Die Schürze (V43/V44)

Der Abgang wird von **zwei** Verläufen getragen, die verschiedenen Elementen gehören: der
Schleier der Textebene fährt mit ihr hoch, der Ausklang gehört zum Leseteil und kommt von unten.
Genau an dieser Naht sind am 30.07.2026 zwei Befunde entstanden, die auf denselben Bau zeigen.
Die Antwort auf beide ist eine **Schürze**: der Verlauf der Textebene reicht seitdem um die Länge
des Ausklang-Streifens **unter** ihre Unterkante hinaus (`--weg-schuerze`, dieselbe Zahl wie
dessen Höhe — sonst können die beiden auseinanderlaufen).

- **Breit (V43): eine Kante quer über den Schirm.** Der Schleier liegt links (58 vw, waagerecht)
  und endete hart an der Unterkante der Textebene — dort fängt der Ausklang an, der aber von
  UNTEN aufhellt. Ergebnis: oben links hell, unten links nicht, dazwischen kein Übergang.
  Gabriels Formulierung traf es genau: „einmal Farbverlauf von links, einmal von unten,
  dazwischen kein Verlauf." Mit der Schürze überlappen sich beide auf der ganzen Streifenlänge.
  Nachgemessen an drei Scrollständen: Unterkante des Schleiers und Unterkante des Ausklangs
  liegen auf demselben Pixel.
- **Hochkant (V44): ein Flackern bei schnellem Wischen.** Die Textebene wird per JavaScript
  nachgeführt, der Rest der Seite scrollt nativ — bei einem schnellen Wisch hinkt sie ein
  Einzelbild hinterher, und in diesem Bild klafft zwischen ihrer Unterkante und dem Leseteil
  eine Lücke, durch die das Video blitzt. Die Schürze füllt diese Lücke, ohne dass Zeitverhalten
  eine Rolle spielt. Nachgemessen mit künstlichem Rückstand: bis **260 px** Verzug bleibt die
  Lücke gedeckt (die Schürze ist 290 px lang); ein Einzelbild sind selbst bei hastigem Wischen
  weniger als 100.

Dazu läuft die Nachführung seit V44 **direkt im Scroll-Lauscher** statt in
`requestAnimationFrame` — der Fehler entsteht damit gar nicht erst. Möglich ist das nur, weil
dort nichts mehr gemessen wird: die Schwelle, ab der der Leseteil ins Fenster ragt, steht einmal
je Layout, es bleiben eine Rechnung und ein Schreibvorgang. Ein `getBoundingClientRect()` an
dieser Stelle würde bei jedem Scrollbild eine Neuberechnung des Layouts erzwingen.

**Merksatz:** Wenn zwei Verläufe denselben Übergang tragen und verschiedenen Elementen gehören,
müssen sie sich überlappen — aneinanderstoßen reicht nie, weil ihre Elemente sich unabhängig
voneinander bewegen.

Alles davon steht in `der-weg/index.html`, nicht in der Engine — siehe nächster Abschnitt.
Nachmessen im Browser statt nach Augenmaß: die Fallen dabei stehen in der Projekt-CLAUDE.md
unter „Preview-Messungen".

## „Mehr dazu": die Langfassung einer Station

Am Ende jeder Station steht ein Knopf „Mehr dazu +", der die vollständigen Inhalte des
zugehörigen Abschnitts der Hauptseite als Feld in der Bildschirmmitte öffnet. Auf der
Schluss-Station steht er **vor** den Handlungsknöpfen: was jemand als Letztes liest, soll
„Erstgespräch anfragen" sein und nicht das Angebot, noch mehr zu lesen.

**Wo er sitzt: immer hinten am letzten Satz des Fließtextes** (seit 30.07.2026, V42) — bei jeder
Station gleich, unabhängig davon, ob sie Schlagworte hat. Die Schlagworte stehen darunter, die
Handlungsknöpfe darunter. Nachgemessen auf sechs Gerätemaßen von 320 bis 412 px Breite: bei allen
sieben Stationen sitzt er auf der letzten Textzeile, keine bricht um.

**Die Vorgeschichte in vier Stationen**, weil an dieser Kleinigkeit viermal etwas hing:

1. Bis 29.07. in einer Kopfzeile rechts neben dem Stations-Kleintext — kostete nur rund 10 px,
   lag am Gerät aber genau auf der Wegpunkt-Leiste am rechten Rand: zwei Bedienelemente an
   derselben Stelle, eines davon halb verdeckt (V36).
2. Dann unter dem Text, frei und in Leserichtung — dafür auf einer eigenen Zeile, und weil die
   längste Station die Mindesthöhe des Textstreifens bestimmt, kostete das rund 39 px, die
   direkt vom Bild abgingen (380 statt 320 px Streifen).
3. Am 30.07. auf die letzte Zeile gezogen, aber je nach Station an einen anderen Ort: mit
   Schlagworten in deren Zeile, ohne sie an den Text (V40). Am Gerät las sich das als Zufall —
   derselbe Knopf stand mal hinter dem Satz, mal unter den Schlagworten. **Die Lehre daraus:
   „spart Platz" schlägt nicht „steht immer an derselben Stelle".** Ein Bedienelement, dessen
   Ort von den Daten der Station abhängt, wirkt beliebig, auch wenn jede einzelne Platzierung
   für sich begründet ist.
4. Seither einheitlich hinter dem Text (V42). Kostet gegenüber Stufe 3 fast nichts: die höchste
   Station wuchs von 304 auf 304 px (375 × 812) — sie hat gar keine Schlagworte.

Ein Pfeil nach unten wäre außerdem gelogen: der Inhalt klappt nicht an Ort und Stelle auf,
sondern öffnet ein Feld in der Mitte. Das Plus ist dasselbe Zeichen, das die häufigen Fragen
weiter unten benutzen.

**Texte ändern — die Drei-Orte-Regel:** jede Station hat ihren Text an DREI Orten in
`der-weg/index.html`, die zusammen gezogen werden müssen: (1) die Kurzfassung in
`wegKonfig.sections` (eyebrow/title/body/tags), (2) ihr statischer Spiegel im Block
`<section data-sw-seo>` (das ist der einzige Text für Suchmaschinen und Besucher ohne
JavaScript), (3) die Langfassung im Block `<div id="vertiefungen">`, ein
`<article data-station="…">` je Station. Kein Skript nötig, kein Build. Erlaubte Bausteine:
`.vertiefung-auge` (Kleintext oben), `h2`, `h3`, `.vertiefung-preis`, `p`, `ul`/`li`, `strong`,
`a`, `.vertiefung-knopf` (Schaltflächen-Optik), `.vertiefung-kopf` (Portrait neben dem Einstieg,
siehe unten). Interne Links wurzel-relativ halten
(`/stilprobe/`, `/impressum/`). Nach jeder Textänderung die Stationshöhen hochkant nachmessen
(siehe oben). Wortlaut-Quelle seit 26.08.2026: Gabriels Fassung v2
(im Repo nachvollziehbar über den CHANGELOG-Eintrag).

**Das Portrait in „Über mich" (seit 29.08.2026).** Die Station `lichtung` beginnt mit einem
Kopfblock: links Gabriels Foto, rechts Augenzeile, Überschrift und Vorstellung. Es steht ganz
oben, weil man beim Öffnen von „Wer mit dir arbeitet" zuerst ein Gesicht sehen will und nicht
drei Absätze Lebenslauf. Das Markup ist `div.vertiefung-kopf` mit
`figure.vertiefung-portrait` und `div.vertiefung-kopf__text` — kein Skript beteiligt, der Block
funktioniert im Feld wie im No-JS-Lesefluss.

Drei Maße, jedes gemessen statt geschätzt:

| Fensterbreite | Anordnung | Bild |
|---|---|---|
| bis 559 px | Bild über dem Text | `min(56%, 200px)` → 180 × 240 px auf 393 px |
| ab 560 px | nebeneinander | 168 × 224 px |
| ab 900 px | nebeneinander | 200 × 267 px |

Warum erst ab 560 px nebeneinander: darunter bleiben neben dem Bild unter 200 px Textspalte,
und davon zieht der Schließknopf oben rechts nochmals 2,4 rem ab — „Drei Welten, ein Blick."
zerfällt dann in vier Zeilen. Warum kein `object-fit`-Zuschnitt: das Bild ist als Halbfigur
für die Website aufbereitet und wird in V18 im selben Ausschnitt gezeigt. `aspect-ratio: 3/4`
hält den Platz frei, bevor das Bild da ist, damit der Kopfblock beim Öffnen nicht springt;
`loading="lazy"` holt es erst beim ersten Öffnen, denn mit JavaScript ist der ganze
`#vertiefungen`-Block ausgeblendet.

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

**Seit 26.08.2026 gibt `mountVertiefung` ein Handle zurück** (`{ schliesse, istOffen }`) —
`formulare.js` schließt darüber ein offenes Vertiefungsfeld, bevor ein Formular aufgeht.
Der Rückgabewert ist neu, bestehende Aufrufer bleiben unberührt.

## Formulare in der Reise (seit 26.08.2026)

Zwei Formulare machen die Reise eigenständig: **Stilprobe einreichen** und **Erstgespräch
anfragen** (Gabriels Entscheidung vom 26.08.2026 — die V18-Unterseite `/stilprobe/` bleibt
nur als Footer-Link und als Weg ohne JavaScript).

**Bau:** Das Markup steht als `<article class="vertiefung weg-formular">` im Block
`#vertiefungen`, bewusst **ohne** `data-station` — `vertiefung.js` ignoriert die Artikel
(kein „Mehr dazu"-Knopf, kein Klonen), ohne JavaScript stehen sie als Lesetext mit nativem
POST. `formulare.js` **verschiebt** die Artikel beim Start in eigene Overlays
(`.weg-tief--formular`, gleiche Optik wie das Lesefeld). Verschieben statt klonen ist der
Kernunterschied zu `vertiefung.js`: Eingaben überleben jedes Schließen. Der zweite
Unterschied: **Weiterscrollen schließt NICHT** — die Reise hält an (wheel/touchmove werden
abgefangen), zu geht es nur über Schließknopf, Escape oder Hintergrund-Klick. Wer die Seite
am Scrollbalken zieht, bewegt die Kulisse hinter dem offenen Feld; bewusst hingenommen,
Datenerhalt schlägt Kulisse.

**Auslöser** ist jedes Element mit `data-formular-oeffner="stilprobe|erstgespraech"`
(delegierter Klick-Lauscher, funktioniert darum auch in den geklonten Vertiefungsfeldern):
die zwei Engine-Knöpfe der Schluss-Station (ihre `href` bleiben als No-JS-Weg — mailto bzw.
`/stilprobe/`), die Schaltfläche in der Stilprobe-Vertiefung und der Knopf in der
Abschnitt-7-Vertiefung.

**Verträge:** Feldnamen, Antworten, Spam-Schutz und Wortlaute stehen in
`docs/stilprobe/schnittstelle.md` (Stilprobe, inkl. Kontingent-Badge mit Warteliste- und
Pause-Zweig — der Badge wird erst beim ersten Öffnen abgerufen) und
`docs/erstgespraech/schnittstelle.md` (Erstgespräch: umgedrehte Terminfrage,
Rückruf-Häkchen, Antwortversprechen ohne Frist). Die Endpoints stehen **absolut** im HTML
(`action`-/`data-`Attribute; `formulare.js` ist pfadfrei) und existieren erst nach dem
All-Inkl-Umzug — bis dahin 404, der Fehlerpfad mit Mail-Ausweichweg ist der gebaute und
getestete Normalfall. Entwurfsspeicher: die Stilprobe teilt den localStorage-Schlüssel
`stilprobe-entwurf-v1` mit der Unterseite (gleiche Feldnamen, Entwurf wandert mit), das
Erstgespräch nutzt `erstgespraech-entwurf-v1`.

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
| Zeitbasierte Glättung | die Nachführung der Videozeit rechnet ihre Schrittweite aus der echten Bildzeit (`1 − exp(−dt/85 ms)`) statt fest 0,18 je gezeichnetem Bild — gleiche Reaktionszeit bei 30, 60 und 120 Hz (V51, 01.08.) |
| Kein Einfrieren im Sprung | läuft gerade ein Video-Seek, wird nur das Schreiben von `currentTime` ausgelassen; die Glättung rechnet weiter, statt danach in größeren Sprüngen aufzuholen (V52, 01.08.) |
| `clipFps: 24` | Seeks nur bei echtem Bildwechsel (Ziel: Bildmitte des 24er-Rasters) statt mehrerer Sub-Frame-Seeks je Ausrollen (simuliert: 7 statt 2 am PC); unsichtbare Szenen werden hart gesetzt statt weich nachgezogen, und ein frisch geladener Clip startet an der aktuellen Scrollposition statt sichtbar von 0 hochzuspulen (V53, 01.08.) |

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
     Stationstexte (V21), der Nachlade-Deckel (V28) und die überarbeitete Scrub-Nachführung
     (V51–V53: zeitbasierte Glättung, kein Einfrieren während eines Seeks, `clipFps`-
     Bildraster, unsichtbare Szenen hart setzen, Erst-Seek an der Scrollposition) — stehen
     bereits **in** der Engine, müssen also nur noch in die Skill-Fassung übernommen werden.
     Bis dahin ist `der-weg/scrub-engine.js` eine Sonderfassung, und ein Update aus dem
     Skill würde sie überschreiben.
  2. Die verlorene Zentrierung der breiten Fassung — ein echter Fehler der Engine, kein
     Geschmack, und er trifft jedes Projekt, das den Skill benutzt (`top: 50%` plus
     `transform: translateY(-50%)`, während die Engine `transform` beim Scrollen überschreibt;
     Abhilfe ist die eigenständige Eigenschaft `translate`).
  3. Die Hochkant-Fassung — das 4:3-auf-9:19,5-Problem trifft jede Scroll-Welt.
  4. Das „Mehr"-Feld.
  5. Der Kontrast des aktiven Nav-Reiters: Weiß auf Szenenakzent misst 2,6–3,3:1 —
     diese Seite überschreibt ihn auf Tinte (V24); im Skill sollte der Default selbst
     dunkel genug sein. **Nachtrag 29.07.:** Diese Seite hat die Aktiv-Markierung des
     Reiters ganz entfernt (V29), weil die Punktleiste dasselbe schon sagt.
     **Nachtrag 30.07. (V45):** und am PC wieder eingeschaltet, ab 861 px — derselben
     Schwelle, an der die Engine das Reitermenü überhaupt einblendet. Die Doppelung
     störte auf dem TELEFON, wo Menü und Punktleiste um knappen Platz konkurrieren; am
     PC ist das Menü ohnehin da und der Stand in Worten leichter zu lesen als in Punkten.
     Weiß auf Tinte misst nachgemessen 14,26:1. Für den Skill bleibt beides gültig: der
     Kontrast-Default ist zu korrigieren, und ob markiert wird, ist eine Größenfrage.
  6. **Zwei Verläufe an einer Naht müssen sich überlappen** (V43) — der Skill lässt den
     Schleier der Textebene an ihrer Unterkante enden und den Ausklang genau dort
     anfangen. Solange die Textebene steht, fällt das nicht auf; sobald sie sich bewegt,
     steht eine harte Kante quer über den Schirm. Abhilfe ist ein negatives `bottom` am
     Verlauf in Länge des Ausklangs. Trifft jede Scroll-Welt mit einem Leseteil darunter.
  7. **Die letzte Szene stehen lassen** (V37) — der Fehler trifft jede Scroll-Welt, die unter
     der Reise noch etwas anderes hat: die Schluss-Szene blendet aus, bevor der nachfolgende
     Inhalt da ist, und dazwischen steht eine leere Seite. Einzeiler in der Deckkraft-Schleife.
  8. **Die Aufteilung hochkant an `svh` binden** (V35) — feste Elemente rechnen in Chrome auf
     Android am grossen Fenster; alles, was unten am Rand haengt, steht mit ausgefahrener
     Adressleiste unter dem sichtbaren Bereich. Betrifft jede Scroll-Welt mit einem
     Textstreifen am unteren Rand.
  9. **`linger` gegen `copyTiming` absichern** (V38) — die Bremse in der Etappenmitte ist für
     `'middle'` gebaut, wirkt aber auch unter `'arrival'`, wo sie genau falsch sitzt. Der Skill
     sollte `linger` unter `'arrival'` entweder ans Etappenende verlegen oder beim Mounten
     warnen. Trifft jede Scroll-Welt der Architektur A, die eine Szene betonen will.
  10. **Die Fortschrittsleiste am oberen Rand** (V41) — eine leere 3-px-Rinne über die volle
     Breite ist beim Öffnen von einem Ladebalken nicht zu unterscheiden und liest sich als
     „lädt nicht". Diese Seite blendet sie aus (die Punktleiste zeigt den Stand). Für den Skill
     wäre die Rinne wenigstens erst ab dem ersten Scrollen einzublenden.
  11. **Ein echter Engine-Fehler bei jedem nicht-quadratischen Logo** (gefunden über V30):
     `.sw-brand__logo` bekommt `width:100%; height:100%` in einem Kasten, der ein Raster mit
     automatisch hoher Zeile ist. Gegen eine solche Zeile kann der Browser keine Prozenthöhe
     auflösen — er nimmt die natürliche Form des Bildes. Ein hochkantes Sigel (hier 504×747)
     wird damit anderthalbmal so hoch wie sein Kasten und läuft unten heraus; `object-fit`
     greift nie, weil der Kasten selbst mitwächst. Trifft jedes Projekt mit einem Logo, das
     nicht quadratisch ist. Abhilfe im Skill: die Kastenhöhe fest setzen und die Breite aus
     dem Bildverhältnis ableiten, statt beides über Prozent zu führen.
- Die Seite ist noch nicht auf einem echten Telefon geprüft.
