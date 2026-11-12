// Menu déroulant (bagou-ru.md, section 5) : bouton « Menu » écrit, en haut à gauche de chaque écran,
// qui ouvre une liste sous lui (pas un plein écran). Codage : <button aria-expanded> + liste de liens,
// pas de role="menu". Fermeture : Échap, toucher en dehors, ou re-toucher « Menu ».
// Seules les entrées qui existent sont listées (Mes progrès, Réglages) : ni entrée vide, ni « bientôt ».

import { h, icone, focaliser } from "./dom.js";
import { t } from "../textes.js";

const ENTREES = [
  { ecran: "progres", icone: "graphique", texte: "menu.progres" },
  { ecran: "reglages", icone: "engrenage", texte: "menu.reglages" }
];

/**
 * @param {object} ctx
 * @param {object} o
 * @param {string} [o.ici]         écran courant (« progres », « reglages ») : porte « Tu es ici »
 * @param {function} [o.choisir]   appelé avec l'écran choisi, à la place de la navigation directe (la session demande confirmation)
 * @param {function} [o.surOuverture] / [o.surFermeture] : la session met son chrono en pause pendant que le menu est ouvert
 */
export function creerMenu(ctx, o) {
  const opts = o || {};
  let ouvert = false;
  const bouton = h("button", { type: "button", class: "btn-menu", "aria-expanded": "false", "aria-haspopup": "true", onclick: basculer },
    icone("menu"), t("menu.bouton"));
  const liste = h("ul", { class: "liste-menu" }, ENTREES.map((e) => {
    const ici = e.ecran === opts.ici;
    const lien = h("a", { href: "#" + e.ecran, "aria-current": ici ? "page" : null, onclick: (ev) => {
      ev.preventDefault();
      if (ici) { fermer(true); return; }
      fermer(false);
      if (opts.choisir) opts.choisir(e.ecran); else ctx.aller(e.ecran);
    } }, icone(e.icone), t(e.texte), ici ? h("span", { class: "ici" }, t("menu.ici")) : null);
    return h("li", null, lien);
  }));
  liste.hidden = true;
  const zone = h("div", { class: "menu-zone" }, bouton, liste);

  function ouvrirMenu() {
    if (ouvert) return;
    ouvert = true;
    liste.hidden = false;
    bouton.setAttribute("aria-expanded", "true");
    document.addEventListener("pointerdown", dehors, true);
    document.addEventListener("keydown", clavier, true);
    if (opts.surOuverture) opts.surOuverture();
    focaliser(liste.querySelector("a"));
  }
  // rendreFocus : le focus revient au bouton (fermeture au clavier ou nouveau toucher sur « Menu »).
  function fermer(rendreFocus) {
    if (!ouvert) return;
    ouvert = false;
    liste.hidden = true;
    bouton.setAttribute("aria-expanded", "false");
    document.removeEventListener("pointerdown", dehors, true);
    document.removeEventListener("keydown", clavier, true);
    if (opts.surFermeture) opts.surFermeture();
    if (rendreFocus && bouton.isConnected) focaliser(bouton);
  }
  function basculer() { if (ouvert) fermer(true); else ouvrirMenu(); }
  function dehors(e) { if (!zone.contains(e.target)) fermer(false); }
  function clavier(e) {
    if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); fermer(true); }
  }
  return { element: zone, fermer: () => fermer(false), get ouvert() { return ouvert; } };
}
