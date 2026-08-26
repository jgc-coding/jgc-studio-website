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

   VERTRAG DER FELDER UND ANTWORTEN: docs/stilprobe/schnittstelle.md und
   docs/erstgespraech/schnittstelle.md. Endpoints und Mailadressen stehen als
   action- bzw. data-Attribute im HTML, dieses Skript ist pfadfrei.
   ========================================================================== */

function mountFormulare(optionen) {
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
    if (name === 'stilprobe') ladeKontingent(f.artikel);
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
     Ab hier die Formular-Logik selbst — portiert aus der Stilprobe-
     Unterseite (stilprobe/index.html), gleicher Vertrag, gleiche
     Wortlaute. Aenderungen dort und hier gemeinsam ziehen.
     ================================================================== */

  function formatDE(zahl) {
    return zahl.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function zeigeFehler(form, mail, hinweis) {
    var box = form.querySelector('[data-rolle="fehler"]');
    if (!box) return;
    box.innerHTML =
      'Das hat gerade nicht geklappt. ' + hinweis + ' <a href="mailto:' + mail + '">' + mail +
      '</a> – der Weg ist genauso gut. Deine Eingaben bleiben hier stehen, du kannst sie von hier kopieren.';
    box.hidden = false;
    if (box.scrollIntoView) box.scrollIntoView({ block: 'center', behavior: sanft ? 'smooth' : 'auto' });
    if (box.focus) box.focus({ preventScroll: true });
  }

  function ersetzeDurchErfolg(block, text) {
    block.innerHTML = '<div class="weg-formular__erfolg" role="status"><p>' + text + '</p></div>';
  }

  function setupFormular(form, opts) {
    if (!form || !window.fetch) return;
    var knopf = form.querySelector('button[type="submit"]');
    var beschriftung = knopf ? knopf.textContent : '';

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = form.querySelector('[data-rolle="fehler"]');
      if (box) box.hidden = true;

      var daten = new FormData(form);
      var controller = 'AbortController' in window ? new AbortController() : null;
      var timeoutId = controller ? setTimeout(function () { controller.abort(); }, 10000) : null;

      if (knopf) { knopf.disabled = true; knopf.textContent = 'Wird gesendet …'; }

      fetch(form.getAttribute('action'), {
        method: 'POST',
        body: daten,
        signal: controller ? controller.signal : undefined
      })
        .then(function (antwort) {
          if (timeoutId) clearTimeout(timeoutId);
          if (!antwort.ok) throw new Error('http-status');
          return antwort.json();
        })
        .then(function (json) {
          if (!json || json.status !== 'ok') throw new Error('status');
          if (opts.entwurfLoeschen) opts.entwurfLoeschen();
          if (json.zustand === 'warteliste' && opts.erfolgWarteliste) {
            ersetzeDurchErfolg(opts.block, opts.erfolgWarteliste);
          } else {
            ersetzeDurchErfolg(opts.block, opts.erfolg);
          }
        })
        .catch(function () {
          if (timeoutId) clearTimeout(timeoutId);
          zeigeFehler(form, opts.mail, opts.fehlerHinweis);
          if (knopf) { knopf.disabled = false; knopf.textContent = beschriftung; }
        });
    });
  }

  /* ---- Zeichenzaehler: jede Textarea mit zugehoeriger *-zaehler-Zeile ---- */
  function setupZaehler(wurzel) {
    Array.prototype.forEach.call(wurzel.querySelectorAll('textarea[id]'), function (feld) {
      var zaehler = wurzel.querySelector('#' + feld.id + '-zaehler');
      if (!zaehler) return;
      var max = feld.maxLength > 0 ? feld.maxLength : 0;
      var min = feld.minLength > 0 ? feld.minLength : 0;
      function aktualisieren() {
        var text = formatDE(feld.value.length) + ' / ' + formatDE(max) + ' Zeichen';
        if (min && feld.value.length < min) text += ' (mindestens ' + min + ')';
        zaehler.textContent = text;
      }
      aktualisieren();
      feld.addEventListener('input', aktualisieren);
    });
  }

  /* ---- Entwurfsspeicher, gleicher Bau wie auf der Unterseite (V5) ----
     Die Stilprobe nutzt DENSELBEN Schluessel wie stilprobe/index.html:
     beide Seiten liegen auf derselben Origin, ein angefangener Entwurf
     wandert also zwischen Unterseite und Reise mit. */
  function speicherVerfuegbar() {
    try {
      var probe = '__test__';
      window.localStorage.setItem(probe, probe);
      window.localStorage.removeItem(probe);
      return true;
    } catch (e) { return false; }
  }

  function setupEntwurf(art, form, schluessel, feldnamen) {
    function loeschen() {
      if (!speicherVerfuegbar()) return;
      try { window.localStorage.removeItem(schluessel); } catch (e) {}
    }
    if (!form || !speicherVerfuegbar()) return { loeschen: loeschen };

    var hinweis = art.querySelector('[data-rolle="entwurf-hinweis"]');
    var zeitZeile = art.querySelector('[data-rolle="entwurf-zeit"]');

    function felderListe() {
      return feldnamen
        .map(function (n) { return form.elements[n]; })
        .filter(function (el) { return el && typeof el.value === 'string'; });
    }

    function sichern() {
      var daten = { gespeichert: Date.now(), werte: {} };
      var etwasDrin = false;
      felderListe().forEach(function (el) {
        daten.werte[el.name] = el.value;
        if (el.value.trim() !== '') etwasDrin = true;
      });
      try {
        if (etwasDrin) window.localStorage.setItem(schluessel, JSON.stringify(daten));
        else window.localStorage.removeItem(schluessel);
      } catch (e) { /* Quote voll: Formularinhalt bleibt, nur ohne Entwurf. */ }
    }

    function wiederherstellen() {
      var roh = null;
      try { roh = window.localStorage.getItem(schluessel); } catch (e) { return; }
      if (!roh) return;
      var daten;
      try { daten = JSON.parse(roh); } catch (e) { loeschen(); return; }
      if (!daten || !daten.werte) { loeschen(); return; }

      var etwasGesetzt = false;
      felderListe().forEach(function (el) {
        var wert = daten.werte[el.name];
        if (typeof wert === 'string' && wert !== '') {
          el.value = wert;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          etwasGesetzt = true;
        }
      });
      if (!etwasGesetzt) return;

      if (hinweis) {
        if (zeitZeile && daten.gespeichert) {
          var d = new Date(daten.gespeichert);
          zeitZeile.textContent = d.toLocaleDateString('de-DE') + ', ' +
            d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr';
        }
        hinweis.hidden = false;
      }
    }

    var timer = null;
    form.addEventListener('input', function () {
      if (timer) clearTimeout(timer);
      timer = setTimeout(sichern, 400);
    });

    var verwerfen = art.querySelector('[data-rolle="entwurf-verwerfen"]');
    if (verwerfen) {
      verwerfen.addEventListener('click', function () {
        loeschen();
        felderListe().forEach(function (el) {
          el.value = '';
          el.dispatchEvent(new Event('input', { bubbles: true }));
        });
        if (hinweis) hinweis.hidden = true;
        var erstes = form.elements['name'];
        if (erstes && erstes.focus) erstes.focus({ preventScroll: true });
      });
    }

    wiederherstellen();
    return { loeschen: loeschen };
  }

  /* ---- Kontingent-Badge (nur Stilprobe) ----
     Erst beim ERSTEN Oeffnen abgefragt, nicht beim Seitenstart: die meisten
     Besucher der Reise oeffnen das Formular nie, und der Vertrag erlaubt
     10 Minuten Cache. Fehler bleiben still, der statische Satz steht schon
     im HTML. Wortlaute identisch zur Unterseite (schnittstelle.md). */
  var MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  var kontingentGeladen = false;

  function folgemonatVon(monat) {
    var index = MONATE.indexOf(monat);
    return index === -1 ? 'nächsten Monat' : MONATE[(index + 1) % 12];
  }

  function ladeKontingent(art) {
    if (kontingentGeladen || !window.fetch) return;
    var url = art.getAttribute('data-kontingent');
    if (!url) return;
    kontingentGeladen = true;

    var controller = 'AbortController' in window ? new AbortController() : null;
    var timeoutId = controller ? setTimeout(function () { controller.abort(); }, 2000) : null;

    fetch(url, { signal: controller ? controller.signal : undefined })
      .then(function (antwort) {
        if (timeoutId) clearTimeout(timeoutId);
        return antwort.ok ? antwort.json() : null;
      })
      .then(function (daten) {
        if (!daten) return;
        var folgemonat = folgemonatVon(daten.monat);
        var zeile = art.querySelector('[data-rolle="kontingent"]');
        var text = '';

        if (daten.status === 'frei') {
          text = 'Im ' + daten.monat + ' sind noch ' + daten.frei + ' von ' + daten.deckel +
            ' Proben frei – mehr gibt die Handarbeit nicht her.';
        } else if (daten.status === 'knapp') {
          text = daten.frei === 1
            ? 'Im ' + daten.monat + ' ist noch 1 Probe frei. Danach beginnt die Warteliste für den ' + folgemonat + '.'
            : 'Im ' + daten.monat + ' sind noch ' + daten.frei + ' Proben frei. Danach beginnt die Warteliste für den ' + folgemonat + '.';
        } else if (daten.status === 'voll') {
          text = 'Der ' + daten.monat + ' ist voll – ' + daten.deckel + ' Proben, mehr gibt die Handarbeit nicht her.';
        } else if (daten.status === 'pause') {
          text = 'Die Stilprobe macht gerade eine kurze Pause – schau bald wieder vorbei.';
        }
        if (text && zeile) zeile.textContent = text;

        var normal = art.querySelector('[data-rolle="normal"]');
        if (daten.status === 'voll') {
          var warteliste = art.querySelector('[data-rolle="warteliste"]');
          if (normal) normal.hidden = true;
          if (warteliste) warteliste.hidden = false;
          var monatSpan = art.querySelector('[data-rolle="wl-monat"]');
          var folgemonatSpan = art.querySelector('[data-rolle="wl-folgemonat"]');
          if (monatSpan) monatSpan.textContent = daten.monat;
          if (folgemonatSpan) folgemonatSpan.textContent = folgemonat;
        } else if (daten.status === 'pause') {
          var pause = art.querySelector('[data-rolle="pause"]');
          if (normal) normal.hidden = true;
          if (pause) pause.hidden = false;
        }
      })
      .catch(function () {
        if (timeoutId) clearTimeout(timeoutId);
        /* still: der statische Satz im HTML bleibt stehen */
      });
  }

  /* ---- Verdrahtung je Formular ---- */

  var spArt = felder.stilprobe && felder.stilprobe.artikel;
  if (spArt) {
    setupZaehler(spArt);
    var spMail = spArt.getAttribute('data-mail') || 'stilprobe@jgc-lumen.de';
    var spNormalBlock = spArt.querySelector('[data-rolle="normal"]');
    var spWlBlock = spArt.querySelector('[data-rolle="warteliste"]');
    var spNormalForm = spNormalBlock && spNormalBlock.querySelector('form');
    var spWlForm = spWlBlock && spWlBlock.querySelector('form');

    var spErfolg = 'Danke. Deine Texte sind angekommen – du bekommst gleich eine Bestätigung ' +
      'per Mail und binnen 48 Stunden deine zwei Fassungen. Absender: ' + spMail;
    var spErfolgWarteliste = 'Danke. Du stehst jetzt vorn auf der Liste: Sobald der nächste ' +
      'Monat beginnt, bekommst du deinen Platz angeboten, bevor er auf der Website erscheint.';

    var spEntwurf = setupEntwurf(spArt, spNormalForm, 'stilprobe-entwurf-v1',
      ['name', 'email', 'text_1', 'text_2', 'text_3', 'wunschthema', 'quelle']);

    setupFormular(spNormalForm, {
      block: spNormalBlock, mail: spMail,
      fehlerHinweis: 'Schick mir deine drei Texte einfach direkt an',
      erfolg: spErfolg, erfolgWarteliste: spErfolgWarteliste,
      entwurfLoeschen: spEntwurf.loeschen
    });
    setupFormular(spWlForm, {
      block: spWlBlock, mail: spMail,
      fehlerHinweis: 'Schreib mir einfach direkt an',
      erfolg: spErfolgWarteliste
    });
  }

  var egArt = felder.erstgespraech && felder.erstgespraech.artikel;
  if (egArt) {
    setupZaehler(egArt);
    var egMail = egArt.getAttribute('data-mail') || 'kontakt@jgc-lumen.de';
    var egBlock = egArt.querySelector('[data-rolle="normal"]');
    var egForm = egBlock && egBlock.querySelector('form');

    var egEntwurf = setupEntwurf(egArt, egForm, 'erstgespraech-entwurf-v1',
      ['name', 'email', 'telefon', 'anliegen', 'zeitfenster']);

    setupFormular(egForm, {
      block: egBlock, mail: egMail,
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
  Array.prototype.forEach.call(
    document.querySelectorAll('.weg-formular input[name="geladen_ts"]'),
    function (feld) { feld.value = String(Date.now()); }
  );
}

if (typeof window !== 'undefined') window.mountFormulare = mountFormulare;
