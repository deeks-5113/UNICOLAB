from supabase import create_client
from app.core.config import settings
client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)

try:
    res = client.table('users').select('*').limit(1).execute()
    print("Users table exists! Data:", getattr(res, 'data', res))
except Exception as e:
    print("Error querying users table:", e)
