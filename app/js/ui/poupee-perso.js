// Poupée du personnage (docs/design/personnage.md). Neutre : ni cheveux, ni genre, pas de drapeau.
// Les couleurs sont des jetons CSS (clair, sombre, ambiance) : rien n'est écrit en dur.
// Elle n'entre jamais dans une rangée de progression (les 4 états gardent leurs formes à eux).

import { COMBINAISONS } from "../personnage.js";
import { t } from "../textes.js";

const NS = "http://www.w3.org/2000/svg";

function el(nom, attrs) {
  const e = document.createElementNS(NS, nom);
  Object.keys(attrs || {}).forEach((k) => e.setAttribute(k, attrs[k]));
  return e;
}
const jeton = (nom) => "var(" + nom + ")";
// Contour 2 px quelle que soit la taille de la poupée.
const trait = { stroke: jeton("--text"), "stroke-width": "2", "vector-effect": "non-scaling-stroke", "stroke-linejoin": "round" };
const plein = (couleur, extra) => Object.assign({ fill: jeton(couleur) }, trait, extra);

// Motifs du tablier, centrés sur (30, 55).
function motif(nom, couleur) {
  const g = el("g");
  const fin = { stroke: jeton("--text"), "stroke-width": "1", "vector-effect": "non-scaling-stroke" };
  if (nom === "baies") {
    [[25.5, 57], [34.5, 57], [30, 50]].forEach(([x, y]) => g.appendChild(el("circle", Object.assign({ cx: x, cy: y, r: 3.4, fill: jeton(couleur) }, fin))));
  } else if (nom === "feuilles") {
    [-40, 40].forEach((a) => g.appendChild(el("ellipse", Object.assign({ cx: 30, cy: 54, rx: 3, ry: 7, fill: jeton(couleur), transform: "rotate(" + a + " 30 60)" }, fin))));
  } else {
    for (let i = 0; i < 5; i++) {
      const a = (i * 72 * Math.PI) / 180;
      g.appendChild(el("circle", Object.assign({ cx: 30 + 4.6 * Math.sin(a), cy: 55 - 4.6 * Math.cos(a), r: 3, fill: jeton(couleur) }, fin)));
    }
    g.appendChild(el("circle", { cx: 30, cy: 55, r: 1.8, fill: jeton("--bg"), stroke: jeton("--text"), "stroke-width": "1", "vector-effect": "non-scaling-stroke" }));
  }
  return g;
}

/**
 * @param {object} perso   personnage (couleurs, motif)
 * @param {number} hauteur px (56 et plus : le personnage est toujours plus grand qu'une poupée de progression)
 * @param {boolean} [decoratif] vrai si le nom de la poupée est écrit à côté
 */
export function poupeePerso(perso, hauteur, decoratif) {
  const c = COMBINAISONS.find((x) => x.id === perso.couleurs) || COMBINAISONS[0];
  const svg = el("svg", { class: "poupee-perso", viewBox: "0 0 60 80", height: String(hauteur), width: String(Math.round((hauteur * 60) / 80)), focusable: "false" });
  if (decoratif) svg.setAttribute("aria-hidden", "true");
  else {
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", t("perso.poupee", { couleurs: t("perso.couleurs." + c.id).toLowerCase(), motif: t("perso.motif." + perso.motif).toLowerCase() }));
  }
  svg.appendChild(el("path", plein(c.corps, { d: "M30 24C14 28 8 46 10 62C11 72 20 77 30 77C40 77 49 72 50 62C52 46 46 28 30 24Z" })));
  svg.appendChild(el("ellipse", plein(c.tablier, { cx: 30, cy: 56, rx: 12, ry: 15 })));
  svg.appendChild(motif(perso.motif, c.accent));
  svg.appendChild(el("circle", plein("--accent-soft", { cx: 30, cy: 20, r: 13 })));
  svg.appendChild(el("path", plein(c.accent, { d: "M17 17C17 5 43 5 43 17C38 12 22 12 17 17Z" })));
  [[24.5, 21.5], [35.5, 21.5]].forEach(([x, y]) => svg.appendChild(el("circle", { cx: x, cy: y, r: 1.5, fill: jeton("--text") })));
  [[21.8, 25.5], [38.2, 25.5]].forEach(([x, y]) => svg.appendChild(el("circle", { cx: x, cy: y, r: 2.2, fill: jeton("--deco-joue"), opacity: "0.7" })));
  svg.appendChild(el("path", { d: "M27.5 26.2Q30 28.4 32.5 26.2", fill: "none", stroke: jeton("--text"), "stroke-width": "1.2", "stroke-linecap": "round" }));
  return svg;
}
