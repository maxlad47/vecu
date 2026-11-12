# Bagou : « Mon personnage » (spec V1)

Auteur : Lou, 12/11/2026. S'ajoute à `bagou-ru.md` (palette, matriochka) et `ecrans-phase0.md` §2.5 (genre), §8 (Réglages). Gabarit 375×667 (SE : haut 20, bas 10). Pas de code ici.

**Principe.** Le personnage, c'est « moi » dans les phrases : prénom, genre, métier, plus une poupée à mes couleurs. Il sert à dire « Je m'appelle Max », « Je suis infirmière ». Tout est facultatif, local (`stockage.js`), hors ligne, silencieux, sans compte.

**Règle anti-confusion.** La poupée-personnage n'entre **jamais** dans une rangée de progression : les 4 états (Pas vue, Vue, En cours, Acquise) gardent leurs formes et couleurs fixes. Le personnage est seul, plus grand (56 px et plus), et toujours à côté de son prénom ou d'un mot.

## 1. Où et quand
- **Pas à la première ouverture.** Le parcours d'accueil ne change pas (3 touchers, 10 secondes).
- **Réglages** : première ligne, carte « Mon personnage » (poupée 56 px, prénom, métier), 64 px, touchable.
- **Mes progrès** : la poupée du haut est le personnage ; la toucher ouvre l'édition.
- **Au bon moment** : sur la carte Découverte d'une phrase « Je m'appelle ___ » ou « Je suis ___ », si rien n'est réglé, un encart (même gabarit que la question du genre, §2.5) : « Cette phrase parle de toi. » + bouton « Ajouter mon prénom » + texte « Plus tard ». Ne bloque pas « Suivant ». Après 2 « Plus tard », il ne revient plus (Réglages reste).

## 2. Ce qu'on règle (liste minimale V1)
| Réglage | Choix | Défaut |
|---|---|---|
| Je m'appelle | prénom, 20 caractères max | vide |
| Je parle… | au masculin / au féminin (**le même réglage que Réglages ligne 2**) | non fait |
| Je suis… | métier, liste fermée d'environ 12 (Vera et Nadia fixent la liste et les formes m/f) + « Je préfère ne pas dire » | « Je préfère ne pas dire » |
| Couleurs | 4 combinaisons (ci-dessous) | « Cobalt et or » |
| Motif du tablier | Fleur, Baies (Khokhloma), Feuilles | Fleur |

Combinaisons : « Cobalt et or », « Laque et or », « Bleu pâle et cobalt », « Porcelaine et laque ». **Jamais laque et cobalt sur la même poupée** (sinon face claire entre rouge et bleu = drapeau). Contour 2 px `--text`, visage fixe en `--accent-soft`, couleurs prises dans les tokens (clair et sombre), l'or reste décor.

## 3. Écrans
Parcours en 2 écrans courts, comme l'accueil : question 28 px, pastilles de rappel, « Retour » / « Suite ». Chaque écran est passable : « Passer » (texte, 44 px). Tout s'enregistre au toucher.

```
Écran A  « Moi, en quelques mots »     Écran B  « Ma poupée »
┌ Menu ─────────────────────┐          ┌ Menu ─────────────────────┐
│ Moi, en quelques mots     │          │ Ma poupée                 │
│ Je m'appelle              │          │        ( poupée 140 px,   │
│ [ Prénom ........ ] 52px  │          │          vue en direct )  │
│ Je parle…                 │          │         Max               │
│ [au masculin][au féminin] │          │ Couleurs                  │
│ Je suis…                  │          │ [●][●][●][●]  4 × 56 px   │
│ [ Infirmière        ⌄ ]   │          │ Motif                     │
│ Facultatif : tu peux      │          │ [Fleur][Baies][Feuilles]  │
│ passer.                   │          │                           │
├───────────────────────────┤          ├───────────────────────────┤
│ Passer        [ Suite ]   │          │ Retour    [ C'est fait ]  │
└───────────────────────────┘          └───────────────────────────┘
```
- **A** : tient en 667 px sans défiler (68 + 3 blocs de 80 + barre 118). « Suite » est laque. Le métier ouvre une feuille du bas (radio, 56 px la ligne, « Je préfère ne pas dire » en tête). Clavier iPhone : le champ reste visible, la barre du bas passe au-dessus du clavier. Le prénom accepte tout alphabet.
- **B** : poupée 140 px + prénom ; 4 pastilles de couleur 56 px **avec leur nom lu** (« Cobalt et or ») et une coche + contour 2 px sur celle choisie ; 3 motifs en radios 52 px avec nom écrit. « C'est fait » est laque, ramène à l'écran d'où l'on vient.
- **Édition (depuis Réglages ou Mes progrès)** : mêmes écrans, plus, en bas de B, « Effacer mon personnage » (texte `--danger`, 44 px) → feuille « On efface ? » / « Ce prénom, ce métier et cette poupée seront supprimés de ce téléphone. » / « Garder » (focus) · « Effacer ».
- **Carte Réglages** : ligne 1 « {prénom} » (ou « Mon personnage »), ligne 2 « Je suis {métier} » (ou « Pas encore de métier »).

