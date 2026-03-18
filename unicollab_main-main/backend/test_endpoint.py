import requests
import uuid

# Use one of the IDs found in the database
project_id = '3307c4aafcb34047ae280b77f34654602'
# Try with and without hyphens
url = f"http://localhost:8001/api/v1/projects/{project_id}"
print(f"Testing URL: {url}")

response = requests.get(url)
print(f"Status Code: {response.status_code}")
print(f"Response Body: {response.text}")

# Try with hyphens
try:
    hyphenated_id = str(uuid.UUID(project_id))
    url_h = f"http://localhost:8001/api/v1/projects/{hyphenated_id}"
    print(f"\nTesting URL with hyphens: {url_h}")
    response_h = requests.get(url_h)
    print(f"Status Code: {response_h.status_code}")
    print(f"Response Body: {response_h.text}")
except Exception as e:
    print(f"Error parsing UUID: {e}")
