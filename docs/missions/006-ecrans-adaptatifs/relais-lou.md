# Relais de Lou : mission 006, écrans adaptatifs

Livrable : section 13 de `docs/design/bagou-ru.md` (gabarit 3 zones, valeurs `clamp()`, repli, 4 tailles, matriochka qui se colorie). Rien d'autre n'est refait.

## Décisions de design à connaître
- Les 3 réponses (Sens, Thème, Moule, Écoute) vivent **dans la barre d'action fixe** ; le panneau de retour la remplace, avec « Suivant » fixe en bas du panneau.
- Le temps visible devient « 3 min » (le texte complet « Encore 3 min » est `sr-only`). Nouveau texte : « < 1 min ».
- Son et Quitter : icônes seules (44 px), `aria-label` conservés.
- `--reserve-netlify: 40px` est provisoire : à mettre à 0 quand Max aura désactivé le bandeau.
- Point à valider par Vera : la poupée du panneau de retour montre l'état après la réponse ; le lien état et boîte Leitner reste son point ouvert.

## Pour Kostia
Écrans à construire ou modifier (`app/css/app.css`, `app/js/ui/ecran-session.js`, `matriochka.js`, `textes.js`) :

1. **Variables** : supprimer le bloc `@media (display-mode: standalone)` des planchers 59/34 ; poser `--haut`, `--bas`, `--marge`, `--reserve-netlify` (13.1) ; ajouter les jetons fluides de 13.2 pour les écrans de session.
2. **Gabarit** : `.ecran` de session en `100dvh`, `overflow: hidden` ; `main.contenu` en `flex: 1; min-height: 0; overflow-y: auto` ; `.zone-action` en `flex: none` (plus de `sticky`), `max-height: 45dvh`.
3. **En-tête d'une ligne** : Menu, barre, « 3 min », Son (icône), Quitter (icône). Retirer `.contexte` et les pastilles. Fin de session : « Menu » seul.
4. **Découverte** : translittération et « on vouvoie » sur une seule ligne ; astuce sans le mot « Astuce » en bloc séparé (une ligne « Astuce : … ») ; « Même phrase, autre mot » sur une ligne qui défile ; rangée de poupées sur une ligne ; état compact.
5. **Sens, Thème, Moule, Écoute** : mettre `listeOptions` dans la zone C ; Écoute : rond `clamp(64px, 12dvh, 96px)`.
6. **Ordre** : « Vérifier » en zone C ; réserve et zone réponse en zone B.
7. **À voix haute** : zone C avec la question et les deux boutons sur une seule hauteur de 8 + 18 + 8 + 56.
8. **Panneau de retour** : infos défilantes (`max-height: 38dvh`), « Suivant » fixe en bas ; poupée et mot d'état à droite du verdict seulement si l'état a changé.
9. **Matriochka** : animation de coloriage (fondu croisé 350 ms + gonflement, 13.4) ; version sans animation et annonce `aria-live="polite"` ; fin de session : poupées qui ont progressé coloriées en décalé.
10. **Media queries** `max-height: 700px` et `600px` (13.2), dans l'ordre de repli.
11. **Textes** : `session.resteCourt` (« {n} min »), « < 1 min ».

Critère de sortie pour Boris : le tableau de vérification de 13.3, sur les 4 tailles.
