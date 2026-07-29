from fastapi import FastAPI

from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings

from app.core.database import connect_to_mongo, close_mongo_connection 
@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()  
    yield                          # app runs here, serving requests
    await close_mongo_connection() # runs once, at shutdown

app=FastAPI(lifespan=lifespan)
@app.get("/")
async def read_root():
    return {"Hello": "World"}