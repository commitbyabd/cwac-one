from fastapi import APIRouter, Depends, HTTPException, status

from app.dependencies.auth import require_role

from .v1.admin_dashboard import (
    doctor_list_api,
    get_one_doctor_api,
    deactivate_doctor_api,
    receptionist_list_api,
    get_one_receptionist_api,
    deactivate_receptionist_api,
)

router = APIRouter(prefix="/admin", tags=["admin-dashboard"])


@router.get("/doctors")
async def doctor_list(_: dict = Depends(require_role("admin"))):
    return await doctor_list_api()


@router.get("/doctors/{doctor_id}")
async def one_doctor(doctor_id: str, _: dict = Depends(require_role("admin"))):
    doctor = await get_one_doctor_api(doctor_id)

    if doctor is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found",
        )

    return doctor


@router.patch("/doctors/{doctor_id}/deactivate")
async def deactivate_doctor(doctor_id: str, _: dict = Depends(require_role("admin"))):
    deactivated = await deactivate_doctor_api(doctor_id)

    if not deactivated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found",
        )

    return {"message": "Doctor deactivated successfully"}


# -------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------


@router.get("/receptionists")
async def receptionist_list(_: dict = Depends(require_role("admin"))):
    return await receptionist_list_api()


@router.get("/receptionists/{receptionist_id}")
async def one_receptionist(
    receptionist_id: str, _: dict = Depends(require_role("admin"))
):
    receptionist = await get_one_receptionist_api(receptionist_id)

    if receptionist is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Receptionist not found",
        )

    return receptionist


@router.patch("/receptionists/{receptionist_id}/deactivate")
async def deactivate_receptionist(
    receptionist_id: str, _: dict = Depends(require_role("admin"))
):
    deactivated = await deactivate_receptionist_api(receptionist_id)

    if not deactivated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Receptionist not found",
        )

    return {"message": "Receptionist deactivated successfully"}
