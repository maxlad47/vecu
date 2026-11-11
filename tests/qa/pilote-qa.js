// Outils de pilotage injectés dans la page par le pilote Ruby (après chargement).
window.__d = (function () {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const bouton = (txt) => $$("button").find((b) => b.textContent.includes(txt) && b.isConnected);
  const pause = (ms) => new Promise((r) => setTimeout(r, ms));
  function ecran() {
    const c = $(".consigne"), t = $(".titre-ecran"), h = $("h1");
    return {
      consigne: c && c.textContent, titre: t && t.textContent, h1: h && h.textContent,
      voiture: !!$(".voiture-route"), pause: $(".bouton-pause") && $(".bouton-pause").getAttribute("aria-label"),
      compteur: $(".compteur") && $(".compteur").textContent, accueil: !!$("#lieu-silence"),
      ecouter: $$("[data-ecouter]").length, dialog: !!$("[role=dialog]")
    };
  }
  // Répond à la carte courante. Renvoie une étiquette du type de carte.
  async function repondre(i, opts) {
    const o = opts || {};
    const c = $(".consigne"); if (!c) return "pas-de-carte";
    const type = c.textContent;
    if (o.toutToucher) {
      // On touche tous les boutons de la carte sauf Quitter et la réponse, plusieurs fois.
      for (const b of $$(".zone-phrase button, .encart-genre button, .badge, [data-ecouter], .btn-reecouter")) { b.click(); }
      for (const k of ["1", "2", "3", "Enter", " ", "Escape", "e", "l"]) document.activeElement && document.activeElement.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true }));
    }
    const options = $$(".option:not([aria-disabled])");
    if (options.length) { options[(i || 0) % options.length].click(); }
    else if ($$(".reserve button.tuile").length) {
      let n = 0; while ($(".reserve button.tuile") && n++ < 20) $(".reserve button.tuile").click();
      const v = bouton("Vérifier"); if (v) v.click();
    } else if (bouton("Voir la réponse")) { bouton("Voir la réponse").click(); await pause(50); const j = bouton(i % 3 ? "Je l" : "Pas encore"); if (j) j.click(); return type; }
    await pause(50);
    const s = bouton("Suivant"); if (s && s.isConnected) s.click();
    return type;
  }
  return { $, $$, bouton, ecran, repondre, pause };
})();
true;
