
import requests

customer_id = 9115365119
campaign_id = 22086069837
url = f"http://localhost:8000/campaign_overview/{customer_id}/{campaign_id}"

resp = requests.get(url)
if resp.status_code == 200:
    data = resp.json()
    print("Campaign overview:")
    print(data)
else:
    print("Error:", resp.status_code, resp.text)
