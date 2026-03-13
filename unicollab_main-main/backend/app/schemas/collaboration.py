from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional, List
from enum import Enum

class ApplicationStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"

class NotificationType(str, Enum):
    APPLICATION_STATUS = "application_status"
    TEAM_INVITE = "team_invite"
    NEW_MESSAGE = "new_message"
    PROJECT_UPDATE = "project_update"

class ApplicationBase(BaseModel):
    project_id: UUID
    message: Optional[str] = None

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdate(BaseModel):
    status: ApplicationStatus

class Application(ApplicationBase):
    id: UUID
    applicant_id: UUID
    status: ApplicationStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class MessageBase(BaseModel):
    content: str

class MessageCreate(MessageBase):
    pass

class Message(MessageBase):
    id: UUID
    project_id: UUID
    sender_id: UUID
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)

class NotificationBase(BaseModel):
    type: NotificationType
    message: str
    reference_id: Optional[UUID] = None

class Notification(NotificationBase):
    id: UUID
    user_id: UUID
    is_read: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class TeamMember(BaseModel):
    user_id: UUID
    project_id: UUID
    role: str = "member"
    joined_at: datetime

    model_config = ConfigDict(from_attributes=True)
