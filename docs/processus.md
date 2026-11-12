# Processus de l'équipe

Comment l'équipe travaille, mission après mission. Ce document complète `CLAUDE.md` et s'impose à tous. Décision D13 du 12/11/2026.

## 1. Qui fait quoi, avec quel modèle

| Qui | Rôle | Modèle | Pourquoi ce modèle |
|---|---|---|---|
| Max | Fondateur : vision, budget, mises en ligne, test réel | — | — |
| Sacha | CEO : cadre, découpe, arbitre, valide | Opus (session principale) | Chaque arbitrage engage toute l'équipe |
| Vera | Pédagogue : quoi apprendre, dans quel ordre, comment réviser | Haiku (décision de Max, 12/11) | Modèle économe : Sacha peut surclasser sur une tâche précise. |
| Nadia | Linguiste russe : un russe juste et naturel | Sonnet (décision de Max, 12/11) | Bon russe pour un coût raisonnable. Les doutes vont à la relecture par un natif (règle 7). Sacha peut surclasser sur un point précis. |
| Lou | Designer : écrans, textes de l'interface, accessibilité | Haiku (décision de Max, 12/11) | Modèle économe : Sacha peut surclasser sur une tâche précise. |
| Kostia | Développeur : l'app et ses tests automatiques | Sonnet par défaut, Opus sur décision de Sacha (Max veut Sonnet pour le code) | Sonnet code très bien. Opus pour l'architecture ou un bug qui résiste. |
| Boris | Testeur QA : vérifie, ne corrige pas | Sonnet (décision de Max, 12/11) | Scénarios de test et lecture de code. Il reste sur Sonnet et son périmètre est borné (voir plus bas). |
| ~~Léa~~ | Retirée (D21, 12/11/2026) : une testeuse simulée biaise la mesure cherchée. L'avis d'usage vient de Max, puis des 5 testeurs réels. | — | — |

Règle de surclassement : Sacha peut lancer n'importe quel agent sur un modèle plus puissant pour une tâche précise, et le note dans le relais. On ne change pas le modèle par défaut sans décision au journal.

## 2. Le cycle d'une mission

```
Max : une idée ou un retour
  └─ Sacha : brief (docs/missions/NNN-nom/brief.md, d'après _modele-brief.md)
       ├─ Vera : pédagogie ─┐
       └─ Lou : design ─────┤   (en parallèle)
                            └─ Nadia : contenu russe (à partir du relais de Vera)
                                 └─ Kostia : construction (à partir des relais de Vera, Lou et Nadia)
                                      └─ Boris : vérification ──► Kostia corrige si besoin ──► Boris contre-vérifie
                                           └─ Sacha : validation, journal, état ──► Max teste (puis les testeurs réels)
```

Une mission n'appelle que les agents dont elle a besoin. Une mission « 5 nouvelles situations » va de Vera à Nadia, puis à Boris (contrôle du contenu) : ni Lou ni Kostia. Le brief dit qui intervient.

## 2 bis. Le rythme constant, en 3 commandes

Dans Claude Code, Max pilote tout le projet avec trois commandes, toujours les mêmes :

| Quand | Commande | Ce que fait Sacha |
|---|---|---|
| En début de session | `/point` | Lit l'état et la feuille de route, dit où on en est, ce qui attend Max, et la prochaine mission recommandée. Ne lance rien. |
| Pour avancer | `/mission <nom>` | Écrit le brief, fait travailler les agents dans l'ordre, met l'état à jour après chaque étape. |
| Après une interruption | `/mission reprise` | Reprend à l'étape notée dans `etat.md`, sans rien refaire. |
| En fin de mission | `/cloture` | Vérifie que tout est terminé, met à jour l'état, le journal et la feuille de route, sauvegarde, et résume pour Max. |

Et à la fin de chaque phase, une **revue de phase** avec Max : bilan, revue des outils (D12) et feuille de route de la phase suivante.

## 3. Les 4 règles anti-doublon

1. **`docs/etat.md` est le registre unique.** Il dit ce qui existe, où, et dans quel état (à faire, livré, validé, à revoir). Chaque agent le lit **en premier**. Ce qui est « validé » ne se refait pas : on le complète ou on le corrige.
2. **On lit avant d'écrire.** Avant de créer un fichier, on vérifie qu'il n'existe pas déjà (via `etat.md`). On modifie un fichier existant par petites retouches, jamais en le réécrivant entièrement.
3. **On ne lit que sa fiche de lecture.** Chaque agent a, dans sa fiche, la liste des fichiers qu'il doit lire. Il ne parcourt pas tout le dépôt. Moins de lecture, c'est moins de consommation et moins de confusion.
4. **On passe le relais par écrit.** Chaque agent termine par un fichier de relais (format ci-dessous). Le suivant lit ce relais, pas tout le travail du précédent.

