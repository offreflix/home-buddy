# Matcher Service (FastAPI)

Serviço responsável por comparar produtos extraídos via scraping com os produtos cadastrados pelo usuário, utilizando a OpenAI para classificação.

## Estrutura modular (inspirada no NestJS)

```
apps/matcher/
├── app/
│   ├── api/
│   │   └── routes/
│   │       └── match.py  # Rotas HTTP
│   ├── core/
│   │   └── config.py     # Configurações (env)
│   ├── schemas/
│   │   └── match.py      # Modelos Pydantic (DTOs)
│   ├── services/
│   │   ├── openai_service.py
│   │   └── product_service.py
│   └── main.py           # Criação da aplicação FastAPI
├── tests/                # Testes unitários Pytest
├── Dockerfile            # Build da imagem
└── requirements.txt      # Dependências
```

## Variáveis de ambiente

Crie um arquivo `.env` com base no exemplo abaixo:

```ini
OPENAI_API_KEY=sk-seu_token_aqui
# Token interno para autenticação service-to-service
INTERNAL_TOKEN=algum_token_seguro

BACKEND_BASE_URL=http://backend:3000
```

- `OPENAI_API_KEY`: chave da API da OpenAI com permissão para Chat Completions.
- `BACKEND_BASE_URL`: URL onde o serviço NestJS está exposto (interno no Docker Compose).

## Como rodar localmente

### Linux/macOS

```bash
cd apps/matcher
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Windows (PowerShell)

```powershell
cd apps/matcher
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Windows (Command Prompt)

```cmd
cd apps/matcher
python -m venv .venv
.venv\Scripts\activate.bat
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Executando testes

### Linux/macOS

```bash
pytest -q
```

### Windows (PowerShell)

```powershell
pytest -q
```

### Windows (Command Prompt)

```cmd
pytest -q
```

## Endpoint principal

| Método | Rota   | Body (exemplo)                                                     |
| ------ | ------ | ------------------------------------------------------------------ |
| POST   | /match | `{ "user_id": "123", "products_scrap": [ { "title": "Arroz" } ] }` |

Todas as requisições **devem** conter o header:

```
X-Service-Token: ${INTERNAL_TOKEN}
```

Resposta:

```json
{
  "match": [
    { "scrap_title": "Arroz", "product_id": "abc", "confidence": 0.92 }
  ],
  "unmatch": [{ "title": "Feijão" }]
}
```

## Observações

- A separação em camadas (`schemas`, `services`, `api`) segue filosofia semelhante à do NestJS (DTOs, Providers, Controllers).
- Camadas são injetadas manualmente (não há DI container nativo no FastAPI), mantendo baixo acoplamento.
