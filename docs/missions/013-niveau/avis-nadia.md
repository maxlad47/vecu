# Avis de Nadia : test de niveau (mission 013)

Lu : `docs/pedagogie/test-niveau.md`, `relais-vera.md`, `docs/etat.md` et les 12 fichiers `content/ru/*.json` des témoins (cafe, urgences, rencontrer, metro, courses, pharmacie, gouts, sortir, presenter, hotel, banque, restaurant). Je ne suis pas native : tout ce qui est marqué « doute » est à faire relire.

Critère appliqué : un leurre doit être du russe correct et naturel, mais ne doit être ni une traduction possible de la phrase française posée, ni la même phrase dans un autre registre, ni un synonyme acceptable. Les 24 leurres sont du russe correct dans les fichiers (accent et sens vérifiés). Aucun n'est une faute qui trahirait le piège.

## 1. Les 12 témoins, leurre par leurre

| # | Phrase française | Bonne réponse | Leurre 1 | Leurre 2 | Verdict |
|---|---|---|---|---|---|
| 1 | L'addition, s'il vous plaît. | Счёт, пожалуйста. | Спасибо. (cafe-003) | До свидания. (cafe-010) | OK |
| 2 | Au secours ! | Помогите! | Пожар! (urgences-005) | Вызовите полицию! (urgences-003) | OK |
| 3 | Je ne comprends pas. | Я не понимаю. | Как вас зовут? (rencontrer-004) | Повторите, пожалуйста. (rencontrer-002) | OK avec réserve (voir ci-dessous) |
| 4 | Où est le métro ? | Где метро? | Где вокзал? | Где выход? | OK |
| 5 | Combien ça coûte ? | Сколько это стоит? | Можете написать? (courses-003) | Извините. (courses-004) | OK |
| 6 | J'ai besoin d'un médecin. | Мне нужен врач. | Здесь рядом есть аптека? (pharmacie-001) | У меня есть рецепт. (pharmacie-009) | OK |
| 7 | Je n'aime pas ça. | Мне это не нравится. | Очень вкусно! (gouts-001) | Очень красиво! (gouts-009) | OK |
| 8 | On va au cinéma ? | Пойдём в кино? | Пойдём в бар? | Пойдём в парк? | OK |
| 9 | Je travaille dans une banque. | Я работаю в банке. | Я работаю в медицине. | Я работаю в торговле. | OK (doute léger sur « в медицине ») |
| 10 | Il n'y a pas de serviettes dans la chambre. | В номере нет полотенец. | В номере нет горячей воды. | В номере нет отопления. | OK |
| 11 | Vous avez la monnaie de cent roubles ? | У вас будет сдача со ста рублей? | У вас будет сдача с пятисот рублей? | У вас будет сдача с тысячи? | OK |
| 12 | Sans viande, s'il vous plaît. | Без мяса, пожалуйста. | Без лука, пожалуйста. | Без соуса, пожалуйста. | OK |

Résultat : aucun leurre à changer. Un seul remplacement facultatif (n° 3).

### Remarques par témoin

- **1.** Les deux leurres sont d'autres formules du café. Aucun ne signifie « l'addition ». La bonne réponse est la plus longue et la seule avec пожалуйста : indice de surface, pas une faute de contenu.
- **2.** Pas de recouvrement de sens. Пожар et Вызовите полицию sont d'autres urgences.
- **3.** Повторите, пожалуйста est ce qu'on dit en pratique quand on ne comprend pas. Ce n'est pourtant pas une traduction de « Je ne comprends pas », et un apprenant qui lit les mots ne s'y trompe pas. Je le garde, mais c'est le leurre le plus proche de la situation. Si Sacha veut zéro risque, remplacement possible (même situation, ru-rencontrer-005) : `О́чень прия́тно.` / translit `ótchin priiátna`.
- **4, 8, 9, 10, 11, 12 (moules).** L'app doit afficher la **phrase complète** (`phrase_cible`, `phrase_accent`, `phrase_translit`) pour chaque leurre, jamais le morceau seul (`cible`). Avec le morceau seul, les options ne seraient plus des phrases comparables à la bonne réponse. Quels que soient les deux autres remplacements tirés dans le moule, aucun n'est une traduction possible : chaque remplacement désigne un objet différent. Vérifié sur tous les remplacements des six moules.
- **5.** Courses-003 se dit au vendeur qui annonce un prix, mais ne signifie pas « combien ça coûte ». OK.
- **6.** Les deux leurres sont du russe correct et du même monde (pharmacie). Pour tester l'accord de нужен, un meilleur leurre serait « Мне нужна помощь » (j'ai besoin d'aide, cité dans l'astuce de pharmacie-004). Ce n'est pas une phrase à part entière dans les fichiers, donc je ne le propose pas.
- **7.** Les deux leurres sont positifs (« c'est très bon », « c'est très beau »). Ils ne testent donc pas la négation. Le piège classique serait « Мне нравится… » : on peut utiliser ru-gouts-002 (« Мне нравится этот город. ») si Sacha veut que le test discrimine vraiment la négation. Pas obligatoire.
- **9.** « Я работаю в медицине » est compris et courant à l'oral, mais je ne suis pas certaine qu'un natif ne dirait pas plutôt « в сфере медицины » ou « в здравоохранении » dans tous les contextes. Doute à faire valider (déjà dans les doutes du lot 2 ? à vérifier dans `notes-linguiste-ru.md`). « В торговле » est sûr.
- **10.** Le français « serviettes » est ambigu : « serviettes de table » se dit салфетки. Dans une chambre, c'est bien полотенца. Suggestion pour Vera : écrire « serviettes de toilette » côté français pour ne pas piéger un apprenant qui connaît салфетки.
- **11.** Phrase la plus idiomatique de la liste. Un natif dirait peut-être plutôt « У вас не будет сдачи со ста рублей? » (négation + génitif), plus courant pour une demande polie. La forme du fichier reste compréhensible et correcte à mon avis. Doute à faire valider.
- **12.** Sans objection. Les deux leurres sont du russe tout à fait courant.