## 4. Où le personnage réapparaît
| Où | Quoi |
|---|---|
| Réglages (haut), Mes progrès (haut) | Poupée 56 px + prénom, touchable |
| En-tête de l'accueil | La mini poupée de 24 px du mot-symbole prend les couleurs choisies (gratuit en place, non touchable) |
| Cartes « Je m'appelle ___ », « Je suis ___ » | La phrase russe est composée avec le prénom et le métier (remplacements fournis par le contenu) ; badge « avec ton prénom » |
| « Montrer » (plein écran) | Même phrase personnalisée, utile pour se présenter à quelqu'un |
Jamais : rangées de progression, Voiture, barre de session, fin de session (V1). Le prénom n'est ni dit à voix haute par l'app, ni utilisé dans une salutation.

## 5. Cas limites
- **Prénom absent** : la phrase garde le prénom d'exemple du contenu, suivi de « (ton prénom ici) » en `--text-muted` ; aucun « Bonjour {vide} ». La carte Réglages dit « Mon personnage ».
- **Prénom en russe** : l'app propose la forme cyrillique et la translittération sous le champ (« En russe : Максим · Maksim »), modifiable. Si elle ne sait pas, elle garde les lettres latines. Table à valider par Nadia.
- **Genre non précisé** : poupée neutre (la poupée n'a pas de genre) ; le métier s'affiche « infirmier / infirmière » ; les phrases à variantes montrent les deux formes (§2.5, inchangé) ; la carte métier redemande « Tu parles… » au toucher d'un métier.
- **Genre changé** : le métier suit tout seul (« infirmier » devient « infirmière »).
- **Métier hors liste** : « Je préfère ne pas dire » ; phrase « Je travaille » générique du contenu. Pas de texte libre en V1 (le russe ne s'invente pas).
- **Stockage indisponible** : le personnage vit en mémoire, sans message d'erreur (comme l'accueil).
- **Silence** : édition et aperçu sans aucun son.
- **Prénom très long** : retour à la ligne, jamais coupé par « … ».

## 6. Accessibilité
Cibles 44 px et plus, anneau de focus 3 px, poupée `role="img"` avec `aria-label` « Ma poupée : cobalt et or, motif fleur » ; couleur et motif jamais par la couleur seule (nom + coche). Contrastes : textes sur tokens existants, contour poupée `--text` ≥ 3:1. « Réduire les animations » : aucun mouvement (l'aperçu change sans fondu).

## 7. Plus tard (hors V1)
Visage et coiffure au choix ; texte libre pour le métier ; plusieurs personnages (famille, enfants) ; le personnage dans des mini-scènes de dialogue ; la poupée qui s'emboîte avec le thème acquis ; accessoires qui se gagnent (**non** : pas de gamification gadget) ; partage d'une image de sa poupée (mise en ligne soumise à Max).

## 8. Dépendances
Vera : liste des métiers, phrases à trou de « Se présenter » ; Nadia : formes m/f des métiers, cyrillique des prénoms ; Kostia : clé `personnage` dans `stockage.js` (prénom, genre, métier, couleurs, motif) et SVG de poupée paramétrables ; Boris : contrôle anti-drapeau sur les 4 combinaisons, clair et sombre.
