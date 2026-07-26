# Lessons aus dem Bau von „Der Weg" (Skill `scroll-world`)

Was beim Bau der Scroll-Reise am 26.07.2026 gelernt wurde und **nicht im Skill steht**.
Gilt für jede weitere Seite dieser Art, unabhängig vom Thema. Reihenfolge nach Kosten:
oben das, was am meisten Zeit gefressen hat.

---

## 1. Die Kamera-Architektur bestimmt, wann Text erscheint

**Der teuerste Punkt.** Der Skill bietet zwei Architekturen an und beschreibt sauber, wie
sich die Kamera bewegt. Er sagt aber nirgends, dass die Wahl auch die **Textführung**
umwirft, und die mitgelieferte Engine ist nur für eine der beiden gebaut.

- **Architektur B** (Eintauchen pro Szene): ein Segment IST eine Szene. Sie steht von
  Anfang an im Bild. Der Text gipfelt sinnvollerweise in der Segmentmitte, so macht es
  die Engine.
- **Architektur A** (durchgehender Vorwärtsflug): ein Segment ist die **Fahrt zu** einer
  Szene. Das Ziel taucht erst am **Ende** auf. Die Mitte des Segments ist Niemandsland.

Mit der ungeänderten Engine erscheint bei A jeder Text mitten im Übergang und ist wieder
weg, sobald das Ziel im Bild ist. Die erste Szene bleibt zusätzlich stumm, weil der
Auftakt-Text nach 62 % ausblendet.

**Regel für A:** Textfenster ans Segment**ende** legen, nicht in die Mitte, und über die
Naht in die nächste Etappe hinein halten lassen (dort ist dieselbe Szene noch zu sehen).
Der Auftakt hält über seine ganze Etappe. Fertige Kurve in `der-weg/scrub-engine.js`.

**Vorher prüfen, nicht hinterher:** Rechne die Sichtfenster einmal auf dem Papier durch
(Segmentgrenzen aus den `scroll`-Werten × Fensterhöhe). Das dauert zwei Minuten und
erspart die Runde „warum steht der Text an der falschen Stelle".

## 2. Ein fester Ähnlichkeitswert taugt nicht als Nahtprüfung

Der Skill verlangt SSIM ≥ 0,90 je Naht und nennt < 0,75 „regenerate, don't rationalize".
Das ist materialabhängig und hier schlicht falsch: Bei fein strukturiertem Papier und
zügiger Kamera fallen **zwei benachbarte Bilder desselben Videos** auf 0,61. Nach der
Skill-Regel wäre jede der sechs Nähte durchgefallen; tatsächlich waren vier tadellos.

**Stattdessen:** Miss zu jeder Naht einen **Eigenwert** derselben Etappe (gleicher
Bildabstand, aber innerhalb einer Datei, wo es per Definition keinen Schnitt gibt) und
bewerte das Verhältnis. Saubere Nähte lagen bei 1,0 bis 1,24 des Eigenwerts, gebrochene
bei 0,32 und 0,46. Diese Trennung ist eindeutig, der absolute Wert ist es nicht.
Umgesetzt in `scripts/der-weg/pruefe-naehte.mjs`.

Das gilt allgemein: Ein absoluter Schwellwert über ein Ähnlichkeitsmaß ist ohne
Referenzmessung am selben Material eine Behauptung, keine Prüfung.

## 3. Alles unterhalb der Reise braucht eine hohe Stapelebene

Die Engine legt ihre Bühne fest ins Fenster (`z-index: 10`), die Textebene auf 20, dazu
Bedienelemente auf 40 bis 60. Ein Footer im normalen Fluss landet **darunter**: das Video
liegt über der Fußzeile, die Kapitelpunkte stehen mitten im Text.

