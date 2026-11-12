# Mission 008 : la carte Dialogue et la liste des métiers tiennent-elles sans défiler la page ?
# Usage : ruby tests/qa/dialogue.rb LARGEUR HAUTEUR silence|ecouteurs PORT_HTTP PORT_CDP
# (serveur : python3 -m http.server PORT --directory dist). Résultat : /tmp/dialogue-LxH-lieu.json et captures /tmp/dialogue-*.png
require_relative "cdp"
require "json"
w, h, lieu, port_http, port_cdp = ARGV
w = w.to_i; h = h.to_i
MESURE = <<~JS
  (() => {
    const R = (e) => e.getBoundingClientRect();
    const vis = (e) => e.offsetParent !== null || getComputedStyle(e).position === "fixed";
    const els = [...document.querySelectorAll("button, summary, label.choix, input:not(.choix-input)")].filter(vis);
    const petit = els.filter((e) => { const r = R(e); return r.height > 0 && (r.height < 44 || r.width < 44); })
      .map((e) => ((e.getAttribute("aria-label") || e.textContent || e.className) + "").trim().slice(0, 24) + " " + Math.round(R(e).width) + "x" + Math.round(R(e).height));
    const bas = document.querySelector(".bas-session"), c = document.querySelector(".contenu"), f = document.querySelector(".feuille");
    const opts = [...document.querySelectorAll(".options-dialogue .option")];
    const coche = document.querySelector(".choix-input:checked + .choix");
    return { defile: document.documentElement.scrollHeight > innerHeight + 1, limite: innerHeight,
      basBarre: bas ? Math.round(R(bas).bottom) : null, hautBarre: bas ? Math.round(R(bas).top) : null,
      sceneDefile: c ? c.scrollHeight > c.clientHeight + 1 : null, sceneH: c ? Math.round(c.clientHeight) : null, sceneScrollH: c ? c.scrollHeight : null,
      reponses: opts.map((o) => Math.round(R(o).height)), feuille: f ? [Math.round(R(f).top), Math.round(R(f).bottom)] : null,
      courantVisible: coche ? (R(coche).top >= 0 && R(coche).bottom <= innerHeight) : null, details: document.querySelectorAll("details").length,
      ouverts: document.querySelectorAll("details[open]").length, petit, speak: window.__qa ? window.__qa.speak.length : null };
  })()
