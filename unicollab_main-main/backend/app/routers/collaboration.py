from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client
from app.database.supabase import get_supabase_client
from app.api.deps_supabase import get_current_supabase_user
from app.schemas import collaboration as schemas
from uuid import UUID

router = APIRouter()

@router.post("/{project_id}/apply", response_model=schemas.Application)
async def apply_to_project(
    project_id: UUID,
    application_in: schemas.ApplicationCreate,
    current_user: Any = Depends(get_current_supabase_user),
    supabase: Client = Depends(get_supabase_client)
) -> Any:
    application_data = {
        "project_id": str(project_id),
        "applicant_id": current_user.id,
        "message": application_in.message,
        "status": "pending"
    }
    
    res = supabase.table("applications").insert(application_data).execute()
    if not res.data:
        raise HTTPException(status_code=400, detail="Failed to create application")
    
    return res.data[0]

@router.get("/{project_id}/applications", response_model=List[schemas.Application])
async def get_project_applications(
    project_id: UUID,
    current_user: Any = Depends(get_current_supabase_user),
    supabase: Client = Depends(get_supabase_client)
) -> Any:
    res = supabase.table("applications").select("*").eq("project_id", str(project_id)).execute()
    return res.data

@router.patch("/applications/{application_id}/status", response_model=schemas.Application)
async def update_application_status(
    application_id: UUID,
    status_update: schemas.ApplicationUpdate,
    current_user: Any = Depends(get_current_supabase_user),
    supabase: Client = Depends(get_supabase_client)
) -> Any:
    res = supabase.table("applications").update({"status": status_update.status}).eq("id", str(application_id)).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Application not found or unauthorized")
    
    app_data = res.data[0]
    
    if status_update.status == schemas.ApplicationStatus.ACCEPTED:
        team_data = {
            "project_id": app_data["project_id"],
            "user_id": app_data["applicant_id"],
            "role": "member"
        }
        supabase.table("project_teams").insert(team_data).execute()
        
    notification_data = {
        "user_id": app_data["applicant_id"],
        "type": "application_status",
        "message": f"Your application for project {app_data['project_id']} was {status_update.status}",
        "reference_id": str(application_id)
    }
    supabase.table("notifications").insert(notification_data).execute()
    
    return app_data

@router.get("/{project_id}/team", response_model=List[schemas.TeamMember])
async def get_project_team(
    project_id: UUID,
    current_user: Any = Depends(get_current_supabase_user),
    supabase: Client = Depends(get_supabase_client)
) -> Any:
    res = supabase.table("project_teams").select("*").eq("project_id", str(project_id)).execute()
    return res.data

@router.post("/{project_id}/messages", response_model=schemas.Message)
async def send_message(
    project_id: UUID,
    message_in: schemas.MessageCreate,
    current_user: Any = Depends(get_current_supabase_user),
    supabase: Client = Depends(get_supabase_client)
) -> Any:
    message_data = {
        "project_id": str(project_id),
        "sender_id": current_user.id,
        "content": message_in.content
    }
    res = supabase.table("messages").insert(message_data).execute()
    if not res.data:
        raise HTTPException(status_code=400, detail="Failed to send message")
    return res.data[0]

@router.get("/{project_id}/messages", response_model=List[schemas.Message])
async def get_messages(
    project_id: UUID,
    limit: int = 50,
    current_user: Any = Depends(get_current_supabase_user),
    supabase: Client = Depends(get_supabase_client)
) -> Any:
    res = supabase.table("messages").select("*").eq("project_id", str(project_id)).order("timestamp", desc=True).limit(limit).execute()
    return res.data[::-1]
