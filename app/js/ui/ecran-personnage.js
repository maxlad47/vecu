// « Mon personnage » en 2 écrans courts (docs/design/personnage.md, section 3) :
// A « Moi, en quelques mots » (prénom, genre, métier) et B « Ma poupée » (couleurs, motif).
// Tout s'enregistre au toucher. Aucun son. Le genre est le même réglage que celui de Réglages.

import { h, icone, focaliser, vider, segments } from "./dom.js";
import { creerMenu } from "./menu.js";
import { ouvrirFeuille } from "./feuille.js";
import { poupeePerso } from "./poupee-perso.js";
import { t } from "../textes.js";
import { COMBINAISONS, MOTIFS, PRENOM_MAX, personnageVide, validerPersonnage, convertirPrenom } from "../personnage.js";

const majuscule = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);

// Nom d'un métier au genre de l'utilisateur ; les deux formes tant que le genre est inconnu.
export function nomMetier(entree, genre) {
  const m = entree.m.fr, f = entree.f.fr;
  if (genre === "f") return f;
  if (genre === "m" || m === f) return m;
  return m + " / " + f;
}

// depuis : écran où revenir (« reglages », « progres », sinon l'accueil). etape : « A » ou « B ».
export function afficherPersonnage(racine, ctx, { depuis, etape: etapeDepart }) {
  const retourVers = depuis === "reglages" || depuis === "progres" ? depuis : "accueil";
  const edition = retourVers !== "accueil";
  const donnees = ctx.contenu.donnees || {};
  const metiers = donnees.metiers || [];
  let perso = ctx.personnage();
  let etape = etapeDepart === "B" ? "B" : "A";
  let feuilleOuverte = null, fermerMetiers = null;
  const menu = creerMenu(ctx, {});
  const enregistrer = () => { ctx.majPersonnage(perso); perso = ctx.personnage(); };
  const genre = () => ctx.reglages().genre;

  function dessiner() {
    vider(racine);
    const parties = etape === "A" ? ecranA() : ecranB();
    racine.appendChild(h("div", { class: "ecran ecran-personnage" }, h("header", { class: "entete" }, menu.element), parties));
    focaliser(racine.querySelector(".titre-etape"));
  }

  // ---------- Écran A ----------
  function ecranA() {
    // Prénom en russe : proposé automatiquement, corrigeable, ou gardé en lettres latines.
    let corrige = false;   // le cyrillique est en cours de correction à la main
    let latin = !!perso.prenom && !perso.prenomRu;
    const zoneRusse = h("div", { class: "russe" });
    const champ = h("input", { class: "champ", type: "text", id: "perso-prenom", value: perso.prenom, maxlength: String(PRENOM_MAX),
      autocomplete: "off", autocapitalize: "words", enterkeyhint: "done", spellcheck: "false", "aria-describedby": "perso-russe" });

    function majRusse() {
      vider(zoneRusse);
      if (!perso.prenom) return;
      const propose = convertirPrenom(perso.prenom, donnees.prenoms);
      if (corrige && perso.prenomRu) {
        const ru = h("input", { class: "champ champ-russe", type: "text", lang: "ru", value: perso.prenomRu.cible, "aria-label": t("perso.russeChamp"),
          autocomplete: "off", spellcheck: "false",
          oninput: () => {
            const v = ru.value.trim();
            const sain = validerPersonnage({ prenom: perso.prenom, prenomRu: { cible: v, accent: v } }).prenomRu;
            if (!sain) { ru.setAttribute("aria-invalid", "true"); return; }
            ru.removeAttribute("aria-invalid");
            perso.prenomRu = sain; enregistrer();
          } });
        zoneRusse.append(ru, h("button", { type: "button", class: "btn-lien", onclick: () => { corrige = false; majRusse(); } }, t("perso.russeFait")));
        focaliser(ru);
      } else if (perso.prenomRu) {
        zoneRusse.append(h("p", { class: "petit", id: "perso-russe" }, h("span", { lang: "ru" }, t("perso.russe", { cible: perso.prenomRu.accent, latin: perso.prenom }))),
          h("div", { class: "russe-actions" },
            h("button", { type: "button", class: "btn-lien", onclick: () => { corrige = true; majRusse(); } }, t("perso.russeCorriger")),
            h("button", { type: "button", class: "btn-lien", onclick: () => { latin = true; perso.prenomRu = null; enregistrer(); majRusse(); } }, t("perso.russeLatin"))));
      } else if (!propose) {
        zoneRusse.append(h("p", { class: "petit", id: "perso-russe" }, t("perso.russeInconnu")));
      } else {
        zoneRusse.append(h("p", { class: "petit", id: "perso-russe" }, t("perso.russeLatinActif")),
          h("button", { type: "button", class: "btn-lien", onclick: () => { latin = false; perso.prenomRu = propose; enregistrer(); majRusse(); } }, t("perso.russeEssayer")));
      }
    }
    champ.addEventListener("input", () => {
      perso.prenom = champ.value;
      corrige = false;
      if (!latin) perso.prenomRu = convertirPrenom(perso.prenom, donnees.prenoms);
      enregistrer();
      majRusse();
    });
    majRusse();

    const libelleMetier = () => {
      const e = metiers.find((x) => x.id === perso.metier);
      return e ? majuscule(nomMetier(e, genre())) : t("perso.metierAucun");
    };
    const texteMetier = h("span", null, libelleMetier());
    const boutonMetier = h("button", { type: "button", class: "champ champ-bouton", id: "perso-metier", "aria-haspopup": "dialog",
      onclick: () => ouvrirMetiers(boutonMetier, texteMetier) }, texteMetier, icone("suite"));

    return [
      h("main", { class: "contenu" },
        h("h1", { class: "titre-etape", tabindex: "-1" }, t("perso.a.titre")),
        h("div", { class: "bloc-champ" }, h("label", { for: "perso-prenom" }, t("perso.prenom")), champ, zoneRusse),
        segments("genre", t("reglages.genre"), null, [["m", t("genre.m")], ["f", t("genre.f")]], genre(),
          (v) => { ctx.majReglage("genre", v); texteMetier.textContent = libelleMetier(); }, "deux texte-long"),
        h("div", { class: "bloc-champ" }, h("label", { for: "perso-metier" }, t("perso.metier")), boutonMetier),
        h("p", { class: "petit" }, t("perso.facultatif"))),
      h("div", { class: "zone-action deux-boutons" },
        h("button", { type: "button", class: "btn-secondaire", onclick: versB }, t("perso.passer")),
        h("button", { type: "button", class: "btn-principal btn-ligne", onclick: versB }, t("nav.suite"), icone("suite")))
    ];
  }
  function versB() { etape = "B"; dessiner(); }

  // Feuille du bas : un métier parmi la liste fermée, rangé par catégories (accordéon : celle du métier choisi est ouverte).
  // « Je préfère ne pas dire » reste en tête (radios, 56 px la ligne).
  function ouvrirMetiers(declencheur, texteMetier) {
    function fermer() {
      if (!feuilleOuverte) return;
      document.removeEventListener("keydown", clavier, true);
      racine.inert = false;
      feuilleOuverte.remove();
      feuilleOuverte = null;
      focaliser(declencheur);
    }
    function clavier(e) {
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); fermer(); }
    }
    let n = 0;
    const radio = (v, libelle) => {
      const id = "metier-" + n++;
      return [
        h("input", { class: "choix-input", type: "radio", name: "metier", id, value: v, checked: v === (perso.metier || ""),
          onchange: () => { perso.metier = v || null; enregistrer(); texteMetier.textContent = v ? libelle : t("perso.metierAucun"); fermer(); } }),
        h("label", { class: "choix ligne-metier", for: id }, h("span", { class: "coche" }, icone("coche")), h("span", null, libelle))
      ];
    };
    const categories = (donnees.categories || []).map((c) => ({ c, liste: metiers.filter((m) => m.categorie === c.id) })).filter((g) => g.liste.length);
    const sections = categories.map(({ c, liste }) => h("details", { class: "categorie-metiers", name: "categorie-metiers", open: liste.some((m) => m.id === perso.metier) },
      h("summary", { "aria-label": t("perso.metierCategorie", { titre: c.titre, n: liste.length }) }, h("span", null, c.titre), icone("suite")),
      h("div", { class: "liste-categorie" }, liste.map((m) => radio(m.id, majuscule(nomMetier(m, genre())))))));
    const voile = h("div", { class: "voile", onclick: (e) => { if (e.target === voile) fermer(); } },
      h("div", { class: "feuille feuille-liste", role: "dialog", "aria-modal": "true", "aria-labelledby": "feuille-metier" },
        h("h2", { id: "feuille-metier" }, t("perso.metier")),
        h("fieldset", { class: "liste-metiers" }, h("legend", { class: "sr-only" }, t("perso.metier")), radio("", t("perso.metierAucun")), sections)));
    feuilleOuverte = voile;
    fermerMetiers = fermer;
    document.addEventListener("keydown", clavier, true);
    racine.inert = true; // le fond n'est plus atteignable au clavier : le focus reste dans la feuille
    document.body.appendChild(voile);
    focaliser(voile.querySelector("input:checked") || voile.querySelector("summary"));
    const choisi = voile.querySelector(".choix-input:checked + .choix");
    if (choisi) choisi.scrollIntoView({ block: "nearest" }); // le métier courant reste visible
  }

  // ---------- Écran B ----------
  function ecranB() {
    const grande = h("div", { class: "poupee-grande" }, poupeePerso(perso, 140, false));
    const nomChoisi = h("p", { class: "nom-choisi" }, t("perso.couleurs." + perso.couleurs));
    function maj() {
      vider(grande);
      grande.appendChild(poupeePerso(perso, 140, false));
      nomChoisi.textContent = t("perso.couleurs." + perso.couleurs);
    }
    const couleurs = h("fieldset", { class: "reglage couleurs" }, h("legend", null, t("perso.couleurs")),
      h("div", { class: "pastilles-couleur" }, COMBINAISONS.map((c) => {
        const id = "couleur-" + c.id;
        return [
          h("input", { class: "choix-input", type: "radio", name: "couleurs", id, value: c.id, checked: c.id === perso.couleurs,
            onchange: () => { perso.couleurs = c.id; enregistrer(); maj(); } }),
          h("label", { class: "pastille-couleur", for: id, style: "background:linear-gradient(135deg,var(" + c.corps + ") 50%,var(" + c.accent + ") 50%)" },
            h("span", { class: "sr-only" }, t("perso.couleurs." + c.id)), h("span", { class: "coche" }, icone("coche")))
        ];
      })),
      nomChoisi);
    const motifs = segments("motif", t("perso.motif"), null, MOTIFS.map((m) => [m, t("perso.motif." + m)]), perso.motif,
      (v) => { perso.motif = v; enregistrer(); maj(); }, "trois");
    const effacer = edition ? h("button", { type: "button", class: "btn-lien danger", onclick: () => ouvrirFeuille({
      titre: t("perso.effacer.titre"), texte: t("perso.effacer.texte"),
      principal: t("perso.effacer.garder"), secondaire: t("perso.effacer.confirmer"),
      focusRetour: effacer, surPrincipal: () => {},
      surSecondaire: () => { ctx.majPersonnage(personnageVide()); ctx.aller(retourVers); }
    }) }, t("perso.effacer")) : null;
    return [
      h("main", { class: "contenu" },
        h("h1", { class: "titre-etape", tabindex: "-1" }, t("perso.b.titre")),
        grande, h("p", { class: "nom-perso" }, perso.prenom || t("perso.titre")), couleurs, motifs, effacer),
      h("div", { class: "zone-action deux-boutons" },
        h("button", { type: "button", class: "btn-secondaire", onclick: () => { etape = "A"; dessiner(); } }, icone("retour"), t("nav.retour")),
        h("button", { type: "button", class: "btn-principal", onclick: () => ctx.aller(retourVers) }, t("perso.fait")))
    ];
  }

  dessiner();
  return {
    // Retour du téléphone : B revient à A ; A revient à l'écran d'où l'on vient.
    retour() {
      if (feuilleOuverte) { fermerMetiers(); return true; }
      if (etape === "B") { etape = "A"; dessiner(); return true; }
      if (edition) { ctx.aller(retourVers); return true; }
      return false;
    },
    nettoyer() { menu.fermer(); racine.inert = false; if (feuilleOuverte) feuilleOuverte.remove(); }
  };
}
