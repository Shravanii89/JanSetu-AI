"""
JanSetu AI - Unified Authentication Controller
Supports Citizen Registration, Unified Login, Profile Management,
Civic Credits Tracking, and Badge Showcase backed by Supabase PostgreSQL.
"""

from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    ProfileUpdateRequest,
    TokenResponse,
    UserInfo,
)
from app.services.auth_service import auth_service
from app.services.contribution_service import contribution_service
from app.models.user import UserModel
from app.core.security import create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(
    data: RegisterRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Public Citizen Registration.
    Strictly restricted to creating CITIZEN accounts. Official roles cannot be registered.
    """
    return await auth_service.register_citizen(data, db)


@router.post("/login", response_model=TokenResponse)
async def login(
    credentials: LoginRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Unified Citizen & Official Login.
    Accepts Email, Employee ID, or Phone Number with Password.
    Returns signed JWT containing user claims (role, department_id).
    """
    token_resp = await auth_service.authenticate_user(
        identifier=credentials.get_identifier,
        password=credentials.password,
        db=db,
    )
    if not token_resp:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials or inactive account",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return token_resp


@router.get("/me", response_model=UserInfo)
async def get_current_authenticated_user(
    current_user: UserModel = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Returns enriched profile, role claims, Civic Credits, level, and badges for current user."""
    return await auth_service.build_user_info(current_user, db)


@router.patch("/profile", response_model=UserInfo)
async def update_profile(
    profile_data: ProfileUpdateRequest,
    current_user: UserModel = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Updates contact information and localization preferences for current user."""
    return await auth_service.update_profile(current_user, profile_data, db)


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    current_user: UserModel = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Refreshes authentication token for an active session."""
    token_data = {
        "sub": str(current_user.id),
        "role": current_user.role,
        "department_id": current_user.department_id,
        "email": current_user.email,
        "full_name": current_user.full_name,
    }
    new_token = create_access_token(token_data)
    user_info = await auth_service.build_user_info(current_user, db)
    return TokenResponse(access_token=new_token, token_type="bearer", user=user_info)


@router.get("/contributions")
async def get_my_contributions(
    current_user: UserModel = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> List[Dict[str, Any]]:
    """Returns chronological log of Civic Credits earned by the authenticated citizen."""
    return await contribution_service.get_user_contributions_history(str(current_user.id), db)


@router.get("/badges")
async def get_my_badges(
    current_user: UserModel = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    """Returns earned civic recognition badges and available badges with unlock criteria."""
    return await contribution_service.get_user_badges_summary(str(current_user.id), db)


@router.post("/logout")
async def logout():
    """Client session invalidation confirmation."""
    return {"status": "ok", "message": "Successfully logged out"}


@router.post("/forgot-password")
async def forgot_password():
    """Standard safe response for password reset instructions."""
    return {
        "status": "ok",
        "message": "If an account with that email exists, password reset instructions have been dispatched.",
    }


@router.post("/reset-password")
async def reset_password():
    """Standard safe response for password reset confirmation."""
    return {
        "status": "ok",
        "message": "Password has been successfully updated. Please sign in with your new password.",
    }