## 2. Le proxy A2 des témoins 10 à 12 (génitif après préposition)

Rappel : les 15 fichiers portent `"niveau": "A1"`. Il n'y a pas de phrase A2 dans `content/ru/`. Tout ce qui suit est un avis de linguiste sur la difficulté de forme, pas une étiquette du contenu.

**Mon avis : je confirme en partie, je conteste le n° 12, et je conteste le mot « A2 ».**

1. **Le génitif après préposition n'est pas, à lui seul, un marqueur A2.** Le corpus A1 contient déjà des blocs de ce type : « Я из Франции » (rencontrer-006), « Идёт до вокзала ? » (metro-005), « Я здесь до субботы » (hotel-002), « от кашля » (pharmacie-006), « после работы » (sortir-007), « без сахара » (restaurant-006, moule). Si le critère était « génitif après préposition = A2 », il faudrait reclasser une bonne dizaine de phrases du A1. De mémoire (à vérifier), les référentiels de russe langue étrangère mettent le génitif singulier avec нет, из, до, без plutôt au premier niveau, et le génitif pluriel plus tard. Je ne peux pas le garantir sans source sous les yeux.
2. **Ce qui est vraiment plus difficile, c'est la forme.** Le n° 10 (полотенец) a une terminaison zéro au génitif pluriel. Le n° 11 (со ста рублей) cumule le nombre irrégulier ста, la variante со de la préposition, et le génitif pluriel рублей. Là, le proxy tient : on sort de ce qu'un débutant déduit seul.
3. **Le n° 12 (без мяса) est du génitif singulier après без.** Rien ne le sépare d'un « без сахара » demandé au café. Je le range A1 plus que proxy A2.
4. **Le test ne mesure pas le génitif, il mesure le vocabulaire.** Les trois réponses de chaque question 10 à 12 ont la même structure (нет + génitif, с + génitif, без + génitif). L'apprenant choisit donc selon le mot (полотенце, сто, мясо), pas selon la forme du cas. Pour tester le cas, il faudrait un leurre à la mauvaise forme (« нет полотенце »), mais la règle de Vera interdit à juste titre un russe incorrect. Je suis d'accord avec la règle. La conséquence : ne pas écrire que le test « mesure le génitif ».
5. **Ordre proposé** : restaurant (без мяса) en 10, hôtel (полотенец) en 11, banque (со ста рублей) en 12. Cela suit mieux la difficulté de forme, et l'arrêt après 2 erreurs de suite tombe alors là où la forme devient lourde. Si Sacha préfère garder l'ordre actuel, ce n'est pas bloquant.
6. **Vocabulaire** : j'appellerais ces trois témoins « formes à déclinaison visible » dans les documents internes, pas « A2 ». L'écran de résultat n'affiche déjà aucun A1/A2 (section 6 du document de Vera), ce qui est la bonne décision.

Autres remarques sur les paliers (hors question) : le « A1, accusatif » du n° 8 est trompeur. « В кино » est indéclinable, « в бар » et « в парк » sont des inanimés masculins dont l'accusatif ressemble au nominatif : aucune forme d'accusatif n'est visible. Le n° 9 (в банке, locatif en -е) montre en revanche un vrai changement de forme.

## 3. Doutes à faire valider par un natif

1. « Я работаю в медицине » : naturel dans tous les contextes ? (n° 9, leurre).
2. « У вас будет сдача со ста рублей ? » contre « У вас не будет сдачи со ста рублей ? » : laquelle est la plus naturelle pour un client ? (n° 11, bonne réponse).
3. Alignement CECRL / niveaux officiels de russe langue étrangère du génitif après préposition : de mémoire, non vérifié.

Ces trois doutes ne sont pas encore dans `docs/pedagogie/notes-linguiste-ru.md` : consigne reçue de ne modifier aucun autre fichier. Sacha peut les y reporter.
