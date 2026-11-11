# Vécu : système visuel (phase 0)

Auteur : designer-ux, 11/11/2026. À lire avec `ecrans-phase0.md`. Rendu de référence : `maquettes/accueil.html` et `maquettes/carte-sens.html`.

Principe directeur : **la phrase russe est la star de l'écran.** Tout le reste (consignes, boutons, badges) est calme, lisible, et se range sous le pouce.

---

## 1. Couleurs

Toutes les couleurs passent par des variables CSS. Aucune couleur en dur ailleurs dans le CSS.

### 1.1 Tokens

| Token | Rôle | Clair | Sombre |
|---|---|---|---|
| `--bg` | Fond de page (posé aussi explicitement sur `body`) | `#FAF7F2` | `#141312` |
| `--surface` | Cartes, choix, tuiles, panneau de retour | `#FFFFFF` | `#201E1C` |
| `--text` | Texte principal, phrase russe | `#1C1B1A` | `#F2EEE8` |
| `--text-muted` | Consignes, translittération, lignes d'exemple | `#5C5750` | `#ADA79E` |
| `--border` | Contour des éléments interactifs (choix, tuiles, boutons secondaires) | `#8A847B` | `#7A746C` |
| `--border-subtle` | Séparateurs purement décoratifs (jamais seul pour délimiter un élément cliquable) | `#E4DED4` | `#34312D` |
| `--accent` | Bouton principal, sélection, barre de progression, liens | `#1F4E8C` | `#8FB4F0` |
| `--on-accent` | Texte et icônes posés sur `--accent` | `#FFFFFF` | `#141312` |
| `--accent-soft` | Fond d'un choix sélectionné | `#E3ECF8` | `#1E2D45` |
| `--success` | Contour, icône et texte « juste » | `#1E6B3A` | `#7FD19B` |
| `--success-soft` | Fond d'un choix juste | `#E4F2E8` | `#17301F` |
| `--danger` | Contour, icône et texte « faux » | `#A3302A` | `#F2A39B` |
| `--danger-soft` | Fond d'un choix faux | `#FBE9E7` | `#3A1D1A` |
| `--focus` | Anneau de focus | `#1F4E8C` | `#8FB4F0` |
| `--overlay` | Voile derrière une feuille du bas | `rgba(20,19,18,0.5)` | `rgba(0,0,0,0.6)` |

### 1.2 Contrastes vérifiés (WCAG 2.1, formule de luminance relative)

Seuils : texte courant 4,5:1 (AA), gros texte et composants d'interface 3:1 (AA, critère 1.4.11).

**Thème clair**

| Paire | Ratio | Usage | Verdict |
|---|---|---|---|
| `--text` sur `--bg` | 16,1:1 | Texte, phrase russe | AAA |
| `--text` sur `--surface` | 17,2:1 | Texte des choix | AAA |
| `--text-muted` sur `--bg` | 6,7:1 | Consignes, translit | AA |
| `--text-muted` sur `--surface` | 7,2:1 | Ligne d'exemple d'un lieu | AAA |
| `--text-muted` sur `--accent-soft` | 6,0:1 | Ligne d'exemple d'un lieu sélectionné | AA |
| `--on-accent` sur `--accent` | 8,3:1 | Bouton principal | AAA |
| `--accent` sur `--bg` | 7,8:1 | Liens, contour de sélection, anneau de focus | AAA |
| `--accent` sur `--accent-soft` | 7,0:1 | Coche du choix sélectionné | AAA |
| `--text` sur `--accent-soft` | 14,4:1 | Texte d'un choix sélectionné | AAA |
| `--success` sur `--surface` | 6,5:1 | Texte « C'est ça. » | AA |
| `--success` sur `--success-soft` | 5,6:1 | Icône et contour d'un choix juste | AA |
| `--text` sur `--success-soft` | 14,9:1 | Texte d'un choix juste | AAA |
| `--danger` sur `--surface` | 7,0:1 | Texte « Pas tout à fait. » | AAA |
| `--danger` sur `--danger-soft` | 5,9:1 | Icône et contour d'un choix faux | AA |
| `--text` sur `--danger-soft` | 14,7:1 | Texte d'un choix faux | AAA |
| `--border` sur `--bg` | 3,5:1 | Contour des choix | AA (composant) |
| `--border` sur `--surface` | 3,7:1 | Contour des tuiles | AA (composant) |

**Thème sombre**

