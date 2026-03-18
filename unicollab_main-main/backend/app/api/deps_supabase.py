from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
# from supabase import Client
from app.database.supabase import get_supabase_client
from app.core.config import settings
from typing import Dict, Any

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)

async def get_current_supabase_user(
    token: str = Depends(reusable_oauth2),
    supabase: Any = Depends(get_supabase_client)
) -> Dict[str, Any]:
    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail="Supabase integration is currently disabled in this environment.",
    )
