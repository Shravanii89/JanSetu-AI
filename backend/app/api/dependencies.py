"""
JanSetu AI - Fast API Shared Dependencies & RBAC Guards
"""
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

async def get_current_user(token: Optional[str] = Depends(oauth2_scheme)):
    """
    Dependency to retrieve authenticated user from JWT.
    TODO: Implement full JWT decoding in Phase 2.
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required"
        )
    return {"id": "placeholder-uuid", "role": "MUNICIPAL_ADMIN"}
