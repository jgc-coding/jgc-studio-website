/* ============================================================================
   formular-kern.js — die gemeinsame Logik der Formulare

   WARUM ES DIESE DATEI GIBT
     Bis zum 05.09.2026 stand dieselbe Formular-Logik zweimal im Repo: einmal in
     der-weg/formulare.js (die Overlays der Reise), einmal als Inline-Skript in
     der minifizierten Stilprobe-Unterseite. Der Kopf von formulare.js trug den
     Satz "Aenderungen dort und hier gemeinsam ziehen" — genau die Sorte
     Handpflege, die frueher oder spaeter auseinanderlaeuft. Beide Seiten laden
     jetzt diese Datei; dort bleibt nur, was wirklich seitenspezifisch ist.

   WAS HIER DRIN IST (alles arbeitet auf einem "Wurzel"-Element, meist der
   <article class="weg-formular">, und dem <form> darin):
     setupZaehler   — Zeichenzaehler unter jeder Textflaeche
     setupEntwurf   — Entwurfsspeicher im Browser (Befund V5)
     setupFormular  — Absenden per fetch, Erfolg, Fehlerpfad mit Ausweichweg
     ladeKontingent — Badge und Warteliste-/Pause-Zweig der Stilprobe
     setzeGeladenZeit — Startzeit fuer den Spam-Check des Servers

   VERTRAG DER FELDER UND ANTWORTEN: docs/stilprobe/schnittstelle.md und
   docs/erstgespraech/schnittstelle.md. Endpunkte und Mailadressen stehen als
   action- bzw. data-Attribute im HTML — diese Datei ist pfadfrei, damit die
   Unterseite relativ (senden.php) und die Reise absolut (/stilprobe/senden.php)
   rufen kann, so wie es der Vertrag vorsieht.

   DOM-ABSPRACHE: die Rollen im Markup heissen auf beiden Seiten gleich
   (data-rolle="fehler|normal|warteliste|pause|kontingent|wl-monat|
   wl-folgemonat|entwurf-hinweis|entwurf-zeit|entwurf-verwerfen").
   ========================================================================== */

