# Weitermachen — JGC Lumen Website

## Stand (29.08.2026 — Gabriels Portrait steht in der Reise, live)
Die Scroll-Reise zeigte keinen Menschen. Gabriel wollte sein Foto in eine Papierwelt-Etappe
einmontieren (leg 6, Staffelei) und hat es auch mit fremder Hilfe nicht sauber freigestellt.
Statt weiter am Video zu arbeiten, steht das Bild jetzt dort, wo ohnehin jemand nach der
Person sucht: als Erstes im „Mehr dazu"-Feld der Station **Über mich** (`lichtung`).
- **Neuer Kopfblock `div.vertiefung-kopf`** — links das Portrait, rechts Augenzeile,
  Überschrift und Vorstellung. Nur in dieser Station, ohne JavaScript, trägt im Feld wie im
  No-JS-Lesefluss. Bilddatei `der-weg/assets/portrait-gabriel.webp` (720 × 960, 41 KB),
  byte-identische Kopie von `Bildmaterial/Profilbild/profil-halbfigur-web.webp` — dieselbe
  Aufnahme, die V18 eingebettet zeigt.
- **Drei Maße, gemessen:** bis 559 px Bild über dem Text (`min(56%, 200px)`, auf 393 × 852
  sind das 180 × 240), ab 560 px daneben mit 168 × 224, ab 900 px mit 200 × 267. Umbruch bei
  560, weil darunter die Textspalte unter 200 px fällt und die Überschrift vierzeilig bricht.
- **Kostet nur 89 px Feldhöhe** (Bild 267 hoch, Text daneben 166 — gezahlt wird die Differenz).
  Geprüft auf 320/393/559/560/768/1024/1440 px; Deploy auf `31ef6d5` grün, Live-Bytes und
  Bild-Abruf gegengeprüft.
- **Auf der Staffelei im Video steht weiter ein generiertes Gesicht.** Bewusst so gelassen —
  der Hub-Punkt „neues leg 6 liefern" ist abgehakt, weil der Weg aufgegeben wurde, nicht weil
  das Video getauscht wurde.
- Nebenbei: **Screenshots im Preview-Pane funktionieren wieder** (siehe Stolperfallen), und
  **V19 ist gegenstandslos** — der Branch `claude/sharp-herschel-f7c5e1` existiert nirgends mehr.

## Offen (unfertig / wartet auf Zulieferung)
- **Impressum ist weiter leer (V3)** — braucht Gabriels Daten, liegt im Hub. Größter Blocker.
  Daran hängt auch der **Datenschutz-Absatz zu den zwei neuen Formularen**.
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
- Offene Befunde: **V3** · **V10** · **V13** · **V14** · **V18** · **V20** · **V34** · **V47**.
- Offene Ideen: **I2** (V18 → Astro, löst V10 und V18 mit) · **I3** (Kosten-FAQ) ·
  **I4** (Wortmarke aufs Vorschaubild).

## Nächste Schritte (Claude)
1. **Die Reise zur Hauptseite machen**, sobald Gabriel freigibt: `robots` auf `index, follow`,
   `scripts/copy-homepage.mjs` bzw. Manifest, `canonical`, und entscheiden, was mit `/main/`
   und der Lesefassung passiert. Die Reise ist dafür bereit — sie kann Stilprobe und
   Erstgespräch selbst entgegennehmen, und ihr Tempo ist am Gerät abgenommen.
2. **V34 umsetzen**, sobald über die Lesefassung entschieden ist — Wortlaut steht (V32),
   V18 braucht ein Transform-Skript, danach `inhalt/lumen-inhalt.md` neu erzeugen.
3. **In den `scroll-world`-Skill zurückgeben** — Liste in `docs/der-weg.md`, Abschnitt „Offen";
   dazugekommen sind „Formular-Overlay: verschieben statt klonen, kein Scroll-Schließen" und
   **„`scroll` braucht die Bildanzahl, sobald Clips unterschiedlich lang sind"**. In einem
   Rutsch, wenn die Seite steht.
4. Impressum-Daten einsetzen, sobald Gabriel sie liefert (V3) — letzter Launch-Blocker; im
   selben Zug den Datenschutz-Absatz zu den zwei Formularen schreiben.
5. Repo `stilprobe-automatik`: `senden.php` und `kontingent.php` bauen, **plus ein zweites
   `senden.php` für `/erstgespraech/`** — macht alle drei Strecken scharf. Verträge:
   `docs/stilprobe/schnittstelle.md` und `docs/erstgespraech/schnittstelle.md`.
