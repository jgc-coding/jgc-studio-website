# Weitermachen — JGC Lumen Website

## Stand (28.08.2026 — die gebrochene Naht 3 → 4 ist repariert, live)
Gabriel hat den Bogen zwischen „Was sich wirklich ändert" und „Lies dich selbst" neu
gerendert, als **ein** durchgehendes Video. Das war die letzte Naht, die sich nicht durch
Schneiden retten ließ. Umgesetzt, gemessen, deployt (Lauf auf `cf852d9` grün, Live-Bytes
gegengeprüft).
- **Neues Werkzeug `scripts/der-weg/teile-verbunden.mjs`** bringt den Clip auf das Format
  der übrigen fünf Etappen (1112 × 834, 24 Bilder/s) und teilt ihn bei Bild 121. Das
  Teilungsbild kommt aus der Bewegungsmessung: dort steht die Kamera am ruhigsten, und ab
  Bild 134 beginnt der Stift zu schreiben. Alle Schritte gegen Sollwerte abgesichert.
- **Naht `schreibtisch → stilprobe` von 0,281 (SPRUNG) auf 0,905 / Verhältnis 1,12.**
  Nebengewinn: `stilprobe → weg` von 0,620 auf 0,821, weil zwei Bilder Nachlauf abfallen,
  die über den Anschlusspunkt hinausfahren. `werkzeug → schreibtisch` bleibt ein Sprung —
  dieses Material hat Gabriel nicht angefasst.
- **Scrollweg-Formel um die Bildanzahl erweitert**: `Bilder × Bildbewegung / 1555,6`.
  Bisher kürzte sie sich heraus, weil alle Clips 193 Bilder hatten. Gegenprobe: die fünf
  unveränderten Etappen ergeben damit exakt ihre alten Werte. Neu 0,96 und 0,89, Reise
  7,20 → 6,90 Bildschirmhöhen (4 % kürzer, Folge des Schnitts).
