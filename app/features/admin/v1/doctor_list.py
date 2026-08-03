from app.core.response import api_response
from app.core.database import get_database
from app.utils.object_serializer import serialize_documents


async def get_doctor_list(doctors: list[dict]):
    try:
        cursor = get_database().users.find(
            {"role": "doctor", "is_active": True},
            {"_id": 1, "full_name": 1, "email": 1, "specialization": 1},
        )
        doctors = await cursor.to_list(length=None)
        doctors = serialize_documents(doctors)
        return api_response(
            status_code=200,
            message="Doctors list retrieved successfully",
            error_code=None,
            data=doctors,
        )

    except Exception as e:
        print(f"Error in get_doctor_list: {e}")
        return api_response(
            status_code=500,
            message="Error in retrieving doctor list from the server, cause: " + str(e),
            error_code=str(e),
            data=[],
        )
