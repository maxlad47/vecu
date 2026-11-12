# Feuilles et écrans longs : la feuille « Je suis… » (et les autres écrans) défilent-ils, à la molette et au toucher ?
# Usage : ruby tests/qa/feuille.rb LARGEUR HAUTEUR tactile|souris PORT_HTTP PORT_CDP   (serveur : python3 -m http.server PORT --directory dist)
# Sortie : JSON ; code 1 si la feuille dépasse la fenêtre ou ne défile pas.
require_relative "cdp"
require "json"
w, h, mode, port_http, port_cdp = ARGV
w = w.to_i; h = h.to_i
c = CDP.lancer(port: port_cdp.to_i, largeur: w, hauteur: h)
c.cmd("Runtime.enable"); c.cmd("Page.enable")
c.cmd("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: mode == "tactile" })
def clic(c, sel) = c.js("(() => { const b = document.querySelector(#{sel.to_json}); if (b) { b.click(); return true; } return false; })()")
def texte(c, txt, sel = "button, a, summary, label") = c.js("(() => { const b = [...document.querySelectorAll(#{sel.to_json})].find(e => e.textContent.includes(#{txt.to_json})); if (b) { b.click(); return true; } return false; })()")
# Zone qui défile dans la feuille : la feuille elle-même ou son premier descendant défilable.
ETAT = <<~JS
  (() => {
    const f = document.querySelector(".feuille");
    if (!f) return null;
    const z = [f, ...f.querySelectorAll("*")].find((e) => /auto|scroll/.test(getComputedStyle(e).overflowY) && e.scrollHeight > e.clientHeight + 1);
    const r = f.getBoundingClientRect();
    return { haut: Math.round(r.top), bas: Math.round(r.bottom), fenetre: innerHeight, depasse: r.bottom > innerHeight + 1 || r.top < 0,
      defilable: !!z, scrollTop: z ? Math.round(z.scrollTop) : null, reste: z ? Math.round(z.scrollHeight - z.clientHeight - z.scrollTop) : null,
      pageDefile: document.documentElement.scrollHeight > innerHeight + 1 };
  })()
JS
def molette(c, w, h, mode, dy)
  if mode == "tactile"
    # Glisser du doigt vers le haut (synthesizeScrollGesture n'est pas fiable en headless) : 20 px par pas.
    y = (h * 0.7).to_i
    c.cmd("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: w / 2, y: y }] })
    (dy / 20).clamp(1, (y - 5) / 20).times { |i| c.cmd("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: w / 2, y: y - 20 * (i + 1) }] }); c.attendre(0.02) }
    c.cmd("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] })
  else
    c.cmd("Input.dispatchMouseEvent", { type: "mouseMoved", x: w / 2, y: h * 0.7 })
    c.cmd("Input.dispatchMouseEvent", { type: "mouseWheel", x: w / 2, y: h * 0.7, deltaX: 0, deltaY: dy })
  end
  c.attendre(0.5)
end
c.cmd("Page.navigate", { url: "http://localhost:#{port_http}/" })
c.attendre_que("!!document.querySelector('.carte-lieu')", max: 20); c.attendre(1)
res = {}
texte(c, "Menu"); c.attendre(0.3); texte(c, "Réglages"); c.attendre(0.5)
res["reglages"] = c.js("({ page: document.documentElement.scrollHeight, fenetre: innerHeight, defile: (() => { const y0 = scrollY; scrollTo(0, 99999); const d = scrollY > y0; scrollTo(0, 0); return d; })() })")
clic(c, ".carte-perso"); c.attendre(0.5)
res["perso-A"] = c.js("({ page: document.documentElement.scrollHeight, fenetre: innerHeight, bas: Math.round(document.querySelector('.zone-action').getBoundingClientRect().bottom) })")
clic(c, "#perso-metier"); c.attendre(0.5)
res["metiers-ferme"] = c.js(ETAT)
molette(c, w, h, mode, 600)
res["metiers-ferme-apres"] = c.js(ETAT)
texte(c, "Santé", "summary"); c.attendre(0.3)
res["metiers-ouvert"] = c.js(ETAT)
3.times { molette(c, w, h, mode, 2000) }
res["metiers-ouvert-apres"] = c.js(ETAT)
res["dernier-visible"] = c.js("(() => { const s = [...document.querySelectorAll('.feuille summary')].pop(); const r = s.getBoundingClientRect(); return r.bottom <= innerHeight; })()")
res["bouton-fermer-visible"] = c.js("(() => { const b = document.querySelector('.feuille .btn-icone'); const r = b.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight && r.height >= 44; })()")
c.js("document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))"); c.attendre(0.3)
res["ferme-par-echap"] = c.js("!document.querySelector('.feuille')")
# Autres feuilles et écrans longs : Réglages (page), thèmes (page), feuille « On s'arrête là ? ».
c.cmd("Page.navigate", { url: "http://localhost:#{port_http}/" }); c.attendre_que("!!document.querySelector('.carte-lieu')", max: 20); c.attendre(1)
clic(c, "#lieu-silence"); c.attendre(0.4); clic(c, "#duree-5"); clic(c, "#suite"); c.attendre(0.5)
res["themes"] = c.js("({ page: document.documentElement.scrollHeight, fenetre: innerHeight, boutonVisible: (() => { const b = document.querySelector('#c-est-parti'); const r = b.getBoundingClientRect(); return r.bottom <= innerHeight + 1; })(), defile: (() => { const y0 = scrollY; scrollTo(0, 99999); const d = scrollY > y0; scrollTo(0, 0); return d; })() })")
clic(c, "#c-est-parti"); c.attendre(1.2)
clic(c, "button[aria-label='Arrêter la session']"); c.attendre(0.4)
res["feuille-quitter"] = c.js(ETAT)
res["erreurs"] = c.erreurs_page.first(5)
puts JSON.pretty_generate(res)
c.fermer
mal = %w[metiers-ferme metiers-ouvert].any? { |k| res[k] && (res[k]["depasse"]) } || res["metiers-ouvert-apres"].nil? || res["metiers-ouvert-apres"]["reste"].to_i > 1 || !res["dernier-visible"] || !res["bouton-fermer-visible"] || (res["feuille-quitter"] && res["feuille-quitter"]["depasse"])
exit(mal ? 1 : 0)
