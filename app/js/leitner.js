// Répétition espacée : boîtes de Leitner de 0 à 6 (docs/pedagogie/repetition-espacee.md).
// Module pur : aucune dépendance au DOM ni au stockage.

import { INTERVALLES, BOITE_MAX, BOITE_ACQUIS, HISTORIQUE_MAX, DECALAGE_JOUR_HEURES } from "./config.js";

function deuxChiffres(n) { return (n < 10 ? "0" : "") + n; }

// Date locale AAAA-MM-JJ.
export function dateLocale(d) {
  return d.getFullYear() + "-" + deuxChiffres(d.getMonth() + 1) + "-" + deuxChiffres(d.getDate());
}

// Le « jour » de la répétition : la date locale de (maintenant − 4 h).
// Une session à 1 h du matin compte donc pour la veille.
export function calculerJour(maintenant) {
  const d = new Date((maintenant instanceof Date ? maintenant.getTime() : maintenant) - DECALAGE_JOUR_HEURES * 3600 * 1000);
  return dateLocale(d);
}

// jour + n jours, en restant sur des dates locales (midi, pour éviter les changements d'heure).
export function ajouterJours(jour, n) {
  const [a, m, j] = jour.split("-").map(Number);
  const d = new Date(a, m - 1, j, 12, 0, 0);
  d.setDate(d.getDate() + n);
  return dateLocale(d);
}

// Fiche vide d'un élément jamais vu (boîte 0). Absent du stockage = boîte 0.
export function ficheVide(id) {
  return {
    id, boite: 0, echeance: null, premiereVue: null, derniereRevue: null,
    dernierEchecNonDu: null, nbReussites: 0, nbEchecs: 0, dernierRemplacement: null, historique: []
  };
}

export function estDu(fiche, jour) {
  return !!fiche && fiche.boite >= 1 && fiche.echeance !== null && fiche.echeance <= jour;
}

export function estAcquis(fiche) {
  return !!fiche && fiche.boite >= BOITE_ACQUIS;
}

function copier(fiche) {
  return Object.assign({}, fiche, { historique: (fiche.historique || []).slice() });
}

function ajouterHistorique(fiche, entree) {
  fiche.historique.push(entree);
  while (fiche.historique.length > HISTORIQUE_MAX) fiche.historique.shift();
}

// Première Découverte (ou Boucle découverte) : boîte 0 → 1, échéance J+1.
// Écrit dès l'affichage de la carte.
export function appliquerDecouverte(fiche, { jour, mode, type, remplacement }) {
  const f = copier(fiche);
  let compte = false;
  if (f.boite === 0) {
    f.boite = 1;
    f.echeance = ajouterJours(jour, INTERVALLES[1]);
    f.premiereVue = jour;
    compte = true;
  }
  f.derniereRevue = jour;
  if (remplacement !== undefined && remplacement !== null) f.dernierRemplacement = remplacement;
  ajouterHistorique(f, { jour, mode, type, remplacement: remplacement === undefined ? null : remplacement, resultat: "non-note", compte });
  return f;
}

// Applique le résultat d'une carte notée.
// resultat : "reussite", "echec" ou "passif" (Boucle rappel en Voiture).
// compteePourDu : vrai si l'élément était dû au début de la session ET que c'est sa première carte notée.
// aDejaEteNoteDansSession : vrai si l'élément était dû et a déjà eu sa première carte notée (rattrapage d'un dû).
export function appliquerResultat(fiche, { jour, mode, type, remplacement, resultat, compteePourDu, estDuDejaNote }) {
  const f = copier(fiche);
  let compte = false;

  if (resultat === "reussite" || resultat === "passif") f.nbReussites += 1;
  if (resultat === "echec") f.nbEchecs += 1;

  if (compteePourDu) {
    if (resultat === "reussite") {
      f.boite = Math.min(BOITE_MAX, f.boite + 1);
      f.echeance = ajouterJours(jour, INTERVALLES[f.boite]);
      compte = true;
    } else if (resultat === "echec") {
      f.boite = Math.max(1, f.boite - 2);
      f.echeance = ajouterJours(jour, INTERVALLES[1]);
      compte = true;
    } else if (resultat === "passif") {
      // Réussite passive en Voiture : jamais au-delà de la boîte 3.
      if (f.boite < 3) f.boite += 1;
      f.echeance = ajouterJours(jour, INTERVALLES[f.boite]);
      compte = true;
    }
  } else if (!estDuDejaNote && resultat === "echec" && f.boite >= 1 && f.dernierEchecNonDu !== jour) {
    // Élément non dû raté : une boîte de moins, au plus une fois par jour.
    const avant = f.boite + "/" + f.echeance;
    f.boite = Math.max(1, f.boite - 1);
    f.echeance = ajouterJours(jour, INTERVALLES[1]);
    f.dernierEchecNonDu = jour;
    compte = avant !== f.boite + "/" + f.echeance;
  }

  f.derniereRevue = jour;
  if (remplacement !== undefined && remplacement !== null) f.dernierRemplacement = remplacement;
  ajouterHistorique(f, { jour, mode, type, remplacement: remplacement === undefined ? null : remplacement, resultat, compte });
  return f;
}

// ---------- Validation des fiches lues dans le stockage ----------
// Une fiche abîmée (ancienne version, stockage corrompu) est réparée champ par champ ;
// si sa boîte elle-même est illisible, elle est remise à zéro. Jamais d'erreur levée.

const FORMAT_DATE = /^\d{4}-\d{2}-\d{2}$/;
function dateValide(d) {
  if (typeof d !== "string" || !FORMAT_DATE.test(d)) return false;
  const [a, m, j] = d.split("-").map(Number);
  const date = new Date(a, m - 1, j);
  return date.getFullYear() === a && date.getMonth() === m - 1 && date.getDate() === j;
}
const entierPositif = (n) => (Number.isInteger(n) && n >= 0 ? n : 0);

// Renvoie une fiche saine pour l'id donné, ou null si l'objet n'est pas une fiche.
export function validerFiche(brute) {
  if (!brute || typeof brute !== "object" || typeof brute.id !== "string" || !brute.id) return null;
  const id = brute.id;
  if (!Number.isInteger(brute.boite) || brute.boite < 0 || brute.boite > BOITE_MAX) return ficheVide(id);
  const f = ficheVide(id);
  f.boite = brute.boite;
  if (f.boite >= 1) {
    // Une échéance illisible rend l'élément dû tout de suite (il sera revu, rien n'est perdu).
    f.echeance = dateValide(brute.echeance) ? brute.echeance : "2000-01-01";
    f.premiereVue = dateValide(brute.premiereVue) ? brute.premiereVue : null;
  }
  f.derniereRevue = dateValide(brute.derniereRevue) ? brute.derniereRevue : null;
  f.dernierEchecNonDu = dateValide(brute.dernierEchecNonDu) ? brute.dernierEchecNonDu : null;
  f.nbReussites = entierPositif(brute.nbReussites);
  f.nbEchecs = entierPositif(brute.nbEchecs);
  f.dernierRemplacement = Number.isInteger(brute.dernierRemplacement) && brute.dernierRemplacement >= 0 ? brute.dernierRemplacement : null;
  f.historique = Array.isArray(brute.historique)
    ? brute.historique.filter((h) => h && typeof h === "object").slice(-HISTORIQUE_MAX)
    : [];
  return f;
}
