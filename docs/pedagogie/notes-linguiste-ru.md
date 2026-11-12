# Notes du linguiste russe, phase 0

Auteur : linguiste-russe. Date : 11/11/2026. Source : `phrases-phase0.md` (47 éléments, dont 10 moules).
Fichiers livrés : `content/ru/cafe.json`, `courses.json`, `gouts.json`, `sortir.json`, `rencontrer.json`, `index.json`.

**Rappel : je ne suis pas un locuteur natif.** Rien de ce contenu ne doit être publié sans la relecture d'un natif humain (règle 7 de `CLAUDE.md`).

## Conventions techniques

- `accent` : accent aigu combinant (U+0301) placé après la voyelle tonique de chaque mot de plus d'une syllabe. Les mots d'une syllabe ne sont pas marqués, et ё ne l'est jamais (il est toujours tonique). `cible` ne contient aucun accent : pour comparer `cible` et `accent`, retirer U+0301.
- `translit` : en minuscules, sans le point final, mais en gardant « ? » et « ! ».
- Moules : chaque remplacement contient le morceau (`fr`, `cible`, `accent`, `translit`) et la phrase complète (`phrase_fr`, `phrase_cible`, `phrase_accent`, `phrase_translit`). **Le dev doit afficher la phrase complète et ne pas la reconstruire** à partir du modèle. C'est indispensable pour les « pommes » (сто́ят) et pour la translittération (в devient « f » devant к ou п, из devient « is » devant un son sourd).
- `moule.fr` des deux moules de `gouts` : « J'aime ___ (une chose). » et « J'aime ___ (faire). », pour la distinction voulue à l'écran. `phrase_fr` reste propre (« J'aime cette ville. »).
- `ordre_libre: true` n'est mis que sur les phrases hors moule de 3 mots ou plus quand un autre ordre se dit aussi naturellement. Ailleurs, le champ est absent (donc faux).
- `variantes` : `null` partout. Toutes les phrases ont une forme naturelle sans genre (voir plus bas).
- Registre : celui du pédagogue, sauf pour sortir-001 (voir plus bas).

## Convention de translittération (pour un francophone, la même dans tous les fichiers)

La translittération est **phonétique simplifiée** : elle note ce qu'on entend, pas les lettres. L'accent aigu marque la syllabe tonique.

| Russe | Translit | Exemple |
|---|---|---|
| ж, ш, щ, ч | j, ch, chtch, tch | пожалуйста → pajálsta, счёт → chtchot |
| х, ц | kh, ts | хлеб → khliep |
| у, ы, й | ou, y, ï | чай → tchaï |
| е tonique / atone | ié / i (après ж, ш, ц : é / y) | туалет → toualiét, можете → mójyti |
| ё (toujours tonique) | io (après ж, ш, ч, щ : o) | всё → fsio, пойдём → païdióm |
| я, ю | ia, iou | люблю → lioublioú |
| э | e (é si tonique) | это → éta |
| о atone | a | спасибо → spassíba |
| с entre deux voyelles | ss | краси́во → krassíva |
| г devant e, i | gu | Бельгии → biélguii |
| -тся, -ться | tsa | нравится → nrávitsa |
| ь | non noté | |

On note aussi les consonnes sourdes devant une sourde ou en fin de mot (вкусно → fkoúsna, хлеб → khliep), le в muet de здравствуйте et le г prononcé « v » dans сегодня (sivódnia). Exceptions : кафе se prononce dur (kafé) et пожалуйста s'écrit « pajálsta », la forme orale courante.

Écart à signaler : l'exemple de `CLAUDE.md` (« shchyot, pozhálusta ») suit une translittération à l'anglaise. J'ai suivi la consigne « lisible par un francophone ». Si le CEO préfère l'autre convention, il faudra mettre à jour l'exemple de `CLAUDE.md`, ou les fichiers.

## Adaptations (une ligne de raison pour chacune)

