// Écrans simples : Fin de session, Mes progrès, Réglages, Pas de voix.
// Tous ont « Menu » en haut à gauche ; Mes progrès et Réglages ont « Retour » en bas (bagou-ru.md, 5).

import { h, icone, focaliser, segments } from "./dom.js";
import { creerMenu } from "./menu.js";
import { poupee, poupeeColorie, rangeeGigogne, etatDe } from "./matriochka.js";
import { t, texteDuree } from "../textes.js";
import { texteElement } from "../contenu.js";
import { poupeePerso } from "./poupee-perso.js";
import { nomMetier } from "./ecran-personnage.js";

// « Tu sais dire N phrases » (écran de fin et Mes progrès).
function phrasesSues(n) { return n === 0 ? t("progres.cle0") : n === 1 ? t("progres.cle1") : t("progres.cle", { n }); }

function nombrePhrases(n) { return n === 1 ? t("fin.phrase1") : t("fin.phrases", { n }); }

// En-tête commun : Menu à gauche, titre de l'écran à droite (facultatif).
function entete(ctx, ici, titre) {
  const menu = creerMenu(ctx, { ici });
  return { menu, element: h("header", { class: "entete" }, menu.element, titre ? h("h1", { class: "titre-page", tabindex: "-1" }, titre) : null) };
}
function boutonRetour(ctx) {
  return h("div", { class: "zone-action" },
    h("button", { type: "button", class: "btn-secondaire", id: "retour", onclick: () => ctx.retourAccueil() }, icone("retour"), t("nav.retour")));
}

// ---------- 6. Fin de session ----------
export function afficherFin(racine, ctx, { bilan, duree, dureeReelle, mode, raison, themes, progres }) {
  const tete = entete(ctx, null, null);
  const vide = raison === "arret" && bilan.cartes === 0;
  const titreTexte = vide ? t("fin.titreVide") : (raison === "arret" ? t("fin.titreArret") : t("fin.titre", { duree: texteDuree(dureeReelle || duree) }));
  const titre = h("h1", { class: "titre-ecran", tabindex: "-1" }, titreTexte);
  const contenu = h("main", { class: "contenu" }, titre);
  // Poupées qui ont progressé : elles se colorient l'une après l'autre (6 animées au plus, les autres changent sans mouvement).
  if (progres && progres.length) {
    contenu.appendChild(h("div", { class: "poupees fin-poupees", "aria-hidden": "true" },
      progres.map((p, i) => poupeeColorie(i < 6 ? p.avant : p.apres, p.apres, 30, true, i * 120))));
  }

  if (!vide) {
    if (bilan.decouverts.length) {
      contenu.appendChild(h("section", { class: "bloc" },
        h("h2", { class: "intertitre" }, t("fin.decouvert") + " " + nombrePhrases(bilan.decouverts.length)),
        h("ul", { class: "liste-phrases" }, bilan.decouverts.map((id) => {
          const el = ctx.contenu.parId.get(id);
          const texte = texteElement(el, { genre: ctx.reglages().genre, remplacement: 0 });
          return h("li", null, h("p", { class: "ru", lang: "ru" }, texte.accent), h("p", { class: "petit" }, texte.fr));
        }))));
    }
    if (bilan.revises.length) {
      contenu.appendChild(h("section", { class: "bloc" },
        h("h2", { class: "intertitre" }, t("fin.revise") + " " + nombrePhrases(bilan.revises.length))));
    }
    // « Tu sais dire N phrases » : les phrases acquises, même calcul que Mes progrès.
    // Tant que rien n'est acquis (les 7 premiers jours), « 0 phrase » décourage : on explique plutôt.
    contenu.appendChild(h("p", { class: "bloc" }, bilan.totalAcquis === 0 ? t("fin.enCours") : phrasesSues(bilan.totalAcquis)));
    if (bilan.nouveauxAcquis > 0) {
      contenu.appendChild(h("p", { class: "succes" }, icone("coche"),
        bilan.nouveauxAcquis === 1 ? t("fin.acquise1") : t("fin.acquises", { n: bilan.nouveauxAcquis })));
    }
    if (bilan.toutVu) contenu.appendChild(h("p", { class: "bloc petit" }, t("fin.toutVu")));
  }

  const encore = h("button", { type: "button", class: "btn-principal", onclick: () => ctx.lancer(duree, mode, { themes: themes || [], bouton: encore }) },
    t("fin.encore", { duree: texteDuree(duree) }));
  racine.appendChild(h("div", { class: "ecran" }, tete.element, contenu,
    h("div", { class: "zone-action" }, encore,
      h("button", { type: "button", class: "btn-secondaire", onclick: () => ctx.retourAccueil() }, t("fin.accueil")))));
  focaliser(titre);
  return { nettoyer() { tete.menu.fermer(); } };
}

