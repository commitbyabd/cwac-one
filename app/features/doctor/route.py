from fastapi import APIRouter, Depends

from app.dependencies.auth import require_role
from app.schemas.doctor_schedule_update import DoctorScheduleUpdate


from .v1.doctor_dashboard import get_doctor_schedule_api, edit_doctor_schedule_api

router = APIRouter(prefix="/doctor", tags=["doctor-dashboard"])


# The admin routes discard the user because their target comes from the URL.
# Here the target IS the caller, so the id is taken off the token: a doctor
# cannot ask for somebody else's schedule because there is nothing to ask with.
@router.get("/schedule")
async def doctor_schedule(user: dict = Depends(require_role("doctor"))):
    return await get_doctor_schedule_api(str(user["_id"]))


# PUT, not POST: the whole week arrives every time and replaces what was there,
# so sending the same body twice leaves the schedule in the same state.
@router.put("/schedule")
async def save_doctor_schedule(
    schedule: DoctorScheduleUpdate,
    user: dict = Depends(require_role("doctor")),
):
    return await edit_doctor_schedule_api(
        {"doctor_id": str(user["_id"]), **schedule.model_dump()}
    )
