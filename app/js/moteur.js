// Moteur de session : compose la suite de cartes selon docs/pedagogie/regles-session.md.
// Module pur : il ne touche ni au DOM, ni au son, ni au stockage.
// L'écran lui demande la carte suivante en lui donnant le temps écoulé t (en secondes,
// pauses exclues), puis lui transmet le résultat de la carte.

import {
  REGLES, COUT_NOUVEAU, ECHELLES, REVISION_PAR_BOITE, ROTATION_REMPLISSAGE, DIALOGUE, UNIVERS
} from "./config.js";
import { ficheVide, estDu, estAcquis, appliquerDecouverte, appliquerResultat, validerFiche } from "./leitner.js";
import { texteElement } from "./contenu.js";
import { optionsQcm, optionsMoule, tuilesOrdre, ordrePossible } from "./exercices.js";

const TYPES_DECOUVERTE = ["decouverte", "boucle-decouverte"];

// Correspondance type de carte → clé du tableau des estimations.
function cleEstimation(type, el) {
  switch (type) {
    case "decouverte": return el.moule ? "decouverteMoule" : "decouverte";
    case "voix-haute": return "voixHaute";
    case "moule-sens":
    case "moule-theme": return "moule";
    case "boucle-decouverte": return "boucleDecouverte";
    case "boucle-rappel": return "boucleRappel";
    default: return type;
  }
}

