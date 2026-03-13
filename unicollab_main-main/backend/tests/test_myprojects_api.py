import os
import sys

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.database import SessionLocal
from app.models import models
from app.schemas import schemas
from sqlalchemy import or_

def main():
    db = SessionLocal()
    user = db.query(models.User).first()
    if not user:
        print("No users in DB.")
        return

    projects = db.query(models.Project).filter(
        or_(
            models.Project.founder_id == user.id,
            models.Project.teams.any(models.Team.member_id == user.id)
        )
    ).all()

    with open("test_output_log.txt", "w", encoding="utf-8") as f:
        for p in projects:
            f.write(f"\nProject: {p.title}\n")
            try:
                schema_proj = schemas.Project.from_orm(p)
                f.write(f"Schema mapping valid: teams={len(schema_proj.teams)}, team_size_required={schema_proj.team_size_required}\n")
            except Exception as e:
                import traceback
                traceback.print_exc(file=f)

if __name__ == "__main__":
    main()
