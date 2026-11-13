# Bagou : système de design (contrat pour les outils)

Ce fichier résume la ligne visuelle **validée** (Lou, 11/11/2026). Il sert de contrat aux skills de design (Impeccable, Hallmark). Le détail et les vérifications de contraste sont dans `docs/design/systeme-visuel.md`. **Si une valeur change, elle change aux deux endroits.** Ce qui est validé ne se refait pas : on complète ou on corrige, on ne réinvente pas.

## Couleurs (tokens CSS obligatoires)

Toute couleur passe par une variable de `:root`. Aucune couleur en dur ailleurs.

| Token | Clair | Sombre | Rôle |
|---|---|---|---|
| `--bg` | `#FAF7F2` | `#141312` | Fond de page |
| `--surface` | `#FFFFFF` | `#201E1C` | Cartes, choix, tuiles |
| `--text` | `#1C1B1A` | `#F2EEE8` | Texte principal, phrase russe |
| `--text-muted` | `#5C5750` | `#ADA79E` | Consignes, translittération |
| `--border` | `#8A847B` | `#7A746C` | Contour des éléments cliquables |
| `--border-subtle` | `#E4DED4` | `#34312D` | Filets décoratifs seulement |
| `--accent` | `#1F4E8C` | `#8FB4F0` | Bouton principal, sélection, progression |
| `--on-accent` | `#FFFFFF` | `#141312` | Texte posé sur `--accent` |
| `--accent-soft` | `#E3ECF8` | `#1E2D45` | Fond d'un choix sélectionné |
| `--success` / `--success-soft` | `#1E6B3A` / `#E4F2E8` | `#7FD19B` / `#17301F` | Réponse juste |
| `--danger` / `--danger-soft` | `#A3302A` / `#FBE9E7` | `#F2A39B` / `#3A1D1A` | Réponse fausse |
| `--focus` | `#1F4E8C` | `#8FB4F0` | Anneau de focus |

Règles : juste et faux sont toujours doublés d'une icône (coche, croix) et d'un texte. La sélection est doublée d'un contour de 2 px et d'une coche. Le mode Voiture force les valeurs sombres.

## Typographie

- Une seule pile, aucune police distante : `system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", "Helvetica Neue", Arial, sans-serif`. Elle couvre le cyrillique.
- Plancher : rien en dessous de 15 px. Base 16 px, tailles en `rem`.
- Phrase russe : 30 px (600), 26 px au-delà de 29 caractères, 22 px au-delà de 45. Interlignage 1,35.
- Russe : `lang="ru"`, `hyphens: none`, accent tonique affiché tel quel, `ё` jamais remplacé par `е`, pas de majuscules forcées ni de `letter-spacing` négatif.
- Translittération : italique, `--text-muted`, `lang="ru-Latn"`.
- Français : espace insécable avant `? ! : ;`, apostrophe typographique `’`.

## Espacements et formes

- Base 4 px : 4, 8, 12, 16, 24, 32, 48 px.
- Rayons : 8 px (tuiles, badges), 12 px (boutons, choix), 20 px (haut des feuilles), pilule pour les badges et la progression.
- Colonne mobile : `max-width: 480px`, centrée, marges de 16 px.
- Trois zones par écran : en-tête (56 px), contenu, zone d'action collée en bas (`env(safe-area-inset-bottom)`).

## Composants et interactions

- Cibles tactiles : 44 px minimum, 48 px pour les icônes, 56 px pour le bouton principal, 8 px entre deux cibles.
- Icônes : SVG en ligne, 24 px, trait 2 px, `currentColor`, `aria-hidden` avec un texte ou un `aria-label`. Jamais d'emoji.
- Toute action qui fait avancer est dans la zone d'action du bas.
- Focus visible sur tout élément interactif. Animations réduites si `prefers-reduced-motion`.

## Interdits

- Pas de dégradé violet ou bleu, pas de néon, pas de glassmorphisme.
- Pas de capitales espacées, pas de sur-titre au-dessus des titres, pas de mot coloré dans un titre.
- Pas de chiffre, témoignage ou logo inventé. Pas de « merci » affiché sans envoi.
- Pas de `transition: all`, pas d'animation de `width`, `height`, `top` ou `left`.
- Pas de contenu russe affiché sans son statut de relecture (voir `CLAUDE.md`, règle 7).