| Paire | Ratio | Verdict |
|---|---|---|
| `--text` sur `--bg` | 16,1:1 | AAA |
| `--text` sur `--surface` | 14,4:1 | AAA |
| `--text-muted` sur `--bg` | 7,8:1 | AAA |
| `--text-muted` sur `--surface` | 7,0:1 | AAA |
| `--text-muted` sur `--accent-soft` | 5,8:1 | AA |
| `--on-accent` sur `--accent` | 8,8:1 | AAA |
| `--accent` sur `--bg` | 8,8:1 | AAA |
| `--accent` sur `--surface` | 7,9:1 | AAA |
| `--accent` sur `--accent-soft` | 6,6:1 | AA |
| `--text` sur `--accent-soft` | 12,0:1 | AAA |
| `--success` sur `--surface` | 9,1:1 | AAA |
| `--success` sur `--success-soft` | 7,8:1 | AAA |
| `--text` sur `--success-soft` | 12,3:1 | AAA |
| `--danger` sur `--surface` | 8,3:1 | AAA |
| `--danger` sur `--danger-soft` | 7,7:1 | AAA |
| `--text` sur `--danger-soft` | 13,3:1 | AAA |
| `--border` sur `--bg` | 4,0:1 | AA (composant) |
| `--border` sur `--surface` | 3,6:1 | AA (composant) |

`--border-subtle` n'atteint pas 3:1, c'est voulu : il ne sert qu'aux filets décoratifs.

**Jamais la couleur seule.** Juste et faux sont toujours doublés d'une icône (coche, croix) et d'un texte. Une sélection est toujours doublée d'un contour de 2 px et d'une coche.

### 1.3 Mise en place CSS (obligatoire, conforme au brief)

```css
:root {
  color-scheme: light;
  --bg: #FAF7F2; --surface: #FFFFFF; --text: #1C1B1A; --text-muted: #5C5750;
  --border: #8A847B; --border-subtle: #E4DED4;
  --accent: #1F4E8C; --on-accent: #FFFFFF; --accent-soft: #E3ECF8;
  --success: #1E6B3A; --success-soft: #E4F2E8;
  --danger: #A3302A; --danger-soft: #FBE9E7;
  --focus: #1F4E8C; --overlay: rgba(20,19,18,0.5);
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { /* valeurs sombres, color-scheme: dark */ }
}
:root[data-theme="dark"] { /* mêmes valeurs sombres */ }
body { background: var(--bg); color: var(--text); }
```

Le mode Voiture force les valeurs sombres sur son conteneur (`.ecran-voiture { ...valeurs sombres... }`), quel que soit le thème : moins d'éblouissement la nuit.

---

## 2. Typographie

### 2.1 Pile de polices (système, aucune police distante)

```css
--font: system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", "Helvetica Neue", Arial, sans-serif;
```

Toutes ces polices couvrent le cyrillique (San Francisco sur iOS et macOS, Roboto sur Android, Segoe UI sur Windows, Noto Sans sous Linux). Une seule pile pour tout : le français et le russe ont le même gris typographique, ce qui calme l'écran.

### 2.2 Échelle

Les tailles sont en `rem` pour respecter le réglage de taille du texte du téléphone. Base 16 px.

| Token | Taille | Graisse | Interlignage | Usage |
|---|---|---|---|---|
| `--fs-ru-hero` | 1,875rem (30 px) | 600 | 1,35 | Phrase russe principale (Découverte, Sens, Moule, retour) |
| `--fs-ru-hero-long` | 1,625rem (26 px) | 600 | 1,35 | Phrase russe de 29 à 45 caractères |
| `--fs-ru-hero-xlong` | 1,375rem (22 px) | 600 | 1,35 | Phrase russe de plus de 45 caractères |
| `--fs-fr-hero` | 1,5rem (24 px) | 600 | 1,3 | Phrase française principale (Thème, À voix haute, Ordre) |
| `--fs-ru-option` | 1,375rem (22 px) | 500 | 1,35 | Choix en russe (Thème), tuiles d'Ordre (1,25rem) |
| `--fs-option` | 1,125rem (18 px) | 500 | 1,35 | Choix en français |
| `--fs-title` | 1,5rem (24 px) | 700 | 1,25 | Titre d'écran (Fin, Progrès, Réglages) |
| `--fs-question` | 1,125rem (18 px) | 700 | 1,3 | « J'ai combien de temps ? », « Je suis où ? » |
| `--fs-body` | 1,0625rem (17 px) | 400 | 1,45 | Texte courant |
| `--fs-button` | 1,125rem (18 px) | 600 | 1,2 | Libellé de bouton |
| `--fs-translit` | 1rem (16 px) | 400 italique | 1,4 | Translittération |
| `--fs-small` | 0,9375rem (15 px) | 400 | 1,4 | Consigne, ligne d'exemple, badge, sous-libellé. **Plancher : rien en dessous de 15 px.** |

