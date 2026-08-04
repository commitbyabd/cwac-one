from bson import ObjectId

from app.core.database import get_database
from app.core.response import api_response
from logging_config import logger


async def reactivate_doctor(doctor_id: str):
    try:
        # malformed id, treat the same as "not found"
        if not ObjectId.is_valid(doctor_id):
            return api_response(
                status_code=404,
                message="Doctor not found",
                error_code="DOCTOR_NOT_FOUND",
                data=None,
            )

        result = await get_database().users.update_one(
            {
                "_id": ObjectId(doctor_id),
                "role": "doctor",
            },  # role guard: admins are untouchable
            {"$set": {"is_active": True}},
        )

        if result.matched_count == 0:
            return api_response(
                status_code=404,
                message="Doctor not found",
                error_code="DOCTOR_NOT_FOUND",
                data=None,
            )

        return api_response(
            status_code=200,
            message="Doctor reactivated successfully",
            data=None,
        )

    except Exception:
        logger.exception("Error in reactivate_doctor")

        return api_response(
            status_code=500,
            message="Could not reactivate the doctor",
            error_code="DOCTOR_REACTIVATE_FAILED",
            data=None,
        )
