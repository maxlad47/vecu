# Scénarios QA dans Chrome headless, pilotés par CDP.
# Usage (depuis n'importe où) : ruby tests/qa/scenarios.rb <scénario> [port_chrome] [port_http]
# Le serveur HTTP (dist/) est lancé et arrêté par le script lui-même.
require_relative "cdp"
require "json"

RACINE = File.expand_path("../..", __dir__)
ESPION = File.read(File.join(__dir__, "espion.js"))
PILOTE = File.read(File.join(__dir__, "pilote-qa.js"))
SCEN = ARGV[0] || "silence"
PORT_CDP = (ARGV[1] || 9333).to_i
PORT_HTTP = (ARGV[2] || 8124).to_i
URL = "http://localhost:#{PORT_HTTP}/"

def serveur_demarrer
  pid = spawn("ruby", "-run", "-e", "httpd", File.join(RACINE, "dist"), "-p", PORT_HTTP.to_s, out: File::NULL, err: File::NULL)
  40.times { begin; Net::HTTP.get(URI(URL + "index.html")); break; rescue StandardError; sleep 0.25; end }
  pid
end
def serveur_arreter(pid)
  Process.kill("TERM", pid) rescue nil
  Process.wait(pid) rescue nil
end

$res = { scenario: SCEN }
def note(k, v) $res[k] = v; puts "#{k}: #{v.is_a?(String) ? v : JSON.generate(v)}"; $stdout.flush end

$port_suivant = PORT_CDP
def ouvrir(conf = {}, profil = nil, largeur = 360)
  $port_suivant += 1
  c = CDP.lancer(port: $port_suivant, profil: profil, largeur: largeur)
  c.cmd("Runtime.enable"); c.cmd("Network.enable"); c.cmd("Page.enable")
  c.cmd("Emulation.setDeviceMetricsOverride", { width: largeur, height: 800, deviceScaleFactor: 2, mobile: true })
  c.cmd("Page.addScriptToEvaluateOnNewDocument", { source: "window.__qaConf=#{JSON.generate(conf)};\n" + ESPION })
  c
end
def aller(c, url = URL)
  c.cmd("Page.navigate", { url: url })
  ok = c.attendre_que("!!document.querySelector('.ecran')", max: 20)
  c.js(PILOTE)
  ok
end
def qa(c) c.js("JSON.parse(JSON.stringify(window.__qa))") end
def ecran(c) c.js("__d.ecran()") end
def clic(c, sel) c.js("(() => { const e = document.querySelector(#{sel.to_json}); if (e) e.click(); return !!e; })()") end
def clic_texte(c, t) c.js("(() => { const b = __d.bouton(#{t.to_json}); if (b) b.click(); return !!b; })()") end
def demarrer(c, lieu, duree)
  clic(c, "#duree-#{duree}"); clic(c, "#lieu-#{lieu}"); clic(c, ".zone-action .btn-principal")
end
# Joue une session jusqu'à l'écran de fin. Renvoie [durée réelle s, nb cartes].
def jouer(c, delai: 2.0, max: 400, opts: {})
  t0 = Time.now; n = 0
  max.times do |i|
    break unless c.js("!!document.querySelector('.consigne')")
    c.js("__d.repondre(#{i}, #{JSON.generate(opts)})")
    n += 1
    c.attendre(delai)
  end
  [Time.now - t0, n]
end
def speaks(c) qa(c)["speak"] end

case SCEN

