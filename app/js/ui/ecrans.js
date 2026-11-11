// Écrans simples : Fin de session, Mes progrès, Réglages, Pas de voix.

import { h, icone, focaliser } from "./dom.js";
import { t, texteDuree } from "../textes.js";
import { estAcquis } from "../leitner.js";
import { texteElement } from "../contenu.js";

// « Tu sais dire N phrases. » (écran de fin et Mes progrès).
function phrasesSues(n) { return n === 0 ? t("progres.tete0") : n === 1 ? t("progres.tete1") : t("progres.tete", { total: n }); }

function nombrePhrases(n) { return n === 1 ? t("fin.phrase1") : t("fin.phrases", { n }); }

function enteteRetour(ctx, titre) {
  return h("header", { class: "entete avec-retour" },
    h("button", { type: "button", class: "btn-icone", "aria-label": t("voiture.retour"), onclick: () => ctx.retourAccueil() }, icone("retour")),
    titre ? h("h1", null, titre) : null);
}

// ---------- 6. Fin de session ----------
export function afficherFin(racine, ctx, { bilan, duree, mode, raison }) {
  const vide = raison === "arret" && bilan.cartes === 0;
  const titreTexte = vide ? t("fin.titreVide") : (raison === "arret" ? t("fin.titreArret") : t("fin.titre", { duree: texteDuree(duree) }));
  const titre = h("h1", { class: "titre-ecran", tabindex: "-1" }, titreTexte);
  const contenu = h("main", { class: "contenu" }, titre);

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

  const encore = h("button", { type: "button", class: "btn-principal", onclick: () => ctx.lancer(duree, mode, encore) },
    t("fin.encore", { duree: texteDuree(duree) }));
  racine.appendChild(h("div", { class: "ecran" }, contenu,
    h("div", { class: "zone-action" }, encore,
      h("button", { type: "button", class: "btn-secondaire", onclick: () => ctx.retourAccueil() }, t("fin.accueil")))));
  focaliser(titre);
  return { nettoyer() {} };
}

// ---------- 7. Mes progrès ----------
export function afficherProgres(racine, ctx) {
  const fiches = ctx.stockage.fiches;
  const acquis = (id) => estAcquis(fiches.get(id));
  const vus = ctx.contenu.elements.filter((e) => { const f = fiches.get(e.id); return f && f.boite >= 1; }).length;
  const total = ctx.contenu.elements.filter((e) => acquis(e.id)).length;
  const videEtat = vus === 0 && total === 0;

  const tete = videEtat ? t("progres.vide") : phrasesSues(total);
  const liste = h("ul", { class: "situations" }, ctx.contenu.situations.map((s) => {
    const nb = s.ids.filter((id) => ctx.contenu.parId.has(id)).length;
    const nbAcquis = s.ids.filter(acquis).length;
    return h("li", { class: "situation", "aria-label": t("progres.ligneSr", { titre: s.titre, acquises: nbAcquis, total: nb }) },
      h("div", { class: "ligne", "aria-hidden": "true" },
        h("span", { class: "nom" }, s.titre),
        h("span", { class: "compte" }, t("progres.ligne", { acquises: nbAcquis, total: nb }))),
      h("div", { class: "barre", "aria-hidden": "true" }, h("span", { style: "width:" + (nb ? Math.round((nbAcquis / nb) * 100) : 0) + "%" })));
  }));
  const ecran = h("div", { class: "ecran" },
    enteteRetour(ctx, t("progres.titre")),
    h("main", { class: "contenu" }, h("p", null, tete), liste));
  if (videEtat) {
    ecran.appendChild(h("div", { class: "zone-action" },
      h("button", { type: "button", class: "btn-principal", onclick: () => ctx.commencer() }, t("progres.commencer"))));
  }
  racine.appendChild(ecran);
  focaliser(ecran.querySelector("h1"));
  return { nettoyer() {} };
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

  // Groupe de segments codé en radios natifs.
  function segments(nom, legende, aide, choix, valeur, surChoix, classe) {
    return h("div", { class: "reglage" }, h("fieldset", null,
      h("legend", null, legende),
      h("p", { class: "aide-reglage" }, aide),
      h("div", { class: "segments " + classe }, choix.map(([v, libelle]) => {
        const id = nom + "-" + v;
        return [
          h("input", { class: "choix-input", type: "radio", name: nom, id, value: v, checked: v === valeur, onchange: () => surChoix(v) }),
          h("label", { class: "choix", for: id }, h("span", { class: "coche" }, icone("coche")), h("span", null, libelle))
        ];
      }))));
  }

  const ecran = h("div", { class: "ecran" },
    enteteRetour(ctx, t("reglages.titre")),
    h("main", { class: "contenu" },
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
      h("p", { class: "pied" }, t("reglages.pied"))));
  racine.appendChild(ecran);
  focaliser(ecran.querySelector("h1"));
  return { nettoyer() {} };
}

// ---------- 5. Pas de voix ----------
// variante : "cible" (Écouteurs, Je peux parler), "voiture" (pas de voix russe), "fr" (pas de voix française)
export function afficherSansVoix(racine, ctx, { variante, duree }) {
  const enVoiture = variante !== "cible";
  const titre = h("h1", { class: "titre-ecran", tabindex: "-1" }, t(variante === "fr" ? "sansVoixFr.titre" : "sansVoix.titre"));
  const texte = variante === "fr" ? t("sansVoixFr.texte") : (variante === "voiture" ? t("sansVoix.voitureTexte") : t("sansVoix.texte"));
  const aide = variante === "fr"
    ? h("details", null, h("summary", null, t("sansVoixFr.aide")), h("p", null, t("sansVoixFr.ios")), h("p", null, t("sansVoixFr.android")), h("p", null, t("sansVoix.ensuite")))
    : h("details", null, h("summary", null, t("sansVoix.aide")), h("p", null, t("sansVoix.ios")), h("p", null, t("sansVoix.android")), h("p", null, t("sansVoix.ensuite")));
  const boutons = enVoiture
    // En Voiture, on ne propose pas le mode Silence : on ne pousse pas à lire au volant.
    ? [h("button", { type: "button", class: "btn-principal", onclick: () => ctx.retourAccueil() }, t("sansVoix.accueil"))]
    : [h("button", { type: "button", class: "btn-principal", onclick: () => { ctx.majReglage("dernierMode", "silence"); ctx.lancer(duree, "silence"); } }, t("sansVoix.silence")),
       h("button", { type: "button", class: "btn-secondaire", onclick: () => ctx.retourAccueil() }, t("sansVoix.accueil"))];
  racine.appendChild(h("div", { class: "ecran" },
    h("main", { class: "contenu" }, titre, h("p", { class: "texte" }, texte), aide),
    h("div", { class: "zone-action" }, boutons)));
  focaliser(titre);
  return { nettoyer() {} };
}
