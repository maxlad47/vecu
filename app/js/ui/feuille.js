// Feuille du bas « On s'arrête là ? » (remplace confirm, interdit).
// role="dialog", focus piégé dedans, Échap ou toucher le voile = bouton principal (le plus sûr).

import { h, focaliser } from "./dom.js";

export function ouvrirFeuille({ titre, texte, principal, secondaire, surPrincipal, surSecondaire, focusRetour }) {
  const idTitre = "feuille-titre";
  const btnPrincipal = h("button", { type: "button", class: "btn-principal" }, principal);
  const btnSecondaire = h("button", { type: "button", class: "btn-secondaire" }, secondaire);
  const feuille = h("div", { class: "feuille", role: "dialog", "aria-modal": "true", "aria-labelledby": idTitre },
    h("h2", { id: idTitre }, titre),
    h("p", null, texte),
    btnPrincipal, btnSecondaire);
  const voile = h("div", { class: "voile" }, feuille);

  let ouverte = true;
  function fermer() {
    if (!ouverte) return;
    ouverte = false;
    document.removeEventListener("keydown", clavier, true);
    voile.remove();
    if (focusRetour && focusRetour.isConnected) focaliser(focusRetour);
  }
  function clavier(e) {
    if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); fermer(); surPrincipal(); return; }
    if (e.key === "Tab") {
      // Piège de focus : on reste entre les deux boutons.
      if (e.shiftKey && document.activeElement === btnPrincipal) { e.preventDefault(); focaliser(btnSecondaire); }
      else if (!e.shiftKey && document.activeElement === btnSecondaire) { e.preventDefault(); focaliser(btnPrincipal); }
    }
    e.stopPropagation(); // les raccourcis de la carte (1, 2, 3) ne passent pas sous la feuille
  }
  btnPrincipal.addEventListener("click", () => { fermer(); surPrincipal(); });
  btnSecondaire.addEventListener("click", () => { fermer(); surSecondaire(); });
  voile.addEventListener("click", (e) => { if (e.target === voile) { fermer(); surPrincipal(); } });
  document.addEventListener("keydown", clavier, true);
  document.body.appendChild(voile);
  focaliser(btnPrincipal);
  return { fermer, get ouverte() { return ouverte; } };
}