# ---------- 1. Mode Silence : aucune lecture, nulle part ----------
when "silence"
  srv = serveur_demarrer
  c = ouvrir({ voix: "ru+fr" })
  aller(c)
  note "acces_au_chargement", qa(c)["acces"]
  demarrer(c, "silence", 2); c.attendre(1)
  note "boutons_ecouter_dans_dom", c.js("document.querySelectorAll('[data-ecouter],[data-reecouter],.btn-ecouter').length")
  # session complète en touchant partout + clavier + retour + feuille + arrière-plan
  t0 = Time.now; n = 0; types = []
  200.times do |i|
    break unless c.js("!!document.querySelector('.consigne')")
    types << c.js("__d.repondre(#{i}, {toutToucher: true})")
    n += 1
    if i == 3 then c.js("history.back()"); c.attendre(0.4); c.js("history.back()"); c.attendre(0.4) end  # retour : feuille puis refermée
    if i == 5 then clic(c, ".entete-session .btn-icone"); c.attendre(0.3); c.js("document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))") end
    if i == 7 then c.js("__qaCacher(true)"); c.attendre(0.5); c.js("__qaCacher(false)") end
    c.attendre(3.0)
  end
  q = qa(c)
  note "silence_2min_duree_s", (Time.now - t0).round
  note "silence_2min_cartes", n
  note "silence_types", types.uniq
  note "fin", ecran(c)["titre"]
  note "silence_speak", q["speak"].size
  note "silence_acces", q["acces"]
  note "erreurs", q["erreurs"]
  # Encore (Silence) depuis l'écran de fin
  clic_texte(c, "Encore"); c.attendre(1)
  3.times { |i| c.js("__d.repondre(#{i}, {toutToucher: true})"); c.attendre(1.5) }
  note "encore_silence_speak", qa(c)["speak"].size
  # Réglages, progrès, retour : toujours rien
  c.js("history.back()"); c.attendre(0.5); clic_texte(c, "Arrêter"); c.attendre(0.5)
  clic_texte(c, "Accueil"); c.attendre(0.5)
  clic_texte(c, "Réglages"); c.attendre(0.3)
  c.js("document.querySelectorAll('input, [role=switch]').forEach(e => e.click())"); c.attendre(0.5)
  c.js("history.back()"); c.attendre(0.5)
  clic_texte(c, "Mes progrès"); c.attendre(0.3); c.js("history.back()"); c.attendre(0.5)
  note "apres_reglages_speak", qa(c)["speak"].size
  # Rechargement en pleine session Silence
  demarrer(c, "silence", 5); c.attendre(1); c.js("__d.repondre(0, {})"); c.attendre(1)
  c.cmd("Page.reload"); c.attendre_que("!!document.querySelector('.ecran')", max: 20); c.js(PILOTE)
  note "apres_rechargement", ecran(c)
  demarrer(c, "silence", 5); c.attendre(1)
  4.times { |i| c.js("__d.repondre(#{i}, {toutToucher: true})"); c.attendre(1.5) }
  note "rechargement_silence_speak", qa(c)["speak"].size
  note "rechargement_acces", qa(c)["acces"]
  c.fermer; serveur_arreter(srv)

# ---------- 1b. Silence après une session avec son, et Couper le son ----------
when "silence-apres-son"
  srv = serveur_demarrer
  c = ouvrir({ voix: "ru+fr" })
  aller(c)
  demarrer(c, "ecouteurs", 2); c.attendre(1.5)
  3.times { |i| c.js("__d.repondre(#{i}, {})"); c.attendre(1.5) }
  avant = speaks(c).size
  note "ecouteurs_speak", avant
  clic(c, "button.badge"); c.attendre(0.5)   # Couper le son
  apres_coupure = speaks(c).size
  6.times { |i| c.js("__d.repondre(#{i}, {toutToucher: true})"); c.attendre(1.5) }
  note "apres_couper_son_speak_nouveaux", speaks(c).size - apres_coupure
  note "apres_couper_son_ecouter_dom", ecran(c)["ecouter"]
  c.js("history.back()"); c.attendre(0.4); clic_texte(c, "Arrêter"); c.attendre(0.6)
  note "fin", ecran(c)["titre"]
  clic_texte(c, "Accueil"); c.attendre(0.5)
  note "lieu_memorise", c.js("document.querySelector('input[name=lieu]:checked') && document.querySelector('input[name=lieu]:checked').value")
  base = speaks(c).size
  demarrer(c, "silence", 2); c.attendre(1)
  8.times { |i| c.js("__d.repondre(#{i}, {toutToucher: true})"); c.attendre(1.2) }
  note "silence_apres_son_speak", speaks(c).size - base
  # Voiture → retour → Silence
  c.js("history.back()"); c.attendre(0.4); clic_texte(c, "Arrêter"); c.attendre(0.5); clic_texte(c, "Accueil"); c.attendre(0.5)
  demarrer(c, "voiture", 2); c.attendre(0.5); clic_texte(c, "Démarrer"); c.attendre(4)
  clic(c, ".bouton-pause"); c.attendre(0.5); clic_texte(c, "Arrêter"); c.attendre(0.5)
  clic_texte(c, "Accueil"); c.attendre(0.5)
  base = speaks(c).size
  demarrer(c, "silence", 2); c.attendre(1)
  6.times { |i| c.js("__d.repondre(#{i}, {toutToucher: true})"); c.attendre(1.2) }
  note "silence_apres_voiture_speak", speaks(c).size - base
  note "erreurs", qa(c)["erreurs"]
  c.fermer; serveur_arreter(srv)

