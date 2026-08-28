# Changelog

Wird ab 2026-07-11 geführt (Repo bestand vorher ohne Changelog; Historie siehe Git-Log).

## 2026-08-28 — Der Weg: die gebrochene Naht 3 → 4 ist repariert

Gabriel hat den Bogen zwischen „Was sich wirklich ändert" und „Lies dich selbst" neu gerendert,
als **ein** durchgehendes Video (`Scroll World\legs\ueberarbeitet\Segmente-verbunden.mp4`, 1440 ×
1080 bei 30 Bildern/s, 12,17 s). Das war die einzige Naht der Reise, die sich nicht durch
Schneiden retten ließ — die Kamera sprang dort rückwärts und nach oben (Befund 27.07.2026).

- **Neues Werkzeug `scripts/der-weg/teile-verbunden.mjs`.** Bringt den Clip auf das Format der
  übrigen fünf Etappen (1112 × 834, 24 Bilder/s) und teilt ihn bei Bild 121 in die Etappen 3 und
  4. Jeder Schritt ist gegen Sollwerte abgesichert und bricht ab statt still etwas anderes zu
  schneiden. Die alten Rohdateien werden nicht gelöscht, sondern nach
  `Scroll World\legs\vor-schnitt-2026-08-28\` verschoben.
- **Teilungsbild aus der Messung, nicht aus dem Gefühl.** Die Bild-zu-Bild-Bewegung fällt ab
  Bild 85 auf ein Zehntel, ist zwischen 117 und 125 am kleinsten, steigt ab 170 wieder. Bei
  Bild 121 steht die Kamera also still — der Ankunftsmoment für „Was sich wirklich ändert" —
  und ab Bild 134 beginnt der Stift zu schreiben, der Bildinhalt von „Lies dich selbst".
- **Zwei Nähte gemessen besser, eine unverändert.** `schreibtisch → stilprobe` von 0,281
  (SPRUNG) auf **0,905 bei Eigenwert 0,810, Verhältnis 1,12 — trägt**. `stilprobe → weg` von
  0,620 auf **0,821 / 1,29**, weil zwei Bilder Nachlauf abfallen, die über den Anschlusspunkt
  hinausfahren. `werkzeug → schreibtisch` bleibt bei 0,45 ein Sprung: dieses Material hat
  Gabriel nicht angefasst, die breite Überblendung fängt es weiter ab.
- **`crossfade: 0.38` auf `stilprobe` entfernt.** Die Zahl hing an der gebrochenen Naht davor.
  Sie regelte die sichtbare Blende beim Eintritt in diese Etappe; ohne Grund weichgezeichnet
  wird jetzt nichts mehr. Auf `werkzeug` und `schreibtisch` bleibt sie stehen.
- **Scrollweg-Formel um die Bildanzahl erweitert.** Bisher `scroll = Bildbewegung / 8,06` — das
  galt nur, solange alle Clips 193 Bilder hatten. Jetzt `scroll = Bilder × Bildbewegung / 1555,6`
  (1555,6 = 193 × 8,06). Gegenprobe: die fünf unveränderten Etappen ergeben damit exakt ihre
  bisherigen Werte. Neu: **Deine Woche 1,20 → 0,96** (118 statt 190 Bilder, Bildbewegung 9,7 →
  12,6), **Die Stilprobe 0,95 → 0,89** (169 statt 193 Bilder, 7,5 → 8,2).
- **Die Reise wird 4 % kürzer**, 7,20 → 6,90 Bildschirmhöhen. Das ist die Folge des Schnitts,
  nicht eine Umverteilung: 287 statt 383 Bilder in diesen zwei Etappen. Hochkant sind das
  253 px weniger Scrollweg bei 393 × 702.
- Assets 52 → 46 MB. Texte, Hochkant-Zonen (`--weg-textzone`), die übrigen fünf Etappen, V18
  und die Hauptseite unangetastet.

**Belege** (der Preview-Pane gilt als versteckt, Screenshots sind dort unmöglich — alles über
DOM-Geometrie und Messläufe): `pruefe-naehte.mjs` über die ausgelieferten Dateien; am laufenden
Server bei 1440 × 900 Bahnhöhe 7110 px = 6,90 + 1,00 Bildschirmhöhen, Stationsgrenzen
0/990/2025/2889/3690/4680/5445/6210 px über `z-index: 120` bestätigt, alle sieben Clips
`readyState` 4 mit 193/193/118/169/193/193/193 Bildern; bei 393 × 702 Bahn 6514,6 px,
Seitenhöhe 8267 px. Die Engine spult die zwei ungleich langen Clips richtig ab: bei 2887 px
steht `schreibtisch` auf Bild 117/118 und `stilprobe` auf 0/169, bei 4200 px `stilprobe` auf
168/169 — die Naht liegt also exakt zwischen letztem und erstem Bild. Dafür musste
`requestAnimationFrame` durch einen synchronen Ersatz getauscht werden, der den Rückruf merkt
(Verfahren in `docs/der-weg.md`). `scripts/pruefe-seiten.mjs` grün, alle `node --check` grün.

## 2026-08-26 — Der Weg: Texte v2, Formulare in der Reise, größere Vertiefungen (V54–V58)

Gabriels Änderungsrunde vom 26.08. (schriftlich, mit zwei mitgelieferten Konzept-Dateien),
alle Punkte am selben Tag umgesetzt. Belege **gemessen** am lokalen Server (DOM-Geometrie
und gemockte Server-Antworten; der versteckte Preview-Pane erlaubt keine Screenshots, siehe
Prüfliste). Rückkehrpunkt vor der Umsetzung: Commit `caaaece`. Vier vorab abgefragte
Entscheidungen Gabriels: Stilprobe als Overlay in der Reise (Unterseite nur noch Footer-Link
und No-JS-Weg) · Erstgespräch-Formular am Haupt-Knopf UND in der Abschnitt-7-Vertiefung ·
Antwortversprechen ohne Frist · nur Der Weg, V18 unangetastet.

- **V54 — Texte v2 wortgetreu eingebaut.** Alle drei Orte je Station (Engine-Konfiguration,
  SEO-Spiegel, Vertiefungs-Artikel) plus FAQ 01/02/05; Chips „Kostenlos / innerhalb 48 h"
  (ohne „15 im Monat"), „TÜV-zertifiziert", Label „Über mich"; durchgängig „Klientinnen und
  Klienten" (Kontroll-Grep leer). Konsistenz über den Wortlaut hinaus, gemeldet: Chip
  „Umsetzung ab 1.000 €" (Text nennt ab 1.000) und Chip „Social Media" statt „Newsletter".
  Neun Grammatik-/Typografie-Korrekturen an der Vorlage, ebenfalls gemeldet (u. a. „bleiben"
  statt „bleibe", „das" statt „dass", „Website-Erstellung", „davon abhält, … zu kommen",
  FAQ 01 „Wir schauen, wo du stehst").
- **V54-Messung — Hochkant-Textzone angehoben.** Die längeren Texte verschieben die höchste
  Station („Über mich" bis 313 px bei 360×800; „Der Weg" 297 px bei 320×568 — Titel und drei
  Chips brechen dort früher um). Auf 6 von 9 Gerätemaßen lag die Luft unter dem 17-px-Ziel
  (minimal 5 px bei 412×760). Die vier Klassen-Minima nach Bestandsformel (höchste Station
  + 2×17 + 14, aufgerundet) von 355/320/325/300 auf **365/350/345/325**; %-Fallbacks für
  Browser ohne svh um dieselben Deltas. Gegenprobe nach der Änderung: Kasten 331/351/311/336 px
  bei 320×568 / 375×812 / 393×702 / 393×852 → Luft 17/22/21/23 px. Methoden-Beleg: die
  unveränderte Schluss-Station reproduziert die dokumentierten Altwerte (306 bei 375×812,
  277 bei 320×568). Kostet auf breiten Telefonen 20–30 px Bildhöhe — Preis der längeren
  Texte; wer das Band zurück will, kürzt die Texte von „Über mich"/„Der Weg".
- **V55 — „Mehr dazu"-Felder am PC größer.** Neue Media Query ab 900 px: Feld bis 52rem
  breit, `min(88dvh, 62rem)` hoch, Lesebreite im Feld 38rem (No-JS-Fluss behält 32rem).
  Gemessen: 1920×1080 Hero-Feld 821×731 px, Restscroll 0; 1366×768 Feld 821×667, Rest 65 px;
  393×852 unverändert 358 px breit.
- **V56 — Stilprobe direkt in der Reise.** Neues Modul `der-weg/formulare.js` + zwei
  `<article class="weg-formular">` in `#vertiefungen` (ohne `data-station`; ohne JavaScript
  Lesetext mit nativem POST). Verschieben statt klonen — Eingaben überleben das Schließen;
  Reise hält an, Weiterscrollen schließt NICHT (nur Knopf/Escape/Hintergrund).
  `mountVertiefung` gibt dafür neu ein Handle zurück. Stilprobe-Formular vertragsgetreu
  inkl. Kontingent-Badge (Abruf beim ersten Öffnen, 2-s-Timeout), Warteliste- und
  Pause-Zweig; Entwurfsspeicher teilt `stilprobe-entwurf-v1` mit der Unterseite.
- **V57 — Erstgespräch-Anfrageformular** nach dem beschlossenen Konzept „umgedrehte
  Terminfrage" (neu im Repo: `docs/erstgespraech/buchung-konzept.md` +
  `schnittstelle.md`; eigener Endpoint `/erstgespraech/senden.php`). Rückruf-Häkchen macht
  das Telefonfeld sichtbar und zur Pflicht und wechselt die Zeitfenster-Frage auf „Wann
  erreiche ich dich am besten?"; Antwortversprechen ohne Frist. Haupt-Knopf und
  Vertiefungs-Knopf öffnen das Overlay, `href` bleibt mailto als No-JS-Weg.
