# This is the file which will be the middleware of all of the functions that
# out admin dashboard will be able to perform on doctors and receptionists.

from .doctor_list import doctor_list


async def doctor_list_api():
    return await doctor_list()
