from fastapi import Header, HTTPException, Depends

from app.core.config import settings


async def verify_internal_token(x_service_token: str = Header(None)):  # type: ignore
    if x_service_token != settings.internal_token:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return x_service_token 