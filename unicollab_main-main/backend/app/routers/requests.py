from typing import Any, List, Optional
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
        
    # Check if requests are enabled by owner
    if not project.requests_enabled:
        raise HTTPException(status_code=403, detail="The project owner has disabled new join requests.")

    # Eligibility validation
    user_profile = current_user.profile
    if not user_profile:
        raise HTTPException(status_code=400, detail="User profile not found. Please complete your profile.")

    # Skill validation (Compulsory)
    if project.required_skills:
        user_skills = [s.lower() for s in (user_profile.skills or [])]
        missing_skills = [s for s in project.required_skills if s.lower() not in user_skills]
        if missing_skills:
            raise HTTPException(
                status_code=403, 
                detail=f"Missing compulsory skills: {', '.join(missing_skills)}. Please add them to your profile if you have these skills."
            )

    # Check Year
    if project.eligible_years:
        user_year = (user_profile.year_of_study or "").strip().lower()
        project_years = [y.strip().lower() for y in project.eligible_years]
        if user_year not in project_years:
            raise HTTPException(status_code=403, detail=f"Ineligible year. This project is for {', '.join(project.eligible_years)}.")
    
    # Check Branch
    if project.eligible_branches:
        user_branch = (user_profile.branch or "").strip().lower()
        project_branches = [b.strip().lower() for b in project.eligible_branches]
        if user_branch not in project_branches:
            # If branches are specified, user must match one of them. 
            # If empty, everyone is eligible for branch (logic preserved above).
            raise HTTPException(status_code=403, detail=f"Ineligible branch. This project is for {', '.join(project.eligible_branches)}.")

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
    project_id: Optional[str] = None,
) -> Any:
    """
    Get requests received for my projects. Optionally filter by project_id.
    """
    query = db.query(models.CollaborationRequest).join(models.Project).filter(
        models.Project.founder_id == current_user.id
    )
    if project_id:
        import uuid
        try:
            p_uuid = uuid.UUID(project_id)
            query = query.filter(models.CollaborationRequest.project_id == p_uuid)
        except ValueError:
            pass
    return query.all()

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
