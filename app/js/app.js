// Point d'entrée de Bagou : charge le stockage, l'ambiance et le contenu, puis gère la navigation entre écrans.
//
// Navigation : par état en mémoire, sans URL. Pour que le bouton « retour » du téléphone
// ne fasse pas quitter l'app, on pousse un état d'historique (history.pushState sans changer
// l'URL) quand on quitte l'accueil. L'historique a donc au plus 2 niveaux :
// 0 = accueil, 1 = n'importe quel autre écran.

import { LANGUE_CIBLE } from "./config.js";
import { chargerContenu } from "./contenu.js";
import { chargerAmbiance } from "./ambiance.js";
import { ouvrirStockage } from "./stockage.js";
import { calculerJour } from "./leitner.js";
import { t } from "./textes.js";
import * as audio from "./audio.js";
import { h, vider } from "./ui/dom.js";
import { afficherAccueil } from "./ui/accueil.js";
import { afficherSession } from "./ui/ecran-session.js";
import { afficherAvantDepart, afficherVoitureRoute } from "./ui/voiture.js";
import { afficherFin, afficherProgres, afficherReglages, afficherSansVoix } from "./ui/ecrans.js";

const REGLAGES_PAR_DEFAUT = { translitteration: true, vitesseVoix: "normale", apparence: "auto" };

const ECRANS = {
  accueil: afficherAccueil,
  session: afficherSession,
  voitureAvant: afficherAvantDepart,
  voitureRoute: afficherVoitureRoute,
  fin: afficherFin,
  progres: afficherProgres,
  reglages: afficherReglages,
  sansVoix: afficherSansVoix
};

const racine = document.getElementById("app");
let stockage = null;
let contenu = null;
let vue = null;          // écran affiché : { retour?(), nettoyer?() }
let profondeur = 0;      // 0 = accueil, 1 = autre écran (un état d'historique poussé)
// Jeton de navigation : il change à chaque changement d'écran. Une suite asynchrone
// (attente des voix, par exemple) vérifie qu'il n'a pas changé avant d'agir : si l'utilisateur
// est passé à autre chose entre-temps, elle ne fait rien.
let jetonNavigation = 0;

// Renvoie une fonction qui dit si l'on est toujours sur le même écran, avec la même intention.
function garde() {
  const jeton = jetonNavigation;
  return () => jeton === jetonNavigation;
}

function reglages() { return Object.assign({}, REGLAGES_PAR_DEFAUT, stockage ? stockage.reglages : {}); }
function majReglage(cle, valeur) { if (stockage) stockage.ecrireReglage(cle, valeur); }

function appliquerTheme() {
  const apparence = reglages().apparence;
  if (apparence === "light" || apparence === "dark") document.documentElement.setAttribute("data-theme", apparence);
  else document.documentElement.removeAttribute("data-theme");
}

function historique(action) {
  try {
    if (action === "pousser") history.pushState({ vecu: true }, "");
    if (action === "remplacer") history.replaceState({ vecu: true }, "");
    if (action === "reculer") history.back();
  } catch (e) { /* certains aperçus refusent l'historique : la navigation marche quand même */ }
}

function aller(nom, params) {
  jetonNavigation += 1;
  // Tout changement d'écran repasse le son en Silence : seuls les écrans qui ont le droit
  // de parler (session sonore, Voiture en route) le rallument eux-mêmes.
  audio.definirModeAudio("silence");
  if (vue && vue.nettoyer) { try { vue.nettoyer(); } catch (e) { /* on continue */ } }
  vue = null;
  vider(racine);
  // Le thème sombre forcé ne vaut que pour le mode Voiture (et sa fin de session).
  // « Avant le départ » suit le thème choisi : le sombre ne vient qu'à « Je démarre ».
  const voiture = nom === "voitureRoute" || (params && params.mode === "voiture" && nom === "fin") ||
    (nom === "sansVoix" && params && params.variante !== "cible");
  document.body.classList.toggle("theme-voiture", !!voiture);

  if (nom === "accueil") {
    if (profondeur === 1) { profondeur = 0; historique("reculer"); }
  } else if (profondeur === 0) {
    profondeur = 1;
    historique("pousser");
  }
  vue = ECRANS[nom](racine, ctx, params || {}) || {};
  try { window.scrollTo(0, 0); } catch (e) { /* rien */ }
}

// Bouton « retour » du téléphone.
function surRetour() {
  if (profondeur === 0) return; // c'est nous qui avons reculé (retour à l'accueil)
  if (vue && vue.retour && vue.retour()) {
    historique("pousser"); // on reste sur l'écran : on remet l'état retiré
    return;
  }
  profondeur = 0;
  aller("accueil");
}

// Lance une session. options : { themes: [ids] (vide = « Au hasard »), bouton } (bouton : reçoit « Je prépare la voix… »).
// Renvoie une promesse quand il faut d'abord vérifier les voix.
function lancer(duree, mode, options) {
  const themes = (options && Array.isArray(options.themes)) ? options.themes : [];
  const boutonAttente = options && options.bouton;
  // « Comme la dernière fois » relit ces trois valeurs.
  majReglage("dernierMode", mode);
  majReglage("dernierDuree", duree);
  majReglage("derniersThemes", themes);
  if (mode === "voiture") { aller("voitureAvant", { duree, themes }); return null; }
  if (mode === "silence") { audio.definirModeAudio("silence"); aller("session", { duree, mode, themes }); return null; }
  // Écouteurs ou Je peux parler : ce toucher autorise l'audio, puis on vérifie la voix russe.
  audio.definirModeAudio(mode);
  audio.amorcer();
  if (boutonAttente) boutonAttente.textContent = t("voix.prepare");
  const toujoursLa = garde();
  return audio.verifierVoix(["cible"]).then((voix) => {
    if (!toujoursLa()) return; // l'utilisateur a changé d'écran pendant l'attente : on ne fait rien
    if (voix.cible) aller("session", { duree, mode, themes });
    else { audio.definirModeAudio("silence"); aller("sansVoix", { variante: "cible", duree, themes }); }
  });
}

const ctx = {
  get contenu() { return contenu; },
  get stockage() { return stockage; },
  reglages, majReglage, appliquerTheme, aller, lancer, garde,
  retourAccueil: () => aller("accueil"),
  jour: () => calculerJour(new Date())
};

function enregistrerServiceWorker() {
  try {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js").catch(() => { /* refusé (aperçu, navigation privée) : l'app marche sans */ });
    }
  } catch (e) { /* idem */ }
}

function afficherErreurContenu() {
  vider(racine);
  racine.appendChild(h("div", { class: "ecran" },
    h("main", { class: "contenu" }, h("p", { class: "texte" }, t("erreur.contenu"))),
    h("div", { class: "zone-action" },
      h("button", { type: "button", class: "btn-principal", onclick: () => location.reload() }, t("erreur.reessayer")))));
}

async function demarrer() {
  enregistrerServiceWorker();
  stockage = await ouvrirStockage();
  appliquerTheme();
  try {
    contenu = await chargerContenu(LANGUE_CIBLE);
  } catch (e) {
    afficherErreurContenu();
    return;
  }
  // Ne rejette jamais : sans ambiance valide, l'ambiance neutre de app.css s'applique.
  await chargerAmbiance(LANGUE_CIBLE);
  historique("remplacer");
  window.addEventListener("popstate", surRetour);
  aller("accueil");
}

demarrer();
