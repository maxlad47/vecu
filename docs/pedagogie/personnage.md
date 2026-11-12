# Le personnage : ce qui change côté apprentissage (français uniquement)
Auteur : pedagogue. Statut : proposition, Sacha tranche. Lus : phase 0, lot 2, `presenter.json`, `repetition-espacee.md`. Le lot 3 (autre branche) n'est pas lu : ses phrases sensibles au genre sont à ajouter à la section 3.
Principe : 3 réglages (prénom, genre, métier) ne créent aucun exercice. Ils remplissent des trous existants et fixent des formes. Stockage : `reglages`, où `genre` existe déjà.

## 1. Phrases concernées et mécanisme
- **ru-presenter-001** « Je suis ___ » (moule) : reçoit le métier du personnage.
- **ru-presenter-003** « Je travaille dans ___ » : reçoit un domaine déduit du métier (santé, informatique, éducation, commerce, bâtiment), modifiable.
- **ru-presenter-006, 009, 010** (étudiant·e, à mon compte, à la retraite) : métiers-statuts. Choisis, leur phrase devient « sa phrase ».
- **ru-presenter-002, ru-rencontrer-004** (questions) : appellent sa réponse, rien à changer.
- **Nouveau** : « Je m'appelle ___ », le vide que les lots 1 et 2 avaient écarté.
- Écartée : « Je travaille comme ___ ». En vrai on dit « Je suis… » : double emploi.

Règles :
1. **Remplacement personnel** : le métier du personnage est tiré en premier à la découverte, puis une fois sur deux. Les autres remplacements restent (variété, fausses réponses des QCM). Le moule reste 1 élément, 1 boîte.
2. **Prénom = phrase à variable, pas moule** (un seul remplacement). Sens et Thème portent sur la partie fixe, le prénom n'est jamais la seule différence entre deux options. Pas d'Ordre sur le prénom ; Écoute et À voix haute : oui.
3. **Introduction** : « Je m'appelle ___ » entre en vague 1 de `rencontrer`, après ru-rencontrer-004. Les éléments déjà vus ne bougent pas.

## 2. Métiers de la V1 : 13
Critère du vécu : (a) un adulte l'annonce en une phrase pendant ses 30 premiers jours, (b) on le lui demande (« Vous faites quoi dans la vie ? »), (c) il se dit court, sans périphrase.
- **Déjà traduits (5)** : ingénieur, médecin, comptable, manager, avocat.
- **Statuts déjà traduits (3)** : étudiant·e, à mon compte, retraité·e.
- **À traduire (5)** : infirmier·ère, enseignant·e, développeur·se, commercial·e, artisan·e du bâtiment.
- Liste courte volontairement : un métier de plus = une traduction à faire relire par un natif.
- **Métiers libres en V1 : 0.** Un métier tapé n'a pas de traduction fiable hors ligne et ne serait pas relu (règle 7). Repli « Autre » : l'utilisateur choisit un des 6 domaines de ru-presenter-003.
- La liste s'allonge selon les retours de test, par lots relus.

## 3. Phrases sensibles au genre
Règle maintenue : forme neutre en russe quand elle existe (choix des lots 1 et 2). Le genre du personnage ne règle que le reste.
- **Avec variantes m/f** : ru-metro-002 (perdu·e), ru-presenter-006 (étudiant·e), les nouveaux métiers marqués ·e.
- **Neutres voulues** (genre sans effet en russe) : ru-rencontrer-005, ru-sortir-008, ru-sortir-010, ru-pharmacie-002, ru-presenter-009, 010.
- **Le français s'accorde aussi** : « Je suis perdue », « Enchantée » doivent s'afficher au féminin. Le format v0 ne porte les variantes que pour la cible : à prévoir côté `fr` (Kostia, Nadia).
- **Premier passage** : le genre est demandé une fois, à la création du personnage, plus jamais devant une phrase. Le défaut silencieux « m » est à supprimer : il enseignerait une forme fausse à une utilisatrice.
- Libellé conseillé : « Je parle au masculin / au féminin » (l'utilisateur apprend les formes qu'il dira lui-même).
- S'il ne veut pas choisir : formes neutres partout ; sur les rares phrases à variantes, la question se pose à ce moment-là, une fois.

## 4. Répétition espacée : presque rien ne change
- Boîtes et ids inchangés. Changer prénom, genre ou métier n'efface rien.
- Nouveau métier : première apparition en Découverte (non notée), puis tirage prioritaire. Le moule garde sa boîte (le mécanisme est déjà su).
- Un changement de genre ne rend aucune phrase « due » (une terminaison d'écart). Les variantes m/f ne comptent pas comme deux éléments.
- La « carte de visite » (section 5, n° 3) est un élément normal, introduit en vague 3, quand ses deux morceaux sont vus.

## 5. Trois phrases nouvelles
| id proposé | Phrase | Registre | Genre |
|---|---|---|---|
| ru-rencontrer-010 | Je m'appelle ___. (prénom) | neutre | non |
| ru-rencontrer-011 | Moi, c'est ___. Et toi ? (prénom) | tu (soirée, amis) | non |
| ru-presenter-011 | Je m'appelle ___, je suis ___. (prénom, métier) | neutre | oui, réglé par le genre |

La n° 3 est la « carte de visite » : 100 % générée par les réglages, la phrase la plus dite.

## Pour Nadia (quand Sacha aura tranché)
Traduire les 3 phrases ci-dessus (variables), les 5 métiers « à traduire » (variantes m/f si le genre change). Question ouverte : le prénom saisi en lettres latines, conversion par règle ou écriture à choisir ? À voir avec Kostia (la voix de l'appareil lira-t-elle un prénom latin ?).

## À arbitrer par Sacha
1. Supprimer le genre « m » par défaut ? 2. 0 métier libre en V1, repli « Autre » ? 3. Hors demande : 4e réglage « d'où je viens » (ru-rencontrer-006) et « pourquoi je suis ici » (ru-presenter-004, 005).
