from pydantic import BaseModel, EmailStr, UUID4
from typing import Optional, List, Any
from datetime import datetime
from app.models.models import UserRole, ProjectStatus, RequestStatus

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Profile Schemas
class ProfileBase(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None
    domain: Optional[str] = None
    skills: Optional[List[str]] = None
    interests: Optional[str] = None
    year_of_study: Optional[str] = None
    portfolio_links: Optional[List[str]] = None
    avatar_url: Optional[str] = None

class ProfileCreate(ProfileBase):
    pass

class ProfileUpdate(ProfileBase):
    pass

class Profile(ProfileBase):
    id: UUID4
    email: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    role: Optional[UserRole] = UserRole.COLLABORATOR

class UserCreate(UserBase):
    password: str
    full_name: Optional[str] = None

class UserUpdate(BaseModel):
    password: Optional[str] = None
    email: Optional[EmailStr] = None

class User(UserBase):
    id: UUID4
    created_at: datetime
    profile: Optional[Profile] = None

    class Config:
        from_attributes = True

# Link User Schema for minimal data inclusion
class LinkUser(BaseModel):
    id: UUID4
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None

    class Config:
        from_attributes = True

# Team Member Schemas
class TeamMemberBase(BaseModel):
    role_in_team: Optional[str] = None

class TeamMemberCreate(TeamMemberBase):
    member_id: UUID4

class TeamMember(TeamMemberBase):
    id: UUID4
    project_id: UUID4
    member_id: UUID4
    joined_at: Optional[datetime] = None
    member: Optional[LinkUser] = None 

    class Config:
        from_attributes = True

# Minimal Project Schema for Linking
class LinkProject(BaseModel):
    id: UUID4
    title: str

    class Config:
        from_attributes = True

# Collaboration Request Schemas
class CollaborationRequestBase(BaseModel):
    message: Optional[str] = None

class CollaborationRequestCreate(CollaborationRequestBase):
    project_id: UUID4

class CollaborationRequestUpdate(CollaborationRequestBase):
    status: RequestStatus

class CollaborationRequest(CollaborationRequestBase):
    id: UUID4
    project_id: UUID4
    sender_id: UUID4
    receiver_id: UUID4
    status: RequestStatus
    created_at: datetime
    sender: Optional[LinkUser] = None
    receiver: Optional[LinkUser] = None
    project: Optional[LinkProject] = None

    class Config:
        from_attributes = True

# Project Schemas
class ProjectBase(BaseModel):
    title: str
    description: str
    domain: str
    required_skills: List[str]
    team_size_required: int

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    title: Optional[str] = None
    description: Optional[str] = None
    domain: Optional[str] = None
    required_skills: Optional[List[str]] = None
    team_size_required: Optional[int] = None
    status: Optional[ProjectStatus] = None

class Project(ProjectBase):
    id: UUID4
    founder_id: UUID4
    status: ProjectStatus
    created_at: datetime
    founder: Optional[LinkUser] = None
    teams: List[TeamMember] = []

    class Config:
        from_attributes = True

# Dashboard Analytics Schema
class DashboardAnalytics(BaseModel):
    total_projects: int
    active_projects: int
    total_requests: int
    total_teammates: int
    project_wise_team_progress: List[dict] # {project_id: x, title: string, current: y, total: z}
