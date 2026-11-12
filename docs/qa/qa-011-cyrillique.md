# QA mission 011 : « Écrire la réponse » (branche mission-011-cyrillique)

**Verdict : Livrable avec réserves.** Mécanique de comparaison et rendu corrects ; trois défauts à corriger avant de montrer l'exercice à un débutant (n°1, 2 et 3).

Automatique : `node tests/moteur.test.mjs` (1017 vérifications, 0 échec), `node --test tests/*.test.mjs` (pass), `node scripts/build.mjs` (67 fichiers) : verts. Mais voir le n°1.

## Problèmes, du plus grave au moins grave

1. **Les nouveaux tests sont hors du filet.** Le bloc « Écrire la réponse » est ajouté APRÈS la ligne de bilan et `process.exitCode` de `tests/moteur.test.mjs`. Preuve : copie avec `egal(deuxDeSuite, 99, …)` : « ÉCHEC » affiché, mais code de sortie 0 pour `node tests/...` et `node --test`, et les vérifications ne sont pas comptées dans les 1017. Un échec futur passerait inaperçu. Correction : remonter le bloc avant le bilan.
2. **Le re-passage après erreur viole deux règles.** Étapes : toutes les phrases en boîte 5 et dues, Silence, répondre faux à une carte Écrire. Le rendez-vous de rattrapage (règles A/D, `moteur.js` l.282 et 302) reprend le même type : la même phrase revient en « Écrire », immédiatement, alors qu'elle est retombée en boîte 3 (règle « à partir de la boîte 4 » et « jamais deux de suite » rompues). Simulation, 4 modes × 5 boîtes × 6 graines : 1677 doublons sur 6105 cartes Écrire. Hors échec, 0 violation (Voiture, boîte < 4 : 0). Retaper aussitôt la réponse qu'on vient de lire est de la copie, pas de la mémoire. Correction : `resoudreType` doit remplacer « ecrire » par « theme » pour un rendez-vous.
3. **Saisie latine : la translittération affichée par l'app est rejetée.** Chaque phrase du contenu (272 formes, genres et moules compris) tapée exactement comme la translittération de l'app : 10 justes (4 %), 38 « presque » (14 %), 224 faux (82 %). Exemples : `mójna pamýt roúki` donne « можна памыт руки » (faux) ; `zdrástvouïti` donne « здраствуйти » (2 lettres, faux) ; `ia khatchoú sniat diéngui` (faux). Cause : voyelles réduites, ь/ъ (`ïe`), « ts ». Pour un débutant sans clavier russe, c'est la voie annoncée (« lettres latines : je convertis ») : il copiera ce qu'il lit et verra « Pas tout à fait » presque à chaque carte, avec perte de boîte. Une romanisation ordinaire (`spasibo`, `pozhalusta`) passe. **À corriger, pas acceptable en l'état.** Piste simple : accepter aussi la saisie dont la forme latine sans accents est égale à la `translit` de la carte (ou comparer en espace phonétique).
4. **Mauvais genre accepté comme « presque ».** Genre choisi « f », réponse `Я рад` pour `Я рада` : « faute », comptée juste (1 lettre). Le genre est justement ce qu'on travaille. Mineur : à exclure si les deux formes diffèrent.
5. **Test de durée circulaire pour `ecrire`.** La table du test reprend les 25 s du moteur ; elle ne peut pas détecter une mauvaise estimation. Une session de boîtes ≥ 4 ne contient que des cartes Écrire (30 min : 72 cartes sur 72, aucune variété Sens/Écoute). À surveiller, sans bloquer.

## Durée annoncée vs réelle (point de Kostia)
Moteur piloté avec l'horloge simulée, Silence et Écouteurs, durée réelle d'une carte Écrire de 25, 35, 45 et 60 s :
- 30 min : écart ≤ 3 % dans tous les cas (le moteur lit l'horloge et réduit le nombre de cartes). **La limite de 20 % tient.**
- 15 min : ≤ 3 %. 5 min : ≤ 9 %. 2 min : jusqu'à 18,3 % (Silence, mélange, 60 s par carte) : à la limite.
- La vraie question reste la valeur de 25 s : non mesurable sans testeur humain (taper en cyrillique sur téléphone).

## Ce qui est conforme (vérifié)
- Casse, ponctuation, accent tonique, ё/е : 0 écart sur toutes les phrases du contenu (cyrillique tapé, MAJUSCULES, sans ponctuation).
- Une lettre d'écart : « presque », juste, bonne écriture montrée. Deux lettres : faux. « Да » : aucune tolérance (< 5 lettres).
- Deux formes acceptées si genre non choisi ; une seule si choisi. Moules : phrase complète, une autre occurrence est fausse.
- Jamais en Voiture, jamais en boîte < 4 hors re-passage (n°2). Apparition en Silence et Écouteurs vérifiée.
- Rendu Chrome 153 headless, émulation mobile (page servie par `python3 -m http.server`, boîtes 5 forcées) à 360×640 et 375×667 : champ 56 px, boutons 56 px, Suivant 52 px, Menu 44 px, aucun défilement horizontal, aperçu « Lu comme : » juste (capture : `docs/qa/captures/qa-011-ecrire-360.png`).
- Commentaire `shortcut:` de Kostia (`exercices.js`, voyelles réduites) : c'est le n°3, à lever. Pas de code en trop notable.

## Non testé
- Clavier virtuel iPhone / Android : Chrome headless n'en a pas ; l'absence de masquage du champ reste une hypothèse (champ et boutons dans la carte, haut d'écran). À vérifier par Max sur iPhone.
- Contrastes (non mesurés), VoiceOver/lecteur d'écran, hors ligne et premier lancement (inchangés par cette mission), Voiture et Parler en navigateur.
- Phrases à prénom : le contenu de test n'avait pas de personnage ; `!el.personnalise` lu dans le code seulement.
- Contenu JSON : aucun fichier modifié par la branche, non revalidé.