Le compte de caractères pour choisir la taille de la phrase russe se fait sur le champ `cible` (sans les accents).

### 2.3 Règles pour le cyrillique

- Le russe est toujours dans un élément avec `lang="ru"` (lecteurs d'écran, césure, rendu). Le français de l'interface hérite de `<html lang="fr">`.
- **Accent tonique** : on affiche le champ `accent` tel quel (voyelle suivie du caractère combinant U+0301). Même couleur, même graisse que le reste : pas de `<span>` autour de la voyelle, car colorer un diacritique combinant casse le rendu sur plusieurs navigateurs. L'interlignage de 1,35 laisse la place à l'accent au-dessus des majuscules ; aucun conteneur de phrase n'a `overflow: hidden` ni de hauteur fixe.
- `hyphens: none; overflow-wrap: break-word;` : on ne coupe jamais un mot russe avec un tiret.
- La translittération est en italique, couleur `--text-muted`, juste sous la phrase, et porte `lang="ru-Latn"`.
- Le `ё` est affiché tel qu'il est dans le contenu, jamais remplacé par `е`.
- Pas de `letter-spacing` négatif, pas de majuscules forcées (`text-transform`) sur du russe.

### 2.4 Typographie française

Espace insécable avant `?`, `!`, `:`, `;` et à l'intérieur des guillemets « ». Dans le code : ` ` (ou ` ` fine). Exemple : `"J'ai combien de temps ?"`. Apostrophe typographique `'` (U+2019) dans les textes de l'interface.

---

## 3. Espacements, rayons, mise en page

### 3.1 Espacements (base 4 px)

| Token | Valeur |
|---|---|
| `--space-1` | 4 px |
| `--space-2` | 8 px |
| `--space-3` | 12 px |
| `--space-4` | 16 px |
| `--space-5` | 24 px |
| `--space-6` | 32 px |
| `--space-7` | 48 px |

### 3.2 Rayons

| Token | Valeur | Usage |
|---|---|---|
| `--radius-s` | 8 px | Tuiles de mots, badges |
| `--radius-m` | 12 px | Boutons, choix, cartes de lieu |
| `--radius-l` | 20 px | Haut des feuilles du bas |
| `--radius-pill` | 999 px | Badge de mode, barre de progression |

### 3.3 Colonne et zones

- Colonne : `max-width: 480px; margin-inline: auto;` Marges latérales `--space-4` (16 px). Sur grand écran, la colonne reste centrée, le fond `--bg` remplit le reste.
- Chaque écran est une colonne flex de hauteur `100dvh` (repli `100vh`) en trois zones :
  1. **En-tête** (haut, 56 px) : navigation secondaire. Rien d'important.
  2. **Contenu** (milieu, défile si besoin) : la phrase, les choix.
  3. **Zone d'action** (bas, collée) : le bouton principal, avec `padding-bottom: max(var(--space-4), env(safe-area-inset-bottom))`.
- **Règle du pouce** : toute action qui fait avancer (Démarrer, Suivant, Vérifier, Voir la réponse, Je l'avais) est dans la zone d'action, en bas. Les choix de QCM sont dans la moitié basse du contenu : la phrase est en haut, les choix en dessous, au plus près du pouce.
- Le seul élément en haut à gauche est « quitter » : loin du pouce exprès, pour ne pas être touché par erreur.
- `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`. Ne jamais bloquer le zoom.

### 3.4 Cibles tactiles

Minimum 44 × 44 px partout ; en pratique 48 px pour les icônes et 56 px pour le bouton principal. Au moins 8 px entre deux cibles voisines.

---

## 4. Composants

Les icônes sont des SVG en ligne (24 px, trait 2 px, `stroke="currentColor"`, `aria-hidden="true"`), toujours accompagnées d'un texte visible ou d'un `aria-label`. Pas d'emoji.

### 4.1 Bouton principal

- Hauteur min 56 px, largeur 100 %, rayon `--radius-m`, fond `--accent`, texte `--on-accent`, `--fs-button`.
- Variante à deux lignes (accueil) : libellé (18 px, 600) + sous-libellé (15 px, 400, même couleur `--on-accent`) ; hauteur min 64 px.
- Appuyé : `transform: scale(0.98)` (supprimé en reduced-motion) et `filter: brightness(0.92)`.
- État « incomplet » (accueil sans lieu choisi) : on n'utilise **jamais** `disabled` (inaccessible au focus, et l'utilisateur ne comprend pas). On met `aria-disabled="true"`, fond `--accent-soft`, texte `--accent`, contour 2 px `--accent`. Il reste cliquable et explique ce qui manque.

### 4.2 Bouton secondaire

- Hauteur min 52 px, fond `--surface`, contour 2 px `--border`, texte `--text`, `--fs-button`.

### 4.3 Bouton icône / bouton texte

- Zone de toucher 48 × 48 px minimum, même si l'icône fait 24 px. Couleur `--text` ; libellé texte éventuel en `--fs-small`, graisse 600.

### 4.4 Choix de durée (segments)

- 4 boutons sur une ligne, `gap: 8px`, hauteur 56 px, rayon `--radius-m`, fond `--surface`, contour 2 px `--border`, texte `--fs-option` 600. À 360 px de large : 76 px chacun.
- Sélectionné : fond `--accent-soft`, contour 2 px `--accent`, texte `--text` en 700, petite coche 16 px `--accent` avant le texte.
- Codé en `<fieldset>` + `<legend>` + `<input type="radio">` masqués visuellement, `<label>` stylé. On obtient gratuitement les flèches du clavier et l'annonce « 1 sur 4 » des lecteurs d'écran.

### 4.5 Carte de lieu

- Grille 2 × 2, `gap: 8px`, hauteur min 96 px, rayon `--radius-m`, fond `--surface`, contour 2 px `--border`, padding 12 px.
- Contenu : icône 24 px (`--text`), nom (`--fs-body`, 600, `--text`), ligne d'exemple (`--fs-small`, `--text-muted`, 2 lignes max).
- Sélectionné : fond `--accent-soft`, contour 2 px `--accent`, coche 20 px `--accent` en haut à droite.
- Même codage radio que les durées.

### 4.6 Choix de QCM

- Pleine largeur, empilés, `gap: 8px`, hauteur min 64 px, padding 16 px, rayon `--radius-m`, fond `--surface`, contour 2 px `--border`, texte aligné à gauche.
- Choix en français : `--fs-option`. Choix en russe : `--fs-ru-option`, `lang="ru"`, translittération dessous en `--fs-small` italique `--text-muted` (si activée).
- Une icône d'état de 24 px est réservée à droite (vide par défaut), pour que le texte ne bouge pas à la réponse.
- États :

| État | Fond | Contour | Icône | Autre |
|---|---|---|---|---|
| Repos | `--surface` | 2 px `--border` | aucune | |
| Survol (souris) | `--surface` | 2 px `--accent` | aucune | |
| Appuyé | `--accent-soft` | 2 px `--accent` | aucune | |
| Focus clavier | inchangé | inchangé | | anneau de focus (4.10) |
| Choisi et juste | `--success-soft` | 2 px `--success` | coche `--success` | texte caché « bonne réponse » |
| Choisi et faux | `--danger-soft` | 2 px `--danger` | croix `--danger` | texte caché « ton choix, faux » |
| Bonne réponse non choisie | `--surface` | 2 px `--success` | coche `--success` | texte caché « bonne réponse » |
| Autres après réponse | `--surface` | 2 px `--border-subtle` | aucune | texte en `--text-muted` (pas d'opacité, pour garder le contraste) |

- Après la réponse, tous les choix passent en `aria-disabled="true"` et ne réagissent plus.

### 4.7 Tuile de mot (Ordre)

- Hauteur min 48 px, padding 10 px 14 px, rayon `--radius-s`, fond `--surface`, contour 2 px `--border`, `--fs-ru-option` réduit à 1,25rem (20 px), 500, `lang="ru"`. `gap: 8px`, retour à la ligne libre.
- **Zone réponse** : au-dessus de la réserve, hauteur min 64 px, filet bas 2 px pointillé `--border`. Les tuiles s'y alignent de gauche à droite.
- **Réserve** : quand une tuile part dans la zone réponse, elle laisse un emplacement fantôme de même taille (contour 2 px pointillé `--border-subtle`, vide) : la réserve ne se réorganise pas, les autres tuiles ne bougent pas sous le doigt.
- Après vérification : toutes les tuiles de la zone réponse en `--success-soft` / contour `--success` si juste ; si faux, la zone réponse prend un contour `--danger` et la bonne phrase s'affiche dans le panneau de retour.

### 4.8 Panneau de retour

- Collé en bas, à la place de la zone d'action, fond `--surface`, filet haut 1 px `--border-subtle`, rayon `--radius-l` en haut, padding 16 px.
- Ligne de verdict : icône 24 px + texte `--fs-body` 700 en `--success` ou `--danger`.
- Puis, selon le cas, la bonne réponse (phrase russe en 1,375rem, translit), l'astuce, et le bouton principal « Suivant ».
- `role="status"` (`aria-live="polite"`) sur la ligne de verdict.

### 4.9 Badges

- **Badge de mode** (en-tête de session) : pilule, hauteur 32 px, padding 0 12 px, contour 1,5 px `--border`, icône 16 px + texte `--fs-small` 600 `--text`. Exemple : icône haut-parleur barré + « Silence ».
- **Badge de registre** : pilule, hauteur 28 px, contour 1,5 px `--border`, texte `--fs-small` `--text-muted`. Textes : « on tutoie » / « on vouvoie ».

### 4.10 Focus

```css
:focus-visible { outline: 3px solid var(--focus); outline-offset: 2px; border-radius: inherit; }
```
Jamais `outline: none` sans remplaçant. Pour les radios masqués : `input:focus-visible + label { outline: ... }`.

### 4.11 Feuille du bas (remplace `confirm`)

- Voile `--overlay` plein écran, feuille `--surface` collée en bas, rayon `--radius-l` en haut, padding 24 px 16 px.
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` sur son titre. Focus piégé dedans, focus initial sur le bouton le plus sûr (« Je continue »). Échap ou toucher le voile = « Je continue ». À la fermeture, le focus revient au bouton qui l'a ouverte.

### 4.12 Interrupteur (réglages)

- Toute la ligne est la cible (hauteur min 56 px). Piste 52 × 32 px, rayon pilule ; éteint : fond `--surface`, contour 2 px `--border`, pastille `--text-muted` ; allumé : fond `--accent`, pastille `--on-accent`. `role="switch"` + `aria-checked`. Le libellé de la ligne est cliquable.

### 4.13 Barre de progression

- Hauteur 6 px, rayon pilule, piste `--border-subtle`, remplissage `--accent`. Décorative ; l'information est donnée aussi en texte (« 3 sur 12 »).

### 4.14 Bloc astuce

- Fond `--surface`, filet gauche 4 px `--accent`, rayon `--radius-s`, padding 12 px 16 px. Étiquette « Astuce » en `--fs-small` 700 `--accent`, puis le texte en `--fs-body` `--text`.

---

## 5. Mouvement

Règle : le mouvement aide à comprendre ce qui change, jamais pour décorer. Pas de confettis, pas de secousse sur une erreur, pas de vibration (une vibration s'entend en réunion).

| Élément | Normal | Avec `prefers-reduced-motion: reduce` |
|---|---|---|
| Arrivée d'une carte | fondu + montée de 8 px, 200 ms, `ease-out` | fondu seul, 120 ms |
| Panneau de retour | montée depuis le bas, 180 ms | apparition directe |
| Changement d'état d'un choix | couleur de fond et de contour, 150 ms | identique (pas de mouvement) |
| Appui sur un bouton | `scale(0.98)`, 100 ms | aucune transformation, seul l'assombrissement reste |
| Barre de progression | largeur, 300 ms | saut direct |
| Tuile qui change de zone | apparition à sa nouvelle place, 120 ms de fondu | apparition directe |
| Voiture, pendant la lecture | anneau qui « respire » (scale 1 → 1,04, 2 s, en boucle) | anneau fixe ; seul l'icône change |
| Feuille du bas | montée 200 ms, voile en fondu | apparition directe |

Mise en œuvre :

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Le JS ne doit jamais attendre un `transitionend` ou `animationend` pour faire avancer la session : il utilise ses propres minuteries. Les délais fonctionnels (avance automatique après une bonne réponse) restent identiques en reduced-motion, ce sont des délais de lecture, pas des animations.

---

## 6. Icônes nécessaires

Accueil et navigation : graphique (Mes progrès), engrenage (Réglages), flèche retour, croix (quitter).
Lieux : haut-parleur barré (Silence), casque (Écouteurs), bulle de parole (Je peux parler), voiture (Voiture).
Session : haut-parleur (Écouter), flèche circulaire (Réécouter), coche, croix, œil (Voir la réponse, facultatif).
Voiture : lecture, pause.

Un exemple de chaque icône est dessiné dans les maquettes (SVG en ligne, à reprendre tel quel).
