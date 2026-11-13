# Outils de design : règles d'usage (D31, 13/11/2026)

Décision de Sacha, sur demande de Max : deux skills installés, avec des défauts réglés. Ils sont là pour contrôler ce qui existe, pas pour réinventer le design validé.

## Ce qui est installé

| Outil | Version (commit) | Où | Licence | Usage autorisé |
|---|---|---|---|---|
| Impeccable (pbakaus) | `c4cd192` | `.claude/skills/impeccable/` (SKILL.md et `reference/` seulement) | Apache 2.0 | `critique`, `audit`, `polish` sur un écran à réviser, avec Lou |
| Hallmark (Nutlope) | `04977e1` | `.claude/skills/hallmark/` (SKILL.md, `references/`, `scripts/sloplint.mjs`) | MIT | `audit` nommé seulement, et `sloplint` en mode statique |

## Mise à jour D33 (13/11/2026) : le skill fait foi
Sur instruction de Max (« fais tout avec le skill, ne décide pas de retirer des éléments »), le lanceur, les 4 sous-agents et le hook d'Impeccable sont installés (`.claude/skills/impeccable/scripts/`, `.claude/agents/impeccable-*.md`, `.claude/settings.json`). Le binaire se télécharge au premier lancement, vérifié par empreinte (`engine-checksums.txt`), et n'est pas versionné. Télémétrie : `DO_NOT_TRACK=1` à exporter avant tout lancement. Les puces « non installé » ci-dessous qui concernent le lanceur, le hook et la CLI sont donc **caduques**. Reste exclu par la consigne : tout changement de couleur ou de fond.

## Ce qui n'était pas installé en D31, et pourquoi

- **Launcher et binaire d'Impeccable** : il télécharge un binaire au premier lancement. Non intégré : le skill se rabat sur les fichiers `PRODUCT.md` et `DESIGN.md`, prévu par lui-même.
- **Hook d'Impeccable** (`.claude/settings.json`) : il s'exécute à chaque modification. Non intégré, pour ne pas ajouter de code qui tourne sans être demandé.
- **Télémétrie** : elle vit dans la CLI, qui n'est pas installée. Si la CLI entre un jour, `DO_NOT_TRACK=1` est obligatoire.
- **Sloplint en `--render`** : il installe des paquets au besoin. Mode statique seulement.
- **OpenDesign** : espace de travail complet (Electron, Node 24, daemon SQLite) qui ajoute un outil de plus. Contraire à D11 et D12.
- **GSAP skills** : pas d'animation à ce stade. Si l'on en ajoute, CSS d'abord. GSAP passera par une décision séparée.
- **anthropics/skills** : la skill `frontend-design` est déjà disponible, et Impeccable en est issu. Les skills docx, pdf, pptx, xlsx ne servent pas à une PWA.

## Règles d'usage

1. **Ligne visuelle** : `PRODUCT.md` et `DESIGN.md` font foi pour les outils. `docs/design/systeme-visuel.md` fait foi pour les détails. Toute modification se fait aux deux endroits.
2. **Lou reste propriétaire du design.** Impeccable et Hallmark sont des contrôles et des propositions : Lou décide, Sacha tranche.
3. **Décision de Max (13/11/2026, D32) : refonte libre du design, sauf les couleurs et le fond.** Toutes les commandes sont permises (`typeset`, `layout`, `bolder`, `quieter`, `redesign`…), à une condition : aucun changement de palette (tokens et `content/ru/ambiance.json`) ni de fond (porcelaine, fonctionnement, contenu). `colorize` reste exclu, et `live` reste interdit (il lance `claude` sans garde-fous).
4. **Hallmark ne se déclenche jamais seul.** Son skill l'interdit sur un design existant, sauf si l'on le nomme (`/hallmark audit <chemin>`).
5. **Sloplint, mode statique** : `node .claude/skills/hallmark/scripts/sloplint.mjs <chemin> --scope app`. Lecture seule, sans réseau.
6. **Un écran touché passe par Lou**, selon le déclencheur de `docs/processus.md` (6 bis). Pas de correction visuelle hors mission.
7. **Revue** : à la fin de la phase 0, avec Max (D12).

## Premier audit (13/11/2026, sloplint statique sur `app/`)

Résultat brut : 37 échecs, 31 signalements, 4 avertissements. Après lecture du code, peu sont de vrais problèmes. Rien n'est corrigé dans cette mission : les constats vont à Lou (design) et à Kostia (code), selon le processus.

**Faux positifs (à ignorer, ou à corriger dans le linter)**
- Couleurs « hors tokens » lignes 48-59 de `app.css` : c'est le bloc de tokens du mode Voiture (`body.theme-voiture`), que le linter ne reconnaît pas.
- Contraste 1,00:1 sur `.bouton-pause` : le bouton n'a pas de texte visible, seule une icône de 72 px sur disque bleu. Son contraste est de 8,8:1 en thème sombre.
- Absence de « tampon Hallmark » en première ligne du CSS : convention de Hallmark pour ses propres sorties, sans objet ici.

**Vrais points, à traiter par priorité**
1. `overflow-x: clip` absent sur `html` et `body` (règle 34). Risque de défilement horizontal sur iPhone, à vérifier par Boris. Correction de Kostia.
2. `.liste-menu` utilise `100vw` dans sa largeur : décalage possible avec barre de défilement sur ordinateur. Correction de Kostia, mineure.
3. `.barre > span` anime `width` (règle 10a). Léger, à passer en `transform: scaleX`. Correction de Kostia.
4. Une trentaine d'espacements hors de l'échelle 4 px (6 px, 10 px, 14 px, 22 px…) et des valeurs en dur alors qu'un token existe. Dérive du système, sans gravité. Décision de Lou : ajuster l'échelle ou les valeurs, pas les deux.

**Règle levée** : `redesign` et les commandes de retouche sont permis depuis D32, hors couleurs et fond.
