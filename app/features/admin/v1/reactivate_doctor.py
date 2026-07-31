from app.db_functions.admin import set_doctor_activation_state


async def reactivate_doctor(doctor_id: str) -> bool:
    return await set_doctor_activation_state(doctor_id, is_active=True)
