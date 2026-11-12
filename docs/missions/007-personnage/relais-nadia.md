# Relais de Nadia, mission 007 (personnage), 12/11/2026
Livré : `content/ru/personnage.json` (3 phrases, 13 métiers m/f, 6 domaines « Autre », prénoms), `index.json` (clé `personnage`), 8 doutes dans `notes-linguiste-ru.md`.

## 1. Prénom latin vers cyrillique (décision de Max : conversion automatique, correction possible)
- **Étape 1, dictionnaire** (41 prénoms courants, avec l'accent tonique) : Max → Макс, Julien → Жюлье́н, Nicolas → Николя́. On compare sans majuscules ni accents ; un prénom composé se traite partie par partie (Jean-Pierre → Жан-Пьер).
- **Étape 2, règles** (`prenoms.regles.table`, lue de gauche à droite, la première règle qui s'applique gagne) : ch → ш, j → ж, ou → у, oi → уа, au/eau → о, u → ю, eu → ё, ai → е, é → е (э au début), c/g devant e, i → с/ж, s entre voyelles → з, an/en → ан, in/ain → ен, on → он (devant consonne ou en fin), l en fin → ль.
- **Finales muettes** : e final, et s, t, d après voyelle, n ou r (Thomas → Тома, Robert → Робер). 25 cas de test dans `cas_tests`.
- **Exceptions courantes** (passées dans le dictionnaire) : David, Inès, Agnès, Chloé, Nicolas, Jean, Gilles, Guillaume. Lettre inconnue (ñ, ø…) : on garde le latin.
- **Accent** : seulement les prénoms du dictionnaire. Ailleurs le cyrillique n'a pas d'accent (on ne le devine pas).
- **Ce que l'utilisateur corrige** : le champ « En russe : … » (il peut taper du cyrillique), ou « Garder en lettres latines ». La translittération affichée reste le prénom tapé : il sait le dire.

## 2. Lot 3 : phrases sensibles au genre (pour la section 3 de Vera)
- Aucune en russe ni en français pour la personne qui parle (les 50 éléments ont été écrits pour, et amis-007 évite сыт / сыта́).
- Hors format : telephone-009, « Vous vous êtes trompé » s'accorde au genre de l'**autre**. Le russe (Вы оши́блись) ne bouge pas. À laisser tel quel en V1.

## 3. Le français s'accorde partout (décision de Max) : liste et format
Phrases concernées, lots 1 à 3 :
- **sortir-008** Désolé / Désolée ; **rencontrer-005** Enchanté / Enchantée (le russe ne change pas).
- **metro-002** Je suis perdu / perdue ; **presenter-006** étudiant / étudiante (le russe change aussi, `variantes` existe déjà).
- **presenter-001** (moule), remplacements « ingénieur » / « ingénieure » et « avocat » / « avocate » (le russe ne change pas).
Format minimal : un champ facultatif `variantes_fr: { "m", "f" }`, sur la phrase et sur un remplacement de moule (il porte alors la `phrase_fr` complète). Absent ou `null` : le `fr` vaut pour tous. Genre non choisi : les deux formes s'affichent, comme pour le russe (pas d'écriture « Désolé·e »). Je n'ai pas encore modifié ces 5 fichiers : je le fais dès que Kostia valide le nom du champ.

## Pour Kostia (écarts au format v0, tous dans `personnage.json`)
- Ce n'est pas une situation : `index.json` le référence par la clé `personnage`, hors de `situations`.
- `phrases[]` : format v0, plus `situation` (où insérer l'élément), `personnalise`, `variantes_fr` et `gabarit`. Le jeton `{prenom}` est la **seule** chose à remplacer : en cyrillique dans `cible`, en cyrillique accentué (sinon sans accent) dans `accent`, en latin tapé dans `fr` et `translit`. Pas de déclinaison, jamais.
- `metiers[]` : `element` (le moule ou la phrase qui reçoit le métier), `domaine` (pré-choix de presenter-003, ou `null`), `astuce`, puis `m` et `f`, chacun un remplacement v0 complet, plus `carte_*` pour ru-presenter-011. Métiers sans écart russe : `m` et `f` ont la même `cible`, seul `fr` change.
- `domaines[]` : remplacements de presenter-003 recopiés, plus `carte_*` (repli « Autre »).
- Phrase d'exemple sans prénom : Sacha / Са́ша (prénom des deux genres en russe).
- Voix : la synthèse russe lit le cyrillique. Si l'utilisateur garde le latin, ne lis pas la phrase à prénom (ou coupe le prénom) : à toi de trancher.
