from app.core.security import hash_password
from app.db_functions.admin import create_user
from app.db_functions.auth import get_user_by_email


async def create_doctor(
    full_name: str, email: str, password: str, specialization: str
) -> str | None:
    if await get_user_by_email(email):
        return None

    document = {
        "full_name": full_name,
        "email": email.lower(),
        "password_hash": hash_password(password),
        "specialization": specialization,
        "role": "doctor",
        "is_active": True,
    }

    return await create_user(document)
