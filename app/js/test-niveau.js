// Test de niveau en 2 minutes (docs/pedagogie/test-niveau.md). Module pur : ni DOM, ni stockage.
// Les témoins et leurs leurres viennent de content/ru/test-niveau.json (des ids du contenu, aucune phrase ici).

import { texteElement } from "./contenu.js";
import { placerBonne } from "./exercices.js";
import { TEST_NIVEAU } from "./config.js";

// Les questions du test, dans l'ordre du fichier. Un témoin dont un id a disparu du contenu est ignoré
// (le test marche avec ce qui reste). Chaque question : { id, situation, remplacement, fr, options: [{ texte, juste }] }.
export function preparerTest(donnees, contenu, aleatoire) {
  const questions = [];
  ((donnees && donnees.temoins) || []).forEach((tem) => {
    const el = contenu.parId.get(tem.id);
    const leurres = (tem.leurres || []).map((l) => ({ el: contenu.parId.get(l.id), remplacement: l.remplacement || 0 })).filter((l) => l.el);
    if (!el || leurres.length < 2) return;
    const remplacement = tem.remplacement || 0;
    const bonne = texteElement(el, { genre: "m", remplacement, sansAutre: true });
    const options = placerBonne({ id: el.id, texte: bonne, juste: true },
      leurres.map((l) => ({ id: l.el.id, texte: texteElement(l.el, { genre: "m", remplacement: l.remplacement, sansAutre: true }), juste: false })), aleatoire);
    questions.push({ id: el.id, situation: tem.situation, remplacement, fr: bonne.fr, options });
  });
  return questions;
}

// État du test : réponses données (true = bonne au premier toucher) et fin éventuelle.
export function etatInitial() { return { reponses: [] }; }

// Ajoute une réponse. Renvoie un nouvel état (jamais modifié sur place).
export function repondre(etat, juste) {
  return { reponses: etat.reponses.concat(!!juste) };
}

// Le test s'arrête après `erreursDeSuite` erreurs de suite, ou quand toutes les questions sont posées.
export function estTermine(etat, nbQuestions) {
  const r = etat.reponses;
  if (r.length >= nbQuestions) return true;
  const n = TEST_NIVEAU.erreursDeSuite;
  return r.length >= n && r.slice(-n).every((x) => !x);
}

// Bilan : « X situations sur N ». Une situation = un témoin réussi. Les situations sans témoin ou non posées
// ne comptent pas : elles restent à découvrir.
// genre du message : "zero", "arret" (fin anticipée), "tout" (toutes réussies) ou "partiel".
export function bilanTest(etat, questions, nbSituations) {
  const reussies = etat.reponses.filter(Boolean).length;
  const arret = etat.reponses.length < questions.length;
  const genre = reussies === 0 ? "zero" : arret ? "arret" : reussies === questions.length ? "tout" : "partiel";
  return { reussies, total: nbSituations, genre, eleve: reussies >= TEST_NIVEAU.seuilEleve };
}

// Vrai si le contenu porte un test utilisable (sinon l'app ne le propose pas).
export function testDisponible(contenu) {
  return !!contenu.test && preparerTest(contenu.test, contenu, () => 0).length > 0;
}
