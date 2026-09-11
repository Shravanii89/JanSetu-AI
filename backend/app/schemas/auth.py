"""
JanSetu AI - Authentication Schemas
"""

from typing import Optional
from pydantic import BaseModel, ConfigDict


class LoginRequest(BaseModel):
    email_or_employee_id: Optional[str] = None
    identifier: Optional[str] = None
    password: str

    @property
    def get_identifier(self) -> str:
        return (self.email_or_employee_id or self.identifier or "").strip()


class UserInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: str
    full_name: str
    role: str
    department_id: Optional[str] = None
    employee_id: Optional[str] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserInfo
