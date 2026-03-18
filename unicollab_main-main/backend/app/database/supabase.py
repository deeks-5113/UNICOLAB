# from supabase import create_client, Client
from app.core.config import settings
from typing import Any

supabase: Any = None # create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)

def get_supabase_client() -> Any:
    return supabase
