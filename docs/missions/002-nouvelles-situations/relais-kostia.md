# Relais de Kostia : mission 002 (tests)

Tests seulement : `app/` et `content/` inchangés.

- `tests/moteur.test.mjs` ne dépend plus du volume de contenu : nombre d'éléments, de moules et ordre par vagues sont recalculés depuis `content/ru/index.json` et les fichiers listés. Les règles testées (durées, Leitner, composition, Silence) sont identiques.
- Lancement : `node tests/moteur.test.mjs` ou `node --test tests/moteur.test.mjs`, sans shim (documenté en tête du fichier). Code de sortie 1 s'il y a un échec.
- Réserve connue : « Voiture 2 min, tout dû, onend jamais » (23 %) est un avertissement, pas un échec (décision de Sacha). Le moteur ne change pas ; la mission audio pré-généré donnera des durées exactes.
- Résultat : 619 vérifications, 0 échec, 1 avertissement. `node scripts/build.mjs` passe (33 fichiers).

## Pour Boris
- Relancer `node tests/moteur.test.mjs` : attendu 0 échec et exactement 1 ligne « AVERTISSEMENT ».
- Vérifier que l'avertissement disparaît bien si l'écart repasse sous 20 %, et qu'un autre cas hors 20 % reste un échec.
- Pas de changement d'app : pas de test navigateur nécessaire pour ce relais.