- **V58 — Gendern raus**, auch auf der Stilprobe-Unterseite („Klientinnen und Klienten",
  „Jeder Coach"); V18 bewusst unangetastet.
- **Geprüft** (Server 4330, gemockter fetch): Öffnen über alle vier Auslöser ·
  Rad-/Wisch-Sperre ohne Schließen · Escape/Hintergrund mit Eingabe-Erhalt ·
  Erfolg/Fehler/Warteliste-Antworten · Badge frei/voll/pause/Netzfehler (statischer Satz
  bleibt) · Rückruf-Umschalter hin und zurück · Zeichenzähler · Autosave nach 400 ms und
  Löschung nach Erfolg · Vertiefungs-Regression (Rad > 60 schließt dort weiter, Klonen
  unverändert) · einziger 404 = beabsichtigter `kontingent.php`-Abruf. `node --check` und
  `pruefe-seiten.mjs` grün. Gates erweitert: Deploy-Verify prüft `formulare.js`,
  `pruefen.txt` prüft jetzt auch die Syntax der drei Reise-Skripte.
- Geänderte Dateien: `der-weg/index.html`, `der-weg/vertiefung.js` (nur Handle-Rückgabe),
  `der-weg/formulare.js` (neu), `stilprobe/index.html` (nur Gendern),
  `docs/erstgespraech/*` (neu), `docs/der-weg.md`, `docs/stilprobe/schnittstelle.md`,
  `.github/workflows/deploy.yml`, `.claude/pruefen.txt`, `verbesserungen.md`.

## 2026-08-01 — Der Weg: Scrollgefühl der Kamerafahrt (V51–V53)

Gabriels Rückmeldung: das Hintergrundvideo fühle sich beim Scrollen „manchmal zäh, manchmal
fast sprunghaft" an. Die Analyse hat das Material entlastet (alle 14 Clips 24 fps, Ankerbilder
wie geplant alle 8 bzw. 4 Bilder — per ffprobe gemessen) und drei Ursachen in der
Nachführ-Schleife der Engine gefunden. Anders als bei V48–V50 sind die Belege **gerechnet**
statt im Browser gemessen: die Kamerafahrt läuft im versteckten Preview-Pane nicht
(Prüfliste, Kernfunktion 15) — der Gegenbeweis ist Gabriels nächster Telefontest.

- **V51 — Die Glättung rechnete pro gezeichnetem Bild statt pro Zeit.** `0.18 je
  rAF-Durchlauf` ergibt 90 % Aufholung nach ~11,6 Durchläufen — das sind ~100 ms auf einem
  120-Hz-Telefon, ~190 ms bei 60 Hz und ~390 ms, sobald Decoderlast die Bildrate auf 30
  drückt. Dieselbe Seite reagierte also mal direkt, mal zäh — und die Scrub-Last selbst
  drückte die Bildrate (Rückkopplung). Jetzt: `1 − exp(−dt/85 ms)` mit der echten
  Bildzeit `dt`; 85 ms reproduziert das mit V49 abgestimmte 60-Hz-Gefühl auf jeder Bildrate
  (bei 16,7 ms ergibt die Formel exakt die alten 0,178/Schritt). `dt` ist auf 250 ms
  gedeckelt, damit ein Tab-Wechsel keinen Riesenschritt nachholt.
- **V52 — Während eines Seeks fror die Nachführung ein.** `if (seeking) continue` stand vor
  der Glättungszeile und übersprang sie mit — der Kommentar daneben behauptete das
  Gegenteil. Dauert ein Sprung am Telefon 20–60 ms (2–4 Bildschirm-Frames), wuchs solange
  der Rückstand, und das Video holte in entsprechend größeren, unregelmäßigen Sprüngen auf.
  Jetzt rechnet die Glättung immer weiter; pausiert wird nur das Schreiben von
  `currentTime`.
- **V53 — Seeks, die kein neues Bild zeigen konnten.** Die Schwelle (8 ms PC / 20 ms
  Telefon) lag unter der Bilddauer (41,7 ms bei 24 fps): das Ausrollen der Glättung nach
  dem Anhalten bestellte am PC 7 Seeks, wo 2 Bildwechsel zu zeigen waren (simuliert, s. u.;
  am Telefon 3). Neu: `clipFps: 24` in der Konfiguration — geseekt wird nur, wenn das Ziel
  auf einem anderen Bild des 24er-Rasters liegt, und dann auf die Bildmitte (eine Zielzeit
  exakt auf der Bildgrenze rundet je nach Browser in beide Richtungen). Dazu: unsichtbare
  Szenen werden hart auf ihr Ziel gesetzt statt weich nachgezogen (nach einem
  Wegmarken-Sprung spulten vorher bis zu 7 Decoder parallel), und ein frisch geladener Clip
  setzt seinen ersten Seek an die aktuelle Scrollposition statt sichtbar von Bild 0
  hochzuspulen.
- **Nachgerechnet** (Nachbau der alten und neuen Schleife in Node, ein sichtbares Video,
  24 fps): Reaktionszeit alt 92 / 183 / 367 ms bei 120 / 60 / 30 Hz → neu 167–192 ms
  überall. Langsames Scrollen (16 s je Etappe, 60 Hz): 955 → 192 Seeks bei 193 Bildern.
  Ausrollen nach dem Anhalten: 7 → 2 Seeks (PC). Träger Decoder (50 ms je Seek): mittlerer
  Rückstand des gezeigten Bildes hinter dem Scroll-Ziel 7,6 → 3,6 Bilder, Spitze
  10,1 → 5,2.
- **Absicherung für den anstehenden Clip-Tausch** (Etappe 6 mit Gabriels Porträt, Neubau
  der Naht 3→4): `kodiere.mjs` misst nach dem Kodieren die Bildrate der erzeugten Datei und
  warnt laut, wenn sie von den 24 fps abweicht, auf denen `clipFps` steht. Engine-Änderung
  und Clip-Tausch sind damit entkoppelt — die Fixes gelten unverändert für neue Videos.
- Alle drei Änderungen stehen in `der-weg/scrub-engine.js` (Sonderfassung) und auf der
  Rückgabeliste für den `scroll-world`-Skill in `docs/der-weg.md`.

## 2026-07-31 — Der Weg: dritte Rückmeldung (V48–V50)

Drei Punkte aus Gabriels Durchgang am Telefon. Alle drei waren **messbar**, und zwei davon standen
vorher als Vermutung oder sogar als falsche Zahl in der Doku — deshalb hier zuerst die Messung,
dann die Änderung.

- **V48 — Der Weganzeiger sprang nicht auf die richtigen Stellen.** `jumpTo()` sprang fest in die
  Etappenmitte, der Stationstext blüht auf dieser Seite aber erst zum Etappenende auf
  (`copyTiming: 'arrival'`). Über alle sieben Stationen nachgemessen: bei den Stationen **2 bis 6**
  landete jeder Sprung bei Textdeckkraft **0,023** — auf einem komplett textlosen Schirm. Das
  Sprungziel leitet sich jetzt aus der Textführung ab (`copyPeak()`) und spiegelt damit die
  Formeln in `read()` statt eine feste Annahme zu tragen: `'arrival'` → 0,98 der Etappe,
  `'middle'` → 0,5, `'middle'`-Auftakt → 0,08, Schluss-Station immer 0,55. **Nachher:** Deckkraft
  0,996–1,000 auf allen sieben, genau ein Text lesbar, Punkt- und Reitermarkierung auf der
  richtigen Station — am Telefonmaß (393 × 702) und am PC (1280 × 800) geprüft.
- **V49 — Der zweite Teil der Reise fühlte sich zäher an als der erste.** Gabriels Frage „kann das
  sein?" ließ sich mit Ja beantworten. Alle sieben Clips sind gleich lang (8,04 s, 193 Bilder),
  bewegen sich aber unterschiedlich stark — gemessen als mittlere Helligkeitsänderung zwischen
  Einzelbildern (Auftakt 8,8 · Haltung 9,3 · Deine Woche 9,7 · Stilprobe 7,5 · Der Weg 8,9 · Auf
  Augenhöhe 5,1 · Weitblick 4,1). Die Kamera kommt zum Ende der Reise zur Ruhe, und ausgerechnet
  dort hatten die Etappen den **längsten** Scrollweg bekommen; beide Effekte multiplizierten sich.
  Teil 2 verlangte **57 %** mehr Scrollweg für dieselbe Bildbewegung als Teil 1, am Weitblick war
  es gegen die Haltung das **2,94-fache**. `scroll` leitet sich jetzt aus der Messung ab
  (`Bildbewegung / 8,06`, Boden 0,85), Regel und Messkommando stehen in `docs/der-weg.md`.
  **Nachher:** Etappen 1–5 liegen auf 1–3 % gleich, Teil 2 noch 18 % über Teil 1, Weitblick von
  2,94× auf 1,68×. Summe 8,45 → **7,20** Bildschirmhöhen, Seitenhöhe 9549 → 8496 px.
  Der Abgang der Reise (Schürze, V43/V44) hält die Verkürzung: über 1300 px Scrollweg nachgemessen
  liegt die Oberkante des Leseteils bündig an der Bandunterkante, es öffnet sich kein Spalt.
- **V50 — „Immer noch eine dicke Zeile unten verschenkt."** Die Höhe des Textstreifens hing nur an
  der Schirm*höhe*. Maßgeblich ist aber, ob die zwei Handlungsknöpfe der Schluss-Station stapeln,
  und das hängt an der **Breite**: sie brauchen 325 px (kleiner Zweig) bzw. 342 px (großer), der
  Textkasten bekommt ab 360 px Breite 0,9 × Breite — Umbruch also bei 362 bzw. 380 px. Wo sie
  stapeln, war die Zone ausgereizt (17–18 px Luft); wo sie nebeneinander passen, lagen **30 bis
  39 px je Seite** brach. Die Zone hängt jetzt auch an der Breite: unverändert 325/355 wo
  gestapelt wird, **300/320** wo nicht. **Nachher**, Bildband: 393 × 702 (Gabriels Gerät) 377 →
  402 px (54 → 57 %) · 412 × 760 435 → 460 (57 → 61 %) · 393 × 852 497 → 532 (58 → 62 %) ·
  412 × 915 560 → 586 (61 → 64 %). Über neun Schirmgrößen nachgemessen, nirgends ragt Text heraus;
  es bleiben mindestens 17 px Luft je Seite plus 14 px Rand nach unten.
- **Korrektur an der eigenen Doku.** V47 stand in `verbesserungen.md` mit der Aussage, die zwei
  Knöpfe passten auf *keinem* Telefon nebeneinander. Das war falsch und hat vier Wochen lang den
  Textstreifen auf **allen** Geräten hochgehalten. Der Punkt ist korrigiert und auf das reduziert,
  was davon übrig bleibt: Schirme unter 362/380 px, dort mit rund 5 px Gewinn.

## 2026-07-30 — Der Weg: Rückmeldung zur Runde davor (V42–V46)

Fünf Punkte aus Gabriels Durchgang am PC und am Telefon, unmittelbar nach dem Deploy von V38–V41.
Zwei davon zeigen auf dieselbe Stelle im Bau: den Abgang der Reise, der von **zwei** Verläufen
getragen wird, die verschiedenen Elementen gehören.

- **V43 — Am PC stand eine Kante quer über dem Übergang zu den Fragen.** Gabriels Beschreibung
  traf den Bau genau: „einmal Farbverlauf von links, einmal von unten, dazwischen kein Verlauf."
  Der Schleier der Textebene liegt breit links (58 vw, waagerecht) und endete hart an ihrer
  Unterkante — genau dort fängt der Ausklang an, der aber von unten aufhellt.
- **V44 — Am Telefon blitzte bei schnellem Wischen der Videohintergrund auf.** Dieselbe Naht,
  eine Stufe subtiler: die Textebene wird per JavaScript nachgeführt, der Rest der Seite scrollt
  nativ. Bei einem schnellen Wisch hinkt sie ein Einzelbild hinterher, und in diesem Bild klafft
  die Lücke.
- **Beides mit einer Maßnahme: die „Schürze".** Der Verlauf der Textebene reicht jetzt um die
  Länge des Ausklang-Streifens unter ihre Unterkante hinaus (`--weg-schuerze`, dieselbe Zahl wie
  dessen Höhe). Am PC überlappen sich die zwei Verläufe damit auf ganzer Streifenlänge statt
  aneinanderzustoßen — nachgemessen an drei Scrollständen liegen beide Unterkanten auf demselben
  Pixel. Am Telefon füllt sie die Lücke unabhängig vom Zeitverhalten: mit künstlichem Rückstand
  geprüft, bis **260 px** Verzug bleibt gedeckt (die Schürze ist 290 px lang), ein Einzelbild
  sind selbst bei hastigem Wischen weniger als 100. Zusätzlich läuft die Nachführung jetzt direkt
  im Scroll-Lauscher statt in `requestAnimationFrame`, der Verzug entsteht also gar nicht erst —
  möglich, weil dort nichts mehr gemessen wird (die Schwelle steht einmal je Layout).
- **V42 — „Mehr dazu" stand mal hinter dem Text, mal unter den Schlagworten.** Die Regel von
  V38–V41 wählte den Ort je nach Station; am Gerät las sich das als Zufall. Er hängt jetzt
  **überall** hinten am letzten Satz des Fließtextes, die Schlagworte darunter. Kostet fast
  nichts: die höchste Station hat gar keine Schlagworte.
- **V45 — Die Wegmarkierung im Reitermenü ist am PC zurück.** V29 hatte sie entfernt, weil sie
  dasselbe sagt wie die Punktleiste. Gabriels Urteil am Gerät: die Doppelung störte auf dem
  **Telefon**, wo Menü und Punktleiste um knappen Platz konkurrieren — am PC ist das Menü ohnehin
  eingeblendet und der Stand in Worten leichter zu lesen als in Punkten. Ab 861 px, derselben
  Schwelle, an der die Engine das Menü überhaupt einblendet; unterhalb ändert sich nichts.
  **Nicht** zurück kommt die alte Fläche in Szenenfarbe (2,6–3,3:1, Befund V24) — Weiß auf Tinte
  misst nachgemessen 14,26:1.
- **V46 — Textstreifen auf das Minimum: 355 px (niedrige Schirme 325).** Gabriel sah wieder zu
  viel Leerraum. Die Messung gibt ihm halb recht und zeigt zugleich die Grenze: maßgeblich ist
  die Schluss-Station mit 304 px (360 × 800 und 375 × 812), mehr als 355 geht nicht herunter,
  ohne unter 18 px Luft zu fallen. Der Rest des Leerraums hat zwei andere Ursachen, die in
  `docs/der-weg.md` stehen: die zwei Handlungsknöpfe, die auf keinem Telefon nebeneinander passen
  (87 statt 40 px, offener Punkt V47), und die rund 60 px, die `100svh` unten frei lässt, sobald
  Chrome die Adressleiste einfährt — der Preis für eine Aufteilung, die während der Fahrt nicht
  wandert.
- **Keine Änderung: die einfahrende Adressleiste.** Chrome auf Android macht das bei jeder Seite,
  die länger als der Schirm ist; ein Schalter dafür existiert nicht. Verhindern ließe es sich nur,
  indem die Seite selbst nicht mehr scrollt und ein Kasten in ihrem Inneren scrollt — genau darauf
  baut die Scroll-Engine auf.

Nachgemessen auf 320 × 568, 360 × 640, 360 × 800, 375 × 812, 393 × 852, 412 × 915 sowie 820 × 700
und 1280 × 800: keine Station läuft aus ihrem Streifen (19–37 px Luft je Seite), der „Mehr"-Knopf
sitzt überall auf der letzten Textzeile, die Wegmarkierung erscheint unter 861 px nicht,
„Mehr dazu"-Feld öffnet und schließt mit Fokusrückgabe, keine Konsolenfehler,
`pruefe-seiten.mjs` grün. Hauptseite V18 unberührt.

## 2026-07-30 — Der Weg: Gabriels zweiter Telefon-Durchgang (V38–V41)

Vier Befunde von seinem Gerät, zwei davon Folgeschäden der Änderungen vom Vortag. Nur die
Scroll-Reise (`der-weg/`), die Lesefassung V18 blieb unangetastet.

- **V38 — Die Kamera bremste genau da, wo niemand liest.** Gabriel: „zäh, als müsste man mehr
  scrollen, um beim Video voranzukommen" (rund um „Was sich wirklich ändert"). Drei Stationen
  trugen ein `linger` — die Engine bremst damit die Kamera in der **Mitte** einer Etappe. Das
  ergibt nur bei der Textführung `'middle'` Sinn; diese Seite läuft auf `'arrival'`, wo der
  Stationstext erst zum **Ende** der Etappe einblendet. Gemessen an „Was sich wirklich ändert"
  (Etappe 1329 px, `linger: 0.4`): die mittleren 40 % des Scrollwegs — 532 px — brachten 27 %
  des Films (Rate 0,62), und die Textdeckkraft lag dort noch bei 0. An der Naht dagegen, wo der
  Text ankommt und wo zwei der sechs Übergänge ohnehin springen, raste die Kamera mit Rate 1,58.
  Genau umgekehrt zur Absicht. `linger` ist jetzt überall entfernt, jede Etappe läuft mit Rate
  1,0 durch. Ein Verweilen bei der Ankunft braucht es nicht extra — `'arrival'` hält den Text
  ohnehin in die nächste Etappe hinein, deren erste Bilder dieselbe Szene zeigen.
- **V39 — Vor den Fragen tauchte das Video noch einmal auf.** Der Ausklang-Streifen (V37, seit
  gestern 34vh) läuft von durchsichtig nach Pergament und lag unter der Textebene. Richtig,
  solange die Textebene *stehenblieb* — seit sie im Gleichschritt mit den Fragen hochfährt, liegt
  sein durchsichtiger Teil genau über dem Bildband, das noch auf Deckkraft 1 steht. Statt
  zuzudecken **gab er das Video wieder frei**: ein Band der letzten Szene zwischen zwei weißen
  Flächen, sichtbar über rund 290 px Scrollweg. Hochkant fällt der Streifen deshalb weg; der
  Pergament-Verlauf der Textebene hat oben ohnehin eine weiche Kante und wischt das Band beim
  Hochfahren allein weg. Nachgemessen an neun Punkten: Abstand zwischen Textebene und Leseteil
  durchgehend **0 px**, Leerlauf zwischen letztem Filmbild und Fragen von 1142 auf 852 px
  gefallen (1,34 → genau ein Bildschirm). Breit bleibt der Streifen — dort füllt das Video den
  Schirm und er ist der einzige Abgang der Szene.
- **V40 — „Mehr dazu" stand auf einer eigenen Zeile.** Er sitzt jetzt auf der **letzten Zeile
  des Stationstextes**: bei Stationen mit Schlagworten als letztes Element in deren Zeile, bei
  den zwei ohne („KI ist ein Werkzeug", „Lass uns 30 Minuten reden") hinten am letzten Satz.
  Beides endet vor den Handlungsknöpfen, „Erstgespräch anfragen" bleibt das Letzte. Gemessen bei
  393×852: Knopf 107 px breit, letzte Schlagwortzeile endet bei x=216, Textrand bei 374 — er
  passt mit 51 px Rest daneben, und die Wegpunkt-Leiste (x 353–387) liegt auf halber Schirmhöhe,
  also weit über der Schlagwortzeile. Damit ist V36 zurückgezahlt: **der Textstreifen sinkt von
  380 auf 360 px** (niedrige Schirme 350 → 335), das Bildband wächst von 55 auf 59 % des Schirms.
  Gegenrechnung ehrlichkeitshalber: ein höheres Band beschneidet die 4:3-Quelle seitlich stärker,
  die sichtbare Szenenbreite sinkt von 62 auf 60 % (23 von 1112 Quellpixeln).
