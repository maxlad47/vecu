# QA mission 010 : statistiques avancées dans Réglages

Date : 12/11/2026. Boris. Branche `mission-010-statistiques` (commit 801b1a3). Contre-vérification : aucune, premier passage.

**Verdict : Livrable avec réserves.** Calculs justes en dehors d'un bord (heure d'été), rendu propre à 360 et 375 px, bloc Sauvegarde intact.

## Automatique
- `node tests/moteur.test.mjs` : 1028 vérifications, 0 échec. `node --test tests/*.test.mjs` : 1 passé, 0 échec. `node scripts/build.mjs` : OK (67 fichiers).

## Calculs (lecture + essais en Node)
Vérifiés justes : jours actifs 7/30, minutes (3 h 08 pour 188 min), sessions (12), mode préféré, série (1 oubli pardonné : jours 0,1,3,4 donne 4 ; 2 oublis : 0,1,4,5 donne 2), historique vide (zéros, texte « Rien à compter »), ancienne sauvegarde sans `modes` (acceptée, ligne du mode absente), « 1 session » au singulier, export/import inchangés.

## Problèmes
1. **Heure d'été (mineur, réel).** `statistiquesUsage` retranche `i * 86400000` ms à « maintenant ». Le jour du passage à l'heure d'été (23 h), à 00:30 local, un jour est sauté et un autre compté deux fois. Repro : `TZ=Europe/Paris`, `maintenant = 2027-03-30T00:30`, 10 jours consécutifs actifs : `actifs30` = 9 et `serie` = 9 au lieu de 10. Même schéma dans `resumeUsage` (hérité). Correctif : construire la date par `new Date(a, m, j - i, 12)`.
2. **Import sans rafraîchissement (mineur).** Après « Importer une sauvegarde », le message de succès s'affiche mais les statistiques restent celles d'avant jusqu'à la réouverture de Réglages.
3. **Libellés (mineur).** « Temps passé » et « sessions » couvrent 120 jours, sans le dire (les autres lignes disent 7 ou 30). « 12 sessions » seul, sans intitulé, se lit mal. « Série : 5 jours » compte des jours actifs, pas des jours calendaires (0,1,3,4,6 affiche 5 alors que la série couvre 7 jours) : à assumer ou reformuler.
4. **Série (à confirmer par Sacha).** Aujourd'hui et hier vides, avant-hier actif : la série continue (aujourd'hui non compté, hier pardonné). Conforme à la règle écrite, mais un utilisateur absent hier voit sa série intacte et ne sait pas qu'elle tient à un fil.
5. **Texte.** « un oubli isolé ne la casse pas » est tenu, mais phrase de 9 mots un peu manuel ; ton acceptable pour Réglages.

## Rendu (Chrome headless 153, CDP, émulation mobile ×2, dist/ servi par python http.server)
- 360×640 et 375×667 : pas de défilement horizontal (scrollWidth = clientWidth), 7 lignes lisibles, retours à la ligne propres, rien de coupé. Bloc Sauvegarde et boutons Exporter/Importer (hauteur ≥ 44 px) et Retour identiques à la mission 009. Capture : `docs/qa/captures/010-reglages-360.png`.
- Remarque : les boutons Exporter et Importer se touchent presque (écart ~2 px). Existait déjà en 009, hors périmètre.

## Non testé
- iPhone réel (Safari, app installée, zones sûres), VoiceOver, thème sombre, grande taille de texte système.
- Enchaînement réel session → fin → Réglages pour vérifier le mode enregistré (seul `noterSession(…, mode)` lu, et les tests unitaires).
- Rendu avec situations vues/en cours/acquises non nulles (aucune fiche injectée : « 0 sur 15 » seulement ; calcul lu et couvert par les tests).
- Import/export en vrai dans le navigateur (logique lue, non cliquée).
- Écran vide à l'écran (profil Chrome réutilisé, non vierge) ; couvert par essai en Node.
- Pas de commentaire `shortcut:` ni de code en trop relevés dans le diff.
