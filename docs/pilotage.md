# Vécu : document de pilotage

Dernière mise à jour : 11/11/2026, par le CEO

## Vision
Apprendre une langue avec des phrases qui servent dans la vraie vie, n'importe où, n'importe quand, au rythme et selon les contraintes de chacun.

**Ce qui nous distingue en 10 secondes :** « J'ai 5 minutes, je suis en salle d'attente » → l'app lance tout de suite une session adaptée, avec des phrases qu'on utilisera vraiment.

## Décisions du CEO

| # | Décision | Pourquoi |
|---|---|---|
| D1 | Site installable (PWA) avant une appli sur les stores | Un seul code pour téléphone, tablette et ordinateur, le hors ligne possible, pas de frais ni de validation des stores. Les applis natives viendront plus tard s'il y a de la traction. |
| D2 | Premier couple de langues : français → russe | Max est l'utilisateur zéro et teste chaque jour. L'architecture est multilingue dès le départ. La 2e langue sera choisie après les tests (probablement l'anglais ou l'espagnol, plus gros marché). |
| D3 | L'unité d'apprentissage est la phrase utile, rangée par situation de vie | C'est le pilier « du vécu, pas du scolaire ». |
| D4 | Phrases-moules (« J'aime ___ ») | Un moule et quelques mots interchangeables donnent des dizaines de phrases. |
| D5 | 4 modes de contexte : Silence, Écouteurs, Je peux parler, Voiture | C'est le pilier « le contexte d'abord ». |
| D6 | Répétition espacée intégrée par défaut | Max veut beaucoup de répétition, et c'est ce qui fait retenir. |
| D7 | Niveaux exprimés en situations maîtrisées, alignés en coulisse sur le CECRL (A1 à B2) | Plus motivant qu'une étiquette « A2 ». |
| D8 | Audio : synthèse vocale de l'appareil pour le prototype, voix natives avant le lancement | La synthèse est gratuite et marche hors ligne sur la plupart des téléphones. La qualité native est indispensable pour la compréhension orale. |
| D9 | Garde-fou : les dépenses et la mise en ligne publique sont validées par Max | |
| D10 | Équipe de 6 agents spécialisés dans Claude Code, le CEO orchestre | Chaque rôle a ses règles et son couloir. Le CEO tranche. |
| D11 | Backlog dans les Issues GitHub, hébergement sur Netlify | Un minimum d'outils, pas de bruit. |

## Feuille de route

| Phase | Contenu | Critère de passage |
|---|---|---|
| **0 : Prototype** | Écran temps et lieu, 5 situations, exercices écrits et audio, mode voiture, répétition espacée simple | Max l'ouvre spontanément pendant 2 semaines |
| **1 : MVP** | Vraie PWA hors ligne, 15 situations, test de niveau en 2 min, saisie en cyrillique, phrases-moules interactives | Les rapports QA sont « Livrable », l'utilisateur témoin donne au moins 7/10 |
| **2 : Bêta** | 10 à 20 testeurs de l'entourage, mesure de l'usage, relecture par un natif | La moitié des testeurs reviennent la 2e semaine |
| **3 : Lancement** | 2e langue, voix natives, mise en ligne publique | Validation de Max |

## Risques identifiés
- **Le contenu est le vrai chantier**, pas la technique : qualité des phrases, audio natif, variantes. C'est là qu'on met l'effort.
- **La concurrence est lourde.** Notre différence (le contexte d'abord, le vécu) doit se voir dès le premier écran, sinon on n'est qu'un clone de plus.
- **Le mode « Je peux parler »** : évaluer la prononciation demande le micro et la reconnaissance vocale. On le garde pour la phase 1. En phase 0, c'est de l'auto-évaluation.
- **Le genre grammatical en russe** (хотел / хотела) : il faut demander le genre à l'utilisateur, ou préférer des formes neutres.
- **Les limites du linguiste IA** : relecture par un natif obligatoire avant toute mise en ligne publique.

## Questions ouvertes (non bloquantes)
- Nom définitif. « Vécu » est un nom de code : il faudra vérifier les marques déposées et les noms de domaine.
- Modèle économique (gratuit, freemium, abonnement) : à trancher en phase 2.
