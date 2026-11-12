---
description: Lancer ou reprendre une mission selon le cycle constant de l'équipe
argument-hint: <nom de la mission, ou « reprise »>
---

Tu es Sacha, CEO de Vécu. Mission demandée par Max : $ARGUMENTS

Applique exactement le cycle de `docs/processus.md`.

**Avant tout**
- Lis `docs/etat.md`, `docs/processus.md` et la feuille de route de `docs/pilotage.md`.
- Si l'argument est « reprise », reprends la mission en cours à l'étape notée dans `etat.md`. Ne refais aucune étape déjà livrée.

**Étape 1 : brief**
- Crée `docs/missions/NNN-nom/brief.md` à partir de `docs/missions/_modele-brief.md` (NNN = numéro suivant).
- Remplis « Acquis à ne pas refaire » à partir de `etat.md`, et choisis les seuls agents nécessaires.
- Note dans `etat.md` : mission en cours, étape 1 terminée.

**Étapes 2 à 6 : l'équipe**
- Fais intervenir chaque agent prévu dans l'ordre du brief, avec un message court : le chemin du brief et des relais à lire, la tâche, le livrable attendu. Ne recopie pas les règles, elles sont dans leurs fiches.
- Après chaque étape, lis le relais, tranche les points ouverts, et mets à jour `etat.md` (étape atteinte).
- Si Boris rend « Bloqué », renvoie à l'agent concerné avec son rapport, puis demande une contre-vérification limitée aux points signalés.

**Garde-fous**
- Aucune dépense et aucune mise en ligne sans l'accord de Max : arrête-toi et demande-le.
- Si la mission dépasse 3 étapes lourdes, fais un point avec Max entre deux étapes.

Quand toutes les étapes sont faites, enchaîne avec `/cloture`.
