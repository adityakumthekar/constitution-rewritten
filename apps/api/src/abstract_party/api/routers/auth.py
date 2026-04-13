from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from abstract_party.api.deps import get_db
from abstract_party.api.schemas import MockLoginRequest, TokenResponse
from abstract_party.core.security import create_access_token, create_refresh_token
from abstract_party.db.models import User

router = APIRouter(prefix="/v1/auth", tags=["auth"])

MOCK_PIN = "1234"


@router.post("/login", response_model=TokenResponse)
async def mock_aadhaar_login(
    body: MockLoginRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> TokenResponse:
    """Phase 1: mock Aadhaar — accept any aadhaar_id with PIN 1234."""
    if body.pin != MOCK_PIN:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    ext_id = body.aadhaar_id.strip()
    result = await db.execute(select(User).where(User.external_id == ext_id))
    user = result.scalar_one_or_none()
    if user is None:
        user = User(external_id=ext_id, display_name=f"Citizen {ext_id[-4:]}")
        db.add(user)
        await db.commit()
        await db.refresh(user)

    access = create_access_token(subject=user.external_id)
    refresh = create_refresh_token(subject=user.external_id)
    return TokenResponse(access_token=access, refresh_token=refresh)
