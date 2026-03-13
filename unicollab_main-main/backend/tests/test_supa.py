from supabase import create_client
from app.core.config import settings
client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
res = client.table('profiles').select('id').limit(1).execute()
print(type(res))
if hasattr(res, 'data'):
    print("res.data:", res.data)
elif isinstance(res, dict):
    print("dict res:", res)
else:
    print("res:", dir(res))
