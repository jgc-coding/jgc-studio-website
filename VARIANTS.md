# Design-Varianten — JGC Studio Website

Dieses Dokument listet alle erkundeten Design-Richtungen für die Sales-Page.
Jede Variante lebt auf einem eigenen Git-Branch — keine geht verloren.

## Wie damit arbeiten

```powershell
# Alle Varianten auflisten
git branch --list "variant/*"

# Zu einer Variante wechseln (Astro lädt automatisch neu)
git switch variant/01-briefing-v5-naturwarm-restraint

# Eine neue Variante von der aktuellen aus starten
git switch -c variant/02-mein-name

# Nur die Farben aus V02 in die aktuelle Variante übernehmen
git checkout variant/02-mein-name -- site/tailwind.config.mjs site/src/styles/global.css

# Nur den Hero aus V03 übernehmen
git checkout variant/03-mein-name -- site/src/components/Hero.astro
```

`main` enthält jeweils die "aktuell beschlossene" Version. Variant-Branches
sind eingefrorene Snapshots, die du jederzeit zurückholen kannst.

---

## Variantenregister

| Nr. | Branch | Charakter | Farbpalette | Typografie | Stand | Screenshots |
|---|---|---|---|---|---|---|
| **01** | `variant/01-briefing-v5-naturwarm-restraint` | Ruhig, präzise, warme Naturtöne. Strikte Umsetzung des Briefings v5. Pergament-Hintergrund, Salbei-Akzentblöcke, Kupfer-Ocker als Wirkungsakzent. Layout-Brüche (3×) und Resonanz-Motiv-Auftritte (5×) wie spezifiziert. | Tinte-Tiefblau `#1F2A44`, Pergament `#FEFCF7`, Anthrazit `#2D2D2D`, Kupfer-Ocker `#C97B3F`, Salbei `#8FA98A`, Quellwasser `#6FA3B5`, Holzsand `#D9C7A8` | Fraunces (Display) + Inter (Body) | Live | [Desktop](variants/screenshots/01-desktop.png) · [Mobile](variants/screenshots/01-mobile.png) |
| **02** | `variant/02-cinematic-hero-overlay` | Wie V01 — **nur Hero anders**: Cinematic Full-Bleed. Foto füllt die ganze Hero-Sektion, Text liegt links auf einem Tinte-Tiefblau-Gradient der nach rechts transparent ausblendet. Text in Pergament (hell) statt Tinte. Resonanz-Animation wandert in die untere rechte Ecke. Layout-Bruch in den Salbei-Block fällt weg. Alle weiteren Sektionen identisch zu V01. | Wie V01, Gradient: Tinte-Tiefblau `#1F2A44` mit 86 % Opacity links, fade auf 0 % nach rechts | Wie V01 | Live | [Desktop](variants/screenshots/02-desktop.png) · [Mobile](variants/screenshots/02-mobile.png) |

---

## Naming-Konvention

`variant/NN-kurzname-mit-charakter`

- `NN` = chronologische zweistellige Nummer (01, 02, 03, …)
- `kurzname-mit-charakter` = was die Variante ausmacht
  (`02-editorial-magazin`, `03-dark-studio`, `04-mineral-bauhaus`, …)

## Cherry-Picking-Spickzettel

```powershell
# Aus einer anderen Variante übernehmen
git checkout variant/XX-name -- <pfad-zu-datei-oder-ordner>

# Beispiele
git checkout variant/02 -- site/src/components/Hero.astro
git checkout variant/02 -- site/src/styles/global.css site/tailwind.config.mjs
git checkout variant/02 -- site/src/components/  # alle Komponenten

# Danach: prüfen, was sich geändert hat
git status

# Committen
git commit -am "Übernehme Hero aus V02"
```
