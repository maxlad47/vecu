# Mission 007 : les 2 écrans « Mon personnage » tiennent-ils sans défiler ? Captures dans /tmp.
# Usage : ruby tests/qa/personnage.rb LARGEUR HAUTEUR clair|sombre PORT_HTTP PORT_CDP   (serveur : python3 -m http.server PORT --directory dist)
require_relative "cdp"
require "json"
w, h, theme, port_http, port_cdp = ARGV
w = w.to_i; h = h.to_i
MESURE = <<~JS
  (() => {
    const R = (e) => e.getBoundingClientRect();
    const vis = (e) => e.offsetParent !== null || getComputedStyle(e).position === "fixed";
    const petit = [...document.querySelectorAll("button, a, input:not(.choix-input), label.choix, label.pastille-couleur")].filter(vis)
      .filter((e) => { const r = R(e); return r.height > 0 && (r.height < 44 || r.width < 44); })
      .map((e) => ((e.getAttribute("aria-label") || e.textContent || e.className) + "").trim().slice(0, 24) + " " + Math.round(R(e).width) + "x" + Math.round(R(e).height));
    const bas = document.querySelector(".zone-action");
    return { defile: document.documentElement.scrollHeight > innerHeight + 1, scrollHeight: document.documentElement.scrollHeight, limite: innerHeight,
      barreBas: bas ? Math.round(R(bas).bottom) : null, petit };
  })()
JS
def clic(c, sel) = c.js("(() => { const b = document.querySelector(#{sel.to_json}); if (b) { b.click(); return true; } return false; })()")
def texte(c, txt) = c.js("(() => { const b = [...document.querySelectorAll('button, a')].find(e => e.textContent.includes(#{txt.to_json})); if (b) { b.click(); return true; } return false; })()")
c = CDP.lancer(port: port_cdp.to_i, largeur: w, hauteur: h)
c.cmd("Runtime.enable"); c.cmd("Page.enable")
c.cmd("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 2, mobile: true })
c.cmd("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: theme == "sombre" ? "dark" : "light" }] })
c.cmd("Page.navigate", { url: "http://localhost:#{port_http}/" })
c.attendre_que("!!document.querySelector('.carte-lieu')", max: 20)
c.attendre(1)
res = {}
shot = ->(nom) { File.binwrite("/tmp/perso-#{w}x#{h}-#{theme}-#{nom}.png", Base64.decode64(c.cmd("Page.captureScreenshot", {})["data"])) }
texte(c, "Menu"); c.attendre(0.3); texte(c, "Réglages"); c.attendre(0.5)
res["reglages"] = c.js(MESURE); shot.("reglages")
clic(c, ".carte-perso"); c.attendre(0.5)
res["A-vide"] = c.js(MESURE); shot.("A-vide")
c.js("(() => { const i = document.querySelector('#perso-prenom'); i.value = 'Maxime'; i.dispatchEvent(new Event('input', { bubbles: true })); })()"); c.attendre(0.3)
res["A-prenom"] = c.js(MESURE); shot.("A-prenom")
texte(c, "Corriger"); c.attendre(0.3)
res["A-correction"] = c.js(MESURE); shot.("A-correction")
texte(c, "Fait"); clic(c, "#genre-f"); clic(c, "#perso-metier"); c.attendre(0.4); shot.("A-metiers")
clic(c, "#metier-7"); c.attendre(0.3)
res["A-metier"] = c.js(MESURE); shot.("A-metier")
texte(c, "Suite"); c.attendre(0.4)
res["B"] = c.js(MESURE); shot.("B")
clic(c, "#couleur-laque-or"); clic(c, "#motif-baies"); c.attendre(0.3); shot.("B-laque")
res["erreurs"] = c.erreurs_page.first(5)
puts JSON.pretty_generate(res)
c.fermer
