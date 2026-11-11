// Assemble dist/ (le site à héberger). Node, sans dépendance : node scripts/build.mjs
// Équivalent exact de scripts/build.sh : les deux produisent le même dist/.
//   app/      → dist/          (sauf README.md)
//   content/  → dist/content/  (sauf README.md)
// Puis sw.js reçoit la liste réelle des fichiers à mettre en cache et une version
// calculée sur leur contenu (elle change dès qu'un fichier change).

import { readdirSync, mkdirSync, copyFileSync, readFileSync, writeFileSync, rmSync, statSync } from "node:fs";
import { join, dirname, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const RACINE = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(RACINE, "dist");
const IGNORES = new Set(["README.md", ".DS_Store"]);

// Tous les fichiers d'un dossier, récursivement (chemins absolus).
function fichiersDe(dossier) {
  const resultat = [];
  for (const nom of readdirSync(dossier)) {
    const chemin = join(dossier, nom);
    if (statSync(chemin).isDirectory()) resultat.push(...fichiersDe(chemin));
    else if (!IGNORES.has(nom)) resultat.push(chemin);
  }
  return resultat;
}

function copier(source, cible) {
  for (const fichier of fichiersDe(source)) {
    const destination = join(cible, relative(source, fichier));
    mkdirSync(dirname(destination), { recursive: true });
    copyFileSync(fichier, destination);
  }
}

const sha1 = (donnees) => createHash("sha1").update(donnees).digest("hex");

rmSync(DIST, { recursive: true, force: true });
mkdirSync(join(DIST, "content"), { recursive: true });
copier(join(RACINE, "app"), DIST);
copier(join(RACINE, "content"), join(DIST, "content"));

// Fichiers à mettre en cache : tout dist/ sauf sw.js, triés (ordre des octets, comme LC_ALL=C sort).
const liste = fichiersDe(DIST)
  .map((f) => relative(DIST, f).split(sep).join("/"))
  .filter((f) => f !== "sw.js")
  .sort((a, b) => (Buffer.compare(Buffer.from(a), Buffer.from(b))));

// Version = 12 premiers caractères du SHA-1 de la liste « empreinte  chemin » de chaque fichier
// (même format que la commande shasum).
const empreintes = liste.map((f) => sha1(readFileSync(join(DIST, f))) + "  " + f + "\n").join("");
const version = sha1(empreintes).slice(0, 12);
const fichiers = JSON.stringify(["./", ...liste]);

const cheminSw = join(DIST, "sw.js");
const sw = readFileSync(cheminSw, "utf8")
  .split("\n")
  .map((ligne) => {
    if (/\/\/ __VERSION__$/.test(ligne)) return 'const VERSION = "' + version + '";';
    if (/\/\/ __FICHIERS__$/.test(ligne)) return "const FICHIERS = " + fichiers + ";";
    return ligne;
  })
  .join("\n");
writeFileSync(cheminSw, sw);

console.log("dist/ construit : " + liste.length + " fichiers en cache, version " + version);
