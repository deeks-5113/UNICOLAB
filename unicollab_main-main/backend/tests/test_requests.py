import os
import sys

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.database import SessionLocal
from app.models import models

def main():
    db = SessionLocal()
    try:
        reqs = db.query(models.CollaborationRequest).all()
        print(f"Found {len(reqs)} requests.")
        for r in reqs:
            print(f"Request {r.id}: status={r.status}")
            print(f"  Project: {r.project.title if r.project else 'None'}")
            print(f"  Sender: {r.sender.full_name if r.sender else 'None'}")
            print(f"  Receiver: {r.receiver.full_name if r.receiver else 'None'}")
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
