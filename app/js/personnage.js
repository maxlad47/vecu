// Le personnage de l'utilisateur : prénom, métier, poupée. Module pur (ni DOM, ni stockage).
// Les phrases, les métiers et les règles de conversion viennent de content/<langue>/personnage.json.
// Deux étapes : validerPersonnage (données saines) puis personnaliser (contenu à ses mots).

export const PRENOM_MAX = 20;
// Poupée : combinaisons de jetons de couleur (clair et sombre viennent d'app.css / ambiance.json).
// Jamais laque et cobalt sur la même poupée (ce serait un drapeau avec la face claire entre les deux).
export const COMBINAISONS = [
  { id: "cobalt-or", corps: "--accent", tablier: "--surface", accent: "--or" },
  { id: "laque-or", corps: "--laque", tablier: "--surface", accent: "--or" },
  { id: "bleu-pale-cobalt", corps: "--deco-bleu-pale", tablier: "--surface", accent: "--accent" },
  { id: "porcelaine-laque", corps: "--surface", tablier: "--laque-soft", accent: "--laque" }
];
export const MOTIFS = ["fleur", "baies", "feuilles"];

// Réglages du personnage qui remplissent le trou d'un moule. Ajouter un thème de vocabulaire
// (couleurs, transports…) = une ligne ici, une liste dans le JSON et le choix dans l'interface.
//   reglage : clé dans le personnage ; liste : tableau du JSON { id, element, m, f } ou { id, element, fr… } ;
//   derive : une entrée peut en déduire une autre liste (le métier donne le domaine de « Je travaille dans ___ »).
export const REGLAGES_MOULE = [
  { reglage: "metier", liste: "metiers", derive: { champ: "domaine", liste: "domaines" } }
];

const CYRILLIQUE = /^[Ѐ-ӿ́' -]+$/;

export function personnageVide() {
  return { prenom: "", prenomRu: null, metier: null, couleurs: COMBINAISONS[0].id, motif: MOTIFS[0], vus: {} };
}

// Données lues dans le stockage (ou saisies) → personnage sain. Jamais d'erreur levée.
export function validerPersonnage(brut) {
  const p = personnageVide();
  if (!brut || typeof brut !== "object") return p;
  if (typeof brut.prenom === "string") p.prenom = [...brut.prenom.replace(/[\u0000-\u001f]/g, "").trim()].slice(0, PRENOM_MAX).join("");
  const ru = brut.prenomRu;
  if (p.prenom && ru && typeof ru.cible === "string" && CYRILLIQUE.test(ru.cible)) {
    p.prenomRu = { cible: ru.cible.trim(), accent: typeof ru.accent === "string" && CYRILLIQUE.test(ru.accent) ? ru.accent.trim() : ru.cible.trim() };
  }
  if (typeof brut.metier === "string" && brut.metier) p.metier = brut.metier;
  if (COMBINAISONS.some((c) => c.id === brut.couleurs)) p.couleurs = brut.couleurs;
  if (MOTIFS.includes(brut.motif)) p.motif = brut.motif;
  if (brut.vus && typeof brut.vus === "object") Object.keys(brut.vus).forEach((k) => { if (brut.vus[k] === true) p.vus[k] = true; });
  return p;
}

// ---------- Prénom : lettres latines → cyrillique ----------

const sansSignes = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const VOYELLES = "aeiouyé";
const estVoyelle = (c) => !!c && VOYELLES.includes(c);
const estLettre = (c) => !!c && /[a-zçé]/.test(c);
const CLASSES = {
  V: estVoyelle,
  C: (c) => estLettre(c) && !estVoyelle(c),
  C2: (c) => estLettre(c) && !estVoyelle(c) && c !== "n" && c !== "m",
  EI: (c) => !!c && "eiyé".includes(c)
};
const dansClasse = (nom, c) => (CLASSES[nom] ? CLASSES[nom](c) : c === nom);

// Les conditions des règles de Nadia sont écrites en français (« fin, après V, n ou r »).
// Virgule = « et » ; « ou » sépare des variantes ; un mot seul (« n », « r ») reprend le mot-clé d'avant.
function conditionVraie(si, mot, pos, longueur) {
  if (!si) return true;
  const avant = mot[pos - 1], apres = mot[pos + longueur];
  const debut = pos === 0 || (pos === 1 && mot[0] === "h");
  return si.replace(", n ou r", " ou n ou r").split(",").every((partie) => {
    let motCle = "";
    return partie.split(" ou ").some((brique) => {
      const b = brique.trim();
      let m;
      if (b === "fin") return pos + longueur === mot.length;
      if (b === "debut") return debut;
      if (b === "entre deux V") return estVoyelle(avant) && estVoyelle(apres);
      if ((m = b.match(/^(après|suivi de) (\S+)$/))) { motCle = m[1]; return motCle === "après" ? dansClasse(m[2], avant) : dansClasse(m[2], apres); }
      return motCle === "après" ? dansClasse(b, avant) : dansClasse(b, apres);
    });
  });
}

// Règles seules (sans dictionnaire) sur un prénom simple. Renvoie le cyrillique en minuscules, ou null
// si une lettre est inconnue (ñ, ø, apostrophe…) : le prénom reste alors en lettres latines.
export function convertirParRegles(latin, regles) {
  const normalisation = { à: "a", â: "a", î: "i", ï: "i", ô: "o", ö: "o", û: "u", ü: "u", è: "é", ê: "é", ë: "é" };
  const mot = [...latin.toLowerCase()].map((c) => normalisation[c] || c).join("");
  let sortie = "";
  for (let pos = 0; pos < mot.length;) {
    const r = regles.table.find((x) => mot.startsWith(x.de, pos) && conditionVraie(x.si, mot, pos, x.de.length));
    if (!r) return null;
    sortie += r.vers;
    pos += r.de.length;
  }
  return sortie;
}

const majuscule = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);

