from fastapi import APIRouter, Depends

from app.dependencies.auth import require_role

from .v1.admin_dashboard import doctor_list_api

router = APIRouter(prefix="/admin", tags=["admin-dashboard"])


@router.get("/doctors")
async def doctor_list(_: dict = Depends(require_role("admin"))):
    return await doctor_list_api()
