"""
JanSetu AI - Authentication Service
Handles credential verification, citizen registration, profile updates, and JWT generation.
"""

from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from fastapi import HTTPException, status

from app.models.user import UserModel
from app.models.badge import UserBadgeModel
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.time import get_ist_now
from app.schemas.auth import TokenResponse, UserInfo, RegisterRequest, ProfileUpdateRequest
from app.services.contribution_service import contribution_service


class AuthService:
    async def build_user_info(self, user: UserModel, db: AsyncSession) -> UserInfo:
        """Enriches UserModel into API UserInfo schema with civic recognition metrics."""
        credits = await contribution_service.get_total_credits(str(user.id), db)
        level = contribution_service.get_level_for_credits(credits)

        badges_res = await db.execute(
            select(UserBadgeModel.id).where(UserBadgeModel.user_id == str(user.id))
        )
        badges_count = len(badges_res.scalars().all())

        return UserInfo(
            id=str(user.id),
            email=user.email,
            full_name=user.full_name,
            role=user.role,
            department_id=user.department_id,
            employee_id=user.employee_id,
            phone=user.phone,
            address=user.address,
            ward=user.ward,
            preferred_language=user.preferred_language or "en",
            civic_credits=credits,
            contribution_level=level,
            badges_count=badges_count,
            last_login=user.last_login.isoformat() if user.last_login else None,
        )

    async def authenticate_user(self, identifier: str, password: str, db: AsyncSession) -> Optional[TokenResponse]:
        """Authenticates a citizen or official by email, employee_id, or phone number."""
        clean_id = identifier.strip()
        query = select(UserModel).where(
            or_(
                UserModel.email == clean_id.lower(),
                UserModel.employee_id == clean_id,
                UserModel.phone == clean_id,
            )
        )
        result = await db.execute(query)
        user = result.scalars().first()

        if not user or not verify_password(password, user.password_hash):
            return None

        if not user.is_active:
            return None

        # Update last_login timestamp in Supabase
        user.last_login = get_ist_now()
        await db.commit()

        token_data = {
            "sub": str(user.id),
            "role": user.role,
            "department_id": user.department_id,
            "email": user.email,
            "full_name": user.full_name,
        }
        token = create_access_token(token_data)
        user_info = await self.build_user_info(user, db)

        return TokenResponse(access_token=token, token_type="bearer", user=user_info)

    async def register_citizen(self, data: RegisterRequest, db: AsyncSession) -> TokenResponse:
        """Registers a new Citizen with Supabase. Strictly enforces role='CITIZEN'."""
        email_clean = data.email.strip().lower()
        phone_clean = data.phone.strip()

        # 1. Uniqueness check for email
        existing_email = await db.execute(
            select(UserModel).where(UserModel.email == email_clean)
        )
        if existing_email.scalars().first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email address is already registered.",
            )

        # 2. Uniqueness check for phone
        existing_phone = await db.execute(
            select(UserModel).where(UserModel.phone == phone_clean)
        )
        if existing_phone.scalars().first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this mobile number is already registered.",
            )

        # 3. Create citizen user (strictly CITIZEN role)
        now = get_ist_now()
        user = UserModel(
            email=email_clean,
            phone=phone_clean,
            full_name=data.full_name.strip(),
            password_hash=get_password_hash(data.password),
            role="CITIZEN",  # Server-authoritative: public registration ONLY creates CITIZEN
            department_id=None,
            employee_id=None,
            address=data.address.strip() if data.address else None,
            ward=data.ward.strip() if data.ward else None,
            preferred_language=data.preferred_language or "en",
            is_active=True,
            is_verified=True,
            last_login=now,
            created_at=now,
            updated_at=now,
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

        token_data = {
            "sub": str(user.id),
            "role": user.role,
            "department_id": None,
            "email": user.email,
            "full_name": user.full_name,
        }
        token = create_access_token(token_data)
        user_info = await self.build_user_info(user, db)

        return TokenResponse(access_token=token, token_type="bearer", user=user_info)

    async def update_profile(
        self,
        current_user: UserModel,
        data: ProfileUpdateRequest,
        db: AsyncSession,
    ) -> UserInfo:
        """Allows citizen to safely update personal contact & localization preferences."""
        if data.full_name is not None and len(data.full_name.strip()) >= 2:
            current_user.full_name = data.full_name.strip()
        if data.phone is not None and len(data.phone.strip()) >= 10:
            # Check phone uniqueness if changed
            new_phone = data.phone.strip()
            if new_phone != current_user.phone:
                existing = await db.execute(
                    select(UserModel).where(UserModel.phone == new_phone, UserModel.id != current_user.id)
                )
                if existing.scalars().first():
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="This mobile number is already in use by another account.",
                    )
                current_user.phone = new_phone
        if data.address is not None:
            current_user.address = data.address.strip() or None
        if data.ward is not None:
            current_user.ward = data.ward.strip() or None
        if data.preferred_language is not None:
            current_user.preferred_language = data.preferred_language.strip()
        if data.profile_image is not None:
            current_user.profile_image = data.profile_image.strip() or None

        current_user.updated_at = get_ist_now()
        await db.commit()
        await db.refresh(current_user)
        return await self.build_user_info(current_user, db)


auth_service = AuthService()
