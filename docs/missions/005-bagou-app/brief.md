# Mission 005 : Bagou dans l'app

Brief de Sacha, 12/11/2026. Feu vert de Max (« go »), pendant son test. **Travail sur la branche `mission-005-bagou-app`** ; fusion dans `main` (donc publication sur vecu-test.netlify.app) seulement après le verdict de Boris.

## Pourquoi
Max a validé la planche Bagou (mission 003). Il veut la nouvelle identité et le nouveau parcours sans attendre la fin de son test.

## Objectif mesurable
Sur l'iPhone de Max (et sur tout smartphone de 360 à 430 px de large), l'app s'appelle Bagou, a l'identité russe, et se lance par le parcours en étapes, avec le choix des thèmes.

## Acquis à ne pas refaire
- Spécification : `docs/design/bagou-ru.md` (sections 1 à 5, 8, 9, 10, 11, 12) et planche `docs/design/maquettes/bagou-ru.html`. Elles font foi.
- Le moteur de session, Leitner, l'audio, le hors ligne, le stockage (`app/js/`) : on les garde et on les retouche, on ne les réécrit pas.
- Les tests `tests/moteur.test.mjs` : ils doivent continuer à passer.

## Périmètre
Inclus :
1. **Nom Bagou** partout : titre, manifeste, icône (matriochka simple), textes.
2. **Identité russe** : palette Gjel/Khokhloma en clair et en sombre (section 1), typographie (section 2), `content/ru/ambiance.json` (section 10) lu par l'app : couleurs et décors viennent de ce fichier, pas du code.
3. **Parcours d'accueil** (section 4) : Je suis où ? avec « Comme la dernière fois » ; J'ai combien de temps ? prérempli selon le lieu (mémoire par lieu) ; Sur quoi ? (« Au hasard » par défaut, choix multiple, « C'est parti ») ; pastilles de rappel touchables ; Retour en bas ; chemin Voiture jusqu'à « Avant le départ », avec la pastille de thèmes touchable.
4. **Choix des thèmes dans le moteur** : si des thèmes sont choisis, nouvelles phrases et révisions viennent uniquement de ces thèmes ; les révisions dues ailleurs attendent, sans pénalité. « Au hasard » = comportement actuel.
5. **Menu déroulant** (section 5) : bouton « Menu » écrit, toujours au même endroit. Entrées : Mes progrès (l'écran de progression existant, restylé avec les matriochkas par thème) et Réglages. Mon carnet arrivera dans la mission suivante : **aucune entrée vide ni « bientôt »**.
6. **Écran de phrase** dans la nouvelle identité (section 8), décor du thème discret.
7. **Matriochka** pour l'état d'une phrase et la progression d'un thème (section 3), avec forme et mot.

Exclu : l'étape « Comment ? » et les angles (mission à venir : pas de bouton « Changer » pour l'instant), Mon carnet, les statistiques détaillées.

## Tous les smartphones, iPhone d'abord
Max et ses collègues sont sur iPhone. Priorité absolue à Safari iOS et à l'app installée sur l'écran d'accueil :
- `viewport-fit=cover` avec `env(safe-area-inset-*)` (îlot dynamique, encoche, barre d'accueil) ; hauteurs en `100dvh` ou `height: 100%`, jamais `100vh` seul.
- Aucun élément touchable sous l'îlot ni sur la barre d'accueil.
- Mais aucune largeur fixe : tout doit tenir de 360 à 430 px (Android compris), et rester centré dans une colonne sur grand écran.

## Qui intervient
| Étape | Agent | Ce qu'il livre | Modèle |
|---|---|---|---|
| 1 | Kostia | Code, tests, relais | Sonnet (Opus si blocage, sur décision de Sacha) |
| 2 | Boris | Vérification : 360, 390, 430 px, iPhone simulé, Silence, Voiture, hors ligne, thèmes | Sonnet |
| 3 | Léa | Avis sur le nouveau parcours (captures) | Haiku |
| 4 | Sacha | Validation, fusion, publication | Opus |

## Critère de fin
Définition de « terminé » de `docs/processus.md`, plus : 1 appui suffit pour relancer « Comme la dernière fois », et une session avec 2 thèmes choisis ne contient que des phrases de ces 2 thèmes.
