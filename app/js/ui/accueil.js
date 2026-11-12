// Parcours d'accueil en étapes (bagou-ru.md, section 4) :
//   1. Je suis où ?  2. J'ai combien de temps ?  3. Sur quoi ?  puis « C'est parti ».
// Une pastille touchable par choix déjà fait permet de revenir à son étape sans perdre les autres choix.
// En voiture : étape 1, étape 2, puis « Avant le départ » (les thèmes sont « Au hasard », ou la dernière sélection
// avec « Comme la dernière fois » ; la pastille de thèmes de « Avant le départ » ramène à l'étape 3).
// Pas d'étape « Comment ? » pour l'instant (mission à venir).

import { h, icone, focaliser, vider } from "./dom.js";
import { creerMenu } from "./menu.js";
import { poupee } from "./matriochka.js";
import { decorAccueil } from "../ambiance.js";
import { t, texteDuree } from "../textes.js";
import { INTERFACE } from "../config.js";
import { dureePourLieu, basculerTheme, dernierChoix, themesValides, universInclus } from "../parcours.js";

const ICONES_LIEU = { silence: "muet", ecouteurs: "casque", parler: "bulle", voiture: "voiture" };
// Ordre des cartes de l'étape 1 : En voiture, Sans son / Écouteurs, Je peux parler.
const ORDRE_LIEUX = ["voiture", "silence", "ecouteurs", "parler"];

// « Au hasard », le titre du thème, ou « 3 thèmes » (pastilles, résumés).
export function resumeThemes(themes, situations) {
  if (!themes.length) return t("themes.hasard");
  if (themes.length === 1) { const s = situations.find((x) => x.id === themes[0]); return s ? s.titre : t("themes.pastille", { n: 1 }); }
  return t("themes.pastille", { n: themes.length });
}

