# Relais de Kostia, mission 008 (dialogues à choix, métiers par catégories), 12/11/2026
Code et tests faits, commit local, pas de push. `node --test tests/*.test.mjs` : 986 vérifications, 0 échec. `bash scripts/build.sh` et `node scripts/build.mjs` : même version, 66 fichiers en cache (dialogues.json, dialogues.js, carte-dialogue.js inclus).

## Ce qui change
- `app/js/dialogues.js` (nouveau, pur) : dialogues jouables selon le personnage, échange résolu (jetons {prenom} et {metier}, genre m/f en français et en russe, réaction du partenaire dans la même bulle, 2 à 3 réponses mélangées).
- `app/js/ui/carte-dialogue.js` (nouveau) : bulle, ligne « toi » avec poupée, réponses fixées en bas, panneau de retour, question du genre.
- `moteur.js` : carte `dialogue` et `repondreDialogue`. Règle (config.js, `DIALOGUE`) : 15 et 30 min, une fois, après 10 éléments travaillés, jamais en Voiture, dans une situation déjà travaillée, thèmes respectés, on varie d'une session à l'autre.
- `contenu.js` : charge `dialogues.json`, ajoute les 4 répliques `nouveau` à leur situation (éléments Leitner ordinaires).
- Leitner : bonne réplique = boîte mise à jour (dû : +1 ; jamais vue : découverte, boîte 1) ; fausse = rien.
- `ecran-personnage.js` : métiers en accordéon par catégorie (43 métiers, 9 catégories), la catégorie du métier courant est ouverte et visible. Le fond est `inert` pendant la feuille.
- `app.css` : section 15, et `flex: none` sur `.ecran-session` (sans cela la page défilait quand scène + panneau dépassaient l'écran).

## À tester en priorité
1. Un dialogue complet en Silence, Écouteurs, Je peux parler : aucun son en Silence, réplique lue à l'arrivée sinon, jamais de carte en Voiture ni en 2 et 5 min.
2. Réponse fausse puis « Suivant » : le dialogue suit la bonne branche ; le panneau dit « Pas tout à fait. » une seule fois ; la boîte de la bonne réplique ne bouge pas.
3. Réponse juste : la boîte de l'élément monte seulement s'il était dû (voir « Mes progrès »).
4. Sans prénom (« Toi », exemple + « ton prénom ici »), sans métier (café et hôtel seulement), genre non réglé (question avant l'hôtel ; « Plus tard » passe la carte), prénom très long.
5. Écran métier : 9 catégories, ouvrir/fermer, Échap, métier courant visible, 375×667 et 360×640. Effacer le personnage puis rejouer.
6. Non testé : iPhone réel, mode sombre, hors ligne réel, lecteur d'écran.

## Écarts (voir ma réponse à Sacha)
Fréquence de Vera (pas celle de Lou) ; boutons de réponse en français + russe sans translittération ; Vera dit « une fausse réponse = échec », suivi Sacha (rien). Mesures Chrome : page jamais défilée, réponses 60-61 px, aucune cible sous 44 px (`tests/qa/dialogue.rb`).
