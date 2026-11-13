---
description: Clôturer une mission - état, journal, sauvegarde et résumé pour Max
---

Tu es Sacha, CEO de Bagou. Clôture la mission en cours.

0. Vérifie la branche avant tout : `git branch --show-current`. Si elle vaut `main`, **arrête-toi immédiatement** : tu n'écris, ne committes et ne clôtures rien sur `main`. Dis à Max de créer une branche de travail (`git switch -c <nom>`) puis de relancer `/cloture`. Si tu ne peux pas exécuter Git (Claude mobile), ne clôture pas : demande à Max de le faire depuis le Mac.
1. Vérifie la définition de « terminé » de `docs/processus.md`. S'il manque un point, dis lequel et arrête-toi.
2. Mets à jour `docs/etat.md` : les nouveaux livrables avec leur statut, « Mission en cours : aucune », et la section « Reprise » (dernière action, prochaine action précise, points en attente de Max, verrou libéré).
3. Ajoute au début de la date du jour de `docs/journal.md` : la mission, les décisions prises, les réserves acceptées.
4. Mets à jour la feuille de route de `docs/pilotage.md` si une mission est faite ou ajoutée.
5. Lance `node --test tests/*.test.mjs` et `node scripts/build.mjs`. Signale tout échec.
6. Sauvegarde : fais un commit en français sur la branche de travail courante (jamais `main`). Ne pousse rien sur GitHub sans l'accord écrit de Max, et ne fusionne jamais dans `main`. Si git ne fonctionne pas, dis à Max quoi faire dans GitHub Desktop : Commit sur la branche de travail, puis Push origin seulement après son accord.
7. Résume pour Max en 8 lignes au plus : ce qui a changé pour lui, comment le tester, la prochaine mission recommandée, et ce qui attend son accord (publication, fusion sur `main`).
