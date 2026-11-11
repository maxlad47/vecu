// QA : durée réelle simulée, Silence sans type sonore, données corrompues.
// Lancement depuis la racine : jsc -m tests/qa/moteur.qa.mjs
import { preparerContenu } from "../../app/js/contenu.js";
import { creerSession, aleatoireGraine } from "../../app/js/moteur.js";
import { ficheVide, ajouterJours } from "../../app/js/leitner.js";
const out = print;
const idx = JSON.parse(readFile("content/ru/index.json"));
const fich = {}; idx.situations.forEach((s) => { fich[s.id] = JSON.parse(readFile("content/ru/" + s.fichier)); });
const contenu = preparerContenu(idx, fich);
const J = "2026-11-11";
const SONORES = ["ecoute", "voix-haute", "boucle-decouverte", "boucle-rappel"];

// États de progression
function etat(nom, rnd) {
  const f = new Map();
  const els = contenu.elements;
  if (nom === "vide") return f;
  if (nom === "milieu") els.slice(0, 20).forEach((e, i) => f.set(e.id, Object.assign(ficheVide(e.id), { boite: 1 + (i % 4), echeance: ajouterJours(J, (i % 3) - 1), premiereVue: "2026-11-01" })));
  if (nom === "tousDus") els.forEach((e, i) => f.set(e.id, Object.assign(ficheVide(e.id), { boite: 1 + (i % 6), echeance: ajouterJours(J, -1 - (i % 5)), premiereVue: "2026-10-01" })));
  if (nom === "tousAcquis") els.forEach((e) => f.set(e.id, Object.assign(ficheVide(e.id), { boite: 6, echeance: ajouterJours(J, 20), premiereVue: "2026-09-01" })));
  return f;
}

// Modèle de temps de parole (s) : russe ~13 car/s, français ~15 car/s à rate 1.
const tps = (txt, cps, rate) => txt.length / (cps * rate);
function dureeCycleVoiture(carte, secours) {
  const fr = carte.texte.fr, ru = carte.texte.cible;
  const sec = (txt, rate) => Math.max(1.0, txt.length * 0.100 / rate) + 1.5; // minuteur de secours audio.js
  const ruL = secours ? sec(ru, 0.7) : tps(ru, 13, 0.7), ruN = secours ? sec(ru, 1) : tps(ru, 13, 1), frN = secours ? sec(fr, 1) : tps(fr, 15, 1);
  if (carte.type === "boucle-decouverte") return frN + 1 + ruL + 3 + ruN + 3 + ruN + 2;
  return frN + (ru.length > 25 ? 6 : 5) + ruL + 1 + ruN + 3.5;
}

let problemes = 0;
const lignes = [];
function simuler(mode, duree, nomEtat, profil, graine) {
  const fiches = etat(nomEtat);
  const s = creerSession({ contenu, fiches, mode, duree, jour: J, genre: "m", aleatoire: aleatoireGraine(graine) });
  const h = aleatoireGraine(graine * 7 + 1);
  let t = 0, carte, n = 0, types = new Set();
  const secours = profil === "secours";
  if (mode === "voiture") t += secours ? Math.max(1.0, 30 * 0.10) + 1.5 : 2.5; // annonce de début (~30 car.)
  while ((carte = s.prochaineCarte(t))) {
    n++; types.add(carte.type);
    let d;
    if (mode === "voiture") d = dureeCycleVoiture(carte, secours);
    else {
      const f = profil === "rapide" ? 0.5 : profil === "lent" ? 1.6 : profil === "hasard" ? 0.4 + h() * 1.6 : 1;
      d = carte.est * f;
    }
    t += d;
    let r = "non-note";
    if (carte.type === "boucle-rappel") r = "passif";
    else if (!["decouverte", "boucle-decouverte"].includes(carte.type)) r = h() < 0.75 ? "reussite" : "echec";
    s.repondre(carte, r);
    if (n > 2000) { out("BOUCLE INFINIE ? " + mode + duree); break; }
  }
  if (mode === "voiture") t += secours ? Math.max(1.0, 40 * 0.10) + 1.5 : 3; // annonce de fin
  const D = duree * 60, ecart = (t - D) / D;
  const ok = Math.abs(ecart) <= 0.2;
  if (!ok) problemes++;
  if (mode === "silence" && [...types].some((x) => SONORES.includes(x))) { problemes++; out("SILENCE AVEC TYPE SONORE " + [...types]); }
  if (mode === "voiture" && [...types].some((x) => !x.startsWith("boucle"))) { problemes++; out("VOITURE AVEC TYPE ÉCRAN " + [...types]); }
  return { ok, t: Math.round(t), ecart: Math.round(ecart * 100), n };
}

