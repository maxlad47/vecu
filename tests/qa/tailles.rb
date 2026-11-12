# Mission 006 : mesure des écrans de session, avant ET après réponse, sur une taille / un lieu / un thème.
# Usage : ruby tests/qa/tailles.rb LARGEUR HAUTEUR lieu(silence|ecouteurs) theme(clair|sombre) PORT_HTTP PORT_CDP
# Sert dist/ avec python3 (le serveur est lancé à part : python3 -m http.server PORT --directory dist).
require_relative "cdp"
require "json"
w, h, lieu, theme, port_http, port_cdp = ARGV
w = w.to_i; h = h.to_i
URL = "http://localhost:#{port_http}/"
MESURE = <<~JS
  (() => {
    const vis = (e) => e.offsetParent !== null || getComputedStyle(e).position === "fixed";
    const els = [...document.querySelectorAll("button, a, [role=button], .option, .tuile")].filter(vis);
    const fixes = els.filter((e) => !e.closest(".contenu"));
    const R = (e) => e.getBoundingClientRect();
    const petit = els.filter((e) => { const r = R(e); return r.height > 0 && (r.height < 44 || r.width < 44); }).map((e) => ((e.getAttribute("aria-label") || e.textContent || e.className) + "").trim().slice(0, 24) + " " + Math.round(R(e).width) + "x" + Math.round(R(e).height));
    const bas = Math.max(0, ...fixes.map((e) => R(e).bottom));
    const ent = document.querySelector(".entete");
    const c = document.querySelector(".contenu");
    const cache = els.filter((e) => R(e).bottom > innerHeight || R(e).top < 0).map((e) => (e.textContent || e.className).trim().slice(0, 20));
    return { defile: document.documentElement.scrollHeight > innerHeight + 1, plusBas: Math.round(bas), limite: innerHeight,
      hautEntete: ent ? Math.round(R(ent).top) : null, contenuDefile: c ? c.scrollHeight > c.clientHeight + 1 : null,
      petit, horsEcran: cache, faux: !!document.querySelector(".est-faux"), suivant: !!els.find((e) => /Suivant/.test(e.textContent)) };
  })()
JS
ETAPE = <<~JS
  (async () => {
    const $$ = (s) => [...document.querySelectorAll(s)];
    const bouton = (t) => $$("button").find((b) => b.textContent.includes(t));
    const pause = (ms) => new Promise((r) => setTimeout(r, ms));
    const c = document.querySelector(".consigne, .consigne-decouverte");
    const type = (c ? c.textContent : "?").trim().slice(0, 40) + (document.querySelector(".ordre, .reserve") ? " [ordre]" : "");
    const longueur = (document.querySelector(".ru-hero, .carte-phrase") || {}).textContent;
    return { type, voir: !!bouton("Voir la réponse"), opts: $$(".option:not([aria-disabled])").length, tuiles: $$(".reserve button.tuile").length, decouverte: !!bouton("Suivant") && !$$(".option").length };
  })()
JS
REPONDRE = <<~JS
  (async (i) => {
    const $$ = (s) => [...document.querySelectorAll(s)];
    const bouton = (t) => $$("button").find((b) => b.textContent.includes(t));
    const pause = (ms) => new Promise((r) => setTimeout(r, ms));
    const o = $$(".option:not([aria-disabled])");
    if (o.length) { o[i % o.length].click(); return "option"; }
    if ($$(".reserve button.tuile").length) { let n = 0; while ($$(".reserve button.tuile").length && n++ < 30) $$(".reserve button.tuile")[0].click(); const v = bouton("Vérifier"); if (v) v.click(); return "ordre"; }
    if (bouton("Voir la réponse")) { bouton("Voir la réponse").click(); await pause(80); const j = bouton(i % 2 ? "Je l" : "Pas encore"); if (j) j.click(); return "voix"; }
    return "rien";
  })
JS
c = CDP.lancer(port: port_cdp.to_i, largeur: w, hauteur: h)
c.cmd("Runtime.enable"); c.cmd("Page.enable")
c.cmd("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 2, mobile: true })
c.cmd("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: theme == "sombre" ? "dark" : "light" }] })
c.cmd("Page.addScriptToEvaluateOnNewDocument", { source: "window.__qaConf = { vitesse: 0.05 };\n" + File.read(File.join(__dir__, "espion.js")) })
c.cmd("Page.navigate", { url: URL })
c.attendre_que("!!document.querySelector('button')", max: 20)
c.attendre(1)
def cliquer(c, txt) = c.js("(() => { const b = [...document.querySelectorAll('button, .tuile-lieu, label, [role=radio]')].find(e => e.textContent.includes(#{txt.to_json})); if (b) { b.click(); return true; } return false; })()")
def clic(c, sel) = c.js("(() => { const b = document.querySelector(#{sel.to_json}); if (b) { b.click(); return true; } return false; })()")
log = []
log << ["lieu", clic(c, "#lieu-#{lieu}")]; c.attendre(0.6)
log << ["duree", clic(c, "#duree-5")]; c.attendre(0.3)
log << ["suite", clic(c, "#suite")]; c.attendre(0.6)
log << ["go", clic(c, "#c-est-parti")]; c.attendre(1.5)
res = []
captures = []
25.times do |i|
  break unless c.js("!!document.querySelector('.ecran-session')")
  e = c.js(ETAPE)
  m = c.js(MESURE)
  cle = e["type"]
  res << ["#{cle}|avant", m]
  if e["decouverte"] && e["opts"] == 0 && !e["voir"] && e["tuiles"] == 0
    c.js("[...document.querySelectorAll('button')].find(b => b.textContent.includes('Suivant')).click()"); c.attendre(0.3); next
  end
  how = c.js("(#{REPONDRE})(#{i})")
  c.attendre(0.5)
  m2 = c.js(MESURE)
  res << ["#{cle}|retour(#{how})#{m2["faux"] ? " FAUX" : ""}", m2]
  if i == 3 || i == 7 then File.binwrite("/tmp/tailles-#{w}x#{h}-#{lieu}-#{theme}-#{i}.png", Base64.decode64(c.cmd("Page.captureScreenshot", {})["data"])) end
  c.js("(() => { const b = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Suivant')); if (b) b.click(); })()")
  c.attendre(0.3)
end
File.write("/tmp/tailles-#{w}x#{h}-#{lieu}-#{theme}.json", JSON.pretty_generate({ log: log, res: res, erreurs: c.erreurs_page.first(5) }))
c.fermer
