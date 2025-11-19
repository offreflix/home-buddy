from fastapi import APIRouter, Depends

from app.schemas.match import MatchRequest, MatchResponse, LLMInfo
from app.services.product_service import fetch_user_products
from app.services.openai_service import build_prompt, ask_openai
from app.dependencies.security import verify_internal_token

router = APIRouter(prefix="/match", tags=["match"], dependencies=[Depends(verify_internal_token)])


@router.post("", response_model=MatchResponse)
async def match_products(payload: MatchRequest):
    """Endpoint principal para comparação de produtos."""
    # 1. Busca produtos do usuário no backend
    products_user = await fetch_user_products(payload.user_id)

    # 2. Monta prompt e chama LLM
    prompt = build_prompt(payload.products_scrap, products_user)
    result, llm_info = ask_openai(prompt)

    # 3. Devolve resultado com informações de tracking da LLM
    return MatchResponse(
        match=result.get("match", []),
        unmatch=result.get("unmatch", []),
        llm_info=LLMInfo(**llm_info)
    ) 