- **cafe-002** « Une bouteille d'eau » → Буты́лку воды́ (accusatif) : on sous-entend « donnez-moi ». Le morceau s'apprend en bloc, comme le demande le pédagogue.
- **cafe-005** « Je peux payer par carte ? » → Мо́жно ка́ртой? (« on peut par carte ? ») : c'est ce qu'on dit à la caisse, et le verbe оплати́ть sonnerait lourd.
- **cafe-006** « Où sont les toilettes ? » → Где туале́т? : le russe met le mot au singulier.
- **cafe-007** « le wifi » → вайфа́й : c'est le mot oral courant. À l'écrit, on voit aussi Wi-Fi.
- **cafe-009** « C'est libre ? » → Здесь свобо́дно? (« ici, c'est libre ? ») : c'est la formule figée pour une place.
- **courses-001** « Combien ça coûte ? » → Ско́лько э́то сто́ит? : j'ai gardé la forme complète pour Max, avec en astuce la forme courte Ско́лько сто́ит?
- **courses-002** « Je prends ___ » → Я возьму́ ___ (futur perfectif) : c'est ce qu'on dit quand on se décide à acheter. Я беру́ est possible, mais moins courant ici.
- **courses-002** « deux » → два : cette forme ne convient qu'à un objet masculin ou neutre, il faudrait две pour un objet féminin. J'ai gardé два, la forme par défaut quand on montre du doigt.
- **courses-003** « Vous pouvez l'écrire ? » → Мо́жете написа́ть? : en russe, on n'a pas besoin du « le ». C'est le contexte (le prix) qui suffit.
- **courses-007** « C'est tout, merci » → Всё, спаси́бо : c'est la réponse réelle à « Что́-нибудь ещё? ». Э́то всё est plus scolaire.
- **gouts-001 et gouts-009** : вку́сно pour ce qui se mange, краси́во pour ce qui se voit. En russe, le français « bon / beau » se dit avec deux mots différents.
- **gouts-002** : нра́вится (« la chose me plaît »). Tous les remplacements sont au singulier, donc нра́вится ne change pas.
- **gouts-006** « J'aime ton chien » → Мне нра́вится твоя́ соба́ка, et non люблю́. Un natif dirait aussi, plus spontanément, Кла́ссная у тебя́ соба́ка!
- **gouts-007** « Je n'aime pas ça » → Мне э́то не нра́вится. J'ai mis en astuce la forme adoucie Мне не о́чень, plus polie à table.
- **sortir-001** « D'accord ! » → Дава́й! : c'est la réponse naturelle à une proposition entre amis. **Le registre passe de neutre à tu**, puisqu'on dit Дава́йте à un vous. Хорошо́ est donné en astuce comme forme neutre.
- **sortir-002** « On va ___ ? » → Пойдём ___? : c'est la proposition orale la plus courante. Tous les lieux prennent в + l'accusatif, qui est identique au nominatif ici.
- **sortir-003** « À quelle heure ? » → Во ско́лько? (« à combien ? ») : c'est la forme orale. В како́е вре́мя? est administratif.
- **sortir-005** « Tu fais quoi ce soir ? » → Что ты де́лаешь ве́чером? : au présent, ве́чером suffit pour dire « ce soir », et сего́дня alourdirait la phrase.
- **sortir-006** « Je vais aller au foot » → Я пойду́ на футбо́л : на футбо́л veut dire aller voir un match, ce qui correspond au sens retenu.
- **sortir-008** « Désolé, je ne peux pas » → Извини́, не могу́ : la forme est neutre et naturelle, donc pas de variantes (прости́ marche aussi). On laisse tomber le я, comme à l'oral.
- **sortir-010** « Je suis en retard » → Я опа́здываю (présent, sans genre) : c'est ce qu'on écrit ou dit en chemin.
- **rencontrer-002** « Vous pouvez répéter… ? » → Повтори́те, пожа́луйста (impératif poli) : c'est le réflexe natif. Мо́жете повтори́ть? est correct, mais moins fréquent.
- **rencontrer-003** « Plus lentement… » → Поме́дленнее, пожа́луйста : avec le préfixe по- (« un peu plus »), c'est la forme spontanée. Ме́дленнее tout seul sonne sec.
- **rencontrer-005** « Enchanté » → О́чень прия́тно : la forme est neutre, donc pas de variantes. Рад / ра́да познако́миться existe, mais dépend du genre.
- **rencontrer-006** : из + génitif. Les morceaux sont déclinés (Фра́нции, Пари́жа, Бе́льгии, Швейца́рии, Кана́ды).
- **rencontrer-007** : говори́ть по-… + adverbe. Les morceaux sont des adverbes invariables, comme по-англи́йски.

## À faire valider par un natif

Les points sont classés du doute le plus fort au plus faible.

