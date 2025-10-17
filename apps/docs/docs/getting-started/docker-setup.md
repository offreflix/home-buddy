---
id: docker-setup
title: Setup com Docker
sidebar_position: 3
description: Configure o Home Buddy usando Docker para desenvolvimento e produção
keywords: [docker, containerização, desenvolvimento, produção, home buddy]
---

# 🐳 Setup com Docker

Configure o Home Buddy usando Docker para um ambiente de desenvolvimento consistente e deploy simplificado.

## 📋 Pré-requisitos

- **Docker** (versão 20.10 ou superior)
- **Docker Compose** (versão 2.0 ou superior)
- **Git**

### Verificando Instalações

```bash
docker --version
docker-compose --version
```

## 🚀 Instalação Rápida

### 1. Clone e Configure

```bash
git clone https://github.com/home-buddy/home-buddy-monorepo.git
cd home-buddy-monorepo
```

### 2. Configuração de Ambiente

```bash
# Copiar arquivos de exemplo
cp .env.example .env
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local
```

### 3. Iniciar Serviços

```bash
# Iniciar todos os serviços
docker-compose up -d

# Verificar status
docker-compose ps
```

## 🏗️ Arquitetura Docker

### Serviços Incluídos

- **postgres**: Banco de dados PostgreSQL
- **redis**: Cache e filas Redis
- **backend**: API NestJS
- **frontend**: Interface Next.js
- **matcher**: Serviço Python/FastAPI
- **docs**: Documentação Docusaurus

### Estrutura de Containers

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: home_buddy
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data

  backend:
    build: ./apps/backend
    ports:
      - '3001:3001'
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/home_buddy
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./apps/frontend
    ports:
      - '3000:3000'
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3001
    depends_on:
      - backend

  matcher:
    build: ./apps/matcher
    ports:
      - '8000:8000'
    depends_on:
      - postgres

  docs:
    build: ./apps/docs
    ports:
      - '3002:3000'
```

## 🔧 Configuração Detalhada

### Dockerfile do Backend

```dockerfile
# apps/backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./
COPY yarn.lock ./

# Instalar dependências
RUN yarn install --frozen-lockfile

# Copiar código fonte
COPY . .

# Build da aplicação
RUN yarn build

# Expor porta
EXPOSE 3001

# Comando de inicialização
CMD ["yarn", "start:prod"]
```

### Dockerfile do Frontend

```dockerfile
# apps/frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./
COPY yarn.lock ./

# Instalar dependências
RUN yarn install --frozen-lockfile

# Copiar código fonte
COPY . .

# Build da aplicação
RUN yarn build

# Expor porta
EXPOSE 3000

# Comando de inicialização
CMD ["yarn", "start"]
```

### Dockerfile do Matcher

```dockerfile
# apps/matcher/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements
COPY requirements.txt .

# Instalar dependências Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 8000

# Comando de inicialização
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🚀 Comandos Úteis

### Desenvolvimento

```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs em tempo real
docker-compose logs -f

# Parar todos os serviços
docker-compose down

# Reiniciar um serviço específico
docker-compose restart backend

# Rebuild de um serviço
docker-compose up --build backend
```

### Produção

```bash
# Build para produção
docker-compose -f docker-compose.prod.yml build

# Deploy em produção
docker-compose -f docker-compose.prod.yml up -d

# Backup do banco
docker-compose exec postgres pg_dump -U postgres home_buddy > backup.sql

# Restore do banco
docker-compose exec -T postgres psql -U postgres home_buddy < backup.sql
```

### Manutenção

```bash
# Limpar containers parados
docker-compose down --remove-orphans

# Limpar volumes não utilizados
docker volume prune

# Limpar imagens não utilizadas
docker image prune

# Verificar uso de recursos
docker stats
```

## 🔍 Debugging

### Acessar Container

```bash
# Acessar backend
docker-compose exec backend sh

# Acessar banco de dados
docker-compose exec postgres psql -U postgres home_buddy

# Acessar Redis
docker-compose exec redis redis-cli
```

### Logs Específicos

```bash
# Logs do backend
docker-compose logs backend

# Logs com timestamp
docker-compose logs -t backend

# Últimas 100 linhas
docker-compose logs --tail=100 backend
```

### Inspeção de Container

```bash
# Informações do container
docker-compose exec backend env

# Processos rodando
docker-compose exec backend ps aux

# Espaço em disco
docker-compose exec backend df -h
```

## 📊 Monitoramento

### Health Checks

```yaml
# Adicionar health checks
services:
  backend:
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:3001/health']
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### Métricas

```bash
# Uso de recursos
docker stats

# Informações detalhadas
docker system df

# Espaço usado por volume
docker volume ls
```

## 🚨 Troubleshooting

### Problemas Comuns

#### Container Não Inicia

```bash
# Verificar logs
docker-compose logs [service-name]

# Verificar configuração
docker-compose config

# Rebuild completo
docker-compose down
docker-compose up --build
```

#### Problemas de Rede

```bash
# Verificar redes
docker network ls

# Inspecionar rede
docker network inspect home-buddy-monorepo_default
```

#### Problemas de Volume

```bash
# Verificar volumes
docker volume ls

# Inspecionar volume
docker volume inspect home-buddy-monorepo_postgres_data
```

#### Problemas de Porta

```bash
# Verificar portas em uso
netstat -tulpn | grep :3000
netstat -tulpn | grep :3001

# Liberar porta
sudo lsof -ti:3000 | xargs kill -9
```

## 🔄 CI/CD com Docker

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

      - name: Build Docker images
        run: docker-compose build

      - name: Run tests
        run: docker-compose run backend yarn test

      - name: Deploy to production
        run: |
          docker-compose -f docker-compose.prod.yml up -d
```

## 📚 Próximos Passos

1. **[Deploy](/docs/deployment/docker)** - Configure deploy em produção
2. **[Monitoramento](/docs/deployment/monitoring)** - Configure monitoramento
3. **[Arquitetura](/docs/architecture/overview)** - Entenda a estrutura

## 🆘 Precisa de Ajuda?

- **GitHub Issues**: [Reportar problemas](https://github.com/home-buddy/home-buddy-monorepo/issues)
- **Discord**: [Comunidade](https://discord.gg/home-buddy)
- **Email**: [suporte@homebuddy.com](mailto:suporte@homebuddy.com)