- **V41 — Die Leiste oben sah aus wie ein Ladebalken.** 3 px hoch, volle Breite, blasse
  Kupferrinne — und beim Öffnen steht die Füllung auf Null. „Dadurch hat man anfangs das Gefühl,
  die Seite lädt nicht." Ersatzlos entfernt statt umgefärbt, weil die Punktleiste rechts den
  Stand bereits zeigt — dieselbe Begründung wie bei V29. Nur die Anzeige fällt weg, die Engine
  rechnet ihren Wert weiter aus.

Nachgemessen auf 320×568, 360×640, 360×800, 375×812, 393×852, 412×915 und 1280×720/800: keine
Station läuft aus ihrem Streifen (20–42 px Luft je Seite statt bisher mindestens 14), der
„Mehr"-Knopf sitzt auf allen sechs Hochkant-Maßen und breit auf der letzten Zeile, auf 1280×720
passen alle sieben Stationen mit mindestens 166 px Rand ins Fenster, keine Konsolenfehler,
`pruefe-seiten.mjs` grün. `docs/der-weg.md` mitgezogen (neuer Abschnitt zum Fahrttempo, Ausklang,
Knopf, Streifen-Tabellen, zwei neue Punkte für die Skill-Rückgabe).

## 2026-07-29 — Der Weg: Gabriels Telefon-Durchgang (V35–V37)

Drei Befunde von seinem Gerät, mit Screenshots belegt. Der erste war eine Folge des Vormittags:
der längere DSGVO-Chip (V32) kostete eine Zeile, und die hatte der Textstreifen nicht mehr.

- **V35 — Der Textstreifen stand teilweise unter dem Bildschirmrand.** Auf drei Screenshots
  desselben Auftakts saß der Text drei verschiedene Male anders, einmal war das letzte
  Schlagwort abgeschnitten. Ursache: **Chrome auf Android misst feste Elemente am großen
  Fenster** — dem ohne Adressleiste. Steht die Leiste, ragt die Unterkante eines
  `position: fixed; inset: 0` rund 110 px unter den sichtbaren Rand, und genau dort hing der
  Streifen. Weil die Leiste beim Scrollen ein- und ausfährt, wanderte die Aufteilung außerdem
  mit — Gabriels „er scrollt die komplette Seite und nicht nur das Video". Die Aufteilung
  rechnet jetzt in `100svh` (kleinste mögliche Fensterhöhe, ändert sich nie) statt in Prozent
  des großen Fensters; `dvh` wäre falsch, es würde das Bildband bei jedem Ein- und Ausfahren
  neu skalieren. Browser ohne `svh` behalten die alten Regeln (`@supports`).
