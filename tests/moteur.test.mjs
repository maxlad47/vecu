// Tests du moteur de session et du Leitner, sans navigateur.
// Lancement, depuis la racine du dépôt, sans rien d'autre à préparer :
//   node tests/moteur.test.mjs        (ou : node --test tests/moteur.test.mjs)
// Code de sortie 1 s'il y a au moins un échec. Avec jsc (JavaScriptCore), `readFile` et `print` existent déjà.
// Les comptes attendus (éléments, moules, rangs) sont calculés depuis content/ru/index.json
// et les fichiers listés : ajouter une situation ne casse pas ce test.

import { preparerContenu, texteElement, aLire, phrasesNouvelles } from "../app/js/contenu.js";
import { dialoguesProposables, echangeResolu, reponseRetenue } from "../app/js/dialogues.js";
import { convertirPrenom, convertirParRegles, personnaliser, validerPersonnage, reglageManquant } from "../app/js/personnage.js";
import { REGLES, AUDIO, DIALOGUE } from "../app/js/config.js";
import { optionsMoule } from "../app/js/exercices.js";
import { creerSession, aleatoireGraine, minutesReelles } from "../app/js/moteur.js";
import { controlerAmbiance, construireCss } from "../app/js/ambiance.js";
import { dureePourLieu, themesValides, basculerTheme, dernierChoix } from "../app/js/parcours.js";
import { ficheVide, ajouterJours, calculerJour, appliquerResultat, validerFiche } from "../app/js/leitner.js";

const sortie = typeof print === "function" ? print : console.log;
let echecs = 0, reussites = 0;
function verifier(condition, message) {
  if (condition) reussites++;
  else { echecs++; sortie("ÉCHEC : " + message); }
}
function egal(a, b, message) {
  verifier(JSON.stringify(a) === JSON.stringify(b), message + " (attendu " + JSON.stringify(b) + ", obtenu " + JSON.stringify(a) + ")");
}

// Chemins relatifs à ce fichier : le test marche quel que soit le dossier de lancement.
const racine = new URL("../", import.meta.url);
async function lireJson(chemin) {
  if (typeof readFile === "function") return JSON.parse(readFile(chemin)); // jsc
  const { readFile: lire } = await import("node:fs/promises");
  return JSON.parse(await lire(new URL(chemin, racine), "utf8"));
}
const index = await lireJson("content/ru/index.json");
const fichiers = {};
for (const s of index.situations) fichiers[s.id] = await lireJson("content/ru/" + s.fichier);
const contenu = preparerContenu(index, fichiers);

// ---------- Contenu ----------
// Comptes de référence recalculés depuis les fichiers JSON bruts, sans passer par le code testé.
const brut = index.situations.map((s) => fichiers[s.id].phrases);
const totalPhrases = brut.reduce((n, l) => n + l.length, 0);
const totalMoules = brut.reduce((n, l) => n + l.filter((p) => p.moule && p.moule.remplacements && p.moule.remplacements.length).length, 0);
// Ordre par vagues (CLAUDE.md / contenu.js) : vague 1 = phrases 1 à 3 de chaque situation, puis 4 à 6, puis le reste.
const ordreAttendu = [];
[[0, 3], [3, 6], [6, Infinity]].forEach(([de, a]) => brut.forEach((l) => l.slice(de, a).forEach((p) => ordreAttendu.push(p.id))));
egal(contenu.elements.length, totalPhrases, totalPhrases + " éléments (somme des fichiers listés)");
egal(new Set(contenu.elements.map((e) => e.id)).size, totalPhrases, "identifiants uniques");
egal(contenu.elements.map((e) => e.id), ordreAttendu, "ordre par vagues, complet");
egal(contenu.elements[0].id, brut[0][0].id, "rang 1 = première phrase de la première situation");
egal(contenu.elements.filter((e) => e.moule).length, totalMoules, totalMoules + " moules");
egal(texteElement(contenu.parId.get("ru-cafe-002"), { remplacement: 1 }).fr, "Un thé, s'il vous plaît.", "occurrence de moule");

// ---------- Leitner ----------
egal(calculerJour(new Date(2026, 10, 12, 1, 0)), "2026-11-11", "1 h du matin compte pour la veille");
egal(ajouterJours("2026-11-30", 2), "2026-12-02", "ajout de jours");
{
  const f = Object.assign(ficheVide("x"), { boite: 3, echeance: "2026-11-11" });
  const r = appliquerResultat(f, { jour: "2026-11-11", mode: "silence", type: "sens", resultat: "passif", compteePourDu: true });
  egal([r.boite, r.echeance], [3, "2026-11-15"], "réussite passive plafonnée à la boîte 3");
  const r2 = appliquerResultat(Object.assign(ficheVide("x"), { boite: 4, echeance: "2026-11-11" }),
    { jour: "2026-11-11", mode: "silence", type: "sens", resultat: "echec", compteePourDu: true });
  egal([r2.boite, r2.echeance], [2, "2026-11-12"], "échec d'un dû : −2 boîtes");
  const r3 = appliquerResultat(Object.assign(ficheVide("x"), { boite: 3, echeance: "2026-11-14" }),
    { jour: "2026-11-11", mode: "silence", type: "sens", resultat: "echec", compteePourDu: false });
  const r4 = appliquerResultat(r3, { jour: "2026-11-11", mode: "silence", type: "sens", resultat: "echec", compteePourDu: false });
  egal([r3.boite, r4.boite], [2, 2], "échec non dû : −1 boîte, une fois par jour");
}

// ---------- Exemple 1 : 5 min, Silence, premier lancement ----------
// L’exemple suppose « Combien ça coûte ? » en Ordre ; le contenu le marque ordre_libre.
// On lève ce drapeau le temps de l’exemple, pour vérifier la logique du moteur à l’identique.
{
  const D_ = contenu.parId.get("ru-courses-001"); const ordreLibreAvant = D_.ordreLibre; D_.ordreLibre = false;
  const fiches = new Map();
  const s = creerSession({ contenu, fiches, mode: "silence", duree: 5, jour: "2026-11-11", genre: "m", aleatoire: aleatoireGraine(1) });
  egal(s.N, 3, "exemple 1 : N = 3");
  const nom = { "ru-cafe-001": "A", "ru-cafe-002": "B", "ru-cafe-003": "C", "ru-courses-001": "D", "ru-courses-002": "E" };
  const suite = [];
  let t = 0, carte;
  while ((carte = s.prochaineCarte(t))) {
    const libelle = nom[carte.id] + ":" + carte.type + (carte.remplacement !== null ? "(" + carte.remplacement + ")" : "");
    suite.push(carte.regle + " " + libelle);
    const noteé = carte.type !== "decouverte";
    if (noteé) s.repondre(carte, carte.index === 9 ? "echec" : "reussite");
    t += carte.est;
  }
// Table de la section 9 (version avec plafond de 7 cartes et bonus de nouveautés).
const attendu = [
  "B A:decouverte", "B B:decouverte(0)", "A A:sens", "A B:moule-sens(1)", "D A:theme", "D B:moule-theme(2)",
  "D A:theme", "B C:decouverte", "D B:moule-theme(3)", "A C:sens", "B D:decouverte", "D C:sens", "A D:sens",
  "D C:theme", "D D:theme", "D C:theme", "D D:ordre", "E C:sens", "E A:sens", "E B:moule-sens(4)", "E D:sens",
  "E C:theme", "E A:theme", "E B:moule-theme(5)", "E D:theme", "E A:sens", "E B:moule-sens(0)", "E D:ordre"
];
egal(suite.length, 28, "exemple 1 : 28 cartes");
  attendu.forEach((a, i) => egal(suite[i], a, "exemple 1, carte n°" + i));
  egal(t, 299, "exemple 1 : fin anticipée à t = 299 s");
  ["ru-cafe-001", "ru-cafe-002", "ru-cafe-003", "ru-courses-001"].forEach((id) => {
    egal([fiches.get(id).boite, fiches.get(id).echeance], [1, "2026-11-12"], "exemple 1 : " + id + " en boîte 1, demain");
  });
  const b = s.bilan();
  egal(b.decouverts.length, 4, "bilan : 4 découvertes (3 + 1 en bonus)");
  egal(Math.max(...[...s.etat.cartes.values()]), 7, "exemple 1 : au plus 7 cartes par élément");
  D_.ordreLibre = ordreLibreAvant;
}

