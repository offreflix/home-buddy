# Deploy com Docker

Guia completo para deploy do Home Buddy usando Docker e Docker Compose, incluindo configuração de ambiente, build de imagens e execução em produção.

## Visão Geral

O Home Buddy utiliza Docker para containerização de todos os serviços, garantindo consistência entre ambientes de desenvolvimento e produção.

## Arquitetura Docker

```mermaid
graph TB
    subgraph "Docker Compose Stack"
        A[Frontend Container]
        B[Backend Container]
        C[Matcher Container]
        D[PostgreSQL Container]
        E[Redis Container]
    end

    subgraph "External Services"
        F[OpenAI API]
        G[Google OAuth]
    end

    A --> B
    B --> D
    B --> E
    B --> C
    C --> F
    B --> G

    subgraph "Networks"
        H[home-buddy-network]
    end

    A --> H
    B --> H
    C --> H
    D --> H
    E --> H
```

## Estrutura de Containers

### Serviços Principais

| Serviço      | Porta | Imagem Base        | Descrição           |
| ------------ | ----- | ------------------ | ------------------- |
| **frontend** | 3000  | node:20-alpine     | Interface Next.js   |
| **backend**  | 3001  | node:20-alpine     | API NestJS          |
| **matcher**  | 8000  | python:3.11-slim   | Serviço de matching |
| **postgres** | 5432  | postgres:15-alpine | Banco de dados      |
| **redis**    | 6379  | redis:7-alpine     | Cache e filas       |

## Docker Compose

### Configuração Principal

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: apps/frontend
      dockerfile: Dockerfile
    ports:
      - '3000:3000'
    environment:
      - API_BASE_URL=http://backend:3000
    networks:
      - home-buddy-network
    restart: always

  backend:
    build:
      context: apps/backend
      dockerfile: Dockerfile
    ports:
      - '3001:3000'
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/home_buddy
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - JWT_SECRET=your-secret-key
      - NODE_ENV=production
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    command: sh -c "npx prisma migrate deploy && npm run prod"
    networks:
      - home-buddy-network
    restart: always

  matcher:
    build:
      context: apps/matcher
      dockerfile: Dockerfile
    ports:
      - '8000:8000'
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - BACKEND_BASE_URL=http://backend:3000
      - INTERNAL_TOKEN=${INTERNAL_TOKEN}
    networks:
      - home-buddy-network
    restart: always

  postgres:
    image: postgres:15-alpine
    ports:
      - '5432:5432'
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=home_buddy
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - home-buddy-network
    restart: always
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 5s
      retries: 5
      timeout: 3s

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

volumes:
  postgres_data:
  redis_data:

networks:
  home-buddy-network:
    driver: bridge
```

## Dockerfiles

### Frontend Dockerfile

```dockerfile
# apps/frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package.json ./
COPY yarn.lock* ./

# Instalar dependências
RUN npm install --legacy-peer-deps

# Copiar código fonte
COPY . ./

# Configurar variáveis de ambiente
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

# Build da aplicação
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
```

### Backend Dockerfile

```dockerfile
# apps/backend/Dockerfile
FROM node:20-alpine

# Instalar dependências do sistema para Puppeteer
RUN apk add --no-cache \
    chromium \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nss \
    freetype \
    freetype-dev

WORKDIR /app

# Copiar arquivos de dependências
COPY package.json ./
COPY yarn.lock* ./

# Instalar dependências
RUN npm install --legacy-peer-deps

# Copiar código fonte
COPY . ./

# Configurar ambiente
ENV NODE_ENV=production
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium-browser"
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Gerar cliente Prisma
RUN npx prisma generate

# Build da aplicação
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "prod"]
```

### Matcher Dockerfile

```dockerfile
# apps/matcher/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Instalar dependências
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código
COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Variáveis de Ambiente

### Arquivo .env

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/home_buddy

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_ACCESS_SECRET=your-access-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# Internal Communication
INTERNAL_TOKEN=your-internal-service-token

# Frontend
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

# Environment
NODE_ENV=production
```

### Variáveis por Serviço

#### Frontend

```env
NEXT_PUBLIC_API_BASE_URL=http://backend:3000
NEXT_TELEMETRY_DISABLED=1
```

#### Backend

```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/home_buddy
REDIS_HOST=redis
REDIS_PORT=6379
JWT_ACCESS_SECRET=your-access-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NODE_ENV=production
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
```

#### Matcher

```env
OPENAI_API_KEY=sk-your-openai-api-key
BACKEND_BASE_URL=http://backend:3000
INTERNAL_TOKEN=your-internal-service-token
```

## Comandos Docker

### Desenvolvimento

```bash
# Construir todas as imagens
docker-compose build

# Executar em background
docker-compose up -d

# Executar com logs
docker-compose up

# Parar serviços
docker-compose down

# Parar e remover volumes
docker-compose down -v
```

### Produção

```bash
# Build para produção
docker-compose -f docker-compose.prod.yml build

# Deploy em produção
docker-compose -f docker-compose.prod.yml up -d

# Verificar status
docker-compose -f docker-compose.prod.yml ps

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Atualizar serviços
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

## Docker Compose para Produção

