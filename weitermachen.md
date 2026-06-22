# Weitermachen — JGC Lumen Website

## Stand (diese Session)
- **Variante 13 „JGC Lumen"** erstellt (Basis: 09c-audit-ledger, Impeccable) und live deployed.
  Liegt unter `variants/standalone/13-lumen/index.html`, registriert in `manifest.json` + `VARIANTS.md`.
- Umgesetzt: Rename JGC Studio→Lumen (gesamte Seite); Hero-Unterstrich tiefer (`bottom -.12em → -.28em`)
  + Unterstrich-`<em>` auf `display:inline` (Schlusspunkt bricht nicht mehr um); Angebote Schritt 2 & 4
  dauerhaft aufgeklappt (Schritt 3 unverändert); CTA „60 → 30 Minuten"; „Demo-Workflow"-Link entfernt;
  bewegte Logo-Resonanz am CTA entfernt; „Ehrlich gesagt"-Spalten auf Card-Tiefe (Schatten/Radius/Ledger-Akzent).
- 3 Säulen-Symbole aus Variante 12 eingebaut, danach Kompass V2 + Netz V3 aus der **überarbeiteten** V12
  nachgezogen (Prüfsiegel unverändert). Commits `e7040a1` + `de148f0` auf `main`.
- Projekt-`CLAUDE.md` neu angelegt (Standalone-Varianten-Workflow dokumentiert).

## Offen
- V13 ist nur **Standalone-HTML** zur Galerie-Review — noch NICHT in die Haupt-`site/`-Astro-Quelle übernommen.
- Hero-Umbruch im mittleren Breitenband (~1280–1500 px): „das" rutscht auf eigene Zeile (3 Zeilen statt 2).
  Bei voller Review-Breite sauber. Optionaler Fix offen: Hero-Textspalte verbreitern
  (`site`/Variante: `xl:col-span-6 → xl:col-span-7`). Auf Zuruf, noch nicht gemacht.

## Nächste Schritte
1. JGC-Feedback zur Live-V13 abwarten (Galerie).
2. Falls gewünscht: Hero-„das"-Umbruch fixen (Textspalte verbreitern), erneut deployen.
3. Falls V13 final beschlossen: V13-Änderungen (Rename, Symbole, „Ehrlich gesagt", CTA) in die
   Astro-Komponenten unter `site/src/` übertragen, damit `main`-Hauptseite nachzieht.

## Stolperfallen / Workarounds (sofort wichtig)
- Standalone-Varianten = minifiziertes Single-File-HTML mit Inline-base64 → NICHT direkt editieren.
  base64 strippen für Lesekopie; Änderungen per assertion-guardetem **Node-Transform-Skript** (UTF-8).
- Preview einer Variante: `npm run dev` zeigt die Astro-`site/`, nicht die Variante. → kleiner
  Node-Static-Server auf eigenem Port (temporär in `.claude/launch.json`), danach entfernen.
- Preview-Screenshot timeoutet auf den 1-MB-Seiten; Animationen pausieren bei `hidden` Tab.
  → Verifikation via `preview_eval` (DOM-Geometrie / `getAnimations().finish()`), nicht Screenshot.
- Deploy = Push auf `main`; Variante immer in `manifest.json` UND `VARIANTS.md` registrieren.
