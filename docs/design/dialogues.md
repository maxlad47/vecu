# Dialogues à choix : carte « Dialogue » (mission 008)

Auteur : Lou, 12/11/2026. S'ajoute à `bagou-ru.md` §13 et `personnage.md`. Pas de code.

## 1. Gabarit

Même découpage que `bagou-ru.md` §13.1 : A en-tête, B scène (le reste), C réponses (fixe en bas).

| Cible | Zone B (scène) | Zone C (3 réponses) |
|---|---|---|
| 375 × 667 (`--haut` 20) | 667 − 20 − 48 − 217 = 382 px | 217 px |
| 360 × 640 (`--haut` 6) | 640 − 6 − 48 − 217 = 369 px | 217 px |

- Réponses : 58 px minimum, la hauteur suit le texte (russe + translittération), 61 px en moyenne. Jamais sous 44 px.
- Réponse : 32 caractères russes au plus, une ligne. Trois réponses, jamais moins de deux.
- La zone C ne défile jamais. Si la scène dépasse, c'est la zone B qui défile.

## 2. Scène (zone B), de haut en bas

1. Ligne de lieu : nom de la situation (15 px, `--text-muted`) ; décor §9 de `bagou-ru.md` à droite, 48 px, `aria-hidden`.
2. Bulle du partenaire : `--surface`, contour 2 px `--border`, queue à gauche, rayon `--radius-m`. Dedans : rôle (« Le serveur », 15 px) ; russe `--fs-ru-hero-long`, 500, `--accent`, `lang="ru"` ; translittération 15 px italique ; français 18 px ; [Écouter] 44 px si le son est permis.
3. Ligne « toi » : poupée 56 px + prénom (18 px, 700) + « Tu réponds : » (15 px, `--text-muted`).

## 3. Succession des répliques (sans défiler)

- Une seule bulle à l'écran : la nouvelle **remplace** la précédente, elle ne s'empile pas.
- Au-dessus de la bulle, « Tu as dit : {français} » (15 px) ne garde que la dernière réponse.
- Un dialogue compte 2 à 4 échanges. Après la dernière réplique, « Suivant » rend la main à la session.
- Changement de bulle : fondu 150 ms ; avec « réduire les animations », direct.
- Après une réponse, le **panneau de retour** remplace les réponses en zone C : verdict (coche + « Tu peux dire ça. » en `--success`, ou croix + « Pas tout à fait. » en `--danger`, `role="status"`) ; réplique choisie ; si elle n'est pas la plus naturelle, « On dirait plutôt : » + la bonne ; astuce 1 à 2 lignes ; « Suivant » fixe en bas, laque si juste, cobalt si « Pas tout à fait. ».
- Règle pour Vera : chaque réplique est juste ; au plus une « Pas tout à fait » par échange.

## 4. Silence, Écouteurs, Voiture

- **Silence** : tout se joue à l'écrit. Pas de lecture, pas de [Écouter] (absent du DOM). Le brief dit « lecture seule des répliques » : je lis « pas de son, choix écrit », à confirmer par le CEO.
- **Écouteurs** : la réplique du partenaire est lue une fois à l'arrivée de la bulle ; [Écouter] la relance. Toucher une réponse ne joue rien.
- Son coupé en zone A : bascule immédiate en version Silence.
- **Voiture** : pas de carte dialogue en V1 (un choix à l'écran n'est pas mains libres).
- Fréquence : session de 5 min ou plus, une carte au plus, après la 3e carte d'exercice (à confirmer par Vera dans `regles-session.md`).

## 5. La poupée du personnage

- Elle n'apparaît **que** dans la carte dialogue, à la ligne « Tu réponds : », quand la réponse est demandée (jamais avant la première bulle).
- 56 px, `role="img"`, `aria-label` « Ta poupée : cobalt et or, motif fleur » (valeurs réglées). Genre non réglé : poupée neutre.
- Entrée : fondu 200 ms ; avec « réduire les animations », directe.
- Jamais dans une rangée de progression ni dans le panneau de retour.

## 6. Cas limites

| Cas | Affichage |
|---|---|
| Prénom absent | Ligne « toi » : « Toi ». Réplique : prénom d'exemple du contenu + « (ton prénom ici) » en `--text-muted`. |
| Métier absent | Pas de réplique à métier : variante « Je travaille » ; sans variante, carte non proposée. |
| Genre inconnu | Avant la scène : « Tu parles… » + [Au masculin] [Au féminin]. « Plus tard » : carte non proposée (pas de double forme). |
| Prénom très long | Retour à la ligne, jamais « … ». |
| Stockage indisponible ou contenu manquant | Personnage en mémoire ou carte non proposée, sans message d'erreur. |

## 7. Accessibilité et identité

- Cibles : réponses 58 px et plus, Écouter 44 px, Suivant 52 à 60 px, poupée 56 px ; 8 px entre voisines.
- Focus : anneau 3 px. Nouvelle bulle : focus sur la bulle (`tabindex="-1"`), puis les réponses ; après réponse, sur le verdict.
- Lecteur d'écran : russe `lang="ru"`, translittération `lang="ru-Latn"`, zone C en `role="group"` « Tes réponses, 3 choix ».
- Réduire les animations : ni fondu, ni montée du panneau, ni gonflement de poupée.
- Contrastes : tokens de `bagou-ru.md` §1.2. Identité : bulles en porcelaine (`--surface`), laque seulement sur « Suivant », jamais de bandes rouge, blanc et bleu, jamais de drapeau en aplat.

## 8. Plus tard, dépendances

- Plus tard : jeu de rôle oral et reconnaissance vocale (phase 1) ; partenaire avec avatar ou nom ; réponses libres ; historique ; dialogues à plusieurs personnages ; dialogues en Voiture.
- Vera : format, nombre d'échanges, fréquence (§4), règle des « Pas tout à fait ». Nadia : russe et formes m/f. Kostia : construction selon §1 à §6. Boris : mesure à 375 × 667 et 360 × 640 (`scrollHeight`, zone C visible, cibles 44 px).
