/* ============================================================
   CODEX TENEBRARUM — modules de contenu
   Emblèmes « pict-scan », lectures conseillées, glossaire au survol,
   dossiers classifiés. Chargé automatiquement par cogitator.js.
   ============================================================ */
(function () {
  "use strict";
  var doc = document;
  var page = (location.pathname.split("/").pop() || "index.html").replace(/\.html$/, "");
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function charger(src, test) {
    return new Promise(function (ok, ko) {
      if (test()) return ok();
      var s = doc.createElement("script"); s.src = src; s.onload = ok; s.onerror = ko; doc.head.appendChild(s);
    });
  }
  var reduit = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =========================================================
     TABLE DES DOSSIERS : emblème + thème de lecture
     (modifiez ici pour rattacher une page à un logo ou à un thème
      du Cartographe)
     ========================================================= */
  var EXACT = {
    // Chapitres
    "chapitre-blood-angels": ["blood-angels", "blood-angels"], "chapitre-ultramarines": ["ultramarines", "ultramarines"],
    "chapitre-dark-angels": ["dark-angels", "dark-angels"], "chapitre-space-wolves": ["space-wolves", "space-wolves"],
    "chapitre-salamanders": ["salamanders", "salamanders"], "chapitre-white-scars": ["white-scars", "white-scars"],
    "chapitre-raven-guard": ["raven-guard", "raven-guard"], "chapitre-iron-hands": ["iron-hands", "iron-hands"],
    "chapitre-imperial-fists": ["imperial-fists", "imperial-fists"], "chapitre-black-templars": ["black-templars", "black-templars"],
    "chapitre-grey-knights": ["grey-knights", "grey-knights"], "chapitre-deathwatch": ["deathwatch", "deathwatch"],
    "chapitre-flesh-tearers": [null, "blood-angels"], "chapitre-crimson-fists": [null, "imperial-fists"],
    "chapitre-blood-ravens": ["blood-ravens", "blood-ravens"], "chapitre-carcharodons": ["carcharodons", "carcharodons"],
    "chapitre-soul-drinkers": ["soul-drinkers", "soul-drinkers"], "chapitre-silver-skulls": ["silver-skulls", "silver-skulls"],
    // Légions renégates
    "legion-alpha-legion": ["alpha-legion", "alpha-legion"], "legion-black-legion": ["black-legion", "black-legion"],
    "legion-death-guard": ["death-guard", "death-guard"], "legion-emperors-children": ["emperors-children", "emperors-children"],
    "legion-iron-warriors": ["iron-warriors", "iron-warriors"], "legion-night-lords": ["night-lords", "night-lords"],
    "legion-thousand-sons": ["thousand-sons", "thousand-sons"], "legion-word-bearers": ["word-bearers", "word-bearers"],
    "legion-world-eaters": ["world-eaters", "world-eaters"], "chaos-astartes": [null, "chaos"],
    // Primarques
    "primarque-guilliman": ["ultramarines", "ultramarines"], "primarque-sanguinius": ["blood-angels", "blood-angels"],
    "primarque-lion": ["dark-angels", "dark-angels"], "primarque-russ": ["space-wolves", "space-wolves"],
    "primarque-vulkan": ["salamanders", "salamanders"], "primarque-corax": ["raven-guard", "raven-guard"],
    "primarque-khan": ["white-scars", "white-scars"], "primarque-ferrus": ["iron-hands", "iron-hands"],
    "primarque-dorn": ["imperial-fists", "imperial-fists"], "primarque-horus": ["sons-of-horus", "heresie"],
    "primarque-alpharius": ["alpha-legion", "alpha-legion"], "primarque-angron": ["world-eaters", "world-eaters"],
    "primarque-curze": ["night-lords", "night-lords"], "primarque-fulgrim": ["emperors-children", "emperors-children"],
    "primarque-lorgar": ["word-bearers", "word-bearers"], "primarque-magnus": ["thousand-sons", "thousand-sons"],
    "primarque-mortarion": ["death-guard", "death-guard"], "primarque-perturabo": ["iron-warriors", "iron-warriors"],
    "primarques": ["imperium-aquila", "heresie"],
    // Héros & champions
    "heros-dante": ["blood-angels", "blood-angels"], "heros-calgar": ["ultramarines", "ultramarines"],
    "heros-draigo": ["grey-knights", "grey-knights"], "heros-cawl": ["adeptus-mechanicus", "mechanicus"],
    "heros-celestine": ["adepta-sororitas", "sororitas"], "heros-yarrick": ["astra-militarum", "garde"],
    "heros-mephiston": ["blood-angels", "blood-angels"], "heros-eisenhorn": ["inquisition", "inquisition"],
    "heros-gaunt": ["astra-militarum", "garde"], "heros-cain": ["astra-militarum", "humour"],
    "champion-abaddon": ["black-legion", "black-legion"], "champion-ahriman": ["thousand-sons", "thousand-sons"],
    "champion-kharn": ["world-eaters", "world-eaters"], "champion-typhus": ["death-guard", "death-guard"],
    "champion-fabius": ["emperors-children", "emperors-children"], "champion-huron": [null, "chaos"],
    // Imperium
    "index": ["imperium-aquila", "debutant"], "imperium-astartes": ["imperium-aquila", "debutant"],
    "imperium-arbites": ["adeptus-arbites", null], "imperium-custodes": ["adeptus-custodes", "custodes"],
    "imperium-serres": ["adeptus-custodes", "custodes"], "perso-empereur": ["imperium-aquila", "custodes"],
    "univers-trone": [null, "custodes"], "imperium-silence": [null, "custodes"],
    "imperium-inquisition": ["inquisition", "inquisition"], "imperium-assassins": ["officio-assassinorum", "assassins"],
    "imperium-mechanicus": ["adeptus-mechanicus", "mechanicus"], "imperium-sororitas": ["adepta-sororitas", "sororitas"],
    "imperium-ministorum": ["adepta-sororitas", "sororitas"], "imperium-militarum": ["astra-militarum", "garde"],
    "militarum-tempestus": ["astra-militarum", "garde"], "imperium-knights": ["imperial-knights", "knights"],
    // Chaos
    "chaos-dieux": [null, "chaos"], "evt-croisades-noires": ["black-legion", "black-legion"],
    // Xenos
    "xenos-arlequins": ["aeldari", "aeldari"], "xenos-aspects": ["aspect-warriors", "aeldari"], "xenos-ynnari": ["aeldari", "aeldari"],
    "xenos-kroots": ["tau-empire", "tau"], "chaos-demons": [null, "chaos"], "chaos-chevaliers": [null, "chaos"],
    "chapitre-legion-damnes": ["legion-damned", "debutant"], "imperium-marine": ["imperial-navy", "garde"],
    "xenos-aeldari": ["aeldari", "aeldari"], "craftworld-alaitoc": ["alaitoc", "aeldari"],
    "xenos-eldrad": ["aeldari", "aeldari"], "xenos-yvraine": ["aeldari", "aeldari"],
    "xenos-drukhari": ["drukhari", "drukhari"], "xenos-vect": ["drukhari", "drukhari"],
    "xenos-necrons": ["necrons", "necrons"], "xenos-trazyn": ["necrons", "necrons"], "xenos-imotekh": ["necrons", "necrons"],
    "xenos-orks": ["orks", "orks"], "xenos-ghazghkull": ["orks", "orks"],
    "xenos-tau": ["tau-empire", "tau"], "xenos-farsight": ["farsight", "tau"],
    "xenos-tyranides": [null, "tyranides"], "genestealer-cultes": [null, "tyranides"],
    // Chronologie
    "evt-heresie": [null, "heresie"], "chrono-heresie": [null, "heresie"], "evt-grande-croisade": [null, "heresie"],
    "evt-nikaea": [null, "heresie"], "evt-siege-terra": [null, "siege-terra"],
    "evt-indomitus": [null, "m42"], "chrono-indomitus": [null, "m42"], "evt-grande-faille": [null, "m42"]
  };
  var PREFIXES = [
    ["ordre-", "adepta-sororitas", "sororitas"], ["ordo-", "inquisition", "inquisition"],
    ["assassin-", "officio-assassinorum", "assassins"], ["regiment-", "astra-militarum", "garde"],
    ["maison-", "imperial-knights", "knights"], ["mechanicus-", "adeptus-mechanicus", "mechanicus"],
    ["dynastie-", "necrons", "necrons"], ["clan-", "orks", "orks"], ["caste-", "tau-empire", "tau"],
    ["craftworld-", "aeldari", "aeldari"], ["drukhari-", "drukhari", "drukhari"],
    ["flotte-", null, "tyranides"], ["dieu-", null, "chaos"]
  ];
  var info = EXACT[page] || null;
  if (!info) PREFIXES.forEach(function (p) { if (!info && page.indexOf(p[0]) === 0) info = [p[1], p[2]]; });
  info = info || [null, null];

  /* =========================================================
     1. EMBLÈME « PICT-SCAN »
     ========================================================= */
  // Filtres SVG : recolorent n'importe quelle silhouette dans la couleur exacte du phosphore
  var defs = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
  defs.setAttribute("width", "0"); defs.setAttribute("height", "0"); defs.setAttribute("aria-hidden", "true");
  defs.style.position = "absolute";
  defs.innerHTML = ["ph", "chaos", "xenos"].map(function (k) {
    return '<filter id="cogi-' + k + '" color-interpolation-filters="sRGB"><feFlood style="flood-color:var(--' + k + ')"/><feComposite in2="SourceAlpha" operator="in"/></filter>';
  }).join("");
  doc.body.appendChild(defs);

  var hero = doc.querySelector(".page-hero");
  if (info[0] && hero) {
    var fam = hero.classList.contains("chaos") ? "chaos" : hero.classList.contains("xenos") ? "xenos" : "";
    var fig = doc.createElement("figure");
    fig.className = "pict " + fam;
    fig.innerHTML = '<img src="logo/' + info[0] + '.svg" alt="" loading="lazy"><figcaption>PICT-SCAN<br>' +
      esc(info[0].replace(/-/g, " ").toUpperCase()) + "</figcaption>";
    fig.querySelector("img").addEventListener("error", function () { fig.remove(); hero.classList.remove("avec-pict"); });
    hero.classList.add("avec-pict");
    hero.insertBefore(fig, hero.firstChild);
  }

  /* Lien vers la toile des relations, à droite du fil d'Ariane */
  var fil = doc.querySelector(".breadcrumb");
  if (fil && window.fetch !== undefined && !/^(toile|frise|carte|cartographe|examen|forge|lexique|comparateur|generateurs)$/.test(page)) {
    var lt = doc.createElement("a"); lt.href = "toile.html?d=" + page; lt.className = "fil-toile"; lt.textContent = "TOILE DES RELATIONS ›";
    fil.appendChild(lt);
    // Impression du dossier : relevé (noir sur blanc) ou parchemin
    var im = doc.createElement("span"); im.className = "fil-impr";
    im.innerHTML = 'IMPRIMER : <button type="button" data-s="releve">RELEVÉ</button> · <button type="button" data-s="parchemin">PARCHEMIN</button>';
    im.addEventListener("click", function (e) { var s = e.target.getAttribute && e.target.getAttribute("data-s"); if (s) window.COGI_IMPRIMER(s); });
    fil.appendChild(im);
  }
  // En-tête des pages imprimées (invisible à l'écran)
  var main = doc.querySelector("main") || doc.body;
  var ent = doc.createElement("div"); ent.className = "impr-entete";
  ent.innerHTML = "<span>CODEX TENEBRARUM · " + esc((doc.title.split(" — ")[0] || "").toUpperCase()) + "</span><span>" +
    (location.protocol.indexOf("http") === 0 ? esc(location.host + location.pathname) : "Copie locale") + "</span>";
  var hero2 = doc.querySelector(".page-hero");
  (hero2 ? hero2.parentNode : main).insertBefore(ent, hero2 || main.firstChild);
  window.COGI_IMPRIMER = function (style) {
    doc.documentElement.setAttribute("data-impr", style === "parchemin" ? "parchemin" : "releve");
    setTimeout(function () { window.print(); }, 50);
  };

  /* =========================================================
     2. LECTURES CONSEILLÉES (depuis le Cartographe)
     ========================================================= */
  function lectures() {
    if (!info[1]) return;
    var main = doc.querySelector("main.wrap") || doc.querySelector(".wrap");
    if (!main) return;
    charger("cartographe-data.js", function () { return !!window.CARTO_LIVRES; }).then(function () {
      var th = window.CARTO_THEMES.filter(function (t) { return t.id === info[1]; })[0];
      if (!th) return;
      var L = window.CARTO_LIVRES, P = {}; L.forEach(function (b) { P[b.id] = b; });
      var ids = th.choix ? th.choix.slice() : L.filter(function (b) { return b.tags.some(function (x) { return th.tags.indexOf(x) >= 0; }); }).map(function (b) { return b.id; });
      // on propose des points d'entrée : premiers tomes, du plus accessible au plus exigeant
      var entrees = ids.map(function (id) { return P[id]; }).filter(function (b) { return !b.req.length; });
      if (!th.choix) entrees.sort(function (a, b) { return (a.niv * 100 + a.y) - (b.niv * 100 + b.y); });
      entrees = entrees.slice(0, 4);
      if (!entrees.length) return;
      var box = doc.createElement("section");
      box.className = "lectures";
      box.innerHTML = '<div class="lect-tete"><span>ARCHIVES DE LA BLACK LIBRARY</span><span>' + ids.length + " roman(s) répertorié(s)</span></div>" +
        "<h3>Lectures conseillées</h3><ol>" +
        entrees.map(function (b) {
          return "<li><b>" + esc(b.t) + "</b>" + (b.vf ? " <i>(" + esc(b.vf) + ")</i>" : "") +
            ' <span class="lect-meta">— ' + esc(b.a) + ", " + b.y + "</span><br><span class=\"lect-pq\">" + esc(b.pourquoi) + "</span></li>";
        }).join("") + "</ol>" +
        '<a class="lect-lien" href="cartographe.html?q=' + encodeURIComponent(th.nom) + '">Tracer le parcours complet : ' + esc(th.nom) + " ›</a>";
      var ancre = main.querySelector(".conclusion") || main.querySelector(".back-top");
      if (ancre) ancre.parentNode.insertBefore(box, ancre); else main.appendChild(box);
    }, function () {});
  }
  lectures();

  /* =========================================================
     3. GLOSSAIRE AU SURVOL
     ========================================================= */
  var bulle = null, cibleActive = null;
  function montrer(span) {
    var g = window.CODEX_GLOSSAIRE[+span.dataset.g];
    if (!bulle) { bulle = doc.createElement("div"); bulle.className = "gl-bulle"; bulle.setAttribute("role", "tooltip"); bulle.id = "gl-bulle"; doc.body.appendChild(bulle); }
    bulle.innerHTML = '<div class="gl-t">' + esc(g.t.toUpperCase()) + '</div><div class="gl-d">' + esc(g.def) + "</div>" +
      (g.page && g.page.replace(".html", "") !== page ? '<a href="' + g.page + '">Consulter le dossier ›</a> ' : "") +
      '<a href="lexique.html?q=' + encodeURIComponent(g.t) + '">Lexique ›</a>';
    bulle.style.display = "block";
    var r = span.getBoundingClientRect(), bw = Math.min(340, window.innerWidth - 24);
    bulle.style.width = bw + "px";
    var x = Math.max(12, Math.min(window.innerWidth - bw - 12, r.left + r.width / 2 - bw / 2));
    var y = r.bottom + 8;
    bulle.style.left = x + "px"; bulle.style.top = (y + window.scrollY) + "px";
    var bh = bulle.offsetHeight;
    if (r.bottom + bh + 80 > window.innerHeight && r.top - bh - 8 > 0) bulle.style.top = (r.top - bh - 8 + window.scrollY) + "px";
    span.setAttribute("aria-describedby", "gl-bulle");
    cibleActive = span;
  }
  function cacher() { if (bulle) bulle.style.display = "none"; if (cibleActive) cibleActive.removeAttribute("aria-describedby"); cibleActive = null; }
  function glossaire() {
    if (page === "lexique") return;
    var racine = doc.querySelector("main") || doc.querySelector(".wrap");
    if (!racine) return;
    charger("glossaire.js", function () { return !!window.CODEX_GLOSSAIRE; }).then(function () {
      var G = window.CODEX_GLOSSAIRE, faits = {}, total = 0;
      var motifs = [];
      G.forEach(function (g, i) {
        if (g.survol === false || (g.page && g.page.replace(".html", "") === page)) return;
        g.alias.forEach(function (a) { motifs.push({ a: a, i: i }); });
      });
      motifs.sort(function (x, y) { return y.a.length - x.a.length; });
      if (!motifs.length) return;
      var reEsc = function (s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); };
      var re = new RegExp("(^|[^\\p{L}\\-])(" + motifs.map(function (m) { return reEsc(m.a); }).join("|") + ")(?![\\p{L}\\-])", "u");
      var parAlias = {}; motifs.forEach(function (m) { parAlias[m.a] = m.i; });
      var w = doc.createTreeWalker(racine, NodeFilter.SHOW_TEXT, {
        acceptNode: function (n) {
          var p = n.parentNode;
          if (!p || p.closest("svg, label, select, a, h1, h2, h3, h4, .card, .toc, .lectures, .stat-grid .lbl, figcaption, .gl, button, .classifie-voile, blockquote cite, .breadcrumb")) return NodeFilter.FILTER_REJECT;
          return n.nodeValue.length > 3 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      });
      var noeuds = []; while (w.nextNode()) noeuds.push(w.currentNode);
      noeuds.forEach(function (nd) {
        if (total >= 30) return;
        var txt = nd.nodeValue, frag = null, reste = txt, m;
        while (reste && (m = reste.match(re))) {
          var alias = m[2], gi = parAlias[alias];
          var debut = m.index + m[1].length;
          if (faits[gi]) { // déjà signalé : on continue après
            frag = frag || doc.createDocumentFragment();
            frag.appendChild(doc.createTextNode(reste.slice(0, debut + alias.length)));
            reste = reste.slice(debut + alias.length); continue;
          }
          faits[gi] = 1; total++;
          frag = frag || doc.createDocumentFragment();
          frag.appendChild(doc.createTextNode(reste.slice(0, debut)));
          var sp = doc.createElement("span"); sp.className = "gl"; sp.tabIndex = 0; sp.dataset.g = gi; sp.textContent = alias;
          frag.appendChild(sp);
          reste = reste.slice(debut + alias.length);
        }
        if (frag) { frag.appendChild(doc.createTextNode(reste)); nd.parentNode.replaceChild(frag, nd); }
      });
    }, function () {});
  }
  doc.addEventListener("mouseover", function (e) { var s = e.target.closest && e.target.closest(".gl"); if (s) montrer(s); });
  doc.addEventListener("mouseout", function (e) {
    var s = e.target.closest && e.target.closest(".gl");
    if (s && !(e.relatedTarget && (e.relatedTarget.closest(".gl-bulle") || e.relatedTarget === s))) setTimeout(function () { if (!bulle || !bulle.matches(":hover")) cacher(); }, 120);
  });
  doc.addEventListener("focusin", function (e) { if (e.target.classList && e.target.classList.contains("gl")) montrer(e.target); });
  doc.addEventListener("focusout", function (e) { if (e.target.classList && e.target.classList.contains("gl")) setTimeout(function () { if (!bulle || !bulle.contains(doc.activeElement)) cacher(); }, 100); });
  doc.addEventListener("click", function (e) {
    var s = e.target.closest && e.target.closest(".gl");
    if (s) { e.preventDefault(); if (cibleActive === s && bulle && bulle.style.display === "block") cacher(); else montrer(s); return; }
    if (bulle && !bulle.contains(e.target)) cacher();
  });
  doc.addEventListener("keydown", function (e) { if (e.key === "Escape") cacher(); });
  window.addEventListener("scroll", function () { if (cibleActive && !bulle.matches(":hover")) cacher(); }, { passive: true });

  /* =========================================================
     4. DOSSIERS CLASSIFIÉS — « Le secret : … » et .classifie
     ========================================================= */
  function classifies() {
    // a) Conversion automatique des sous-sections « Le secret : … »
    doc.querySelectorAll("h3").forEach(function (h) {
      if (!/^\s*Le secret\s*:/i.test(h.textContent) || h.closest(".classifie")) return;
      var bloc = doc.createElement("div"); bloc.className = "classifie";
      var titre = h.textContent.replace(/^\s*Le secret\s*:\s*/i, "");
      bloc.dataset.titre = titre;
      h.parentNode.insertBefore(bloc, h);
      var n = h.nextSibling, contenu = [];
      while (n && !(n.nodeType === 1 && (/^H[23]$/.test(n.tagName) || n.classList.contains("fiche") || n.classList.contains("relic") || n.classList.contains("hero-entry")))) {
        var suiv = n.nextSibling;
        if (n.nodeType === 1 && n.tagName === "BLOCKQUOTE") break;
        contenu.push(n); n = suiv;
      }
      h.remove();
      var corps = doc.createElement("div"); corps.className = "classifie-corps";
      contenu.forEach(function (c) { corps.appendChild(c); });
      bloc.appendChild(corps);
    });
    // b) Mise en place du voile sur chaque bloc .classifie
    var grade = null; try { grade = localStorage.getItem("cogi.grade"); } catch (e) {}
    doc.querySelectorAll(".classifie").forEach(function (b, i) {
      if (b.dataset.pret) return; b.dataset.pret = "1";
      if (b.querySelector("mark.hl")) return; // ouvert d'office si la recherche y mène
      var corps = b.querySelector(".classifie-corps");
      if (!corps) { corps = doc.createElement("div"); corps.className = "classifie-corps"; while (b.firstChild) corps.appendChild(b.firstChild); b.appendChild(corps); }
      var titre = b.dataset.titre || "Information sensible";
      var voile = doc.createElement("div"); voile.className = "classifie-voile";
      var ref = "VERMILLION-" + String(1000 + (page.length * 37 + i * 211) % 9000);
      voile.innerHTML =
        '<div class="cl-tete">+++ DOSSIER CLASSIFIÉ · NIVEAU ' + ref + " +++</div>" +
        '<div class="cl-titre">' + esc(titre) + "</div>" +
        '<div class="cl-barres" aria-hidden="true"><i style="width:92%"></i><i style="width:78%"></i><i style="width:85%"></i><i style="width:40%"></i></div>' +
        '<button type="button" class="cl-btn">DÉCRYPTER</button>' +
        '<span class="cl-note">' + (grade ? "Sceau reconnu : " + esc(grade) + "." : "Contient des révélations sur le lore. Déchiffrez à vos risques.") + "</span>";
      b.insertBefore(voile, corps);
      corps.hidden = true;
      voile.querySelector(".cl-btn").addEventListener("click", function () { decrypter(b, voile, corps); });
    });
  }
  function decrypter(b, voile, corps) {
    var btn = voile.querySelector(".cl-btn"); btn.disabled = true;
    var etapes = ["CONTOURNEMENT DES SCEAUX", "INVOCATION DU CHIFFRE VERMILLION", "DÉCHIFFRAGE"], k = 0;
    var t = setInterval(function () {
      btn.textContent = etapes[k] + "…";
      if (++k > etapes.length) {
        clearInterval(t);
        voile.remove(); corps.hidden = false; b.classList.add("ouvert");
        if (!reduit) brouiller(corps);
        var tete = doc.createElement("div"); tete.className = "cl-tete ouvert"; tete.textContent = "+++ DÉCRYPTÉ : " + (b.dataset.titre || "dossier").toUpperCase() + " +++";
        b.insertBefore(tete, corps);
      }
    }, reduit ? 60 : 380);
  }
  function brouiller(racine) {
    var w = doc.createTreeWalker(racine, NodeFilter.SHOW_TEXT, null), nds = [];
    while (w.nextNode()) if (w.currentNode.nodeValue.trim()) nds.push([w.currentNode, w.currentNode.nodeValue]);
    var gl = "█▓▒░#%&@01", n = 0, N = 12;
    var t = setInterval(function () {
      n++;
      nds.forEach(function (x) {
        var v = x[1], k = Math.floor(v.length * n / N), s = v.slice(0, k);
        for (var j = k; j < v.length; j++) s += /\s/.test(v[j]) ? v[j] : gl[(j * 7 + n) % gl.length];
        x[0].nodeValue = s;
      });
      if (n >= N) { clearInterval(t); nds.forEach(function (x) { x[0].nodeValue = x[1]; }); }
    }, 45);
  }

  classifies();   // avant le glossaire : les voiles sont exclus du balisage
  glossaire();

  /* =========================================================
     5. REGISTRE DES COMMENTAIRES (giscus, discussions GitHub)
     Seulement sur le site en ligne, et seulement sur les dossiers.
     ========================================================= */
  (function commentaires() {
    if (location.protocol.indexOf("http") !== 0 || !doc.querySelector(".page-hero")) return;
    if (/^(index|toile|frise|carte|cartographe|examen|forge|lexique|comparateur|generateurs|factions|personnages|univers|chronologie)$/.test(page)) return;
    var ancre = doc.querySelector("main .back-top"), main = doc.querySelector("main");
    if (!main) return;
    var sec = doc.createElement("section"); sec.className = "registre-com";
    sec.innerHTML = '<h2>Registre des commentaires</h2><p class="rc-note">Débattez de ce dossier avec les autres acolytes. Connexion avec un compte GitHub.</p><div class="giscus"></div>';
    if (ancre) main.insertBefore(sec, ancre); else main.appendChild(sec);
    var sc = doc.createElement("script"); sc.src = "https://giscus.app/client.js"; sc.async = true; sc.crossOrigin = "anonymous";
    var conf = { repo: "kawa34400/codex-tenebrarum", "repo-id": "R_kgDOVDx9nQ", category: "Announcements", "category-id": "DIC_kwDOVDx9nc4DHf-j",
      mapping: "pathname", strict: "0", "reactions-enabled": "1", "emit-metadata": "0", "input-position": "top", theme: "transparent_dark", lang: "fr", loading: "lazy" };
    Object.keys(conf).forEach(function (k) { sc.setAttribute("data-" + k, conf[k]); });
    sec.appendChild(sc);
  })();
})();
