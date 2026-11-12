# Mission 003 : design Bagou

Brief de Sacha, 12/11/2026.

## Pourquoi
Max a validé une vision produit (D17) et un nom, Bagou (D15). Avant de construire, il faut des maquettes précises que Max valide sur son iPhone. On ne touche pas à l'app.

## Objectif mesurable
Max voit sur une seule planche d'images les écrans de Bagou version russe, et peut dire « oui, on construit ça ».

## Acquis à ne pas refaire
- Le système visuel de la phase 0 (`docs/design/systeme-visuel.md`) : base technique (tokens, thèmes clair et sombre, accessibilité). On garde la structure, on change l'identité.
- Les écrans d'exercices de la phase 0 (`docs/design/ecrans-phase0.md`) : on ne les respécifie pas, on montre seulement un écran de phrase dans la nouvelle identité.
- Le croquis validé par Max (`docs/design/maquettes/croquis-bagou.png`, avec son code `croquis-bagou.html`) : c'est le point de départ, à améliorer, pas à contredire.

## Périmètre
Inclus :
1. **Identité russe** : palette Gjel (bleu cobalt et blanc porcelaine) et Khokhloma (rouge laqué et or), environ 70 % blanc, 20 % bleu, 10 % rouge et or, en clair et en sombre. **Aucun drapeau, ni bandes tricolores.** Typographie système lisible pour le cyrillique.
2. **Ambiance par langue** : un format de fichier `content/<langue>/ambiance.json` (couleurs, objet de progression, décors par situation) pour qu'une nouvelle langue change d'ambiance sans toucher au code. Juste la spécification.
3. **Parcours d'accueil** : Je suis où ? (4 lieux, avec le raccourci « Comme la dernière fois » en gros bouton en bas), J'ai combien de temps ? (prérempli selon le lieu), Sur quoi ? (« Au hasard » par défaut, choix multiple, bouton « C'est parti »), Comment ? (Phrases du quotidien, Verbes, Vocabulaire, Grammaire). Pastilles de rappel touchables, retour en bas. Chemin Voiture : lieu, durée, puis « Avant le départ ».
4. **Menu déroulant** : un bouton « Menu » écrit, toujours au même endroit. Entrées : Mon carnet, Mes progrès, Réglages.
5. **Mon carnet** : « Tout » ou un thème, recherche, chaque phrase avec écoute, « Montrer » en plein écran, et son état.
6. **La matriochka** : 4 états d'une phrase (pas vue, vue, en cours, acquise), avec forme et mot, jamais la couleur seule. Les poupées d'un thème qui se complètent.
7. **Mes progrès** : temps passé, jours pratiqués, mode et durée préférés, progression par thème. Sans séries ni badges.
8. **Décors** : un décor discret par situation (samovar pour le café, lustres du métro de Moscou, ponts de Saint-Pétersbourg, pelmeni, bulbes de Saint-Basile…). Pharmacie et Urgences restent sobres. Pas d'ours ni de vodka.

Exclu : tout changement dans `app/`. Le nom Bagou apparaît sur les maquettes.

## Qui intervient
| Étape | Agent | Ce qu'il livre | Modèle |
|---|---|---|---|
| 1 | Lou | Spécification + planche de maquettes HTML + relais | Sonnet |
| 2 | Sacha | Rendu en image pour Max, validation | Opus |

## Contraintes
- Mobile 360 à 390 px, une main, cibles de 44 px, contrastes AA vérifiés pour chaque couleur de la palette.
- Illustrations en SVG simples, un seul style, légères (le hors ligne doit rester rapide).
- La phrase russe reste la star de l'écran de phrase.

## Critère de fin
Max valide la planche. Ensuite seulement, une mission « Bagou dans l'app » sera lancée.
