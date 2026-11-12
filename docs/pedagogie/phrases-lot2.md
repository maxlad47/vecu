# Phrases du lot 2 (français uniquement)

Auteur : pedagogue. Statut : proposition, à valider par le CEO, puis à traduire par `linguiste-russe`.
Langue cible : russe. Niveau : A1. Mission 002. 5 situations, 49 éléments, dont 11 phrases-moules (pharmacie-005 devenu moule le 12/11). Aucune phrase en commun avec les 47 de `phrases-phase0.md`.
Conventions (registre, genre, astuce, moule, ordre dans la situation) : identiques à `phrases-phase0.md`. Elles ne sont pas répétées ici.

## Ordre d'introduction

Même règle par vagues que la phase 0 : vague 1 = éléments 1 à 3 de chaque situation, vague 2 = 4 à 6, vague 3 = 7 à 10. Rang des situations dans `index.json` : metro (6), pharmacie (7), presenter (8), restaurant (9), urgences (10). Clé de tri inchangée : `(vague, rang de la situation, rang de la phrase)`. Les éléments déjà vus ne bougent pas, seuls les nouveaux s'insèrent.
Urgences est la dernière situation du brief, mais ses 3 premières phrases (Au secours, ambulance, police) arrivent dans la vague 1, donc dès les premiers jours.

---

## 6. Métro et directions (`metro`) : registre vous

Objectif : « Je sais demander mon chemin et prendre les transports. »

| id | Phrase | Registre | Genre | Intention d'astuce |
|---|---|---|---|---|
| ru-metro-001 | **MOULE** « Où est ___ ? » | neutre | non | Une seule forme pour tous les lieux. |
| ru-metro-002 | Je suis perdu. | neutre | **oui en français** (perdu / perdue), et en russe la forme change. Fournir `variantes.m` et `variantes.f`. | |
| ru-metro-003 | Vous pouvez me montrer sur la carte ? | vous | non | |
| ru-metro-004 | Un billet, s'il vous plaît. | vous | non | |
| ru-metro-005 | **MOULE** « Ça va jusqu'à ___ ? » (un bus, un train, un métro) | neutre | non | Après « jusqu'à », le lieu change de terminaison. |
| ru-metro-006 | C'est loin ? | neutre | non | |
| ru-metro-007 | C'est tout droit ? | neutre | non | |
| ru-metro-008 | C'est à gauche ou à droite ? | neutre | non | |
| ru-metro-009 | Quelle est la prochaine station ? | neutre | non | |
| ru-metro-010 | Vous descendez ? (dans une rame ou un bus bondé, pour passer) | vous | non | |

Remplacements :
- **ru-metro-001** « Où est ___ ? » : la station de métro / l'arrêt de bus / la gare / la sortie / le centre-ville
- **ru-metro-005** « Ça va jusqu'à ___ ? » : jusqu'à la gare / jusqu'à l'aéroport / jusqu'au centre-ville / jusqu'à la place Rouge / jusqu'au musée

Choix : 007 et 008 servent à comprendre la réponse autant qu'à poser la question (tout droit, gauche, droite). L'apprenant entend ces mots dans la bouche de l'autre, d'où leur place avant « Quelle est la prochaine station ? ».

## 7. Pharmacie et santé (`pharmacie`) : registre vous

Objectif : « Je sais dire où j'ai mal et demander un médicament simple. »
Règle : phrases courtes et sûres, aucun conseil médical. L'app n'explique ni dosage ni traitement.

| id | Phrase | Registre | Genre | Intention d'astuce |
|---|---|---|---|---|
| ru-pharmacie-001 | Il y a une pharmacie près d'ici ? | neutre | non | |
| ru-pharmacie-002 | Je ne me sens pas bien. | neutre | non en français. Risque en russe : « je suis malade » change selon le genre, d'où le choix de cette tournure neutre. | |
| ru-pharmacie-003 | **MOULE** « J'ai mal ___. » | neutre | non | |
| ru-pharmacie-004 | J'ai besoin d'un médecin. | neutre | non | |
| ru-pharmacie-005 | **MOULE** « Je suis allergique à ___. » | neutre | non | |
| ru-pharmacie-006 | **MOULE** « Vous avez quelque chose contre ___ ? » | vous | non | Pour « contre un mal », un seul petit mot suffit. |
| ru-pharmacie-007 | Comment je le prends ? | neutre | non | |
| ru-pharmacie-008 | Il faut une ordonnance ? | vous | non | |
| ru-pharmacie-009 | J'ai une ordonnance. | neutre | non | |

