# État du projet : registre des livrables

Source unique de vérité : ce qui existe, où, et dans quel état. **Chaque agent le lit en premier.** Seul Sacha le met à jour, à la fin de chaque étape.

Statuts : **validé** (ne se refait pas, on complète ou on corrige) · **livré** (en attente de validation) · **à revoir** (un problème est connu) · **à faire**.

Dernière mise à jour : 12/11/2026, par Sacha.

## Où en est-on

- **Phase 0 (prototype)** : mission 1 terminée le 11/11/2026. En ligne pour test sur https://vecu-test.netlify.app (non référencé).
- **En cours** : 2 semaines de test par Max (critère de passage de la phase 0).
- **Mission en cours** : aucune. Étape atteinte : —

## Pédagogie (Vera)

| Livrable | Fichier | Statut |
|---|---|---|
| Phrases de la phase 0 (5 situations, 47 phrases, 10 moules) | `docs/pedagogie/phrases-phase0.md` | validé |
| Règles de composition des sessions | `docs/pedagogie/regles-session.md` | validé (révisé après l'avis de Léa) |
| Répétition espacée (Leitner) | `docs/pedagogie/repetition-espacee.md` | validé |
| Situations à ajouter en phase 1 : métro et directions, pharmacie et santé, se présenter avec son métier | backlog | à faire |
| Remarques sur rencontrer-007 et courses-002 | backlog | à revoir |

## Contenu russe (Nadia)

| Livrable | Fichier | Statut |
|---|---|---|
| 5 situations : cafe, courses, gouts, sortir, rencontrer | `content/ru/*.json` | validé |
| Index des situations | `content/ru/index.json` | validé |
| Notes et doutes à faire valider par un natif (16 points) | `docs/pedagogie/notes-linguiste-ru.md` | à revoir (natif) |

## Design (Lou)

| Livrable | Fichier | Statut |
|---|---|---|
| Système visuel (couleurs, typographie, thèmes) | `docs/design/systeme-visuel.md` | validé |
| Écrans de la phase 0 | `docs/design/ecrans-phase0.md` | validé |
| Maquettes | `docs/design/maquettes/` | validé |

## App (Kostia)

| Livrable | Fichier | Statut |
|---|---|---|
| PWA : moteur de session, Leitner, audio, hors ligne | `app/` | validé |
| Classement des voix par qualité | `app/js/audio.js` | validé |
| Assemblage du site | `scripts/build.mjs`, `scripts/build.sh` | validé |
| Hébergement de test | `netlify.toml` | validé |
| Tests du moteur | `tests/moteur.test.mjs` | validé |
| Dette : textes « russe » de l'interface à sortir de `textes.js` vers `index.json` (2e langue) | `app/js/textes.js` | à faire |
| Limite connue : sur iPhone, l'écran verrouillé coupe la Voiture | — | à revoir (phase 1, fichiers audio) |
| Badge et script Netlify injectés par l'offre gratuite | — | à revoir (avant lancement public) |

## Qualité (Boris, Léa)

| Livrable | Fichier | Statut |
|---|---|---|
| Rapport QA du prototype : « Livrable avec réserves » | `docs/qa/2026-11-11-prototype.md` | validé |
| Outils et scénarios de test | `tests/qa/` | validé |
| Avis de Léa : 7,5/10, reviendrait demain | `docs/journal.md` (11/11) | validé |

## Organisation

| Livrable | Fichier | Statut |
|---|---|---|
| Constitution | `CLAUDE.md` | validé |
| Processus, modèles par agent, règles anti-doublon | `docs/processus.md` | validé (12/11) |
| Modèle de brief de mission | `docs/missions/_modele-brief.md` | validé (12/11) |
| Fiches des agents | `.claude/agents/` | validé (12/11) |
| Commandes `/point`, `/mission`, `/cloture` | `.claude/commands/` | validé (12/11) |
