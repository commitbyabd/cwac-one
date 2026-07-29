from fastapi import HTTPException, status

from app.core.security import create_access_token, verify_password
from app.db_functions.auth import get_user_by_email