Remplacements :
- **ru-pharmacie-003** « J'ai mal ___. » : à la tête / au ventre / à la gorge / au dos / aux dents / à l'oreille
- **ru-pharmacie-005** « Je suis allergique à ___. » : aux noix / au lait / à la pénicilline / aux piqûres d'abeille / au gluten
- **ru-pharmacie-006** « Vous avez quelque chose contre ___ ? » : le mal de tête / la toux / le rhume / le mal de gorge / les piqûres de moustique

Choix : 9 phrases seulement. Rien de plus sans tomber dans le conseil médical. 005 est devenu un moule (correction du 12/11, décision de Sacha) : l'apprenant nomme son allergène.

## 8. Se présenter avec son métier (`presenter`) : registre vous

Objectif : « Je sais dire ce que je fais dans la vie et pourquoi je suis là. »
Choix de genre : le moule 001 ne contient que des métiers dont la forme russe est la même pour un homme et une femme. Les métiers qui changent (professeur, étudiant, infirmier) sont écartés du moule ou traités en phrase seule avec variantes. Pas de forme féminine marquée comme « врачиха ».

| id | Phrase | Registre | Genre | Intention d'astuce |
|---|---|---|---|---|
| ru-presenter-001 | **MOULE** « Je suis ___. » (un métier) | neutre | **non**, car remplacements choisis invariables en russe | Le métier se dit sans article. |
| ru-presenter-002 | Vous faites quoi dans la vie ? | vous | non | |
| ru-presenter-003 | **MOULE** « Je travaille dans ___. » | neutre | non | « Dans une banque », « dans la santé » : un lieu ou un domaine, pas un métier. Ça évite de chercher le mot exact. |
| ru-presenter-004 | Je suis ici en vacances. | neutre | non | |
| ru-presenter-005 | Je suis ici pour le travail. | neutre | non | |
| ru-presenter-006 | Je suis étudiant. | neutre | **oui** (étudiant / étudiante). Fournir `variantes.m` et `variantes.f`. | |
| ru-presenter-007 | Je suis ici depuis une semaine. | neutre | non | |
| ru-presenter-008 | C'est la première fois que je viens ici. | neutre | non | |
| ru-presenter-009 | Je travaille à mon compte. | neutre | non en français. En russe, « je suis indépendant » changerait selon le genre : tournure neutre voulue. | |
| ru-presenter-010 | Je suis à la retraite. | neutre | non en français. Même logique : tournure neutre voulue. | |

Remplacements :
- **ru-presenter-001** « Je suis ___. » : ingénieur / médecin / comptable / informaticien / avocat
- **ru-presenter-003** « Je travaille dans ___. » : une banque / l'informatique / la santé / l'éducation / le commerce / le bâtiment

Écartée : « Je m'appelle ___ ». Elle attend toujours le réglage « mon prénom » (voir phase 0). À arbitrer par Sacha (point 1 du relais).

## 9. Au restaurant (`restaurant`) : registre vous

Objectif : « Je sais avoir une table, commander et régler. »
Ne reprend rien du café : « L'addition », « Je peux payer par carte ? », « Je prends ___ » et « ___, s'il vous plaît » servent aussi ici.

| id | Phrase | Registre | Genre | Intention d'astuce |
|---|---|---|---|---|
| ru-restaurant-001 | **MOULE** « Une table pour ___, s'il vous plaît. » | vous | non | |
| ru-restaurant-002 | Le menu, s'il vous plaît. | vous | non | |
| ru-restaurant-003 | On peut commander ? | vous | non | |
| ru-restaurant-004 | C'est quoi, ça ? (en montrant un plat sur la carte) | neutre | non | |
| ru-restaurant-005 | Qu'est-ce que vous recommandez ? | vous | non | |
| ru-restaurant-006 | **MOULE** « Sans ___, s'il vous plaît. » | vous | non | « Sans » se dit avec un petit mot, suivi du nom. |
| ru-restaurant-007 | Je ne mange pas de viande. | neutre | non | |
| ru-restaurant-008 | Il y a une erreur. | neutre | non | |
| ru-restaurant-009 | On paie séparément, s'il vous plaît. | vous | non | |
| ru-restaurant-010 | C'était délicieux. | neutre | non | |