// Prénom tapé → { cible, accent } ou null. Dictionnaire d'abord (avec l'accent tonique), puis règles.
// Un prénom composé se traite partie par partie, séparateurs gardés.
export function convertirPrenom(latin, prenoms) {
  const texte = (latin || "").trim();
  if (!texte || !prenoms) return null;
  const dico = new Map((prenoms.dictionnaire || []).map((e) => [sansSignes(e.latin), e]));
  const parties = texte.split(/([- ]+)/);
  const cible = [], accent = [];
  for (const partie of parties) {
    if (/^[- ]+$/.test(partie)) { cible.push(partie); accent.push(partie); continue; }
    const connu = dico.get(sansSignes(partie));
    if (connu) { cible.push(connu.cible); accent.push(connu.accent); continue; }
    const r = convertirParRegles(partie, prenoms.regles);
    if (r === null) return null;
    cible.push(majuscule(r)); accent.push(majuscule(r));
  }
  return { cible: cible.join(""), accent: accent.join("") };
}

// ---------- Contenu à ses mots ----------

// Remplacement du moule fourni par une entrée de liste : une forme par genre quand l'entrée a m et f.
function versRemplacement(entree, cle) {
  if (entree.m && entree.f) return Object.assign({}, entree.m, { cle, parGenre: { m: entree.m, f: entree.f } });
  return Object.assign({}, entree, { cle });
}

// Map id de l'élément → remplacement du personnage (générique : une entrée par ligne de REGLAGES_MOULE).
export function remplacementsPerso(donnees, perso) {
  const sortie = new Map();
  REGLAGES_MOULE.forEach(({ reglage, liste, derive }) => {
    const entree = (donnees[liste] || []).find((e) => e.id === perso[reglage]);
    if (!entree) return;
    const cle = reglage + ":" + entree.id;
    if (!sortie.has(entree.element)) sortie.set(entree.element, versRemplacement(entree, cle));
    const lie = derive && entree[derive.champ] ? (donnees[derive.liste] || []).find((e) => e.id === entree[derive.champ]) : null;
    if (lie && !sortie.has(lie.element)) sortie.set(lie.element, versRemplacement(lie, cle + ">" + lie.id));
  });
  return sortie;
}

