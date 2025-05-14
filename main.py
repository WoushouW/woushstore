from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import json
from pathlib import Path
from inventory import fetch_inventory, is_weapon

app = FastAPI()

# Статичный SteamID64
STATIC_STEAM_ID = "76561199479353760" 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/", response_class=HTMLResponse)
def index():
    return Path("static/index.html").read_text(encoding="utf-8")


@app.get("/inventory")
def get_inventory():
    inventory = fetch_inventory(STATIC_STEAM_ID)
    store_items = load_items()
    result = []

    for item in store_items:
        name = item["name"]
        price = item["price"]
        count = inventory.get(name, 0)
        result.append({
            "name": name,
            "price": price,
            "count": count
        })

    return JSONResponse(result)


@app.get("/inventory/all")
def get_all_inventory():
    inventory = fetch_inventory(STATIC_STEAM_ID)
    result = [{"name": name, "count": count} for name, count in inventory.items()]
    return JSONResponse(result)


def load_items():
    with open("items.json", "r", encoding="utf-8") as f:
        return json.load(f)
