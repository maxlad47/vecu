# QA mission 012 : univers de vocabulaire (branche mission-012-themes)

**Verdict : Livrable avec réserves.** Aucun défaut bloquant. Réserves mineures ci-dessous, la justesse du russe reste à trancher par un natif.

## Tests automatiques
- `node tests/moteur.test.mjs` : 1070 vérifications, 0 échec. Les tests de la mission sont AVANT `sortie()` et `process.exitCode` (échec forcé sur « 10 moules d'univers » : 1 échec, code 1, fichier restauré).
- `node --test tests/*.test.mjs` : passe. `node scripts/build.mjs` : dist construit (72 fichiers).
- `node scripts/verifier-publication.mjs` : code 1, 22 fichiers BLOQUÉS (dont les 5 univers). Attendu.

## Contenu (conformité seulement)
- 5 fichiers `univers-*.json` : JSON valide, format de courses.json, `statut` valide-nadia, 2 moules et 5 remplacements chacun (10 moules, 50 remplacements), ids `ru-<univers>-001/002` uniques, sans collision avec les situations.
- Script : 0 champ vide ou « null » dans les remplacements, même nombre de mots entre phrase_cible, phrase_accent et phrase_translit, l'accent ne change que les marques, tout mot de 2 voyelles ou plus porte un accent (ё compté). Translittérations cohérentes à la lecture.
- Doublons avec les situations : « вайфай » (cafe.json, et univers-maison-002 « Вайфай не работает »), « сыр » (courses.json, et nourriture-002 « есть сыр »). Voulu côté phrase, à noter.

## Moteur (lecture et simulation : 4 modes, 4 durées, 5 niveaux d'avancement, 2 graines)
- Seuils respectés (aucun univers avec moins de 10 éléments vus), 0 en 2 min, au plus 1 en 5 min, 2 en 15 et 30 min : aucune violation.
- Durée réelle : écart maximal 20,0 % (limite exacte, pas dépassée). Aucune régression constatée.
- Univers uniquement en cartes Moule (phrase entière) ou Boucle en Voiture. Fichier d'univers absent : contenu.js l'ignore (testé aussi par la suite).
- Export puis import : les fiches `ru-lieux-*` et `ru-maison-*` sont reprises (import par l'écran Réglages, vérifié dans Chrome).

## Problèmes, du plus grave au moins grave
1. **L'interrupteur n'est pas dans la sauvegarde.** `universInclus` manque dans `REGLAGES_SAUVEGARDES` (`app/js/sauvegarde.js`). Reproduire : décocher les univers, exporter, effacer les données, importer : les univers sont de nouveau inclus. Mineur.
2. **Univers absent : rangée « 0 sur 0 » et tuile d'accueil quand même.** Si tous les fichiers manquent, `listeUnivers` garde 5 entrées vides (`ids: []`) : la tuile « Inclure les univers » s'affiche et Mes progrès montre 5 rangées vides. Cas rare (hors ligne avant mise en cache), non reproduit à l'écran, déduit du code.
3. **Titres « Univers : … » dans Mes progrès** (« Univers : la nourriture et les boissons ») : longs, passent sur 2 lignes à 360 px. Cosmétique.
4. **Modèle `Мне нужен/нужна/нужно/нужны ___`** (maison-001) : si l'app affiche le modèle, la forme à 4 choix sent le manuel. L'astuce, elle, tient en 2 lignes. À confirmer par Max à l'écran.
5. Tuile d'interrupteur : le titre est serré contre le bord haut à 360 px (voir capture), sans gêne de lecture.

## Rendu (Chrome headless 153, 360×640 et 375×667)
- Tuile d'accueil « Inclure les univers de vocabulaire » : 324×83 px (360) et 337×83 px (375), cochée par défaut, aucun défilement horizontal (scrollWidth = largeur).
- Interrupteur de Réglages : hauteur 56 px, `role=switch`. Décocher à l'accueil le décoche dans Réglages et inversement. Persistant après rechargement de la page.
- Mes progrès : 5 rangées d'univers (poupées), « Tout est acquis » pour les 2 moules en boîte 5, aucun « A1/A2 », aucun « null/undefined/NaN » dans le texte des écrans visités (accueil, durées, thèmes, Réglages, progrès).
- Captures : `docs/qa/captures/` non ajoutées (fichiers dans /tmp/qb, hors dépôt).

## Non testé
- Une session jouée dans le navigateur avec une carte d'univers (rendu de la carte Moule d'univers, audio, Voiture) : couvert seulement par les tests du moteur et ma simulation, pas à l'écran.
- Hors ligne (service worker) avec les 5 fichiers d'univers : non vérifié.
- Contraste de la tuile, clavier, voix : non vérifiés.
- Premier lancement réel sur iPhone. Justesse du russe : natif.
- Commentaires `shortcut:` de Kostia et code en trop : pas de passage détaillé ; rien de superflu vu dans le diff (une seule option `universInclus`, une constante `UNIVERS`).