// ---------- 7. Mes progrès ----------
// Une rangée de poupées gigognes par thème (une poupée par phrase, état = forme + mot écrit dans le texte).
export function afficherProgres(racine, ctx) {
  const fiches = ctx.stockage.fiches;
  const tete = entete(ctx, "progres", t("menu.progres"));
  const vus = ctx.contenu.elements.filter((e) => { const f = fiches.get(e.id); return f && f.boite >= 1; }).length;
  const total = ctx.contenu.elements.filter((e) => etatDe(fiches.get(e.id)) === "acquise").length;
  const videEtat = vus === 0 && total === 0;

  const contenu = h("main", { class: "contenu" });
  if (videEtat) {
    contenu.appendChild(h("p", { class: "texte" }, t("progres.vide")));
  } else {
    // La poupée du haut est le personnage : la toucher ouvre son édition (jamais dans une rangée de progression).
    const perso = ctx.personnage();
    contenu.appendChild(h("div", { class: "cle-progres" },
      h("button", { type: "button", class: "btn-perso", "aria-label": t("perso.titre"), onclick: () => ctx.aller("personnage", { depuis: "progres" }) }, poupeePerso(perso, 56, true)),
      h("div", null, perso.prenom ? h("small", null, perso.prenom) : null, h("b", null, phrasesSues(total)), h("small", null, t("progres.surTotal", { total: ctx.contenu.elements.length })))));
    // Légende : chaque état = sa forme + son mot (la couleur seule ne dit rien).
    contenu.appendChild(h("ul", { class: "legende-etats" }, ["pas_vue", "vue", "en_cours", "acquise"].map((e) =>
      h("li", null, poupee(e, 28, true), t("etat." + e)))));
    contenu.appendChild(h("div", null, ctx.contenu.situations.map((s) => {
      const ids = s.ids.filter((id) => ctx.contenu.parId.has(id));
      const etats = ids.map((id) => etatDe(fiches.get(id)));
      const nbAcquis = etats.filter((e) => e === "acquise").length;
      const toutAcquis = ids.length > 0 && nbAcquis === ids.length;
      const rangee = rangeeGigogne(etats);
      if (toutAcquis) rangee.classList.add("emboite"); // les poupées s'emboîtent (300 ms, sans mouvement si « réduire les animations »)
      return h("section", { class: "theme-progres" },
        h("div", { class: "sr-only" }, t("progres.ligneSr", { titre: s.titre, acquises: nbAcquis, total: ids.length })),
        h("div", { class: "ligne", "aria-hidden": "true" },
          h("span", { class: "nom" }, s.titre),
          h("span", { class: "compte" }, toutAcquis ? t("theme.toutAcquis") : t(nbAcquis > 1 ? "progres.ligne" : "progres.ligne1", { acquises: nbAcquis, total: ids.length }))),
        rangee);
    })));
  }
  racine.appendChild(h("div", { class: "ecran ecran-progres" }, tete.element, contenu, boutonRetour(ctx)));
  focaliser(racine.querySelector("h1"));
  return { nettoyer() { tete.menu.fermer(); } };
}

