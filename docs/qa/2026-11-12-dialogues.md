# QA mission 008 : dialogues à choix et métiers (Boris, 12/11/2026)

**Verdict : Livrable avec réserves** (aucun bloquant ; 3 réserves mineures, dont 2 de contenu à trancher).
Périmètre : 375×667 et 360×640, clair, Silence et Écouteurs, Chrome headless, build `bash scripts/build.sh` (66 fichiers).

## Résultats par point
1. `node --test tests/*.test.mjs` : 1 fichier, 0 échec.
2. Fréquence : 5 min, thème Se présenter : bulle à la 4e carte (après la 3e). 2 min : aucune bulle en 250 cartes. Voiture 5 min : aucune carte Dialogue, aucun son. OK.
3. Carte Dialogue : bulle du partenaire, ligne « Maxime / Tu réponds », 2 à 3 réponses de 60-61 px, cibles tactiles toutes ≥ 44 px, page jamais défilée, panneau de retour, un seul « Pas tout à fait. » par tap, bonne réponse = suite de l'échange, fin du dialogue propre (retour à une carte ordinaire). `tests/qa/dialogue.rb` relancé : 0 erreur JS.
4. Féminin (Léa, infirmière) : « Enchantée », « Я медсестра́ / Je suis infirmière », « Меня́ зову́т Леа́ ». Masculin (Paul) : « Enchanté », « Я медбра́т / Je suis infirmier ». Accords corrects FR et RU, partenaire lui répond « Ах, вы медбрат ! ». Sans personnage : aucun jeton `{prenom}`/`{metier}`/undefined, aucune erreur. Sans genre à l'hôtel : question « Tu parles… au masculin / au féminin / Plus tard ». OK.
5. Silence : 0 appel de synthèse. Écouteurs : réplique du partenaire lue à l'arrivée (« Здравствуйте, меня зовут… »). OK.
6. Leitner (IndexedDB) : bonne réplique = ligne en boîte 1 (ru-rencontrer-005) ; les répliques ratées ne créent pas de fiche. OK.
7. Métiers : 43 métiers, 9 catégories (contrôlé dans personnage.json), accordéon (un seul ouvert), métier courant visible à 375×667 et 360×640, aucune cible < 44 px, page non défilée ; choisir Infirmière met à jour le champ et le personnage. OK.
8. Hors ligne : dialogues.json, dialogues.js, carte-dialogue.js sont dans la liste du service worker (`dist/sw.js`). Cache réel non testé.

## Problèmes (du plus grave au moins grave)
1. **Coïncidence prénom (contenu, mineur).** Le partenaire s'appelle Paul (dialogue voisin) ; un utilisateur nommé Paul répond « Меня зовут Поль » à un Paul. Étapes : Réglages, prénom Paul, masculin, Infirmier ; session 5 min Se présenter ; dialogue voisin. Peu probable mais incongru. À trancher par Vera/Nadia (partenaire à prénom variable ou sans prénom).
2. **Panneau de retour : la scène défile en interne (cosmétique).** 375×667 après une mauvaise réponse (« Pas tout à fait ») : zone scène 371 px pour 381 de contenu (10 px). À 360×640 aussi sur la 1re bulle (sceneDefile vrai à l'échange 0). La page ne défile pas ; à regarder sur iPhone réel.
3. **Aide à la bonne réponse peu lisible (contenu).** Après une mauvaise réponse, « On dirait plutôt : » affiche la phrase sans dire quel cas de figure (« Il demande ton prénom. » est bien, mais la phrase corrigée est suivie du bouton sans pause). Pas bloquant ; à faire juger par Léa.
4. Mineur : première entrée de la synthèse espion = `" "` (échauffement), pas d'effet audible ; l'écran Silence reste muet.

## Code
- Code en trop : rien de signalé (dialogues.js 88 lignes, carte-dialogue.js 89, `flex: none` justifié).
- `shortcut:` présents (4, aucun nouveau dans 008) : `accueil.js:129` (pas d'étape « Comment ? »), `parcours.js:6` (une durée par lieu), `ambiance.js:124` (SVG par regex), `matriochka.js:13` (« en cours » sans « fragile »).

## Non testé
- iPhone réel, thème sombre, 2 autres tailles, Je peux parler (hors périmètre).
- Hors ligne réel (coupure réseau) : seule la liste du service worker est vérifiée.
- 2 min : seulement 250 cartes en ~30 s, pas la session complète en temps réel.
- Prénom très long, « Plus tard » à l'hôtel, effacement du personnage puis rejeu : non rejoués.
- Contenu russe des 43 métiers et des dialogues : relecture native toujours requise (CLAUDE.md règle 7).
- Captures : `docs/missions/008-dialogues/capture-375x667-dialogue.png`, `-dialogue-retour.png`, `-metiers.png`, `capture-360x640-dialogue.png`.
