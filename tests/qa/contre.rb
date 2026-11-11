# Contre-vérification après corrections (11/11/2026).
# Usage : ruby tests/qa/contre.rb <course|voiture-cache|voiture-sync|voiture-interruption|voiture-erreur> [port_cdp] [port_http]
QUOI = ARGV[0]
ARGV.replace(["rien", ARGV[1] || "9370", ARGV[2] || "8170"])
require_relative "scenarios"

srv = serveur_demarrer
begin
case QUOI
when "course"
  # 3 variantes × 2 délais d'arrivée des voix. Critère : rien de sonore une fois la session Silence lancée.
  [1200, 2800].each do |tard|
    [["ecouteurs", "ru+fr"], ["voiture", "ru+fr"], ["sansru", "fr"]].each do |depart, voix|
      c = ouvrir({ voix: voix, tard: tard })
      aller(c)
      if depart == "voiture"
        demarrer(c, "voiture", 5); c.attendre(0.2); clic_texte(c, "Démarrer"); c.attendre(0.1)
        clic(c, ".entete .btn-icone")                 # flèche retour pendant « Préparation… »
      else
        demarrer(c, "ecouteurs", 5); c.attendre(0.1)
        clic_texte(c, "Réglages"); c.attendre(0.1); c.js("history.back()")
      end
      c.attendre(0.3)
      c.js("window.__qa.repere = { speak: __qa.speak.length, acces: __qa.acces, appels: __qa.appels.length }")
      demarrer(c, "silence", 5)
      c.attendre(4.5)                                  # au-delà des 3 s d'attente
      3.times { |i| c.js("__d.repondre(#{i}, {toutToucher: true})"); c.attendre(1) }
      q = qa(c)
      r = q["repere"]
      e = ecran(c)
      badge = c.js("(document.querySelector('.entete-session .badge')||{}).textContent||null")
      note "#{depart}_#{tard}", {
        ecran_final: e["consigne"] || e["h1"], badge: badge,
        speak_apres_silence: q["speak"][r["speak"]..-1].map { |s| s["texte"] },
        acces_getter_apres_silence: q["acces"] - r["acces"],
        appels_apres_silence: q["appels"][r["appels"]..-1].group_by { |x| x }.map { |k, l| [k, l.size] }.to_h,
        acces_en_contexte_silence: q["piles"].count { |p| p["ctx"] == "SESSION-SILENCE" },
        erreurs: q["erreurs"]
      }
      c.fermer
    end
  end
when /\Avoiture-(.+)\z/
  v = $1
  conf = { voix: "ru+fr" }
  conf.merge!(fin: "jamais", annulation: "sync") if v == "sync"
  conf[:interrompreApres] = 6 if v == "interruption"
  conf[:fin] = "jamaisRu" if v == "erreur"
  c = ouvrir(conf)
  aller(c)
  demarrer(c, "voiture", 2); c.attendre(0.5)
  t0 = Time.now
  clic_texte(c, "Démarrer"); c.attendre(4)
  if v == "cache"
    c.attendre(8); c.js("__qaCacher(true)"); c.attendre(0.5)
    note "cache_etat_masque", ecran(c)["pause"]
    n1 = speaks(c).size; c.attendre(6)
    note "cache_lectures_pendant_masque", speaks(c).size - n1
    c.js("__qaCacher(false)"); c.attendre(3)
    note "cache_etat_apres_retour", ecran(c)["pause"]
    note "cache_lectures_apres_retour", speaks(c)[n1..-1].map { |s| s["texte"] }.first(3)
    # Pause demandée par l'utilisateur : ne doit PAS reprendre seule
    clic(c, ".bouton-pause"); c.attendre(0.5); c.js("__qaCacher(true)"); c.attendre(0.5); c.js("__qaCacher(false)"); c.attendre(3)
    note "pause_utilisateur_apres_masque", ecran(c)["pause"]
    clic(c, ".bouton-pause")
  end
  pauses = []
  fini = false
  260.times do
    pauses << ecran(c)["pause"] if c.js("!!document.querySelector('.bouton-pause')")
    if c.js("!!document.querySelector('.titre-ecran')") then fini = true; break end
    c.attendre(1)
  end
  note "fini_sans_toucher", fini
  note "duree_reelle_s", (Time.now - t0).round
  note "passe_par_pause", pauses.include?("Reprendre")
  note "nb_lectures", speaks(c).size
  note "ecran_final", ecran(c)["titre"]
  note "erreurs", qa(c)["erreurs"] + c.erreurs_page
  c.fermer
end
ensure
  serveur_arreter(srv)
end
