# Client minimal du protocole Chrome DevTools (CDP), sans dépendance (Ruby 2.6).
# Sert aux vérifications QA : espions posés AVANT les scripts de l'app, réseau coupé,
# émulation (360 px, thème sombre, mouvement réduit), lecture du DOM.
require "json"
require "socket"
require "securerandom"
require "base64"
require "net/http"
require "tmpdir"

CHROME = ENV["CHROME"] || (File.exist?("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome") ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" : "google-chrome")

GARDER = %w[Runtime.exceptionThrown Runtime.consoleAPICalled Network.requestWillBeSent Fetch.requestPaused].freeze

class CDP
  attr_reader :events, :profil

  def self.lancer(port: 9333, profil: nil, largeur: 360, hauteur: 800)
    profil ||= Dir.mktmpdir("vecu-qa-")
    pid = spawn(CHROME, "--headless=new", "--no-sandbox", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
                "--remote-debugging-port=#{port}", "--user-data-dir=#{profil}", "--window-size=#{largeur},#{hauteur}",
                "--mute-audio", "about:blank", out: File::NULL, err: File::NULL)
    url = nil
    60.times do
      begin
        liste = JSON.parse(Net::HTTP.get(URI("http://127.0.0.1:#{port}/json/list")))
        page = liste.find { |c| c["type"] == "page" }
        if page then url = page["webSocketDebuggerUrl"]; break end
      rescue StandardError
      end
      sleep 0.25
    end
    raise "Chrome ne répond pas" unless url
    c = new(url, pid, profil)
    c
  end

  def initialize(url, pid, profil)
    @pid = pid
    @profil = profil
    @id = 0
    @events = []
    @reponses = {}
    uri = URI(url)
    @s = TCPSocket.new(uri.host, uri.port)
    cle = Base64.strict_encode64(SecureRandom.random_bytes(16))
    @s.write("GET #{uri.path} HTTP/1.1\r\nHost: #{uri.host}:#{uri.port}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: #{cle}\r\nSec-WebSocket-Version: 13\r\n\r\n")
    ligne = @s.gets
    raise "poignée de main refusée : #{ligne}" unless ligne.include?("101")
    while (l = @s.gets) && l != "\r\n"; end
  end

  def envoyer_trame(texte)
    donnees = texte.b
    entete = [0x81].pack("C")
    n = donnees.bytesize
    if n < 126 then entete << [0x80 | n].pack("C")
    elsif n < 65536 then entete << [0x80 | 126, n].pack("Cn")
    else entete << [0x80 | 127, n >> 32, n & 0xffffffff].pack("CNN") end
    masque = SecureRandom.random_bytes(4)
    m = masque.bytes
    corps = donnees.bytes.each_with_index.map { |b, i| b ^ m[i % 4] }.pack("C*")
    @s.write(entete + masque + corps)
  end

  def lire_exact(n)
    buf = "".b
    while buf.bytesize < n
      morceau = @s.read(n - buf.bytesize)
      raise "connexion fermée" unless morceau
      buf << morceau
    end
    buf
  end

  def lire_trame
    message = "".b
    loop do
      b1, b2 = lire_exact(2).unpack("CC")
      fin = (b1 & 0x80) != 0
      op = b1 & 0x0f
      n = b2 & 0x7f
      n = lire_exact(2).unpack1("n") if n == 126
      if n == 127 then h, l = lire_exact(8).unpack("NN"); n = (h << 32) | l end
      raise "trame invalide (#{n} octets) : flux désynchronisé" if n > 64_000_000
      corps = lire_exact(n)
      next if op == 9 || op == 10
      raise "fermé" if op == 8
      message << corps
      break if fin
    end
    message.force_encoding("UTF-8")
  end

  def pomper(timeout)
    return false unless IO.select([@s], nil, nil, timeout)
    msg = JSON.parse(lire_trame)
    if msg["id"] then @reponses[msg["id"]] = msg
    elsif GARDER.include?(msg["method"]) then @events << msg; @events.shift while @events.size > 2000
    end
    true
  end

  def cmd(methode, params = {}, timeout = 60)
    @id += 1
    id = @id
    envoyer_trame(JSON.generate({ id: id, method: methode, params: params }))
    limite = Time.now + timeout
    until @reponses.key?(id)
      raise "délai dépassé : #{methode}" if Time.now > limite
      pomper(0.5)
    end
    r = @reponses.delete(id)
    raise "#{methode} : #{r["error"]}" if r["error"]
    r["result"]
  end

  # Évalue une expression JS (promesses attendues) et renvoie la valeur.
  def js(expr, timeout: 120)
    r = cmd("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true }, timeout)
    if r["exceptionDetails"]
      raise "JS : " + (r["exceptionDetails"].dig("exception", "description") || r["exceptionDetails"]["text"]).to_s
    end
    r.dig("result", "value")
  end

  # Laisse passer le temps en traitant les événements.
  def attendre(secondes)
    limite = Time.now + secondes
    pomper([limite - Time.now, 0.05].max) while Time.now < limite
  end

  def attendre_que(expr, max: 30, pas: 0.2)
    limite = Time.now + max
    while Time.now < limite
      return true if js(expr)
      attendre(pas)
    end
    false
  end

  def erreurs_page
    @events.select { |e| e["method"] == "Runtime.exceptionThrown" }.map { |e| e.dig("params", "exceptionDetails", "exception", "description") || e.dig("params", "exceptionDetails", "text") } +
      @events.select { |e| e["method"] == "Runtime.consoleAPICalled" && %w[error warning].include?(e.dig("params", "type")) }.map { |e| "console.#{e.dig("params", "type")}: " + e.dig("params", "args").map { |a| a["value"] || a["description"] }.join(" ") }
  end

  def requetes
    @events.select { |e| e["method"] == "Network.requestWillBeSent" }.map { |e| e.dig("params", "request", "url") }
  end

  def fermer
    begin; cmd("Browser.close", {}, 5); rescue StandardError; end
    begin; Process.kill("TERM", @pid); rescue StandardError; end
    begin; Process.wait(@pid); rescue StandardError; end
  end
end
