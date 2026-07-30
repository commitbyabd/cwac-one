from app.db_functions.admin import set_activation_state


async def deactivate_doctor(doctor_id: str) -> bool:
    return await set_activation_state(doctor_id, is_active=False)
