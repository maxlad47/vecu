# QA mission 014 : refonte du design « matriochka » (Boris, 13/11/2026)

**Verdict : Livrable avec réserves.** Un défaut visible (le samovar passe sur la phrase russe) à corriger ; le reste tient. Branche `mission-014-outils-design`, HEAD ccea5e6, une seule passe.

## Automatique
- `node --test tests/*.test.mjs` : 1140 vérifications, 0 échec. `node scripts/build.mjs` : 75 fichiers.
- `impeccable detect --json app/` : `[]` (aucun signalement).
- Couleurs : `git diff main` ne touche pas `content/ru/ambiance.json` ; aucun token modifié dans les sections 1-2 de `app/css/app.css` (seul ajout en section 2 : `overflow-x: clip`). La section 16 n'a aucune valeur de couleur en dur (tout passe par `var(--…)` et `color-mix`). Les 4 poupées SVG n'utilisent que des `var(--…)`.
- Commentaires `shortcut:` : 5 dans `app/`, aucun ajouté par cette mission.

## Problèmes
1. **Moyenne : le samovar (décor de carte) recouvre la fin de la phrase russe en Découverte.** `app/css/app.css:791` (`.decor-carte { top: 0; right: 0; width: 56px }`) combiné à la suppression du `padding-right: 84px` de `.fr-dessus` : la phrase russe (`.ru-hero`, ligne 783) n'a aucune réserve à droite. Reproduire : 360×640, Écouteurs ou Silence, session, première phrase « Кофе, пожалуйста. » : le pied du samovar barre le point et le « а » final. Sur une phrase courte (« Здравствуйте. ») rien ne se voit ; le cas apparaît dès que la phrase prend toute la largeur. Vu en sombre à 360 px ; même CSS en clair.
2. **Mineure : l'interrupteur « mots par sujet » est caché par défaut à l'étape 3.** `app/js/ui/accueil.js:184` : `tuileUnivers` est dans le `<details>`, fermé tant qu'aucun thème n'est choisi. Le réglage est actif par défaut (`universInclus`, `parcours.js:30`), donc l'utilisateur ne voit pas qu'il y a un choix. Il reste dans Réglages (branché, `ecrans.js:137-142`). À décider : acceptable (D33 « un seul choix visible ») ou à sortir du dépliant.
3. **Mineure : l'écran « J'ai combien de temps ? » défile à 360×640** (page plus haute que l'écran, avec le test de niveau en amont). Hors critère (6), qui vise la session ; je n'ai pas comparé avec `main`. Les Réglages défilent aussi, ce qui est normal.
4. **Mineure (à noter) : phrase russe « grande » surtout en Découverte** (33 px à 360, 34,7 px à 375). En Sens elle mesure 23-24 px, en Ordre 18-20 px (phrases longues ou tuiles) : lisible (≥ 15 px) mais l'effet « seule au centre » ne vaut que pour la Découverte. L'écran Sens laisse un grand vide au milieu.
5. **Cosmétique** : l'astuce « On dit « pajálsta » » se termine par un « » » orphelin à la ligne à 360 px (sombre, Écouteurs).

## Vérifié et conforme
- **Session, 4 combinaisons** (360×640 Silence clair, 360×640 Écouteurs sombre, 375×667 Silence sombre, 375×667 Écouteurs clair), 8 cartes chacune, avant et après réponse : pas de défilement de page, pas de défilement horizontal, aucune cible < 44 px, aucun texte < 15 px, `lang="ru"` présent sur le russe, aucune erreur JS.
- **Étape 3** : « Au hasard » coché par défaut et sous-titre « Au hasard » sur le bouton ; « Je choisis mes thèmes » déplie (sans erreur), cocher un thème décoche « Au hasard » et affiche « 1 thème choisi », tout décocher le remet. Les thèmes passent toujours au lancement (`lancerSession(…, themes, …)` et `lancer(…, { themes })`, inchangés) ; `universInclus` lu au lancement (`ecran-session.js:27`, `voiture.js:73`). `<summary>` natif : clavier (Entrée, Espace) et focus gérés par le navigateur, anneau de focus ajouté (`app.css:843`). Non rejoué au clavier réel, lu dans le code.
- **Contrastes** (calculés sur les tokens) : accent sur accent-soft 6,97 clair / 6,56 sombre ; texte sur accent-soft 14,4 / 12,0 ; texte atténué sur accent-soft 6,0 / 5,8 ; bordures 3,5 / 4,0 (≥ 3). Le bouton principal laqué (rouge) est lisible dans les deux thèmes. Faux : icône, titre « Pas tout à fait » et texte, jamais la couleur seule.
- **Poupées** (22-30 px) : silhouette lisible, 4 états distinguables par le trait (plein, pointillé), pas par la couleur seule ; contraste accent/fond 8,3.
- **Mouvement réduit** : la règle globale (`app.css:397`) coupe les animations en `!important` ; les nouvelles `arrive`/`monte` en dépendent, les transitions ont une règle propre (lignes 832, 846). Pas de régression.
- Réglages : interrupteur « Inclure les mots par sujet » présent et branché ; libellé renommé aussi dans l'accueil. Mes progrès (vide), Mon personnage, test de niveau (proposition et question), Voiture (avant, route, pause) : rendus corrects, sans débordement, 360 et 375.

## Non testé
- iPhone réel / Safari (rendu de `color-mix`, `dvh`, `text-wrap: balance`, zones sûres, voix russe) ; hors ligne réel (service worker, nouveau CSS en cache).
- **Mes progrès avec données** : le scénario `progres` du pilote reste « en cours » (deux essais, 15 s et 25 s) et ne produit pas d'écran ; je n'ai vu que l'écran vide. Les cartes `.cle-progres` et `.carte-perso` redessinées ne sont donc pas vues.
- Sens et Ordre dans les 4 thèmes/tailles ont été mesurés mais seules 5 cartes ont été regardées à l'œil (le reste par mesures). Durée réelle d'une session : non concernée.
- Scénarios du pilote à 15 s : `voitureavant`, `reglages` ont échoué une fois (« l'app ne s'affiche pas ») puis réussi à 20 s ; à noter pour `tests/capturer.sh`.

## Corrections après le rapport (Sacha, 13/11/2026)

- Défaut 1 (décor sur la phrase russe) : marge de 64 px à droite du russe (52 px sous 700 px de haut, 0 sous 600 px, où le décor est masqué). Mesuré à 360×640 avec `tests/pilote.html?s=chevauche&h=640` : russe jusqu'à x=258, décor à partir de x=294, `chevauche: false`.
- Défaut 2 (interrupteur « mots par sujet » caché) : il sort du dépliant et reste visible sous « Je choisis mes thèmes ».
- Défaut 3 : écran « J'ai combien de temps ? » sans défilement de page à 360×640 (mesuré, `?s=duree&h=640` : page 640/640) grâce à un titre d'étape et des marges plus bas sous 700 px ; russe de Sens et d'Ordre agrandi (jusqu'à 36 px, tuiles d'Ordre 22 px) ; `text-wrap: pretty` sur l'astuce contre l'apostrophe orpheline (non revu en rendu).
- Non revu après correction : contre-vérification par Boris, iPhone réel, hors ligne réel, Mes progrès avec données.
