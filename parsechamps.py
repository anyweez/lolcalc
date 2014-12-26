# Reads in the official items data file from Riot's Data Dragon and
# converts it into a format that can be used by lolcalc.
#
# http://ddragon.leagueoflegends.com/cdn/4.20.1/data/en_US/item.json
import json
import urllib2
import pprint

GAME_VERSION = "4.20.1"
URL = "http://ddragon.leagueoflegends.com/cdn/%s/data/en_US/champion.json"

response = urllib2.urlopen(URL % GAME_VERSION)
items = json.loads(response.read())

output = {
	"version": GAME_VERSION,
	"champions": [],
	"num_champs": 0,
}
for champ_id, champ in items['data'].iteritems():
	# Certain items need to be filtered out (if they're unpurchaseable
	# or don't include any offensive combat stat modifiers, for example).
	parsed = {
		"id": int(champ['key']),
		"name": champ['name'],
		"label": champ['name'],
		"img": "http://ddragon.leagueoflegends.com/cdn/4.20.1/img/champion/%s" % champ['image']['full'],
		# Attack damagae
		"baseattackdamage": champ['stats']['attackdamage'],
		"attackdamageperlevel": champ['stats']['attackdamageperlevel'],
		# Attack speed
		"baseattackspeed": .625 / (1 + champ['stats']['attackspeedoffset']),
		"attackspeedperlevel": (.01 * float(champ['stats']['attackspeedperlevel'])),
		"baseattackspeeddelay": float(champ['stats']['attackspeedoffset']),
		# Critical strike chance
		"basecriticalstrikepct": float(champ['stats']['crit']),
		"criticalstrikepctperlevel": float(champ['stats']['critperlevel']),
		"basearmor": float(champ['stats']['armor']),
		"armorperlevel": float(champ['stats']['armorperlevel']),
	}
	
	output["champions"].append(parsed)
		
output["num_champs"] = len(output["champions"])
print json.dumps(output)

