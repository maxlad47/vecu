// Sauvegarde de la progression (fichier à exporter / importer) et mesure d'usage locale.
// Pur : aucune dépendance au navigateur, donc testable avec Node.
// Pourquoi : Safari peut vider les données d'un site peu utilisé. Sans fichier de sauvegarde,
// une progression de 2 semaines peut disparaître d'un coup.

import { validerFiche, estAcquis } from "./leitner.js";

export const FORMAT_SAUVEGARDE = "bagou-sauvegarde";
export const VERSION_SAUVEGARDE = 1;
const GARDER_JOURS = 120;   // l'historique d'usage garde 120 jours au plus
const RAPPEL_JOURS = 7;     // on rappelle d'exporter après 7 jours sans sauvegarde

// Réglages qui voyagent avec la sauvegarde (le reste se refait en 10 secondes).
const REGLAGES_SAUVEGARDES = ["translitteration", "vitesseVoix", "apparence", "genre", "personnage", "dureeParLieu", "dernierMode", "dernierDuree", "derniersThemes"];

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
  return { ok: true, fiches, reglages, usage: validerUsage(brut.usage) };
}

const MODES = ["silence", "ecouteurs", "parler", "voiture"]; // ordre de départage du mode préféré

/** Un historique d'usage sain : { jours: { "AAAA-MM-JJ": { sessions, minutes, cartes, modes } } }. */
export function validerUsage(brut) {
  const jours = {};
  const source = brut && typeof brut === "object" && brut.jours && typeof brut.jours === "object" ? brut.jours : {};
  Object.keys(source).forEach((cle) => {
    const j = source[cle];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(cle) || !j || typeof j !== "object") return;
    const nb = (v) => (Number.isFinite(v) && v >= 0 ? Math.round(v) : 0);
    const modes = {};
    MODES.forEach((m) => { const n = j.modes && nb(j.modes[m]); if (n) modes[m] = n; }); // anciens fichiers : pas de modes
    jours[cle] = { sessions: nb(j.sessions), minutes: nb(j.minutes), cartes: nb(j.cartes), modes };
  });
  return { jours: garderRecents(jours) };
}

function garderRecents(jours) {
  const cles = Object.keys(jours).sort();
  cles.slice(0, Math.max(0, cles.length - GARDER_JOURS)).forEach((c) => delete jours[c]);
  return jours;
}

/** Ajoute une session à l'usage. Renvoie un nouvel objet (l'ancien n'est pas modifié). */
export function ajouterSession(usage, jour, minutes, cartes, mode) {
  const base = validerUsage(usage);
  const actuel = base.jours[jour] || { sessions: 0, minutes: 0, cartes: 0, modes: {} };
  const modes = Object.assign({}, actuel.modes);
  if (MODES.includes(mode)) modes[mode] = (modes[mode] || 0) + 1;
  base.jours[jour] = {
    modes,
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

/**
 * Statistiques personnelles, calculées sur l'historique local (120 jours au plus).
 * Série qui pardonne : jours actifs d'affilée en remontant d'aujourd'hui, un jour d'oubli isolé ne la casse pas,
 * deux jours d'oubli de suite la cassent. Aujourd'hui sans session ne compte pas comme un oubli (la journée n'est pas finie).
 */
export function statistiquesUsage(usage, maintenant) {
  const jours = validerUsage(usage).jours;
  const actif = (i) => !!jours[jourIso(new Date(maintenant.getTime() - i * 86400000))];
  const sur = (n) => { let c = 0; for (let i = 0; i < n; i++) if (actif(i)) c++; return c; };
  let serie = 0, oublis = 0;
  for (let i = actif(0) ? 0 : 1; i <= GARDER_JOURS && oublis < 2; i++) {
    if (actif(i)) { serie++; oublis = 0; } else oublis++;
  }
  const total = { minutes: 0, sessions: 0 };
  const parMode = {};
  Object.keys(jours).forEach((c) => {
    total.minutes += jours[c].minutes; total.sessions += jours[c].sessions;
    Object.keys(jours[c].modes).forEach((m) => { parMode[m] = (parMode[m] || 0) + jours[c].modes[m]; });
  });
  const modePrefere = MODES.filter((m) => parMode[m]).sort((a, b) => parMode[b] - parMode[a])[0] || null;
  return { actifs7: sur(7), actifs30: sur(30), minutes: total.minutes, sessions: total.sessions, modePrefere, serie };
}

/**
 * Situations vues (au moins une phrase vue), acquises (toutes les phrases acquises) et en cours (vues, pas encore acquises).
 * @param {string[][]} listes les identifiants de phrases de chaque situation
 */
export function compterSituations(listes, fiches) {
  let vues = 0, acquises = 0;
  listes.forEach((ids) => {
    if (!ids.length) return;
    if (ids.some((id) => fiches.get(id) && fiches.get(id).boite >= 1)) vues++;
    if (ids.every((id) => estAcquis(fiches.get(id)))) acquises++;
  });
  return { total: listes.length, vues, acquises, enCours: vues - acquises };
}

/** Vrai s'il y a de la progression et que la dernière sauvegarde a plus de 7 jours (ou n'existe pas). */
export function rappelSauvegardeDu(derniereSauvegarde, nbFiches, maintenant) {
  if (nbFiches === 0) return false;
  if (!derniereSauvegarde) return true;
  const t = Date.parse(derniereSauvegarde);
  if (!Number.isFinite(t)) return true;
  return maintenant.getTime() - t > RAPPEL_JOURS * 86400000;
}
