# Relais de Nadia, mission 008 (métiers et dialogues), 12/11/2026
Livré : `content/ru/personnage.json` (43 métiers, 9 catégories), `content/ru/dialogues.json` (4 dialogues), `index.json` (clé `dialogues`), 18 doutes dans `notes-linguiste-ru.md`. Non lancé : `node -e JSON.parse` (pas d'outil d'exécution dans ma session). Relu à la main, à valider par Kostia ou Boris.

## Pour Sacha et Vera
- 43 métiers et non 40 : la liste de Vera en compte 43 (13 existants gardés à l'identique, + `categorie`, 30 nouveaux).
- Ids de Vera renommés : ru-dial-cafe-01, -soiree-01, -hotel-01, -hotel-02 deviennent `ru-dialogue-cafe-001`, `ru-dialogue-soiree-001`, `ru-dialogue-hotel-001`, `ru-dialogue-hotel-002`. D4 : « Oui, à quelle heure ? » devient « À quelle heure ? » (= ru-sortir-003 mot pour mot, id confirmé).
- Écart de Lou et Vera : Lou veut « au plus un Pas tout à fait par échange », Vera met 2 fausses par échange. Je marque toutes les fausses `juste: false`. Sacha tranche.
- ru-dialogue-cafe-001 ressemble à ru-courses-007 (Всё, спаси́бо). Le « non » les distingue : à arbitrer.
- Pas de variante « Je travaille » (Lou §6) : D2 et D3 portent `exige: ["metier"]`, donc non proposés sans métier.

## Pour Kostia
**Métiers (`personnage.json`)** : même structure qu'avant. Nouveau : `categorie` (id, voir `categories[]`, `{id, titre}`, dans l'ordre d'affichage). Les métiers gardent leur ordre dans le tableau, groupe-les par `categorie`. `variantes_fr` d'un métier = `m.phrase_fr` / `f.phrase_fr` (pas de champ ajouté).

**`dialogues.json`** : `{ langue, fichier, version, jetons, dialogues[] }`.
- Dialogue : `id`, `situation`, `titre`, `scene_fr`, `registre`, `partenaire.role_fr`, `exige[]` (clés du personnage requises, sinon pas proposé), `depend_du_genre` (si vrai et genre inconnu : Lou §6), `echanges[]`.
- Échange : `id` (e1…), `partenaire` {fr, cible, accent, translit}, `reponses[]`, `si_faux` (id de la réponse montrée si l'utilisateur se trompe, puis on suit sa `suite`).
- Réponse : `id`, `juste`, `fr`, `cible`, `accent`, `translit`. Justes : `suite` (id de l'échange suivant, `null` = fin), `element` (id Leitner), `reaction` (facultatif).
- `reaction` : réplique courte du partenaire, affichée **avant** la réplique de l'échange suivant, dans la même bulle (fr, cible, accent, translit, séparés par une espace).
- Facultatifs : `remplacement` (index dans le moule de `element`), `nouveau: true` (+ `situation`, `registre` : l'élément n'existe pas encore dans `content/ru/<situation>.json`, à créer en v0 depuis la réponse), `astuce` (≤ 110), `pourquoi` (fausses, une ligne pour le panneau de retour), `registre` (seulement s'il diffère du dialogue), `personnalise` + `gabarit`, `variantes`, `variantes_fr`.
- Fausse réponse = échec de l'élément de la bonne réponse (`si_faux`). Les répliques du partenaire ne sont pas des éléments.

**Jetons**
- `{prenom}` : comme dans `personnage.json` (cyrillique dans cible, accentué dans accent, latin tapé dans fr et translit). Sans prénom : exemple Sacha. Les réponses à prénom portent un `gabarit` {fr, cible, accent, translit} ; sinon `fr`/`cible` montrent l'exemple.
- `{metier}` : seulement dans une réplique du **partenaire** (`metier: "mot"`). Remplacer par `metiers[x].m|f` : `fr`, `cible`, `accent`, `translit`. Si le personnage n'a pas de métier, a un domaine ou un statut (catégorie `statuts`), utiliser `sans_metier` (même 4 champs).
- Réponse « Je suis {métier} » (`metier: "phrase"`) : prendre `metiers[x].m|f.phrase_*` (ou `domaines[].phrase_*`). `element` = `metiers[x].element` (ru-presenter-001, -006, -009 ou -010), avec le remplacement du métier.

**Genre** : `variantes` (russe) = `{ m: {cible, accent, translit}, f: {…} }`, **écart au v0** (où ce sont des chaînes). `variantes_fr` = `{ m, f }` : français complet. Un seul cas russe (D4 e2c, « Je suis étudiant ») ; le reste ne change qu'en français (« Enchantée », métiers).

**Écarts au format v0** : fichier hors `situations` (clé `dialogues` de `index.json`) ; `variantes` en objets ; `nouveau` ; pas de `moule` ni d'`id` sur les réponses ordinaires (elles pointent vers `element`).
