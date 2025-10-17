# Referência da API

A API do Home Buddy é construída com NestJS e fornece endpoints RESTful para gerenciar produtos, estoque, usuários e operações de scraping/matching.

## Visão Geral

- **Base URL**: `http://localhost:3000` (desenvolvimento)
- **Documentação Swagger**: `http://localhost:3000/api`
- **Autenticação**: JWT Bearer Token
- **Formato**: JSON

## Autenticação

### Login Local

```http
POST /auth/signin
Content-Type: application/json

{
  "username": "usuario",
  "password": "senha123"
}
```

**Resposta:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Registro

```http
POST /auth/signup
Content-Type: application/json

{
  "username": "novo_usuario",
  "email": "usuario@email.com",
  "password": "senha123"
}
```

### Refresh Token

```http
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Google OAuth

```http
GET /auth/google
```

### Logout

```http
POST /auth/logout
Authorization: Bearer <access_token>
```

## Usuários

### Obter Perfil

```http
GET /users/profile
Authorization: Bearer <access_token>
```

**Resposta:**

```json
{
  "id": 1,
  "username": "usuario",
  "email": "usuario@email.com",
  "firstName": "João",
  "lastName": "Silva",
  "picture": "https://...",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "lastLoginAt": "2024-01-01T00:00:00.000Z"
}
```

### Atualizar Usuário

```http
PATCH /users/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "firstName": "João",
  "lastName": "Silva"
}
```

## Produtos

### Listar Produtos

```http
GET /products?page=1&perPage=10&sortBy=name&sortOrder=asc
Authorization: Bearer <access_token>
```

**Parâmetros de Query:**

- `page`: Número da página (padrão: 1)
- `perPage`: Itens por página (padrão: 10)
- `sortBy`: Campo para ordenação (`name`, `createdAt`, `stock.currentQuantity`, `category.name`)
- `sortOrder`: Ordem (`asc` ou `desc`)

**Resposta:**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Arroz",
      "description": "Arroz branco tipo 1",
      "unit": "kg",
      "category": {
        "id": 1,
        "name": "Cereais"
      },
      "stock": {
        "id": 1,
        "currentQuantity": 5.0,
        "desiredQuantity": 10.0
      },
      "movements": []
    }
  ],
  "pagination": {
    "page": 1,
    "perPage": 10,
    "total": 1,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### Criar Produto

```http
POST /products
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Arroz",
  "description": "Arroz branco tipo 1",
  "unit": "kg",
  "categoryId": 1,
  "currentQuantity": 5.0,
  "desiredQuantity": 10.0
}
```

### Obter Produto

```http
GET /products/1
Authorization: Bearer <access_token>
```

### Atualizar Produto

```http
PATCH /products/1
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Arroz Integral",
  "description": "Arroz integral orgânico",
  "unit": "kg",
  "categoryId": 1
}
```

### Contar Produtos

```http
GET /products/count
Authorization: Bearer <access_token>
```

**Resposta:**

```json
{
  "count": 25
}
```

### Produtos com Estoque Baixo

```http
GET /products/low-stock
Authorization: Bearer <access_token>
```

### Produto Mais Consumido

```http
GET /products/most-consumed?month=1&year=2024
Authorization: Bearer <access_token>
```

**Resposta:**

```json
{
  "product": "Arroz",
  "quantity": 15.0,
  "unit": "kg",
  "percentageChange": 25.5
}
```

### Movimentações por Data

```http
GET /products/movements-by-date?startDate=2024-01-01&endDate=2024-01-31&groupBy=day
Authorization: Bearer <access_token>
```

**Resposta:**

```json
[
  {
    "date": "2024-01-15",
    "IN": 10.0,
    "OUT": 5.0
  }
]
```

### Contar por Categoria

```http
GET /products/count-by-category
Authorization: Bearer <access_token>
```

**Resposta:**

```json
[
  {
    "name": "Cereais",
    "count": 5
  }
]
```

## Estoque

### Atualizar Estoque

```http
PATCH /stocks/1
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "type": "IN",
  "quantity": 5.0
}
```

**Tipos de Movimentação:**

- `IN`: Adicionar ao estoque
- `OUT`: Remover do estoque

## Categorias

### Listar Categorias

```http
GET /categories
Authorization: Bearer <access_token>
```

### Criar Categoria

```http
POST /categories
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Nova Categoria"
}
```

### Atualizar Categoria

```http
PATCH /categories/1
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Categoria Atualizada"
}
```

## Scraping

### Adicionar Job de Scraping

```http
POST /scrapping/scrape
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "url": "https://exemplo.com/produto",
  "userId": 1
}
```

**Resposta:**

```json
{
  "jobId": "12345",
  "message": "Job adicionado à fila"
}
```

### Status do Job

```http
GET /scrapping/status/12345
Authorization: Bearer <access_token>
```

**Resposta:**

```json
{
  "jobId": "12345",
  "state": "completed",
  "progress": 100,
  "message": "Processamento concluído com sucesso!",
  "phase": "completed",
  "result": {
    "matchResult": {
      "matches": [...],
      "unmatches": [...]
    }
  }
}
```

### Estatísticas da Fila

```http
GET /scrapping/queue-stats
Authorization: Bearer <access_token>
```

**Resposta:**

```json
{
  "waiting": 5,
  "active": 2,
  "completed": 100,
  "failed": 3,
  "total": 110
}
```

## Tracking

### Estatísticas de Operações

```http
GET /tracking/stats?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <access_token>
```

### Operações por Usuário

```http
GET /tracking/operations?userId=1&page=1&perPage=10
Authorization: Bearer <access_token>
```

### Operações Falhadas

```http
GET /tracking/failed-operations?page=1&perPage=10
Authorization: Bearer <access_token>
```

## Export

### Exportar Produtos

```http
POST /export/products
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "format": "csv",
  "includeStock": true,
  "includeMovements": false
}
```

**Formatos Suportados:**

- `csv`: Arquivo CSV
- `json`: Arquivo JSON
- `xlsx`: Planilha Excel

## Códigos de Status HTTP

- `200`: Sucesso
- `201`: Criado com sucesso
- `400`: Requisição inválida
- `401`: Não autorizado
- `403`: Proibido
- `404`: Não encontrado
- `409`: Conflito (recurso já existe)
- `422`: Entidade não processável
- `500`: Erro interno do servidor

## Tratamento de Erros

Todas as respostas de erro seguem o formato:

```json
{
  "statusCode": 400,
  "message": "Mensagem de erro",
  "error": "Bad Request"
}
```

## Rate Limiting

- **Limite**: 100 requisições por minuto por IP
- **Headers de Resposta:**
  - `X-RateLimit-Limit`: Limite total
  - `X-RateLimit-Remaining`: Requisições restantes
  - `X-RateLimit-Reset`: Timestamp de reset

## Webhooks

### Eventos Disponíveis

- `product.created`: Produto criado
- `product.updated`: Produto atualizado
- `stock.movement`: Movimentação de estoque
- `scraping.completed`: Scraping concluído
- `scraping.failed`: Scraping falhou

### Configuração de Webhook

```http
POST /webhooks
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "url": "https://seu-servidor.com/webhook",
  "events": ["product.created", "stock.movement"],
  "secret": "seu-secret-aqui"
}
```
