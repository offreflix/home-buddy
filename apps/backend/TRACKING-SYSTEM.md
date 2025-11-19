# Sistema de Tracking de Operações

## Visão Geral

O sistema de tracking permite monitorar e rastrear todas as operações realizadas no sistema, incluindo:

- **Scraping**: Extração de dados de NFCs
- **Matching**: Comparação de produtos com a base do usuário
- **LLM**: Chamadas para modelos de linguagem (OpenAI)

## Estrutura do Banco de Dados

### OperationLog

Tabela principal que registra cada operação:

- `jobId`: ID único do job (Bull Queue)
- `userId`: ID do usuário que iniciou a operação
- `operationType`: SCRAPING_ONLY | SCRAPING_MATCHING | MATCHING_ONLY
- `status`: RUNNING | COMPLETED | FAILED | CANCELLED
- `startTime`, `endTime`, `duration`: Controle temporal
- `errorMessage`: Mensagem de erro se falhou
- `metadata`: Dados extras específicos da operação

### ScrapingLog

Detalhes específicos do scraping:

- `url`: URL que foi processada
- `inputData`: Dados de entrada (URL, parâmetros)
- `outputData`: Produtos extraídos
- `httpStatus`: Status HTTP da resposta
- `responseTime`: Tempo de resposta em ms
- `errorDetails`: Detalhes específicos de erro

### MatchingLog

Detalhes específicos do matching:

- `inputProducts`: Produtos enviados para matching
- `matcherRequest`: Request completo enviado ao matcher
- `matcherResponse`: Response completo do matcher
- `matchCount`: Número de matches encontrados
- `unmatchCount`: Número de produtos sem match
- `responseTime`: Tempo de resposta em ms
- `errorDetails`: Detalhes específicos de erro

### LLMLog

Detalhes específicos das chamadas à LLM:

- `provider`: openai, claude, etc
- `model`: gpt-4o-mini, etc
- `prompt`: Prompt enviado
- `response`: Resposta recebida
- `promptTokens`, `responseTokens`, `totalTokens`: Contadores de tokens
- `cost`: Custo estimado em USD
- `temperature`: Temperatura usada
- `responseTime`: Tempo de resposta em ms
- `errorDetails`: Detalhes específicos de erro

## Endpoints da API

### GET /tracking/operations

Lista operações com filtros:

- `operationType`: Filtro por tipo de operação
- `status`: Filtro por status
- `startDate`, `endDate`: Filtro por período
- `limit`, `offset`: Paginação

### GET /tracking/operations/:jobId

Busca uma operação específica por Job ID.

### GET /tracking/stats

Estatísticas gerais de operações dos últimos 30 dias (configurável).

### GET /tracking/llm-costs

Estatísticas específicas de custos da LLM.

### GET /tracking/running

Operações atualmente em execução.

### GET /tracking/failed

Últimas operações que falharam.

## Exemplos de Uso

### Consultar operações recentes

```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3000/tracking/operations?limit=10"
```

### Consultar custos da LLM

```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3000/tracking/llm-costs?days=7"
```

### Consultar operação específica

```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3000/tracking/operations/12345"
```

## Benefícios

1. **Rastreabilidade Completa**: Cada operação é registrada com todos os detalhes
2. **Análise de Performance**: Tempos de resposta e gargalos identificados
3. **Controle de Custos**: Monitoramento preciso de gastos com LLM
4. **Debugging**: Histórico completo para investigação de problemas
5. **Auditoria**: Log completo de todas as ações realizadas
6. **Otimização**: Dados para melhorar prompts e reduzir custos

## Fluxo de Tracking

1. **Início da Operação**: Cria `OperationLog` com status RUNNING
2. **Scraping**: Cria `ScrapingLog` com dados de entrada/saída
3. **Matching**: Cria `MatchingLog` com request/response do matcher
4. **LLM**: Cria `LLMLog` com prompt, resposta, tokens e custo
5. **Finalização**: Atualiza `OperationLog` para COMPLETED ou FAILED

## Configuração

O sistema é automaticamente integrado quando uma operação é executada através das filas Bull. Não requer configuração adicional além da conexão com o banco de dados.

## Monitoramento

Use os endpoints da API para criar dashboards e alertas:

- Operações falhando frequentemente
- Custos da LLM acima do esperado
- Tempos de resposta elevados
- Volume de operações por período
