from app.db_functions.admin import list_receptionists


async def receptionist_list():
    return await list_receptionists()
