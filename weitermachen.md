# Weitermachen — JGC Lumen Website

## Stand (Session 2026-07-26 — zweite Fassung „Der Weg" gebaut, nicht deployt)
- **Die Seite gibt es jetzt zweimal:** die Lesefassung (V18, live) und **`/der-weg/`**, eine
  Scroll-Reise durch eine Papierwelt aus sieben Videoetappen. Beschreibung, Werkzeuge und
  Austauschweg stehen in `docs/der-weg.md` — hier bewusst keine zweite Fassung davon.
- **Nichts ist gepusht.** Neun Commits liegen auf `claude/jgc-lumen-website-variant-f82cc1`,
  die Live-Seite ist unverändert. Der Deploy wartet auf Gabriels Freigabe (Hub).
- **Neu im Repo:** `inhalt/lumen-inhalt.md` — der Text der Live-Seite in lesbarer Form,
  erzeugt aus dem 1,2-MB-Minifikat von V18. Vorher existierte er nirgends durchsuchbar.
- **Material:** 100 MB Rohvideos (außerhalb des Repos) → 52 MB auslieferbar im Repo.
  Vier von sechs Übergängen tragen, zwei springen und sind vorerst mit breiterer
  Überblendung kaschiert, nicht geheilt.
- **Neuer Befund V20:** Der Stilprobe-Ausschnitt auf der Hauptseite nennt sich „echt", trägt
  im Quelltext aber zweimal `PLATZHALTER Phase 6`. Beschreibung in `verbesserungen.md`.
- **Lessons in den Skill zurückgeflossen:** vier Engine-Verbesserungen plus Doku in
  `~/.claude/skills/scroll-world/`. `der-weg/scrub-engine.js` ist seitdem wieder eine
  unveränderte Kopie — diese Seite pflegt keine Sonderfassung.

## Offen (unfertig / wartet auf Zulieferung)
- **Impressum ist weiter leer (V3)** — braucht Gabriels Daten, liegt im Hub. Größter Blocker.
- **Formular und Badge der Stilprobe laufen weiter auf Fallbacks** — `senden.php` und
  `kontingent.php` existieren noch nicht. Kein Bug; der Fehlerpfad ist sichtbar.
- **Etappe 6 der Scroll-Reise zeigt ein generiertes Gesicht**, nicht Gabriel. Er liefert eine
  neue Fassung nach; Austausch ist ein Befehl (`docs/der-weg.md`).
- **Zwei Übergänge der Scroll-Reise springen** (werkzeug→schreibtisch, schreibtisch→stilprobe).
  Startbilder für die Neuerzeugung liegen bereit in `Scroll World\frames\`.
- **Die Scroll-Reise ist auf keinem echten Telefon geprüft** — nur gerechnet und im
  Vorschaufenster gemessen, das keine Animationen ausführt.
- Offene Befunde: **V3** · **V10** · **V13** · **V14** · **V18** · **V19** · **V20**.
- Offene Ideen: **I2** (V18 → Astro, löst V10 und V18 mit) · **I3** (Kosten-FAQ) ·
  **I4** (Wortmarke aufs Vorschaubild).

## Nächste Schritte (Claude)
1. **Der Weg veröffentlichen**, sobald Gabriel Texte und Seite freigibt: `git branch -f main HEAD`
   und pushen. Der Deploy-Workflow kopiert `der-weg/` bereits mit.
2. **Nachgeliefertes leg 6 einarbeiten:** `node scripts/der-weg/kodiere.mjs 6`, danach zwingend
   `node scripts/der-weg/pruefe-naehte.mjs` — ein Austausch berührt immer zwei Übergänge.
3. **Scroll-Reise auf einem echten Telefon prüfen** (Xiaomi): Datenlast messen, flüssiges
   Scrubben, iOS-Verhalten nicht anfassen.
4. Impressum-Daten einsetzen, sobald Gabriel sie liefert (V3) — letzter Launch-Blocker.
5. Repo `stilprobe-automatik`: `senden.php` und `kontingent.php` bauen → macht Formular und
   Badge scharf. Vertrag: `docs/stilprobe/schnittstelle.md`.
6. I3 (Kosten-FAQ): Wortlaut-Vorschlag schreiben und Gabriel vorlegen — Verkaufstext, nicht
   ohne sein Ok einsetzen.
7. V20 auflösen, sobald Gabriel entscheidet: echte Ausschnitte einsetzen oder den
   Echtheits-Satz umformulieren.
8. I2 einplanen (V18 → Astro), am besten zusammen mit dem All-Inkl-Umzug.
9. V19 und die Worktree-Bereinigung ausführen, sobald Gabriel freigibt (Kommandos unten).
10. **Die Variantenwahl bauen**, sobald Gabriel entschieden hat, wie sie aussehen soll. Der
    Umschalter auf der Reise wurde auf seinen Wunsch entfernt; die Verweise von V18 zur Reise
    (Navigation und Fußzeile) stehen noch.

## Stolperfallen (sofort wichtig)
- V18 = minifiziertes Single-File-HTML: nie direkt editieren; assertion-guardetes Transform-Skript
  (Vorbilder in `scripts/v18/`). Interne Links absolut (`/jgc-studio-website/…`), nie relativ.
- **Vor jedem Zugende `node scripts/pruefe-seiten.mjs`** (steckt in `pruefen.txt`). Ohne Argument
  prüft er die Repo-Quellen, mit `_site` das Deploy-Ergebnis — die Sollwerte unterscheiden sich.
  **Nur die Quellen zu prüfen reicht nicht:** die Varianten 01–09 entstehen erst im Build.
- **Browser-Preview: erst Viewport setzen, dann messen.** Ein frisch geöffneter Tab meldet 0×0,
  alle Geometriewerte sind dann Müll. `requestAnimationFrame` und IntersectionObserver laufen im
  versteckten Pane gar nicht, Screenshots laufen dort in einen Timeout — Scroll- und
  Reveal-Verhalten sind dort grundsätzlich nicht prüfbar, nur rechnerisch zu belegen.
- **Scroll-Reise lokal ansehen:** `node scripts/der-weg/server.mjs`, dann
  `http://localhost:4330/der-weg/`. Unter `file://` bleibt die Seite leer, die Engine lädt
  ihre Clips per fetch.
- Deploy = Push auf `main` (`main` in keinem Worktree → `git branch -f main HEAD`).
- Gabriels eigene Aufgaben liegen im **Hub, Karte „Website"** — nicht in einer Datei im Repo.

## Aufräumen — wartet auf Gabriels Freigabe
15 Worktrees. Die Branches `claude/sharp-herschel-f7c5e1` (V19) und
`claude/website-variant-18-homepage-c16a97` sind geprüft: beide enthalten nur alte Stände und
Löschungen, keine verlorene Arbeit. **Die neun `variant/*`-Branches müssen bleiben:** der
Deploy baut sie bei jedem Lauf, ein Löschen würde die Galerie beschädigen.

```
git worktree remove ".claude/worktrees/<name>"
git branch -d claude/<name>
```
