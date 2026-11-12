# Mission 006 : écrans adaptatifs

Brief de Sacha, 12/11/2026. « Go » de Max après échange. Branche `mission-006-ecrans-adaptatifs`, fusion dans `main` (publication) après Boris.

## Pourquoi
Sur l'iPhone de Max (raccourci et Safari), les écrans de session ne tiennent pas : bande vide en haut, en-tête sur 4 lignes, carte de phrase trop haute, bouton d'action hors de l'écran, bandeau Netlify par-dessus. La QA n'avait testé que des largeurs, jamais des hauteurs.

## Objectif mesurable
**Sur tout écran de session, le bouton d'action (réponses, Suivant) est visible sans défiler**, sur iPhone SE (375 × 667), iPhone 15 (393 × 852), iPhone 15 Pro Max (430 × 932) et un petit Android (360 × 640), en Safari et en app installée.

## Cause de la bande vide (trouvée par Sacha)
`app/css/app.css` force `--haut` à au moins 59 px (et `--bas` à 34 px) en mode installé, alors que la barre d'état noire de l'iPhone réserve déjà cette place : la marge est comptée deux fois. Ne garder que `env(safe-area-inset-*)`, sans plancher arbitraire (un petit minimum de confort suffit).

## Décisions de Max
1. Supprimer la bande vide ; en-tête compact sur **une ligne** : Menu, temps restant (barre), son en icône seule, Quitter. Les pastilles de rappel ne restent pas en session (elles sont dans l'accueil).
2. **Barre d'action fixée en bas** (réponses ou Suivant), au-dessus de la barre d'accueil, toujours visible. Le contenu défile derrière si besoin, jamais la barre.
3. **Tailles qui s'adaptent à l'écran** : typographie fluide (`clamp()` avec unités de viewport), espacements resserrés sur les écrans bas (`@media (max-height: 700px)`).
4. **Astuces : 1 à 2 lignes courtes maximum** (Nadia les raccourcit dans le contenu).
5. **Poupées gardées**, en une ligne compacte de petites matriochkas ; quand une phrase progresse, **sa poupée se colorie** avec une courte animation (respecter « réduire les animations »).
6. **« Même phrase, autre mot » gardé**, sur une seule ligne qui défile horizontalement.
7. Le registre (« on vouvoie ») passe en petit, sur la ligne de la translittération.
8. Exercice Écoute : le gros rond « Réécouter » rapetisse ; les 3 réponses sont dans la zone visible.

## Bandeau « Powered by Netlify »
Il se désactive dans Netlify (Project configuration > General > Powered by Netlify badge) : action de Max. En attendant, rien d'important ne doit rester caché dessous de façon permanente (marge en bas de la barre d'action suffisante).

## Qui intervient
| Étape | Agent | Livrable | Modèle |
|---|---|---|---|
| 1 | Lou | Règles d'adaptation + gabarit des écrans de session (section 13 de `docs/design/bagou-ru.md`) | Sonnet |
| 1 | Nadia (en parallèle) | Astuces raccourcies dans `content/ru/*.json` (10 situations publiées) | Opus |
| 2 | Kostia | Code, avec Ponytail | Sonnet |
| 3 | Boris | Tests sur les 4 tailles, en largeur ET en hauteur | Sonnet |
| 4 | Léa | Avis sur captures | Haiku |
