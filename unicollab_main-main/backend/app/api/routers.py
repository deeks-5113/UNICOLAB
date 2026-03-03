from fastapi import APIRouter
from app.routers import auth, users, projects, marketplace, requests, dashboard

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(marketplace.router, prefix="/marketplace", tags=["marketplace"])
api_router.include_router(requests.router, prefix="/requests", tags=["requests"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