(function (global) {
  'use strict';

  var MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

  var sanft = !global.matchMedia || !global.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function formatDE(zahl) {
    return zahl.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function folgemonatVon(monat) {
    var index = MONATE.indexOf(monat);
    return index === -1 ? 'nächsten Monat' : MONATE[(index + 1) % 12];
  }

  function speicherVerfuegbar() {
    try {
      var probe = '__test__';
      global.localStorage.setItem(probe, probe);
      global.localStorage.removeItem(probe);
      return true;
    } catch (e) {
      // Privater Modus, volle Quote oder Speicher gesperrt: dann laeuft das
      // Formular einfach weiter, nur ohne Entwurf.
      return false;
    }
  }

  function entwerte(text) {
    return String(text).replace(/[&<>"]/g, function (z) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[z];
    });
  }

  /* ==================================================================
     Fehlerpfad: menschlicher Satz oben, technische Zeile darunter.

     Die Regel dahinter (globale Konventionen): ein Rohfehler ist nie die
     Hauptmeldung, aber die Ursache darf auch nicht verschwinden — sonst
     ist ein Nutzer-Screenshot spaeter wertlos. Deshalb zweistufig, mit
     einer kurzen ID, die zugleich im Browser-Log steht.
     ================================================================== */

  function uhrzeit() {
    var d = new Date();
    return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ' Uhr';
  }

  function neueFehlerId() {
    return (Date.now() % 46656).toString(36) + Math.floor(Math.random() * 1296).toString(36);
  }

  /** Beschriftung eines Feldes — fuer den kopierten Mailtext. */
  function beschriftung(el, form) {
    var label = null;
    if (el.id) label = form.ownerDocument.querySelector('label[for="' + el.id + '"]');
    if (!label && el.closest) label = el.closest('label');
    var text = label ? label.textContent.replace(/\s+/g, ' ').trim() : '';
    // Lange Einwilligungstexte taugen nicht als Zeilenkopf: dann der Feldname.
    if (!text || text.length > 60) {
      text = el.name.charAt(0).toUpperCase() + el.name.slice(1).replace(/_/g, ' ');
    }
    return text.replace(/[:：]\s*$/, '');
  }

  /** Alle ausgefuellten Angaben als schlichter Text, fertig zum Einfuegen. */
  function angabenAlsText(form) {
    var zeilen = [];
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name || el.name === 'firma' || el.name === 'geladen_ts') return;
      if (el.type === 'hidden' || el.type === 'submit' || el.type === 'button') return;
      var wert;
      if (el.type === 'checkbox') wert = el.checked ? 'ja' : '';
      else wert = (el.value || '').trim();
      if (wert === '') return;
      // Endet die Beschriftung schon auf ein Satzzeichen ("Wie heisst du?"),
      // kaeme mit einem Doppelpunkt "Wie heisst du?:" heraus.
      var kopf = beschriftung(el, form);
      zeilen.push(kopf + (/[?!:.]$/.test(kopf) ? '' : ':') + '\n' + wert);
    });
    return zeilen.join('\n\n');
  }

  /** Text in die Zwischenablage legen; Rueckgabe: Promise<boolean>. */
  function inDieZwischenablage(text) {
    if (global.navigator && global.navigator.clipboard && global.navigator.clipboard.writeText) {
      return global.navigator.clipboard.writeText(text).then(function () { return true; },
        function () { return altModusKopieren(text); });
    }
    return Promise.resolve(altModusKopieren(text));
  }

  /** Rueckfallweg fuer Browser ohne Zwischenablage-Schnittstelle. */
  function altModusKopieren(text) {
    try {
      var feld = document.createElement('textarea');
      feld.value = text;
      feld.setAttribute('readonly', '');
      feld.style.position = 'absolute';
      feld.style.left = '-9999px';
      document.body.appendChild(feld);
      feld.select();
      var geklappt = document.execCommand && document.execCommand('copy');
      document.body.removeChild(feld);
      return !!geklappt;
    } catch (e) {
      return false;
    }
  }

  /**
   * Baut die Fehlerbox: Satz, Ausweichadresse, Kopierknopf, Diagnosezeile.
   * `diagnose` ist die technische Kurzursache ("HTTP 404", "Zeitüberschreitung").
   */
  function zeigeFehler(form, opts, diagnose) {
    var box = form.querySelector('[data-rolle="fehler"]');
    if (!box) return;

    var id = neueFehlerId();
    var text = angabenAlsText(form);
    var betreff = encodeURIComponent(opts.betreff || 'Anfrage über die Website');
    var adresse = 'mailto:' + opts.mail + '?subject=' + betreff;
    // Kurze Anfragen wandern gleich mit in die Mail; lange (die drei Texte der
    // Stilprobe) sprengen jede mailto-Adresse — dafuer ist der Kopierknopf da.
    if (text && text.length <= 1200) adresse += '&body=' + encodeURIComponent(text);

    box.innerHTML =
      '<p class="weg-formular__satz">Das hat gerade nicht geklappt. ' + opts.fehlerHinweis + ' ' +
      '<a href="' + entwerte(adresse) + '">' + entwerte(opts.mail) + '</a>' +
      ' – der Weg ist genauso gut. Deine Eingaben bleiben hier stehen.</p>' +
      '<button type="button" class="weg-formular__kopieren" data-rolle="kopieren">Angaben kopieren</button>' +
      '<p class="weg-formular__diagnose">Technische Ursache: ' + entwerte(diagnose) +
      ' · ' + uhrzeit() + ' · ID ' + id + '</p>';
    box.hidden = false;

    // Technische Details zusaetzlich ins Log — nie mit Inhalten aus dem
    // Formular, nur Ursache und ID.
    if (global.console && global.console.warn) {
      global.console.warn('[JGC Lumen] [WARN] Formular ' + (opts.name || '?') +
        ' nicht abgeschickt: ' + diagnose + ' · ID ' + id);
    }

    var knopf = box.querySelector('[data-rolle="kopieren"]');
    if (knopf) {
      knopf.addEventListener('click', function () {
        inDieZwischenablage(angabenAlsText(form)).then(function (geklappt) {
          knopf.textContent = geklappt
            ? 'Angaben kopiert – jetzt in die Mail einfügen.'
            : 'Kopieren ging nicht – bitte von Hand markieren.';
          // Auch nach einem Fehlschlag zuruecksetzen: sonst bleibt der Knopf
          // fuer immer beschriftet wie eine Fehlermeldung und ein zweiter
          // Versuch sieht aus, als sei er nicht angekommen.
          setTimeout(function () { knopf.textContent = 'Angaben kopieren'; }, geklappt ? 6000 : 8000);
        });
      });
    }

    if (box.scrollIntoView) box.scrollIntoView({ block: 'center', behavior: sanft ? 'smooth' : 'auto' });
    if (box.focus) box.focus({ preventScroll: true });
  }

  function ersetzeDurchErfolg(block, text) {
    block.innerHTML = '<div class="weg-formular__erfolg" role="status"><p>' + entwerte(text) + '</p></div>';
  }

  /* ==================================================================
     Absenden
     ================================================================== */

  function setupFormular(form, opts) {
    if (!form || !global.fetch) return;
    var knopf = form.querySelector('button[type="submit"]');
    var beschriftungKnopf = knopf ? knopf.textContent : '';

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = form.querySelector('[data-rolle="fehler"]');
      if (box) box.hidden = true;

      var daten = new FormData(form);
      var controller = 'AbortController' in global ? new AbortController() : null;
      var abgelaufen = false;
      var timeoutId = controller ? setTimeout(function () {
        abgelaufen = true;
        controller.abort();
      }, 10000) : null;

      if (knopf) { knopf.disabled = true; knopf.textContent = 'Wird gesendet …'; }

      fetch(form.getAttribute('action'), {
        method: 'POST',
        body: daten,
        signal: controller ? controller.signal : undefined
      })
        .then(function (antwort) {
          if (timeoutId) clearTimeout(timeoutId);
          // Die Ursache wandert ab hier IM Fehler mit, statt verworfen zu werden.
          if (!antwort.ok) throw new Error('HTTP ' + antwort.status);
          return antwort.json().catch(function () { throw new Error('Antwort unlesbar'); });
        })
        .then(function (json) {
          if (!json || json.status !== 'ok') {
            throw new Error('Antwort ohne ok' + (json && json.status ? ' (' + json.status + ')' : ''));
          }
          if (opts.entwurfLoeschen) opts.entwurfLoeschen();
          if (json.zustand === 'warteliste' && opts.erfolgWarteliste) {
            ersetzeDurchErfolg(opts.block, opts.erfolgWarteliste);
          } else {
            ersetzeDurchErfolg(opts.block, opts.erfolg);
          }
        })
        .catch(function (fehler) {
          if (timeoutId) clearTimeout(timeoutId);
          var diagnose;
          if (abgelaufen) diagnose = 'Zeitüberschreitung nach 10 s';
          else if (fehler && /^(HTTP |Antwort )/.test(fehler.message)) diagnose = fehler.message;
          else diagnose = 'Verbindung fehlgeschlagen';
          zeigeFehler(form, opts, diagnose);
          if (knopf) { knopf.disabled = false; knopf.textContent = beschriftungKnopf; }
        });
    });
  }

  /* ==================================================================
     Zeichenzaehler — jede Textflaeche mit zugehoeriger *-zaehler-Zeile
     ================================================================== */

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

  /* ==================================================================
     Entwurfsspeicher (Befund V5)

     Das Stilprobe-Formular verlangt drei Texte von je 200 bis 6.000
     Zeichen. Ohne diesen Speicher vernichtet ein versehentlicher Reload
     alles — und die Anfrage kommt nie an, ohne dass es jemand merkt.
     Der Entwurf bleibt im Browser der Besucherin und wird nach dem
     erfolgreichen Absenden geloescht.

     Beide Seiten benutzen denselben Schluessel: ein angefangener Entwurf
     wandert damit zwischen Unterseite und Reise mit (gleiche Origin).
     ================================================================== */

  function setupEntwurf(art, form, schluessel, feldnamen) {
    function loeschen() {
      if (!speicherVerfuegbar()) return;
      try { global.localStorage.removeItem(schluessel); } catch (e) {}
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
        if (etwasDrin) global.localStorage.setItem(schluessel, JSON.stringify(daten));
        else global.localStorage.removeItem(schluessel);
      } catch (e) { /* Quote voll: Formularinhalt bleibt, nur ohne Entwurf. */ }
    }

    function wiederherstellen() {
      var roh = null;
      try { roh = global.localStorage.getItem(schluessel); } catch (e) { return; }
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

  /* ==================================================================
     Kontingent-Badge (nur Stilprobe)

     Fehler bleiben still: der statische Satz steht schon im HTML, und ein
     fehlender Badge ist kein Grund, jemandem eine Fehlermeldung zu zeigen.
     Wortlaute: docs/stilprobe/schnittstelle.md.
     ================================================================== */

  function ladeKontingent(art) {
    if (!global.fetch || art.getAttribute('data-kontingent-geladen') === 'ja') return;
    var url = art.getAttribute('data-kontingent');
    if (!url) return;
    art.setAttribute('data-kontingent-geladen', 'ja');

    var controller = 'AbortController' in global ? new AbortController() : null;
    var timeoutId = controller ? setTimeout(function () { controller.abort(); }, 2000) : null;

    fetch(url, { signal: controller ? controller.signal : undefined })
      .then(function (antwort) {
        if (timeoutId) clearTimeout(timeoutId);
        return antwort.ok ? antwort.json() : null;
      })
      .then(function (daten) {
        if (!daten) return;
        var folgemonat = folgemonatVon(daten.monat);
        // Dokumentweit gesucht, nicht nur im Artikel: in der Reise steht der
        // Badge im Formular-Overlay, auf der Unterseite oben im Vorspann.
        var zeilen = document.querySelectorAll('[data-rolle="kontingent"]');
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
        if (text) {
          Array.prototype.forEach.call(zeilen, function (z) { z.textContent = text; });
        }

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

  /** Mindest-Ausfuellzeit: Startzeit fuer den Spam-Check des Servers. */
  function setzeGeladenZeit(wurzel) {
    Array.prototype.forEach.call(
      (wurzel || document).querySelectorAll('input[name="geladen_ts"]'),
      function (feld) { feld.value = String(Date.now()); }
    );
  }

  global.formularKern = {
    setupZaehler: setupZaehler,
    setupEntwurf: setupEntwurf,
    setupFormular: setupFormular,
    ladeKontingent: ladeKontingent,
    setzeGeladenZeit: setzeGeladenZeit,
    angabenAlsText: angabenAlsText
  };
})(typeof window !== 'undefined' ? window : this);
