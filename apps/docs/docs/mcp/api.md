---
id: api
title: API e Ferramentas do MCP Server
sidebar_position: 4
description: Documentação completa das ferramentas, recursos e prompts disponíveis no MCP Server
keywords: [mcp, api, ferramentas, tools, resources, prompts, documentação]
---

# 🛠️ API e Ferramentas do MCP Server

Documentação completa das ferramentas, recursos e prompts disponíveis no MCP Server do Home Buddy.

## 🎯 Visão Geral

O MCP Server expõe três tipos de funcionalidades:

- **Tools**: Funções executáveis pelo Claude
- **Resources**: Dados acessíveis pelo Claude
- **Prompts**: Templates contextuais para interações

## 🛠️ Tools (Ferramentas)

### 🔍 search_products

Busca produtos no catálogo do usuário com filtros avançados.

#### Parâmetros

```typescript
{
  query: string;        // Termo de busca
  categoryId?: number;  // ID da categoria (opcional)
  userId: number;       // ID do usuário (obrigatório)
  limit?: number;       // Limite de resultados (padrão: 10)
}
```

#### Exemplo de Uso

```json
{
  "name": "search_products",
  "arguments": {
    "query": "detergente",
    "userId": 1,
    "limit": 5
  }
}
```

#### Resposta

```json
{
  "content": [
    {
      "type": "text",
      "text": "Encontrados 3 produtos:\n1. Detergente Líquido - R$ 8,50\n2. Detergente em Pó - R$ 12,00\n3. Detergente Concentrado - R$ 15,00"
    }
  ]
}
```

### 📦 get_product_details

Obtém detalhes completos de um produto específico.

#### Parâmetros

```typescript
{
  productId: number // ID do produto
  userId: number // ID do usuário
}
```

#### Exemplo de Uso

```json
{
  "name": "get_product_details",
  "arguments": {
    "productId": 123,
    "userId": 1
  }
}
```

#### Resposta

```json
{
  "content": [
    {
      "type": "text",
      "text": "Produto: Detergente Líquido\nCategoria: Limpeza\nPreço: R$ 8,50\nEstoque: 15 unidades\nÚltima atualização: 2024-01-15"
    }
  ]
}
```

### 📊 update_stock

Atualiza o estoque de um produto.

#### Parâmetros

```typescript
{
  productId: number // ID do produto
  userId: number // ID do usuário
  quantity: number // Quantidade
  operation: 'add' | 'subtract' | 'set' // Tipo de operação
}
```

#### Exemplo de Uso

```json
{
  "name": "update_stock",
  "arguments": {
    "productId": 123,
    "userId": 1,
    "quantity": 5,
    "operation": "add"
  }
}
```

#### Resposta

```json
{
  "content": [
    {
      "type": "text",
      "text": "Estoque atualizado com sucesso!\nProduto: Detergente Líquido\nEstoque anterior: 15\nEstoque atual: 20"
    }
  ]
}
```

### 🧾 scrape_receipt

Inicia o scraping de uma nota fiscal online.

#### Parâmetros

```typescript
{
  url: string // URL da nota fiscal
  userId: number // ID do usuário
}
```

#### Exemplo de Uso

```json
{
  "name": "scrape_receipt",
  "arguments": {
    "url": "https://exemplo.com/nota-fiscal",
    "userId": 1
  }
}
```

#### Resposta

```json
{
  "content": [
    {
      "type": "text",
      "text": "Scraping iniciado com sucesso!\nJob ID: 456\nStatus: PROCESSING\nProdutos encontrados: 8\nTempo estimado: 2-3 minutos"
    }
  ]
}
```

### 🤖 match_products

Executa matching inteligente de produtos usando IA.

#### Parâmetros

```typescript
{
  scrapedProducts: Array<{
    title: string
    code?: string
    quantity: number
    unit: string
    unitPrice: number
    totalPrice: number
  }>
  userId: number
}
```

#### Exemplo de Uso

```json
{
  "name": "match_products",
  "arguments": {
    "scrapedProducts": [
      {
        "title": "Detergente Líquido 500ml",
        "quantity": 2,
        "unit": "un",
        "unitPrice": 8.5,
        "totalPrice": 17.0
      }
    ],
    "userId": 1
  }
}
```

#### Resposta

```json
{
  "content": [
    {
      "type": "text",
      "text": "Matching concluído!\nProdutos processados: 1\nMatches encontrados: 1\nConfiança média: 95%\nCusto IA: R$ 0.02"
    }
  ]
}
```

### 📂 get_categories

Lista todas as categorias do usuário.

#### Parâmetros

```typescript
{
  userId: number // ID do usuário
}
```

#### Exemplo de Uso

```json
{
  "name": "get_categories",
  "arguments": {
    "userId": 1
  }
}
```

#### Resposta

```json
{
  "content": [
    {
      "type": "text",
      "text": "Categorias disponíveis:\n1. Limpeza (15 produtos)\n2. Higiene (8 produtos)\n3. Alimentação (25 produtos)\n4. Utilidades (12 produtos)"
    }
  ]
}
```

### 📈 get_tracking_stats

Obtém estatísticas de tracking e operações.

#### Parâmetros

```typescript
{
  userId: number;                           // ID do usuário
  period?: "day" | "week" | "month";       // Período (padrão: week)
}
```

#### Exemplo de Uso

```json
{
  "name": "get_tracking_stats",
  "arguments": {
    "userId": 1,
    "period": "month"
  }
}
```

#### Resposta

