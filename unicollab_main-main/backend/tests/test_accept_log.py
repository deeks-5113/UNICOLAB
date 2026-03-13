import sys, os
sys.path.append(os.path.dirname(os.path.abspath('app')))
from app.database.database import SessionLocal
from app.models import models

def main():
    db = SessionLocal()
    try:
        req = db.query(models.CollaborationRequest).first()
        if req:
            print(f'Trying to query request_id= {req.id}')
            r2 = db.query(models.CollaborationRequest).filter(models.CollaborationRequest.id == str(req.id)).first()
            print(f'Found r2= {r2.id}')
        else:
            print("No reqs found")
    except Exception as e:
        import traceback
        with open('error.txt', 'w') as f:
            traceback.print_exc(file=f)

if __name__ == '__main__':
    main()
