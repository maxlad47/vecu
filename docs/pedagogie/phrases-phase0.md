# Phrases de la phase 0 (français uniquement)

Auteur : pedagogue. Statut : proposition, à valider par le CEO, puis à traduire par `linguiste-russe`.
Langue cible : russe. Niveau : A1 (grand débutant). 5 situations, 47 éléments, dont 10 phrases-moules.

## Conventions

- **Élément** = une phrase ou un moule. Chaque élément a un id et une boîte de répétition qui lui est propre (voir `repetition-espacee.md`). Un moule compte pour 1 élément.
- **Registre attendu** : la forme que le linguiste doit choisir si la phrase russe change entre tu et vous. `vous` = on parle à un inconnu (serveur, vendeur). `tu` = on parle à un ami ou à quelqu'un de son âge rencontré dans un cadre détendu. `neutre` = la phrase ne s'adresse à personne en particulier.
- **Genre** : signalé quand la phrase risque de changer selon le genre de la personne qui parle. Consigne au linguiste : **choisir une forme neutre en russe quand elle existe et sonne naturelle**. Sinon, fournir `variantes.m` et `variantes.f`.
- **Astuce** : une intention en français. Le linguiste rédige le texte final (2 lignes maximum).
- **Moule** : le texte d'une occurrence = le modèle où `___` est remplacé par le remplacement, tel quel. Les remplacements sont écrits avec leur article et leur majuscule s'ils ouvrent la phrase.
- **Ordre dans chaque situation** = ordre d'urgence = ordre d'introduction à l'intérieur de la situation.
- Les phrases demandées par Max sont marquées **(Max)**.

## Ordre global d'introduction (par vagues)

Les éléments ne sont pas introduits situation par situation, mais par **vagues**, pour que les phrases de survie de chaque situation arrivent tôt (« Je ne comprends pas » ne doit pas attendre la 44e place).

- Vague 1 = éléments 1 à 3 de chaque situation, dans l'ordre cafe, courses, gouts, sortir, rencontrer.
- Vague 2 = éléments 4 à 6 de chaque situation, même ordre.
- Vague 3 = éléments 7 à 10 de chaque situation, même ordre.

Clé de tri à coder : `(vague, rang de la situation dans index.json, rang de la phrase dans la situation)`.

| Rang | Élément | Rang | Élément | Rang | Élément |
|---|---|---|---|---|---|
| 1 | ru-cafe-001 | 17 | ru-cafe-005 | 33 | ru-cafe-009 |
| 2 | ru-cafe-002 (moule) | 18 | ru-cafe-006 | 34 | ru-cafe-010 |
| 3 | ru-cafe-003 | 19 | ru-courses-004 | 35 | ru-courses-007 |
| 4 | ru-courses-001 | 20 | ru-courses-005 (moule) | 36 | ru-courses-008 |
| 5 | ru-courses-002 (moule) | 21 | ru-courses-006 | 37 | ru-courses-009 |
| 6 | ru-courses-003 | 22 | ru-gouts-004 (moule) | 38 | ru-gouts-007 |
| 7 | ru-gouts-001 | 23 | ru-gouts-005 | 39 | ru-gouts-008 |
| 8 | ru-gouts-002 (moule) | 24 | ru-gouts-006 | 40 | ru-gouts-009 |
| 9 | ru-gouts-003 | 25 | ru-sortir-004 | 41 | ru-sortir-007 (moule) |
| 10 | ru-sortir-001 | 26 | ru-sortir-005 | 42 | ru-sortir-008 |
| 11 | ru-sortir-002 (moule) | 27 | ru-sortir-006 | 43 | ru-sortir-009 |
| 12 | ru-sortir-003 | 28 | ru-rencontrer-004 | 44 | ru-sortir-010 |
| 13 | ru-rencontrer-001 | 29 | ru-rencontrer-005 | 45 | ru-rencontrer-007 (moule) |
| 14 | ru-rencontrer-002 | 30 | ru-rencontrer-006 (moule) | 46 | ru-rencontrer-008 |
| 15 | ru-rencontrer-003 | 31 | ru-cafe-007 (moule) | 47 | ru-rencontrer-009 |
| 16 | ru-cafe-004 | 32 | ru-cafe-008 | | |

À 3 nouveaux éléments par session de 5 min et une session par jour, la vague 1 (toute la survie) est vue en 5 jours, tout le contenu en 16 jours.

---

## 1. Au café (`cafe`) : registre vous

Objectif : « Je sais commander et payer au café. »

