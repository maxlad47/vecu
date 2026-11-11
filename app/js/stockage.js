// Stockage de la progression et des réglages sur l'appareil.
// IndexedDB quand il marche, sinon une copie en mémoire (jamais de plantage).
// La mémoire est toujours la source de vérité pendant que l'app tourne :
// IndexedDB ne sert qu'à retrouver les données au lancement suivant.

import { validerFiche } from "./leitner.js";

const NOM_BASE = "vecu";
const VERSION_BASE = 1;
const MAGASIN_PROGRESSION = "progression"; // clé : id de l'élément
const MAGASIN_REGLAGES = "reglages";       // clé : nom du réglage, valeur dans le champ « valeur »
const DELAI_OUVERTURE_MS = 1500;           // certains navigateurs privés n'ouvrent jamais la base

// Ouvre la base, ou renvoie null si c'est impossible (sans lever d'erreur).
function ouvrirBase() {
  return new Promise((resoudre) => {
    let fini = false;
    const terminer = (valeur) => { if (!fini) { fini = true; resoudre(valeur); } };
    setTimeout(() => terminer(null), DELAI_OUVERTURE_MS);
    try {
      if (typeof indexedDB === "undefined" || !indexedDB) return terminer(null);
      const demande = indexedDB.open(NOM_BASE, VERSION_BASE);
      demande.onupgradeneeded = () => {
        try {
          const base = demande.result;
          if (!base.objectStoreNames.contains(MAGASIN_PROGRESSION)) base.createObjectStore(MAGASIN_PROGRESSION, { keyPath: "id" });
          if (!base.objectStoreNames.contains(MAGASIN_REGLAGES)) base.createObjectStore(MAGASIN_REGLAGES, { keyPath: "cle" });
        } catch (e) { /* on retombera sur la mémoire */ }
      };
      demande.onsuccess = () => terminer(demande.result);
      demande.onerror = () => terminer(null);
      demande.onblocked = () => terminer(null);
    } catch (e) {
      terminer(null);
    }
  });
}

function toutLire(base, magasin) {
  return new Promise((resoudre) => {
    try {
      const requete = base.transaction(magasin, "readonly").objectStore(magasin).getAll();
      requete.onsuccess = () => resoudre(requete.result || []);
      requete.onerror = () => resoudre([]);
    } catch (e) {
      resoudre([]);
    }
  });
}

/**
 * Ouvre le stockage. Ne rejette jamais.
 * @returns {Promise<{fiches: Map, reglages: object, persistant: boolean,
 *   ecrireFiche: function, ecrireReglage: function}>}
 */
export async function ouvrirStockage() {
  const fiches = new Map();
  const reglages = {};
  let base = null;
  try {
    base = await ouvrirBase();
    if (base) {
      const [lignes, regs] = await Promise.all([toutLire(base, MAGASIN_PROGRESSION), toutLire(base, MAGASIN_REGLAGES)]);
      // Chaque fiche est vérifiée et réparée si besoin (voir validerFiche).
      lignes.forEach((brute) => { const f = validerFiche(brute); if (f) fiches.set(f.id, f); });
      regs.forEach((r) => { if (r && r.cle) reglages[r.cle] = r.valeur; });
      // Si une autre version de l'app ouvre la base, on lâche la nôtre proprement.
      base.onversionchange = () => { try { base.close(); } catch (e) { /* rien */ } base = null; };
    }
  } catch (e) {
    base = null;
  }

  // Écriture « au mieux » : si IndexedDB échoue, la donnée reste en mémoire.
  function ecrire(magasin, valeur) {
    if (!base) return;
    try {
      const transaction = base.transaction(magasin, "readwrite");
      transaction.objectStore(magasin).put(valeur);
      transaction.onerror = () => { /* la mémoire garde la valeur */ };
    } catch (e) {
      base = null; // base inutilisable : on continue en mémoire
    }
  }

  return {
    fiches,
    reglages,
    get persistant() { return !!base; },
    ecrireFiche(fiche) {
      fiches.set(fiche.id, fiche);
      ecrire(MAGASIN_PROGRESSION, fiche);
    },
    ecrireReglage(cle, valeur) {
      reglages[cle] = valeur;
      ecrire(MAGASIN_REGLAGES, { cle, valeur });
    }
  };
}
