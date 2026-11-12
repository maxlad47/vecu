// Ambiance d'une langue : palette, décors et poupées, lus dans content/<langue>/ambiance.json
// (format : docs/design/bagou-ru.md, section 10). Les couleurs et les décors ne sont jamais écrits
// dans le code : une langue sans ce fichier garde l'ambiance neutre de la phase 0 (app.css).
// Les fonctions « pures » du haut (contrôle, CSS) n'ont pas besoin du DOM, pour être testées.

const ETATS = ["pas_vue", "vue", "en_cours", "acquise"];
const HEX = /^#[0-9a-fA-F]{6}$/;
const NOM_VARIABLE = /^--[a-z0-9-]+$/;

// Jeu de couleurs exigé pour chaque thème (clair, sombre). Les jetons de décor supplémentaires sont facultatifs.
const JETONS_REQUIS = ["--bg", "--surface", "--text", "--text-muted", "--border", "--border-subtle", "--accent", "--on-accent",
  "--accent-soft", "--laque", "--on-laque", "--laque-soft", "--or", "--or-text", "--deco-bleu-pale"];

// Paires à contrôler (bagou-ru.md, 1.2) : [premier plan, fond, seuil]. 4,5 pour du texte, 3 pour un composant ou une icône.
const PAIRES = [
  ["--text", "--bg", 4.5], ["--text", "--surface", 4.5], ["--text", "--accent-soft", 4.5],
  ["--text-muted", "--bg", 4.5], ["--text-muted", "--surface", 4.5], ["--text-muted", "--accent-soft", 4.5],
  ["--accent", "--bg", 4.5], ["--accent", "--surface", 4.5], ["--accent", "--accent-soft", 4.5],
  ["--on-accent", "--accent", 4.5], ["--on-laque", "--laque", 4.5], ["--laque", "--bg", 4.5], ["--laque", "--laque-soft", 4.5],
  ["--or-text", "--bg", 4.5],
  ["--border", "--bg", 3], ["--border", "--surface", 3], ["--border", "--accent-soft", 3]
];

