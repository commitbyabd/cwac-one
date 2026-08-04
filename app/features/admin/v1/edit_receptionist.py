from bson import ObjectId
from app.core.database import get_database
from app.core.response import api_response
from app.db_functions.auth import get_user_by_email
from logging_config import logger


async def update_receptionist(
    receptionist_id: str,
    full_name: str | None = None,
    email: str | None = None,
):
    try:
        # malformed id, treat the same as "not found"
        if not ObjectId.is_valid(receptionist_id):
            return api_response(
                status_code=404,
                message="Receptionist not found",
                error_code="RECEPTIONIST_NOT_FOUND",
                data=None,
            )

        fields = {}

        if full_name is not None:
            fields["full_name"] = full_name

        if email is not None:
            existing = await get_user_by_email(email)

            # the email is free only if nobody owns it, or this receptionist already does
            if existing is not None and str(existing["_id"]) != receptionist_id:
                return api_response(
                    status_code=409,
                    message="A user with this email already exists",
                    error_code="EMAIL_TAKEN",
                    data=None,
                )

            fields["email"] = email.lower()

        if not fields:
            return api_response(
                status_code=400,
                message="No fields provided to update",
                error_code="NO_FIELDS_PROVIDED",
                data=None,
            )

        updated = await update_receptionist_query(receptionist_id, fields)

        if not updated:
            return api_response(
                status_code=404,
                message="Receptionist not found",
                error_code="RECEPTIONIST_NOT_FOUND",
                data=None,
            )

        return api_response(
            status_code=200,
            message="Receptionist updated successfully",
            data=None,
        )

    except Exception:
        logger.exception("Error in update_receptionist")

        return api_response(
            status_code=500,
            message="Could not update the receptionist",
            error_code="RECEPTIONIST_UPDATE_FAILED",
            data=None,
        )


async def update_receptionist_query(receptionist_id: str, fields: dict) -> bool:
    result = await get_database().users.update_one(
        {
            "_id": ObjectId(receptionist_id),
            "role": "receptionist",
        },  # role guard: admins are untouchable
        {"$set": fields},
    )

    return result.matched_count == 1
