// Construction des exercices : choix des QCM (2 leurres) et tuiles de l'Ordre.
// Règles : docs/pedagogie/regles-session.md, section 7. Module pur.

import { texteElement, normaliser, motsOrdre, sansAccent } from "./contenu.js";
import { BOITE_ECRIRE, ECRIRE_FAUTE_MIN } from "./config.js";

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

// ---------- Écrire la réponse (saisie en cyrillique) ----------

// Vrai si la carte « Écrire » est possible : phrase assez installée (boîte haute), jamais sur une phrase à prénom
// (le prénom n'est pas à écrire). Le mode (pas de Voiture) est vérifié par le moteur.
export function ecriturePossible(el, fiche) {
  return !el.personnalise && !!fiche && fiche.boite >= BOITE_ECRIRE;
}

// Translittération « à la française » (celle de l'app) vers le cyrillique, pour qui n'a pas le clavier russe.
// Règles les plus longues d'abord. Les lettres inconnues (et le cyrillique déjà tapé) passent telles quelles.
// shortcut: les voyelles réduites de la translittération affichée (pajálsta) ne sont pas devinées ; la petite faute
// d'une lettre en absorbe une, au-delà c'est une erreur : à revoir si les testeurs s'en plaignent.
const TRANSLIT = [
  ["chtch", "щ"], ["shch", "щ"], ["tch", "ч"], ["iou", "ю"], ["ia", "я"], ["ya", "я"], ["yu", "ю"], ["io", "ё"], ["yo", "ё"],
  ["ié", "е"], ["ie", "е"], ["ye", "е"], ["zh", "ж"], ["kh", "х"], ["ts", "ц"], ["ch", "ш"], ["sh", "ш"], ["ou", "у"],
  ["a", "а"], ["b", "б"], ["v", "в"], ["g", "г"], ["d", "д"], ["j", "ж"], ["z", "з"], ["i", "и"], ["ï", "й"], ["k", "к"],
  ["l", "л"], ["m", "м"], ["n", "н"], ["o", "о"], ["p", "п"], ["r", "р"], ["s", "с"], ["t", "т"], ["u", "у"], ["f", "ф"],
  ["h", "х"], ["y", "ы"], ["'", "ь"], ["’", "ь"]
];
const VOYELLES_RU = "аеёиоуыэюя";
export function versCyrillique(saisie) {
  const mot = sansAccent(saisie || "").toLowerCase().replace(/[áàâ]/g, "a").replace(/[íî]/g, "i").replace(/[óô]/g, "o").replace(/[úû]/g, "u").replace(/ý/g, "y");
  let sortie = "";
  for (let i = 0; i < mot.length;) {
    const regle = TRANSLIT.find(([de]) => mot.startsWith(de, i));
    if (regle) { sortie += regle[1]; i += regle[0].length; continue; }
    if (mot[i] === "e" || mot[i] === "é" || mot[i] === "è") {
      // « э » en début de mot ou après une voyelle (это, этот), « е » après une consonne.
      const avant = sortie[sortie.length - 1];
      sortie += !avant || VOYELLES_RU.includes(avant) || !/[а-яё]/.test(avant) ? "э" : "е";
    } else sortie += mot[i];
    i++;
  }
  return sortie;
}

// Vrai si a et b diffèrent d'une seule lettre (une en trop, une en moins ou une changée).
function uneLettreDePres(a, b) {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  const reste = (x, y) => x === y;
  if (a.length === b.length) return reste(a.slice(i + 1), b.slice(i + 1));
  return a.length > b.length ? reste(a.slice(i + 1), b.slice(i)) : reste(a.slice(i), b.slice(i + 1));
}

// Latin « à plat » pour comparer deux translittérations : sans diacritiques, casse, ponctuation ni espaces multiples.
const platLatin = (x) => (x || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  .replace(/[.,!?;:«»"'’…\-]/g, " ").replace(/\s+/g, " ").trim();

// Compare ce que l'utilisateur a écrit à la phrase russe de la carte (texte = texteElement : genre et moule déjà résolus).
// Ignore casse, ponctuation, accents toniques, ё/е. Accepte le cyrillique, la conversion de lettres latines, ou la
// translittération affichée par l'app. Renvoie "juste", "faute" (une lettre, sans pénalité) ou "faux".
// deuxFormes : genre pas encore choisi, on accepte la forme masculine comme la féminine ; sinon l'autre forme est une erreur,
// même à une lettre près.
export function comparerSaisie(saisie, texte, deuxFormes) {
  const cyr = normaliser(versCyrillique(saisie)), lat = platLatin(saisie);
  if (!cyr) return "faux";
  const formes = (t) => [{ c: normaliser(t.cible), l: platLatin(t.translit) }];
  const miennes = formes(texte).concat(deuxFormes && texte.autre ? formes(texte.autre) : []);
  const autres = !deuxFormes && texte.autre ? formes(texte.autre) : [];
  const egale = (f) => f.c === cyr || (f.l && f.l === lat);
  const proche = (f) => (f.c.length >= ECRIRE_FAUTE_MIN && uneLettreDePres(cyr, f.c)) || (f.l.length >= ECRIRE_FAUTE_MIN && uneLettreDePres(lat, f.l));
  if (miennes.some(egale)) return "juste";
  if (autres.some(egale)) return "faux";
  return miennes.some(proche) ? "faute" : "faux";
}
