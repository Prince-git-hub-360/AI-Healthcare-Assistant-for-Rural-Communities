import urllib.request
import json

req = urllib.request.Request("http://127.0.0.1:8000/api/schema/?format=json")
with urllib.request.urlopen(req) as response:
    data = json.loads(response.read().decode('utf-8'))
    paths = data.get('paths', {})
    for path, methods in list(paths.items())[:10]:
        for method, details in methods.items():
            print(f"{method.upper():<6} {path:<40} -> tags: {details.get('tags')}")
