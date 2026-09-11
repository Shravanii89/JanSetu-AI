"""
JanSetu AI - Unified Official Authentication Controller
Zero role selection on client: Backend validates credentials and assigns destination.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.schemas.auth import LoginRequest, TokenResponse, UserInfo
from app.services.auth_service import auth_service
from app.models.user import UserModel

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
async def login(
    credentials: LoginRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Unified Official Login.
    Accepts Email or Employee ID with Password.
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
):
    """Returns profile and role claims for currently logged-in official."""
    return UserInfo(
        id=str(current_user.id),
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role,
        department_id=current_user.department_id,
        employee_id=current_user.employee_id,
    )


@router.post("/logout")
async def logout():
    """Client session invalidation confirmation."""
    return {"status": "ok", "message": "Successfully logged out"}
