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
| **03** | `variant/03-pine-sage-monochrome` | V01-Layout vollständig erhalten — **nur Farben getauscht** auf monochromatische Pine-Sage-Palette nach „ziga"-Referenz. Dunkles Tannengrün als Anker, helles Pastell-Mint als Akzentblöcke, kein Kupfer-Ocker-Kontrast mehr. Buttons in mittlerem Pine-Grün. Resonanz-Animation in Sage-Tönen. | Pine Dark `#2C3E36`, Pine Medium `#3A574A`, Sage Mint `#B6CFB0`, Sage Teal `#86A89A`, Sage Beige `#D2D3BB`, Pergament `#FEFCF7` | Wie V01 | Live | [Desktop](variants/screenshots/03-desktop.png) · [Mobile](variants/screenshots/03-mobile.png) |
| **04** | `variant/04-editorial-portrait-cards` | V01-Farben erhalten — **Aufbau nach „Tina"-Referenz** umgebaut: Hero mit zentriertem Bild (4:5), riesiger Fraunces-Headline die das Bild oben überlappt, dunklem Pill-CTA mittig, zwei Floating-Cards (60-Min-Erstgespräch + Drei Wege) ragen aus den unteren Bildecken heraus. Neue persönliche Intro-Sektion „Hi. Ich bin Gabriel." mit Portrait-Platzhalter + Resonanz-Symbol als überlappender Kreis. Alle weiteren Sektionen identisch zu V01. | Wie V01 | Wie V01 (Headlines uppercase im Hero) | Live | [Desktop](variants/screenshots/04-desktop.png) · [Mobile](variants/screenshots/04-mobile.png) |
| **05** | `variant/05-editorial-warm` | **Editorial-warm nach DESIGN.md (V5)** — komplette Neugestaltung mit Magazin-Anmutung. Neue Schrift-Paarung, verschobene Palette in Richtung Papier/Erdton, große italic Display-Schnitte als Hauptmotiv, kleine Roman-Numerale (i. ii. iii. …) als Sektions-Marker, Säulen mit I/II/III statt Liniensymbolen, Karten mit großen Display-Zahlen, A/B-Numerale im Vorher-Nachher, „Kolophon"-Footer, Buttons kantig (Radius 2px) statt Pill. IntersectionObserver-Scroll-Reveals (800ms cubic-bezier), `prefers-reduced-motion` respektiert. Alte Resonanz-Komponenten gelöscht. | Ink `#1B2837`, Cream `#FBF6EB`, Charcoal `#2A2A2A`, Terracotta `#B5673A`, Sage `#94A493`, Marine `#5C8E9F`, Linen `#DDCCB1` | **Newsreader** (Display, OFL) + **Manrope** (Body, OFL) — self-hosted via `@fontsource-variable` | Live | [Desktop](variants/screenshots/05-desktop.png) · [Mobile](variants/screenshots/05-mobile.png) |
| **06** | `variant/06-editorial-luxury-polished` | **Editorial Luxury, alle drei Skills angewendet** (Taste / Emil Kowalski / Impeccable). Asymmetric Bento bei Drei Angebote (mittlere Karte deutlich größer, 3/6/3-Grid statt identischem 3er-Grid). Editorial Split im Hero (7/12 Typo + 5/12 Foto). Pill-Buttons mit Button-in-Button trailing icon und `:active scale(0.97)`. Custom cubic-beziers überall (`cubic-bezier(0.23, 1, 0.32, 1)`). Dezenter Film-Grain-Overlay über Fixed-Pseudo-Element (2.5 % Opacity). Reveal-Strategie: default sichtbar, nur Below-the-fold via `data-pending` versteckt (robuste Screenshots ohne Black-Pages). | OKLCH-Werte: Ink `oklch(0.27 0.04 248)`, Cream `oklch(0.97 0.018 78)`, Terracotta `oklch(0.62 0.135 52)`, Sage `oklch(0.72 0.04 145)`, Marine `oklch(0.62 0.07 220)`, Linen `oklch(0.87 0.02 78)` — tinted Neutrals zur warmen Erde | **Instrument Serif** (Display, OFL, Italic-fokussiert) + **Geist** (Body, OFL, Vercel Grotesk) — beide self-hosted | Live | [Desktop](variants/screenshots/06-desktop.png) · [Mobile](variants/screenshots/06-mobile.png) |

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
