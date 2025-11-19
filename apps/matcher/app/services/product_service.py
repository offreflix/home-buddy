import httpx
from fastapi import HTTPException

from app.core.config import settings


async def fetch_user_products(user_id: str):
    """Consulta o backend principal e devolve os produtos do usuário."""
    url = f"{settings.backend_base_url}/products/internal/{user_id}"
    headers = {"X-Service-Token": settings.internal_token}
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.get(url, headers=headers)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail="Falha ao obter produtos do usuário do backend",
        )

    return response.json() 