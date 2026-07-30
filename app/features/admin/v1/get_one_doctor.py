from app.db_functions.admin import get_doctor_by_id


async def one_doctor_by_id(doctor_id: str) -> dict | None:
    return await get_doctor_by_id(doctor_id)
