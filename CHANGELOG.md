# Changelog

Wird ab 2026-07-11 geführt (Repo bestand vorher ohne Changelog; Historie siehe Git-Log).

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
