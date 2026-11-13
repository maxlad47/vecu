# Relais de Vera — mission 013

## Livré
- `docs/pedagogie/test-niveau.md` : conception complète (12 témoins, leurres, arrêt, placement, boîtes, ton du résultat, limites).

## Décisions prises
- 12 témoins, une phrase par situation, tous tirés de `content/ru/*.json` (ids dans le tableau de la section 2). Aucune phrase nouvelle.
- Voiture exclue : le test demande un écran pour toucher.
- Arrêt après 2 erreurs de suite ; les témoins non posés restent « non testés ».
- Résultat : nombre de témoins réussis au premier toucher, exprimé en « X situations sur 15 ».
- Amorce : réussi = boîte 2 (J+2), raté = boîte 1 (J+1), non testé = boîte 0. Refaire le test ne touche que les boîtes 0.

## Pour Kostia
- Les 12 ids, dans l'ordre de la section 2, avec leurs leurres (ids indiqués au tableau).
- Modes Silence, Écouteurs, Je peux parler. Audio facultatif.
- Placement et amorce : section 5 du fichier livré.

## Pour Nadia
- Aucune phrase à traduire.
- À vérifier : les 24 leurres ne sont jamais une bonne réponse à la phrase française. Liste dans le tableau de la section 2.
- À confirmer : le découpage des témoins 10 à 12 comme « proche A2 » (génitif après une préposition).

## Points ouverts
- **Niveau** : les 15 fichiers sont tous étiquetés `"niveau": "A1"`. Il n'existe aucune phrase A2. Le brief disait le contraire. Sacha tranche.
- **Hasard** : un débutant qui devine obtient en moyenne 4 réussites sur 12. Le test se corrige en 2 jours (faux positif redescendu en boîte 1 au rappel). Acceptable ?
- **Situations non testées** : amis, meteo, telephone. Valider.
- **`repetition-espacee.md`** : ajouter un type `test` à l'historique. Non édité, car le fichier est validé.
- **Git non fait** : cette session n'a pas l'outil Bash. Je n'ai donc pas pu cloner, créer la branche, committer ni pousser. Les fichiers sont écrits dans `/home/claude/m013/` sans dépôt git. Le commit et le push restent à faire.
- **Co-auteur du commit** : la consigne demandait Sonnet 5.5, le rappel système indique Haiku 5.5 (le modèle réel de Vera). À trancher.
