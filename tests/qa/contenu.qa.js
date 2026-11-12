// Vérification QA du contenu (indépendante des outils du dev).
// Lancement depuis la racine du dépôt :
//   jsc tests/qa/contenu.qa.js
const out = print;
const ACC = "́";
const VOY = /[аеёиоуыэюяАЕЁИОУЫЭЮЯ]/g;
let pb = [];
const P = (m) => pb.push(m);
const ids = new Map();
let total = 0, moules = 0;

function motsSansPonct(s) { return s.split(/[\s,.!?;:«»"—–\-…]+/).filter(Boolean); }
function verifAccent(texte, ou) {
  if (typeof texte !== "string") { P(ou + " : accent manquant"); return; }
  if (/[A-Za-zÀ-ɏ]/.test(texte)) P(ou + " : caractère latin dans le russe : " + texte);
  for (const mot of motsSansPonct(texte)) {
    if (!/[а-яё]/i.test(mot)) continue;
    const nbVoy = (mot.replace(new RegExp(ACC, "g"), "").match(VOY) || []).length;
    const nbAcc = (mot.match(new RegExp(ACC, "g")) || []).length;
    const aYo = /ё/i.test(mot);
    if (nbAcc > 1) P(ou + " : plusieurs accents dans « " + mot + " »");
    if (nbVoy > 1 && nbAcc === 0 && !aYo) P(ou + " : accent tonique manquant sur « " + mot + " » (" + texte + ")");
    if (nbAcc === 1) {
      const i = mot.indexOf(ACC);
      if (i === 0 || !/[аеёиоуыэюя]/i.test(mot[i - 1])) P(ou + " : accent hors voyelle dans « " + mot + " »");
    }
    if (aYo && nbAcc) P(ou + " : ё accentué en plus dans « " + mot + " »");
  }
}
const sansAcc = (s) => (s || "").replace(new RegExp(ACC, "g"), "");
function chaine(v) { return typeof v === "string" && v.trim().length > 0; }

let index;
try { index = JSON.parse(readFile("content/ru/index.json")); } catch (e) { P("index.json invalide : " + e); }
if (index) {
  if (index.langue !== "ru") P("index.json : langue");
  // La liste vient d'index.json ; on contrôle seulement qu'elle est non vide et sans doublon.
  const idsIdx = index.situations.map((s) => s.id);
  if (!idsIdx.length) P("index.json : aucune situation");
  if (new Set(idsIdx).size !== idsIdx.length) P("index.json : identifiant de situation en double");
  for (const s of index.situations) {
    if (!chaine(s.titre) || s.fichier !== s.id + ".json") P("index.json : entrée " + JSON.stringify(s));
    let d;
    try { d = JSON.parse(readFile("content/ru/" + s.fichier)); } catch (e) { P(s.fichier + " : JSON invalide " + e); continue; }
    const f = s.fichier;
    for (const k of ["langue", "situation", "titre", "niveau", "phrases"]) if (!(k in d)) P(f + " : champ " + k + " manquant");
    if (d.langue !== "ru") P(f + " : langue");
    if (d.situation !== s.id) P(f + " : situation " + d.situation);
    if (d.titre !== s.titre) P(f + " : titre différent de index.json (" + d.titre + " / " + s.titre + ")");
    if (d.niveau !== "A1") P(f + " : niveau " + d.niveau);
    const ph = d.phrases || [];
    if (ph.length < 8 || ph.length > 10) P(f + " : " + ph.length + " phrases (8 à 10 attendues)");
    let nbMoules = 0;
    ph.forEach((p, i) => {
      total++;
      const ou = f + " " + (p.id || "#" + i);
      const champs = ["id", "fr", "cible", "accent", "translit", "registre", "variantes", "astuce", "moule"];
      for (const k of champs) if (!(k in p)) P(ou + " : champ obligatoire " + k + " absent");
      for (const k of Object.keys(p)) if (!champs.includes(k) && k !== "ordre_libre") P(ou + " : champ inconnu " + k);
      if ("ordre_libre" in p && typeof p.ordre_libre !== "boolean") P(ou + " : ordre_libre non booléen");
      if (!/^ru-[a-z]+-\d{3}$/.test(p.id || "") || !(p.id || "").startsWith("ru-" + s.id + "-")) P(ou + " : id mal formé");
      if (ids.has(p.id)) P("id en double : " + p.id + " (" + ids.get(p.id) + ", " + f + ")"); else ids.set(p.id, f);
      for (const k of ["fr", "cible", "accent", "translit"]) if (!chaine(p[k])) P(ou + " : " + k + " vide");
      if (sansAcc(p.accent) !== p.cible) P(ou + " : accent ≠ cible une fois les accents ôtés : " + p.accent + " / " + p.cible);
      verifAccent(p.accent, ou);
      if (!["tu", "vous", "neutre"].includes(p.registre)) P(ou + " : registre " + p.registre);
      if (p.translit && /[а-яё]/i.test(p.translit)) P(ou + " : cyrillique dans translit");
      if (p.astuce !== null && !chaine(p.astuce)) P(ou + " : astuce ni null ni texte");
      if (p.astuce && p.astuce.length > 200) P(ou + " : astuce longue (" + p.astuce.length + " car.), > 2 lignes ? " + p.astuce);
      if (p.variantes !== null) {
        if (!p.variantes || !p.variantes.m || !p.variantes.f) P(ou + " : variantes incomplètes");
      }
      if (p.moule !== null) {
        nbMoules++; moules++;
        const m = p.moule;
        if (!m || !chaine(m.modele) || !chaine(m.fr) || !Array.isArray(m.remplacements)) { P(ou + " : moule mal formé"); return; }
        if (!m.modele.includes("___") || !m.fr.includes("___")) P(ou + " : moule sans trou ___");
        const n = m.remplacements.length;
        if (n < 4 || n > 6) P(ou + " : moule à " + n + " remplacements (4 à 6)");
        const vus = new Set();
        m.remplacements.forEach((r, j) => {
          const o = ou + " rempl. " + j;
          for (const k of ["fr", "cible", "accent", "translit", "phrase_fr", "phrase_cible", "phrase_accent", "phrase_translit"]) if (!chaine(r[k])) P(o + " : " + k + " manquant");
          if (sansAcc(r.accent) !== r.cible) P(o + " : accent ≠ cible : " + r.accent + " / " + r.cible);
          if (sansAcc(r.phrase_accent) !== r.phrase_cible) P(o + " : phrase_accent ≠ phrase_cible : " + r.phrase_accent + " / " + r.phrase_cible);
          verifAccent(r.phrase_accent, o);
          verifAccent(r.accent, o + " (morceau)");
          const attendu = m.modele.replace("___", r.cible);
          const norm = (x) => x.toLowerCase().replace(/\s+/g, " ").trim();
          if (norm(attendu) !== norm(r.phrase_cible)) P(o + " : modèle+morceau ≠ phrase_cible : « " + attendu + " » vs « " + r.phrase_cible + " »");
          const attenduFr = m.fr.replace("___", r.fr);
          if (norm(attenduFr) !== norm(r.phrase_fr)) P(o + " : modèle fr+morceau ≠ phrase_fr : « " + attenduFr + " » vs « " + r.phrase_fr + " »");
          if (r.phrase_accent && !r.phrase_accent.toLowerCase().includes(r.accent.toLowerCase())) P(o + " : morceau accentué absent de la phrase accentuée (soulignement impossible)");
          if (r.phrase_fr && !r.phrase_fr.toLowerCase().includes(r.fr.toLowerCase())) P(o + " : morceau fr absent de la phrase fr (soulignement impossible)");
          if (vus.has(r.phrase_cible)) P(o + " : remplacement en double"); vus.add(r.phrase_cible);
        });
        const r0 = m.remplacements[0];
        if (r0 && (r0.phrase_cible !== p.cible || r0.phrase_fr !== p.fr || r0.phrase_accent !== p.accent || r0.phrase_translit !== p.translit)) P(ou + " : remplacement 0 différent de la phrase principale");
      }
    });
    if (nbMoules !== 2) P(f + " : " + nbMoules + " moules (2 attendus)");
  }
}
// Phrases de Max
const tout = [];
index.situations.forEach((s) => JSON.parse(readFile("content/ru/" + s.fichier)).phrases.forEach((p) => {
  tout.push(p.fr); if (p.moule) p.moule.remplacements.forEach((r) => tout.push(r.phrase_fr));
}));
for (const m of ["Combien ça coûte ?", "J'aime me promener le soir.", "J'aime ton chien.", "Je vais aller au foot."]) {
  if (!tout.some((x) => x.replace(/[  ]/g, " ").toLowerCase() === m.toLowerCase())) P("Phrase de Max absente (forme exacte) : " + m + " — proches : " + tout.filter((x) => x.toLowerCase().includes(m.split(" ")[1].toLowerCase().slice(0, 5))).join(" | "));
}
out("Éléments : " + total + ", moules : " + moules + ", ids uniques : " + ids.size);
out(pb.length + " problème(s)");
pb.forEach((x) => out(" - " + x));