**Regel:** Jeder Bereich nach der Reise kommt in einen gemeinsamen Container mit
`position: relative; z-index: 70` und **deckendem** Hintergrund. Darüber nur, was bewusst
schweben soll. Dazu ein Verlaufsstreifen von durchsichtig zur Hintergrundfarbe, sonst wird
die letzte Szene hart abgeschnitten.

Der Skill erwähnt diesen Übergang nirgends, obwohl jede echte Landingpage darunter noch
Inhalt braucht (Fragen, Kontakt, Impressum).

## 4. Liegt das Material schon vor, ist der Skill-Einstieg der falsche

Der Skill beginnt mit Interview, Budget und Generierung. Kommt das Material fertig vom
Auftraggeber, sind die Schritte 1 bis 5 hinfällig, und es gibt keine Anleitung für den
Fall. Der richtige erste Schritt ist dann **messen**:

```
ffprobe je Datei          Auflösung, Seitenverhältnis, Bildrate, Bildanzahl
Nahtprüfung               hält die Kette überhaupt?
Randbilder ansehen        stimmt die Reihenfolge, ist die Szene die erwartete?
```

Erst danach bauen. Hier hätte ein sofortiger Seitenbau zwei gebrochene Nähte und ein
falsches Seitenverhältnis mitgeschleppt.

## 5. Format-Annahmen des Skills gelten nur für die Kommandozeile

Der Skill rechnet durchgehend mit 1080p und 16:9, weil die Higgsfield-CLI das liefert.
Über die Weboberfläche erzeugtes Material kann anders aussehen: hier **1112 × 834, also
4:3**. Alle Encode-Befehle, Layout-Annahmen und Mobil-Empfehlungen des Skills müssen ans
echte Material angepasst werden. Nie hochskalieren.

Bei bereits kleinem Ausgangsmaterial ist die Empfehlung „720p-Geschwister fürs Handy"
wirkungslos. Was zählt, ist die **Zahl der Ankerbilder** (`-g`): daran hängt, wie teuer
ein Sprung im Video für einen Telefon-Decoder ist, nicht an der Pixelzahl.

## 6. Externe Schriften sind im DACH-Raum ein Rechtsthema

Der Skill nennt Google Fonts unbekümmert. Auf einer deutschen Gewerbeseite schickt das die
IP-Adresse jeder Besucherin an Google und ist abmahnbar (LG München I, 20.01.2022,
3 O 17493/20). Schriften gehören lokal ausgeliefert.

Praktisch: Die Schnitte lassen sich aus einer bestehenden Seite herauslösen (hier aus der
minifizierten Hauptseite), und dabei gleich die nicht benötigten Sprachbereiche weglassen.
Kyrillisch, Griechisch und Vietnamesisch machten hier 46 % des Schriftgewichts aus.

## 7. Scrollweg niedriger ansetzen als der Skill vorschlägt

Der Skill empfiehlt `scroll: 1.6–2` für Schlüsselszenen. Über sieben Etappen ergab das
12,2 Bildschirmhöhen und fühlte sich zäh an. Nach Rückmeldung auf 8,45 gekürzt, mit
1,0 als Grundwert und 1,45 für die wichtigste Szene.

**Regel:** niedrig anfangen und bei Bedarf dehnen. Zu langes Scrollen fällt erst beim
Durchlaufen auf, und dann ist die Textführung schon darauf abgestimmt.

## 8. Eine einzelne Etappe muss austauschbar sein

Bei so einer Seite wird fast sicher Material nachgereicht (hier: eine Szene mit dem
richtigen Porträt). Die Verarbeitungskette gehört deshalb von Anfang an so gebaut, dass
**eine** Etappe mit einem Befehl neu durchläuft, statt alle sieben.

Dazu gehört der Hinweis, der leicht vergessen wird: Eine ausgetauschte Etappe berührt
**immer zwei** Nähte, die davor und die danach. Nach jedem Austausch neu prüfen.

Hilfreich für den Auftraggeber: die korrekten Startbilder gleich mitliefern (das letzte
Bild der Vorgängeretappe als PNG). Ohne das kann er gar keine anschlussfähige Szene
erzeugen.