1. **rencontrer-003**, translittération de Поме́дленнее (« pamiédlinieie ») : la fin -нее est difficile à noter. Il faut vérifier si l'on entend 3 ou 4 syllabes après l'accent à vitesse normale.
2. **courses-002**, Я возьму́ два : il faut vérifier si un natif dit два ou две sans savoir le genre de l'objet, ou plutôt Дава́йте два / Два, пожа́луйста. Il faut aussi confirmer que Я возьму́ хлеб / во́ду sonne naturel (à la boulangerie, on dirait peut-être Мне хлеб, пожа́луйста).
3. **courses-002**, Я возьму́ килогра́мм : il faut vérifier si l'on dit plutôt килогра́мм, кило́ ou Мне килогра́мм…
4. **sortir-001**, Дава́й! pour « D'accord ! » : il faut confirmer que la réponse convient à tous les cas (une proposition ou une heure). On pourrait aussi retenir Договори́лись! ou Ла́дно.
5. **gouts-006**, Мне нра́вится твоя́ соба́ка : la phrase est correcte, mais un natif dirait-il plutôt Кла́ссная у тебя́ соба́ка! ?
6. **cafe-005**, Мо́жно ка́ртой? : il faut confirmer que la phrase est naturelle et suffisamment polie à la caisse (ou s'il faut Мо́жно оплати́ть ка́ртой?).
7. **cafe-007**, вайфа́й et меню́ на англи́йском : il faut vérifier l'usage oral (вайфа́й ou вай-фа́й), et si l'on dit plutôt меню́ на англи́йском языке́ ou англи́йское меню́.
8. **cafe-002**, Буты́лку воды́, пожа́луйста : il faut vérifier qu'un natif ne dirait pas plutôt Бутылку воды́ без га́за / Во́ду, пожа́луйста. La translittération « kapoutchína » (о final réduit dans un mot d'emprunt) est aussi à vérifier.
9. **rencontrer-006**, translittération de Швейца́рии (« chviïtsárii ») et de Бе́льгии (« biélguii »).
10. **sortir-005**, Что ты де́лаешь ве́чером? : il faut vérifier que сего́дня n'est pas attendu, et noter la translittération de де́лаешь (« diélaïch »).
11. **sortir-007**, Уви́димся ___? comme proposition (plutôt qu'affirmation) avec un remplacement comme на выходны́х : l'intonation montante suffit-elle ?
12. **courses-007**, Всё, спаси́бо plutôt que Э́то всё, спаси́бо.
13. **gouts-007**, Мне э́то не нра́вится : la phrase est-elle trop directe à table ? Faut-il en faire la phrase principale, avec Мне не о́чень ?
14. **Registre de ru-cafe-005 et ru-courses-003** : Мо́жно ка́ртой? n'a pas de marque de vous. J'ai laissé « vous », qui est le registre de la situation : il faut le confirmer.
15. **Convention de translittération** dans son ensemble : la réduction des voyelles atones (о → a, е → i) aide-t-elle vraiment à prononcer, ou trouble-t-elle quand on lit le cyrillique à côté ?

Soit 15 points à faire valider, dont 13 phrases précises.

### Lot 2 (mission 002, 12/11/2026)

Fichiers : `metro.json`, `pharmacie.json`, `presenter.json`, `restaurant.json`, `urgences.json`. Les conventions ci-dessus s'appliquent sans changement.

**Adaptations (une ligne de raison chacune)**

- **metro-001** « la station de métro » → метро́ : Где метро́? est ce qu'on dit, et le `fr` devient « le métro ».
- **metro-005** « Ça va jusqu'à ___ ? » → Идёт до ___? (до + génitif). Corrigé le 12/11 : Э́то до ___? sonnait peu naturel (QA). Le sujet (bus, train) est sous-entendu, comme à l'oral.
- **presenter-001** « informaticien » remplacé par « manager » (ме́неджер) : программи́стка est courant pour une femme, et l'informatique est déjà dans presenter-003.
- **presenter-002** → Кем вы рабо́таете? ; Чем вы занима́етесь? est donné en astuce (plus large, et peut amener une réponse sur les loisirs).
- **presenter-003** « l'informatique » → в айти́ : forme orale. À l'écrit, on voit surtout « в IT », que la synthèse vocale risque de mal lire.
- **restaurant-009** « On paie séparément » → Мо́жно разде́льный счёт? : la demande se fait sur l'addition.
- **restaurant-010** « C'était délicieux » → Всё бы́ло о́чень вку́сно : c'est la formule qu'on dit au serveur.
- **urgences-004** « Aidez-moi ! » → Помоги́те мне, пожа́луйста! et `fr` aligné (« s'il vous plaît ») : sinon la phrase serait identique à urgences-001.
- **urgences-006** « Il y a un blessé ici ! » → Тут ра́неный! Corrigé le 12/11 : Челове́к ра́нен sonnait communiqué (QA). Тут (plus oral que здесь) en fait un cri.
- **urgences-007** « Il y a un accident ici » → Здесь ава́рия : le `fr` est passé au présent le 12/11 pour suivre le russe. Ава́рия vaut pour la route.
- **pharmacie-005** « Je suis allergique à ___ » → У меня́ аллерги́я на ___ (на + accusatif). Les 5 morceaux ne changent pas à l'accusatif (inanimés masculins, neutre, pluriels).
- **presenter-003** : `fr` « dans une banque » (12/11). в ба́нке dit les deux, « une » ou « la ».
- **Variantes** (metro-002, presenter-006) : le format v0 ne porte que `cible` pour m et f. L'accent et la translittération de la forme féminine sont donc dans l'`astuce`.

**À faire valider par un natif** (du doute le plus fort au plus faible)

1. **metro-005**, Идёт до вокза́ла? (remplace Э́то до вокза́ла? le 12/11) : il faut confirmer que la forme sans sujet passe à la porte d'un bus, et si, pour le métro, on dit plutôt Я дое́ду до ___? L'ordre До вокза́ла идёт? me semble aussi naturel, d'où `ordre_libre`.
2. **urgences-006**, Тут ра́неный! (remplace Челове́к ра́нен le 12/11) : il faut confirmer que c'est bien ce que crie un passant et que ça ne sonne pas militaire, face à Есть ра́неные! (proposé par Boris) ou Тут челове́к ра́нен! Il faut aussi vérifier Сюда́! et Челове́ку пло́хо! (en astuce).
3. **urgences-007**, Здесь ава́рия : il faut choisir entre Тут ава́рия, Произошла́ ава́рия ou autre chose au téléphone, et savoir si ава́рия convient hors de la route (sinon несча́стный слу́чай).
4. **presenter-001** : il faut confirmer qu'une femme dit naturellement Я инжене́р, Я бухга́лтер, Я адвока́т, Я ме́неджер, et vérifier la translittération « ménedjer » (е dur des mots d'emprunt) et « boukháltir » (г muet).
5. **pharmacie-006**, la translittération de от devant une consonne sonore (« ad galavnóï », « ad bóli »). Il faut aussi trancher entre от на́сморка et от просту́ды pour « le rhume », et entre от бо́ли в го́рле et от го́рла (plus oral).
6. **restaurant-009**, Мо́жно разде́льный счёт? : il faut le comparer à Посчита́йте отде́льно, пожа́луйста ou à Мы пла́тим отде́льно.
7. **presenter-003**, в айти́ (orthographe, et usage face à в IT) et в образова́нии (naturel, ou в сфе́ре образова́ния ?).
8. **metro-002**, la translittération de заблуди́лся : « -lsia » ou « -lsa » ?
9. **Translittérations** à vérifier : пло́щади (« plóchtchidi », а atone après щ), сле́дующая (« sliédouiouchtchaia »), ста́нция et поли́цию (ц + и noté « tsy »), медици́не (« miditsýni »), без (« biz », et « bis » devant une sourde).
10. **pharmacie-007**, Как э́то принима́ть? : un natif dirait-il plutôt Как его́ принима́ть? quand on lui tend la boîte ?
11. **presenter-004**, Я здесь в о́тпуске : faut-il garder cette phrase en principale, ou Я тут отдыха́ю (en astuce) est-elle plus spontanée ?
12. **ordre_libre** mis sur metro-003, pharmacie-001, pharmacie-002, presenter-002, presenter-007 et presenter-008 : il faut confirmer que l'autre ordre se dit aussi naturellement dans chaque cas.
13. **Registre** de pharmacie-008 (Ну́жен реце́пт?), restaurant-003 et restaurant-009 : il n'y a aucune marque de vous, et j'ai gardé le registre de la situation (comme cafe-005).

Ajoutés aux corrections du 12/11 :

14. **pharmacie-005**, на уку́сы пчёл : il faut savoir si l'on dit plutôt аллерги́я на пчёл, на пчели́ный яд ou на уку́сы насеко́мых. Il faut aussi vérifier на молоко́ face à на лакто́зу, l'ordre naturel (У меня́ аллерги́я на ___ ou На ___ у меня́ аллерги́я), et si la phrase sert vraiment à la pharmacie.
15. **pharmacie-005**, translittérations : глюте́н (« glioutién », т mou ou dur comme dans кафе ?), пеницилли́н (« pinitsylín », ц + и), пчёл (« ptchol »).
16. **pharmacie-005**, astuce « Un mot en -а finit en -у : на клубни́ку » : l'exemple de la fraise est-il une allergie courante, ou faut-il un autre mot en -а ?
17. **metro-005**, la translittération « idiót » d'идёт : elle est juste, mais elle peut faire sourire un francophone. Faut-il la garder ?

## Astuces raccourcies (11/11/2026)

Règle du CEO : une astuce = 2 phrases courtes au plus, et 110 caractères au plus (espaces compris, accents combinants U+0301 comptés).

- **Réécrites (8)** : cafe-002, cafe-005, gouts-002, gouts-004, gouts-005, gouts-006, sortir-010, rencontrer-002. Seule l'idée qui débloque reste (ex. gouts-006 : « Я люблю́ твою́ соба́ку sonne trop fort »).
- **Accent ajouté seulement (9)** : cafe-006, courses-003, gouts-001, gouts-008, sortir-005, sortir-006, sortir-008, rencontrer-003, rencontrer-007. Le russe des astuces porte désormais l'accent sur chaque mot de plus d'une syllabe (remarque QA n° 8). ё n'est pas marqué, il est toujours tonique (Пойдём).
- **Passées à null** : aucune.
- **Vérification** : recherche `"astuce": "[^"]{111,}"` dans `content/ru/` : 0 résultat. La plus longue (cafe-009) fait 99 caractères ; 36 astuces au total.
- **Limite** : à environ 40 caractères par ligne, 110 caractères donnent encore 3 lignes à 360 px. Les astuces de 90 à 99 caractères (cafe-009, rencontrer-007, sortir-001) restent sur 3 lignes.
- **Nouveau point pour le natif** : gouts-006, dire que « Я люблю́ твою́ соба́ку » sonne trop fort est-il juste, ou la phrase passe-t-elle entre amis ?

## Lot 3 (mission 004, 12/11/2026)

Fichiers : `hotel.json`, `telephone.json`, `amis.json`, `banque.json`, `meteo.json` (50 éléments, 10 moules, 50 remplacements). Les conventions ci-dessus s'appliquent sans changement. `variantes` : `null` partout, aucune phrase ne dépend du genre de la personne qui parle.

**Adaptations (une ligne de raison chacune)**

- **hotel-002** « Je reste ___ » → Я здесь ___ (« je suis ici pour… ») : le trou porte la préposition (на одну́ ночь, до суббо́ты). L'astuce de Vera (« sans préposition pour une nuit ») ne vaut pas pour le russe : réécrite (на pour une durée, до pour « jusqu'à »).
- **hotel-006** : astuce réécrite. Après нет, les terminaisons varient (мы́ла, воды́, полоте́нец) : il n'y a pas « une seule règle ». Ajout : la chambre d'hôtel se dit но́мер, pas ко́мната.
- **hotel-010** : Я уезжа́ю (je quitte la ville) ; le mot d'hôtel вы́езд (départ) est mis en astuce.
- **telephone-003** « Vous pouvez épeler » → Скажи́те по бу́квам (impératif poli, réflexe natif, comme rencontrer-002). Le `fr` est gardé.
- **telephone-004** : « Madame Petrova » → Ири́на Петро́вна (prénom + patronyme) : госпожа́ ne se dit pas au téléphone. « La réception » → с администра́тором, la personne qu'on demande.
- **telephone-006** « SMS » → эсэмэ́ска (oral). Écrire « СМС » risquait une mauvaise lecture par la synthèse vocale. Присла́ть évite le doublon avec courses-003 (Мо́жете написа́ть?).
- **telephone-007** et **banque-010** : impératif poli (Говори́те погро́мче / Да́йте чек), le `fr` « Vous pouvez… ? » est gardé.
- **telephone-009** « Ce n'est pas le bon numéro » → Вы оши́блись но́мером (formule figée, plurielle, donc sans genre). Le `fr` devient « Vous vous êtes trompé de numéro. », registre vous (au lieu de neutre). C'est ce qu'on répond à l'appel d'un inconnu.
- **amis-002** « Tiens » → Держи́ (impératif tu).
- **amis-003** « Je peux enlever mes chaussures ? » → Мне разу́ться? (« je me déchausse ? ») : on ne demande pas la permission, on se déchausse presque toujours. `fr` : « J'enlève mes chaussures ? ». La forme distingue aussi la phrase du moule amis-004.
- **amis-004** (arbitrage de Sacha, remplacements loin de cafe-005 et hotel-007) : « prendre un verre d'eau » → « me laver les mains » (l'eau est déjà dans amis-005, et Буты́лку воды́ dans cafe-002) ; « aider » → « goûter » (Мо́жно помо́чь? sonne bancal, un natif dit Тебе́ помо́чь?, mis en astuce).
- **amis-005** : вода́ → во́ду, l'accent bouge (signalé en astuce).
- **amis-007** « Je n'ai plus faim » → Спаси́бо, бо́льше не хочу́ (« je n'en veux plus ») : Я сыт / сыта́ dépend du genre.
- **amis-009** Мне пора́ et **amis-010** бы́ло здо́рово : impersonnels, sans genre. Astuce sur здо́рово / здоро́во (super / salut).
- **banque-005** « avaler » → съел (« a mangé ») : c'est le mot courant.
- **banque-006** « la monnaie de ___ » → У вас бу́дет сда́ча ___? (quand on paie avec un gros billet). La préposition est dans le trou, car с devient со devant ста.
- **banque-008** : astuce de Vera réécrite. Е́вро est invariable ; seuls les dollars changent (до́лларов).
- **meteo-002** : « beau » et « mauvais » → хоро́шая / плоха́я пого́да ; « chaud » → жа́рко (тепло́, « doux », en astuce).
- **meteo-006** : « du soleil » → со́лнечно (adverbe), « du vent » → си́льный ве́тер, `fr` « beaucoup de vent » : За́втра бу́дет ве́тер sonne incomplet.
- **meteo-008** : на у́лице (« dehors ») ajouté, c'est ainsi qu'on demande la température.