| id | Phrase | Registre | Genre | Intention d'astuce |
|---|---|---|---|---|
| ru-cafe-001 | Bonjour. | vous | non | |
| ru-cafe-002 | **MOULE** « ___, s'il vous plaît. » | vous | non | Pour commander, le nom de la chose suivi de « s'il vous plaît » suffit : pas besoin de verbe. |
| ru-cafe-003 | Merci. | neutre | non | |
| ru-cafe-004 | L'addition, s'il vous plaît. | vous | non | |
| ru-cafe-005 | Je peux payer par carte ? | vous | non | « Est-ce que je peux… ? » se dit avec un seul petit mot, qui sert partout. Dit seul, il veut dire « Je peux ? ». |
| ru-cafe-006 | Où sont les toilettes ? | neutre | non | |
| ru-cafe-007 | **MOULE** « Vous avez ___ ? » | vous | non | |
| ru-cafe-008 | À emporter, s'il vous plaît. | vous | non | |
| ru-cafe-009 | C'est libre ? (une table, une chaise) | neutre | non | |
| ru-cafe-010 | Au revoir. | vous | non | |

Remplacements :
- **ru-cafe-002** « ___, s'il vous plaît. » : Un café / Un thé / Un cappuccino / Une bouteille d'eau / Une bière / Un jus d'orange
- **ru-cafe-007** « Vous avez ___ ? » : du lait / du sucre / le wifi / un menu en anglais / des desserts

Note au linguiste : pour ru-cafe-002, garder des formes que l'apprenant peut répéter telles quelles. Si un remplacement change de terminaison, il s'apprend en bloc, sans commentaire.

## 2. Faire les courses (`courses`) : registre vous

Objectif : « Je sais acheter, demander un prix et me débrouiller quand je ne comprends pas le prix. »

| id | Phrase | Registre | Genre | Intention d'astuce |
|---|---|---|---|---|
| ru-courses-001 | Combien ça coûte ? **(Max)** | neutre | non | |
| ru-courses-002 | **MOULE** « Je prends ___. » | neutre | non | |
| ru-courses-003 | Vous pouvez l'écrire ? (le prix, quand on ne comprend pas le nombre) | vous | non | |
| ru-courses-004 | Excusez-moi. (pour interpeller un vendeur) | vous | non | |
| ru-courses-005 | **MOULE** « Combien coûte ___ ? » | neutre | non | Avec un pluriel (les pommes), seul le verbe change. Le reste de la phrase ne bouge pas. |
| ru-courses-006 | Non, merci. | neutre | non | |
| ru-courses-007 | C'est tout, merci. | neutre | non | |
| ru-courses-008 | Je regarde seulement. | neutre | non | |
| ru-courses-009 | C'est trop cher. | neutre | non | |

Remplacements :
- **ru-courses-002** « Je prends ___. » : ça / deux / un kilo / du pain / de l'eau
- **ru-courses-005** « Combien coûte ___ ? » : le pain / le lait / l'eau / le fromage / les pommes

Choix : « Je prends ___ » plutôt que « Je voudrais ___ », parce que « je voudrais » change selon le genre en russe, alors que « je prends » se dit pareil pour tous.

## 3. Ce que j'aime (`gouts`)

Objectif : « Je sais dire ce que j'aime et demander ce que l'autre aime. »
Les deux moules ont le même modèle français, mais deux constructions russes différentes. C'est précisément ce que l'astuce débloque. À l'écran, on distingue « J'aime ___ (une chose) » et « J'aime ___ (faire) ».

| id | Phrase | Registre | Genre | Intention d'astuce |
|---|---|---|---|---|
| ru-gouts-001 | C'est très bon ! (à table) | neutre | non | |
| ru-gouts-002 | **MOULE** « J'aime ___. » (une chose que je découvre) | neutre | non | Aimer une chose : нравится + la chose, mot à mot « elle me plaît ». |
| ru-gouts-003 | Et toi ? | tu | non | ты pour un ami, вы pour un inconnu ou pour plusieurs personnes. |
| ru-gouts-004 | **MOULE** « J'aime ___. » (faire quelque chose) | neutre | non | Aimer faire : люблю + le verbe à l'infinitif. |
| ru-gouts-005 | J'aime me promener le soir. **(Max)** | neutre | non | |
| ru-gouts-006 | J'aime ton chien. **(Max)** | tu | non | |
| ru-gouts-007 | Je n'aime pas ça. (un plat) | neutre | non | |
| ru-gouts-008 | Qu'est-ce que tu aimes faire ? | tu | non | |
| ru-gouts-009 | C'est très beau ! (un lieu, une vue) | neutre | non | |

Remplacements :
- **ru-gouts-002** « J'aime ___. » (une chose) : cette ville / ce quartier / la cuisine russe / le métro / ce café
- **ru-gouts-004** « J'aime ___. » (faire) : voyager / lire / cuisiner / faire du sport / regarder des films

Les remplacements ne reprennent pas les phrases de Max (« me promener le soir », « ton chien »), pour qu'aucune occurrence de moule ne soit identique à une phrase seule dans les QCM.

## 4. Sortir (`sortir`) : registre tu

Objectif : « Je sais proposer une sortie, fixer l'heure et accepter ou refuser. »

