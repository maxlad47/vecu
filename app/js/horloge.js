// Horloge de session : temps réel écoulé, pauses exclues.
// Le moteur de session s'appuie sur ce temps mesuré (et non sur un nombre de cartes fixé
// à l'avance) pour que la durée annoncée soit tenue.
// Plusieurs raisons de pause peuvent se cumuler (feuille ouverte, app en arrière-plan,
// bouton pause) : l'horloge ne repart que quand il n'en reste aucune.

export function creerHorloge(maintenant) {
  const lire = maintenant || (() => (typeof performance !== "undefined" ? performance.now() : Date.now()));
  let cumulMs = 0;
  let depuis = null;
  const raisons = new Set();

  function majMarche() {
    if (raisons.size === 0 && depuis === null) depuis = lire();
    if (raisons.size > 0 && depuis !== null) { cumulMs += lire() - depuis; depuis = null; }
  }

  return {
    demarrer() { raisons.delete("arret"); majMarche(); },
    pause(raison) { raisons.add(raison || "pause"); majMarche(); },
    reprendre(raison) { raisons.delete(raison || "pause"); majMarche(); },
    get enPause() { return raisons.size > 0; },
    // Secondes écoulées, pauses exclues.
    secondes() { return (cumulMs + (depuis !== null ? lire() - depuis : 0)) / 1000; }
  };
}
