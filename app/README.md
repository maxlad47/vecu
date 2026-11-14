# App

Le site installable (PWA) de Vécu, prototype de la phase 0. HTML, CSS et JavaScript (modules ES), sans aucune dépendance externe.
Spécifications : `docs/missions/001-prototype.md`, `docs/pedagogie/`, `docs/design/`, et les arbitrages de `docs/journal.md`.

## Construire

C'est `dist/` qu'on héberge : `app/` à la racine, `content/` dans `dist/content/`, et `sw.js` complété avec la liste réelle des fichiers à mettre en cache et une version calculée sur leur contenu.

```sh
./scripts/build.sh        # sans Node : bash, cp, find, shasum, awk
node scripts/build.mjs    # avec Node : même résultat
```

Après une modification de `app/` ou de `content/`, il faut reconstruire : la version du cache change, et le téléphone récupère la nouvelle version à la visite suivante.

## Lancer en local

```sh
./scripts/build.sh
ruby -run -e httpd dist -p 8123
# puis ouvrir http://localhost:8123/
```

Un serveur est indispensable : les modules ES, `fetch` et le service worker ne marchent pas en `file://`.

## Tests

```sh
# Moteur de session et Leitner, sans navigateur : exemples 1 et 2 de regles-session.md,
# durée simulée indépendante du moteur, Voiture sans onend, fiches corrompues
/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc -m tests/moteur.test.mjs

# Parcours dans Chrome headless (360 × 800), captures dans docs/qa/captures/
ruby tests/serveur.rb &                 # sert la racine du dépôt sur le port 8123
tests/capturer.sh sens dark             # scénarios : voir tests/pilote.html
tests/capturer.sh course light 20000    # QA n° 1 : changer d'écran pendant l'attente des voix

# Outils indépendants de la QA (voir l'en-tête de chaque fichier)
jsc tests/qa/contenu.qa.js ; jsc -m tests/qa/moteur.qa.mjs ; ruby tests/qa/scenarios.rb <scénario>
```

`tests/` n'est jamais copié dans `dist/`. Le pilote charge l'app dans une iframe, la fait avancer en touchant les boutons, remplace la synthèse vocale par une fausse (ou par un espion en Silence) et écrit un rapport.

## Structure du code

```
index.html               la page (vide : tout est construit par js/app.js)
manifest.webmanifest     installation sur l'écran d'accueil
icone.svg, icone-180.png icônes (la PNG sert à iOS, qui refuse le SVG)
sw.js                    service worker : cache d'abord, puis réseau
css/app.css              tous les styles ; couleurs uniquement en variables (thèmes clair, sombre, voiture)
js/
  config.js              constantes : bloc JSON du pédagogue (regles-session.md § 8), échelles, boîtes
  textes.js              textes de l'interface (ecrans-phase0.md § 11)
  contenu.js             chargement de content/<langue>/, ordre par vagues, textes d'un élément (pur)
  leitner.js             jour, boîtes, échéances, effet d'une réponse (pur)
  exercices.js           choix des QCM (leurres), tuiles de l'Ordre (pur)
  moteur.js              moteur de session : quelle carte ensuite, règle d'arrêt (pur, testé sans DOM)
  horloge.js             temps écoulé, pauses exclues
  stockage.js            IndexedDB, avec repli en mémoire (ne lève jamais d'erreur)
  audio.js               synthèse vocale : SEUL accès à speechSynthesis, refusé en Silence
  app.js                 démarrage, navigation entre écrans, bouton retour du téléphone
  ui/
    dom.js               construction du DOM, icônes
    accueil.js           accueil
    ecran-session.js     session écrite ou sonore : toutes les cartes et le retour après réponse
    voiture.js           Avant le départ, En route, boucle audio
    ecrans.js            Fin de session, Mes progrès, Réglages, Pas de voix
    feuille.js           feuille du bas « On s'arrête là ? »
```

Les fichiers « purs » ne touchent ni au DOM, ni au son, ni au stockage : on peut les tester avec `jsc` ou Node.

## Points à connaître

- **Silence** : `audio.js` est le seul fichier qui lit `window.speechSynthesis`, et sa fonction `synthese()` renvoie `null` en Silence. En Silence, aucun bouton Écouter n'est créé.
- **Voiture** : chaque lecture a un minuteur de secours (si `onend` ne vient jamais) et chaque étape vérifie un jeton qui change à chaque pause. La boucle ne peut donc pas rester bloquée.
- **Durée** : le moteur reçoit le temps réel écoulé (pauses, feuille ouverte et arrière-plan exclus) et applique `regles-session.md` § 5.6 et § 6 : 7 cartes au plus par élément, nouveautés en bonus, fin anticipée à 80 %, prolongation. En Voiture, la règle d'arrêt utilise la durée mesurée des cycles déjà joués (`ajusterEstimations`).
- **Navigation** : chaque changement d'écran change un jeton et repasse le son en Silence. Une attente (voix qui se chargent) vérifie le jeton avant d'agir : si l'utilisateur a changé d'écran, elle ne fait rien.
- **Voiture, mains libres** : une pause due à l'onglet masqué ou à l'écran verrouillé se lève seule au retour ; une pause demandée par l'utilisateur attend son toucher. Une erreur de synthèse ne met jamais en pause.
- **Stockage** : chaque fiche lue est validée (`validerFiche` dans `leitner.js`) : réparée, ou remise à zéro si sa boîte est illisible.
- **Langues** : le russe porte `lang="ru"` (y compris dans les astuces, via `texteMixte`), la translittération `lang="fr"`.
- **Variantes de genre** : `variantes.m` / `variantes.f` peuvent être une chaîne (le texte) ou un objet `{ cible, accent, translit }`. Le contenu actuel n'en a aucune.
- **Ajouter une langue** : il suffit des fichiers de `content/<langue>/` et de changer `LANGUE_CIBLE` et `VOIX` dans `config.js`. Les textes de l'interface parlent encore « du russe » : il faudra les rendre génériques.
