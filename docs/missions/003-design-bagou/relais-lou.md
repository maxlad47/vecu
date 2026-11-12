# Relais de Lou : mission 003

## Livré
- `docs/design/bagou-ru.md` : palette Gjel et Khokhloma (clair et sombre, contrastes AA calculés), matriochka, parcours, menu, carnet, progrès, décors, format `ambiance.json`.
- `docs/design/maquettes/bagou-ru.html` : planche de 8 écrans, thème clair, sans script.

## Décisions prises
- Bouton principal en laque rouge, sélections en cobalt : le rouge reste rare (10 %).
- Or clair (2,3:1) réservé au décor ; texte or = `#7A5C00`.
- Accent tonique non coloré (le croquis le colorait en rouge) : rendu sûr du diacritique.
- « Comment ? » est facultatif : « C'est parti » part dès l'étape 3, « Changer » mène à l'angle.
- Voiture saute thèmes et angle : au volant, pas de choix.
- Moule = une ligne dans le carnet, « 5 autres mots » à déplier.

## Pour Kostia
- Nouveaux tokens (`--laque`, `--on-laque`, `--laque-soft`, `--or`, `--or-text`, `--deco-*`), chargés depuis `ambiance.json`.
- Accueil en 4 étapes + pastilles touchables + « Comme la dernière fois » (mémoriser lieu, durée, thèmes, angle).
- Durée préremplie par lieu : Sans son 2, Écouteurs 5, Je peux parler 15, Voiture 30.
- « Avant le départ » (Voiture) ; bouton « Menu » déroulant sur tous les écrans ; écrans Mon carnet (filtre, recherche, Écouter, Montrer plein écran) et Mes progrès.
- Composant matriochka (4 états, rangée gigogne) et chargement des décors SVG ; renommer l'app en Bagou.

## Points ouverts
- 1. Max : « Comment ? » facultatif (via « Changer ») te convient-il, ou une 4e étape obligatoire ?
- 2. Max : en Voiture, on ne choisit pas les thèmes avant de partir : d'accord ?
- 3. Max : rouge laque du bouton proche du rouge de l'erreur. À juger sur iPhone.
- 4. Vera/Kostia : lien entre les 4 états et les boîtes Leitner.
- 5. Nadia, Max : décors et noms (pelmeni, Gjel) à faire relire par un natif.
- 6. Boris : tester le contraste des SVG de décor une fois en app.
