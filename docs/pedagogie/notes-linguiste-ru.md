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
