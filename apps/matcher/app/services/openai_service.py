import json
import time
from typing import List, Dict, Any, Tuple
from fastapi import HTTPException
from openai import OpenAI, OpenAIError

from app.core.config import settings
from app.schemas.match import ProductScrap

client = OpenAI(api_key=settings.openai_api_key) if settings.openai_api_key else None


def build_prompt(products_scrap: List[ProductScrap], products_user: List[Dict[str, Any]]) -> str:
    """Gera o prompt para comparação de produtos."""
    prompt = (
        "Você é um assistente que faz correspondência de produtos.\n"
        "Receberá duas listas em JSON:\n"
        "1) 'produtos_scrap' - itens extraídos de uma nota fiscal.\n"
        "2) 'produtos_usuario' - itens já cadastrados pelo usuário.\n"
        "Sua tarefa: comparar nomes/títulos e retornar um JSON com:\n"
        "{\n"
        "  \"match\": [ {\"scrap_title\": \"string\", \"product_id\": \"string\", \"confidence\": 0-1 } ],\n"
        "  \"unmatch\": [ produtos_scrap_sem_correspondencia ]\n"
        "}\n"
        "Use confidence >= 0.8 para matches. Caso não encontre, coloque em unmatch.\n\n"
        f"'produtos_scrap': {json.dumps([p.model_dump() for p in products_scrap], ensure_ascii=False)}\n"
        f"'produtos_usuario': {json.dumps(products_user, ensure_ascii=False)}\n"
        "Responda apenas o JSON, nada mais."
    )
    return prompt


def ask_openai(prompt: str) -> Tuple[Dict[str, Any], Dict[str, Any]]:
    """Envia prompt ao OpenAI e retorna dicionário com match/unmatch e informações de tracking."""
    if not client:
        raise HTTPException(500, "OPENAI_API_KEY não configurada no Matcher Service")

    start_time = time.time()
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            response_format={"type": "json_object"},
        )
        
        end_time = time.time()
        response_time_ms = int((end_time - start_time) * 1000)
        
        # Informações de tracking da LLM
        llm_info = {
            "provider": "openai",
            "model": "gpt-4o-mini",
            "prompt": prompt,
            "response": response.choices[0].message.content,
            "prompt_tokens": response.usage.prompt_tokens if response.usage else None,
            "response_tokens": response.usage.completion_tokens if response.usage else None,
            "total_tokens": response.usage.total_tokens if response.usage else None,
            "temperature": 0.2,
            "response_time": response_time_ms,
            # Custo estimado (valores aproximados para gpt-4o-mini)
            "cost": calculate_cost(response.usage.prompt_tokens if response.usage else 0,
                                 response.usage.completion_tokens if response.usage else 0) if response.usage else None
        }
        
        result = json.loads(response.choices[0].message.content)
        return result, llm_info
        
    except OpenAIError as exc:
        end_time = time.time()
        response_time_ms = int((end_time - start_time) * 1000)
        
        # Informações de erro para tracking
        error_info = {
            "provider": "openai",
            "model": "gpt-4o-mini",
            "prompt": prompt,
            "temperature": 0.2,
            "response_time": response_time_ms,
            "error_details": {
                "message": str(exc),
                "type": type(exc).__name__
            }
        }
        
        raise HTTPException(502, f"Erro ao chamar OpenAI: {exc}") from exc


def calculate_cost(prompt_tokens: int, response_tokens: int) -> float:
    """Calcula o custo estimado baseado nos tokens (valores para gpt-4o-mini em USD)."""
    # Preços aproximados do gpt-4o-mini (podem mudar)
    prompt_cost_per_1k = 0.00015  # $0.15 per 1K tokens
    response_cost_per_1k = 0.0006  # $0.60 per 1K tokens
    
    prompt_cost = (prompt_tokens / 1000) * prompt_cost_per_1k
    response_cost = (response_tokens / 1000) * response_cost_per_1k
    
    return round(prompt_cost + response_cost, 6) 