"""
JanSetu AI - Main FastAPI Application Entry Point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import api_v1_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="JanSetu AI - AI-Powered Citizen Grievance Intelligence & Resolution Platform (Pune Municipal Corporation)",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# Configure CORS for local development and authorized origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API v1 routes
app.include_router(api_v1_router, prefix=settings.API_V1_STR)


@app.get("/", tags=["Root"], summary="Root Status")
async def root():
    return {
        "project": settings.PROJECT_NAME,
        "tagline": "From Citizen Voice to Government Action",
        "version": settings.VERSION,
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health",
    }
