# Bagou, version russe : identité et parcours (mission 003)

Auteur : Lou, 12/11/2026. Complète `systeme-visuel.md` (validé : structure des tokens, échelle typographique, composants, mouvement) sans le refaire. Les écrans d'exercices de `ecrans-phase0.md` ne changent pas : ils prennent seulement la nouvelle palette. Planche : `maquettes/bagou-ru.html`. Point de départ : le croquis `maquettes/croquis-bagou.html`.

Principe : l'identité (palette, décors, matriochka) vient du fichier d'ambiance de la langue ; la structure (tokens, tailles, composants) est commune à toutes les langues.

---

## 1. Palette « Gjel et Khokhloma »

Répartition visée : environ 70 % porcelaine, 20 % cobalt, 10 % laque rouge et or. **Aucun drapeau, aucune bande tricolore** : le rouge n'est jamais posé à côté d'un blanc et d'un bleu en bandes.

### 1.1 Tokens (mêmes noms qu'en phase 0, plus 5 nouveaux)

| Token | Rôle | Clair | Sombre |
|---|---|---|---|
| `--bg` | Fond (porcelaine) | `#FBF8F2` | `#0F1426` |
| `--surface` | Cartes, choix | `#FFFFFF` | `#1A2140` |
| `--text` | Texte, phrase russe (encre) | `#1B2340` | `#F3EFE6` |
| `--text-muted` | Consignes, translit | `#4F5A7A` | `#B4BCD6` |
| `--border` | Contour des éléments touchables | `#6E7AA0` | `#7F8BB3` |
| `--border-subtle` | Filets décoratifs | `#D5DBEA` | `#2B3458` |
| `--accent` | Cobalt : sélection, liens, barres, phrase russe | `#22408F` | `#9DB8F5` |
| `--on-accent` | Sur `--accent` | `#FFFFFF` | `#0F1426` |
| `--accent-soft` | Fond d'un choix sélectionné | `#DDE5F6` | `#1F2D5A` |
| **`--laque`** (nouveau) | Rouge laqué : bouton principal, matriochka | `#B3261E` | `#E8675E` |
| **`--on-laque`** (nouveau) | Sur `--laque` | `#FFFFFF` | `#0F1426` |
| **`--laque-soft`** (nouveau) | Fond « en cours » | `#F6D9D5` | `#3A1F2A` |
| **`--or`** (nouveau) | Or : **décor seulement**, jamais porteur d'information | `#C9A227` | `#E0B84A` |
| **`--or-text`** (nouveau) | Or lisible, pour un texte ou une icône | `#7A5C00` | `#E0B84A` |
| `--success`, `--success-soft`, `--danger`, `--danger-soft` | inchangés | voir phase 0 | `#7FD19B`, `#F2A39B` (fonds de phase 0) |
| `--focus` | = `--accent` | `#22408F` | `#9DB8F5` |

Décor : 4 variables dérivées, `--deco-bleu` (= accent), `--deco-bleu-pale` (`#B9C9EC` clair, `#2B3F78` sombre), `--deco-rouge` (= laque), `--deco-or` (= or). Les SVG de décor n'utilisent que celles-ci.

**Bouton principal = laque** (rouge), sélections et liens = cobalt. Le rouge reste rare : un seul bouton rouge par écran.

### 1.2 Contrastes (WCAG 2.1, luminance relative calculée à la main sur chaque paire)

Seuils : 4,5:1 pour le texte, 3:1 pour les composants et icônes.

