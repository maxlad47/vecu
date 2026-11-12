# Thèmes de vocabulaire (français uniquement)

Auteur : pedagogue (Vera), mission 012. Statut : brouillon, à valider par le CEO, puis à traduire par `linguiste-russe` (Nadia). Niveau : A1, sauf mention. Fonction n° 3 de D28.

Règle de base : un thème n'existe que dans les phrases-moules. Il n'y a ni liste, ni carte « vocabulaire », ni écran de mots. Chaque thème = 2 moules, 5 remplacements par moule, soit 8 à 10 mots utiles.

## 0. Nom du thème

Le mot « thème » est déjà pris dans l'app : c'est le type d'exercice Thème (`regles-session.md` §3), et `docs/etat.md` parle aussi de « choix des thèmes » pour le parcours d'accueil. Ce document dit « thème de vocabulaire ». Proposition : garder « thème de vocabulaire » dans les fichiers et, à l'écran, un autre mot (« univers » ?). À trancher par Sacha avant Lou.

## 1. Les 5 thèmes, dans l'ordre d'entrée

Choix : chaque thème sert dans les 30 premiers jours sur place, et ne double pas une situation existante. « Transports » est écarté : les lieux et la ligne de métro sont déjà dans `metro`, et « Où est ___ ? » est déjà le moule ru-metro-001.

| Rang | Thème | Id de préfixe | Ce que la personne peut faire |
|---|---|---|---|
| 1 | Lieux de la ville | `lieux` | demander son chemin, savoir où aller |
| 2 | Maison et logement | `maison` | réclamer ce qui manque, signaler une panne |
| 3 | Nourriture et boissons | `nourriture` | demander ce qu'il y a dans un plat, préciser sa commande |
| 4 | Couleurs et taille | `couleurs` | acheter un vêtement, dire que ça ne va pas |
| 5 | Famille | `famille` | dire qui on a, qui est là avec soi |

## 2. Les moules (10 moules, 50 remplacements)

Registre et genre : pour les 10 moules, le genre de la personne qui parle ne change aucune phrase. Le genre compte seulement dans les remplacements (un / une, mon / ma), et il est déjà écrit en français dans chaque remplacement. Pas de `variantes_fr` à prévoir. Côté russe, l'accord se fait avec le nom, pas avec la personne qui parle (à traiter par Nadia).

### 2.1 Lieux de la ville (`lieux`)

- **ru-lieux-001** · neutre · A1 · **Je cherche ___.** Remplacements : la poste / la banque / la boulangerie / le supermarché / le marché.
- **ru-lieux-002** · neutre · A2 (cas du lieu après « à côté de ») · **C'est à côté de ___ ?** Remplacements : la gare / la mairie / le musée / la place / l'hôpital.

### 2.2 Maison et logement (`maison`)

- **ru-maison-001** · neutre · A1 · **Il me faut ___.** Remplacements : un chargeur / du savon / une serviette / des draps propres / une couverture.
- **ru-maison-002** · neutre · A1 · **___ ne marche pas.** Remplacements : Le chauffage / La douche / La lumière / Le wi-fi / La télé.

### 2.3 Nourriture et boissons (`nourriture`)

- **ru-nourriture-001** · vous (au café, au restaurant) · A1 · **C'est avec ___ ?** Remplacements : du lait / du sucre / de la crème / du citron / de la glace.
- **ru-nourriture-002** · vous · A2 (partitif et « dans ce plat ») · **Il y a ___ dans ce plat ?** Remplacements : du porc / de l'alcool / du fromage / des oignons / des noix.

### 2.4 Couleurs et taille (`couleurs`)

- **ru-couleurs-001** · vous (vendeur) · A1 · **Vous l'avez en ___ ?** Remplacements : noir / blanc / rouge / bleu / vert.
- **ru-couleurs-002** · neutre · A1 · **C'est trop ___.** Remplacements : grand / petit / long / court / serré.

### 2.5 Famille (`famille`)

- **ru-famille-001** · neutre · A1 · **J'ai ___.** Remplacements : un frère / une sœur / deux enfants / un fils / une fille.
- **ru-famille-002** · neutre · A1 · **___ est ici avec moi.** Remplacements : Mon mari / Ma femme / Mon père / Ma mère / Mon fils.

Remarques pour Nadia :
- « Vous l'avez en ___ ? » : le « l' » vaut pour un vêtement masculin ou féminin. Ne pas le marquer par genre.
- « C'est trop ___. » : les adjectifs s'emploient seuls, sans accord visible en français. Le russe accorde avec le vêtement.
- « Il me faut ___. » : chaque remplacement porte son article (d'un, de, d'une, des). Le texte complet reste celui de la phrase accordée.

