# Test de niveau en 2 minutes (phase 1, fonction n° 4 de D28)

Auteur : Vera (pédagogue). Mission 013. Statut : proposition, à valider par Sacha. Contenu : aucune phrase nouvelle, tout vient de `content/ru/*.json` (statut `valide-nadia`).
Principe (D7) : le résultat s'exprime en **situations maîtrisées**, pas en étiquette. L'alignement CECRL reste en coulisse.

## 1. Ce que fait le test

12 questions, une par situation. Chaque question montre une phrase française et trois réponses en russe. L'apprenant touche la bonne. C'est de la **reconnaissance** : il n'écrit rien, il ne parle pas, il touche.

- **Modes** : Silence, Écouteurs, Je peux parler. **Voiture exclue** : le test a besoin d'un écran pour toucher les réponses.
- **Audio facultatif** : un bouton « Écouter » lit les trois réponses russes (voix de l'appareil, vitesse normale). Absent en Silence. Aucun écrit obligatoire.
- **Translittération** : affichée seulement si le réglage `translitteration` est activé.
- **Genre** : aucune des 12 phrases ne change selon le genre. Le test ne demande donc pas le genre.
- **Durée** : 12 × 10 s = 120 s sans audio (estimation Silence, « Thème »). Avec l'audio à la demande, la limite haute est 12 × 12 s = 144 s, soit +20 % (tolérance de `regles-session.md`, section 6).

## 2. Les 12 phrases-témoins, de la plus simple à la plus exigeante

Une phrase-témoin par situation. Pour un moule, la question prend le remplacement d'index 0 (règle 4.4). Les deux leurres sont tirés dans la même situation (réservoir P2 de la section 7, aucune phrase n'étant vue). Pour un moule, les leurres sont deux autres remplacements du même moule (carte Moule, section 7).

| # | Situation | Id du témoin | Phrase française | Bonne réponse (russe) | Leurres (ids) | Palier |
|---|---|---|---|---|---|---|
| 1 | cafe | ru-cafe-004 | L'addition, s'il vous plaît. | Счёт, пожалуйста. | ru-cafe-003, ru-cafe-010 | A1, forme fixe |
| 2 | urgences | ru-urgences-001 | Au secours ! | Помогите! | ru-urgences-005, ru-urgences-003 | A1, forme fixe |
| 3 | rencontrer | ru-rencontrer-001 | Je ne comprends pas. | Я не понимаю. | ru-rencontrer-004, ru-rencontrer-002 | A1, forme fixe |
| 4 | metro | ru-metro-001 (moule, rempl. 0) | Où est le métro ? | Где метро? | Où est la gare ? (ru-metro-001), Où est la sortie ? (ru-metro-001) | A1, un mot change |
| 5 | courses | ru-courses-001 | Combien ça coûte ? | Сколько это стоит? | ru-courses-003, ru-courses-004 | A1, forme fixe |
| 6 | pharmacie | ru-pharmacie-004 | J'ai besoin d'un médecin. | Мне нужен врач. | ru-pharmacie-001, ru-pharmacie-009 | A1, accord de нужен |
| 7 | gouts | ru-gouts-007 | Je n'aime pas ça. | Мне это не нравится. | ru-gouts-001, ru-gouts-009 | A1, négation |
| 8 | sortir | ru-sortir-002 (moule, rempl. 0) | On va au cinéma ? | Пойдём в кино? | On va au bar ? (ru-sortir-002), On va au parc ? (ru-sortir-002) | A1, accusatif |
| 9 | presenter | ru-presenter-003 (moule, rempl. 0) | Je travaille dans une banque. | Я работаю в банке. | Je travaille dans la santé (ru-presenter-003), Je travaille dans le commerce (ru-presenter-003) | A1, locatif après в |
| 10 | hotel | ru-hotel-006 (moule, rempl. 0) | Il n'y a pas de serviettes dans la chambre. | В номере нет полотенец. | Il n'y a pas d'eau chaude… (ru-hotel-006), Il n'y a pas de chauffage… (ru-hotel-006) | Proxy A2, génitif pluriel |
| 11 | banque | ru-banque-006 (moule, rempl. 0) | Vous avez la monnaie de cent roubles ? | У вас будет сдача со ста рублей? | cinq cents roubles, mille roubles (ru-banque-006) | Proxy A2, génitif après со |
| 12 | restaurant | ru-restaurant-006 (moule, rempl. 0) | Sans viande, s'il vous plaît. | Без мяса, пожалуйста. | Sans oignons, Sans sauce (ru-restaurant-006) | Proxy A2, génitif après без |

**Ordre** : les témoins 1 à 6 sont des formes fixes ou un seul accord. Les 7 à 9 demandent un cas simple ou une négation. Les 10 à 12 demandent un génitif. Ce découpage est mon critère grammatical. Ce n'est pas une étiquette du contenu (voir section 7).

**Situations non testées** : amis, meteo, telephone. Elles restent « à découvrir » dans le résultat. Pourquoi ces trois-là : ce sont les plus rares à l'arrivée (on y parle peu le premier mois). Sacha peut en changer un.

## 3. Règles de passage

- **Réussite** : bonne réponse au premier toucher (même règle que la carte Thème).
- **Arrêt anticipé** : après **2 erreurs de suite**, le test s'arrête. Les témoins non posés ne sont ni réussis ni échoués : ils restent « non testés ».
- **Pas de retour sur la réponse** pendant le test : la bonne réponse s'affiche après chaque question (1,2 s si réussie, « Continuer » si ratée, comme les cartes Thème).
- **Une seule passe** par écran. Pas de chronomètre affiché.

