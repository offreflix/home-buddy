# API do Matcher Service

Documentação completa da API do serviço Matcher, incluindo endpoints, modelos de dados, exemplos de uso e códigos de resposta.

## Base URL

- **Desenvolvimento**: `http://localhost:8000`
- **Produção**: `https://matcher.homebuddy.com`

## Autenticação

Todas as requisições para o Matcher Service requerem autenticação via header:

```http
X-Service-Token: seu-token-interno-aqui
```

### Configuração do Token

```env
INTERNAL_TOKEN=seu-token-seguro-aqui
```

## Endpoints

### POST /match

Endpoint principal para comparação de produtos extraídos via scraping com produtos cadastrados pelo usuário.

#### Request

```http
POST /match
Content-Type: application/json
X-Service-Token: seu-token-interno

{
  "user_id": "123",
  "products_scrap": [
    {
      "title": "Arroz Branco Tipo 1",
      "code": "123456789",
      "quantity": "5",
      "unit": "kg",
      "unit_price": "4.50",
      "total_price": "22.50"
    },
    {
      "title": "Feijão Preto",
      "quantity": "2",
      "unit": "kg",
      "unit_price": "8.90",
      "total_price": "17.80"
    }
  ]
}
```

#### Parâmetros

| Campo            | Tipo   | Obrigatório | Descrição                                |
| ---------------- | ------ | ----------- | ---------------------------------------- |
| `user_id`        | string | ✅          | ID do usuário no sistema principal       |
| `products_scrap` | array  | ✅          | Lista de produtos extraídos via scraping |

#### Modelo ProductScrap

```typescript
interface ProductScrap {
  title: string // Nome/título do produto
  code?: string // Código do produto (opcional)
  quantity?: string // Quantidade (opcional)
  unit?: string // Unidade de medida (opcional)
  unit_price?: string // Preço unitário (opcional)
  total_price?: string // Preço total (opcional)
}
```

#### Response

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "match": [
    {
      "scrap_title": "Arroz Branco Tipo 1",
      "product_id": "prod_123",
      "confidence": 0.95
    }
  ],
  "unmatch": [
    {
      "title": "Feijão Preto",
      "code": "123456789",
      "quantity": "2",
      "unit": "kg",
      "unit_price": "8.90",
      "total_price": "17.80"
    }
  ],
  "llm_info": {
    "provider": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Você é um assistente que faz correspondência de produtos...",
    "response": "{\"match\": [...], \"unmatch\": [...]}",
    "prompt_tokens": 1250,
    "response_tokens": 180,
    "total_tokens": 1430,
    "temperature": 0.2,
    "response_time": 1250,
    "cost": 0.0008
  }
}
```

#### Modelo ProductMatch

```typescript
interface ProductMatch {
  scrap_title: string // Título do produto extraído
  product_id: string // ID do produto correspondente
  confidence: number // Nível de confiança (0-1)
}
```

#### Modelo LLMInfo

```typescript
interface LLMInfo {
  provider: string // Provedor da IA (openai)
  model: string // Modelo usado (gpt-4o-mini)
  prompt: string // Prompt enviado
  response?: string // Resposta recebida
  prompt_tokens?: number // Tokens do prompt
  response_tokens?: number // Tokens da resposta
  total_tokens?: number // Total de tokens
  temperature?: number // Temperatura usada
  response_time?: number // Tempo de resposta (ms)
  cost?: number // Custo estimado (USD)
  error_details?: Record<string, any> // Detalhes de erro (se houver)
}
```

## Códigos de Status HTTP

### Sucesso

| Código | Descrição                         |
| ------ | --------------------------------- |
| `200`  | Requisição processada com sucesso |

### Erro do Cliente

| Código | Descrição                                       |
| ------ | ----------------------------------------------- |
| `401`  | Token de autenticação inválido ou ausente       |
| `422`  | Dados de entrada inválidos (validação Pydantic) |

### Erro do Servidor

| Código | Descrição                            |
| ------ | ------------------------------------ |
| `500`  | Erro interno do servidor             |
| `502`  | Erro na comunicação com OpenAI       |
| `503`  | Serviço temporariamente indisponível |

## Exemplos de Uso

### Exemplo 1: Match Simples

**Request:**

```json
{
  "user_id": "user_123",
  "products_scrap": [
    {
      "title": "Arroz",
      "quantity": "5",
      "unit": "kg"
    }
  ]
}
```

**Response:**

```json
{
  "match": [
    {
      "scrap_title": "Arroz",
      "product_id": "prod_456",
      "confidence": 0.92
    }
  ],
  "unmatch": [],
  "llm_info": {
    "provider": "openai",
    "model": "gpt-4o-mini",
    "prompt_tokens": 800,
    "response_tokens": 120,
    "total_tokens": 920,
    "response_time": 950,
    "cost": 0.0005
  }
}
```

### Exemplo 2: Múltiplos Produtos

**Request:**

```json
{
  "user_id": "user_456",
  "products_scrap": [
    {
      "title": "Arroz Branco Tipo 1",
      "code": "123456",
      "quantity": "5",
      "unit": "kg",
      "unit_price": "4.50"
    },
    {
      "title": "Feijão Preto",
      "quantity": "2",
      "unit": "kg"
    },
    {
      "title": "Açúcar Cristal",
      "quantity": "1",
      "unit": "kg"
    }
  ]
}
```

**Response:**

```json
{
  "match": [
    {
      "scrap_title": "Arroz Branco Tipo 1",
      "product_id": "prod_789",
      "confidence": 0.95
    },
    {
      "scrap_title": "Açúcar Cristal",
      "product_id": "prod_101",
      "confidence": 0.88
    }
  ],
  "unmatch": [
    {
      "title": "Feijão Preto",
      "quantity": "2",
      "unit": "kg"
    }
  ],
  "llm_info": {
    "provider": "openai",
    "model": "gpt-4o-mini",
    "prompt_tokens": 1200,
    "response_tokens": 200,
    "total_tokens": 1400,
    "response_time": 1100,
    "cost": 0.0007
  }
}
```

### Exemplo 3: Nenhum Match

**Request:**

```json
{
  "user_id": "user_789",
  "products_scrap": [
    {
      "title": "Produto Inexistente",
      "quantity": "1",
      "unit": "unidade"
    }
  ]
}
```

**Response:**

```json
{
  "match": [],
  "unmatch": [
    {
      "title": "Produto Inexistente",
      "quantity": "1",
      "unit": "unidade"
    }
  ],
  "llm_info": {
    "provider": "openai",
    "model": "gpt-4o-mini",
    "prompt_tokens": 600,
    "response_tokens": 80,
    "total_tokens": 680,
    "response_time": 800,
    "cost": 0.0003
  }
}
```

## Tratamento de Erros

### Erro de Autenticação

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "detail": "Token inválido"
}
```

