# JGC Lumen Website

Sales-Page für JGC Lumen — KI-Implementierung für Coaches, Trainer und
Mentoren (Freiburg/DACH). Marke seit Variante 13 „JGC Lumen"; das Repo
heißt historisch weiter `jgc-studio-website`.

## Struktur

```
.
├── site/                          # Astro-Quelle, deployt nach /main/
│                                     (Startseite, Impressum, Datenschutz)
├── variants/standalone/<slug>/    # Eingefrorene Single-File-Design-Varianten
│   └── manifest.json              # Register; "homepage": true markiert die
│                                     Live-Hauptseite (aktuell 18-lumen)
├── stilprobe/                     # Eigenständige Unterseite "Die Stilprobe",
│                                     deployt nach /stilprobe/
├── docs/stilprobe/                # Konzept, Knoten-Graph, Schnittstellen-Vertrag
├── scripts/                       # Galerie-Generator, Homepage-Kopie,
│                                     Stilprobe-Transform/-Extract
├── VARIANTS.md                    # Registry aller Design-Varianten
├── CHANGELOG.md                   # Änderungshistorie (seit 2026-07-11)
├── weitermachen.md                # Sessionstand für Multi-Session-Arbeit
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

## Deploy

Push auf `main` löst die GitHub Action `.github/workflows/deploy.yml` aus,
die auf GitHub Pages deployt:

- die Astro-`site/` nach `/main/`,
- alle Standalone-Varianten aus `variants/standalone/` nach `/variants/<slug>/`,
- eine generierte Galerie (`scripts/generate-gallery.mjs`) nach `/galerie/`,
- die im Manifest als `"homepage": true` markierte Variante als Root-`index.html`
  (`scripts/copy-homepage.mjs`),
- `stilprobe/index.html` nach `/stilprobe/`.

Live-URL: https://jgc-coding.github.io/jgc-studio-website/

## Arbeiten im Repo

- [CLAUDE.md](./CLAUDE.md) — Konventionen und Stolperfallen, insbesondere:
  minifizierte Single-File-HTML-Varianten nie direkt editieren/lesen.
- [VARIANTS.md](./VARIANTS.md) — Register aller Standalone-Varianten.
- [CHANGELOG.md](./CHANGELOG.md) — Änderungshistorie seit 2026-07-11.
- [weitermachen.md](./weitermachen.md) — aktueller Sessionstand.
