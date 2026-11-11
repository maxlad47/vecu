# Mission 1 : le prototype jouable (phase 0)

Brief du CEO, 11/11/2026. Il complète `CLAUDE.md` et s'impose à tous les agents pour cette mission.

## Objectif
Une première version que Max ouvre sur son téléphone, choisit « j'ai 5 min, je suis en salle d'attente » et apprend tout de suite des phrases russes utiles. Critère de réussite de la phase : il l'ouvre spontanément pendant 2 semaines.

## Périmètre
- Langue : français → russe. Niveau : grand débutant (A1).
- **5 situations** (identifiants de fichiers entre parenthèses) :
  1. Au café (`cafe`)
  2. Faire les courses (`courses`)
  3. Ce que j'aime (`gouts`)
  4. Sortir (`sortir`)
  5. Rencontrer quelqu'un (`rencontrer`)
- **8 à 10 phrases par situation**, dont **2 phrases-moules** avec 4 à 6 remplacements chacune.
- Les phrases citées par Max doivent y figurer : « Combien ça coûte ? », « J'aime me promener le soir », « J'aime ton chien », « Je vais aller au foot ».

## Parcours
1. **Accueil** : deux choix, « J'ai combien de temps ? » (2, 5, 15, 30 min) et « Je suis où ? » (Silence, Écouteurs, Je peux parler, Voiture), puis un bouton pour démarrer. Les derniers choix sont mémorisés. Pas de compte, pas de tutoriel.
2. **Session** : une suite de cartes composée par le moteur de session.
3. **Fin de session** : ce qui a été appris et révisé, et un bouton pour continuer ou revenir à l'accueil.
4. **Progression** (écran simple) : les 5 situations avec le nombre de phrases acquises.
5. **Réglages minimaux** : afficher ou non la translittération, « je parle au masculin / au féminin » (pour les variantes), vitesse de la voix (normale ou lente).

## Types d'exercices
| Type | Description | Modes |
|---|---|---|
| Découverte | La phrase en français, en russe (avec accents), translittération, astuce éventuelle. Bouton d'écoute si le son est permis. | Tous sauf Voiture |
| Sens | Phrase russe affichée, choisir la bonne traduction française parmi 3. | Silence, Écouteurs, Parler |
| Thème | Phrase française affichée, choisir la bonne phrase russe parmi 3. | Silence, Écouteurs, Parler |
| Ordre | Remettre les mots russes dans l'ordre (phrases de 3 mots ou plus). | Silence, Écouteurs, Parler |
| Écoute | On entend la phrase russe sans la voir, choisir le sens parmi 3. | Écouteurs, Parler |
| À voix haute | La phrase française, l'utilisateur la dit en russe, révèle la réponse, puis s'auto-évalue (« Je l'avais » / « Pas encore »). | Parler |
| Moule | La phrase-moule avec un remplacement tiré au hasard : choisir le bon sens ou la bonne phrase. | Silence, Écouteurs, Parler |
| Boucle voiture | Sans écran ni toucher : français (voix française), pause pour répondre, russe deux fois (une lente, une normale), pause, phrase suivante. Un seul gros bouton pause/reprise. La session s'arrête seule à la fin de la durée. | Voiture |

Le pédagogue fixe les règles de composition (combien de nouvelles phrases, part de révision, ordre des exercices) par durée et par mode, et le rythme de répétition espacée. Les règles doivent être assez précises pour que le développeur les code sans interprétation.

## Contraintes techniques
- HTML, CSS, JavaScript sans aucune dépendance externe (ni bibliothèque, ni police distante, ni CDN). Polices système, pour que tout marche hors ligne.
- Sources dans `app/`. Contenu dans `content/ru/` : un fichier JSON par situation, plus `content/ru/index.json` qui liste les situations dans l'ordre (`{ "langue": "ru", "situations": [{ "id": "cafe", "titre": "Au café", "fichier": "cafe.json" }, ...] }`).
- Un script `scripts/build.mjs` (Node, sans dépendance) assemble `dist/` : le contenu de `app/` à la racine et le contenu dans `dist/content/`. L'app charge son contenu par chemin relatif `content/ru/...`. C'est `dist/` qui sera hébergé.
- Hors ligne : `sw.js` met en cache l'app et le contenu. Son enregistrement est entouré d'un try/catch : dans certains aperçus il est refusé, et l'app doit continuer à marcher.
- Progression : IndexedDB, avec repli en mémoire si le stockage est indisponible ou lève une erreur. Jamais de plantage.
- Audio : Web Speech API (`speechSynthesis`), voix `ru-RU` pour le russe et `fr-FR` pour le mode voiture. La lecture ne démarre qu'après un geste de l'utilisateur. S'il n'existe pas de voix russe, un message clair le dit et propose de passer en mode Silence. En mode Silence, aucun appel à la synthèse vocale n'est possible.
- Interdits : `alert`, `confirm`, `prompt`, `window.open`, tout appel réseau vers un autre site. Navigation interne par état en mémoire (pas de routage par URL).
- Thèmes clair et sombre : toutes les couleurs passent par des variables CSS définies dans `:root`, redéfinies sous `@media (prefers-color-scheme: dark)` (avec `:root:not([data-theme="light"])`) et sous `:root[data-theme="dark"]`. Fond explicite sur `body`.
- Mobile d'abord (360 px de large), cibles tactiles d'au moins 44 px, focus visible, respect de `prefers-reduced-motion`. Sur grand écran, le contenu reste dans une colonne centrée de largeur téléphone.
- `manifest.webmanifest` et une icône SVG, pour l'installation sur l'écran d'accueil.

## Ordre de passage
1. `pedagogue` et `designer-ux` en parallèle.
2. `linguiste-russe` à partir des phrases du pédagogue.
3. `dev-pwa` à partir du contenu, des règles et des écrans.
4. `testeur-qa`, puis `utilisateur-temoin`.
5. Corrections, validation du CEO, lien de test privé pour Max. Aucune mise en ligne publique.
