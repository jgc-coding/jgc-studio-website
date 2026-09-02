# JGC Lumen Website

Website von JGC Lumen — KI-Implementierung für Coaches, Trainer und Mentoren
(Freiburg/DACH). Live unter https://jgc-lumen.de/ (GitHub Pages mit eigener
Domain). Marke seit Variante 13 „JGC Lumen"; das Repo heißt historisch weiter
`jgc-studio-website`.

## Struktur

```
.
├── der-weg/                   # Die Seite: Scroll-Reise (index.html, drei Skripte,
│                                 assets/) — liegt im Deploy an der Wurzel
├── stilprobe/                 # Unterseite „Die Stilprobe" (Single-File-HTML) → /stilprobe/
├── impressum/, datenschutz/   # Rechtsseiten im Design der Reise
├── deploy/                    # Weiterleitung /der-weg/ → /
├── scripts/deploy/            # baue-site.mjs: setzt _site/ zusammen (Workflow und lokal)
├── scripts/pruefe-seiten.mjs  # Qualitätsprüfung (Repo-Quellen oder _site)
├── scripts/der-weg/           # Werkzeuge der Reise (Kodieren, Nähte, Favicon, Vorschau-Server)
├── docs/                      # der-weg.md, Stilprobe- und Erstgespräch-Verträge
├── variants/, site/, inhalt/  # Archiv: alte Varianten (V18 = frühere Lesefassung), Astro-Quelle
├── CHANGELOG.md               # Änderungshistorie (seit 2026-07-11)
├── verbesserungen.md          # Offene und erledigte Befunde
├── weitermachen.md            # Sessionstand für Multi-Session-Arbeit
└── README.md                  # Diese Datei
```

## Lokal ansehen

```powershell
node scripts/der-weg/server.mjs             # http://localhost:4330/ — Repo-Stand, Reise an der Wurzel
node scripts/deploy/baue-site.mjs _site     # Deploy-Ergebnis zusammensetzen
node scripts/der-weg/server.mjs 4331 _site  # http://localhost:4331/ — genau das Deploy-Ergebnis
node scripts/pruefe-seiten.mjs              # Prüfung der Quellen; mit `_site` das Ergebnis
```

Die Reise braucht zwingend einen Server: unter `file://` verbietet der Browser
das Laden der Clips.

## Deploy

Push auf `main` löst `.github/workflows/deploy.yml` aus: `baue-site.mjs` setzt
`_site/` zusammen (Reise an der Wurzel, Stilprobe, Rechtsseiten, Vorschaubild,
Weiterleitung, robots.txt, Sitemap), `pruefe-seiten.mjs _site` prüft das
Ergebnis, dann geht es auf GitHub Pages. Die Domain `jgc-lumen.de` ist in den
Pages-Einstellungen des Repos eingetragen, DNS liegt bei All-Inkl.

## Arbeiten im Repo

- [CLAUDE.md](./CLAUDE.md) — Konventionen und Stolperfallen.
- [docs/der-weg.md](./docs/der-weg.md) — die Reise: Etappen, Maße, Austauschweg.
- [CHANGELOG.md](./CHANGELOG.md) — Änderungshistorie seit 2026-07-11.
- [verbesserungen.md](./verbesserungen.md) — offene und erledigte Befunde.
- [weitermachen.md](./weitermachen.md) — aktueller Sessionstand.
