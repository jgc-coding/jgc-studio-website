# JGC Studio — Sales-Page

KI-Beratung für Coaches, Trainer und Mentoren. Umsetzung der Sales-Page nach
Briefing v5 (Mai 2026).

## Projektstruktur

```
.
├── site/                          # Astro + Tailwind Projekt (die Website)
│   ├── src/                       # Komponenten, Layouts, Pages, Styles
│   ├── public/                    # Statische Assets (Bilder, Favicon)
│   └── package.json
├── variants/screenshots/          # Desktop + Mobile Captures pro Variante
├── Bildmaterial/                  # Source-Bilder (Hero-Platzhalter etc.)
├── Logo/                          # Logo-Dateien (PNG, SVG, PDF)
├── Inspiration/                   # Visuelle Referenzen
├── VARIANTS.md                    # Registry aller Design-Varianten
└── README.md                      # Diese Datei
```

## Lokal entwickeln

```powershell
cd site
npm install        # nur beim ersten Mal
npm run dev        # → http://localhost:4321
```

## Build (statisches Output)

```powershell
cd site
npm run build      # erzeugt site/dist/
npm run preview    # lokale Vorschau des Builds
```

## Design-Varianten

Jede Variante lebt auf einem eigenen Git-Branch (`variant/NN-name`).
Details, Charakter, Farbpalette und Screenshots in
[VARIANTS.md](./VARIANTS.md).

```powershell
git branch --list "variant/*"           # alle Varianten auflisten
git switch variant/01-...               # zu einer Variante wechseln
```

## Deployment — Vercel

Die Website wird auf Vercel deployed. **Wichtig beim Import:**

- **Root Directory:** `site`  (nicht der Repo-Root!)
- **Framework Preset:** Astro (wird automatisch erkannt, sobald Root Directory gesetzt ist)
- **Build Command:** `npm run build` (Vercel-Default für Astro, nicht ändern)
- **Output Directory:** `dist` (Vercel-Default, nicht ändern)

Jeder Push auf einen `variant/*`-Branch erhält automatisch eine eigene
Preview-URL. Pushes auf `main` deployen die Production-URL.
