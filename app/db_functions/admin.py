# This file holds all the DB queries required by the admin to perform thier operations.
from app.core.database import get_database

#GET Doctors list from the database Query
#-------------------------------------------------------------------

async def get_doctors_list()->dict / None:

return await get_database().users.find()



#-------------------------------------------------------------------