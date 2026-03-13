from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from supabase import Client
from app.database.supabase import get_supabase_client
from app.api.deps_supabase import get_current_supabase_user
from app.schemas import collaboration as schemas
from uuid import UUID

router = APIRouter()

@router.get("/", response_model=List[schemas.Notification])
async def get_notifications(
    current_user: Any = Depends(get_current_supabase_user),
    supabase: Client = Depends(get_supabase_client)
) -> Any:
    res = supabase.table("notifications").select("*").eq("user_id", current_user.id).order("created_at", desc=True).execute()
    return res.data

@router.patch("/{notification_id}/read", response_model=schemas.Notification)
async def mark_notification_read(
    notification_id: UUID,
    current_user: Any = Depends(get_current_supabase_user),
    supabase: Client = Depends(get_supabase_client)
) -> Any:
    res = supabase.table("notifications").update({"is_read": True}).eq("id", str(notification_id)).eq("user_id", current_user.id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Notification not found")
    return res.data[0]