| Paire | Clair | Sombre | Verdict |
|---|---|---|---|
| `--text` / `--bg` | 14,6 | 15,9 | AAA |
| `--text` / `--surface` | 15,4 | 13,7 | AAA |
| `--text` / `--accent-soft` | 12,2 | 11,6 | AAA |
| `--text-muted` / `--bg` | 6,4 | 9,7 | AA / AAA |
| `--text-muted` / `--surface` | 6,8 | 8,3 | AA / AAA |
| `--text-muted` / `--accent-soft` | 5,4 | 7,0 | AA / AAA |
| `--accent` / `--bg` (phrase russe, liens) | 9,0 | 9,2 | AAA |
| `--accent` / `--surface` | 9,6 | 8,0 | AAA |
| `--accent` / `--accent-soft` | 7,6 | 6,7 | AAA / AA |
| `--on-accent` / `--accent` | 9,6 | 9,2 | AAA |
| `--on-laque` / `--laque` (bouton principal) | 6,5 | 5,7 | AA |
| `--laque` / `--bg` (texte, icône) | 6,2 | 5,7 | AA |
| `--laque` / `--laque-soft` | 4,9 | 4,6 | AA |
| `--or-text` / `--bg` | 5,9 | 9,7 | AA / AAA |
| `--or` / `--bg` | **2,3** | 9,7 | **décor seulement** en clair |
| `--or` / `--accent` (médaillon sur poupée) | 3,9 | n/a | AA composant |
| `--border` / `--bg` | 4,0 | 5,4 | AA composant |
| `--border` / `--surface` | 4,2 | 4,7 | AA composant |
| `--border` / `--accent-soft` | 3,4 | 3,95 | AA composant |
| `--success` / `--surface`, `--danger` / `--surface` | 6,5 / 7,0 (phase 0) | 8,6 / 7,9 | AA |

Règles : l'or clair (2,3:1) ne porte jamais un texte, un contour de bouton ni un état. Jamais la couleur seule : chaque état passe par une forme et un mot.

**Risque connu** : `--danger` (`#A3302A`) et `--laque` (`#B3261E`) sont proches. Un « faux » est toujours accompagné d'une croix et du texte « Pas tout à fait. », et le panneau de retour n'a pas de bouton rouge à côté d'un verdict rouge : le « Suivant » du panneau d'erreur passe en cobalt. À confirmer sur l'iPhone de Max (point ouvert 3).

### 1.3 Mode sombre et Voiture

Les valeurs sombres sont celles de la colonne « Sombre », posées selon le mécanisme de phase 0 (`prefers-color-scheme`, `data-theme`). L'écran Voiture en marche force le sombre. « Avant le départ » suit le thème choisi.

---

## 2. Typographie

