# Vécu : document de pilotage

Dernière mise à jour : 12/11/2026 (soir), par le CEO (décisions de Max : périmètre v1, objectif, relecture, voix)

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
| D10 | Équipe d'agents (5 depuis D21) spécialisés dans Claude Code, le CEO orchestre | Chaque rôle a ses règles et son couloir. Le CEO tranche. |
| D11 | Backlog dans les Issues GitHub, hébergement sur Netlify | Un minimum d'outils, pas de bruit. |
| D19 | Hébergement sur GitHub Pages au lieu de Netlify (remplace la 2e partie de D11). Dépôt public. | Gratuit sans compteur de crédits ni badge, largement suffisant pour quelques testeurs. |
| D12 | Pas d'agent « veilleur d'outils ». Revue des outils par le CEO à chaque changement de phase | Un agent dédié pousserait à empiler des outils. On part du besoin, pas de l'outil. |

| D20 | Déclencheurs stricts par agent ; Boris une fois avant fusion ; Vera + Nadia forment un duo contenu (12/11/2026) | Moins d'allers-retours et de tokens (`docs/processus.md` §6 bis). |
| D21 | Léa retirée de l'équipe ; avis d'usage = Max, puis 5 testeurs réels | Un testeur simulé fausse la mesure que l'on cherche. |
| D22 | Porte de relecture native : statut par fichier de contenu, `scripts/verifier-publication.mjs` | Une faute de russe publiée détruit la confiance. |
| D23 | Règles de tokens chiffrées (`docs/processus.md` §7) ; Opus 1 à 2 appels par phase | Budget zéro. |
| D24 | Audits d'une page, avec déclencheurs (`docs/audits.md`) | Pas d'audit sans déclencheur. |
| D25 | **Périmètre v1 (révisé par Max le 12/11/2026 au soir)** : 15 situations, 4 modes, répétition espacée, hors ligne, personnage, dialogues, carnet **et** les quatre fonctions que Sacha proposait de reporter : statistiques avancées, saisie cyrillique, thèmes de vocabulaire, test de niveau. Max les garde toutes dans la v1. Ordre de construction : voir D28. | Décision du fondateur. Risque assumé : une v1 plus longue avant la bêta ; il est réduit par l'ordre D28 (une fonction à la fois, chacune testée par Max avant la suivante). |
| D28 | **Ordre des 4 fonctions de la v1** : 1. statistiques avancées, 2. saisie cyrillique, 3. thèmes de vocabulaire, 4. test de niveau (proposé par Sacha le 12/11, à valider par Max) | 1 : petite (la mesure d'usage et les maquettes existent déjà) et elle dit si Max revient. 2 : surtout du code, utile à son apprentissage. 3 : gros chantier de contenu (Vera, Nadia, relecture native), donc lancé tôt mais après les deux premières. 4 : en dernier, car il faut assez de contenu étiqueté par niveau pour qu'il place vraiment quelqu'un. |
| D29 | **Objectif** : outil personnel d'abord (Max et 5 testeurs au plus). La décision « produit public » se prend après la bêta (12/11/2026, Max) | Évite de payer marque, droits et voix avant d'avoir mesuré l'usage réel. |
| D30 | **Relecture native : gratuite**, par un natif de l'entourage de Max ou de ses cours de russe. **Voix : on garde la voix de l'appareil**, le compte Azure est repoussé (12/11/2026, Max) | Budget zéro. La porte D22 reste fermée tant qu'aucun fichier n'est « releve-natif ». |
| D26 | Progression : demande de stockage persistant + export/import d'un fichier + rappel après 7 jours + mesure d'usage locale (jours actifs, minutes, sessions) dans Réglages | Safari peut vider les données d'un site peu utilisé ; sans mesure on ne sait pas si l'app marche. |
| D27 | Droits, marque, mentions légales : `docs/droits.md`, à vider avant toute mise en ligne publique ; phrases rédigées par l'équipe | Prérequis légal et financier de la phase 3. |

## Feuille de route

| Phase | Contenu | Critère de passage |
|---|---|---|
| **0 : Prototype** | Écran temps et lieu, 5 situations, exercices écrits et audio, mode voiture, répétition espacée simple | Max l'ouvre spontanément pendant 2 semaines |
| **1 : MVP** | Vraie PWA hors ligne, 15 situations, test de niveau en 2 min, saisie en cyrillique, phrases-moules interactives | Les rapports QA sont « Livrable », Max l'ouvre au moins 5 jours sur 7 pendant 2 semaines |
| **2 : Bêta** | 10 à 20 testeurs de l'entourage, mesure de l'usage, relecture par un natif | La moitié des testeurs reviennent la 2e semaine |
| **3 : Lancement** | 2e langue, voix natives, mise en ligne publique | Validation de Max |

### Missions prévues

Chaque mission suit le même cycle (`docs/processus.md`). Une mission reçoit son numéro au moment où elle est lancée. Ordre décidé avec Max le 12/11 (D17).

| N° | Mission | Phase | Agents | Statut |
|---|---|---|---|---|
| 001 | Prototype jouable | 0 | tous | fait (11/11) |
| 002 | 5 nouvelles situations : métro, pharmacie, se présenter, restaurant, urgences | 0 | Vera, Nadia, Boris | fait (12/11) |
| 003 | Design Bagou : identité russe, parcours d'accueil, menu, carnet, progrès, matriochka (maquettes) | 0 | Lou | fait (12/11) |
| 004 | 5 dernières situations : hôtel, au téléphone, chez des amis, banque et argent, le temps qu'il fait (branche à part) | 0 | Vera, Nadia, Boris | fait (12/11), attend l'accord de Max |
| 005 | Bagou dans l'app : identité, parcours d'accueil, choix des thèmes, menu | 0 | Kostia, Boris | fait (12/11) |
| — | Test réel par Max, puis bilan | 0 | Max, Sacha | en cours (jusqu'au 25/11 environ) |
| — | 1. Corrections issues du test | 1 | selon les retours | à faire |
| — | 3. Mon carnet et la matriochka | 1 | Lou, Kostia, Boris | à faire |
| 010 | Mes progrès : statistiques avancées (fonction n° 1 de D28) | 1 | Kostia, Boris | fait sur la branche `mission-010-statistiques` (13/11), Boris « Livrable avec réserves » corrigées, attend le test de Max |
| — | 5. Audio pré-généré | 1 | Kostia, Boris | repoussé (D30 : voix de l'appareil pour l'instant) |
| — | 6. Les angles : Verbes, Vocabulaire, Grammaire en contexte (D16) | 1 | Vera, Nadia, Lou, Kostia, Boris | à faire |
| 011 | Saisie en cyrillique, « écrire la réponse » (fonction n° 2 de D28) | 1 | Kostia, Boris | fait sur la branche `mission-011-cyrillique`, contre-vérifié « Livrable avec réserves mineures » (translittération féminine : voir mission 7d), attend le test de Max |
| 012 | Univers de vocabulaire : 5 univers, 10 moules, 50 remplacements (fonction n° 3 de D28) | 1 | Vera, Nadia, Kostia, Boris | fait sur la branche `mission-012-themes`, Boris « Livrable avec réserves » corrigées, russe `valide-nadia` : à faire relire par un natif, attend le test de Max |
| 013 | Test de niveau en 2 min (fonction n° 4 de D28) | 1 | Vera, Nadia, Kostia, Boris | fait sur la branche `mission-013-niveau`, Boris « Livrable avec réserves » corrigées, attend le test de Max |
| — | 7d. Scènes, variantes de genre complètes (dont translittération féminine propre : voir QA 011) | 1 | à répartir | à faire |
| — | Revue de phase 1 : bilan, revue des outils (D12), feuille de route de la phase 2 | 1 | Sacha, Max | à faire |

## Plan des 3 prochaines semaines (D25, 12/11/2026)
Le fond d'abord, le design reste figé.
- **Semaine 1** : schéma figé (fait : `statut`), périmètre v1 décidé par Max (fait, D25 révisée), nom vérifié (recherche web faite le 12/11 : **conflit possible, voir Questions ouvertes** ; INPI à vérifier à la main), sauvegarde et mesure d'usage testées sur iPhone (code fusionné dans `main` le 12/11, test de Max à faire), 3 situations pilotes à faire relire par un natif de l'entourage de Max (D30) : **café, se présenter, métro** (proposition de Sacha : les plus utiles dès le jour 1).
- **Semaine 2** : test hors ligne réel (app installée, mode avion, 24 h), choix du relecteur natif et de la voix (budget : décision de Max), 15 situations complètes.
- **Semaine 3** : 5 testeurs réels, lecture des jours actifs, boucle du 15e jour (« situation du jour » avec un mini-défi réel, rappel discret, série qui pardonne un jour d'oubli), corrections.

## Angle de risque principal
La qualité du russe publié et le retour au 15e jour. Test d'honnêteté : le contenu de Bagou doit battre une simple liste de phrases dans Anki, sinon la proposition tombe. Vérification à la semaine 3 : Max utilise Bagou 5 jours sur 7.

## Risques identifiés
- **Le contenu est le vrai chantier**, pas la technique : qualité des phrases, audio natif, variantes. C'est là qu'on met l'effort.
- **La concurrence est lourde.** Notre différence (le contexte d'abord, le vécu) doit se voir dès le premier écran, sinon on n'est qu'un clone de plus.
- **Le mode « Je peux parler »** : évaluer la prononciation demande le micro et la reconnaissance vocale. On le garde pour la phase 1. En phase 0, c'est de l'auto-évaluation.
- **Le genre grammatical en russe** (хотел / хотела) : il faut demander le genre à l'utilisateur, ou préférer des formes neutres.
- **Les limites du linguiste IA** : relecture par un natif obligatoire avant toute mise en ligne publique.

## Questions ouvertes (non bloquantes)
- Nom : **Bagou**, choisi le 12/11 (D15). **Alerte du 12/11 soir** : une société parisienne nommée Bagou (site bagou.co) affiche pour mission d'aider étudiants, entrepreneurs et collaborateurs à gagner en confiance à l'oral, dans la catégorie formation. Même nom, mission voisine. Une société de vêtements nommée BAGOU existe aussi à Rennes (autre secteur). Non vérifié : l'état exact de leurs marques à l'INPI (la base ne se consulte pas depuis ici). Sans conséquence pour un outil perso (D29) ; à trancher par Max avant toute mise en ligne publique : garder le nom, ou en chercher un autre.
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
