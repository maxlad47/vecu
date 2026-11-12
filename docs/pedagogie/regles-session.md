# Règles de composition d'une session (phase 0)

Auteur : pedagogue. Statut : proposition, à valider par le CEO.
Ce document est écrit pour être codé tel quel. Les termes « boîte », « échéance », « jour » et « réussite / échec » sont définis dans `repetition-espacee.md`.

## 0. Vocabulaire

- **Élément** : une phrase ou un moule (un id). Un moule = 1 élément, avec 1 boîte.
- **Occurrence** : pour un moule, la phrase obtenue avec un remplacement donné.
- **Carte** : un écran (ou un cycle audio en Voiture) portant sur 1 élément.
- **D** : durée annoncée en secondes (120, 300, 900, 1800).
- **t** : temps réel écoulé depuis le début de la session, en secondes, **pauses exclues** (bouton pause, app en arrière-plan hors Voiture).
- **DUE** : éléments en boîte 1 ou plus dont l'échéance est inférieure ou égale à aujourd'hui.
- **NEW** : éléments en boîte 0 (jamais vus), triés selon l'ordre global par vagues (`phrases-phase0.md`).
- **Échelle** : la suite de cartes qu'un élément nouveau reçoit dans sa session d'introduction.
- **Rendez-vous** : une carte programmée pour un élément, avec un index minimal (`indexMin`) à partir duquel elle peut passer.
- **cartes(e)** : nombre de cartes déjà reçues par l'élément e dans cette session, tous types confondus (Découverte, échelle, rattrapage, révision, remplissage, Boucles).
- **Plafond** : `plafond = 7` au départ (`maxCartesParElementParSession`). Un élément est **plein** quand `cartes(e) ≥ plafond`. Un élément plein ne reçoit plus aucune carte dans la session.
- **Réserve** : somme, sur tous les éléments en jeu (boîte 1 ou plus au début de la session, ou introduits dans cette session), de `max(0, plafond − cartes(e))`. C'est le nombre de cartes que la session peut encore jouer sans nouveauté.

## 1. Durée estimée de chaque carte (secondes, retour inclus)

Chaque estimation inclut la lecture, la réponse et le retour (bonne réponse : passage automatique après 1,2 s ; mauvaise réponse : la bonne réponse s'affiche, puis l'utilisateur touche « Continuer »).

| Carte | Silence | Écouteurs | Je peux parler |
|---|---|---|---|
| Découverte (phrase) | 15 | 18 | 20 |
| Découverte (moule) | 20 | 22 | 24 |
| Sens | 8 | 10 | 10 |
| Thème | 10 | 12 | 12 |
| Ordre | 15 | 16 | 16 |
| Écoute | interdit | 10 | 10 |
| À voix haute | interdit | interdit | 12 |
| Moule (sens ou thème) | 10 | 12 | 12 |

En Écouteurs et Je peux parler, l'audio russe est joué une fois à l'affichage de la Découverte et une fois après la réponse de chaque carte Sens, Thème, Ordre et Moule. Ces lectures sont incluses dans les durées ci-dessus.

### Voiture

| Élément audio | Contenu exact | Durée estimée |
|---|---|---|
| Annonce de début | voix fr-FR : « Session de N minutes. C'est parti. » | 4 |
| **Boucle découverte** (élément nouveau) | 1. français (fr-FR) · 2. silence 1 s · 3. russe lent · 4. silence 3 s (répéter) · 5. russe normal · 6. silence 3 s (répéter) · 7. russe normal · 8. silence 2 s | 18 |
| **Boucle rappel** (élément déjà vu) | 1. français (fr-FR) · 2. silence « réponse » de 5 s (6 s si le texte russe dépasse 25 caractères) · 3. russe lent · 4. silence 1 s · 5. russe normal · 6. silence 3,5 s (répéter) | 17 |
| Annonce de fin | voix fr-FR : « Session terminée. À bientôt. » | 4 |

- Russe lent = `rate 0.7`. Russe normal = `rate 1.0`, ou `0.85` si le réglage « voix lente » est activé. Français = `rate 1.0`.
- Les silences sont des minuteurs lancés à l'événement `onend` de la synthèse précédente. La durée réelle d'un cycle est donc mesurée, pas supposée.
- Pas d'astuce en Voiture. Les variantes m/f suivent le réglage de l'utilisateur.

### Coûts dérivés (pour la planification)

| | Silence | Écouteurs | Je peux parler | Voiture |
|---|---|---|---|---|
| `coutNouveau` phrase (échelle complète) | 48 | 56 | 54 | 52 |
| `coutNouveau` moule | 50 | 58 | 60 | 52 |
| `estRevision` (carte de révision moyenne) | 11 | 12 | 12 | 17 |

