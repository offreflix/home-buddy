---
id: installation
title: Instalação
sidebar_position: 1
description: Como instalar e configurar o Home Buddy localmente
keywords: [instalação, setup, desenvolvimento, home buddy]
---

# 📦 Instalação do Home Buddy

Este guia te ajudará a instalar e configurar o Home Buddy em sua máquina local para desenvolvimento.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **Yarn** (versão 1.22 ou superior)
- **Docker** e **Docker Compose**
- **Git**
- **PostgreSQL** (versão 13 ou superior)
- **Redis** (versão 6 ou superior)

### Verificando as Instalações

```bash
# Verificar versões
node --version
yarn --version
docker --version
docker-compose --version
git --version
```

## 🚀 Instalação Rápida

### 1. Clone o Repositório

```bash
git clone https://github.com/home-buddy/home-buddy-monorepo.git
cd home-buddy-monorepo
```

### 2. Instale as Dependências

```bash
# Instalar dependências do monorepo
yarn install

# Instalar dependências específicas de cada app
yarn workspace docs install
yarn workspace frontend install
yarn workspace backend install
```

### 3. Configuração do Ambiente

Crie os arquivos de ambiente necessários:

```bash
# Backend
cp apps/backend/.env.example apps/backend/.env

# Frontend
cp apps/frontend/.env.example apps/frontend/.env.local
```

### 4. Configuração do Banco de Dados

```bash
# Iniciar PostgreSQL e Redis com Docker
docker-compose up -d postgres redis

# Executar migrações
cd apps/backend
yarn prisma migrate dev
yarn prisma generate
```

### 5. Iniciar os Serviços

```bash
# Voltar para a raiz do projeto
cd ../..

# Iniciar todos os serviços em desenvolvimento
yarn dev
```

## 🔧 Configuração Detalhada

### Variáveis de Ambiente

#### Backend (`apps/backend/.env`)

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/home_buddy"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-jwt-secret-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# API Keys
SUPABASE_URL="your-supabase-url"
SUPABASE_ANON_KEY="your-supabase-anon-key"
```

#### Frontend (`apps/frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id"
```

### Configuração do Banco de Dados

1. **Criar banco de dados**:

   ```sql
   CREATE DATABASE home_buddy;
   ```

2. **Executar migrações**:

   ```bash
   cd apps/backend
   yarn prisma migrate dev
   ```

3. **Popular com dados de exemplo**:
   ```bash
   yarn prisma db seed
   ```

## 🐳 Instalação com Docker

Para uma instalação mais simples, use Docker Compose:

```bash
# Iniciar todos os serviços
docker-compose up -d

# Verificar logs
docker-compose logs -f
```

## ✅ Verificação da Instalação

Após a instalação, verifique se tudo está funcionando:

### 1. Backend (Porta 3001)

```bash
curl http://localhost:3001/health
```

### 2. Frontend (Porta 3000)

Acesse: http://localhost:3000

### 3. Documentação (Porta 3002)

Acesse: http://localhost:3002

### 4. Matcher (Porta 8000)

```bash
curl http://localhost:8000/health
```

## 🚨 Solução de Problemas

### Problemas Comuns

#### Erro de Conexão com Banco

```bash
# Verificar se PostgreSQL está rodando
docker ps | grep postgres

# Reiniciar serviço
docker-compose restart postgres
```

#### Erro de Dependências

```bash
# Limpar cache do Yarn
yarn cache clean

# Reinstalar dependências
rm -rf node_modules
yarn install
```

#### Problemas de Porta

```bash
# Verificar portas em uso
netstat -tulpn | grep :3000
netstat -tulpn | grep :3001
```

## 📚 Próximos Passos

Após a instalação bem-sucedida:

1. **[Setup de Desenvolvimento](/docs/getting-started/development-setup)** - Configure seu ambiente de desenvolvimento
2. **[Arquitetura](/docs/architecture/overview)** - Entenda a estrutura do sistema
3. **[API Reference](/docs/backend/api-reference)** - Explore a documentação da API

## 🆘 Precisa de Ajuda?

- **GitHub Issues**: [Reportar problemas](https://github.com/home-buddy/home-buddy-monorepo/issues)
- **Discord**: [Comunidade](https://discord.gg/home-buddy)
- **Email**: [suporte@homebuddy.com](mailto:suporte@homebuddy.com)
