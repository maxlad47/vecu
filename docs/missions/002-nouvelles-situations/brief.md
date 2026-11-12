# Mission 002 : 5 nouvelles situations

Brief de Sacha, 12/11/2026. Lancée depuis le cloud, à la demande de Max.

## Pourquoi
Max teste le prototype pendant 2 semaines avec 47 phrases. Plus de situations utiles rendent ce test plus riche, sans toucher à l'app. Ces situations étaient prévues en phase 1 ; on prend de l'avance parce qu'elles ne dépendent pas du test. Trois d'entre elles avaient été demandées par Léa le 11/11.

## Objectif mesurable
Max peut faire une session sur chacune des 5 nouvelles situations, et les 10 situations apparaissent dans « Mes progrès ».

## Acquis à ne pas refaire
- Format du contenu, règles de session, répétition espacée : validés (`CLAUDE.md`, `docs/pedagogie/`).
- Les 5 situations existantes (`content/ru/*.json`) : on n'y touche pas.
- L'app lit les situations depuis `content/ru/index.json` : aucun code à modifier.
- Les doutes déjà notés dans `docs/pedagogie/notes-linguiste-ru.md`.

## Périmètre
- Inclus, dans cet ordre d'apprentissage : `metro` (Métro et directions), `pharmacie` (Pharmacie et santé), `presenter` (Se présenter et son métier), `restaurant` (Au restaurant), `urgences` (Urgences).
- Exclu : hôtel, téléphone, chez des amis, banque, météo (une prochaine mission). Aucun changement de code, de design ou de règles de session.

## Qui intervient, dans quel ordre
| Étape | Agent | Ce qu'il livre | Modèle |
|---|---|---|---|
| 1 | Vera | `docs/pedagogie/phrases-lot2.md` (8 à 10 phrases et 2 moules par situation) + relais | Sonnet |
| 2 | Nadia | 5 fichiers `content/ru/<id>.json`, `index.json` complété + relais | Opus |
| 3 | Boris | Contrôle du contenu (JSON, accents, doublons, test du vécu), tests et assemblage | Sonnet |
| 4 | Léa | Avis sur les phrases : me serviront-elles vraiment ? | Haiku |

Lou et Kostia n'interviennent pas.

## Contraintes
- Pas de doublon avec les 47 phrases existantes (« Merci », « Je ne comprends pas » existent déjà, par exemple).
- `presenter` : le métier change souvent selon le genre (врач / врачиха à éviter, учитель / учительница). Préférer des formes neutres ou fournir les variantes.
- `urgences` et `pharmacie` : phrases courtes et sûres, pas de conseil médical.
- Mise à jour de https://vecu-test.netlify.app : seulement après accord explicite de Max.

## Critère de fin
Définition de « terminé » de `docs/processus.md`, plus : verdict de Boris au moins « Livrable avec réserves » et le build qui passe avec 10 situations.
