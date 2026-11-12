// Dialogues à choix (mission 008) : logique pure, ni DOM ni stockage.
// Le contenu vient de content/<langue>/dialogues.json ; la règle d'insertion dans la session est dans moteur.js.
// Les répliques justes sont des éléments Leitner : celles qui n'existent pas encore (`nouveau`) sont injectées
// dans leur situation par contenu.js (phrasesNouvelles) ; les autres pointent vers un élément existant.

import { avecPrenom } from "./personnage.js";
import { melanger } from "./exercices.js";
import { DIALOGUE } from "./config.js";

const CHAMPS = ["fr", "cible", "accent", "translit"];
const quatre = (o) => ({ fr: o.fr, cible: o.cible, accent: o.accent || o.cible, translit: o.translit || null });

// Un dialogue est utilisable s'il a des échanges, chacun avec une bonne réponse (`si_faux`) et au moins 2 réponses.
function bienForme(d) {
  return !!d && Array.isArray(d.echanges) && d.echanges.length > 0 && d.echanges.every((e) =>
    e && e.partenaire && Array.isArray(e.reponses) && e.reponses.length >= 2 && e.reponses.some((r) => r.id === e.si_faux));
}

// Dialogues que le personnage permet de jouer : `exige` liste les réglages nécessaires (aujourd'hui « metier »).
// Contenu abîmé ou manquant : le dialogue est simplement absent, sans erreur.
export function dialoguesProposables(dialogues, perso, donnees) {
  const metiers = (donnees && donnees.metiers) || [];
  const a = (cle) => !!perso && !!perso[cle] && (cle !== "metier" || metiers.some((m) => m.id === perso.metier));
  return (Array.isArray(dialogues) ? dialogues : []).filter((d) => bienForme(d) && (d.exige || []).every(a));
}

// Texte d'une réponse au genre g, avec le prénom ou le métier du personnage.
// Renvoie { id, juste, texte, element, suite, reaction, astuce, pourquoi, sansPrenom }.
function reponseResolue(r, g, perso, donnees) {
  const exemple = (donnees && donnees.prenoms && donnees.prenoms.exemple) || { latin: "", cible: "", accent: "" };
  const entree = ((donnees && donnees.metiers) || []).find((m) => m.id === perso.metier);
  let texte = quatre(r), element = r.element, astuce = r.astuce || null, sansPrenom = false;
  const v = r.variantes && r.variantes[g];
  if (v && typeof v === "object") texte = quatre({ fr: texte.fr, cible: v.cible, accent: v.accent, translit: v.translit });
  if (r.variantes_fr && r.variantes_fr[g]) texte.fr = r.variantes_fr[g];
  if (r.metier === "phrase" && entree) {
    const f = entree[g] || entree.m;
    texte = { fr: f.phrase_fr, cible: f.phrase_cible, accent: f.phrase_accent, translit: f.phrase_translit };
    element = entree.element;
    astuce = astuce || entree.astuce || null;
  } else if (r.personnalise === "prenom" && r.gabarit && typeof r.gabarit === "object") {
    const p = avecPrenom(r, r.gabarit, perso, exemple);
    texte = quatre(p);
    sansPrenom = !!p.sansPrenom;
  }
  return { id: r.id, juste: !!r.juste, texte, element, suite: r.suite === undefined ? null : r.suite, reaction: r.reaction || null,
    astuce, pourquoi: r.pourquoi || null, sansPrenom };
}

// Réplique du partenaire : {metier} devient le métier du personnage (sans métier ou avec un statut : variante `sans_metier`).
function partenaireResolu(p, g, perso, donnees) {
  if (p.metier !== "mot") return quatre(p);
  const entree = ((donnees && donnees.metiers) || []).find((m) => m.id === perso.metier);
  if (!entree || entree.categorie === "statuts") return quatre(p.sans_metier || p);
  const f = entree[g] || entree.m;
  const sortie = {};
  CHAMPS.forEach((c) => { sortie[c] = (p[c] || "").split("{metier}").join(f[c]); });
  return sortie;
}

/**
 * Un échange prêt à afficher, ou null si l'id est inconnu.
 * @param {object} d    dialogue (dialogues.json)
 * @param {string} id   id de l'échange ("e1"…)
 * @param {object} ctx  { perso, donnees (personnage.json), genre ("m"|"f"), aleatoire, reaction }
 *   reaction : réplique courte du partenaire à dire avant la sienne (même bulle), ou null.
 * Retour : { id, partenaire, reponses (2 à 3, mélangées), bonne (la réponse montrée si l'on se trompe) }.
 */
export function echangeResolu(d, id, ctx) {
  const e = (d.echanges || []).find((x) => x.id === id);
  if (!e) return null;
  const g = ctx.genre === "f" ? "f" : "m";
  const resolues = e.reponses.map((r) => reponseResolue(r, g, ctx.perso, ctx.donnees));
  const bonne = resolues.find((r) => r.id === e.si_faux);
  const choisies = [bonne, ...resolues.filter((r) => r !== bonne)].slice(0, DIALOGUE.reponsesMax);
  let partenaire = partenaireResolu(e.partenaire, g, ctx.perso, ctx.donnees);
  if (ctx.reaction) {
    const r = quatre(ctx.reaction);
    partenaire = Object.fromEntries(CHAMPS.map((c) => [c, [r[c], partenaire[c]].filter(Boolean).join(" ")]));
  }
  return { id: e.id, partenaire, reponses: melanger(choisies, ctx.aleatoire || Math.random), bonne };
}

// Ce que le partenaire a entendu : la réponse choisie si elle est juste, sinon la bonne (le dialogue suit la branche juste).
export const reponseRetenue = (echange, choisie) => (choisie.juste ? choisie : echange.bonne);

// Le dialogue dépend-il du genre de l'utilisateur ? (Si le genre est inconnu, l'écran le demande d'abord.)
export const dependDuGenre = (d) => d.depend_du_genre === true;