## 2. Quotas par durée et par mode

### Nombre maximum de nouveaux éléments (`Nmax`)

| | 2 min | 5 min | 15 min | 30 min |
|---|---|---|---|---|
| Silence, Écouteurs, Je peux parler | 1 | 3 | 6 | 9 |
| Voiture | 1 | 2 | 4 | 6 |
| `Nmin` (plancher en cas de surcharge) | 0 | 0 | 1 | 1 |

**Démarrage** : si l'apprenant a vu moins de 4 éléments au total, `Nmax` à 2 min passe à 2 (tous modes). Sans cela, une session de 2 min ne contiendrait qu'une seule phrase.

### Réduction en cas de surcharge (à calculer au début de la session)

```
N = min(Nmax, |NEW|)
tant que N > Nmin et N × coutNouveau(phrase) + |DUE| × estRevision > D :
    N = N − 1
```

### Ce que cela donne (sans retard de révision, échelles complètes)

| Mode | Durée | Nouveaux | Cartes (env.) | Découverte pure | Répétition (échelles + révisions) |
|---|---|---|---|---|---|
| Silence | 2 min | 1 | 10 | 13 % | 87 % |
| Silence | 5 min | 3 | 28 | 15 % | 85 % |
| Silence | 15 min | 6 | 80 | 10 % | 90 % |
| Silence | 30 min | 9 | 160 | 8 % | 92 % |
| Écouteurs | 2 / 5 / 15 / 30 min | 1 / 3 / 6 / 9 | 9 / 24 / 72 / 145 | 15 / 18 / 12 / 9 % | le reste |
| Je peux parler | 2 / 5 / 15 / 30 min | 1 / 3 / 6 / 9 | 8 / 23 / 70 / 140 | 17 / 20 / 13 / 10 % | le reste |
| Voiture | 2 / 5 / 15 / 30 min | 1 / 2 / 4 / 6 | 6 / 17 / 53 / 105 | 15 / 12 / 8 / 6 % | le reste |

La révision (dues et révision libre) occupe toujours plus de 50 % du temps de la session. Le nombre de cartes n'est pas fixé à l'avance : c'est le temps qui décide (section 6).
Ce tableau ne tient pas compte du plafond de 7 cartes par élément (section 5.6). Quand l'apprenant a vu peu d'éléments (premier lancement, premiers jours), le plafond change ces chiffres : voir l'exemple 1 et la section 6.1.

## 3. Exercices permis par mode (le tableau du brief fait foi)

| Type | Silence | Écouteurs | Je peux parler | Voiture |
|---|---|---|---|---|
| Découverte | oui (sans son) | oui | oui | non |
| Sens | oui | oui | oui | non |
| Thème | oui | oui | oui | non |
| Ordre | oui | oui | oui | non |
| Écoute | non | oui | oui | non |
| À voix haute | non | non | oui | non |
| Moule | oui | oui | oui | non |
| Boucle découverte / rappel | non | non | non | oui, uniquement |

En Silence, aucun appel à `speechSynthesis`.

