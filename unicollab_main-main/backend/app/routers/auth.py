from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.api import deps
from app.core import security
from app.core.config import settings
from app.models import models
from app.schemas import schemas
from supabase import create_client
import uuid as uuid_lib

router = APIRouter()

@router.post("/signup", response_model=schemas.User)
def create_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserCreate,
) -> Any:
    """
    Create new user.
    """
    user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    user = models.User(
        email=user_in.email,
        password_hash=security.get_password_hash(user_in.password),
        role=user_in.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create empty profile for new user, linking exactly by UUID
    profile = models.Profile(id=user.id, email=user.email, role=user.role, full_name=user_in.full_name)
    db.add(profile)
    db.commit()
    
    return user

@router.post("/login", response_model=schemas.Token)
def login_access_token(
    db: Session = Depends(deps.get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not security.verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        {"sub": user.email}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }
@router.post("/sync-supabase-profile")
def sync_supabase_profile(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Ensures the current user has a matching profile in Supabase.
    Returns the Supabase profile id.
    """
    supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
    
    # Check if profile already exists by email
    res = supabase.table('profiles').select('id').ilike('email', current_user.email).maybe_single().execute()
    
    data = None
    if hasattr(res, 'data'):
        data = res.data
    elif isinstance(res, dict):
        data = res.get('data', res)
        
    if data:
        profile_id = data.get('id') if isinstance(data, dict) else data[0].get('id') if (isinstance(data, list) and len(data) > 0) else None
        if profile_id:
            return {"supabase_profile_id": profile_id, "created": False}
    
    # Profile doesn't exist — create it with the user's existing SQLite UUID
    profile_id = str(current_user.id)
    profile = current_user.profile
    full_name = profile.full_name if profile else current_user.email.split('@')[0]
    
    try:
        # First ensure the user exists in Supabase 'users' table to satisfy FK
        try:
            supabase.table('users').upsert({
                'id': profile_id,
                'email': current_user.email,
                'role': current_user.role,
                'password_hash': 'DUMMY'
            }).execute()
        except Exception as e:
            print("Failed to upsert user in supabase:", e)
            
        insert_res = supabase.table('profiles').insert({
            'id': profile_id,
            'email': current_user.email,
            'full_name': full_name,
        }).execute()
        return {"supabase_profile_id": profile_id, "created": True}
    except Exception as e:
        # FK constraint — try with a fresh UUID that won't conflict
        new_id = str(uuid_lib.uuid4())
        try:
            supabase.table('profiles').insert({
                'id': new_id,
                'email': current_user.email,
                'full_name': full_name,
            }).execute()
            return {"supabase_profile_id": new_id, "created": True}
        except Exception as e2:
            raise HTTPException(status_code=500, detail=f"Could not sync profile to Supabase: {str(e2)}")