- `crossfade: 0.38` auf `stilprobe` entfernt (hing an der gebrochenen Naht). Assets 52 → 46 MB.
  Alte Rohdateien liegen unter `Scroll World\legs\vor-schnitt-2026-08-28\`.

**Gabriels Gerätetest ist durch — „alles super" (28.08.2026).** Er deckt vier Runden auf einmal
ab: V48–V50, den Scrub-Umbau V51–V53, V54–V58 und den neuen Übergang. Damit sind alle
Tempo- und Layout-Stellschrauben der Reise **bestätigt**: Boden 0,85, Zeitkonstante 85 ms,
`--weg-textzone` 365/350/345/325, die Ausblendung mit 14svh und das Teilungsbild 121. Wer
daran dreht, dreht an etwas, das der Nutzer abgenommen hat — nur mit Anlass und Messung.

## Offen (unfertig / wartet auf Zulieferung)
- **Impressum ist weiter leer (V3)** — braucht Gabriels Daten, liegt im Hub. Größter Blocker.
  Daran hängt auch der **Datenschutz-Absatz zu den zwei neuen Formularen**.
- **Ein Clip kommt noch von Gabriel:** leg 6 mit seinem eigenen Porträt (auf der Staffelei
  steht ein generiertes Gesicht).
- **V47 ist stark geschrumpft, nicht erledigt.** Unter 362/380 px stapeln die Knöpfe weiter;
  Gewinn dort rund 5 px. Korrigierte Fassung in `verbesserungen.md`.
- **Zwei Wortlaut-Fragen im Hub:** der Chip „Deine Daten DSGVO-konform" auf der ersten Szene —
  und ob der v2-Auftaktsatz wieder pauschal „DSGVO-konform" sagen soll.
- **Im Hub: soll die weiche Ausblendung des Videos ins Pergament kürzer werden?** 14svh
  (~98 px am Telefon); kürzer = ~28 px mehr klares Bild, ändert die Naht. Bewusst unangetastet.
- **V34 offen:** die DSGVO-Sprachregelung fehlt in Lesefassung V18 und auf der Datenschutzseite.
  Hängt an der Hub-Frage, ob die Lesefassung bleibt.
- **Alle drei Formularstrecken laufen auf Fallbacks** — `stilprobe/senden.php`,
  `kontingent.php` und `erstgespraech/senden.php` existieren noch nicht. Kein Bug, der
  Fehlerpfad mit Mailweg ist der gebaute Normalfall. Ob `stilprobe@jgc-lumen.de` überhaupt
  empfängt, ist ungeprüft (im Hub).
- **`der-weg/scrub-engine.js` ist eine Sonderfassung** (V51–V53 inklusive). Zusatzliste in
  `docs/der-weg.md`; ein Update aus dem Skill würde sie überschreiben.
- Offene Befunde: **V3** · **V10** · **V13** · **V14** · **V18** · **V19** · **V20** ·
  **V34** · **V47**.
- Offene Ideen: **I2** (V18 → Astro, löst V10 und V18 mit) · **I3** (Kosten-FAQ) ·
  **I4** (Wortmarke aufs Vorschaubild).

## Nächste Schritte (Claude)
1. **Leg 6 einarbeiten**, sobald es da ist: `node scripts/der-weg/kodiere.mjs 6` → zwingend
   `pruefe-naehte.mjs` → Bildbewegung messen und `scroll` nachrechnen (Formel unten);
   `kodiere.mjs` warnt selbst bei fps ≠ 24.
2. **Die Reise zur Hauptseite machen**, sobald Gabriel freigibt: `robots` auf `index, follow`,
   `scripts/copy-homepage.mjs` bzw. Manifest, `canonical`, und entscheiden, was mit `/main/`
   und der Lesefassung passiert. Die Reise ist dafür bereit — sie kann Stilprobe und
   Erstgespräch selbst entgegennehmen, und ihr Tempo ist am Gerät abgenommen.
3. **V34 umsetzen**, sobald über die Lesefassung entschieden ist — Wortlaut steht (V32),
   V18 braucht ein Transform-Skript, danach `inhalt/lumen-inhalt.md` neu erzeugen.
4. **In den `scroll-world`-Skill zurückgeben** — Liste in `docs/der-weg.md`, Abschnitt „Offen";
   dazugekommen sind „Formular-Overlay: verschieben statt klonen, kein Scroll-Schließen" und
   **„`scroll` braucht die Bildanzahl, sobald Clips unterschiedlich lang sind"**. In einem
   Rutsch, wenn die Seite steht.
5. Impressum-Daten einsetzen, sobald Gabriel sie liefert (V3) — letzter Launch-Blocker; im
   selben Zug den Datenschutz-Absatz zu den zwei Formularen schreiben.
6. Repo `stilprobe-automatik`: `senden.php` und `kontingent.php` bauen, **plus ein zweites
   `senden.php` für `/erstgespraech/`** — macht alle drei Strecken scharf. Verträge:
   `docs/stilprobe/schnittstelle.md` und `docs/erstgespraech/schnittstelle.md`.
7. I3 (Kosten-FAQ): Wortlaut-Vorschlag schreiben und vorlegen — nicht ohne Ok einsetzen.
8. V20 auflösen, sobald Gabriel entscheidet: echte Ausschnitte oder Satz umformulieren.
9. V47 nur anfassen, wenn Gabriel es ausdrücklich will — 5 px auf schmalen Telefonen.
10. I2 einplanen (V18 → Astro), am besten zusammen mit dem All-Inkl-Umzug.
11. V19 ausführen, sobald Gabriel freigibt.
12. **Videos neu komprimieren** — jetzt 14,6 MB für sieben Handy-Clips, mit modernerer
    Kompression plausibel halbierbar. Bisher bewusst ausgeklammert.

## Stolperfallen (sofort wichtig)
- **Etappe 3 und 4 stammen aus EINER Rohdatei.** `teile-verbunden.mjs` zerlegt sie bei Bild 121;
  wer eine der beiden ersetzt, muss beide zusammen denken. Die alten Einzeldateien liegen unter
  `Scroll World\legs\vor-schnitt-2026-08-28\`.
- **`scroll` je Etappe ist eine Rechnung:** `Bilder × Bildbewegung / 1555,6`, Boden 0,85.
  Die alte Kurzform ohne Bildanzahl gilt nur bei gleich langen Clips — das ist vorbei.
- **Texte der Reise stehen an DREI Orten** in `der-weg/index.html` (Konfiguration `sections`,
  SEO-Spiegel `data-sw-seo`, Vertiefungs-Artikel) — alle drei zusammen ändern. Danach die
  Stationshöhen hochkant nachmessen.
- **Die zwei Formular-Overlays folgen anderen Regeln als die Lesefelder:** Original-Knoten
  verschieben (nicht klonen), kein Schließen durch Scrollen. Wer `vertiefung.js` anfasst, darf
  das nicht „vereinheitlichen" — Begründung im Kopfkommentar von `der-weg/formulare.js`.
- **`--weg-textzone` steht auf 365/350/345/325** (vier Stellen, Breite × Höhe). Die Grenzen
  365/385 px hängen an der Breite der zwei Schluss-Knöpfe — **wer deren Beschriftung ändert,
  misst neu.**
- **`clipFps: 24` ist EINE Zahl für alle sieben Clips** — ein Rohvideo mit anderer Bildrate
  muss vor dem Kodieren umgerechnet werden, nicht die Engine angepasst. `kodiere.mjs` warnt.
- **`linger` und Sprungziel nur mit `copyTiming` zusammen denken** — die Verwechslung hat
  zweimal zugeschlagen (V38, V48).
- **Nicht jeder Leerraum unter dem Text ist ein Fehler** — ~60 px sind die `svh`-Reserve für
  die einfahrende Adressleiste. Bewusste Wahl.
- **Zwei Verläufe an einer Naht müssen sich überlappen** (V37, V39, V43/V44) — „Die Schürze".
- **Preview-Pane: Screenshots gehen gar nicht**, Beweise über DOM-Geometrie; erst Viewport
  setzen, dann `resize` bzw. `orientationchange` selbst auslösen. **Die Bild-Schleife der Engine
  läuft dort gar nicht** — für Messungen an `video.currentTime` `requestAnimationFrame` durch
  einen synchronen Ersatz tauschen, der den Rückruf **merkt**, eine zweite Engine-Instanz
  mounten und deren Schleife von Hand takten; zwischen den Takten `await`, sonst bleibt
  `video.seeking` dauerhaft true. Verfahren steht in `docs/der-weg.md`.
- **Commit-Messages IMMER als Datei + `git commit -F`** — ein Here-String nach `;` in einer
  Befehlskette wird nicht als Here-String geparst, git staged dann gar nichts.
- V18 = minifiziertes Single-File-HTML: nie direkt editieren; Transform-Skript mit Assertions.
  Interne Links absolut (`/jgc-studio-website/…`).
- **Vor jedem Zugende `node scripts/pruefe-seiten.mjs`** (steckt in `pruefen.txt`).
- **Scroll-Reise lokal ansehen:** `node scripts/der-weg/server.mjs` aus einem Arbeits-Worktree
  (der Hauptordner steht auf `variant/09` und hat kein `der-weg/`), Port 4330.
- Deploy = Push auf `main` (`main` in keinem Worktree → `git branch -f main HEAD`).
- Gabriels eigene Aufgaben liegen im **Hub, Karte „Website"** — nicht in einer Datei im Repo.

## Aufräumen — am 28.08.2026 erledigt (Gabriels Freigabe)
Der Rest aus der 26.08.-Runde ist weg: Worktree `website-improvements-review-e4c50f` entfernt,
Branch `claude/jgc-lumen-website-updates-0552a3` lokal und auf `origin` gelöscht (vorher
dreifach geprüft: keine ungesicherten Änderungen, nichts Unversioniertes, `git log main..`
leer). Auf `origin` liegt danach **kein** `claude/*`-Branch mehr.

Ungemergt sind nur die neun `variant/*`-Branches, und **die müssen bleiben** — der Deploy baut
aus ihnen die Galerie-Varianten.

Nach dem Ende DIESER Sitzung noch offen:
```
git worktree remove ".claude/worktrees/background-video-cut-revision-bec6e7"
git branch -d claude/background-video-cut-revision-bec6e7
```

**Windows-Fall aus dieser Runde:** `git worktree remove` löschte den Inhalt, scheiterte aber
mit „Permission denied" am leeren Ordner selbst — ein anderer Prozess hatte ihn als
Arbeitsverzeichnis (wahrscheinlich eine noch laufende Claude-Sitzung). Das Git-Register war
danach trotzdem sauber, `git worktree prune` fand nichts zu tun, und Branch-Löschen ging
normal. **Der leere Ordner `.claude/worktrees/website-improvements-review-e4c50f` liegt noch
da** und verschwindet, sobald der haltende Prozess endet — beim nächsten Kassensturz einfach
`Remove-Item` versuchen. Kein Grund, fremde Sitzungen abzuschießen.

**Lehre vom letzten Kassensturz:** `git branch --no-merged` zeigt nur die ungemergten — die
gemergten Altbranches stehen dort nie und bleiben unbemerkt liegen. Einmal
`git branch --list "claude/*"` zählen, nicht nur die Ungemergten.
