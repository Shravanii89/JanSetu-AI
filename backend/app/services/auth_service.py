"""
JanSetu AI - Authentication Service
Handles credential verification and JWT generation.
"""

from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from app.models.user import UserModel
from app.core.security import verify_password, create_access_token
from app.schemas.auth import TokenResponse, UserInfo


class AuthService:
    async def authenticate_user(self, identifier: str, password: str, db: AsyncSession) -> Optional[TokenResponse]:
        """Authenticates an official by email or employee_id."""
        query = select(UserModel).where(
            or_(
                UserModel.email == identifier.strip().lower(),
                UserModel.employee_id == identifier.strip()
            )
        )
        result = await db.execute(query)
        user = result.scalars().first()

        if not user or not verify_password(password, user.password_hash):
            return None

        if not user.is_active:
            return None

        token_data = {
            "sub": str(user.id),
            "role": user.role,
            "department_id": user.department_id,
            "email": user.email,
            "full_name": user.full_name,
        }
        token = create_access_token(token_data)

        user_info = UserInfo(
            id=str(user.id),
            email=user.email,
            full_name=user.full_name,
            role=user.role,
            department_id=user.department_id,
            employee_id=user.employee_id,
        )

        return TokenResponse(access_token=token, token_type="bearer", user=user_info)


auth_service = AuthService()
