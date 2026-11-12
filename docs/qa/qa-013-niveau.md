# QA mission 013 : test de niveau en 2 minutes (Boris, 12/11/2026)

**Verdict : Livrable avec réserves.** Une anomalie visible en Silence (le mot « null » à l'écran) est à corriger avant que Max le voie ; le reste est conforme au contrat.

Périmètre : branche `mission-013-niveau`, commit 69c0511. Une seule passe, périmètre par défaut.

## Automatique
- `node tests/moteur.test.mjs` : 1036 vérifications, 0 échec. `node --test tests/*.test.mjs` : pass. `node scripts/build.mjs` : 70 fichiers.
- Les tests du test de niveau sont placés AVANT le bilan et `process.exitCode`. Échec forcé (12 questions attendues portées à 13) : « 1 échec(s) » compté, `node --test` en échec. Fichier rétabli.

## Problèmes
1. **Moyenne : « null » affiché en Silence.** Étapes : nouvel utilisateur, Silence, Faire le test. Entre la phrase française et les 3 réponses, le texte « null » apparaît (360 et 375 px). Cause : `ecoute` vaut `null` en Silence et `contain.append(..., ecoute, liste)` (`ui/ecran-test.js`) l'écrit comme texte. Capture : `docs/qa/captures/qa013-silence-null.png`. À corriger : n'ajouter le bouton que s'il existe.
2. **Mineure : le test appelle `audio.amorcer()` même en Silence** (`app.js`, `lancerTest`), alors que `lancer` l'évite. Mesuré : aucun son ni `speak` en Silence (espion vide), donc le critère tient, mais l'incohérence est à nettoyer.
3. **Mineure : Réglages > Refaire le test prend `dernierMode`** (par défaut Silence). Un utilisateur d'Écouteurs qui n'a pas encore lancé de session n'a pas le bouton Écouter, sans moyen de le demander. Acceptable, à connaître.
4. **Mineure : doc non à jour.** `docs/pedagogie/test-niveau.md` liste hôtel, banque, restaurant ; le fichier et le test suivent l'ordre de Nadia (restaurant, hôtel, banque). Rien à faire dans le code.
5. **Contenu (rappel de Nadia, non bloquant)** : statut `brouillon` pour `test-niveau.json` ; « serviettes » (n° 10) ambigu en français ; « в медицине » et « со ста рублей » à faire valider par un natif. Pas de phrase scolaire repérée.
6. **Code** : rien de superflu relevé (`placerBonne` simplement exportée). `testNiveauPropose` n'est pas dans `REGLAGES_SAUVEGARDES` : sans conséquence, car une sauvegarde restaurée contient des fiches (plus « nouvel utilisateur »). Commentaires `shortcut:` ajoutés par cette mission : aucun (4 anciens, inchangés).

## Vérifié et conforme
- 12 témoins : tous les ids existent dans `content/ru/*.json`, textes français et russes conformes au tableau de Vera, 2 leurres par témoin, 12 situations distinctes, amis/meteo/telephone absents. Leurre n° 3 = « Очень приятно. » (rencontrer-005). Ordre final restaurant, hôtel, banque.
- Position de la bonne réponse sur 18 questions jouées en navigateur : 0, 1 et 2 toutes sorties (5 à 7 fois chacune).
- Arrêt après 2 erreurs de suite (faux, juste, faux, faux : arrêt à la 4e), une erreur isolée ne coupe pas. « 1 situation sur 15 », « 12 situations sur 15 » exacts (total = 15 depuis le contenu).
- Boîtes (IndexedDB réel) : réussi 2, raté 1, non posé reste absent (0). Relance depuis Réglages avec cafe-004 et urgences-001 en boîte 1 : elles restent en 1, les 10 autres passent à 2.
- Accueil : proposé une fois, après le lieu, nouvel utilisateur seulement. Jamais en Voiture (testé). « Passer » mène à l'étape durée ; après un test ou un passage, relancer ne le repropose pas.
- Aucun « A1/A2 » ni mot négatif dans `textes.js` ni à l'écran. Message honnête affiché à 12/12 (« Bagou s'arrête à ce niveau »), sans doublon.
- Sauvegarde : export puis import (`construireSauvegarde`/`lireSauvegarde`) de fiches de type `test` sans perte ; une session suivante passe la fiche de la boîte 2 à 3. Réglages et accueil existants : sans régression, aucune exception JS.
- Rendu Chrome headless (mobile émulé) à 360×640 et 375×667 : pas de défilement horizontal, aucune cible visible sous 44 px (seuls les radios cachés des Réglages mesurent 1 px, déjà présents avant). Silence : pas de bouton Écouter, aucun `speak`.

## Non testé
- iPhone réel / Safari : voix russe, sortie audio, zones sûres, appli installée.
- Bouton Écouter lisant les 3 réponses : lu dans le code (boucle sur les 3 options, interrompue par une réponse) ; en headless, sans voix, seule la première lecture est partie. Non entendu.
- Durée réelle du test (2 min) au chronomètre : non mesurée ; estimation de Vera seulement.
- Hors ligne (service worker) du nouveau fichier `test-niveau.json` : non rejoué ; il est dans les 70 fichiers du cache de `build.mjs`.
- Lecteur d'écran, clavier, contrastes de l'écran du test, thème sombre.
