// Petits outils pour construire le DOM sans innerHTML (le contenu n'est jamais interprété comme du HTML).

// h("button", { class: "x", onclick: f }, "texte", autreNoeud)
export function h(balise, attributs, ...enfants) {
  const el = document.createElement(balise);
  if (attributs) {
    for (const [nom, valeur] of Object.entries(attributs)) {
      if (valeur === null || valeur === undefined || valeur === false) continue;
      if (nom.startsWith("on") && typeof valeur === "function") el.addEventListener(nom.slice(2), valeur);
      else if (nom === "class") el.className = valeur;
      else if (valeur === true) el.setAttribute(nom, "");
      else el.setAttribute(nom, valeur);
    }
  }
  ajouter(el, enfants);
  return el;
}

function ajouter(el, enfants) {
  for (const enfant of enfants) {
    if (enfant === null || enfant === undefined || enfant === false) continue;
    if (Array.isArray(enfant)) ajouter(el, enfant);
    else if (enfant instanceof Node) el.appendChild(enfant);
    else el.appendChild(document.createTextNode(String(enfant)));
  }
}

// Icônes SVG en ligne (dessinées dans les maquettes de docs/design/maquettes/).
// Contenu fixe écrit ici, jamais du texte venu de l'utilisateur ou du contenu : innerHTML sans risque.
const CHEMINS = {
  graphique: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  engrenage: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  coche: '<path d="M5 12l5 5 9-10"/>',
  croix: '<path d="M6 6l12 12M18 6L6 18"/>',
  retour: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
  muet: '<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M23 9l-6 6M17 9l6 6"/>',
  hautParleur: '<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>',
  casque: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3v4zM3 19a2 2 0 0 0 2 2h1v-6H3v4z"/>',
  bulle: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1.2-4.4A8 8 0 1 1 21 12z"/><path d="M9 11h.01M13 11h.01M17 11h.01"/>',
  voiture: '<path d="M5 17H3v-5l2-5h14l2 5v5h-2"/><path d="M3 12h18"/><circle cx="7.5" cy="17" r="2"/><circle cx="16.5" cy="17" r="2"/><path d="M9.5 17h5"/>',
  reecouter: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>',
  pause: '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
  lecture: '<path d="M7 4l13 8-13 8z"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  suite: '<path d="M9 5l7 7-7 7"/>',
  hasard: '<path d="M4 7h3c5 0 5 10 10 10h3M4 17h3c1.5 0 2.5-.8 3.4-2M14 8.5C15 7.5 16 7 17 7h3M18 4.5L20.5 7 18 9.5M18 14.5l2.5 2.5-2.5 2.5"/>',
  batterie: '<rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21 10.5v3M10.5 9.5l-2 3h4l-2 3"/>',
  telephone: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M10.5 18h3"/>'
};

export function icone(nom) {
  const span = document.createElement("span");
  span.setAttribute("aria-hidden", "true");
  span.style.display = "contents";
  span.innerHTML = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + CHEMINS[nom] + "</svg>";
  return span;
}

// Zone d'annonce pour les lecteurs d'écran (role="status").
export function annoncer(texte) {
  const zone = document.getElementById("annonce");
  if (!zone) return;
  zone.textContent = "";
  setTimeout(() => { zone.textContent = texte; }, 50);
}

// Taille de la phrase russe selon sa longueur (sur le champ cible, sans accents).
export function classeLongueur(cible) {
  const n = (cible || "").length;
  if (n > 45) return "xlong";
  if (n >= 29) return "long";
  return "";
}

// Phrase russe dont chaque mot est un bloc insécable (bagou-ru.md, 12) : l'accent tonique ne se détache pas de son voisin.
export function motsRusses(texte) {
  const span = document.createElement("span");
  String(texte).split(/(\s+)/).forEach((morceau) => {
    if (!morceau) return;
    if (/^\s+$/.test(morceau)) { span.appendChild(document.createTextNode(" ")); return; }
    const mot = document.createElement("span");
    mot.className = "mot-ru";
    mot.textContent = morceau;
    span.appendChild(mot);
  });
  return span;
}

export function vider(el) { while (el.firstChild) el.removeChild(el.firstChild); }

// Met le focus sans faire défiler brutalement.
export function focaliser(el) {
  if (!el) return;
  try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); }
}

// Ajoute des enfants en ignorant null (translittération désactivée, pas d'astuce, pas de registre…).
export function mettre(parent, ...enfants) {
  enfants.forEach((e) => { if (e) parent.appendChild(e); });
  return parent;
}

// Texte français qui contient des mots russes (astuces) : chaque passage en cyrillique est
// placé dans un <span lang="ru">, pour que les lecteurs d'écran le lisent avec une voix russe.
const PASSAGE_RUSSE = /([Ѐ-ӿ][Ѐ-ӿ́-]*(?:[ ,]+[Ѐ-ӿ][Ѐ-ӿ́-]*)*)/;
export function texteMixte(texte) {
  const span = document.createElement("span");
  String(texte).split(PASSAGE_RUSSE).forEach((morceau, i) => {
    if (!morceau) return;
    if (i % 2 === 1) { const ru = document.createElement("span"); ru.lang = "ru"; ru.textContent = morceau; span.appendChild(ru); }
    else span.appendChild(document.createTextNode(morceau));
  });
  return span;
}
