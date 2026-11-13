# Bagou : constitution du projet

> Nom de l'app : **Bagou** (décision de Max, 12/11/2026). « Avoir du bagou » : oser parler, avec aisance. Le nom ne se traduit pas, seul le slogan se traduit (« Bagou, ose parler »). Ancien nom de code : Vécu. Le dépôt garde le nom `vecu`. Ce fichier est lu par chaque session et chaque agent. Il fait foi.

## Mission

Permettre à n'importe qui d'apprendre une langue avec des phrases qui servent dans la vraie vie, quels que soient son niveau, l'endroit où il se trouve et le temps dont il dispose.

## Les 3 piliers (fixés par Max, fondateur)

1. **Le contexte d'abord.** L'utilisateur dit combien de temps il a et où il est, et l'app compose la session. 2 min en salle d'attente, en silence : exercice écrit. 30 min en voiture : audio mains libres.
2. **Pour tout le monde, partout, même hors ligne.** Un site installable (PWA) qui fonctionne sans réseau.
3. **Du vécu, pas du scolaire.** On apprend « Combien ça coûte ? », « J'aime me promener le soir », « Je vais aller au foot ». Jamais « sac à dos » ou « chemin de fer » en leçon 2.

## Gouvernance

- **Max, fondateur.** Fixe la vision. Valide toute dépense et toute mise en ligne publique.
- **Sacha, CEO (Claude, session principale).** Fixe les priorités, arbitre, répartit le travail, valide en dernier. Décide sans attendre Max sur tout le reste.
- **Agents spécialisés** (`.claude/agents/`). Chacun reste dans son rôle : ils proposent, le CEO tranche.
- Toute décision structurante est consignée dans `docs/journal.md` (date, décision, raison).

## L'équipe et ses noms

| Nom | Rôle | Agent (`.claude/agents/`) |
|---|---|---|
| Max | Fondateur (humain) | — |
| Sacha | CEO (session principale) | — |
| Vera | Pédagogue | `pedagogue` |
| Nadia | Linguiste russe | `linguiste-russe` |
| Lou | Designer UX | `designer-ux` |
| Kostia | Développeur | `dev-pwa` |
| Boris | Testeur QA | `testeur-qa` |

Léa (utilisatrice témoin simulée) est retirée de l'équipe active le 12/11/2026 (D21) : l'avis d'usage vient de Max et des testeurs réels. Sa fiche est archivée dans `.claude/agents-archives/`.

Max peut appeler chacun par son prénom (« Demande à Vera… ») : le CEO fait intervenir l'agent correspondant.

## Les 4 modes de contexte

| Mode | Situation type | Ce qui est permis |
|---|---|---|
| Silence | Salle d'attente, réunion, transports bondés | Écrit uniquement, aucun son |
| Écouteurs | Transports, file d'attente | Écrit et audio |
| Je peux parler | Chez soi, promenade | Audio et répétition à voix haute |
| Voiture | Trajet | 100 % audio, aucun écran, mains libres |

Durées proposées : 2, 5, 15 et 30 min. La durée annoncée doit être la durée réelle, à 20 % près.

## Règles de contenu (non négociables)

