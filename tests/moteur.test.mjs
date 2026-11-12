// Tests du moteur de session et du Leitner, sans navigateur.
// Lancement, depuis la racine du dépôt, sans rien d'autre à préparer :
//   node tests/moteur.test.mjs        (ou : node --test tests/moteur.test.mjs)
// Code de sortie 1 s'il y a au moins un échec. Avec jsc (JavaScriptCore), `readFile` et `print` existent déjà.
// Les comptes attendus (éléments, moules, rangs) sont calculés depuis content/ru/index.json
// et les fichiers listés : ajouter une situation ne casse pas ce test.

import { preparerContenu, texteElement } from "../app/js/contenu.js";
import { REGLES, AUDIO } from "../app/js/config.js";
import { creerSession, aleatoireGraine } from "../app/js/moteur.js";
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

sortie(reussites + " vérifications réussies, " + echecs + " échec(s).");
if (echecs > 0 && typeof process !== "undefined") process.exitCode = 1; // fait échouer `node --test`
