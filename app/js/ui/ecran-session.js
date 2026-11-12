// Écran de session (modes Silence, Écouteurs, Je peux parler) : en-tête, cartes, retour après réponse.
// La composition des cartes vient du moteur (../session.js) ; ici, on ne fait qu'afficher et écouter.

import { h, icone, annoncer, classeLongueur, vider, focaliser, mettre, texteMixte, motsRusses } from "./dom.js";
import { creerMenu } from "./menu.js";
import { poupee, poupeeColorie, rangeeGigogne, etatDe, motEtat, sousTexteEtat } from "./matriochka.js";
import { decorSituation, sansDecor } from "../ambiance.js";
import { ouvrirFeuille } from "./feuille.js";
import { t } from "../textes.js";
import { INTERFACE, AUDIO } from "../config.js";
import { creerSession, minutesReelles } from "../moteur.js";
import { creerHorloge } from "../horloge.js";
import { autreVariante, variante, ponctuationFinale, normaliser, texteElement } from "../contenu.js";
import * as audio from "../audio.js";

const attendre = (ms) => new Promise((r) => setTimeout(r, ms));

export function afficherSession(racine, ctx, { duree, mode, themes }) {
  const reglages = () => ctx.reglages();
  const genreReglage = () => reglages().genre; // undefined tant que jamais réglé
  const session = creerSession({
    contenu: ctx.contenu, fiches: ctx.stockage.fiches, mode, duree, jour: ctx.jour(), themes,
    genre: genreReglage() || "m",
    ecrire: (fiche) => ctx.stockage.ecrireFiche(fiche)
  });
  const horloge = creerHorloge();
  audio.definirModeAudio(mode);

  let courant = null;          // { carte, repondu, juste }
  let jetonAvance = 0;          // annule l'avance automatique en attente
  let derniereLecture = Promise.resolve();
  let feuille = null;
  let fini = false;

  const sonore = () => session.mode !== "silence";

  // ---------- Squelette de l'écran (bagou-ru.md, 13.1) ----------
  // En-tête d'une seule ligne : Menu, barre de temps, « 3 min », son (icône), Quitter (icône).
  const boutonQuitter = h("button", { type: "button", class: "btn-icone", "aria-label": t("session.quitter"), onclick: () => demanderArret() }, icone("croix"));
  // Pendant que le menu est ouvert, le chrono est en pause (comme la feuille « On s'arrête là ? »).
  const menu = creerMenu(ctx, {
    choisir: (ecran) => demanderArret(ecran),
    surOuverture: () => { audio.couper(); jetonAvance++; horloge.pause("menu"); },
    surFermeture: () => { horloge.reprendre("menu"); if (courant && courant.repondu && courant.juste) armerAvanceAuto(); }
  });
  const barre = h("span");
  const compteurVu = h("span", { "aria-hidden": "true" });  // « 3 min »
  const compteurLu = h("span", { class: "sr-only" });       // « encore 3 min »
  // « Couper le son » n'existe que si le son est permis (absent en Silence).
  const boutonSon = sonore() ? h("button", { type: "button", class: "btn-icone", "aria-label": t("session.couperSon"), onclick: couperLeSon }, icone("muet")) : null;
  const zoneCarte = h("main", { class: "contenu carte" });
  const zoneBas = h("div", { class: "bas-session" });
  const ecran = h("div", { class: "ecran ecran-session" },
    h("header", { class: "entete" }, menu.element,
      h("div", { class: "barre", "aria-hidden": "true" }, barre),
      h("span", { class: "compteur" }, compteurVu, compteurLu), boutonSon, boutonQuitter),
    zoneCarte, zoneBas);
  racine.appendChild(ecran);
  // États des poupées au départ : à la fin, on colorie celles qui ont progressé.
  const etatsDepart = new Map([...ctx.stockage.fiches].map(([id, f]) => [id, etatDe(f)]));

  // ---------- Audio (jamais appelé en Silence : audio.parler refuse de toute façon) ----------
  function rateBoutons() { return reglages().vitesseVoix === "lente" ? AUDIO.rateLente : AUDIO.rateNormale; }
  function lire(texteCible, rate) {
    if (!sonore()) return Promise.resolve("refuse");
    derniereLecture = audio.parler(texteCible, { langue: "cible", rate: rate || rateBoutons() });
    return derniereLecture;
  }
  const desabonner = audio.surLecture((enCours) => {
    zoneCarte.querySelectorAll("[data-ecouter]").forEach((b) => {
      const libelle = b.querySelector(".libelle-ecoute");
      if (libelle) libelle.textContent = enCours ? t("carte.ecouteEnCours") : b.getAttribute("data-repos");
    });
  });

  function boutonEcouter(texteCible) {
    if (!sonore()) return null; // en Silence, le bouton n'existe pas dans le DOM
    return h("button", { type: "button", class: "btn-ecouter", "data-ecouter": "", "data-repos": t("carte.ecouter"), onclick: () => lire(texteCible) },
      icone("hautParleur"), h("span", { class: "libelle-ecoute" }, t("carte.ecouter")));
  }

  function couperLeSon() {
    audio.couper();
    session.couperSon();
    audio.definirModeAudio("silence");
    ctx.majReglage("dernierMode", "silence");
    boutonSon.remove();
    zoneCarte.querySelectorAll("[data-ecouter], [data-reecouter], .boutons-ecoute").forEach((b) => b.remove());
    annoncer(t("session.sonCoupe"));
    // La carte en cours, si elle a besoin du son, devient Sens ou Thème.
    if (courant && !courant.repondu && (courant.carte.type === "ecoute" || courant.carte.type === "voix-haute")) {
      courant.carte.type = courant.carte.type === "ecoute" ? "sens" : "theme";
      afficherCarte(courant.carte);
    }
    focaliser(zoneCarte.querySelector(".consigne"));
  }

  // ---------- Morceaux communs ----------
  function badgeRegistre(registre) {
    if (registre === "tu") return h("span", { class: "registre" }, t("carte.tutoie"));
    if (registre === "vous") return h("span", { class: "registre" }, t("carte.vouvoie"));
    return null;
  }
  // Translittération et registre sur une seule ligne (le registre reste seul si la translittération est désactivée).
  function ligneTranslit(texteTranslit, registre) {
    const tr = translit(texteTranslit), reg = badgeRegistre(registre);
    return tr || reg ? h("div", { class: "ligne-translit" }, tr, reg) : null;
  }
  function translit(texte) {
    if (!reglages().translitteration || !texte) return null; // absente du DOM si désactivée
    // Translittération « à la française » : lue avec une voix française (décision du CEO).
    return h("p", { class: "translit", lang: "fr" }, texte);
  }
  function blocAstuce(astuce) {
    if (!astuce) return null;
    return h("div", { class: "astuce" }, h("strong", null, t("carte.astuce")), texteMixte(astuce)); // le russe de l'astuce porte lang="ru"
  }
  function consigne(cle) {
    return h("h1", { class: "consigne", tabindex: "-1" }, t(cle));
  }
  // Phrase d'une carte « Même phrase, autre mot » : on souligne tous les mots qui ne sont pas
  // dans le modèle. Le mot qui remplace le trou est souligné, et aussi un mot qui change à cause
  // de lui (par exemple le verbe au pluriel : « Сколько сто́ят я́блоки? »).
  function soulignerDifferences(phrase, modele, langue) {
    const attrs = langue ? { lang: langue } : {};
    const motsModele = new Set(modele.split(/\s+/).map(normaliser).filter((m) => m && m !== "___"));
    const morceaux = phrase.split(/(\s+)/);
    const conteneur = h("span", attrs);
    let souligne = null; // morceau souligné en cours, pour réunir les mots qui se suivent
    let espaceEnAttente = "";
    morceaux.forEach((m) => {
      if (/^\s+$/.test(m)) { espaceEnAttente += m; return; }
      if (!m) return;
      const change = normaliser(m) !== "" && !motsModele.has(normaliser(m));
      if (!change) {
        conteneur.append(espaceEnAttente + m);
        souligne = null;
      } else {
        // La ponctuation qui suit le mot (« Чай, ») n'est pas soulignée.
        const [, mot, ponctuation] = m.match(/^(.*?)([.,!?;:…»"'’]*)$/);
        if (souligne) souligne.append(espaceEnAttente + mot);
        else { conteneur.append(espaceEnAttente); souligne = h("span", { class: "mot-change" }, mot); conteneur.append(souligne); }
        if (ponctuation) { conteneur.append(ponctuation); souligne = null; }
      }
      espaceEnAttente = "";
    });
    if (espaceEnAttente) conteneur.append(espaceEnAttente);
    return conteneur;
  }

  // En-tête : une barre et « encore X min », calculées sur le temps écoulé.
  // Le temps ne fait qu'avancer, donc ce repère ne recule jamais.
  function majTemps() {
    const D = session.duree;
    const ecoule = Math.min(D, horloge.secondes());
    const reste = D - ecoule;
    const n = Math.ceil(reste / 60);
    compteurVu.textContent = reste < 60 ? t("session.resteMoinsCourt") : t("session.resteCourt", { n });
    compteurLu.textContent = reste < 60 ? t("session.resteMoins") : t("session.reste", { n });
    barre.style.width = Math.round((ecoule / D) * 100) + "%";
  }


  // ---------- Déroulé ----------
  function suivante() {
    if (fini) return;
    jetonAvance++;
    audio.couper();
    const carte = session.prochaineCarte(horloge.secondes());
    if (!carte) { terminer("terminee"); return; }
    courant = { carte, repondu: false, juste: null };
    afficherCarte(carte);
  }

  // sansLecture = vrai quand on redessine la même carte (choix du genre) : pas de nouvelle lecture.
  function afficherCarte(carte, sansLecture) {
    if (sansLecture && courant) courant.luArrivee = true;
    vider(zoneCarte);
    vider(zoneBas);
    // Rejoue l'animation d'arrivée.
    zoneCarte.classList.remove("carte"); void zoneCarte.offsetWidth; zoneCarte.classList.add("carte");
    majTemps();
    const rendus = {
      "decouverte": carteDecouverte, "sens": carteSens, "theme": carteTheme, "ordre": carteOrdre,
      "ecoute": carteEcoute, "voix-haute": carteVoixHaute, "moule-sens": carteMoule, "moule-theme": carteMoule
    };
    (rendus[carte.type] || carteSens)(carte);
    focaliser(zoneCarte.querySelector(".consigne"));
  }

  function zoneAction(...boutons) {
    vider(zoneBas);
    zoneBas.appendChild(h("div", { class: "zone-action" }, boutons));
  }

  // 3.1 Découverte : la carte de phrase de Bagou (bagou-ru.md, 8).
  function carteDecouverte(carte) {
    const el = carte.element;
    const texte = carte.texte;
    const genre = genreReglage();
    const fiche = ctx.stockage.fiches.get(el.id);
    const theme = ctx.contenu.situations.find((x) => x.id === el.situation);
    const decor = decorSituation(el.situation); // discret, en haut à droite, jamais derrière un texte
    const carteEl = h("div", { class: "carte-phrase" + (sansDecor(el.situation) ? " sans-decor" : "") }, decor,
      h("p", { class: "fr-dessus" }, texte.fr));
    if (el.variantes && !genre) {
      // Genre jamais réglé : on montre les deux formes et on pose la question (ecrans-phase0.md, 2.5).
      const m = variante(el, "m"), f = variante(el, "f");
      mettre(carteEl, h("p", { class: "ru-hero " + classeLongueur(m.cible) }, h("span", { class: "petit" }, t("carte.homme") + " "), h("span", { lang: "ru" }, motsRusses(m.accent))));
      mettre(carteEl, h("p", { class: "ru-hero " + classeLongueur(f.cible) }, h("span", { class: "petit" }, t("carte.femme") + " "), h("span", { lang: "ru" }, motsRusses(f.accent))));
    } else {
      mettre(carteEl, h("p", { class: "ru-hero " + classeLongueur(texte.cible), lang: "ru" }, motsRusses(texte.accent)));
      mettre(carteEl, ligneTranslit(texte.translit, el.registre));
      if (el.variantes) {
        const autre = autreVariante(el, genre);
        if (autre) mettre(carteEl, h("p", { class: "petit" }, t(genre === "f" ? "carte.auMasculin" : "carte.auFeminin", { forme: "" }), h("span", { lang: "ru" }, autre.accent)));
      }
    }
    if (el.variantes && !genre) mettre(carteEl, badgeRegistre(el.registre)); // sinon, le registre est sur la ligne de la translittération
    mettre(carteEl, blocAstuce(el.astuce));
    if (el.variantes && !genre) {
      const choisir = (g) => {
        ctx.majReglage("genre", g);
        session.definirGenre(g);
        // La phrase affiche maintenant la forme choisie.
        carte.texte = Object.assign({}, carte.texte, variante(el, g));
        afficherCarte(carte, true);
      };
      mettre(carteEl, h("div", { class: "encart-genre" },
        h("p", null, t("genre.question")),
        h("div", { class: "paire" },
          h("button", { type: "button", class: "btn-secondaire", onclick: () => choisir("m") }, t("genre.m")),
          h("button", { type: "button", class: "btn-secondaire", onclick: () => choisir("f") }, t("genre.f")))));
    }
    if (sonore()) {
      const bouton = (cle, rate, extra) => h("button", Object.assign({ type: "button", class: "btn-ecouter", "data-ecouter": "", "data-repos": t(cle), onclick: () => lire(texte.cible, rate) }, extra),
        icone("hautParleur"), h("span", { class: "libelle-ecoute" }, t(cle)));
      mettre(carteEl, h("div", { class: "boutons-ecoute" }, bouton("carte.ecouter", null), bouton("carte.lentement", AUDIO.rateLente)));
    }
    // Bloc d'état : poupée + mot + sous-texte (la forme et le mot, jamais la couleur seule).
    const etat = etatDe(fiche);
    mettre(carteEl, h("div", { class: "bloc-etat" }, poupee(etat, 40, true),
      h("div", null, motEtat(etat), h("small", null, sousTexteEtat(etat, fiche)))));

    mettre(zoneCarte, h("h1", { class: "consigne consigne-decouverte", tabindex: "-1" }, t("decouverte.consigne")), carteEl);

    // Phrase-moule : « Même phrase, autre mot », puces tactiles. Toucher une puce affiche la phrase complète avec ce mot
    // (affichage seulement : le moteur, lui, a déjà fixé le mot de la carte).
    if (el.moule) {
      const affiche = carte.affiche === undefined ? (carte.remplacement || 0) : carte.affiche;
      mettre(zoneCarte, h("div", { class: "autre-mot" },
        h("span", { class: "etiquette-moule" }, t("moule.consigne")),
        h("div", { class: "puces" }, el.moule.remplacements.map((r, i) =>
          h("button", { type: "button", class: "puce", lang: "ru", "aria-pressed": String(i === affiche), onclick: () => {
            carte.affiche = i;
            carte.texte = texteElement(el, { genre: genreReglage() || "m", remplacement: i });
            afficherCarte(carte, true);
            focaliser(zoneCarte.querySelectorAll(".puce")[i]);
          } }, r.accent || r.cible)))));
    }
    // Poupées du thème : une par phrase, gigognes, avec « Au café · 3 acquises sur 9 ».
    if (theme) {
      const ids = theme.ids.filter((id) => ctx.contenu.parId.has(id));
      const etats = ids.map((id) => etatDe(ctx.stockage.fiches.get(id)));
      const acquises = etats.filter((e) => e === "acquise").length;
      const texteTheme = acquises === ids.length && ids.length > 0 ? t("theme.tout", { titre: theme.titre })
        : t(acquises === 0 ? "theme.rang0" : acquises === 1 ? "theme.rang1" : "theme.rang", { titre: theme.titre, acquises, total: ids.length });
      mettre(zoneCarte, h("div", { class: "rang-poupees" }, texteTheme, rangeeGigogne(etats, ids.indexOf(el.id))));
    }
    zoneAction(h("button", { type: "button", class: "btn-principal", onclick: () => { session.repondre(carte, "non-note"); suivante(); } }, t("retour.suivant")));
    if (!courant.luArrivee) { courant.luArrivee = true; lire(texte.cible); }
  }

  // Liste des 3 choix. francais = vrai pour des choix en français.
  function listeOptions(carte, francais) {
    const liste = h("ul", { class: "options" });
    carte.options.forEach((option) => {
      const contenuOption = francais
        ? h("span", { class: "texte-option" }, option.texte.fr)
        : h("span", { class: "texte-option" }, h("span", { class: "ru", lang: "ru" }, option.texte.accent), translit(option.texte.translit));
      const bouton = h("button", { type: "button", class: "option" + (!francais && reglages().translitteration ? " avec-translit" : "") }, contenuOption, h("span", { class: "etat" }), h("span", { class: "sr-only sr-etat" }));
      bouton.addEventListener("click", () => repondreQcm(carte, option, bouton, liste));
      liste.appendChild(h("li", null, bouton));
    });
    return liste;
  }

  function repondreQcm(carte, option, bouton, liste) {
    if (courant.repondu || courant.carte !== carte) return;
    courant.repondu = true;
    const juste = option.juste;
    liste.querySelectorAll(".option").forEach((b, i) => {
      const o = carte.options[i];
      b.setAttribute("aria-disabled", "true");
      const etat = b.querySelector(".etat");
      const sr = b.querySelector(".sr-etat");
      if (b === bouton && juste) { b.classList.add("est-juste"); etat.appendChild(icone("coche")); sr.textContent = ", " + t("sr.bonne"); }
      else if (b === bouton) { b.classList.add("est-faux"); etat.appendChild(icone("croix")); sr.textContent = ", " + t("sr.fauxChoisi"); }
      else if (o.juste) { b.classList.add("est-reponse"); etat.appendChild(icone("coche")); sr.textContent = ", " + t("sr.bonne"); }
      else b.classList.add("est-autre");
    });
    resultat(carte, juste);
  }

  // Enregistre le résultat puis affiche le panneau de retour (2.8).
  // Le panneau prend la place des réponses : les infos défilent, « Suivant » reste fixe en bas.
  function resultat(carte, juste) {
    courant.juste = juste;
    const avant = etatDe(ctx.stockage.fiches.get(carte.element.id));
    session.repondre(carte, juste ? "reussite" : "echec");
    const apres = etatDe(ctx.stockage.fiches.get(carte.element.id));
    const texte = carte.texte;
    const reponseRusse = ["theme", "moule-theme", "ordre"].includes(carte.type);
    const panneau = h("div", { class: "retour" + (juste ? "" : " est-faux") });
    const infos = h("div", { class: "retour-infos" });
    const verdict = h("p", { class: "verdict " + (juste ? "ok" : "ko"), role: "status", tabindex: "-1" },
      icone(juste ? "coche" : "croix"), t(juste ? "retour.juste" : "retour.faux"));
    // La poupée de la phrase se colorie à droite du verdict, seulement si son état a changé.
    const etatChange = avant === apres ? null
      : h("span", { class: "etat-change" }, poupeeColorie(avant, apres, 28, true), motEtat(apres));
    if (etatChange && matchMedia("(prefers-reduced-motion: reduce)").matches) annoncer(t("etat.annonce", { etat: motEtat(apres) }));
    mettre(infos, h("div", { class: "ligne-verdict" }, verdict, etatChange));
    if (carte.type === "ecoute") {
      // On n'avait pas vu la phrase : on la montre.
      mettre(infos, h("div", { class: "bonne-reponse" }, h("p", { class: "ru", lang: "ru" }, texte.accent), translit(texte.translit)));
    }
    if (!juste) {
      mettre(infos, h("p", { class: "petit" }, t("retour.bonne")));
      if (reponseRusse) {
        mettre(infos, h("div", { class: "bonne-reponse" }, h("p", { class: "ru", lang: "ru" }, texte.accent), translit(texte.translit)));
      } else {
        const bloc = h("div", { class: "bonne-reponse" });
        if (carte.type !== "ecoute") bloc.appendChild(h("p", { class: "petit", lang: "ru" }, texte.accent));
        bloc.appendChild(h("p", { class: "fr" }, texte.fr));
        mettre(infos, bloc);
      }
      mettre(infos, blocAstuce(carte.element.astuce));
      mettre(infos, h("p", { class: "petit reverra" }, t("retour.reverra")));
    }
    const suivant = h("button", { type: "button", class: "btn-principal", onclick: suivante }, t("retour.suivant"));
    mettre(panneau, infos, suivant);
    vider(zoneBas);
    zoneBas.appendChild(panneau);
    // Le focus va sur le verdict (annoncé par role="status") ; Entrée passe à la suite.
    focaliser(verdict);
    if (["sens", "theme", "ordre", "moule-sens", "moule-theme"].includes(carte.type)) lire(texte.cible);
    if (juste) armerAvanceAuto();
  }

  // Avance seule 1,2 s après une bonne réponse, ou 400 ms après la fin de la lecture si elle dure plus.
  function armerAvanceAuto() {
    const jeton = ++jetonAvance;
    setTimeout(async () => {
      if (jeton !== jetonAvance || feuille || document.hidden) return;
      if (audio.enLecture()) {
        await derniereLecture;
        await attendre(INTERFACE.avanceApresLectureMs);
      }
      if (jeton !== jetonAvance || feuille || document.hidden) return;
      suivante();
    }, INTERFACE.avanceAutoMs);
  }

  // 3.2 Sens
  function carteSens(carte) {
    const texte = carte.texte;
    const zone = h("div", { class: "zone-phrase" },
      h("p", { class: "ru-hero " + classeLongueur(texte.cible), lang: "ru" }, texte.accent),
      ligneTranslit(texte.translit, carte.element.registre),
      boutonEcouter(texte.cible));
    mettre(zoneCarte, consigne("sens.consigne"), zone);
    zoneAction(listeOptions(carte, true));
  }

  // 3.3 Thème
  function carteTheme(carte) {
    const zone = h("div", { class: "zone-phrase" },
      h("p", { class: "fr-hero" }, carte.texte.fr),
      badgeRegistre(carte.element.registre));
    mettre(zoneCarte, consigne("theme.consigne"), zone);
    zoneAction(listeOptions(carte, false));
  }

  // 3.5 Écoute
  function carteEcoute(carte) {
    const texte = carte.texte;
    const libelle = h("span", { class: "libelle-ecoute" }, t("carte.reecouter"));
    const bouton = h("button", { type: "button", class: "btn-reecouter", "data-ecouter": "", "data-reecouter": "", "data-repos": t("carte.reecouter"), onclick: () => lire(texte.cible) },
      h("span", { class: "rond" }, icone("reecouter")), libelle);
    const zone = h("div", { class: "zone-phrase" }, sonore() ? bouton : null);
    mettre(zoneCarte, consigne("ecoute.consigne"), zone);
    zoneAction(listeOptions(carte, true));
    if (!courant.luArrivee) { courant.luArrivee = true; lire(texte.cible); }
  }

  // 3.6 À voix haute
  function carteVoixHaute(carte) {
    const texte = carte.texte;
    const zone = h("div", { class: "zone-phrase" },
      h("p", { class: "fr-hero" }, texte.fr),
      badgeRegistre(carte.element.registre));
    mettre(zoneCarte, consigne("voix.consigne"), zone);
    const voir = () => {
      mettre(zone, 
        h("p", { class: "ru-hero " + classeLongueur(texte.cible), lang: "ru" }, texte.accent),
        translit(texte.translit),
        blocAstuce(carte.element.astuce),
        boutonEcouter(texte.cible));
      zone.scrollIntoView({ block: "nearest" });
      const noter = (juste) => {
        if (courant.repondu) return;
        courant.repondu = true;
        session.repondre(carte, juste ? "reussite" : "echec");
        suivante();
      };
      const jeLavais = h("button", { type: "button", class: "btn-principal", onclick: () => noter(true) }, t("voix.jeLavais"));
      vider(zoneBas);
      zoneBas.appendChild(h("div", { class: "zone-action" },
        h("p", { class: "petit question-voix" }, t("voix.question")),
        h("div", { class: "paire" },
          h("button", { type: "button", class: "btn-secondaire", onclick: () => noter(false) }, t("voix.pasEncore")),
          jeLavais)));
      focaliser(jeLavais);
      lire(texte.cible);
    };
    zoneAction(h("button", { type: "button", class: "btn-principal", onclick: voir }, t("voix.voir")));
  }

  // 3.7 Moule (sens ou thème)
  function carteMoule(carte) {
    const el = carte.element;
    const texte = carte.texte;
    // Le modèle, sans le mot « moule » (décision du CEO) : « Я люблю ___ (J'aime ___) ».
    const etiquette = h("p", { class: "etiquette-moule" },
      h("span", { lang: "ru" }, el.moule.modele), " (" + el.moule.fr + ")");
    let zone;
    if (carte.type === "moule-sens") {
      zone = h("div", { class: "zone-phrase" }, etiquette,
        h("p", { class: "ru-hero " + classeLongueur(texte.cible) }, soulignerDifferences(texte.accent, el.moule.modele, "ru")),
        ligneTranslit(texte.translit, el.registre),
        boutonEcouter(texte.cible));
    } else {
      zone = h("div", { class: "zone-phrase" }, etiquette,
        h("p", { class: "fr-hero" }, soulignerDifferences(texte.fr, el.moule.fr)),
        badgeRegistre(el.registre));
    }
    mettre(zoneCarte, consigne("moule.consigne"), zone);
    zoneAction(listeOptions(carte, carte.type === "moule-sens"));
  }

  // 3.4 Ordre
  function carteOrdre(carte) {
    const texte = carte.texte;
    const { reference, tuiles } = carte.ordre;
    const places = [];                       // clés des tuiles placées, dans l'ordre
    const zoneReponse = h("div", { class: "zone-reponse", "aria-label": t("ordre.consigne") });
    const reserve = h("div", { class: "reserve" });
    const message = h("p", { class: "petit", role: "status" });
    const ponctuation = ponctuationFinale(texte.accent);

    function dessiner() {
      vider(zoneReponse);
      vider(reserve);
      if (places.length === 0) zoneReponse.appendChild(h("span", { class: "petit" }, t("ordre.vide")));
      places.forEach((cle) => {
        const tuile = tuiles.find((x) => x.cle === cle);
        zoneReponse.appendChild(h("button", { type: "button", class: "tuile", lang: "ru", onclick: () => retirer(cle) }, tuile.texte));
      });
      if (places.length === tuiles.length && ponctuation) zoneReponse.appendChild(h("span", { class: "ponctuation", lang: "ru" }, ponctuation));
      tuiles.forEach((tuile) => {
        if (places.includes(tuile.cle)) {
          reserve.appendChild(h("span", { class: "tuile fantome", "aria-hidden": "true" }, tuile.texte));
        } else {
          reserve.appendChild(h("button", { type: "button", class: "tuile", lang: "ru", onclick: () => placer(tuile.cle) }, tuile.texte));
        }
      });
      if (places.length === tuiles.length) { verifier.removeAttribute("aria-disabled"); message.textContent = ""; }
      else verifier.setAttribute("aria-disabled", "true");
    }
    function placer(cle) {
      if (courant.repondu) return;
      places.push(cle);
      dessiner();
      // Le focus suit : premier mot encore dans la réserve, sinon le bouton Vérifier.
      focaliser(reserve.querySelector("button.tuile") || verifier);
    }
    function retirer(cle) {
      if (courant.repondu) return;
      places.splice(places.indexOf(cle), 1);
      dessiner();
      focaliser(reserve.querySelector("button.tuile"));
    }
    const verifier = h("button", { type: "button", class: "btn-principal", "aria-disabled": "true", onclick: () => {
      if (courant.repondu) return;
      if (places.length < tuiles.length) { message.textContent = t("ordre.incomplet"); return; }
      courant.repondu = true;
      const proposee = places.map((cle) => tuiles.find((x) => x.cle === cle).texte);
      const juste = proposee.join(" ") === reference.join(" ");
      zoneReponse.querySelectorAll(".tuile").forEach((b) => { b.setAttribute("aria-disabled", "true"); if (juste) b.classList.add("est-juste"); });
      reserve.querySelectorAll(".tuile").forEach((b) => b.setAttribute("aria-disabled", "true"));
      if (!juste) zoneReponse.classList.add("est-faux");
      resultat(carte, juste);
    } }, t("ordre.verifier"));

    const zone = h("div", { class: "zone-phrase" }, h("p", { class: "fr-hero" }, texte.fr), badgeRegistre(carte.element.registre));
    mettre(zoneCarte, consigne("ordre.consigne"), zone, h("div", { class: "ordre" }, zoneReponse, reserve, message));
    zoneAction(verifier);
    dessiner();
  }

  // ---------- Quitter, arrière-plan, clavier ----------
  // vers : écran du menu choisi (« progres », « reglages »). Arrêter la session y mène directement, sans écran de fin.
  function demanderArret(vers) {
    if (feuille || fini) return;
    audio.couper(); // toute lecture est coupée à l'ouverture de la feuille
    jetonAvance++;
    horloge.pause("feuille");
    feuille = ouvrirFeuille({
      titre: t("quitter.titre"), texte: t("quitter.texte"),
      principal: t("quitter.continuer"), secondaire: t("quitter.arreter"),
      focusRetour: boutonQuitter,
      surPrincipal: () => {
        feuille = null;
        horloge.reprendre("feuille");
        if (courant && courant.repondu && courant.juste) armerAvanceAuto();
      },
      surSecondaire: () => {
        feuille = null;
        if (vers) { nettoyer(); ctx.aller(vers); } else terminer("arret");
      }
    });
  }

  function visibilite() {
    if (document.hidden) {
      audio.couper();
      jetonAvance++; // rien ne repart tout seul au retour
      horloge.pause("arriere-plan");
    } else {
      horloge.reprendre("arriere-plan");
    }
  }

  function clavier(e) {
    if (feuille || !courant || menu.ouvert) return;
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    // Entrée sur le verdict (qui a le focus après une réponse) : carte suivante.
    if (e.key === "Enter" && document.activeElement && document.activeElement.classList.contains("verdict")) { e.preventDefault(); suivante(); return; }
    if (courant.repondu) return;
    const k = parseInt(e.key, 10);
    if (k >= 1 && k <= 3) {
      const options = zoneBas.querySelectorAll(".option");
      if (options[k - 1]) { e.preventDefault(); options[k - 1].click(); }
    }
  }
  document.addEventListener("visibilitychange", visibilite);
  document.addEventListener("keydown", clavier);

  function nettoyer() {
    menu.fermer();
    fini = true;
    clearInterval(minuteurTemps);
    jetonAvance++;
    document.removeEventListener("visibilitychange", visibilite);
    document.removeEventListener("keydown", clavier);
    desabonner();
    if (feuille) { feuille.fermer(); feuille = null; }
    audio.couper();
    audio.definirModeAudio("silence");
  }

  function terminer(raison) {
    if (fini) return;
    const modeFinal = session.mode;
    nettoyer();
    // Phrases dont la poupée a changé d'état pendant la session.
    const progres = [];
    ctx.stockage.fiches.forEach((f, id) => {
      const apres = etatDe(f), avant = etatsDepart.get(id) || "pas_vue";
      if (apres !== avant) progres.push({ avant, apres });
    });
    ctx.aller("fin", { progres, bilan: session.bilan(), duree, dureeReelle: minutesReelles(horloge.secondes()), mode: modeFinal, raison, themes });
  }

  // ---------- Démarrage ----------
  horloge.demarrer();
  // La barre et « encore X min » avancent aussi pendant une carte.
  const minuteurTemps = setInterval(majTemps, 1000);
  suivante();

  return {
    // Bouton « retour » du téléphone : ouvre la feuille (ou la referme si elle est ouverte).
    retour() {
      if (menu.ouvert) { menu.fermer(); return true; }
      if (feuille) { const f = feuille; feuille = null; f.fermer(); horloge.reprendre("feuille"); if (courant && courant.repondu && courant.juste) armerAvanceAuto(); }
      else demanderArret();
      return true;
    },
    nettoyer
  };
}