// ---------- Exemple 2 : 15 min, Voiture, avec révisions dues ----------
{
  const J = "2026-11-11";
  const fiches = new Map();
  const poser = (id, boite, echeance) => fiches.set(id, Object.assign(ficheVide(id), { boite, echeance, premiereVue: "2026-11-01" }));
  ["ru-cafe-001", "ru-cafe-002", "ru-cafe-003"].forEach((id) => poser(id, 2, J));
  ["ru-courses-001", "ru-courses-002", "ru-courses-003"].forEach((id) => poser(id, 2, ajouterJours(J, 1)));
  ["ru-gouts-001", "ru-gouts-002", "ru-gouts-003"].forEach((id) => poser(id, 1, J));
  const s = creerSession({ contenu, fiches, mode: "voiture", duree: 15, jour: J, genre: "m", aleatoire: aleatoireGraine(2) });
  egal(s.dus, ["ru-gouts-001", "ru-gouts-002", "ru-gouts-003", "ru-cafe-001", "ru-cafe-002", "ru-cafe-003"], "exemple 2 : DUE trié");
  egal(s.N, 4, "exemple 2 : N = 4");
  const suite = [];
  let t = 4, carte; // l'annonce de début compte dans t
  while ((carte = s.prochaineCarte(t))) {
    suite.push(carte.regle + " " + carte.id.replace("ru-", "") + ":" + carte.type);
    s.repondre(carte, carte.type === "boucle-rappel" ? "passif" : "non-note");
    t += carte.est;
  }
  const attendu = [
    "C gouts-001:boucle-rappel", "B sortir-001:boucle-decouverte", "B sortir-002:boucle-decouverte",
    "A sortir-001:boucle-rappel", "A sortir-002:boucle-rappel", "C gouts-002:boucle-rappel",
    "A sortir-001:boucle-rappel", "A sortir-002:boucle-rappel", "B sortir-003:boucle-decouverte",
    "B rencontrer-001:boucle-decouverte", "A sortir-003:boucle-rappel", "A rencontrer-001:boucle-rappel",
    "C gouts-003:boucle-rappel", "A sortir-003:boucle-rappel", "A rencontrer-001:boucle-rappel",
    "C cafe-001:boucle-rappel", "C cafe-002:boucle-rappel", "C cafe-003:boucle-rappel",
    "E sortir-001:boucle-rappel"
  ];
  attendu.forEach((a, i) => egal(suite[i], a, "exemple 2, carte n°" + i));
  egal(suite.length, 53, "exemple 2 : 53 cycles");
  egal([fiches.get("ru-gouts-001").boite, fiches.get("ru-gouts-001").echeance], [2, "2026-11-13"], "exemple 2 : gouts-001 → boîte 2, J+2");
  egal([fiches.get("ru-cafe-001").boite, fiches.get("ru-cafe-001").echeance], [3, "2026-11-15"], "exemple 2 : cafe-001 → boîte 3, J+4");
  egal(fiches.get("ru-courses-001").boite, 2, "exemple 2 : courses-001 non dû, inchangé");
}

// ---------- Durée tenue à ±20 % (test indépendant du budget du moteur) ----------
// Le temps simulé avance avec SA PROPRE table de durées (recopiée de regles-session.md § 1),
// jamais avec carte.est. Profils : durées exactes, puis chaque carte tirée entre ×0,8 et ×1,2.
// Voiture : durée d’un cycle calculée à partir de la longueur des textes (parole à 13 car./s
// en russe, 15 car./s en français) et des silences de la boucle.
{
  const TABLE = {
    silence:   { decouverte: 15, decouverteMoule: 20, sens: 8,  theme: 10, ordre: 15, "moule-sens": 10, "moule-theme": 10 },
    ecouteurs: { decouverte: 18, decouverteMoule: 22, sens: 10, theme: 12, ordre: 16, ecoute: 10, "moule-sens": 12, "moule-theme": 12 },
    parler:    { decouverte: 20, decouverteMoule: 24, sens: 10, theme: 12, ordre: 16, ecoute: 10, "voix-haute": 12, "moule-sens": 12, "moule-theme": 12 }
  };
  const parole = (texte, cps, rate) => texte.length / (cps * rate);
  function dureeSimulee(mode, carte, facteur) {
    if (mode !== "voiture") {
      const cle = carte.type === "decouverte" && carte.element.moule ? "decouverteMoule" : carte.type;
      return TABLE[mode][cle] * facteur;
    }
    const fr = carte.texte.fr, ru = carte.texte.cible;
    if (carte.type === "boucle-decouverte") return parole(fr, 15, 1) + 1 + parole(ru, 13, 0.7) + 3 + 2 * parole(ru, 13, 1) + 3 + 2;
    return parole(fr, 15, 1) + (ru.length > 25 ? 6 : 5) + parole(ru, 13, 0.7) + 1 + parole(ru, 13, 1) + 3.5;
  }
  const etats = {
    vide: () => new Map(),
    milieu: () => new Map(contenu.elements.slice(0, 20).map((e, i) => [e.id, Object.assign(ficheVide(e.id), { boite: 1 + (i % 4), echeance: ajouterJours("2026-11-11", (i % 3) - 1), premiereVue: "2026-11-01" })])),
    acquis: () => new Map(contenu.elements.map((e) => [e.id, Object.assign(ficheVide(e.id), { boite: 6, echeance: "2026-12-01", premiereVue: "2026-09-01" })]))
  };
  let pire = 0, pireCas = "";
  for (const mode of ["silence", "ecouteurs", "parler", "voiture"]) {
    for (const duree of [2, 5, 15, 30]) {
      for (const nomEtat of Object.keys(etats)) {
        for (const profil of ["exact", "hasard"]) {
          for (let graine = 1; graine <= (profil === "exact" ? 1 : 10); graine++) {
            const s = creerSession({ contenu, fiches: etats[nomEtat](), mode, duree, jour: "2026-11-11", genre: "m", aleatoire: aleatoireGraine(graine) });
            const hasard = aleatoireGraine(1000 + graine);
            let t = mode === "voiture" ? 4 : 0, carte, n = 0;
            while ((carte = s.prochaineCarte(t))) {
              n++;
              const facteur = profil === "exact" ? 1 : 0.8 + 0.4 * hasard();
              let res = "non-note";
              if (carte.type === "boucle-rappel") res = "passif";
              else if (!["decouverte", "boucle-decouverte"].includes(carte.type)) res = hasard() < 0.8 ? "reussite" : "echec";
              s.repondre(carte, res);
              t += dureeSimulee(mode, carte, facteur);
              if (n > 2000) break;
            }
            if (mode === "voiture") t += 4; // annonce de fin
            const D = duree * 60, ecart = (t - D) / D;
            if (Math.abs(ecart) > pire) { pire = Math.abs(ecart); pireCas = mode + " " + duree + " min, " + nomEtat + ", " + profil + ", " + Math.round(t) + " s"; }
            verifier(Math.abs(ecart) <= 0.2, mode + " " + duree + " min, " + nomEtat + ", " + profil + " : t = " + Math.round(t) + " s (" + Math.round(ecart * 100) + " %)");
          }
        }
      }
    }
  }
  sortie("Durée : pire écart simulé " + (pire * 100).toFixed(1) + " % (" + pireCas + ")");
}

