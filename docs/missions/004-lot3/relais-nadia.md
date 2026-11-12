# Relais de Nadia — mission 004

## Livré
- `content/ru/hotel.json`, `telephone.json`, `amis.json`, `banque.json`, `meteo.json` : 50 éléments (10 par situation), dont 10 moules à 5 remplacements, au format exact de `pharmacie.json`.
- `content/ru/index.json` : les 5 situations ajoutées à la fin, dans l'ordre du brief (rangs 11 à 15), avec les titres fixés par Sacha.
- `docs/pedagogie/notes-linguiste-ru.md`, section « Lot 3 » : 20 adaptations et 17 points à faire valider par un natif.

## Décisions prises
- `variantes` : `null` partout. Aucune phrase ne dépend du genre de la personne qui parle (vérifié phrase par phrase, y compris les passés : Вы оши́блись, Нам повезло́, Банкома́т съел).
- `fr` modifié sur 2 phrases pour coller au russe : telephone-009 (« Vous vous êtes trompé de numéro. ») et amis-003 (« J'enlève mes chaussures ? »). J'ai aussi adapté les `fr` de quelques remplacements (telephone-004, amis-004, meteo-006). amis-007 garde son `fr`, mais le russe dit « je n'en veux plus ».
- Registre : telephone-009 passe de neutre à vous (Вы оши́блись). Le reste suit Vera.
- amis-004, selon l'arbitrage de Sacha : remplacements помы́ть ру́ки, откры́ть окно́, заряди́ть телефо́н, попро́бовать, сесть. Aucun ne recoupe cafe-005 (Мо́жно ка́ртой?) ni hotel-007 (Мо́жно оста́вить здесь бага́ж?).
- banque-008 gardée (arbitrage de Sacha), « roubles » en dur.
- Astuces de Vera corrigées sur le fond : hotel-002, hotel-006, banque-008 (la règle annoncée était fausse pour le russe).

## Pour Boris
- **Pas de shell dans ma session : je n'ai pas pu lancer node.** J'ai relu la syntaxe à la main (virgules, accolades, guillemets). À valider en premier : `node -e "for (const f of ['hotel','telephone','amis','banque','meteo','index']) JSON.parse(require('fs').readFileSync('content/ru/'+f+'.json','utf8'))"`, puis `node --test tests/*.test.mjs` et `tests/qa/`.
- Contrôles utiles : `cible` = `accent` sans U+0301 (phrases et remplacements) ; astuces ≤ 110 caractères (la plus longue, hotel-010, en fait environ 94) ; ids `ru-<situation>-001` à `010` sans trou ; `fr` et `cible` de chaque moule = premier remplacement.
- Format inchangé : rien pour Kostia.
- Trous qui portent la préposition, pour que la phrase complète reste juste : hotel-002 (на… / до…), banque-006 (со ста / с…). L'app ne doit pas recomposer.
- Translittération : с devient « z » devant д (telephone-004, « z diriéktaram »), в devient « f » devant п (telephone-005, « f panidiélnik »). C'est voulu.
- `ordre_libre: true` sur 17 phrases, dont 4 où seul пожа́луйста peut changer de place (telephone-003, 007, 010, banque-010) : c'est nouveau par rapport aux lots 1 et 2, à confirmer avec Sacha.
- Proches à surveiller dans les QCM : banque-007 (Мо́жно нали́чными?) et cafe-005 (Мо́жно ка́ртой?), voulu comme une paire ; banque-001 calquée sur pharmacie-001 ; telephone-005 et telephone-008 (« Rappelez-moi plus tard » / « Je vous rappelle plus tard »).

## Points ouverts
- Rien de ce lot n'est publiable sans relecture native (règle 7). Doutes les plus forts : banque-006 (сда́ча с…), telephone-003 (по бу́квам), telephone-006 (эсэмэ́ска), amis-006 (За тебя́!).

## Corrections du 12/11

### Livré
- `telephone.json` : 004 (trous « à Ivan », « à Irina Petrovna », « au directeur », « à la réception », « au médecin » ; `moule.fr` = « Je peux parler ___ ? » ; astuce sans « Madame »). 007 remplacée par « C'est qui ? » (Кто э́то?). 010 remplacée par « Mon numéro, c'est le… » (Мой но́мер…, neutre, sans moule). Astuce de 002 complétée par Погро́мче!
- `hotel.json` : 006 (trous avec « de » / « d'eau chaude », `moule.fr` = « Il n'y a pas ___ dans la chambre. », astuce но́мер / ко́мната) ; 001 (astuce au vous).
- `banque.json` : 008, astuce courte sans déclinaison.
- `amis.json` : 008 = « Tu veux un coup de main ? » (Тебе́ помо́чь?) ; astuce de 004 réécrite (elle donnait déjà Тебе́ помо́чь?).
- `meteo.json` : 006 = moule « Il va ___ ? » (Бу́дет ___? : pleuvoir, neiger, faire froid, faire chaud, y avoir de l'orage) ; 010 = « Il fait froid, hein ? » (Хо́лодно, да?).
- `phrases-lot3.md` et `notes-linguiste-ru.md` (Lot 3, points 18 à 23) mis à jour. `index.json` inchangé.

### Choix à connaître
- Phrase la plus faible du lot téléphone : **007** (« plus fort »), même besoin que 002. J'ai gardé 006 (SMS), seul recours quand on ne comprend pas un nom ou un nombre.
- « C'est qui ? » et « Tu veux un coup de main ? » : aucun doublon dans les 15 situations (relu à la main ; restaurant-004 « C'est quoi, ça ? » est différent).
- meteo-010 sans « aujourd'hui » : Сего́дня хо́лодно est déjà un remplacement de meteo-002.
- meteo-006 reste un moule (10 moules dans le lot, comme avant).
- Boris, réserve n° 3 (réception → администра́тор) : je garde. En russe, on demande la personne, pas le lieu. Le point est noté pour le natif (point 9).

### Pour Boris
- **Toujours pas de shell : node non lancé.** À valider : `JSON.parse` des 5 fichiers, puis `tests/qa/contenu.qa.js`. Les alertes « à le » et « de eau » du lot 3 devraient tomber à 0.
- À contrôler : `cible` = `accent` sans U+0301 sur telephone-004, 007, 010, amis-008, meteo-006 (5 remplacements), meteo-010 ; `fr`/`cible` de meteo-006 = premier remplacement ; astuces ≤ 110 caractères (la plus longue, telephone-004, fait environ 100).
- `ordre_libre` disparaît avec les 4 phrases remplacées (telephone-007, telephone-010, amis-008, meteo-010) : les nouvelles ont moins de 3 mots ou un ordre figé. Il reste 13 phrases marquées.
- QCM à surveiller : meteo-010 / meteo-002 / meteo-007 (хо́лодно) ; meteo-006 / meteo-005 (бу́дет).
- Format inchangé : rien pour Kostia.
