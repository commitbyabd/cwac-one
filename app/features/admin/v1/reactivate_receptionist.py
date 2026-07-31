from app.db_functions.admin import set_receptionist_activation_state


async def reactivate_receptionist(receptionist_id: str) -> bool:
    return await set_receptionist_activation_state(receptionist_id, is_active=True)
