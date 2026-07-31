# This file holds all the DB queries required by the admin to perform thier operations in the dashboard.
from app.core.database import get_database
from bson import ObjectId
from bson.errors import InvalidId

# ADD Doctors from the following database Query
# -----------------------------------------------------------------------

# INSERT a new staff user with the following database query
# ------------------------------------------------------------------------


async def create_user(user_document: dict) -> str:
    result = await get_database().users.insert_one(user_document)
    return str(result.inserted_id)


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


# $set activation state of the specific doctor by using the following query
# ------------------------------------------------------------------------


async def set_doctor_activation_state(doctor_id: str, is_active: bool) -> bool:
    try:
        object_id = ObjectId(doctor_id)
    except InvalidId:
        return False  # malformed id, treat the same as "not found"

    result = await get_database().users.update_one(
        {"_id": object_id, "role": "doctor"},  # role guard: admins are untouchable
        {"$set": {"is_active": is_active}},
    )

    return result.matched_count == 1


# GET Receptionist list from the following database Query
# ------------------------------------------------------------------------


async def list_receptionists() -> list[dict]:
    cursor = get_database().users.find(
        {"role": "receptionist", "is_active": True},
        {"_id": 1, "full_name": 1, "email": 1},
    )
    receptionists = await cursor.to_list(
        length=None
    )  # means no matter the length get me eveything

    # ObjectId is a pymongo type, JSON has no equivalent, so it never leaves this layer
    for receptionist in receptionists:
        receptionist["id"] = str(receptionist.pop("_id"))

    return receptionists


# GET Receptionist id (one specific receptionist) from the following database query
# ------------------------------------------------------------------------
async def get_receptionist_by_id(receptionist_id: str) -> dict | None:
    try:
        object_id = ObjectId(receptionist_id)
    except InvalidId:
        return None  # malformed id, treat the same as "not found"

    receptionist = await get_database().users.find_one(
        {"_id": object_id, "role": "receptionist"},
        {"_id": 1, "full_name": 1, "email": 1},
    )
    # this if statement was added is the id is valid but no doc exists agaisnt that id
    if receptionist is None:
        return None

    receptionist["id"] = str(receptionist.pop("_id"))
    return receptionist


# $set activation state of the specific receptionist by using the following query
# ------------------------------------------------------------------------


async def set_receptionist_activation_state(
    receptionist_id: str, is_active: bool
) -> bool:
    try:
        object_id = ObjectId(receptionist_id)
    except InvalidId:
        return False  # malformed id, treat the same as "not found"

    result = await get_database().users.update_one(
        {
            "_id": object_id,
            "role": "receptionist",
        },  # role guard: admins are untouchable
        {"$set": {"is_active": is_active}},
    )

    return result.matched_count == 1