# ---------- 1c. Course : voix lentes à arriver, l'utilisateur part en Silence pendant l'attente ----------
when "silence-course"
  srv = serveur_demarrer
  %w[ecouteurs voiture].each do |depart|
    c = ouvrir({ voix: "ru+fr", tard: 1200 })
    aller(c)
    if depart == "ecouteurs"
      demarrer(c, "ecouteurs", 5)                 # « Préparation… » (voix pas encore là)
    else
      demarrer(c, "voiture", 5); c.attendre(0.3); clic_texte(c, "Démarrer")
    end
    c.attendre(0.2)
    clic_texte(c, "Réglages") if depart == "ecouteurs"   # on change d'avis
    c.js("history.back()"); c.attendre(0.3)
    demarrer(c, "silence", 5); c.attendre(0.3)
    note "#{depart}_course_avant", ecran(c)
    base = speaks(c).size
    c.attendre(2.5)
    e = ecran(c)
    note "#{depart}_course_apres", e
    note "#{depart}_course_speak_apres_choix_silence", speaks(c)[base..-1]
    c.fermer
  end
  # Variante sans voix russe : on est détourné vers « pas de voix » en pleine session Silence ?
  c = ouvrir({ voix: "fr" })
  aller(c)
  demarrer(c, "ecouteurs", 5); c.attendre(0.2)
  clic_texte(c, "Réglages"); c.attendre(0.2); c.js("history.back()"); c.attendre(0.3)
  demarrer(c, "silence", 5); c.attendre(0.3)
  note "sansru_course_avant", ecran(c)["consigne"]
  c.attendre(2)
  note "sansru_course_apres", ecran(c)
  c.fermer
  serveur_arreter(srv)

# ---------- 2. Voiture : jusqu'au bout sans toucher ----------
when /\Avoiture-(.+)\z/
  variante = $1
  conf = { voix: "ru+fr" }
  conf[:fin] = "jamais" if variante == "jamais"
  conf.merge!(fin: "jamais", annulation: "sync") if variante == "jamais-sync"
  conf[:voix] = "ru" if variante == "sansfr"
  conf[:voix] = "fr" if variante == "sansru"
  conf[:interrompreApres] = 6 if variante == "interruption"
  srv = serveur_demarrer
  c = ouvrir(conf)
  aller(c)
  demarrer(c, "voiture", 2); c.attendre(0.5)
  t0 = Time.now
  clic_texte(c, "Démarrer")
  c.attendre(2)
  note "ecran_depart", ecran(c)
  if variante == "cache"
    c.attendre(10); c.js("__qaCacher(true)"); n1 = speaks(c).size; c.attendre(8)
    note "cache_speak_pendant", speaks(c)[n1..-1].map { |s| s["texte"] }
    note "cache_etat", ecran(c)["pause"]
    c.js("__qaCacher(false)"); c.attendre(5)
    note "cache_etat_apres_retour", ecran(c)["pause"]
  end
  fini = c.attendre_que("!!document.querySelector('.titre-ecran')", max: (variante == "cache" ? 30 : 260), pas: 1)
  d = Time.now - t0
  e = ecran(c)
  note "fini_sans_toucher", fini
  note "duree_reelle_s", d.round
  note "ecran_final", e
  s = speaks(c)
  note "nb_lectures", s.size
  note "annonces_fr", s.select { |x| x["lang"] == "fr-FR" }.first(3).map { |x| x["texte"] }
  note "derniere", s.last && s.last["texte"]
  note "cycles_decouverte_fr", s.count { |x| x["lang"] == "fr-FR" }
  note "erreurs", qa(c)["erreurs"]
  c.fermer; serveur_arreter(srv)

