# This is the file which will be the middleware of all of the functions that
# out admin dashboard will be able to perform on doctors and receptionists.

from .doctor_list import doctor_list
from .get_one_doctor import one_doctor_by_id
from .deactivate_doctor import deactivate_doctor
from .receptionist_list import receptionist_list
from .get_one_receptionist import one_receptionist_by_id
from .deactivate_receptionist import deactivate_receptionist
from .reactivate_doctor import reactivate_doctor
from .reactivate_receptionist import reactivate_receptionist
from .add_doctor import create_doctor
from .add_receptionist import create_receptionist


async def doctor_list_api():
    return await doctor_list()


async def get_one_doctor_api(doctor_id: str):
    return await one_doctor_by_id(doctor_id)


async def deactivate_doctor_api(doctor_id: str):
    return await deactivate_doctor(doctor_id)


async def receptionist_list_api():
    return await receptionist_list()


async def get_one_receptionist_api(receptionist_id: str):
    return await one_receptionist_by_id(receptionist_id)


async def deactivate_receptionist_api(receptionist_id: str):
    return await deactivate_receptionist(receptionist_id)


async def reactivate_doctor_api(doctor_id: str):
    return await reactivate_doctor(doctor_id)


async def reactivate_receptionist_api(receptionist_id: str):
    return await reactivate_receptionist(receptionist_id)


async def add_doctor_api(
    full_name: str, email: str, password: str, specialization: str
) -> str | None:
    return await create_doctor(full_name, email, password, specialization)


async def add_receptionist_api(full_name: str, email: str, password: str) -> str | None:
    return await create_receptionist(full_name, email, password)
