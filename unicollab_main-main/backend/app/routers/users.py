from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models import models
from app.schemas import schemas

router = APIRouter()

@router.get("/profile", response_model=schemas.User)
def read_user_profile(
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Get current user profile.
    """
    return current_user

@router.put("/update-profile", response_model=schemas.User)
def update_user_profile(
    *,
    db: Session = Depends(deps.get_db),
    profile_in: schemas.ProfileUpdate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Update current user profile.
    """
    profile = current_user.profile
    if not profile:
        profile = models.Profile(id=current_user.id, email=current_user.email, role=current_user.role)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    
    profile_data = profile_in.dict(exclude_unset=True)
    for field, value in profile_data.items():
        setattr(profile, field, value)
    
    db.add(profile)
    db.commit()
    db.refresh(profile)
    db.refresh(current_user)
    return current_user
