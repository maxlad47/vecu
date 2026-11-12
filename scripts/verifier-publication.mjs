// Porte de relecture native : refuse la mise en ligne publique tant qu'un fichier de contenu
// n'est pas relu par un natif. Lancement : node scripts/verifier-publication.mjs
// Statuts : brouillon < valide-nadia < releve-natif < publie. Seuls les deux derniers passent.
import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DOSSIER = join(dirname(fileURLToPath(import.meta.url)), "..", "content", "ru");
const AUTORISES = new Set(["releve-natif", "publie"]);
const NON_CONCERNES = new Set(["ambiance.json", "index.json"]);
let bloques = 0;
for (const nom of readdirSync(DOSSIER).filter((n) => n.endsWith(".json") && !NON_CONCERNES.has(n))) {
  const statut = JSON.parse(readFileSync(join(DOSSIER, nom), "utf8")).statut || "(absent)";
  if (!AUTORISES.has(statut)) { bloques++; console.log("BLOQUÉ  " + nom + " : " + statut); }
}
console.log(bloques === 0 ? "Publication possible : tout le contenu est relu par un natif." : bloques + " fichier(s) sans relecture native : mise en ligne publique refusée.");
process.exitCode = bloques === 0 ? 0 : 1;
