from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.models import models
from app.schemas import schemas

router = APIRouter()

@router.get("/analytics", response_model=schemas.DashboardAnalytics)
def get_analytics(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_founder),
) -> Any:
    """
    Get founder dashboard analytics.
    """
    # Total projects
    total_projects = db.query(models.Project).filter(models.Project.founder_id == current_user.id).count()
    
    # Active projects (assuming Open + Recruiting)
    active_projects = db.query(models.Project).filter(
        models.Project.founder_id == current_user.id,
        models.Project.status.in_([models.ProjectStatus.OPEN, models.ProjectStatus.RECRUITING])
    ).count()
    
    # Total requests (for my projects)
    total_requests = db.query(models.CollaborationRequest).join(models.Project).filter(
        models.Project.founder_id == current_user.id
    ).count()
    
    # Total teammates (across all my projects)
    total_teammates = db.query(models.Team).join(models.Project).filter(
        models.Project.founder_id == current_user.id
    ).count()
    
    # Project-wise team progress
    projects = db.query(models.Project).filter(models.Project.founder_id == current_user.id).all()
    project_progress = []
    
    for project in projects:
        current_members = db.query(models.Team).filter(models.Team.project_id == project.id).count()
        project_progress.append({
            "project_id": str(project.id),
            "title": project.title,
            "current": current_members,
            "total": project.team_size_required
        })
        
    return {
        "total_projects": total_projects,
        "active_projects": active_projects,
        "total_requests": total_requests,
        "total_teammates": total_teammates,
        "project_wise_team_progress": project_progress
    }
