# Relais de Vera — mission 002

## Livré
- `docs/pedagogie/phrases-lot2.md` : 5 situations, 49 éléments dont 10 moules (metro 10, pharmacie 9, presenter 10, restaurant 10, urgences 10), aucun doublon avec les 47 existants.

## Décisions prises
- Formes neutres partout où le russe le permet (« je ne me sens pas bien », « on m'a volé », « je ne trouve plus ») : le genre du locuteur n'est pas géré hors variantes.
- Métiers : le moule presenter-001 ne contient que des métiers invariables. Le reste passe par « Je travaille dans ___ ».
- pharmacie à 9 phrases : au-delà, on glisse vers le conseil médical.

## Pour Nadia
- Variantes m/f obligatoires : ru-metro-002 (Je suis perdu), ru-presenter-006 (Je suis étudiant).
- Tournures neutres voulues, à garder si elles sonnent naturel : pharmacie-002, presenter-009 (à mon compte), presenter-010 (à la retraite), urgences-008 (« on m'a volé », impersonnel), urgences-009 (présent).
- Moule presenter-001 : vérifier que les 5 métiers (ingénieur, médecin, comptable, informaticien, avocat) n'ont pas de forme féminine courante qui obligerait des variantes. Si un seul pose problème, le remplacer par un métier invariable. Pas de « врачиха ».
- Registre : vous partout sauf indication « neutre ». Impératifs d'urgence (002, 003, 004) à la forme vous. Pour urgences-001 et 005, donner les formules figées réellement criées (Помогите, Пожар ou équivalent).
- Formules figées à vérifier : ambulance, police, au feu, il y a un blessé, il y a eu un accident. Donner la forme que dirait un natif sous le stress, pas la plus littérale.
- Moules avec terminaisons : metro-005 (« à + lieu »), pharmacie-003 (« mal à + partie du corps », dents au pluriel), pharmacie-006 (« contre + mal »), restaurant-001 (nombre de personnes), restaurant-006 (« sans + nom »). Phrase complète déjà accordée dans chaque remplacement.
- Fournir un `astuce` de 2 lignes max là où la colonne « Intention » en demande.
- Éviter l'ordre libre (`ordre_libre`) sauf si l'ordre russe l'est vraiment.
- Compléter `content/ru/index.json` avec metro, pharmacie, presenter, restaurant, urgences dans cet ordre.

## Points ouverts
- « Je m'appelle ___ » toujours absente (réglage « mon prénom » non codé). La garder pour la phase 1 ou l'ajouter avec des prénoms d'exemple ? À trancher par Sacha.
- Urgences est dernière dans l'ordre du brief mais vague 1 la fait arriver tôt : à confirmer.
- Numéros d'urgence (fiche à part) : à faire valider par un natif.
- « Laissez-moi tranquille ! » écartée, à reproposer.