Remplacements :
- **ru-restaurant-001** « Une table pour ___, s'il vous plaît. » : deux personnes / trois personnes / quatre personnes / cinq personnes
- **ru-restaurant-006** « Sans ___, s'il vous plaît. » : sans viande / sans oignons / sans sauce / sans sucre / sans glaçons

Choix : 008 plutôt que « Ce n'est pas ce que j'ai commandé » : le passé russe change selon le genre de celui qui parle. 007 est la forme neutre qui remplace « Je suis végétarien ».

## 10. Urgences (`urgences`)

Objectif : « Je sais appeler à l'aide et expliquer le problème en une phrase. »
Règle : phrases courtes, formules figées, aucune ambiguïté. Registre vous pour les ordres adressés à un inconnu.

| id | Phrase | Registre | Genre | Intention d'astuce |
|---|---|---|---|---|
| ru-urgences-001 | Au secours ! | neutre | non | |
| ru-urgences-002 | Appelez une ambulance ! | vous | non | |
| ru-urgences-003 | Appelez la police ! | vous | non | |
| ru-urgences-004 | Aidez-moi ! | vous | non | |
| ru-urgences-005 | Au feu ! | neutre | non | |
| ru-urgences-006 | Il y a un blessé ici ! | neutre | non | |
| ru-urgences-007 | Il y a un accident ici. | neutre | non | |
| ru-urgences-008 | **MOULE** « On m'a volé ___. » | neutre | non | « On m'a volé » se dit sans sujet en russe : une seule forme pour tous. |
| ru-urgences-009 | **MOULE** « Je ne trouve plus ___. » | neutre | non | |
| ru-urgences-010 | Où est l'hôpital le plus proche ? | neutre | non | |

Remplacements :
- **ru-urgences-008** « On m'a volé ___. » : mon portefeuille / mon téléphone / mon sac / mon passeport / ma carte bancaire
- **ru-urgences-009** « Je ne trouve plus ___. » : mon passeport / mon téléphone / mon portefeuille / mes clés / mon sac

Choix : « J'ai perdu ___ » est écarté : le passé russe change selon le genre. « Je ne trouve plus » est au présent, donc neutre.

---

## Phrases écartées au test du vécu (pour mémoire)

- « Laissez-moi tranquille ! » : utile, mais son ton dépend beaucoup de la situation. À proposer avec une astuce de registre dans une mission ultérieure.
- « Je suis blessé », « Je suis malade » : le russe change selon le genre. Remplacées par « Il y a un blessé ici ! » et « Je ne me sens pas bien ».
- « Je suis végétarien », « Je suis professeur », « Je suis infirmier » : le genre change la forme russe. Remplacées par des tournures neutres ou mises en variantes.
- « Gardez la monnaie » : l'usage du pourboire varie, doute sur la fréquence réelle.
- Numéros d'urgence : pas appris comme phrase. À faire figurer dans une fiche à part, à vérifier avec un natif.

## Paliers

| Situation | Ce que l'apprenant sait faire | Survie minimale (vague 1) |
|---|---|---|
| metro | Je sais demander mon chemin et prendre les transports. | demander où, dire que je suis perdu, faire montrer sur la carte |
| pharmacie | Je sais dire où j'ai mal et demander un médicament simple. | trouver une pharmacie, dire que je vais mal, dire où j'ai mal |
| presenter | Je sais dire ce que je fais et pourquoi je suis là. | dire mon métier, demander le sien, dire mon domaine |
| restaurant | Je sais avoir une table, commander et payer. | demander une table, le menu, commander |
| urgences | Je sais appeler à l'aide. | au secours, ambulance, police |
