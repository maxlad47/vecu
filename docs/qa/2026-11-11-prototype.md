# QA du prototype (mission 1) : 11/11/2026

**Verdict : Livrable avec réserves.** L'usage normal fonctionne dans les 16 combinaisons de durée et de mode, hors ligne compris. Il faut tout de même corriger le problème n° 1 (une session Silence peut être remplacée par une session qui parle) avant d'envoyer le lien à Max : la correction est petite et la règle n'est pas négociable.

Ce qui a été vérifié : la relecture complète de `app/`, `scripts/` et `content/ru/`, un pilote Chrome indépendant de celui du dev (protocole DevTools, espions posés **avant** le premier script de l'app), une simulation du moteur avec des temps de réponse qui s'écartent des estimations, et des sessions réelles de 2 min.
Mes outils sont dans `tests/qa/` : `contenu.qa.js`, `moteur.qa.mjs`, `cdp.rb`, `espion.js`, `pilote-qa.js` et `scenarios.rb`. Le mode d'emploi est en tête de chaque fichier.

---

## Problèmes, du plus grave au moins grave

### 1. [Majeur, à corriger avant le lien] En Silence, une session peut être remplacée par une session qui parle
**Cause.** `lancer()` (`app.js` l. 94) et le bouton Démarrer de la Voiture (`voiture.js` l. 30) attendent les voix pendant 1,5 s au plus. Leur promesse n'est jamais annulée si l'utilisateur change d'écran entre-temps. Quand elle se résout, elle appelle `aller("session", {mode: "ecouteurs"})` ou `aller("voitureRoute")`, quel que soit l'écran affiché à ce moment. Le garde-fou de `audio.js`, un mode global, est alors remis à « ecouteurs » ou « voiture » par l'écran qui s'ouvre. Ce garde-fou ne suffit donc pas à prouver qu'aucun son ne part en Silence.
**Reproduction** (constatée dans Chrome, les voix arrivant après 1,2 s, comme souvent sur Android au premier appel) :
1. Accueil : choisir Écouteurs et 5 min, puis « C'est parti ». Le bouton affiche « Préparation… ».
2. Dans la seconde qui suit, toucher Réglages, puis revenir.
3. Choisir Silence, puis « C'est parti ». La session Silence s'affiche avec son badge.
4. Environ 0,5 s plus tard, l'écran devient une session Écouteurs (badge « Couper le son ») et lit **« Кофе, пожалуйста. »** à voix haute.

La même chose se produit avec Voiture : « Démarrer », puis la flèche retour, puis une session Silence. Au bout de 1,2 s, la boucle Voiture démarre et dit « C'est parti… ». Même sans passer en Silence, toucher la flèche retour n'annule pas le départ de la Voiture.
**Variante sans voix russe** : avec les mêmes gestes, la session Silence en cours est remplacée par l'écran « Pas de voix russe sur ce téléphone ».
**Correction possible (à arbitrer par le dev)** : un jeton de navigation, ou un nettoyage dans `nettoyer()` de l'écran Voiture avant départ. Toute résolution arrivée après un changement d'écran serait alors ignorée.
**Script** : `ruby tests/qa/scenarios.rb silence-course`.

### 2. [Majeur, risque produit] En Voiture, la session ne va au bout sans toucher que si rien ne l'interrompt
Le comportement est conforme au design (`ecrans-phase0.md` l. 348) : une interruption met l'app en pause, et elle ne reprend jamais seule. Mais il contredit « mains libres, aucun toucher » dès qu'un événement courant survient :
- **Onglet masqué ou écran verrouillé** : `visibilitychange` met en pause. Test : à 10 s, onglet masqué, pause immédiate. Onglet de nouveau visible : toujours en pause 5 s après, donc il faut toucher l'écran. Sur iPhone, le verrou d'écran (`wakeLock`) n'existe pas avant iOS 16.4 et ne marche pas dans une PWA installée avant iOS 18.4. Le verrouillage automatique coupera donc la session au bout de 30 s à 5 min, selon le réglage du téléphone.
- **Interruption par le système** (consigne du GPS, notification) : l'erreur `interrupted` met en pause. Test : interruption simulée à la 6e lecture, session restée en pause pendant plus de 4 min.
- Passer à l'app GPS au premier plan met aussi la session en pause.

À tester en priorité sur le téléphone de Max. À arbitrer par le CEO et le designer : reprise automatique après une interruption brève ? Le conducteur ne devrait pas avoir à toucher son téléphone.
**Script** : `scenarios.rb voiture-cache` et `voiture-interruption`.

### 3. [Moyen] Des données corrompues bloquent la session sur la première carte
L'exigence « jamais de plantage » n'est pas tenue. Si une fiche stockée a un `historique` qui n'est pas un tableau, `ajouterHistorique()` (`leitner.js` l. 49) lève `fiche.historique.push is not a function`. Dans l'interface, après la réponse au QCM, les options sont grisées mais le panneau « Suivant » n'apparaît jamais. Seule la croix permet de sortir. En Voiture, la session s'arrête d'un coup.
**Reproduction** : écrire dans IndexedDB `vecu/progression` la fiche `{id: "ru-cafe-002", boite: 2, echeance: "2000-01-01", historique: "abc"}`, lancer Silence 5 min et répondre à la première carte.
Les autres corruptions testées sont absorbées sans plantage : boîte non numérique ou à 99, échéance invalide, id inconnu, réglages absurdes (`dernierMode: "fusee"`, `apparence: 42`).
**Script** : `scenarios.rb stockage` et `jsc -m tests/qa/moteur.qa.mjs`.

### 4. [Moyen] 20 astuces sur 36 dépassent 2 lignes à 360 px
La règle n° 4 de `CLAUDE.md` fixe une astuce de 2 lignes au plus. Mesuré dans le rendu réel : 12 astuces font 3 lignes, 7 en font 4 et `ru-gouts-006` en fait 5 (`ru-cafe-009`, `ru-courses-003`, `ru-courses-007`, `ru-gouts-002`, `ru-gouts-004`, `ru-gouts-005`, `ru-gouts-006`, `ru-gouts-007`, `ru-sortir-001`, `ru-sortir-002`, etc.). La médiane est de 79 caractères, pour environ 40 caractères par ligne.
Le CEO doit trancher : « 2 lignes » veut-il dire 2 lignes à l'écran ou 2 phrases ? Pour les astuces, c'est au linguiste de raccourcir.

### 5. [Moyen, risque] Voiture : pause d'elle-même si `onend` ne vient jamais et que `cancel()` répond de façon synchrone
Le minuteur de secours de `parler()` appelle `s.cancel()` **avant** `terminer("fini")`. Si le navigateur déclenche `onerror("interrupted")` pendant `cancel()`, la lecture est classée « interrompue » et la Voiture se met en pause. Test avec une synthèse simulée de ce type : pause dès la première phrase, et la session ne finit jamais.
**Chrome macOS vérifié** (vraie synthèse, volume 0) : l'erreur arrive **après** `cancel()`, donc pas de problème. Safari iOS et Chrome Android n'ont pas été vérifiés. Inverser l'ordre (`terminer` puis `cancel`) supprimerait le risque.

### 6. [Mineur] Voix chargées tardivement : faux message « pas de voix »
`verifierVoix()` conclut au bout de 1,5 s. Si la voix russe arrive plus tard (démarrage à froid sur Android), l'utilisateur voit « Pas de voix russe sur ce téléphone » alors qu'elle existe. Reproduit avec des voix arrivant à 2,5 s.
De plus, la fonction se résout dès que la voix russe est là : si la voix française arrive après, la Voiture affiche à tort « Pas de voix française ».

### 7. [Mineur] Durée en Voiture 2 min si `onend` ne vient jamais
Simulation (moteur réel, durée de secours de `audio.js`) : jusqu'à **+25 %** sur certains états de progression. Mesure réelle dans Chrome avec `onend` qui ne vient jamais : 133 s, soit +11 %. Les autres combinaisons sont dans la tolérance (voir plus bas).

### 8. [Mineur] Contenu : test du vécu et cohérence
- `ru-rencontrer-007`, moule « Vous parlez ___ ? » : allemand, italien et espagnol sentent la liste de manuel. Pendant les 30 premiers jours en Russie, on demande l'anglais (et le français). À remplacer, par exemple par « Vous parlez lentement ? » ou « Tu parles anglais ? ».
- `ru-courses-002`, « Je prends un kilo. » / « Я возьму́ килогра́мм. » : incomplet tout seul. Dans la vraie vie, on dit « un kilo de ___ » ou on montre du doigt. Le cas est limite.
- `ru-courses-005`, remplacement 4 (« Сколько **стоят** яблоки? ») : il sort du modèle « Сколько стоит ___ ». La carte Moule souligne « я́блоки » mais pas le verbe qui change. L'astuce l'explique, mais seulement en Découverte et après une erreur.
- Dans les astuces, le russe est accentué de façon inégale (« Приве́т », « Пока́ », mais « Можно », « туалет », « Вкусно », « Пойдём в ») et il est balisé `lang="fr"` (`ecran-session.js` l. 106). Un lecteur d'écran le lira avec la voix française.
- Format, accents et ids : rien à signaler, voir la section « Ce qui est conforme ».

### 9. [Mineur] Interface
- Après une réponse, le focus va sur « Suivant » et non sur le verdict, contrairement à `ecrans-phase0.md` l. 490. Le verdict a `role="status"`, donc l'annonce est probablement faite quand même.
- « Tu sais dire 0 phrases. » (Mes progrès, après une première session sans phrase acquise) : la tournure est maladroite. Il faudrait un texte pour 0.
- IndexedDB qui ne répond jamais : écran vide pendant 2,5 s au lancement, sans indicateur (l'app démarre bien ensuite).
- Icône : seulement en SVG. iOS n'accepte pas le SVG en `apple-touch-icon`, donc l'icône sera une capture d'écran sur l'iPhone. Une PNG de 180 px est à prévoir.

### 10. [Note] Outils de test du dev
- Le test de durée de `moteur.test.mjs` avance le temps de `carte.est`, c'est-à-dire de l'estimation même que le moteur utilise pour décider. Il est circulaire et réussit forcément. Ma simulation fait varier le temps réel (×0,5, ×1,6, tirage au hasard, synthèse modélisée) : voir les résultats plus bas.
- `pilote.html` installe son espion de Silence **après** le chargement de l'app : un accès au démarrage lui échapperait. Mon espion est posé avant tout script (`Page.addScriptToEvaluateOnNewDocument`).

---

## Ce qui est conforme (vérifié)

- **Silence, usage normal** : 0 appel à `speak` et **0 accès** à `speechSynthesis`, vérifiés dans tous ces cas :
  - une session complète de 2 min en touchant tout (boutons, touches 1, 2, 3, Entrée, Échap), avec la feuille « On s'arrête là ? », le bouton retour et l'arrière-plan ;
  - « Encore », Réglages (tous les interrupteurs), Mes progrès ;
  - le rechargement en pleine session ;
  - le passage en Silence après une session Écouteurs et après une Voiture ;
  - « Couper le son » ;
  - « Passer en Silence » depuis l'écran « pas de voix » (3 cas : API absente, aucune voix, seulement le français).

  Aucun bouton Écouter dans le DOM. Par la relecture du code, `synthese()` est le seul accès à la synthèse. La seule faille trouvée est la n° 1.
- **Voiture** : 2 min sans aucun toucher, jusqu'à l'écran de fin : 137 s avec une synthèse normale, 133 s quand `onend` ne vient jamais (le minuteur de secours prend le relais). Annonces de début et de fin présentes. Sans voix française, l'écran « Pas de voix française » s'affiche. Sans voix russe, l'écran « Pas de voix russe » s'affiche, sans proposer le mode Silence, conformément au journal.
- **Durées, sessions réelles de 2 min** : Silence 124 s, Écouteurs 126 s, Je peux parler 127 s, Voiture 137 s. Toutes sont dans les ±20 %.
- **Durées, simulation** (16 combinaisons, 4 états de progression, 4 profils d'utilisateur, 15 tirages) : 5, 15 et 30 min toujours entre +0 et +7 %. 2 min entre +0 et +16 %. Seule exception : le cas n° 7.
- **Stockage** : IndexedDB absent, qui lève une erreur, qui ne répond jamais (l'app démarre en 2,7 s) ou dont l'écriture échoue. Dans tous ces cas, l'app démarre, la session tourne et aucune erreur n'apparaît. Premier lancement : le bouton affiche « Dis-moi où tu es ». Après un rechargement en pleine session, les choix sont mémorisés (15 min, Silence) et les phrases découvertes sont en base.
- **Hors ligne** : le service worker s'active et met 27 entrées en cache. Serveur arrêté : `/`, `/index.html` et `/?utm=1` s'ouvrent, et les sessions Silence et Écouteurs tournent. Si le contenu ne se charge pas (`index.json` ou une situation), le message « Impossible de charger les phrases… Réessayer » s'affiche, sans erreur JS.
- **Contenu** (`tests/qa/contenu.qa.js`) :
  - 5 fichiers JSON valides ; 47 éléments, 47 ids uniques au format `ru-<situation>-NNN` ;
  - 8 à 10 phrases par situation, 2 moules par situation (10 en tout), de 5 à 6 remplacements chacun ;
  - tous les champs obligatoires sont présents ; `accent` sans accents égale `cible`, pour les phrases comme pour les remplacements ;
  - un accent tonique sur chaque mot de plus d'une syllabe, aucun caractère latin caché dans le russe ;
  - translittération présente partout, registre valide, remplacement 0 identique à la phrase principale ;
  - les 4 phrases de Max sont présentes.

  Les écarts du modèle de `ru-gouts-002` et `ru-gouts-004` (« (une chose) », « (faire) ») sont volontaires.
- **Accessibilité à 360 px** : aucun défilement horizontal sur les 9 écrans et types de carte mesurés, y compris avec un texte à 200 %. Aucune cible de moins de 44 px. Focus visible au clavier (contour de 3 px, y compris sur les étiquettes des boutons radio). `prefers-reduced-motion` est respecté : transitions à 0,01 ms et fondu de 120 ms sur la carte. Sur grand écran, colonne de 480 px.
- **Contrastes recalculés** à partir des valeurs réelles lues dans le navigateur : identiques au tableau de `systeme-visuel.md`, par exemple `--text-muted` sur `--bg` à 6,7:1 en clair, `--on-accent` sur `--accent` à 8,8:1 en sombre, `--border` sur `--surface` à 3,6:1 en sombre.
- **Thèmes** : la contrainte du brief est respectée. Les variables sont dans `:root`, avec `@media (prefers-color-scheme: dark)` sur `:root:not([data-theme="light"])` et `:root[data-theme="dark"]`, et un fond explicite sur `body`. Les 4 cas sont vérifiés dans le navigateur (clair, sombre du système, clair forcé sur un système sombre, sombre forcé).
- **Interdits** : aucun `alert`, `confirm`, `prompt` ni `window.open` dans le code ni pendant les tests. Aucune requête vers un autre site, aucune police distante, aucun `@import`. Seul usage de `innerHTML` : des chemins SVG constants.
- **Build** : `build.sh` relancé dans une copie, le `dist/` produit est identique octet pour octet au `dist/` livré. À la relecture, `build.mjs` est équivalent : mêmes exclusions, tri en octets, même format d'empreinte que `shasum`, mêmes remplacements, fin de ligne préservée.

---

## Ce que je n'ai pas pu tester, et pourquoi

- **De vrais téléphones (iOS Safari, Chrome Android)** : je n'ai que Chrome headless sur macOS. Restent donc à vérifier sur le téléphone de Max : le verrou d'écran, le verrouillage automatique en Voiture, le comportement de `cancel()` et `onend` sur WebKit (problème n° 5), l'autorisation de la synthèse après un geste, l'installation sur l'écran d'accueil et l'usage à une main.
- **La qualité réelle des voix russes et françaises de l'appareil** : toutes mes sessions avec son utilisent une synthèse simulée, pour ne rien jouer à voix haute sur la machine. La vraie synthèse n'a servi qu'à une sonde au volume 0.
- **Des sessions réelles de 5, 15 et 30 min** : seule la simulation du moteur les couvre. Les sessions réelles ne font que 2 min.
- **Un lecteur d'écran** (VoiceOver, TalkBack) : rien n'est installé en mode headless. J'ai seulement vérifié les rôles et les libellés à la relecture.
- **`build.mjs` lui-même** : Node est absent. Je n'ai fait qu'une relecture comparée à `build.sh`.
- **La mise à jour du service worker d'une version à l'autre** : je n'ai pas fait deux livraisons successives.
- **La justesse linguistique du russe** : c'est hors de mon rôle. 15 points attendent un natif (`docs/pedagogie/notes-linguiste-ru.md`), ce qui bloque toute mise en ligne publique.

---

## Contre-vérification après le lot de corrections (11/11/2026, après-midi)

**Verdict mis à jour : Livrable avec réserves.** Plus rien de bloquant. Les problèmes n° 1, 3 et 5 sont corrigés, le n° 2 l'est en grande partie ; deux réserves restent à vérifier sur le téléphone de Max.

Tout a été vérifié sur le `dist/` livré, version de cache `8e6caa080842`. Je l'ai reconstruit avec `build.sh` dans une copie : il est identique octet pour octet. Outils utilisés : ceux de `tests/qa/`, plus `tests/qa/contre.rb`.

### État des problèmes du premier passage
| N° | Problème | État | Preuve |
|---|---|---|---|
| 1 | Silence remplacé par une session qui parle | **Corrigé** | `contre.rb course` : 3 variantes (Écouteurs → Réglages → Silence ; Voiture « Démarrer » → retour → Silence ; sans voix russe), voix arrivant après 1,2 s puis après 2,8 s. Dans les 6 cas, une fois la session Silence lancée : 0 `speak`, 0 accès à `speechSynthesis`, le badge « Silence » reste en place, aucun détournement vers un autre écran, aucune erreur. |
| 2 | Voiture en pause sans reprise | **Corrigé en grande partie** | Onglet masqué : pause, 0 lecture tant qu'il est masqué. Onglet de nouveau visible : reprise seule (« On reprend. », puis la phrase rejouée), et la session finit sans toucher en 145 s. Une pause demandée par l'utilisateur ne reprend pas seule. Interruption du système : aucune pause, fin en 137 s. |
| 3 | Fiches corrompues | **Corrigé** | `validerFiche()` répare les fiches au chargement et dans le moteur. Navigateur : 12 cartes jouées sans blocage ni erreur. Moteur (`moteur.qa.mjs`, fiches brutes) : 8 combinaisons sans exception. |
| 4 | Astuces de plus de 2 lignes | **Ouvert** | 17 astuces sur 36 dépassent encore 2 lignes à 360 px (contre 20 avant). Arbitrage du CEO toujours attendu. |
| 5 | Pause si `cancel()` répond de façon synchrone | **Corrigé** | `onend` qui ne vient jamais, avec `onerror` synchrone : fin sans pause en 140 s. Erreur de synthèse sur chaque phrase russe : fin sans pause en 138 s. |
| 6 | Faux message « pas de voix » | **Corrigé** | L'attente passe à 3 s, avec un sondage toutes les 250 ms. La voix française est attendue elle aussi en Voiture. |
| 7 | Voiture 2 min si `onend` ne vient jamais | **Corrigé** | Simulation avec les nouvelles constantes de secours : +10 à +20 %, plus rien hors tolérance. Mesure réelle : 140 s. |

### Durées réelles de 2 min (Chrome, synthèse simulée)
| Mode | Avant | Après |
|---|---|---|
| Silence (une carte toutes les 3 s environ) | 124 s | **100 s (−17 %)** |
| Écouteurs (une carte toutes les 4 s environ) | 126 s | **102 s (−15 %)** |
| Je peux parler | 127 s | 127 s |
| Voiture | 137 s | 137 s |

Toutes ces durées restent dans les ±20 %.

### Nouvelles réserves
- **[Moyen] Des sessions qui finissent pile à −20 %.** La nouvelle règle 6.1 de `regles-session.md` (plafond de cartes par phrase, fin anticipée permise dès 0,8 × D) fait finir beaucoup de sessions exactement à la limite basse. Simulation au premier lancement : à rythme normal, une session de 30 min s'arrête à 24 min en Silence, en Écouteurs et en Je peux parler, et vers 24 min 20 s en Voiture. Pour un utilisateur rapide, le 5 min s'arrête à 4 min. C'est conforme à la règle écrite et dans la tolérance, mais sans aucune marge : la moindre erreur d'estimation fait sortir la session des ±20 %. Le CEO et le pédagogue doivent décider si l'on vise plutôt 0,85 × D, ou plus de contenu au premier lancement.
- **[Majeur, à tester sur le téléphone de Max] Voiture et écran verrouillé.** La pause pendant que l'onglet est masqué existe toujours. Sur un iPhone sans verrou d'écran (`wakeLock`), le verrouillage automatique coupera donc le son jusqu'à ce que l'écran soit déverrouillé. La reprise sera ensuite automatique. Ce n'est plus bloquant, mais c'est à observer en voiture.
- **[Mineur] Des appels à `getVoices()` pendant le Silence.** Si l'utilisateur part en Silence pendant l'attente des voix, l'ancienne attente continue de sonder `getVoices()` jusqu'à la fin de ses 3 s : jusqu'à 12 appels, sans aucun son ni accès à `speechSynthesis` par l'app. Pour être strict sur « aucun appel en Silence », il faudrait arrêter ce sondage dès que l'écran change.

### Non-régression
- **Silence** : session complète en touchant tout, « Encore », Réglages, rechargement, passage en Silence après une session avec son ou une Voiture, « Couper le son ». Partout : 0 `speak`, 0 accès.
- **Pas de voix** : API absente, aucune voix, seulement le français, dans les 3 modes avec son. Le bon écran s'affiche, et « Passer en Silence » donne 0 lecture.
- **Stockage** : IndexedDB absent, qui lève une erreur, qui ne répond jamais (l'app s'affiche en 1,7 s) ou dont l'écriture échoue. Tout fonctionne, et les choix sont gardés après un rechargement. La tournure « 0 phrases » est corrigée en « 0 phrase ».
- **Hors ligne** : 28 entrées en cache, les 3 adresses s'ouvrent, Silence et Écouteurs tournent. Si le contenu manque, le message s'affiche sans erreur.
- **Accessibilité** : à 360 px, aucun débordement ni cible de moins de 44 px. Focus, thèmes, mouvement réduit, colonne de 480 px et texte à 200 % : rien n'a changé. Aucune requête vers un autre site.
- **Contenu et moteur** : contenu conforme (seuls les écarts volontaires déjà connus). Tests du dev : 620 vérifications réussies, 0 échec.

### Outils
Le `NoMemoryError` venait de mon outil, pas de l'app. Je relançais Chrome sur le même port de débogage, et le flux websocket se désynchronisait. J'ai mis en place un port par instance de Chrome, une limite de taille sur les trames et un nombre borné d'événements gardés en mémoire (`tests/qa/cdp.rb`, `scenarios.rb`). L'attente du scénario « sans voix » passe à 3,6 s. Deux Chrome headless orphelins de ces runs plantés ont été arrêtés. Aucun serveur ni Chrome lancé par moi ne tourne encore.
