from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.routes import public

app = FastAPI(title="FindMe")

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include public routes
app.include_router(public.router)