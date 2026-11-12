// Chargement et préparation du contenu (content/<langue>/*.json).
// Aucune phrase n'est écrite dans le code : tout vient des fichiers JSON.
// La partie « préparation » est pure (sans DOM ni réseau) pour pouvoir être testée.

const ACCENT_TONIQUE = /́/g;

// Charge index.json puis chaque fichier de situation, par chemin relatif.
export async function chargerContenu(langue, lireJson) {
  const lire = lireJson || (async (chemin) => {
    const reponse = await fetch(chemin);
    if (!reponse.ok) throw new Error("Contenu introuvable : " + chemin);
    return reponse.json();
  });
  const base = "content/" + langue + "/";
  const index = await lire(base + "index.json");
  const fichiers = {};
  for (const situation of index.situations) {
    fichiers[situation.id] = await lire(base + situation.fichier);
  }
  // Le personnage est facultatif : s'il manque, l'app marche sans (phrases d'exemple).
  let donnees = null;
  if (index.personnage) { try { donnees = await lire(base + index.personnage); } catch (e) { donnees = null; } }
  // Les dialogues sont facultatifs aussi : sans eux, pas de carte Dialogue.
  let dialogues = null;
  if (index.dialogues) { try { dialogues = await lire(base + index.dialogues); } catch (e) { dialogues = null; } }
  // Les univers de vocabulaire sont facultatifs : un fichier illisible est ignoré, le reste de l'app marche.
  const univers = {};
  for (const u of (Array.isArray(index.univers) ? index.univers : [])) {
    try { univers[u.id] = await lire(base + u.fichier); } catch (e) { /* cet univers manque : on continue */ }
  }
  return preparerContenu(index, fichiers, donnees, dialogues, univers);
}

// Répliques justes `nouveau: true` des dialogues → phrases au format v0 : elles rejoignent leur situation
// et deviennent des éléments de répétition espacée comme les autres.
export function phrasesNouvelles(brut) {
  const sortie = new Map();
  ((brut && brut.dialogues) || []).forEach((d) => (d.echanges || []).forEach((e) => (e.reponses || []).forEach((r) => {
    if (!r.nouveau || !r.element || sortie.has(r.element)) return;
    sortie.set(r.element, {
      id: r.element, situation: r.situation, registre: r.registre || "neutre", astuce: r.astuce || null,
      fr: r.fr, cible: r.cible, accent: r.accent || r.cible, translit: r.translit || null,
      personnalise: r.personnalise || null, gabarit: r.gabarit && typeof r.gabarit === "object" ? r.gabarit : null
    });
  })));
  return [...sortie.values()];
}

// Transforme les JSON bruts en une liste d'éléments triés selon l'ordre global par vagues
// (phrases-phase0.md) : clé (vague, rang de la situation, rang de la phrase).
// Vague 1 = phrases 1 à 3, vague 2 = 4 à 6, vague 3 = 7 et au-delà.
// `donnees` (personnage.json, facultatif) : ses phrases à prénom sont glissées dans leur situation,
// après la phrase `apres` ou à la fin. Sans lui, le résultat est celui d'avant.
// `dialogues` (dialogues.json, facultatif) : ses nouvelles répliques s'ajoutent de même, et il reste dans `contenu.dialogues`.
// `univers` (facultatif) : { id: fichier } pour chaque entrée de `index.univers`. Leurs éléments (des moules) ne sont
// PAS rangés dans les vagues des situations : ils viennent en dernier, marqués `univers` et `seuil` (nombre d'éléments
// de situations à avoir introduits avant leur entrée), et le moteur les fait entrer un par un (docs/pedagogie/themes.md).
export function preparerContenu(index, fichiers, donnees, dialogues, univers) {
  const ajouts = [...((donnees && donnees.phrases) || []), ...phrasesNouvelles(dialogues)];
  if (ajouts.length) {
    fichiers = Object.assign({}, fichiers);
    ajouts.forEach((p) => {
      const d = fichiers[p.situation];
      if (!d || !Array.isArray(d.phrases)) return;
      const liste = d.phrases.slice();
      const k = p.apres ? liste.findIndex((x) => x && x.id === p.apres) : -1;
      liste.splice(k >= 0 ? k + 1 : liste.length, 0, p);
      fichiers[p.situation] = Object.assign({}, d, { phrases: liste });
    });
  }
  const elements = [];
  const situations = [];
  index.situations.forEach((sit, rangSituation) => {
    const donnees = fichiers[sit.id];
    const phrases = (donnees && Array.isArray(donnees.phrases)) ? donnees.phrases : [];
    const ids = [];
    phrases.forEach((p, rangPhrase) => {
      if (!p || !p.id) return;
      ids.push(p.id);
      elements.push({
        id: p.id,
        situation: sit.id,
        rangSituation,
        rangPhrase,
        vague: rangPhrase < 3 ? 1 : (rangPhrase < 6 ? 2 : 3),
        fr: p.fr,
        cible: p.cible,
        accent: p.accent || p.cible,
        translit: p.translit || null,
        registre: p.registre || "neutre",
        variantes: p.variantes || null,
        variantesFr: p.variantes_fr || null,   // { m, f } : le français change aussi avec le genre
        personnalise: p.personnalise || null,  // "prenom" ou "prenom+metier" (voir personnage.js)
        gabarit: p.gabarit || null,
        astuce: p.astuce || null,
        moule: p.moule && Array.isArray(p.moule.remplacements) && p.moule.remplacements.length ? p.moule : null,
        ordreLibre: p.ordre_libre === true
      });
    });
    situations.push({ id: sit.id, titre: (donnees && donnees.titre) || sit.titre, ids });
  });
  const listeUnivers = [];
  (Array.isArray(index.univers) ? index.univers : []).forEach((u, rangUnivers) => {
    const d = univers && univers[u.id];
    const phrases = (d && Array.isArray(d.phrases)) ? d.phrases : [];
    const ids = [];
    phrases.forEach((p, rangPhrase) => {
      // Un univers ne contient que des moules : sans remplacement, l'élément serait une liste de mots isolée (R9).
      if (!p || !p.id || !p.moule || !Array.isArray(p.moule.remplacements) || !p.moule.remplacements.length) return;
      ids.push(p.id);
      const seuil = u.seuils && Number.isFinite(u.seuils[p.id]) ? u.seuils[p.id] : Infinity; // sans seuil : n'entre jamais
      elements.push({
        id: p.id, situation: u.id, univers: u.id, seuil, rangSituation: index.situations.length + rangUnivers, rangPhrase, vague: 4,
        fr: p.fr, cible: p.cible, accent: p.accent || p.cible, translit: p.translit || null,
        registre: p.registre || "neutre", variantes: p.variantes || null, variantesFr: p.variantes_fr || null,
        personnalise: null, gabarit: null, astuce: p.astuce || null, moule: p.moule, ordreLibre: p.ordre_libre === true
      });
    });
    listeUnivers.push({ id: u.id, titre: (d && d.titre) || u.id, ids });
  });
  elements.sort((a, b) => (a.vague - b.vague) || (a.rangSituation - b.rangSituation) || (a.rangPhrase - b.rangPhrase));
  elements.forEach((el, i) => { el.rang = i + 1; });
  const parId = new Map(elements.map((el) => [el.id, el]));
  return { langue: index.langue, situations, univers: listeUnivers, elements, parId, donnees: donnees || null, dialogues: (dialogues && dialogues.dialogues) || [] };
}

