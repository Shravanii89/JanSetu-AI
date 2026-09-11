"""
JanSetu AI - Authentication & Citizen Profile Schemas
"""

import re
from typing import Optional, List, Any
from pydantic import BaseModel, ConfigDict, field_validator, model_validator


class LoginRequest(BaseModel):
    email_or_employee_id: Optional[str] = None
    identifier: Optional[str] = None
    password: str

    @property
    def get_identifier(self) -> str:
        return (self.email_or_employee_id or self.identifier or "").strip()


class RegisterRequest(BaseModel):
    full_name: str
    email: str
    phone: str
    password: str
    confirm_password: str
    address: Optional[str] = None
    ward: Optional[str] = None
    preferred_language: Optional[str] = "en"
    role: Optional[str] = None  # Inspected only to explicitly block privilege escalation attempts

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, v: str) -> str:
        val = v.strip()
        if len(val) < 2:
            raise ValueError("Full name must be at least 2 characters long")
        return val

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        val = v.strip().lower()
        if not re.match(r"^[^@]+@[^@]+\.[^@]+$", val):
            raise ValueError("Please provide a valid email address")
        return val

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        digits = re.sub(r"\D", "", v)
        if len(digits) < 10 or len(digits) > 15:
            raise ValueError("Phone number must contain between 10 and 15 digits")
        return digits

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters long")
        return v

    @model_validator(mode="after")
    def check_passwords_and_roles(self):
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match")
        if self.role and self.role.upper() != "CITIZEN":
            raise ValueError("Public registration is only permitted for Citizen accounts")
        return self


class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    ward: Optional[str] = None
    preferred_language: Optional[str] = None
    profile_image: Optional[str] = None


class UserInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: str
    full_name: str
    role: str
    department_id: Optional[str] = None
    employee_id: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    ward: Optional[str] = None
    preferred_language: Optional[str] = "en"
    civic_credits: int = 0
    contribution_level: str = "Citizen"
    badges_count: int = 0
    last_login: Optional[str] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserInfo
