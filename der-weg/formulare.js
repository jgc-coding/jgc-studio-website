/* ============================================================================
   formulare.js — die zwei Formulare der Reise (Stilprobe, Erstgespraech)

   Die Formulare stehen als <article class="vertiefung weg-formular"> im Block
   #vertiefungen — OHNE data-station, damit vertiefung.js sie ignoriert. Ohne
   JavaScript sind sie dort gewoehnlicher Lesetext mit nativem POST; mit
   JavaScript verschiebt dieses Modul jeden Artikel einmalig in ein eigenes
   Overlay (gleiche Optik wie das "Mehr dazu"-Feld, Klasse .weg-tief).

   ANSCHLUSS
     mountFormulare({ vertiefung: <Rueckgabe von mountVertiefung> })

   DREI ABSICHTLICHE UNTERSCHIEDE ZU vertiefung.js:
   1. VERSCHIEBEN statt klonen. Das "Mehr dazu"-Feld klont seinen Artikel bei
      jedem Oeffnen — fuer Lesetext richtig, fuer ein Formular fatal: der Klon
      wuerde beim Schliessen samt Eingaben verworfen. Hier wandert der
      Original-Knoten einmalig ins Overlay; Eingaben ueberleben jedes
      Schliessen und Wiederoeffnen.
   2. KEIN Schliessen durch Weiterscrollen. Beim Lesetext ist "weiterscrollen
      = weiter auf der Reise" die richtige Geste; ein Formular darf ein
      versehentlicher Radzug am Textende nicht zuklappen. Die Reise haelt
      trotzdem an (wheel/touchmove werden abgefangen), zu geht es nur ueber
      Schliessknopf, Escape oder Klick auf den Hintergrund.
      Bewusst offen gelassen: wer die Seite am Scrollbalken zieht, bewegt die
      Reise HINTER dem offenen Formular. Das ist Kulisse — Datenerhalt schlaegt
      Kulisse, deshalb schliesst auch das nicht.
   3. Es oeffnet hoechstens EIN Feld: ein offenes Vertiefungsfeld wird vor dem
      Oeffnen ueber das Handle von mountVertiefung geschlossen, ein offenes
      anderes Formular ebenso.

   AUSLOESER: jedes Element mit data-formular-oeffner="stilprobe|erstgespraech"
   (delegiert auf document — funktioniert damit auch in den GEKLONTEN
   Vertiefungs-Artikeln). Die zwei Engine-Knoepfe der Schluss-Station bekommen
   das Attribut hier nachtraeglich; ihre href bleiben stehen und sind der Weg
   ohne JavaScript (mailto bzw. /stilprobe/). Die Engine baut ihre Knoepfe
   genau EINMAL beim Mount (scrub-engine.js, buildDOM) — ein Resize erzeugt
   keine neuen, das Attribut haelt.

   DIE FORMULAR-LOGIK SELBST steht seit dem 05.09.2026 in formular-kern.js
   (Zaehler, Entwurfsspeicher, Absenden, Fehlerpfad, Kontingent-Badge) — dieselbe
   Datei benutzt die Stilprobe-Unterseite. Hier bleibt nur, was die Reise
   ausmacht: die Overlays und ihre Verdrahtung. Frueher stand dieselbe Logik
   zweimal im Repo, zusammengehalten nur vom Merksatz "Aenderungen dort und hier
   gemeinsam ziehen".

   VERTRAG DER FELDER UND ANTWORTEN: docs/stilprobe/schnittstelle.md und
   docs/erstgespraech/schnittstelle.md. Endpoints und Mailadressen stehen als
   action- bzw. data-Attribute im HTML, dieses Skript ist pfadfrei.
   ========================================================================== */

function mountFormulare(optionen) {
  var kern = window.formularKern;
  if (!kern) return;                 // formular-kern.js muss vorher geladen sein
  var cfg = optionen || {};
  var vertiefung = cfg.vertiefung || null;
  var artikel = Array.prototype.slice.call(document.querySelectorAll('#vertiefungen .weg-formular'));
  if (!artikel.length) return;

  var sanft = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Overlays bauen, Artikel hinein VERSCHIEBEN ---- */
  var felder = {};                 // name -> { huelle, feld, rolle, artikel }
  var offenes = null;              // name des offenen Formulars oder null
  var ausloeser = null;
  var letzteY = 0;

  artikel.forEach(function (art) {
    var name = art.getAttribute('data-formular');
    if (!name) return;
    var huelle = document.createElement('div');
    huelle.className = 'weg-tief weg-tief--formular';
    huelle.hidden = true;
    // Ohne die Fusszeile "Weiterscrollen schliesst dieses Feld" — hier waere
    // sie gelogen, siehe Kopfkommentar.
    huelle.innerHTML =
      '<div class="weg-tief__grund"></div>' +
      '<div class="weg-tief__feld" role="dialog" aria-modal="true">' +
        '<button type="button" class="weg-tief__zu" aria-label="Feld schliessen">' +
          '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5.5 5.5l9 9M14.5 5.5l-9 9"/></svg>' +
        '</button>' +
        '<div class="weg-tief__rolle" tabindex="0"></div>' +
      '</div>';
    document.body.appendChild(huelle);

    var feld = huelle.querySelector('.weg-tief__feld');
    var titel = art.querySelector('h2');
    feld.setAttribute('aria-label', titel ? titel.textContent.trim() : 'Formular');
    huelle.querySelector('.weg-tief__rolle').appendChild(art);
    huelle.querySelector('.weg-tief__grund').addEventListener('click', schliesse);
    huelle.querySelector('.weg-tief__zu').addEventListener('click', schliesse);

    felder[name] = {
      huelle: huelle,
      feld: feld,
      rolle: huelle.querySelector('.weg-tief__rolle'),
      artikel: art,
      aufraeumer: 0
    };
  });

  function oeffne(name, knopf) {
    var f = felder[name];
    if (!f) return;
    if (offenes === name) return;
    // Erst alles andere schliessen: hoechstens ein Feld auf dem Schirm.
    if (offenes) schliesse();
    if (vertiefung && vertiefung.istOffen && vertiefung.istOffen()) vertiefung.schliesse();

    ausloeser = knopf || null;
    clearTimeout(f.aufraeumer);
    f.huelle.hidden = false;
    f.rolle.scrollTop = 0;
    // Ein Bildaufbau dazwischen erzwingen, sonst springt das Feld ohne Blende
    // auf (gleicher Griff wie in vertiefung.js).
    void f.huelle.offsetWidth;
    f.huelle.classList.add('ist-offen');
    offenes = name;
    if (ausloeser && ausloeser.setAttribute) ausloeser.setAttribute('aria-expanded', 'true');
    f.rolle.focus({ preventScroll: true });
    lauscher(true);
    if (name === 'stilprobe') kern.ladeKontingent(f.artikel);
  }

  function schliesse() {
    if (!offenes) return;
    var f = felder[offenes];
    offenes = null;
    f.huelle.classList.remove('ist-offen');
    lauscher(false);
    if (ausloeser) {
      if (ausloeser.setAttribute) ausloeser.setAttribute('aria-expanded', 'false');
      // Der Ausloeser kann ein Klon aus einem Vertiefungs-Feld sein, das
      // inzwischen aufgeraeumt wurde — dann zurueck auf den Engine-Knopf.
      var ziel = document.contains(ausloeser) ? ausloeser : ersatzFokus(f.artikel);
      if (ziel && ziel.focus) ziel.focus({ preventScroll: true });
      ausloeser = null;
    }
    clearTimeout(f.aufraeumer);
    f.aufraeumer = setTimeout(function () {
      if (offenes !== f.artikel.getAttribute('data-formular')) f.huelle.hidden = true;
    }, sanft ? 320 : 0);
  }

  function ersatzFokus(art) {
    var name = art.getAttribute('data-formular');
    return document.querySelector(name === 'erstgespraech'
      ? '.sw-copy__cta .sw-btn--primary'
      : '.sw-copy__cta .sw-btn--ghost');
  }

  /* ---- Reise anhalten, solange ein Formular offen ist ----
     Gleiche Logik wie vertiefung.js (feldScrolltSelbst), aber ohne die
     Schliess-Zaehler: am Textende wird nur angehalten, nie geschlossen. */
  function feldScrolltSelbst(ziel, runter) {
    var f = offenes && felder[offenes];
    if (!f || !f.rolle.contains(ziel)) return false;
    var rest = runter
      ? f.rolle.scrollHeight - f.rolle.clientHeight - f.rolle.scrollTop
      : f.rolle.scrollTop;
    return rest > 1;
  }

  function beiRad(e) {
    if (!offenes) return;
    if (feldScrolltSelbst(e.target, e.deltaY > 0)) return;
    e.preventDefault();
  }

  function beiWischStart(e) {
    if (!offenes || !e.touches.length) return;
    letzteY = e.touches[0].clientY;
  }

  function beiWisch(e) {
    if (!offenes || !e.touches.length) return;
    var y = e.touches[0].clientY;
    var runter = y < letzteY;
    letzteY = y;
    if (feldScrolltSelbst(e.target, runter)) return;
    e.preventDefault();
  }

  function beiTaste(e) {
    if (!offenes) return;
    if (e.key === 'Escape') { e.preventDefault(); schliesse(); return; }
    if (e.key !== 'Tab') return;
    var f = felder[offenes];
    var alle = f.feld.querySelectorAll(
      'a[href], button:not([disabled]), input:not([type="hidden"]):not([tabindex="-1"]), textarea, select, [tabindex="0"]'
    );
    var ziele = Array.prototype.filter.call(alle, function (el) {
      return !el.closest('[hidden]');
    });
    if (!ziele.length) return;
    var erste = ziele[0], letzte = ziele[ziele.length - 1];
    if (e.shiftKey && document.activeElement === erste) { e.preventDefault(); letzte.focus(); }
    else if (!e.shiftKey && document.activeElement === letzte) { e.preventDefault(); erste.focus(); }
  }

  function lauscher(an) {
    var m = an ? 'addEventListener' : 'removeEventListener';
    // passive:false ist Pflicht, sonst darf preventDefault die Seite nicht
    // anhalten und der Film liefe hinter dem offenen Formular weiter.
    window[m]('wheel', beiRad, { passive: false });
    window[m]('touchstart', beiWischStart, { passive: true });
    window[m]('touchmove', beiWisch, { passive: false });
    document[m]('keydown', beiTaste);
  }

  /* ---- Ausloeser: delegiert, damit auch Klone in Vertiefungen zaehlen ---- */
  document.addEventListener('click', function (e) {
    if (!e.target || !e.target.closest) return;
    var knopf = e.target.closest('[data-formular-oeffner]');
    if (!knopf) return;
    e.preventDefault();
    oeffne(knopf.getAttribute('data-formular-oeffner'), knopf);
  });

  // Die zwei Engine-Knoepfe der Schluss-Station nachtraeglich markieren.
  // href bleibt: ohne JavaScript mailto bzw. Stilprobe-Unterseite.
  var cta1 = document.querySelector('.sw-copy__cta .sw-btn--primary');
  var cta2 = document.querySelector('.sw-copy__cta .sw-btn--ghost');
  if (cta1) { cta1.setAttribute('data-formular-oeffner', 'erstgespraech'); cta1.setAttribute('aria-haspopup', 'dialog'); }
  if (cta2) { cta2.setAttribute('data-formular-oeffner', 'stilprobe'); cta2.setAttribute('aria-haspopup', 'dialog'); }

  /* ==================================================================
     Verdrahtung: welches Formular welche Wortlaute und Schluessel bekommt.
     Die Mechanik dahinter steht in formular-kern.js.
     ================================================================== */

  var spArt = felder.stilprobe && felder.stilprobe.artikel;
  if (spArt) {
    kern.setupZaehler(spArt);
    var spMail = spArt.getAttribute('data-mail') || 'stilprobe@jgc-lumen.de';
    var spNormalBlock = spArt.querySelector('[data-rolle="normal"]');
    var spWlBlock = spArt.querySelector('[data-rolle="warteliste"]');
    var spNormalForm = spNormalBlock && spNormalBlock.querySelector('form');
    var spWlForm = spWlBlock && spWlBlock.querySelector('form');

    var spErfolg = 'Danke. Deine Texte sind angekommen – du bekommst gleich eine Bestätigung ' +
      'per Mail und binnen 48 Stunden deine zwei Fassungen. Absender: ' + spMail;
    var spErfolgWarteliste = 'Danke. Du stehst jetzt vorn auf der Liste: Sobald der nächste ' +
      'Monat beginnt, bekommst du deinen Platz angeboten, bevor er auf der Website erscheint.';

    var spEntwurf = kern.setupEntwurf(spArt, spNormalForm, 'stilprobe-entwurf-v1',
      ['name', 'email', 'text_1', 'text_2', 'text_3', 'wunschthema', 'quelle']);

    kern.setupFormular(spNormalForm, {
      name: 'stilprobe', block: spNormalBlock, mail: spMail,
      betreff: 'Meine Stilprobe',
      fehlerHinweis: 'Schick mir deine drei Texte einfach direkt an',
      erfolg: spErfolg, erfolgWarteliste: spErfolgWarteliste,
      entwurfLoeschen: spEntwurf.loeschen
    });
    kern.setupFormular(spWlForm, {
      name: 'stilprobe-warteliste', block: spWlBlock, mail: spMail,
      betreff: 'Warteliste Stilprobe',
      fehlerHinweis: 'Schreib mir einfach direkt an',
      erfolg: spErfolgWarteliste
    });
  }

  var egArt = felder.erstgespraech && felder.erstgespraech.artikel;
  if (egArt) {
    kern.setupZaehler(egArt);
    var egMail = egArt.getAttribute('data-mail') || 'kontakt@jgc-lumen.de';
    var egBlock = egArt.querySelector('[data-rolle="normal"]');
    var egForm = egBlock && egBlock.querySelector('form');

    var egEntwurf = kern.setupEntwurf(egArt, egForm, 'erstgespraech-entwurf-v1',
      ['name', 'email', 'telefon', 'anliegen', 'zeitfenster']);

    kern.setupFormular(egForm, {
      name: 'erstgespraech', block: egBlock, mail: egMail,
      betreff: 'Erstgespräch anfragen',
      fehlerHinweis: 'Schreib mir einfach direkt an',
      erfolg: 'Danke, deine Anfrage ist angekommen. Ich melde mich bei dir mit zwei Terminvorschlägen.',
      entwurfLoeschen: egEntwurf.loeschen
    });

    /* Rueckruf-Haekchen: Telefonfeld ein-/ausblenden, Pflicht setzen und die
       Zeitfenster-Frage umformulieren (erstgespraech-buchung, Weg 5). Ohne
       JavaScript bleibt das Feld sichtbar und optional — dann prueft der
       Server die Kombination (schnittstelle.md). */
    var rueckruf = egForm && egForm.elements['rueckruf'];
    var telefonFeld = egArt.querySelector('[data-rolle="telefon-feld"]');
    var telefon = egForm && egForm.elements['telefon'];
    var zeitLabel = egArt.querySelector('[data-rolle="zeitfenster-label"]');
    var zeitLabelNormal = zeitLabel ? zeitLabel.textContent : '';

    function telefonUmschalten() {
      var an = !!(rueckruf && rueckruf.checked);
      if (telefonFeld) telefonFeld.hidden = !an;
      if (telefon) telefon.required = an;
      if (zeitLabel) {
        zeitLabel.textContent = an ? 'Wann erreiche ich dich am besten?' : zeitLabelNormal;
      }
    }

    if (rueckruf) {
      rueckruf.addEventListener('change', telefonUmschalten);
      // Ein wiederhergestellter Entwurf mit Telefonnummer heisst: der Rueckruf
      // war gewollt — Haekchen mitsetzen, sonst stuende die Nummer unsichtbar
      // im Formular.
      if (telefon && telefon.value.trim() !== '') rueckruf.checked = true;
      telefonUmschalten();
    }
  }

  // Mindest-Ausfuellzeit: Startzeit fuer den Spam-Check des Servers.
  kern.setzeGeladenZeit(document);
}

if (typeof window !== 'undefined') window.mountFormulare = mountFormulare;