## 9. Zwei Fehler in der Skill-Engine

- **Gerätetyp:** `Math.min(screen.width, screen.height) <= 600` liest einen noch nicht
  gemeldeten Bildschirm (0) als „Handy" — ein Desktop bekommt dann dauerhaft die kleine
  Fassung. Ein unbekannter Wert muss zur besseren Qualität führen, nicht zur schlechteren.
- **Überblendung:** ist global. Sobald eine einzige Naht springt, zeichnet man mit der
  Gegenmaßnahme die ganze Reise weich. Gehört pro Etappe einstellbar.

Beides in `der-weg/scrub-engine.js` behoben und dort im Quelltext markiert.

## 10. Kleinkram, der trotzdem Zeit kostet

- **`.mp4` in `.gitattributes`.** Fehlt der Eintrag, steht Video auf „raten". Bei 50 MB
  ist Raten das falsche Verfahren.
- **Der Text der Scroll-Engine ist nicht auffindbar.** Sie baut alles im Browser, das
  ausgelieferte HTML wäre leer. Der `data-sw-seo`-Block ist Pflicht, nicht Kür. Umgekehrt
  braucht ein Bereich, der ohnehin echtes HTML ist (die Fragen), keinen Spiegel.
- **Doppelter Aufruf.** Trägt die letzte Station einen Handlungsaufruf, darf der Footer
  ihn nicht wiederholen. Fällt beim Bauen nicht auf, beim Durchscrollen sofort.
- **Aufklappbare Fragen** über `<details>` brauchen kein JavaScript und funktionieren auch
  dann, wenn die Reise selbst nicht lädt.

---

---

## Stand: eingearbeitet

Am 26.07.2026 sind alle nicht projektspezifischen Punkte in den Skill selbst geflossen
(`~/.claude/skills/scroll-world/`):

| Wohin | Was |
|---|---|
| `SKILL.md`, Schritt 4 | Architektur A wirft auch die Textführung um |
| `SKILL.md`, Schritt 0b (neu) | Einstieg, wenn das Material schon vorliegt: erst messen |
| `SKILL.md`, Schritt 6 | SSIM-Schwelle am eigenen Material kalibrieren |
| `SKILL.md`, Schritt 7 | Stapelebene für Inhalt unter der Reise, Scrollweg, Schriften |
| `references/pipeline.md` §5c | Kalibriertes Nahtskript, stderr-Falle |
| `references/pipeline.md` §8 (neu) | Eine Etappe austauschen, Startbilder liefern |
| `references/gotchas.md` | Neun Symptome mit Ursache und Abhilfe |
| `references/scrub-engine.js` | Vier Code-Änderungen (siehe unten) |

**Die Engine kann jetzt vier Dinge mehr:** `copyTiming` (erkennt Architektur A selbst am
leeren `connectors`-Feld), `crossfade` je Section, `brand.logo`, und ein unbekannter
Bildschirm führt nicht mehr zur kleinen Fassung. Alles rückwärtskompatibel — bestehende
Konfigurationen mit Verbindungsclips verhalten sich unverändert.

**Diese Seite nutzt seitdem die unveränderte Skill-Engine**, keine Sonderfassung mehr. Das
war zugleich die Probe aufs Exempel: Wäre die Verallgemeinerung schlecht gewesen, hätte
das Projekt weiter einen eigenen Zweig gebraucht.

**Der Skill liegt nicht in einer Versionsverwaltung** (`~/.claude/skills/scroll-world/`
ist kein Repo und nicht nach `C:\Projekte\Claude-Skills\` gespiegelt). Vor dieser
Bearbeitung wurde deshalb eine Sicherung angelegt. Dauerhaft ist das eine Lücke: an einem
Werkzeug ohne Rückkehrpunkt zu arbeiten, ist genau das, was die Projektregeln sonst
verhindern.
