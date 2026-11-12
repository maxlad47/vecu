# Relais de Kostia, mission 007 (personnage), 12/11/2026
Fait : clé `personnage` (stockage), 2 écrans, poupée SVG, encart, phrases du personnage dans le moteur, 5 fichiers de contenu, tests (787 vérifications, 0 échec), build (`personnage.json` et les 3 nouveaux JS sont dans le cache du service worker).

## Décisions et écarts
- `variantes_fr` {m, f} validé tel quel (phrase ou remplacement de moule, toujours la phrase française entière). Appliqué aux 5 éléments ; `CLAUDE.md` à jour. Genre inconnu : `texteElement` renvoie aussi `autre` (l'autre genre) ; la carte Découverte montre les deux formes.
- Genre : reste dans `reglages.genre` (une seule source, lue partout) ; `personnage` = prénom, prénom russe, métier, couleurs, motif, mots déjà montrés. Aucun défaut « m » stocké. Si le personnage est sauté, la question de la carte (§2.5) reste l'unique recours. Voiture sans genre : jouée au masculin faute de pouvoir poser la question.
- Mécanisme générique : `REGLAGES_MOULE` dans `personnage.js` (réglage → liste du JSON → moule, avec dérivation métier → domaine). Un nouveau thème = une ligne + une liste de contenu + un choix d'interface.
- Rencontrer-010 « Je m'appelle ___ » : champ `apres: "ru-rencontrer-004"` ajouté dans `personnage.json`. Mais 004 est en vague 2 : la phrase arrive en vague 2, pas 1 (Vera). À arbitrer par Sacha.
- Carte de visite (presenter-011) : absente sans métier ; pas de blocage « quand ses deux morceaux sont vus » (elle est en vague 3).
- Métiers étudiant, à mon compte, retraité (elements 006/009/010, non moules) : choisis, ils nourrissent la carte de visite mais pas « Je suis ___ ».
- Prénom gardé en latin : affiché, jamais lu (`aLire`). Pas d'Ordre sur les phrases à prénom.
- Non fait : mini-poupée de l'en-tête de l'accueil aux couleurs choisies (« gratuit », non listé dans la demande) ; re-question du genre au toucher d'un métier (le bloc genre est juste au-dessus).
- Réglages défilait déjà (872 px) : la carte « Mon personnage » l'allonge de 72 px. Les 2 écrans personnage tiennent sans défiler à 375×667 et 360×640, clair et sombre (`tests/qa/personnage.rb`).

## Pour Boris, à tester en priorité
1. Conversion du prénom : saisir Maxime, Céline, Jean-Pierre, Zoë, Ñandú (latin gardé) ; « Corriger » en cyrillique ; « Garder en lettres latines » puis « Écrire en russe ».
2. Genre : personnage sans genre → « Je suis ingénieur. / Je suis ingénieure. » + question ; après réponse, tout s'accorde (Enchantée, Désolée, perdue, étudiante, métier). Changer le genre ne doit rien rendre « dû ».
3. Métier : liste de 13 + « Je préfère ne pas dire » ; « Je suis ___ » donne le métier en Découverte, puis une carte sur deux ; changer de métier sur un moule déjà appris : une Découverte non notée, boîte intacte, une seule par session.
4. Encart « Cette phrase parle de toi » : disparaît après 2 « Plus tard » ; sur « Je suis ingénieur » il s'empile avec la question du genre (carte chargée, à juger).
5. Poupée : 4 combinaisons x 3 motifs, clair et sombre, anti-drapeau ; Mes progrès (poupée du haut touchable), Réglages (carte), jamais dans une rangée.
6. Hors ligne (avion) après une première visite ; stockage indisponible (navigation privée) ; Effacer mon personnage ; bouton retour du téléphone dans A et B.
7. Rencontrer : la carte 006 « D'où viens-tu » passe en vague 3 (010 s'insère avant).
