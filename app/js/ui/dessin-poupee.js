// Dessin de la matriochka (mission 015, D34) : une seule géométrie pour toutes les poupées de l'app,
// les 4 états de progression (fichiers content/<langue>/ambiance/poupee-*.svg, produits par
// scripts/poupees.mjs) et la poupée du personnage (ui/poupee-perso.js).
// Repère : viewBox 0 0 40 57. Les couleurs sont des jetons CSS passés en paramètre, jamais en dur.
// Ce module est pur (aucun DOM) : il rend du texte SVG, pour Node comme pour le navigateur.

const v = (nom) => "var(" + nom + ")";

// Silhouette : tête, cou pincé, épaules, ventre, base plate. Côté droit de haut en bas, le gauche en miroir.
// Points de jonction : sommet (20,1.6), tempe (31,13.2), cou (29,22.6), épaule (33.1,29.2), ventre (36.6,41.6), base (28.6,54.9).
const DROITE = [
  [[26.6, 1.6], [31, 6.4], [31, 13.2]],
  [[31, 17.4], [29.7, 20.2], [29, 22.6]],
  [[28.5, 24.4], [31.9, 26.4], [33.1, 29.2]],
  [[35.4, 33.6], [36.6, 37.6], [36.6, 41.6]],
  [[36.6, 48.4], [33.6, 53.2], [28.6, 54.9]]
];
const m = (p) => [40 - p[0], p[1]];
const f = (n) => Math.round(n * 100) / 100;
const pt = (p) => f(p[0]) + " " + f(p[1]);
const cubique = (c) => "C" + pt(c[0]) + " " + pt(c[1]) + " " + pt(c[2]);

// Le chemin descend du sommet par la droite jusqu'au segment n (exclu), et l'inverse à gauche.
function droiteJusqua(n) { return DROITE.slice(0, n).map(cubique).join(""); }
function gaucheDepuis(n) {
  // Remonte le côté gauche du segment n-1 au sommet : chaque cubique est inversée et mise en miroir.
  let d = "";
  for (let i = n - 1; i >= 0; i--) {
    const c = DROITE[i];
    const debut = i === 0 ? [20, 1.6] : DROITE[i - 1][2];
    d += "C" + pt(m(c[1])) + " " + pt(m(c[0])) + " " + pt(m(debut));
  }
  return d;
}
export const SILHOUETTE = "M20 1.6" + droiteJusqua(5) + "C24 56.1 16 56.1 11.4 54.9" + gaucheDepuis(5) + "Z";

// Foulard : suit exactement la silhouette du sommet aux épaules, puis l'ourlet descend vers le nœud sous le menton.
export const FOULARD = "M20 1.6" + droiteJusqua(3) +
  "C30 28.6 23.6 26.4 20 26.2C16.4 26.4 10 28.6 6.9 29.2" + gaucheDepuis(3) + "Z";
// Bordure dorée de l'ourlet du foulard.
const OURLET = "M33.1 29.2C30 28.6 23.6 26.4 20 26.2C16.4 26.4 10 28.6 6.9 29.2";

// Tablier : un écusson arrondi, du dessous du nœud jusqu'au-dessus de la base.
export const TABLIER = "M13.4 30.6C17 29.5 23 29.5 26.6 30.6C29.2 36.4 29.9 44 28.1 49.6C26.4 53.1 13.6 53.1 11.9 49.6C10.1 44 10.8 36.4 13.4 30.6Z";

// Liseré doré de la base : il suit le bas de la silhouette, en retrait.
const BASE = "M7.3 50.2C9.6 53.2 14.6 54.5 20 54.5C25.4 54.5 30.4 53.2 32.7 50.2";

// Pois du foulard : sur la calotte et les pans, jamais sur le visage.
const POIS = [[13.4, 5.6], [20, 3.9], [26.6, 5.6], [10.4, 10.6], [29.6, 10.6], [9.6, 16.8], [30.4, 16.8],
  [11.4, 22.4], [28.6, 22.4], [8.9, 27.2], [31.1, 27.2]];

