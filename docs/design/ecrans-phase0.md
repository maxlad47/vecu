# Vécu : spécification des écrans (phase 0)

Auteur : designer-ux, 11/11/2026. Pour `dev-pwa`. À lire avec `systeme-visuel.md` (tokens, composants, mouvement).

Ce document fixe les **écrans, les états, les interactions et les textes**. Il ne fixe pas le contenu pédagogique (phrases, composition des sessions, rythme de répétition) : c'est le travail du pédagogue. Quand un écran dépend d'une règle pédagogique, c'est signalé par **[règle pédagogue]**.

**Les textes entre guillemets « » sont à reprendre mot pour mot**, sans les guillemets. Les éléments entre accolades `{…}` sont des valeurs dynamiques. Espaces insécables avant `? ! : ;` (voir `systeme-visuel.md` § 2.4).

L'interface tutoie l'utilisateur. Les choix de l'utilisateur sont à la première personne (« J'ai combien de temps ? », « Je suis où ? »).

---

## 0. Carte des écrans

```
Accueil ──► [vérif. voix si mode sonore] ──► Session ──► Fin de session
   │                 │                         │              │
   │                 └─► Pas de voix russe     └─► Feuille « On s'arrête ? »
   │
   ├─► Voiture : Avant le départ ──► Voiture en cours ──► Fin de session
   ├─► Mes progrès
   └─► Réglages
```

Navigation par état en mémoire, sans URL. Le bouton « retour » système (Android, geste iOS dans la PWA installée) doit faire l'équivalent du bouton retour de l'écran, pas quitter l'app : **recommandation** au développeur, pousser un état avec `history.pushState(etat, "")` sans changer l'URL à chaque changement d'écran et écouter `popstate`. En session, « retour » ouvre la feuille « On s'arrête là ? ».

---

## 1. Accueil

### Rôle
Mettre l'utilisateur en train d'apprendre en moins de 10 secondes. Deux choix, un bouton. Au deuxième lancement : **un seul toucher**.

### Disposition (de haut en bas)
1. **En-tête** (56 px)
   - À gauche : mot-symbole « Vécu » (`--fs-body`, 700). Pas cliquable.
   - À droite : deux boutons texte avec icône :
     - icône graphique + « Mes progrès »
     - icône engrenage + « Réglages »
2. **Contenu**
   - Question 1 (`<legend>`) : « J'ai combien de temps ? »
   - 4 segments : « 2 min », « 5 min », « 15 min », « 30 min ». Noms accessibles : « 2 minutes », « 5 minutes », « 15 minutes », « 30 minutes ».
   - Espace `--space-5`.
   - Question 2 (`<legend>`) : « Je suis où ? »
   - 4 cartes de lieu en grille 2 × 2, dans cet ordre :

| Carte | Nom | Ligne d'exemple | Icône |
|---|---|---|---|
| 1 | « Silence » | « Salle d'attente, réunion, métro bondé » | haut-parleur barré |
| 2 | « Écouteurs » | « Dans le bus, dans une file d'attente » | casque |
| 3 | « Je peux parler » | « Chez moi, en promenade » | bulle de parole |
| 4 | « Voiture » | « Sur la route, sans les mains » | voiture |

3. **Zone d'action** (bas, collée) : bouton principal à deux lignes.

### États

| État | Durée | Lieu | Bouton principal |
|---|---|---|---|
| Premier lancement | « 5 min » présélectionné | rien de sélectionné | état incomplet : libellé « Dis-moi où tu es », pas de sous-libellé |
| Lieu choisi | choix courant | choix courant | libellé « C'est parti », sous-libellé `{durée}, {lieu en clair}` |
| Deuxième lancement et suivants | dernier choix mémorisé | dernier choix mémorisé | « C'est parti » + sous-libellé, prêt |

Sous-libellé `{lieu en clair}` :
- Silence : « en silence »
- Écouteurs : « avec écouteurs »
- Je peux parler : « à voix haute »
- Voiture : « en voiture »

Exemples complets : « 5 min, en silence », « 30 min, en voiture ».

Pourquoi « 5 min » présélectionné et pas le lieu : se tromper de durée est sans conséquence, se tromper de lieu peut faire partir du son en réunion. Le lieu doit être un vrai choix au moins la première fois.

Le sous-libellé rappelle le contexte mémorisé : au deuxième lancement, l'utilisateur voit d'un coup d'œil ce qui va se passer avant de toucher.

### Interactions
- Toucher un segment ou une carte : sélection immédiate, mémorisée tout de suite (pas seulement au démarrage). Rien d'autre ne se passe : pas d'avance automatique.
- Toucher le bouton en état incomplet : le focus va sur le premier choix de lieu, la question « Je suis où ? » défile dans la vue si besoin, et un texte apparaît sous elle, en `--text-muted` : « Choisis l'endroit où tu es, je m'adapte. » (annoncé via `role="status"`). Pas de rouge, pas de secousse.
- Toucher « C'est parti » :
  - **Silence** : la session commence directement. Aucun appel audio, même pas un déverrouillage.
  - **Écouteurs** ou **Je peux parler** : ce toucher sert de geste d'autorisation audio (le développeur y lance l'amorçage de `speechSynthesis` dans le gestionnaire du clic). Vérification de la voix russe (voir § 5). Si elle existe : la session commence.
  - **Voiture** : écran « Avant le départ » (§ 4.1).
