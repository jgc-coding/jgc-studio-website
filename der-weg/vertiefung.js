/* ============================================================================
   vertiefung.js — "Mehr dazu" fuer die Scroll-Reise

   Die Reise zeigt je Station drei bis vier Zeilen. Wer mehr wissen will, bekam
   das bisher nur auf der Lesefassung. Dieses Modul haengt unter jede Station
   einen Knopf, der die Langfassung als Feld in der Bildschirmmitte oeffnet.

   ANSCHLUSS
     mountVertiefung({ stationen: ['anflug', 'werkzeug', …] })
   Die Reihenfolge muss der Reihenfolge der Sektionen in mountScrollWorld
   entsprechen — im Idealfall aus derselben Konfiguration abgeleitet, damit es
   keine zweite Liste gibt, die auseinanderlaufen kann.

   Die Langfassungen stehen als Markup in der Seite:
     <div id="vertiefungen">
       <article class="vertiefung" data-station="anflug"> … </article>
     </div>
   Der Block wird per CSS ausgeblendet, sobald JavaScript laeuft (`.js`), steht
   aber im ausgelieferten HTML — fuer Suchmaschinen und fuer den Fall ohne
   JavaScript, wo die Langfassungen dann einfach als Lesetext untereinander
   stehen. Deshalb Markup in der Seite und keine Zeichenketten hier drin.

   WARUM DER FILM STEHENBLEIBT, SOLANGE DAS FELD OFFEN IST
     Der Wunsch war: weiterscrollen laesst das Feld sanft verschwinden. Genau so
     ist es. Waehrend es offen ist, haelt die Seite aber an — sonst spult die
     Kamera hinter einem Textfeld weiter, und ein Feld, dessen Inhalt selbst
     laenger als der Schirm ist (Station "Der Weg"), waere ueberhaupt nicht
     lesbar. Die Regel ist deshalb: erst scrollt der Text im Feld; ist er zu
     Ende und man scrollt weiter, geht das Feld zu und die Reise laeuft weiter.
     Dazu Schliessknopf, Escape und Klick auf den Hintergrund.
   ========================================================================== */