function visage(o) {
  const c = o.contour, w = o.fin;
  return [
    // Bordure dorée du foulard autour du visage, puis le visage.
    o.or ? `<ellipse cx="20" cy="14.9" rx="8.5" ry="8.9" fill="none" stroke="${v(o.or)}" stroke-width="1.1"/>` : "",
    `<ellipse cx="20" cy="14.9" rx="7.4" ry="7.8" fill="${v("--deco-peau")}" stroke="${v(c)}" stroke-width="${w}"/>`,
    // Sourcils fins, yeux en amande avec un reflet, joues, nez, bouche en cœur.
    `<path d="M15.6 11.6Q17.1 10.7 18.5 11.4M21.5 11.4Q22.9 10.7 24.4 11.6" fill="none" stroke="${v("--deco-oeil")}" stroke-width=".55" stroke-linecap="round"/>`,
    `<ellipse cx="17.1" cy="14.2" rx=".95" ry="1.2" fill="${v("--deco-oeil")}"/><ellipse cx="22.9" cy="14.2" rx=".95" ry="1.2" fill="${v("--deco-oeil")}"/>`,
    `<circle cx="17.45" cy="13.75" r=".33" fill="${v("--deco-peau")}"/><circle cx="23.25" cy="13.75" r=".33" fill="${v("--deco-peau")}"/>`,
    `<circle cx="15.4" cy="17.5" r="1.75" fill="${v("--deco-joue")}" opacity=".8"/><circle cx="24.6" cy="17.5" r="1.75" fill="${v("--deco-joue")}" opacity=".8"/>`,
    `<path d="M19.5 16.4Q20 17 20.5 16.4" fill="none" stroke="${v("--deco-joue")}" stroke-width=".6" stroke-linecap="round"/>`,
    `<path d="M18.7 19.2C19.2 18.7 19.7 18.8 20 19.1C20.3 18.8 20.8 18.7 21.3 19.2C20.8 20.2 19.2 20.2 18.7 19.2Z" fill="${v(o.levres)}"/>`
  ].join("");
}

// Nœud du foulard sous le menton : deux boucles et un nœud central.
function noeud(o) {
  const s = `stroke="${v(o.contour)}" stroke-width="${o.fin}"`;
  const fond = o.foulardPlein ? v(o.foulard) : v("--surface");
  return `<path d="M20 25.6C18 23.9 15.4 24.2 15.6 25.8C15.8 27.3 18.2 27 20 25.6Z" fill="${fond}" ${s}/>` +
    `<path d="M20 25.6C22 23.9 24.6 24.2 24.4 25.8C24.2 27.3 21.8 27 20 25.6Z" fill="${fond}" ${s}/>` +
    `<circle cx="20" cy="25.6" r="1.05" fill="${o.or ? v(o.or) : fond}" ${s}/>`;
}

// Rosace à 5 pétales d'un seul contour festonné : les creux sont sur un cercle de rayon rc,
// chaque pétale est un arc de rayon rp qui relie deux creux voisins.
function rosace(cx, cy, rc, rp) {
  const creux = [];
  for (let i = 0; i < 5; i++) {
    const a = ((i * 72 + 36) * Math.PI) / 180;
    creux.push([cx + rc * Math.sin(a), cy - rc * Math.cos(a)]);
  }
  let d = "M" + pt(creux[4]);
  for (let i = 0; i < 5; i++) d += "A" + rp + " " + rp + " 0 1 1 " + pt(creux[i]);
  return d + "Z";
}

