from typing import Any, List, Optional
import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models import models
from app.schemas import schemas
# from supabase import create_client, Client
from app.core.config import settings

router = APIRouter()

@router.post("/create", response_model=schemas.Project)
def create_project(
    *,
    db: Session = Depends(deps.get_db),
    project_in: schemas.ProjectCreate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Create new project. Only Founders can create.
    """
    project = models.Project(
        **project_in.dict(),
        founder_id=current_user.id
    )
    db.add(project)
    db.commit()
    db.refresh(project)

    # Sync to Supabase (Disabled)
    # try:
    #     supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
    #     ...
    # except Exception as e:
    #     print(f"Failed to sync project to Supabase: {e}")

    return project

from sqlalchemy import or_

@router.get("/my-projects", response_model=List[schemas.Project])
def read_my_projects(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Get current user's projects (founded and joined).
    """
    return db.query(models.Project).filter(
        or_(
            models.Project.founder_id == current_user.id,
            models.Project.teams.any(models.Team.member_id == current_user.id)
        )
    ).all()

@router.get("/{project_id}", response_model=schemas.Project)
def read_project(
    project_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user: Optional[models.User] = Depends(deps.get_current_user_optional),
) -> Any:
    """
    Get project by ID.
    """
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.put("/{project_id}", response_model=schemas.Project)
def update_project(
    *,
    db: Session = Depends(deps.get_db),
    project_id: uuid.UUID,
    project_in: schemas.ProjectUpdate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Update project. Only Owner can update.
    """
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.founder_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    project_data = project_in.dict(exclude_unset=True)
    for field, value in project_data.items():
        setattr(project, field, value)
    
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.delete("/{project_id}", response_model=schemas.Project)
def delete_project(
    *,
    db: Session = Depends(deps.get_db),
    project_id: uuid.UUID,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Delete project. Only Owner can delete.
    """
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.founder_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db.delete(project)
    db.commit()
    return project
