// Matriochka : le marqueur de progression (bagou-ru.md, section 3).
// Chaque état = une forme ET un mot. Les formes viennent du sprite inséré par ambiance.js.

import { h } from "./dom.js";
import { t } from "../textes.js";
import { estAcquis } from "../leitner.js";

const SVG_NS = "http://www.w3.org/2000/svg";

// Lien entre les 4 états et les boîtes de Leitner (point ouvert 4 de la mission 003, proposition de Kostia à valider par Vera) :
// boîte 0 ou aucune fiche = pas vue ; boîte 1 sans réussite = vue ; boîte 1 à 3 avec au moins une réussite = en cours ;
// boîte 4 et plus (BOITE_ACQUIS, la même règle que « Tu sais dire N phrases ») = acquise.
export function etatDe(fiche) {
  if (!fiche || fiche.boite < 1) return "pas_vue";
  if (estAcquis(fiche)) return "acquise";
  return fiche.nbReussites > 0 ? "en_cours" : "vue";
}

// Sous-texte de l'état. « Réussie N fois » : N est le vrai nombre de réussites de la fiche.
export function sousTexteEtat(etat, fiche) {
  if (etat === "en_cours") {
    const n = fiche ? fiche.nbReussites : 0;
    return n === 1 ? t("etat.enCours1") : t("etat.enCours", { n });
  }
  return t("etat." + etat + ".sous");
}

export function motEtat(etat) { return t("etat." + etat); }

// Une poupée. hauteur en px ; largeur = hauteur × 40/57. role="img" avec le mot d'état, sauf si le mot est écrit à côté (decoratif).
export function poupee(etat, hauteur, decoratif) {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", "poupee");
  svg.setAttribute("viewBox", "0 0 40 57");
  svg.setAttribute("height", String(hauteur));
  svg.setAttribute("width", String(Math.round((hauteur * 40) / 57)));
  svg.setAttribute("focusable", "false");
  if (decoratif) svg.setAttribute("aria-hidden", "true");
  else { svg.setAttribute("role", "img"); svg.setAttribute("aria-label", motEtat(etat)); }
  const use = document.createElementNS(SVG_NS, "use");
  use.setAttribute("href", "#poupee-" + etat);
  svg.appendChild(use);
  return svg;
}

// Rangée gigogne d'un thème : une poupée par phrase, de la plus petite à la plus grande, dans l'ordre des phrases.
// Décorative (aria-hidden) : l'information est dans le texte « 3 acquises sur 9 » écrit à côté.
export function rangeeGigogne(etats) {
  const n = etats.length;
  const bas = n > 9 ? 26 : 30, haut = n > 9 ? 50 : 54;
  return h("div", { class: "poupees", "aria-hidden": "true" }, etats.map((etat, i) =>
    poupee(etat, Math.round(n > 1 ? bas + ((haut - bas) * i) / (n - 1) : haut), true)));
}
