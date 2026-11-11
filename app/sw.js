// Service worker de Vécu : met en cache l'app et le contenu pour marcher sans réseau.
// Le script de construction (scripts/build.mjs ou scripts/build.sh) remplace les deux lignes
// marquées ci-dessous par la version du cache et la liste réelle des fichiers de dist/.

const VERSION = "dev"; // __VERSION__
const FICHIERS = []; // __FICHIERS__

const CACHE = "vecu-" + VERSION;

// Installation : on télécharge tous les fichiers de l'app et du contenu.
self.addEventListener("install", (evenement) => {
  evenement.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(FICHIERS)).then(() => self.skipWaiting())
  );
});

// Activation : on supprime les anciennes versions du cache.
self.addEventListener("activate", (evenement) => {
  evenement.waitUntil(
    caches.keys()
      .then((noms) => Promise.all(noms.filter((n) => n.startsWith("vecu-") && n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

// Requêtes : le cache d'abord (hors ligne), sinon le réseau. Rien n'est demandé à un autre site.
self.addEventListener("fetch", (evenement) => {
  const requete = evenement.request;
  if (requete.method !== "GET") return;
  const url = new URL(requete.url);
  if (url.origin !== self.location.origin) return;
  evenement.respondWith(
    caches.open(CACHE).then((cache) =>
      cache.match(requete, { ignoreSearch: requete.mode === "navigate" }).then((trouve) => {
        if (trouve) return trouve;
        return fetch(requete).catch(() => {
          // Hors ligne et pas en cache : pour une page, on renvoie l'app.
          if (requete.mode === "navigate") return cache.match("index.html");
          return Response.error();
        });
      })
    )
  );
});
