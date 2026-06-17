# /backend/main.py
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.core.config import settings
from backend.api.router import router as api_router

app = FastAPI(
    title="Cassandra GridOS Core",
    description=(
        "Production-Grade AI-powered Energy Infrastructure Planning Operating System designed "
        "for National Utility Companies, Municipal Energy Authorities, and Rural Electrification Agencies."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS Policy configuration mapping
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, lock this down to specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect centralized router
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {
        "status": "ONLINE",
        "system": "Cassandra GridOS Enterprise OS Core",
        "documentation": "/docs",
        "api_v1_version": "/api/v1"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
