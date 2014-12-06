# Reads in the official items data file from Riot's Data Dragon and
# converts it into a format that can be used by lolcalc.
#
# http://ddragon.leagueoflegends.com/cdn/4.20.1/data/en_US/item.json
import json
import urllib2
import pprint

def is_valid(original, parsed):
	valid = parsed['cost'] > 0
	valid = valid and (parsed['attack'] > 0 or parsed['attackspeed'] > 0 or parsed['crit'] > 0)
	valid = valid and (not original.has_key('inStore'))
	valid = valid and (not original.has_key('maps') or not original['maps'].has_key("1"))
	
	return valid

GAME_VERSION = "4.20.1"
URL = "http://ddragon.leagueoflegends.com/cdn/%s/data/en_US/item.json"

response = urllib2.urlopen(URL % GAME_VERSION)
items = json.loads(response.read())

output = {
	"version": GAME_VERSION,
	"items": []
}
for item_id, item in items['data'].iteritems():
	# Certain items need to be filtered out (if they're unpurchaseable
	# or don't include any offensive combat stat modifiers, for example).
	parsed = {
		"id": int(item_id),
		"name": item['name'],
		"cost": int(item['gold']['total']),
		"attack": int(item['stats']['FlatPhysicalDamageMod']) if 'FlatPhysicalDamageMod' in item['stats'] else 0,
		"attackspeed": float(item['stats']['PercentAttackSpeedMod']) if 'PercentAttackSpeedMod' in item['stats'] else 0,
		"crit": float(item['stats']['FlatCritChanceMod']) if 'FlatCritChanceMod' in item['stats'] else 0,
#		"buildsfrom": []
	}
	
	if is_valid(item, parsed):
		output["items"].append(parsed)
		
output["num_items"] = len(output["items"])
print json.dumps(output)
