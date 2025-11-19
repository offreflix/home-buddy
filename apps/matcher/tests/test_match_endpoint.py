import asyncio
from fastapi.testclient import TestClient
from app.main import app

from app.schemas.match import ProductScrap


client = TestClient(app)


async def _fake_fetch_user_products(user_id: str):
    return [{"id": "1", "title": "Arroz"}]


def _fake_ask_openai(prompt: str):
    return {"match": [], "unmatch": []}


def test_match_endpoint(monkeypatch):
    """Valida resposta 200 e estrutura básica."""
    # patches
    from app.services import product_service as ps
    from app.services import openai_service as osvc

    monkeypatch.setattr(ps, "fetch_user_products", _fake_fetch_user_products)
    monkeypatch.setattr(osvc, "ask_openai", _fake_ask_openai)

    payload = {
        "user_id": "1",
        "products_scrap": [ProductScrap(title="Arroz").model_dump()]
    }
    response = client.post("/match", json=payload)
    # sem header deve falhar
    assert response.status_code == 401

    # com header correto
    response_ok = client.post("/match", json=payload, headers={"X-Service-Token": "dev-token"})
    assert response_ok.status_code == 200
    data = response_ok.json()
    assert "match" in data and "unmatch" in data 