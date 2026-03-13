from supabase import create_client
from app.core.config import settings
client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)

email = "satwiktest1@gmail.com"
pwd = "Password123!"

try:
    res = client.auth.sign_up({"email": email, "password": pwd})
    print("User ID:", res.user.id if res.user else "No user")
    
    if res.user:
        ins = client.table('profiles').insert({
            'id': res.user.id,
            'email': email,
            'full_name': 'Satwik Test'
        }).execute()
        print("Profile inserted with auth ID!")
except Exception as e:
    print("Error:", e)
