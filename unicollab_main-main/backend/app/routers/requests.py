from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models import models
from app.schemas import schemas

router = APIRouter()

@router.post("/send", response_model=schemas.CollaborationRequest)
def send_request(
    *,
    db: Session = Depends(deps.get_db),
    request_in: schemas.CollaborationRequestCreate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Send a collaboration request to join a project.
    """
    # Check if project exists
    project = db.query(models.Project).filter(models.Project.id == request_in.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Check if already requested or member
    existing_request = db.query(models.CollaborationRequest).filter(
        models.CollaborationRequest.project_id == request_in.project_id,
        models.CollaborationRequest.sender_id == current_user.id
    ).first()
    if existing_request:
        raise HTTPException(status_code=400, detail="Request already sent")
        
    # Check if closed
    if project.status == models.ProjectStatus.CLOSED:
        raise HTTPException(status_code=400, detail="Project is closed")

    request = models.CollaborationRequest(
        project_id=request_in.project_id,
        sender_id=current_user.id,
        receiver_id=project.founder_id,
        message=request_in.message,
        status=models.RequestStatus.PENDING
    )
    db.add(request)
    db.commit()
    db.refresh(request)
    return request

@router.get("/received", response_model=List[schemas.CollaborationRequest])
def read_received_requests(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Get requests received for my projects.
    """
    return db.query(models.CollaborationRequest).join(models.Project).filter(
        models.Project.founder_id == current_user.id
    ).all()

@router.get("/sent", response_model=List[schemas.CollaborationRequest])
def read_sent_requests(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Get requests sent by me.
    """
    return db.query(models.CollaborationRequest).filter(
        models.CollaborationRequest.sender_id == current_user.id
    ).all()

@router.post("/{request_id}/accept", response_model=schemas.CollaborationRequest)
def accept_request(
    request_id: str,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Accept a collaboration request.
    """
    import uuid
    try:
        req_uuid = uuid.UUID(request_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid request ID format")
        
    request = db.query(models.CollaborationRequest).filter(models.CollaborationRequest.id == req_uuid).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
        
    project = request.project
    if str(project.founder_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    if request.status != models.RequestStatus.PENDING:
         raise HTTPException(status_code=400, detail="Request is not pending")

    request.status = models.RequestStatus.ACCEPTED
    
    # Add to team members
    team_member = models.Team(
        project_id=project.id,
        member_id=request.sender_id,
        role_in_team="Collaborator" # Default role
    )
    db.add(team_member)
    db.commit()
    db.refresh(request)
    return request

@router.post("/{request_id}/reject", response_model=schemas.CollaborationRequest)
def reject_request(
    request_id: str,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Reject a collaboration request.
    """
    import uuid
    try:
        req_uuid = uuid.UUID(request_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid request ID format")
        
    request = db.query(models.CollaborationRequest).filter(models.CollaborationRequest.id == req_uuid).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
        
    project = request.project
    if str(project.founder_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")

    request.status = models.RequestStatus.REJECTED
    db.commit()
    db.refresh(request)
    return request