for (const mode of ["silence", "ecouteurs", "parler", "voiture"]) {
  for (const duree of [2, 5, 15, 30]) {
    const profils = mode === "voiture" ? ["tts", "secours"] : ["normal", "rapide", "lent", "hasard"];
    const cellules = [];
    for (const nomEtat of ["vide", "milieu", "tousDus", "tousAcquis"]) {
      for (const profil of profils) {
        let pire = null;
        for (let g = 1; g <= 15; g++) {
          const r = simuler(mode, duree, nomEtat, profil, g);
          if (!pire || Math.abs(r.ecart) > Math.abs(pire.ecart)) pire = r;
        }
        cellules.push((pire.ok ? "" : "**HORS** ") + nomEtat + "/" + profil + " " + (pire.ecart >= 0 ? "+" : "") + pire.ecart + "% (" + pire.n + " c.)");
      }
    }
    out(mode + " " + duree + " min : " + cellules.join(" ; "));
  }
}
out("Durées hors ±20 % (pire graine sur 15) : " + problemes);

// Données corrompues
const corrompues = [
  { id: "ru-cafe-001", boite: "trois" },
  { id: "ru-cafe-002", boite: 99, echeance: 12345, historique: "x" },
  { id: "ru-cafe-003", boite: -1, echeance: null },
  { id: "ru-courses-001", boite: 2, echeance: "pas une date", historique: null },
  { id: "ru-courses-002", boite: 3, echeance: "2026-11-01", dernierRemplacement: 42 },
  { id: "ru-courses-005", boite: 2, echeance: "2026-11-01", dernierRemplacement: -3 },
  { id: "ru-inconnu-999", boite: 4, echeance: "2026-11-01" },
  { id: "ru-gouts-001" },
  { id: "ru-gouts-002", boite: null, echeance: undefined, dernierRemplacement: "2" }
];
for (const mode of ["silence", "ecouteurs", "parler", "voiture"]) for (const duree of [2, 30]) {
  const fiches = new Map(corrompues.map((f) => [f.id, Object.assign({}, f)]));
  try {
    const s = creerSession({ contenu, fiches, mode, duree, jour: J, genre: "m", aleatoire: aleatoireGraine(3) });
    let t = 0, c, n = 0, vides = 0;
    while ((c = s.prochaineCarte(t))) {
      n++; t += c.est;
      if (!c.texte || !c.texte.cible || !c.texte.fr) vides++;
      if (c.options && (c.options.length !== 3 || c.options.some((o) => !o.texte || !o.texte.fr))) vides++;
      s.repondre(c, c.type.startsWith("boucle-r") ? "passif" : c.type.includes("decouverte") ? "non-note" : "echec");
      if (n > 3000) break;
    }
    s.bilan();
    out("corrompu " + mode + " " + duree + " : OK, " + n + " cartes, " + vides + " cartes au texte vide, t=" + t);
  } catch (e) { problemes++; out("corrompu " + mode + " " + duree + " : EXCEPTION " + e + " " + (e.stack || "").split("\n")[0]); }
}