// ---------- Silence : aucun type sonore ----------
{
  // Les 12 premiers éléments sont déjà vus (échéance future) : rencontrer-001 « Я не понимаю. »
  // (rang 13, 3 mots, ordre non libre) est introduit et reçoit une carte Ordre.
  const fiches = new Map();
  contenu.elements.slice(0, 12).forEach((e) => fiches.set(e.id, Object.assign(ficheVide(e.id), { boite: 2, echeance: "2026-11-13", premiereVue: "2026-11-09" })));
  const s = creerSession({ contenu, fiches, mode: "silence", duree: 30, jour: "2026-11-11", genre: "m", aleatoire: aleatoireGraine(5) });
  let t = 0, carte; const types = new Set();
  while ((carte = s.prochaineCarte(t))) { types.add(carte.type); s.repondre(carte, "reussite"); t += carte.est; }
  verifier(!types.has("ecoute") && !types.has("voix-haute"), "Silence : ni Écoute ni À voix haute");
  verifier(types.has("ordre"), "Silence 30 min : au moins une carte Ordre");
  sortie("Types vus en Silence 30 min : " + [...types].join(", "));
}

// ---------- Couper le son ----------
{
  const fiches = new Map();
  const s = creerSession({ contenu, fiches, mode: "parler", duree: 15, jour: "2026-11-11", genre: "m", aleatoire: aleatoireGraine(7) });
  let t = 0, carte, n = 0; const apres = new Set();
  while ((carte = s.prochaineCarte(t))) {
    if (n === 5) s.couperSon();
    if (n > 5) apres.add(carte.type);
    s.repondre(carte, "reussite"); t += carte.est; n++;
  }
  verifier(!apres.has("ecoute") && !apres.has("voix-haute"), "après Couper le son : plus d'Écoute ni d'À voix haute");
}

// ---------- Thèmes choisis (mission 005) ----------
// Avec des thèmes, nouvelles phrases, révisions et remplissage viennent uniquement de ces thèmes ;
// les révisions dues ailleurs attendent, sans pénalité (leur fiche n'est pas touchée).
{
  const J = "2026-11-11";
  const choisis = ["cafe", "courses"];
  const jouerSession = (p, res) => {
    const s = creerSession(Object.assign({ contenu, jour: J, genre: "m", aleatoire: aleatoireGraine(21) }, p));
    const cartes = [];
    let t = p.mode === "voiture" ? 4 : 0, c;
    while ((c = s.prochaineCarte(t))) {
      cartes.push(c);
      s.repondre(c, c.type === "boucle-rappel" ? "passif" : (c.type.includes("decouverte") ? "non-note" : (res || "reussite")));
      t += c.est;
    }
    return { s, cartes };
  };
  const nonVides = (ids) => ids.length > 0;

  // 1. Deux thèmes depuis zéro : que des phrases de ces deux thèmes, dans tous les modes et toutes les durées.
  for (const mode of ["silence", "ecouteurs", "parler", "voiture"]) {
    for (const duree of [2, 5, 15, 30]) {
      const { s, cartes } = jouerSession({ fiches: new Map(), mode, duree, themes: choisis });
      verifier(cartes.length > 0, "thèmes " + mode + " " + duree + " min : la session a des cartes");
      verifier(cartes.every((c) => choisis.includes(c.element.situation)), "thèmes " + mode + " " + duree + " min : que cafe et courses");
      verifier(s.bilan().decouverts.every((id) => choisis.includes(contenu.parId.get(id).situation)), "thèmes " + mode + " " + duree + " min : découvertes dans les thèmes");
    }
  }

  // 2. Des révisions dues dans un autre thème attendent, sans pénalité, et ne passent pas devant.
  {
    const fiches = new Map();
    const poser = (id, boite, echeance) => fiches.set(id, Object.assign(ficheVide(id), { boite, echeance, premiereVue: "2026-11-01", nbReussites: 2 }));
    const ailleurs = contenu.elements.filter((e) => e.situation === "urgences" || e.situation === "metro").slice(0, 6).map((e) => e.id);
    ailleurs.forEach((id) => poser(id, 2, J));
    poser("ru-cafe-001", 2, J); // une due dans le thème choisi
    const avant = JSON.stringify(ailleurs.map((id) => fiches.get(id)));
    const { s, cartes } = jouerSession({ fiches, mode: "silence", duree: 15, themes: choisis }, "echec");
    egal(s.dus, ["ru-cafe-001"], "thèmes : seules les révisions dues des thèmes sont dues");
    verifier(cartes.some((c) => c.id === "ru-cafe-001"), "thèmes : la révision due du thème est jouée");
    verifier(cartes.every((c) => !ailleurs.includes(c.id)), "thèmes : aucune carte pour les révisions dues ailleurs");
    egal(JSON.stringify(ailleurs.map((id) => fiches.get(id))), avant, "thèmes : les dues ailleurs sont intactes (ni boîte, ni échéance, ni historique)");
    // Sans thème, les mêmes phrases dues reviennent bien en tête : l'attente ne les efface pas.
    const sans = creerSession({ contenu, fiches, mode: "silence", duree: 15, jour: J, genre: "m", aleatoire: aleatoireGraine(21) });
    verifier(ailleurs.every((id) => sans.dus.includes(id)), "thèmes : une fois « Au hasard », les dues mises de côté sont de nouveau dues");
  }

  // 3. « Au hasard » = comportement d'origine : liste vide, absente, tous les thèmes, ou identifiants inconnus.
  {
    const suite = (themes) => jouerSession({ fiches: new Map(), mode: "ecouteurs", duree: 15, themes }).cartes.map((c) => c.regle + c.id + c.type);
    const reference = suite(undefined);
    egal(suite([]), reference, "Au hasard : liste vide = comportement d'origine");
    egal(suite(["inconnu"]), reference, "Au hasard : thème inconnu ignoré");
    egal(suite(index.situations.map((x) => x.id)), reference, "Au hasard : tous les thèmes cochés = comportement d'origine");
  }

  // 4. Un thème déjà vu et rien de dû : le remplissage reste dans le thème, la session ne plante pas et se termine.
  {
    const fiches = new Map();
    contenu.elements.filter((e) => e.situation === "presenter" || e.situation === "cafe").forEach((e) => fiches.set(e.id, Object.assign(ficheVide(e.id), { boite: 3, echeance: "2026-12-01", premiereVue: "2026-11-01" })));
    const { cartes } = jouerSession({ fiches, mode: "silence", duree: 5, themes: ["cafe"] });
    verifier(cartes.length > 0 && cartes.every((c) => c.element.situation === "cafe"), "thème tout vu : remplissage dans le thème seulement");
  }

  // 5. Les choix du QCM peuvent venir d'autres thèmes (un thème de 3 phrases doit pouvoir poser 3 options).
  {
    const { cartes } = jouerSession({ fiches: new Map(), mode: "silence", duree: 30, themes: ["urgences"] });
    verifier(cartes.filter((c) => c.options).every((c) => c.options.length === 3), "thème seul : QCM toujours à 3 options");
  }

  // 6. « Tu sais dire N phrases » compte tout le contenu, pas seulement les thèmes de la session.
  {
    const fiches = new Map();
    const ailleurs = contenu.elements.find((e) => e.situation === "metro");
    fiches.set(ailleurs.id, Object.assign(ficheVide(ailleurs.id), { boite: 5, echeance: "2026-12-01", premiereVue: "2026-11-01" }));
    const { s } = jouerSession({ fiches, mode: "silence", duree: 2, themes: ["cafe"] });
    egal(s.bilan().totalAcquis, 1, "bilan : les phrases acquises hors thèmes comptent dans le total");
    verifier(nonVides(s.bilan().decouverts), "bilan : au moins une découverte dans le thème");
  }
}