// ---------- 8. Réglages ----------
export function afficherReglages(racine, ctx) {
  const r = ctx.reglages();

  const interrupteur = h("button", { type: "button", role: "switch", class: "interrupteur", "aria-checked": String(r.translitteration !== false),
    "aria-describedby": "aide-translit",
    onclick: () => {
      const actif = interrupteur.getAttribute("aria-checked") !== "true";
      interrupteur.setAttribute("aria-checked", String(actif));
      ctx.majReglage("translitteration", actif);
    } },
    h("span", { class: "libelle" }, t("reglages.translit")), h("span", { class: "piste", "aria-hidden": "true" }));

  // Première ligne : mon personnage (poupée, prénom, métier), touchable.
  function cartePersonnage() {
    const perso = ctx.personnage();
    const entree = (ctx.contenu.donnees && ctx.contenu.donnees.metiers || []).find((m) => m.id === perso.metier);
    return h("button", { type: "button", class: "carte-perso", onclick: () => ctx.aller("personnage", { depuis: "reglages" }) },
      poupeePerso(perso, 56, true),
      h("span", null, h("b", null, perso.prenom || t("perso.titre")),
        h("small", null, entree ? t("perso.carte", { metier: nomMetier(entree, r.genre) }) : t("perso.carteVide"))),
      icone("suite"));
  }
  const tete = entete(ctx, "reglages", t("reglages.titre"));
  const ecran = h("div", { class: "ecran" },
    tete.element,
    h("main", { class: "contenu" },
      cartePersonnage(),
      h("div", { class: "reglage" }, interrupteur, h("p", { class: "aide-reglage", id: "aide-translit" }, t("reglages.translitAide"))),
      segments("genre", t("reglages.genre"), t("reglages.genreAide"),
        [["m", t("genre.m")], ["f", t("genre.f")]], r.genre, (v) => ctx.majReglage("genre", v), "deux texte-long"),
      // Aucun son à l'aperçu : on peut être en Silence.
      segments("vitesse", t("reglages.vitesse"), t("reglages.vitesseAide"),
        [["normale", t("reglages.normale")], ["lente", t("reglages.lente")]], r.vitesseVoix || "normale", (v) => ctx.majReglage("vitesseVoix", v), "deux"),
      h("div", { class: "reglage" }, h("fieldset", null,
        h("legend", null, t("reglages.apparence")),
        h("div", { class: "segments trois" }, [["auto", t("reglages.auto")], ["light", t("reglages.clair")], ["dark", t("reglages.sombre")]].map(([v, libelle]) => {
          const id = "apparence-" + v;
          return [
            h("input", { class: "choix-input", type: "radio", name: "apparence", id, value: v, checked: v === (r.apparence || "auto"),
              onchange: () => { ctx.majReglage("apparence", v); ctx.appliquerTheme(); } }),
            h("label", { class: "choix", for: id }, h("span", { class: "coche" }, icone("coche")), h("span", null, libelle))
          ];
        })))),
      h("p", { class: "pied" }, t("reglages.pied"))),
    boutonRetour(ctx));
  racine.appendChild(ecran);
  focaliser(ecran.querySelector("h1"));
  return { nettoyer() { tete.menu.fermer(); } };
}

// ---------- 5. Pas de voix ----------
// variante : "cible" (Écouteurs, Je peux parler), "voiture" (pas de voix russe), "fr" (pas de voix française)
export function afficherSansVoix(racine, ctx, { variante, duree, themes }) {
  const tete = entete(ctx, null, null);
  const enVoiture = variante !== "cible";
  const titre = h("h1", { class: "titre-ecran", tabindex: "-1" }, t(variante === "fr" ? "sansVoixFr.titre" : "sansVoix.titre"));
  const texte = variante === "fr" ? t("sansVoixFr.texte") : (variante === "voiture" ? t("sansVoix.voitureTexte") : t("sansVoix.texte"));
  const aide = variante === "fr"
    ? h("details", null, h("summary", null, t("sansVoixFr.aide")), h("p", null, t("sansVoixFr.ios")), h("p", null, t("sansVoixFr.android")), h("p", null, t("sansVoix.ensuite")))
    : h("details", null, h("summary", null, t("sansVoix.aide")), h("p", null, t("sansVoix.ios")), h("p", null, t("sansVoix.android")), h("p", null, t("sansVoix.ensuite")));
  const boutons = enVoiture
    // En Voiture, on ne propose pas le mode Silence : on ne pousse pas à lire au volant.
    ? [h("button", { type: "button", class: "btn-principal", onclick: () => ctx.retourAccueil() }, t("sansVoix.accueil"))]
    : [h("button", { type: "button", class: "btn-principal", onclick: () => { ctx.majReglage("dernierMode", "silence"); ctx.lancer(duree, "silence", { themes: themes || [] }); } }, t("sansVoix.silence")),
       h("button", { type: "button", class: "btn-secondaire", onclick: () => ctx.retourAccueil() }, t("sansVoix.accueil"))];
  racine.appendChild(h("div", { class: "ecran" }, tete.element,
    h("main", { class: "contenu" }, titre, h("p", { class: "texte" }, texte), aide),
    h("div", { class: "zone-action" }, boutons)));
  focaliser(titre);
  return { nettoyer() { tete.menu.fermer(); } };
}
