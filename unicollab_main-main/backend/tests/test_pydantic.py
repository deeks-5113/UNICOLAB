import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.database import SessionLocal
from app.models import models
from app.schemas import schemas
from pydantic import TypeAdapter
from typing import List

def main():
    db = SessionLocal()
    reqs = db.query(models.CollaborationRequest).all()
    try:
        adapter = TypeAdapter(List[schemas.CollaborationRequest])
        data = adapter.validate_python(reqs)
        print("Serialization Successful!")
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