JS
c = CDP.lancer(port: port_cdp.to_i, largeur: w, hauteur: h)
c.cmd("Runtime.enable"); c.cmd("Page.enable")
c.cmd("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 2, mobile: true })
c.cmd("Page.addScriptToEvaluateOnNewDocument", { source: "window.__qaConf = { vitesse: 0.05 };\n" + File.read(File.join(__dir__, "espion.js")) })
url = "http://localhost:#{port_http}/"
def clic(c, sel) = c.js("(() => { const b = document.querySelector(#{sel.to_json}); if (b) { b.click(); return true; } return false; })()")
def texte(c, txt, sel = "button, a, summary, label") = c.js("(() => { const b = [...document.querySelectorAll(#{sel.to_json})].find(e => e.textContent.includes(#{txt.to_json})); if (b) { b.click(); return true; } return false; })()")
shot = ->(nom) { File.binwrite("/tmp/dialogue-#{w}x#{h}-#{lieu}-#{nom}.png", Base64.decode64(c.cmd("Page.captureScreenshot", {})["data"])) }
res = {}
c.cmd("Page.navigate", { url: url })
c.attendre_que("!!document.querySelector('.carte-lieu')", max: 20); c.attendre(1)

# 1. Personnage : prénom, genre, métier choisi dans l'accordéon.
texte(c, "Menu"); c.attendre(0.3); texte(c, "Réglages"); c.attendre(0.5)
clic(c, ".carte-perso"); c.attendre(0.5)
c.js("(() => { const i = document.querySelector('#perso-prenom'); i.value = 'Maxime'; i.dispatchEvent(new Event('input', { bubbles: true })); })()"); c.attendre(0.3)
clic(c, "#genre-f")
clic(c, "#perso-metier"); c.attendre(0.5)
res["metiers-ferme"] = c.js(MESURE); shot.("metiers-ferme")
texte(c, "Santé", "summary"); c.attendre(0.3)
res["metiers-sante"] = c.js(MESURE); shot.("metiers-sante")
texte(c, "Infirmière", "label"); c.attendre(0.5)
clic(c, "#perso-metier"); c.attendre(0.5)
res["metiers-rouvert"] = c.js(MESURE); shot.("metiers-rouvert")
c.js("document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))"); c.attendre(0.3)
res["metier-libelle"] = c.js("document.querySelector('#perso-metier').textContent.trim()")

# 2. Session de 15 min jusqu'à la carte Dialogue.
c.cmd("Page.navigate", { url: url })
c.attendre_que("!!document.querySelector('.carte-lieu')", max: 20); c.attendre(1)
clic(c, "#lieu-#{lieu}"); c.attendre(0.6); clic(c, "#duree-15"); c.attendre(0.3); clic(c, "#suite"); c.attendre(0.6); clic(c, "#c-est-parti"); c.attendre(1.5)
AVANCER = <<~JS
  (async (i) => {
    const $$ = (s) => [...document.querySelectorAll(s)];
    const bouton = (t) => $$("button").find((b) => b.textContent.includes(t));
    const pause = (ms) => new Promise((r) => setTimeout(r, ms));
    if ($$(".bulle").length) return "bulle";
    const o = $$(".option:not([aria-disabled])");
    if (o.length) { o[i % o.length].click(); await pause(60); }
    else if ($$(".reserve button.tuile").length) { let n = 0; while ($$(".reserve button.tuile").length && n++ < 30) $$(".reserve button.tuile")[0].click(); const v = bouton("Vérifier"); if (v) v.click(); await pause(60); }
    else if (bouton("Voir la réponse")) { bouton("Voir la réponse").click(); await pause(60); const j = bouton("Je l"); if (j) j.click(); return "voix"; }
    const s = bouton("Suivant"); if (s) s.click();
    return "ok";
  })
JS
trouve = false
200.times do |i|
  break unless c.js("!!document.querySelector('.ecran-session')")
  if c.js("!!document.querySelector('.bulle')") then trouve = true; break end
  c.js("(#{AVANCER})(#{i})"); c.attendre(0.12)
end
res["dialogue-trouve"] = trouve
if trouve
  c.attendre(0.4)
  res["dialogue-titre"] = c.js("document.querySelector('.ligne-lieu .consigne').textContent")
  etapes = []
  8.times do |k|
    break unless c.js("!!document.querySelector('.bulle')")
    c.attendre(0.3)
    m = c.js(MESURE); m["bulle"] = c.js("document.querySelector('.bulle').textContent.slice(0, 80)"); m["toi"] = c.js("document.querySelector('.ligne-toi') && document.querySelector('.ligne-toi').textContent.slice(0, 40)")
    etapes << ["echange#{k}", m]; shot.("echange#{k}")
    c.js("document.querySelectorAll('.options-dialogue .option')[#{k} % document.querySelectorAll('.options-dialogue .option').length].click()"); c.attendre(0.4)
    m2 = c.js(MESURE); m2["verdict"] = c.js("(document.querySelector('.verdict') || {}).textContent"); m2["faux"] = c.js("!!document.querySelector('.retour.est-faux')")
    etapes << ["retour#{k}", m2]; shot.("retour#{k}")
    texte(c, "Suivant", "button"); c.attendre(0.4)
  end
  res["etapes"] = etapes
  res["apres"] = c.js("!!document.querySelector('.ecran-session') ? (document.querySelector('.consigne, .consigne-decouverte') || {}).textContent : 'fin'")
end
res["speak"] = c.js("window.__qa.speak.map(s => s.lang + ':' + s.texte.slice(0, 24))").first(6) rescue nil
res["erreurs"] = c.erreurs_page.first(5) + (c.js("window.__qa.erreurs") || [])
File.write("/tmp/dialogue-#{w}x#{h}-#{lieu}.json", JSON.pretty_generate(res))
puts JSON.pretty_generate(res)
c.fermer