### docker-compose.prod.yml

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: apps/frontend
      dockerfile: Dockerfile
      args:
        - NEXT_PUBLIC_API_BASE_URL=https://api.homebuddy.com
    ports:
      - '80:3000'
    environment:
      - NODE_ENV=production
    networks:
      - home-buddy-network
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M

  backend:
    build:
      context: apps/backend
      dockerfile: Dockerfile
    ports:
      - '3000:3000'
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - JWT_ACCESS_SECRET=${JWT_ACCESS_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
      - NODE_ENV=production
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    command: sh -c "npx prisma migrate deploy && npm run prod"
    networks:
      - home-buddy-network
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M

  matcher:
    build:
      context: apps/matcher
      dockerfile: Dockerfile
    ports:
      - '8000:8000'
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - BACKEND_BASE_URL=http://backend:3000
      - INTERNAL_TOKEN=${INTERNAL_TOKEN}
    networks:
      - home-buddy-network
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M

  postgres:
    image: postgres:15-alpine
    ports:
      - '5432:5432'
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    networks:
      - home-buddy-network
    restart: unless-stopped
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U ${POSTGRES_USER}']
      interval: 10s
      retries: 5
      timeout: 5s
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    networks:
      - home-buddy-network
    restart: unless-stopped
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      retries: 5
      timeout: 5s
    deploy:
      resources:
        limits:
          memory: 256M
        reservations:
          memory: 128M

volumes:
  postgres_data:
  redis_data:

networks:
  home-buddy-network:
    driver: bridge
```

## Health Checks

### Configuração de Health Checks

```yaml
# Exemplo de health check para backend
healthcheck:
  test: ['CMD', 'curl', '-f', 'http://localhost:3000/health']
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### Endpoints de Health Check

#### Backend

```http
GET /health
```

#### Matcher

```http
GET /health
```

#### Frontend

```http
GET /api/health
```

## Volumes e Persistência

### Volumes Configurados

```yaml
volumes:
  postgres_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /var/lib/docker/volumes/home-buddy-postgres

  redis_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /var/lib/docker/volumes/home-buddy-redis
```

### Backup de Dados

```bash
# Backup do PostgreSQL
docker-compose exec postgres pg_dump -U postgres home_buddy > backup.sql

# Restore do PostgreSQL
docker-compose exec -T postgres psql -U postgres home_buddy < backup.sql

# Backup do Redis
docker-compose exec redis redis-cli BGSAVE
docker cp $(docker-compose ps -q redis):/data/dump.rdb ./redis-backup.rdb
```

## Rede Docker

### Configuração de Rede

```yaml
networks:
  home-buddy-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

### Comunicação Entre Serviços

```bash
# Frontend -> Backend
http://backend:3000

# Backend -> Matcher
http://matcher:8000

# Backend -> PostgreSQL
postgresql://postgres:postgres@postgres:5432/home_buddy

# Backend -> Redis
redis://redis:6379
```

## Logs e Monitoramento

### Visualização de Logs

```bash
# Logs de todos os serviços
docker-compose logs -f

# Logs de um serviço específico
docker-compose logs -f backend

# Logs com timestamp
docker-compose logs -f -t

# Últimas 100 linhas
docker-compose logs --tail=100
```

### Configuração de Logs

```yaml
# docker-compose.yml
services:
  backend:
    logging:
      driver: 'json-file'
      options:
        max-size: '10m'
        max-file: '3'
```

## Troubleshooting

### Problemas Comuns

#### 1. Container não inicia

```bash
# Verificar logs
docker-compose logs service-name

# Verificar status
docker-compose ps

# Reiniciar serviço
docker-compose restart service-name
```

#### 2. Problemas de conectividade

```bash
# Verificar rede
docker network ls
docker network inspect home-buddy-network

# Testar conectividade
docker-compose exec backend ping matcher
```

#### 3. Problemas de volume

```bash
# Verificar volumes
docker volume ls
docker volume inspect home-buddy_postgres_data

# Limpar volumes
docker-compose down -v
```

#### 4. Problemas de build

```bash
# Rebuild sem cache
docker-compose build --no-cache

# Rebuild específico
docker-compose build --no-cache backend
```

### Comandos Úteis

```bash
# Entrar no container
docker-compose exec backend sh
docker-compose exec postgres psql -U postgres

# Verificar recursos
docker stats

# Limpar sistema
docker system prune -a

# Verificar imagens
docker images
```

## Segurança

### Configurações de Segurança

```yaml
# docker-compose.prod.yml
services:
  postgres:
    environment:
      - POSTGRES_PASSWORD_FILE=/run/secrets/postgres_password
    secrets:
      - postgres_password

secrets:
  postgres_password:
    file: ./secrets/postgres_password.txt
```

### Boas Práticas

1. **Não expor portas desnecessárias** em produção
2. **Usar secrets** para senhas e tokens
3. **Configurar limites de recursos**
4. **Usar imagens oficiais** sempre que possível
5. **Manter imagens atualizadas**
6. **Configurar health checks**
7. **Usar redes isoladas**

## CI/CD com Docker

### GitHub Actions

```yaml
# .github/workflows/docker.yml
name: Docker Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build images
        run: |
          docker-compose build

      - name: Run tests
        run: |
          docker-compose up -d
          docker-compose exec backend npm test

      - name: Deploy
        run: |
          docker-compose -f docker-compose.prod.yml up -d
```

## Próximos Passos

### Melhorias Futuras

1. **Multi-stage builds** para otimizar tamanho das imagens
2. **Docker Swarm** para orquestração
3. **Kubernetes** para escalabilidade
4. **Registry privado** para imagens
5. **Monitoramento avançado** com Prometheus/Grafana
6. **Backup automatizado** com cron jobs
7. **SSL/TLS** com Let's Encrypt
8. **Load balancer** com Nginx
