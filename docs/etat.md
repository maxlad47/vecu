# État du projet Bagou : registre des livrables

Source unique de vérité : ce qui existe, où, et dans quel état. **Chaque agent le lit en premier.** Seul Sacha le met à jour, à la fin de chaque étape.

Statuts : **validé** (ne se refait pas, on complète ou on corrige) · **livré** (en attente de validation) · **à revoir** (un problème est connu) · **à faire**.

Dernière mise à jour : 12/11/2026 (clôture de la mission 002), par Sacha.

## Où en est-on

- **Phase 0 (prototype)** : mission 1 terminée le 11/11/2026. En ligne pour test sur https://vecu-test.netlify.app (non référencé).
- **En cours** : 2 semaines de test par Max (critère de passage de la phase 0).
- **Missions en cours** : 003, design Bagou (`docs/missions/003-design-bagou/brief.md`), étape 1. 004, lot 3 de situations (`docs/missions/004-lot3/brief.md`, branche `mission-004-lot3`), étape 1.
- Dernière mission terminée : 002 (12/11), en ligne sur vecu-test.netlify.app.

## Pédagogie (Vera)

| Livrable | Fichier | Statut |
|---|---|---|
| Phrases de la phase 0 (5 situations, 47 phrases, 10 moules) | `docs/pedagogie/phrases-phase0.md` | validé |
| Règles de composition des sessions | `docs/pedagogie/regles-session.md` | validé (révisé après l'avis de Léa) |
| Répétition espacée (Leitner) | `docs/pedagogie/repetition-espacee.md` | validé |
| Lot 2 : métro, pharmacie, se présenter, restaurant, urgences (49 éléments, 11 moules) | `docs/pedagogie/phrases-lot2.md` | validé (12/11) |
| Réglage « mon prénom » et « mon métier » (Je m'appelle ___, Je suis infirmière…) | backlog phase 1 | à faire |
| Lot 3 : hôtel, au téléphone, chez des amis, banque et argent, le temps qu'il fait | backlog | à faire |
| Remarques sur rencontrer-007 et courses-002 | backlog | à revoir |

## Contenu russe (Nadia)

| Livrable | Fichier | Statut |
|---|---|---|
| 5 situations : cafe, courses, gouts, sortir, rencontrer | `content/ru/*.json` | validé |
| 5 situations : metro, pharmacie, presenter, restaurant, urgences (96 éléments au total) | `content/ru/*.json` | validé (12/11) |
| Format : accent et translittération propres au féminin dans `variantes` (aujourd'hui dans l'astuce) | `CLAUDE.md`, `app/js/contenu.js` | à faire (phase 1) |
| Index des situations | `content/ru/index.json` | validé |
| Notes et doutes à faire valider par un natif (16 points du lot 1, 17 du lot 2) | `docs/pedagogie/notes-linguiste-ru.md` | à revoir (natif) |

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
| Hébergement de test, relié à GitHub : publication automatique à chaque envoi sur `main` | `netlify.toml` | validé (12/11) |
| Tests du moteur, indépendants du volume de contenu (`node --test tests/*.test.mjs`) | `tests/moteur.test.mjs` | validé (12/11) |
| Réserve : Voiture 2 min, onend absent, écart possible au-delà de 20 % (avertissement dans le test) | `tests/moteur.test.mjs` | à revoir (mission audio) |
| Renommer l'app en « Bagou » (titre, manifeste, textes de l'interface) | `app/` | à faire (prochaine mission interface) |
| Dette : textes « russe » de l'interface à sortir de `textes.js` vers `index.json` (2e langue) | `app/js/textes.js` | à faire |
| Limite connue : sur iPhone, l'écran verrouillé coupe la Voiture | — | à revoir (phase 1, fichiers audio) |
| Badge et script Netlify injectés par l'offre gratuite | — | à revoir (avant lancement public) |

## Qualité (Boris, Léa)

| Livrable | Fichier | Statut |
|---|---|---|
| Rapport QA du prototype : « Livrable avec réserves » | `docs/qa/2026-11-11-prototype.md` | validé |
| Outils et scénarios de test (`contenu.qa.js` lit `index.json`) | `tests/qa/` | validé |
| Rapport QA du lot 2 : « Livrable avec réserves » | `docs/qa/2026-11-12-lot2.md` | validé |
| Avis de Léa sur le lot 2 : 7/10 | `docs/journal.md` (12/11) | validé |
| Avis de Léa : 7,5/10, reviendrait demain | `docs/journal.md` (11/11) | validé |

## Organisation

| Livrable | Fichier | Statut |
|---|---|---|
| Constitution | `CLAUDE.md` | validé |
| Processus, modèles par agent, règles anti-doublon | `docs/processus.md` | validé (12/11) |
| Modèle de brief de mission | `docs/missions/_modele-brief.md` | validé (12/11) |
| Fiches des agents | `.claude/agents/` | validé (12/11) |
| Commandes `/point`, `/mission`, `/cloture` | `.claude/commands/` | validé (12/11) |
