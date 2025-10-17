# Home Buddy MCP Server

Servidor Model Context Protocol (MCP) para integração do Home Buddy com modelos de IA como Claude.

## 🚀 Funcionalidades

### Tools (Ferramentas)

- **search_products**: Busca produtos no catálogo
- **get_product_details**: Obtém detalhes de produtos específicos
- **update_stock**: Atualiza estoque de produtos
- **scrape_receipt**: Inicia scraping de notas fiscais
- **match_products**: Executa matching inteligente com IA
- **get_categories**: Lista categorias de produtos
- **get_tracking_stats**: Obtém estatísticas de tracking

### Resources (Recursos)

- **homebuddy://products**: Catálogo completo de produtos
- **homebuddy://categories**: Lista de categorias
- **homebuddy://stock**: Informações de estoque
- **homebuddy://tracking**: Logs e métricas de tracking
- **homebuddy://scraping-jobs**: Status de jobs de scraping

### Prompts (Prompts Contextuais)

- **product_analysis**: Análise inteligente de produtos
- **shopping_suggestions**: Sugestões de compras personalizadas
- **receipt_analysis**: Análise de notas fiscais
- **inventory_optimization**: Otimização de estoque

## 📦 Instalação

```bash
cd apps/mcp-server
yarn install
yarn build
```

## ⚙️ Configuração

1. Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

2. Configure as variáveis de ambiente:

```env
BACKEND_URL=http://localhost:3000
MATCHER_URL=http://localhost:8000
INTERNAL_TOKEN=your-secure-token
OPENAI_API_KEY=sk-your-key
```

## 🚀 Execução

### Desenvolvimento

```bash
yarn dev
```

### Produção

```bash
yarn start
```

## 🔌 Integração com Claude

### Via Claude Desktop

Adicione ao arquivo de configuração do Claude Desktop:

```json
{
  "mcpServers": {
    "home-buddy": {
      "command": "node",
      "args": ["/path/to/home-buddy-monorepo/apps/mcp-server/dist/index.js"],
      "env": {
        "BACKEND_URL": "http://localhost:3000",
        "MATCHER_URL": "http://localhost:8000",
        "INTERNAL_TOKEN": "your-token"
      }
    }
  }
}
```

### Via API

```bash
# Teste de conectividade
curl -X POST http://localhost:3000/mcp/test \
  -H "Content-Type: application/json" \
  -d '{"method": "tools/list"}'
```

## 🛡️ Segurança

- Autenticação via token interno
- Validação de entrada com Zod
- Timeout configurável para requests
- Logs detalhados para auditoria

## 📊 Monitoramento

O servidor MCP integra com o sistema de tracking existente:

- Logs de todas as operações
- Métricas de performance
- Custos de IA (quando aplicável)

## 🧪 Testes

```bash
yarn test
```

## 📚 Documentação

- [Especificação MCP](https://modelcontextprotocol.info/)
- [SDK TypeScript](https://github.com/modelcontextprotocol/typescript-sdk)
- [Exemplos de Implementação](https://github.com/modelcontextprotocol/servers)
