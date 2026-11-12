# Vécu : document de pilotage

Dernière mise à jour : 11/11/2026, par le CEO (mission 1 livrée)

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
| D8 | Audio en 3 étapes : voix de l'appareil (phase 0), voix neuronales pré-générées en fichiers audio, via l'offre gratuite d'Azure ou des voix libres (phases 1 et 2), enregistrements d'un natif humain pour les phrases clés (phase 3). Pas de Higgsfield (pas de crédits). | Zéro coût au départ, une qualité qui monte à chaque phase, et des fichiers audio intégrés à l'app, donc identiques sur tous les téléphones et disponibles hors ligne. |
| D9 | Garde-fou : les dépenses et la mise en ligne publique sont validées par Max | |
| D10 | Équipe de 6 agents spécialisés dans Claude Code, le CEO orchestre | Chaque rôle a ses règles et son couloir. Le CEO tranche. |
| D11 | Backlog dans les Issues GitHub, hébergement sur Netlify | Un minimum d'outils, pas de bruit. |
| D12 | Pas d'agent « veilleur d'outils ». Revue des outils par le CEO à chaque changement de phase | Un agent dédié pousserait à empiler des outils. On part du besoin, pas de l'outil. |

## Feuille de route

| Phase | Contenu | Critère de passage |
|---|---|---|
| **0 : Prototype** | Écran temps et lieu, 5 situations, exercices écrits et audio, mode voiture, répétition espacée simple | Max l'ouvre spontanément pendant 2 semaines |
| **1 : MVP** | Vraie PWA hors ligne, 15 situations, test de niveau en 2 min, saisie en cyrillique, phrases-moules interactives | Les rapports QA sont « Livrable », l'utilisateur témoin donne au moins 7/10 |
| **2 : Bêta** | 10 à 20 testeurs de l'entourage, mesure de l'usage, relecture par un natif | La moitié des testeurs reviennent la 2e semaine |
| **3 : Lancement** | 2e langue, voix natives, mise en ligne publique | Validation de Max |

### Missions prévues

Chaque mission suit le même cycle (`docs/processus.md`). Une mission reçoit son numéro **au moment où elle est lancée**, pas quand elle est prévue : la liste ci-dessous n'est pas un ordre obligatoire. Sacha la réajuste selon les retours de Max.

| N° | Mission | Phase | Agents | Statut |
|---|---|---|---|---|
| 001 | Prototype jouable | 0 | tous | fait (11/11) |
| — | Organisation de l'équipe (modèles, processus, anti-doublon) | 0 | Sacha | fait (12/11) |
| — | Test réel par Max pendant 2 semaines, puis bilan | 0 | Max, Sacha | en cours (jusqu'au 25/11 environ) |
| — | Corrections issues du test de Max | 1 | selon les retours | à faire |
| 002 | 5 nouvelles situations : métro et directions, pharmacie et santé, se présenter, restaurant, urgences | 0 (avance sur la 1) | Vera, Nadia, Boris, Léa | fait (12/11) |
| — | 5 nouvelles situations : hôtel, au téléphone, chez des amis, banque et argent, le temps qu'il fait | 1 | Vera, Nadia, Boris | à faire |
| — | Réglages « mon prénom » et « mon métier », variantes de genre complètes | 1 | Vera, Nadia, Lou, Kostia, Boris | à faire |
| — | Audio pré-généré (voix de qualité, Voiture écran verrouillé). Compte Azure à valider par Max | 1 | Kostia, Boris | à faire |
| — | Écrire la réponse (saisie en cyrillique ou en translittération) | 1 | Lou, Kostia, Boris, Léa | à faire |
| — | Test de niveau en 2 min et phrases-moules interactives | 1 | Vera, Lou, Kostia, Boris, Léa | à faire |
| — | Scènes : petits dialogues de 4 à 6 phrases pour les sessions de 15 et 30 min | 1 | Vera, Nadia, Lou, Kostia, Boris, Léa | à faire |
| — | Revue de phase 1 : bilan, revue des outils (D12), feuille de route de la phase 2 | 1 | Sacha, Max | à faire |

## Risques identifiés
- **Le contenu est le vrai chantier**, pas la technique : qualité des phrases, audio natif, variantes. C'est là qu'on met l'effort.
- **La concurrence est lourde.** Notre différence (le contexte d'abord, le vécu) doit se voir dès le premier écran, sinon on n'est qu'un clone de plus.
- **Le mode « Je peux parler »** : évaluer la prononciation demande le micro et la reconnaissance vocale. On le garde pour la phase 1. En phase 0, c'est de l'auto-évaluation.
- **Le genre grammatical en russe** (хотел / хотела) : il faut demander le genre à l'utilisateur, ou préférer des formes neutres.
- **Les limites du linguiste IA** : relecture par un natif obligatoire avant toute mise en ligne publique.

## Questions ouvertes (non bloquantes)
- Nom : **Bagou**, choisi le 12/11 (D15). Il reste à vérifier la marque, le domaine et les stores avant le lancement public.
- Modèle économique (gratuit, freemium, abonnement) : à trancher en phase 2.

## État d'avancement
- **11/11/2026 : mission 1 livrée** (prototype de la phase 0). Lien de test privé pour Max. Le test de 2 semaines commence.
- **Backlog de la phase 1, issu de la mission 1** :
  - situations « métro et directions », « pharmacie et santé », « se présenter » (avec son métier et son prénom) ;
  - fichiers audio pré-générés, pour que la Voiture marche écran verrouillé ;
  - textes d'interface qui ne disent plus « russe » en dur ;
  - relecture du contenu par un natif (`docs/pedagogie/notes-linguiste-ru.md`) ;
  - recalage des durées des cartes d'après les sessions réelles de Max.
  - exercice « écrire la réponse » (translittération ou clavier russe, tolérant aux petites fautes), pour les phrases déjà bien installées ;
  - essai de « scènes » : 4 à 6 phrases d'une situation enchaînées comme un petit dialogue (sessions de 15 et 30 min). Le vrai « mode histoire » avec un personnage viendra en phase 2.
