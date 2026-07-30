from app.db_functions.admin import get_receptionist_by_id


async def one_receptionist_by_id(receptionist_id: str) -> dict | None:
    return await get_receptionist_by_id(receptionist_id)
