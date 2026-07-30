# This is the file which will be the middleware of all of the functions that
# out admin dashboard will be able to perform on doctors and receptionists.

from .doctor_list import doctor_list
from .get_one_doctor import one_doctor_by_id


async def doctor_list_api():
    return await doctor_list()


async def get_one_doctor_api(doctor_id: str):
    return await one_doctor_by_id(doctor_id)
