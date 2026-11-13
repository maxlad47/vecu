// Constantes de l'app.
// Le bloc REGLES est repris tel quel de docs/pedagogie/regles-session.md, section 8.
// Ne pas modifier ces valeurs sans une décision du pédagogue et du CEO.

export const REGLES = {
  "durees": { "2": 120, "5": 300, "15": 900, "30": 1800 },
  "toleranceFin": 1.15,
  "maxCartesParElementParSession": 7,
  "nouveautesBonusMax": { "2": 1, "5": 2, "15": 4, "30": 6 },
  "seuilFinAnticipee": 0.8,
  "prolongationPasPlafond": 1,
  "estimations": {
    "silence":   { "decouverte": 15, "decouverteMoule": 20, "sens": 8,  "theme": 10, "ordre": 15, "ecrire": 25, "moule": 10 },
    "ecouteurs": { "decouverte": 18, "decouverteMoule": 22, "sens": 10, "theme": 12, "ordre": 16, "ecrire": 25, "ecoute": 10, "moule": 12 },
    "parler":    { "decouverte": 20, "decouverteMoule": 24, "sens": 10, "theme": 12, "ordre": 16, "ecrire": 25, "ecoute": 10, "voixHaute": 12, "moule": 12 },
    "voiture":   { "boucleDecouverte": 18, "boucleRappel": 17, "annonceDebut": 4, "annonceFin": 4 }
  },
  "estRevision": { "silence": 11, "ecouteurs": 12, "parler": 12, "voiture": 17 },
  "nMax": {
    "silence":   { "2": 1, "5": 3, "15": 6, "30": 9 },
    "ecouteurs": { "2": 1, "5": 3, "15": 6, "30": 9 },
    "parler":    { "2": 1, "5": 3, "15": 6, "30": 9 },
    "voiture":   { "2": 1, "5": 2, "15": 4, "30": 6 }
  },
  "nMin": { "2": 0, "5": 0, "15": 1, "30": 1 },
  "demarrage": { "seuilVus": 4, "nMax2min": 2 },
  "actifsMax": 2,
  "ecartsEchelle": { "standard": [2, 3, 4], "voiture": [2, 3] },
  "rattrapage": { "ecart": 3, "maxParElement": 2 },
  "voiture": {
    "rateLent": 0.7, "rateNormal": 1.0, "rateNormalReglageLent": 0.85,
    "decouverte": { "apresFr": 1, "apresLent": 3, "apresNormal1": 3, "apresNormal2": 2 },
    "rappel": { "reponse": 5, "reponseLongue": 6, "seuilLong": 25, "entreLentEtNormal": 1, "apresNormal": 3.5 }
  }
};

// Coûts dérivés (regles-session.md, section 1, « Coûts dérivés »).
// Ils servent à décider s'il reste assez de temps pour introduire une nouvelle phrase.
export const COUT_NOUVEAU = {
  silence:   { phrase: 48, moule: 50 },
  ecouteurs: { phrase: 56, moule: 58 },
  parler:    { phrase: 54, moule: 60 },
  voiture:   { phrase: 52, moule: 52 }
};

// Échelle d'un élément nouveau, par mode (regles-session.md, 4.1).
export const ECHELLES = {
  silence:   ["decouverte", "sens", "theme", "ordre"],
  ecouteurs: ["decouverte", "ecoute", "theme", "ordre"],
  parler:    ["decouverte", "ecoute", "theme", "voix-haute"],
  voiture:   ["boucle-decouverte", "boucle-rappel", "boucle-rappel"],
  moule:     ["decouverte", "moule-sens", "moule-theme", "moule-theme"]
};

// Carte de révision selon la boîte (regles-session.md, 4.2). Index 0 = boîte 1.
export const REVISION_PAR_BOITE = {
  silence:   ["sens", "theme", "ordre", "theme", "ordre", "theme"],
  ecouteurs: ["sens", "ecoute", "theme", "ordre", "ecoute", "theme"],
  parler:    ["sens", "ecoute", "voix-haute", "theme", "voix-haute", "voix-haute"],
  voiture:   ["boucle-rappel", "boucle-rappel", "boucle-rappel", "boucle-rappel", "boucle-rappel", "boucle-rappel"]
};