Inchangée (pile système, échelle de phase 0, règles du cyrillique et de l'accent tonique). Trois ajustements d'identité :

| Élément | Règle |
|---|---|
| Phrase russe | `--accent` (cobalt), **500** (retouche iPhone : jamais plus de 500 sur du cyrillique accentué, le diacritique se décolle en gras), tailles `--fs-ru-hero*`. **L'accent tonique n'est pas coloré** (le croquis le colorait en rouge : abandonné, un diacritique combinant coloré casse le rendu). |
| Questions d'accueil (« Je suis où ? ») | 28 px, 800, `--text`. Un seul niveau de titre par écran. |
| Mot-symbole « Bagou » | 22 px, 800, `--accent`, police système, précédé d'une mini matriochka acquise de 24 px. Slogan « Bagou, ose parler » en 15 px, `--text-muted`, sous l'en-tête de l'accueil seulement. |

---

## 3. Matriochka : le marqueur de progression

Une poupée par phrase, jamais en bonus, jamais animée en boucle. **Chaque état = une forme + un mot.**

| État | Mot affiché | Forme | Couleurs | Sous-texte |
|---|---|---|---|---|
| Pas vue | Pas vue | Silhouette vide, trait pointillé, sans visage | contour `--border`, fond transparent | « Pas encore rencontrée » |
| Vue | Vue | Contour plein, visage, corps blanc | contour `--accent`, fond `--surface` | « Vue, pas encore réussie » |
| En cours | En cours | Visage + tablier (bandeau et fleur) | contour `--laque`, corps `--laque-soft`, tête `--accent-soft` | « Réussie 2 fois, encore fragile » (le nombre est vrai) |
| Acquise | Acquise | Poupée pleine, médaillon et foulard dorés | corps `--laque`, tête `--accent`, médaillon `--or` | « Tu la sais » |

Mapping état ↔ boîtes Leitner : à fixer par Vera et Kostia (point ouvert 4).

**Les poupées d'un thème** : une rangée de N poupées (une par phrase du thème), de tailles croissantes comme des poupées gigognes (hauteur 30 px à 54 px), dans l'ordre des phrases. Texte à côté : « Au café, 3 acquises sur 9 ». Quand les N sont acquises : les poupées s'emboîtent (300 ms, sans mouvement avec « réduire les animations ») et le texte devient « Au café : tout est acquis ». Pas de confettis, pas de son.

Taille mini d'une poupée isolée : 24 × 34 px. Toujours `role="img"` avec `aria-label` = le mot de l'état (« Acquise »), ou `aria-hidden` si le mot est écrit à côté.

---

## 4. Parcours d'accueil

Chaque écran : en-tête (Menu à gauche, 44 px), question, contenu, zone du bas (Retour à gauche, action à droite). Pastilles de rappel : une pastille 44 px par choix déjà fait, touchable pour revenir à cette étape sans perdre les autres choix. Aucune pastille dans la session elle-même (affichage seulement).

| # | Écran | Titre exact | Contenu | Bas |
|---|---|---|---|---|
| 1 | Je suis où ? | « Je suis où ? » | 4 cartes 2 × 2 : **En voiture** (« Tout à l'oreille »), **Sans son** (« Salle d'attente, réunion »), **Écouteurs** (« Bus, métro, file d'attente »), **Je peux parler** (« Maison, balade »). Décor : bulbes de Saint-Basile. | Gros bouton laque à deux lignes : « Comme la dernière fois » / « Voiture · 30 min · Au hasard » (le sous-texte est le vrai dernier choix). Un toucher sur une carte passe à l'étape 2. |
| 2 | J'ai combien de temps ? | « J'ai combien de temps ? » | Pastille du lieu. 4 lignes radio de 64 px : « 2 min · Un coup d'œil », « 5 min · Une pause », « 15 min · Un trajet », « 30 min · Une vraie séance ». Une ligne est **préremplie** selon le lieu, avec la mention « Prérempli pour Écouteurs ». Consigne : « Touche une autre durée pour changer. » | Retour / « Suite » |
| 3 | Sur quoi ? | « Sur quoi ? » | Pastilles lieu et durée. Tuile « Au hasard » (par défaut, cochée). 10 tuiles de thèmes à cases à cocher, noms de `index.json`. Cocher un thème décoche « Au hasard » ; tout décocher remet « Au hasard ». Ligne « Façon d'apprendre : Phrases du quotidien · Changer ». | Retour / « C'est parti » + sous-texte « 3 thèmes choisis » (ou « Au hasard ») |
| 4 | Comment ? (facultatif) | « Comment ? » | Pastilles lieu, durée, thèmes. 4 cartes radio : **Phrases du quotidien** (« Des phrases utiles, prêtes à dire »), **Verbes** (« Un verbe, dans des phrases vraies »), **Vocabulaire** (« Des mots, toujours dans une phrase »), **Grammaire** (« Un mécanisme, expliqué en 2 lignes »). | Retour / « C'est parti » |

Valeurs préremplies de l'étape 2 : Sans son 2 min, Écouteurs 5 min, Je peux parler 15 min, En voiture 30 min.

**États** : étape 1 au premier lancement : pas de bouton « Comme la dernière fois », la grille descend. Étape 3 : « Au hasard » est la valeur de repli si rien n'est coché. Erreur de chargement du contenu : message existant « Réessayer ». « C'est parti » n'est jamais grisé (voir phase 0 §4.1).

**Chemin Voiture** : étape 1 (En voiture) → étape 2 (30 min préremplie) → « Avant le départ » (étapes 3 et 4 sautées : Au hasard et Phrases du quotidien, ou la dernière sélection si « Comme la dernière fois »).

### Avant le départ (Voiture)

Rien à lire, un seul gros bouton.

| Élément | Texte exact |
|---|---|
| Pastilles (affichage) | « En voiture » · « 30 min » · « Au hasard » |
| Titre | « Avant le départ » |
| 3 lignes, icône 32 px + 3 mots, 22 px | « Téléphone branché » · « Volume réglé » · « Téléphone posé » |
| Bouton (110 px de haut, pleine largeur, laque) | « Je démarre » / « 30 min, tout à l'oreille » |
| Bas | « Retour » (texte, 44 px) |

Au toucher : l'écran passe en sombre, la session Voiture de phase 0 démarre (inchangée). Les 3 lignes ne sont pas des cases à cocher : aucune friction.

---

## 5. Menu

Bouton « Menu » (icône trois traits + mot), pilule 44 px de haut, contour 2 px `--accent`, **en haut à gauche de tous les écrans**, y compris en session. Il ouvre une liste déroulante sous le bouton (pas un plein écran) : fond `--surface`, contour 2 px `--border`, rayon 16 px.

| Entrée | Icône | Ligne 2 |
|---|---|---|
| Mon carnet | livre | « Toutes mes phrases » |
| Mes progrès | graphique | « Mon temps, mes jours » |
| Réglages | engrenage | (aucune) |

Chaque entrée fait 56 px. L'entrée de l'écran courant porte « Tu es ici » (mot, pas la couleur seule). Fermeture : Échap, toucher en dehors, ou re-toucher « Menu ». Focus rendu au bouton. Codage : `<button aria-expanded>` + liste de liens, pas de `role="menu"`. Pendant une session, ouvrir le menu met le chrono en pause (comme la feuille « On s'arrête là ? »). Chaque écran du menu a « Retour » en bas, qui ramène à l'écran précédent.

---

## 6. Mon carnet

| Élément | Spécification |
|---|---|
| En-tête | « Menu » à gauche, « Mon carnet » (20 px, 800) à droite. |
| Filtre | Bouton pleine largeur 52 px « Pharmacie et santé » + chevron. Ouvre une feuille du bas avec 11 lignes radio : « Tout » puis les 10 thèmes. Par défaut : « Tout ». |
| Décor | Petit décor du thème (48 px) à droite du filtre. |
| Poupées du thème | Rangée gigogne + « 1 acquise sur 9 » (si « Tout » : « 14 acquises sur 96 »). |
| Recherche | Champ 48 px, repère « Chercher un mot ou une phrase ». Cherche dans le français, le russe (sans accents) et la translittération. Vide : « Rien trouvé pour « … ». Essaie un autre mot. » |
| Ligne de phrase | Russe accentué 20 px, 600, cobalt, `lang="ru"`. Français 15 px, `--text-muted`. Translittération dessous si le réglage est actif. Bas de ligne : poupée + mot d'état à gauche ; boutons **Écouter** et **Montrer** (44 px, icône + mot) à droite. |
| Phrase-moule | Une seule ligne, avec « · 5 autres mots ». Toucher la ligne déplie les autres phrases complètes, chacune avec Écouter et Montrer (l'état reste celui de la phrase). |
| Écouter | Lit la phrase (toucher volontaire). Respecte « Couper le son » : alors le bouton affiche « Son coupé ». |
| Montrer | Plein écran : la phrase russe en 40 px, 600, `--text` sur `--bg` (contraste maxi), français dessous, translit, bouton « Écouter » et « Fermer » en bas. Écran maintenu allumé. Sert à montrer la phrase à quelqu'un. |
| États | Chargement : aucun (contenu local). Erreur : « Le contenu ne se charge pas. » + « Réessayer ». Les phrases « pas vues » sont affichées en entier : c'est un carnet, pas un test. |

---

## 7. Mes progrès

Statistiques locales, **sans compte, sans série, sans badge, sans classement, sans « bravo ».**

| Bloc | Contenu |
|---|---|
| En-tête | « Menu » + « Mes progrès » |
| Phrase clé | Grande matriochka acquise 56 px + « Tu sais dire 14 phrases » (déjà dans la fin de session) + « sur 96 » en gris |
| 4 chiffres (2 × 2) | « Temps passé » (3 h 20) · « Jours pratiqués » (12) · « Mode préféré » (Écouteurs) · « Durée préférée » (5 min) |
| Par thème | 10 lignes : nom, « 3 sur 9 » à droite, barre de 8 px (`--accent`) ; la barre est décorative, l'information est le texte |
| Vide (aucune session) | « Rien à compter pour l'instant. Lance une session : ça se remplit tout seul. » + bouton « Retour » |

Chiffres de la planche : exemples. Seuls « 1 sur 9 » pour la pharmacie et les 96 phrases sont réels.

---

## 8. Écran de phrase

Même squelette que la Découverte de phase 0, nouvelle identité.

| Zone | Contenu |
|---|---|
| En-tête | « Menu » à gauche, « Quitter » (croix) à droite |
| Contexte | Pastilles d'affichage : mode, durée, thème (non touchables). Barre de temps 6 px + « Encore 3 min » |
| Carte | Décor du thème en haut à droite, 78 px (samovar pour le café). Français 22 px. **Russe : la star**, 30 px, 600, cobalt, accent tonique. Translittération italique. Badge « on vouvoie ». Boutons « Écouter » et « Lentement ». Bloc d'état : matriochka 40 px + mot + sous-texte. |
| Même phrase, autre mot | Libellé + puces tactiles (« Чай », « Капучи́но ») pour une phrase-moule |
| Poupées du thème | Rangée gigogne + « Au café · 3 acquises sur 9 » |
| Bas | « Suivant », bouton laque 60 px |

---

## 9. Décors par situation

Un seul style : **aplats**, sans contour, 3 teintes de bleu au plus + rouge + or, formes simples, pas de dégradé, pas de transparence. Jamais derrière un texte, jamais touchables (`aria-hidden`). 3 Ko maximum par décor. Pas d'ours, pas de vodka, pas de faucille.

| Situation (`id`) | Décor | Teintes |
|---|---|---|
| Accueil | Bulbes de Saint-Basile : 5 bulbes **en forme d'oignon** (large au-dessus du tambour, pointe fine, croix dorée), pas de bougies | bleu, rouge, or |
| `cafe` | Samovar | bleu, or |
| `courses` | Panier de marché, pain et pot de miel | bleu, or |
| `gouts` | Rameau Khokhloma, baies et feuilles (c'est aussi le décor par défaut) | rouge, bleu, or |
| `sortir` | Pont levant de Saint-Pétersbourg, arche et reflet | bleu |
| `rencontrer` | Deux tasses de porcelaine de Gjel face à face | bleu, or |
| `metro` | Trois lustres d'une station de Moscou, en rang | or, bleu |
| `pharmacie` | **Sobre** : croix et une marguerite | bleu seulement |
| `presenter` | Un bouleau | bleu pâle, or |
| `restaurant` | Bol de pelmeni | bleu, rouge |
| `urgences` | **Aucun décor** : un simple filet bleu | bleu seulement |

Où ils apparaissent : accueil (bas de l'écran 1), carte de phrase (haut droit), en-tête du carnet quand un thème est choisi. Pharmacie et Urgences n'ont jamais de rouge ni d'or : le rouge évoque l'alerte.

---

## 10. Format `content/<langue>/ambiance.json`

Une langue sans ce fichier garde l'ambiance neutre de la phase 0. Ajouter une langue = ajouter ce fichier et ses SVG, sans toucher au code.

```json
{
  "langue": "ru",
  "version": 1,
  "nom": "Gjel et Khokhloma",
  "repartition": { "fond": 70, "principale": 20, "accents": 10 },
  "couleurs": {
    "clair":  { "--bg": "#FBF8F2", "--surface": "#FFFFFF", "--text": "#1B2340", "--text-muted": "#4F5A7A",
                "--border": "#6E7AA0", "--border-subtle": "#D5DBEA", "--accent": "#22408F", "--on-accent": "#FFFFFF",
                "--accent-soft": "#DDE5F6", "--laque": "#B3261E", "--on-laque": "#FFFFFF", "--laque-soft": "#F6D9D5",
                "--or": "#C9A227", "--or-text": "#7A5C00", "--deco-bleu-pale": "#B9C9EC" },
    "sombre": { "--bg": "#0F1426", "--surface": "#1A2140", "--text": "#F3EFE6", "--text-muted": "#B4BCD6",
                "--border": "#7F8BB3", "--border-subtle": "#2B3458", "--accent": "#9DB8F5", "--on-accent": "#0F1426",
                "--accent-soft": "#1F2D5A", "--laque": "#E8675E", "--on-laque": "#0F1426", "--laque-soft": "#3A1F2A",
                "--or": "#E0B84A", "--or-text": "#E0B84A", "--deco-bleu-pale": "#2B3F78" }
  },
  "objet_progression": {
    "id": "matriochka",
    "nom": "matriochka",
    "gigogne": true,
    "symboles": {
      "pas_vue": "ambiance/poupee-pas-vue.svg",
      "vue": "ambiance/poupee-vue.svg",
      "en_cours": "ambiance/poupee-en-cours.svg",
      "acquise": "ambiance/poupee-acquise.svg"
    }
  },
  "decors": {
    "accueil": "ambiance/bulbes.svg",
    "defaut": "ambiance/rameau.svg",
    "par_situation": {
      "cafe": "ambiance/samovar.svg",
      "metro": "ambiance/lustres.svg",
      "pharmacie": { "fichier": "ambiance/croix.svg", "sobre": true },
      "urgences": null
    }
  }
}
```

Règles de lecture :
- Les clés de `par_situation` sont les `id` de `index.json`. Une situation absente prend `decors.defaut` ; `null` = aucun décor ; `"sobre": true` = pas de rouge ni d'or.
- Les SVG n'ont aucune couleur écrite en dur : ils utilisent `var(--deco-bleu)`, `var(--deco-bleu-pale)`, `var(--deco-rouge)`, `var(--deco-or)`, `var(--accent)`, `var(--laque)` (l'app les insère en ligne). Aucune image bitmap, aucun drapeau.
- Les 4 mots d'état (« Pas vue », « Vue », « En cours », « Acquise ») restent ceux de l'interface, communs à toutes les langues. Le slogan (« Bagou, ose parler ») dépend de la langue de l'interface, pas de la langue apprise : il n'est pas dans ce fichier.
- Contrôle d'entrée (Boris) : chaque paire de §1.2 doit passer à son seuil dans chaque thème ; sinon le fichier est refusé et l'ambiance neutre s'applique.

---

## 11. Accessibilité (récapitulatif)

- Contrastes : §1.2, vérifiés pour chaque paire clair et sombre.
- Cibles : 44 px minimum (Menu, pastilles, Écouter, Montrer, Quitter, puces de mot), 56 à 64 px pour les choix, 56 px et plus pour le bouton principal. 8 px entre cibles voisines.
- Focus : anneau 3 px `--focus`, décalage 2 px, sur tout élément touchable, y compris les pastilles et les poupées touchables.
- État jamais par la couleur seule : forme de poupée + mot, coche + contour 2 px pour une sélection.
- Mouvement : emboîtement des poupées, ouverture du menu et arrivée des écrans suivent le tableau §5 de `systeme-visuel.md` ; avec « réduire les animations » : apparition directe, aucune transformation.
- Silence : « Avant le départ », le carnet et la planche de progrès ne jouent aucun son à l'ouverture ; seul un toucher volontaire sur « Écouter » en joue un, et jamais après « Couper le son ».
- Texte : plancher 15 px, tailles en `rem`, russe en `lang="ru"`.

---

## 12. Format iPhone, zones de sécurité et marges (retouche du 12/11)

Référence de la planche : iPhone 15/16, **393 × 852 px**, coins de 55 px, Dynamic Island (pilule noire 126 × 37 px, à 11 px du haut, centrée).

| Zone | Valeur | Règle |
|---|---|---|
| Haut | 59 px | Barre d'état (heure à gauche, réseau, Wi-Fi et batterie à droite) et Dynamic Island. **Aucun contenu, aucun bouton.** Seul un décor sans information peut passer dessous. |
| Bas | 34 px | Barre d'accueil (trait de 134 × 5 px). **Aucun contenu, aucun bouton.** En CSS : `padding-bottom: max(34px, env(safe-area-inset-bottom))`, `padding-top: max(59px, env(safe-area-inset-top))`. |
| Côtés | 20 px, égaux | Largeur utile 353 px. Titres, grilles, cartes et boutons s'alignent sur ces marges ; rien ne touche le bord (seuls les décors peuvent déborder, en `aria-hidden`). |

- Les gros boutons du bas occupent toute la largeur utile (353 px) et se posent juste au-dessus de la zone des 34 px.
- Hauteur utile : 852 − 59 − 34 = 759 px. Chaque écran de la planche y tient sans défilement, sauf le carnet et les progrès, qui défilent si la liste est plus longue.
- Accent tonique : un mot russe = un bloc insécable (`display:inline-block; white-space:nowrap`), poids 500, `font-synthesis:none`, pour que l'accent ne se détache ni ne chevauche l'espace voisin.
- Lignes du carnet : « Écouter » et « Montrer » ne rétrécissent jamais et gardent au moins 14 px d'écart avec le mot d'état.
- Écran 2 : la mention « Prérempli pour Écouteurs » est limitée à 112 px de large (deux lignes), et « Une pause » ne se coupe jamais.
- Planche : 2 rangées de 4, centrée, écart de 90 px entre les écrans, en largeur comme en hauteur.
