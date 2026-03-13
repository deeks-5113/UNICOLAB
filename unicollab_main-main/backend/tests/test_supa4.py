from supabase import create_client
from app.core.config import settings
client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)

email = "satwiktest2@gmail.com"
pwd = "Password123!"

try:
    res = client.auth.sign_up({"email": email, "password": pwd})
    uid = res.user.id
    print("User ID:", uid)
    
    # Check if profile exists!
    prof = client.table('profiles').select('*').eq('id', uid).execute()
    print("Profile exists?", prof.data)
except Exception as e:
    print("Error:", e)
