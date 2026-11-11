// Audio par synthèse vocale de l'appareil (Web Speech API).
//
// RÈGLE DU MODE SILENCE : la fonction synthese() ci-dessous est le SEUL endroit du code
// qui touche window.speechSynthesis. Elle renvoie null tant que le mode audio est « silence »
// (valeur par défaut au lancement). Aucun son ne peut donc partir en Silence, même par erreur.

import { VOIX, AUDIO, INTERFACE } from "./config.js";

let modeAudio = "silence";
let generation = 0;            // augmente à chaque coupure : les lectures plus anciennes sont abandonnées
let lectureEnCours = null;     // { generation, resoudre, minuteur }
const abonnes = new Set();     // écrans qui veulent savoir si une lecture est en cours

// Le seul accès à la synthèse vocale.
function synthese() {
  if (modeAudio === "silence") return null;
  try {
    return (typeof window !== "undefined" && window.speechSynthesis) ? window.speechSynthesis : null;
  } catch (e) {
    return null;
  }
}

// Mode de la session en cours : "silence", "ecouteurs", "parler" ou "voiture".
export function definirModeAudio(mode) {
  if (mode === "silence") couper();
  modeAudio = mode || "silence";
}
export function modeAudioActuel() { return modeAudio; }

function prevenir(enLecture) {
  abonnes.forEach((f) => { try { f(enLecture); } catch (e) { /* un écran disparu ne doit rien casser */ } });
}
export function surLecture(fonction) {
  abonnes.add(fonction);
  return () => abonnes.delete(fonction);
}
export function enLecture() { return !!lectureEnCours; }

// À appeler dans le gestionnaire d'un toucher : certains navigateurs (iOS) n'autorisent
// la synthèse qu'après un geste. On prononce une phrase vide, sans volume.
export function amorcer() {
  const s = synthese();
  if (!s) return;
  try {
    const u = new SpeechSynthesisUtterance(" ");
    u.volume = 0;
    s.speak(u);
  } catch (e) { /* rien : la vérification des voix dira si ça marche */ }
}

// Voix « fantaisie » d'Apple (et assimilées) : drôles, mais inutilisables pour apprendre.
const VOIX_FANTAISIE = /\b(grandma|grandpa|eddy|flo|jacques|reed|rocko|sandy|shelley|albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|junior|ralph|kathy|fred)\b/i;
// Voix connues pour être de bonne qualité (Google, Microsoft « Natural », Apple « améliorée » ou « Premium »).
const VOIX_BONNES = /(google|natural|neural|premium|enhanced|améliorée|amelioree|siri|thomas|amélie|amelie|audrey|aurélie|aurelie|marie|daniel|milena|yuri|katya|denise|henri|svetlana|dmitry)/i;

// Note de qualité d'une voix : plus c'est haut, mieux c'est.
function noteVoix(v, langue) {
  const nom = v.name || "";
  if (VOIX_FANTAISIE.test(nom)) return -100;
  let note = 0;
  if ((v.lang || "").toLowerCase().replace("_", "-") === langue.lang.toLowerCase()) note += 10; // fr-FR plutôt que fr-CA
  if (/premium|enhanced|améliorée|amelioree|natural|neural/i.test(nom)) note += 8;
  if (/google/i.test(nom)) note += 6;
  if (VOIX_BONNES.test(nom)) note += 4;
  if (v.localService) note += 1; // marche hors ligne
  return note;
}

function voixPour(liste, langue) {
  const norme = (l) => (l || "").toLowerCase().replace("_", "-");
  const candidates = liste.filter((v) => norme(v.lang).startsWith(langue.prefixe));
  const triees = candidates
    .map((v) => ({ v, note: noteVoix(v, langue) }))
    .filter((x) => x.note > -100)
    .sort((a, b) => b.note - a.note);
  // S'il ne reste que des voix fantaisie, mieux vaut l'une d'elles que rien.
  return (triees[0] && triees[0].v) || candidates[0] || null;
}

let voixConnues = { cible: null, fr: null };

