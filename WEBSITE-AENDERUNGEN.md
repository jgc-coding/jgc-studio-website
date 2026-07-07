# JGC Lumen – Website-Änderungen

> **Stand: 07.07.2026.** Ersetzt die Liste vom 27.06.2026. Jeder Punkt wurde gegen den Code von
> **Variante 18** (`variants/standalone/18-lumen/index.html`) und die Live-Seite geprüft —
> Status ist also verifiziert, nicht übernommen.
> Live: https://jgc-coding.github.io/jgc-studio-website/variants/18-lumen/
>
> Prüfmethode: Lesekopie (base64 gestrippt) vollständig gelesen, Live-Links per Abruf getestet,
> Smoke-Test über lokalen Static-Server (Konsole, Anker, Overflow Desktop+Mobil, Menü, Bild-Blobs) — alles grün.

---

## 1) Offen — Pflicht vor Launch

- [ ] **Kontaktweg bauen (DER Blocker).** Verifiziert: kein Formular, kein `mailto:`, kein Buchungslink;
  der Button in der Kontakt-Sektion verlinkt auf `#kontakt`, also auf sich selbst. Die Seite kann
  keine einzige Anfrage erzeugen.
  → Schlankes Formular (Name, E-Mail, „Wo verlierst du gerade Zeit?"), E-Mail-Adresse als Fallback,
  optional cal.com (EU-hostbar). Dazu eine Erwartungszeile: „Antwort innerhalb von 48 h — du sprichst
  direkt mit mir."
- [ ] **Impressum & Datenschutz mit echten Inhalten füllen.** Status geändert: Die Links laufen **nicht**
  mehr ins 404 — der Deploy-Workflow baut die Astro-Seite nach `/main/`, beide Seiten sind erreichbar.
  Aber: beides sind Platzhalter („Diese Seite ist in Vorbereitung"), das Impressum nennt noch die
  **alte Marke „JGC Studio"** und beruft sich auf **§ 5 TMG** — das Gesetz heißt seit Mai 2024
  **§ 5 DDG**. E-Mail dort ist kontakt@jgc-handwerk.de (prüfen, ob fürs Lumen-Impressum gewollt).
- [ ] **`noindex` für alle Preview-Varianten.** Verifiziert offen: `<meta name="robots" content="index, follow">`.
- [ ] **Echten Beweis liefern** *(zurückgestuft von ✅ auf teilweise)*. Da ist: ehrlicher Hinweis
  „Pilotkunden-Zitate folgen…" und drei klar gekennzeichnete Platzhalter-Karten. Es fehlt weiterhin:
  ein echtes **Stil-Sample / Vorher-Nachher** („so klingt der KI-Entwurf in deiner Handschrift") oder
  ein anonymisierter Praxis-Check-Ausschnitt. Empfehlung: bis echte Zitate da sind, die drei
  erfundenen Karten auf den einen ehrlichen Satz reduzieren — gelabelte Fake-Zitate wirken bei einer
  vertrauens-sensiblen Zielgruppe schwächer als gar keine.

## 2) Offen — Hoch

- [ ] **`og:url` + `canonical` zeigen auf `http://localhost:4321/`.** Ursache verifiziert: die Standalone
  wurde lokal ohne `SITE_URL` gebaut (astro.config liest die Env-Variable; der Workflow setzt sie, der
  lokale Build nicht). Das JSON-LD hat dagegen die korrekte URL. Fix beim nächsten Freeze bzw. beim Launch-Build.
- [ ] **`og:image` fehlt.** Verifiziert: kein Vorschaubild beim Teilen (LinkedIn = Hauptkanal).
- [ ] **Nachweis Ingenieur-Welt:** „Master in Wirtschaftsingenieurwesen" steht ohne Hochschule/Jahr.
- [ ] **LinkedIn: Platzhalter-Link ersetzen oder entfernen.** Neu gefunden: der Footer verlinkt auf
  `https://www.linkedin.com` (Startseite, kein Profil). Ein toter Trust-Link ist schlimmer als keiner.
- [ ] **Eigentums-Satz ergänzen** *(zurückgestuft von ✅ auf teilweise)*. Der Exit-Teil ist da
  („Ohne diese Anbindung bleibt deine Umsetzung stabil — du bist nicht abhängig", 2×). Es fehlt:
  wem gehört das trainierte Stil-Modell / die Prompts / die Daten nach Projektende. Ein Satz reicht.

## 3) Offen — Mittel

- [ ] **Asset-Gewicht beim All-Inkl-Launch.** Konkretisiert: 1,23 MB Single-File. Fonts ~525 KB in
  14 Subsets — darunter Kyrillisch, Griechisch und Vietnamesisch, die inline immer mitgeladen werden.
  Bilder (dekodiert): Hero 236 KB, Porträt 47 KB, TÜV 71 KB, Logo 2×30 KB (doppelt eingebettet).
  → Beim Launch: externe Dateien mit Caching, Subsets auf latin/latin-ext (~60–80 KB Fonts).
- [ ] **Erfolgsmessung.** Verifiziert: kein Analytics-Script. Cookiefreies EU-Tool (selbst gehostetes
  Plausible oder Umami) bleibt die Empfehlung.
- [ ] **Entscheidung: „Drei Welten" hero-nah?** Nicht umgesetzt — die „Wer mit dir arbeitet"-Sektion
  bleibt in der Seitenmitte; der Dreiklang-Satz steht dort im Intro. Vertretbar (Hero trägt Trust-Zeile
  + Sub-Claim). Bewusst entscheiden: so lassen oder Hero-Badges auf die Belege verankern (s. Punkt N6).

## 4) Neue Punkte aus dem Review vom 07.07.2026 (/improve)

*Details, Aufwand und Risiko im Chat-Bericht; hier nur als Merkliste.*

- [ ] **N1 · V18 in die Astro-Quelle zurückführen** — `site/src` ist zwei Generationen zurück
  (Live-`/main/` zeigt noch „JGC Studio"); die beschlossene Seite existiert nur als eingefrorenes
  1,2-MB-Single-File. Vor dem Launch nötig; fixt og:url/Assets gleich mit. **(L)**
- [ ] **N2 · Zweiter, niederschwelliger CTA** für Besucher, die noch nicht buchen wollen
  (z. B. Beispiel-Praxis-Check-Report ansehen oder LinkedIn folgen). **(M)**
- [ ] **N3 · Nav-Logo-Link** führt auf `../../` (Galerie) statt zum Seitenanfang; aria-label sagt
  „zurück zum Anfang". Beim Launch tote Referenz. **(S)**
- [ ] **N4 · FAQ 08 nennt Calendly** als Beispiel — US-Anbieter auf einer DSGVO-first-Seite;
  durch cal.com oder neutrale Formulierung ersetzen. **(S)**
- [ ] **N5 · Anrede vereinheitlichen:** „deine Klientin" / „deine Klient:innen" / „meine Klienten"
  wechseln sich ab — eine Form festlegen. **(S)**
- [ ] **N6 · TÜV nachprüfbar machen:** Hero-Badge „TÜV-zertifiziert" aufs Siegel verankern; Siegel auf
  den Certipedia-Eintrag (ID 0217466495) verlinken. **(S)**
- [ ] **N7 · Kontrast-Grenzfälle:** mehrere Kleintexte mit 55–60 % Deckkraft liegen um/unter WCAG-AA
  (4,5:1) — eine Stufe anheben. **(S)**
- [ ] **N8 · Skin-Stolperfalle dokumentieren/entkoppeln:** die Sektions-Hintergründe hängen an
  `nth-child(n of .bg-pergament)` — Sektion entfernen/umstellen (z. B. Stimmen!) verschiebt still
  alle Farbflächen. Mindestens als Stolperfalle in CLAUDE.md, besser auf IDs umstellen. **(S–M)**
- [ ] **N9 · Qualitäts-Check im Deploy:** Link-Checker + HTML-Validierung über `_site` im Workflow —
  fängt tote Links (wie einst `/main/impressum`) künftig vor dem Deploy. **(M)**
- [ ] **N10 · Dependencies:** `npm audit fix` (js-yaml, vite — ohne Breaking Change); Astro-7-Upgrade
  einplanen, am besten zusammen mit N1. Findings sind überwiegend Dev-/Build-Zeit-Risiken. **(S / M)**
- [ ] **N11 · FAQ „Was kostet das typischerweise insgesamt?"** — konsolidiert die verstreuten Preise
  und beantwortet die häufigste stille Frage. **(S)**

## 5) Erledigt — in Variante 18 verifiziert (07.07.2026)

- ✅ **FAQ 02 Faktenfehler:** keine „30 Millionen", kein „August 2026"; entlastendes Art.-4-Framing
  („Seit Februar 2025 … ich sorge dafür, dass du diese Pflicht erfüllst"); § 203 StGB bleibt.
- ✅ **Gründer verkörpert:** Porträt (4:5) + Klarname Gabriel Chimento als Intro von „Wer mit dir arbeitet".
- ✅ **TÜV-Beleg:** Siegel-Grafik mit Qualifikation, Prüfzeichen-ID 0217466495, gültig bis 11.06.2029.
- ✅ **Preisanker statt offener Spanne:** Praxis-Check 600 € (voll anrechenbar), Bausteine ab 2.500 € /
  3.000 € / 4.000 €, Bündel-Hinweis, Resonanzraum ab 300 €/Monat.
- ✅ **Trust-Badges belegt:** TÜV-Siegel sichtbar; EU-Hosting mit Anbietern benannt (Mistral, Aleph Alpha,
  Azure Frankfurt); Art.-4-Schulung erklärt. (Schärfung möglich → N6.)
- ✅ **Einrichtungsaufwand sichtbarer:** Mitarbeit steht als Disqualifier in „Passt nicht, wenn …";
  die konkrete Stundenzahl (4–6 h/Woche) bewusst weiter in FAQ 04 — vertretbar.
- ✅ **FAQ 04 aus Kundenperspektive** („Wie viel Zeit muss ich selbst investieren?").
- ✅ **„Quick Wins" → „priorisierte Hebel"** (Praxis-Check + FAQ 01).
- ✅ **Tool → Werkzeug** durchgängig (übrig nur „Buchungstool wie Calendly" → N4).
- ✅ **„Was der Resonanzraum trägt"** statt „Was er trägt".
- ✅ **Content-Stimme als Baustein Nr. 1.**
- ✅ **JSON-LD `ProfessionalService`** mit Gründer, Freiburg, DACH — inkl. korrekter URL.
- ✅ **Smoke-Test grün:** keine Konsolenfehler; alle Anker haben Ziele; genau ein h1; kein horizontaler
  Overflow (Desktop + 375 px); Mobile-Menü inkl. `aria-expanded` korrekt; alle 5 Bild-Blobs valide;
  `prefers-reduced-motion` vollständig behandelt.

## 6) Bewusst gut — nicht anfassen

- „Deine Woche, zwei Versionen" (Heute/Morgen) — stärkste Sektion, konkret und buzzword-frei.
- „KI ist ein Werkzeug"-Einordnung direkt nach dem Hero (Haltung vor Verkauf).
- „Passt nicht, wenn …" mit echten Disqualifiern.
- Audit-first verankert, 600 € anrechenbar, Resonanzraum klar optional, „du bist nicht abhängig".
- Native `<details>`, self-hosted Fonts, `lang="de"`, Skip-Link, saubere Heading-Hierarchie.
