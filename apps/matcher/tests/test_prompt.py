from app.services.openai_service import build_prompt
from app.schemas.match import ProductScrap


def test_build_prompt_contains_lists():
    scrap_items = [ProductScrap(title="Arroz Integral 1kg")]
    user_products = [{"id": "1", "title": "Arroz Integral"}]

    prompt = build_prompt(scrap_items, user_products)

    # Verifica se o prompt possui as chaves esperadas
    assert "produtos_scrap" in prompt
    assert "produtos_usuario" in prompt 