// Cherche une voix de la langue cible et une voix française.
// besoins : les voix indispensables, ["cible"] (Écouteurs, Je peux parler) ou ["cible", "fr"] (Voiture).
// Les voix se chargent parfois en différé (démarrage à froid sur Android) : on écoute
// voiceschanged et on attend jusqu’à 3 s que toutes les voix nécessaires soient là.
// Rien n’est mémorisé en cas d’échec : la vérification est refaite au démarrage suivant.
export function verifierVoix(besoins) {
  const necessaires = besoins && besoins.length ? besoins : ["cible"];
  return new Promise((resoudre) => {
    const s = synthese();
    if (!s) { resoudre({ cible: null, fr: null }); return; }
    let fini = false;
    // force = vrai quand le délai d’attente est écoulé : on conclut avec ce qu’on a.
    const conclure = (force) => {
      if (fini) return;
      let liste = [];
      try { liste = s.getVoices() || []; } catch (e) { liste = []; }
      const resultat = { cible: voixPour(liste, VOIX.cible), fr: voixPour(liste, VOIX.fr) };
      const complet = necessaires.every((cle) => resultat[cle]);
      if (!complet && force !== true) return; // on attend encore voiceschanged
      fini = true;
      clearInterval(sondage);
      voixConnues = resultat;
      try { s.removeEventListener("voiceschanged", surChangement); } catch (e) { /* rien */ }
      resoudre(resultat);
    };
    const surChangement = () => conclure(false);
    try { s.addEventListener("voiceschanged", surChangement); } catch (e) { /* ancien navigateur */ }
    // Certains navigateurs n’envoient jamais voiceschanged : on regarde aussi toutes les 250 ms.
    const sondage = setInterval(() => conclure(false), 250);
    conclure(false); // les voix sont peut-être déjà là
    setTimeout(() => conclure(true), INTERFACE.attenteVoixMs);
  });
}

// Durée estimée de la lecture d’un texte (sans marge), d’après sa longueur.
function dureeEstimee(texte, rate) {
  return Math.max(AUDIO.secoursMsMinimum, (texte.length * AUDIO.secoursMsParCaractere) / (rate || 1));
}

/**
 * Prononce un texte. Ne rejette jamais.
 * @param {string} texte
 * @param {{langue?: "cible"|"fr", rate?: number}} options
 * @returns {Promise<"fini"|"annule"|"refuse">}
 *   Une erreur de synthèse ou un onend qui ne vient jamais donnent "fini" : la suite continue.
 */
export function parler(texte, options) {
  const opts = options || {};
  const s = synthese();
  if (!s || !texte) return Promise.resolve("refuse");
  couper(); // une seule lecture à la fois
  const maGeneration = generation;
  return new Promise((resoudre) => {
    const terminer = (etat) => {
      if (!lectureEnCours || lectureEnCours.generation !== maGeneration) return;
      clearTimeout(lectureEnCours.minuteur);
      lectureEnCours = null;
      prevenir(false);
      resoudre(etat);
    };
    lectureEnCours = { generation: maGeneration, resoudre, minuteur: null };
    try {
      const langue = opts.langue === "fr" ? VOIX.fr : VOIX.cible;
      const u = new SpeechSynthesisUtterance(texte);
      u.lang = langue.lang;
      const voix = opts.langue === "fr" ? voixConnues.fr : voixConnues.cible;
      if (voix) u.voice = voix;
      u.rate = opts.rate || 1;
      const estimee = dureeEstimee(texte, u.rate);
      const debut = Date.now();
      u.onend = () => terminer("fini");
      // Erreur (y compris une annulation venue du système) : jamais de pause. On laisse passer
      // le temps que la phrase aurait dû prendre, pour garder le rythme, puis on continue.
      u.onerror = () => {
        const reste = Math.max(0, estimee - (Date.now() - debut));
        if (lectureEnCours && lectureEnCours.generation === maGeneration) {
          clearTimeout(lectureEnCours.minuteur);
          lectureEnCours.minuteur = setTimeout(() => terminer("fini"), reste);
        }
      };
      // Minuteur de secours, calé sur la longueur du texte : la boucle ne reste jamais bloquée.
      // On termine AVANT d’appeler cancel(), pour qu’une erreur déclenchée par cancel() soit ignorée.
      lectureEnCours.minuteur = setTimeout(() => {
        terminer("fini");
        try { s.cancel(); } catch (e) { /* rien */ }
      }, estimee + AUDIO.secoursMsMarge);
      prevenir(true);
      if (s.paused) { try { s.resume(); } catch (e) { /* rien */ } }
      s.speak(u);
    } catch (e) {
      terminer("fini");
    }
  });
}

// Coupe toute lecture en cours. Les promesses en attente se résolvent avec "annule".
export function couper() {
  generation += 1;
  if (lectureEnCours) {
    const l = lectureEnCours;
    lectureEnCours = null;
    clearTimeout(l.minuteur);
    prevenir(false);
    l.resoudre("annule");
  }
  const s = synthese();
  if (s) { try { s.cancel(); } catch (e) { /* rien */ } }
}
