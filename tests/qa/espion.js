// Espion QA, injecté AVANT tout script de l'app (Page.addScriptToEvaluateOnNewDocument).
// Configuration : window.__qaConf, posée juste avant par le pilote.
//   voix : "ru+fr" | "ru" | "fr" | "aucune"      tard : délai (ms) avant que les voix apparaissent (voiceschanged)
//   fin  : "normal" | "jamais" (onend ne vient jamais)  annulation : "async" | "sync" (onerror pendant cancel())
//   vitesse : facteur de durée des lectures simulées (1 = ~13 caractères/s)
//   idb : "ok" | "absent" | "leve" | "bloque" | "ecritureLeve"
(function () {
  if (window.top !== window) return;
  const C = Object.assign({ voix: "ru+fr", tard: 0, fin: "normal", annulation: "async", vitesse: 1, idb: "ok", synthese: "fausse" }, window.__qaConf || {});
  const qa = window.__qa = { acces: 0, speak: [], cancels: 0, piles: [], appels: [], debut: performance.now(), erreurs: [] };
  window.addEventListener("error", (e) => qa.erreurs.push("error: " + e.message));
  window.addEventListener("unhandledrejection", (e) => qa.erreurs.push("rejet: " + (e.reason && (e.reason.stack || e.reason.message) || e.reason)));

  // ---- Fausse synthèse ----
  if (C.synthese === "fausse") {
    const toutes = [];
    if (C.voix.includes("ru")) toutes.push({ lang: "ru-RU", name: "QA ru", localService: true, voiceURI: "qa-ru", default: false });
    if (C.voix.includes("fr")) toutes.push({ lang: "fr-FR", name: "QA fr", localService: true, voiceURI: "qa-fr", default: true });
    let pretes = !C.tard;
    const ecoute = { voiceschanged: [] };
    let courant = null, minuteur = null;
    const contexte = () => {
      // Session = écran avec les pastilles de contexte. « Couper le son » (button.badge) n'existe que si le son est permis.
      const session = document.querySelector(".contexte");
      return session && !document.querySelector(".contexte button.badge") ? "SESSION-SILENCE" : (document.querySelector(".voiture-route") ? "voiture" : (session ? "session-son" : "hors-session"));
    };
    const faux = {
      paused: false, pending: false,
      get speaking() { return !!courant; },
      getVoices() { qa.appels.push("getVoices@" + contexte()); return pretes ? toutes.slice() : []; },
      speak(u) {
        qa.speak.push({ t: Math.round(performance.now() - qa.debut), lang: u.lang, rate: u.rate, vol: u.volume, texte: u.text, ctx: contexte() });
        if (courant) { /* file d'attente ignorée : l'app coupe avant */ }
        courant = u;
        const ms = Math.max(300, (u.text.length / (13 * (u.rate || 1))) * 1000 * C.vitesse);
        if (C.fin === "normal" || (C.fin === "jamaisRu" && !/^ru/.test(u.lang))) {
          minuteur = setTimeout(() => { if (courant === u) { courant = null; u.onend && u.onend({}); } }, ms);
        }
        if (C.interrompreApres && qa.speak.length === C.interrompreApres) {
          clearTimeout(minuteur);
          setTimeout(() => { if (courant === u) { courant = null; u.onerror && u.onerror({ error: "interrupted" }); } }, 100);
        }
      },
      cancel() {
        qa.cancels++; qa.appels.push("cancel@" + contexte());
        clearTimeout(minuteur);
        const u = courant; courant = null;
        if (u && u.onerror) {
          if (C.annulation === "sync") u.onerror({ error: "interrupted" });
          else setTimeout(() => u.onerror({ error: "interrupted" }), 0);
        }
      },
      pause() {}, resume() {},
      addEventListener(n, f) { (ecoute[n] = ecoute[n] || []).push(f); },
      removeEventListener(n, f) { ecoute[n] = (ecoute[n] || []).filter((x) => x !== f); }
    };
    if (C.tard) setTimeout(() => { pretes = true; ecoute.voiceschanged.forEach((f) => f()); }, C.tard);
    Object.defineProperty(window, "speechSynthesis", { configurable: true, get() {
      qa.acces++;
      qa.piles.push({ ctx: contexte(), pile: (new Error().stack || "").split("\n").slice(2, 4).map((s) => s.trim()).join(" < ") });
      return faux;
    } });
    window.SpeechSynthesisUtterance = function (texte) { this.text = texte; this.volume = 1; this.rate = 1; this.lang = ""; this.voice = null; };
  } else if (C.synthese === "absente") {
    try { delete window.speechSynthesis; } catch (e) {}
    Object.defineProperty(window, "speechSynthesis", { configurable: true, get() { qa.acces++; return undefined; } });
  }

  // ---- IndexedDB en panne ----
  if (C.idb === "absent") Object.defineProperty(window, "indexedDB", { configurable: true, get() { return undefined; } });
  if (C.idb === "leve") Object.defineProperty(window, "indexedDB", { configurable: true, get() { throw new DOMException("refusé", "SecurityError"); } });
  if (C.idb === "bloque") {
    const vrai = window.indexedDB;
    Object.defineProperty(window, "indexedDB", { configurable: true, get() { return { open() { return {}; } }; } });
  }
  if (C.idb === "ecritureLeve") {
    const orig = IDBDatabase.prototype.transaction;
    IDBDatabase.prototype.transaction = function (magasins, mode) {
      if (mode === "readwrite") throw new DOMException("plein", "QuotaExceededError");
      return orig.apply(this, arguments);
    };
  }

  // ---- Visibilité de l'onglet pilotable ----
  let cache = false;
  Object.defineProperty(document, "hidden", { configurable: true, get() { return cache; } });
  Object.defineProperty(document, "visibilityState", { configurable: true, get() { return cache ? "hidden" : "visible"; } });
  window.__qaCacher = (v) => { cache = !!v; document.dispatchEvent(new Event("visibilitychange")); };

  // ---- Interdits ----
  ["alert", "confirm", "prompt"].forEach((n) => { window[n] = function () { qa.erreurs.push("INTERDIT " + n); }; });
  const ouvrir = window.open; window.open = function () { qa.erreurs.push("INTERDIT window.open"); return null; };
})();
