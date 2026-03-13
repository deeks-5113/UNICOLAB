from pydantic_settings import BaseSettings
from typing import List, Union

class Settings(BaseSettings):
    PROJECT_NAME: str = "UniCollab"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "YOUR_SUPER_SECRET_KEY_HERE_CHANGE_IN_PRODUCTION" # TODO: Change this!
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Supabase
    SUPABASE_URL: str = "https://ynchupdotsavqddoucxe.supabase.co"
    SUPABASE_ANON_KEY: str = "sb_publishable_1MYeorpaggVUcIqD1hVWUw_yjJw08X3"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000", "http://localhost:8000", "http://127.0.0.1:3000",
        "http://localhost:3001", "http://127.0.0.1:3001",
        "http://localhost:3002", "http://127.0.0.1:3002",
        "http://localhost:5000", "http://127.0.0.1:5000",
        "http://localhost:5173", "http://127.0.0.1:5173",
        "http://localhost:5174", "http://127.0.0.1:5174",
        "http://localhost:5178", "http://127.0.0.1:5178"
    ]

    # Database
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./unicollab.db"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
