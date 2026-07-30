# This file holds all the DB queries required by the admin to perform thier operations.
from app.core.database import get_database

# GET Doctors list from the database Query
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


# ------------------------------------------------------------------------
