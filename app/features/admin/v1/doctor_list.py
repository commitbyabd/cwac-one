from app.db_functions.admin import list_doctors


async def doctor_list():
    return await list_doctors()