6. I3 (Kosten-FAQ): Wortlaut-Vorschlag schreiben und vorlegen — nicht ohne Ok einsetzen.
7. V20 auflösen, sobald Gabriel entscheidet: echte Ausschnitte oder Satz umformulieren.
8. V47 nur anfassen, wenn Gabriel es ausdrücklich will — 5 px auf schmalen Telefonen.
9. I2 einplanen (V18 → Astro), am besten zusammen mit dem All-Inkl-Umzug.
10. **Videos neu komprimieren** — jetzt 14,6 MB für sieben Handy-Clips, mit modernerer
    Kompression plausibel halbierbar. Bisher bewusst ausgeklammert.

## Stolperfallen (sofort wichtig)
- **Etappe 3 und 4 stammen aus EINER Rohdatei.** `teile-verbunden.mjs` zerlegt sie bei Bild 121;
  wer eine der beiden ersetzt, muss beide zusammen denken. Die alten Einzeldateien liegen unter
  `Scroll World\legs\vor-schnitt-2026-08-28\`.
- **`scroll` je Etappe ist eine Rechnung:** `Bilder × Bildbewegung / 1555,6`, Boden 0,85.
  Die alte Kurzform ohne Bildanzahl gilt nur bei gleich langen Clips — das ist vorbei.
- **Texte der Reise stehen an DREI Orten** in `der-weg/index.html` (Konfiguration `sections`,
  SEO-Spiegel `data-sw-seo`, Vertiefungs-Artikel) — alle drei zusammen ändern. Danach die
  Stationshöhen hochkant nachmessen. Ein Bild ist kein Text: der Kopfblock in „Über mich" steht
  nur im Vertiefungs-Artikel, der SEO-Spiegel bleibt davon unberührt.
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
- **Preview-Pane: Screenshots gehen wieder** (29.08.2026 nachgeprüft), obwohl die Seite sich
  weiter als versteckt meldet. Für Maße und Zustände gilt unverändert: Beweis über
  DOM-Geometrie, erst Viewport setzen, dann `resize` bzw. `orientationchange` selbst auslösen,
  CSS-Übergänge vor jeder Messung abschalten (auch `transform` — sonst misst man das Feld an
  seiner Startposition). **Die Bild-Schleife der Engine läuft dort gar nicht** — für Messungen
  an `video.currentTime` `requestAnimationFrame` durch einen synchronen Ersatz tauschen, der
  den Rückruf **merkt**, eine zweite Engine-Instanz mounten und deren Schleife von Hand takten;
  zwischen den Takten `await`. Verfahren steht in `docs/der-weg.md`.
- **Commit-Messages IMMER als Datei + `git commit -F`** — ein Here-String nach `;` in einer
  Befehlskette wird nicht als Here-String geparst, git staged dann gar nichts.
- V18 = minifiziertes Single-File-HTML: nie direkt editieren; Transform-Skript mit Assertions.
  Interne Links absolut (`/jgc-studio-website/…`).
- **Vor jedem Zugende `node scripts/pruefe-seiten.mjs`** (steckt in `pruefen.txt`).
- **Scroll-Reise lokal ansehen:** `node scripts/der-weg/server.mjs` aus einem Arbeits-Worktree
  (der Hauptordner steht auf `variant/09` und hat kein `der-weg/`), Port 4330.
- Deploy = Push auf `main` (`main` in keinem Worktree → `git branch -f main HEAD`).
- Gabriels eigene Aufgaben liegen im **Hub, Karte „Website"** — nicht in einer Datei im Repo.

## Aufräumen — Stand 29.08.2026
Erledigt: Der gemergte Altbranch `claude/background-video-cut-revision-bec6e7` ist gelöscht
(war vollständig in `main`). Der leere Ordner `website-improvements-review-e4c50f` ist von
selbst verschwunden, wie erwartet. Auf `origin` liegt **kein** `claude/*`-Branch.

Ungemergt sind nur die neun `variant/*`-Branches, und **die müssen bleiben** — der Deploy baut
aus ihnen die Galerie-Varianten.

Nach dem Ende DIESER Sitzung noch offen (Worktree und Branch, in denen sie lief):
```
git worktree remove ".claude/worktrees/background-video-cut-revision-bec6e7"
git branch -d claude/profile-image-about-section-be7bee
```

**Zwei Lehren aus früheren Kassenstürzen, beide weiter gültig:** `git worktree remove` kann
unter Windows am leeren Ordner mit „Permission denied" scheitern, wenn ein anderer Prozess ihn
als Arbeitsverzeichnis hält — das Git-Register ist danach trotzdem sauber, der Ordner
verschwindet mit dem Prozess. Und `git branch --no-merged` zeigt nur die ungemergten; die
gemergten Altbranches stehen dort nie. Einmal `git branch --list "claude/*"` zählen.
