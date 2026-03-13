import os, sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.database import SessionLocal
from app.models import models

def main():
    db = SessionLocal()
    project = db.query(models.Project).first()
    if project:
        print("Project:", project.title)
        print("Founder:", project.founder.full_name)
        print("Teams:", len(project.teams))
    else:
        print("No project found.")

if __name__ == "__main__":
    main()
