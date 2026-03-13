from supabase import create_client
from app.core.config import settings
client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
res = client.table('profiles').select('id').ilike('email', 'testx1@test.com').maybe_single().execute()
print(type(res))
try:
    print(res.data)
except Exception as e:
    print("Error accessing res.data:", e)

res_insert = client.table('profiles').insert({'id': '99999999-9999-9999-9999-999999999999', 'email': 'test_fake@test.com', 'full_name': 'Fake'}).execute()
print("Insert type:", type(res_insert))
