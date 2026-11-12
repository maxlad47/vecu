// Écran du test de niveau : 12 questions à choix, arrêt après 2 erreurs de suite, puis le résultat.
// Logique dans test-niveau.js ; ici seulement l'affichage et l'écriture des boîtes (une fiche par témoin, dès la réponse).

import { h, icone, vider, focaliser, annoncer } from "./dom.js";
import { creerMenu } from "./menu.js";
import * as audio from "../audio.js";
import { t } from "../textes.js";
import { aLire } from "../contenu.js";
import { AUDIO, INTERFACE } from "../config.js";
import { ficheVide, appliquerTest } from "../leitner.js";
import { preparerTest, etatInitial, repondre, estTermine, bilanTest } from "../test-niveau.js";

// depuis : "reglages" ou "accueil" (où l'on revient). mode : silence, ecouteurs ou parler.
export function afficherTest(racine, ctx, { mode, depuis }) {
  const questions = preparerTest(ctx.contenu.test, ctx.contenu, Math.random);
  const sonore = mode === "ecouteurs" || mode === "parler"; // en Silence, le bouton Écouter n'existe pas
  audio.definirModeAudio(sonore ? mode : "silence");
  let etat = etatInitial();
  let ouverte = true;   // faux une fois l'écran quitté : plus de minuteur ni de lecture
  let minuteur = null;
  let lectureId = 0;

  const menu = creerMenu(ctx, {});
  const contenu = h("main", { class: "contenu" });
  const bas = h("div", { class: "zone-action" });
  racine.appendChild(h("div", { class: "ecran ecran-test" }, h("header", { class: "entete" }, menu.element), contenu, bas));

  function suite() {
    if (depuis === "reglages") ctx.aller("reglages");
    else ctx.aller("accueil", { etape: 2, choix: { lieu: mode } });
  }

  // Écrit le témoin en boîte 2 (réussi) ou 1 (raté), seulement s'il n'était jamais vu.
  function noter(q, juste) {
    const avant = ctx.stockage.fiches.get(q.id) || ficheVide(q.id);
    const apres = appliquerTest(avant, { jour: ctx.jour(), mode, resultat: juste ? "reussite" : "echec", remplacement: q.remplacement });
    if (apres !== avant) ctx.stockage.ecrireFiche(apres);
  }

  // Lit les 3 réponses russes, l'une après l'autre (voix de l'appareil).
  async function ecouter(q, bouton) {
    const mienne = ++lectureId;
    const libelle = bouton.querySelector(".libelle-ecoute");
    libelle.textContent = t("carte.ecouteEnCours");
    const rate = ctx.reglages().vitesseVoix === "lente" ? AUDIO.rateLente : AUDIO.rateNormale;
    for (const o of q.options) {
      const fin = await audio.parler(aLire(o.texte.cible), { langue: "cible", rate });
      if (!ouverte || mienne !== lectureId || fin !== "fini") break;
    }
    if (mienne === lectureId) libelle.textContent = t("carte.ecouter");
  }

  function afficherQuestion() {
    const n = etat.reponses.length;
    const q = questions[n];
    vider(contenu); vider(bas);
    const titre = h("h1", { class: "consigne", tabindex: "-1" }, t("test.consigne"));
    const liste = h("ul", { class: "options" });
    let repondu = false;
    q.options.forEach((o) => {
      const bouton = h("button", { type: "button", class: "option" + (ctx.reglages().translitteration ? " avec-translit" : "") },
        h("span", { class: "texte-option" }, h("span", { class: "ru", lang: "ru" }, o.texte.accent),
          ctx.reglages().translitteration && o.texte.translit ? h("p", { class: "translit", lang: "fr" }, o.texte.translit) : null),
        h("span", { class: "etat" }), h("span", { class: "sr-only sr-etat" }));
      bouton.addEventListener("click", () => {
        if (repondu) return;
        repondu = true;
        repondreA(q, o, bouton, liste);
      });
      liste.appendChild(h("li", null, bouton));
    });
    let ecoute = null;
    if (sonore) {
      ecoute = h("button", { type: "button", class: "btn-ecouter" }, icone("hautParleur"), h("span", { class: "libelle-ecoute" }, t("carte.ecouter")));
      ecoute.addEventListener("click", () => { if (ecoute.querySelector(".libelle-ecoute").textContent === t("carte.ecouter")) ecouter(q, ecoute); });
    }
    contenu.append(h("p", { class: "petit test-progression" }, t("test.progression", { n: n + 1, total: questions.length })),
      titre, h("p", { class: "fr-hero test-phrase" }, q.fr), ecoute, liste);
    focaliser(titre);
  }

  function repondreA(q, option, bouton, liste) {
    lectureId++; audio.couper(); // une lecture en cours s'arrête
    const juste = option.juste;
    liste.querySelectorAll(".option").forEach((b, i) => {
      const o = q.options[i];
      b.setAttribute("aria-disabled", "true");
      const e = b.querySelector(".etat"), sr = b.querySelector(".sr-etat");
      if (b === bouton && juste) { b.classList.add("est-juste"); e.appendChild(icone("coche")); sr.textContent = ", " + t("sr.bonne"); }
      else if (b === bouton) { b.classList.add("est-faux"); e.appendChild(icone("croix")); sr.textContent = ", " + t("sr.fauxChoisi"); }
      else if (o.juste) { b.classList.add("est-reponse"); e.appendChild(icone("coche")); sr.textContent = ", " + t("sr.bonne"); }
      else b.classList.add("est-autre");
    });
    noter(q, juste);
    etat = repondre(etat, juste);
    annoncer(t(juste ? "retour.juste" : "retour.faux"));
    const avancer = () => { clearTimeout(minuteur); if (ouverte) estTermine(etat, questions.length) ? afficherResultat() : afficherQuestion(); };
    bas.appendChild(h("button", { type: "button", class: "btn-principal", onclick: avancer }, t("test.continuer")));
    // Réussi : on avance seul après 1,2 s ; raté : on attend « Continuer ».
    if (juste) minuteur = setTimeout(avancer, INTERFACE.avanceAutoMs);
  }

  function afficherResultat() {
    const b = bilanTest(etat, questions, ctx.contenu.situations.length);
    vider(contenu); vider(bas);
    const titre = h("h1", { class: "titre-ecran", tabindex: "-1" }, t("test.resultatTitre"));
    const bloc = h("div", { class: "test-resultat" }, titre);
    if (b.genre === "zero") bloc.appendChild(h("p", { class: "test-bilan" }, t("test.zero")));
    else {
      bloc.appendChild(h("p", { class: "test-bilan" }, b.reussies === 1 ? t("test.x1", { total: b.total }) : t("test.x", { n: b.reussies, total: b.total })));
      bloc.appendChild(h("p", null, t(b.genre === "tout" ? "test.tout" : b.genre === "arret" ? "test.arret" : "test.partiel", { n: questions.length })));
      // Score élevé : on dit honnêtement que le contenu s'arrête là (sauf si le message « tout » l'a déjà dit).
      if (b.eleve && b.genre !== "tout") bloc.appendChild(h("p", null, t("test.limite")));
    }
    bloc.append(h("p", { class: "petit" }, t("test.decouvrir")), h("p", { class: "petit" }, t("test.honnete")));
    contenu.appendChild(bloc);
    bas.appendChild(h("button", { type: "button", class: "btn-principal", onclick: suite }, t("test.continuer")));
    focaliser(titre);
  }

  if (questions.length) afficherQuestion(); else afficherResultat();
  return { nettoyer() { ouverte = false; clearTimeout(minuteur); lectureId++; audio.couper(); menu.fermer(); } };
}