// ---------- Parcours d'accueil : préremplissage, cases des thèmes, dernier choix ----------
{
  const sit = index.situations;
  egal(["silence", "ecouteurs", "parler", "voiture"].map((l) => dureePourLieu(l, null)), [2, 5, 15, 30], "durée préremplie par lieu");
  egal(dureePourLieu("ecouteurs", { ecouteurs: 15 }), 15, "mémoire par lieu : la dernière durée de ce lieu");
  egal(dureePourLieu("voiture", { ecouteurs: 15 }), 30, "mémoire par lieu : un autre lieu n'est pas touché");
  egal(dureePourLieu("silence", { silence: 7 }), 2, "mémoire par lieu : durée inconnue ignorée");
  egal(basculerTheme([], "cafe", sit), ["cafe"], "cocher un thème décoche « Au hasard »");
  egal(basculerTheme(["cafe"], "metro", sit), ["cafe", "metro"], "cocher un deuxième thème (ordre du contenu)");
  egal(basculerTheme(["cafe"], "cafe", sit), [], "tout décocher remet « Au hasard »");
  egal(basculerTheme(["metro"], "cafe", sit), ["cafe", "metro"], "l'ordre suit le contenu, pas les touchers");
  egal(themesValides(["cafe", "cafe", "inconnu"], sit), ["cafe"], "thèmes inconnus et doublons retirés");
  egal(themesValides(undefined, sit), [], "pas de thèmes mémorisés = « Au hasard »");
  egal(dernierChoix({}, sit), null, "premier lancement : pas de « Comme la dernière fois »");
  egal(dernierChoix({ dernierMode: "voiture", dernierDuree: 30, derniersThemes: ["cafe", "x"] }, sit), { lieu: "voiture", duree: 30, themes: ["cafe"] }, "dernier choix relu");
  egal(dernierChoix({ dernierMode: "voiture", dernierDuree: 8 }, sit), null, "dernier choix illisible = pas de bouton");
}

