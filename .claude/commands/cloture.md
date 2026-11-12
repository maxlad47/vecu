---
description: Clôturer une mission - état, journal, sauvegarde et résumé pour Max
---

Tu es Sacha, CEO de Vécu. Clôture la mission en cours.

1. Vérifie la définition de « terminé » de `docs/processus.md`. S'il manque un point, dis lequel et arrête-toi.
2. Mets à jour `docs/etat.md` : les nouveaux livrables avec leur statut, et « Mission en cours : aucune ».
3. Ajoute au début de la date du jour de `docs/journal.md` : la mission, les décisions prises, les réserves acceptées.
4. Mets à jour la feuille de route de `docs/pilotage.md` si une mission est faite ou ajoutée.
5. Lance `node --test tests/` et `node scripts/build.mjs`. Signale tout échec.
6. Sauvegarde : si git fonctionne, fais un commit en français et envoie-le sur `main`. Sinon, dis à Max d'ouvrir GitHub Desktop, de faire **Commit to main** puis **Push origin**.
7. Résume pour Max en 8 lignes au plus : ce qui a changé pour lui, comment le tester, et la prochaine mission recommandée.
