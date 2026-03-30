from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse

# Correctly initialize templates
templates = Jinja2Templates(directory="c:/Users/james/findme/app/templates")

router = APIRouter()

@router.get("/", response_class=HTMLResponse)
async def home(request: Request):
    # context must be a simple dict with string keys
    return templates.TemplateResponse({"request": request}, "index.html")

@router.get("/report", response_class=HTMLResponse)
async def report(request: Request):
    return templates.TemplateResponse({"request": request}, "report.html")

@router.get("/dashboard", response_class=HTMLResponse)
async def dashboard(request: Request):
    return templates.TemplateResponse({"request": request}, "dashboard.html")

@router.get("/test", response_class=HTMLResponse)
async def test(request: Request):
    return templates.TemplateResponse({"request": request}, "test.html")