1. **Test du vécu.** Pour chaque phrase, la question est : quelqu'un la dirait-il vraiment pendant ses 30 premiers jours sur place ? Si la réponse est non, la phrase sort.
2. **L'unité est la phrase utile**, rangée dans une situation de vie : au café, faire les courses, parler de ses goûts, sortir, rencontrer quelqu'un, etc.
3. **Phrases-moules.** Privilégier les structures à trou (« J'aime ___ », « Combien coûte ___ ? ») qui multiplient les phrases possibles.
4. **Grammaire, verbes et vocabulaire toujours en contexte.** Par défaut, la grammaire n'apparaît qu'en astuce de 2 lignes au moment où elle sert. L'utilisateur peut aussi choisir un angle de travail (Verbes, Vocabulaire, Grammaire) : il pratique alors un verbe, des mots ou un mécanisme **uniquement à travers des phrases utiles**, jamais en liste ni en tableau isolé, avec une explication de 2 lignes au plus. (Règle modifiée par Max le 12/11/2026, D16.)
5. **Pour le russe** : accent tonique indiqué, translittération disponible, formes masculine et féminine quand le genre de la personne qui parle change la phrase, tutoiement ou vouvoiement signalé.
6. **Répétition espacée par défaut.** Une phrase vue revient jusqu'à être acquise.
7. **Aucun contenu public sans relecture** par un locuteur natif humain. Chaque fichier de contenu porte un `statut` : `brouillon` → `valide-nadia` → `releve-natif` → `publie`. `node scripts/verifier-publication.mjs` refuse la mise en ligne publique tant qu'un fichier n'est pas au moins `releve-natif` (D22).
8. **Rien d'emprunté.** Phrases rédigées par l'équipe, jamais reprises d'un manuel ou d'une appli. Voix : licence vérifiée et notée dans `docs/droits.md` avant tout usage public (D27).

## Choix techniques

- **PWA** en HTML, CSS et JS, sans framework lourd au départ. Le hors ligne passe par un service worker, la progression est stockée sur l'appareil (IndexedDB).
- **Contenu séparé du code** dans `content/<langue>/*.json`. Ajouter une langue, c'est ajouter des fichiers de contenu, sans toucher au code.
- **Audio** : la synthèse vocale de l'appareil suffit pour les prototypes. Avant le lancement public, il faut des voix natives, enregistrées ou générées.
- **Mobile d'abord** : tout doit fonctionner d'une main sur un téléphone.
- **Hébergement** sur GitHub Pages (gratuit, D19). Pages se publie à chaque envoi sur `main` : donc aucun envoi sur `main` sans l'accord de Max. La mise en ligne publique doit aussi être validée par Max.

## Organisation du dépôt

```
CLAUDE.md            cette constitution
.claude/agents/      l'équipe
docs/pilotage.md     vision, décisions, feuille de route, risques
docs/journal.md      journal des décisions
content/<langue>/    les phrases, par situation (JSON)
app/                 le site
```

## Façon de travailler

- **Le processus fait foi : `docs/processus.md`.** Il fixe les modèles par agent, le cycle d'une mission, le format de relais, la définition de « terminé » et les règles anti-doublon.
- **`docs/etat.md` est le registre unique de ce qui existe.** Chacun le lit en premier. Ce qui est validé ne se refait pas. Seul Sacha le met à jour.
- **Max pilote avec 3 commandes** : `/point`, `/mission <nom>` (ou `/mission reprise`) et `/cloture`.
- Les missions prévues sont dans la feuille de route de `docs/pilotage.md`.
- Langue de travail : le français. Les commits sont petits, clairs et écrits en français.

## Reprendre et poursuivre le projet (Mac, cloud, Claude mobile)

Le dépôt GitHub est la seule mémoire partagée. Rien d'important ne vit dans une session de chat ni dans la mémoire locale du Mac (D35).

**Au début de chaque session**
1. Lire, dans cet ordre : la section « Reprise » en tête de `docs/etat.md`, puis `docs/processus.md`, la feuille de route de `docs/pilotage.md`, et les 10 dernières entrées de `docs/journal.md`. Ne rien relire d'autre pour faire le point.
2. Vérifier la branche et le « verrou » de `docs/etat.md`. Sur le Mac (Claude Code) : `git branch --show-current`. Sur mobile, où Git n'est pas disponible : lire la branche indiquée dans « Reprise ». Si la branche est `main`, si elle ne correspond pas à celle notée, ou si le verrou est tenu par une autre session, s'arrêter et le dire à Max. Sur mobile, toujours demander confirmation à Max avant d'écrire.
3. Travailler sur la dernière version de GitHub : Fetch / Pull sur le Mac, lecture du dépôt sur mobile ou dans le cloud.
4. Ne pas refaire ce qui est « validé » dans `docs/etat.md`.

**Pendant la session**
- Consigner une décision importante dans `docs/journal.md` au moment où elle est prise : date, décision, raison.
- Distinguer dans les notes trois choses : **vérifié** (testé, ou lu dans le code), **hypothèse** (à confirmer), **en attente** (décision de Max).

**À la fin, ou avant toute interruption**
1. Mettre à jour la section « Reprise » de `docs/etat.md` : branche de travail, verrou, dernière action, **prochaine action précise** (fichier et étape), points en attente de Max.
2. Enregistrer le travail en commit local sur la branche de travail, jamais sur `main`. Un commit local ne publie rien.

**Règles de publication**
- `main` est la version publiée. Aucun push sur `main`, aucune fusion dans `main` et aucune publication sans l'accord explicite de Max, donné pour chaque opération.
- Tout push distant (sur n'importe quelle branche) attend l'accord de Max.
- Les branches de travail ne déclenchent pas GitHub Pages : le workflow ne se lance que sur un envoi sur `main`. Il peut aussi être lancé à la main (`workflow_dispatch`), donc ne jamais le lancer sans accord de Max.
- Une seule branche de travail active à la fois. Le verrou de `docs/etat.md` indique laquelle, et qui l'utilise, pour que deux sessions ne s'écrasent pas.

## Format du contenu (v0)

```json
{
  "langue": "ru",
  "situation": "cafe",
  "titre": "Au café",
  "niveau": "A1",
  "statut": "valide-nadia",
  "phrases": [
    {
      "id": "ru-cafe-001",
      "fr": "L'addition, s'il vous plaît.",
      "cible": "Счёт, пожалуйста.",
      "accent": "Счёт, пожа́луйста.",
      "translit": "shchyot, pozhálusta",
      "registre": "vous",
      "variantes": null,
      "astuce": null,
      "moule": null
    }
  ]
}
```

- `variantes` : `{ "m": "...", "f": "..." }` quand la forme dépend du genre de la personne qui parle.
- `moule` : `{ "modele": "Я люблю ___", "fr": "J'aime ___", "remplacements": [...] }` pour une phrase-moule. `fr` et `cible` portent la phrase avec le premier remplacement. Chaque remplacement est `{ "fr", "cible", "accent", "translit", "phrase_cible", "phrase_accent", "phrase_translit" }` : le morceau qui va dans le trou, puis la phrase complète, déjà accordée. L'app affiche toujours la phrase complète, sans recomposer le texte elle-même.
- `variantes_fr` (facultatif) : `{ "m": "...", "f": "..." }`, le français complet selon le genre de la personne qui parle. Sur une phrase, ou sur un remplacement de moule (même forme : la phrase française entière). Absent ou `null` : le `fr` vaut pour tous. Genre non choisi : l'app montre les deux formes. S'ajoute à `variantes`, qui ne porte que le russe.
- `content/<langue>/personnage.json` (clé `personnage` de `index.json`, hors de `situations`) : phrases à prénom (`gabarit` avec le jeton `{prenom}`, `personnalise`, `situation`, `apres`), métiers `m`/`f` qui nourrissent un moule (`element`), domaines, dictionnaire et règles de conversion des prénoms. Lu par `app/js/personnage.js`.
- `registre` : `"tu"`, `"vous"` ou `"neutre"`.
- `ordre_libre` (facultatif, `true`) : l'ordre des mots russes est libre dans cette phrase, donc l'exercice Ordre ne la propose pas. Absent, cela vaut `false`.
