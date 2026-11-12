// Carte « Dialogue » (docs/design/dialogues.md) : la bulle du partenaire, ta ligne avec la poupée, 2 à 3 réponses
// fixées en bas, puis le panneau de retour. Une seule bulle à l'écran : la nouvelle remplace la précédente.
// Les textes viennent du contenu (dialogues.json) et de textes.js ; la logique des répliques est dans ../dialogues.js.
//
// env (fourni par ecran-session.js) : zoneCarte, zoneBas, ctx, courant (état de la carte, lu par le clavier),
//   sonore(), lire(cible), boutonEcouter(cible), translit(texte), mode(), genre(), choisirGenre(g),
//   repondreDialogue(idElement), suivre() (rend la main à la session).

import { h, icone, vider, focaliser, mettre, motsRusses, classeLongueur } from "./dom.js";
import { poupeePerso } from "./poupee-perso.js";
import { decorSituation } from "../ambiance.js";
import { echangeResolu, reponseRetenue, dependDuGenre } from "../dialogues.js";
import { t } from "../textes.js";

export function carteDialogue(carte, env) {
  const d = carte.dialogue;
  const { zoneCarte, zoneBas, ctx, courant } = env;
  const perso = ctx.personnage();
  const situation = ctx.contenu.situations.find((s) => s.id === d.situation);
  const entete = () => h("div", { class: "ligne-lieu" }, h("h1", { class: "consigne", tabindex: "-1" }, (situation && situation.titre) || d.titre), decorSituation(d.situation));
  const barre = (...enfants) => { vider(zoneBas); zoneBas.appendChild(h("div", { class: "zone-action" }, enfants)); };

  // Genre inconnu et dialogue qui en dépend : on le demande avant la scène. « Plus tard » : la carte est passée.
  function demanderGenre() {
    vider(zoneCarte);
    mettre(zoneCarte, entete(), h("p", { class: "texte" }, t("dialogue.genre")));
    const choisir = (g) => { env.choisirGenre(g); montrer(d.echanges[0].id, null, null); };
    barre(h("div", { class: "paire" },
      h("button", { type: "button", class: "btn-secondaire", onclick: () => choisir("m") }, t("genre.m")),
      h("button", { type: "button", class: "btn-secondaire", onclick: () => choisir("f") }, t("genre.f"))),
      h("button", { type: "button", class: "btn-lien", onclick: env.suivre }, t("perso.plusTard")));
    focaliser(zoneCarte.querySelector(".consigne"));
  }

  // Un échange : la bulle (avec la réaction de la réplique d'avant), ta ligne, les réponses.
  function montrer(id, reaction, dit) {
    const e = echangeResolu(d, id, { perso, donnees: ctx.contenu.donnees, genre: env.genre() || "m", reaction });
    if (!e) { env.suivre(); return; } // contenu abîmé : on rend la main sans message
    courant.repondu = false;
    courant.suivre = null;
    const p = e.partenaire;
    const bulle = h("div", { class: "bulle", tabindex: "-1" },
      h("p", { class: "role" }, d.partenaire.role_fr),
      h("p", { class: "ru-hero " + classeLongueur(p.cible), lang: "ru" }, motsRusses(p.accent)),
      env.translit(p.translit),
      h("p", { class: "fr-bulle" }, p.fr),
      env.boutonEcouter(p.cible));
    const toi = h("div", { class: "ligne-toi" }, poupeePerso(perso, 56, false),
      h("div", null, h("b", null, perso.prenom || t("dialogue.toi")),
        h("p", { class: "petit" }, t(env.mode() === "parler" ? "dialogue.tuRepondsVoix" : "dialogue.tuReponds"))));
    vider(zoneCarte);
    zoneCarte.scrollTop = 0;
    mettre(zoneCarte, entete(), dit ? h("p", { class: "petit tu-as-dit" }, t("dialogue.tuAsDit", { fr: dit })) : null, bulle, toi);

    const liste = h("ul", { class: "options options-dialogue" }, e.reponses.map((r) =>
      h("li", null, h("button", { type: "button", class: "option", onclick: () => repondre(e, r) },
        h("span", { class: "texte-option" }, h("span", null, r.texte.fr), h("span", { class: "ru-option", lang: "ru" }, r.texte.accent))))));
    barre(h("div", { role: "group", "aria-label": t("dialogue.choix", { n: e.reponses.length }) }, liste));
    focaliser(bulle);
    if (env.sonore()) env.lire(p.cible); // la réplique du partenaire, une fois à son arrivée
  }

  // Bloc d'une réplique dans le panneau de retour : russe, translittération, français.
  const bloc = (texte) => h("div", { class: "bonne-reponse" }, h("p", { class: "ru", lang: "ru" }, texte.accent), env.translit(texte.translit), h("p", { class: "fr" }, texte.fr));

  function repondre(e, choisie) {
    if (courant.repondu) return;
    courant.repondu = true;
    const retenue = reponseRetenue(e, choisie);
    // Une bonne réplique met à jour la boîte de son élément ; une fausse ne touche à rien.
    if (choisie.juste && choisie.element) env.repondreDialogue(choisie.element);
    const verdict = h("p", { class: "verdict " + (choisie.juste ? "ok" : "ko"), role: "status", tabindex: "-1" },
      icone(choisie.juste ? "coche" : "croix"), t(choisie.juste ? "dialogue.juste" : "retour.faux"));
    const infos = h("div", { class: "retour-infos" }, h("div", { class: "ligne-verdict" }, verdict));
    if (!choisie.juste) mettre(infos, choisie.pourquoi ? h("p", { class: "petit" }, choisie.pourquoi) : null, h("p", { class: "petit" }, t("dialogue.plutot")));
    mettre(infos, bloc(retenue.texte));
    if (retenue.astuce) mettre(infos, h("div", { class: "astuce" }, h("strong", null, t("carte.astuce")), retenue.astuce));
    const suite = () => (retenue.suite ? montrer(retenue.suite, retenue.reaction, retenue.texte.fr) : env.suivre());
    courant.suivre = suite; // Entrée sur le verdict (clavier)
    vider(zoneBas);
    zoneBas.appendChild(h("div", { class: "retour" + (choisie.juste ? "" : " est-faux") }, infos,
      h("button", { type: "button", class: "btn-principal", onclick: suite }, t("retour.suivant"))));
    focaliser(verdict);
    if (env.sonore()) env.lire(retenue.texte.cible);
  }

  if (dependDuGenre(d) && !env.genre()) demanderGenre();
  else montrer(d.echanges[0].id, null, null);
}
