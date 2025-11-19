# Sistema de Filas - Scraping

Este documento descreve o sistema de filas implementado para o scraping usando BullMQ e NestJS.

## Configuração

### Dependências

- `@nestjs/bull`: Módulo Bull para NestJS
- `bull`: Biblioteca de filas baseada em Redis

### Redis

O sistema requer um servidor Redis. No docker-compose, o Redis já está configurado:

```yaml
redis:
  image: redis:7-alpine
  ports:
    - '6379:6379'
  volumes:
    - redis_data:/data
  networks:
    - home-buddy-network
  restart: always
  healthcheck:
    test: ['CMD', 'redis-cli', 'ping']
    interval: 5s
    retries: 5
    timeout: 3s
```

## Estrutura do Sistema

### 1. Processador de Filas (`scrapping-queue.processor.ts`)

- `handleScraping`: Processa scraping individual
- `handleMultipleScraping`: Processa múltiplos scrapings

### 2. Serviço de Filas (`scrapping-queue.service.ts`)

- Gerenciamento de jobs
- Configurações de retry e backoff
- Estatísticas da fila

### 3. Controller (`scrapping.controller.ts`)

- Endpoints para adicionar jobs à fila
- Consulta de status de jobs
- Gerenciamento da fila

## Endpoints da API

### Scraping Síncrono

```http
GET /scrapping?url=https://example.com
```

### Scraping Assíncrono (Fila)

```http
POST /scrapping/queue
Content-Type: application/json

{
  "url": "https://example.com",
  "userId": "user123"
}
```

### Scraping Múltiplo

```http
POST /scrapping/queue/multiple
Content-Type: application/json

{
  "urls": [
    "https://example.com/1",
    "https://example.com/2"
  ],
  "userId": "user123"
}
```

### Status do Job

```http
GET /scrapping/queue/status/{jobId}
```

### Estatísticas da Fila

```http
GET /scrapping/queue/stats
```

### Gerenciamento da Fila

```http
POST /scrapping/queue/clean    # Limpa jobs completados/falhados
POST /scrapping/queue/pause     # Pausa a fila
POST /scrapping/queue/resume    # Retoma a fila
```

## Configurações de Jobs

### Scraping Individual

- **Tentativas**: 3
- **Backoff**: Exponencial (2s inicial)
- **Limpeza**: 100 jobs completados, 50 falhados

### Scraping Múltiplo

- **Tentativas**: 2
- **Backoff**: Exponencial (5s inicial)
- **Limpeza**: 50 jobs completados, 25 falhados

## Estados dos Jobs

- `waiting`: Aguardando processamento
- `active`: Em processamento
- `completed`: Concluído com sucesso
- `failed`: Falhou
- `delayed`: Agendado para execução posterior

## Monitoramento

### Logs

O sistema registra logs detalhados para:

- Adição de jobs à fila
- Início e conclusão de processamento
- Erros durante o processamento

### Métricas

- Número de jobs em cada estado
- Taxa de sucesso/falha
- Tempo médio de processamento

## Exemplo de Uso

```typescript
// Adicionar job à fila
const response = await fetch('/scrapping/queue', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://www.sefaz.rs.gov.br/nfce/nfce-pesquisa.jsp',
    userId: 'user123',
  }),
});

const { jobId } = await response.json();

// Verificar status
const status = await fetch(`/scrapping/queue/status/${jobId}`);
const jobStatus = await status.json();

console.log(jobStatus.state); // 'completed', 'failed', etc.
```

## Tratamento de Erros

O sistema inclui:

- Retry automático com backoff exponencial
- Logs detalhados de erros
- Limpeza automática de jobs antigos
- Configurações de timeout

## Variáveis de Ambiente

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
```