# ---------- 3. Durée réelle d'une session courte avec son ----------
when "duree-ecouteurs"
  srv = serveur_demarrer
  c = ouvrir({ voix: "ru+fr" })
  aller(c); demarrer(c, "ecouteurs", 2); c.attendre(1.5)
  d, n = jouer(c, delai: 4.0)
  note "ecouteurs_2min_duree_s", d.round; note "cartes", n; note "fin", ecran(c)["titre"]
  note "erreurs", qa(c)["erreurs"]
  c.fermer
  c = ouvrir({ voix: "ru+fr" })
  aller(c); demarrer(c, "parler", 2); c.attendre(1.5)
  d, n = jouer(c, delai: 6.0)
  note "parler_2min_duree_s", d.round; note "cartes_parler", n; note "fin_parler", ecran(c)["titre"]
  note "erreurs_parler", qa(c)["erreurs"]
  c.fermer; serveur_arreter(srv)

# ---------- 4. Stockage ----------
when "stockage"
  srv = serveur_demarrer
  %w[absent leve bloque ecritureLeve].each do |mode|
    c = ouvrir({ idb: mode })
    t0 = Time.now
    ok = aller(c)
    note "idb_#{mode}_affiche", { ok: ok, s: (Time.now - t0).round(1) }
    demarrer(c, "silence", 2); c.attendre(1)
    5.times { |i| c.js("__d.repondre(#{i}, {})"); c.attendre(1.3) }
    note "idb_#{mode}_session", ecran(c)
    note "idb_#{mode}_erreurs", qa(c)["erreurs"] + c.erreurs_page
    c.fermer
  end
  # Premier lancement puis rechargement en pleine session : la progression est-elle gardée ?
  profil = Dir.mktmpdir("vecu-qa-")
  c = ouvrir({}, profil)
  aller(c)
  note "premier_lancement", ecran(c).merge(bouton: c.js("document.querySelector('.zone-action .btn-principal').textContent"))
  demarrer(c, "silence", 15); c.attendre(1)
  6.times { |i| c.js("__d.repondre(#{i}, {})"); c.attendre(1.5) }
  c.cmd("Page.reload"); c.attendre_que("!!document.querySelector('.ecran')", max: 20); c.js(PILOTE)
  note "apres_rechargement_ecran", ecran(c)
  note "apres_rechargement_choix", c.js("[...document.querySelectorAll('input:checked')].map(i => i.id)")
  clic_texte(c, "Mes progrès"); c.attendre(0.5)
  note "progres_apres_rechargement", c.js("document.querySelector('main').innerText")
  fiches = c.js("new Promise(r => { const d = indexedDB.open('vecu'); d.onsuccess = () => { const q = d.result.transaction('progression').objectStore('progression').getAll(); q.onsuccess = () => r(q.result.map(f => f.id + ':' + f.boite)); }; })")
  note "fiches_idb", fiches
  # Données corrompues
  c.js("new Promise(r => { const d = indexedDB.open('vecu'); d.onsuccess = () => { const tx = d.result.transaction(['progression','reglages'], 'readwrite');
    const p = tx.objectStore('progression');
    p.put({ id: 'ru-cafe-001', boite: 'trois', historique: 'abc' });
    p.put({ id: 'ru-cafe-002', boite: 2, echeance: '2000-01-01', historique: 'abc' });
    p.put({ id: 'ru-cafe-003', boite: 99, echeance: 5 });
    p.put({ id: 'ru-zzz-001', boite: 3, echeance: '2000-01-01' });
    const g = tx.objectStore('reglages');
    g.put({ cle: 'dernierMode', valeur: 'fusee' }); g.put({ cle: 'dernierDuree', valeur: '5' }); g.put({ cle: 'apparence', valeur: 42 });
    g.put({ cle: 'translitteration', valeur: 'non' }); g.put({ cle: 'genre', valeur: 'x' });
    tx.oncomplete = () => { d.result.close(); r(true); }; }; })")
  c.cmd("Page.reload"); c.attendre_que("!!document.querySelector('.ecran')", max: 20); c.js(PILOTE)
  note "corrompu_accueil", ecran(c)
  demarrer(c, "silence", 5); c.attendre(1)
  etats = []
  12.times { |i| etats << (ecran(c)["consigne"] || ecran(c)["titre"]); c.js("__d.repondre(#{i}, {})"); c.attendre(1.3) }
  note "corrompu_session", etats
  note "corrompu_bloque", c.js("!!document.querySelector('.consigne') && !document.querySelector('.option:not([aria-disabled])') && !__d.bouton('Suivant') && !__d.bouton('Vérifier') && !__d.bouton('Voir')")
  note "corrompu_erreurs", (qa(c)["erreurs"] + c.erreurs_page).uniq
  c.fermer; serveur_arreter(srv)

# ---------- 5. Hors ligne ----------
when "hors-ligne"
  srv = serveur_demarrer
  profil = Dir.mktmpdir("vecu-qa-")
  c = ouvrir({ voix: "ru+fr" }, profil)
  aller(c)
  actif = c.attendre_que("navigator.serviceWorker && navigator.serviceWorker.controller ? true : (navigator.serviceWorker.ready.then(()=>false), false)", max: 3)
  c.attendre(3)
  note "sw_etat", c.js("navigator.serviceWorker.getRegistration().then(r => r ? (r.active ? r.active.state : 'pas actif') : 'aucun')")
  note "cache", c.js("caches.keys().then(async k => { const out = {}; for (const n of k) out[n] = (await (await caches.open(n)).keys()).length; return out; })")
  serveur_arreter(srv)   # mode avion : plus aucun serveur
  sleep 0.5
  %w[/ /index.html /?utm=1].each do |chemin|
    ok = aller(c, "http://localhost:#{PORT_HTTP}#{chemin}")
    note "hors_ligne_#{chemin}", { affiche: ok, ecran: (ok ? ecran(c)["accueil"] : c.js("document.body ? document.body.innerText.slice(0,80) : ''")) }
  end
  aller(c, URL)
  demarrer(c, "silence", 2); c.attendre(1)
  5.times { |i| c.js("__d.repondre(#{i}, {})"); c.attendre(1.2) }
  note "hors_ligne_session_silence", ecran(c)
  c.js("history.back()"); c.attendre(0.4); clic_texte(c, "Arrêter"); c.attendre(0.4); clic_texte(c, "Accueil"); c.attendre(0.4)
  demarrer(c, "ecouteurs", 2); c.attendre(1.5)
  note "hors_ligne_session_ecouteurs", ecran(c)
  note "hors_ligne_erreurs", qa(c)["erreurs"]
  c.fermer
  # Contenu qui ne se charge pas (sans service worker, profil neuf)
  srv = serveur_demarrer
  ["*content/ru/gouts.json*", "*content/ru/index.json*"].each do |motif|
    c = ouvrir({})
    c.cmd("Fetch.enable", { patterns: [{ urlPattern: motif }] })
    c.cmd("Page.navigate", { url: URL })
    limite = Time.now + 8
    while Time.now < limite
      c.pomper(0.2)
      ev = c.events.find { |e| e["method"] == "Fetch.requestPaused" && !e["traite"] }
      if ev then ev["traite"] = true; c.cmd("Fetch.failRequest", { requestId: ev.dig("params", "requestId"), errorReason: "InternetDisconnected" }) end
    end
    note "contenu_echec_#{motif}", c.js("document.body.innerText.slice(0, 200)")
    note "contenu_echec_erreurs_#{motif}", c.erreurs_page
    c.fermer
  end
  serveur_arreter(srv)

