from app.core.database import get_database


async def get_user_by_email(email: str) -> dict | None:
    return await get_database().users.find_one({"email": email.lower()})
