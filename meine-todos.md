# Meine To-dos — JGC Lumen Website

Aufgaben, die **nur Gabriel** erledigen kann: Inhalte, Daten, Zugänge, Entscheidungen.
Alles Technische steht in [verbesserungen.md](./verbesserungen.md); der Stand der Sitzung
in [weitermachen.md](./weitermachen.md).

Stand: 2026-07-25 (aus /improve-Runde 2)

---

## Dringend — blockiert den Launch

- [ ] **Impressum-Daten liefern** (→ V3)
      Die Seite `/main/impressum/` sagt seit Wochen „in Vorbereitung". Eine gewerbliche Seite
      mit Preisangaben braucht in Deutschland ein vollständiges Impressum nach § 5 DDG.
      Gebraucht wird: vollständiger Name · ladungsfähige Anschrift (kein Postfach) ·
      E-Mail-Adresse · falls vorhanden USt-IdNr. · bei der TÜV-Qualifikation ggf. die
      Berufsbezeichnung samt verleihender Stelle.
      Sobald du mir das gibst, setze ich es in einem Zug ein.
      *Warum es drängt: Ohne Impressum ist eine gewerbliche Seite abmahnfähig — und sie ist
      seit Wochen öffentlich erreichbar.*

- [ ] **Datenschutzerklärung juristisch prüfen lassen**
      Der Stilprobe-Abschnitt und der neue Passus zur GitHub-Pages-Auslieferung sind von mir
      sachlich korrekt formuliert, aber **kein Rechtsrat**. Vor dem Bewerben der Seite einmal
      von jemandem mit Zulassung gegenlesen lassen.

## Zulieferungen — kleine Dinge, die ich ohne dich nicht kann

- [ ] **LinkedIn-Profil-URL** (→ V14)
      Der Fußzeilen-Link zeigte auf `linkedin.com` (die Startseite, kein Profil). Ich habe ihn
      entfernt, weil ein toter Vertrauens-Link schlechter wirkt als gar keiner. Schick mir die
      echte Profiladresse, dann kommt der Eintrag zurück — an drei Stellen (Astro-Footer,
      Variante 18, Stilprobe-Seite).

- [ ] **Testmail an `kontakt@jgc-lumen.de` schicken**
      Der „Erstgespräch anfragen"-Knopf öffnet jetzt eine Mail an diese Adresse; sie steht auch
      im Impressum. Du hast bestätigt, dass das Postfach läuft — bitte trotzdem einmal von außen
      testen (von einer fremden Adresse, nicht aus deinem eigenen Postfach), bevor die Seite
      beworben wird. Eine stillschweigend bouncende Adresse wäre schlimmer als der alte Zustand.
      *Nebenbeobachtung: `jgc-lumen.de` liefert über HTTP nur eine Parkseite und hat kein
      gültiges HTTPS-Zertifikat. Für Mail egal, für den späteren Umzug relevant.*

- [ ] **Echte Beispieltexte für die Stilprobe** (Phase 6)
      Die Fassungen A/B in der `#stilprobe`-Sektion sind Platzhalter (Marker
      `PLATZHALTER Phase 6` im V18-HTML). Sie sollen durch Ausschnitte aus deiner eigenen
      Stilprobe ersetzt werden.

## Entscheidungen — ich brauche nur ein Wort von dir

- [ ] **Die drei Platzhalter-Kundenstimmen: bleiben oder weg?** (→ V13)
      In „Was Kunden über die Arbeit sagen." stehen drei erfundene Zitate, korrekt als
      Platzhalter gekennzeichnet. Die Kennzeichnung ist ehrlich — sie sagt der Zielgruppe aber
      dreimal hintereinander „ich habe noch keine Kunden".
      **Meine Empfehlung:** die drei Karten entfernen und nur den ehrlichen Einleitungssatz
      stehen lassen, bis echte Zitate da sind. Bei einer vertrauens-sensiblen Zielgruppe wirkt
      Zurückhaltung stärker als eine gefüllte Sektion. Sag „weg" und ich baue es um.

- [ ] **FAQ „Was kostet das insgesamt?"** (→ I3)
      Die Preise stehen über die Seite verstreut (600 € · ab 2.500/3.000/4.000 € · ab 300 €/Monat).
      Ich würde eine FAQ-Antwort mit einem Rechenbeispiel ergänzen. Ich kann einen Vorschlag
      schreiben — den Wortlaut solltest du freigeben, es ist Verkaufstext.

- [ ] **Variante 18 zurück in die Astro-Quelle?** (→ I2, Aufwand L)
      Größere Sache, aber sie löst drei Dinge auf einmal: `/main/` zeigt noch die zwei
      Generationen alte Seite, das Seitengewicht von 1,2 MB, und jede V18-Änderung braucht
      derzeit ein eigenes Guard-Skript auf einer einzigen minifizierten Zeile. Wann passt das?

## Steht schon auf deiner Hub-Liste (Karte „Website") — hier nur zur Erinnerung

- SEO-Überarbeitung — Teil davon ist jetzt erledigt: die 14 Alt-Varianten stehen auf `noindex`,
  die `localhost`-canonicals sind raus. Offen bleibt: `robots.txt`, `sitemap.xml`, und dass
  `/main/` als zweite indexierbare Startseite mit derselben Beschreibung online steht.
- Cookie-Thema / Erfolgsmessung — steht seit 27.06. als Idee im Raum (cookiefreies EU-Tool,
  selbst gehostetes Plausible oder Umami). Weiterhin deine Entscheidung.
- Preise der Konkurrenz recherchieren
- Scroll-World-Erlebnisseite testen
