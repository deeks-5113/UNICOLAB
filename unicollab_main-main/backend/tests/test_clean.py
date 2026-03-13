import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.database import SessionLocal
from app.models import models

def main():
    db = SessionLocal()
    invalid_reqs = db.query(models.CollaborationRequest).filter(models.CollaborationRequest.receiver_id == None).all()
    print(f"Deleting {len(invalid_reqs)} invalid requests.")
    for r in invalid_reqs:
        db.delete(r)
    db.commit()

if __name__ == "__main__":
    main()
