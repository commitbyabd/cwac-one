from fastapi import APIRouter, Depends

from app.dependencies.auth import require_role

router = APIRouter(prefix="/doctor", tags=["doctor-dashboard"])