| id | Phrase | Registre | Genre | Intention d'astuce |
|---|---|---|---|---|
| ru-sortir-001 | D'accord ! | neutre | non | |
| ru-sortir-002 | **MOULE** « On va ___ ? » (proposer) | tu | non | Pour proposer « on y va ? », une seule forme sert pour tous les lieux. |
| ru-sortir-003 | À quelle heure ? | neutre | non | |
| ru-sortir-004 | Avec plaisir ! | neutre | non | |
| ru-sortir-005 | Tu fais quoi ce soir ? | tu | non | |
| ru-sortir-006 | Je vais aller au foot. **(Max)** | neutre | non | |
| ru-sortir-007 | **MOULE** « On se voit ___ ? » | tu | non | |
| ru-sortir-008 | Désolé, je ne peux pas. | tu | **oui en français** (désolé / désolée). Risque en russe : préférer la forme neutre « excuse-moi ». | |
| ru-sortir-009 | On se retrouve où ? | tu | non | |
| ru-sortir-010 | Je suis en retard. | neutre | **risque** : la forme au passé change selon le genre, préférer la forme au présent, qui est neutre. | |

Remplacements :
- **ru-sortir-002** « On va ___ ? » : au cinéma / au restaurant / au bar / au parc / au musée
- **ru-sortir-007** « On se voit ___ ? » : ce soir / demain / samedi / ce week-end / après le travail

**Sens de « Je vais aller au foot » : aller voir un match** (au stade ou au bar), pas y jouer. Pourquoi : un adulte qui vient d'arriver se fait plus souvent inviter à regarder un match qu'à rejoindre une équipe, et la formule russe la plus naturelle et la plus courte pour « aller au foot » désigne justement le fait d'aller voir le match. Le sens « y jouer » viendra en phase 1 avec un moule « Je joue au ___ ». ru-sortir-006 arrive juste après « Tu fais quoi ce soir ? », dont elle est une réponse.

Phrase écartée : « Tu es libre ce soir ? ». En russe, elle change selon le genre de la personne à qui l'on parle, et le format v0 ne gère que le genre de celui qui parle. « Tu fais quoi ce soir ? » dit la même chose sans ce problème.

## 5. Rencontrer quelqu'un (`rencontrer`) : registre vous

Objectif : « Je sais me présenter, dire d'où je viens et dire que je ne comprends pas. »
Registre vous : en Russie, on vouvoie un adulte qu'on rencontre pour la première fois.

| id | Phrase | Registre | Genre | Intention d'astuce |
|---|---|---|---|---|
| ru-rencontrer-001 | Je ne comprends pas. | neutre | non | |
| ru-rencontrer-002 | Vous pouvez répéter, s'il vous plaît ? | vous | non | |
| ru-rencontrer-003 | Plus lentement, s'il vous plaît. | vous | non | |
| ru-rencontrer-004 | Comment vous appelez-vous ? | vous | non | |
| ru-rencontrer-005 | Enchanté. | neutre | **oui en français** (enchanté / enchantée). Risque en russe : il existe une forme neutre courante, à préférer. Sinon, variantes m/f. | |
| ru-rencontrer-006 | **MOULE** « Je viens ___. » | neutre | non | Après « de », le nom du pays change de terminaison : apprends-le en bloc. |
| ru-rencontrer-007 | **MOULE** « Vous parlez ___ ? » | vous | non | |
| ru-rencontrer-008 | Je parle un peu russe. | neutre | non | |
| ru-rencontrer-009 | Et vous ? | vous | non | |

Remplacements :
- **ru-rencontrer-006** « Je viens ___. » : de France / de Paris / de Belgique / de Suisse / du Canada
- **ru-rencontrer-007** « Vous parlez ___ ? » : anglais / français / espagnol / allemand / italien

Phrase écartée pour la phase 0 : « Je m'appelle ___ ». Elle est indispensable, mais son seul vrai remplacement est le prénom de l'utilisateur, que l'app ne connaît pas. À reprendre en phase 1 avec un réglage « mon prénom ».

---

## Phrases écartées au test du vécu (pour mémoire)

- « Je voudrais ___ » : elle est remplacée par « Je prends ___ » et « ___, s'il vous plaît », qui servent autant et évitent le genre.
- « Je suis français / française » : elle exclut les francophones non français. « Je viens ___ » couvre tout le monde.
- « Tu veux venir ? », « Je préfère le thé », « Il fait beau » : elles servent moins que celles retenues dans le même créneau.

## Paliers de la phase 0 (tous alignés A1 en coulisse)

Une situation est **maîtrisée** quand tous ses éléments sont acquis (boîte 4 ou plus). L'écran Progression affiche « X / N acquises » par situation.

| Situation | Ce que l'apprenant sait faire | Survie minimale (vague 1) |
|---|---|---|
| cafe | Je sais commander et payer au café. | saluer, commander, remercier |
| courses | Je sais acheter et demander un prix. | demander le prix, prendre, faire écrire le prix |
| gouts | Je sais dire ce que j'aime. | complimenter un plat, dire ce qui me plaît, renvoyer la question |
| sortir | Je sais proposer une sortie et répondre. | accepter, proposer, demander l'heure |
| rencontrer | Je sais me présenter et dire que je ne comprends pas. | ne pas comprendre, faire répéter, faire ralentir |