// Phrase à prénom : le gabarit reçoit le prénom (cyrillique dans la cible, latin tapé dans le français et la translittération).
// Sans prénom, une phrase simple garde son exemple (« sansPrenom » : l'écran ajoute « ton prénom ici ») ;
// la carte de visite, elle, prend le prénom d'exemple pour garder le métier.
export function avecPrenom(el, g, perso, exemple) {
  const sans = !perso.prenom;
  if (sans && el.personnalise === "prenom") return Object.assign({}, el, { sansPrenom: true });
  const ru = perso.prenomRu;
  const v = sans ? { fr: exemple.latin, cible: exemple.cible, accent: exemple.accent, translit: exemple.latin }
    : { fr: perso.prenom, cible: ru ? ru.cible : perso.prenom, accent: ru ? ru.accent : perso.prenom, translit: perso.prenom };
  const mettre = (modele, valeur) => (modele || "").split("{prenom}").join(valeur);
  return Object.assign({}, el, {
    fr: mettre(g.fr, v.fr), cible: mettre(g.cible, v.cible), accent: mettre(g.accent, v.accent), translit: mettre(g.translit, v.translit),
    sansPrenom: sans, avecPrenom: !sans
  });
}

// Carte de visite (prénom + métier) : la carte du métier choisi, une forme par genre quand elles diffèrent.
function carteVisite(el, entree, perso, exemple) {
  // L'élément de base (« ingénieur ») ne doit pas imposer ses variantes : seul le métier choisi parle.
  const base = Object.assign({}, el, { variantes: null, variantesFr: null });
  const faire = (r) => avecPrenom(base, { fr: r.carte_fr, cible: r.carte_cible, accent: r.carte_accent, translit: r.carte_translit }, perso, exemple);
  const m = faire(entree.m || entree);
  if (!entree.m || !entree.f) return m;
  const f = faire(entree.f);
  if (f.fr === m.fr && f.cible === m.cible) return m;
  const forme = (e) => ({ cible: e.cible, accent: e.accent, translit: e.translit });
  return Object.assign(m, { variantes: { m: forme(m), f: forme(f) }, variantesFr: { m: m.fr, f: f.fr } });
}

/**
 * Contenu à ses mots, sans toucher au contenu de base (nouvelle copie à chaque changement du personnage).
 * - phrases à prénom : prénom en cyrillique (ou latin), « sansPrenom » si rien n'est réglé ;
 * - moules : le remplacement du personnage passe en tête (indice 0) et le moule est marqué `personnel` ;
 * - carte de visite : absente tant qu'il n'y a pas de métier.
 */
export function personnaliser(contenu, brut) {
  const donnees = contenu.donnees;
  if (!donnees) return contenu;
  const perso = validerPersonnage(brut);
  const exemple = (donnees.prenoms && donnees.prenoms.exemple) || { latin: "", cible: "", accent: "" };
  const remplacements = remplacementsPerso(donnees, perso);
  const entree = (donnees.metiers || []).find((e) => e.id === perso.metier);
  const liste = [];
  contenu.elements.forEach((el) => {
    const g = el.gabarit && typeof el.gabarit === "object" ? el.gabarit : null;
    if (el.personnalise === "prenom+metier") { if (entree) liste.push(carteVisite(el, entree, perso, exemple)); return; }
    if (el.personnalise && g) { liste.push(avecPrenom(el, g, perso, exemple)); return; }
    const r = el.moule ? remplacements.get(el.id) : null;
    if (!r) { liste.push(el); return; }
    const reste = el.moule.remplacements.filter((x) => x.phrase_cible !== r.phrase_cible);
    liste.push(Object.assign({}, el, { moule: Object.assign({}, el.moule, { personnel: true, remplacements: [r, ...reste] }) }));
  });
  const elements = liste.map((el, i) => (el.rang === i + 1 ? el : Object.assign({}, el, { rang: i + 1 })));
  const parId = new Map(elements.map((e) => [e.id, e]));
  const situations = contenu.situations.map((s) => Object.assign({}, s, { ids: s.ids.filter((id) => parId.has(id)) }));
  return Object.assign({}, contenu, { elements, parId, situations });
}

// Réglage du personnage qui manque pour cet élément (« prenom », « metier »), ou null :
// sert à proposer, sur la carte, de l'ajouter. Seuls les moules « Je suis ___ » portent l'invitation du métier.
export function reglageManquant(el, donnees, perso) {
  if (el.personnalise) return perso.prenom ? null : "prenom";
  if (!el.moule || !donnees) return null;
  const r = REGLAGES_MOULE.find(({ reglage, liste }) => !perso[reglage] && (donnees[liste] || []).some((e) => e.element === el.id));
  return r ? r.reglage : null;
}