## 4. Le résultat : situations maîtrisées

- `situations maîtrisées` = nombre de témoins réussis au premier toucher. Un témoin = une situation.
- Affichage : « Tu connais déjà X situations sur 15 ». Les situations testées et ratées, les situations non testées, et les 3 non testées (amis, meteo, telephone) ne comptent pas dans X.
- Sous le chiffre, une ligne d'honnêteté : « D'après une phrase par situation. Le test se corrige tout seul pendant tes premières sessions. »

**Estimation du hasard** : une réponse au hasard réussit 1 fois sur 3. Un débutant qui devine obtient donc en moyenne 4 réussites sur 12. Au seuil de 8 réussites sur 12, la probabilité de deviner est d'environ 2 %. Le test affiche le chiffre brut (il ne retire pas le hasard), car la correction se fait ailleurs (section 5).

## 5. Amorce de la répétition espacée

Le test n'est pas une session. Il écrit dans IndexedDB une seule fois par témoin, avec la boîte choisie ci-dessous. Il suit `repetition-espacee.md` (boîtes de Leitner) comme une première carte.

| Résultat du témoin | Boîte | Échéance | Pourquoi |
|---|---|---|---|
| Réussi au premier toucher | **2** | J+2 | Un seul rappel réussi. Pas la boîte 4 : être acquis demande une réponse produite (écrite, audio ou à voix haute), pas une reconnaissance. |
| Raté | **1** | J+1 | « Raté » vaut boîte 1 (tableau de la section 2). |
| Non posé ou non testé | **0** | sans échéance | Jamais vu : entre dans l'ordre des vagues de `phrases-phase0.md` et des lots suivants. |

- **Quelles phrases partent en boîte haute** : seulement les témoins réussis, à la boîte 2. Pas le reste de leur situation : on n'affirme pas ce qu'on n'a pas mesuré.
- **Quelles phrases partent en boîte 1** : les témoins ratés. C'est sain : l'apprenant les revoit demain.
- **Effet d'un faux positif** (réponse devinée) : au jour J+2, si l'apprenant rate le témoin, il descend à la boîte 1 (règle « due et ratée » : boîte − 2, au minimum 1). L'erreur du test se corrige en deux jours, sans qu'on la voie.
- **Refaire le test** : seuls les éléments en boîte 0 sont mis à jour. Un élément déjà en boîte 1 ou plus n'est jamais réécrit par le test.

## 6. Présenter le résultat sans décourager

Règles de ton :
- on donne le nombre de situations et ce qui vient ensuite, jamais le nombre de fautes ;
- pas de mots « niveau faible », « échec », « mauvais » ; pas de « A1 », « A2 » affichés ;
- la fin anticipée est présentée comme un point de départ trouvé, pas comme une coupure.

Formulations proposées (à relire par Sacha) :
- **0 situation** : « Tu pars de zéro. C'est le meilleur point de départ : on commence par les phrases de survie. »
- **1 à 11 situations** : « Tu connais déjà X situations sur 15. Ta première session reprend là où tu en es. »
- **12 réussites** : « Tu as tout reconnu sur les 12 phrases-témoins. Bagou n'a pas encore de contenu plus loin, donc on ne peut pas aller plus loin. » (Pas de promesse de niveau supérieur.)
- **Arrêt après 2 erreurs** : « On a trouvé ton point de départ. Les phrases que tu ne connais pas encore arrivent dans l'ordre d'urgence. »

## 7. La limite honnête

- **Le contenu actuel est tout entier étiqueté A1.** Les 15 fichiers portent `"niveau": "A1"`. Il n'existe aucune phrase A2 dans `content/ru/`. Le brief parlait de A1 et A2 : ce n'est pas ce que disent les fichiers.
- La gradation des témoins 10 à 12 est donc **un proxy grammatical** (un génitif après une préposition), pas une étiquette. Nadia doit confirmer que ce critère est juste.
- Le test **ne peut pas placer au-delà** des 12 témoins. Un apprenant qui les réussit tous ne reçoit pas de niveau supérieur, il reçoit « tu as tout reconnu ».
- Le test ne dit rien de la production (parler, écrire) : il ne mesure que la reconnaissance.

## 8. Points ouverts (pour Sacha)

1. Valider le découpage A1 et proxy A2 (section 7) : qui le tranche, et faut-il réétiqueter les fichiers ? Ce n'est pas à moi de le faire.
2. Valider les trois situations non testées (amis, meteo, telephone).
3. Autoriser l'ajout au `repetition-espacee.md` d'un type `test` dans l'historique (résultats `reussite` ou `echec`, compte = true). Je ne l'ai pas édité : le fichier est validé et tu le mets à jour.
4. Décider si le test compte comme session dans les jours actifs (mesure d'usage, D26).
5. Nadia : vérifier que les 24 leurres ne sont jamais une réponse juste à la phrase française (exemple : « Где вокзал? » pour « Où est le métro ? » est faux, mais un leurre trop proche d'un synonyme serait un problème).

## 9. Pour Kostia (résumé du contrat)

- Lire les 12 ids du tableau 2, dans cet ordre. Prendre les leurres par id dans `content/ru/*.json`.
- Modes : Silence, Écouteurs, Je peux parler. Voiture désactivée pour ce test.
- Arrêt : 2 erreurs de suite. Résultat : réussites au premier toucher.
- Écriture : boîte 2 (réussi), boîte 1 (raté), boîte 0 (non testé). Seuls les éléments en boîte 0 sont mis à jour à la reprise du test.
