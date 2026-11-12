# Relais de Vera — mission 012

Statut : livré en brouillon, non commité (voir Points ouverts : pas de clone ni de push possible depuis cette session).

## Livré
- `docs/pedagogie/themes.md` : 5 thèmes de vocabulaire, 10 moules, 50 remplacements, seuils d'entrée, règles R1 à R9 (section 10 proposée pour `regles-session.md`).

## Décisions prises
- 5 thèmes : lieux, maison, nourriture, couleurs et taille, famille. Transports écartés : déjà dans `metro` et `taxi`.
- Chaque thème = 2 moules à 5 remplacements, donc 8 à 10 mots : le format des moules reste celui des situations.
- Aucun moule ne change selon le genre de la personne qui parle : pas de `variantes_fr`. Le genre ne joue que dans les remplacements (un / une, mon / ma).
- Pas de « Où est ___ ? » : déjà dans ru-metro-001.
- Ordre d'entrée par seuil de situations introduites (10 à 40), 1 nouvel élément de thème au plus par session de 5 min, aucun en 2 min.

## Pour Nadia
Traduire les 10 moules et leurs 50 remplacements (détail, registre et niveau dans `themes.md`, §2) :
- ru-lieux-001 (neutre, A1) « Je cherche ___. » : la poste / la banque / la boulangerie / le supermarché / le marché
- ru-lieux-002 (neutre, A2) « C'est à côté de ___ ? » : la gare / la mairie / le musée / la place / l'hôpital
- ru-maison-001 (neutre, A1) « Il me faut ___. » : un chargeur / du savon / une serviette / des draps propres / une couverture
- ru-maison-002 (neutre, A1) « ___ ne marche pas. » : Le chauffage / La douche / La lumière / Le wi-fi / La télé
- ru-nourriture-001 (vous, A1) « C'est avec ___ ? » : du lait / du sucre / de la crème / du citron / de la glace
- ru-nourriture-002 (vous, A2) « Il y a ___ dans ce plat ? » : du porc / de l'alcool / du fromage / des oignons / des noix
- ru-couleurs-001 (vous, A1) « Vous l'avez en ___ ? » : noir / blanc / rouge / bleu / vert
- ru-couleurs-002 (neutre, A1) « C'est trop ___. » : grand / petit / long / court / serré
- ru-famille-001 (neutre, A1) « J'ai ___. » : un frère / une sœur / deux enfants / un fils / une fille
- ru-famille-002 (neutre, A1) « ___ est ici avec moi. » : Mon mari / Ma femme / Mon père / Ma mère / Mon fils

Accents et translittération à fournir. Pour les remplacements : accord avec le nom (vêtement, lieu), pas avec la personne qui parle.

## Points ouverts
- Le mot « thème » est déjà pris (type d'exercice Thème, choix des situations). Sacha tranche le nom à l'écran avant Lou.
- Le seuil d'entrée (§3) est une estimation à recaler sur le rythme réel de Max.
- Étape « thèmes » du parcours d'accueil : `app/` n'a pas été lu (ma liste de lecture). Kostia doit confirmer R8.
- Doublons acceptés : « le wi-fi » (ru-cafe-007), « du fromage » (ru-courses-005), « des noix » (proche de l'allergie).
- Git : cette session n'a pas d'outil shell. Ni clone, ni branche, ni commit, ni push. Les fichiers sont dans `/home/claude/m012-vera-staging/` (chemins du dépôt). À faire par un shell : cloner, copier, commiter avec les lignes Co-Authored-By prévues, pousser `mission-012-themes`.