**À faire valider par un natif** (du doute le plus fort au plus faible)

1. **banque-006**, У вас бу́дет сда́ча со ста рубле́й? : il faut confirmer que la tournure convient pour tous les montants (100 roubles est petit), si l'on dit с ты́сячи ou с ты́сячи рубле́й, с пяти́ ты́сяч ou с пятиты́сячной, et s'il faut plutôt Мо́жете разменя́ть ___? quand on n'achète rien.
2. **telephone-003**, Скажи́те по бу́квам : faut-il préférer Продикту́йте по бу́квам ? L'astuce dit qu'on épelle avec des prénoms (Б как Бори́с) : l'usage est-il encore courant ?
3. **telephone-006**, эсэмэ́ска : registre (trop familier face à un inconnu ?), et l'usage réel face à Напиши́те мне в Телегра́м / WhatsApp.
4. **amis-006**, За тебя́! pour « À la tienne ! » : convient-il au simple fait de trinquer, ou seulement pour porter un toast à une personne ? Faut-il mettre За нас! ou Бу́дем! en phrase principale ?
5. **hotel-002**, Я здесь на две но́чи : naturel à la réception ? Autres possibilités : Я у вас на две но́чи, Я на две но́чи, Я остановлю́сь на две но́чи.
6. **hotel-001**, У меня́ бронь : бронь (oral) est-il accepté face à un réceptionniste, ou faut-il У меня́ забронирован но́мер ? Avec ou sans есть ?
7. **hotel-004**, паро́ль от вайфа́я : la déclinaison вайфа́я se dit-elle, ou garde-t-on паро́ль от Wi-Fi (invariable) ?
8. **amis-003**, Мне разу́ться? : l'invité dit-il plutôt Разува́ться? ou Мо́жно не разува́ться? (dans le cas inverse) ?
9. **telephone-004** : с администра́тором pour « la réception » (ou с ресе́пшеном ?) ; naturel de Мо́жно поговори́ть с ___? face au très oral Мо́жно Ива́на?
10. **amis-007**, Спаси́бо, бо́льше не хочу́ : assez poli face à l'hôtesse, ou faut-il Спаси́бо, я бо́льше не могу́ / Всё о́чень вку́сно, но… ?
11. **banque-002**, Не прохо́дит ка́рта : ou plutôt Не прохо́дит опла́та ? Et Попро́буйте ещё раз en astuce.
12. **hotel-010**, Я уезжа́ю ou Я выезжа́ю за́втра у́тром ? Et Во ско́лько вы́езд? en astuce.
13. **meteo-006**, mélange adverbe / nom après бу́дет (со́лнечно, дождь, си́льный ве́тер, гроза́) : chaque phrase est-elle naturelle ?
14. **amis-002**, l'astuce sur les fleurs en nombre impair : à confirmer telle quelle.
15. **Translittérations** à vérifier : уезжа́ю (« ouijjáiou »), попо́зже (« papójjy »), съел (« sïel »), ты́сячи (« týssitchi »), пятьдеся́т (« pidissiát »), пятьсо́т (« pitsót »), е́вро (« iévra »), дождь (« docht »), приглаше́ние (« priglachéniie »), эсэмэ́ску (« essemésku »), с дире́ктором (« z diriéktaram », с voisé devant д).
16. **ordre_libre** avec пожа́луйста au milieu ou à la fin (telephone-003, telephone-007, telephone-010, banque-010) : les deux places se disent, d'où `true`. Il faut confirmer, et décider si la règle vaut pour les lots précédents.
17. **Registre** de hotel-001, hotel-007, banque-009 : aucune marque de vous, j'ai gardé le registre de la situation (comme cafe-005).

