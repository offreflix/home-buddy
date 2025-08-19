from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class ProductScrap(BaseModel):
    title: str
    code: Optional[str] = None
    quantity: Optional[str] = None
    unit: Optional[str] = None
    unit_price: Optional[str] = None
    total_price: Optional[str] = None


class ProductMatch(BaseModel):
    scrap_title: str
    product_id: str
    confidence: float = Field(ge=0, le=1)


class MatchRequest(BaseModel):
    user_id: str = Field(..., description="ID do usuário no serviço principal")
    products_scrap: List[ProductScrap]


class LLMInfo(BaseModel):
    provider: str
    model: str
    prompt: str
    response: Optional[str] = None
    prompt_tokens: Optional[int] = None
    response_tokens: Optional[int] = None
    total_tokens: Optional[int] = None
    temperature: Optional[float] = None
    response_time: Optional[int] = None  # em millisegundos
    cost: Optional[float] = None  # em USD
    error_details: Optional[Dict[str, Any]] = None


class MatchResponse(BaseModel):
    match: List[ProductMatch]
    unmatch: List[ProductScrap]
    llm_info: Optional[LLMInfo] = None 