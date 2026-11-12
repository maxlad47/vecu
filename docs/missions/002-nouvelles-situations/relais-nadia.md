# Relais de Nadia : mission 002

## Livré
- `content/ru/metro.json` (10), `pharmacie.json` (9), `presenter.json` (10), `restaurant.json` (10), `urgences.json` (10) : 49 éléments, dont 10 moules et 51 remplacements, chacun avec sa phrase complète déjà accordée.
- `content/ru/index.json` : les 5 situations sont ajoutées à la fin, dans l'ordre du brief (10 situations au total).
- `docs/pedagogie/notes-linguiste-ru.md` : section « Lot 2 » (11 adaptations, 13 doutes pour le natif).

## Décisions prises
- Variantes de genre : seulement metro-002 (заблуди́лся / заблуди́лась) et presenter-006 (студе́нт / студе́нтка). Partout ailleurs, il y a une forme neutre naturelle.
- presenter-001 : « informaticien » est remplacé par « manager » (ме́неджер), car программи́стка est courant au féminin.
- urgences-004 : le `fr` devient « Aidez-moi, s'il vous plaît ! », pour ne pas doubler urgences-001 (Помоги́те!).
- `ordre_libre: true` sur 6 phrases : metro-003, pharmacie-001, pharmacie-002, presenter-002, presenter-007 et presenter-008.
- Le format est inchangé, donc rien pour Kostia.

## Pour Boris
- **JSON** : la validité est vérifiée à la relecture seulement, sans `node`. Il faut lancer le parse sur les 6 fichiers et le build avec 10 situations.
- **Cible et accent** : retirer U+0301 de `accent` (et de `phrase_accent`) doit redonner `cible` (et `phrase_cible`). ё n'est jamais marqué (кошелёк, всё, счёт, идёт).
- **Moules** : `fr`, `cible`, `accent` et `translit` du haut doivent être égaux à la `phrase_*` du premier remplacement. Il y a 3 accords à surveiller : pharmacie-003 « зубы » (боля́т), et la translittération de в devant une sourde (presenter-003 : « f targóvli », « f straítilstvi ») et de без / от selon la consonne qui suit (restaurant-006, pharmacie-006).
- **Variantes** : `variantes.m` doit être égal à `cible` (metro-002, presenter-006). La forme féminine n'a ni accent ni translittération dans le format v0. Elles sont donc dans l'`astuce`. À signaler à Sacha si l'app doit lire la forme f à voix haute.
- **Astuces** : elles font 110 caractères au plus (la plus longue est metro-005, environ 94), et chaque mot russe de plus d'une syllabe porte son accent.
- **Doublons à vérifier sur la cible** (je n'ai lu que `cafe.json`) : restaurant-004 Что э́то?, restaurant-002 Меню́, пожа́луйста, metro-001 Где ___? (cafe-006 Где туале́т? existe) et pharmacie-001 Здесь ря́дом есть ___?, contre courses, gouts, sortir et rencontrer.
- **Test du vécu** : urgences-006 et 007 sont des adaptations (Челове́к ра́нен, Здесь ава́рия) et restent à valider par un natif (doutes 2 et 3).

## Corrections du 12/11

Source : `docs/qa/2026-11-12-lot2.md`, décisions de Sacha. Format inchangé, donc rien pour Kostia.

- **pharmacie-005** devient un moule, avec le même id : « Je suis allergique à ___. » → У меня́ аллерги́я на ___. Il y a 5 remplacements (оре́хи, молоко́, пеницилли́н, уку́сы пчёл, глюте́н), et aucun ne change à l'accusatif. Il y a aussi une astuce (-а devient -у).
- **urgences-006** : Тут ра́неный! (« Il y a un blessé ici ! »). L'astuce donne Сюда́! et Челове́ку пло́хо!
- **metro-005** : Идёт до ___? (« Ça va jusqu'à ___ ? »), pour les 5 remplacements, et `ordre_libre: true` (До вокза́ла идёт? se dit aussi).
- **urgences-007** : le `fr` passe au présent (« Il y a un accident ici. ») ; le russe est inchangé, et l'astuce est réécrite sans parler du passé.
- **presenter-003** : « dans une banque » (`fr`, remplacement et `phrase_fr`). L'astuce devient « В + lieu ou domaine ».
- **metro-010** : l'astuce devient « On le demande à qui bloque la porte, avant l'arrêt. En entier : … » (93 caractères).
- `phrases-lot2.md` et `notes-linguiste-ru.md` (Lot 2) sont à jour : les adaptations sont réécrites, les doutes 1 et 2 sont mis à jour et les doutes 14 à 17 sont nouveaux.

### Pour Boris
- **JSON non vérifié par `node`** : je n'ai pas d'outil shell dans ce passage. Il faut lancer le parse sur `pharmacie.json`, `urgences.json`, `metro.json` et `presenter.json`. `index.json` n'a pas changé.
- **Compteurs** : il y a toujours 96 éléments, mais **21 moules** (au lieu de 20) et 5 remplacements de plus. Les valeurs en dur de `tests/moteur.test.mjs` (ta remarque n° 2) sont à recalculer avec 21.
- **Fausse alerte attendue** : « à les » sur le moule pharmacie-005 (« aux noix »), comme pour metro-005 et pharmacie-003.
- **Durée Voiture** : pharmacie-005 s'allonge (У меня́ аллерги́я на оре́хи contre У меня́ аллерги́я), ce qui pèse un peu sur la réserve n° 1.
- **À contrôler** : `accent` sans U+0301 doit être égal à `cible`, `variantes` est null, et ё n'est pas marqué (идёт, пчёл). Les astuces font 110 caractères au plus (la plus longue des 6 modifiées est metro-010, à 93).
- **ordre_libre sur un moule** (metro-005) : c'est la première fois. Il faut vérifier que l'exercice Ordre lit bien le champ au niveau de l'élément moule.

## Points ouverts
- 17 doutes pour le natif (`notes-linguiste-ru.md`, Lot 2). Les plus forts : metro-005 (Э́то до ___?), urgences-006 et urgences-007.
- Format des variantes : faut-il ajouter `accent` et `translit` par genre ? C'est à trancher par Sacha (ce serait alors une tâche pour Kostia).
