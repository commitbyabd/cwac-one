# This is the file which will be the middleware of all of the functions that
# out admin dashboard will be able to perform on doctors and receptionists.

from .doctor_list import doctor_list
from .get_one_doctor import get_one_doctor
from .set_doctor_state import set_doctor_state
from .receptionist_list import receptionist_list
from .get_one_receptionist import get_one_receptionist
from .set_receptionist_state import set_receptionist_state
from .add_doctor import create_doctor
from .add_receptionist import create_receptionist
from .edit_doctor import update_doctor
from .edit_receptionist import update_receptionist


async def doctor_list_api():
    return await doctor_list()


async def get_one_doctor_api(doctor_id: str):
    return await get_one_doctor(doctor_id)


async def deactivate_doctor_api(doctor_id: str):
    return await set_doctor_state(doctor_id, is_active=False)


async def edit_doctor_api(
    doctor_id: str,
    full_name: str | None = None,
    email: str | None = None,
    specialization: str | None = None,
):
    return await update_doctor(doctor_id, full_name, email, specialization)


async def reactivate_doctor_api(doctor_id: str):
    return await set_doctor_state(doctor_id, is_active=True)


async def add_doctor_api(
    full_name: str, email: str, password: str, specialization: str
):
    return await create_doctor(full_name, email, password, specialization)


# -------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------


async def receptionist_list_api():
    return await receptionist_list()


async def get_one_receptionist_api(receptionist_id: str):
    return await get_one_receptionist(receptionist_id)


async def deactivate_receptionist_api(receptionist_id: str):
    return await set_receptionist_state(receptionist_id, is_active=False)


async def reactivate_receptionist_api(receptionist_id: str):
    return await set_receptionist_state(receptionist_id, is_active=True)


async def add_receptionist_api(full_name: str, email: str, password: str):
    return await create_receptionist(full_name, email, password)


async def edit_receptionist_api(
    receptionist_id: str,
    full_name: str | None = None,
    email: str | None = None,
):
    return await update_receptionist(receptionist_id, full_name, email)