- « Mes progrès » : écran Progression. « Réglages » : écran Réglages.

### Mémorisation
Durée et lieu sont stockés sur l'appareil (IndexedDB, avec repli en mémoire). Si le stockage est indisponible, l'app se comporte comme au premier lancement, sans message d'erreur.

### Critère de réussite
Premier lancement : 3 touchers (lieu, éventuellement durée, C'est parti), première carte à l'écran en moins de 10 secondes. Deuxième lancement : 1 toucher.

Pas de compte, pas de tutoriel, pas d'écran de bienvenue, pas de choix de niveau.

---

## 2. Session : cadre commun

### 2.1 En-tête de session (56 px)

De gauche à droite :
1. **Bouton quitter** : icône croix, 48 × 48 px, `aria-label` « Arrêter la session ». En haut à gauche exprès, loin du pouce.
2. **Barre de progression** (flexible), suivie du texte « {n} sur {total} » en `--fs-small` `--text-muted`. `{n}` est le numéro de la carte affichée, `{total}` le nombre de cartes prévues par le moteur **[règle pédagogue]**. Si le moteur ajoute des cartes en cours de route (phrase ratée qui revient), `{total}` augmente : c'est acceptable.
3. **Badge de mode** :
   - Silence : icône haut-parleur barré + « Silence ». Non interactif.
   - Écouteurs / Je peux parler : bouton (même apparence que le badge, cible 44 px) icône haut-parleur barré + « Couper le son ». Voir § 2.6.

On n'affiche pas de compte à rebours : la pression du temps nuit, et la durée annoncée est garantie par la composition de la session.

### 2.2 Quitter : feuille « On s'arrête là ? »

`alert` et `confirm` sont interdits. Toucher la croix (ou « retour » système) ouvre une feuille du bas :

- Titre : « On s'arrête là ? »
- Texte : « Ce que tu as déjà fait est gardé. »
- Bouton principal : « Je continue » (focus initial)
- Bouton secondaire : « Arrêter »

« Je continue », Échap, toucher le voile : la feuille se ferme, la carte reprend dans l'état exact où elle était. Toute lecture audio en cours est coupée à l'ouverture de la feuille.
« Arrêter » : écran Fin de session (variante « arrêt en route », § 6).

### 2.3 Gabarit d'une carte

```
┌──────────────────────────────┐
│ ×   ▓▓▓▓░░░░░  3 sur 12  [Silence] │  en-tête
├──────────────────────────────┤
│ Consigne (petit, gris)       │
│                              │
│   PHRASE (la star)           │  haut du contenu
│   translittération           │
│   [badge registre]           │
│                              │
│   ┌ choix 1 ───────────────┐ │
│   ┌ choix 2 ───────────────┐ │  bas du contenu, sous le pouce
│   ┌ choix 3 ───────────────┐ │
├──────────────────────────────┤
│   [ Bouton principal ]       │  zone d'action / panneau de retour
└──────────────────────────────┘
```

- La consigne est le `<h1>` de la carte (`tabindex="-1"`). À chaque nouvelle carte, le focus est placé dessus, pour que les lecteurs d'écran annoncent la consigne.
- Si le contenu dépasse la hauteur, c'est le contenu qui défile ; l'en-tête et la zone d'action restent fixes.

### 2.4 Afficher une phrase russe (composant commun)

Dans cet ordre, centré horizontalement sur Découverte, aligné à gauche dans les choix :

1. **Phrase** : champ `accent` (avec accents toniques), `lang="ru"`, taille selon la longueur (`systeme-visuel.md` § 2.2).
2. **Translittération** : champ `translit`, en dessous, italique, `--text-muted`. Absente du DOM si le réglage « Afficher la translittération » est désactivé.
3. **Badge de registre** : si `registre` vaut `"tu"`, « on tutoie » ; si `"vous"`, « on vouvoie » ; si `"neutre"`, rien.
4. **Variantes masculin / féminin** (si `variantes` n'est pas `null`) :
   - Partout, on affiche la forme du réglage « Je parle… » (`variantes.m` ou `variantes.f`, version accentuée si fournie).
   - Sur la carte Découverte seulement, une ligne en dessous, `--fs-small` `--text-muted` : « Au féminin : {autre forme} » si l'utilisateur parle au masculin, « Au masculin : {autre forme} » s'il parle au féminin.
   - Si le réglage n'a jamais été fait : voir § 2.5.
5. **Astuce** (si `astuce` n'est pas `null`) : bloc astuce (`systeme-visuel.md` § 4.14), étiquette « Astuce », texte du champ. Affichée sur Découverte et dans le panneau de retour après une erreur. Jamais pendant qu'on cherche la réponse.
6. **Bouton « Écouter »** (modes Écouteurs et Je peux parler uniquement) : bouton secondaire compact, icône haut-parleur + « Écouter », sous la phrase. Pendant la lecture, libellé « J'écoute… » et icône inchangée ; un nouveau toucher relit depuis le début. Vitesse selon le réglage. **En mode Silence, ce bouton n'existe pas dans le DOM** (§ 9).

### 2.5 Première phrase avec variantes : la question du genre

Pas de question au démarrage (pas de tutoriel). La première fois qu'une carte Découverte affiche une phrase avec `variantes` alors que le réglage n'a jamais été fait, un encart apparaît sous la phrase, avant le bouton « Suivant » :

- Texte : « Cette phrase change selon qui parle. Tu parles… »
- Deux boutons secondaires côte à côte : « au masculin », « au féminin »

Tant que l'utilisateur n'a pas répondu, la phrase affiche les deux formes, l'une sous l'autre, chacune précédée de « Homme : » et « Femme : » (`--fs-small`). Le bouton « Suivant » reste utilisable (on ne bloque pas). Au toucher d'un des deux boutons : le choix est mémorisé (même valeur que dans Réglages), l'encart disparaît, la phrase affiche la forme choisie et la ligne « Au féminin / Au masculin : … ». Tant que le réglage n'est pas fait, les exercices utilisent la forme masculine **[à confirmer par le pédagogue : il peut préférer écarter ces phrases des exercices tant que le genre est inconnu]**.

### 2.6 « Couper le son » en cours de session (Écouteurs, Je peux parler)

Pour le cas « je suis en écouteurs et quelqu'un me parle » ou « je débranche mes écouteurs en public ». Toucher le badge « Couper le son » :
- coupe immédiatement toute lecture (`speechSynthesis.cancel()`),
- fait passer la suite de la session en mode Silence : le badge devient « Silence » (non interactif), les boutons « Écouter » disparaissent, et les cartes restantes de type Écoute ou À voix haute sont remplacées par une carte Sens ou Thème de la même phrase **[règle de remplacement à confirmer par le pédagogue]**,
- annonce via `role="status"` : « Son coupé. On continue en silence. »

Pas de retour en arrière possible dans la même session. Le lieu mémorisé pour l'accueil passe à Silence.

**Arrière-plan** : si l'app passe en arrière-plan (`visibilitychange`), toute lecture est coupée. Au retour, la carte est dans le même état, rien ne repart tout seul.

### 2.7 Lecture automatique

Dans les modes Écouteurs et Je peux parler, la phrase russe est lue automatiquement **une fois** :
- à l'arrivée d'une carte Découverte,
- à l'arrivée d'une carte Écoute,
- au moment où la réponse est révélée (À voix haute),
- à l'apparition du panneau de retour d'une carte Sens, Thème, Ordre ou Moule (on entend la bonne phrase).

Jamais en mode Silence.

### 2.8 Retour après réponse (Sens, Thème, Écoute, Moule, Ordre)

La réponse est donnée **en un toucher** pour les QCM : pas de bouton « Valider ».

**Réponse juste**
- Le choix touché passe en état « choisi et juste ».
- Le panneau de retour remplace la zone d'action :
  - verdict : coche + « C'est ça. »
  - bouton principal : « Suivant »
- Avance automatique à la carte suivante 1 200 ms après l'apparition du panneau. En mode sonore, l'avance se fait 400 ms après la fin de la lecture de la phrase (si la lecture dure plus de 1 200 ms). Toucher « Suivant » avance tout de suite.
- **[à valider en test avec Max]** Si l'avance automatique gêne, on la retire et « Suivant » devient obligatoire.

**Réponse fausse**
- Le choix touché passe en « choisi et faux », la bonne réponse en « bonne réponse non choisie », les autres s'estompent.
- Panneau de retour :
  - verdict : croix + « Pas tout à fait. »
  - « La bonne réponse : » puis la phrase juste (russe avec accents et translit si c'est une phrase russe ; français sinon, avec la phrase russe rappelée au-dessus en petit),
  - l'astuce, si elle existe,
  - ligne `--fs-small` `--text-muted` : « On la reverra bientôt. »
  - bouton principal : « Suivant »
- **Pas d'avance automatique** : on laisse le temps de lire. Seul « Suivant » fait avancer.

Le panneau prend le focus sur son verdict (`role="status"` + focus programmé sur le bouton « Suivant » après l'annonce).

---

## 3. Les cartes

Modes autorisés rappelés pour mémoire (brief) ; le choix du type de carte revient au moteur **[règle pédagogue]**.

### 3.1 Découverte (tous les modes sauf Voiture)

**Rôle** : présenter une phrase nouvelle, sans test.

- Consigne : « Nouvelle phrase »
- Phrase française (`fr`) en `--fs-body`, `--text-muted`, au-dessus de la phrase russe. Ordre de lecture : on lit d'abord ce qu'on veut dire, puis comment ça se dit.
- Phrase russe (composant § 2.4), centrée, avec translit, registre, variantes (avec la ligne de l'autre forme), astuce, bouton « Écouter » selon le mode.
- Si la phrase est un moule (`moule` non nul) : sous la phrase, une ligne `--fs-small` : « Ça marche avec d'autres mots : » suivie de 2 ou 3 remplacements en russe (accentués), séparés par des virgules **[le pédagogue dit si on montre les remplacements dès la découverte]**.
- Zone d'action : bouton principal « Suivant ».
- Lecture automatique une fois (modes sonores).

### 3.2 Sens (Silence, Écouteurs, Je peux parler)

**Rôle** : je vois le russe, je retrouve le sens.

- Consigne : « Ça veut dire quoi ? »
- Phrase russe (composant § 2.4), centrée, sans astuce, sans ligne d'autre forme. Bouton « Écouter » selon le mode (pas de lecture automatique à l'arrivée : la lecture n'aide pas à trouver le sens à l'écrit, elle est proposée).
- 3 choix en français, ordre aléatoire.
- Retour : § 2.8.

### 3.3 Thème (Silence, Écouteurs, Je peux parler)

**Rôle** : je sais ce que je veux dire, je retrouve la phrase russe.

- Consigne : « Comment on dit ? »
- Phrase française en `--fs-fr-hero`, centrée. Badge de registre sous la phrase française si `tu` ou `vous` (il faut savoir si on tutoie pour choisir).
- 3 choix en russe (accentués, translit dessous si activée), ordre aléatoire.
- Pas de bouton « Écouter » avant la réponse (il donnerait la réponse).
- Retour : § 2.8.

### 3.4 Ordre (Silence, Écouteurs, Je peux parler)

**Rôle** : reconstruire la phrase russe mot à mot.

- Consigne : « Remets les mots dans l'ordre »
- Phrase française en `--fs-fr-hero`, centrée. Badge de registre si besoin.
- Zone réponse (vide au départ), avec, tant qu'elle est vide, un texte `--fs-small` `--text-muted` : « Touche les mots dans l'ordre ».
- Réserve : tuiles des mots russes (accentués), ordre aléatoire garanti différent de l'ordre juste. Pas de translittération sur les tuiles. La ponctuation finale (`?`, `.`, `!`) n'est pas une tuile : elle s'affiche à la fin de la zone réponse quand toutes les tuiles y sont. La majuscule initiale est conservée telle qu'elle est dans la phrase **[point d'hésitation : elle trahit le premier mot ; on peut mettre toutes les tuiles en minuscule]**.
- Interactions :
  - Toucher une tuile de la réserve : elle va à la fin de la zone réponse ; un emplacement fantôme reste dans la réserve.
  - Toucher une tuile de la zone réponse : elle retourne à son emplacement d'origine dans la réserve.
  - Clavier : les tuiles sont des `<button>` ; Entrée ou Espace font la même chose que le toucher.
  - Deux mots identiques sont deux tuiles distinctes (identifiées par leur position, pas par leur texte).
- Zone d'action : bouton principal « Vérifier », en état incomplet (`aria-disabled`) tant que toutes les tuiles ne sont pas placées. Toucher en état incomplet : annonce « Place tous les mots d'abord. » (`role="status"`, texte sous la zone réponse).
- Vérification : la phrase est juste si l'ordre des mots est identique à la phrase de référence.
- Retour : § 2.8. En cas d'erreur, « La bonne réponse : » affiche la phrase russe complète, accentuée, avec translit.

### 3.5 Écoute (Écouteurs, Je peux parler)

**Rôle** : comprendre à l'oreille.

- Consigne : « Écoute. Ça veut dire quoi ? »
- À la place de la phrase : un gros bouton rond (96 px), icône flèche circulaire, libellé dessous « Réécouter ». Pendant la lecture, libellé « J'écoute… ».
- Lecture automatique à l'arrivée de la carte.
- 3 choix en français.
- Retour : § 2.8. Le panneau de retour affiche aussi la phrase russe (accentuée, translit), puisqu'on ne l'avait pas vue.

### 3.6 À voix haute (Je peux parler)

**Rôle** : produire la phrase, s'auto-évaluer.

**État 1 : je cherche**
- Consigne : « Dis-le en russe, à voix haute »
- Phrase française en `--fs-fr-hero`, centrée. Badge de registre si besoin. Si variantes : rien de spécial, la forme attendue est celle du réglage.
- Zone d'action : bouton principal « Voir la réponse ».

**État 2 : je compare** (après « Voir la réponse »)
- La phrase russe apparaît sous la phrase française (composant § 2.4), avec astuce si elle existe, et bouton « Écouter ».
- Lecture automatique une fois.
- Texte au-dessus des boutons, `--fs-small` `--text-muted` : « Tu l'avais ? »
- Zone d'action : deux boutons côte à côte, même hauteur (56 px), largeur égale :
  - à gauche, bouton secondaire « Pas encore »
  - à droite, bouton principal « Je l'avais »
- Un toucher sur l'un ou l'autre enregistre la réponse et avance tout de suite. Pas de verdict affiché : c'est l'utilisateur qui juge.

### 3.7 Moule (Silence, Écouteurs, Je peux parler)

**Rôle** : sentir qu'une structure sert à dire beaucoup de choses.

- Consigne : « Même moule, autre mot »
- Au-dessus de la phrase, une étiquette `--fs-small` : « Moule : » suivi de `moule.modele` (`lang="ru"`) et, entre parenthèses, de `moule.fr`. Exemple d'affichage : « Moule : Я люблю ___ (J'aime ___) ». Le trou est affiché tel qu'il est dans le contenu (`___`).
- Puis la phrase complète avec le remplacement tiré au hasard. Le mot remplacé est souligné (soulignement 2 px `--accent`, décalé de 4 px) : c'est la seule mise en valeur dans une phrase russe, et elle ne touche pas l'accent tonique puisqu'elle porte sur tout le mot.
- Deux variantes, selon ce que décide le moteur **[règle pédagogue]** :
  - **sens** : phrase russe affichée, 3 choix en français (comme Sens) ;
  - **thème** : phrase française affichée, 3 choix en russe (comme Thème), le mot remplacé souligné dans la phrase française.
- Retour : § 2.8.

---

## 4. Mode Voiture

Principe : **rien à lire, rien à toucher pendant la session.** L'écran est toujours en thème sombre (moins d'éblouissement).

### 4.1 Avant le départ

**Rôle** : expliquer en deux phrases, et obtenir le geste qui autorise l'audio. On y arrive en touchant « C'est parti » avec le lieu Voiture.

- En-tête : bouton flèche retour, `aria-label` « Revenir à l'accueil ».
- Titre : « Prêt pour la route ? »
- Texte : « Je te dis une phrase en français. Tu essaies de la dire en russe, puis tu entends la réponse, deux fois. »
- Texte : « Règle le volume et pose ton téléphone avant de démarrer. »
- Rappel `--fs-small` `--text-muted` : « {durée} de trajet. La session s'arrête toute seule. » Exemple : « 15 min de trajet. La session s'arrête toute seule. »
- Zone d'action : bouton principal très haut (72 px), « Démarrer ». Ce toucher autorise l'audio et lance la vérification des voix (§ 5). Si tout est bon, l'écran « En route » s'affiche.

### 4.2 En route

**Rôle** : rien. L'écran n'est qu'un gros bouton pause.

- **Tout l'écran est le bouton** (un seul `<button>` plein écran, `aria-label` « Mettre en pause »). Inutile de viser : toucher n'importe où met en pause.
- Au centre, un cercle de 60 % de la largeur (max 240 px), fond `--accent`, icône pause 72 px `--on-accent`. Autour, un anneau qui respire pendant que la voix parle (fixe en reduced-motion).
- Aucun texte, aucune phrase affichée, aucun compteur.
- Garder l'écran allumé : demander `navigator.wakeLock.request("screen")` dans un try/catch (sans lui, la lecture s'arrête souvent quand l'écran se verrouille). Si refusé, ne rien afficher. Relâcher le verrou à la fin.
- Luminosité : l'app ne peut pas la régler ; le fond reste `--bg` sombre.

**Ce que dit la voix** (voix `fr-FR` pour le français, `ru-RU` pour le russe) :
- Au démarrage : « C'est parti. Je te dis une phrase en français, à toi de la dire en russe. »
- Puis la boucle : phrase française, pause, russe lent, russe normal, pause, phrase suivante **[durée des pauses, vitesse lente et choix des phrases : règle pédagogue]**.
- Si la phrase a des variantes, on lit la forme du réglage « Je parle… » (masculine si jamais réglé).
- Le registre n'est pas lu (pas de lecture du badge) **[le pédagogue peut vouloir dire « en tutoyant » après la phrase française]**.

**Pause** (toucher n'importe où)
- La voix s'arrête net (`speechSynthesis.cancel()`), puis dit : « Pause. »
- L'icône devient lecture, `aria-label` « Reprendre ».
- Apparaît en haut, seulement en pause : un bouton secondaire « Arrêter la session » (hauteur 56 px, pleine largeur moins les marges). Il ne prend pas tout l'écran : le reste de l'écran reste le bouton « Reprendre ».
- Le temps de session est gelé pendant la pause.

**Reprise** (toucher n'importe où sauf « Arrêter la session »)
- La voix dit « On reprend. » puis relit la phrase en cours depuis le début (phrase française).

**Arrêter la session** (en pause) : la voix ne dit rien, écran Fin de session (variante arrêt en route).

**Interruptions** : si l'app passe en arrière-plan ou si la lecture est interrompue par le système (appel, GPS), l'app se met en pause d'elle-même. Elle ne reprend jamais seule : il faut toucher l'écran.

### 4.3 Fin automatique

- Quand la durée choisie est atteinte, on termine la phrase en cours (pas de coupure au milieu), puis la voix dit : « C'est fini pour aujourd'hui. {n} phrases travaillées. Bonne route. »
  - Si `{n}` vaut 1 : « C'est fini pour aujourd'hui. Une phrase travaillée. Bonne route. »
- L'écran affiche la Fin de session (en thème sombre), à regarder plus tard, à l'arrêt. Aucun son supplémentaire.
- Le verrou d'écran est relâché.

---

## 5. Pas de voix russe sur l'appareil

### Quand
Au toucher de « C'est parti » (Écouteurs, Je peux parler) ou « Démarrer » (Voiture). Les voix se chargent parfois en différé : attendre l'événement `voiceschanged` jusqu'à 1 500 ms avant de conclure. Pendant cette attente, le bouton affiche « Je prépare la voix… » (pas de spinner qui tourne en reduced-motion).

Une voix russe = une voix dont `lang` commence par `ru`. Une voix française = `lang` commence par `fr` (nécessaire seulement en Voiture).

### Écran (pleine page, pas une boîte de dialogue native)

**Modes Écouteurs et Je peux parler**
- Titre : « Pas de voix russe sur ce téléphone »
- Texte : « Ton téléphone ne sait pas encore lire le russe à voix haute. Tu peux faire ta session en silence, avec des exercices écrits. »
- Bouton principal : « Passer en Silence » (lance la session en Silence, avec la même durée ; le lieu mémorisé devient Silence)
- Bouton secondaire : « Revenir à l'accueil »
- Bloc dépliable (`<details>`), titre « Comment ajouter une voix russe », contenu :
  - « Sur iPhone : Réglages, Accessibilité, Contenu énoncé, Voix, puis Russe. »
  - « Sur Android : Paramètres, puis cherche « synthèse vocale », et installe le russe dans le moteur de synthèse. »
  - « Ensuite, reviens ici et relance la session. »

**Mode Voiture**
- Titre : « Pas de voix russe sur ce téléphone »
- Texte : « Sans voix russe, le mode Voiture ne peut pas marcher. Tu pourras faire une session écrite une fois arrivé. »
- Bouton principal : « Revenir à l'accueil »
- Même bloc « Comment ajouter une voix russe ».
- On ne propose pas « Passer en Silence » : on ne pousse pas à lire au volant.

**Voiture, pas de voix française** (voix russe présente)
- Titre : « Pas de voix française sur ce téléphone »
- Texte : « En voiture, je lis les phrases en français avant le russe. Sans voix française, ça ne peut pas marcher. »
- Bouton principal : « Revenir à l'accueil »
- Bloc dépliable « Comment ajouter une voix française », mêmes chemins en remplaçant « Russe » par « Français ».

---

## 6. Fin de session

### Rôle
Faire sentir le progrès, en vrai : quelles phrases, combien. Puis relancer en un toucher.

### Contenu
- Titre, selon le cas :
  - session terminée : « {durée} de russe, c'est fait. » Exemple : « 5 min de russe, c'est fait. »
  - arrêt en route (au moins une carte faite) : « On s'arrête là. Rien n'est perdu. »
  - arrêt en route sans aucune carte faite : « Pas de souci, à la prochaine. » (on n'affiche alors que les boutons)
- Bloc « Nouvelles phrases » (si au moins une) :
  - intertitre : « Tu as découvert » + compte : « 1 phrase » / « {n} phrases »
  - liste : pour chaque phrase, la phrase russe accentuée (`--fs-ru-option`, `lang="ru"`) et, dessous, la phrase française (`--fs-small`, `--text-muted`). Pas de translittération ici (la liste doit rester courte à l'œil).
- Bloc « Révisées » (si au moins une) :
  - intertitre : « Tu as révisé » + « 1 phrase » / « {n} phrases »
  - pas de liste, seulement le compte.
- Ligne de cumul, `--fs-body` : « En tout, tu sais dire {total} phrases. » (`{total}` = phrases acquises, toutes situations ; si 1 : « En tout, tu sais dire 1 phrase. » ; si 0 : ligne absente). La notion d'« acquise » est définie par le pédagogue **[règle pédagogue]**.
- Si des phrases sont devenues acquises pendant cette session : ligne en `--success` avec une coche : « {n} nouvelles phrases acquises aujourd'hui. » (si 1 : « Une nouvelle phrase acquise aujourd'hui. »).
- Zone d'action, empilés :
  - bouton principal : « Encore {durée} » (exemple : « Encore 5 min »). Relance une session avec la même durée et le même lieu, sans repasser par l'accueil (en Voiture : retour à « Avant le départ »).
  - bouton secondaire : « Accueil »

Pas d'étoiles, pas de score en pourcentage, pas de série de jours.

---

## 7. Progression (« Mes progrès »)

### Rôle
Voir d'un coup d'œil ce qu'on sait dire, par situation de vie.

### Contenu
- En-tête : flèche retour (`aria-label` « Revenir à l'accueil »), titre « Mes progrès ».
- Phrase de tête, `--fs-body` : « Tu sais dire {total} phrases. » (si 1 : « Tu sais dire 1 phrase. »)
- Liste des 5 situations, dans l'ordre de `content/ru/index.json`. Pour chacune, une ligne non cliquable (ce ne sont pas des boutons, elles n'en ont pas l'air : pas de contour, pas de chevron) :
  - titre de la situation (champ `titre`), `--fs-body` 600
  - à droite : « {acquises} sur {total} »
  - dessous : barre de progression (décorative, `aria-hidden`), remplissage proportionnel
  - Nom accessible de la ligne : « {titre} : {acquises} phrases acquises sur {total} ».
- Filets `--border-subtle` entre les lignes.

### État vide (aucune phrase acquise ni vue)
- Les 5 situations sont affichées avec « 0 sur {total} » (on voit ce qui attend).
- Phrase de tête remplacée par : « Rien encore. Ta première session est à un toucher. »
- Zone d'action : bouton principal « Commencer » (retour à l'accueil, focus sur « Je suis où ? » si le lieu n'est pas choisi, sinon lance directement la session avec le dernier contexte).

---

## 8. Réglages

### Rôle
Les trois réglages du brief, plus l'apparence. Tout est enregistré dès le toucher, pas de bouton « Enregistrer ».

### Contenu
- En-tête : flèche retour (`aria-label` « Revenir à l'accueil »), titre « Réglages ».
- **Ligne 1, interrupteur**
  - libellé : « Afficher la translittération »
  - aide (`--fs-small`, `--text-muted`) : « Le russe écrit en lettres latines, sous chaque phrase. »
  - par défaut : activé
- **Ligne 2, segments (2)**
  - libellé : « Je parle… »
  - choix : « au masculin », « au féminin »
  - aide : « Certaines phrases changent selon qui parle. »
  - par défaut : aucun choix fait (voir § 2.5)
- **Ligne 3, segments (2)**
  - libellé : « Vitesse de la voix »
  - choix : « Normale », « Lente »
  - aide : « Pour les boutons Écouter. En voiture, chaque phrase est lue lentement puis normalement. »
  - par défaut : « Normale »
  - Un toucher sur un des deux choix ne déclenche **aucun** son (pas d'aperçu sonore : on peut être en Silence).
- **Ligne 4, segments (3)**
  - libellé : « Apparence »
  - choix : « Auto », « Clair », « Sombre »
  - par défaut : « Auto » (suit le téléphone). Clair et Sombre posent `data-theme="light"` ou `data-theme="dark"` sur `<html>`.
- Pied de page, `--fs-small`, `--text-muted` : « Tout reste sur ton téléphone. Rien n'est envoyé. »

---

## 9. Mode Silence : la garantie

Promesse à l'utilisateur : **en Silence, aucun son ne peut partir, même par erreur.** On la tient en trois couches.

1. **Dans le code** (pour le développeur) : une seule fonction passe-plat vers `speechSynthesis` (par exemple `parler()`), qui ne fait rien si le mode de la session est Silence. Aucun autre endroit du code n'appelle `speechSynthesis`. En Silence, on ne lance même pas l'amorçage audio au toucher de « C'est parti ». Aucune lecture automatique.
2. **Dans le DOM** : aucun bouton « Écouter » ou « Réécouter », ni icône de haut-parleur actif, n'est créé. Pas masqués en CSS : absents. Les cartes Écoute et À voix haute ne sont jamais composées en Silence.
3. **À l'écran** : le badge « Silence » (haut-parleur barré) est visible en permanence dans l'en-tête de session. C'est la seule icône de son de l'écran, et elle est barrée.

Pas de vibration non plus, dans aucun mode.

Test à prévoir par `testeur-qa` : en Silence, parcourir une session complète en touchant partout, y compris là où se trouvent les boutons Écouter dans les autres modes, et vérifier qu'aucun appel à `speechSynthesis.speak` n'a lieu (espion sur la fonction).

---

## 10. Accessibilité : récapitulatif

- Contrastes AA vérifiés pour les deux thèmes (`systeme-visuel.md` § 1.2).
- Cibles de 44 px minimum, 48 à 56 px en pratique, 8 px entre deux cibles.
- Une main : toutes les actions qui font avancer sont en bas. Seuls « quitter », « Mes progrès », « Réglages » et les flèches retour sont en haut, et ce ne sont pas des actions fréquentes.
- Focus visible partout, ordre de tabulation = ordre visuel. Focus placé sur la consigne à chaque nouvelle carte, sur le verdict après une réponse, dans la feuille du bas à son ouverture.
- Choix codés en radios natifs (accueil, réglages) ou en `<button>` (QCM, tuiles).
- Juste et faux : icône + texte + couleur, jamais la couleur seule.
- `lang="ru"` sur tout le russe, `lang="ru-Latn"` sur la translittération.
- Le texte grossi à 200 % doit rester utilisable : le contenu défile, rien n'est coupé, la zone d'action reste fixe.
- `prefers-reduced-motion` respecté (`systeme-visuel.md` § 5).
- Clavier sur ordinateur : en QCM, les touches 1, 2 et 3 choisissent le choix correspondant ; Entrée active « Suivant ». Facultatif mais peu coûteux.

---

## 11. Textes : liste complète

Pour copie directe dans le code. Les insécables ne sont pas représentées ici, voir § 2.4 du système visuel.

| Clé suggérée | Texte |
|---|---|
| `accueil.marque` | Vécu |
| `accueil.progres` | Mes progrès |
| `accueil.reglages` | Réglages |
| `accueil.qTemps` | J'ai combien de temps ? |
| `accueil.qLieu` | Je suis où ? |
| `duree.2` / `5` / `15` / `30` | 2 min / 5 min / 15 min / 30 min |
| `lieu.silence` | Silence |
| `lieu.silence.ex` | Salle d'attente, réunion, métro bondé |
| `lieu.ecouteurs` | Écouteurs |
| `lieu.ecouteurs.ex` | Dans le bus, dans une file d'attente |
| `lieu.parler` | Je peux parler |
| `lieu.parler.ex` | Chez moi, en promenade |
| `lieu.voiture` | Voiture |
| `lieu.voiture.ex` | Sur la route, sans les mains |
| `lieu.silence.clair` | en silence |
| `lieu.ecouteurs.clair` | avec écouteurs |
| `lieu.parler.clair` | à voix haute |
| `lieu.voiture.clair` | en voiture |
| `accueil.go` | C'est parti |
| `accueil.goSous` | {durée}, {lieu en clair} |
| `accueil.incomplet` | Dis-moi où tu es |
| `accueil.incompletAide` | Choisis l'endroit où tu es, je m'adapte. |
| `voix.prepare` | Je prépare la voix… |
| `session.quitter` | Arrêter la session |
| `session.compteur` | {n} sur {total} |
| `session.badgeSilence` | Silence |
| `session.couperSon` | Couper le son |
| `session.sonCoupe` | Son coupé. On continue en silence. |
| `quitter.titre` | On s'arrête là ? |
| `quitter.texte` | Ce que tu as déjà fait est gardé. |
| `quitter.continuer` | Je continue |
| `quitter.arreter` | Arrêter |
| `carte.ecouter` | Écouter |
| `carte.ecouteEnCours` | J'écoute… |
| `carte.reecouter` | Réécouter |
| `carte.astuce` | Astuce |
| `carte.tutoie` | on tutoie |
| `carte.vouvoie` | on vouvoie |
| `carte.auFeminin` | Au féminin : {forme} |
| `carte.auMasculin` | Au masculin : {forme} |
| `carte.homme` | Homme : |
| `carte.femme` | Femme : |
| `genre.question` | Cette phrase change selon qui parle. Tu parles… |
| `genre.m` | au masculin |
| `genre.f` | au féminin |
| `decouverte.consigne` | Nouvelle phrase |
| `decouverte.moule` | Ça marche avec d'autres mots : |
| `sens.consigne` | Ça veut dire quoi ? |
| `theme.consigne` | Comment on dit ? |
| `ordre.consigne` | Remets les mots dans l'ordre |
| `ordre.vide` | Touche les mots dans l'ordre |
| `ordre.verifier` | Vérifier |
| `ordre.incomplet` | Place tous les mots d'abord. |
| `ecoute.consigne` | Écoute. Ça veut dire quoi ? |
| `voix.consigne` | Dis-le en russe, à voix haute |
| `voix.voir` | Voir la réponse |
| `voix.question` | Tu l'avais ? |
| `voix.pasEncore` | Pas encore |
| `voix.jeLavais` | Je l'avais |
| `moule.consigne` | Même moule, autre mot |
| `moule.etiquette` | Moule : |
| `retour.juste` | C'est ça. |
| `retour.faux` | Pas tout à fait. |
| `retour.bonne` | La bonne réponse : |
| `retour.reverra` | On la reverra bientôt. |
| `retour.suivant` | Suivant |
| `sr.bonne` | bonne réponse |
| `sr.fauxChoisi` | ton choix, faux |
| `voiture.retour` | Revenir à l'accueil |
| `voiture.titre` | Prêt pour la route ? |
| `voiture.texte1` | Je te dis une phrase en français. Tu essaies de la dire en russe, puis tu entends la réponse, deux fois. |
| `voiture.texte2` | Règle le volume et pose ton téléphone avant de démarrer. |
| `voiture.rappel` | {durée} de trajet. La session s'arrête toute seule. |
| `voiture.demarrer` | Démarrer |
| `voiture.pause` | Mettre en pause |
| `voiture.reprendre` | Reprendre |
| `voiture.arreter` | Arrêter la session |
| `voiture.dit.debut` | C'est parti. Je te dis une phrase en français, à toi de la dire en russe. |
| `voiture.dit.pause` | Pause. |
| `voiture.dit.reprise` | On reprend. |
| `voiture.dit.fin` | C'est fini pour aujourd'hui. {n} phrases travaillées. Bonne route. |
| `voiture.dit.fin1` | C'est fini pour aujourd'hui. Une phrase travaillée. Bonne route. |
| `sansVoix.titre` | Pas de voix russe sur ce téléphone |
| `sansVoix.texte` | Ton téléphone ne sait pas encore lire le russe à voix haute. Tu peux faire ta session en silence, avec des exercices écrits. |
| `sansVoix.silence` | Passer en Silence |
| `sansVoix.accueil` | Revenir à l'accueil |
| `sansVoix.voitureTexte` | Sans voix russe, le mode Voiture ne peut pas marcher. Tu pourras faire une session écrite une fois arrivé. |
| `sansVoix.aide` | Comment ajouter une voix russe |
| `sansVoix.ios` | Sur iPhone : Réglages, Accessibilité, Contenu énoncé, Voix, puis Russe. |
| `sansVoix.android` | Sur Android : Paramètres, puis cherche « synthèse vocale », et installe le russe dans le moteur de synthèse. |
| `sansVoix.ensuite` | Ensuite, reviens ici et relance la session. |
| `sansVoixFr.titre` | Pas de voix française sur ce téléphone |
| `sansVoixFr.texte` | En voiture, je lis les phrases en français avant le russe. Sans voix française, ça ne peut pas marcher. |
| `sansVoixFr.aide` | Comment ajouter une voix française |
| `fin.titre` | {durée} de russe, c'est fait. |
| `fin.titreArret` | On s'arrête là. Rien n'est perdu. |
| `fin.titreVide` | Pas de souci, à la prochaine. |
| `fin.decouvert` | Tu as découvert |
| `fin.revise` | Tu as révisé |
| `fin.phrase1` / `fin.phrases` | 1 phrase / {n} phrases |
| `fin.cumul` | En tout, tu sais dire {total} phrases. |
| `fin.cumul1` | En tout, tu sais dire 1 phrase. |
| `fin.acquises` | {n} nouvelles phrases acquises aujourd'hui. |
| `fin.acquise1` | Une nouvelle phrase acquise aujourd'hui. |
| `fin.encore` | Encore {durée} |
| `fin.accueil` | Accueil |
| `progres.titre` | Mes progrès |
| `progres.tete` | Tu sais dire {total} phrases. |
| `progres.tete1` | Tu sais dire 1 phrase. |
| `progres.vide` | Rien encore. Ta première session est à un toucher. |
| `progres.ligne` | {acquises} sur {total} |
| `progres.ligneSr` | {titre} : {acquises} phrases acquises sur {total} |
| `progres.commencer` | Commencer |
| `reglages.titre` | Réglages |
| `reglages.translit` | Afficher la translittération |
| `reglages.translitAide` | Le russe écrit en lettres latines, sous chaque phrase. |
| `reglages.genre` | Je parle… |
| `reglages.genreAide` | Certaines phrases changent selon qui parle. |
| `reglages.vitesse` | Vitesse de la voix |
| `reglages.normale` | Normale |
| `reglages.lente` | Lente |
| `reglages.vitesseAide` | Pour les boutons Écouter. En voiture, chaque phrase est lue lentement puis normalement. |
| `reglages.apparence` | Apparence |
| `reglages.auto` / `clair` / `sombre` | Auto / Clair / Sombre |
| `reglages.pied` | Tout reste sur ton téléphone. Rien n'est envoyé. |
