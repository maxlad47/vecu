# Relais de Kostia : mission 006, écrans adaptatifs

Fait : points 1 à 8 du brief (section 13 de `docs/design/bagou-ru.md`). Fichiers : `app/css/app.css` (section 13 en fin de fichier), `app/js/ui/ecran-session.js`, `matriochka.js`, `ecrans.js` (fin de session), `textes.js` (3 textes). Pas de changement du moteur : pas de nouveau test (`node --test tests/*.test.mjs` passe).

## Mesures (Chrome headless, `dist/` servi, 29 panneaux de retour parcourus par taille)
| Taille | Page défile ? | Bas de la barre d'action | Limite (hauteur − 40) | Cibles < 44 px |
|---|---|---|---|---|
| 375 × 667 | non | 617 | 627 | 0 |
| 360 × 640 | non | 590 | 600 | 0 |

Captures : `capture-<taille>-phrase.png` et `capture-<taille>-ecoute.png`. Le haut de l'en-tête est à 6 px (plus de bande vide).

## Choix à connaître
- Les 3 réponses sont dans la barre ; le panneau de retour les remplace (verdict, bonne réponse, Suivant). La liste colorée n'est donc plus visible après la réponse, sauf pour Ordre (tuiles en zone B). Lou écrit les deux dans 13.1 : j'ai suivi « le panneau remplace ».
- Poupée qui se colorie : panneau de retour (si l'état change) et fin de session (6 animées au plus, 120 ms de décalage). Pas dans la Découverte : l'état passe à Vue dès l'affichage, il n'y a rien à animer.
- Réduire les animations : changement immédiat (CSS) et annonce « Poupée : En cours ».
- `--reserve-netlify: 40px` est dans `:root` ; elle s'applique à toutes les barres (aussi accueil, fin). Passer à `0px` quand Max a désactivé le bandeau.
- Voile en bas de la zone qui défile : toujours présent (dégradé de 16 px), pas seulement quand ça défile.
- Non fait (hors brief) : thème Voiture et « Avant le départ » inchangés.

## Pour Boris
Ce qui a changé : tout l'écran de session (en-tête une ligne, barre d'action fixe, contenu qui défile, tailles fluides), l'écran de fin (poupées coloriées).
À tester en priorité :
1. Sur 375 × 667, 393 × 852, 430 × 932, 360 × 640, en Safari (barre du navigateur) et en app installée : chaque type d'exercice (Découverte, Sens, Thème, Moule, Ordre, Écoute, À voix haute), clair et sombre, avec et sans translittération, **la phrase russe la plus longue** et l'astuce la plus longue : barre visible sans défiler la page, panneau d'erreur compris (Suivant visible).
2. Tableau 13.3 : `scrollHeight <= innerHeight`, bas du bouton le plus bas `<= innerHeight − 40`, aucune cible < 44 px, aucune bande vide en haut.
3. Silence : pas d'icône de son ; « Couper le son » en cours de session : l'icône disparaît, Écoute devient Sens.
4. « Même phrase, autre mot » : défile à l'horizontale, une puce touchée change la phrase.
5. Menu ouvert en session : le menu passe par-dessus le contenu ; le chrono se met en pause.
6. Réduire les animations : poupée change sans mouvement. Fin de session : poupées coloriées.
7. Clavier : touches 1, 2, 3 répondent toujours ; Entrée sur le verdict passe à la suite.
8. Les astuces de Nadia sont en cours de raccourcissement : retester l'astuce la plus longue après sa fusion.
