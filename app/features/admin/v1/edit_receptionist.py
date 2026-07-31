from app.core.exceptions import EmailAlreadyExists
from app.db_functions.admin import edit_user
from app.db_functions.auth import get_user_by_email


async def update_receptionist(
    receptionist_id: str,
    full_name: str | None = None,
    email: str | None = None,
) -> bool:
    fields = {}

    if full_name is not None:
        fields["full_name"] = full_name

    if email is not None:
        existing = await get_user_by_email(email)
        if existing is not None and str(existing["_id"]) != receptionist_id:
            raise EmailAlreadyExists()
        fields["email"] = email.lower()

    return await edit_user(receptionist_id, "receptionist", fields)
