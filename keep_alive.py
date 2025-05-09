import time
import requests
from datetime import datetime

# Укажи сюда свой URL
URL = "https://your-app.onrender.com/"

def ping_site():
    try:
        response = requests.get(URL)
        status = response.status_code
        print(f"[{datetime.now()}] Ping successful: {status}")
    except Exception as e:
        print(f"[{datetime.now()}] Ping failed: {e}")

if __name__ == "__main__":
    print("🔄 Starting keep-alive loop for:", URL)
    while True:
        ping_site()
        time.sleep(300)  # 300 секунд = 5 минут
