# Serveur de test (Ruby, sans dépendance) : sert la racine du dépôt sur le port 8123,
# plus /attendre?ms=N qui répond après N ms. La page pilote s'en sert pour retarder son
# événement load, donc la capture de Chrome headless, jusqu'à la fin du scénario.
# Lancement : ruby tests/serveur.rb
require "webrick"
racine = File.expand_path("..", __dir__)
serveur = WEBrick::HTTPServer.new(Port: 8123, DocumentRoot: racine, AccessLog: [], Logger: WEBrick::Log.new($stderr, WEBrick::Log::WARN))
serveur.mount_proc("/attendre") do |req, res|
  sleep([req.query["ms"].to_i, 600_000].min / 1000.0)
  res["Content-Type"] = "image/gif"
  res.body = "GIF89a\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\xff\xff\xff!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;".b
end
trap("INT") { serveur.shutdown }
trap("TERM") { serveur.shutdown }
serveur.start
