from bson import ObjectId
from app.core.database import get_database
from app.core.response import api_response
from app.db_functions.auth import get_user_by_email
from logging_config import logger


async def edit_doctor(
    doctor_id: str,
    full_name: str | None = None,
    email: str | None = None,
    specialization: str | None = None,
):
    try:
        # malformed id, treat the same as "not found"
        if not ObjectId.is_valid(doctor_id):
            return api_response(
                status_code=404,
                message="Doctor not found",
                error_code="DOCTOR_NOT_FOUND",
                data=None,
            )

        fields = {}

        if full_name is not None:
            fields["full_name"] = full_name

        if specialization is not None:
            fields["specialization"] = specialization

        if email is not None:
            existing = await get_user_by_email(email)

            # the email is free only if nobody owns it, or this doctor already does
            if existing is not None and str(existing["_id"]) != doctor_id:
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

        updated = await edit_doctor_query(doctor_id, fields)

        if not updated:
            return api_response(
                status_code=404,
                message="Doctor not found",
                error_code="DOCTOR_NOT_FOUND",
                data=None,
            )

        return api_response(
            status_code=200,
            message="Doctor updated successfully",
            data=None,
        )

    except Exception:
        logger.exception("Error in edit_doctor")

        return api_response(
            status_code=500,
            message="Could not update the doctor",
            error_code="DOCTOR_UPDATE_FAILED",
            data=None,
        )


async def edit_doctor_query(doctor_id: str, fields: dict) -> bool:
    result = await get_database().users.update_one(
        {
            "_id": ObjectId(doctor_id),
            "role": "doctor",
        },  # role guard: admins are untouchable
        {"$set": fields},
    )

    return result.matched_count == 1
