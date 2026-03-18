import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load env
load_dotenv('.env')

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_ANON_KEY")

if not url or not key:
    print("Supabase credentials not found in backend/.env")
    exit(1)

supabase: Client = create_client(url, key)

def purge_supabase():
    print(f"Connecting to Supabase at {url}...")
    
    # 1. Purge Applications
    print("Deleting all collaboration requests...")
    try:
        supabase.table('collaboration_requests').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
    except Exception as e:
        print(f"Error deleting collaboration_requests: {e}")

    # 2. Purge Teams
    print("Deleting all team entries...")
    try:
        supabase.table('teams').delete().neq('id', 0).execute()
    except Exception as e:
        print(f"Error deleting teams: {e}")

    # 3. Purge Projects
    print("Deleting all projects...")
    try:
        # Note: Depending on RLS, this might fail if not authenticated as service role.
        # But we'll try with the anon key which might have delete permissions in this dev setup.
        supabase.table('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
    except Exception as e:
        print(f"Error deleting projects: {e}")

    # 4. Purge Profiles
    print("Deleting all profiles...")
    try:
        # We neq with a fake uuid to trigger a "delete all" that satisfies the where clause requirement
        supabase.table('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
    except Exception as e:
        print(f"Error deleting profiles: {e}")

    print("Supabase purge attempt completed.")

if __name__ == "__main__":
    purge_supabase()
