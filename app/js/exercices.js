// Construction des exercices : choix des QCM (2 leurres) et tuiles de l'Ordre.
// Règles : docs/pedagogie/regles-session.md, section 7. Module pur.

import { texteElement, normaliser, motsOrdre } from "./contenu.js";

// Tirage uniforme dans une liste.
function tirer(liste, aleatoire) {
  return liste[Math.floor(aleatoire() * liste.length)];
}

// Mélange de Fisher-Yates (nouvelle liste).
export function melanger(liste, aleatoire) {
  const a = liste.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(aleatoire() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

// Vrai si l'Ordre est possible : 3 mots ou plus, et ordre des mots non libre.
// Jamais sur une phrase à prénom (le prénom n'est pas un mot à ranger).
export function ordrePossible(el, genre) {
  if (el.moule || el.ordreLibre || el.personnalise) return false;
  return motsOrdre(texteElement(el, { genre }).cible).length >= 3;
}

// Les 3 choix d'une carte Sens, Thème ou Écoute.
// ctx : { elements, fiche(id), introduitsSession (Set), genre, aleatoire }
// Retour : liste de 3 options { id, texte: {fr, cible, accent, translit}, juste }.
export function optionsQcm(el, ctx) {
  const bonne = texteElement(el, { genre: ctx.genre, remplacement: remplacementLeurre(el, ctx) });
  const dejaPris = [{ fr: normaliser(bonne.fr), ru: normaliser(bonne.cible) }];
  const vu = (e) => {
    const f = ctx.fiche(e.id);
    return (f && f.boite >= 1) || ctx.introduitsSession.has(e.id);
  };
  const autres = ctx.elements.filter((e) => e.id !== el.id);
  const reservoirs = [
    autres.filter((e) => e.situation === el.situation && vu(e)),
    autres.filter((e) => e.situation === el.situation && !vu(e)),
    autres.filter((e) => e.situation !== el.situation && vu(e)),
    autres.filter((e) => e.situation !== el.situation && !vu(e))
  ];
  const leurres = [];
  for (const reservoir of reservoirs) {
    let candidats = reservoir.slice();
    while (leurres.length < 2 && candidats.length) {
      const c = tirer(candidats, ctx.aleatoire);
      candidats = candidats.filter((x) => x !== c);
      const t = texteElement(c, { genre: ctx.genre, remplacement: remplacementLeurre(c, ctx) });
      const n = { fr: normaliser(t.fr), ru: normaliser(t.cible) };
      if (dejaPris.some((p) => p.fr === n.fr || p.ru === n.ru)) continue;
      dejaPris.push(n);
      leurres.push({ id: c.id, texte: t, juste: false });
    }
    if (leurres.length >= 2) break;
  }
  return placerBonne({ id: el.id, texte: bonne, juste: true }, leurres, ctx.aleatoire);
}

// Un moule pris comme leurre est représenté par son dernier remplacement joué (0 sinon).
function remplacementLeurre(e, ctx) {
  if (!e.moule) return 0;
  const f = ctx.fiche(e.id);
  return f && Number.isInteger(f.dernierRemplacement) ? f.dernierRemplacement : 0;
}

// Carte Moule : les 2 leurres sont deux autres occurrences du même moule.
export function optionsMoule(el, remplacement, ctx) {
  const bonne = texteElement(el, { genre: ctx.genre, remplacement });
  const dejaPris = [{ fr: normaliser(bonne.fr), ru: normaliser(bonne.cible) }];
  let candidats = el.moule.remplacements.map((_, i) => i).filter((i) => i !== bonne.remplacement);
  const leurres = [];
  while (leurres.length < 2 && candidats.length) {
    const i = tirer(candidats, ctx.aleatoire);
    candidats = candidats.filter((x) => x !== i);
    const t = texteElement(el, { genre: ctx.genre, remplacement: i });
    const n = { fr: normaliser(t.fr), ru: normaliser(t.cible) };
    if (dejaPris.some((p) => p.fr === n.fr || p.ru === n.ru)) continue;
    dejaPris.push(n);
    leurres.push({ id: el.id + "#" + i, texte: t, juste: false });
  }
  return placerBonne({ id: el.id + "#" + bonne.remplacement, texte: bonne, juste: true }, leurres, ctx.aleatoire);
}

// La position de la bonne réponse est tirée au hasard parmi les 3.
function placerBonne(bonne, leurres, aleatoire) {
  const options = leurres.slice();
  const position = Math.floor(aleatoire() * (options.length + 1));
  options.splice(position, 0, bonne);
  return options;
}

// Tuiles de l'Ordre, mélangées et jamais dans l'ordre correct.
// Chaque tuile a une position d'origine (deux mots identiques restent deux tuiles distinctes).
export function tuilesOrdre(accent, aleatoire) {
  const mots = motsOrdre(accent);
  const tuiles = mots.map((texte, i) => ({ cle: i, texte }));
  const reference = mots.join(" ");
  let melange = melanger(tuiles, aleatoire);
  let essais = 0;
  while (melange.map((t) => t.texte).join(" ") === reference && essais < 20) {
    melange = melanger(tuiles, aleatoire);
    essais++;
  }
  if (melange.map((t) => t.texte).join(" ") === reference && melange.length > 1) {
    // Dernier recours : on fait tourner la liste d'un cran.
    melange = melange.slice(1).concat(melange.slice(0, 1));
  }
  return { reference: mots, tuiles: melange };
}
