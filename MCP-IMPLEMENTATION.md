# 🚀 Implementação do Model Context Protocol (MCP) no Home Buddy

## 📋 Visão Geral

Este documento detalha a implementação completa do **Model Context Protocol (MCP)** no projeto Home Buddy, permitindo integração nativa com modelos de IA como Claude.

## 🏗️ Arquitetura Implementada

```mermaid
graph TB
    A[Claude Desktop] --> B[MCP Client]
    B --> C[MCP Server - Home Buddy]
    C --> D[Backend NestJS]
    C --> E[Matcher Service]
    C --> F[PostgreSQL]
    C --> G[Redis Cache]

    subgraph "MCP Server Components"
        H[Tools Provider]
        I[Resources Provider]
        J[Prompts Provider]
        K[API Client]
    end

    C --> H
    C --> I
    C --> J
    C --> K
```

## 🎯 Funcionalidades Implementadas

### Tools (Ferramentas)

- ✅ **search_products**: Busca produtos no catálogo
- ✅ **get_product_details**: Obtém detalhes de produtos específicos
- ✅ **update_stock**: Atualiza estoque de produtos
- ✅ **scrape_receipt**: Inicia scraping de notas fiscais
- ✅ **match_products**: Executa matching inteligente com IA
- ✅ **get_categories**: Lista categorias de produtos
- ✅ **get_tracking_stats**: Obtém estatísticas de tracking

### Resources (Recursos)

- ✅ **homebuddy://products**: Catálogo completo de produtos
- ✅ **homebuddy://categories**: Lista de categorias
- ✅ **homebuddy://stock**: Informações de estoque
- ✅ **homebuddy://tracking**: Logs e métricas de tracking
- ✅ **homebuddy://scraping-jobs**: Status de jobs de scraping

### Prompts (Prompts Contextuais)

- ✅ **product_analysis**: Análise inteligente de produtos
- ✅ **shopping_suggestions**: Sugestões de compras personalizadas
- ✅ **receipt_analysis**: Análise de notas fiscais
- ✅ **inventory_optimization**: Otimização de estoque

## 📦 Estrutura do Projeto

```
apps/mcp-server/
├── src/
│   ├── index.ts                 # Servidor MCP principal
│   ├── config.ts                # Configurações
│   ├── providers/
│   │   ├── tools.ts            # Provider de ferramentas
│   │   ├── resources.ts         # Provider de recursos
│   │   └── prompts.ts          # Provider de prompts
│   └── clients/
│       ├── api.ts              # Cliente API
│       └── index.ts            # Exports
├── package.json                # Dependências
├── tsconfig.json              # Configuração TypeScript
├── Dockerfile                 # Containerização
├── README.md                  # Documentação
└── examples/
    └── claude-usage.md        # Exemplos de uso
```

## 🚀 Instalação e Configuração

### 1. Instalar Dependências

```bash
cd apps/mcp-server
yarn install
```

### 2. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
BACKEND_URL=http://localhost:3000
MATCHER_URL=http://localhost:8000
INTERNAL_TOKEN=your-secure-internal-token
OPENAI_API_KEY=sk-your-openai-key
REDIS_URL=redis://localhost:6379
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/home_buddy
```

### 3. Build e Execução

```bash
# Desenvolvimento
yarn dev

# Produção
yarn build
yarn start
```

### 4. Docker

```bash
# Build da imagem
docker build -t home-buddy-mcp .

# Execução
docker run -p 3001:3001 --env-file .env home-buddy-mcp
```

## 🔌 Integração com Claude Desktop

### Configuração

Adicione ao arquivo de configuração do Claude Desktop (`~/Library/Application Support/Claude/claude_desktop_config.json` no macOS):

```json
{
  "mcpServers": {
    "home-buddy": {
      "command": "node",
      "args": ["/path/to/home-buddy-monorepo/apps/mcp-server/dist/index.js"],
      "env": {
        "BACKEND_URL": "http://localhost:3000",
        "MATCHER_URL": "http://localhost:8000",
        "INTERNAL_TOKEN": "your-secure-token",
        "OPENAI_API_KEY": "sk-your-key"
      }
    }
  }
}
```

### Teste de Conectividade

```bash
# Verificar se o servidor está rodando
curl -X POST http://localhost:3001/health

