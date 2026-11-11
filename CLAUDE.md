# Vécu : constitution du projet

> Nom de code provisoire. Ce fichier est lu par chaque session et chaque agent. Il fait foi.

## Mission

Permettre à n'importe qui d'apprendre une langue avec des phrases qui servent dans la vraie vie, quels que soient son niveau, l'endroit où il se trouve et le temps dont il dispose.

## Les 3 piliers (fixés par Max, fondateur)

1. **Le contexte d'abord.** L'utilisateur dit combien de temps il a et où il est, et l'app compose la session. 2 min en salle d'attente, en silence : exercice écrit. 30 min en voiture : audio mains libres.
2. **Pour tout le monde, partout, même hors ligne.** Un site installable (PWA) qui fonctionne sans réseau.
3. **Du vécu, pas du scolaire.** On apprend « Combien ça coûte ? », « J'aime me promener le soir », « Je vais aller au foot ». Jamais « sac à dos » ou « chemin de fer » en leçon 2.

## Gouvernance

- **Max, fondateur.** Fixe la vision. Valide toute dépense et toute mise en ligne publique.
- **CEO (Claude, session principale).** Fixe les priorités, arbitre, répartit le travail, valide en dernier. Décide sans attendre Max sur tout le reste.
- **Agents spécialisés** (`.claude/agents/`). Chacun reste dans son rôle : ils proposent, le CEO tranche.
- Toute décision structurante est consignée dans `docs/journal.md` (date, décision, raison).

## Les 4 modes de contexte

| Mode | Situation type | Ce qui est permis |
|---|---|---|
| Silence | Salle d'attente, réunion, transports bondés | Écrit uniquement, aucun son |
| Écouteurs | Transports, file d'attente | Écrit et audio |
| Je peux parler | Chez soi, promenade | Audio et répétition à voix haute |
| Voiture | Trajet | 100 % audio, aucun écran, mains libres |

Durées proposées : 2, 5, 15 et 30 min. La durée annoncée doit être la durée réelle, à 20 % près.

## Règles de contenu (non négociables)

1. **Test du vécu.** Pour chaque phrase, la question est : quelqu'un la dirait-il vraiment pendant ses 30 premiers jours sur place ? Si la réponse est non, la phrase sort.
2. **L'unité est la phrase utile**, rangée dans une situation de vie : au café, faire les courses, parler de ses goûts, sortir, rencontrer quelqu'un, etc.
3. **Phrases-moules.** Privilégier les structures à trou (« J'aime ___ », « Combien coûte ___ ? ») qui multiplient les phrases possibles.
4. **La grammaire n'apparaît qu'en astuce** de 2 lignes maximum, au moment où elle sert.
5. **Pour le russe** : accent tonique indiqué, translittération disponible, formes masculine et féminine quand le genre de la personne qui parle change la phrase, tutoiement ou vouvoiement signalé.
6. **Répétition espacée par défaut.** Une phrase vue revient jusqu'à être acquise.
7. **Aucun contenu public sans relecture** par un locuteur natif humain.

## Choix techniques

- **PWA** en HTML, CSS et JS, sans framework lourd au départ. Le hors ligne passe par un service worker, la progression est stockée sur l'appareil (IndexedDB).
- **Contenu séparé du code** dans `content/<langue>/*.json`. Ajouter une langue, c'est ajouter des fichiers de contenu, sans toucher au code.
- **Audio** : la synthèse vocale de l'appareil suffit pour les prototypes. Avant le lancement public, il faut des voix natives, enregistrées ou générées.
- **Mobile d'abord** : tout doit fonctionner d'une main sur un téléphone.
- **Hébergement** sur Netlify. La mise en ligne publique doit être validée par Max.

## Organisation du dépôt

```
CLAUDE.md            cette constitution
.claude/agents/      l'équipe
docs/pilotage.md     vision, décisions, feuille de route, risques
docs/journal.md      journal des décisions
content/<langue>/    les phrases, par situation (JSON)
app/                 le site
```

## Façon de travailler

- Le backlog est tenu dans les Issues GitHub.
- Tout contenu passe par `pedagogue`, puis `linguiste-russe` (ou le linguiste de la langue concernée).
- Avant chaque livraison, `testeur-qa` vérifie, puis `utilisateur-temoin` donne son avis sur tout ce qui touche l'expérience.
- Langue de travail : le français. Les commits sont petits, clairs et écrits en français.

## Format du contenu (v0)

```json
{
  "langue": "ru",
  "situation": "cafe",
  "titre": "Au café",
  "niveau": "A1",
  "phrases": [
    {
      "id": "ru-cafe-001",
      "fr": "L'addition, s'il vous plaît.",
      "cible": "Счёт, пожалуйста.",
      "accent": "Счёт, пожа́луйста.",
      "translit": "shchyot, pozhálusta",
      "registre": "vous",
      "variantes": null,
      "astuce": null,
      "moule": null
    }
  ]
}
```

- `variantes` : `{ "m": "...", "f": "..." }` quand la forme dépend du genre de la personne qui parle.
- `moule` : `{ "modele": "Я люблю ___", "fr": "J'aime ___", "remplacements": [...] }` pour une phrase-moule.
- `registre` : `"tu"`, `"vous"` ou `"neutre"`.
