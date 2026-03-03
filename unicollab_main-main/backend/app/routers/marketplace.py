from typing import Any, List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.api import deps
from app.models import models
from app.schemas import schemas

router = APIRouter()

@router.get("/projects", response_model=List[schemas.Project])
def search_projects(
    db: Session = Depends(deps.get_db),
    skill: Optional[str] = None,
    domain: Optional[str] = None,
    keyword: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Search and filter projects in the marketplace.
    """
    query = db.query(models.Project).filter(models.Project.status == models.ProjectStatus.OPEN)
    
    if skill:
        # Simple substring match for comma-separated skills
        query = query.filter(models.Project.required_skills.ilike(f"%{skill}%"))
    if domain:
        query = query.filter(models.Project.domain == domain)
    if keyword:
        query = query.filter(
            or_(
                models.Project.title.ilike(f"%{keyword}%"),
                models.Project.description.ilike(f"%{keyword}%")
            )
        )
    
    return query.offset(skip).limit(limit).all()
