# This file holds all the DB queries required by the admin to perform thier operations in the dashboard.
from app.core.database import get_database
from bson import ObjectId
from bson.errors import InvalidId

# GET Doctors list from the following database Query
# -----------------------------------------------------------------------


async def list_doctors() -> list[dict]:
    cursor = get_database().users.find(
        {"role": "doctor", "is_active": True},
        {"_id": 1, "full_name": 1, "email": 1, "specialization": 1},
    )
    doctors = await cursor.to_list(
        length=None
    )  # means no matter the length get me eveything

    # ObjectId is a pymongo type, JSON has no equivalent, so it never leaves this layer
    for doctor in doctors:
        doctor["id"] = str(doctor.pop("_id"))

    return doctors


# GET Doctor id (one specific doctor) from the following database query
# ------------------------------------------------------------------------
async def get_doctor_by_id(doctor_id: str) -> dict | None:
    try:
        object_id = ObjectId(doctor_id)
    except InvalidId:
        return None  # malformed id, treat the same as "not found"

    doctor = await get_database().users.find_one(
        {"_id": object_id, "role": "doctor"},
        {"_id": 1, "full_name": 1, "email": 1, "specialization": 1, "is_active": 1},
    )
    # this if statement was added is the id is valid but no doc exists agaisnt that id
    if doctor is None:
        return None

    doctor["id"] = str(doctor.pop("_id"))
    return doctor


# ------------------------------------------------------------------------