// Forme d'une variante de genre : une chaîne (le texte) ou un objet { cible, accent, translit }.
function lireVariante(v) {
  if (!v) return null;
  if (typeof v === "string") return { cible: v, accent: v, translit: null };
  return { cible: v.cible || v.accent, accent: v.accent || v.cible, translit: v.translit || null };
}

// Les textes à afficher ou à dire pour un élément.
// - moule : la phrase complète du remplacement demandé (jamais reconstruite à partir du modèle) ;
// - genre : forme russe (variantes, ou remplacement du personnage « parGenre ») et forme française
//   (variantes_fr) du genre de l'utilisateur ; "m" tant qu'il n'est pas connu ;
// - autre : le même texte à l'autre genre si le français ou le russe change, sinon null
//   (sert à montrer les deux formes tant que le genre n'est pas réglé).
export function texteElement(el, options) {
  const opts = options || {};
  const g = opts.genre === "f" ? "f" : "m";
  let texte;
  if (el.moule) {
    const liste = el.moule.remplacements;
    const i = ((opts.remplacement || 0) % liste.length + liste.length) % liste.length;
    const base = liste[i];
    const r = base.parGenre ? (base.parGenre[g] || base.parGenre.m) : base;
    texte = {
      fr: (r.variantes_fr && r.variantes_fr[g]) || r.phrase_fr, cible: r.phrase_cible, accent: r.phrase_accent || r.phrase_cible,
      translit: r.phrase_translit || null,
      morceauFr: r.fr, morceauAccent: r.accent || r.cible, remplacement: i
    };
  } else {
    const v = el.variantes ? lireVariante(el.variantes[g]) : null;
    texte = v
      ? { fr: el.fr, cible: v.cible, accent: v.accent, translit: v.translit || el.translit }
      : { fr: el.fr, cible: el.cible, accent: el.accent, translit: el.translit };
    if (el.variantesFr && el.variantesFr[g]) texte.fr = el.variantesFr[g];
  }
  if (!opts.sansAutre) {
    const a = texteElement(el, Object.assign({}, opts, { genre: g === "f" ? "m" : "f", sansAutre: true }));
    texte.autre = a.fr !== texte.fr || a.cible !== texte.cible ? a : null;
  }
  return texte;
}

// Le texte russe à faire lire par la voix : sans lettres latines (un prénom gardé en latin est affiché, pas lu).
export function aLire(cible) {
  return (cible || "").replace(/[A-Za-zÀ-ÿ]+/g, " ").replace(/\s+/g, " ").replace(/\s+([.,!?])/g, "$1").trim();
}

// L'autre forme de genre (pour la ligne « Au féminin : … » de la Découverte).
export function autreVariante(el, genre) {
  if (!el.variantes) return null;
  return lireVariante(el.variantes[genre === "f" ? "m" : "f"]);
}
export function variante(el, genre) {
  if (!el.variantes) return null;
  return lireVariante(el.variantes[genre === "f" ? "f" : "m"]);
}

export function sansAccent(texte) {
  return (texte || "").replace(ACCENT_TONIQUE, "");
}

// Normalisation pour comparer deux textes (regles-session.md, 7.1).
export function normaliser(texte) {
  return sansAccent(texte)
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[.,!?;:«»"'’…\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Mots d'une phrase russe pour l'exercice Ordre : ponctuation retirée aux bords des mots,
// tout en minuscules (arbitrage du CEO, journal du 11/11/2026).
export function motsOrdre(texte) {
  return (texte || "")
    .split(/\s+/)
    .map((m) => m.replace(/^[.,!?;:«»"'’…]+|[.,!?;:«»"'’…]+$/g, ""))
    .filter((m) => m.length > 0)
    .map((m) => m.toLowerCase());
}

// Ponctuation finale d'une phrase (affichée à la fin de la zone réponse de l'Ordre).
export function ponctuationFinale(texte) {
  const m = (texte || "").trim().match(/[.!?…]+$/);
  return m ? m[0] : "";
}
