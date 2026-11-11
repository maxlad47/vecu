#!/usr/bin/env bash
# Lance un scénario du pilote dans Chrome headless (360 × 800).
# Usage : tests/capturer.sh <scénario> <light|dark> [attente_ms]
# Prérequis : dist/ construit et serveur à la racine du dépôt :
#   ruby tests/serveur.rb
# Produit docs/qa/captures/<scénario>-<thème>.png et affiche le rapport du pilote.
set -euo pipefail
RACINE="$(cd "$(dirname "$0")/.." && pwd)"
S="$1"; THEME="${2:-light}"; BUDGET="${3:-30000}"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
URL="http://localhost:8123/tests/pilote.html?s=$S&theme=$THEME&attente=$BUDGET"
mkdir -p "$RACINE/docs/qa/captures"
PROFIL="$(mktemp -d)"
"$CHROME" --headless=new --disable-gpu --user-data-dir="$PROFIL" --window-size=360,800 --hide-scrollbars \
  --screenshot="$RACINE/docs/qa/captures/$S-$THEME.png" "$URL" >/dev/null 2>&1 || true
"$CHROME" --headless=new --disable-gpu --user-data-dir="$(mktemp -d)" --window-size=360,800 \
  --enable-logging=stderr --v=0 --dump-dom "$URL" 2>"$PROFIL/err.log" \
  | perl -0ne 'print $1 if /<pre id="rapport">(.*?)<\/pre>/s' | head -60
grep "CONSOLE" "$PROFIL/err.log" | head -10 || true
rm -rf "$PROFIL"