// ---------- Ambiance (content/ru/ambiance.json) ----------
{
  const amb = await lireJson("content/ru/ambiance.json");
  const v = controlerAmbiance(amb);
  verifier(v.ok, "ambiance.json passe le contrôle d'entrée (contrastes de bagou-ru.md 1.2) " + v.raisons.join(" ; "));
  const abime = JSON.parse(JSON.stringify(amb)); abime.couleurs.clair["--text-muted"] = "#CCCCCC";
  verifier(!controlerAmbiance(abime).ok, "un contraste insuffisant refuse l'ambiance");
  const incomplet = JSON.parse(JSON.stringify(amb)); delete incomplet.couleurs.sombre["--laque"];
  verifier(!controlerAmbiance(incomplet).ok, "un jeton manquant refuse l'ambiance");
  verifier(!controlerAmbiance(null).ok, "pas de fichier lisible : refusé");
  const css = construireCss(amb);
  verifier(css.includes("--laque:#B3261E") && css.includes("prefers-color-scheme: dark") && css.includes("body.theme-voiture"), "CSS d'ambiance : clair, sombre et Voiture");
  for (const f of ["bulbes", "samovar", "rameau", "croix", "panier", "pont", "tasses", "lustres", "bouleau", "pelmeni", "poupee-acquise"]) {
    const svg = typeof readFile === "function" ? readFile("content/ru/ambiance/" + f + ".svg") : (await (await import("node:fs/promises")).readFile(new URL("content/ru/ambiance/" + f + ".svg", racine), "utf8"));
    verifier(!/#[0-9a-fA-F]{3,6}\b/.test(svg) && svg.length < 3072, "SVG " + f + " : aucune couleur en dur, moins de 3 Ko");
  }
}

// ---------- QCM : 3 options distinctes, une seule juste ----------
{
  const fiches = new Map();
  const s = creerSession({ contenu, fiches, mode: "silence", duree: 30, jour: "2026-11-11", genre: "m", aleatoire: aleatoireGraine(11) });
  let t = 0, carte, ok = true;
  while ((carte = s.prochaineCarte(t))) {
    if (carte.options) {
      const justes = carte.options.filter((o) => o.juste).length;
      const frs = new Set(carte.options.map((o) => o.texte.fr));
      if (carte.options.length !== 3 || justes !== 1 || frs.size !== 3) { ok = false; sortie("QCM invalide : " + carte.id + " " + carte.type); }
    }
    if (carte.ordre && carte.ordre.tuiles.map((x) => x.texte).join(" ") === carte.ordre.reference.join(" ")) ok = false;
    s.repondre(carte, "reussite"); t += carte.est;
  }
  verifier(ok, "QCM et Ordre bien formés");
}

// ---------- Voiture quand onend ne vient jamais (QA n° 5 et n° 7) ----------
// Chaque lecture dure alors tout le minuteur de secours d’audio.js (constantes AUDIO), et l’écran
// Voiture corrige l’estimation par la durée mesurée des cycles (ajusterEstimations), comme ici.
{
  const secours = (texte, rate) => (Math.max(AUDIO.secoursMsMinimum, texte.length * AUDIO.secoursMsParCaractere / rate) + AUDIO.secoursMsMarge) / 1000;
  const V = REGLES.voiture;
  function cycle(c) {
    const fr = c.texte.fr, ru = c.texte.cible;
    if (c.type === "boucle-decouverte") return secours(fr, 1) + V.decouverte.apresFr + secours(ru, 0.7) + V.decouverte.apresLent + 2 * secours(ru, 1) + V.decouverte.apresNormal1 + V.decouverte.apresNormal2;
    return secours(fr, 1) + (ru.length > V.rappel.seuilLong ? V.rappel.reponseLongue : V.rappel.reponse) + secours(ru, 0.7) + V.rappel.entreLentEtNormal + secours(ru, 1) + V.rappel.apresNormal;
  }
  const etatsV = {
    vide: () => new Map(),
    tousDus: () => new Map(contenu.elements.map((e, i) => [e.id, Object.assign(ficheVide(e.id), { boite: 1 + (i % 6), echeance: ajouterJours("2026-11-11", -1 - (i % 5)), premiereVue: "2026-10-01" })]))
  };
  let pire = 0;
  const reserves = [];
  for (const duree of [2, 5, 15, 30]) for (const nom of Object.keys(etatsV)) {
    const s = creerSession({ contenu, fiches: etatsV[nom](), mode: "voiture", duree, jour: "2026-11-11", genre: "m", aleatoire: aleatoireGraine(3) });
    let t = secours("C’est parti. Je te dis une phrase en français, à toi de la dire en russe.", 1), c, reel = 0, estime = 0;
    while ((c = s.prochaineCarte(t))) {
      const d = cycle(c); t += d; reel += d; estime += c.est;
      s.ajusterEstimations(reel / estime);
      s.repondre(c, c.type === "boucle-rappel" ? "passif" : "non-note");
    }
    t += secours("C’est fini pour aujourd’hui. 2 phrases travaillées. Bonne route.", 1);
    const ecart = (t - duree * 60) / (duree * 60);
    pire = Math.max(pire, Math.abs(ecart));
    const message = "Voiture " + duree + " min " + nom + ", onend jamais : " + Math.round(ecart * 100) + " %";
    // RÉSERVE CONNUE (décision de Sacha, QA lot 2 n° 1) : Voiture 2 min, tout dû, onend jamais, dépasse 20 %
    // car les phrases du contenu sont plus longues. Le moteur ne change pas ici : la mission « audio pré-généré »
    // donnera des durées exactes et supprimera l'estimation. Avertissement, pas échec.
    if (duree === 2 && nom === "tousDus" && Math.abs(ecart) > 0.2) { reserves.push(message); sortie("AVERTISSEMENT (réserve connue, audio pré-généré) : " + message); }
    else verifier(Math.abs(ecart) <= 0.2, message);
  }
  sortie("Voiture, onend jamais : pire écart " + (pire * 100).toFixed(1) + " %");
}

// ---------- Fiches corrompues : réparées, jamais de plantage (QA n° 3) ----------
{
  const corrompues = [
    { id: "ru-cafe-002", boite: 2, echeance: "2000-01-01", historique: "abc" }, // cas exact de la QA
    { id: "ru-cafe-001", boite: "trois" },
    { id: "ru-cafe-003", boite: 99, echeance: 12345 },
    { id: "ru-courses-001", boite: 2, echeance: "2026-02-31", historique: null },
    { id: "ru-courses-002", boite: 3, echeance: "2026-11-01", dernierRemplacement: 42 },
    { id: "ru-gouts-001", boite: 1, nbReussites: -4, dernierRemplacement: "2" }
  ];
  const repares = corrompues.map(validerFiche);
  egal(repares[0].historique, [], "historique non-liste remis à []");
  egal(repares[1].boite, 0, "boîte illisible : fiche remise à zéro");
  egal(repares[2].boite, 0, "boîte hors bornes : fiche remise à zéro");
  egal(repares[3].echeance, "2000-01-01", "date impossible : élément rendu dû");
  egal(validerFiche({ boite: 2 }), null, "objet sans id ignoré");
  for (const mode of ["silence", "voiture"]) {
    const fiches = new Map(corrompues.map((f) => [f.id, Object.assign({}, f)]));
    let ok = true;
    try {
      const s2 = creerSession({ contenu, fiches, mode, duree: 5, jour: "2026-11-11", genre: "m", aleatoire: aleatoireGraine(4) });
      let t = 0, c;
      while ((c = s2.prochaineCarte(t))) { s2.repondre(c, c.type === "boucle-rappel" ? "passif" : c.type.includes("decouverte") ? "non-note" : "echec"); t += c.est; }
      s2.bilan();
    } catch (e) { ok = false; sortie("exception : " + e); }
    verifier(ok, "session " + mode + " avec fiches corrompues sans plantage");
  }
}

// ---------- Mission 007 : le personnage ----------
const donneesPerso = await lireJson("content/ru/personnage.json");
const contenuP = preparerContenu(index, fichiers, donneesPerso);
const ruPrenom = (latin) => convertirPrenom(latin, donneesPerso.prenoms);
{
  // Prénom : les 25 cas de Nadia (dictionnaire puis règles), et les règles seules hors dictionnaire.
  const casTests = donneesPerso.prenoms.regles.cas_tests;
  egal(Object.keys(casTests).length, 25, "25 cas de test de conversion");
  const sansSignes = (x) => x.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const dico = new Set(donneesPerso.prenoms.dictionnaire.map((e) => sansSignes(e.latin)));
  Object.entries(casTests).forEach(([latin, cible]) => {
    egal(ruPrenom(latin).cible, cible, "prénom " + latin);
    if (!dico.has(sansSignes(latin)) && !latin.includes("-")) egal(convertirParRegles(latin, donneesPerso.prenoms.regles), cible.toLowerCase(), "règles seules : " + latin);
  });
  egal(ruPrenom("julien").accent, "Жюлье́н", "dictionnaire : accent tonique, sans majuscule ni accent");
  egal(ruPrenom("Jean-Vincent").cible, "Жан-Венсан", "prénom composé, partie par partie");
  egal(ruPrenom("Ñandú"), null, "lettre inconnue : on garde le latin");
  egal(ruPrenom("   "), null, "prénom vide");
  // Les règles de Nadia lisent aussi les prénoms du dictionnaire sans se contredire (hors exceptions déclarées).
  const ecarts = donneesPerso.prenoms.dictionnaire.filter((e) => convertirParRegles(e.latin, donneesPerso.prenoms.regles) !== e.cible.toLowerCase()).map((e) => e.latin);
  verifier(ecarts.length <= 12, "dictionnaire : " + ecarts.length + " prénoms où les règles seules diffèrent (" + ecarts.join(", ") + ")");

  // Validation du personnage.
  const v = validerPersonnage({ prenom: " " + "x".repeat(30), prenomRu: { cible: "<b>" }, couleurs: "rouge", motif: "x", metier: 7, vus: { a: true, b: 1 } });
  egal([v.prenom.length, v.prenomRu, v.couleurs, v.motif, v.metier, v.vus], [20, null, "cobalt-or", "fleur", null, { a: true }], "personnage abîmé réparé");
  egal(validerPersonnage("n'importe quoi").prenom, "", "personnage illisible = personnage vide");
}
{
  // Les phrases du personnage entrent dans leur situation ; sans le fichier, rien ne change.
  const ids = contenuP.situations.find((x) => x.id === "rencontrer").ids;
  egal(ids[ids.indexOf("ru-rencontrer-004") + 1], "ru-rencontrer-010", "« Je m'appelle ___ » juste après rencontrer-004");
  egal(contenuP.elements.length, totalPhrases + donneesPerso.phrases.length, "3 phrases du personnage en plus");
  egal(contenu.elements.length, totalPhrases, "contenu de base inchangé sans personnage.json");

  const sans = personnaliser(contenuP, null);
  verifier(!sans.parId.has("ru-presenter-011"), "pas de carte de visite sans métier");
  verifier(sans.parId.get("ru-rencontrer-010").sansPrenom === true, "sans prénom : phrase d'exemple + « ton prénom ici »");
  egal(reglageManquant(sans.parId.get("ru-rencontrer-010"), donneesPerso, validerPersonnage(null)), "prenom", "encart prénom");
  egal(reglageManquant(sans.parId.get("ru-presenter-001"), donneesPerso, validerPersonnage(null)), "metier", "encart métier sur « Je suis ___ »");
  egal(reglageManquant(sans.parId.get("ru-presenter-003"), donneesPerso, validerPersonnage(null)), null, "pas d'encart sur « Je travaille dans ___ » (domaine déduit du métier)");
}
{
  const perso = { prenom: "Max", prenomRu: ruPrenom("Max"), metier: "infirmier" };
  const c = personnaliser(contenuP, perso);
  const el10 = c.parId.get("ru-rencontrer-010");
  const t10 = texteElement(el10, {});
  egal([t10.fr, t10.cible, t10.accent, t10.translit], ["Je m'appelle Max.", "Меня зовут Макс.", "Меня́ зову́т Макс.", "miniá zavoút Max"], "prénom dans la phrase (cyrillique dans la cible)");
  egal(texteElement(c.parId.get("ru-presenter-011"), { genre: "f" }).fr, "Je m'appelle Max, je suis infirmière.", "carte de visite au féminin");
  egal(texteElement(c.parId.get("ru-presenter-011"), { genre: "f" }).cible, "Меня зовут Макс, я медсестра.", "carte de visite : russe féminin");
  egal(texteElement(c.parId.get("ru-presenter-011"), { genre: "m" }).cible, "Меня зовут Макс, я медбрат.", "carte de visite : russe masculin");
  const moule = c.parId.get("ru-presenter-001");
  egal([moule.moule.personnel, moule.moule.remplacements.length, moule.moule.remplacements[0].cle], [true, 6, "metier:infirmier"], "moule : le métier du personnage en tête");
  egal(texteElement(moule, { genre: "f", remplacement: 0 }).fr + " | " + texteElement(moule, { genre: "m", remplacement: 0 }).fr, "Je suis infirmière. | Je suis infirmier.", "le français s'accorde au genre (métier)");
  egal(texteElement(c.parId.get("ru-presenter-003"), { remplacement: 0 }).fr, "Je travaille dans la santé.", "le métier donne le domaine");
  // Métier déjà dans le moule : pas de doublon.
  const ing = personnaliser(contenuP, { metier: "ingenieur" }).parId.get("ru-presenter-001");
  egal([ing.moule.remplacements.length, texteElement(ing, { genre: "f" }).fr], [5, "Je suis ingénieure."], "ingénieur : pas de doublon, accord au féminin");
  // Prénom gardé en latin : affiché, jamais lu.
  const latin = personnaliser(contenuP, { prenom: "Zoë" }).parId.get("ru-rencontrer-010");
  egal([texteElement(latin, {}).cible, aLire(texteElement(latin, {}).cible)], ["Меня зовут Zoë.", "Меня зовут."], "prénom latin : affiché, pas lu");
  // Genre : les deux formes quand il n'est pas réglé, même si le russe ne change pas.
  const s008 = texteElement(contenuP.parId.get("ru-sortir-008"), {});
  egal([s008.fr, s008.autre && s008.autre.fr, s008.autre && s008.autre.cible === s008.cible], ["Désolé, je ne peux pas.", "Désolée, je ne peux pas.", true], "variantes_fr : français seul");
  egal(texteElement(contenuP.parId.get("ru-metro-002"), { genre: "f" }).cible, "Я заблудилась.", "variantes russes inchangées");
  egal(texteElement(contenuP.parId.get("ru-cafe-001"), {}).autre, null, "phrase sans genre : pas d'autre forme");
  egal(texteElement(contenuP.parId.get("ru-rencontrer-005"), { genre: "f" }).fr, "Enchantée.", "Enchantée au féminin");
}
{
  // Carte de visite : le bon métier, accordé, en français et en russe (5 métiers dont la forme m = f).
  const liste = donneesPerso.metiers;
  ["ingenieur", "medecin", "comptable", "manager", "a-mon-compte", "retraite", "infirmier"].forEach((id) => {
    const c = personnaliser(contenuP, { prenom: "Max", prenomRu: ruPrenom("Max"), metier: id });
    const el = c.parId.get("ru-presenter-011");
    const m = liste.find((x) => x.id === id);
    ["m", "f"].forEach((g) => {
      const t = texteElement(el, { genre: g });
      const attendu = m[g].carte_fr.replace("{prenom}", "Max");
      egal([t.fr, t.cible], [attendu, m[g].carte_cible.replace("{prenom}", "Макс")], "carte de visite " + id + " (" + g + ")");
    });
  });
  // « Même phrase, autre mot » : les options suivent le genre du personnage.
  const el = personnaliser(contenuP, { metier: "infirmier" }).parId.get("ru-presenter-001");
  const ctx = (genre) => ({ genre, aleatoire: aleatoireGraine(1), fiche: () => null, elements: [] });
  ["m", "f"].forEach((g) => {
    const attendu = el.moule.remplacements.map((_, i) => texteElement(el, { genre: g, remplacement: i }));
    const opts = optionsMoule(el, 0, ctx(g));
    opts.forEach((o) => verifier(attendu.some((a) => a.fr === o.texte.fr && a.cible === o.texte.cible), "option accordée (" + g + ") : " + o.texte.fr));
  });
  const fem = optionsMoule(el, 0, ctx("f")).map((o) => o.texte.fr + " / " + o.texte.cible);
  verifier(fem.some((x) => x === "Je suis infirmière. / Я медсестра."), "féminin : « Je suis infirmière. / Я медсестра. »");
  verifier(!fem.some((x) => /infirmier\.|ingénieur\.|медбрат/.test(x)), "féminin : aucune forme masculine");
  // Genre jamais répondu : le moteur passe au masculin sans le redemander (l'écran reposera la question à la prochaine carte Découverte à deux formes).
  const sg = creerSession({ contenu: contenuP, fiches: new Map(), mode: "silence", duree: 5, jour: "2026-11-11", themes: ["presenter"], aleatoire: aleatoireGraine(3) });
  let carte, vu = false;
  while ((carte = sg.prochaineCarte(0))) if (carte.id === "ru-presenter-001") { egal(carte.texte.fr.includes("infirmière"), false, "sans genre : masculin"); vu = true; break; }
  verifier(vu, "la carte « Je suis ___ » est jouée sans genre");
}
{
  // Tirage du mot du personnage dans le moule « Je suis ___ ».
  const c = personnaliser(contenuP, { prenom: "Max", prenomRu: ruPrenom("Max"), metier: "infirmier" });
  const J = "2026-11-11";
  const jouer = (fiches, persoVus, opts) => {
    const vus = [], cartes = [], ecrites = [];
    const s = creerSession(Object.assign({ contenu: c, fiches, mode: "silence", duree: 30, jour: J, genre: "f", themes: ["presenter"], aleatoire: aleatoireGraine(3),
      persoVus, persoVu: (cle) => vus.push(cle), ecrire: (f) => ecrites.push(f.id) }, opts));
    let t = 0, carte;
    while ((carte = s.prochaineCarte(t))) {
      cartes.push(carte);
      s.repondre(carte, carte.type.includes("decouverte") ? "non-note" : "reussite");
      t += carte.est;
    }
    return { s, vus, cartes, ecrites };
  };
  // Nouveau moule : Découverte avec son mot, puis une carte sur deux.
  const a = jouer(new Map(), {});
  const mots = a.cartes.filter((k) => k.id === "ru-presenter-001").map((k) => [k.type, k.remplacement]);
  egal(mots[0], ["decouverte", 0], "découverte avec le métier du personnage");
  verifier(mots.length >= 5 && mots.every(([, r], i) => (i % 2 === 0 ? r === 0 : r > 0)), "le métier du personnage une carte sur deux : " + JSON.stringify(mots));
  egal(a.vus.filter((k) => k === "metier:infirmier").length, 1, "mot du personnage marqué comme vu une fois");
  // Moule déjà appris, nouveau métier : Découverte non notée d'abord, boîte intacte, une seule fois par session.
  const dejaVu = (id) => Object.assign(ficheVide(id), { boite: 3, echeance: "2026-11-20", premiereVue: "2026-11-01" });
  const fiches = new Map([["ru-presenter-001", dejaVu("ru-presenter-001")], ["ru-presenter-003", dejaVu("ru-presenter-003")]]);
  const b = jouer(fiches, {}, { duree: 5 });
  egal([b.cartes[0].regle, b.cartes[0].type, b.cartes[0].id, b.cartes[0].remplacement], ["P", "decouverte", "ru-presenter-001", 0], "nouveau métier : Découverte d'abord");
  egal(b.cartes.filter((k) => k.regle === "P").length, 1, "une seule Découverte du personnage par session");
  egal([fiches.get("ru-presenter-001").boite, fiches.get("ru-presenter-001").echeance], [3, "2026-11-20"], "Découverte non notée : boîte et échéance intactes");
  verifier(b.cartes.filter((k) => k.id === "ru-presenter-001").every((k, i) => i > 0 || k.type === "decouverte"), "la 1re carte du moule est non notée");
  const dejaMontre = jouer(new Map([["ru-presenter-001", dejaVu("ru-presenter-001")]]), { "metier:infirmier": true }, { duree: 5 });
  verifier(dejaMontre.cartes.every((k) => k.regle !== "P"), "mot déjà montré : pas de nouvelle Découverte");
  const sansPerso = creerSession({ contenu: contenuP, fiches: new Map([["ru-presenter-001", dejaVu("ru-presenter-001")]]), mode: "silence", duree: 5, jour: J, genre: "f", themes: ["presenter"], aleatoire: aleatoireGraine(3) });
  verifier(sansPerso.prochaineCarte(0).regle !== "P", "sans métier : jamais de Découverte du personnage");
  // Un changement de genre ne rend rien « dû » et n'écrit aucune fiche.
  const f2 = new Map([["ru-metro-002", dejaVu("ru-metro-002")]]);
  const avant = JSON.stringify([...f2]);
  const sg = creerSession({ contenu: c, fiches: f2, mode: "silence", duree: 5, jour: J, genre: "m", themes: ["metro"], aleatoire: aleatoireGraine(3) });
  const dusAvant = sg.dus.length; sg.definirGenre("f");
  egal([sg.dus.length, JSON.stringify([...f2])], [dusAvant, avant], "changer de genre : aucune phrase due, aucune fiche modifiée");
}

// ---------- Dialogues à choix (mission 008) ----------
{
  const brutD = await lireJson("content/ru/dialogues.json");
  const J = "2026-11-11";
  const contenuD = preparerContenu(index, fichiers, donneesPerso, brutD);
  const dialogues = brutD.dialogues;
  const perso = (o) => validerPersonnage(Object.assign({ prenom: "Maxime", prenomRu: ruPrenom("Maxime") }, o));
  const metier = (id) => donneesPerso.metiers.find((m) => m.id === id);

  // Contenu : 43 métiers rangés dans les 9 catégories ; chaque réplique juste pointe vers un élément Leitner qui existe.
  egal(donneesPerso.metiers.length, 43, "43 métiers");
  egal(donneesPerso.categories.length, 9, "9 catégories");
  verifier(donneesPerso.metiers.every((m) => donneesPerso.categories.some((c) => c.id === m.categorie)), "chaque métier est dans une catégorie connue");
  verifier(donneesPerso.categories.every((c) => donneesPerso.metiers.some((m) => m.categorie === c.id)), "aucune catégorie vide");
  const nouvelles = phrasesNouvelles(brutD);
  egal(nouvelles.map((p) => p.id).sort(), ["ru-dialogue-cafe-001", "ru-dialogue-hotel-001", "ru-dialogue-hotel-002", "ru-dialogue-soiree-001"], "4 nouvelles répliques");
  egal(contenuD.elements.length, contenuP.elements.length + nouvelles.length, "les nouvelles répliques s'ajoutent aux éléments");
  verifier(nouvelles.every((p) => contenuD.parId.get(p.id).situation === p.situation), "chaque nouvelle réplique est rangée dans sa situation");
  egal(contenuD.parId.get("ru-dialogue-cafe-001").cible === contenuD.parId.get("ru-courses-007").cible, false, "ru-dialogue-cafe-001 distinct de ru-courses-007");
  dialogues.forEach((d) => d.echanges.forEach((e) => {
    verifier(e.reponses.length >= 2 && e.reponses.length <= 3, d.id + "/" + e.id + " : 2 ou 3 réponses");
    const bonne = e.reponses.find((r) => r.id === e.si_faux);
    verifier(bonne && bonne.juste, d.id + "/" + e.id + " : si_faux est une réponse juste");
    e.reponses.filter((r) => r.juste).forEach((r) => {
      verifier(contenuD.parId.has(r.element), d.id + "/" + e.id + "/" + r.id + " : élément Leitner « " + r.element + " » existe");
      verifier(r.suite === null || d.echanges.some((x) => x.id === r.suite), d.id + "/" + e.id + "/" + r.id + " : suite valide");
    });
  }));

  // Quels dialogues le personnage permet-il ? Sans métier, ceux qui l'exigent sont absents.
  const noms = (p, d) => dialoguesProposables(dialogues, p, donneesPerso).map((x) => x.id);
  egal(noms(perso({})), ["ru-dialogue-cafe", "ru-dialogue-hotel"], "sans métier : café et hôtel");
  egal(noms(perso({ metier: "infirmier" })).length, 4, "avec un métier : les 4 dialogues");
  egal(noms(perso({ metier: "inconnu" })).length, 2, "métier inconnu : comme sans métier");
  egal(dialoguesProposables([{ id: "x" }, { id: "y", echanges: [] }, null], perso({}), donneesPerso), [], "dialogue abîmé : ignoré sans erreur");
  egal(dialoguesProposables(undefined, perso({}), donneesPerso), [], "pas de contenu : aucun dialogue");

  // Un échange : 2 à 3 réponses, la bonne est toujours là, le mélange ne perd rien.
  const voisin = dialogues.find((d) => d.id === "ru-dialogue-voisin");
  const ech = (d, id, p, genre, extra) => echangeResolu(d, id, Object.assign({ perso: p, donnees: donneesPerso, genre, aleatoire: aleatoireGraine(4) }, extra));
  dialogues.forEach((d) => d.echanges.forEach((e) => {
    const r = ech(d, e.id, perso({ metier: "infirmier" }), "f");
    verifier(r.reponses.length >= 2 && r.reponses.length <= 3 && r.reponses.includes(r.bonne), d.id + "/" + e.id + " : réponses et bonne réponse présentes");
    egal(r.reponses.map((x) => x.id).sort(), e.reponses.map((x) => x.id).sort(), d.id + "/" + e.id + " : aucune réponse perdue");
  }));
  egal(ech(voisin, "e9", perso({}), "m"), null, "échange inconnu : null");

  // Jetons {metier} : forme du genre, ou variante sans métier (statut, pas de métier).
  const infirmier = metier("infirmier");
  ["m", "f"].forEach((g) => {
    const e4 = ech(voisin, "e4", perso({ metier: "infirmier" }), g);
    egal([e4.partenaire.fr, e4.partenaire.cible],
      ["Ah, vous êtes " + infirmier[g].fr + " ! Bienvenue dans le quartier.", "Ах, вы " + infirmier[g].cible + "! Добро пожаловать в наш район!"], "{metier} du partenaire (" + g + ")");
    verifier(!/\{metier\}/.test(JSON.stringify(e4.partenaire)), "aucun jeton oublié (" + g + ")");
    const rep = ech(voisin, "e3", perso({ metier: "infirmier" }), g).reponses.find((r) => r.id === "a");
    egal([rep.texte.fr, rep.texte.cible, rep.element], [infirmier[g].phrase_fr, infirmier[g].phrase_cible, infirmier.element], "réponse « Je suis {métier} » (" + g + ")");
  });
  const sans = brutD.dialogues[1].echanges[3].partenaire.sans_metier;
  egal(ech(voisin, "e4", perso({ metier: "etudiant" }), "f").partenaire.fr, sans.fr, "statut : variante sans métier");
  egal(ech(voisin, "e4", perso({}), "m").partenaire.cible, sans.cible, "pas de métier : variante sans métier");
  egal(ech(voisin, "e3", perso({ metier: "retraite" }), "m").reponses.find((r) => r.id === "a").element, "ru-presenter-010", "statut : l'élément du statut");

  // Jeton {prenom} : prénom en cyrillique dans le russe, latin dans le français ; sans prénom, l'exemple et un drapeau.
  const p1 = ech(voisin, "e2", perso({ metier: "infirmier" }), "m").reponses.find((r) => r.id === "a");
  egal([p1.texte.fr, p1.sansPrenom, p1.texte.cible.includes(ruPrenom("Maxime").cible)], ["Je m'appelle Maxime.", false, true], "réponse avec le prénom");
  const p0 = ech(voisin, "e2", validerPersonnage({ metier: "infirmier" }), "m").reponses.find((r) => r.id === "a");
  egal([p0.texte.fr, p0.sansPrenom], ["Je m'appelle " + donneesPerso.prenoms.exemple.latin + ".", true], "sans prénom : exemple et sansPrenom");
  const soiree = dialogues.find((d) => d.id === "ru-dialogue-soiree");
  egal(ech(soiree, "e1", perso({ metier: "infirmier" }), "m").reponses.find((r) => r.id === "a").texte.fr, "Moi, c'est Maxime. Et toi ?", "prénom dans « Moi, c'est ___ »");

  // Accord de genre en français (variantes_fr) et en russe (variantes).
  const e1 = (g) => ech(voisin, "e1", perso({}), g).reponses.find((r) => r.id === "a").texte.fr;
  egal([e1("m"), e1("f")], ["Enchanté.", "Enchantée."], "français accordé au genre");
  const hotel = dialogues.find((d) => d.id === "ru-dialogue-hotel");
  const etu = (g) => ech(hotel, "e2", perso({}), g).reponses.find((r) => r.id === "c").texte;
  egal([etu("m").cible, etu("f").cible, etu("f").fr], ["Я студент.", "Я студентка.", "Je suis étudiante."], "russe et français accordés au genre");
  egal(ech(hotel, "e2", perso({}), undefined).reponses.find((r) => r.id === "c").texte.cible, "Я студент.", "genre inconnu : masculin par défaut");

  // Réaction du partenaire : dans la même bulle, avant sa réplique.
  const cafe = dialogues.find((d) => d.id === "ru-dialogue-cafe");
  const reaction = cafe.echanges[1].reponses[0].reaction;
  const avecReaction = ech(cafe, "e3", perso({}), "m", { reaction });
  egal([avecReaction.partenaire.fr, avecReaction.partenaire.cible.startsWith(reaction.cible + " ")], [reaction.fr + " " + cafe.echanges[2].partenaire.fr, true], "réaction avant la réplique");

  // Une fausse réponse mène à la branche de la bonne.
  const e2 = ech(cafe, "e2", perso({}), "m");
  const fausse = e2.reponses.find((r) => !r.juste);
  egal(reponseRetenue(e2, fausse), e2.bonne, "fausse réponse : on suit la bonne");
  egal(reponseRetenue(e2, e2.reponses.find((r) => r.id === "b")).id, "b", "autre réponse juste : on la suit");

  // Moteur : une carte Dialogue au plus, après 10 éléments, jamais en Voiture ni en 2 et 5 min, dans une situation travaillée.
  const possibles = (p) => dialoguesProposables(contenuD.dialogues, perso(p), donneesPerso);
  const jouerD = (mode, duree, extra, fiches) => {
    const s = creerSession(Object.assign({ contenu: contenuD, fiches: fiches || new Map(), mode, duree, jour: J, genre: "m", aleatoire: aleatoireGraine(9), dialogues: possibles({ metier: "infirmier" }) }, extra));
    const cartes = [];
    let t = mode === "voiture" ? 4 : 0, c;
    while ((c = s.prochaineCarte(t))) {
      cartes.push(c);
      if (c.type !== "dialogue") s.repondre(c, c.type === "boucle-rappel" ? "passif" : (c.type.includes("decouverte") ? "non-note" : "reussite"));
      t += c.est;
    }
    return { s, cartes, t };
  };
  for (const mode of ["silence", "ecouteurs", "parler"]) {
    const { s, cartes, t } = jouerD(mode, 15);
    const k = cartes.findIndex((c) => c.type === "dialogue");
    egal(cartes.filter((c) => c.type === "dialogue").length, 1, mode + " 15 min : une seule carte Dialogue");
    verifier(k >= DIALOGUE.apresCartes, mode + " : le dialogue vient après au moins " + DIALOGUE.apresCartes + " cartes");
    verifier(cartes.slice(0, k).some((c) => c.element.situation === cartes[k].dialogue.situation), mode + " : dialogue d'une situation travaillée");
    egal(cartes[k].est, DIALOGUE.estimation[mode], mode + " : durée estimée du dialogue");
    verifier(t <= 900 * 1.2, mode + " 15 min : durée réelle à 20 % près avec le dialogue (" + t + " s)");
    verifier(s.bilan().cartes === cartes.length, "le dialogue compte comme une carte");
  }
  for (const mode of ["silence", "ecouteurs", "parler"]) {
    const r5 = jouerD(mode, 5);
    egal(r5.cartes.filter((c) => c.type === "dialogue").length, 1, mode + " 5 min : une carte Dialogue");
    verifier(r5.cartes.findIndex((c) => c.type === "dialogue") >= 3, mode + " 5 min : après la 3e carte");
    verifier(r5.t <= 300 * 1.2, mode + " 5 min : durée réelle à 20 % près (" + r5.t + " s)");
  }
  // Un seul thème, peu de phrases : le dialogue de cette situation apparaît quand même.
  egal(jouerD("silence", 5, { themes: ["hotel"] }).cartes.filter((c) => c.type === "dialogue").map((c) => c.dialogue.situation), ["hotel"], "un seul thème : son dialogue apparaît");
  egal(jouerD("silence", 30).cartes.filter((c) => c.type === "dialogue").length, 1, "30 min : une carte Dialogue");
  for (const [mode, duree] of [["voiture", 15], ["voiture", 30], ["silence", 2], ["silence", 2], ["ecouteurs", 2], ["parler", 2]]) {
    egal(jouerD(mode, duree).cartes.filter((c) => c.type === "dialogue").length, 0, "pas de carte Dialogue en " + mode + " " + duree + " min");
  }
  egal(jouerD("silence", 15, { dialogues: [] }).cartes.filter((c) => c.type === "dialogue").length, 0, "aucun dialogue proposable : pas de carte");
  egal(jouerD("silence", 15, { dialogues: undefined }).cartes.filter((c) => c.type === "dialogue").length, 0, "pas de contenu de dialogue : pas de carte");
  // Thèmes : seulement un dialogue d'un thème choisi ; sans correspondance, pas de dialogue.
  const th = jouerD("silence", 15, { themes: ["cafe", "courses"] }).cartes.filter((c) => c.type === "dialogue");
  egal(th.map((c) => c.dialogue.situation), ["cafe"], "thèmes café et courses : le dialogue du café");
  egal(jouerD("silence", 15, { themes: ["courses"] }).cartes.filter((c) => c.type === "dialogue").length, 0, "thème sans dialogue : pas de carte");
  // On varie : le dernier dialogue joué n'est pas rejoué quand il y a le choix.
  const quatreThemes = { themes: ["cafe", "hotel", "rencontrer", "presenter"] };
  const premier = jouerD("silence", 15, quatreThemes).cartes.find((c) => c.type === "dialogue").dialogue.id;
  verifier(jouerD("silence", 15, Object.assign({ dernierDialogue: premier }, quatreThemes)).cartes.find((c) => c.type === "dialogue").dialogue.id !== premier, "le dernier dialogue joué n'est pas rejoué");

  // Leitner : une bonne réplique met à jour la boîte ; une fausse ne change rien ; un élément jamais vu est découvert.
  const ecrites = [];
  const fiches = new Map([["ru-cafe-005", Object.assign(ficheVide("ru-cafe-005"), { boite: 2, echeance: J, premiereVue: "2026-11-01" })],
    ["ru-cafe-010", Object.assign(ficheVide("ru-cafe-010"), { boite: 3, echeance: "2026-11-20", premiereVue: "2026-11-01" })]]);
  const sd = creerSession({ contenu: contenuD, fiches, mode: "silence", duree: 15, jour: J, genre: "m", aleatoire: aleatoireGraine(1), ecrire: (f) => ecrites.push(f.id) });
  sd.repondreDialogue("ru-cafe-005");
  egal([fiches.get("ru-cafe-005").boite, fiches.get("ru-cafe-005").echeance, fiches.get("ru-cafe-005").nbReussites], [3, "2026-11-15", 1], "bonne réplique d'un élément dû : boîte + 1");
  sd.repondreDialogue("ru-cafe-010");
  egal([fiches.get("ru-cafe-010").boite, fiches.get("ru-cafe-010").echeance], [3, "2026-11-20"], "bonne réplique d'un élément non dû : boîte inchangée");
  sd.repondreDialogue("ru-dialogue-cafe-001");
  egal([fiches.get("ru-dialogue-cafe-001").boite, fiches.get("ru-dialogue-cafe-001").echeance], [1, "2026-11-12"], "réplique jamais vue : découverte (boîte 1, demain)");
  const avantFiches = JSON.stringify([...fiches]);
  sd.repondreDialogue("id-qui-n-existe-pas");
  egal(JSON.stringify([...fiches]), avantFiches, "id inconnu : rien n'est écrit");
  egal(ecrites, ["ru-cafe-005", "ru-cafe-010", "ru-dialogue-cafe-001"], "chaque bonne réplique est enregistrée");
  // Une fausse réponse n'appelle jamais repondreDialogue (carte-dialogue.js) : les boîtes existantes restent donc intactes.
  // Les fiches abîmées ou anciennes restent valides avec le nouveau type d'historique.
  verifier(validerFiche(fiches.get("ru-cafe-005")).boite === 3, "fiche avec historique « dialogue » valide");
}

// Durée annoncée à la fin : le temps réel, arrondi à la minute, jamais 0.
egal([0, 20, 90, 240, 270, 299].map(minutesReelles), [1, 1, 2, 4, 5, 5], "minutesReelles : arrondi à la minute, au moins 1");

sortie(reussites + " vérifications réussies, " + echecs + " échec(s).");
if (echecs > 0 && typeof process !== "undefined") process.exitCode = 1; // fait échouer `node --test`
