# Audits : quoi, quand, comment (D24)

Un audit tient sur **1 page** : verdict (Livrable / Livrable avec réserves / Bloqué), 5 constats au plus, chacun avec sa gravité et son responsable. Rangé dans `docs/qa/AAAA-MM-JJ-sujet.md`.

| Audit | Fréquence / déclencheur | Qui | Audité | Pas audité |
|---|---|---|---|---|
| QA fonctionnelle | Une fois par mission, avant fusion dans `main` | Boris | Périmètre écrit au brief (2 tailles, Silence + Écouteurs, thème clair) | Le thème sombre et les 4 tailles : fin de phase seulement |
| Linguistique | À chaque lot de contenu, avant relecture native | Nadia (autocontrôle), puis natif humain | Accents, genre, registre, naturel, doutes listés dans `notes-linguiste-ru.md` | Le code |
| Données | Avant chaque fusion qui touche `content/` ou le stockage | Boris | Statut de chaque fichier, ids uniques, aller-retour export/import, `node tests/moteur.test.mjs` | L'esthétique |
| iPhone réel | À chaque version de test : 10 minutes par Max, **app installée, en mode avion**, après 24 h sans l'ouvrir | Max | Ouverture hors ligne, progression conservée, audio, zones sûres, export de la sauvegarde | Les autres navigateurs |
| Tokens | À chaque `/cloture`, 5 lignes | Sacha | Tokens par agent, part du livrable, règles de `processus.md` §7 | La qualité du contenu |
| Usage | Chaque dimanche pendant la bêta | Max | Jours actifs / 7, minutes, sessions complètes (écran Réglages) | Le contenu des réponses (rien ne quitte le téléphone) |

Règle : un audit sans déclencheur ne se lance pas.