// Motifs du tablier, centrés sur (20, 40.6).
function motif(nom, o) {
  const s = `stroke="${v(o.contour)}" stroke-width="${o.fin}"`;
  const plein = (jeton) => (o.motifPlein ? v(jeton) : "none");
  const or = o.or && o.motifPlein ? v(o.or) : v(o.contour);
  if (nom === "baies") {
    return `<path d="M20 47.4C20 44 18.6 41.6 16.4 39.6M20 47.4C20 44 21.4 41.6 23.6 39.6M20 47.4V38.6" fill="none" stroke="${v(o.feuille)}" stroke-width=".9" stroke-linecap="round"/>` +
      `<ellipse cx="14.9" cy="42.4" rx="1.3" ry="2.9" transform="rotate(-48 14.9 42.4)" fill="${plein(o.feuille)}" ${s}/>` +
      `<ellipse cx="25.1" cy="42.4" rx="1.3" ry="2.9" transform="rotate(48 25.1 42.4)" fill="${plein(o.feuille)}" ${s}/>` +
      [[16.4, 38.4], [23.6, 38.4], [20, 36.6], [18.2, 34.4], [21.8, 34.4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.85" fill="${plein(o.fleur)}" ${s}/>`).join("") +
      [[16, 37.7], [23.2, 37.7], [19.6, 35.9]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".45" fill="${v("--deco-peau")}" opacity="${o.motifPlein ? 0.9 : 0}"/>`).join("");
  }
  if (nom === "feuilles") {
    return `<path d="M20 49V33" stroke="${v(o.feuille)}" stroke-width=".9" stroke-linecap="round"/>` +
      [[-1, 46], [1, 43], [-1, 40], [1, 37]].map(([c, y]) =>
        `<ellipse cx="${20 + c * 3.1}" cy="${y - 1.2}" rx="1.35" ry="3.2" transform="rotate(${c * 55} ${20 + c * 3.1} ${y - 1.2})" fill="${plein(o.feuille)}" ${s}/>`).join("") +
      `<path d="M20 30.8C21.9 32.4 21.9 34.4 20 35.4C18.1 34.4 18.1 32.4 20 30.8Z" fill="${plein(o.fleur)}" ${s}/>` +
      `<circle cx="20" cy="49.8" r=".8" fill="${or}"/>`;
  }
  // Fleur de Khokhloma : deux feuilles de Gjel, cinq pétales, un cœur d'or, des baies dorées.
  let d = `<ellipse cx="16.6" cy="45" rx="1.5" ry="3.5" transform="rotate(-52 16.6 45)" fill="${plein(o.feuille)}" ${s}/>` +
    `<ellipse cx="23.4" cy="45" rx="1.5" ry="3.5" transform="rotate(52 23.4 45)" fill="${plein(o.feuille)}" ${s}/>` +
    `<path d="M16.6 45.2Q18.4 44.3 19.2 43.4M23.4 45.2Q21.6 44.3 20.8 43.4" fill="none" stroke="${v(o.contour)}" stroke-width=".4" opacity=".6"/>`;
  d += `<path d="${rosace(20, 40.2, 2.6, 2.05)}" fill="${plein(o.fleur)}" ${s}/>`;
  d += `<circle cx="20" cy="40.2" r="1.55" fill="${o.or && o.motifPlein ? v(o.or) : v("--deco-peau")}" ${s}/>` +
    `<circle cx="20" cy="40.2" r=".45" fill="${v(o.contour)}"/>` +
    [[13.9, 35], [26.1, 35], [20, 48.6], [12.9, 39.4], [27.1, 39.4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".62" fill="${or}"/>`).join("");
  return d;
}

/**
 * Corps de la poupée (sans la balise <svg>), dans le repère 0 0 40 57.
 * @param {object} o
 *   etat : "peinte" (toutes les couleurs), "moitie" (foulard et visage peints, le reste au trait),
 *          "trait" (dessin au trait), "silhouette" (contour en pointillés seulement)
 *   corps, foulard, tablier, fleur, feuille, or, contour, levres : jetons CSS (« --laque »…)
 *   motif : "fleur" | "baies" | "feuilles" ; epaisseur : trait du contour ; nonScaling : trait constant (poupée du personnage)
 */
export function dessinPoupee(o) {
  const opt = Object.assign({ etat: "peinte", motif: "fleur", epaisseur: 1.4, fin: 0.7, levres: "--laque" }, o);
  const ns = opt.nonScaling ? ' vector-effect="non-scaling-stroke"' : "";
  const contour = (couleur, largeur, extra) => `fill="none" stroke="${v(couleur)}" stroke-width="${largeur}" stroke-linejoin="round"${ns}${extra || ""}`;

  if (opt.etat === "silhouette") {
    return `<path d="${SILHOUETTE}" ${contour(opt.contour, opt.epaisseur, ' stroke-dasharray="3.4 2.6"')}/>` +
      `<path d="${OURLET}" ${contour(opt.contour, 1, ' stroke-dasharray="2 2.2" stroke-linecap="round"')}/>`;
  }
  const peinte = opt.etat === "peinte", moitie = opt.etat === "moitie";
  const r = Object.assign({}, opt, {
    foulardPlein: peinte || moitie,
    motifPlein: peinte,
    or: peinte ? opt.or : moitie ? opt.or : null
  });
  const couches = [];
  // 1. Le corps.
  couches.push(`<path d="${SILHOUETTE}" fill="${v(peinte ? opt.corps : moitie ? opt.corpsDoux || "--surface" : "--surface")}"/>`);
  // 2. Le tablier et son motif.
  couches.push(`<path d="${TABLIER}" fill="${v(peinte ? opt.tablier : "--surface")}" stroke="${v(opt.contour)}" stroke-width="${opt.fin}"${ns}/>`);
  if (peinte && opt.or) couches.push(`<path d="${TABLIER}" fill="none" stroke="${v(opt.or)}" stroke-width=".6" transform="translate(20 41) scale(.88) translate(-20 -41)"/>`);
  couches.push(motif(opt.motif, r));
  // 3. Le liseré de la base.
  couches.push(`<path d="${BASE}" fill="none" stroke="${v(peinte ? opt.or : opt.contour)}" stroke-width="${peinte ? 1.1 : opt.fin}" stroke-linecap="round"/>`);
  if (peinte) couches.push(`<path d="M8.6 51.9C11 54.3 15.2 55.2 20 55.2C24.8 55.2 29 54.3 31.4 51.9" fill="none" stroke="${v(opt.or)}" stroke-width=".5" stroke-dasharray=".6 1" stroke-linecap="round"/>`);
  // 4. Le foulard, ses pois, son ourlet doré.
  couches.push(`<path d="${FOULARD}" fill="${v(r.foulardPlein ? opt.foulard : "--surface")}"/>`);
  if (r.foulardPlein && opt.or) couches.push(POIS.map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".62" fill="${v(opt.or)}"/>`).join(""));
  couches.push(`<path d="${OURLET}" fill="none" stroke="${v(r.foulardPlein && opt.or ? opt.or : opt.contour)}" stroke-width="${r.foulardPlein ? 1.1 : opt.fin}" stroke-linecap="round"/>`);
  // 5. Le visage et le nœud.
  couches.push(visage(r));
  couches.push(noeud(r));
  // 6. Le reflet de la laque (poupée peinte seulement).
  if (peinte) {
    couches.push(`<path d="M12.2 7.6C13.6 5.2 15.9 3.7 18.6 3.2" fill="none" stroke="${v("--deco-peau")}" stroke-width="1.1" stroke-linecap="round" opacity=".55"/>`);
    couches.push(`<path d="M7.1 34.2C6.2 37.2 6 40.4 6.4 43.4" fill="none" stroke="${v("--deco-peau")}" stroke-width="1.3" stroke-linecap="round" opacity=".3"/>`);
  }
  // 7. Le contour, par-dessus tout, pour une silhouette nette.
  couches.push(`<path d="${SILHOUETTE}" ${contour(opt.contour, opt.epaisseur)}/>`);
  return couches.join("");
}
