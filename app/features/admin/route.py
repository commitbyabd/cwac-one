from fastapi import APIRouter, Depends

from app.dependencies.auth import require_role

from .v1.admin_dashboard import (
    doctor_list_api,
    get_one_doctor_api,
    deactivate_doctor_api,
    receptionist_list_api,
    get_one_receptionist_api,
    deactivate_receptionist_api,
    reactivate_receptionist_api,
    reactivate_doctor_api,
    add_doctor_api,
    add_receptionist_api,
    edit_doctor_api,
    edit_receptionist_api,
)
from app.schemas.doctor_create import DoctorCreate
from app.schemas.doctor_update import DoctorUpdate
from app.schemas.receptionist_create import ReceptionistCreate
from app.schemas.receptionist_update import ReceptionistUpdate

router = APIRouter(prefix="/admin", tags=["admin-dashboard"])


@router.get("/doctors")
async def doctor_list(_: dict = Depends(require_role("admin"))):
    return await doctor_list_api()


@router.get("/doctors/{doctor_id}")
async def one_doctor(doctor_id: str, _: dict = Depends(require_role("admin"))):
    return await get_one_doctor_api(doctor_id)


@router.patch("/doctors/{doctor_id}/deactivate")
async def deactivate_doctor(doctor_id: str, _: dict = Depends(require_role("admin"))):
    return await deactivate_doctor_api(doctor_id)


@router.patch("/doctors/{doctor_id}/reactivate")
async def reactivate_doctor(doctor_id: str, _: dict = Depends(require_role("admin"))):
    return await reactivate_doctor_api(doctor_id)


@router.post("/doctors")
async def add_doctor(doctor: DoctorCreate, _: dict = Depends(require_role("admin"))):
    return await add_doctor_api(
        doctor.full_name,
        doctor.email,
        doctor.password.get_secret_value(),
        doctor.specialization,
    )


@router.patch("/doctors/{doctor_id}")
async def edit_doctor(
    doctor_id: str,
    doctor: DoctorUpdate,
    _: dict = Depends(require_role("admin")),
):
    return await edit_doctor_api(
        doctor_id,
        doctor.full_name,
        doctor.email,
        doctor.specialization,
    )


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
    return await get_one_receptionist_api(receptionist_id)


@router.patch("/receptionists/{receptionist_id}/deactivate")
async def deactivate_receptionist(
    receptionist_id: str, _: dict = Depends(require_role("admin"))
):
    return await deactivate_receptionist_api(receptionist_id)


@router.patch("/receptionists/{receptionist_id}/reactivate")
async def reactivate_receptionist(
    receptionist_id: str, _: dict = Depends(require_role("admin"))
):
    return await reactivate_receptionist_api(receptionist_id)


@router.post("/receptionists")
async def add_receptionist(
    receptionist: ReceptionistCreate, _: dict = Depends(require_role("admin"))
):
    return await add_receptionist_api(
        receptionist.full_name,
        receptionist.email,
        receptionist.password.get_secret_value(),
    )


@router.patch("/receptionists/{receptionist_id}")
async def edit_receptionist(
    receptionist_id: str,
    receptionist: ReceptionistUpdate,
    _: dict = Depends(require_role("admin")),
):
    return await edit_receptionist_api(
        receptionist_id,
        receptionist.full_name,
        receptionist.email,
    )
