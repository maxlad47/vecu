// Sauvegarde de la progression (fichier à exporter / importer) et mesure d'usage locale.
// Pur : aucune dépendance au navigateur, donc testable avec Node.
// Pourquoi : Safari peut vider les données d'un site peu utilisé. Sans fichier de sauvegarde,
// une progression de 2 semaines peut disparaître d'un coup.

import { validerFiche } from "./leitner.js";

export const FORMAT_SAUVEGARDE = "bagou-sauvegarde";
export const VERSION_SAUVEGARDE = 1;
const GARDER_JOURS = 120;   // l'historique d'usage garde 120 jours au plus
const RAPPEL_JOURS = 7;     // on rappelle d'exporter après 7 jours sans sauvegarde

// Réglages qui voyagent avec la sauvegarde (le reste se refait en 10 secondes).
const REGLAGES_SAUVEGARDES = ["translitteration", "vitesseVoix", "apparence", "genre", "personnage", "dureeParLieu", "dernierMode", "dernierDuree", "derniersThemes", "universInclus"];

/** Construit l'objet à écrire dans le fichier. */
export function construireSauvegarde(fiches, reglages, maintenant) {
  const regs = {};
  REGLAGES_SAUVEGARDES.forEach((cle) => { if (reglages[cle] !== undefined) regs[cle] = reglages[cle]; });
  return {
    format: FORMAT_SAUVEGARDE,
    version: VERSION_SAUVEGARDE,
    date: (maintenant || new Date()).toISOString(),
    fiches: [...fiches.values()],
    reglages: regs,
    usage: reglages.usage || { jours: {} }
  };
}

/**
 * Lit et vérifie un texte de sauvegarde. Ne lève jamais d'erreur.
 * @returns {{ok: true, fiches: object[], reglages: object, usage: object} | {ok: false, raison: string}}
 */
export function lireSauvegarde(texte) {
  let brut;
  try { brut = JSON.parse(texte); } catch (e) { return { ok: false, raison: "illisible" }; }
  if (!brut || brut.format !== FORMAT_SAUVEGARDE) return { ok: false, raison: "format" };
  if (typeof brut.version !== "number" || brut.version > VERSION_SAUVEGARDE) return { ok: false, raison: "version" };
  const fiches = (Array.isArray(brut.fiches) ? brut.fiches : []).map(validerFiche).filter(Boolean);
  const reglages = {};
  const source = brut.reglages && typeof brut.reglages === "object" ? brut.reglages : {};
  REGLAGES_SAUVEGARDES.forEach((cle) => { if (source[cle] !== undefined) reglages[cle] = source[cle]; });
  // Ancienne sauvegarde sans cette clé (ou valeur illisible) : valeur par défaut, univers inclus.
  reglages.universInclus = source.universInclus !== false;
  return { ok: true, fiches, reglages, usage: validerUsage(brut.usage) };
}

/** Un historique d'usage sain : { jours: { "AAAA-MM-JJ": { sessions, minutes, cartes } } }. */
export function validerUsage(brut) {
  const jours = {};
  const source = brut && typeof brut === "object" && brut.jours && typeof brut.jours === "object" ? brut.jours : {};
  Object.keys(source).forEach((cle) => {
    const j = source[cle];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(cle) || !j || typeof j !== "object") return;
    const nb = (v) => (Number.isFinite(v) && v >= 0 ? Math.round(v) : 0);
    jours[cle] = { sessions: nb(j.sessions), minutes: nb(j.minutes), cartes: nb(j.cartes) };
  });
  return { jours: garderRecents(jours) };
}

function garderRecents(jours) {
  const cles = Object.keys(jours).sort();
  cles.slice(0, Math.max(0, cles.length - GARDER_JOURS)).forEach((c) => delete jours[c]);
  return jours;
}

/** Ajoute une session à l'usage. Renvoie un nouvel objet (l'ancien n'est pas modifié). */
export function ajouterSession(usage, jour, minutes, cartes) {
  const base = validerUsage(usage);
  const actuel = base.jours[jour] || { sessions: 0, minutes: 0, cartes: 0 };
  base.jours[jour] = {
    sessions: actuel.sessions + 1,
    minutes: actuel.minutes + Math.max(0, Math.round(minutes || 0)),
    cartes: actuel.cartes + Math.max(0, Math.round(cartes || 0))
  };
  base.jours = garderRecents(base.jours);
  return base;
}

function jourIso(date) {
  const d = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return d.toISOString().slice(0, 10);
}

/** Jours actifs sur les N derniers jours (aujourd'hui compris) et total de minutes. */
export function resumeUsage(usage, maintenant, nbJours) {
  const jours = validerUsage(usage).jours;
  let actifs = 0, minutes = 0, sessions = 0;
  for (let i = 0; i < nbJours; i++) {
    const cle = jourIso(new Date(maintenant.getTime() - i * 86400000));
    if (jours[cle]) { actifs++; minutes += jours[cle].minutes; sessions += jours[cle].sessions; }
  }
  return { actifs, minutes, sessions };
}

export function jourLocal(date) { return jourIso(date); }

/** Vrai s'il y a de la progression et que la dernière sauvegarde a plus de 7 jours (ou n'existe pas). */
export function rappelSauvegardeDu(derniereSauvegarde, nbFiches, maintenant) {
  if (nbFiches === 0) return false;
  if (!derniereSauvegarde) return true;
  const t = Date.parse(derniereSauvegarde);
  if (!Number.isFinite(t)) return true;
  return maintenant.getTime() - t > RAPPEL_JOURS * 86400000;
}
