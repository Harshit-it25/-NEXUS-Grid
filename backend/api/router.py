# /backend/api/router.py
from fastapi import APIRouter
from backend.api.endpoints import (
    infrastructure_router,
    planning_router,
    crisis_router
)

router = APIRouter()

# Mount modularized engine routes
router.include_router(infrastructure_router)
router.include_router(planning_router)
router.include_router(crisis_router)