**Ordre possible** seulement si le texte russe (variante de l'utilisateur), une fois la ponctuation retirée, compte 3 mots ou plus (mots séparés par des espaces). Sinon, Ordre est remplacé par **Thème**.
Les moules ne passent jamais en Sens, Thème, Ordre, Écoute ou À voix haute : toujours en **Moule** (et en Boucle en Voiture).

## 4. Choix du type d'exercice

### 4.1 Échelle d'un élément nouveau (session d'introduction)

| Mode | Étape 0 | Étape 1 | Étape 2 | Étape 3 |
|---|---|---|---|---|
| Silence | Découverte | Sens | Thème | Ordre |
| Écouteurs | Découverte | Écoute | Thème | Ordre |
| Je peux parler | Découverte | Écoute | Thème | À voix haute |
| Voiture | Boucle découverte | Boucle rappel | Boucle rappel | (aucune) |
| Moule (hors Voiture) | Découverte (moule) | Moule-sens | Moule-thème | Moule-thème |

Écarts entre étapes (en nombre de cartes, `index de la carte suivante = index de la carte placée + écart`) :
- Hors Voiture : après l'étape 0 : +2 ; après l'étape 1 : +3 ; après l'étape 2 : +4.
- Voiture : après l'étape 0 : +2 ; après l'étape 1 : +3.

### 4.2 Carte de révision (élément DUE), selon sa boîte

| Boîte | Silence | Écouteurs | Je peux parler | Voiture |
|---|---|---|---|---|
| 1 | Sens | Sens | Sens | Boucle rappel |
| 2 | Thème | Écoute | Écoute | Boucle rappel |
| 3 | Ordre | Thème | À voix haute | Boucle rappel |
| 4 | Thème | Ordre | Thème | Boucle rappel |
| 5 | Ordre | Écoute | À voix haute | Boucle rappel |
| 6 | Thème | Thème | À voix haute | Boucle rappel |

Moules : Moule-sens en boîte 1 ou 2, Moule-thème en boîte 3 ou plus.

### 4.3 Carte de remplissage (révision libre, section 5, étape E)

- Rotation par mode : Silence `[Sens, Thème, Ordre]` ; Écouteurs `[Sens, Écoute, Thème, Ordre]` ; Je peux parler `[Écoute, Thème, À voix haute]` ; Voiture `[Boucle rappel]`.
- Si l'élément n'a encore eu aucune carte dans la session, on prend le type du tableau 4.2 selon sa boîte. Sinon, on prend le type qui suit, dans la rotation, le dernier type qu'il a reçu dans la session (en revenant au début après le dernier). Un type impossible (Ordre à moins de 3 mots) est sauté.
- Moules : on alterne Moule-sens et Moule-thème, en commençant par le type opposé au dernier reçu.

### 4.4 Choix du remplacement d'un moule

- Découverte (moule) : remplacement d'index 0 (le premier de la liste).
- Toute autre carte : l'index qui suit `dernierRemplacement`, en revenant à 0 après le dernier. On enregistre l'index après chaque carte.
- Choix délibéré : rotation et non tirage au hasard, pour que tous les remplacements soient vus et qu'aucun ne revienne deux fois de suite.

## 5. Algorithme de la session

### 5.1 Initialisation

1. Calculer `jour` (voir `repetition-espacee.md`).
2. Construire DUE, trié par : échéance croissante (la plus en retard d'abord), puis boîte croissante, puis rang global.
3. Construire NEW (ordre global), puis calculer N (section 2). Les N premiers de NEW forment la file des nouveaux.
4. `index = 0`, `dernierElement = null`, rendez-vous = liste vide, `actifs = 0` (éléments dont l'échelle n'est pas terminée), `introduits = 0`, `plafond = 7`, `prolongation = faux`, `cartes(e) = 0` pour tout élément.
5. En Voiture : jouer l'annonce de début (elle compte dans t).

### 5.2 Choix de la carte suivante (à chaque pas, dans cet ordre)

Avant chaque carte, appliquer d'abord la règle d'arrêt (section 6). Puis prendre **la première règle qui donne une carte**. Aucune règle ne donne de carte à un élément plein (section 0) : il est ignoré partout, comme s'il n'existait pas.

- **A. Rendez-vous échu** : parmi les rendez-vous dont `indexMin ≤ index` et dont l'élément ≠ `dernierElement`, celui qui a le plus petit `indexMin` (en cas d'égalité, le plus ancien créé).
- **B. Nouvel élément** si toutes ces conditions sont vraies :
  - il reste un élément de NEW pas encore introduit, et l'une des deux conditions suivantes est vraie :
    - quota normal : `introduits < N` ;
    - **bonus** (section 5.6) : `introduits < N + nouveautesBonusMax[durée]` **et** `réserve × estRevision < D − t` ;
  - `actifs < 2` ;
  - si DUE n'était pas vide au départ, `index ≥ 1` (la première carte est une révision, pour s'échauffer) ;
  - `D − t ≥ coutNouveau(élément) + (nombre de DUE pas encore passés) × estRevision`.
  On place alors l'étape 0 de son échelle.
- **C. Révision due** : le prochain élément de DUE pas encore passé dont l'élément ≠ `dernierElement`. Type selon le tableau 4.2.
- **D. Rendez-vous avancé** : le rendez-vous de plus petit `indexMin` (même s'il n'est pas encore échu), dont l'élément ≠ `dernierElement`.
- **E. Remplissage** : voir 5.3.
- **F. Exception** : si aucune carte n'est possible à cause de la seule contrainte « élément ≠ dernierElement », lever cette contrainte et reprendre en A.
- **G.** Sinon, aucune carte n'est possible : appliquer la section 6.1 (fin anticipée ou prolongation).

Après avoir placé une carte d'échelle à l'étape k : si une étape k+1 existe et que l'élément n'est pas plein, créer son rendez-vous avec `indexMin = index + écart(k)`. Sinon, l'élément sort des actifs (`actifs − 1`). À l'étape 0 : `introduits + 1`, `actifs + 1`.
Puis : `cartes(élément) + 1`, `dernierElement = élément`, `index + 1`.
(Une échelle compte au plus 4 cartes et 2 rattrapages, soit 6 : elle tient toujours sous le plafond.)

