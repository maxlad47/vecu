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
  return preparerContenu(index, fichiers);
}

// Transforme les JSON bruts en une liste d'éléments triés selon l'ordre global par vagues
// (phrases-phase0.md) : clé (vague, rang de la situation, rang de la phrase).
// Vague 1 = phrases 1 à 3, vague 2 = 4 à 6, vague 3 = 7 et au-delà.
export function preparerContenu(index, fichiers) {
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
        astuce: p.astuce || null,
        moule: p.moule && Array.isArray(p.moule.remplacements) && p.moule.remplacements.length ? p.moule : null,
        ordreLibre: p.ordre_libre === true
      });
    });
    situations.push({ id: sit.id, titre: (donnees && donnees.titre) || sit.titre, ids });
  });
  elements.sort((a, b) => (a.vague - b.vague) || (a.rangSituation - b.rangSituation) || (a.rangPhrase - b.rangPhrase));
  elements.forEach((el, i) => { el.rang = i + 1; });
  const parId = new Map(elements.map((el) => [el.id, el]));
  return { langue: index.langue, situations, elements, parId };
}

// Forme d'une variante de genre : une chaîne (le texte) ou un objet { cible, accent, translit }.
function lireVariante(v) {
  if (!v) return null;
  if (typeof v === "string") return { cible: v, accent: v, translit: null };
  return { cible: v.cible || v.accent, accent: v.accent || v.cible, translit: v.translit || null };
}

// Les textes à afficher ou à dire pour un élément.
// - moule : la phrase complète du remplacement demandé (jamais reconstruite à partir du modèle) ;
// - variantes : la forme du genre de l'utilisateur ("m" par défaut).
export function texteElement(el, options) {
  const opts = options || {};
  if (el.moule) {
    const liste = el.moule.remplacements;
    const i = ((opts.remplacement || 0) % liste.length + liste.length) % liste.length;
    const r = liste[i];
    return {
      fr: r.phrase_fr, cible: r.phrase_cible, accent: r.phrase_accent || r.phrase_cible,
      translit: r.phrase_translit || null,
      morceauFr: r.fr, morceauAccent: r.accent || r.cible, remplacement: i
    };
  }
  if (el.variantes) {
    const v = lireVariante(el.variantes[opts.genre === "f" ? "f" : "m"]);
    if (v) return { fr: el.fr, cible: v.cible, accent: v.accent, translit: v.translit || el.translit };
  }
  return { fr: el.fr, cible: el.cible, accent: el.accent, translit: el.translit };
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
