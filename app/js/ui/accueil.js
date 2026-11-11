// Écran d'accueil : « J'ai combien de temps ? » et « Je suis où ? », puis un bouton.
// Au deuxième lancement, les derniers choix sont déjà cochés : un seul toucher suffit.

import { h, icone, focaliser } from "./dom.js";
import { t, texteDuree } from "../textes.js";
import { INTERFACE } from "../config.js";

const ICONES_LIEU = { silence: "muet", ecouteurs: "casque", parler: "bulle", voiture: "voiture" };

export function afficherAccueil(racine, ctx, options) {
  const reglages = ctx.reglages();
  let duree = INTERFACE.dureesProposees.includes(reglages.dernierDuree) ? reglages.dernierDuree : INTERFACE.dureeParDefaut;
  let lieu = INTERFACE.modes.includes(reglages.dernierMode) ? reglages.dernierMode : null;

  const aide = h("p", { class: "aide", role: "status" });
  const libelle = h("span", { class: "libelle" });
  const sous = h("span", { class: "sous" });
  const bouton = h("button", { type: "button", class: "btn-principal deux-lignes", onclick: demarrer }, libelle, sous);

  const segments = h("div", { class: "segments" }, INTERFACE.dureesProposees.map((n) => {
    const id = "duree-" + n;
    return [
      h("input", { class: "choix-input", type: "radio", name: "duree", id, value: String(n), checked: n === duree,
        onchange: () => { duree = n; ctx.majReglage("dernierDuree", n); majBouton(); } }),
      h("label", { class: "choix", for: id },
        h("span", { class: "coche" }, icone("coche")),
        h("span", { "aria-hidden": "true" }, texteDuree(n)),
        h("span", { class: "sr-only" }, t("duree.sr", { n })))
    ];
  }));

  const lieux = h("div", { class: "lieux" }, INTERFACE.modes.map((m) => {
    const id = "lieu-" + m;
    return [
      h("input", { class: "choix-input", type: "radio", name: "lieu", id, value: m, checked: m === lieu,
        onchange: () => { lieu = m; ctx.majReglage("dernierMode", m); aide.textContent = ""; majBouton(); } }),
      h("label", { class: "choix", for: id },
        icone(ICONES_LIEU[m]),
        h("span", { class: "lieu-nom" }, t("lieu." + m)),
        h("span", { class: "lieu-ex" }, t("lieu." + m + ".ex")),
        h("span", { class: "coche" }, icone("coche")))
    ];
  }));

  const questionLieu = h("legend", { id: "q-lieu", tabindex: "-1" }, t("accueil.qLieu"));
  const ecran = h("div", { class: "ecran" },
    h("header", { class: "entete" },
      h("span", { class: "marque" }, t("accueil.marque")),
      h("nav", { "aria-label": "Navigation" },
        h("button", { type: "button", class: "btn-texte", onclick: () => ctx.aller("progres") }, icone("graphique"), t("accueil.progres")),
        h("button", { type: "button", class: "btn-texte", onclick: () => ctx.aller("reglages") }, icone("engrenage"), t("accueil.reglages")))),
    h("main", { class: "contenu" },
      h("fieldset", null, h("legend", null, t("accueil.qTemps")), segments),
      h("fieldset", { id: "fs-lieu" }, questionLieu, lieux, aide)),
    h("div", { class: "zone-action" }, bouton));
  racine.appendChild(ecran);

  function majBouton() {
    if (!lieu) {
      bouton.setAttribute("aria-disabled", "true");
      libelle.textContent = t("accueil.incomplet");
      sous.textContent = "";
    } else {
      bouton.removeAttribute("aria-disabled");
      libelle.textContent = t("accueil.go");
      sous.textContent = t("accueil.goSous", { duree: texteDuree(duree), lieu: t("lieu." + lieu + ".clair") });
    }
  }

  function demanderLieu() {
    aide.textContent = t("accueil.incompletAide");
    const premier = document.getElementById("lieu-silence");
    focaliser(premier);
    try { document.getElementById("fs-lieu").scrollIntoView({ block: "nearest" }); } catch (e) { /* rien */ }
  }

  let enPreparation = false;
  function demarrer() {
    if (!lieu) { demanderLieu(); return; }
    if (enPreparation) return;
    // Ce toucher est le geste qui autorise l'audio (sauf en Silence : aucun appel audio).
    const attente = ctx.lancer(duree, lieu);
    if (attente && typeof attente.then === "function") {
      enPreparation = true;
      libelle.textContent = t("voix.prepare");
      sous.textContent = "";
      attente.then(() => { enPreparation = false; if (bouton.isConnected) majBouton(); });
    }
  }

  majBouton();
  if (options && options.demanderLieu && !lieu) demanderLieu();
}
