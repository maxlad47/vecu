# QA mission 007 : le personnage personnalisable (Boris, 12/11/2026)

**Verdict : Livrable** (après contre-vérification, voir la dernière section ; réserves 1, 2 et 3 levées, les points 4 à 7 restent mineurs). Verdict initial : Livrable avec réserves.

Périmètre (décision de Max) : 375×667 et 360×640, Silence, clair, 25 cartes, un seul Chrome. Le sombre : `tests/qa/personnage.rb` relancé, identique au clair (pas de défilement, aucune cible sous 44 px, 0 erreur).

## Ce qui passe
- `node --test tests/*.test.mjs` : 0 échec.
- Création : Max → Макс, Laurent → Лора́н (accent), Anne → Анн. « Corriger » accepte le cyrillique, refuse le latin (aria-invalid). « Garder en lettres latines » puis « Écrire en russe » : OK. Aucune pré-sélection du genre. Métiers listés au genre choisi (14 lignes). Écrans A et B sans défilement, bouton visible, cibles ≥ 44 px, aux 2 tailles.
- `variantes_fr`, 5 éléments, masculin et féminin (moteur) : Désolé/Désolée, Enchanté/Enchantée, perdu/perdue, étudiant/étudiante, ingénieur/ingénieure. Correct. Sans genre, les deux formes s'affichent.
- Métier choisi : « Je suis infirmière. » en Découverte, accordé au genre.
- Personnage sauté : 0 erreur. La question du genre apparaît sur « Je suis perdu / perdue » et sur « Je suis ingénieur / ingénieure ». Aucun « m » stocké.
- Silence : 0 appel à la synthèse vocale. Poupée du personnage absente des rangées de progression (seulement en haut de Mes progrès et dans Réglages). Les 4 combinaisons n'ont ni rouge-blanc-bleu ni laque + cobalt.
- Hors ligne : les 63 fichiers de `dist/` sont dans le cache du service worker, dont `personnage.json` et les 3 nouveaux JS.

## Problèmes, du plus grave au moins grave
1. **Carte « Même phrase, autre mot » : forme masculine pour une utilisatrice.** `optionsMoule` (`app/js/exercices.js`) appelle `texteElement` sans le genre. Étapes : créer un personnage féminin, métier infirmière, session Silence 5 min thème « Se présenter ». La carte 3 propose « Je suis infirmier / ingénieur / manager » et la réponse russe « Я медбра́т » à côté de « Je suis infirmière » (Découverte). Les cartes « Ça veut dire quoi ? » donnent « ingénieure » : incohérence au sein d'une même session. Touche aussi le genre non réglé (voir 4).
2. **Carte de visite (presenter-011) : français faux pour 5 métiers.** Pour médecin, comptable, manager, à mon compte, retraité (formes m et f identiques), `carteVisite` renvoie l'élément de base dont `variantes_fr` est « Je m'appelle Sacha, je suis ingénieur. » ; `texteElement` l'écrase par-dessus le français du métier. Constaté au moteur : FR « Je m'appelle Sacha, je suis ingénieur. » avec le russe « Меня зовут Анн, я врач. ». Pas atteint en 25 cartes (vague 3) : confirmé par script node seulement, avec `/tmp/v.mjs`.
3. **Carte Découverte surchargée à 375×667** (relais Kostia, point 4) : « Je suis ingénieur / ingénieure » empile astuce, question du genre et invitation « Ajouter mon métier » ; la page défile (seule carte sur 25). La question du genre peut passer sous le pli.
4. **Genre ignoré = masculin sans nouvelle question.** Si l'utilisatrice laisse la question du genre sans réponse, les exercices suivants (« Je suis perdu », « Я заблудился ») sont au masculin et ne reposent pas la question. Connu côté Voiture, mais vaut aussi pour les écrans.
5. **Translittération avec le prénom en lettres latines** alors qu'un prénom russe existe : « ia Laurent. a ty? », « miniá zavoút Max ». La ligne de prononciation mélange latin et phonétique.
6. **Contenu (Nadia) : Anne → « Анн ».** Ce n'est pas un prénom russe (Анна). À ajouter au dictionnaire ; les prénoms en -e muet à la française donnent des formes douteuses.
7. Astuce sur 3 lignes à 360×640 (ancienne réserve de `2026-11-12-ecrans-adaptatifs.md`) : toujours là (estimée 3 à 4 lignes avec le titre « Astuce » sur Pas encore / Plus lentement). Non revenue en pire.

