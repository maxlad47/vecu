# Relais de Vera — mission 004

## Livré
- `docs/pedagogie/phrases-lot3.md` : 5 situations (hotel, telephone, amis, banque, meteo), 10 éléments chacune, 50 au total dont 10 moules. Aucun doublon avec les 96 existants.

## Décisions prises
- 10 éléments par situation, 2 moules chacune : volume du lot 2.
- Aucune phrase au passé ni avec « je voudrais » : pas de `variantes` attendues.
- Registre : hotel, telephone, banque = vous ; amis = tu ; meteo = neutre.
- banque : aucun conseil financier, « Je veux » au présent.

## Pour Nadia
Traduire en russe, A1, accent et translittération, dans `content/ru/<id>.json` (ids `ru-<situation>-NNN`). Chaque moule : 5 remplacements avec phrase complète accordée (listes dans `phrases-lot3.md`). Astuces : intentions dans le fichier, 2 lignes maximum. Compléter `index.json` (rangs proposés : 11 à 15, dans cet ordre).
- hotel (vous) : 001 J'ai une réservation. / 002 MOULE Je reste ___. / 003 Ma clé ne marche pas. / 004 Quel est le mot de passe du wifi ? / 005 À quelle heure est le petit-déjeuner ? / 006 MOULE Il n'y a pas de ___ dans la chambre. / 007 Je peux laisser mes bagages ici ? / 008 Vous pouvez appeler un taxi ? / 009 Il y a une chambre plus calme ? / 010 Je pars demain matin.
- telephone (vous) : 001 Allô ? / 002 Je vous entends mal. / 003 Vous pouvez épeler, s'il vous plaît ? / 004 MOULE Je peux parler à ___ ? / 005 MOULE Rappelez-moi ___, s'il vous plaît. / 006 Vous pouvez m'envoyer un SMS ? / 007 Vous pouvez parler plus fort ? / 008 Je vous rappelle plus tard. / 009 Ce n'est pas le bon numéro. / 010 Notez mon numéro, s'il vous plaît.
- amis (tu) : 001 Merci pour l'invitation. / 002 Tiens, c'est pour toi. / 003 Je peux enlever mes chaussures ? / 004 MOULE Je peux ___ ? / 005 MOULE Passe-moi ___, s'il te plaît. / 006 À la tienne ! / 007 Je n'ai plus faim, merci. / 008 Tu habites ici depuis longtemps ? / 009 Il est tard, je dois y aller. / 010 Merci pour la soirée, c'était super !
- banque (vous/neutre) : 001 Il y a un distributeur près d'ici ? / 002 Ma carte ne passe pas. / 003 Je veux retirer de l'argent. / 004 Je veux bloquer ma carte. / 005 Le distributeur a avalé ma carte. / 006 MOULE Vous avez la monnaie de ___ ? / 007 Je peux payer en espèces ? / 008 MOULE Je veux changer ___ en roubles. / 009 Il y a une commission ? / 010 Vous pouvez me donner un reçu ?
- meteo (neutre) : 001 Quel temps il fait ? / 002 MOULE Il fait ___ aujourd'hui. / 003 Il pleut. / 004 Il neige. / 005 Quel temps il fera demain ? / 006 MOULE Demain, il y aura ___. / 007 J'ai froid. / 008 Il fait combien de degrés ? / 009 Il faut un parapluie ? / 010 On a de la chance avec la météo !
- Signale tout cas où le russe change selon le genre de celui qui parle, ou où ma tournure française sonne mal en russe.

## Points ouverts
- banque-008 (changer des euros ou dollars en roubles) : cette phrase est-elle encore réaliste sur place ? Sinon, la remplacer. À faire valider par Nadia, puis un natif.
- La monnaie « roubles » est écrite en dur dans banque-006 et 008 : acceptable pour le russe, à reprendre pour une autre langue.
- Ressemblances de forme : amis-004 « Je peux ___ ? » et hotel-007 « Je peux laisser… », cafe-005. Pas de doublon exact ; Sacha tranche si un QCM risque la confusion.
- Rangs 11 à 15 dans `index.json` : supposés, à confirmer.