### 5.3 Remplissage (règle E)

Liste F, construite dans cet ordre, sans doublon (on garde la première apparition) :
1. les éléments ratés pendant cette session, dans l'ordre des échecs ;
2. les éléments introduits aujourd'hui (cette session ou une session précédente du même jour), par rang global ;
3. tous les autres éléments vus (boîte 1 ou plus), par boîte croissante, puis échéance croissante, puis rang global.

On parcourt F dans l'ordre avec un pointeur. On prend le premier élément restant ≠ `dernierElement`. Un élément sauté reste en tête pour le pas suivant. Quand tous les éléments restants valent `dernierElement` ou que F est épuisée, on reconstruit F et on recommence (nouveau passage).
Le type de carte suit la section 4.3.
Un élément jamais vu (boîte 0) n'entre jamais dans F. Un élément plein non plus : il est retiré de F dès qu'il atteint le plafond.

### 5.4 Échec pendant la session

- Une carte ratée (voir `repetition-espacee.md`) affiche la bonne réponse, puis crée un **rendez-vous de rattrapage** : même élément, même type, `indexMin = index + 3`.
- Au plus **2 rattrapages par élément et par session**. Au-delà, plus de rattrapage (l'élément reste en tête de F au remplissage).
- Pas de rattrapage si l'élément est plein après la carte ratée. L'échec est enregistré, et l'élément reviendra à une prochaine session.
- Pendant une échelle, l'étape ratée est rejouée en rattrapage. L'étape suivante n'est programmée qu'après la carte de rattrapage (`indexMin = index du rattrapage + écart(k)`), qu'elle soit réussie ou non.
- Seule la **première carte notée** d'un élément DUE dans la session change sa boîte. Les rattrapages et le remplissage suivent les règles de `repetition-espacee.md`.
- Voiture : pas de réponse, donc jamais d'échec ni de rattrapage.

### 5.5 Premier lancement et contenu épuisé

- **Premier lancement** (aucun élément vu) : DUE est vide, pas d'échauffement, la règle B s'applique dès `index = 0`. Le reste du temps est rempli par les échelles, puis par le remplissage (F ne contient que les éléments du jour). Comme chaque élément est plafonné à 7 cartes, c'est surtout là que le bonus de nouveautés (5.6) intervient. Voir l'exemple 1.
- **Tout le contenu est vu** (NEW vide) : N = 0. La session = DUE, puis remplissage. L'écran de fin affiche « Tu as vu toutes les phrases disponibles. On continue à les ancrer. »
- **Tout est acquis** et rien n'est dû : session de remplissage pur (F étape 3, boîtes les plus basses d'abord). Même message.

### 5.6 Plafond par élément et bonus de nouveautés

Raison : au test, une nouvelle phrase qui revient 10 fois dans une session de 5 min lasse ; l'utilisateur témoin décroche vers la 6e ou la 7e fois.

1. **Plafond** : un même élément (phrase ou moule) reçoit au plus 7 cartes par session, tous types confondus, Découverte comprise. Pour un moule, les 7 cartes comptent ensemble, quel que soit le remplacement.
2. **Bonus** : quand la réserve (section 0) ne suffit plus à remplir le temps restant (`réserve × estRevision < D − t`), la règle B peut introduire un nouvel élément au-delà du quota N, dans la limite de `nouveautesBonusMax[durée]`, proportionnelle à la durée : 2 min → 1, 5 min → 2, 15 min → 4, 30 min → 6. Toutes les autres conditions de B restent exigées (`actifs < 2`, temps suffisant pour une échelle complète).
   La limite `actifs < 2` reste à 2 pour toutes les durées : estimation faite, elle n'empêche pas d'utiliser le bonus en 15 et 30 min. Avec 2 échelles en parallèle, un élément entre environ toutes les 5 cartes (55 s hors Voiture, 51 s en Voiture). Les 15 éléments du premier lancement en 30 min sont donc tous introduits vers 850 s, bien avant que les cartes ne s'épuisent (environ 1 200 s).
3. C'est une **exception assumée** à la règle « 3 nouveautés au plus en 5 min » : elle ne joue que s'il n'y a plus assez à réviser. Au premier lancement en 5 min, la session introduit donc au plus 5 éléments (3 + 2).
4. Le bonus ne joue presque jamais quand l'apprenant a des révisions : chaque élément déjà vu apporte jusqu'à 7 cartes de réserve.

## 6. Arrêt de la session

