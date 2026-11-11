#!/usr/bin/env bash
# Assemble dist/ (le site à héberger), sans Node : bash, cp, find, shasum, awk.
# Équivalent exact de scripts/build.mjs : les deux produisent le même dist/.
#   app/      → dist/          (sauf README.md)
#   content/  → dist/content/  (sauf README.md)
# Puis sw.js reçoit la liste réelle des fichiers à mettre en cache et une version
# calculée sur leur contenu (elle change dès qu'un fichier change).
set -euo pipefail

RACINE="$(cd "$(dirname "$0")/.." && pwd)"
DIST="$RACINE/dist"

rm -rf "$DIST"
mkdir -p "$DIST/content"

# Copie un dossier en ignorant README.md et .DS_Store.
copier() {
  local source="$1" cible="$2"
  (cd "$source" && find . -type f ! -name 'README.md' ! -name '.DS_Store') | while IFS= read -r f; do
    mkdir -p "$cible/$(dirname "$f")"
    cp "$source/$f" "$cible/$f"
  done
}
copier "$RACINE/app" "$DIST"
copier "$RACINE/content" "$DIST/content"

cd "$DIST"
# Fichiers à mettre en cache : tout dist/ sauf sw.js, triés (ordre des octets).
LISTE="$(find . -type f ! -path './sw.js' | sed 's|^\./||' | LC_ALL=C sort)"

# Version = 12 premiers caractères du SHA-1 de la liste « empreinte  chemin » de chaque fichier.
VERSION="$(printf '%s\n' "$LISTE" | while IFS= read -r f; do shasum "$f"; done | shasum | cut -c1-12)"

FICHIERS='["./"'
while IFS= read -r f; do FICHIERS="$FICHIERS,\"$f\""; done <<< "$LISTE"
FICHIERS="$FICHIERS]"

awk -v version="$VERSION" -v fichiers="$FICHIERS" '
  /\/\/ __VERSION__$/  { print "const VERSION = \"" version "\";"; next }
  /\/\/ __FICHIERS__$/ { print "const FICHIERS = " fichiers ";"; next }
  { print }
' sw.js > sw.js.tmp
mv sw.js.tmp sw.js

NB="$(printf '%s\n' "$LISTE" | wc -l | tr -d ' ')"
echo "dist/ construit : $NB fichiers en cache, version $VERSION"
