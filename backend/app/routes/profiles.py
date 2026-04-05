import hashlib
import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import ParentSettings, Profile
from app.schemas import (
    PinSetup,
    PinVerify,
    PinVerifyResponse,
    ProfileCreate,
    ProfileDelete,
    ProfileListResponse,
    ProfileResponse,
    ProfileUpdate,
)

router = APIRouter(prefix="/api/profiles", tags=["profiles"])

DB = Annotated[AsyncSession, Depends(get_db)]

MAX_PROFILES = 3


def hash_pin(pin: str) -> str:
    return hashlib.sha256(pin.encode()).hexdigest()


async def verify_pin(db: AsyncSession, pin: str) -> bool:
    result = await db.execute(select(ParentSettings).limit(1))
    settings = result.scalar_one_or_none()
    if settings is None:
        return False
    return settings.pin_hash == hash_pin(pin)


async def get_or_create_guest(db: AsyncSession) -> Profile:
    result = await db.execute(select(Profile).where(Profile.is_guest.is_(True)))
    guest = result.scalar_one_or_none()
    if guest is None:
        guest = Profile(name="Guest", color="#9ca3af", is_guest=True)
        db.add(guest)
        await db.commit()
        await db.refresh(guest)
    return guest


@router.get("", response_model=ProfileListResponse)
async def list_profiles(db: DB) -> ProfileListResponse:
    await get_or_create_guest(db)

    result = await db.execute(select(Profile).order_by(Profile.created_at))
    profiles = result.scalars().all()

    pin_result = await db.execute(select(func.count()).select_from(ParentSettings))
    pin_set = (pin_result.scalar() or 0) > 0

    return ProfileListResponse(
        profiles=[ProfileResponse.model_validate(p) for p in profiles],
        pin_set=pin_set,
    )


@router.post("/setup", status_code=201)
async def setup_pin(body: PinSetup, db: DB) -> dict[str, str]:
    existing = await db.execute(select(ParentSettings).limit(1))
    if existing.scalar_one_or_none() is not None:
        raise HTTPException(status_code=409, detail="PIN already set")

    settings = ParentSettings(pin_hash=hash_pin(body.pin))
    db.add(settings)
    await db.commit()
    return {"message": "PIN set successfully"}


@router.post("/verify-pin", response_model=PinVerifyResponse)
async def verify_pin_endpoint(body: PinVerify, db: DB) -> PinVerifyResponse:
    if not await verify_pin(db, body.pin):
        raise HTTPException(status_code=401, detail="Incorrect PIN")
    return PinVerifyResponse(verified=True)


@router.post("", response_model=ProfileResponse, status_code=201)
async def create_profile(body: ProfileCreate, db: DB) -> ProfileResponse:
    if not await verify_pin(db, body.pin):
        raise HTTPException(status_code=401, detail="Incorrect PIN")

    count_result = await db.execute(
        select(func.count()).select_from(Profile).where(Profile.is_guest.is_(False))
    )
    count = count_result.scalar() or 0
    if count >= MAX_PROFILES:
        raise HTTPException(status_code=409, detail="Maximum profiles reached")

    profile = Profile(name=body.name, color=body.color)
    db.add(profile)
    await db.commit()
    await db.refresh(profile)
    return ProfileResponse.model_validate(profile)


@router.put("/{profile_id}", response_model=ProfileResponse)
async def update_profile(
    profile_id: uuid.UUID, body: ProfileUpdate, db: DB
) -> ProfileResponse:
    if not await verify_pin(db, body.pin):
        raise HTTPException(status_code=401, detail="Incorrect PIN")

    result = await db.execute(select(Profile).where(Profile.id == profile_id))
    profile = result.scalar_one_or_none()
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    if profile.is_guest:
        raise HTTPException(status_code=400, detail="Cannot edit guest profile")

    if body.name is not None:
        profile.name = body.name
    if body.color is not None:
        profile.color = body.color
    await db.commit()
    await db.refresh(profile)
    return ProfileResponse.model_validate(profile)


@router.delete("/{profile_id}", status_code=204)
async def delete_profile(profile_id: uuid.UUID, body: ProfileDelete, db: DB) -> None:
    if not await verify_pin(db, body.pin):
        raise HTTPException(status_code=401, detail="Incorrect PIN")

    result = await db.execute(select(Profile).where(Profile.id == profile_id))
    profile = result.scalar_one_or_none()
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    if profile.is_guest:
        raise HTTPException(status_code=400, detail="Cannot delete guest profile")

    await db.delete(profile)
    await db.commit()
