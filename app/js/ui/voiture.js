// Mode Voiture : rien à lire, rien à toucher. Tout l'écran est un bouton pause.
// La boucle tourne seule jusqu'à la fin de la durée (même règle d'arrêt que les autres modes).
//
// Comment on évite que la boucle se bloque :
// - chaque lecture passe par audio.parler(), qui a un minuteur de secours si onend ne vient pas ;
// - chaque attente est un minuteur que la pause annule ;
// - un « jeton » change à chaque pause : une étape d'un cycle abandonné ne fait plus rien.

import { h, icone, focaliser } from "./dom.js";
import { creerMenu } from "./menu.js";
import { resumeThemes } from "./accueil.js";
import { t, texteDuree } from "../textes.js";
import { aLire } from "../contenu.js";
import { REGLES } from "../config.js";
import { creerSession, minutesReelles } from "../moteur.js";
import { creerHorloge } from "../horloge.js";
import * as audio from "../audio.js";

const ABANDON = { abandon: true };

// 4.1 Avant le départ : rien à lire, un seul gros bouton (bagou-ru.md, section 4).
// Les trois pastilles ramènent à leur étape de l'accueil sans perdre les autres choix.
export function afficherAvantDepart(racine, ctx, { duree, themes }) {
  const themesChoisis = themes || [];
  const choix = { lieu: "voiture", duree, themes: themesChoisis };
  const versEtape = (etape) => ctx.aller("accueil", { etape, choix });
  const menu = creerMenu(ctx, {});
  const libelle = h("span", { class: "libelle" }, t("voiture.demarrer"));
  const sous = h("span", { class: "sous" }, t("voiture.demarrerSous", { duree: texteDuree(duree) }));
  const demarrer = h("button", { type: "button", class: "btn-principal tres-haut", id: "je-demarre", onclick: lancer }, libelle, sous);
  let enPreparation = false;
  function lancer() {
    if (enPreparation) return;
    enPreparation = true;
    // Ce toucher autorise l'audio.
    audio.definirModeAudio("voiture");
    audio.amorcer();
    libelle.textContent = t("voix.prepare");
    sous.textContent = "";
    const toujoursLa = ctx.garde();
    audio.verifierVoix(["cible", "fr"]).then((voix) => {
      enPreparation = false;
      if (!toujoursLa()) return; // retour à l'accueil pendant l'attente : la Voiture ne part pas
      if (!voix.cible) { audio.definirModeAudio("silence"); ctx.aller("sansVoix", { variante: "voiture", duree }); return; }
      if (!voix.fr) { audio.definirModeAudio("silence"); ctx.aller("sansVoix", { variante: "fr", duree }); return; }
      ctx.aller("voitureRoute", { duree, themes: themesChoisis });
    });
  }
  const past = (icon, texte, etape) => h("button", { type: "button", class: "past", "aria-label": t("past.modifier", { valeur: texte }), onclick: () => versEtape(etape) },
    icon ? icone(icon) : null, h("span", { "aria-hidden": "true" }, texte));
  const titre = h("h1", { class: "titre-etape", tabindex: "-1" }, t("voiture.avantTitre"));
  const ligne = (icon, cle) => h("li", null, h("span", { class: "ic" }, icone(icon)), t(cle));
  racine.appendChild(h("div", { class: "ecran" },
    h("header", { class: "entete" }, menu.element),
    h("main", { class: "contenu" },
      h("div", { class: "pastilles" },
        past("voiture", t("lieu.voiture"), 1), past(null, texteDuree(duree), 2), past(null, resumeThemes(themesChoisis, ctx.contenu.situations), 3)),
      titre,
      h("ul", { class: "preparatifs" }, ligne("batterie", "voiture.branche"), ligne("hautParleur", "voiture.volume"), ligne("telephone", "voiture.pose"))),
    h("div", { class: "zone-action" }, demarrer,
      h("button", { type: "button", class: "btn-lien", onclick: () => versEtape(2) }, icone("retour"), t("nav.retour")))));
  focaliser(titre);
  return { nettoyer() { menu.fermer(); } };
}

