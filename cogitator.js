/* ============================================================
   COGITATOR INQUISITORIAL — Codex Tenebrarum
   Effets CRT, séquence d'initialisation et terminal de commande.
   Fonctionne hors ligne (ouverture directe des fichiers .html).
   ============================================================ */
(function () {
  "use strict";

  var doc = document, html = doc.documentElement;

  /* ---------- Préférences (stockage local, facultatif) ---------- */
  function lire(k, def) { try { var v = localStorage.getItem("cogi." + k); return v === null ? def : v; } catch (e) { return def; } }
  function ecrire(k, v) { try { localStorage.setItem("cogi." + k, v); } catch (e) {} }
  function lireS(k) { try { return sessionStorage.getItem("cogi." + k); } catch (e) { return null; } }
  function ecrireS(k, v) { try { sessionStorage.setItem("cogi." + k, v); } catch (e) {} }

  var reduit = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  html.setAttribute("data-phos", lire("phos", "vert"));
  html.setAttribute("data-crt", lire("crt", "on"));
  var TAILLES = ["normal", "grand", "tres-grand"], NOM_TAILLE = { normal: "A", grand: "A+", "tres-grand": "A++" };
  html.setAttribute("data-taille", lire("taille", "normal"));
  function regleTaille(t) { if (TAILLES.indexOf(t) < 0) t = "normal"; html.setAttribute("data-taille", t); ecrire("taille", t); var b = doc.querySelector(".cogi-taille"); if (b) b.textContent = "TEXTE " + NOM_TAILLE[t]; }
  function regleCrt(v) { html.setAttribute("data-crt", v); ecrire("crt", v); var b = doc.querySelector(".cogi-crt"); if (b) b.textContent = v === "off" ? "EFFETS COUPÉS" : "EFFETS CRT"; }

  /* ---------- Utilitaires ---------- */
  function norm(s) {
    return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[’'`]/g, " ").replace(/œ/g, "oe").replace(/æ/g, "ae");
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function el(tag, cls, txt) { var e = doc.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  var page = (location.pathname.split("/").pop() || "index.html");

  /* ---------- Application installable (uniquement une fois le site en ligne) ---------- */
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
  }

  /* ---------- Modules de contenu (emblèmes, lectures, glossaire, classifiés) ---------- */
  (function () { var s = doc.createElement("script"); s.src = "codex.js"; s.defer = true; doc.body.appendChild(s); })();

  /* ---------- Effets du tube ---------- */
  doc.body.appendChild(el("div", "crt-noise"));
  doc.body.appendChild(el("div", "crt-roll"));

  /* ---------- Date impériale & pensée du jour ---------- */
  var PENSEES = [
    "Un esprit qui doute est une porte entrouverte.",
    "La curiosité a précédé chaque hérésie.",
    "Chaque recherche est consignée. Chaque consignation est examinée.",
    "Il n'existe pas de lecture innocente.",
    "Les archives ne mentent pas ; les lecteurs, si.",
    "Le savoir est un fardeau : qu'il soit porté par les dignes.",
    "La machine sert. Le serviteur obéit. L'Empereur protège.",
    "Un dossier ouvert est un serment prononcé.",
    "Ne demande pas ce que dit l'archive. Demande pourquoi tu veux le savoir.",
    "L'oubli est une miséricorde que l'Inquisition n'accorde pas.",
    "Un sous-secteur qui ne répond plus n'est pas un sous-secteur silencieux.",
    "Apaise l'Esprit de la Machine avant de l'interroger."
  ];
  function dateImperiale() {
    var d = new Date(), debut = new Date(d.getFullYear(), 0, 1), fin = new Date(d.getFullYear() + 1, 0, 1);
    var frac = Math.floor((d - debut) / (fin - debut) * 1000);
    var an = String(d.getFullYear() % 1000).padStart(3, "0");
    return "0 " + String(frac).padStart(3, "0") + " " + an + ".M42";
  }

  /* =========================================================
     AMBIANCE SONORE & LECTURE VOCALE (désactivées par défaut)
     ========================================================= */
  var AC = null, bourdon = null, sonActif = lire("son", "off") === "on";
  function ctx() {
    try {
      if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
      if (AC.state === "suspended") AC.resume();
      return AC;
    } catch (e) { return null; }
  }
  function bip(f, d, type, vol) {
    if (!sonActif) return; var a = ctx(); if (!a || a.state !== "running") return;
    var o = a.createOscillator(), g = a.createGain(), t = a.currentTime;
    o.type = type || "square"; o.frequency.value = f;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol || 0.035, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + d + 0.02);
  }
  var bruit = null;
  function clic() {
    if (!sonActif) return; var a = ctx(); if (!a || a.state !== "running") return;
    if (!bruit) { bruit = a.createBuffer(1, a.sampleRate * 0.03, a.sampleRate); var c = bruit.getChannelData(0); for (var i = 0; i < c.length; i++) c[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / c.length, 3); }
    var s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    s.buffer = bruit; f.type = "highpass"; f.frequency.value = 1800 + Math.random() * 1200; g.gain.value = 0.16;
    s.connect(f); f.connect(g); g.connect(a.destination); s.start();
  }
  function demarrerBourdon() {
    var a = ctx(); if (!a || bourdon) return;
    var g = a.createGain(); g.gain.value = 0; g.connect(a.destination);
    var o1 = a.createOscillator(), o2 = a.createOscillator(), lfo = a.createOscillator(), lg = a.createGain();
    o1.type = "sine"; o1.frequency.value = 50; o2.type = "triangle"; o2.frequency.value = 100.6;
    lfo.frequency.value = 0.15; lg.gain.value = 0.004; lfo.connect(lg); lg.connect(g.gain);
    var g2 = a.createGain(); g2.gain.value = 0.35; o2.connect(g2); g2.connect(g); o1.connect(g);
    // sifflement haute fréquence du tube cathodique (très discret)
    var o3 = a.createOscillator(), g3 = a.createGain(); o3.frequency.value = 15625; g3.gain.value = 0.0015; o3.connect(g3); g3.connect(a.destination);
    [o1, o2, o3, lfo].forEach(function (o) { o.start(); });
    g.gain.linearRampToValueAtTime(0.012, a.currentTime + 1.5);
    bourdon = { stop: function () { g.gain.linearRampToValueAtTime(0, a.currentTime + 0.4); g3.gain.value = 0; setTimeout(function () { [o1, o2, o3, lfo].forEach(function (o) { try { o.stop(); } catch (e) {} }); }, 500); } };
  }
  function regleSon(on) {
    sonActif = on; ecrire("son", on ? "on" : "off");
    if (on) { demarrerBourdon(); bip(660, 0.08); setTimeout(function () { bip(990, 0.1); }, 90); }
    else if (bourdon) { bourdon.stop(); bourdon = null; }
    var b = doc.querySelector(".cogi-son"); if (b) b.textContent = on ? "SON ACTIF" : "SON COUPÉ";
  }
  // Les navigateurs exigent un geste de l'utilisateur avant de produire du son
  if (sonActif) {
    var reveil = function () { demarrerBourdon(); doc.removeEventListener("pointerdown", reveil); doc.removeEventListener("keydown", reveil); };
    doc.addEventListener("pointerdown", reveil); doc.addEventListener("keydown", reveil);
  }

  // Lecture vocale « servitor »
  var lecture = null;
  function blocsALire() {
    var racine = doc.querySelector("main.wrap") || doc.querySelector(".wrap"); if (!racine) return [];
    var blocs = [];
    var titre = doc.querySelector(".page-hero h1"), sous = doc.querySelector(".page-hero .tagline");
    if (titre) blocs.push({ el: titre, txt: "Dossier : " + titre.textContent });
    if (sous) blocs.push({ el: sous, txt: sous.textContent });
    racine.querySelectorAll("h2, h3, h4, p, li, blockquote").forEach(function (e) {
      if (e.closest(".toc, .lectures, .cards, #cogi-term, .classifie-corps[hidden], .classifie-voile, .stat-grid, nav")) return;
      if (e.tagName === "LI" && e.querySelector("p")) return;
      if (e.parentElement && e.parentElement.closest("blockquote") && e.tagName !== "BLOCKQUOTE") return;
      var t = e.textContent.replace(/\s+/g, " ").trim(); if (t.length < 2) return;
      blocs.push({ el: e, txt: t });
    });
    return blocs;
  }
  function voixFr() {
    var v = (window.speechSynthesis && speechSynthesis.getVoices()) || [];
    return v.filter(function (x) { return /^fr/i.test(x.lang); }).sort(function (a, b) { return (/male|homme|thomas|paul|henri/i.test(b.name) ? 1 : 0) - (/male|homme|thomas|paul|henri/i.test(a.name) ? 1 : 0); })[0] || null;
  }
  function arreterLecture() {
    if (!window.speechSynthesis) return;
    lecture = null; speechSynthesis.cancel();
    doc.querySelectorAll(".lecture-en-cours").forEach(function (e) { e.classList.remove("lecture-en-cours"); });
    var b = doc.querySelector(".cogi-voix"); if (b) b.textContent = "LECTURE SERVITOR";
  }
  function lireDossier() {
    if (!window.speechSynthesis) { ln("SYNTHÈSE VOCALE INDISPONIBLE SUR CE NAVIGATEUR.", "err"); return false; }
    arreterLecture();
    var blocs = blocsALire(); if (!blocs.length) { ln("RIEN À LIRE DANS CE DOSSIER.", "err"); return false; }
    lecture = { i: 0, blocs: blocs };
    var b = doc.querySelector(".cogi-voix"); if (b) b.textContent = "■ ARRÊTER LA LECTURE";
    (function suivant() {
      if (!lecture || lecture.i >= lecture.blocs.length) { arreterLecture(); return; }
      var bl = lecture.blocs[lecture.i++];
      doc.querySelectorAll(".lecture-en-cours").forEach(function (e) { e.classList.remove("lecture-en-cours"); });
      bl.el.classList.add("lecture-en-cours");
      bl.el.scrollIntoView({ block: "center", behavior: reduit ? "auto" : "smooth" });
      var u = new SpeechSynthesisUtterance(bl.txt);
      u.lang = "fr-FR"; var v = voixFr(); if (v) u.voice = v;
      u.pitch = 0.45; u.rate = 0.92; u.volume = 1;
      u.onend = function () { if (lecture) setTimeout(suivant, 180); };
      u.onerror = function () { arreterLecture(); };
      speechSynthesis.speak(u);
    })();
    return true;
  }
  if (window.speechSynthesis) { speechSynthesis.getVoices(); window.addEventListener("beforeunload", function () { speechSynthesis.cancel(); }); }

  var inner = doc.querySelector(".site-header .inner");
  if (inner) {
    var st = el("div", "cogi-status");
    var jour = Math.floor(Date.now() / 864e5);
    var grade = lire("grade", null);
    try { grade = localStorage.getItem("cogi.grade"); } catch (e) { grade = null; }
    st.innerHTML = '<span>COGITATOR MK.XIV · DATE <b>' + dateImperiale() + '</b> · ACCRÉDITATION <a class="cogi-grade" href="examen.html">' +
      esc(grade ? grade.toUpperCase() : "NON ÉVALUÉE") + '</a> · <button type="button" class="cogi-son">' + (sonActif ? "SON ACTIF" : "SON COUPÉ") + '</button>' +
      (doc.querySelector("main .codex-section, main p") ? ' · <button type="button" class="cogi-voix">LECTURE SERVITOR</button>' : "") +
      ' · <button type="button" class="cogi-taille" title="Taille du texte">TEXTE ' + NOM_TAILLE[html.getAttribute("data-taille")] + '</button>' +
      ' · <button type="button" class="cogi-crt" title="Lignes de balayage, grain et scintillement">' + (html.getAttribute("data-crt") === "off" ? "EFFETS COUPÉS" : "EFFETS CRT") + '</button></span>' +
      '<span class="pensee">PENSÉE DU JOUR : ' + esc(PENSEES[jour % PENSEES.length]) + '</span>';
    inner.appendChild(st);
    st.querySelector(".cogi-son").addEventListener("click", function () { regleSon(!sonActif); });
    st.querySelector(".cogi-taille").addEventListener("click", function () { var t = html.getAttribute("data-taille"); regleTaille(TAILLES[(TAILLES.indexOf(t) + 1) % TAILLES.length]); });
    st.querySelector(".cogi-crt").addEventListener("click", function () { regleCrt(html.getAttribute("data-crt") === "off" ? "on" : "off"); });
    var bv = st.querySelector(".cogi-voix");
    if (bv) bv.addEventListener("click", function () { if (lecture) arreterLecture(); else lireDossier(); });
  }

  /* ---------- Séquence d'initialisation (une fois par session) ---------- */
  function boot() {
    if (lireS("boot") || reduit) return;
    ecrireS("boot", "1");
    var b = el("div"); b.id = "cogi-boot"; b.setAttribute("role", "presentation");
    doc.body.appendChild(b);
    var L = [
      ["", "ADEPTUS MECHANICUS — COGITATOR SÉRIE MK.XIV"],
      ["", "INVOCATION DES RITES D'ÉVEIL"],
      ["", "> ONCTION DES CONDUITS ......................... "],
      ["ok", "  FAIT"],
      ["", "> LITANIE D'ALLUMAGE DU TUBE ................... "],
      ["ok", "  FAIT"],
      ["", "> VÉRIFICATION DES SCEAUX DE PURETÉ ............ "],
      ["ok", "  14/14 INTACTS"],
      ["", "> MONTAGE DES ARCHIVES : CODEX TENEBRARUM ...... "],
      ["ok", "  ARCHIVES MONTÉES"],
      ["", "> CARTOGRAPHE DE LA BLACK LIBRARY .............. "],
      ["ok", "  EN LIGNE"],
      ["", "> AUTHENTIFICATION DE L'ACOLYTE ................ "],
      ["ok", "  SCEAU ACCEPTÉ"],
      ["gros", "L'ESPRIT DE LA MACHINE EST APAISÉ"],
      ["", "Toute consultation est consignée au nom de l'Ordo."]
    ];
    var pre = el("div"); b.appendChild(pre);
    b.appendChild(el("div", "passer", "[ toucher ou appuyer pour passer ]"));
    var i = 0, fini = false, ligne = null;
    function fin() {
      if (fini) return; fini = true;
      b.classList.add("fin");
      setTimeout(function () { b.remove(); }, 380);
      doc.removeEventListener("keydown", fin);
    }
    b.addEventListener("click", fin);
    doc.addEventListener("keydown", fin);
    (function suite() {
      if (fini) return;
      if (i >= L.length) { setTimeout(fin, 650); return; }
      var l = L[i++];
      if (l[0] === "ok" && ligne) { var s = el("span", "ok", l[1]); ligne.appendChild(s); bip(1320, 0.04); }
      else { ligne = el("div", l[0] === "gros" ? "gros" : "", l[1]); pre.appendChild(ligne); }
      setTimeout(suite, l[0] === "ok" ? 110 : (l[0] === "gros" ? 380 : 75));
    })();
  }
  boot();

  /* ---------- Déchiffrement du titre de dossier ---------- */
  var h1 = doc.querySelector(".page-hero h1");
  if (h1 && !reduit && h1.childNodes.length === 1 && h1.firstChild.nodeType === 3) {
    var vrai = h1.textContent, glyphes = "▓▒░█#@%&$*+=?/\\<>ΣΔΞ01";
    var n = 0, total = 14;
    var t = setInterval(function () {
      n++;
      var k = Math.floor(vrai.length * n / total);
      var s = vrai.slice(0, k);
      for (var j = k; j < vrai.length; j++) s += vrai[j] === " " ? " " : glyphes[Math.floor(Math.random() * glyphes.length)];
      h1.textContent = s;
      if (n >= total) { clearInterval(t); h1.textContent = vrai; }
    }, 40);
  }

  /* ---------- Surlignage des termes recherchés (?hl=) ---------- */
  (function surligner() {
    var m = location.search.match(/[?&]hl=([^&]+)/);
    if (!m) return;
    var termes = decodeURIComponent(m[1].replace(/\+/g, " ")).split(/\s+/).map(norm).filter(function (x) { return x.length > 2; });
    if (!termes.length) return;
    var racine = doc.querySelector("main") || doc.body, premier = null;
    var w = doc.createTreeWalker(racine, NodeFilter.SHOW_TEXT, null), noeuds = [];
    while (w.nextNode()) noeuds.push(w.currentNode);
    noeuds.forEach(function (nd) {
      if (nd.parentNode.closest && nd.parentNode.closest("#cogi-term, script, style, svg")) return;
      var txt = nd.nodeValue, nt = norm(txt);
      if (nt.length !== txt.length) return; // sécurité : décalage d'indices impossible
      var hits = [];
      termes.forEach(function (tm) { var p = nt.indexOf(tm); while (p >= 0) { hits.push([p, p + tm.length]); p = nt.indexOf(tm, p + tm.length); } });
      if (!hits.length) return;
      hits.sort(function (a, b) { return a[0] - b[0]; });
      var frag = doc.createDocumentFragment(), pos = 0;
      hits.forEach(function (h) {
        if (h[0] < pos) return;
        frag.appendChild(doc.createTextNode(txt.slice(pos, h[0])));
        var mk = el("mark", "hl", txt.slice(h[0], h[1])); frag.appendChild(mk); if (!premier) premier = mk;
        pos = h[1];
      });
      frag.appendChild(doc.createTextNode(txt.slice(pos)));
      nd.parentNode.replaceChild(frag, nd);
    });
    if (premier && !location.hash) setTimeout(function () { premier.scrollIntoView({ block: "center" }); }, 500);
  })();

  /* =========================================================
     TERMINAL
     ========================================================= */
  var term = el("div"); term.id = "cogi-term";
  term.innerHTML =
    '<div id="cogi-out" role="log" aria-live="polite"></div>' +
    '<form class="cogi-line" autocomplete="off">' +
    '<label class="cogi-prompt" for="cogi-in">COGITATOR:\\&gt;</label>' +
    '<input id="cogi-in" name="cmd" spellcheck="false" placeholder="tapez AIDE ou CHERCHER …">' +
    '<div class="cogi-keys">' +
    '<button type="button" data-c="AIDE" class="opt"><span>F1</span>AIDE</button>' +
    '<button type="button" data-c="LISTE" class="opt"><span>F2</span>LISTE</button>' +
    '<button type="button" data-c="SECTIONS" class="opt"><span>F3</span>SOMMAIRE</button>' +
    '<button type="button" data-c="CARTOGRAPHE"><span>F4</span>LECTURES</button>' +
    '<button type="button" data-c="__journal" title="Afficher ou masquer le journal">▲</button>' +
    '</div></form>';
  doc.body.appendChild(term);
  var out = term.querySelector("#cogi-out"), inp = term.querySelector("#cogi-in"), form = term.querySelector("form");
  var btnJ = term.querySelector('[data-c="__journal"]');

  function ouvrir(v) { term.classList.toggle("ouvert", v); btnJ.textContent = v ? "▼" : "▲"; }
  function ln(txt, cls) { var d = el("div", "ln " + (cls || ""), txt); out.appendChild(d); if (cls === "err") bip(140, 0.18, "sawtooth", 0.04); return d; }
  function lnHTML(h, cls) { var d = el("div", "ln " + (cls || "")); d.innerHTML = h; out.appendChild(d); return d; }
  function bas() { out.scrollTop = out.scrollHeight; }

  // Historique de commandes
  var hist = []; try { hist = JSON.parse(lireS("hist") || "[]"); } catch (e) {}
  var hPos = hist.length;

  /* ---------- Index des archives (chargé à la demande) ---------- */
  var indexP = null;
  function index() {
    if (window.COGITATOR_INDEX) return Promise.resolve(window.COGITATOR_INDEX);
    if (indexP) return indexP;
    indexP = new Promise(function (ok, ko) {
      var s = doc.createElement("script"); s.src = "cogitator-index.js";
      s.onload = function () { prep(window.COGITATOR_INDEX); ok(window.COGITATOR_INDEX); };
      s.onerror = function () { indexP = null; ko(new Error("index")); };
      doc.head.appendChild(s);
    });
    return indexP;
  }
  function prep(D) {
    D.forEach(function (d) {
      d._t = norm(d.title); d._m = norm(d.eb + " " + d.tag + " " + d.path.join(" ") + " " + d.f.replace(/[-.]/g, " "));
      d.s.forEach(function (s) { s._h = norm(s.h); s._t = norm(s.t); });
    });
  }

  var carteP = null;
  function carte() {
    if (window.CARTE_LIEUX) return Promise.resolve(window.CARTE_LIEUX);
    if (carteP) return carteP;
    carteP = new Promise(function (ok) {
      var s = doc.createElement("script"); s.src = "carte-data.js";
      s.onload = function () { ok(window.CARTE_LIEUX || []); }; s.onerror = function () { ok([]); };
      doc.head.appendChild(s);
    });
    return carteP;
  }
  function chercherLieux(Lx, T) {
    if (!T.length) return [];
    return Lx.map(function (l) {
      var h = norm(l.nom + " " + l.alias.join(" ") + " " + l.desc), sc = 0;
      T.forEach(function (t) { if (norm(l.nom + " " + l.alias.join(" ")).indexOf(t) >= 0) sc += 10; else if (h.indexOf(t) >= 0) sc += 1; });
      return { l: l, sc: sc };
    }).filter(function (x) { return x.sc >= 10; }).sort(function (a, b) { return b.sc - a.sc; }).map(function (x) { return x.l; });
  }

  var MOTS_VIDES = "le la les de des du un une et ou en sur pour au aux d l a dans par avec sans qui que quoi est sont the of and".split(" ");
  function termesDe(q) {
    return norm(q).split(/[^a-z0-9ꞌ-]+/).map(function (x) { return x.replace(/^-+|-+$/g, ""); })
      .filter(function (x) { return x.length > 1 && MOTS_VIDES.indexOf(x) < 0; });
  }
  function compter(hay, t) { var n = 0, p = hay.indexOf(t); while (p >= 0 && n < 20) { n++; p = hay.indexOf(t, p + t.length); } return n; }

  function chercher(D, q) {
    var T = termesDe(q); if (!T.length) return { res: [], T: T, absents: [] };
    var absents = T.filter(function (t) {
      return !D.some(function (d) { return d._t.indexOf(t) >= 0 || d._m.indexOf(t) >= 0 || d.s.some(function (s) { return s._t.indexOf(t) >= 0 || s._h.indexOf(t) >= 0; }); });
    });
    var T2 = T.filter(function (t) { return absents.indexOf(t) < 0; });
    var res = [];
    D.forEach(function (d) {
      var score = 0, tous = true, best = null, bestSc = 0;
      T2.forEach(function (t) {
        var sc = 0;
        if (d._t.indexOf(t) >= 0) sc += 40;
        if (d._m.indexOf(t) >= 0) sc += 8;
        d.s.forEach(function (s) {
          var c = compter(s._t, t) + (s._h.indexOf(t) >= 0 ? 6 : 0);
          sc += Math.min(c, 8);
          var ls = c; if (ls > bestSc) { bestSc = ls; best = s; }
        });
        if (!sc) tous = false;
        score += sc;
      });
      if (score > 0) res.push({ d: d, sc: score + (tous ? 1000 : 0), s: best });
    });
    res.sort(function (a, b) { return b.sc - a.sc; });
    return { res: res, T: T2, absents: absents };
  }
  function extrait(s, T) {
    if (!s || !s.t) return "";
    var n = s._t, p = -1;
    for (var i = 0; i < T.length && p < 0; i++) p = n.indexOf(T[i]);
    if (p < 0) p = 0;
    var a = Math.max(0, p - 70), b = Math.min(s.t.length, p + 130);
    var txt = (a ? "…" : "") + s.t.slice(a, b) + (b < s.t.length ? "…" : "");
    // surlignage insensible aux accents
    var nn = norm(txt);
    if (nn.length !== txt.length) return esc(txt);
    var hits = [];
    T.forEach(function (t) { var q = nn.indexOf(t); while (q >= 0) { hits.push([q, q + t.length]); q = nn.indexOf(t, q + t.length); } });
    hits.sort(function (x, y) { return x[0] - y[0]; });
    var h = "", pos = 0;
    hits.forEach(function (x) { if (x[0] < pos) return; h += esc(txt.slice(pos, x[0])) + "<b>" + esc(txt.slice(x[0], x[1])) + "</b>"; pos = x[1]; });
    return h + esc(txt.slice(pos));
  }

  var derniers = []; // résultats numérotés pour OUVRIR n
  function lien(d, sec, q) {
    var u = d.f + (q ? "?hl=" + encodeURIComponent(q) : "") + (sec && sec.id ? "#" + sec.id : "");
    return u;
  }
  function afficherListe(items, titre) {
    derniers = items;
    if (titre) ln(titre, "dim");
    items.forEach(function (it, i) {
      var d = it.d, num = String(i + 1).padStart(2, "0");
      var chemin = d.path.length ? d.path.join(" › ") : "Racine";
      var h = '[' + num + '] <a href="' + esc(it.u || lien(d)) + '">' + esc(d.title.toUpperCase()) + '</a>' +
        ' <span style="color:var(--ph-dim)">· ' + esc(chemin) + (it.s && it.s.h ? " · § " + esc(it.s.h) : "") + '</span>';
      if (it.snip) h += '<span class="snip">' + it.snip + '</span>';
      lnHTML(h, "res");
    });
  }

  /* ---------- Commandes ---------- */
  var CMDS = {};
  function cmd(noms, aide, fn) { noms.forEach(function (n) { CMDS[n] = { fn: fn, aide: aide, nom: noms[0] }; }); }

  cmd(["AIDE", "HELP", "?"], "Liste des commandes", function () {
    ln("COMMANDES RECONNUES PAR L'ESPRIT DE LA MACHINE :", "ok");
    [
      ["CHERCHER <termes>", "Fouille les dossiers et la carte (alias SEARCH)"],
      ["OUVRIR <n | nom>", "Ouvre un résultat ou un dossier (alias OPEN)"],
      ["LISTE [rubrique]", "Index brut : LISTE FACTIONS, LISTE PRIMARQUES… (alias LIST)"],
      ["SOMMAIRE", "Sections du dossier courant (alias SECTIONS)"],
      ["ALLER <n>", "Saute à la section n du dossier (alias GOTO)"],
      ["LIRE <sujet>", "Trace un parcours de lecture : LIRE BLOOD ANGELS (alias READ)"],
      ["CARTE [lieu]", "Carte galactique : CARTE BAAL (alias MAP)"],
      ["CARTOGRAPHE", "Ouvre le Cartographe de la Black Library"],
      ["EXAMEN", "Passer l'examen d'acolyte et gagner un grade"],
      ["TOME", "Ouvre le Codex complet en PDF"],
      ["DEFINIR <terme>", "Définition du lexique : DEFINIR WARP"],
      ["FRISE · TOILE [dossier]", "Frise chronologique · relations du dossier courant"],
      ["FORGE", "Créer son propre Chapitre"],
      ["COMPARER [a] [b]", "Comparateur de factions : COMPARER ORKS TAU"],
      ["GENERER INQ|MARCHAND|MONDE", "Générateurs de l'Administratum"],
      ["TRANSMISSION [ON|OFF]", "Intercepte un message astropathique"],
      ["IMPRIMER [PARCHEMIN]", "Imprime le dossier (relevé ou parchemin)"],
      ["SON ON|OFF", "Ambiance sonore du cogitator"],
      ["ECOUTER · SILENCE", "Lecture du dossier par un servitor / arrêt"],
      ["HASARD", "Ouvre un dossier au hasard (alias RANDOM)"],
      ["ACCUEIL · RETOUR", "Navigation (alias HOME · BACK)"],
      ["THEME VERT|AMBRE|BLANC", "Change la couleur du phosphore"],
      ["CRT ON|OFF", "Active ou coupe les effets du tube"],
      ["TEXTE + | - | NORMAL", "Agrandit ou réduit le texte"],
      ["EFFACER", "Vide le journal (alias CLEAR)"]
    ].forEach(function (c) { ln("  " + c[0].padEnd(24) + c[1]); });
    ln("Raccourcis : tapez n'importe où pour écrire · ↑↓ historique · Tab complète · Échap ferme.", "dim");
  });

  cmd(["CHERCHER", "SEARCH", "RECHERCHE", "FIND", "CHERCHE"], "Recherche plein texte", function (arg) {
    if (!arg) { ln("SYNTAXE : CHERCHER <termes>   ex. CHERCHER SOIF ROUGE", "err"); return; }
    ln("Interrogation des archives…", "dim");
    return Promise.all([index(), carte()]).then(function (R) {
      var D = R[0], Lx = R[1];
      var r = chercher(D, arg);
      var Tall = termesDe(arg);
      var lieux = chercherLieux(Lx, Tall);
      // un terme n'est « inconnu » que s'il n'apparaît ni dans les dossiers ni sur la carte
      var absents = r.absents.filter(function (t) { return !Lx.some(function (l) { return norm(l.nom + " " + l.alias.join(" ") + " " + l.desc).indexOf(t) >= 0; }); });
      if (absents.length) ln("TERME(S) INCONNU(S) DES ARCHIVES : " + absents.join(", ").toUpperCase(), "err");
      var items = [];
      if (lieux.length) {
        ln("CARTOGRAPHIE — " + lieux.length + " LOCALISATION(S) :", "ok");
        lieux.slice(0, 5).forEach(function (l) {
          items.push({ u: "carte.html?m=" + l.id });
          lnHTML("[" + String(items.length).padStart(2, "0") + '] <a href="carte.html?m=' + l.id + '">' + esc(l.nom.toUpperCase()) + "</a> " +
            '<span style="color:var(--ph-dim)">· ' + (l.x == null ? "COORDONNÉES EXPURGÉES" : "CARTE GALACTIQUE") + '</span><span class="snip">' + esc(l.desc) + "</span>", "res");
        });
      }
      if (!r.res.length && !lieux.length) {
        ln("AUCUN ENREGISTREMENT. Cette zone est peut-être frappée d'Interdiction — ou n'a jamais existé.", "err");
        derniers = items; return;
      }
      if (r.res.length) {
        var top = r.res.slice(0, 12).map(function (x) { return { d: x.d, s: x.s, snip: extrait(x.s, r.T), u: lien(x.d, x.s, r.T.join(" ")) }; });
        ln(r.res.length + " DOSSIER(S) CORRESPONDANT(S)" + (r.res.length > 12 ? " — 12 PREMIERS" : "") + ". OUVRIR <n> pour consulter.", "dim");
        top.forEach(function (it) {
          items.push(it);
          var d = it.d, chemin = d.path.length ? d.path.join(" › ") : "Racine";
          lnHTML("[" + String(items.length).padStart(2, "0") + '] <a href="' + esc(it.u) + '">' + esc(d.title.toUpperCase()) + "</a>" +
            ' <span style="color:var(--ph-dim)">· ' + esc(chemin) + (it.s && it.s.h ? " · § " + esc(it.s.h) : "") + "</span>" +
            (it.snip ? '<span class="snip">' + it.snip + "</span>" : ""), "res");
        });
      }
      derniers = items;
    }, erreurIndex);
  });

  cmd(["OUVRIR", "OPEN", "OUVRE", "ACCEDER"], "Ouvrir un dossier", function (arg) {
    if (!arg) { ln("SYNTAXE : OUVRIR <numéro> ou OUVRIR <nom du dossier>", "err"); return; }
    if (/^\d+$/.test(arg)) {
      var it = derniers[parseInt(arg, 10) - 1];
      if (!it) { ln("AUCUN RÉSULTAT N°" + arg + " DANS LE JOURNAL. Lancez d'abord CHERCHER ou LISTE.", "err"); return; }
      aller(it.u || lien(it.d)); return;
    }
    return index().then(function (D) {
      var q = norm(arg).trim();
      var exact = D.filter(function (d) { return d._t === q || norm(d.f.replace(".html", "")) === q.replace(/\s+/g, "-"); });
      var part = D.filter(function (d) { return d._t.indexOf(q) >= 0; });
      var cible = exact[0] || (part.length === 1 ? part[0] : null);
      if (cible) { aller(cible.f); return; }
      if (part.length > 1) { afficherListe(part.slice(0, 15).map(function (d) { return { d: d }; }), "PLUSIEURS DOSSIERS CORRESPONDENT :"); return; }
      var r = chercher(D, arg);
      if (r.res.length) { aller(r.res[0].d.f); return; }
      ln("DOSSIER INTROUVABLE : " + arg.toUpperCase(), "err");
    }, erreurIndex);
  });

  cmd(["LISTE", "LIST", "LS", "DIR", "INDEX"], "Index brut", function (arg) {
    return index().then(function (D) {
      if (!arg) {
        var g = {};
        D.forEach(function (d) { var k = d.path[0] || "Racine"; g[k] = (g[k] || 0) + 1; });
        ln("RUBRIQUES DES ARCHIVES :", "ok");
        Object.keys(g).forEach(function (k) { ln("  " + k.toUpperCase().padEnd(28, ".") + " " + g[k] + " dossier(s)"); });
        ln("LISTE <rubrique> pour le détail — ex. LISTE PERSONNAGES, LISTE CHAPITRE, LISTE LEGION.", "dim");
        return;
      }
      var q = norm(arg).trim().replace(/s$/, "");
      var sel = D.filter(function (d) {
        return d.path.some(function (p) { return norm(p).indexOf(q) >= 0; }) || norm(d.f).indexOf(q) === 0 || (!d.path.length && d._t.indexOf(q) >= 0);
      });
      if (!sel.length) { ln("RUBRIQUE INCONNUE : " + arg.toUpperCase() + ". Tapez LISTE pour les rubriques.", "err"); return; }
      sel.sort(function (a, b) { return (a.path.join() + a.title).localeCompare(b.path.join() + b.title, "fr"); });
      afficherListe(sel.slice(0, 80).map(function (d) { return { d: d }; }), sel.length + " DOSSIER(S) — OUVRIR <n> pour consulter.");
    }, erreurIndex);
  });

  function sections() {
    var hs = Array.prototype.slice.call(doc.querySelectorAll(".codex-section > h2, main h2, .cat-label"));
    return hs.filter(function (h, i) { return hs.indexOf(h) === i; });
  }
  cmd(["SOMMAIRE", "SECTIONS", "TOC"], "Sections du dossier", function () {
    var hs = sections();
    if (!hs.length) { ln("CE DOSSIER NE COMPORTE PAS DE SECTIONS.", "err"); return; }
    ln("SECTIONS DU DOSSIER « " + (h1 ? h1.textContent.toUpperCase() : page) + " » :", "ok");
    hs.forEach(function (h, i) {
      var t = h.textContent.replace(/^\s*[IVXLC]+\s+/, "").trim();
      var d = lnHTML('[' + String(i + 1).padStart(2, "0") + '] <a href="#">' + esc(t) + '</a>', "res");
      d.querySelector("a").addEventListener("click", function (e) { e.preventDefault(); h.scrollIntoView(); });
    });
    ln("ALLER <n> pour s'y rendre.", "dim");
  });
  cmd(["ALLER", "GOTO", "GO"], "Aller à une section", function (arg) {
    var hs = sections(), n = parseInt(arg, 10);
    if (!hs[n - 1]) { ln("SECTION " + (arg || "?") + " INEXISTANTE. Tapez SOMMAIRE.", "err"); return; }
    hs[n - 1].scrollIntoView(); ln("Section " + n + " affichée.", "ok"); ouvrir(false);
  });

  cmd(["LIRE", "READ", "LECTURE", "CARTOGRAPHE", "CARTO", "ROADMAP", "BIBLIOTHEQUE"], "Cartographe", function (arg, nom) {
    var u = "cartographe.html" + (arg ? "?q=" + encodeURIComponent(arg.toLowerCase()) : "");
    if (page === "cartographe.html" && arg && window.CARTO_TRACER) { window.CARTO_TRACER(arg); ln("Parcours tracé.", "ok"); ouvrir(false); return; }
    aller(u);
  });
  cmd(["CARTE", "MAP", "LOCALISER", "GALAXIE"], "Carte galactique", function (arg) {
    if (!arg) { aller("carte.html"); return; }
    return carte().then(function (Lx) {
      var l = chercherLieux(Lx, termesDe(arg))[0];
      if (!l) { ln("AUCUNE BALISE POUR « " + arg.toUpperCase() + " ». Tapez CARTE pour la vue d'ensemble.", "err"); return; }
      if (page === "carte.html" && window.CARTE_CHOISIR) { window.CARTE_CHOISIR(l.id); ln("Balise verrouillée : " + l.nom.toUpperCase(), "ok"); ouvrir(false); return; }
      aller("carte.html?m=" + l.id);
    });
  });
  cmd(["SON", "SOUND", "AUDIO"], "Ambiance sonore", function (arg) {
    var v = norm(arg || "").trim();
    if (v !== "on" && v !== "off") v = sonActif ? "off" : "on";
    regleSon(v === "on"); ln(v === "on" ? "Ambiance sonore activée. L'Esprit de la Machine ronronne." : "Ambiance sonore coupée.", "ok");
  });
  cmd(["ECOUTER", "VOIX", "LECTURE", "SPEAK"], "Lecture vocale", function () { if (lireDossier()) { ln("Lecture du dossier par le servitor… (SILENCE pour arrêter)", "ok"); ouvrir(false); } });
  cmd(["SILENCE", "STOP", "TAIS-TOI"], "Arrêt lecture", function () { arreterLecture(); ln("Le servitor se tait.", "ok"); });
  cmd(["DEFINIR", "DEFINE", "LEXIQUE", "GLOSSAIRE", "QUEST-CE"], "Lexique", function (arg) {
    if (!arg) { aller("lexique.html"); return; }
    return new Promise(function (ok) {
      function go() {
        var q = norm(arg).trim(), G = window.CODEX_GLOSSAIRE || [];
        var g = G.filter(function (x) { return norm(x.t) === q || x.alias.some(function (a) { return norm(a) === q; }); })[0] ||
                G.filter(function (x) { return norm(x.t + " " + x.alias.join(" ")).indexOf(q) >= 0; })[0];
        if (!g) ln("TERME ABSENT DU LEXIQUE : " + arg.toUpperCase() + ". Essayez CHERCHER " + arg.toUpperCase() + ".", "err");
        else { ln(g.t.toUpperCase() + " —", "ok"); ln(g.def); lnHTML('<a href="lexique.html?q=' + encodeURIComponent(g.t) + '">› Lexique</a>' + (g.page ? ' · <a href="' + g.page + '">› Dossier</a>' : ""), "dim"); }
        ok();
      }
      if (window.CODEX_GLOSSAIRE) go(); else { var sc = doc.createElement("script"); sc.src = "glossaire.js"; sc.onload = go; sc.onerror = function () { ln("LEXIQUE INDISPONIBLE.", "err"); ok(); }; doc.head.appendChild(sc); }
    });
  });
  cmd(["FRISE", "TIMELINE"], "Frise chronologique", function () { aller("frise.html"); });
  cmd(["TOILE", "RELATIONS", "GRAPHE"], "Toile des relations", function (arg) {
    if (arg && page === "toile.html" && window.TOILE_CENTRER) { if (window.TOILE_CENTRER(arg)) { ln("Toile recentrée.", "ok"); ouvrir(false); } else ln("DOSSIER INTROUVABLE DANS LA TOILE.", "err"); return; }
    if (!arg) { aller("toile.html?d=" + page.replace(".html", "")); return; }
    return index().then(function (D) { var r = chercher(D, arg); aller("toile.html" + (r.res.length ? "?d=" + r.res[0].d.f.replace(".html", "") : "")); }, erreurIndex);
  });
  cmd(["FORGE", "CREER", "CHAPITRE"], "Forge de Chapitre", function () { aller("forge.html"); });
  cmd(["COMPARER", "COMPARE", "VERSUS", "VS"], "Comparateur de factions", function (arg) {
    var ALIAS = { "space marines": "astartes", marines: "astartes", astartes: "astartes", custodes: "custodes", garde: "militarum", militarum: "militarum",
      mechanicus: "mechanicus", sororitas: "sororitas", soeurs: "sororitas", inquisition: "inquisition", chevaliers: "knights", knights: "knights",
      chaos: "chaos-astartes", traitres: "chaos-astartes", demons: "demons", renegats: "chaos-chevaliers", necrons: "necrons", aeldari: "aeldari",
      eldars: "aeldari", eldar: "aeldari", drukhari: "drukhari", orks: "orks", ork: "orks", tau: "tau", kroots: "kroots", tyranides: "tyranides",
      tyranids: "tyranides", votann: "votann" };
    var t = (arg || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z ]/g, " ").split(/\s+|\bcontre\b/).filter(Boolean);
    var ids = t.map(function (m) { return ALIAS[m]; }).filter(Boolean);
    aller("comparateur.html" + (ids.length ? "?a=" + ids[0] + (ids[1] ? "&b=" + ids[1] : "") : ""));
  });
  cmd(["GENERER", "GENERATEUR", "GENERATEURS", "TIRER"], "Générateurs", function (arg) {
    var a = (arg || "").toLowerCase(), g = /march|lm|dynast/.test(a) ? "lm" : /monde|planet/.test(a) ? "monde" : /inq/.test(a) ? "inq" : "";
    aller("generateurs.html" + (g ? "?g=" + g : ""));
  });
  cmd(["TOME", "PDF"], "Tome PDF", function () { ln("Ouverture du Tome complet (PDF, ~30 Mo)…", "ok"); setTimeout(function () { location.href = "Codex-Tenebrarum-TOME.pdf"; }, 300); });
  cmd(["IMPRIMER", "PRINT", "IMPRESSION"], "Impression du dossier", function (arg) {
    var st = /PARCH/i.test(arg || "") ? "parchemin" : "releve";
    ln("Envoi au scriptorium… format " + (st === "parchemin" ? "PARCHEMIN" : "RELEVÉ") + ".", "ok"); ouvrir(false);
    setTimeout(function () { if (window.COGI_IMPRIMER) window.COGI_IMPRIMER(st); else window.print(); }, 250);
  });
  cmd(["EXAMEN", "QUIZ", "TEST"], "Examen d'acolyte", function () { aller("examen.html"); });
  cmd(["HASARD", "RANDOM", "ALEA"], "Dossier au hasard", function () {
    return index().then(function (D) { var d = D[Math.floor(Math.random() * D.length)]; ln("Tirage du Tarot… " + d.title.toUpperCase(), "ok"); setTimeout(function () { aller(d.f); }, 400); }, erreurIndex);
  });
  cmd(["ACCUEIL", "HOME", "CD"], "Accueil", function (arg) {
    if (arg === "..") { history.back(); return; }
    aller("index.html");
  });
  cmd(["RETOUR", "BACK"], "Page précédente", function () { history.back(); });
  cmd(["EFFACER", "CLEAR", "CLS"], "Effacer", function () { out.innerHTML = ""; ouvrir(false); return "silence"; });
  cmd(["THEME", "PHOSPHORE"], "Couleur", function (arg) {
    var v = norm(arg || "").trim();
    var ok = { vert: "vert", green: "vert", ambre: "ambre", amber: "ambre", blanc: "blanc", white: "blanc" }[v];
    if (!ok) { ln("SYNTAXE : THEME VERT | AMBRE | BLANC", "err"); return; }
    html.setAttribute("data-phos", ok); ecrire("phos", ok); ln("Phosphore recalibré : " + ok.toUpperCase() + ".", "ok");
  });
  cmd(["CRT"], "Effets", function (arg) {
    var v = norm(arg || "").trim();
    if (v !== "on" && v !== "off") { ln("SYNTAXE : CRT ON | CRT OFF", "err"); return; }
    regleCrt(v);
    ln(v === "off" ? "Effets du tube coupés. Lecture facilitée." : "Effets du tube rétablis.", "ok");
  });
  cmd(["TEXTE", "TAILLE", "ZOOM"], "Taille du texte", function (arg) {
    var v = norm(arg || "").trim(), t = html.getAttribute("data-taille"), i = TAILLES.indexOf(t);
    if (v === "+" || v === "plus") i = Math.min(2, i + 1); else if (v === "-" || v === "moins") i = Math.max(0, i - 1);
    else if (v === "normal") i = 0; else if (v === "grand") i = 1; else if (v === "tres grand" || v === "tres-grand") i = 2; else i = (i + 1) % 3;
    regleTaille(TAILLES[i]); ln("Taille du texte : " + NOM_TAILLE[TAILLES[i]] + ".", "ok");
  });
  cmd(["ETAT", "STATUS"], "État", function () {
    ln("COGITATOR MK.XIV — DATE " + dateImperiale(), "ok");
    ln("  Dossier courant ......... " + page);
    ln("  Phosphore ............... " + html.getAttribute("data-phos").toUpperCase());
    ln("  Effets du tube .......... " + html.getAttribute("data-crt").toUpperCase());
    ln("  Commandes consignées .... " + hist.length);
  });
  cmd(["PURGE", "EXTERMINATUS"], "", function () {
    var f = el("div", "purge-flash"); doc.body.appendChild(f); setTimeout(function () { f.remove(); }, 950);
    ln("+++ PURGE EXÉCUTÉE. L'HÉRÉSIE A ÉTÉ CONSUMÉE. +++", "err");
  });
  cmd(["PRIER", "PRAY", "LOUANGE"], "", function () {
    ln("Ô Esprit de la Machine, pardonne la main maladroite qui t'interroge.", "ok");
    ln("Que tes conduits restent purs et ta mémoire sans faille. — Litanie mineure", "dim");
  });

  /* =========================================================
     TRANSMISSIONS INTERCEPTÉES (messages astropathiques aléatoires)
     ========================================================= */
  var TRANSMISSIONS = [
    ["Kasr Myrak", "...la porte tient encore... le Seigneur Castellan Creed ordonne... les Pylônes se taisent un à un...", "regiment-cadiens.html", "Les Cadiens"],
    ["Baal Secundus", "...la Flotte-ruche couvre les trois soleils... le Sang appelle le Sang... envoyez Dante...", "chapitre-blood-angels.html", "Les Blood Angels"],
    ["Armageddon, ruche Hades", "...le Vieux Yarrick est vivant... la Bête revient... nous tiendrons jusqu'au dernier fusil...", "heros-yarrick.html", "Commissaire Yarrick"],
    ["Vaisseau noir Ixion", "...cargaison psyker à bord... trois sanctionnés... l'un d'eux rêve d'un œil ouvert dans le Warp...", "univers-psykers.html", "Les psykers"],
    ["Macragge", "...le Primarque s'est éveillé... la Croisade Indomitus quitte Terra... que l'espoir renaisse...", "evt-indomitus.html", "La Croisade Indomitus"],
    ["Inconnu (Œil de la Terreur)", "...ILS ARRIVENT... la Black Legion forme ses rangs... le Seigneur de guerre a brisé Cadia...", "champion-abaddon.html", "Abaddon"],
    ["Monde-forge Stygies VIII", "...artefact xenos récupéré sous les dunes... des glyphes s'allument au contact... les Skitarii tombent sans bruit...", "xenos-necrons.html", "Les Nécrons"],
    ["Fenris", "...les Loups hurlent sous les deux lunes... la Grande Chasse est lancée... un loup n'abandonne jamais la meute...", "chapitre-space-wolves.html", "Les Space Wolves"],
    ["Commorragh (source incertaine)", "...ils viennent la nuit... les villages se vident... on entend rire dans les ombres...", "xenos-drukhari.html", "Les Drukhari"],
    ["Frange Est, système Dal'yth", "...ils proposent la paix... le Bien Suprême, disent-ils... la moitié du régiment a déposé les armes...", "xenos-tau.html", "L'Empire T'au"],
    ["Valhalla", "...le froid ne nous tuera pas... l'ennemi verdit l'horizon... WAAAGH... WAAAGH...", "xenos-orks.html", "Les Orks"],
    ["Astronomican, Terra", "...le Phare faiblit au-delà de la Faille... l'Imperium Nihilus est dans le noir... priez...", "evt-grande-faille.html", "La Grande Faille"],
    ["Vaisseau Le Pèlerin Silencieux", "...les Navigateurs ne voient plus rien... la Toile s'ouvre devant nous... quelqu'un danse sur la coque...", "xenos-arlequins.html", "Les Arlequins"],
    ["Prospero (archive scellée)", "...un millier d'yeux brûlent... les Loups sont venus... le savoir n'est pas un crime...", "legion-thousand-sons.html", "Les Thousand Sons"],
    ["Titan Princeps Vulcanus", "...l'Esprit de la Machine est en colère... la Légion avance... la ville tremble à chaque pas...", "mechanicus-titanicus.html", "Les Titans"],
    ["Bastion de l'Ordo Malleus", "...le Nom véritable a été prononcé... le démon est banni, pas détruit... il reviendra dans mille ans...", "ordo-malleus.html", "L'Ordo Malleus"],
    ["Sous-secteur Aurelia", "...Exterminatus autorisé... trois heures avant impact... que l'Empereur pardonne...", "carte.html?m=aurelia", "Aurelia sur la carte"],
    ["Ulthwé", "...les runes se brisent... le Prescient a vu la fin... un chemin, un seul...", "craftworld-ulthwe.html", "Ulthwé"],
    ["Iyanden", "...les morts marchent à nos côtés... la flotte Kraken a dévoré nos foyers...", "craftworld-iyanden.html", "Iyanden"],
    ["Nostramo (écho résiduel)", "...nous avons vu la vérité... la peur est la seule loi... nous venons pour vous...", "legion-night-lords.html", "Les Night Lords"],
    ["Vraks Prime", "...le cardinal a trahi... dix-sept ans de siège... les tranchées ne finissent jamais...", "regiment-krieg.html", "Le Corps de la Mort de Krieg"],
    ["Mars, Olympus Mons", "...l'Archimagos Cawl a ouvert la voûte... ils sont plus grands, plus forts... Primaris...", "heros-cawl.html", "Belisarius Cawl"],
    ["Pèlerinage de la Sainte Vivante", "...elle est revenue... ses ailes de lumière... la foule s'agenouille...", "heros-celestine.html", "Sainte Celestine"],
    ["Cargo Ad Astra, Segmentum Pacificus", "...les Libres-Marchands ont acheté le silence de l'équipage... la cargaison respire...", "rogue-traders.html", "Les Libres-Marchands"]
  ];
  var transOn = lire("trans", "on") !== "off", transTimer = null;
  function brouiller(t) { return t.replace(/[a-zéèàù]/gi, function (c) { return Math.random() < 0.06 ? "▒" : c; }); }
  function transmission(force) {
    if (!force && (!transOn || doc.hidden)) return;
    var m = TRANSMISSIONS[Math.floor(Math.random() * TRANSMISSIONS.length)];
    var heure = String(Math.floor(Math.random() * 24)).padStart(2, "0") + ":" + String(Math.floor(Math.random() * 60)).padStart(2, "0");
    lnHTML('<span class="trans-tete">+++ TRANSMISSION INTERCEPTÉE · ' + esc(m[0].toUpperCase()) + " · " + heure + " +++</span>", "trans");
    ln("« " + brouiller(m[1]) + " »", "trans");
    lnHTML('↳ Dossier associé : <a href="' + m[2] + '">' + esc(m[3]) + "</a>", "dim");
    out.scrollTop = out.scrollHeight;
    bip(1320, 0.05, "sine", 0.02); setTimeout(function () { bip(1760, 0.05, "sine", 0.02); }, 120); setTimeout(function () { clic(); }, 260);
    var old = doc.querySelector(".trans-alerte"); if (old) old.remove();
    if (term.classList.contains("ouvert")) return;
    var a = el("button", "trans-alerte"); a.type = "button";
    a.innerHTML = '<b>+++ TRANSMISSION INTERCEPTÉE +++</b><span>' + esc(m[0]) + " · " + esc(m[3]) + " ›</span>";
    a.addEventListener("click", function () { ouvrir(true); a.remove(); out.scrollTop = out.scrollHeight; });
    doc.body.appendChild(a);
    setTimeout(function () { if (a.parentNode) a.classList.add("part"); setTimeout(function () { a.remove(); }, 600); }, 14000);
  }
  function planifierTrans(premier) {
    clearTimeout(transTimer); if (!transOn) return;
    transTimer = setTimeout(function () { transmission(false); planifierTrans(false); }, (premier ? 60 + Math.random() * 90 : 240 + Math.random() * 240) * 1000);
  }
  planifierTrans(true);
  cmd(["TRANSMISSIONS", "TRANSMISSION", "IMPRIMER ", "TEXTE ", "INTERCEPTER", "ASTROPATHE"], "Transmissions interceptées", function (arg) {
    var a = (arg || "").toUpperCase();
    if (a === "OFF") { transOn = false; ecrire("trans", "off"); clearTimeout(transTimer); ln("Écoute astropathique suspendue.", "ok"); return; }
    if (a === "ON") { transOn = true; ecrire("trans", "on"); planifierTrans(true); ln("Écoute astropathique rétablie.", "ok"); return; }
    transmission(true);
  });

  function erreurIndex() { ln("ÉCHEC DE CHARGEMENT DE L'INDEX (cogitator-index.js manquant ?).", "err"); }
  function aller(u) { ln("Ouverture du dossier…", "dim"); setTimeout(function () { location.href = u; }, 180); }

  function executer(brut) {
    var s = brut.trim(); if (!s) return;
    hist.push(s); if (hist.length > 60) hist.shift(); hPos = hist.length; ecrireS("hist", JSON.stringify(hist));
    ouvrir(true);
    ln("COGITATOR:\\> " + s.toUpperCase(), "cmd"); bip(880, 0.06);
    var m = s.match(/^(\S+)\s*(.*)$/), nom = norm(m[1]).toUpperCase(), arg = m[2].trim();
    var c = CMDS[nom];
    if (!c) {
      ln("COMMANDE « " + nom + " » NON RECONNUE — interprétée comme CHERCHER.", "dim");
      c = CMDS.CHERCHER; arg = s;
    }
    var r = c.fn(arg, nom);
    if (r && r.then) r.then(bas); else bas();
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); var v = inp.value; inp.value = ""; executer(v); });
  term.querySelectorAll("[data-c]").forEach(function (b) {
    b.addEventListener("click", function () {
      var c = b.getAttribute("data-c");
      if (c === "__journal") { ouvrir(!term.classList.contains("ouvert") && out.childNodes.length > 0 ? true : false); if (!out.childNodes.length) executer("AIDE"); return; }
      executer(c); inp.focus();
    });
  });

  // Autocomplétion
  var COMPL = ["AIDE", "CHERCHER ", "OUVRIR ", "LISTE ", "CARTE ", "SOMMAIRE", "ALLER ", "LIRE ", "CARTOGRAPHE", "EXAMEN", "FRISE", "TOILE", "FORGE", "COMPARER ", "GENERER ", "TRANSMISSION", "DEFINIR ", "LEXIQUE", "ECOUTER", "SILENCE", "SON ON", "SON OFF", "HASARD", "ACCUEIL", "RETOUR", "EFFACER", "THEME ", "CRT ", "ETAT",
    "LISTE FACTIONS", "LISTE PERSONNAGES", "LISTE CHRONOLOGIE", "LISTE UNIVERS", "THEME VERT", "THEME AMBRE", "THEME BLANC", "CRT ON", "CRT OFF"];
  inp.addEventListener("keydown", function (e) {
    if (e.key.length === 1 || e.key === "Backspace") clic();
    if (e.key === "ArrowUp") { if (hPos > 0) { hPos--; inp.value = hist[hPos]; } e.preventDefault(); }
    else if (e.key === "ArrowDown") { if (hPos < hist.length) { hPos++; inp.value = hist[hPos] || ""; } e.preventDefault(); }
    else if (e.key === "Tab") {
      var v = inp.value.toUpperCase();
      if (!v) return;
      var c = COMPL.filter(function (x) { return x.indexOf(v) === 0; });
      if (c.length) { inp.value = c[0]; e.preventDefault(); }
    } else if (e.key === "Escape") { ouvrir(false); inp.blur(); }
  });
  doc.addEventListener("keydown", function (e) {
    var a = doc.activeElement;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA" || a.isContentEditable)) return;
    if (doc.getElementById("cogi-boot")) return;
    if (e.key === "F1") { e.preventDefault(); executer("AIDE"); return; }
    if (e.key === "F2") { e.preventDefault(); executer("LISTE"); return; }
    if (e.key === "F3") { e.preventDefault(); executer("SOMMAIRE"); return; }
    if (e.key === "F4") { e.preventDefault(); executer("CARTOGRAPHE"); return; }
    if (e.key === "Escape") { ouvrir(false); return; }
    if (e.key.length === 1 && /[a-zA-Z0-9?\/:]/.test(e.key)) {
      inp.focus(); // le caractère est ensuite saisi dans le champ
    }
  });

  // Fermer le journal en cliquant sur la page
  doc.addEventListener("click", function (e) { if (!term.contains(e.target)) ouvrir(false); });
})();