// Rotation des cartes de remplissage (regles-session.md, 4.3).
export const ROTATION_REMPLISSAGE = {
  silence:   ["sens", "theme", "ordre"],
  ecouteurs: ["sens", "ecoute", "theme", "ordre"],
  parler:    ["ecoute", "theme", "voix-haute"],
  voiture:   ["boucle-rappel"]
};

// Intervalle en jours quand un élément arrive dans une boîte (repetition-espacee.md, 2).
export const INTERVALLES = [null, 1, 2, 4, 7, 15, 30];
export const BOITE_MAX = 6;
export const BOITE_ACQUIS = 4;
// Écrire la réponse : à partir de cette boîte (phrase bien installée). Sous ECRIRE_FAUTE_MIN lettres, aucune faute tolérée.
export const BOITE_ECRIRE = 4;
export const ECRIRE_FAUTE_MIN = 5;
export const HISTORIQUE_MAX = 20;
// Le « jour » commence à 4 h du matin (repetition-espacee.md, 1).
export const DECALAGE_JOUR_HEURES = 4;

// Dialogues à choix (docs/design/dialogues.md, section 4 ; arbitrage de Sacha). Une carte « Dialogue » au plus par session,
// seulement dans ces durées (jamais en 2 min) et jamais en Voiture, après `apresCartes` cartes.
// `estimation` : durée d'une carte en secondes (Vera : ~60 s en Écouteurs, ~80 s en Je peux parler ; Silence : 60 par défaut).
export const DIALOGUE = {
  durees: ["5", "15", "30"],
  apresCartes: 3,
  estimation: { silence: 60, ecouteurs: 60, parler: 80 },
  reponsesMax: 3
};

// Univers de vocabulaire (docs/pedagogie/themes.md, règles R1 à R4). Les seuils d'entrée sont dans content/<langue>/index.json.
// `parSession` : nombre maximum de nouveaux éléments d'univers, par durée (0 en 2 min : le quota de 1 nouveau est réservé à la survie).
export const UNIVERS = {
  parSession: { "2": 0, "5": 1, "15": 2, "30": 2 }
};

// Interface (ecrans-phase0.md).
export const INTERFACE = {
  avanceAutoMs: 1200,          // après une bonne réponse
  avanceApresLectureMs: 400,   // si la lecture dure plus longtemps que avanceAutoMs
  attenteVoixMs: 3000,         // attente des voix (voiceschanged), jusqu'à 3 s
  dureesProposees: [2, 5, 15, 30],
  dureeParDefaut: 5,
  // Durée préremplie à l'étape 2 selon le lieu (bagou-ru.md, section 4). Elle est remplacée
  // par la dernière durée choisie pour ce lieu (mémoire par lieu).
  dureeParLieu: { silence: 2, ecouteurs: 5, parler: 15, voiture: 30 },
  modes: ["silence", "ecouteurs", "parler", "voiture"]
};

// Audio hors voiture : vitesses du bouton « Écouter ».
export const AUDIO = {
  rateNormale: 1.0,
  rateLente: 0.7,
  // Minuteur de secours : si la synthèse ne déclenche jamais onend,
  // on considère la phrase finie au bout de cette durée estimée.
  // Calé sur une parole d'environ 12 caractères par seconde à la vitesse 1.
  secoursMsParCaractere: 100,
  secoursMsMinimum: 1000,
  secoursMsMarge: 1500
};

// Langue apprise et langue de l'interface. Ajouter une langue = changer LANGUE_CIBLE
// et fournir content/<langue>/ ; les préfixes servent à chercher les voix.
export const LANGUE_CIBLE = "ru";
export const VOIX = {
  cible: { prefixe: "ru", lang: "ru-RU" },
  fr: { prefixe: "fr", lang: "fr-FR" }
};