**Corrections du 12/11 (QA de Boris, retours de Léa, arbitrage de Sacha)**

Adaptations :
- **telephone-004** : la préposition française passe dans le trou (« à Ivan », « au directeur », « au médecin »), `moule.fr` devient « Je peux parler ___ ? ». Parenthèse « (Madame Petrova) » retirée ; l'astuce donne Ири́на Петро́вна comme modèle poli.
- **telephone-007** « Vous pouvez parler plus fort ? » remplacée par « C'est qui ? » → Кто э́то? (phrase la plus faible : même besoin que telephone-002). Погро́мче! passe dans l'astuce de telephone-002.
- **telephone-010** « Notez mon numéro » → « Mon numéro, c'est le… » → Мой но́мер… (registre neutre). Astuce : on dicte par blocs (123-45-67).
- **hotel-006** : « de » passe dans le trou (« d'eau chaude »). Astuce sans déclinaison : но́мер / ко́мната.
- **banque-008** : astuce sans déclinaison (е́вро invariable, enseigne Обме́н валю́т).
- **amis-008** « Tu habites ici depuis longtemps ? » → « Tu veux un coup de main ? » → Тебе́ помо́чь? Aucun doublon avec `rencontrer`. L'astuce d'amis-004, qui donnait déjà Тебе́ помо́чь?, est réécrite (« Pas besoin de я »).
- **meteo-006** : moule « Il va ___ ? » → Бу́дет ___? (дождь, снег, хо́лодно, жа́рко, гроза́). Le moule « Demain, il y aura ___ » sort ; meteo-005 garde за́втра.
- **meteo-010** « On a de la chance avec la météo ! » → « Il fait froid, hein ? » → Хо́лодно, да? J'ai retiré « aujourd'hui » : Сего́дня хо́лодно est déjà un remplacement de meteo-002.

Nouveaux points à faire valider par un natif :
18. **telephone-007**, Кто э́то? au téléphone : trop sec face à un inconnu ? L'astuce propose Извини́те, а кто э́то? ; faut-il plutôt А кто говори́т? ou С кем я говорю́?
19. **telephone-010**, Мой но́мер… : un natif dit-il Мой но́мер… ou Запи́сывайте:… ? Et la dictée par blocs (3-2-2) est-elle bien la norme pour un portable (8-916-…) ?
20. **meteo-006**, Бу́дет дождь? face à Дождь бу́дет? (plus oral ?) et Обеща́ют en réponse (astuce). Бу́дет хо́лодно? / Бу́дет жа́рко? sont-ils naturels sans за́втра ?
21. **meteo-010**, Хо́лодно, да? : naturel pour lancer la conversation, ou plutôt Ну и хо́лод! / Ну и холодры́га! ? QCM : proche de meteo-002 (Сего́дня хо́лодно) et meteo-007 (Мне хо́лодно), à surveiller avec Léa.
22. **amis-008**, Тебе́ помо́чь? : naturel pour proposer d'aider à table ou en cuisine (ou Помо́чь чем-нибудь?) ; Вам помо́чь? pour deux hôtes, à confirmer.
23. **banque-008**, Обме́н валю́т (astuce) ou Обме́н валю́ты sur les enseignes ?

Points devenus caducs : 13 (meteo-006, ancien moule) ; dans le point 16, telephone-007 et telephone-010 ne sont plus concernés (phrases remplacées, sans пожа́луйста).

## Personnage (mission 007, 12/11/2026)

Fichier : `personnage.json` (3 phrases à prénom, 13 métiers m/f, 6 domaines, conversion des prénoms). Conventions inchangées. Le prénom n'est jamais décliné : il est toujours au nominatif (Меня́ зову́т X, Я X).

**À faire valider par un natif** (du doute le plus fort au plus faible)

1. **Prénoms français en cyrillique** : la table de `personnage.json` suit l'usage des médias (Николя́, Жюлье́н, Тома́, accent sur la dernière syllabe). Il faut confirmer : Анн ou А́нна pour Anne, Ками́ль ou Ками́лла pour Camille, Хлоэ́ ou Хло́я pour Chloé, Юго́ ou Гюго́ pour Hugo, Даниэ́ль face à la règle qui donne Даньель, et le double т de Шарло́тт (la règle donne Шарлот).
2. **ru-rencontrer-011**, Я Са́ша. А ты? pour « Moi, c'est Sacha. Et toi ? » : naturel en soirée, ou plutôt Я Са́ша, а тебя́ как зову́т? (en astuce) ?
3. **commercial·e** → ме́неджер по прода́жам : c'est ce qu'on dit, ou plutôt Я в прода́жах / Я продаже́ц (familier) ? La forme est longue pour un A1.
4. **artisan·e du bâtiment** → строи́тель : une femme le dit-elle (sinon Я рабо́таю в строи́тельстве) ? Un artisan dirait-il plutôt ма́стер, отде́лочник ou son métier précis ?
5. **développeuse** → программи́стка : passe-t-il partout, ou une femme dit-elle d'abord Я программи́ст (registre de -ка) ?
6. **enseignante** → учи́тельница, et учи́тель face à преподава́тель pour un enseignant d'adultes (le plus probable chez nos utilisateurs).
7. **Translittération** de медсестра́ (« mitsistrá », д assourdi devant с) et de медбра́т (« midbrát »).
8. **ru-presenter-011**, Меня́ зову́т X, я Y : la virgule seule (sans и) sonne-t-elle naturelle à l'oral ?

## Métiers élargis et dialogues (mission 008, 12/11/2026)

Fichiers : `personnage.json` (43 métiers en 9 catégories, dont 30 nouveaux, champ `categorie`), `dialogues.json` (4 dialogues, 4 nouvelles phrases). Je n'ai pas pu lancer `node` dans cette session : la validité JSON a été relue à la main, à confirmer par un `JSON.parse`. Conventions inchangées.

**À faire valider par un natif** (du doute le plus fort au plus faible)

1. **ru-dialogue-hotel-001**, Да, бронь на имя — Са́ша : « на имя » veut normalement le génitif (на имя Са́ши), mais le prénom reste au nominatif dans le produit. Le tiret et le nominatif passent-ils à l'oral, ou vaut-il mieux Да, меня́ зову́т Са́ша ?
2. **Métier au féminin, forme masculine seule** : une femme dit-elle Я электри́к, Я санте́хник, Я меха́ник, Я касси́р, Я парикма́хер, Я пе́карь, Я флори́ст, Я секрета́рь, Я по́вар, Я води́тель авто́буса, Я курье́р, Я фотогра́ф, Я стомато́лог, Я фармаце́вт, Я библиоте́карь, ou préfère-t-on касси́рша, парикма́херша, секрета́рша (souvent familier ou péjoratif) ?
3. **ка́менщик / ка́менщица** (maçon) : la forme féminine existe, mais est-elle utilisée ? Un maçon dit-il plutôt Я строи́тель ?
4. **физиотерапе́вт** pour « kinésithérapeute » : face à кинезитерапе́вт, массажи́ст, реабилито́лог. Quel mot un natif attend-il pour un soin du dos ou du sport ?
5. **фармаце́вт** : face à прови́зор (pharmacien diplômé) et апте́карь (vieilli).
6. **банки́р** : le mot désigne un dirigeant ou un financier. Un conseiller de banque dit-il bien Я рабо́таю в ба́нке, ou Я банковский рабо́тник ?
7. **воспита́тель / воспита́тельница** pour « éducateur » (spécialisé, de jeunes enfants) : et социа́льный педаго́г pour le social ?
8. **ня́ня** pour un homme, **бармен** pour une femme (ба́рменша), **убо́рщик но́меров** pour « homme de chambre » : sont-ils naturels ? Горничный pour un homme existe-t-il ?
9. **машини́ст по́езда** : une femme dit-elle Я машини́ст (et non машини́стка, qui est la dactylo) ?
10. **социа́льный рабо́тник**, **графи́ческий диза́йнер**, **администра́тор в оте́ле**, **води́тель авто́буса** : longueur et naturel (plus court : диза́йнер, администра́тор).
11. **Dialogue du voisin**, Я живу́ ря́дом (« J'habite à côté ») : ou plutôt Я ваш сосе́д / Я живу́ в сосе́дней кварти́ре ? Добро́ пожа́ловать в наш райо́н ! sonne-t-il trop solennel pour un voisin (ou simplement Добро́ пожа́ловать!) ?
12. **Ах, вы {métier} !** (nominatif sans verbe) avec tous les métiers, y compris менеджер по прода́жам, администра́тор в оте́ле et на пе́нсии (D2, D3 : Ах, вы / О, + métier) : naturel ? Pour « à mon compte » et les domaines, la réplique de remplacement est utilisée (pas de métier).
13. **Café**, Что бу́дете зака́зывать ? face à Что бу́дете ? ; Как бу́дете плати́ть ? face à Чем бу́дете плати́ть ? ou Ка́ртой и́ли нали́чными ?
14. **ru-dialogue-cafe-001**, Нет, спаси́бо, всё : proche de ru-courses-007 (Всё, спаси́бо). Faut-il la garder (réponse à Что́-нибудь ещё ?) ou réutiliser courses-007 ?
15. **Hôtel**, За́втра бу́дете за́втракать ? (« Vous voulez le petit-déjeuner demain ? ») : un réceptionniste dit-il plutôt За́втрак бу́дете ? ou За́втрак включён ? ; Прия́тного пребыва́ния ! comme formule de réception.
16. **Soirée**, Встре́тимся попо́зже в ба́ре ? (« On se retrouve au bar tout à l'heure ? ») et la réponse Да, до ско́рого ! (ou Дава́й, уви́димся !) ; Ого́, ты говори́шь по-ру́сски ? comme réaction.
17. **Translittérations** : farmatséft, fiziatirapiéft, pradafchtchítsa (в devant щ), káminchtchik, oubórchtchik nómiraf, satsyálnyï (ци), machiníst, eliktrík, stamatólak, bibliatiékar, vaspitátilnitsa, dvinátsat (двена́дцать), chtó-nibout ichtchó (что́-нибудь ещё), atsioúda (отсю́да), fstriétimsia.
18. **Rappel Lou/Vera** : Vous / ты des répliques « fausses » de registre (D3, vous au lieu de ты) : le russe est juste, c'est le registre qui est faux.

**Correction du 12/11 (QA de Boris, problème 1)** : le voisin ne donne plus de prénom (Paul / Поль retiré, `role_fr` « Le voisin »), pour qu'un utilisateur prénommé Paul ne se réponde pas à lui-même. Sa réplique devient Здра́вствуйте, я ваш сосе́д. Я живу́ ря́дом.
19. **Dialogue du voisin**, Я ваш сосе́д. Я живу́ ря́дом : un peu redondant (« voisin » et « à côté »). Naturel tel quel, ou plutôt Я ваш сосе́д, живу́ напро́тив / Я из сосе́дней кварти́ры ? Le point 11 reste ouvert. La suite А как вас зову́т ? (sans prénom donné avant) passe-t-elle ? Translittération « sassiét » à vérifier.

## Univers de vocabulaire (mission 012, 12/11/2026)

Fichiers : `univers-lieux.json`, `univers-maison.json`, `univers-nourriture.json`, `univers-couleurs.json`, `univers-famille.json` (10 moules, 50 remplacements). `variantes` : `null` partout. Conventions inchangées.

**Adaptations (une ligne de raison chacune)**

- **lieux-002** : « à côté de » → ря́дом с + **instrumental** (pas le génitif, contrairement au brief) : ря́дом с вокза́лом. Le génitif s'emploie avec о́коло, недалеко́ от.
- **maison-001** : нужен / нужна́ / нужно / нужны́ s'accordent avec la chose. Le modèle liste les 4 formes, la forme est dans chaque remplacement.
- **couleurs-001** : У вас э́то есть в чёрном цве́те? Цвет étant masculin, aucun accord avec le vêtement. Le trou porte l'adjectif au prépositif.
- **couleurs-002** : Мне э́то велико́ (« ça me va trop grand »), au lieu de « слишком + adjectif » qui exigerait un accord avec le vêtement. Велико́, мало́, тесно́ contiennent déjà « trop ». Le `moule.fr` garde « C'est trop ___ ».
- **nourriture-001** : la préposition est dans le trou (с молоко́м, со сли́вками : с devient со). `moule.fr` garde « C'est avec ___ ? ».
- **famille-002** : па́па / ма́ма plutôt qu'оте́ц / мать (plus naturels pour parler de ses parents).
- **Registre** de nourriture-001 et -002 : aucune marque de vous, j'ai gardé le registre du pédagogue (comme cafe-005).
- **Niveau** : lieux-002 et nourriture-002 sont A2 selon Vera, le fichier entier reste noté A1 (le format v0 n'a pas de niveau par phrase).

**À faire valider par un natif** (du doute le plus fort au plus faible)

1. **couleurs-002**, Мне э́то велико́ / мало́ / длинно́ / коротко́ / тесно́ : ces formes courtes sans слишком sont-elles toutes naturelles pour un vêtement ? Longueur : on dirait plutôt длинновато / коротковато. Accent de коротко́ (forme courte) face à ко́ротко (adverbe). мало́ n'est-il pas ambigu (« trop peu ») ?
2. **couleurs-001**, У вас э́то есть в чёрном цве́те? : lourd, un vendeur dit plutôt Есть тако́е в чёрном? ou У вас есть чёрный? Et си́ний / голубо́й pour « bleu ».
3. **lieux-002**, ря́дом с (instrumental) : confirmer, et choisir entre ря́дом с и о́коло. С пло́щадью (une seule place, sans précision), с мэ́рией (ou с администра́цией) : naturels ?
4. **lieux-001**, бу́лочная : mot encore courant, ou пека́рня ? Translittération « boúlachnouiou » (ч prononcé ш dans бу́лочная). Суперма́ркет : accent sur ма́, « soupirmárkit ».
5. **maison-001**, заря́дка pour « chargeur » (ambigu avec la gym du matin) ou заря́дное устро́йство / заря́дник ? Чи́стые простыни́ : accent de простыни́ (pluriel), ou plutôt чи́стое бельё (« draps » dans un hôtel). Полоте́нце : translittération « palatiéntsy ».
6. **maison-002**, Свет не рабо́тает pour « la lumière » (sinon Свет не гори́т, Ла́мпа не рабо́тает). Отопле́ние dans un logement (sinon Батаре́я не гре́ет).
7. **nourriture-002**, В э́том блю́де есть… ? : plus naturel que В э́том есть… ? ou Здесь есть… ? Свини́на, алкого́ль, лук : sert-on le singulier collectif лук pour « des oignons » ?
8. **nourriture-001**, Э́то с … ? avec с + instrumental : forme courte С молоко́м? plus oral ? Со сли́вками : « crème » en café (liquide) ou сметана (crème aigre) selon le contexte.
9. **famille-002**, Мой муж здесь со мной : calque probable, un natif dit plutôt Я здесь с му́жем. À confirmer. Мой па́па / Моя́ ма́ма (adulte qui parle) face à оте́ц / мать.
10. **famille-001**, У меня́ есть дво́е дете́й : « двое » collectif (genitif pluriel) et son niveau pour un A1 ; sinon У меня́ дво́е дете́й sans есть.
11. **ordre_libre** mis sur maison-002 et couleurs-002 (Не рабо́тает душ ; Э́то мне велико́) : à confirmer. Absent de famille-002.
12. **Translittérations** à vérifier : мэ́рией (« mériieï »), музе́ем (« mouziéïm »), пло́щадью (« plóchtchidiou »), больни́цей (« balnítsyï », с devant б → « z »), сли́вками (« slífkami »), моро́женым (« marójynym »), чи́стые (« tchístyïe »), дво́е (« dvóïe »), дете́й (« ditiéï »), рабо́тает (« rabótaït »), цве́те (« tsviéti »), с devant в gardé « s » (ря́дом с вокза́лом).