## Code
- Commentaires `shortcut:` (4) : `app/js/parcours.js:6` (dernière durée par lieu), `app/js/ambiance.js:124` (SVG par regex), `app/js/ui/matriochka.js:13` (« en cours »), `app/js/ui/accueil.js:129` (pas d'étape « Comment ? »). Aucun nouveau dans la mission 007.
- En trop (léger) : `REGLAGES_MOULE` avec `derive` généralise pour un seul réglage (métier) ; justifié par le relais, mais personne ne l'a demandé au brief. Ne pas l'étoffer avant un 2e usage réel.
- Phrases « manuel scolaire » : aucune dans le personnage (« Moi, c'est Anne. Et toi ? » est naturel).

## Non testé
- **Écouteurs** : en Chrome headless, la session reste sur « Je prépare la voix… » (pas de voix installée) ; cartes non jouées. Silence seul vérifié.
- 360×640 pour la création au clavier de bout en bout : les 2 écrans sont mesurés (script de Kostia) mais mes scénarios de session ont tourné à 375×667 seulement.
- Phrases sortir-008, rencontrer-005, presenter-006 en session réelle : hors des 25 cartes (vagues 2 et 3) ; vérifiées au moteur.
- Prénoms Maxime, Céline, Jean-Pierre, Zoë, Ñandú : conversion vérifiée au moteur (Ñandú reste latin, attendu), pas dans l'interface.
- Navigation privée, bouton retour du téléphone, hors ligne en mode avion, Effacer mon personnage, métiers non moules en session, 4 combinaisons x 3 motifs en capture : faute de temps (15 min).


## Contre-vérification (commit 2d15f46, Boris, 12/11/2026)
Tailles 375×667 et 360×640, clair, Silence 5 min « Se présenter », un seul Chrome. `node --test tests/*.test.mjs` : 1 test, 0 échec.
- **Point 1 levé.** Personnage Anne, féminin, infirmière, session réelle : cartes « Même phrase, autre mot » avec « Je suis ingénieure / avocate / infirmière » et « Я медсестра́ » (plus de « медбра́т » ni d'« infirmier »). FR et RU cohérents avec la Découverte « Je suis infirmière ». Aucune erreur de page.
- **Point 2 levé (au moteur, `/tmp/v.mjs`, 6 métiers × m/f).** Carte de visite : « Je m'appelle Anne, je suis médecin / comptable / à la retraite » avec « я врач / бухгалтер / на пенсии » ; ingénieure et infirmière accordés (« медсестра »). Plus de « ingénieur » parasite. Pas rejoué en interface : la carte n'est pas sortie dans les 30 cartes jouées.
- **Point 3 levé.** Découverte « Je suis ingénieur / ingénieure » : scrollHeight = hauteur de fenêtre aux 2 tailles (667 et 640), pas de défilement. Question du genre visible (bas à 427 px et 421 px), « Suivant » à 657 et 630 px. Cartes de la session : aucune ne défile.
- Écrans « Moi » et « Ma poupée » toujours sans défilement à 375×667 et 360×640 ; Réglages avec la carte « Mon personnage » conforme.
- Captures pour Léa : `docs/missions/007-personnage/capture-375x667-moi.png`, `-poupee.png`, `-decouverte.png`, `capture-360x640-reglages.png`.
- Reste ouvert, inchangé et non bloquant : points 4 à 7 (genre ignoré, translittération mixte, « Анн », astuce longue) et la liste « Non testé » (Écouteurs, hors ligne réel, effacement).
