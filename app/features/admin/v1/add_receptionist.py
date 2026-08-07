from app.core.database import get_database
from app.core.response import api_response
from app.core.security import hash_password
from app.db_functions.auth import get_user_by_email
from logging_config import logger


async def add_receptionist(payload: dict):
    full_name = payload.get("full_name")
    email = payload.get("email")
    # the schema wraps the password in SecretStr so it stays masked in logs
    password = payload.get("password").get_secret_value()

    try:
        if await get_user_by_email(email):
            return api_response(
                status_code=409,
                message="A user with this email already exists",
                error_code="EMAIL_TAKEN",
                data=None,
            )

        document = {
            "full_name": full_name,
            "email": email.lower(),
            "password_hash": hash_password(password),
            "role": "receptionist",
            "is_active": True,
        }

        result = await get_database().users.insert_one(document)

        return api_response(
            status_code=201,
            message="Receptionist created successfully",
            data={"id": str(result.inserted_id)},
        )

    except Exception:
        logger.exception("Error in add_receptionist")

        return api_response(
            status_code=500,
            message="Could not create the receptionist",
            error_code="RECEPTIONIST_CREATE_FAILED",
            data=None,
        )
