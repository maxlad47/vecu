# Répétition espacée (phase 0)

Auteur : pedagogue. Statut : proposition, à valider par le CEO.
Modèle : boîtes de Leitner, de 0 à 6, avec un intervalle compté en jours. Un élément (phrase ou moule) = une boîte.

## 1. Le jour

`jour` = la date locale (AAAA-MM-JJ) de `maintenant − 4 heures`. Une session à 1 h du matin compte donc pour la veille.
Un élément est **dû** si `boite ≥ 1` et `echeance ≤ jour`.

## 2. Boîtes et intervalles

| Boîte | Sens | Intervalle quand l'élément y arrive (échéance = jour + intervalle) |
|---|---|---|
| 0 | jamais vu | pas d'échéance |
| 1 | découvert ou raté | 1 jour |
| 2 | 1 rappel réussi | 2 jours |
| 3 | 2 rappels réussis | 4 jours |
| 4 | **acquis** | 7 jours |
| 5 | acquis | 15 jours |
| 6 | acquis (boîte maximale) | 30 jours |

En boîte 6, une réussite laisse l'élément en boîte 6, avec une échéance à jour + 30.

Trajectoire minimale, si tout est réussi : découvert à J0 (boîte 1), revu à J1 (boîte 2), à J3 (boîte 3), à J7 (boîte 4, **acquis**), à J14 (boîte 5), puis à J29 (boîte 6). Un élément vu le premier jour du test de Max peut donc être acquis au 8e jour.

## 3. Ce qui change la boîte

| Situation | Effet |
|---|---|
| Première Découverte (ou Boucle découverte) | boîte 0 → 1, échéance J+1. Écrit dès l'affichage de la carte. |
| Élément **dû** : sa première carte notée de la session est **réussie** | boîte + 1 (au plus 6), échéance = jour + intervalle de la nouvelle boîte |
| Élément **dû** : sa première carte notée de la session est **ratée** | boîte = max(1, boîte − 2), échéance J+1 |
| Élément **non dû** (échelle, rattrapage, remplissage), carte **réussie** | aucun changement |
| Élément **non dû**, carte **ratée** | boîte = max(1, boîte − 1), échéance J+1. Au plus une fois par élément et par jour. |
| Rattrapage d'un élément dû, réussi ou raté | aucun changement (seule la première carte compte) |

Une fois qu'un élément dû a été promu ou rétrogradé, son échéance change. Il n'est donc plus dû dans les sessions suivantes du même jour.
Le résultat est écrit **dès la réponse** (pas en fin de session).

## 4. Réussite et échec par type de carte

| Type | Réussite | Échec |
|---|---|---|
| Découverte | non notée | non notée |
| Sens | bonne option au premier toucher | mauvaise option au premier toucher |
| Thème | bonne option au premier toucher | mauvaise option au premier toucher |
| Écoute | bonne option au premier toucher | mauvaise option au premier toucher |
| Moule (sens ou thème) | bonne option au premier toucher | mauvaise option au premier toucher |
| Ordre | ordre exact une fois tous les mots placés (retirer un mot avant la fin est permis) | ordre inexact une fois tous les mots placés |
| À voix haute | l'utilisateur touche « Je l'avais » | l'utilisateur touche « Pas encore » |
| Boucle découverte | non notée | non notée |
| Boucle rappel (Voiture) | **réussite passive** (voir ci-dessous) | jamais |

Le résultat d'une carte Moule compte pour le moule entier, quel que soit le remplacement tiré.

### Voiture : la réussite passive

En Voiture, il n'y a pas de réponse. On considère qu'une écoute active vaut un rappel, mais elle ne suffit pas à prouver qu'on sait la phrase.
- Un élément **dû** passé en Boucle rappel : si `boite < 3`, alors boîte + 1 et échéance = jour + intervalle. Si `boite ≥ 3`, la boîte ne change pas et l'échéance est repoussée à jour + intervalle de la boîte actuelle.
- Conséquence : **la Voiture seule ne fait jamais atteindre la boîte 4.** Pour être acquis, un élément doit avoir réussi au moins une carte à réponse (écrite, audio ou À voix haute).
- Un élément non dû passé en Voiture : aucun changement.

## 5. « Acquis »

Un élément est **acquis** si `boite ≥ 4`. La valeur est calculée, pas stockée.
L'écran Progression affiche, par situation : « X / N acquises », où N = nombre d'éléments de la situation (moules compris, un moule = 1).
Un élément acquis qui est raté en révision descend de 2 boîtes (4 → 2) et cesse d'être acquis. Le compteur peut donc baisser : c'est voulu, il reflète la réalité.

## 6. Ce qui est stocké par élément (IndexedDB, magasin `progression`, clé `id`)

```json
{
  "id": "ru-cafe-002",
  "boite": 2,
  "echeance": "2026-11-14",
  "premiereVue": "2026-11-11",
  "derniereRevue": "2026-11-12",
  "dernierEchecNonDu": null,
  "nbReussites": 5,
  "nbEchecs": 1,
  "dernierRemplacement": 3,
  "historique": [
    { "jour": "2026-11-12", "mode": "silence", "type": "moule-theme", "remplacement": 3, "resultat": "reussite", "compte": true }
  ]
}
```

| Champ | Type | Règle |
|---|---|---|
| `id` | texte | id de l'élément dans le contenu |
| `boite` | entier 0 à 6 | absent du magasin = boîte 0 |
| `echeance` | date `AAAA-MM-JJ` ou `null` | `null` en boîte 0 |
| `premiereVue` | date | jour de la première Découverte |
| `derniereRevue` | date | jour de la dernière carte, quelle qu'elle soit |
| `dernierEchecNonDu` | date ou `null` | sert à limiter la rétrogradation non due à une fois par jour |
| `nbReussites`, `nbEchecs` | entiers | toutes les cartes notées, y compris les réussites passives |
| `dernierRemplacement` | entier ou `null` | moules seulement : index du dernier remplacement joué |
| `historique` | liste, 20 entrées au plus (les plus anciennes sont supprimées) | `type` parmi `decouverte`, `sens`, `theme`, `ordre`, `ecoute`, `voix-haute`, `moule-sens`, `moule-theme`, `boucle-decouverte`, `boucle-rappel` ; `resultat` parmi `reussite`, `echec`, `passif`, `non-note` ; `compte` = true si la carte a changé la boîte |

Hors élément (magasin `reglages`) : `dernierDuree`, `dernierMode`, `translitteration` (booléen), `genre` (`"m"` ou `"f"`, par défaut `"m"` tant que l'utilisateur ne l'a pas choisi), `vitesseVoix` (`"normale"` ou `"lente"`).
Si IndexedDB est indisponible, la même structure est gardée en mémoire (repli prévu dans le brief).

## 7. Cas limites

- **Absence de plusieurs jours** : les éléments en retard restent dus, sans pénalité. Ils passent en premier (échéance la plus ancienne d'abord) et la surcharge réduit les nouveautés (`regles-session.md`, section 2).
- **Changement de genre dans les réglages** : aucune incidence sur les boîtes.
- **Contenu modifié** : un id disparu du contenu est ignoré (pas effacé). Un id nouveau est en boîte 0.