# Testar listagem de ferramentas
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}' | \
  curl -X POST http://localhost:3001 -H "Content-Type: application/json" -d @-
```

## 🎨 Exemplos de Uso

### 1. Buscar Produtos

```
Claude, busque produtos de "limpeza" no meu catálogo
```

### 2. Análise de Estoque

```
Analise meu estoque atual e me dê sugestões de compras
```

### 3. Scraping de Nota Fiscal

```
Faça scraping desta nota fiscal: https://exemplo.com/nota
```

### 4. Matching Inteligente

```
Compare estes produtos extraídos com meu catálogo:
- Arroz Branco 5kg
- Feijão Preto 1kg
- Azeite Extra Virgem 500ml
```

## 🛡️ Segurança

### Medidas Implementadas

1. **Autenticação por Token**: Uso de token interno para comunicação entre serviços
2. **Validação de Entrada**: Validação rigorosa com Zod schemas
3. **Timeouts**: Timeouts configuráveis para evitar travamentos
4. **Logs de Auditoria**: Logs detalhados de todas as operações
5. **Controle de Acesso**: Validação de userId em todas as operações

### Configurações de Segurança

```typescript
// Timeouts configuráveis
backendClient: 30000ms
matcherClient: 60000ms

// Validação obrigatória
userId: required em todas as operações
internalToken: obrigatório para comunicação
```

## 📊 Monitoramento

### Métricas Disponíveis

- **Operações por minuto**: Volume de requests MCP
- **Tempo de resposta**: Latência das operações
- **Taxa de erro**: Percentual de falhas
- **Uso de recursos**: CPU, memória, rede
- **Custos de IA**: Tracking de custos OpenAI

### Logs Estruturados

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "info",
  "service": "mcp-server",
  "operation": "search_products",
  "userId": 123,
  "duration": 150,
  "status": "success"
}
```

## 🧪 Testes

### Testes Unitários

```bash
yarn test
```

### Testes de Integração

```bash
# Teste de conectividade
yarn test:integration

# Teste de ferramentas
yarn test:tools
```

### Testes de Carga

```bash
# Simular múltiplas conexões Claude
yarn test:load
```

## 🚀 Deploy

### Docker Compose

O servidor MCP já está integrado ao `docker-compose.yml`:

```yaml
mcp-server:
  build:
    context: apps/mcp-server
    dockerfile: Dockerfile
  ports:
    - '3002:3001'
  environment:
    - BACKEND_URL=http://backend:3000
    - MATCHER_URL=http://matcher:8000
    - INTERNAL_TOKEN=${INTERNAL_TOKEN}
  depends_on:
    - backend
    - matcher
```

### Produção

```bash
# Build completo
docker-compose up --build

# Apenas MCP Server
docker-compose up mcp-server --build
```

## 🔄 Próximos Passos

### Melhorias Futuras

1. **Cache Inteligente**: Implementar cache Redis para otimizar performance
2. **Rate Limiting**: Controle de taxa de requests por usuário
3. **Webhooks**: Notificações em tempo real para operações longas
4. **Métricas Avançadas**: Dashboard de monitoramento
5. **Suporte a Múltiplos LLMs**: Integração com outros modelos além do Claude

### Extensões Planejadas

- **Integração com WhatsApp**: Bot para comandos via mensagem
- **Assistente de Voz**: Comandos por voz
- **Notificações Push**: Alertas inteligentes
- **Relatórios Automáticos**: Relatórios semanais/mensais

## 📚 Recursos Adicionais

- [Especificação MCP](https://modelcontextprotocol.info/)
- [SDK TypeScript](https://github.com/modelcontextprotocol/typescript-sdk)
- [Exemplos de Implementação](https://github.com/modelcontextprotocol/servers)
- [Documentação Claude Desktop](https://claude.ai/desktop)

## 🤝 Contribuição

Para contribuir com melhorias no MCP:

1. Fork o repositório
2. Crie uma branch para sua feature
3. Implemente testes
4. Documente as mudanças
5. Abra um Pull Request

---

**Implementação concluída com sucesso!** 🎉

O Home Buddy agora possui integração completa com o Model Context Protocol, permitindo que Claude e outros LLMs acessem diretamente seus dados e funcionalidades de forma segura e padronizada.