### Erro de Validação

```http
HTTP/1.1 422 Unprocessable Entity
Content-Type: application/json

{
  "detail": [
    {
      "type": "missing",
      "loc": ["body", "user_id"],
      "msg": "Field required",
      "input": null
    }
  ]
}
```

### Erro da OpenAI

```http
HTTP/1.1 502 Bad Gateway
Content-Type: application/json

{
  "detail": "Erro ao chamar OpenAI: Rate limit exceeded"
}
```

### Erro de Comunicação com Backend

```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "detail": "Falha ao obter produtos do usuário do backend"
}
```

## Rate Limiting

O Matcher Service implementa rate limiting baseado no custo da OpenAI:

- **Limite por minuto**: 100 requisições
- **Limite por hora**: 1000 requisições
- **Limite de custo diário**: $50 USD

### Headers de Rate Limit

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
X-RateLimit-Cost: 0.0008
```

## Webhooks (Futuro)

### Eventos Disponíveis

- `match.completed`: Matching concluído com sucesso
- `match.failed`: Falha no processo de matching
- `cost.threshold`: Limite de custo atingido

### Configuração de Webhook

```http
POST /webhooks
Content-Type: application/json
X-Service-Token: seu-token-interno

{
  "url": "https://seu-servidor.com/webhook",
  "events": ["match.completed", "match.failed"],
  "secret": "seu-secret-webhook"
}
```

## SDKs e Bibliotecas

### Python

```python
import httpx

class MatcherClient:
    def __init__(self, base_url: str, token: str):
        self.base_url = base_url
        self.headers = {"X-Service-Token": token}

    async def match_products(self, user_id: str, products_scrap: list):
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/match",
                json={
                    "user_id": user_id,
                    "products_scrap": products_scrap
                },
                headers=self.headers
            )
            response.raise_for_status()
            return response.json()

# Uso
client = MatcherClient("http://localhost:8000", "seu-token")
result = await client.match_products("user_123", [
    {"title": "Arroz", "quantity": "5", "unit": "kg"}
])
```

### JavaScript/TypeScript

```typescript
class MatcherClient {
  constructor(
    private baseUrl: string,
    private token: string,
  ) {}

  async matchProducts(
    userId: string,
    productsScrap: ProductScrap[],
  ): Promise<MatchResponse> {
    const response = await fetch(`${this.baseUrl}/match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Service-Token': this.token,
      },
      body: JSON.stringify({
        user_id: userId,
        products_scrap: productsScrap,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }
}

// Uso
const client = new MatcherClient('http://localhost:8000', 'seu-token')
const result = await client.matchProducts('user_123', [
  { title: 'Arroz', quantity: '5', unit: 'kg' },
])
```

## Monitoramento e Métricas

### Métricas Disponíveis

- **Throughput**: Requisições por minuto
- **Latência**: Tempo médio de resposta
- **Taxa de Sucesso**: Percentual de requisições bem-sucedidas
- **Custo**: Custo total da OpenAI por período
- **Tokens**: Uso de tokens por requisição

### Endpoint de Métricas

```http
GET /metrics
X-Service-Token: seu-token-interno
```

**Response:**

```json
{
  "throughput": {
    "requests_per_minute": 45,
    "requests_per_hour": 1200
  },
  "latency": {
    "average_ms": 1200,
    "p95_ms": 1800,
    "p99_ms": 2500
  },
  "success_rate": 0.98,
  "cost": {
    "daily_usd": 12.5,
    "monthly_usd": 375.0
  },
  "tokens": {
    "average_per_request": 1400,
    "total_this_month": 1500000
  }
}
```

## Health Check

### Endpoint de Saúde

```http
GET /health
```

**Response:**

```json
{
  "status": "healthy",
  "service": "matcher",
  "version": "0.1.0",
  "uptime": 3600,
  "dependencies": {
    "openai": "healthy",
    "backend": "healthy"
  }
}
```

## Changelog

### v0.1.0 (2024-01-15)

- ✅ Endpoint `/match` implementado
- ✅ Integração com OpenAI GPT-4o-mini
- ✅ Autenticação service-to-service
- ✅ Métricas de tracking da LLM
- ✅ Tratamento de erros robusto
- ✅ Testes unitários completos

### Próximas Versões

#### v0.2.0 (Planejado)

- 🔄 Cache de respostas
- 🔄 Suporte a múltiplos provedores de IA
- 🔄 Rate limiting avançado
- 🔄 Webhooks para eventos

#### v0.3.0 (Planejado)

- 🔄 Batch processing
- 🔄 A/B testing de prompts
- 🔄 Métricas avançadas
- 🔄 Dashboard de monitoramento