function luminance(hex) {
  const canal = (i) => {
    const c = parseInt(hex.slice(1 + 2 * i, 3 + 2 * i), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * canal(0) + 0.7152 * canal(1) + 0.0722 * canal(2);
}
export function contraste(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

// Contrôle d'entrée : le fichier est refusé (ambiance neutre) si un jeton manque, n'est pas une couleur,
// ou si une paire de 1.2 passe sous son seuil dans l'un des deux thèmes.
export function controlerAmbiance(json) {
  const raisons = [];
  if (!json || typeof json !== "object" || !json.couleurs) return { ok: false, raisons: ["couleurs absentes"] };
  for (const theme of ["clair", "sombre"]) {
    const c = json.couleurs[theme];
    if (!c || typeof c !== "object") { raisons.push("thème " + theme + " absent"); continue; }
    for (const [nom, valeur] of Object.entries(c)) {
      if (!NOM_VARIABLE.test(nom) || !HEX.test(valeur)) raisons.push(theme + " : " + nom + " n'est pas une couleur #RRGGBB");
    }
    JETONS_REQUIS.forEach((nom) => { if (!HEX.test(c[nom] || "")) raisons.push(theme + " : " + nom + " manque"); });
    if (raisons.length) continue;
    PAIRES.forEach(([av, ar, seuil]) => {
      const r = contraste(c[av], c[ar]);
      if (r < seuil) raisons.push(theme + " : " + av + " sur " + ar + " = " + r.toFixed(2) + " (minimum " + seuil + ")");
    });
  }
  return { ok: raisons.length === 0, raisons };
}

// Feuille de style qui reprend le mécanisme de app.css : clair par défaut, sombre selon l'appareil,
// puis forcé par data-theme="dark" ou par le mode Voiture. Seules des couleurs #RRGGBB sont recopiées.
export function construireCss(json) {
  const bloc = (c) => Object.entries(c).filter(([n, v]) => NOM_VARIABLE.test(n) && HEX.test(v)).map(([n, v]) => n + ":" + v + ";").join("");
  const clair = bloc(json.couleurs.clair), sombre = bloc(json.couleurs.sombre);
  return ":root{" + clair + "}" +
    "@media (prefers-color-scheme: dark){:root:not([data-theme=\"light\"]){" + sombre + "}}" +
    ":root[data-theme=\"dark\"],body.theme-voiture{" + sombre + "}";
}

// ---------- État de l'ambiance chargée ----------
let courante = null; // { json, symboles: {etat: texteSvg}|null, decors: Map(chemin → texteSvg) }

// Chemin relatif d'un décor, ou null s'il n'y en a pas. sobre = pas de rouge ni d'or.
function decorDe(json, situation) {
  const d = json && json.decors;
  if (!d) return null;
  let entree = d.par_situation && Object.prototype.hasOwnProperty.call(d.par_situation, situation) ? d.par_situation[situation] : d.defaut;
  if (entree === null || entree === undefined) return null;
  if (typeof entree === "string") entree = { fichier: entree };
  return typeof entree.fichier === "string" ? { fichier: entree.fichier, sobre: entree.sobre === true } : null;
}

// Vrai si la situation est explicitement sans décor (« null » dans le fichier) : l'écran met alors un simple filet bleu.
export function sansDecor(situation) {
  const d = courante && courante.json.decors;
  return !!d && !!d.par_situation && Object.prototype.hasOwnProperty.call(d.par_situation, situation) && d.par_situation[situation] === null;
}

// Les SVG viennent de nos propres fichiers (jamais de l'utilisateur) : on les insère tels quels pour que
// var(--deco-…) s'applique. Le conteneur est décoratif : aria-hidden, jamais touchable.
function elementDecor(texte, classe, sobre) {
  const div = document.createElement("div");
  div.className = "decor " + classe + (sobre ? " sobre" : "");
  div.setAttribute("aria-hidden", "true");
  div.innerHTML = texte;
  const svg = div.querySelector("svg");
  if (svg) { svg.setAttribute("focusable", "false"); svg.removeAttribute("width"); svg.removeAttribute("height"); }
  return div;
}

export function decorAccueil() {
  if (!courante) return null;
  const chemin = courante.json.decors && courante.json.decors.accueil;
  const texte = chemin && courante.decors.get(chemin);
  return texte ? elementDecor(texte, "decor-accueil", false) : null;
}

export function decorSituation(situation) {
  if (!courante) return null;
  const d = decorDe(courante.json, situation);
  const texte = d && courante.decors.get(d.fichier);
  return texte ? elementDecor(texte, "decor-carte", d.sobre) : null;
}

// Nom de l'objet de progression de la langue (« matriochka »), pour les textes d'aide.
export function nomObjet() { return courante && courante.json.objet_progression ? courante.json.objet_progression.nom : null; }

// ---------- Poupées : un sprite <symbol> inséré une fois, puis des <use> ----------
// Formes de secours (ambiance neutre ou fichier manquant) : le mot d'état reste écrit à côté.
const SECOURS = {
  pas_vue: '<circle cx="20" cy="28" r="17" fill="none" stroke="var(--border)" stroke-width="2" stroke-dasharray="4 3"/>',
  vue: '<circle cx="20" cy="28" r="17" fill="var(--surface)" stroke="var(--accent)" stroke-width="2"/>',
  en_cours: '<circle cx="20" cy="28" r="17" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/><path d="M20 11a17 17 0 0 1 0 34z" fill="var(--accent)"/>',
  acquise: '<circle cx="20" cy="28" r="17" fill="var(--accent)" stroke="var(--accent)" stroke-width="2"/><path d="M12 28l6 6 11-13" fill="none" stroke="var(--on-accent)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'
};

function symboleDe(etat, texteSvg) {
  if (texteSvg) {
    // Le fichier est un <svg viewBox="…">…</svg> : on garde son contenu et son viewBox.
    const m = texteSvg.match(/<svg[^>]*viewBox="([^"]+)"[^>]*>([\s\S]*)<\/svg>\s*$/);
    if (m) return '<symbol id="poupee-' + etat + '" viewBox="' + m[1] + '">' + m[2] + "</symbol>";
  }
  return '<symbol id="poupee-' + etat + '" viewBox="0 0 40 57">' + SECOURS[etat] + "</symbol>";
}

function insererSprite(symboles) {
  const ancien = document.getElementById("sprite-poupees");
  if (ancien) ancien.remove();
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.id = "sprite-poupees";
  svg.setAttribute("width", "0"); svg.setAttribute("height", "0");
  svg.setAttribute("aria-hidden", "true"); svg.setAttribute("focusable", "false");
  svg.style.position = "absolute";
  svg.innerHTML = "<defs>" + ETATS.map((e) => symboleDe(e, symboles && symboles[e])).join("") + "</defs>";
  document.body.insertBefore(svg, document.body.firstChild);
}

// ---------- Chargement ----------
const lireHttp = async (chemin, json) => {
  const reponse = await fetch(chemin);
  if (!reponse.ok) throw new Error("Introuvable : " + chemin);
  return json ? reponse.json() : reponse.text();
};

// Charge et applique l'ambiance. Ne rejette jamais : au moindre problème, l'ambiance neutre s'applique.
// lire(chemin, json) est injectable pour les tests.
export async function chargerAmbiance(langue, lire) {
  const lecture = lire || lireHttp;
  const base = "content/" + langue + "/";
  courante = null;
  let json = null;
  try { json = await lecture(base + "ambiance.json", true); } catch (e) { json = null; }
  if (!json) { insererSprite(null); return false; }
  const verdict = controlerAmbiance(json);
  if (!verdict.ok) {
    try { console.warn("Ambiance refusée, ambiance neutre :", verdict.raisons); } catch (e) { /* rien */ }
    insererSprite(null);
    return false;
  }
  // Tous les SVG listés dans le fichier, en parallèle ; un SVG manquant n'empêche rien (décor absent).
  const chemins = new Set();
  const o = json.objet_progression && json.objet_progression.symboles;
  if (o) ETATS.forEach((e) => { if (typeof o[e] === "string") chemins.add(o[e]); });
  const d = json.decors || {};
  if (typeof d.accueil === "string") chemins.add(d.accueil);
  if (typeof d.defaut === "string") chemins.add(d.defaut);
  Object.values(d.par_situation || {}).forEach((v) => {
    const f = typeof v === "string" ? v : (v && v.fichier);
    if (typeof f === "string") chemins.add(f);
  });
  const decors = new Map();
  await Promise.all([...chemins].map((c) => lecture(base + c, false).then((texte) => { decors.set(c, texte); }, () => { /* absent : tant pis */ })));
  const symboles = {};
  if (o) ETATS.forEach((e) => { if (o[e] && decors.has(o[e])) symboles[e] = decors.get(o[e]); });
  courante = { json, symboles, decors };

  const style = document.createElement("style");
  style.id = "ambiance";
  style.textContent = construireCss(json);
  document.head.appendChild(style);
  insererSprite(symboles);
  // La barre du navigateur suit le fond de l'ambiance.
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => {
    const sombre = (m.getAttribute("media") || "").includes("dark");
    m.setAttribute("content", json.couleurs[sombre ? "sombre" : "clair"]["--bg"]);
  });
  return true;
}