function mountVertiefung(optionen) {
  var cfg = optionen || {};
  var ids = cfg.stationen || [];
  var quelle = document.querySelector(cfg.quelle || '#vertiefungen');
  var kopien = Array.prototype.slice.call(document.querySelectorAll('.sw-copy'));
  if (!quelle || !kopien.length || !ids.length) return;

  var sanft = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Huelle einmal bauen, Inhalt beim Oeffnen einsetzen ----
  var huelle = document.createElement('div');
  huelle.className = 'weg-tief';
  huelle.hidden = true;
  huelle.innerHTML =
    '<div class="weg-tief__grund"></div>' +
    '<div class="weg-tief__feld" role="dialog" aria-modal="true">' +
      '<button type="button" class="weg-tief__zu" aria-label="Feld schliessen">' +
        '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5.5 5.5l9 9M14.5 5.5l-9 9"/></svg>' +
      '</button>' +
      '<div class="weg-tief__rolle" tabindex="0">' +
        '<div class="weg-tief__inhalt"></div>' +
        '<p class="weg-tief__fuss">Weiterscrollen schließt dieses Feld.</p>' +
      '</div>' +
    '</div>';
  document.body.appendChild(huelle);

  var feld = huelle.querySelector('.weg-tief__feld');
  var rolle = huelle.querySelector('.weg-tief__rolle');
  var inhalt = huelle.querySelector('.weg-tief__inhalt');

  var offen = false;
  var ausloeser = null;
  var merkeY = 0;
  var radSumme = 0;
  var letzteY = 0;
  var randY = null;
  var aufraeumer = 0;

  function oeffne(index, knopf) {
    var artikel = quelle.querySelector('[data-station="' + ids[index] + '"]');
    if (!artikel || offen) return;
    ausloeser = knopf;
    inhalt.replaceChildren(artikel.cloneNode(true));
    var titel = inhalt.querySelector('h2');
    feld.setAttribute('aria-label', titel ? titel.textContent.trim() : 'Mehr dazu');
    clearTimeout(aufraeumer);
    huelle.hidden = false;
    rolle.scrollTop = 0;
    // Ein Bildaufbau dazwischen erzwingen: sonst gilt der Startzustand des
    // Uebergangs als nie dagewesen und das Feld springt ohne Blende auf.
    void huelle.offsetWidth;
    huelle.classList.add('ist-offen');
    offen = true;
    radSumme = 0; randY = null;
    merkeY = window.scrollY || window.pageYOffset;
    knopf.setAttribute('aria-expanded', 'true');
    rolle.focus({ preventScroll: true });
    lauscher(true);
  }

  function schliesse() {
    if (!offen) return;
    offen = false;
    huelle.classList.remove('ist-offen');
    lauscher(false);
    if (ausloeser) {
      ausloeser.setAttribute('aria-expanded', 'false');
      // preventScroll: der Knopf sitzt in einer festen Ebene, ein Scroll dorthin
      // wuerde die Kamera versetzen.
      ausloeser.focus({ preventScroll: true });
      ausloeser = null;
    }
    clearTimeout(aufraeumer);
    aufraeumer = setTimeout(function () {
      if (!offen) { huelle.hidden = true; inhalt.replaceChildren(); }
    }, sanft ? 320 : 0);
  }

  // Darf das Feld diese Scrollbewegung selbst verbrauchen? Nur dann laesst der
  // Lauscher sie durch; sonst haelt er die Seite an und zaehlt Richtung Zugehen.
  function feldScrolltSelbst(ziel, runter) {
    if (!rolle.contains(ziel)) return false;
    var rest = runter
      ? rolle.scrollHeight - rolle.clientHeight - rolle.scrollTop
      : rolle.scrollTop;
    return rest > 1;
  }

  function beiRad(e) {
    if (!offen) return;
    if (feldScrolltSelbst(e.target, e.deltaY > 0)) { radSumme = 0; return; }
    e.preventDefault();
    radSumme += Math.abs(e.deltaY);
    if (radSumme > 60) schliesse();
  }

  function beiWischStart(e) {
    if (!offen || !e.touches.length) return;
    letzteY = e.touches[0].clientY;
    randY = null;
  }

  function beiWisch(e) {
    if (!offen || !e.touches.length) return;
    var y = e.touches[0].clientY;
    var runter = y < letzteY;       // Finger nach oben = weiter nach unten lesen
    if (feldScrolltSelbst(e.target, runter)) { randY = null; letzteY = y; return; }
    e.preventDefault();
    // Bezugspunkt ist die Stelle, an der das Feld aufgehoert hat mitzugehen —
    // NICHT die aktuelle Fingerposition. Sonst faellt die erste Bewegung unter
    // den Tisch: ein Wisch auf dem Hintergrund setzte den Bezugspunkt auf sich
    // selbst und kam nie ueber die Schwelle (gemessen: hielt die Seite an, ging
    // aber nicht zu). Und er darf auch nicht der Beginn des Wisches sein, sonst
    // schnappt das Feld in dem Moment zu, in dem man das Textende erreicht.
    if (randY === null) randY = letzteY;
    letzteY = y;
    if (Math.abs(y - randY) > 60) schliesse();
  }

  // Auffangnetz fuer alles, was die beiden Lauscher nicht sehen (Tastatur,
  // Scrollbalken, Sprungmarken): bewegt sich die Seite trotzdem, ist das die
  // Geste "weiter" — Feld zu, Reise laeuft.
  function beiSeitenScroll() {
    if (offen && Math.abs((window.scrollY || window.pageYOffset) - merkeY) > 4) schliesse();
  }

  function beiTaste(e) {
    if (!offen) return;
    if (e.key === 'Escape') { e.preventDefault(); schliesse(); return; }
    if (e.key !== 'Tab') return;
    var ziele = feld.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]');
    if (!ziele.length) return;
    var erste = ziele[0], letzte = ziele[ziele.length - 1];
    if (e.shiftKey && document.activeElement === erste) { e.preventDefault(); letzte.focus(); }
    else if (!e.shiftKey && document.activeElement === letzte) { e.preventDefault(); erste.focus(); }
  }

  function lauscher(an) {
    var m = an ? 'addEventListener' : 'removeEventListener';
    // passive:false ist Pflicht — ohne das darf preventDefault die Seite nicht
    // anhalten, und der Film liefe hinter dem offenen Feld weiter.
    window[m]('wheel', beiRad, { passive: false });
    window[m]('touchstart', beiWischStart, { passive: true });
    window[m]('touchmove', beiWisch, { passive: false });
    window[m]('scroll', beiSeitenScroll, { passive: true });
    document[m]('keydown', beiTaste);
  }

  huelle.querySelector('.weg-tief__grund').addEventListener('click', schliesse);
  huelle.querySelector('.weg-tief__zu').addEventListener('click', schliesse);

  // ---- Knopf an jede Station haengen ----
  //
  // Er sitzt in EINER Zeile mit dem Kleintext ueber der Ueberschrift, rechts
  // aussen. Zwei Gruende: er kostet dort rund 10 px statt einer ganzen Zeile
  // (37 px), und der gewonnene Platz geht direkt ans Bild — die Mindesthoehe
  // des Textstreifens haengt an der laengsten Station. Ausserdem liest sich
  // "Abschnittsname links, Aktion rechts" als Kopfzeile, nicht als Nachtrag.
  // Bricht die Zeile auf schmalen Schirmen um, rutscht der Knopf von selbst
  // darunter — deshalb `flex-wrap` in der Regel dazu.
  //
  // Das Zeichen ist ein PLUS, kein Pfeil nach unten. Ein Pfeil nach unten
  // verspricht Aufklappen an Ort und Stelle; hier oeffnet sich ein Feld in der
  // Bildschirmmitte. Das Plus ist ausserdem genau das Zeichen, das die Seite
  // unten bei den haeufigen Fragen fuer dieselbe Handlung benutzt.
  kopien.forEach(function (kopie, i) {
    var id = ids[i];
    if (!id || !quelle.querySelector('[data-station="' + id + '"]')) return;
    var knopf = document.createElement('button');
    knopf.type = 'button';
    knopf.className = 'weg-mehr';
    knopf.setAttribute('aria-haspopup', 'dialog');
    knopf.setAttribute('aria-expanded', 'false');
    // "dazu" faellt auf schmalen Schirmen per CSS weg: der laengste Kleintext
    // ("Für Coaches, Trainer, Mentoren", 269 px) und der volle Knopf passen dort
    // nicht nebeneinander, und eine umgebrochene Kopfzeile bei zwei von sieben
    // Stationen sieht unaufgeraeumt aus. "Mehr +" bleibt eindeutig.
    knopf.innerHTML = '<span>Mehr<span class="weg-mehr__zusatz"> dazu</span></span>'
      + '<i aria-hidden="true">+</i>';
    knopf.addEventListener('click', function () { oeffne(i, knopf); });
    // Bewusst KEIN pointer-events:auto: der Knopf erbt damit den Zustand seiner
    // Station und ist nur anklickbar, solange die auch sichtbar ist.
    var augenbraue = kopie.querySelector('.sw-copy__eyebrow');
    if (augenbraue) {
      var zeile = document.createElement('div');
      zeile.className = 'weg-kopfzeile';
      kopie.insertBefore(zeile, augenbraue);
      zeile.appendChild(augenbraue);
      zeile.appendChild(knopf);
    } else {
      kopie.appendChild(knopf);   // Station ohne Kleintext: wie bisher unten
    }
  });
}

if (typeof window !== 'undefined') window.mountVertiefung = mountVertiefung;
