from sqlalchemy import Column, ForeignKey, Integer, String, Text, Enum, DateTime, JSON, Boolean, Uuid
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum
from app.database.database import Base

class UserRole(str, enum.Enum):
    FOUNDER = "founder"
    COLLABORATOR = "collaborator"

class ProjectStatus(str, enum.Enum):
    OPEN = "open"
    RECRUITING = "recruiting"
    CLOSED = "closed"

class RequestStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"

class User(Base):
    __tablename__ = "users"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String, default=UserRole.COLLABORATOR)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    profile = relationship("Profile", back_populates="user", uselist=False)

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Uuid(as_uuid=True), ForeignKey("users.id"), primary_key=True, default=uuid.uuid4, index=True)
    full_name = Column(Text)
    email = Column(Text)
    role = Column(Text)
    domain = Column(Text)
    skills = Column(JSON)
    interests = Column(Text)
    year_of_study = Column(Text)
    branch = Column(Text)
    portfolio_links = Column(JSON)
    avatar_url = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="profile")
    founded_projects = relationship("Project", back_populates="founder")
    sent_requests = relationship("CollaborationRequest", primaryjoin="Profile.id == CollaborationRequest.sender_id", back_populates="sender")
    received_requests = relationship("CollaborationRequest", primaryjoin="Profile.id == CollaborationRequest.receiver_id", back_populates="receiver")
    team_memberships = relationship("Team", back_populates="member")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    founder_id = Column(Uuid(as_uuid=True), ForeignKey("profiles.id"))
    title = Column(Text)
    description = Column(Text)
    domains = Column(JSON)
    required_skills = Column(JSON)
    eligible_years = Column(JSON)
    eligible_branches = Column(JSON)
    team_size_required = Column(Integer)
    status = Column(Text, default=ProjectStatus.OPEN)
    requests_enabled = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    founder = relationship("Profile", back_populates="founded_projects")
    requests = relationship("CollaborationRequest", back_populates="project")
    teams = relationship("Team", back_populates="project")
    analytics = relationship("Analytics", back_populates="project", uselist=False)

class CollaborationRequest(Base):
    __tablename__ = "collaboration_requests"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    project_id = Column(Uuid(as_uuid=True), ForeignKey("projects.id"))
    sender_id = Column(Uuid(as_uuid=True), ForeignKey("profiles.id"))
    receiver_id = Column(Uuid(as_uuid=True), ForeignKey("profiles.id"))
    status = Column(Text, default=RequestStatus.PENDING)
    message = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    project = relationship("Project", back_populates="requests")
    sender = relationship("Profile", primaryjoin="CollaborationRequest.sender_id == Profile.id", back_populates="sent_requests")
    receiver = relationship("Profile", primaryjoin="CollaborationRequest.receiver_id == Profile.id", back_populates="received_requests")

class Team(Base):
    __tablename__ = "teams"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    project_id = Column(Uuid(as_uuid=True), ForeignKey("projects.id"))
    member_id = Column(Uuid(as_uuid=True), ForeignKey("profiles.id"))
    role_in_team = Column(Text) 
    joined_at = Column(DateTime(timezone=True), server_default=func.now())

    project = relationship("Project", back_populates="teams")
    member = relationship("Profile", back_populates="team_memberships")

class Analytics(Base):
    __tablename__ = "analytics"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    project_id = Column(Uuid(as_uuid=True), ForeignKey("projects.id"), unique=True)
    applicants_count = Column(Integer, default=0)
    views_count = Column(Integer, default=0)
    team_completion_percentage = Column(Integer, default=0)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    project = relationship("Project", back_populates="analytics")
