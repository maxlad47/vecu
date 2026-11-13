// Produit les 4 poupées de progression (content/ru/ambiance/poupee-*.svg) à partir du dessin commun
// app/js/ui/dessin-poupee.js. Usage : node scripts/poupees.mjs
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { dessinPoupee } from "../app/js/ui/dessin-poupee.js";

const RACINE = join(dirname(fileURLToPath(import.meta.url)), "..");
const DOSSIER = join(RACINE, "content", "ru", "ambiance");
const ETATS = {
  "acquise": { etat: "peinte", corps: "--laque", foulard: "--accent", tablier: "--deco-peau", fleur: "--laque", feuille: "--accent", or: "--or", contour: "--deco-contour" },
  "en-cours": { etat: "moitie", corpsDoux: "--laque-soft", foulard: "--accent", fleur: "--laque", feuille: "--accent", or: "--or", contour: "--laque" },
  "vue": { etat: "trait", fleur: "--accent", feuille: "--accent", contour: "--accent" },
  "pas-vue": { etat: "silhouette", contour: "--border" }
};
for (const [nom, o] of Object.entries(ETATS)) {
  writeFileSync(join(DOSSIER, "poupee-" + nom + ".svg"), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 57">' + dessinPoupee(o) + "</svg>\n");
  console.log("poupee-" + nom + ".svg");
}