// 4.2 En route
export function afficherVoitureRoute(racine, ctx, { duree, themes }) {
  document.body.classList.add("theme-voiture");
  audio.definirModeAudio("voiture");
  const reglages = ctx.reglages();
  const session = creerSession({
    contenu: ctx.contenu, fiches: ctx.stockage.fiches, mode: "voiture", duree, jour: ctx.jour(), themes, univers: reglages.universInclus !== false,
    genre: reglages.genre || "m",
    persoVus: ctx.personnage().vus,
    persoVu: ctx.persoVu,
    ecrire: (fiche) => ctx.stockage.ecrireFiche(fiche)
  });
  const horloge = creerHorloge();
  const V = REGLES.voiture;
  const rateNormal = reglages.vitesseVoix === "lente" ? V.rateNormalReglageLent : V.rateNormal;

  let jeton = 0;
  let enPause = false;
  let fini = false;
  let annonceFaite = false;
  let carteCourante = null;
  let pauseUtilisateur = false; // vrai si c'est l'utilisateur qui a mis en pause
  let cumulReel = 0, cumulEstime = 0;
  const minuteurs = new Set();
  let verrou = null;

  // ---------- Écran ----------
  const iconeEtat = h("span", { style: "display:contents" }, icone("pause"));
  const bouton = h("button", { type: "button", class: "bouton-pause", "aria-label": t("voiture.pause"), onclick: basculer },
    h("span", { class: "cercle" }, h("span", { class: "anneau", "aria-hidden": "true" }), iconeEtat));
  const arreter = h("button", { type: "button", class: "btn-secondaire arreter", onclick: arreterSession }, t("voiture.arreter"));
  arreter.hidden = true;
  // En pause seulement : où on en est (rien à lire quand ça joue).
  const etatPause = h("div", { class: "etat-pause", "aria-live": "polite" });
  etatPause.hidden = true;
  const ecran = h("div", { class: "voiture-route" }, arreter, etatPause, bouton);
  racine.appendChild(ecran);
  focaliser(bouton);
  const desabonner = audio.surLecture((enCours) => ecran.classList.toggle("parle", enCours));

  // ---------- Garder l'écran allumé ----------
  async function demanderVerrou() {
    try {
      if (navigator.wakeLock && navigator.wakeLock.request) verrou = await navigator.wakeLock.request("screen");
    } catch (e) { verrou = null; /* refusé : on ne dit rien */ }
  }
  function relacherVerrou() {
    try { if (verrou) verrou.release(); } catch (e) { /* rien */ }
    verrou = null;
  }

  // ---------- Étapes interruptibles ----------
  function attendre(secondes, monJeton) {
    return new Promise((resoudre) => {
      const id = setTimeout(() => { minuteurs.delete(id); resoudre(); }, secondes * 1000);
      minuteurs.add(id);
    }).then(() => { if (monJeton !== jeton) throw ABANDON; });
  }
  function annulerMinuteurs() {
    minuteurs.forEach((id) => clearTimeout(id));
    minuteurs.clear();
  }
  async function dire(texte, langue, rate, monJeton) {
    // Une erreur de synthèse ne met jamais en pause : audio.parler() se résout toujours.
    await audio.parler(texte, { langue, rate });
    if (monJeton !== jeton) throw ABANDON;
  }

  // Un cycle (regles-session.md, section 1, Voiture).
  async function cycle(carte, j) {
    const fr = carte.texte.fr;
    const ru = aLire(carte.texte.cible); // un prénom gardé en lettres latines est affiché, pas lu
    if (carte.type === "boucle-decouverte") {
      const d = V.decouverte;
      await dire(fr, "fr", V.rateNormal, j);
      await attendre(d.apresFr, j);
      await dire(ru, "cible", V.rateLent, j);
      await attendre(d.apresLent, j);
      await dire(ru, "cible", rateNormal, j);
      await attendre(d.apresNormal1, j);
      await dire(ru, "cible", rateNormal, j);
      await attendre(d.apresNormal2, j);
    } else {
      const r = V.rappel;
      await dire(fr, "fr", V.rateNormal, j);
      await attendre(ru.length > r.seuilLong ? r.reponseLongue : r.reponse, j);
      await dire(ru, "cible", V.rateLent, j);
      await attendre(r.entreLentEtNormal, j);
      await dire(ru, "cible", rateNormal, j);
      await attendre(r.apresNormal, j);
    }
  }

  async function tourner(j) {
    try {
      if (!annonceFaite) {
        await dire(t("voiture.dit.debut"), "fr", V.rateNormal, j);
        annonceFaite = true;
      }
      for (;;) {
        if (!carteCourante) {
          carteCourante = session.prochaineCarte(horloge.secondes());
          if (!carteCourante) break; // durée atteinte
        }
        const debut = horloge.secondes();
        await cycle(carteCourante, j);
        // Durée réelle du cycle (pauses exclues) : elle corrige l'estimation de la règle d'arrêt,
        // pour ne pas lancer un dernier cycle qui ferait déborder la session.
        cumulReel += horloge.secondes() - debut;
        cumulEstime += carteCourante.est;
        session.ajusterEstimations(cumulReel / cumulEstime);
        // Le résultat n'est compté qu'une fois le cycle fini (à la reprise, il est rejoué).
        session.repondre(carteCourante, carteCourante.type === "boucle-rappel" ? "passif" : "non-note");
        carteCourante = null;
      }
      const n = session.bilan().travailles;
      await dire(n === 1 ? t("voiture.dit.fin1") : t("voiture.dit.fin", { n }), "fr", V.rateNormal, j);
      terminer("terminee");
    } catch (e) {
      if (e !== ABANDON) {
        // Erreur inattendue : on ne bloque pas l'utilisateur, on va à la fin de session.
        terminer("terminee");
      }
    }
  }

  // ---------- Pause et reprise ----------
  function mettreEnPause(parLeSysteme) {
    if (enPause || fini) return;
    enPause = true;
    pauseUtilisateur = !parLeSysteme;
    jeton++;
    annulerMinuteurs();
    horloge.pause("pause");
    audio.couper();
    if (!parLeSysteme) audio.parler(t("voiture.dit.pause"), { langue: "fr", rate: V.rateNormal });
    bouton.setAttribute("aria-label", t("voiture.reprendre"));
    iconeEtat.replaceChildren(icone("lecture"));
    arreter.hidden = false;
    const reste = Math.max(0, session.duree - horloge.secondes());
    etatPause.replaceChildren(
      h("p", { class: "etat-pause-titre" }, t("voiture.enPause")),
      h("p", null, t("voiture.phraseN", { n: Math.max(1, session.bilan().cartes) })),
      h("p", null, reste < 60 ? t("voiture.resteMoins") : t("voiture.reste", { n: Math.ceil(reste / 60) })));
    etatPause.hidden = false;
  }
  function reprendre() {
    if (!enPause || fini) return;
    enPause = false;
    const j = ++jeton;
    horloge.reprendre("pause");
    bouton.setAttribute("aria-label", t("voiture.pause"));
    iconeEtat.replaceChildren(icone("pause"));
    arreter.hidden = true;
    etatPause.hidden = true;
    demanderVerrou();
    // « On reprend. », puis le cycle en cours est rejoué depuis la phrase française.
    dire(t("voiture.dit.reprise"), "fr", V.rateNormal, j).then(() => tourner(j), () => { /* nouvelle pause */ });
  }
  function basculer() { if (enPause) reprendre(); else mettreEnPause(false); }

  function arreterSession() {
    // En pause, la voix ne dit rien.
    terminer("arret");
  }

  // Mains libres : une pause que l'utilisateur n'a pas demandée (onglet masqué, écran verrouillé)
  // se lève seule quand la page redevient visible ; la phrase en cours est relue depuis le début.
  // Une pause demandée par l'utilisateur, elle, attend qu'il touche l'écran.
  function visibilite() {
    if (document.hidden) mettreEnPause(true);
    else if (enPause && !pauseUtilisateur) reprendre();
  }
  document.addEventListener("visibilitychange", visibilite);

  function nettoyer() {
    fini = true;
    jeton++;
    annulerMinuteurs();
    document.removeEventListener("visibilitychange", visibilite);
    desabonner();
    audio.couper();
    audio.definirModeAudio("silence");
    relacherVerrou();
  }
  function terminer(raison) {
    if (fini) return;
    nettoyer();
    ctx.aller("fin", { bilan: session.bilan(), duree, dureeReelle: minutesReelles(horloge.secondes()), mode: "voiture", raison, themes });
  }

  // ---------- Démarrage ----------
  horloge.demarrer(); // l'annonce de début compte dans le temps de la session
  demanderVerrou();
  tourner(jeton);

  return {
    retour() { if (!enPause) mettreEnPause(false); return true; },
    nettoyer
  };
}