Avant chaque carte (estimée à `est` secondes) :
1. si `t ≥ D` : fin ;
2. si `t + est > 1,15 × D` : fin ;
3. si `prolongation` est vrai et `t ≥ 0,8 × D` : fin ;
4. sinon, jouer la carte.

### 6.1 Plus rien à jouer avant la fin (règle G)

Cela arrive quand tous les éléments en jeu sont pleins et que le bonus est épuisé, ou impossible (NEW vide, ou moins de temps restant qu'une échelle complète).
- Si `t ≥ 0,8 × D` : **fin anticipée**. La session est plus courte que prévu, mais elle reste dans la tolérance de 20 %.
- Si `t < 0,8 × D` : **prolongation**. On passe `prolongation` à vrai, on relève le plafond d'une carte (`plafond + 1`) et on reprend en A. La session s'arrête dès que `t ≥ 0,8 × D` (règle 3 ci-dessus). Si tout redevient plein avant, on relève encore le plafond d'une carte.
- **Choix du moins pire, assumé** : entre une session qui s'arrête bien avant la durée annoncée et une phrase qui revient plus de 7 fois, on dépasse le plafond. La durée annoncée est une règle de la constitution ; le plafond est une règle de confort. On le dépasse le moins possible : juste assez pour atteindre 80 % de D, jamais plus. Le remplissage (5.3) répartit les cartes en plus entre les éléments, à tour de rôle.

- Une carte commencée va toujours jusqu'au bout, y compris un cycle Voiture.
- **Voiture** : la session s'arrête seule par cette même règle, sans toucher l'écran. À la fin du dernier cycle : annonce de fin, puis l'écran de fin s'affiche (consultable à l'arrêt). Le bouton pause suspend la synthèse et les minuteurs, et t ne court plus. À la reprise, le cycle en cours est rejoué depuis son étape 1.
- Hors Voiture, quand l'app passe en arrière-plan (`visibilitychange`), t est suspendu.
- L'utilisateur peut quitter à tout moment. Chaque résultat est enregistré dès la réponse, donc rien n'est perdu.
- Garantie, si les cartes durent ce qui est estimé : comme une carte dure au plus 24 s, l'arrêt normal a lieu entre min(D, 1,15 × D − 24 s) et 1,15 × D (pour 2 min : entre 114 et 138 s). La fin anticipée et la prolongation (6.1) ne s'arrêtent jamais avant 0,8 × D. La session tient donc dans les ±20 % pour les 16 combinaisons de durée et de mode. Il faut mesurer en test les durées réelles par type de carte et corriger les constantes si l'écart moyen dépasse 20 %.
- Vérification au premier lancement (pire cas, 7 cartes par élément ; coût d'un élément plafonné : environ 80 s en Silence, 92 s en Écouteurs, 90 s en Je peux parler, 120 s en Voiture) :

| Durée | Silence | Écouteurs | Je peux parler | Voiture |
|---|---|---|---|---|
| 2 min (N = 2) | normal | normal | normal | normal |
| 5 min | normal (4 ou 5 éléments) | normal | normal | normal (3 éléments, bonus de 1) |
| 15 min (10 éléments, 8 en Voiture) | normal (environ 800 s, 89 %) | normal (environ 920 s) | normal (environ 900 s) | normal (environ 964 s) |
| 30 min (15 éléments, 12 en Voiture) | **problème** : 1 200 s (67 %) à 7 cartes ; 1 365 s (76 %) à 8 ; il faut 9 cartes pour environ la moitié des éléments pour atteindre 1 440 s | prolongation : 1 380 s à 7 cartes, puis 8 cartes pour environ la moitié des éléments | prolongation : 1 350 s à 7 cartes, puis 8 cartes pour environ les deux tiers des éléments | limite : environ 1 444 s à 7 cycles (80 %), 8 cycles au plus |

Dès que l'apprenant a vu une douzaine d'éléments, la réserve suffit dans tous les cas et le plafond n'est plus dépassé.

## 7. QCM à 3 choix : les 2 mauvaises réponses

S'applique à Sens, Thème et Écoute (options en français pour Sens et Écoute, en russe pour Thème).

1. **Normalisation pour comparer** : minuscules, ponctuation retirée (`. , ! ? ; : « » " ' … -`), espaces multiples réduits, ё → е.
2. **Exclusions** : un candidat est exclu si son texte français normalisé **ou** son texte russe normalisé est égal à celui de la bonne réponse, ou à celui d'un autre leurre déjà choisi.
3. **Réservoirs, par ordre de préférence** (on passe au suivant tant qu'on n'a pas 2 leurres) :
   - P1 : éléments de la même situation déjà vus (boîte 1 ou plus) ou introduits dans cette session ;
   - P2 : éléments de la même situation pas encore vus ;
   - P3 : éléments déjà vus des autres situations ;
   - P4 : tous les autres éléments.
   On tire au hasard (uniforme) dans le réservoir courant.
4. Un moule pris comme leurre est représenté par son occurrence de `dernierRemplacement` (index 0 s'il n'a jamais été vu).
5. Toutes les options utilisent la variante de genre de l'utilisateur.
6. La position de la bonne réponse est tirée au hasard parmi les 3.

**Carte Moule** : les 2 leurres sont deux autres occurrences **du même moule** (deux autres remplacements, tirés au hasard). L'apprenant doit donc repérer le mot qui change. Moule-sens : russe affiché, choix en français. Moule-thème : français affiché, choix en russe.

**Carte Ordre** : les mots du texte russe, sans ponctuation, avec la première lettre de la phrase en minuscule, mélangés au hasard (et jamais dans l'ordre correct). On retire un mot en le touchant de nouveau. La vérification a lieu quand tous les mots sont placés.

## 8. Constantes (à reprendre telles quelles dans le code)

```json
{
  "durees": { "2": 120, "5": 300, "15": 900, "30": 1800 },
  "toleranceFin": 1.15,
  "maxCartesParElementParSession": 7,
  "nouveautesBonusMax": { "2": 1, "5": 2, "15": 4, "30": 6 },
  "seuilFinAnticipee": 0.8,
  "prolongationPasPlafond": 1,
  "estimations": {
    "silence":   { "decouverte": 15, "decouverteMoule": 20, "sens": 8,  "theme": 10, "ordre": 15, "moule": 10 },
    "ecouteurs": { "decouverte": 18, "decouverteMoule": 22, "sens": 10, "theme": 12, "ordre": 16, "ecoute": 10, "moule": 12 },
    "parler":    { "decouverte": 20, "decouverteMoule": 24, "sens": 10, "theme": 12, "ordre": 16, "ecoute": 10, "voixHaute": 12, "moule": 12 },
    "voiture":   { "boucleDecouverte": 18, "boucleRappel": 17, "annonceDebut": 4, "annonceFin": 4 }
  },
  "estRevision": { "silence": 11, "ecouteurs": 12, "parler": 12, "voiture": 17 },
  "nMax": {
    "silence":   { "2": 1, "5": 3, "15": 6, "30": 9 },
    "ecouteurs": { "2": 1, "5": 3, "15": 6, "30": 9 },
    "parler":    { "2": 1, "5": 3, "15": 6, "30": 9 },
    "voiture":   { "2": 1, "5": 2, "15": 4, "30": 6 }
  },
  "nMin": { "2": 0, "5": 0, "15": 1, "30": 1 },
  "demarrage": { "seuilVus": 4, "nMax2min": 2 },
  "actifsMax": 2,
  "ecartsEchelle": { "standard": [2, 3, 4], "voiture": [2, 3] },
  "rattrapage": { "ecart": 3, "maxParElement": 2 },
  "voiture": {
    "rateLent": 0.7, "rateNormal": 1.0, "rateNormalReglageLent": 0.85,
    "decouverte": { "apresFr": 1, "apresLent": 3, "apresNormal1": 3, "apresNormal2": 2 },
    "rappel": { "reponse": 5, "reponseLongue": 6, "seuilLong": 25, "entreLentEtNormal": 1, "apresNormal": 3.5 }
  }
}
```

---

## 9. Exemple 1 : 5 min, Silence, premier lancement

D = 300, estRevision = 11, plafond = 7. DUE vide. N = 3, bonus possible : 2.
NEW dans l'ordre : A = ru-cafe-001 « Bonjour. » (un seul mot en russe, donc Ordre remplacé par Thème), B = ru-cafe-002, le moule « ___, s'il vous plaît. », C = ru-cafe-003 « Merci. » (Ordre remplacé par Thème), puis, en bonus, D = ru-courses-001 « Combien ça coûte ? » (3 mots, Ordre possible) et E = ru-courses-002, le moule « Je prends ___. ».
Hypothèse : tout est réussi sauf la carte n° 9.
Colonne « Réserve » : valeur au moment du choix, comparée à D − t (règle B, bonus), seulement une fois le quota N atteint.

| n° | t début | Règle | Élément | Carte | Réserve × 11 / D − t | Résultat / suite | Cartes A-B-C-D |
|---|---|---|---|---|---|---|---|
| 0 | 0 | B | A | Découverte | | rdv A étape 1 à n°2 ; A → boîte 1 | 1-0-0-0 |
| 1 | 15 | B | B | Découverte moule (« Un café, s'il vous plaît. ») | | rdv B à n°3 ; B → boîte 1 | 1-1-0-0 |
| 2 | 35 | A | A | Sens | | ok ; rdv A à n°5 | 2-1-0-0 |
| 3 | 43 | A | B | Moule-sens (« Un thé ») | | ok ; rdv B à n°6 | 2-2-0-0 |
| 4 | 53 | D | A | Thème | | ok ; rdv A à n°8 | 3-2-0-0 |
| 5 | 63 | D | B | Moule-thème (« Un cappuccino ») | | ok ; rdv B à n°9 | 3-3-0-0 |
| 6 | 73 | D | A | Thème (à la place d'Ordre) | | ok ; fin d'échelle de A | 4-3-0-0 |
| 7 | 83 | B | C | Découverte | | rdv C à n°9 ; C → boîte 1 ; quota N atteint | 4-3-1-0 |
| 8 | 98 | D | B | Moule-thème (« Une bouteille d'eau ») | (actifs = 2) | ok ; fin d'échelle de B (égalité à n°9 avec C : B est plus ancien) | 4-4-1-0 |
| 9 | 108 | A | C | Sens | (actifs = 2) | **échec** : rattrapage C Sens à n°12 | 4-4-2-0 |
| 10 | 116 | **B bonus** | D | Découverte | 121 < 184 : oui | rdv D à n°12 ; D → boîte 1 | 4-4-2-1 |
| 11 | 131 | D | C | Sens (rattrapage) | (actifs = 2) | ok ; rdv C Thème à n°14 (égalité à n°12 avec D : C est plus ancien) | 4-4-3-1 |
| 12 | 139 | A | D | Sens | (actifs = 2) | ok ; rdv D à n°15 | 4-4-3-2 |
| 13 | 147 | D | C | Thème | (actifs = 2) | ok ; rdv C à n°17 | 4-4-4-2 |
| 14 | 157 | D | D | Thème | (actifs = 2) | ok ; rdv D à n°18 | 4-4-4-3 |
| 15 | 167 | D | C | Thème (à la place d'Ordre) | (actifs = 2) | fin d'échelle de C | 4-4-5-3 |
| 16 | 177 | D | D | Ordre | 132 < 123 : non | fin d'échelle de D | 4-4-5-4 |
| 17 | 192 | E | C | Sens (Ordre impossible, sauté) | 121 < 108 : non | F = [C, A, B, D] | 4-4-6-4 |
| 18 | 200 | E | A | Sens (Ordre impossible, sauté) | 110 < 100 : non | | 5-4-6-4 |
| 19 | 208 | E | B | Moule-sens (« Une bière ») | 99 < 92 : non | | 5-5-6-4 |
| 20 | 218 | E | D | Sens | 88 < 82 : non | F épuisée | 5-5-6-5 |
| 21 | 226 | E | C | Thème | 77 < 74 : non | F reconstruite ; **C plein** | 5-5-7-5 |
| 22 | 236 | E | A | Thème | 66 < 64 : non | | 6-5-7-5 |
| 23 | 246 | E | B | Moule-thème (« Un jus d'orange ») | 55 < 54 : non | | 6-6-7-5 |
| 24 | 256 | E | D | Thème | 44 < 44 : non | F épuisée | 6-6-7-6 |
| 25 | 266 | E | A | Sens | 33 < 34 : oui, mais 34 s < coutNouveau(E) = 50 : refusé | F = [A, B, D] (C plein, retiré) ; **A plein** | 7-6-7-6 |
| 26 | 274 | E | B | Moule-sens (« Un café ») | 22 < 26 : oui, mais 26 < 50 : refusé | **B plein** | 7-7-7-6 |
| 27 | 284 | E | D | Ordre | 11 < 16 : oui, mais 16 < 50 : refusé | 284 + 15 ≤ 345 : on joue la carte ; **D plein** | 7-7-7-7 |
| 28 | 299 | G | | | | tout est plein, E refusé ; t = 299 ≥ 0,8 × 300 = 240 : fin anticipée (6.1) | |

Bilan : 28 cartes, 4 min 59 s. Quatre éléments (3 du quota, 1 de bonus), vus **7 fois chacun** : 1 Découverte et 6 cartes. A : Découverte, Sens, Thème, Thème, Sens, Thème, Sens. B : Découverte (café), puis 6 cartes Moule qui parcourent les autres remplacements (thé, cappuccino, bouteille d'eau, bière, jus d'orange) et reviennent à café. C : Découverte, Sens (échec), Sens (rattrapage), Thème, Thème, Sens, Thème. D : Découverte, Sens, Thème, Ordre, Sens, Thème, Ordre. E n'est pas introduit : il ne restait plus le temps d'une échelle complète. En fin de session, A, B, C et D sont en boîte 1, échéance demain. L'échec de C ne change rien à sa boîte, puisqu'il est nouveau.

## 10. Exemple 2 : 15 min, Voiture, avec des révisions dues

Jour J. Max a déjà vu les rangs 1 à 9 :
- ru-cafe-001, 002, 003 : boîte 2, échéance J (dues) ;
- ru-courses-001, 002, 003 : boîte 2, échéance J+1 ;
- ru-gouts-001, 002, 003 : boîte 1, échéance J (dues, vues hier).

DUE trié : gouts-001, gouts-002, gouts-003 (boîte 1), puis cafe-001, cafe-002, cafe-003 (boîte 2).
D = 900. Nmax = 4. Contrôle de surcharge : 4 × 52 + 6 × 17 = 310 ≤ 900, donc N = 4.
Nouveaux (rangs 10 à 13) : N1 = sortir-001 « D'accord ! », N2 = sortir-002, le moule « On va ___ ? », N3 = sortir-003 « À quelle heure ? », N4 = rencontrer-001 « Je ne comprends pas. ».

| n° | t début | Règle | Élément | Carte | Effet |
|---|---|---|---|---|---|
| - | 0 | | | Annonce de début | |
| 0 | 4 | C (échauffement) | gouts-001 | Boucle rappel | boîte 1 → 2, échéance J+2 |
| 1 | 21 | B | N1 | Boucle découverte | boîte 1 ; rdv à n°3 |
| 2 | 39 | B | N2 | Boucle découverte (« On va au cinéma ? ») | boîte 1 ; rdv à n°4 |
| 3 | 57 | A | N1 | Boucle rappel | rdv à n°6 |
| 4 | 74 | A | N2 | Boucle rappel (« au restaurant ») | rdv à n°7 |
| 5 | 91 | C | gouts-002 | Boucle rappel (remplacement suivant) | boîte 1 → 2 |
| 6 | 108 | A | N1 | Boucle rappel | fin d'échelle |
| 7 | 125 | A | N2 | Boucle rappel (« au bar ») | fin d'échelle |
| 8 | 142 | B | N3 | Boucle découverte | boîte 1 ; rdv à n°10 |
| 9 | 160 | B | N4 | Boucle découverte | boîte 1 ; rdv à n°11 |
| 10 | 178 | A | N3 | Boucle rappel | rdv à n°13 |
| 11 | 195 | A | N4 | Boucle rappel | rdv à n°14 |
| 12 | 212 | C | gouts-003 | Boucle rappel | boîte 1 → 2 |
| 13 | 229 | A | N3 | Boucle rappel | fin d'échelle |
| 14 | 246 | A | N4 | Boucle rappel | fin d'échelle |
| 15 | 263 | C | cafe-001 | Boucle rappel | boîte 2 → 3, échéance J+4 |
| 16 | 280 | C | cafe-002 | Boucle rappel | boîte 2 → 3 |
| 17 | 297 | C | cafe-003 | Boucle rappel | boîte 2 → 3 |
| 18 à 30 | 314 | E, 1er passage | F = sortir-001, sortir-002, sortir-003, rencontrer-001, puis courses-001, 002, 003 (boîte 2, J+1), gouts-001, 002, 003 (boîte 2, J+2), cafe-001, 002, 003 (boîte 3) | 13 Boucles rappel | aucun changement de boîte |
| 31 à 43 | 535 | E, 2e passage | même liste | 13 Boucles rappel | aucun |
| 44 à 52 | 756 | E, 3e passage | sortir-001 … courses-003, gouts-001, gouts-002 | 9 Boucles rappel | la carte n°52 démarre à t = 892 < 900 |
| - | 909 | arrêt | | Annonce de fin | t ≥ 900 |

Bilan : 53 cycles, environ 15 min 13 s. Chaque nouvel élément est entendu 6 fois (1 découverte, 2 rappels d'échelle, 3 rappels de remplissage). Chaque élément déjà vu est entendu 3 ou 4 fois. Les promotions par la Voiture sont plafonnées à la boîte 3 (voir `repetition-espacee.md`).

## 11. Univers de vocabulaire (mission 012)

À l'écran on dit « univers » (le mot « thème » désigne déjà un type d'exercice). Le détail et les seuils sont dans `docs/pedagogie/themes.md`. Règles d'intégration aux sessions, reprises de ce fichier :

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

