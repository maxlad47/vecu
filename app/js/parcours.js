// Logique pure du parcours d'accueil (bagou-ru.md, section 4) : durée préremplie par lieu,
// cases des thèmes, « Comme la dernière fois ». Aucun DOM ici, pour pouvoir la tester.

import { INTERFACE } from "./config.js";

// Durée proposée pour un lieu : la dernière durée choisie pour ce lieu, sinon la valeur par défaut du lieu.
export function dureePourLieu(lieu, memoire) {
  const retenue = memoire && memoire[lieu];
  if (INTERFACE.dureesProposees.includes(retenue)) return retenue;
  const parDefaut = INTERFACE.dureeParLieu[lieu];
  return INTERFACE.dureesProposees.includes(parDefaut) ? parDefaut : INTERFACE.dureeParDefaut;
}

// Ne garde que les thèmes qui existent encore dans le contenu (sans doublon, dans l'ordre du contenu).
// Liste vide = « Au hasard ».
export function themesValides(themes, situations) {
  const demandes = new Set(Array.isArray(themes) ? themes : []);
  return situations.map((s) => s.id).filter((id) => demandes.has(id));
}

// Toucher une tuile de thème. Cocher un thème décoche « Au hasard » (liste non vide) ;
// tout décocher remet « Au hasard » (liste vide).
export function basculerTheme(themes, id, situations) {
  const nouveau = themes.includes(id) ? themes.filter((x) => x !== id) : themes.concat(id);
  return themesValides(nouveau, situations);
}

// Dernier choix mémorisé, ou null au premier lancement (pas de bouton « Comme la dernière fois »).
export function dernierChoix(reglages, situations) {
  if (!reglages || !INTERFACE.modes.includes(reglages.dernierMode) || !INTERFACE.dureesProposees.includes(reglages.dernierDuree)) return null;
  return { lieu: reglages.dernierMode, duree: reglages.dernierDuree, themes: themesValides(reglages.derniersThemes, situations) };
}