```json
{
  "content": [
    {
      "type": "text",
      "text": "Estatísticas do último mês:\nOperações realizadas: 45\nProdutos processados: 120\nCusto total IA: R$ 2.50\nTempo médio matching: 3.2s"
    }
  ]
}
```

## 📚 Resources (Recursos)

### 🏠 homebuddy://products

Catálogo completo de produtos do usuário.

#### Exemplo de Acesso

```
Claude, me mostre o recurso homebuddy://products
```

#### Formato dos Dados

```json
{
  "products": [
    {
      "id": 1,
      "name": "Detergente Líquido",
      "category": "Limpeza",
      "price": 8.5,
      "stock": 15,
      "lastUpdated": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 60,
  "lastSync": "2024-01-15T10:30:00Z"
}
```

### 📂 homebuddy://categories

Lista de categorias de produtos.

#### Exemplo de Acesso

```
Claude, me mostre as categorias disponíveis
```

#### Formato dos Dados

```json
{
  "categories": [
    {
      "id": 1,
      "name": "Limpeza",
      "productCount": 15,
      "description": "Produtos de limpeza doméstica"
    }
  ],
  "total": 4
}
```

### 📊 homebuddy://stock

Informações de estoque atual.

#### Exemplo de Acesso

```
Claude, me mostre o status do estoque
```

#### Formato dos Dados

```json
{
  "stock": {
    "totalProducts": 60,
    "lowStock": 5,
    "outOfStock": 2,
    "categories": {
      "Limpeza": { "total": 15, "low": 2, "out": 0 },
      "Higiene": { "total": 8, "low": 1, "out": 1 }
    }
  },
  "lastUpdated": "2024-01-15T10:30:00Z"
}
```

### 📈 homebuddy://tracking

Logs e métricas de tracking.

#### Exemplo de Acesso

```
Claude, me mostre as métricas de tracking
```

#### Formato dos Dados

```json
{
  "tracking": {
    "operations": 45,
    "aiCost": 2.5,
    "avgResponseTime": 3.2,
    "successRate": 98.5,
    "lastWeek": {
      "operations": 12,
      "aiCost": 0.8,
      "avgResponseTime": 2.8
    }
  },
  "lastUpdated": "2024-01-15T10:30:00Z"
}
```

### 🔄 homebuddy://scraping-jobs

Status de jobs de scraping.

#### Exemplo de Acesso

```
Claude, me mostre os jobs de scraping
```

#### Formato dos Dados

```json
{
  "jobs": [
    {
      "id": 456,
      "status": "COMPLETED",
      "url": "https://exemplo.com/nota",
      "productsFound": 8,
      "createdAt": "2024-01-15T10:00:00Z",
      "completedAt": "2024-01-15T10:03:00Z"
    }
  ],
  "active": 0,
  "completed": 1,
  "failed": 0
}
```

## 💬 Prompts (Prompts Contextuais)

### 🔍 product_analysis

Análise inteligente de produtos específicos.

#### Contexto

```
Analise o produto {productName} considerando:
- Preço atual vs mercado
- Padrões de consumo
- Sugestões de otimização
- Comparação com produtos similares
```

#### Exemplo de Uso

```
Claude, use o prompt product_analysis para analisar o produto "Detergente Líquido"
```

### 🛒 shopping_suggestions

Sugestões de compras personalizadas.

#### Contexto

```
Com base no histórico de {userId} e estoque atual:
- Identifique produtos em falta
- Sugira quantidades ideais
- Considere padrões sazonais
- Otimize custos
```

#### Exemplo de Uso

```
Claude, use o prompt shopping_suggestions para me dar recomendações de compra
```

### 🧾 receipt_analysis

Análise de notas fiscais.

#### Contexto

```
Analise a nota fiscal {receiptUrl}:
- Extraia produtos relevantes
- Identifique oportunidades de matching
- Calcule economia potencial
- Sugira categorização
```

#### Exemplo de Uso

```
Claude, use o prompt receipt_analysis para analisar esta nota fiscal
```

### 📊 inventory_optimization

Otimização de estoque.

#### Contexto

```
Otimize o estoque do usuário {userId}:
- Identifique excessos e faltas
- Sugira ajustes de quantidade
- Calcule impacto financeiro
- Proponha cronograma de compras
```

#### Exemplo de Uso

```
Claude, use o prompt inventory_optimization para otimizar meu estoque
```

## 🔒 Segurança e Validação

### Validação de Entrada

Todas as ferramentas validam os parâmetros de entrada usando Zod:

```typescript
const SearchProductsSchema = z.object({
  query: z.string().min(1),
  categoryId: z.number().optional(),
  userId: z.number().positive(),
  limit: z.number().positive().max(100).default(10),
})
```

### Autenticação

Todas as requisições são autenticadas usando token interno:

```typescript
headers: {
  'Authorization': `Bearer ${INTERNAL_TOKEN}`,
  'Content-Type': 'application/json'
}
```

### Rate Limiting

- **Tools**: 100 requests/minuto por usuário
- **Resources**: 200 requests/minuto por usuário
- **Prompts**: 50 requests/minuto por usuário

## 📊 Monitoramento

### Métricas Coletadas

- **Latência**: Tempo de resposta de cada ferramenta
- **Taxa de Sucesso**: Percentual de operações bem-sucedidas
- **Custos IA**: Custo total com APIs de IA
- **Uso por Usuário**: Estatísticas individuais

### Logs

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "info",
  "tool": "search_products",
  "userId": 1,
  "duration": 150,
  "success": true,
  "aiCost": 0.01
}
```

---

**🎉 API do MCP Server documentada completamente!**

Próximo passo: [Exemplos Práticos](./examples.md)