## 4. Le format de relais

Fichier `docs/missions/NNN-nom/relais-<prénom>.md`, 30 lignes au plus :

```markdown
# Relais de <prénom> — mission NNN

## Livré
- <fichier> : <ce qu'il contient, en une ligne>

## Décisions prises
- <décision> : <raison en une ligne>

## Pour <prénom du suivant>
- <ce qu'il doit savoir ou faire, précisément>

## Points ouverts
- <question pour Sacha, ou doute à faire valider par un natif>
```

## 5. Définition de « terminé »

Une mission est terminée quand :
- chaque agent prévu a livré son relais ;
- le verdict de Boris est « Livrable » ou « Livrable avec réserves » acceptées par Sacha ;
- Sacha a mis à jour `docs/etat.md` et `docs/journal.md` ;
- le travail est sauvegardé sur GitHub (branche `main`) ;
- Max a reçu un lien de test ou un résumé.

## 6. Un seul lieu de travail

- **Le dépôt GitHub fait foi.** Une session (Mac ou cloud) commence par récupérer la dernière version et finit par l'envoyer sur GitHub. Rien ne reste uniquement sur une machine.
- Sur le Mac : GitHub Desktop, **Fetch / Pull** avant de lancer Claude Code, **Commit / Push** à la fin.
- **Envoyer sur `main` publie le site de test** (D14). On n'y envoie donc qu'à la clôture d'une mission, après le verdict de Boris. Un travail en cours va sur une branche à part.
- Si une mission est interrompue (limite d'utilisation atteinte), Sacha note dans `etat.md` l'étape atteinte, pour que la reprise parte de là et ne recommence rien.

## 6 bis. Qui intervient, et seulement sur déclencheur (D20)

| Agent | Lancé seulement quand | Jamais quand |
|---|---|---|
| Vera | un lot de contenu ou une règle d'apprentissage change | un correctif d'interface |
| Nadia | un lot de phrases est prêt (elle valide en lot, pas phrase à phrase) | un changement de code ou de design |
| Lou | un écran est nouveau ou modifié visuellement | un changement de contenu ou de moteur (le design russe est validé) |
| Kostia | le brief contient du code | contenu seul |
| Boris | **une fois**, avant fusion dans `main` | en cours de mission, ou pour un contenu seul sans nouveau format |

Vera rédige, Nadia valide : ce sont deux étapes d'un même duo contenu, un seul relais final. Sacha arbitre et ne produit pas : il ne réécrit ni contenu ni code.

## 7. Économiser la consommation (D23)

Règles chiffrées, vérifiées à la clôture de chaque mission :

1. **Fiche de rôle : 1 page au plus** (60 lignes). Un brief : 25 lignes au plus.
2. **Sortie d'un agent : 300 mots au plus** pour un relais ; le détail va dans le fichier livré, pas dans la réponse.
3. **Aucun fichier relu s'il n'a pas changé** : on se fie à `docs/etat.md`. Chaque agent a sa liste de lecture (règle 3 ci-dessus) et s'y tient.
4. **Opus : 1 à 2 appels par phase** (arbitrage de fin de phase, architecture). Tout le reste en Sonnet ou Haiku.
5. **Haiku** : brouillons de phrases-moules, formats, checklists, relevés de statut. **Sonnet** : code, russe, QA. 
6. **Lots plus gros, moins fréquents** : une mission regroupe plusieurs situations ou plusieurs correctifs plutôt qu'une mission par retouche.
7. **Début de prompt stable** (constitution, fiche de rôle, puis seulement la tâche) pour profiter du cache.
8. **Compteur** : à chaque `/cloture`, Sacha note dans `docs/journal.md` les tokens par agent. Si un rôle dépasse 20 % de la consommation pour moins de 10 % du livrable, on réduit son périmètre.

Et, en complément :

- Briefs courts et précis : un agent bien cadré lit moins et refait moins.
- Pas de relecture intégrale « pour vérifier » : Boris vérifie, Sacha lit les relais et le rapport.
- Pas de captures d'écran en série : une capture par écran modifié, pas plus.
- Les missions longues sont découpées en étapes, pour qu'un arrêt ne fasse rien perdre.


## Périmètre de Boris (décision de Max, 12/11/2026)
Boris est appelé **une seule fois par mission**, après Kostia, avec un périmètre écrit dans le brief : tailles d'écran, modes, durée de session, thèmes. Par défaut : 2 tailles (375×667 et 360×640), Silence et Écouteurs, thème clair, 25 cartes au plus, un seul Chrome à la fois. Le thème sombre, les 4 tailles et les sessions complètes se font en fin de phase, pas à chaque mission. Pas de nouvelle QA pour un changement de contenu seul sans nouveau format. Une contre-vérification après correction se limite aux points signalés.
