# QA mission 006 : écrans adaptatifs (12/11/2026)

**Verdict : Livrable avec réserves.** Sur ce qui a été mesuré (Silence, clair, 4 tailles), tous les critères du brief tiennent. Mais la couverture est réduite (consigne de Sacha) : Écouteurs, sombre, Écoute, À voix haute et Safari/PWA installée ne sont pas testés.

## Méthode
`bash scripts/build.sh`, `dist/` servi par `python3 -m http.server`, Chrome headless (CDP). Script `tests/qa/tailles.rb` repris et corrigé : une seule session Silence 5 min par taille, 25 cartes max, mesure AVANT puis APRÈS réponse (panneau de retour, Suivant visible), réponses justes et fausses (13 à 14 panneaux d'erreur par taille).
Anciens défauts du brouillon : bouton « Suite » mal visé (ids réels `#duree-5`, `#suite`, `#c-est-parti`), « retour » jamais mesuré (le pilote cliquait Suivant aussitôt), espion de synthèse absent (en Écouteurs l'app reste sur « Je prépare la voix… » dans Chrome headless).

## Mesures (45 états par taille : avant et retour)
| Taille | Page défile | Bas du bouton le plus bas / limite | Cibles < 44 px | Haut de l'en-tête | Bouton hors écran |
|---|---|---|---|---|---|
| 375 × 667 | non | 617 / 627 | 0 | 6 px | 0 |
| 360 × 640 | non | 590 / 600 | 0 | 6 px | 0 |
| 393 × 852 | non | 802 / 812 | 0 | 6 px | 0 |
| 430 × 932 | non | 882 / 892 | 0 | 6 px | 0 |

Types vus : Découverte, Sens, Thème/Moule (« Comment on dit ? »), « Même phrase, autre mot ». Aucune zone de contenu n'a eu besoin de défiler (0 sur 180 états). Aucune erreur de page.
Automatique : `node --test tests/*.test.mjs` : 710 vérifications, 0 échec ; Voiture, onend jamais : pire écart 16,1 % (réserve connue, mission audio).

## Problèmes
1. **[Réglage à faire] `--reserve-netlify: 40px`** (`app/css/app.css`, ligne 27, utilisée aux lignes 107, 295 et dans `.zone-action` et `.retour`). Le bandeau n'existe plus depuis GitHub Pages : la marge est inutile. Elle laisse 50 px sous le bouton le plus bas sur 375 × 667, soit de la place perdue sur les écrans bas. Passer à `0px` ou supprimer la variable.
2. **[Couverture] Non vérifiés, donc non garantis** : Ordre et À voix haute (types absents de ces 25 cartes ou non distingués dans mes libellés), Écoute (exige l'espion de synthèse, ajouté au script mais non rejoué faute de temps), Écouteurs, sombre. Les chiffres de Kostia (Chrome, 375 et 360) concordent avec les miens sur les tailles communes.
3. **[Info] Voile en bas du contenu** permanent (dégradé de 16 px) même sans défilement : cosmétique, signalé par Kostia.

## Anciennes réserves (rapport 2026-11-12-bagou-app.md)
- Code mort `options.bouton` dans `lancer()` : non revérifié.
- Apostrophes droites (« Ce que j'aime ») : toujours présentes dans l'écran Sur quoi ? (vu dans le DOM). Cosmétique.
- Mes progrès à 360 px sans indice de défilement : non revérifié.

## `shortcut:` (un par fichier)
`accueil.js`, `matriochka.js`, `ambiance.js`, `parcours.js` : les 4 déjà connus, aucun nouveau.

## Non testé, et pourquoi
- Écouteurs, Je peux parler, Voiture, thème sombre : consigne de réduction de Sacha (les lots parallèles étaient trop lents).
- Écoute, À voix haute, Ordre séparément ; phrase russe la plus longue ; sans translittération.
- Safari iOS et app installée : pas d'iPhone ; `safe-area` lu dans le code seulement.
- Menu ouvert en session, clavier 1/2/3 et Entrée, réduire les animations, poupées coloriées en fin : non rejoués.
- Astuces raccourcies par Nadia : non retestées après fusion.
- Contrastes : non recalculés.
- Hors ligne : non retesté.