// Générateur pseudo-aléatoire reproductible (pour les tests).
export function aleatoireGraine(graine) {
  let a = graine >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Crée une session.
 * @param {object} p
 * @param {object} p.contenu  résultat de preparerContenu
 * @param {Map}    p.fiches   id → fiche de progression (modifiée sur place)
 * @param {string} p.mode     "silence" | "ecouteurs" | "parler" | "voiture"
 * @param {number} p.duree    durée annoncée en minutes (2, 5, 15, 30)
 * @param {string} p.jour     jour de la répétition (AAAA-MM-JJ)
 * @param {string} p.genre    "m" ou "f"
 * @param {string[]} [p.themes] ids de situations choisies ; vide ou absent = « Au hasard »
 *   (tout le contenu, comportement d'origine). Avec des thèmes, les nouvelles phrases, les
 *   révisions dues et le remplissage ne viennent que de ces thèmes. Les révisions dues
 *   ailleurs attendent : leur fiche n'est pas touchée, donc aucune pénalité.
 * @param {boolean} [p.univers] inclure les univers de vocabulaire (défaut : oui). Non : leurs éléments ne sont ni
 *   nouveaux, ni révisés, ni en remplissage ; leurs fiches ne sont pas touchées.
 * @param {function} [p.aleatoire] tirage dans [0, 1[
 * @param {function} [p.ecrire]    appelé avec chaque fiche modifiée (pour l'enregistrer)
 * @param {object}   [p.persoVus]  mots du personnage déjà montrés en Découverte : { cle: true }
 * @param {function} [p.persoVu]   appelé avec la clé d'un mot du personnage au moment de sa Découverte
 * @param {object[]} [p.dialogues]  dialogues que le personnage permet de jouer (dialoguesProposables) ; absent = aucun
 * @param {string}   [p.dernierDialogue] id du dernier dialogue joué (on varie quand il y a le choix)
 */
// Minutes réellement passées (pauses exclues), arrondies, au moins 1 : pour dire « 4 min de russe » à la fin.
export function minutesReelles(secondes) { return Math.max(1, Math.round(secondes / 60)); }

export function creerSession(p) {
  const contenu = p.contenu;
  const fiches = p.fiches;
  const jour = p.jour;
  let genre = p.genre === "f" ? "f" : "m";
  const aleatoire = p.aleatoire || Math.random;
  const ecrire = p.ecrire || function () {};
  const persoVus = p.persoVus || {};
  const persoVu = p.persoVu || function () {};
  const duree = String(p.duree);
  const D = REGLES.durees[duree];
  let mode = p.mode;

  // Défense en profondeur : les fiches reçues sont validées (une fiche abîmée ne fait rien planter).
  [...fiches.keys()].forEach((id) => {
    const f = validerFiche(fiches.get(id));
    if (f && f.id === id) fiches.set(id, f); else fiches.delete(id);
  });
  const fiche = (id) => fiches.get(id) || ficheVide(id);
  const el = (id) => contenu.parId.get(id);
  const tousElements = contenu.elements;
  // Les éléments d'univers (moules de vocabulaire) suivent leurs propres règles d'entrée ; ils ne sont pas des « thèmes ».
  const elementsSituations = tousElements.filter((e) => !e.univers);
  const elementsUnivers = p.univers === false ? [] : tousElements.filter((e) => e.univers);
  // Thèmes choisis (ids inconnus ignorés). Si plus rien de valide, on retombe sur « Au hasard ».
  const themesChoisis = new Set((Array.isArray(p.themes) ? p.themes : []).filter((id) => elementsSituations.some((e) => e.situation === id)));
  // Les univers inclus s'ajoutent à ce qui est travaillé, avec ou sans thèmes choisis.
  const elements = (themesChoisis.size ? elementsSituations.filter((e) => themesChoisis.has(e.situation)) : elementsSituations).concat(elementsUnivers);

  // ---- 5.1 Initialisation ----
  const dus = elements
    .filter((e) => estDu(fiche(e.id), jour))
    .sort((a, b) => {
      const fa = fiche(a.id), fb = fiche(b.id);
      return (fa.echeance < fb.echeance ? -1 : fa.echeance > fb.echeance ? 1 : 0) ||
        (fa.boite - fb.boite) || (a.rang - b.rang);
    })
    .map((e) => e.id);
  const dusAuDepart = new Set(dus);
  // Moules déjà appris dont le mot du personnage n'a jamais été montré (nouveau métier) : une Découverte
  // non notée d'abord, sans toucher à la boîte. Un moule jamais vu l'obtient par la Découverte normale.
  const cleDe = (e) => e.moule.remplacements[0].cle;
  const persoAVoir = elements.filter((e) => e.moule && e.moule.personnel && !persoVus[cleDe(e)] && fiche(e.id).boite >= 1).map((e) => e.id);
  const nouveauxPossibles = elements.filter((e) => !e.univers && fiche(e.id).boite === 0).map((e) => e.id);
  // Univers : un élément jamais vu entre dans la file des nouveaux quand assez d'éléments de situations ont été
  // introduits avant la session (R1), dans l'ordre des seuils, puis de l'univers, puis du moule (R4).
  const situationsIntroduites = elementsSituations.filter((e) => fiche(e.id).boite >= 1).length;
  const universNouveaux = elementsUnivers.filter((e) => fiche(e.id).boite === 0 && e.seuil <= situationsIntroduites)
    .sort((a, b) => (a.seuil - b.seuil) || (a.rangSituation - b.rangSituation) || (a.rangPhrase - b.rangPhrase));
  const limiteUnivers = UNIVERS.parSession[duree] || 0;
  const universPossibles = Math.min(limiteUnivers, universNouveaux.length);
  // Le démarrage prudent des sessions de 2 min compte les phrases vues partout, pas seulement dans les thèmes.
  const nbVus = tousElements.filter((e) => fiche(e.id).boite >= 1).length;

  // ---- Section 2 : nombre de nouveaux éléments ----
  let nMax = REGLES.nMax[mode][duree];
  if (duree === "2" && nbVus < REGLES.demarrage.seuilVus) nMax = REGLES.demarrage.nMax2min;
  const nMin = REGLES.nMin[duree];
  // Un univers prend la place d'un nouvel élément de situation (R3) : N ne change pas tant qu'il reste des situations.
  let N = Math.min(nMax, nouveauxPossibles.length + universPossibles);
  while (N > nMin && N * COUT_NOUVEAU[mode].phrase + dus.length * REGLES.estRevision[mode] > D) N--;
  // Le quota N est pris dans l'ordre de NEW ; le bonus (5.6) continue dans le même ordre.
  const bonusMax = REGLES.nouveautesBonusMax[duree];
  // Éléments « en jeu » pour la réserve : vus avant la session, ou introduits pendant.
  const enJeu = new Set(elements.filter((e) => fiche(e.id).boite >= 1).map((e) => e.id));

  const acquisAvant = new Set(tousElements.filter((e) => estAcquis(fiche(e.id))).map((e) => e.id));

  // ---- État de la session ----
  const etat = {
    index: 0,
    dernierElement: null,
    rendezVous: [],          // { id, type, etape, indexMin, seq, rattrapage, etapeSuivante, ecartSuivant }
    seq: 0,
    actifs: 0,
    introduits: 0,
    introduitsSituations: 0, // parmi `introduits` : les éléments de situations (pointeur dans nouveauxPossibles)
    introduitsUnivers: 0,
    universVus: new Set(),   // univers déjà introduits dans cette session (la fiche est écrite à la Découverte)
    dusPasses: new Set(),
    premiereNoteeFaite: new Set(),
    rattrapages: new Map(),
    echecs: [],
    dernierType: new Map(),
    remplacements: new Map(),
    autresMots: new Map(),   // moule du personnage : dernier mot « autre » joué (1 à n-1)
    persoFait: new Set(),
    fileF: null,
    introduitsSession: [],
    travailles: new Set(),
    terminee: false,
    dialogueFait: false,
    cartes: new Map(),       // cartes(e) : nombre de cartes reçues par l'élément dans la session
    plafond: REGLES.maxCartesParElementParSession,
    prolongation: false,
    facteurEstimation: 1     // voir ajusterEstimations()
  };
  elements.forEach((e) => {
    const f = fiche(e.id);
    if (e.moule && Number.isInteger(f.dernierRemplacement)) etat.remplacements.set(e.id, f.dernierRemplacement);
  });

  // ---- Outils ----
  const echelleDe = (e) => (mode === "voiture" ? ECHELLES.voiture : (e.moule ? ECHELLES.moule : ECHELLES[mode]));
  const ecartsDe = () => (mode === "voiture" ? REGLES.ecartsEchelle.voiture : REGLES.ecartsEchelle.standard);
  const coutNouveau = (e) => COUT_NOUVEAU[mode][e.moule ? "moule" : "phrase"];
  const estimation = (type, e) => REGLES.estimations[mode][cleEstimation(type, e)];

  // Un type impossible dans le mode courant est remplacé (section 3, et « Couper le son »).
  function resoudreType(type, e) {
    if (mode === "voiture") return type;
    if (mode === "silence" && type === "ecoute") type = "sens";
    if (mode !== "parler" && type === "voix-haute") type = "theme";
    if (type === "ordre" && !ordrePossible(e, genre)) type = "theme";
    return type;
  }

  // Carte de révision selon la boîte (4.2).
  function typeRevision(e) {
    if (mode === "voiture") return "boucle-rappel";
    const boite = Math.max(1, fiche(e.id).boite);
    if (e.moule) return boite <= 2 ? "moule-sens" : "moule-theme";
    return resoudreType(REVISION_PAR_BOITE[mode][Math.min(boite, 6) - 1], e);
  }

  // Carte de remplissage (4.3).
  function typeRemplissage(e) {
    if (mode === "voiture") return "boucle-rappel";
    const dernier = etat.dernierType.get(e.id);
    if (e.moule) {
      if (dernier === "moule-sens") return "moule-theme";
      if (dernier === "moule-theme") return "moule-sens";
      return typeRevision(e);
    }
    const rotation = ROTATION_REMPLISSAGE[mode];
    const i = rotation.indexOf(dernier);
    if (!dernier || i < 0) return typeRevision(e);
    for (let k = 1; k <= rotation.length; k++) {
      const candidat = rotation[(i + k) % rotation.length];
      if (candidat === "ordre" && !ordrePossible(e, genre)) continue; // type impossible : sauté
      return resoudreType(candidat, e);
    }
    return typeRevision(e);
  }

  // Liste F du remplissage (5.3).
  function construireF() {
    const liste = [];
    const ajouter = (id) => { if (!liste.includes(id) && fiche(id).boite >= 1) liste.push(id); };
    etat.echecs.forEach(ajouter);
    elements.filter((e) => fiche(e.id).premiereVue === jour).forEach((e) => ajouter(e.id)); // déjà par rang
    elements
      .filter((e) => fiche(e.id).boite >= 1)
      .sort((a, b) => {
        const fa = fiche(a.id), fb = fiche(b.id);
        return (fa.boite - fb.boite) ||
          (fa.echeance < fb.echeance ? -1 : fa.echeance > fb.echeance ? 1 : 0) || (a.rang - b.rang);
      })
      .forEach((e) => ajouter(e.id));
    return liste;
  }

  // Regarde quel élément le remplissage donnerait, sans rien modifier.
  function regarderRemplissage(permis) {
    let file = etat.fileF ? etat.fileF.slice() : null;
    for (let passage = 0; passage < 2; passage++) {
      if (file && file.length) {
        const i = file.findIndex(permis);
        if (i >= 0) {
          const id = file[i];
          file.splice(i, 1);
          return { id, file };
        }
      }
      file = construireF(); // F épuisée ou seul reste le dernier élément : nouveau passage
    }
    return null;
  }

  function plusPetitRdv(liste) {
    let meilleur = null;
    for (const r of liste) {
      if (!meilleur || r.indexMin < meilleur.indexMin || (r.indexMin === meilleur.indexMin && r.seq < meilleur.seq)) meilleur = r;
    }
    return meilleur;
  }

  const dusRestants = () => dus.filter((id) => !etat.dusPasses.has(id)).length;

  // 5.6 Plafond : un élément « plein » ne reçoit plus aucune carte dans la session.
  const nbCartes = (id) => etat.cartes.get(id) || 0;
  const plein = (id) => nbCartes(id) >= etat.plafond;
  // Réserve : cartes encore possibles sans nouveauté.
  function reserve() {
    let total = 0;
    enJeu.forEach((id) => { total += Math.max(0, etat.plafond - nbCartes(id)); });
    return total;
  }

  // ---- Dialogue : au plus une carte par session, après quelques éléments, jamais en Voiture ----
  // Le dialogue est choisi parmi les situations déjà travaillées dans la session (et les thèmes choisis).
  const dialoguesPossibles = (Array.isArray(p.dialogues) ? p.dialogues : []).filter((d) => !themesChoisis.size || themesChoisis.has(d.situation));
  function choisirDialogue(t) {
    if (etat.dialogueFait || mode === "voiture" || !DIALOGUE.durees.includes(duree)) return null;
    if (etat.index < DIALOGUE.apresCartes || D - t < DIALOGUE.estimation[mode]) return null;
    const vues = new Set([...etat.travailles].map((id) => (el(id) || {}).situation));
    let candidats = dialoguesPossibles.filter((d) => vues.has(d.situation));
    // Aucun dialogue d'une situation travaillée (un thème sans dialogue, thème au hasard) ou seul le dernier joué : on prend un autre.
    const autres = (candidats.length > 1 || candidats[0] && candidats[0].id !== p.dernierDialogue ? candidats : dialoguesPossibles).filter((d) => d.id !== p.dernierDialogue);
    if (autres.length) candidats = autres;
    return candidats.length ? candidats[Math.floor(aleatoire() * candidats.length)] : null;
  }

  // ---- 5.2 Choix de la carte suivante (sans effet) ----
  function choisir(t, sansContrainte) {
    // Un élément plein est ignoré partout ; la contrainte « ≠ dernier » peut être levée (règle F).
    const permis = (id) => !plein(id) && (sansContrainte || id !== etat.dernierElement);

    // P. Nouveau mot du personnage sur un moule déjà appris : une seule Découverte par session
    const pid = etat.persoFait.size === 0 ? persoAVoir.find((id) => permis(id)) : null;
    if (pid) return { regle: "P", id: pid, type: mode === "voiture" ? "boucle-decouverte" : "decouverte" };

    // A. Rendez-vous échu
    const echus = etat.rendezVous.filter((r) => r.indexMin <= etat.index && permis(r.id));
    const a = plusPetitRdv(echus);
    if (a) return { regle: "A", id: a.id, rdv: a, type: resoudreType(a.type, el(a.id)) };

    // B. Nouvel élément : un univers d'abord s'il est éligible et sous la limite de la session (R2, R3), sinon la situation suivante
    const univers = etat.introduitsUnivers < limiteUnivers ? universNouveaux.find((e) => !etat.universVus.has(e.id)) : null;
    const prochain = univers ? univers.id : nouveauxPossibles[etat.introduitsSituations];
    const resteNouveau = prochain !== undefined;
    const quota = etat.introduits < N;
    const bonus = !quota && etat.introduits < N + bonusMax && reserve() * REGLES.estRevision[mode] < D - t;
    if (resteNouveau && (quota || bonus) && etat.actifs < REGLES.actifsMax && (dusAuDepart.size === 0 || etat.index >= 1)) {
      const id = prochain;
      const e = el(id);
      if (D - t >= coutNouveau(e) + dusRestants() * REGLES.estRevision[mode]) {
        return { regle: "B", id, etape: 0, type: resoudreType(echelleDe(e)[0], e) };
      }
    }

    // C. Révision due
    const c = dus.find((id) => !etat.dusPasses.has(id) && permis(id));
    if (c) return { regle: "C", id: c, type: typeRevision(el(c)) };

    // D. Rendez-vous avancé
    const d = plusPetitRdv(etat.rendezVous.filter((r) => permis(r.id)));
    if (d) return { regle: "D", id: d.id, rdv: d, type: resoudreType(d.type, el(d.id)) };

    // E. Remplissage
    const e = regarderRemplissage(permis);
    if (e) return { regle: "E", id: e.id, fileApres: e.file, type: typeRemplissage(el(e.id)) };

    return null;
  }

  // ---- Placement d'une carte (avec effets) ----
  function placer(choix) {
    const e = el(choix.id);
    const index = etat.index;
    const ecarts = ecartsDe();
    let etape = null;
    let rattrapage = false;

    if (choix.rdv) {
      etat.rendezVous = etat.rendezVous.filter((r) => r !== choix.rdv);
      rattrapage = !!choix.rdv.rattrapage;
      if (!rattrapage) etape = choix.rdv.etape;
      // Après un rattrapage d'échelle, l'étape suivante est programmée (réussi ou non).
      if (rattrapage && choix.rdv.etapeSuivante !== null && choix.rdv.etapeSuivante !== undefined) {
        etat.rendezVous.push({
          id: e.id, etape: choix.rdv.etapeSuivante, type: echelleDe(e)[choix.rdv.etapeSuivante],
          indexMin: index + choix.rdv.ecartSuivant, seq: etat.seq++, rattrapage: false
        });
      }
    }
    if (choix.regle === "B") {
      etape = 0;
      etat.introduits += 1;
      if (e.univers) { etat.introduitsUnivers += 1; etat.universVus.add(e.id); } else etat.introduitsSituations += 1;
      etat.actifs += 1;
      etat.introduitsSession.push(e.id);
      enJeu.add(e.id);
    }
    if (choix.regle === "E") etat.fileF = choix.fileApres;
    if (choix.regle === "P") etat.persoFait.add(e.id);
    etat.cartes.set(e.id, nbCartes(e.id) + 1);

    // Échelle : programmer l'étape suivante (si l'élément n'est pas plein), ou sortir des actifs.
    if (etape !== null) {
      const echelle = echelleDe(e);
      if (etape + 1 < echelle.length && !plein(e.id)) {
        etat.rendezVous.push({
          id: e.id, etape: etape + 1, type: echelle[etape + 1],
          indexMin: index + ecarts[etape], seq: etat.seq++, rattrapage: false
        });
      } else {
        etat.actifs -= 1;
      }
    }

    // Remplacement d'un moule (4.4) : 0 à la découverte, sinon le suivant.
    // Moule du personnage (indice 0 = son mot) : son mot à la découverte, puis une carte sur deux ;
    // les autres mots tournent entre ces cartes.
    let remplacement = null;
    if (e.moule) {
      const nb = e.moule.remplacements.length;
      const precedent = etat.remplacements.has(e.id) ? etat.remplacements.get(e.id) : -1;
      if (TYPES_DECOUVERTE.includes(choix.type)) remplacement = 0;
      else if (!e.moule.personnel || nb < 2) remplacement = (precedent + 1) % nb;
      else if (precedent === 0) remplacement = (etat.autresMots.get(e.id) || 0) % (nb - 1) + 1;
      else remplacement = 0;
      if (e.moule.personnel && remplacement > 0) etat.autresMots.set(e.id, remplacement);
      if (e.moule.personnel && remplacement === 0 && TYPES_DECOUVERTE.includes(choix.type)) persoVu(cleDe(e));
      etat.remplacements.set(e.id, remplacement);
    }

    const carte = {
      index,
      numero: index + 1,
      id: e.id,
      element: e,
      type: choix.type,
      regle: choix.regle,
      etape,
      rattrapage,
      remplacement,
      mode,
      est: estimation(choix.type, e),
      texte: texteElement(e, { genre, remplacement: remplacement || 0 })
    };
    ajouterExercice(carte);

    // Découverte : boîte 0 → 1 dès l'affichage.
    if (TYPES_DECOUVERTE.includes(carte.type)) {
      const nf = appliquerDecouverte(fiche(e.id), { jour, mode, type: carte.type, remplacement });
      fiches.set(e.id, nf);
      ecrire(nf);
    }

    etat.dernierElement = e.id;
    etat.index += 1;
    etat.dernierType.set(e.id, carte.type);
    etat.travailles.add(e.id);
    if (dusAuDepart.has(e.id) && choix.regle !== "P") etat.dusPasses.add(e.id);
    return carte;
  }

  // Ajoute les choix du QCM ou les tuiles de l'Ordre.
  function ajouterExercice(carte) {
    const ctx = {
      // Un univers jamais vu ne sert pas de leurre : il apparaîtrait avant son entrée.
      elements: tousElements.filter((e) => !e.univers || fiche(e.id).boite >= 1), fiche, genre, aleatoire,
      introduitsSession: new Set(etat.introduitsSession)
    };
    // À voix haute reçoit aussi des choix : ils servent si l'on coupe le son pendant la carte
    // (elle devient alors une carte Thème).
    if (["sens", "theme", "ecoute", "voix-haute"].includes(carte.type)) carte.options = optionsQcm(carte.element, ctx);
    if (carte.type === "moule-sens" || carte.type === "moule-theme") {
      carte.options = optionsMoule(carte.element, carte.remplacement, ctx);
    }
    if (carte.type === "ordre") carte.ordre = tuilesOrdre(carte.texte.accent, aleatoire);
  }

  // ---- API ----

  // Donne la carte suivante, ou null si la session est finie (section 6).
  function prochaineCarte(t) {
    if (etat.terminee) return null;
    const seuil = REGLES.seuilFinAnticipee * D;
    if (t >= D) { etat.terminee = true; return null; }
    if (etat.prolongation && t >= seuil) { etat.terminee = true; return null; } // règle 3
    const dialogue = choisirDialogue(t);
    if (dialogue) {
      etat.dialogueFait = true;
      const index = etat.index++;
      return { index, numero: index + 1, id: dialogue.id, type: "dialogue", dialogue, mode, est: DIALOGUE.estimation[mode], element: null };
    }
    let choix = null;
    // Le plafond ne peut monter que de quelques crans : la boucle est bornée.
    for (let essai = 0; essai < 50 && !choix; essai++) {
      choix = choisir(t, false) || choisir(t, true); // F. on lève la contrainte « ≠ dernier »
      if (choix) break;
      // G. Plus rien à jouer (6.1) : fin anticipée, ou prolongation en relevant le plafond.
      if (t >= seuil || enJeu.size === 0) { etat.terminee = true; return null; }
      etat.prolongation = true;
      etat.plafond += REGLES.prolongationPasPlafond;
    }
    if (!choix) { etat.terminee = true; return null; }
    // Règle 2. Le facteur (1 par défaut) corrige l’estimation par la durée réellement mesurée (Voiture).
    const est = estimation(choix.type, el(choix.id)) * etat.facteurEstimation;
    if (t + est > REGLES.toleranceFin * D) { etat.terminee = true; return null; }
    return placer(choix);
  }

  // Résultat d'une carte : "reussite", "echec", "passif" ou "non-note".
  function repondre(carte, resultat) {
    if (resultat === "non-note") return;
    const id = carte.id;
    const etaitDu = dusAuDepart.has(id);
    const premiere = etaitDu && !etat.premiereNoteeFaite.has(id);
    if (etaitDu) etat.premiereNoteeFaite.add(id);
    const nf = appliquerResultat(fiche(id), {
      jour, mode: carte.mode, type: carte.type, remplacement: carte.remplacement,
      resultat, compteePourDu: premiere, estDuDejaNote: etaitDu && !premiere
    });
    fiches.set(id, nf);
    ecrire(nf);

    if (resultat !== "echec") return;
    etat.echecs.push(id);
    // 5.4 Rattrapage : même élément, même type, 3 cartes plus loin, au plus 2 par session.
    const deja = etat.rattrapages.get(id) || 0;
    if (deja >= REGLES.rattrapage.maxParElement) return;
    if (plein(id)) return; // élément plein : pas de rattrapage, il reviendra une autre fois
    etat.rattrapages.set(id, deja + 1);
    let etapeSuivante = null;
    let ecartSuivant = null;
    if (carte.etape !== null && !carte.rattrapage) {
      // Pendant une échelle : l'étape suivante attend la carte de rattrapage.
      const suivant = etat.rendezVous.find((r) => r.id === id && !r.rattrapage && r.etape === carte.etape + 1);
      if (suivant) {
        etat.rendezVous = etat.rendezVous.filter((r) => r !== suivant);
        etapeSuivante = suivant.etape;
        ecartSuivant = ecartsDe()[carte.etape];
      }
    }
    etat.rendezVous.push({
      id, type: carte.type, etape: null, indexMin: carte.index + REGLES.rattrapage.ecart,
      seq: etat.seq++, rattrapage: true, etapeSuivante, ecartSuivant
    });
  }

  // Dialogue : une bonne réplique met à jour la boîte de son élément (jamais vu : il est découvert) ;
  // une fausse réponse ne touche à rien. Un id inconnu est ignoré.
  function repondreDialogue(id) {
    if (!el(id)) return;
    if (fiche(id).boite === 0) {
      const nf = appliquerDecouverte(fiche(id), { jour, mode, type: "dialogue" });
      fiches.set(id, nf);
      ecrire(nf);
    } else {
      repondre({ id, mode, type: "dialogue", remplacement: null, etape: null, index: etat.index, rattrapage: false }, "reussite");
    }
    etat.travailles.add(id);
    if (dusAuDepart.has(id)) etat.dusPasses.add(id);
  }

  // « Couper le son » : la suite de la session passe en Silence.
  function couperSon() {
    if (mode === "ecouteurs" || mode === "parler") mode = "silence";
  }

  // Le genre choisi en cours de session s'applique aux cartes suivantes.
  function definirGenre(g) { genre = g === "f" ? "f" : "m"; }

  // Voiture : rapport « durée réelle / durée estimée » des cycles déjà joués.
  // Il ne sert qu’à la règle d’arrêt (t + est > 1,15 × D), pour ne pas lancer un dernier
  // cycle qui déborderait quand la synthèse de l’appareil est plus lente que prévu.
  function ajusterEstimations(facteur) {
    if (Number.isFinite(facteur) && facteur > 0) etat.facteurEstimation = Math.min(3, Math.max(0.5, facteur));
  }

  function bilan() {
    const decouverts = etat.introduitsSession.slice();
    const revises = [...etat.travailles].filter((id) => !decouverts.includes(id));
    // « Tu sais dire N phrases » compte toujours tout le contenu, quels que soient les thèmes de la session.
    const acquisMaintenant = tousElements.filter((e) => estAcquis(fiche(e.id))).map((e) => e.id);
    return {
      decouverts,
      revises,
      travailles: etat.travailles.size,
      cartes: etat.index,
      totalAcquis: acquisMaintenant.length,
      nouveauxAcquis: acquisMaintenant.filter((id) => !acquisAvant.has(id)).length,
      toutVu: elementsSituations.concat(elementsUnivers).every((e) => fiche(e.id).boite >= 1)
    };
  }

  return {
    prochaineCarte,
    repondre,
    repondreDialogue,
    couperSon,
    definirGenre,
    ajusterEstimations,
    bilan,
    get mode() { return mode; },
    get duree() { return D; },
    get N() { return N; },
    get dus() { return dus.slice(); },
    etat // exposé pour les tests
  };
}