// options : { etape, choix: { lieu, duree, themes } } pour revenir à une étape précise (pastilles de « Avant le départ »).
export function afficherAccueil(racine, ctx, options) {
  const opts = options || {};
  const situations = ctx.contenu.situations;
  const reglages = () => ctx.reglages();
  const dernier = dernierChoix(reglages(), situations);

  let etape = opts.etape || 1;
  let lieu = opts.choix && INTERFACE.modes.includes(opts.choix.lieu) ? opts.choix.lieu : null;
  let duree = opts.choix && INTERFACE.dureesProposees.includes(opts.choix.duree) ? opts.choix.duree : null;
  let themes = opts.choix ? themesValides(opts.choix.themes, situations) : [];
  let enPreparation = false;
  const menu = creerMenu(ctx, {});

  // ---------- Briques communes ----------
  function entete() {
    return h("header", { class: "entete" }, menu.element,
      h("span", { class: "marque" }, poupee("acquise", 24, true), t("accueil.marque")));
  }
  function past(icon, texte, versEtape) {
    return h("button", { type: "button", class: "past", "aria-label": t("past.modifier", { valeur: texte }), onclick: () => { etape = versEtape; dessiner(); } },
      icon ? icone(icon) : null, h("span", { "aria-hidden": "true" }, texte));
  }
  function pastilles(jusqua) {
    const liste = [past(ICONES_LIEU[lieu], t("lieu." + lieu), 1)];
    if (jusqua >= 3) liste.push(past(null, texteDuree(duree), 2));
    return h("div", { class: "pastilles" }, liste);
  }
  function titre(cle) { return h("h1", { class: "titre-etape", tabindex: "-1" }, t(cle)); }
  function barreBas(boutonRetour, boutonPrincipal) {
    return h("div", { class: "zone-action deux-boutons" }, boutonRetour, boutonPrincipal);
  }
  function boutonRetour(versEtape) {
    return h("button", { type: "button", class: "btn-secondaire", onclick: () => { etape = versEtape; dessiner(); } }, icone("retour"), t("nav.retour"));
  }
  // Ce toucher est le geste qui autorise l'audio (sauf en Silence : ctx.lancer n'appelle rien).
  function lancerSession(l, d, th, libelle, sous) {
    if (enPreparation) return;
    const attente = ctx.lancer(d, l, { themes: th });
    if (attente && typeof attente.then === "function") {
      enPreparation = true;
      libelle.textContent = t("voix.prepare");
      if (sous) sous.textContent = "";
      attente.then(() => { enPreparation = false; if (libelle.isConnected) dessiner(); });
    }
  }

  // ---------- Étape 1 : Je suis où ? ----------
  function etape1() {
    const cartes = ORDRE_LIEUX.map((m) => h("button", { type: "button", class: "carte-lieu", id: "lieu-" + m, onclick: () => choisirLieu(m) },
      icone(ICONES_LIEU[m]),
      h("span", null, h("span", { class: "lieu-nom" }, t("lieu." + m)), h("span", { class: "lieu-ex" }, t("lieu." + m + ".ex")))));
    const decor = decorAccueil();
    const contenu = h("main", { class: "contenu contenu-accueil" }, titre("accueil.qLieu"), h("div", { class: "lieux" }, cartes), decor);
    let bas = null;
    if (dernier) {
      const libelle = h("span", { class: "libelle" }, t("accueil.derniere"));
      const sous = h("span", { class: "sous" }, t("accueil.derniereSous", {
        lieu: t("lieu." + dernier.lieu + ".court"), duree: texteDuree(dernier.duree), themes: resumeThemes(dernier.themes, situations) }));
      // 1 appui : relance exactement le dernier choix (lieu, durée, thèmes).
      const bouton = h("button", { type: "button", class: "btn-principal deux-lignes", id: "derniere-fois",
        onclick: () => lancerSession(dernier.lieu, dernier.duree, dernier.themes, libelle, sous) }, libelle, sous);
      bas = h("div", { class: "zone-action" }, bouton);
    }
    return [h("p", { class: "slogan" }, t("accueil.slogan")), contenu, bas];
  }
  function choisirLieu(m) {
    // Même lieu : on garde la durée déjà choisie. Autre lieu : durée préremplie de ce lieu (mémoire par lieu).
    if (m !== lieu || duree === null) duree = dureePourLieu(m, reglages().dureeParLieu);
    lieu = m;
    etape = 2;
    dessiner();
  }

  // ---------- Étape 2 : J'ai combien de temps ? ----------
  function etape2() {
    const prerempli = dureePourLieu(lieu, reglages().dureeParLieu);
    const lignes = h("fieldset", { class: "lignes" }, h("legend", { class: "sr-only" }, t("accueil.qTemps")),
      INTERFACE.dureesProposees.map((n) => {
        const id = "duree-" + n;
        return [
          h("input", { class: "choix-input", type: "radio", name: "duree", id, value: String(n), checked: n === duree, onchange: () => { duree = n; } }),
          h("label", { class: "choix ligne-choix", for: id },
            h("span", { class: "rond" }, icone("coche")),
            h("span", { class: "texte-ligne" },
              h("span", { "aria-hidden": "true" }, texteDuree(n)),
              h("span", { class: "sr-only" }, t("duree.sr", { n })),
              h("small", null, t("duree." + n + ".sous"))),
            n === prerempli ? h("span", { class: "etiquette" }, t("duree.prerempli", { lieu: t("lieu." + lieu + ".court") })) : null)
        ];
      }));
    const suite = h("button", { type: "button", class: "btn-principal btn-ligne", id: "suite", onclick: () => {
      ctx.majReglage("dureeParLieu", Object.assign({}, reglages().dureeParLieu, { [lieu]: duree }));
      if (lieu === "voiture") ctx.lancer(duree, "voiture", { themes }); // étapes 3 et 4 sautées : Avant le départ
      else { etape = 3; dessiner(); }
    } }, t("nav.suite"), icone("suite"));
    return [
      h("main", { class: "contenu" }, pastilles(2), titre("accueil.qTemps"), lignes, h("p", { class: "consigne-etape" }, t("duree.consigne"))),
      barreBas(boutonRetour(1), suite)
    ];
  }

  // shortcut: pas d'étape « Comment ? » ni de bouton « Changer » (mission à venir), la façon d'apprendre reste « Phrases du quotidien ».
  // ---------- Étape 3 : Sur quoi ? ----------
  function etape3() {
    const entrees = []; // { input, theme }
    const hasard = h("input", { class: "choix-input", type: "checkbox", id: "theme-hasard", checked: themes.length === 0,
      onchange: () => { themes = []; majTuiles(); majBouton(); } });
    const tuileHasard = [hasard, h("label", { class: "choix tuile-hasard", for: "theme-hasard" },
      h("span", { class: "case" }, icone("coche")), icone("hasard"),
      h("span", null, t("themes.hasard"), h("small", null, t("themes.hasardSous"))))];
    const grille = h("div", { class: "themes" }, situations.map((s) => {
      const id = "theme-" + s.id;
      const input = h("input", { class: "choix-input", type: "checkbox", id, value: s.id, checked: themes.includes(s.id),
        onchange: () => { themes = basculerTheme(themes, s.id, situations); majTuiles(); majBouton(); } });
      entrees.push(input);
      return [input, h("label", { class: "choix tuile-theme", for: id }, h("span", { class: "case" }, icone("coche")), h("span", null, s.titre))];
    }));
    // Le seul choix des univers (R8) : actif par défaut, enregistré tout de suite, modifiable aussi dans Réglages.
    const univers = h("input", { class: "choix-input", type: "checkbox", id: "univers-inclus", checked: universInclus(reglages()),
      onchange: () => ctx.majReglage("universInclus", univers.checked) });
    const tuileUnivers = [univers, h("label", { class: "choix tuile-hasard", for: "univers-inclus" },
      h("span", { class: "case" }, icone("coche")),
      h("span", null, t("univers.inclure"), h("small", null, t("univers.sous"))))];
    // Cocher un thème décoche « Au hasard » ; tout décocher remet « Au hasard ».
    function majTuiles() {
      hasard.checked = themes.length === 0;
      entrees.forEach((i) => { i.checked = themes.includes(i.value); });
    }
    const libelle = h("span", { class: "libelle" });
    const sous = h("span", { class: "sous" });
    const go = h("button", { type: "button", class: "btn-principal deux-lignes", id: "c-est-parti", onclick: () => {
      if (lieu === "voiture") ctx.lancer(duree, "voiture", { themes });
      else lancerSession(lieu, duree, themes, libelle, sous);
    } }, libelle, sous);
    function majBouton() {
      libelle.textContent = t("accueil.go");
      sous.textContent = themes.length === 0 ? t("themes.hasard") : themes.length === 1 ? t("themes.choisi1") : t("themes.choisis", { n: themes.length });
    }
    majBouton();
    return [
      h("main", { class: "contenu" }, pastilles(3), titre("themes.question"), tuileHasard, grille, ctx.contenu.univers && ctx.contenu.univers.length ? tuileUnivers : null),
      barreBas(boutonRetour(2), go)
    ];
  }

  // ---------- Dessin ----------
  function dessiner() {
    vider(racine);
    const parties = etape === 3 ? etape3() : etape === 2 && lieu ? etape2() : (etape = 1, etape1());
    racine.appendChild(h("div", { class: "ecran" }, entete(), parties));
    focaliser(racine.querySelector(".titre-etape"));
  }

  dessiner();
  return { nettoyer() { menu.fermer(); } };
}