## 3. Ordre d'apparition

Un moule de thème entre dans la file des nouveaux quand l'apprenant a introduit un certain nombre d'éléments de situations (phase 0, lot 2, et lot 3 une fois validé ; les éléments de thème ne comptent pas). Ce compteur s'appelle `introduitsSituations`.

| Ordre | Moule | Entre quand `introduitsSituations` ≥ |
|---|---|---|
| 1 | ru-lieux-001 | 10 |
| 2 | ru-lieux-002 | 20 |
| 3 | ru-maison-001 | 15 |
| 4 | ru-maison-002 | 25 |
| 5 | ru-nourriture-001 | 20 |
| 6 | ru-nourriture-002 | 30 |
| 7 | ru-couleurs-001 | 25 |
| 8 | ru-couleurs-002 | 35 |
| 9 | ru-famille-001 | 30 |
| 10 | ru-famille-002 | 40 |

Lecture : les premiers éléments de situations (la vague 1 de chaque lot, 3 par situation) passent d'abord, comme le veut la survie. Au rythme de 3 nouveaux par jour, les 10 moules sont en place vers le 14e jour.

## 4. Règles d'intégration aux sessions

Proposition de section 10 à ajouter à `docs/pedagogie/regles-session.md`, sans modifier les sections 0 à 9.

- **R1 (seuil).** Un moule de thème entre seulement quand son seuil du tableau §3 est atteint, et une seule fois dans la file (il suit ensuite les boîtes, comme tout élément).
- **R2 (fréquence).** Au plus 1 nouvel élément de thème par session de 5 min, au plus 2 par session de 15 ou 30 min. En 2 min : aucun, le quota de 1 nouveau est réservé à la survie.
- **R3 (mélange).** Un nouvel élément de thème prend la place du prochain nouvel élément de situation. N (section 2) ne change pas. Le bonus de nouveautés (§5.6) ne sert pas aux thèmes.
- **R4 (ordre).** Entre les thèmes, l'ordre du tableau §3 ; au sein d'un thème, le moule 1 avant le moule 2.
- **R5 (révision).** Un moule de thème se révise selon sa boîte, avec les mêmes types que les autres moules (Moule-sens ou Moule-thème, Boucle rappel en Voiture). Aucune règle nouvelle.
- **R6 (remplacements).** Rotation de remplacements (§4.4) sans changement : un remplacement par carte, sans répétition immédiate.
- **R7 (leurres).** Rien à changer en §7 : les moules ne servent pas aux QCM Sens, Thème ou Ordre, donc leurres = autres remplacements du même moule.
- **R8 (parcours d'accueil).** L'étape « thèmes » existante reçoit un seul choix supplémentaire : « Inclure les thèmes de vocabulaire » (oui par défaut ; décision de Sacha). Pas de choix par thème en v1.
- **R9 (interdits).** Aucune liste de mots à l'écran, aucune carte qui ne contient qu'un mot. Un thème se voit uniquement dans une phrase.

## 5. Vérification du test du vécu

Les 10 moules ont été choisis pour être dits dans les 30 premiers jours sur place : demander un article, dire qu'il manque quelque chose, savoir ce qu'il y a dans un plat, acheter un vêtement, présenter sa famille. Les 50 remplacements (10 moules × 5) sont des phrases qui se disent vraiment ; aucune n'est reprise d'un manuel ou d'une appli (règle 8). Le test reste à faire par Max : c'est lui qui dira si « Ma femme est ici avec moi » sert.

## 6. Doublons à surveiller

- « le wi-fi » : déjà dans ru-cafe-007 (« Vous avez ___ ? »). Accepté : le thème renforce le mot dans une autre phrase.
- « des noix » : proche de l'allergie (ru-pharmacie-005). Accepté, phrase différente.
- « du fromage » : proche de ru-courses-005 (« Combien coûte ___ ? »). Accepté.
- « Où est ___ ? » (ru-metro-001) n'est pas repris : c'est le moule de la situation métro.

## 7. Backlog de thèmes suivants (pour après la mission 012)

1. Corps et santé (pharmacie) : « J'ai mal ___ » existe déjà, le thème ajoute les symptômes isolés.
2. Heures et jours : « Ça ouvre à ___ ? », « On se voit ___ ».
3. Argent et paiement : prolonge la banque du lot 3.

## 8. Points ouverts pour Sacha

- Le nom « thème » (§0).
- Le seuil du §3 est une estimation : il dépend du rythme de Max (3 nouveaux par session de 5 min).
- Le parcours d'accueil (étape « thèmes ») n'a pas été relu : je n'ai pas lu `app/`, selon ma liste de lecture. Vérifier R8 avec Kostia.
