import requests
from collections import defaultdict

WEAPON_KEYWORDS = ["Rifle", "SMG", "Pistol", "Sniper Rifle", "Shotgun", "Machinegun", "Knife", "Gloves"]

def is_weapon(desc):
    item_type = desc.get("type", "").lower()
    return any(kw.lower() in item_type for kw in WEAPON_KEYWORDS)

def fetch_inventory(steam_id64):
    url = f"https://steamcommunity.com/inventory/{steam_id64}/730/2?l=english&count=5000"
    response = requests.get(url)
    if response.status_code != 200:
        return {}

    data = response.json()
    if not data.get("assets") or not data.get("descriptions"):
        return {}

    inventory = defaultdict(int)
    descriptions_map = {}

    for d in data["descriptions"]:
        if is_weapon(d):
            key = f"{d['classid']}_{d['instanceid']}"
            name = d.get('market_hash_name', 'Unknown')
            descriptions_map[key] = name
            descriptions_map[d['classid']] = name

    for item in data["assets"]:
        key_full = f"{item['classid']}_{item['instanceid']}"
        classid = item['classid']
        name = descriptions_map.get(key_full) or descriptions_map.get(classid)
        if name:
            inventory[name] += 1

    return inventory
