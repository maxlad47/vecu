# Relais de Kostia, mission 012 (univers de vocabulaire)

## Fait
- 5 univers déclarés dans `content/ru/index.json` (clé `univers`, avec les seuils d'entrée de Vera), chargés par `contenu.js` (un fichier absent est ignoré).
- Moteur : un univers entre quand assez d'éléments de situations sont introduits (compte lu au début de la session), au plus 1 en 5 min, 2 en 15 et 30 min, 0 en 2 min. Il prend la place d'un nouvel élément de situation (N inchangé). Toujours en cartes Moule (Boucle en Voiture), phrase entière.
- Un seul choix d'accueil « Inclure les univers de vocabulaire » (étape « Sur quoi ? »), actif par défaut, aussi dans Réglages. Réglage `universInclus`.
- Mes progrès : une rangée par univers. Mêmes boîtes Leitner. Niveau jamais affiché.
- Tests : 48 nouvelles vérifications avant le bilan ; échec forcé prouvé (code de sortie 1). `node tests/moteur.test.mjs` 0 échec, build OK, `verifier-publication.mjs` bloque toujours (22 fichiers).

## Fichiers
`app/js/{contenu,moteur,config,parcours,app,textes}.js`, `app/js/ui/{accueil,ecrans,ecran-session,voiture}.js`, `content/ru/index.json`, `tests/moteur.test.mjs`.

## Non testé
iPhone réel, rendu de la tuile et de l'interrupteur (aucun navigateur ici), hors ligne réel.

## Pour Boris
1. Étape « Sur quoi ? » : la tuile univers (cible 56 px), décocher puis relancer : aucune carte d'univers. Même état dans Réglages.
2. Un univers n'apparaît qu'après 10 phrases de situations introduites : utiliser une progression préparée.
3. Carte Découverte d'un univers : décor par défaut, ligne de progression « Univers : … », phrase complète.
4. Mes progrès : rangées d'univers ; réglage décoché = seulement ceux commencés.
5. Voiture : l'univers passe en Boucle (le moteur ne l'interdit pas).

## Décisions à confirmer (Sacha / Vera)
- Univers inclus même quand des situations sont choisies (« Inclure » pris au sens littéral).
- Seuil lu au début de session : un univers entre à la session suivante, pas en cours.
- Voiture autorisée (Vera ne l'interdit pas).
- Seuils dans `index.json`, limites par durée dans `config.js` (UNIVERS).
