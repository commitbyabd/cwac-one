from bson import ObjectId

from app.core.database import get_database
from app.core.response import api_response
from logging_config import logger


async def deactivate_receptionist(receptionist_id: str):
    try:
        # malformed id, treat the same as "not found"
        if not ObjectId.is_valid(receptionist_id):
            return api_response(
                status_code=404,
                message="Receptionist not found",
                error_code="RECEPTIONIST_NOT_FOUND",
                data=None,
            )

        result = await get_database().users.update_one(
            {
                "_id": ObjectId(receptionist_id),
                "role": "receptionist",
            },  # role guard: admins are untouchable
            {"$set": {"is_active": False}},
        )

        if result.matched_count == 0:
            return api_response(
                status_code=404,
                message="Receptionist not found",
                error_code="RECEPTIONIST_NOT_FOUND",
                data=None,
            )

        return api_response(
            status_code=200,
            message="Receptionist deactivated successfully",
            data=None,
        )

    except Exception:
        logger.exception("Error in deactivate_receptionist")

        return api_response(
            status_code=500,
            message="Could not deactivate the receptionist",
            error_code="RECEPTIONIST_DEACTIVATE_FAILED",
            data=None,
        )