# ---------- 6. Accessibilité ----------
when "a11y"
  srv = serveur_demarrer
  c = ouvrir({ voix: "ru+fr" })
  aller(c)
  mesure = <<~JS
    (() => {
      const de = document.scrollingElement;
      const petits = [...document.querySelectorAll('button, [role=switch], label.choix, summary, a')].filter(e => e.offsetParent !== null || e.getClientRects().length)
        .map(e => { const r = e.getBoundingClientRect(); return { t: (e.getAttribute('aria-label') || e.textContent).trim().slice(0, 30), w: Math.round(r.width), h: Math.round(r.height) }; })
        .filter(x => x.w > 0 && (x.w < 44 || x.h < 44));
      return { debordement: de.scrollWidth - de.clientWidth, petits };
    })()
  JS
  res = {}
  res["accueil"] = c.js(mesure)
  clic_texte(c, "Réglages"); c.attendre(0.3); res["reglages"] = c.js(mesure); c.js("history.back()"); c.attendre(0.4)
  clic_texte(c, "Mes progrès"); c.attendre(0.3); res["progres"] = c.js(mesure); c.js("history.back()"); c.attendre(0.4)
  demarrer(c, "parler", 30); c.attendre(1.5)
  vus = {}
  60.times do |i|
    e = ecran(c)
    break unless e["consigne"]
    k = e["consigne"][0, 18]
    vus[k] ||= c.js(mesure)
    c.js("__d.repondre(#{i}, {})"); c.attendre(1.6)
  end
  res["cartes"] = vus
  clic(c, ".entete-session .btn-icone"); c.attendre(0.3); res["feuille"] = c.js(mesure)
  clic_texte(c, "Arrêter"); c.attendre(0.4); res["fin"] = c.js(mesure)
  note "mesures_360", res
  # Phrases les plus longues à 360 px : Ordre / options russes (débordement horizontal)
  # Focus clavier sur l'accueil
  clic_texte(c, "Accueil"); c.attendre(0.4)
  foc = []
  c.js("document.activeElement.blur()")
  14.times do
    c.cmd("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 })
    c.cmd("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 })
    foc << c.js("(() => { const a = document.activeElement; const s = getComputedStyle(a); const lab = a.id ? document.querySelector('label[for=\"'+a.id+'\"]') : null; const sl = lab ? getComputedStyle(lab) : null; return (a.id || a.className || a.tagName) + ' outline=' + s.outlineStyle + '/' + s.outlineWidth + (sl ? ' label:outline=' + sl.outlineStyle + ' shadow=' + sl.boxShadow.slice(0,30) + ' border=' + sl.borderColor : ''); })()")
  end
  note "tab_accueil", foc
  # Couleurs réelles (tokens résolus) : clair, sombre système, sombre forcé, clair forcé sur système sombre
  couleurs = "(() => { const s = getComputedStyle(document.documentElement); const b = getComputedStyle(document.body); const v = n => s.getPropertyValue(n).trim(); return { bg: v('--bg'), surface: v('--surface'), text: v('--text'), muted: v('--text-muted'), border: v('--border'), accent: v('--accent'), onAccent: v('--on-accent'), accentSoft: v('--accent-soft'), success: v('--success'), successSoft: v('--success-soft'), danger: v('--danger'), dangerSoft: v('--danger-soft'), bodyBg: b.backgroundColor, theme: document.documentElement.getAttribute('data-theme') }; })()"
  note "theme_clair", c.js(couleurs)
  c.cmd("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: "dark" }] })
  note "theme_sombre_systeme", c.js(couleurs)
  c.js("document.documentElement.setAttribute('data-theme','light')")
  note "theme_clair_force_sur_sombre", c.js(couleurs)
  c.js("document.documentElement.removeAttribute('data-theme')")
  c.cmd("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: "light" }] })
  c.js("document.documentElement.setAttribute('data-theme','dark')")
  note "theme_sombre_force", c.js(couleurs)
  c.js("document.documentElement.removeAttribute('data-theme')")
  # Mouvement réduit
  c.cmd("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] })
  demarrer(c, "silence", 2); c.attendre(0.5)
  note "mouvement_reduit", c.js("(() => { const z = document.querySelector('.contenu.carte'); const s = getComputedStyle(z); const b = getComputedStyle(document.querySelector('.btn-principal')); return { carte: s.animationName + ' ' + s.animationDuration, bouton: b.transitionDuration }; })()")
  # Grand écran : colonne centrée
  c.cmd("Emulation.setDeviceMetricsOverride", { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false }); c.attendre(0.3)
  note "grand_ecran_largeur_app", c.js("Math.round(document.getElementById('app').getBoundingClientRect().width)")
  # Texte agrandi (zoom texte 200 %) à 360 px
  c.cmd("Emulation.setDeviceMetricsOverride", { width: 360, height: 800, deviceScaleFactor: 2, mobile: true })
  c.js("document.documentElement.style.fontSize = '32px'"); c.attendre(0.3)
  note "texte_200_debordement", c.js("document.scrollingElement.scrollWidth - document.scrollingElement.clientWidth")
  c.js("document.documentElement.style.fontSize = ''")
  note "requetes_externes", c.requetes.reject { |u| u.start_with?("http://localhost:#{PORT_HTTP}") || u.start_with?("data:") || u.start_with?("about:") }
  note "erreurs", qa(c)["erreurs"] + c.erreurs_page
  c.fermer; serveur_arreter(srv)

# ---------- 7. Pas de voix du tout (API absente) et voix russe absente ----------
when "sans-voix"
  srv = serveur_demarrer
  [{ synthese: "absente" }, { voix: "aucune" }, { voix: "fr" }].each do |conf|
    %w[ecouteurs parler voiture].each do |lieu|
      c = ouvrir(conf)
      aller(c)
      demarrer(c, lieu, 5); c.attendre(0.3)
      clic_texte(c, "Démarrer") if lieu == "voiture"
      c.attendre(3.6)
      e = ecran(c)
      boutons = c.js("[...document.querySelectorAll('.zone-action button')].map(b => b.textContent)")
      note "#{conf.values.first}_#{lieu}", { h1: e["h1"], boutons: boutons, voiture_theme: c.js("document.body.classList.contains('theme-voiture')") }
      if lieu != "voiture" && clic_texte(c, "Silence")
        c.attendre(0.8); n0 = qa(c)["speak"].size
        4.times { |i| c.js("__d.repondre(#{i}, {toutToucher: true})"); c.attendre(1.2) }
        note "#{conf.values.first}_#{lieu}_puis_silence", { consigne: ecran(c)["consigne"], speak: qa(c)["speak"].size - n0, lieu: c.js("1") }
      end
      note "#{conf.values.first}_#{lieu}_erreurs", qa(c)["erreurs"] + c.erreurs_page
      c.fermer
    end
  end
  serveur_arreter(srv)

# ---------- 8. Vraie synthèse de Chrome : cancel() déclenche-t-il onerror de façon synchrone ? ----------
when "vraie-synthese"
  srv = serveur_demarrer
  c = ouvrir({ synthese: "vraie" })
  aller(c)
  r = c.js(<<~JS, timeout: 30)
    new Promise(async (fin) => {
      const s = window.speechSynthesis;
      await new Promise(r => setTimeout(r, 1500));
      const voix = s.getVoices().filter(v => /^(ru|fr)/i.test(v.lang)).map(v => v.lang + ':' + v.name).slice(0, 8);
      const u = new SpeechSynthesisUtterance('Сколько это стоит? Сколько это стоит? Сколько это стоит?');
      u.volume = 0; u.lang = 'ru-RU';
      const journal = [];
      u.onstart = () => journal.push('start');
      u.onend = () => journal.push('end');
      u.onerror = (e) => journal.push('error:' + e.error);
      s.speak(u);
      await new Promise(r => setTimeout(r, 1200));
      journal.push('avant-cancel');
      s.cancel();
      journal.push('apres-cancel');
      await new Promise(r => setTimeout(r, 500));
      fin({ nbVoix: s.getVoices().length, voix, journal });
    })
  JS
  note "vraie_synthese", r
  c.fermer; serveur_arreter(srv)
end

File.write(File.join(ENV["QA_SORTIE"] || Dir.tmpdir, "resultats-#{SCEN}.json"), JSON.pretty_generate($res))
