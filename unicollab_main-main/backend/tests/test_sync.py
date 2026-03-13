import requests

# 1. Register a dummy user
email = "test4@test.com"
password = "password123"

# register
print("Registering...")
res = requests.post("http://127.0.0.1:8000/api/v1/auth/signup", json={
    "email": email,
    "password": password,
    "full_name": "Test User",
    "role": "founder"
})
print(res.status_code, res.text)

# login
print("Logging in...")
res2 = requests.post("http://127.0.0.1:8000/api/v1/auth/login", data={
    "username": email,
    "password": password
})
print(res2.status_code, res2.text)

token = res2.json()["access_token"]

# sync
print("Syncing...")
res3 = requests.post("http://127.0.0.1:8000/api/v1/auth/sync-supabase-profile", headers={
    "Authorization": f"Bearer {token}"
})
print(res3.status_code, res3.text)
