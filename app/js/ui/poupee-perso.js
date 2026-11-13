// Poupée du personnage (docs/design/personnage.md). Neutre : ni cheveux, ni genre, pas de drapeau.
// Dessin commun avec les poupées de progression depuis la mission 015 (D34).
// Les couleurs sont des jetons CSS (clair, sombre, ambiance) : rien n'est écrit en dur.
// Elle n'entre jamais dans une rangée de progression (les 4 états gardent leurs formes à eux).

import { COMBINAISONS } from "../personnage.js";
import { t } from "../textes.js";

import { dessinPoupee } from "./dessin-poupee.js";

const NS = "http://www.w3.org/2000/svg";

/**
 * Poupée du personnage : le même dessin que les poupées de progression (ui/dessin-poupee.js), peint
 * aux couleurs choisies (corps, tablier, foulard) et avec le motif choisi. Contour à l'encre, 2 px à toute taille.
 * @param {object} perso   personnage (couleurs, motif)
 * @param {number} hauteur px (56 et plus : le personnage est toujours plus grand qu'une poupée de progression)
 * @param {boolean} [decoratif] vrai si le nom de la poupée est écrit à côté
 */
export function poupeePerso(perso, hauteur, decoratif) {
  const c = COMBINAISONS.find((x) => x.id === perso.couleurs) || COMBINAISONS[0];
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("class", "poupee-perso");
  svg.setAttribute("viewBox", "0 0 40 57");
  svg.setAttribute("height", String(hauteur));
  svg.setAttribute("width", String(Math.round((hauteur * 40) / 57)));
  svg.setAttribute("focusable", "false");
  if (decoratif) svg.setAttribute("aria-hidden", "true");
  else {
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", t("perso.poupee", { couleurs: t("perso.couleurs." + c.id).toLowerCase(), motif: t("perso.motif." + perso.motif).toLowerCase() }));
  }
  // Dessin fixe, couleurs = noms de jetons de COMBINAISONS (jamais du texte saisi) : innerHTML sans risque.
  svg.innerHTML = dessinPoupee({
    etat: "peinte", motif: perso.motif, corps: c.corps, tablier: c.tablier, foulard: c.accent,
    fleur: "--laque", feuille: "--accent", or: "--or", contour: "--text", epaisseur: 2, nonScaling: true
  });
  return svg;
}