- **V36 — „Mehr dazu" lag auf der Wegpunkt-Leiste.** Der Knopf saß rechts außen in der
  Kopfzeile der Station, genau dort läuft die Punktleiste — zwei Bedienelemente an derselben
  Stelle. Er steht jetzt unter dem Text, auf der Schluss-Station vor den Handlungsknöpfen
  („Erstgespräch anfragen" bleibt das Letzte). Das Wort „dazu" ist wieder überall da.
  **Der Preis: eine Knopfzeile, also 380 statt 320 px Textstreifen und rund 60 px weniger
  Bild** (393×852: Band 55 % statt 62 %). Nachgemessen: 227 px Abstand zur Punktleiste.
- **V37 — Das Ende wurde weiß, bevor die Fragen kamen.** Die Engine blendete auch die letzte
  Szene nach ihrem Ende aus (rund 80 px Scrollweg), der Leseteil kommt aber erst einen ganzen
  Bildschirm später — dazwischen stand eine leere Pergamentfläche. Die letzte Szene bleibt
  jetzt stehen (`i < NSEG - 1`), das Video verschwindet nur noch dadurch, dass die Fragen
  darüber hochwandern; der Ausklang-Verlauf trägt die Überblendung jetzt allein und ist von
  22vh auf 34vh gewachsen. Nachgemessen: Deckkraft 1,000 an jedem Punkt von 900 px vor bis
  700 px nach dem Bahnende — vorher wäre sie 400 px **vor** dem Ende schon bei 0 gewesen.

Nachgemessen auf 393×852, 360×640, 320×568 und 1280×800: keine Station läuft aus ihrem
Streifen (mindestens 14 px Luft), kein seitlicher Überlauf, keine Konsolenfehler. Zwei
Doku-Stellen in `docs/der-weg.md` waren nach der Änderung falsch (Knopf-Platzierung,
Streifen-Tabelle) und sind mitgezogen.

## 2026-07-29 — Der Weg: Gabriels PC-Durchgang umgesetzt (V29–V33)

Fünf Punkte aus seinem eigenen Durchgang am PC. Nur die Scroll-Reise (`der-weg/`), die
Lesefassung V18 blieb unangetastet. Alles im Browser nachgemessen (1280×800 sowie 375/360/320
für die Hochkant-Fassung); Screenshots gehen im versteckten Pane weiterhin nicht.

- **V29 — Dieselbe Auskunft stand zweimal auf dem Schirm.** Am PC markierten der aktive Reiter
  oben UND der aktive Punkt rechts dieselbe Station; auf dem Telefon gab es das nie, dort ist
  das Reitermenü ab 861 px ausgeblendet. Die Punktleiste führt jetzt auf allen Größen (sie
  zeigt zusätzlich, wie viel Reise noch kommt), die Reiter sind reines Sprungmenü.
  Nachgemessen: aktiver und passiver Reiter identisch (`rgba(0,0,0,0)` / `rgb(74,85,104)`),
  genau ein aktiver Punkt. Erledigt damit auch V24 aus Runde 3: die kontrastschwache
  Aktiv-Fläche, die dort auf Tinte gesetzt wurde, gibt es nicht mehr.
- **V30 — Sigel zu groß und zu tief, und beides war derselbe Fehler.** Die Engine gibt dem
  Bild `height:100%` in einem quadratischen Kasten — gegen eine automatisch hohe Rasterzeile
  kann der Browser das nicht auflösen und fällt auf die natürliche Form zurück. Das Sigel ist
  hochkant (504×747), 34 px Breite ergaben also **50,4 px Höhe: 16 px liefen unten aus dem
  Kasten**, die Bildmitte lag 5,3 px unter der Schriftmitte. Jetzt beide Maße fest im
  Bildverhältnis (18×26 px). Nachgemessen: kein Überstand mehr (0,00 px), Bildmitte und Mitte
  der Großbuchstaben auf derselben Linie (0,00 px), Zeichenhöhe genau das Doppelte der
  Versalhöhe (26 zu 13 px).
- **V31 — Verdrehter Satz über die Schulungspflicht raus.** „Einschließlich der Schulung, die
  dich seit Februar 2025 zur KI-Kompetenz verpflichtet" — grammatisch verpflichtete dort die
  Schulung. Gemeint ist der EU AI Act, und genau so steht es in FAQ 04. Ersatzlos gestrichen.
- **V32 — „DSGVO-konform" ist kein Etikett mehr, sondern eine Zusage mit Bezug.** Der Satz
  stand sechsmal unbedingt über allem (Chip, Vorspann, Hero-Langtext, Bausteine, Fußzeile).
  Er gilt aber dort, wo er zählt: bei Daten. Neue Linie auf der ganzen Reise — **was bei dir
  läuft, hält den Standard ein; womit ich baue, ist davon getrennt.** Chip jetzt „Deine Daten
  DSGVO-konform", Bausteine-Absatz an die Daten geknüpft, Fußzeilen-Label raus, FAQ 04 um den
  Werkstatt-Absatz ergänzt. Nachgemessen, weil der längere Chip eine Zeile mehr kostet:
  die Auftakt-Station braucht auf 360×640 jetzt 227 statt 195 px in einem 286-px-Streifen
  (29 px Luft), auf 320×568 244 px (21 px Luft), auf 375×812 bleiben 29 px Luft. Die engsten
  Stationen sind unverändert „Der Weg" (4 px) und „Weitblick" (1 px) — an beiden wurde nichts
  geändert. Kein seitlicher Überlauf auf 320/360/375/1280.
- **V33 — TÜV-Prüfzeichen im „Mehr"-Feld von „Wer mit dir arbeitet".** Bisher stand die
  Prüfzeichen-ID nur als Fließtext. Jetzt das Siegelbild mit Link auf den Certipedia-Eintrag
  des TÜV Rheinland, wie ihn die Lesefassung V18 schon führt — der einzige Beleg der Seite,
  den jemand unabhängig nachprüfen kann. `der-weg/assets/tuev-siegel.png`, aus dem Original
  in `Bildmaterial/` mit Palette-Kompression von 73 auf 26 KB, `loading="lazy"` (lädt erst
  beim Öffnen des Felds). Nachgemessen: Feld öffnet auf Station `lichtung`, Bild 560×207
  geladen und mit 297×110 dargestellt, Link `target="_blank"` mit `rel="noopener noreferrer"`.

Offen bleibt: dieselbe DSGVO-Linie in der Lesefassung V18, auf `stilprobe/` und der
Datenschutzseite (dort weiter das pauschale Etikett) — steht als V34 in `verbesserungen.md`.

## 2026-07-27 — Der Weg: acht Befunde der Verbesserungsrunde 3 behoben (V21–V28)

Runde 3 von `/improve` (Fokus Scroll-Reise, Haltung „Nur messbare Fehler", Lupe emil-design-eng)
fand vier B-, zwei C- und zwei D-Befunde; alle acht sind umgesetzt und im Browser nachgemessen.

- **V21 — Unsichtbares war klickbar.** Ausgeblendete Stationstexte blieben klick- und
  tastatur-erreichbar; auf Schirm 1 fingen die zwei unsichtbaren Knöpfe der Schluss-Station
  Klicks (einer davon öffnet das Mailprogramm). Die Engine schaltet jetzt `visibility` mit.
  Nachgemessen: Punktprobe trifft die sichtbare Station, `focus()` auf Unsichtbares scheitert.
- **V22 — Datenspar-Schalter log in der Prüfphase.** Vor der Messentscheidung speicherte
  „Auf datensparsam umstellen" den Wert `voll`. Jetzt zählt „waiting" zur Sparsam-Seite.
- **V23 — Tempo-Messung verwechselte langsam mit Zwischenspeicher.** Unter 40 KB übertragener
  Daten galt „alles im Cache → Video frei" — auf einer langsamen Erstverbindung ist nach 1,8 s
  aber schlicht nichts fertig (die drei sicher fertigen Dateien wiegen live nur 19 KB gzip).
  Wiederbesuch wird jetzt an `transferSize === 0`-Einträgen erkannt; ohne belastbaren Messwert
  fällt die Entscheidung erst beim 6-s-Lauf. End-to-End geprüft: feste Wahl „sparsam" lädt
  null Videos, Lagezeile und Schaltertext stimmen in allen drei Zuständen.
- **V24 — Aktiver Nav-Reiter unter WCAG AA.** Weiß auf Szenenfarbe maß 3,29/2,56/2,77:1
  (Kupfer/Salbei/Quellwasser). Die Fläche ist jetzt Tinte (14,26:1, nachgemessen); die
  Schlagwort-Chips mischen eine Stufe dunkler (Salbei 4,34 → 5,8).
- **V25 — Hochkant-Kalibrierung für 375er- und 390er-iPhones.** Die Kopfzeile der ersten
  Station brach unter 393 px um (Kleintext eine Stufe kleiner gesperrt: bis 360 px runter
  einzeilig, 320 bleibt als dokumentierte Grenze zweizeilig), und die Schluss-Station ragte
  14 px ins Bild (Mindesthöhe des Textstreifens 320 px statt 300/270; niedrige Schirme
  unter 780 px bleiben bei 300). Nachgemessen auf 320/360/375/390/393/768.
- **V26 — Lesetext auf Maß.** FAQ-Antworten liefen 88, die Langfassungen ohne JavaScript
  102 Zeichen je Zeile; Textmaß jetzt 32rem → gemessen 61 bzw. 59 im Schnitt.
- **V27 — Reduce-Motion-Regel zielte auf `svg`, der Knopf enthält `i`.** Plus-Drehungen
  („Mehr"-Knopf, FAQ) stehen bei abgeschalteter Bewegung jetzt still; Zustände bleiben ablesbar.
- **V28 — Redaktionsreste und Werkzeug-Lücken.** Doppelkommentare und der Verweis auf den
  entfernten Umschalter sind raus; `kodiere.mjs` prüft jetzt auch das Handy-Poster im
  Idempotenz-Check; das „Mehr"-Feld hat eine vh-Rückfalllinie für Browser ohne `dvh`;
  die Engine bricht Clip-Abrufe nach drei Fehlversuchen ab statt bei jedem Scroll-Bild neu.

Engine-Änderungen (V21, Nachlade-Deckel) und der Nav-Kontrast stehen in `docs/der-weg.md`
auf der Rückgabe-Liste für den scroll-world-Skill. Neue Preview-Messfalle dokumentiert
(CLAUDE.md): CSS-Übergänge frieren im versteckten Pane am Startwert ein.

## 2026-07-27 — Der Weg: Datenmodus — erst leicht, dann aufrüsten

Vorbereitung darauf, dass die Reise die Hauptseite wird: dann landen Besucher unangekündigt auf
ihr, auch unterwegs mit schlechtem Netz.

**Zuerst die Zahlen, weil die Annahme falsch war.** Die Seite lud nie „30 bis 50 MB auf einmal" —
sie holt Etappe für Etappe. Gemessen im Handy-Format waren es beim Öffnen 5,3 MB (die ersten zwei
Etappen), durchgescrollt 17 MB. Auf 4G unauffällig, auf schwachem 3G 53 Sekunden bis zum ersten
Bild.

**Die Seite entscheidet jetzt selbst — und lädt bis dahin kein Video.** Der übliche Weg wäre, den
Browser zu fragen (`saveData`, `effectiveType`); das tut die Engine auch, nur verrät es außer
Chrome auf Android niemand. Ein iPhone im schlechten Netz bekam also die volle Fassung — genau
dort, wo sie am meisten weh tut. Stattdessen wird **gemessen statt gefragt**: die Seite lädt
ohnehin rund 340 KB, bevor das erste Video dran wäre; wie lange das gedauert hat, steht im
Browser (Resource Timing). Daraus fällt die tatsächliche Geschwindigkeit ab, ohne ein einziges
zusätzliches Byte. Ab 375 KB/s (rund 3 Mbit/s) werden die Clips freigegeben, darunter bleibt es
bei Standbildern. Gemessen wird zweimal — nach 1,8 s und nach 6 s, weil der erste Wert
Namensauflösung und Verbindungsaufbau enthält und eine schnelle Leitung unterschätzen kann.
Kam nichts über die Leitung, liegt alles im Zwischenspeicher, kostet also nichts mehr und wird
freigegeben.

| | Datenmenge (Handy) | schwaches 3G |
|---|---|---|
| Standbilder, ganze Reise | 0,37 MB | 3,7 s |
| Einstieg mit Video — **vorher** | 5,3 MB | 53 s |
| Einstieg mit Video — **jetzt** | 3,2 MB | 32 s |

Der Einstieg ist billiger, weil beim Öffnen nur noch **eine** Etappe vorausgeladen wird statt
zwei (`prefetch: 0.8` statt 1.6). Die zweite beginnt nach dem ersten Fingerwisch zu laden und ist
lange vor dem Ankommen fertig; bis dahin steht das Standbild.

**Niemand sieht je einen leeren Bildschirm oder einen Ladebalken.** Die Standbilder sind sofort
da, das Video schaltet sich still dazu. Und niemand wird gefragt: der Schalter dafür steht im
Abspann, merkt sich die Wahl im Browser und überschreibt die Messung — wer nichts tut, bekommt
die Messung.

**Die Engine bekommt dafür zwei rückwärtskompatible Zusätze:** `clipStart: 'gated'` (mounten,
aber kein Video laden, bis die Seite es freigibt), `prefetch` (Vorausladen in Bildschirmhöhen)
und einen Rückgabewert `{ allowClips(), enterStillsMode(), mode() }`. Die Trennung ist Absicht:
die Engine bringt die Mechanik, die Seite die Politik (Schwelle, Zeitpunkte, gemerkte Wahl).
Damit ist `der-weg/scrub-engine.js` wieder eine Sonderfassung gegenüber dem Skill — die
Rückgabe steht in `docs/der-weg.md` unter „Offen".

Geprüft: bei fester Wahl „datensparsam" wird auch nach dem Scrollen bis ans Ende der Reise
**kein einziges Video** geladen; bei „voll" sofort eines; automatisch entscheidet die Messung.
Standbilder kommen aus den kleinen Handy-Postern (0,37 MB für alle sieben), nicht aus den großen.

## 2026-07-27 — Der Weg: „Mehr" in die Kopfzeile, Ausklang scrollt mit

**„Mehr dazu" kostet keine eigene Zeile mehr.** Der Knopf sitzt jetzt in *einer* Zeile mit dem
Kleintext über der Überschrift, rechts außen — Abschnittsname links, Aktion rechts. Das spart
rund 50 px an der längsten Station, und weil genau die die Mindesthöhe des Textstreifens
bestimmt, geht der Platz direkt ans Bild: **auf einem 393 × 706 großen Schirm 58 % → 62 %
Bildhöhe** (Mindesthöhe 296 → 270 px, auf schmalen Schirmen 322 → 300 px).

**Der Pfeil nach unten ist weg.** Er versprach ein Aufklappen an Ort und Stelle, tatsächlich
öffnet sich ein Feld in der Bildschirmmitte. Jetzt ein **Plus** — dasselbe Zeichen, das die Seite
unten bei den häufigen Fragen für dieselbe Handlung benutzt. Statt Textlink mit Unterstrich eine
leise Pille, damit er auf Papier wie auf Bild als antippbar liest; das Plus dreht sich beim
Überfahren.

Damit die Kopfzeile auf allen sieben Stationen einzeilig bleibt, fällt hochkant das Wort „dazu"
weg („Mehr +"), und der Kleintext ist eine Spur kleiner und enger gesperrt gesetzt. Gemessen: der
längste Kleintext („Für Coaches, Trainer, Mentoren") plus voller Knopf brauchte 385 px von
354 verfügbaren. Auf der breiten Fassung steht weiter „Mehr dazu +".

**Der Ausklang: die Reise verabschiedet sich, statt abzubrechen.** Bühne und Textebene liegen
fest im Fenster; der Leseteil schob sich bisher darüber und deckte den letzten Stationstext
(„Lass uns 30 Minuten reden") einfach zu, während der stehen blieb. Jetzt wandert die ganze
Textebene — Pergament-Verlauf **und** Schrift — genau so weit nach oben, wie der Leseteil schon
ins Bild gekommen ist. Die Unterkante des Verlaufs liegt damit immer bündig auf der Oberkante des
Leseteils, es klafft nie eine Lücke (bei 393 × 706 und 1440 × 900 über den ganzen Weg auf 1 px
genau nachgemessen). Das Video bleibt bewusst stehen: es ist der Hintergrund, vor dem der Text
abzieht, und wird vom deckenden Leseteil ohnehin verdeckt.

## 2026-07-27 — Der Weg: Aufteilung an die echte Bildschirmhöhe gekoppelt, Naht 2→3 verbessert

**Warum die letzte Änderung auf Gabriels Telefon nichts bewirkt hat.** Sein Gerät meldet trotz
hoher Auflösung nur rund **700 CSS-Pixel Höhe** — es fiel damit in die Stufe „kleine Geräte", und
die stand vorher wie nachher bei 56 % Textanteil. Aus dem Screenshot nachgemessen: Bildband 43,5 %,
also exakt der Wert dieser Stufe. Die Staffelung war an der falschen Größe aufgehängt.

**Die Stufen sind weg.** Der Textstreifen bekommt jetzt `max(36%, 296px)` — Anteil **oder**
Mindesthöhe, je nachdem was größer ist. Der Grund: die Textmenge einer Station ist fest, ihre Höhe
hängt an der Schriftgröße, nicht an der Schirmhöhe. Eine feste Prozentzahl müsste sich am
schlechtesten Fall orientieren und hielte das Bild auf allen anderen Geräten unnötig klein. Auf
852 px greift der Anteil (307 px), auf 706 px die Mindesthöhe — das Bild bekommt dort alles, was
übrig bleibt. Schmale Schirme (< 380 px) brauchen 322 px, weil derselbe Satz auf mehr Zeilen
umbricht.

**Dazu eine Stufe kleinere Schrift auf niedrigen Schirmen** (`max-height: 780px`): die Größen
skalieren mit der Breite, aber auf einem dichten Display ist nur die Höhe knapp. Überschrift dort
28 statt 32 px. Das senkt die längste Station von 302 auf 260 px — und die Zahl ist unmittelbar
die Mindesthöhe des Streifens, weniger Schrift heißt hier also direkt mehr Bild.

Gemessen auf einem 393 × 706 großen Schirm: **Bildband 44 % → 58 %**, sichtbare Bildbreite 95 % →
72 %. Auf 393 × 852 unverändert 64 %. Auf 360 × 640: 50 %. Keine abgeschnittene Station, knappster
Fall 9 px Reserve. Breite Fassung, Tablet quer und Handy quer unberührt.

**Naht Haltung → Deine Woche.** Etappe 3 hat einen Anlauf: die Kamera driftet in den ersten drei
Bildern von der Anschlussstelle weg und kommt dann zurück. Am Rohmaterial gemessen (SSIM gegen das
letzte Bild von Etappe 2): Bild 0 → 0,38 · Bild 1 → 0,39 · **Bild 3 → 0,60** · Bild 4 → 0,45.
`kodiere.mjs` kennt jetzt ein Feld `vorlauf` und schneidet diese drei Bilder weg (1,6 % der
Etappe). Die Naht steigt damit von **0,30 auf 0,42** — messbar besser, aber weiter unter der
Schwelle. Poster und Standbild kommen aus der kodierten Datei und wandern automatisch mit.

**Naht Deine Woche → Die Stilprobe ist durch Schneiden nicht zu retten.** Ein 12 × 12-Vergleich
aller Bildpaare rund um die Naht liegt flach bei 0,10 bis 0,12 — es gibt kein besseres Schnittbild.
Der Grund ist im Standbildvergleich zu sehen: derselbe Schreibtisch, aber die Kamera springt
**rückwärts und nach oben**. Eine Richtungsumkehr lässt sich nicht wegschneiden. Sauber ist nur
eine neue Etappe 4 mit dem letzten Bild von Etappe 3 als Startbild. Beide Anschlussbilder liegen
jetzt bereit unter `Scroll World/legs/anschlussbilder/`.

## 2026-07-27 — Der Weg: Bild zurück in die Hauptrolle, Hero aufgeräumt

Gabriels Urteil am Gerät nach der ersten Hochkant-Fassung: „Vorher war das Video die Website, die
Schrift Zusatz. Jetzt ist die Schrift der Hauptteil und das Video Zusatz." Das Bild wirkte wie ein
eingesetztes Fenster über einer Textseite. Beides stimmt — die 54-%-Bandhöhe war zu weit gegangen.

**Neue Aufteilung: Band 64 %, Textstreifen 36 %.** Sichtbar bleiben rund **54 % der Bildbreite** —
gegen 35 % im Ursprungszustand und 64 % in der ersten Fassung, also der gesuchte Mittelweg.
Schrift entsprechend zurück: Überschrift 34,6 → **31,8 px** (vorher 30,4), Fließtext 17,3 →
**16,3 px** (vorher 15,7).

**Der Textstreifen wird nicht mehr unten verankert, sondern mittig gefüllt.** Bei einer kurzen
Station („KI ist ein Werkzeug", drei Zeilen) klaffte sonst eine große leere Pergamentfläche
zwischen Bild und Text — auf dem zweiten Screenshot der Hauptgrund für den Fenster-Eindruck.
Gemessen bei 412 × 915: aus 66 px oben / 80 px unten statt rund 250 px einseitig.

**Hero aufgeräumt.** Auf dem ersten Schirm standen sieben Schriftbehandlungen übereinander: Zähler
in Schreibmaschinenschrift, gesperrte Versalien-Zeile, Serifen-Überschrift, Fließtext, Chips,
„Mehr dazu" und der Scroll-Hinweis in gesperrten Versalien — drei Schriftfamilien, zwei gesperrte
Versalienzeilen, drei kupferfarbene Elemente. Jetzt: der **Zähler entfällt** hochkant (die Punkte
am rechten Rand zeigen dasselbe, und die Schreibmaschinenschrift war die dritte Familie), der
**Scroll-Hinweis zieht auf den unteren Bildrand** und zählt damit nicht mehr im Textstapel mit,
**„Mehr dazu" steht in Tinte** statt Kupfer, nur der Winkel bleibt kupfern. Ergebnis: zwei
Familien, eine gesperrte Zeile, zwei kupferne Elemente.

**Ein Fehler nebenbei behoben:** Der Scroll-Hinweis brach auf dem Gerät auf zwei Zeilen um. Grund:
Bei `left: 50%` reicht der verfügbare Platz nur bis zum rechten Fensterrand, also über die halbe
Breite — „scrollen und mitfliegen" braucht 202 px, die Hälfte von 393 px sind 196. Über die volle
Breite gelegt und darin zentriert passt er in eine Zeile.

**Marke lesbar auf jeder Szene.** Über der Werkstatt-Wand (Etappe 2) war „JGC Lumen" praktisch
unlesbar. Ein zarter Pergament-Dunst über dem oberen Bildrand plus derselbe Schein hinter der
Schrift, den der Scroll-Hinweis schon trägt. Auf hellen Szenen fällt der Dunst nicht auf.

**Die Aufteilung ist jetzt gestaffelt statt zweistufig**, damit ein Telefon mittlerer Höhe nicht
gleich auf den Notwert kleiner Geräte fällt: über 820 px Höhe 36 %, bis 820 px 42 %, bis 720 px
56 %. Maßgeblich ist die längste Station (7, mit zwei Schaltflächen); bei 36 % lief sie auf
360 × 640 unten aus dem Bild — dort wurde der „Mehr dazu"-Knopf abgeschnitten. Gemessen bei
360/393/412/430 × 640/800/852/915/932 sowie iPad hochkant: keine abgeschnittene Station mehr,
knappster Fall 16 px Reserve.

Breite Fassung, Tablet quer und Handy quer unverändert (bei 1440 × 900 und 852 × 393 gegengeprüft).

## 2026-07-27 — Der Weg: „Mehr dazu" öffnet die Langfassung jeder Station

Die Reise zeigt je Station drei bis vier Zeilen. Wer mehr wissen wollte, musste auf die
Lesefassung wechseln. Jetzt steht unter jedem Stationstext ein leiser Pfeil-Knopf **„Mehr dazu"**,
der die vollständigen Inhalte des jeweiligen Abschnitts als Feld in der Bildschirmmitte öffnet —
auf einem Pergament-Grund, der zur Mitte hin dichter wird, sodass die Welt als Ahnung
stehenbleibt. Alle sieben Stationen sind belegt (Quelle: `inhalt/lumen-inhalt.md`).

**Der Konflikt und seine Auflösung.** Gewünscht war: weiterscrollen lässt das Feld sanft
verschwinden. Genau so ist es. Solange es offen ist, hält die Reise aber an — sonst spult die
Kamera hinter einem Textfeld weiter, und die längste Station („Der Weg", 2.025 px Inhalt) wäre
überhaupt nicht lesbar. Die Regel: erst scrollt der Text im Feld; ist er zu Ende und man scrollt
weiter, geht es zu und die Reise läuft. Dazu Schließknopf, Escape, Klick auf den Hintergrund.
Eine kleine Schwelle (60 px) verhindert, dass ein Wackler das Feld zuschnappen lässt.

**Sieben Wege hinein und hinaus, alle gemessen:** Rad im Text · Rad am Textende · Rad auf dem
Hintergrund · Wischen in allen drei Lagen · Escape · Hintergrund-Klick · Schließknopf (Fokus
kehrt zum auslösenden Knopf zurück) · Seite bewegt sich anderweitig. Ein Fehler kam dabei ans
Licht: beim Wischen wurde der Bezugspunkt auf die *aktuelle* Fingerposition gesetzt statt auf die
Stelle, an der das Feld aufhörte mitzugehen — ein Wisch auf dem Hintergrund hielt die Seite an,
ging aber nie zu.

**Ein zweiter Fund, älter als diese Änderung.** Die Engine setzt für die breite Fassung
`top: 50%; transform: translateY(-50%)` und überschreibt `transform` beim Scrollen sofort mit dem
wandernden ±2 vh — die Zentrierung fiel damit ersatzlos weg, der Textblock *hing* an der
Bildschirmmitte. Auf 1440 × 900 fällt das kaum auf; auf einem 1280 × 720 großen Notebook liefen
drei Stationen unten aus dem Bild (19 bis 65 px), und abgeschnitten wurde ausgerechnet der neue
Knopf. Behoben über die eigenständige Eigenschaft `translate`, die **vor** `transform` wirkt statt
es zu ersetzen: Zentrierung in der Seite, Wandern weiter in der Engine. **Sichtbare Folge: auf
breiten Schirmen steht der Text jetzt mittig statt ab der Mitte nach unten.**

**Ohne JavaScript** stehen die sieben Langfassungen schlicht als Lesetext untereinander (5.221 px),
statt dass die Seite die Hälfte ihres Inhalts verschluckt — der `.js`-Vorsatz, den das Projekt auch
für die Aufdeck-Regeln der Hauptseite verlangt. Sie stehen so oder so im ausgelieferten HTML.

**Bewusst nicht übernommen:** die Zeile „Ausschnitt aus einer echten Stilprobe" von der
Hauptseite. Der dortige Ausschnitt trägt im Quelltext zweimal `PLATZHALTER Phase 6` (Befund V20).
Im neuen Feld steht deshalb „Ein Beispiel für den Unterschied" — die Fassungen A und B sind
übernommen, die Echtheitsbehauptung nicht.

`der-weg/vertiefung.js` ist neu und steht jetzt auch in der Artefakt-Prüfung des Deploys.

## 2026-07-27 — Der Weg: eigene Hochkant-Fassung (Bildband oben, Text unten)

**Der Anlass war ein Trugschluss.** Ein Screenshot vom Telefon zeigte winzige Schrift und die
Reiter-Leiste, die dort gar nicht stehen dürfte. Nachgemessen bei 393 px: die Handy-Regeln der
Engine greifen einwandfrei (Reiter aus, Überschrift 30,4 px, Verlauf unten). Die Live-Datei trägt
das korrekte `viewport`-Meta. Es bleibt genau eine Erklärung: im Browser war „Desktop-Website"
aktiv — eine Einstellung, die pro Seite gespeichert bleibt und die keine Seite aufheben kann.

**Der zweite Befund war echt.** Die Etappen sind 1112 × 834 (4:3), ein Telefon ist 393 × 852.
Formatfüllend bleiben davon **35 % der Bildbreite** sichtbar; zwei Drittel jeder Szene fallen
weg. Das galt auch in der korrekten Handy-Fassung. Neu: hochkant bekommt das Bild nur noch das
obere Band, der Text den Rest. Ein flacheres Band liegt näher am 4:3 der Quelle, der Beschnitt
fällt also kleiner aus. Gemessen: **393 × 852 → 64 % statt 35 %**, 360 × 640 → 88 %,
iPad hochkant 820 × 1180 → 95 %, iPad Pro 1024 × 1366 → 100 %. Überschrift 30,4 → 34,6 px,
Fließtext 15,7 → 17,3 px. Zwischen Bild und Text kein harter Strich, sondern ein
Pergament-Verlauf, der die Unterkante des Bandes auflöst.

**Eine Zahl steuert das:** `--weg-textzone` in `der-weg/index.html`. Bild, Verlauf und Naht
leiten sich daraus ab. Auf kurzen Schirmen (≤ 720 px) geht sie von 46 % auf 52 %.

**Umschaltpunkt.** Bisher entschied allein die Breite (≤ 860 px). Ein iPad Pro 12.9" hochkant
(1024 px) fiel damit auf die breite Fassung, obwohl der Schirm hochkant ist. Jetzt: hochkant
**und** schmaler als 1200 px. Jedes Tablet quer und jeder PC-Bildschirm bleiben unverändert bei
Text links — dort ist der Schirm breiter als 4:3, es wird also ohnehin nichts abgeschnitten.
Bei 1440 × 900 gegengeprüft: Textspalte, Verlaufsrichtung und Bildfläche byte-gleich wie vorher.

**Drei Kollisionen, die erst die Messung zeigte.** (1) Der Scroll-Hinweis stand auf derselben
Zeile wie die Schlagworte — er legt sich hochkant flach (26 px statt 80). (2) Die Engine schreibt
beim Scrollen ein wanderndes `translateY` von ±2 vh direkt ins Element; in einem festen Textfeld
sind das nur 34 px Unruhe, die überall als Luft eingeplant werden müssten — hochkant angehalten,
das Ein- und Ausblenden bleibt. (3) Auf 360 × 640 schoben die umbrechenden Schlagwort-Chips
Station 6 um 11 px aufs rohe Bild; kompaktere Chips lösen das an der Ursache, statt den Bildrand
weichzuzeichnen.

**Nebenbei mitgenommen.** Handy quer (852 × 393) hatte schon vorher 36 px Überlappung zwischen
Text und Scroll-Hinweis. Dort ist der Hinweis jetzt ausgeblendet — quer sieht man ohnehin sofort,
dass es weitergeht.

**Notnagel für „Desktop-Website".** Ein Skript im Kopf erkennt ein echtes Telefon an der kurzen
Bildschirmseite (≤ 600 px) **und** grobem Zeiger — beides zusammen ist auf keinem Notebook wahr —
und blendet wenigstens die Reiter-Leiste aus. Das heilt die Schrumpfung nicht, keine Seite kann
das; es macht sie erträglich.

**Die Engine bleibt unangetastet.** `der-weg/scrub-engine.js` ist weiter die unveränderte Kopie
aus dem Skill; sie wickelt ihr CSS bewusst in eine Kaskadenschicht, damit Seiten-CSS gewinnt.
Die Hochkant-Fassung steht deshalb vollständig in `der-weg/index.html`. Bewährt sie sich, gehört
sie in den Skill zurück — das ist ein eigener Schritt.

## 2026-07-25 — /improve-Runde 2: 13 Befunde behoben

**Kontaktweg (der Blocker).** Der Knopf „Erstgespräch anfragen" in der Final-CTA-Sektion zeigte auf `#kontakt` — also auf die Sektion, in der er selbst steht. Zusammen mit fehlendem `mailto:`, `tel:` und Formular konnte die Seite keine einzige Anfrage erzeugen. Jetzt E-Mail-Link an `kontakt@jgc-lumen.de` mit vorbelegtem Betreff und Rumpf, darunter die sichtbare Adresse als zweiter Weg. Der Punkt stand seit dem 27.06.2026 in drei aufeinanderfolgenden Analysen.

**Stilprobe-Formular.** Eingaben werden laufend im Browser der Besucherin gesichert (localStorage, 400 ms Debounce) und nach einem Reload mit Zeitstempel-Hinweis wiederhergestellt; ein Knopf verwirft den Entwurf, nach erfolgreichem Absenden wird er gelöscht. Vorher vernichtete jeder Reload drei Texte à 200–6.000 Zeichen. Die Fehlermeldung beim Absenden stand 2.140 px über dem Absendeknopf und war damit beim Klick unsichtbar — sie steht jetzt direkt darüber, holt sich den Fokus und scrollt sich in den Blick.

**Sichtbarkeit ohne JavaScript.** Die Impeccable-Skin-Schicht setzte `.reveal:not(.is-visible){opacity:0}` ohne den `.js`-Vorsatz, den die Basis-Ebene korrekt verwendet, und hat den Schutz damit aufgehoben: ohne JavaScript blieben 68 % des Seitentexts unsichtbar. Betraf Variante 18 und die Stilprobe-Unterseite, die das CSS erbt.

**Farbflächen stabilisiert.** Die Hervorhebungs-Verläufe hingen an `:nth-child(N of .bg-pergament)`. Der Einbau der Stilprobe-Sektion am 11.07. hat alles danach um eine Position verschoben — der Verlauf lag seitdem auf den Platzhalter-Kundenstimmen statt auf „Passt für dich / nicht". Jetzt an IDs gebunden.

**Suchmaschinen.** Sieben alte Design-Varianten standen auf `index, follow` mit einem `canonical` auf `http://localhost:4321/` (für Suchmaschinen wertlos), vier weitere hatten gar kein Robots-Meta. Alle 14 Nicht-Hauptseiten stehen jetzt auf `noindex, nofollow`, die localhost-Adressen sind entfernt. Welche Variante indexierbar bleibt, liest das Skript aus dem Manifest.

**Rechtsseiten.** Die Datenschutzerklärung behauptete, die Website werde „derzeit nur lokal getestet" — sie ist seit Wochen öffentlich und nimmt über `/stilprobe/` personenbezogene Daten entgegen. Ersetzt durch den tatsächlichen Stand samt Auslieferung über GitHub Pages (USA, Art. 6 Abs. 1 lit. f) und dem neuen Entwurfsspeicher. Im Impressum: „§ 5 TMG" → „§ 5 DDG" (das Gesetz heißt seit Mai 2024 so). Der Impressum-Inhalt selbst fehlt weiter und braucht Gabriels Daten.

**Barrierefreiheit.** Der Primärknopf lag mit 3,21 : 1 unter dem WCAG-AA-Wert von 4,5 : 1 — Knopffläche auf `#A55F2B` (4,79 : 1), Kleintexte mit Deckkraft 0,55/0,6 auf 0,70. Die Markenfarbe Kupfer bleibt für Ränder, Eyebrows und Akzente unverändert.

**Teilen-Vorschau.** `og:image` fehlte, während `twitter:card` ein großes Vorschaubild versprach — auf LinkedIn erschien eine leere Karte. Neues `assets/og-bild.jpg` (1200×630, 78 KB), gebaut aus dem Hero-Foto und dem Sigel der Variante 18 (`scripts/v18/baue-og-bild.mjs`), wird vom Deploy nach `/og-bild.jpg` kopiert.

**Aufräumen.** Galerie trug noch die Marke „JGC Studio" und lud Google Fonts von außen (überträgt die IP der Besucherin an Google, im Widerspruch zur eigenen Datenschutz-Zusage) — Marke korrigiert, Schriften auf Systemstack. Zwei Transform-Skripte hatten einen absoluten Pfad in einen *anderen* Worktree hartkodiert und hätten bei einem erneuten Lauf unbemerkt die falsche Datei geändert — jetzt relativ zum Skript. Der tote LinkedIn-Fußzeilenlink (zeigte auf die LinkedIn-Startseite) ist entfernt, bis die echte Profil-URL vorliegt. `npm audit fix`: 8 → 4 Schwachstellen (6 → 2 hoch); der Rest verlangt Astro 7.

**Neue Absicherung.** `scripts/pruefe-seiten.mjs` prüft in rund drei Sekunden zehn Regeln — je eine pro Fehlerklasse dieser Runde. Das Skript hängt im Deploy-Workflow (bricht dort laut ab) und in der neuen `.claude/pruefen.txt`. Es hat sich zweimal selbst bezahlt gemacht: beim allerersten Lauf fand es, dass die Stilprobe-Seite denselben `.js`-Fehler wie Variante 18 trug; beim ersten Deploy stoppte es die Auslieferung, weil neun weitere Varianten (01–09) noch auf `index, follow` standen — sie werden aus den `variant/*`-Branches gebaut und liegen als Datei nirgends im Repo, waren durch eine Quellenprüfung also gar nicht erreichbar. Dafür kam `scripts/site-noindex.mjs` dazu, das nach dem Build direkt auf `_site` stempelt: alle Varianten plus `/main/` (zwei Generationen älter, gleicher Titel, also eine zweite konkurrierende Startseite). **Live indexierbar sind jetzt genau zwei Seiten: die Startseite und `/stilprobe/`.** Die Projekt-CLAUDE.md nennt jetzt die Prozess-Stufe **Produkt**; `verbesserungen.md` als Befund-Register liegt auf `main`.

## 2026-07-14 — Über-mich-Foto: echtes Halbfigur-Portrait

- Sektion „Wer mit dir arbeitet" (Live-Variante 18): Platzhalter-Portrait durch das echte Halbfigur-Foto (3:4) ersetzt. Slot von 208 px auf 270 px vergrößert, `border-radius` 6→8 px; zentriertes Layout unverändert. Auswahl von Gabriel nach Mockup-Vergleich mehrerer Zuschnitte, Formate und Größen (Achsen Größe/Platzierung und Zuschnitt/Form).
- Bild mit `sharp` optimiert: 720×960 webp, 40,5 KB (data-URI 54 KB) — rund 8,5 KB leichter als das alte eingebettete Foto, die Seite wird also minimal leichter statt schwerer.
- Quelldateien versioniert unter `Bildmaterial/Profilbild/`: `profil-halbfigur.webp` (Original-Upload 1086×1448) und `profil-halbfigur-web.webp` (eingebettete Web-Fassung).
- Umgesetzt über ein assertion-guardetes Node-Transform (genau 1 Treffer erzwungen, alte Foto-URI/Maße nachweislich entfernt); Datei bleibt reines LF, Diff auf die eine minifizierte Zeile beschränkt.

## 2026-07-12 — TÜV-Siegel verlinkt + Express-Passus in die Schritt-2-Spalte

- Das TÜV-Prüfsiegel (Sektion „Wer mit dir arbeitet") ist jetzt klickbar und öffnet die offizielle Certipedia-Prüfseite des TÜV Rheinland (Prüfzeichen-ID 0217466495) in einem neuen Tab (`target="_blank"`, `rel="noopener noreferrer"`).
- Angebotsstruktur: Der separate Nachtrag „Du weißt schon genau, was du willst?" unter dem Spalten-Grid ist in die Schritt-2-Spalte (KI-Praxis-Check) integriert — als kompakter Express-Passus mit feiner Trennlinie am Spaltenende, Text aufs Spaltenmaß gekürzt. Der Anrechnungs-Hinweis wandert aus dem „Was du bekommst"-Aufklapper ans Spaltenende und steht nur noch einmal in der Spalte, ergänzt um „— der Check kostet dich dann nichts extra". Spaltenhöhen Schritt 2/Schritt 3 im Desktop-Layout jetzt praktisch gleich (1126 px vs. 1125 px, im Browser gemessen).
- Umgesetzt über `scripts/v18/transform-tuvlink-schritt2.mjs` (assertion-guarded, idempotent; neuer Ordner `scripts/v18/`, Zieldatei-Pfad relativ zum Skript statt absolut hardcodet).

## 2026-07-12 — Homepage-Navigation-Fix vor dem Live-Gang

- V18-Logo-Link (Marke/„zurück zum Anfang") von relativ `../../` auf absolut `/jgc-studio-website/` umgestellt. Der relative Pfad war korrekt am Galerie-Standort `/variants/18-lumen/`, zeigte aber von der Root-Hauptseite aus auf das GitHub-Konto-Wurzelverzeichnis (weg von der Seite). Der absolute Pfad stimmt an beiden Standorten. Damit enthält V18 keinen einzigen ortsabhängigen relativen Link mehr (gleiche Fix-Klasse wie zuvor die Footer-Rechtslinks). Umgesetzt über `scripts/stilprobe/fix-v18-logo-link.mjs` (assertion-guarded).

## 2026-07-12 — Stilprobe-Unterseite: Feedback-Runde Gabriel

- Vor-Formular-Strecke verschlankt: Kopf-Absatz gekürzt, die drei Ablauf-Karten durch eine kompakte nummerierte Liste ersetzt, Klartext-Kasten gestrafft (alle Rechts-Anker — US-Hinweis, Standardvertragsklauseln, 30-Tage-Löschung, Klienten-Leitplanke — unverändert enthalten), Abstände reduziert.
- Überschrift „Drei ruhige Schritte." → „So läuft es." (Eyebrow „Der Ablauf").
- Neue Einordnungszeile unter dem Ablauf: Die Probe arbeitet mit drei Texten; in der richtigen Zusammenarbeit fließt deutlich mehr Material ein und die Handschrift wird feiner getroffen.
- Kontingent präzisiert (FAQ 01): 15 Proben im Monat gelten insgesamt über alle Anfragen, nicht je Person; je Coach eine Probe.
- Stil-Kohärenz-Hinweis: sichtbarer Absatz über den drei Textfeldern + FAQ 04 („drei Texte aus derselben Tonlage, sonst Mischstimme"); die drei wiederholten Feld-Hilfetexte entsprechend auf „Bitte einfügen statt verlinken." gekürzt.

## 2026-07-11 — Quick-Wins aus der /improve-Analyse (Punkte 5–9)

- Astro-Unterseiten (`/main/`): Marke „JGC Studio" → „JGC Lumen" (Nav-Wortmarke, Footer, Titel/Descriptions von Impressum und Datenschutz) — behebt den Markenbruch beim Klick von der Lumen-Hauptseite auf die Rechtsseiten.
- Kontaktadresse überall `kontakt@jgc-lumen.de` statt `kontakt@jgc-handwerk.de` (Impressum, Datenschutz). Achtung: Postfach existiert erst mit der jgc-lumen.de-Domain — bewusste Vorab-Umstellung auf Gabriels Anweisung.
- `.gitattributes` neu (`* text=auto eol=lf`; Varianten-HTMLs explizit `text eol=lf`). Befund: Der Index war historisch bereits vollständig LF — keine Renormalisierung nötig, kein Byte der Live-Varianten geändert.
- README.md neu geschrieben: reale GitHub-Pages-Deploy-Struktur (`/main/`, `/variants/`, `/galerie/`, Root-Hauptseite, `/stilprobe/`) statt des veralteten Vercel-Hinweises.
- Deploy-Workflow: neuer Step „Verify build artefacts" — fehlt eines der Kernartefakte (Root-Index, Galerie, `/main/`, `/stilprobe/`), bricht der Deploy laut ab.
- Zurückgestellt auf Gabriels Wunsch (Backlog): toter Erstgespräch-CTA, Impressum-/Datenschutz-Platzhalter füllen, LinkedIn-Profil-Link, og:image, Seitengewicht-Optimierung.

## 2026-07-11 — Stilprobe-Integration, Website-Teil (Konzept v1.1, Abschnitt 5)

- Hauptseite (Live-Variante 18): neue Sektion `#stilprobe` (Vergleich Fassung A/B mit Phase-6-Platzhaltertexten, CTA, dynamische Kontingent-Zeile mit statischem Fallback) zwischen „Deine Woche, zwei Versionen" und „So gehen wir gemeinsam vor"; Nav-Eintrag „Stilprobe" (Desktop + mobil, erster Eintrag); Hero-Sekundär-CTA jetzt „Die Stilprobe ansehen"; neue FAQ 02 „Was ist die Stilprobe?" (Nummern 02–10 → 03–11 verschoben); Brückensatz in FAQ 01; Sekundärzeile „oder starte mit der Stilprobe →" im Final-CTA; Footer-Link. Umgesetzt über `scripts/stilprobe/transform-v18-stilprobe.mjs` (assertion-guarded).
- Neue Unterseite `stilprobe/index.html` → deployt nach `/stilprobe/`: Erklärung, drei Schritte, Klartext-Absatz (US-Transparenz), Formular (Name, E-Mail, 3 Texte à 200–6.000 Zeichen mit Zeichenzähler, Wunschthema, Quelle, 2 Bestätigungen, Honeypot, Zeitstempel), Wartelisten- und Pause-Zustand über `kontingent.php`, Mini-FAQ, leiser Abschluss. Design 1:1 aus V18 extrahiert (`scripts/stilprobe/extract-v18-assets.mjs`).
- Deploy-Workflow: neuer Step kopiert `stilprobe/index.html` nach `_site/stilprobe/`.
- Datenschutzseite (Astro, `/main/datenschutz/`): neuer Abschnitt „Die Stilprobe" (Zweck, Einwilligung Art. 6 Abs. 1 lit. a DSGVO, Auftragsverarbeiter All-Inkl/Anthropic/Telegram, 30-Tage-Löschung, Betroffenenrechte, kein Tracking) — Entwurf, juristische Prüfung offen.
- Bugfix: Footer-Links Impressum/Datenschutz der Hauptseite zeigten von der Root-Kopie aus ins Leere (`../../main/…`); jetzt absolute Pfade `/jgc-studio-website/main/…`.
- Doku: `docs/stilprobe/` (Konzept v1.1, Knoten-Graph, Schnittstellen-Vertrag Website ↔ PHP-Empfangsschicht).
- Hinweis: Formular und Kontingent-Badge laufen bewusst gegen noch nicht existierende Endpoints (Fallbacks greifen); scharf wird beides erst mit dem All-Inkl-Umzug (`senden.php`/`kontingent.php` aus dem separaten Repo `stilprobe-automatik`).
