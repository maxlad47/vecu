# Relais de Kostia : mission 005 (Bagou dans l'app), reprise

Branche `mission-005-bagou-app`. Tests (`node --test tests/*.test.mjs` : 709 vérifications, 0 échec) et `node scripts/build.mjs` (54 fichiers en cache) passent. Capture de l'accueil à 390 × 844 : `accueil.png`.

## Ce qui a changé
- Nom Bagou : titre, manifeste, icônes (matriochka, 180/192/512), textes, cache `bagou-<version>` (les anciens caches `vecu-` sont supprimés à l'activation).
- Ambiance : `content/ru/ambiance.json` + 14 SVG, lus par `app/js/ambiance.js` (contrôle des contrastes de 1.2, refus = ambiance neutre). Clair, sombre, Voiture.
- Parcours : `app/js/parcours.js` (logique pure, testée) et `ui/accueil.js` : Je suis où ?, « Comme la dernière fois » (1 appui), durée préremplie par lieu avec mémoire, Sur quoi ? (Au hasard, choix multiple, « C'est parti »), pastilles touchables, Retour en bas. Voiture : étape 2 puis « Avant le départ ».
- Moteur : paramètre `themes` de `creerSession` (nouvelles, dues, remplissage limités aux thèmes ; dues ailleurs intactes). « Tu sais dire N phrases » compte tout le contenu.
- Menu (`ui/menu.js`) : Mes progrès (matriochkas par thème), Réglages. Écran de phrase (décor, matriochka, poupées du thème). iPhone : `viewport-fit=cover`, `env(safe-area-inset-*)`, `100dvh`, aucune largeur fixe.

## Pour Boris (priorités)
1. Parcours complet à 360, 390 et 430 px, sur Safari iOS si possible : rien sous l'îlot ni sur la barre d'accueil, aucun débordement horizontal.
2. Session avec 2 thèmes cochés : uniquement leurs phrases ; « Comme la dernière fois » relance les mêmes thèmes.
3. Silence : aucun son, y compris menu et « Avant le départ ». Voiture : « Je démarre » passe en sombre, thèmes respectés.
4. Hors ligne après une première visite ; mise à jour depuis l'ancienne version Vécu (cache et IndexedDB conservés).
5. Menu ouvert en session : chrono en pause, Échap ferme, focus rendu au bouton.
6. Accent tonique sur le russe : poids 500, pas de décollement.
7. Rouge laque / rouge « faux » proches (point ouvert 3 de Lou) : à regarder sur iPhone.

## Commentaires `shortcut:`
- `app/js/parcours.js` : une seule durée retenue par lieu.
- `app/js/ambiance.js` : lecture des SVG par expression régulière.
- `app/js/ui/matriochka.js` : « en cours » sans distinguer fragile / presque acquise (mapping à valider par Vera, point ouvert 4).
- `app/js/ui/accueil.js` : pas d'étape « Comment ? ».

## Limites
- Je n'ai pu rejouer ni `tests/qa/scenarios.rb` (le client CDP échoue sur le Ruby de cette machine : « trame invalide »), ni vérifier les écrans autres que l'accueil à l'œil. Seul l'accueil est capturé.
