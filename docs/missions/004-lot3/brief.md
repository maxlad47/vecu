# Mission 004 : 5 dernières situations (lot 3)

Brief de Sacha, 12/11/2026. **Travail sur la branche `mission-004-lot3`** : rien ne part sur `main` (donc rien ne se publie) avant la fin du test de Max et sa validation.

## Pourquoi
Compléter les 10 situations prévues en phase 1 pendant que Max teste, pour qu'elles soient prêtes à publier après le bilan.

## Objectif mesurable
5 fichiers de contenu valides, contrôlés par Boris, prêts à fusionner.

## Acquis à ne pas refaire
- Format, règles de session, répétition espacée : validés.
- Les 10 situations existantes (`content/ru/`) : on n'y touche pas. Aucun doublon avec leurs 96 éléments.
- Les décisions de la mission 002 (`docs/missions/002-nouvelles-situations/`) : pas de prénom ni de métier personnel (réglage en phase 1), variantes féminines dans l'astuce pour l'instant.

## Périmètre
Inclus, dans cet ordre : `hotel` (À l'hôtel), `telephone` (Au téléphone), `amis` (Chez des amis), `banque` (Banque et argent), `meteo` (Le temps qu'il fait).
Exclu : code, design, règles de session.

## Qui intervient
| Étape | Agent | Ce qu'il livre | Modèle |
|---|---|---|---|
| 1 | Vera | `docs/pedagogie/phrases-lot3.md` + relais | Sonnet |
| 2 | Nadia | 5 fichiers `content/ru/<id>.json`, `index.json` complété + relais | Opus |
| 3 | Boris | Contrôle du contenu, tests et assemblage | Sonnet |
| 4 | Léa | Avis sur les phrases | Haiku |

## Contraintes
- `banque` : phrases du quotidien (retirer de l'argent, payer par carte, la carte ne passe pas), aucun conseil financier.
- `telephone` : phrases pour comprendre et se faire comprendre au téléphone (épeler, répéter, rappeler).

## Critère de fin
Définition de « terminé » de `docs/processus.md`, sauf l'envoi sur `main`, qui attend le bilan du test et l'accord de Max.
